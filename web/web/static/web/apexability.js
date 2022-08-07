import { makeURL } from './config.js';

let data = null;
const tbody = document.querySelector('#apexabilityBody');
const canvas = document.querySelector('#monthChart');
const viewTypeSelector = document.querySelector('#viewTypeSelector');
const dateSelector = document.querySelector('#dateSelector');
let chart = null;

function makeTr(entry) {
  const tr = document.createElement('tr');

  const tdName = document.createElement('td');
  tdName.textContent = entry.player;

  const tdGame = document.createElement('td');
  tdGame.textContent = entry.game_name ?? "?";

  const tdType = document.createElement('td');
  if (entry.entry_type === 'start') {
    tdType.textContent = 'Start';
    tdType.classList.add("is-start");
  } else {
    tdType.textContent = 'Stop';
    tdType.classList.add("is-stop");
  }

  const tdTime = document.createElement('td');
  const parsedTime = new Date(entry.time);
  tdTime.textContent = parsedTime.getFullYear().toString() + '-' + (parsedTime.getMonth() + 1).toString().padStart(2, '0') + '-' + parsedTime.getDate().toString().padStart(2, '0') + ' ' + parsedTime.getHours().toString().padStart(2, '0') + ':' + parsedTime.getMinutes().toString().padStart(2, '0');

  tr.appendChild(tdName);
  tr.appendChild(tdGame);
  tr.appendChild(tdType);
  tr.appendChild(tdTime);
  return tr;
}

function limitEntry(entries, n) {
  const out = [];
  for (let i = 0; i < entries.length && i < n; i++) {
    out.push(entries[i]);
  }
  return out;
}

async function retrieveData() {
  const res = await fetch(makeURL('/api/view/check'));
  const j = await res.json();
  data = j;
  console.log(j);
}

function updateTable(data) {
  tbody.innerHTML = '';
  for (const entry of limitEntry(data, 20)) {
    const tr = makeTr(entry);
    tbody.appendChild(tr);
  }
}

function getPlayTimePerMonth(dataUnsorted) {
  const data = _.cloneDeep(dataUnsorted);
  data.sort((a, b) => {
    const da = new Date(a.time).getTime();
    const db = new Date(b.time).getTime();
    return da - db;
  });
  const playerLast = new Map(); // Date instance
  const playerPlayedTime = new Map(); // player(str) -> (year*12+month -> playedtime(number))
  let rangeMin = 300000;
  let rangeMax = 0;
  for (const entry of data) {
    const player = entry.player;
    const type = entry.entry_type;
    const time = entry.time;
    switch (type) {
      case 'start':
        playerLast.set(player, new Date(time));
        break;
      case 'stop':
        const last = playerLast.get(player);
        if (last == null) continue; // find stop before start

        const d = new Date(time);
        if (last.getMonth() !== d.getMonth()) {
          // TODO: different month
          continue;
        }

        // calculate difference
        const msDiff = d.getTime() - last.getTime();
        const hourDiff = msDiff / (1000 * 60 * 60);

        // get map
        if (!playerPlayedTime.has(player)) {
          playerPlayedTime.set(player, new Map());
        }
        const m = playerPlayedTime.get(player);

        // add difference
        const key = d.getFullYear() * 12 + d.getMonth();
        let currentHour = 0;
        if (m.has(key)) {
          currentHour = m.get(key);
        }
        m.set(key, currentHour + hourDiff);

        // adjust chart x range
        if (rangeMin > key) {
          rangeMin = key;
        }
        if (rangeMax < key) {
          rangeMax = key;
        }

        break;
    }
  }

  return [playerPlayedTime, rangeMin, rangeMax];
}

