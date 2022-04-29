import randomColor from "randomcolor";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Scatter } from "react-chartjs-2";
import { makeURL } from "./config";
import { pSBC } from "./RGBmodifier";
import React from "react";

type LevelDataType = {
    player: string;
    time: string;
    level: number;
};

function createChartData(levelData: LevelDataType[]) {
    const obj: Record<
        string,
        {
            x: number;
            y: number;
        }[]
    > = {};
    for (const row of levelData) {
        if (!(row.player in obj)) {
            obj[row.player] = [];
        }
        const time = Date.parse(row.time);
        obj[row.player].push({
            x: time,
            y: row.level,
        });
    }

    // 現在の日付でプロットを作成(レベルは1つ前と同じ)
    for (const player in obj) {
        obj[player].sort((a, b) => a.x - b.x);
        obj[player].push({
            x: new Date().getTime(),
            y: obj[player].slice(-1)[0].y,
        });
    }

    const data: {
        label: string;
        data: { x: number; y: number }[];
        backgroundColor: (context: any) => string;
    }[] = [];
    for (const k in obj) {
        const color = randomColor();
        data.push({
            label: k,
            data: obj[k],
            backgroundColor: (context) => {
                let index = context.dataIndex;
                let lastIndex = context.dataset.data.length - 1;
                if (index === lastIndex) {
                    return color;
                } else {
                    // 50%濃くする
                    return pSBC(0.5, color);
                }
            },
        });
    }

    return data;
}

export function Level(props: {}) {
    const [levelData, setLevelData] = useState<LevelDataType[]>([]);
    useEffect(() => {
        fetch(makeURL("/level"))
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                setLevelData(json);
            });
    }, []);

    const chartData = useMemo(() => {
        return createChartData(levelData);
    }, [levelData]);

    const options = useMemo(() => {
        return {
            responsive: true,
            showLine: true,
            scales: {
                xAxis: {
                    ticks: {
                        callback: function (
                            value: any,
                            index: any,
                            values: any
                        ) {
                            //return moment(value).format("YY/MM/DD HH[時]");
                            const date = new Date(value);
                            return `${date.getUTCFullYear()}/${(
                                date.getUTCMonth() + 1
                            )
                                .toString()
                                .padStart(2, "0")}/${date
                                .getDate()
                                .toString()
                                .padStart(2, "0")}`;
                        },
                    },
                },
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context: any) => {
                            const date = new Date(context.parsed.x);
                            const dateString = `${date.getUTCFullYear()}/${(
                                date.getUTCMonth() + 1
                            )
                                .toString()
                                .padStart(2, "0")}/${date
                                .getDate()
                                .toString()
                                .padStart(2, "0")} ${date
                                .getHours()
                                .toString()
                                .padStart(2, "0")}:${date
                                .getMinutes()
                                .toString()
                                .padStart(2, "0")}`;
                            return `(${dateString}, ${context.parsed.y})`;
                        },
                    },
                },
                zoom: {
                    zoom: {
                        drag: {
                            enabled: true,
                            threshold: 5,
                        },
                        mode: "x",
                    },
                },
            },
        };
    }, []);

    const chartRef = useRef(null);

    const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const setCursorPosition = useCallback((x: number, y: number) => {
        console.log(x, y);
        setCursorPos({
            x: x,
            y: y,
        });
    }, []);

    const onMouseUp = useCallback(
        (x: number, y: number) => {
            if (
                Math.abs(cursorPos.x - x) < 15 &&
                Math.abs(cursorPos.y - y) < 15
            ) {
                if (chartRef) {
                    chartRef.current.resetZoom();
                }
            }
        },
        [cursorPos]
    );

    useEffect(() => {
        if (chartRef) {
            const canvas = chartRef.current.canvas;
            if (!canvas) return;
            const mouseDown = (ev: MouseEvent) => {
                setCursorPosition(ev.screenX, ev.screenY);
            };
            const mouseUp = (ev: MouseEvent) => {
                onMouseUp(ev.screenX, ev.screenY);
            };
            canvas.addEventListener("mousedown", mouseDown);
            canvas.addEventListener("mouseup", mouseUp);
            return () => {
                canvas.removeEventListener("mousedown", mouseDown);
                canvas.removeEventListener("mouseup", mouseUp);
            };
        }
    }, [chartRef, onMouseUp, setCursorPosition]);

    return (
        <div>
            <Scatter
                data={{ datasets: chartData }}
                // @ts-ignore
                options={options}
                ref={chartRef}
            />
        </div>
    );
}
