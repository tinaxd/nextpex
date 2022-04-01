import { makeURL } from "./config.js";

const ctx = document.querySelector('#chart').getContext('2d');
let chart = null;
let data = [];
let levelData = [];

async function retrieveData() {
    const res = await fetch(makeURL("/level"));
    const j = await res.json();
    levelData = j;
}

function updateData() {
    const obj = {}
    for (const row of levelData) {
        if (!(row.player in obj)) {
            obj[row.player] = [];
        }
        const time = Date.parse(row.time);
        obj[row.player].push({
            x: time,
            y: row.level
        });
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
                plugins: {
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
            }
        });
    } else {
        chart.update();
    }
}

window.addEventListener('load', async () => {
    await retrieveData();
    updateData();
    updateChart();
});
