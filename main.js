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
    .attr('height', 550)

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
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    // Half court line
    svg.append('line')
        .attr('x1', courtWidth / 2 + x_offset)
        .attr('x2', courtWidth / 2 + x_offset)
        .attr('y1', y_offset)
        .attr('y2', courtHeight + y_offset)
        .attr('stroke', 'black')
        .attr('stroke-width', 2);

    // Center circle
    svg.append('circle')
        .attr('r', 60)
        .attr('cx', courtWidth / 2 + x_offset)
        .attr('cy', courtHeight / 2 + y_offset)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    // Paint (keys)
    [0, courtWidth - 190].forEach(x => {
        svg.append('rect')
            .attr('x', x + x_offset)
            .attr('y', (courtHeight - 140) / 2 + y_offset)
            .attr('width', 190)
            .attr('height', 140)
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('fill', 'red');
    });

    // Free throw circles
    [190, 750].forEach(cx => {
        svg.append('circle')
            .attr('r', 60)
            .attr('cx', cx + x_offset)
            .attr('cy', courtHeight / 2 + y_offset)
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
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
            .attr('stroke-width', 4);
    });

    // Hoops
    [47.5, 892.5].forEach(x => {
        svg.append('circle')
            .attr('r', 7.5)
            .attr('cx', x + x_offset)
            .attr('cy', courtHeight / 2 + y_offset)
            .attr('stroke', 'orange')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
    });

    // Three-point arcs
    [47.5, 892.5].forEach(cx => {
        svg.append('path')
            .attr('d', d3.arc()
                .innerRadius(0)
                .outerRadius(239)
                .startAngle(cx < courtWidth / 2 ? 0 : -Math.PI)
                .endAngle(cx < courtWidth / 2 ? Math.PI : 0)
            ()).attr('transform', `translate(${cx + x_offset}, ${courtHeight / 2 + y_offset})`)
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
    });

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
                .attr('stroke-width', 2);
        });
    });
}

function animateBall() {
    const line = d3.line()
        .x(d => d.x * 10)
        .y(d => d.y * 10)
        .curve(d3.curveLinear); // or use curveBasis for smoothing

    // Flatten all positions into a single array
    const positions = events.flatMap(d => d.moments.map(p => ({
        x: p[5][0][2],
        y: p[5][0][3]
    })));

    const path = svg.append("path")
        .attr("d", line(positions))
        .attr("fill", "none");

    const ball = svg.append('circle')
        .attr('id', 'ball')
        .attr('r', 4)
        .attr('fill', 'orange')

    const totalLength = path.node().getTotalLength();

    ball.transition()
        .duration(7500000)
        .ease(d3.easeLinear)
        .tween("pathTween", function() {
                return function(t) {
                const p = path.node().getPointAtLength(t * totalLength);
                ball.attr("transform", `translate(${p.x}, ${p.y})`);
                };
        });
}

function animatePlayers() {

}

placeCourtLines();
animateBall();