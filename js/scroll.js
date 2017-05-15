function init_scrolling() {
    d3.graphScroll()
        .sections(d3.selectAll('.section'))
        .offset(20)
        .on('active', function(i){
            if (scroll_pos < i) {
                if (i > 53)      scroll_pos = 53;
                else if (i > 26) scroll_pos = Math.max(scroll_pos, 26);
                else if (i > 19) scroll_pos = Math.max(scroll_pos, 19);

                for (var j = scroll_pos; j < i; j++) {
                    if (fxns[j]['ffs']) addToQueue(fxns[j]['ffs'], (fxns[j]['fds'] ? fxns[j]['fds'] : 0));
                    if (fxns[j]['ffa']) fxns[j]['ffa']();
                }
            } else {
                clearTimeout(timeout);
                if (fxns[scroll_pos]['bfs']) addToQueue(fxns[scroll_pos]['bfs'], (fxns[scroll_pos]['bds'] ? fxns[scroll_pos]['bds'] : 0));
                if (fxns[scroll_pos]['bfa']) fxns[scroll_pos]['bfa']();

                if (i == 0) {
                    svg.selectAll("*")
                        .transition().style('opacity', 0)
                        .transition().delay(200).remove();
                }
            }

            scroll_pos = i;
        });
}

function update_freq_table(cs) {
    var t_width = 6;

    $('#freq-table td').remove();
    $('#freq-table th').remove();

    for (var i = 0; i < cs.length; i++) {
        var c = cs[i];
        var h = "<th width='" + (c[0].length * 100 / t_width).toFixed(2) + "%'>" + c[0] + "</th>";
        var d = "<td>" + c[1] + "</td>";

        $('#freq-table tr:nth-of-type(1)').append(h);
        $('#freq-table tr:nth-of-type(2)').append(d);
    }
}

function update_fgk_input(i, o) {
    $('#fgk-input p').html(i + "<span id='unseen'>" + o + "</span>");
}

function clear_all_text() {
    svg.selectAll('text:not(.node-text)')
        .transition()
        .style('opacity', 0)
        .remove();
}

function show_text(t, x, y, s, d) {
    svg.append("text")
        .attr("x", x)
        .attr("y", y)
        .text(t)
        .style("font-family", "Roboto Mono")
        .style("font-size", s)
        .style("text-anchor", "middle")
        .style("fill", "#39C0BA")
        .style("opacity", 0)
        .transition()
        .delay(d)
        .style("opacity", 1);
}

function hide_node(i, d) {
    svg.selectAll(i)
        .transition().style('opacity', 0)
        .transition().delay(d).style('display', 'none');

    svg.selectAll('.edge').filter(function() {
        var ni = i.split('-')[1];
        return d3.select(this).attr('id').split('-')[1] === ni || d3.select(this).attr('id').split('-')[2] === ni;
    })
        .transition().style('opacity', 0)
        .transition().delay(100).style('display', 'none');
}

function show_node(i) {
    svg.selectAll(i).style('display', 'initial').transition().style('opacity', 1);

    svg.selectAll('.edge').filter(function() {
        var ni = i.split('-')[1];
        return d3.select(this).attr('id').split('-')[1] === ni;
    }).style('display', 'initial').transition().style('opacity', 1);
}

// takes in gap vals gx + gy, new leaf vals k + v + id, new interior node id
function insert_fgk_node(id, [gx, gy], k, v, ix1, ix2) {
    // get null nodes current pos
    var [px, py] = [parseInt(d3.select('#fgk-0').attr("px")), parseInt(d3.select('#fgk-0').attr("py"))];

    // move null node
    move_node(id, '0', -gx, gy);

    // add new interior node and leaf node
    var [rn, rt] = new_circ_node(px, py, k, v, v, id + '-' + ix1);
    var [nn, nt] = new_rect_node(px + gx, py + gy, k, v, k + ',' + v, id + '-' + ix2);

    rn.style('opacity', 0).transition().style('opacity', 1);
    rt.style('opacity', 0).transition().style('opacity', 1);
    nn.style('opacity', 0).transition().delay(250).style('opacity', 1);
    nt.style('opacity', 0).transition().delay(250).style('opacity', 1);

    // update id on edge into interior node
    svg.selectAll('.edge').filter(function() {
        var i = d3.select(this).attr('id').split('-');
        return i[0] === id && parseInt(i[2]) == 0;
    }).attr('id', function() {
        var i = d3.select(this).attr('id').split('-');
        return i[0] + '-' + i[1] + '-' + ix1;
    });

    // add edge from interior to leaf node
    var p1 = connect_p2c(rn, nn, id + '-' + ix1 + '-' + ix2);
    p1.style('opacity', 0).transition().delay(250).style('opacity', 1);

    // add edge from interior node to where null node will be (after move)
    var x1 = px,
        y1 = py + 15,
        x4 = px - gx,
        y4 = py + gy - 12.5;
    var x2 = x1 + (x4 - x1) / 6,
        y2 = y1 + (y4 - y1) / 6 * 2,
        x3 = x1 + (x4 - x1) / 6 * 5,
        y3 = y1 + (y4 - y1) / 6 * 4;

    var line = d3.line().curve(d3.curveCardinal);
    var p2 = svg.append('path')
        .classed('edge', true)
        .attr('id', id + '-' + ix1 + '-0')
        .attr('d', line([[x1, y1], [x2, y2], [x3, y3], [x4, y4]]))
        .style("stroke", "black")
        .style("fill", "none")
        .style('opacity', 0)
        .transition().delay(250)
        .style('opacity', 1);
}

