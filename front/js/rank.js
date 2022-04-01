import { makeURL } from "./config.js";

const ctx = document.querySelector('#chart').getContext('2d');
let rankData = [];
let rankType = 'trio';
let chart = null;
let data = [];

async function retrieveData() {
    const res = await fetch(makeURL("/rank/" + rankType));
    const j = await res.json();
    rankData = j;
    console.log(j);
}

function updateData() {
    const obj = {}
    for (const row of rankData) {
        if (row.rank_type === rankType) {
            if (!(row.player in obj)) {
                obj[row.player] = [];
            }
            const time = Date.parse(row.time);
            obj[row.player].push({
                x: time,
                y: row.rank
            });
        }
    }
    data = [];
    for (const k in obj) {
        const color = randomColor();
        data.push({
            label: k,
            data: obj[k],
            backgroundColor: color
        });
    }
    if (chart !== null) {
        chart.data.datasets = data;
    }
}

function makeRGBA(r, g, b, a) {
    return `rgba(${r},${g},${b},${a})`;
}

function makeTrioColor(rank) {
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

function makeArenaColor(rank) {
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

function drawBackground(target, type) {
    // console.log(target);
    const yScale = target.scales['y'];
    const xScale = target.scales['xAxis'];

    let areas = [];
    switch (type) {
        case 'trio':
            areas = [
                [0, 1200, makeTrioColor(800)],
                [1200, 2800, makeTrioColor(1400)],
                [2800, 4800, makeTrioColor(3000)],
                [4800, 8000, makeTrioColor(5000)],
            ];
            break;
        case 'arena':
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

function updateChart() {
    if (chart === null) {
        chart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: data
            },
            options: {
                responsive: true,
                showLine: true,
                scales: {
                    xAxis: {
                        ticks: {
                            callback: function (value, index, values) {
                                //return moment(value).format("YY/MM/DD HH[時]");
                                const date = new Date(value);
                                return `${date.getUTCFullYear()}/${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`
                            }
                        }
                    }
                },
            },
            plugins: [
                {
                    beforeDraw: (target) => drawBackground(target, rankType)
                },
                {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const date = new Date(context.parsed.x);
                                const dateString = `${date.getUTCFullYear()}/${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                                return `(${dateString}, ${context.parsed.y})`;
                            }
                        }
                    }
                }
            ]
        });
    } else {
        chart.update();
    }
}

document.querySelector('#rankTypeSelector').addEventListener('change', async (ev) => {
    rankType = ev.target.value;
    await retrieveData(); // TODO: cache
    updateData();
    updateChart();
});

window.addEventListener('load', async () => {
    await retrieveData();
    updateData();
    updateChart();
});
