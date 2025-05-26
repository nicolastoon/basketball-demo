import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

async function loadData() {
    const response = await fetch('https://raw.githubusercontent.com/eclipse-analytics-dev/basketball-demo/refs/heads/main/RaptorsVHornets.json');
    const data = await response.json();
    return data;
}

const data = await loadData();
console.log(data);
const events = data.events;

const svg = d3.select('#animation')
    .append('svg')
    .attr('id', 'court')
    .attr('width', 1000)
    .attr('height', 550);

const x_offset = 30;
const y_offset = 25;
const courtWidth = 940;
const courtHeight = 500;

const raptors = events[0]['home']
const hornets = events[0]['visitor']
const playerMap = [...raptors['players'], ...hornets['players']].reduce((obj, p) => {
    obj[p['playerid']] = p;
    return obj;
}, {});

console.log(playerMap);

function placeCourtLines(svg) {
    // add thin border around svg
    svg.append('rect')
        .attr('id', 'svg-border')
        .attr('fill', 'none')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('stroke-width', 1)
        .attr('stroke', 'black');

    // Court bounds
    svg.append('rect')
        .attr('id', 'court-bounds')
        .attr('x', x_offset)
        .attr('y', y_offset)
        .attr('width', courtWidth)
        .attr('height', courtHeight)
        .attr('stroke', 'black')
        .attr('stroke-width', 4)
        .attr('fill', 'none');

    // Half court line
    svg.append('line')
        .attr('id', 'half-court-line')
        .attr('x1', courtWidth / 2 + x_offset)
        .attr('x2', courtWidth / 2 + x_offset)
        .attr('y1', y_offset)
        .attr('y2', courtHeight + y_offset)
        .attr('stroke', 'black')
        .attr('stroke-width', 1);

    // Center circle
    svg.append('circle')
        .attr('id', 'center-circle')
        .attr('r', 60)
        .attr('cx', courtWidth / 2 + x_offset)
        .attr('cy', courtHeight / 2 + y_offset)
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('fill', 'none');

    // Paint (keys)
    [2, courtWidth - 192].forEach(x => {
        svg.append('rect')
            .attr('id', 'paint')
            .attr('x', x + x_offset)
            .attr('y', (courtHeight - 160) / 2 + y_offset)
            .attr('width', 190)
            .attr('height', 160)
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('fill', 'none');
    });

    // Free throw circles
    [190, 750].forEach(cx => {
        svg.append('circle')
            .attr('r', 60)
            .attr('cx', cx + x_offset)
            .attr('cy', courtHeight / 2 + y_offset)
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('fill', 'none');
    });

    // Three-point arcs
    function drawArcOnly(cx, cy, r, startAngle, endAngle, steps = 100) {
    const arcPoints = d3.range(startAngle, endAngle, (endAngle - startAngle) / steps)
        .map(a => [cx + r * Math.cos(a), cy + r * Math.sin(a)]);

    svg.append('path')
        .attr('d', d3.line()(arcPoints))
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('fill', 'none');
    }
    drawArcOnly(47.5 + x_offset, courtHeight / 2 + y_offset, 239, -2.99 * Math.PI / 8, 3.05 * Math.PI / 8);
    drawArcOnly(892.5 + x_offset, courtHeight / 2 + y_offset, 239, 5.01 * Math.PI / 8, 11.05 * Math.PI / 8);

    // three-point corners
    [0, 800].forEach(x => {
        [30, 470].forEach(y => {
            svg.append('line')
                .attr('id', 'three-point-corner')
                .attr('x1', x + x_offset)
                .attr('x2', x + x_offset + 140)
                .attr('y1', y + y_offset)
                .attr('y2', y + y_offset)
                .attr('stroke', 'black')
                .attr('stroke-width', 1);
        });
    });
};