function uninsert_fgk_node(id, [gx, gy], ix1, ix2) {
    var px = parseInt(d3.select('.node#' + id + '-' + ix1).attr("px")),
        py = parseInt(d3.select('.node#' + id + '-' + ix1).attr("py"));

    var dx = px - parseInt(d3.select('.node#' + id + '-0').attr("px")),
        dy = py - parseInt(d3.select('.node#' + id + '-0').attr("py"));

    svg.selectAll('#' + id + '-' + ix1).transition().style('opacity', 0).transition().delay(250).remove();
    svg.selectAll('#' + id + '-' + ix2).transition().style('opacity', 0).transition().delay(250).remove();
    svg.select('#' + id + '-' + ix1 + '-0').transition().style('opacity', 0).transition().delay(250).remove();
    svg.select('#' + id + '-' + ix1 + '-' + ix2).transition().style('opacity', 0).transition().delay(250).remove();

    svg.selectAll('.edge').filter(function() {
        var i = d3.select(this).attr('id').split('-');
        return i[0] === id && parseInt(i[2]) == ix1;
    }).attr('id', function() {
        var i = d3.select(this).attr('id').split('-');
        return i[0] + '-' + i[1] + '-' + 0;
    });

    move_node('fgk', '0', dx, dy);
}

function update_node_values(id, ns, vs) {
    for (var i = 0; i < ns.length; i++) {
        var n = svg.select('.node#' + id + '-' + ns[i]),
            t = svg.select('.node-text#' + id + '-' + ns[i]);

        if (n.classed('circ')) t.text(vs[i]);
        else t.text(t.text().split(',')[0] + ',' + vs[i]);
    }
}

// takes in id-prefix, list of ids, list of ids to change them to            
function remap_ids(id, o, n) {
    // should probably check that two lists contain same values?

    // remap node and text
    svg.selectAll('.node, .node-text').filter(function() {
        var i = d3.select(this).attr('id').split('-');
        return i[0] === id && o.indexOf(parseInt(i[1])) >= 0;
    }).attr('id', function() {
        var i = d3.select(this).attr('id').split('-');
        return (id + '-' + n[o.indexOf(parseInt(i[1]))]);
    });
    
    // remap edges
    svg.selectAll('.edge').filter(function() {
        var i = d3.select(this).attr('id').split('-');
        return i[0] === id && (o.indexOf(parseInt(i[1])) >= 0 || o.indexOf(parseInt(i[2])) >= 0);
    }).attr('id', function() {
        var i = d3.select(this).attr('id').split('-');
        var n1 = (o.indexOf(parseInt(i[1])) >= 0 ? n[o.indexOf(parseInt(i[1]))] : i[1]);
        var n2 = (o.indexOf(parseInt(i[2])) >= 0 ? n[o.indexOf(parseInt(i[2]))] : i[2]);
        return (id + '-' + n1 + '-' + n2);
    });
}

