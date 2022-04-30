import randomColor from "randomcolor";
import React, { useEffect, useRef, useState } from "react";
import { Scatter } from "react-chartjs-2";
import { makeURL } from "./config.js";
import { pSBC } from "./RGBmodifier";

type RankType = "trio" | "arena";

type RankData = {
    player: string;
    rank: number;
    rank_type: string;
    rank_name: string;
};

async function retrieveData() {
    const res = await fetch(makeURL("/rank/" + rankType));
    const j = await res.json();
    return j as RankData[];
}

function updateData(j: RankData[]) {
    const obj: Record<
        string,
        {
            x: number;
            y: number;
        }[]
    > = {};
    for (const row of rankData) {
        if (row.rank_type === rankType) {
            if (!(row.player in obj)) {
                obj[row.player] = [];
            }
            const time = Date.parse(row.time);
            obj[row.player].push({
                x: time,
                y: row.rank,
            });
        }
    }

    // 現在の日付でプロットを作成(ランクは1つ前と同じ)
    for (const player in obj) {
        obj[player].sort((a, b) => a.x - b.x);
        obj[player].push({
            x: new Date().getTime(),
            y: obj[player].slice(-1)[0].y,
        });
    }

    const data: {
        label: string;
        data: {
            x: number;
            y: number;
        }[];
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

function makeRGBA(r: number, g: number, b: number, a: number): string {
    return `rgba(${r},${g},${b},${a})`;
}

function makeTrioColor(rank: number): string {
    const alpha = 0.3;
    if (rank < 1200) {
        // bronze
        return makeRGBA(80, 59, 14, alpha);
    } else if (rank < 2800) {
        // silver
        return makeRGBA(167, 167, 162, alpha);
    } else if (rank < 4800) {
        // gold
        return makeRGBA(234, 212, 170, alpha);
    } else {
        // platinum
        return makeRGBA(133, 198, 234, alpha);
    }
}

function makeArenaColor(rank: number): string {
    const alpha = 0.3;
    if (rank < 1600) {
        // bronze
        return makeRGBA(80, 59, 14, alpha);
    } else if (rank < 3200) {
        // silver
        return makeRGBA(167, 167, 162, alpha);
    } else if (rank < 4800) {
        // gold
        return makeRGBA(234, 212, 170, alpha);
    } else {
        // platinum
        return makeRGBA(133, 198, 234, alpha);
    }
}

function drawBackground(target: any, ctx: any, type: RankType) {
    // console.log(target);
    const yScale = target.scales["y"];
    const xScale = target.scales["xAxis"];

    let areas = [];
    switch (type) {
        case "trio":
            areas = [
                [0, 1200, makeTrioColor(800)],
                [1200, 2800, makeTrioColor(1400)],
                [2800, 4800, makeTrioColor(3000)],
                [4800, 8000, makeTrioColor(5000)],
            ];
            break;
        case "arena":
            areas = [
                [0, 1600, makeArenaColor(800)],
                [1600, 3200, makeArenaColor(1800)],
                [3200, 4800, makeArenaColor(3400)],
                [4800, 8000, makeArenaColor(5000)],
            ];
            break;
    }

    for (const area of areas) {
        const left = xScale.left;
        const width = xScale.width;
        let adjust = 0;
        let top = yScale.getPixelForValue(area[1]);
        if (top < yScale.top) {
            top = yScale.top;
            adjust++;
        } else if (top > yScale.bottom) {
            continue;
        }
        let bottom = yScale.getPixelForValue(area[0]);
        if (bottom > yScale.bottom) {
            bottom = yScale.bottom;
            adjust++;
        } else if (bottom < yScale.top) {
            continue;
        }

        if (adjust >= 2) {
            continue;
        }

        const height = bottom - top;

        ctx.fillStyle = area[2];
        ctx.fillRect(left, top, width, height);
    }
}

export function Rank(props: {}) {
    const [rankType, setRankType] = useState<RankType>("trio");
    const [data, setData] = useState<RankData[]>([]);

    useEffect(() => {
        retrieveData().then((d) => setData(d));
    }, []);

    const chartData = updateData(data);

    const options = {
        responsive: true,
        showLine: true,
        scales: {
            xAxis: {
                ticks: {
                    callback: function (value, index, values) {
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

    const chartRef = useRef(null);

    const plugins = [
        {
            beforeDraw: (target) => drawBackground(target, null, rankType),
        },
    ];

    console.log(chartRef.current);

    return (
        <div>
            <select
                value={rankType}
                onChange={(ev) => setRankType(ev.target.value as RankType)}
            >
                <option value="trio">Trio</option>
                <option value="arena">Arena</option>
            </select>
            <Scatter
                data={{ datasets: chartData }}
                options={options}
                plugins={plugins as any}
                ref={chartRef}
            />
        </div>
    );
}
