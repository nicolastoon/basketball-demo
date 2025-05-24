import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

async function loadData() {
    const response = await fetch('https://raw.githubusercontent.com/eclipse-analytics-dev/basketball-demo/refs/heads/main/RaptorsVHornets.json');
    const data = await response.json();
    return data;
}

const data = await loadData();
console.log(data);
const events = data.events

const svg = d3.select('#animation')
    .append('svg')
    .attr('id', 'court')
    .attr('width', 1000)
    .attr('height', 550);

// add thin border around svg
svg.append('rect')
    .attr('fill', 'crimson')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('stroke-width', 1)
    .attr('stroke', 'black')

function placeCourtLines() {
    const x_offset = 30
    const y_offset = 25
    const courtWidth = 940
    const courtHeight = 500

    // Court bounds
    svg.append('rect')
        .attr('x', x_offset)
        .attr('y', y_offset)
        .attr('width', courtWidth)
        .attr('height', courtHeight)
        .attr('stroke', 'black')
        .attr('stroke-width', 4)
        .attr('fill', 'tan');

    // Half court line
    svg.append('line')
        .attr('x1', courtWidth / 2 + x_offset)
        .attr('x2', courtWidth / 2 + x_offset)
        .attr('y1', y_offset)
        .attr('y2', courtHeight + y_offset)
        .attr('stroke', 'black')
        .attr('stroke-width', 1);

    // Center circle
    svg.append('circle')
        .attr('r', 60)
        .attr('cx', courtWidth / 2 + x_offset)
        .attr('cy', courtHeight / 2 + y_offset)
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('fill', 'none');

    svg.append('image')
        .attr('href', 'img/raptors-logo.png')
        .attr('width', 300)
        .attr('height', 300)
        .attr('x', courtWidth / 2 + x_offset- 150)
        .attr('y', courtHeight / 2 + y_offset - 150);

    // Paint (keys)
    [2, courtWidth - 192].forEach(x => {
        svg.append('rect')
            .attr('x', x + x_offset)
            .attr('y', (courtHeight - 160) / 2 + y_offset)
            .attr('width', 190)
            .attr('height', 160)
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('fill', 'crimson');
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

    // Three-point arcs
    function drawArcOnly(cx, cy, r, startAngle, endAngle, steps = 100) {
    const arcPoints = d3.range(startAngle, endAngle, (endAngle - startAngle) / steps)
        .map(a => [cx + r * Math.cos(a), cy + r * Math.sin(a)]);

    svg.append("path")
        .attr("d", d3.line()(arcPoints))
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("fill", "none");
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
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

placeCourtLines();

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

let eventIndex = 0;
let momentIndex = 0;

let playerXY = []
const n_players = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
n_players.forEach((n) => {
    playerXY[n] = {teamId: null, x: 0, y: 0};
});
const players = svg.append('g')
    .attr('id', 'players');
players.selectAll('rect')
    .data(playerXY)
    .enter()
    .append('rect')
    .attr('width', 10)
    .attr('height', 30)
    .attr('x', (d) => d['x'])
    .attr('y', (d) => d['y'])
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('fill', 'gray');

const ball = svg.append('circle')
    .attr('id', 'ball')
    .attr('r', 4)
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .attr('fill', 'orange');

const interval = setInterval(() => {
    const event = events[eventIndex];
    const moment = event.moments[momentIndex];
    const raptorsId = event['home']['teamid'];

    if (!moment) {
        eventIndex++;
        momentIndex = 0;

        if (eventIndex >= events.length) {
            clearInterval(interval); // end of data
            return;
        }

        return;
    }

    // Extract info from current moment
    const qtr = moment[0];
    const gameClock = formatTime(moment[2]);
    const shotClock = Math.floor(moment[3]);
    const ballX = moment[5][0][2] * 10;
    const ballY = moment[5][0][3] * 10;
    n_players.forEach((n) => {
        playerXY[n]['teamId'] = moment[5][n + 1][0];
        playerXY[n]['x'] = moment[5][n + 1][2] * 10;
        playerXY[n]['y'] = moment[5][n + 1][3] * 10;
    });

    // debugger;
    
    players.selectAll('rect')
        .data(playerXY)
        .transition()
        .duration(40)
        .attr('fill', (d) => d['teamId'] === raptorsId ? 'darkred' : 'steelblue')
        .attr('x', (d) => d['x'])
        .attr('y', (d) => d['y']);

    // Move the ball
    ball.transition()
        .duration(40)
        .attr('cx', ballX)
        .attr('cy', ballY);

    // Update clock displays
    d3.select('#qtr').text(qtr);
    d3.select('#game-time').text(gameClock);
    d3.select('#shot-clock').text(shotClock);

    momentIndex++;
}, 40);