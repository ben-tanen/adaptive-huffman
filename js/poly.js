function new_circ_node(px, py, k, v, t, d) {
    var r = 15;

    var c = svg.append("circle")
        .classed("node", true)
        .classed("circ", true)
        .attr("cx", px)
        .attr("cy", py)
        .attr("r", r)
        .attr("px", px)
        .attr("py", py);

    var text = svg.append("text")
        .attr("class", "node-text")
        .attr("x", px - 0.5)
        .attr("y", py + 3.5)
        .attr("px", px)
        .attr("py", py)
        .text(t);

    c.on("mouseover", function(d) {
        tooltip.html("key: " + k + "<br />val: " + v);
        tooltip.transition().style("opacity", 1);

    }).on("mouseout", function(d) {
        tooltip.transition().style("opacity", 0);
    });

    text.on("mouseover", c.on("mouseover"));

    return [c, text];
}

function new_rect_node(px, py, k, v, t) {
    var width  = 25,
        height = 25;

    var r = svg.append("rect")
        .classed("node", true)
        .classed("rect", true)
        .attr("x",  px - 12.5)
        .attr("y",  py - 12.5)
        .attr("px", px)
        .attr("py", py)
        .attr("width", width)
        .attr("height", height);

    var text = svg.append("text")
        .attr("class", "node-text")
        .attr("x",  px)
        .attr("y",  py + 3)
        .attr("px", px)
        .attr("py", py)
        .text(t);

    r.on("mouseover", function(d) {
        tooltip.html("key: " + k + "<br />val: " + v);
        tooltip.transition().style("opacity", 1);

    }).on("mouseout", function(d) {
        tooltip.transition().style("opacity", 0);
    });

    text.on("mouseover", r.on("mouseover"));

    return [r, text];
}

function connect_p2c(p, c) {
    var x1 = parseInt(p.attr("px")),
        y1 = parseInt(p.attr("py")) + (p.classed("circ") ? 15 : 12.5),
        x4 = parseInt(c.attr("px")),
        y4 = parseInt(c.attr("py")) - (c.classed("circ") ? 15 : 12.5);

    var x2 = x1 + (x4 - x1) / 6,
        y2 = y1 + (y4 - y1) / 6 * 2,
        x3 = x1 + (x4 - x1) / 6 * 5,
        y3 = y1 + (y4 - y1) / 6 * 4;

    var line = d3.line().curve(d3.curveCardinal);
    var path = line([[x1, y1], [x2, y2], [x3, y3], [x4, y4]]);
    var p = svg.append('path')
        .classed('edge', true)
        .attr('d', path)
        .style("stroke", "black")
        .style("fill", "none");

    return p;
}

function move_node(id, ix, dx, dy, d) {
    // find edges
    var e1 = svg.selectAll('.edge').filter(function() {
        var i = d3.select(this).attr('id').split('-');
        return i[0] === id && parseInt(i[2]) == ix;
    }).transition().delay(d).attr("d", function() {
        var bbox = this.getBBox();
        var pp1 = d3.select(this).attr('d').split(/(?=[LMC])/)[0],
            pp1 = parseInt(pp1.replace("M","").split(",")[0]);

        if (pp1 == bbox['x']) {
            var [x1, y1] = [bbox['x'], bbox['y']],
                [x4, y4] = [bbox['x'] + bbox['width'] + dx, bbox['y'] + bbox['height'] + dy];
        } else {
            var [x1, y1] = [bbox['x'] + bbox['width'], bbox['y']],
                [x4, y4] = [bbox['x'] + dx, bbox['y'] + bbox['height'] + dy];
        }

        var x2 = x1 + (x4 - x1) / 6,
            y2 = y1 + (y4 - y1) / 6 * 2,
            x3 = x1 + (x4 - x1) / 6 * 5,
            y3 = y1 + (y4 - y1) / 6 * 4;

        var line = d3.line().curve(d3.curveCardinal);
        return line([[x1, y1], [x2, y2], [x3, y3], [x4, y4]]);;
    });

    var e2 = svg.selectAll('.edge').filter(function() {
        var i = d3.select(this).attr('id').split('-');
        return i[0] === id && parseInt(i[1]) == ix;
    }).transition().delay(d).attr("d", function() {
        var bbox = this.getBBox();
        var pp1 = d3.select(this).attr('d').split(/(?=[LMC])/)[0],
            pp1 = parseInt(pp1.replace("M","").split(",")[0]);

        if (pp1 == bbox['x']) {
            var [x1, y1] = [bbox['x'] + dx, bbox['y'] + dy],
                [x4, y4] = [bbox['x'] + bbox['width'], bbox['y'] + bbox['height']];
        } else {
            var [x1, y1] = [bbox['x'] + dx + bbox['width'], bbox['y'] + dy],
                [x4, y4] = [bbox['x'], bbox['y'] + bbox['height']];
        }

        var x2 = x1 + (x4 - x1) / 6,
            y2 = y1 + (y4 - y1) / 6 * 2,
            x3 = x1 + (x4 - x1) / 6 * 5,
            y3 = y1 + (y4 - y1) / 6 * 4;

        var line = d3.line().curve(d3.curveCardinal);
        return line([[x1, y1], [x2, y2], [x3, y3], [x4, y4]]);;
    });

    // move node and text
    var n = svg.select('.node#' + id + '-' + ix);
    var t = svg.select('.node-text#' + id + '-' + ix);

    n.transition().delay(d)
        .attr("px", parseInt(n.attr("px")) + dx)
        .attr("py", parseInt(n.attr("py")) + dy);

    if (n.classed("circ")) {
        n.transition().delay(d)
            .attr("cx", parseInt(n.attr("cx")) + dx)
            .attr("cy", parseInt(n.attr("cy")) + dy);
    } else {
        n.transition().delay(d)
            .attr("x", parseInt(n.attr("x")) + dx)
            .attr("y", parseInt(n.attr("y")) + dy);
    }

    t.transition().delay(d)
        .attr("x",  parseInt(t.attr("x")) + dx)
        .attr("y",  parseInt(t.attr("y")) + dy)
        .attr("px", parseInt(t.attr("px")) + dx)
        .attr("py", parseInt(t.attr("py")) + dy);
}

