import { makeURL } from "./config.js";
import { storageAvailable } from "./util.js";

const ctx = document.querySelector('#chart').getContext('2d');
let chart = null;
let data = [];
let levelData = [];

async function retrieveDataOnline() {
    const res = await fetch(makeURL("/level"));
    const j = await res.json();
    levelData = j;
    console.log('fetched data online');
    saveDataToLocalStorage(levelData);
}

function retrieveDataFromLocalStorage() {
    if (storageAvailable("localStorage")) {
        const data = localStorage.getItem("level");
        if (data !== null) {
            levelData = JSON.parse(data);
            console.log('fetched data from localStorage');
            return true;
        } else {
            console.log('no data available in localStorage');
        }
    }
    return false;
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

    // 現在の日付でプロットを作成(レベルは1つ前と同じ)
    for (const player in obj) {
        obj[player].sort((a, b) => a.x - b.x);
        obj[player].push({
            x: new Date().getTime(),
            y: obj[player].slice(-1)[0].y
        })
    }

    data = [];
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
                    return pSBC(0.5, color)
                }
            }
        });
    }
    if (chart !== null) {
        chart.data.datasets = data;
    }
}

function saveDataToLocalStorage(data) {
    if (storageAvailable("localStorage")) {
        localStorage.setItem('level', JSON.stringify(data));
        console.log('saved level to localStorage');
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
                    },
                    zoom: {
                        zoom: {
                            drag: {
                                enabled: true,
                                threshold: 5,
                            },
                            mode: 'x',
                        }
                    }
                }
            }
        });
    } else {
        chart.update();
    }
}

let curX = 0;
let curY = 0;
function setCursorPosition(event) {
    curX = event.screenX;
    curY = event.screenY;
}

function resetDragZoom(event) {
    if (Math.abs(curX - event.screenX) < 15 && Math.abs(curY - event.screenY) < 15) {
        chart.resetZoom();
    }
}

window.addEventListener('load', async () => {
    let success = false;
    try {
        await retrieveDataOnline();
        success = true;
    } catch (e) {
        success = retrieveDataFromLocalStorage();
    }
    if (success) {
        updateData();
        updateChart();
    } else {
        console.warn('failed to fetch data');
    }
});

const canvas = document.getElementById('chart');
canvas.addEventListener('mousedown', setCursorPosition, false);
canvas.addEventListener('mouseup', resetDragZoom, false);