var scroll_pos = 0;
var timeout = null;
var none = function() { return; };
var fxns = [
    {
        bfs: none,
        ffs: none,
    },{
        bfs: none,
        ffs: function() {
            show_text("abca", 775, 168.75, "28px", 0);
            show_text("00 01 10 00", 775, 281.25, "28px", 500);
        },
    },{
        bfs: function() {
            clear_all_text();
        },
        ffs: function() {
            clear_all_text();

            show_text("aabaacaa", 775, 168.75, "28px", 500);
            show_text("00 00 01 00 00 10 00 00", 775, 281.25, "28px", 1000);
        },
    },{
        bfs: function() {
            clear_all_text();

            show_text("abca", 775, 168.75, "28px", 500);
            show_text("00 01 10 00", 775, 281.25, "28px", 500);
        },
        ffs: function() {
            clear_all_text();
        },
    },{
        bfs: function() {
            show_text("aabaacaa", 775, 168.75, "28px", 0);
            show_text("00 00 01 00 00 10 00 00", 775, 281.25, "28px", 0);
        },
        ffs: none,
    },{
        bfs: none,
        ffa: function() {
            d3.select('#freq-table').style('display','block').transition().style('opacity', 1);
        },
        ffs: function() {
            var t = trees['bookkeeper-1'];
            build_tree('basic', t['tree'], '', t['height'], t['root-pos'], t['gap-size']);
            svg.selectAll('.node').style('opacity', 0).style('display', 'none');
            svg.selectAll('.node-text').style('opacity', 0).style('display', 'none');
            svg.selectAll('.edge').style('opacity', 0).style('display', 'none');
        },
    },{
        bfa: function() {
            d3.select('#freq-table')
                .transition().style('opacity', 0)
                .transition().delay(200).style('display','none');
        },
        bfs: function() {
            svg.selectAll('.node').remove();
            svg.selectAll('.node-text').remove();
            svg.selectAll('.edge').remove();
        },
        ffa: function() {
            $('#freq-table th:nth-of-type(' + 5 + '), #freq-table td:nth-of-type(' + 5 + ')').addClass('highlight');
            $('#freq-table th:nth-of-type(' + 6 + '), #freq-table td:nth-of-type(' + 6 + ')').addClass('highlight');
        },
    },{
        bfa: function() {
            $('th.highlight, td.highlight').removeClass('highlight');
        },
        ffa: function() {
            update_freq_table([['b', 1], ['e', 3], ['k', 2], ['o', 2], ['pr', 2]]);
        },
        ffs: function() {
            show_node('#basic-9');
            show_node('#basic-10');
            show_node('#basic-11');
        },
        fds: 250,
    },{
        bfa: function() {
            update_freq_table([['b', 1], ['e', 3], ['k', 2], ['o', 2], ['p', 1], ['r', 1]]);
            $('#freq-table th:nth-of-type(' + 5 + '), #freq-table td:nth-of-type(' + 5 + ')').addClass('highlight');
            $('#freq-table th:nth-of-type(' + 6 + '), #freq-table td:nth-of-type(' + 6 + ')').addClass('highlight');
        },
        bfs: function() {
            hide_node('#basic-9', 100);
            hide_node('#basic-10', 100);
            hide_node('#basic-11', 100);
        },
        bds: 250,
        ffa: function() {
            $('#freq-table th:nth-of-type(' + 5 + '), #freq-table td:nth-of-type(' + 5 + ')').addClass('highlight');
            $('#freq-table th:nth-of-type(' + 1 + '), #freq-table td:nth-of-type(' + 1 + ')').addClass('highlight');
        },
    },{
        bfa: function() {
            $('#freq-table th, #freq-table td').removeClass('highlight');
        },
        ffa: function() {
            update_freq_table([['bpr', 3], ['e', 3], ['k', 2], ['o', 2]]);
        },
        ffs: function() {
            show_node('#basic-5');
            show_node('#basic-8');
        },
        fds: 250,
    },{
        bfa: function() {
            update_freq_table([['b', 1], ['e', 3], ['k', 2], ['o', 2], ['pr', 2]]);

            $('#freq-table th:nth-of-type(' + 5 + '), #freq-table td:nth-of-type(' + 5 + ')').addClass('highlight');
            $('#freq-table th:nth-of-type(' + 1 + '), #freq-table td:nth-of-type(' + 1 + ')').addClass('highlight');
        },
        bfs: function() {
            hide_node('#basic-5', 100);
            hide_node('#basic-8', 100);
        },
        bds: 350,
        ffa: function() {
            update_freq_table([['bpr', 3], ['e', 3], ['ko', 4]]);
        },
        ffs: function() {
            show_node('#basic-3');
            show_node('#basic-6');
            show_node('#basic-7');
        },
        fds: 250,
    },{
        bfa: function() {
            update_freq_table([['bpr', 3], ['e', 3], ['k', 2], ['o', 2]]);
        },
        bfs: function() {
            hide_node('#basic-3', 100);
            hide_node('#basic-6', 100);
            hide_node('#basic-7', 100);
        },
        bds: 350,
        ffa: function() {
            update_freq_table([['bepr', 6], ['ko', 4]]);
        },
        ffs: function() {
            show_node('#basic-2');
            show_node('#basic-4');
        },
        fds: 250,
    },{
        bfa: function() {
            update_freq_table([['bpr', 3], ['e', 3], ['ko', 4]]);
        },
        bfs: function() {
            hide_node('#basic-2', 100);
            hide_node('#basic-4', 100);
        },
        bds: 350,
        ffa: function() {
            update_freq_table([['bekopr', 10]]);
        },
        ffs: function() {
            show_node('#basic-1');
        },
        fds: 250,
    },{
        bfa: function() {
            update_freq_table([['bepr', 6], ['ko', 4]]);
        },
        bfs: function() {
            hide_node('#basic-1', 100);
        },
        ffa: function() {
            d3.select('#freq-table')
                .transition().style('opacity', 0)
                .transition().delay(200).style('display','none');
        },
    },{
        bfa: function() {
            d3.select('#freq-table').style('display', 'block').transition().style('opacity', 1);
        },
        ffs: function() {
            svg.select('.node#basic-1').transition().style('fill', '#5a79e6');
            svg.select('.node#basic-2').transition().delay(200).style('fill', '#5a79e6');
            svg.select('.node#basic-5').transition().delay(400).style('fill', '#5a79e6');
            svg.select('.node#basic-9').transition().delay(600).style('fill', '#5a79e6');
            svg.select('.node#basic-10').transition().delay(800).style('fill', '#5a79e6');

            show_text("p = 0110", 775, 427.5, "28px", 1250);
        },
    },{
        bfs: function() {
            svg.selectAll('.node').transition().style('fill', '#2e3037');
            clear_all_text();
        },
        ffs: function() {
            svg.selectAll('.node').transition().style('fill', '#2e3037');
            clear_all_text();

            svg.select('.node#basic-1').transition().delay(200).style('fill', '#5a79e6');
            svg.select('.node#basic-3').transition().delay(400).style('fill', '#5a79e6');
            svg.select('.node#basic-6').transition().delay(600).style('fill', '#5a79e6');

            show_text("k = 10", 775, 427.5, "28px", 1000);
        },
    },{
        bfs: function() {
            svg.selectAll('.node').transition().style('fill', '#2e3037');
            clear_all_text();

            svg.select('.node#basic-1').transition().delay(150).style('fill', '#5a79e6');
            svg.select('.node#basic-2').transition().delay(150).style('fill', '#5a79e6');
            svg.select('.node#basic-5').transition().delay(150).style('fill', '#5a79e6');
            svg.select('.node#basic-9').transition().delay(150).style('fill', '#5a79e6');
            svg.select('.node#basic-10').transition().delay(150).style('fill', '#5a79e6');

            show_text("p = 0110", 775, 427.5, "28px", 500);
        },
        ffs: function() {
            svg.selectAll('.node').transition().style('fill', '#2e3037');
            clear_all_text();
        },
    },{
        bfs: function() {
            svg.select('.node#basic-1').transition().style('fill', '#5a79e6');
            svg.select('.node#basic-3').transition().style('fill', '#5a79e6');
            svg.select('.node#basic-6').transition().style('fill', '#5a79e6');

            show_text("k = 10", 775, 427.5, "28px", 250);
        },
        ffs: none,
    },{
        bfs: none,
        ffs: none,
    },{
        bfs: none,
        ffs: function() {
            svg.selectAll('.node').remove();
            svg.selectAll('.node-text').remove();
            svg.selectAll('.edge').remove();
        },
    },{
        bfs: function() {
            svg.selectAll('.node').remove();
            svg.selectAll('.node-text').remove();
            svg.selectAll('.edge').remove();

            var t = trees['bookkeeper-1'];
            build_tree('basic', t['tree'], '', t['height'], t['root-pos'], t['gap-size']);
        },
        ffs: none,
    },{
        bfs: none,
        ffs: none,
    },{
        bfs: none,
        ffs: none,
    },{
        bfs: none,
        ffs: function() {
            var [n1, t1] = new_circ_node(225, 150, "a", 9, 9, 'swp_ex1-1');
            var [n2, t2] = new_circ_node(300, 225, "b", 7, 7, 'swp_ex1-2');
            var [n3, t3] = new_circ_node(150, 225, "c", 4, 4, 'swp_ex1-3');
            var [n4, t4] = new_circ_node(225, 300, "d", 2, 2, 'swp_ex1-4');
            var [n5, t5] = new_circ_node( 75, 300, "e", 1, 1, 'swp_ex1-5');

            var p1 = connect_p2c(n1, n2, 'swp_ex1-1-2');
            var p2 = connect_p2c(n1, n3, 'swp_ex1-1-3');
            var p3 = connect_p2c(n3, n4, 'swp_ex1-3-4');
            var p4 = connect_p2c(n3, n5, 'swp_ex1-3-5');

            svg.selectAll('*')
                .classed('sib-tree-1', true)
                .style('opacity', 0).transition().style('opacity', 1);
        },
    },{
        bfs: function() {
            svg.selectAll('*').transition().style('opacity', 0).transition().delay(250).remove();
        },
        ffs: function() {
            svg.selectAll('.sib-tree-1').transition().style('opacity', 0).transition().style('display', 'none');

            var [n1, t1] = new_circ_node(225, 112.5, "a", 12, 12, 'swp_ex2-1');
            var [n2, t2] = new_circ_node(175, 187.5, "b",  4,  7, 'swp_ex2-2');
            var [n3, t3] = new_circ_node(275, 187.5, "c",  8,  8, 'swp_ex2-3');
            var [n4, t4] = new_circ_node(225, 262.5, "d",  3,  6, 'swp_ex2-4');
            var [n5, t5] = new_circ_node(325, 262.5, "e",  6,  4, 'swp_ex2-5');
            var [n6, t6] = new_circ_node(175, 337.5, "f",  1,  1, 'swp_ex2-6');
            var [n7, t7] = new_circ_node(275, 337.5, "g",  2,  2, 'swp_ex2-7');

            var p1 = connect_p2c(n1, n2, 'swp_ex2-1-2');
            var p2 = connect_p2c(n1, n3, 'swp_ex2-1-3');
            var p3 = connect_p2c(n3, n4, 'swp_ex2-3-4');
            var p4 = connect_p2c(n3, n5, 'swp_ex2-3-5');
            var p5 = connect_p2c(n4, n6, 'swp_ex2-4-6');
            var p6 = connect_p2c(n4, n7, 'swp_ex2-4-7');

            svg.selectAll('*:not(.sib-tree-1)')
                .classed('sib-tree-2', true)
                .style('opacity', 0).transition().delay(250).style('opacity', 1);

            n4.style('fill', '#af3131');
            n5.style('fill', '#af3131');
        },
        fds: 500,
    },{
        bfs: function() {
            svg.selectAll('.sib-tree-2').transition().style('opacity', 0).transition().delay(250).remove();

            if (svg.selectAll('#swp_ex1-1').size() == 0) {
                var [n1, t1] = new_circ_node(225, 150, "a", 9, 9, 'swp_ex1-1');
                var [n2, t2] = new_circ_node(300, 225, "b", 7, 7, 'swp_ex1-2');
                var [n3, t3] = new_circ_node(150, 225, "c", 4, 4, 'swp_ex1-3');
                var [n4, t4] = new_circ_node(225, 300, "d", 2, 2, 'swp_ex1-4');
                var [n5, t5] = new_circ_node( 75, 300, "e", 1, 1, 'swp_ex1-5');

                var p1 = connect_p2c(n1, n2, 'swp_ex1-1-2');
                var p2 = connect_p2c(n1, n3, 'swp_ex1-1-3');
                var p3 = connect_p2c(n3, n4, 'swp_ex1-3-4');
                var p4 = connect_p2c(n3, n5, 'swp_ex1-3-5');

                svg.selectAll('*:not(.sib-tree-2)')
                    .classed('sib-tree-1', true)
                    .style('opacity', 0).transition().delay(250).style('opacity', 1);
            } else svg.selectAll('.sib-tree-1').style('display','block').transition().delay(250).style('opacity', 1);
        },
        bds: 500,
        ffs: function() {
            swap_subtrees('swp_ex2', [5],[4,6,7]);
        },
        fds: 250,
    },{
        bfs: function() {
            swap_subtrees('swp_ex2', [4],[5,6,7]);
        },
        bds: 250,
        ffs: function() {
            svg.selectAll('.sib-tree-2').transition().style('opacity', 0).transition().style('display', 'none');

            var [n, t] = new_rect_node(225, 225, "-", 0, "-,0", "fgk-0");

            n.style('opacity', 0).transition().delay(250).style('opacity', 1);
            t.style('opacity', 0).transition().delay(250).style('opacity', 1);
        },
        fds: 500,
    },{
        bfs: function() {
            svg.selectAll('#fgk-0').transition().style('opacity', 0).transition().delay(250).remove();

            if (svg.selectAll('#swp_ex2-1').size() == 0) {
                var [n1, t1] = new_circ_node(225, 112.5, "a", 12, 12, 'swp_ex2-1');
                var [n2, t2] = new_circ_node(175, 187.5, "b",  4,  7, 'swp_ex2-2');
                var [n3, t3] = new_circ_node(275, 187.5, "c",  8,  8, 'swp_ex2-3');
                var [n4, t4] = new_circ_node(325, 262.5, "d",  3,  6, 'swp_ex2-5');
                var [n5, t5] = new_circ_node(225, 262.5, "e",  6,  4, 'swp_ex2-4');
                var [n6, t6] = new_circ_node(275, 337.5, "f",  1,  1, 'swp_ex2-6');
                var [n7, t7] = new_circ_node(375, 337.5, "g",  2,  2, 'swp_ex2-7');

                var p1 = connect_p2c(n1, n2, 'swp_ex2-1-2');
                var p2 = connect_p2c(n1, n3, 'swp_ex2-1-3');
                var p3 = connect_p2c(n3, n4, 'swp_ex2-3-4');
                var p4 = connect_p2c(n3, n5, 'swp_ex2-3-5');
                var p5 = connect_p2c(n4, n6, 'swp_ex2-4-6');
                var p6 = connect_p2c(n4, n7, 'swp_ex2-4-7');

                svg.selectAll('*:not(#fgk-0)')
                    .classed('sib-tree-2', true)
                    .style('opacity', 0).transition().delay(250).style('opacity', 1);

                n4.style('fill', '#af3131');
                n5.style('fill', '#af3131');
            } else svg.selectAll('.sib-tree-2').style('display','block').transition().delay(250).style('opacity', 1);
        },
        ffa: function() {
            d3.select('#fgk-input').style('display','block').transition().style('opacity', 1);
        },
    },{
        bfa: function() {
            d3.select('#fgk-input')
                .transition().style('opacity', 0)
                .transition().delay(200).style('display','none');
        },
        ffa: function() {
            update_fgk_input("b","ookkeeper");
        },
    },{
        bfa: function() {
            update_fgk_input("","bookkeeper");
        },
        ffs: function() {
            insert_fgk_node('fgk', [30, 75], 'b', 1, 1, 2);
        },
        fds: 500
    },{
        bfs: function() {
            uninsert_fgk_node('fgk', [30, 75], 1, 2)
        },
        bds: 250,
        ffs: function() {
            center_subtree('fgk', [1,2,0]);
        },
        fds: 250
    },{
        bfs: function() {
            move_subtree('fgk', [1,2,0], 0, 36.25);
        },
        bds: 250,
        ffa: function() {
            update_fgk_input("bo","okkeeper");
        },
        ffs: function() {
            insert_fgk_node('fgk', [30, 75], 'o', 1, 3, 4);
            remap_ids('fgk', [2,3], [3,2]);
        },
        fds: 500
    },{
        bfa: function() {
            update_fgk_input("b","ookkeeper");
        },
        bfs: function() {
            uninsert_fgk_node('fgk', [30, 75], 2, 4);
            remap_ids('fgk', [2,3], [3,2]);
        },
        bds: 500,
        ffa: function() {
            update_fgk_input("boo","kkeeper");
        },
        ffs: function() {
            update_node_values('fgk',[1],[2]);
            center_subtree('fgk', [1,2,3,4,0]);
        },
        fds: 500
    },{
        bfa: function() {
            update_fgk_input("bo","okkeeper");
        },
        bfs: function() {
            update_node_values('fgk',[1],[1]);
            move_subtree('fgk', [1,2,3,4,0], -15, 37.5);
        },
        bds: 250,
        ffs: function() {
            update_node_values('fgk',[4],[2]);

            svg.select('.node#fgk-3').style('fill', '#af3131');
            svg.select('.node#fgk-4').style('fill', '#af3131');
        },
        fds: 250
    },{
        bfs: function() {
            update_node_values('fgk',[4],[1]);

            svg.select('.node#fgk-3').style('fill', '#2e3037');
            svg.select('.node#fgk-4').style('fill', '#2e3037');
        },
        bds: 250,
        ffa: function() {
            update_fgk_input("book", "keeper");
        },
        ffs: function() {
            svg.select('.node#fgk-3').style('fill', '#2e3037');
            svg.select('.node#fgk-4').style('fill', '#2e3037');

            swap_subtrees('fgk', [3], [4]);

            update_node_values('fgk',[1],[3]);
        },
        fds: 500
    },{
        bfa: function() {
            update_fgk_input("boo", "kkeeper");
        },
        bfs: function() {
            svg.select('.node#fgk-3').style('fill', '#af3131');
            svg.select('.node#fgk-4').style('fill', '#af3131');

            swap_subtrees('fgk', [3], [4]);

            update_node_values('fgk',[1],[2]);
        },
        bds: 500,
        ffs: function() {
            insert_fgk_node('fgk', [30, 75], 'k', 1, 5, 6);
        },
        fds: 500
    },{
        bfs: function() {
            uninsert_fgk_node('fgk', [30, 75], 5, 6);
        },
        bds: 250,
        ffa: function() {
            update_fgk_input("bookk", "eeper");
        },
        ffs: function() {
            remap_ids('fgk', [5,4], [4,5]);
            center_subtree('fgk', [1,2,3,4,5,6,0]);
            update_node_values('fgk',[1,2],[4,2]);
        },
        fds: 250
    },{
        bfa: function() {
            update_fgk_input("book", "keeper");
        },
        bfs: function() {
            remap_ids('fgk', [5,4], [4,5]);
            update_node_values('fgk',[1,2],[3,1]);
            move_subtree('fgk', [1,2,3,4,5,6,0], -15, 37.5);            
        },
        bds: 250,
        ffs: function() {
            update_node_values('fgk',[6],[2]);

            svg.select('.node#fgk-5').style('fill', '#af3131');
            svg.select('.node#fgk-6').style('fill', '#af3131');
        },
        fds: 250
    },{
        bfs: function() {
            update_node_values('fgk',[6],[1]);

            svg.select('.node#fgk-5').style('fill', '#2e3037');
            svg.select('.node#fgk-6').style('fill', '#2e3037');
        },
        bds: 250,
        ffs: function() {
            svg.select('.node#fgk-5').style('fill', '#2e3037');
            svg.select('.node#fgk-6').style('fill', '#2e3037');

            swap_subtrees('fgk', [5], [6]);

            update_node_values('fgk',[2],[3]);

            svg.select('.node#fgk-2').style('fill', '#af3131');
            svg.select('.node#fgk-3').style('fill', '#af3131');
        },
        fds: 250
    },{
        bfs: function() {
            svg.select('.node#fgk-5').style('fill', '#af3131');
            svg.select('.node#fgk-6').style('fill', '#af3131');

            swap_subtrees('fgk', [5], [6]);

            update_node_values('fgk',[2],[2]);

            svg.select('.node#fgk-2').style('fill', '#2e3037');
            svg.select('.node#fgk-3').style('fill', '#2e3037');           
        },
        bds: 250,
        ffa: function() {
            update_fgk_input("bookke", "eper");
        },
        ffs: function() {
            svg.select('.node#fgk-2').style('fill', '#2e3037');
            svg.select('.node#fgk-3').style('fill', '#2e3037');

            swap_subtrees('fgk', [2,4,5,6,0], [3]);

            update_node_values('fgk',[1],[5]);
        },
        fds: 250
    },{
        bfa: function() {
            update_fgk_input("bookk", "eeper");
        },
        bfs: function() {
            svg.select('.node#fgk-2').style('fill', '#af3131');
            svg.select('.node#fgk-3').style('fill', '#af3131');

            swap_subtrees('fgk', [3,4,5,6,0], [2]);

            update_node_values('fgk',[1],[4]);
        },
        bds: 250,
        ffs: function() {
            insert_fgk_node('fgk', [30, 75], 'e', 1, 7, 8);
            remap_ids('fgk', [6,7], [7,6]);
        },
        fds: 500
    },{
        bfs: function() {
            remap_ids('fgk', [6,7], [7,6]);
            uninsert_fgk_node('fgk', [30, 75], 7, 8);
        },
        bds: 250,
        ffa: function() {
             update_fgk_input("bookkee", "per");
        },
        ffs: function() {
            center_subtree('fgk', [1,2,3,4,5,6,7,8,0]);
            update_node_values('fgk',[4,3,1],[2,4,6]);

            timeout = setTimeout(function() {
                move_subtree_connected('fgk', [2], -20, 0);
                move_subtree_connected('fgk', [3,4,5,6,7,8,0], 20, 0);
            }, 300);
        },
        fds: 550
    },{
        bfa: function() {
            update_fgk_input("bookke", "eper");
        },
        bfs: function() {
            update_node_values('fgk',[4,3,1],[1,3,5]);
            move_subtree('fgk', [1,2,3,4,5,6,7,8,0], 30, 37.875);

            timeout = setTimeout(function() {
                move_subtree_connected('fgk', [2], 20, 0);
                move_subtree_connected('fgk', [3,4,5,6,7,8,0], -20, 0);
            },300);
        },
        bds: 550,
        ffs: function() {
            update_node_values('fgk',[8],[2]);

            svg.select('.node#fgk-7').style('fill', '#af3131');
            svg.select('.node#fgk-8').style('fill', '#af3131');
        },
        fds: 250
    },{
        bfs: function() {
            update_node_values('fgk',[8],[1]);

            svg.select('.node#fgk-7').style('fill', '#2e3037');
            svg.select('.node#fgk-8').style('fill', '#2e3037');
        },
        bds: 250,
        ffs: function() {
            svg.select('.node#fgk-7').style('fill', '#2e3037');
            svg.select('.node#fgk-8').style('fill', '#2e3037');

            swap_subtrees('fgk', [7], [8]);

            update_node_values('fgk',[4],[3]);

            svg.select('.node#fgk-2').style('fill', '#af3131');
            svg.select('.node#fgk-4').style('fill', '#af3131');
        },
        fds: 250
    },{
        bfs: function() {
            svg.select('.node#fgk-7').style('fill', '#af3131');
            svg.select('.node#fgk-8').style('fill', '#af3131');

            swap_subtrees('fgk', [7], [8]);

            update_node_values('fgk',[4],[2]);

            svg.select('.node#fgk-2').style('fill', '#2e3037');
            svg.select('.node#fgk-4').style('fill', '#2e3037');           
        },
        bds: 250,
        ffs: function() {
            swap_subtrees('fgk', [2], [4,6,7,8,0]);

            remap_ids('fgk', [6,7,4,5], [4,5,6,7]);

            update_node_values('fgk',[1],[7]);

            svg.select('.node#fgk-2').style('fill', '#2e3037');
            svg.select('.node#fgk-6').style('fill', '#2e3037');

            update_fgk_input("bookkeep", "er");
        },
        fds: 250
    },{
        bfa: function() {
            update_fgk_input("bookkee", "per");
        },
        bfs: function() {
            svg.select('.node#fgk-2').style('fill', '#af3131');
            svg.select('.node#fgk-6').style('fill', '#af3131');

            swap_subtrees('fgk', [2,4,5,8,0], [6]);

            remap_ids('fgk', [4,5,6,7], [6,7,4,5]);

            update_node_values('fgk',[1],[6]);
        },
        bds: 250,
        ffs: function() {
            insert_fgk_node('fgk', [30, 75], 'p', 1, 9, 10);
            remap_ids('fgk', [8,9], [9,8]);
        },
        fds: 500
    },{
        bfs: function() {
            remap_ids('fgk', [8,9], [9,8]);
            uninsert_fgk_node('fgk', [30, 75], 9, 10);
        },
        bds: 250,
        ffa: function() {
            update_fgk_input("bookkeepe", "r");
        },
        ffs: function() {
            update_node_values('fgk',[4,2,1],[2,4,8]);
        },
    },{
        bfa: function() {
            update_fgk_input("bookkeep", "er");
        },
        bfs: function() {
            update_node_values('fgk',[4,2,1],[1,3,7]); 
        },
        ffs: function() {
            update_node_values('fgk',[5],[3]);

            svg.select('.node#fgk-5').style('fill', '#af3131');
            svg.select('.node#fgk-7').style('fill', '#af3131');
        },
    },{
        bfs: function() {
            update_node_values('fgk',[5],[2]);

            svg.select('.node#fgk-5').style('fill', '#2e3037');
            svg.select('.node#fgk-7').style('fill', '#2e3037');
        },
        ffa: function() {
            update_fgk_input("bookkeeper", "");
        },
        ffs: function() {
            svg.select('.node#fgk-5').style('fill', '#2e3037');
            svg.select('.node#fgk-7').style('fill', '#2e3037');

            swap_subtrees('fgk', [5], [7]);

            update_node_values('fgk',[3,1],[5,9]);
        },
        fds: 250
    },{
        bfa: function() {
            update_fgk_input("bookkeepe", "r");
        },
        bfs: function() {
            svg.select('.node#fgk-5').style('fill', '#af3131');
            svg.select('.node#fgk-7').style('fill', '#af3131');

            swap_subtrees('fgk', [5], [7]);

            update_node_values('fgk',[3,1],[4,8]);
        },
        bds: 250,
        ffs: function() {
            move_subtree('fgk', [1,2,3,4,5,6,7,8,9,10,0], 0, -31.875);

            timeout = setTimeout(function() {
                insert_fgk_node('fgk', [30, 75], 'r', 1, 11, 12);
                remap_ids('fgk', [10,11], [11,10]);
            },500);
        },
        fds: 750
    },{
        bfs: function() {
            remap_ids('fgk', [10,11], [11,10]);
            uninsert_fgk_node('fgk', [30, 75], 11, 12);

            setTimeout(function() {
                svg.select('.edge#fgk-11-0').remove()
                move_subtree('fgk', [1,2,3,4,5,6,7,8,9,10,0], 0, 31.875);
            },500);
        },
        bds: 750,
        ffs: function() {
            update_node_values('fgk',[8],[2]);

            svg.select('.node#fgk-8').style('fill', '#af3131');
            svg.select('.node#fgk-9').style('fill', '#af3131');
        },
    },{
        bfs: function() {
            update_node_values('fgk',[8],[1]);

            svg.select('.node#fgk-8').style('fill', '#2e3037');
            svg.select('.node#fgk-9').style('fill', '#2e3037');
        },
        ffs: function() {
            svg.select('.node#fgk-8').style('fill', '#2e3037');
            svg.select('.node#fgk-9').style('fill', '#2e3037');

            swap_subtrees('fgk', [8,10,11,12,0], [9]);

            update_node_values('fgk',[4],[3]);

            svg.select('.node#fgk-4').style('fill', '#af3131');
            svg.select('.node#fgk-6').style('fill', '#af3131');
        },
        fds: 250
    },{
        bfs: function() {
            svg.select('.node#fgk-8').style('fill', '#af3131');
            svg.select('.node#fgk-9').style('fill', '#af3131');

            swap_subtrees('fgk', [9,10,11,12,0], [8]);

            update_node_values('fgk',[4],[2]); 

            svg.select('.node#fgk-4').style('fill', '#2e3037');
            svg.select('.node#fgk-6').style('fill', '#2e3037');          
        },
        bds: 250,
        ffs: function() {
            svg.select('.node#fgk-4').style('fill', '#2e3037');
            svg.select('.node#fgk-6').style('fill', '#2e3037');

            swap_subtrees('fgk', [4,8,9,10,11,12,0], [6]);

            update_node_values('fgk',[3,1],[6,10]);
        },
        fds: 250
    },{
        bfs: function() {
            svg.select('.node#fgk-4').style('fill', '#af3131');
            svg.select('.node#fgk-6').style('fill', '#af3131');

            swap_subtrees('fgk', [6,8,9,10,11,12,0], [4]);

            update_node_values('fgk',[3,1],[5,9]); 
        },
        bds: 250,
        ffs: function() {
            svg.selectAll('.node, .node-text, .edge').filter(function() {
                return d3.select(this).attr('id').indexOf('fgk') >= 0;
            }).remove();

            var t1 = trees['bookkeeper-1'];
            var t2 = trees['bookkeeper-2'];

            if (svg.select('#basic-1').size() == 0) build_tree('basic', t1['tree'], '', t1['height'], t1['root-pos'], t1['gap-size']);
            if (svg.select('#fgk-1').size() == 0)   build_tree('fgk', t2['tree'], '', t2['height'], t2['root-pos'], t2['gap-size']);

            d3.select('#fgk-input')
                .transition().style('opacity', 0)
                .transition().delay(200).style('display','none');
        },
        fds: 500
    },{
        bfs: function() {
            d3.select('#fgk-input').style('display','block').transition().style('opacity', 1);
            update_node_values('fgk',[4,5,7,8,11,12],[2,2,3,1,1,1]); 
        },
        bds: 250,
        ffs: none,
    },{
        bfs: none,
        ffs: none,
    },{
        bfs: none,
        ffs: none,
    },{
        bfs: function() {
            svg.selectAll('.node, .node-text, .edge').filter(function() {
                return true;
            }).remove();

            var t = trees['bookkeeper-2'];
            build_tree('fgk', t['tree'], '', t['height'], t['root-pos'], t['gap-size']);

            svg.selectAll('.node, .node-text, .edge').filter(function() {
                return d3.select(this).attr('id').indexOf('fgk') >= 0;
            }).style('opacity', 0).transition().style('opacity', 1);

            $('.word-select select').val('bookkeeper');
        },
        ffs: none,
    },{
        bfs: none,
        ffs: none,
    },{
        bfs: none,
        ffs: none,
    },{
        bfs: none,
        ffs: none,
    }
]