function move_subtree(id, ns, dx, dy, d) {
    svg.selectAll('.node.circ').filter(function() {
        var i = d3.select(this).attr('id').split('-');
        return i[0] === id && ns.indexOf(parseInt(i[1])) >= 0;
    }).transition().delay(d)
        .attr("cx", function() { return parseInt(d3.select(this).attr("cx")) + dx })
        .attr("cy", function() { return parseInt(d3.select(this).attr("cy")) + dy })
        .attr("px", function() { return parseInt(d3.select(this).attr("px")) + dx })
        .attr("py", function() { return parseInt(d3.select(this).attr("py")) + dy });

    svg.selectAll('.node.rect').filter(function() {
        var i = d3.select(this).attr('id').split('-');
        return i[0] === id && ns.indexOf(parseInt(i[1])) >= 0;
    }).transition().delay(d)
        .attr("x", function() { return parseInt(d3.select(this).attr("x")) + dx })
        .attr("y", function() { return parseInt(d3.select(this).attr("y")) + dy })
        .attr("px", function() { return parseInt(d3.select(this).attr("px")) + dx })
        .attr("py", function() { return parseInt(d3.select(this).attr("py")) + dy });

    svg.selectAll('.node-text').filter(function() {
        var i = d3.select(this).attr('id').split('-');
        return i[0] === id && ns.indexOf(parseInt(i[1])) >= 0;
    }).transition().delay(d)
        .attr("x", function() { return parseInt(d3.select(this).attr("x")) + dx })
        .attr("y", function() { return parseInt(d3.select(this).attr("y")) + dy });

    svg.selectAll('.edge').filter(function() {
        var i = d3.select(this).attr('id').split('-');
        return i[0] === id && ns.indexOf(parseInt(i[2])) > 0;
    }).transition().delay(d)
        .attr("transform", function() {
            var str = d3.select(this).attr('transform');
            if (str) {
                var [x, y] = str.replace("translate(","").replace(")","").split(",");
                return "translate(" + (parseInt(x) + dx) + "," + (parseInt(y) + dy) + ")";
            } else {
                return "translate(" + dx + "," + dy + ")";
            }
        })
}

function swap_subtrees(id, ns1, ns2, d) {
    var r1 = svg.select('.node#' + id + '-' + ns1[0]),
        r2 = svg.select('.node#' + id + '-' + ns2[0]);

    var dx = parseInt(r1.attr("px")) - parseInt(r2.attr("px")),
        dy = parseInt(r1.attr("py")) - parseInt(r2.attr("py"));

    move_subtree(id, ns1, -dx, -dy, d);
    move_subtree(id, ns2,  dx,  dy, d);
}

function horz_offset(h, p, g, m) {
    var o = 0;
    for (var i = 0; i < p.length; i++) {
        o = o + g * Math.pow(m, h - i - 2) * (p[i] === "0" ? -1 : 1);
    }
    return o;
}

function vert_offset(p, g) {
    return p.length * g;
}

function test() {
    var [x_min, y_min] = [width, height],
        [x_max, y_max] = [0, 0];

    svg.selectAll('.node').filter(function() { 
        return d3.select(this).attr('id').indexOf('fgk') >= 0;
    }).each(function() {
        var bbox = this.getBBox();
        x_min = Math.min(x_min, bbox['x']),
        y_min = Math.min(y_min, bbox['y']),
        x_max = Math.max(x_max, bbox['x'] + bbox['width']),
        y_max = Math.max(y_max, bbox['y'] + bbox['height']);
    });

    // center
    var dx = (width  / 2) - (x_min + (x_max - x_min) / 2),
        dy = (height / 2) - (y_min + (y_max - y_min) / 2);

    console.log(dx, dy);

    /*
    svg.append("rect")
        .attr("x", x_min + dx)
        .attr("y", y_min + dy)
        .attr("width",  x_max - x_min)
        .attr("height", y_max - y_min)
        .style("fill", "none")
        .style("stroke", "black");
    */
}

function test2() {
    swap_subtrees('basic', [3, 6, 7],[9,10,11], 0);
    move_node('basic', 3, 100, 0, 250);
}