function drawPlayTimeChart(playTime, xMin, xMax) {
  const labels = [];
  for (let i = xMin; i <= xMax; i++) {
    const year = Math.floor(i / 12);
    const month = (i % 12) + 1;
    labels.push(year + '-' + month);
  }

  const datasets = [];
  for (const [player, m] of playTime.entries()) {
    const label = player;
    const data = [];
    const backgroundColor = [];
    const color = randomColor();
    for (let i = xMin; i <= xMax; i++) {
      const hours = m.get(i);
      if (hours == null) {
        data.push(0);
      } else {
        data.push(hours);
      }
      backgroundColor.push(color);
    }
    datasets.push({
      label,
      data,
      backgroundColor,
    });
  }

  const ctx = canvas.getContext('2d');
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets,
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function rangeOfDate(dateObject) {
  const start = new Date(dateObject);
  start.setHours(start.getHours() + 6);
  const end = new Date(start);
  end.setHours(start.getHours() + 24);
  return [start, end];
}

function findDataInRange(data, start, end) {
  const inRange = [];
  for (const entry of data) {
    const time = new Date(entry.time).getTime();
    if (start.getTime() <= time && time < end.getTime()) {
      inRange.push(entry);
    }
  }
  return inRange;
}

function extractListOfPlayers(data) {
  const players = new Set();
  for (const entry of data) {
    players.add(entry.player);
  }
  const list = [];
  players.forEach((p) => list.push(p));
  return list;
}

async function updateDailyView(date) {
  if (data === null) {
    await retrieveData();
  }

  if (date === "") {
    return;
  }

  const dateSplit = date.split("-").map((s) => Number.parseInt(s));
  const dateObject = new Date(0);
  dateObject.setFullYear(dateSplit[0]);
  dateObject.setMonth(dateSplit[1] - 1);
  dateObject.setDate(dateSplit[2]);
  dateObject.setHours(0);
  dateObject.setMinutes(0);
  dateObject.setSeconds(0);
  dateObject.setMilliseconds(0);

  const [start, end] = rangeOfDate(dateObject);
  console.log('start', start);
  console.log('end', end);

  const dataInDate = findDataInRange(data, start, end);
  console.log('data', dataInDate);

  const players = extractListOfPlayers(data);
  console.log('players', players);

  const [canvas, ctx] = createCanvasForDailyView();
  drawCanvasForDailyView(canvas, ctx, start, end, dataInDate, players);
}

function createCanvasForDailyView() {
  const canvas = document.createElement('canvas');
  canvas.classList.add('daily-canvas');
  const ctx = canvas.getContext('2d');

  const targetDiv = document.querySelector('#dailyCanvasTarget');
  targetDiv.innerHTML = '';
  canvas.width = targetDiv.clientWidth;
  targetDiv.appendChild(canvas);
  return [canvas, ctx];
}

function drawCanvasForDailyView(canvas, ctx, start, end, data, players) {
  const lineHeightPerPlayer = 50;
  const width = canvas.width;
  const height = (players.length + 2) * lineHeightPerPlayer;
  canvas.height = height;
  const rightMargin = 30;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const playerNameWidth = width / 20;
  const playerHeightMap = new Map();
  for (let i = 0; i < players.length; i++) {
    const x = 10;
    const y = lineHeightPerPlayer * (i + 1);
    ctx.font = '15px serif';
    ctx.fillStyle = 'black';
    ctx.fillText(players[i], x, y, playerNameWidth);
    playerHeightMap.set(players[i], y);
  }

  const timelineHeight = (players.length + 1) * lineHeightPerPlayer;
  const startX = playerNameWidth;
  const endX = width - rightMargin;

  ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.moveTo(startX, timelineHeight);
  ctx.lineTo(endX, timelineHeight);
  ctx.stroke();

  const pointList = new Map();
  players.forEach((p) => pointList.set(p, []));
  for (const entry of data) {
    const y = playerHeightMap.get(entry.player);
    const time = new Date(entry.time).getTime();
    const timeRate = (time - start.getTime()) / (end.getTime() - start.getTime());
    const x = startX * (1 - timeRate) + endX * timeRate;
    pointList.get(entry.player).push({
      x: x, y: y, type: entry.entry_type
    });
  }
  console.log(pointList);

  const lineList = [];
  for (const [p, points] of pointList) {
    points.sort((a, b) => a.x - b.x);
    let lineStartX = startX;
    for (const point of points) {
      switch (point.type) {
        case 'start':
          lineStartX = point.x;
          break;
        case 'stop':
          if (lineStartX !== null) {
            lineList.push({
              x1: lineStartX,
              y: point.y,
              x2: point.x,
            });
            lineStartX = null;
          }
          break;
      }
    }
  }
  console.log(lineList);

  ctx.strokeStyle = 'red';
  for (const line of lineList) {
    ctx.beginPath();
    ctx.moveTo(line.x1, line.y);
    ctx.lineTo(line.x2, line.y);
    ctx.stroke();
  }

  const verticalLineDate = new Date(start);
  ctx.strokeStyle = 'gray';
  ctx.font = '10px serif';
  let lastDate = -1;
  while (verticalLineDate.getTime() <= end.getTime()) {
    const timeRate = (verticalLineDate.getTime() - start.getTime()) / (end.getTime() - start.getTime());
    const x = startX * (1 - timeRate) + endX * timeRate;
    const y1 = 0;
    const y2 = timelineHeight;
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
    let headText = "";
    if (lastDate !== verticalLineDate.getDate()) {
      headText = `${verticalLineDate.getMonth() + 1}/${verticalLineDate.getDate()} `;
      lastDate = verticalLineDate.getDate();
    }
    ctx.fillText(`${headText}${verticalLineDate.getHours().toString().padStart(2, "0")}h`, x, y2);

    verticalLineDate.setHours(verticalLineDate.getHours() + 1);
  }
}

async function updateViewType() {
  const viewType = viewTypeSelector.value;
  const swapables = document.querySelectorAll('.swapable');
  swapables.forEach((swap) => {
    if (swap.getAttribute("x-view") === viewType) {
      swap.classList.add("active");
    } else {
      swap.classList.remove("active");
    }
  });
  switch (viewType) {
    case 'overview':
      await updateOverview();
      break;
    case 'daily':
      if (chart !== null) {
        chart.destroy();
        chart = null;
      }
      const date = dateSelector.value;
      await updateDailyView(date);
      break;
  }
  return viewType;
}

async function updateOverview() {
  await retrieveData();
  updateTable(data);
  const [playTime, xMin, xMax] = getPlayTimePerMonth(data);
  drawPlayTimeChart(playTime, xMin, xMax);
}

window.addEventListener('load', async () => {
  await updateViewType();
});

viewTypeSelector.addEventListener('change', async (ev) => {
  await updateViewType();
});

dateSelector.addEventListener('change', async (ev) => {
  const date = ev.target.value;
  await updateDailyView(date);
});

document.querySelector('#dateTodayButton').addEventListener('click', async () => {
  const date = new Date();
  dateSelector.value = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  await updateDailyView(dateSelector.value);
});