function additionalTouches(svg){
    // Backboards
    [40, 900].forEach(x => {
        svg.append('line')
            .attr('x1', x + x_offset)
            .attr('x2', x + x_offset)
            .attr('y1', (courtHeight / 2 - 30) + y_offset)
            .attr('y2', (courtHeight / 2 + 30) + y_offset)
            .attr('stroke', 'black')
            .attr('stroke-width', 3);
    });

    // Hoops
    [47.5, 892.5].forEach(x => {
        svg.append('circle')
            .attr('r', 7.5)
            .attr('cx', x + x_offset)
            .attr('cy', courtHeight / 2 + y_offset)
            .attr('stroke', 'orange')
            .attr('stroke-width', 1.5)
            .attr('fill', 'none');
    });

    svg.append('image')
        .attr('href', 'img/raptors-logo.png')
        .attr('width', 300)
        .attr('height', 300)
        .attr('x', courtWidth / 2 + x_offset- 150)
        .attr('y', courtHeight / 2 + y_offset - 150);

    svg.selectAll('rect#svg-border')
        .attr('fill', 'crimson');

    svg.selectAll('rect#court-bounds')
        .attr('fill', 'tan');

    svg.selectAll('rect#paint')
        .attr('fill', 'crimson');
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

function renderTooltip(id) {
    const opponent = document.getElementById('opponent');
    const timeSeen = document.getElementById('time-seen');

    if (Object.entries(closestOpponent[id]).every(d => d[1] === 0)) {
        opponent.textContent = 'None';
        timeSeen.textContent = formatTime(0);
    } else {
        const sortedOpponents = Object.entries(closestOpponent[id]).sort((a, b) => b[1] - a[1]);
        opponent.textContent = `${playerMap[sortedOpponents[0][0]]['firstname']} ${playerMap[sortedOpponents[0][0]]['lastname']}`;
        timeSeen.textContent = formatTime(closestOpponent[id][sortedOpponents[0][0]] / 1000);
    }
}

function updateTooltip(event) {
    const tooltip = document.getElementById('player-tooltip');
    const offset = 20;
    tooltip.style.left = `${event.clientX}px`;
    tooltip.style.top = `${event.clientY - tooltip.offsetHeight - offset}px`;
};

function showTooltip(visible) {
    const tooltip = document.getElementById('player-tooltip');
    tooltip.hidden = !visible;
};

const distance = (x1, y1, x2, y2) => Math.sqrt(((x1 - x2) ** 2) + ((y1 - y2) ** 2));

placeCourtLines(svg);
additionalTouches(svg);

const clock = d3.select('#game-clock')
clock.append('div')
    .attr('id', 'qtr')
    .text('Q1')
clock.append('div')
    .attr('id', 'game-time')
    .text('12:00')
clock.append('div')
    .attr('id', 'shot-clock')
    .text('24')

const teamBox = {'raptors': raptors, 'hornets': hornets}
Object.entries(teamBox).forEach((d) => {
    const box = d3.select(`#${d[0]}-box`)
        
    box.selectAll('tr.player')
        .data(d[1]['players'])
        .enter()
        .append('tr')
        .attr('class', 'player')
        .attr('id', (d) => `player-${d['playerid']}`)
        .html((d) => 
            `
            <td>${d['jersey']}</td>
            <td id='player-name'>${d['firstname']} ${d['lastname']}</td>
            <td id='player-mp'>0:00</td>
            `
        )
        .on('mouseover', (event, d) => {
            renderTooltip(d['playerid']);
            updateTooltip(event);
            showTooltip(true);
        })
        .on('mousemove', (event) => {
            updateTooltip(event);
        })
        .on('mouseout', () => {
            showTooltip(false);
        })
        .on('click', (_, d) => {
            showHeatmaps(d['playerid']);
        });
});

let moments = events.flatMap(d => d.moments);
moments.sort((a, b) => {
    if (a[0] !== b[0]) {
        return a[0] - b[0];
    } else {
        return a[1] - b[1];
    }
});
const seen = new Set();
moments = moments.filter((d) => {
    if (seen.has(d[1])) {
        return false;
    } else {
        seen.add(d[1]);
        return true;
    }
});

console.log(moments);

const raptorsId = events[0]['home']['teamid'];

let playerXY = []
let n_players = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
n_players.forEach((n) => {
    playerXY[n] = {teamId: null, playerId: null, x: 0, y: 0};
});
const players = svg.append('g')
    .attr('id', 'players');
const playerGroups = players.selectAll('g')
    .data(playerXY)
    .enter()
    .append('g');

// Draw rectangles
playerGroups.append('rect')
    .attr('width', 20)
    .attr('height', 20)
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('fill', d => d['teamId'] === raptorsId ? 'white' : 'darkslateblue');

const player_offset = 10;

// Add player ID as text inside rectangle
playerGroups.append('text')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('color', (d) => {return d['teamId'] === raptorsId ? 'black' : 'white'})
    .attr('font-size', 15);

const ball = svg.append('circle')
    .attr('id', 'ball')
    .attr('r', 4)
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .attr('fill', 'orange');

let isRunning = true;
let speed = 1;
const speedSlider = document.getElementById('speed-slider');
const speedLabel = document.getElementById('speed-label');

speedSlider.addEventListener('input', () => {
    speed = parseFloat(speedSlider.value);
    speedLabel.textContent = `${speed}x`;
});

let playing = true;
const pauseButton = document.getElementById('play-pause-btn')
pauseButton.addEventListener('click', () => {
    playing = !playing;
    if (playing) { 
        pauseButton.innerText = '⏸ Pause';
    } else {
        pauseButton.innerText = '▶ Play';
    }
    animate();
});

const playerIds = Object.keys(playerMap);

const playerMP = playerIds.reduce((obj, p) => {
    obj[p] = 0;
    return obj;
}, {});
const closestOpponent = {}

playerIds.forEach((player) => {
    closestOpponent[player] = {};

    playerIds.forEach((other) => {
        if (player !== other) {
            closestOpponent[player][other] = 0;
        }
    });
});

let lastGameClock = null;

const offensePositions = {}
const defensePositions = {}
playerIds.forEach((player) => {
    offensePositions[player] = [];
    defensePositions[player] = [];
});

let momentIndex = 0;
let timeout = null;

function animate() {
    if (!isRunning || momentIndex >= moments.length) return;
    if (!playing) {
        clearTimeout(timeout);
        return;
    }

    const moment = moments[momentIndex];
    const qtr = moment[0];
    const gameClock = moment[2];
    const shotClock = Math.floor(moment[3]);
    const ballX = moment[5][0][2] * 10;
    const ballY = moment[5][0][3] * 10;
    const ballZ = moment[5][0][4];

    let recordTime = ((lastGameClock !== null) && (lastGameClock !== gameClock));

    if (moment[5][0][0] !== -1) { // if ball tracking doesn't exist for that moment
        n_players.forEach((n) => {
            playerXY[n]['teamId'] = moment[5][n][0];
            playerXY[n]['playerId'] = moment[5][n][1];
            playerXY[n]['x'] = moment[5][n][2] * 10 + x_offset;
            playerXY[n]['y'] = moment[5][n][3] * 10 + y_offset - player_offset;
        });
    } else {
        n_players.forEach((n) => {
            playerXY[n]['teamId'] = moment[5][n + 1][0];
            playerXY[n]['playerId'] = moment[5][n + 1][1];
            playerXY[n]['x'] = moment[5][n + 1][2] * 10;
            playerXY[n]['y'] = moment[5][n + 1][3] * 10;
        });
    };

    playerXY.forEach((p) => {
        if (p['teamId'] === raptorsId) { // if player is on the raptors
            if (qtr === 1 || qtr === 2) { // if it is the first half
                if (p['x'] <= 500) { // if they are on the left side of the court
                    offensePositions[p['playerId']].push({x: p['x'], y: p['y']}); // raptors are on offense
                } else {
                    defensePositions[p['playerId']].push({x: -Math.abs(p['x'] - 500) + 500, y: p['y']}); // raptors on defense
                }
            } else { // if it is second half
                if (p['x'] >= 500) { // if they are on the right side of the court
                    offensePositions[p['playerId']].push({x: -Math.abs(p['x'] - 500) + 500, y: p['y']}); // raptors are on offense
                } else {
                    defensePositions[p['playerId']].push({x: p['x'], y: p['y']}); // raptors on defense
                }
            }
        } else { // if player is on the hornets
            if (qtr === 1 || qtr === 2) { // if it is the first half
                if (p['x'] >= 500) { // if they are on the right side of the court
                    offensePositions[p['playerId']].push({x: -Math.abs(p['x'] - 500) + 500, y: p['y']}); // hornets are on offense
                } else {
                    defensePositions[p['playerId']].push({x: p['x'], y: p['y']}); // hornets on defense
                }
            } else { // if it is second half
                if (p['x'] <= 500) { // if they are on the left side of the court
                    offensePositions[p['playerId']].push({x: p['x'], y: p['y']}); // hornets are on offense
                } else {
                    defensePositions[p['playerId']].push({x: -Math.abs(p['x'] - 500) + 500, y: p['y']}); // hornets on defense
                }
            }
        }
    });

    players.selectAll('rect')
        .data(playerXY)
        .transition()
        .duration(40 / speed)
        .attr('fill', (d) => d['teamId'] === raptorsId ? 'white' : 'darkslateblue')
        .attr('fillText', (d) => d['playerId'])
        .attr('x', (d) => d['x'])
        .attr('y', (d) => d['y']);

    players.selectAll('text')
        .data(playerXY)
        .transition()
        .duration(40 / speed)
        .text(d => playerMap[d['playerId']]['jersey'])
        .attr('x', d => d['x'] + x_offset - 20) // center text
        .attr('y', d => d['y'] - player_offset + y_offset - 3)
        .attr('fill', (d) => {return d['teamId'] === raptorsId ? 'black' : 'white'});

    ball.transition()
        .duration(40 / speed)
        .attr('r', ballZ * 0.5 + 2.5)
        .attr('cx', ballX + x_offset)
        .attr('cy', ballY + y_offset);

    d3.select('#qtr').text(`Q${qtr}`);
    d3.select('#game-time').text(formatTime(gameClock));
    d3.select('#shot-clock').text(shotClock);

    if (recordTime) {
        playerXY.forEach((p) => {
            const pid = p['playerId'];
            playerMP[pid] += 40;
            const tableEntry = d3.select(`#player-${pid}`);
            tableEntry.select('#player-mp')
                .text(`${formatTime(playerMP[pid] / 1000)}`);
            
            let closestOppo = null;
            let closestDistance = Infinity;
            playerXY.forEach((other_p) => {
                if (p['teamId'] !== other_p['teamId']) {
                    const d = distance(p['x'], p['y'], other_p['x'], other_p['y']);
                    if (d < closestDistance) {
                        closestDistance = d;
                        closestOppo = other_p['playerId'];
                    }
                }
            });
            closestOpponent[pid][closestOppo] += 40;
        });
    };

    momentIndex++;
    lastGameClock = gameClock;

    // Schedule the next frame
    timeout = setTimeout(animate, 40 / speed);
    console.log('i');
}

function showHeatmaps(pid) {
    const playerName = `${playerMap[pid]['firstname']} ${playerMap[pid]['lastname']}`
    document.getElementById('position-heatmap').innerHTML = 
        `<h3 id="heatmap-title">Where has ${playerName} been on the court?</h3>
        <div id="offense-header">
            <desc>${playerName} on offense</desc>
        </div>
        <div id="defense-header">
            <desc>${playerName} on defense</desc>
        </div>`;

    const oHeatmap = d3.select('#position-heatmap')
        .append('svg')
        .attr('id', 'offensive-heatmap')
        .attr('width', 500)
        .attr('height', 550);

    const dHeatmap = d3.select('#position-heatmap')
        .append('svg')
        .attr('id', 'defensive-heatmap')
        .attr('width', 500)
        .attr('height', 550);

    const offenseData = d3.contourDensity()
        .x(d => d['x'])
        .y(d => d['y'])
        .size([1000, 500])
        .bandwidth(10) // smoothing factor
        (offensePositions[pid]);

    const defenseData = d3.contourDensity()
        .x(d => d['x'])
        .y(d => d['y'])
        .size([1000, 500])
        .bandwidth(10) // smoothing factor
        (defensePositions[pid]);

    const maxOffenseValue = d3.max(offenseData, d => d.value);
    const maxDefenseValue = d3.max(offenseData, d => d.value);

    oHeatmap.selectAll('path')
        .data(offenseData)
        .enter()
        .append('path')
        .attr('id', 'heat')
        .attr('d', d3.geoPath())
        .attr('fill', d => d3.interpolateYlOrRd(d.value / maxOffenseValue))
        .attr('stroke', 'none')
        .attr('opacity', 0.8);

    dHeatmap.selectAll('path')
        .data(defenseData)
        .enter()
        .append('path')
        .attr('id', 'heat')
        .attr('d', d3.geoPath())
        .attr('fill', d => d3.interpolateYlOrRd(d.value / maxDefenseValue))
        .attr('stroke', 'none')
        .attr('opacity', 0.8);

    placeCourtLines(oHeatmap);
    placeCourtLines(dHeatmap);
    oHeatmap.attr('transform', 'rotate(-90)');
    dHeatmap.attr('transform', 'rotate(-90)');
}

// Start animation
animate();