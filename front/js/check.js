const data = JSON.parse(document.querySelector('#apexabilityData').textContent);
const tbody = document.querySelector('#apexabilityBody');
const canvas = document.querySelector('#monthChart');

function makeTr(entry) {
  const tr = document.createElement('tr');
  
  const tdName = document.createElement('td');
  tdName.textContent = entry.player;

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
  tdTime.textContent = parsedTime.getFullYear().toString() + '-' + (parsedTime.getMonth()+1).toString().padStart(2, '0') + '-' + parsedTime.getDate().toString().padStart(2, '0') + ' ' + parsedTime.getHours().toString().padStart(2, '0') + ':' + parsedTime.getMinutes().toString().padStart(2, '0');

  tr.appendChild(tdName);
  tr.appendChild(tdType);
  tr.appendChild(tdTime);
  return tr;
}

function limitEntry(entries, n) {
  const out = [];
  for (let i=0; i<entries.length&&i<n; i++) {
    out.push(entries[i]);
  }
  return out;
}

function updateTable(data) {
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
        const key = d.getFullYear()*12 + d.getMonth();
        let currentHour = 0;
        if (m.has(key)) {
          currentHour = m.get(key);
        }
        m.set(key, currentHour+hourDiff);

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
  for (let i=xMin; i<=xMax; i++) {
    const year = Math.floor(i/12);
    const month = (i%12)+1;
    labels.push(year + '-' + month);
  }

  const datasets = [];
  for (const [player, m] of playTime.entries()) {
    const label = player;
    const data = [];
    const backgroundColor = [];
    const color = randomColor();
    for (let i=xMin; i<=xMax; i++) {
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
  new Chart(ctx, {
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

window.addEventListener('load', () => {
  updateTable(data);
  const [playTime, xMin, xMax] = getPlayTimePerMonth(data);
  drawPlayTimeChart(playTime, xMin, xMax);
});
