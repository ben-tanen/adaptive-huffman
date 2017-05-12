function new_circ_node(px, py, k, v, t, id) {
    var r = 15;

    var c = svg.append("circle")
        .classed("node", true)
        .classed("circ", true)
        .attr("id", id)
        .attr("cx", px)
        .attr("cy", py)
        .attr("r", r)
        .attr("px", px)
        .attr("py", py);

    var text = svg.append("text")
        .attr("class", "node-text")
        .attr("id", id)
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

function new_rect_node(px, py, k, v, t, id) {
    var width  = 25,
        height = 25;

    var r = svg.append("rect")
        .classed("node", true)
        .classed("rect", true)
        .attr("id", id)
        .attr("x",  px - 12.5)
        .attr("y",  py - 12.5)
        .attr("px", px)
        .attr("py", py)
        .attr("width", width)
        .attr("height", height);

    var text = svg.append("text")
        .attr("class", "node-text")
        .attr("id", id)
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

function connect_p2c(p, c, id) {
    var x1 = parseFloat(p.attr("px")),
        y1 = parseFloat(p.attr("py")) + (p.classed("circ") ? 15 : 12.5),
        x4 = parseFloat(c.attr("px")),
        y4 = parseFloat(c.attr("py")) - (c.classed("circ") ? 15 : 12.5);

    var x2 = x1 + (x4 - x1) / 6,
        y2 = y1 + (y4 - y1) / 6 * 2,
        x3 = x1 + (x4 - x1) / 6 * 5,
        y3 = y1 + (y4 - y1) / 6 * 4;

    var line = d3.line().curve(d3.curveCardinal);
    var path = line([[x1, y1], [x2, y2], [x3, y3], [x4, y4]]);
    var p = svg.append('path')
        .classed('edge', true)
        .attr('id', id)
        .attr('d', path)
        .style("stroke", "black")
        .style("fill", "none");

    return p;
}

function move_node(id, ix, dx, dy) {
    // move node and text
    var n = svg.select('.node#' + id + '-' + ix);
    var t = svg.select('.node-text#' + id + '-' + ix);

    n.attr("px", parseFloat(n.attr("px")) + dx).attr("py", parseFloat(n.attr("py")) + dy);

    if (n.classed("circ")) {
        n.transition()
            .attr("cx", parseFloat(n.attr("cx")) + dx)
            .attr("cy", parseFloat(n.attr("cy")) + dy);
    } else {
        n.transition()
            .attr("x", parseFloat(n.attr("x")) + dx)
            .attr("y", parseFloat(n.attr("y")) + dy);
    }

    t.transition()
        .attr("x",  parseFloat(t.attr("x")) + dx)
        .attr("y",  parseFloat(t.attr("y")) + dy)
        .attr("px", parseFloat(t.attr("px")) + dx)
        .attr("py", parseFloat(t.attr("py")) + dy);
}

function move_node_connected(id, ix, dx, dy) {
    // find edges
    var e1 = svg.selectAll('.edge').filter(function() {
        var i = d3.select(this).attr('id').split('-');
        return i[0] === id && parseInt(i[2]) == ix;
    }).transition().attr("d", function() {
        var bbox = this.getBBox();
        var pp1 = d3.select(this).attr('d').split(/(?=[LMC])/)[0],
            pp1 = parseFloat(pp1.replace("M","").split(",")[0]);

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
    }).transition().attr("d", function() {
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

    n.attr("px", parseInt(n.attr("px")) + dx).attr("py", parseInt(n.attr("py")) + dy);

    if (n.classed("circ")) {
        n.transition()
            .attr("cx", parseInt(n.attr("cx")) + dx)
            .attr("cy", parseInt(n.attr("cy")) + dy);
    } else {
        n.transition()
            .attr("x", parseInt(n.attr("x")) + dx)
            .attr("y", parseInt(n.attr("y")) + dy);
    }

    t.transition()
        .attr("x",  parseInt(t.attr("x")) + dx)
        .attr("y",  parseInt(t.attr("y")) + dy)
        .attr("px", parseInt(t.attr("px")) + dx)
        .attr("py", parseInt(t.attr("py")) + dy);
}

function move_subtree(id, ns, dx, dy) {
    svg.selectAll('.node.circ').filter(function() {
        var i = d3.select(this).attr('id').split('-');
        return i[0] === id && ns.indexOf(parseInt(i[1])) >= 0;
    }).transition()
        .attr("cx", function() { return parseFloat(d3.select(this).attr("cx")) + dx })
        .attr("cy", function() { return parseFloat(d3.select(this).attr("cy")) + dy })
        .attr("px", function() { return parseFloat(d3.select(this).attr("px")) + dx })
        .attr("py", function() { return parseFloat(d3.select(this).attr("py")) + dy });

    svg.selectAll('.node.rect').filter(function() {
        var i = d3.select(this).attr('id').split('-');
        return i[0] === id && ns.indexOf(parseInt(i[1])) >= 0;
    }).transition()
        .attr("x", function() { return parseFloat(d3.select(this).attr("x")) + dx })
        .attr("y", function() { return parseFloat(d3.select(this).attr("y")) + dy })
        .attr("px", function() { return parseFloat(d3.select(this).attr("px")) + dx })
        .attr("py", function() { return parseFloat(d3.select(this).attr("py")) + dy });

    svg.selectAll('.node-text').filter(function() {
        var i = d3.select(this).attr('id').split('-');
        return i[0] === id && ns.indexOf(parseInt(i[1])) >= 0;
    }).transition()
        .attr("x", function() { return parseFloat(d3.select(this).attr("x")) + dx })
        .attr("y", function() { return parseFloat(d3.select(this).attr("y")) + dy });

    svg.selectAll('.edge').filter(function() {
        var i = d3.select(this).attr('id').split('-');
        return i[0] === id && ns.indexOf(parseInt(i[2])) > 0;
    }).transition()
        .attr("transform", function() {
            var str = d3.select(this).attr('transform');
            if (str) {
                var [x, y] = str.replace("translate(","").replace(")","").split(",");
                return "translate(" + (parseFloat(x) + dx) + "," + (parseFloat(y) + dy) + ")";
            } else {
                return "translate(" + dx + "," + dy + ")";
            }
        })
}

function move_subtree_connected(id, ns, dx, dy) {
    // find edges
    var e1 = svg.selectAll('.edge').filter(function() {
        var i = d3.select(this).attr('id').split('-');
        return i[0] === id && parseInt(i[2]) == ns[0];
    }).transition().attr("d", function() {
        var bbox = this.getBBox();
        var pp1 = d3.select(this).attr('d').split(/(?=[LMC])/)[0],
            pp1 = parseFloat(pp1.replace("M","").split(",")[0]);

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

    move_subtree(id, ns, dx, dy);
}

function swap_subtrees(id, ns1, ns2) {
    var r1 = svg.select('.node#' + id + '-' + ns1[0]),
        r2 = svg.select('.node#' + id + '-' + ns2[0]);

    var dx = parseFloat(r1.attr("px")) - parseFloat(r2.attr("px")),
        dy = parseFloat(r1.attr("py")) - parseFloat(r2.attr("py"));

    move_subtree(id, ns1, -dx, -dy);
    move_subtree(id, ns2,  dx,  dy);

    // remap node and text
    svg.selectAll('.node, .node-text').filter(function() {
        var i = d3.select(this).attr('id').split('-');
        return i[0] === id && [ns1[0], ns2[0]].indexOf(parseInt(i[1])) >= 0;
    }).attr('id', function() {
        var i = d3.select(this).attr('id').split('-');
        return (id + '-' + (parseInt(i[1]) == ns1[0] ? ns2[0] : ns1[0]));
    });
    
    // remap edges
    svg.selectAll('.edge').filter(function() {
        var i = d3.select(this).attr('id').split('-');
        return i[0] === id && [ns1[0], ns2[0]].indexOf(parseInt(i[1])) >= 0;
    }).attr('id', function() {
        var i = d3.select(this).attr('id').split('-');
        var n = (parseInt(i[1]) == ns1[0] ? ns2[0] : ns1[0]);
        return (id + '-' + n + '-' + i[2]);
    });
}

function center_subtree(id, ns) {
    var [x_min, y_min] = [width, height],
        [x_max, y_max] = [0, 0];

    svg.selectAll('.node').filter(function() { 
        var i = d3.select(this).attr('id').split('-');
        return i[0] === id && ns.indexOf(parseInt(i[1])) >= 0;
    }).each(function() {
        var bbox = this.getBBox();
        x_min = Math.min(x_min, bbox['x']),
        y_min = Math.min(y_min, bbox['y']),
        x_max = Math.max(x_max, bbox['x'] + bbox['width']),
        y_max = Math.max(y_max, bbox['y'] + bbox['height']);
    });

    if (x_max < 450) var dx = (width * (1 / 4)) - (x_min + (x_max - x_min) / 2) - 25;
    else             var dx = (width * (3 / 4)) - (x_min + (x_max - x_min) / 2) + 25;
    var dy = (height / 2) - (y_min + (y_max - y_min) / 2);

    move_subtree(id, ns, dx, dy);

    return [dx, dy];
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

