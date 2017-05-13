function init_scrolling() {
    d3.graphScroll()
        .sections(d3.selectAll('.section'))
        .offset(20)
        .on('active', function(i){
            if (scroll_pos < i) {
                if (i > 52) scroll_pos = 52;

                for (var j = scroll_pos; j < i; j++) {
                    fxns[j]['forward']();
                }
            } else {
                clearTimeout(timeout);
                fxns[scroll_pos]['backward']();

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
        "backward": none,
        "forward": none,
    },{
        "backward": none,
        "forward": function() {
            show_text("abca", 775, 168.75, "28px", 0);
            show_text("00 01 10 00", 775, 281.25, "28px", 500);
        },
    },{
        "backward": function() {
            clear_all_text();
        },
        "forward": function() {
            clear_all_text();

            show_text("aabaacaa", 775, 168.75, "28px", 500);
            show_text("00 00 01 00 00 10 00 00", 775, 281.25, "28px", 1000);
        },
    },{
        "backward": function() {
            clear_all_text();

            show_text("abca", 775, 168.75, "28px", 500);
            show_text("00 01 10 00", 775, 281.25, "28px", 500);
        },
        "forward": function() {
            clear_all_text();
        },
    },{
        "backward": function() {
            show_text("aabaacaa", 775, 168.75, "28px", 0);
            show_text("00 00 01 00 00 10 00 00", 775, 281.25, "28px", 0);
        },
        "forward": none,
    },{
        "backward": none,
        "forward":  function() {
            d3.select('#freq-table').style('display','block').transition().style('opacity', 1);

            var t = trees['bookkeeper-1'];
            build_tree('basic', t['tree'], '', t['height'], t['root-pos'], t['gap-size']);
            svg.selectAll('.node').style('opacity', 0).style('display', 'none');
            svg.selectAll('.node-text').style('opacity', 0).style('display', 'none');
            svg.selectAll('.edge').style('opacity', 0).style('display', 'none');
        },
    },{
        "backward": function() {
            d3.select('#freq-table')
                .transition().style('opacity', 0)
                .transition().delay(200).style('display','none');

            svg.selectAll('.node').remove();
            svg.selectAll('.node-text').remove();
            svg.selectAll('.edge').remove();
        },
        "forward":  function() {
            $('#freq-table th:nth-of-type(' + 5 + '), #freq-table td:nth-of-type(' + 5 + ')').addClass('highlight');
            $('#freq-table th:nth-of-type(' + 6 + '), #freq-table td:nth-of-type(' + 6 + ')').addClass('highlight');
        },
    },{
        "backward": function() {
            $('th.highlight, td.highlight').removeClass('highlight');
        },
        "forward":  function() {
            update_freq_table([['b', 1], ['e', 3], ['k', 2], ['o', 2], ['pr', 2]]);

            show_node('#basic-9');
            show_node('#basic-10');
            show_node('#basic-11');
        },
    },{
        "backward": function() {
            update_freq_table([['b', 1], ['e', 3], ['k', 2], ['o', 2], ['p', 1], ['r', 1]]);
            $('#freq-table th:nth-of-type(' + 5 + '), #freq-table td:nth-of-type(' + 5 + ')').addClass('highlight');
            $('#freq-table th:nth-of-type(' + 6 + '), #freq-table td:nth-of-type(' + 6 + ')').addClass('highlight');

            hide_node('#basic-9', 100);
            hide_node('#basic-10', 100);
            hide_node('#basic-11', 100);
        },
        "forward":  function() {
            $('#freq-table th:nth-of-type(' + 5 + '), #freq-table td:nth-of-type(' + 5 + ')').addClass('highlight');
            $('#freq-table th:nth-of-type(' + 1 + '), #freq-table td:nth-of-type(' + 1 + ')').addClass('highlight');
        },
    },{
        "backward": function() {
            $('#freq-table th, #freq-table td').removeClass('highlight');
        },
        "forward":  function() {
            update_freq_table([['bpr', 3], ['e', 3], ['k', 2], ['o', 2]]);

            show_node('#basic-5');
            show_node('#basic-8');
        },
    },{
        "backward": function() {
            update_freq_table([['b', 1], ['e', 3], ['k', 2], ['o', 2], ['pr', 2]]);

            $('#freq-table th:nth-of-type(' + 5 + '), #freq-table td:nth-of-type(' + 5 + ')').addClass('highlight');
            $('#freq-table th:nth-of-type(' + 1 + '), #freq-table td:nth-of-type(' + 1 + ')').addClass('highlight');

            hide_node('#basic-5', 100);
            hide_node('#basic-8', 100);
        },
        "forward":  function() {
            update_freq_table([['bpr', 3], ['e', 3], ['ko', 4]]);

            show_node('#basic-3');
            show_node('#basic-6');
            show_node('#basic-7');
        },
    },{
        "backward": function() {
            update_freq_table([['bpr', 3], ['e', 3], ['k', 2], ['o', 2]]);

            hide_node('#basic-3', 100);
            hide_node('#basic-6', 100);
            hide_node('#basic-7', 100);
        },
        "forward":  function() {
            update_freq_table([['bepr', 6], ['ko', 4]]);

            show_node('#basic-2');
            show_node('#basic-4');
        },
    },{
        "backward": function() {
            update_freq_table([['bpr', 3], ['e', 3], ['ko', 4]]);

            hide_node('#basic-2', 100);
            hide_node('#basic-4', 100);
        },
        "forward":  function() {
            update_freq_table([['bekopr', 10]]);

            show_node('#basic-1');
        },
    },{
        "backward": function() {
            update_freq_table([['bepr', 6], ['ko', 4]]);

            hide_node('#basic-1', 100);
        },
        "forward":  function() {
            d3.select('#freq-table')
                .transition().style('opacity', 0)
                .transition().delay(200).style('display','none');
        },
    },{
        "backward": function() {
            d3.select('#freq-table').style('display', 'block').transition().style('opacity', 1);
        },
        "forward":  function() {
            svg.select('.node#basic-1').transition().style('fill', '#5a79e6');
            svg.select('.node#basic-2').transition().delay(200).style('fill', '#5a79e6');
            svg.select('.node#basic-5').transition().delay(400).style('fill', '#5a79e6');
            svg.select('.node#basic-9').transition().delay(600).style('fill', '#5a79e6');
            svg.select('.node#basic-10').transition().delay(800).style('fill', '#5a79e6');

            show_text("p = 0110", 775, 427.5, "28px", 1250);
        },
    },{
        "backward": function() {
            svg.selectAll('.node').transition().style('fill', '#2e3037');
            clear_all_text();
        },
        "forward":  function() {
            svg.selectAll('.node').transition().style('fill', '#2e3037');
            clear_all_text();

            svg.select('.node#basic-1').transition().delay(200).style('fill', '#5a79e6');
            svg.select('.node#basic-3').transition().delay(400).style('fill', '#5a79e6');
            svg.select('.node#basic-6').transition().delay(600).style('fill', '#5a79e6');

            show_text("k = 10", 775, 427.5, "28px", 1000);
        },
    },{
        "backward": function() {
            svg.selectAll('.node').transition().style('fill', '#2e3037');
            clear_all_text();

            svg.select('.node#basic-1').transition().delay(150).style('fill', '#5a79e6');
            svg.select('.node#basic-2').transition().delay(150).style('fill', '#5a79e6');
            svg.select('.node#basic-5').transition().delay(150).style('fill', '#5a79e6');
            svg.select('.node#basic-9').transition().delay(150).style('fill', '#5a79e6');
            svg.select('.node#basic-10').transition().delay(150).style('fill', '#5a79e6');

            show_text("p = 0110", 775, 427.5, "28px", 500);
        },
        "forward":  function() {
            svg.selectAll('.node').transition().style('fill', '#2e3037');
            clear_all_text();
        },
    },{
        "backward": function() {
            svg.select('.node#basic-1').transition().style('fill', '#5a79e6');
            svg.select('.node#basic-3').transition().style('fill', '#5a79e6');
            svg.select('.node#basic-6').transition().style('fill', '#5a79e6');

            show_text("k = 10", 775, 427.5, "28px", 250);
        },
        "forward":  none,
    },{
        "backward": none,
        "forward":  function() {
            svg.selectAll('.node').remove();
            svg.selectAll('.node-text').remove();
            svg.selectAll('.edge').remove();
        },
    },{
        "backward": function() {
            svg.selectAll('.node').remove();
            svg.selectAll('.node-text').remove();
            svg.selectAll('.edge').remove();

            var t = trees['bookkeeper-1'];
            build_tree('basic', t['tree'], '', t['height'], t['root-pos'], t['gap-size']);
        },
        "forward":  none,
    },{
        "backward": none,
        "forward":  none,
    },{
        "backward": none,
        "forward":  none,
    },{
        "backward": none,
        "forward":  function() {
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
        "backward": function() {
            svg.selectAll('*').transition().style('opacity', 0).transition().delay(250).remove();
        },
        "forward":  function() {
            svg.selectAll('.sib-tree-1').transition().style('opacity', 0).transition().style('display', 'none');

            var [n1, t1] = new_circ_node(225, 150 - 37.5, "a", 12, 12, 'swp_ex2-1');
            var [n2, t2] = new_circ_node(175, 225 - 37.5, "b",  4,  7, 'swp_ex2-2');
            var [n3, t3] = new_circ_node(275, 225 - 37.5, "c",  8,  8, 'swp_ex2-3');
            var [n4, t4] = new_circ_node(225, 300 - 37.5, "d",  3,  6, 'swp_ex2-4');
            var [n5, t5] = new_circ_node(325, 300 - 37.5, "e",  6,  4, 'swp_ex2-5');
            var [n6, t6] = new_circ_node(275, 375 - 37.5, "f",  2,  2, 'swp_ex2-6');
            var [n7, t7] = new_circ_node(175, 375 - 37.5, "g",  1,  1, 'swp_ex2-7');

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
    },{
        "backward": function() {
            svg.selectAll('.sib-tree-2').transition().style('opacity', 0).transition().delay(250).remove();

            svg.selectAll('.sib-tree-1').style('display','block').transition().delay(250).style('opacity', 1);
        },
        "forward":  function() {
            swap_subtrees('swp_ex2', [5],[4,6,7]);
        },
    },{
        "backward": function() {
            swap_subtrees('swp_ex2', [4],[5,6,7]);
        },
        "forward":  function() {
            svg.selectAll('.sib-tree-2').transition().style('opacity', 0).transition().style('display', 'none');

            var [n, t] = new_rect_node(225, 225, "-", 0, "-,0", "fgk-0");

            n.style('opacity', 0).transition().delay(250).style('opacity', 1);
            t.style('opacity', 0).transition().delay(250).style('opacity', 1);

            $('.tooltip').addClass('left');
        },
    },{
        "backward": function() {
            svg.selectAll('#fgk-0').transition().style('opacity', 0).transition().delay(250).remove();

            svg.selectAll('.sib-tree-2').style('display','block').transition().delay(250).style('opacity', 1);

            $('.tooltip').removeClass('left');
        },
        "forward":  function() {
            d3.select('#fgk-input').style('display','block').transition().style('opacity', 1);
        },
    },{
        "backward": function() {
            d3.select('#fgk-input')
                .transition().style('opacity', 0)
                .transition().delay(200).style('display','none');
        },
        "forward":  function() {
            update_fgk_input("b","ookkeeper");
        },
    },{
        "backward": function() {
            update_fgk_input("","bookkeeper");
        },
        "forward":  function() {
            insert_fgk_node('fgk', [30, 75], 'b', 1, 1, 2);
        },
    },{
        "backward": function() {
            uninsert_fgk_node('fgk', [30, 75], 1, 2)
        },
        "forward":  function() {
            console.log('centering: ', center_subtree('fgk', [1,2,0]));
        },
    },{
        "backward": function() {
            move_subtree('fgk', [1,2,0], 0, 36.25);
        },
        "forward":  function() {
            update_fgk_input("bo","okkeeper");
            insert_fgk_node('fgk', [30, 75], 'o', 1, 3, 4);
            remap_ids('fgk', [2,3], [3,2]);
        },
    },{
        "backward": function() {
            update_fgk_input("b","ookkeeper");
            uninsert_fgk_node('fgk', [30, 75], 2, 4);
            remap_ids('fgk', [2,3], [3,2]);
        },
        "forward":  function() {
            update_fgk_input("boo","kkeeper");
            update_node_values('fgk',[1],[2]);
            console.log('centering: ', center_subtree('fgk', [1,2,3,4,0]));
        },
    },{
        "backward": function() {
            update_fgk_input("bo","okkeeper");
            update_node_values('fgk',[1],[1]);
            move_subtree('fgk', [1,2,3,4,0], -15, 37.5);
        },
        "forward":  function() {
            update_node_values('fgk',[4],[2]);

            svg.select('.node#fgk-3').style('fill', '#af3131');
            svg.select('.node#fgk-4').style('fill', '#af3131');
        },
    },{
        "backward": function() {
            update_node_values('fgk',[4],[1]);

            svg.select('.node#fgk-3').style('fill', '#2e3037');
            svg.select('.node#fgk-4').style('fill', '#2e3037');
        },
        "forward":  function() {
            svg.select('.node#fgk-3').style('fill', '#2e3037');
            svg.select('.node#fgk-4').style('fill', '#2e3037');

            swap_subtrees('fgk', [3], [4]);

            update_node_values('fgk',[1],[3]);

            update_fgk_input("book", "keeper");
        },
    },{
        "backward": function() {
            svg.select('.node#fgk-3').style('fill', '#af3131');
            svg.select('.node#fgk-4').style('fill', '#af3131');

            swap_subtrees('fgk', [3], [4]);

            update_node_values('fgk',[1],[2]);

            update_fgk_input("boo", "kkeeper");
        },
        "forward":  function() {
            insert_fgk_node('fgk', [30, 75], 'k', 1, 5, 6);
            remap_ids('fgk', [5,4], [4,5]);
        },
    },{
        "backward": function() {
            remap_ids('fgk', [5,4], [4,5]);
            uninsert_fgk_node('fgk', [30, 75], 5, 6);
        },
        "forward":  function() {
            console.log('centering: ', center_subtree('fgk', [1,2,3,4,5,6,0]));
            update_node_values('fgk',[1,2],[4,2]);

            update_fgk_input("bookk", "eeper");
        },
    },{
        "backward": function() {
            update_node_values('fgk',[1,2],[3,1]);
            move_subtree('fgk', [1,2,3,4,5,6,0], -15, 37.5);

            update_fgk_input("book", "keeper");
        },
        "forward":  function() {
            update_node_values('fgk',[6],[2]);

            svg.select('.node#fgk-5').style('fill', '#af3131');
            svg.select('.node#fgk-6').style('fill', '#af3131');
        },
    },{
        "backward": function() {
            update_node_values('fgk',[6],[1]);

            svg.select('.node#fgk-5').style('fill', '#2e3037');
            svg.select('.node#fgk-6').style('fill', '#2e3037');
        },
        "forward":  function() {
            svg.select('.node#fgk-5').style('fill', '#2e3037');
            svg.select('.node#fgk-6').style('fill', '#2e3037');

            swap_subtrees('fgk', [5], [6]);

            update_node_values('fgk',[2],[3]);

            svg.select('.node#fgk-2').style('fill', '#af3131');
            svg.select('.node#fgk-3').style('fill', '#af3131');
        },
    },{
        "backward": function() {
            svg.select('.node#fgk-5').style('fill', '#af3131');
            svg.select('.node#fgk-6').style('fill', '#af3131');

            swap_subtrees('fgk', [5], [6]);

            update_node_values('fgk',[2],[2]);

            svg.select('.node#fgk-2').style('fill', '#2e3037');
            svg.select('.node#fgk-3').style('fill', '#2e3037');           
        },
        "forward":  function() {
            svg.select('.node#fgk-2').style('fill', '#2e3037');
            svg.select('.node#fgk-3').style('fill', '#2e3037');

            swap_subtrees('fgk', [2,4,5,6,0], [3]);

            update_node_values('fgk',[1],[5]);

            update_fgk_input("bookke", "eper");
        },
    },{
        "backward": function() {
            svg.select('.node#fgk-2').style('fill', '#af3131');
            svg.select('.node#fgk-3').style('fill', '#af3131');

            swap_subtrees('fgk', [3,4,5,6,0], [2]);

            update_node_values('fgk',[1],[4]);

            update_fgk_input("bookk", "eeper");
        },
        "forward":  function() {
            insert_fgk_node('fgk', [30, 75], 'e', 1, 7, 8);
            remap_ids('fgk', [6,7], [7,6]);
        },
    },{
        "backward": function() {
            remap_ids('fgk', [6,7], [7,6]);
            uninsert_fgk_node('fgk', [30, 75], 7, 8);
        },
        "forward":  function() {
            console.log('centering: ', center_subtree('fgk', [1,2,3,4,5,6,7,8,0]));
            update_node_values('fgk',[4,3,1],[2,4,6]);

            update_fgk_input("bookkee", "per");

            timeout = setTimeout(function() {
                move_subtree_connected('fgk', [2], -20, 0);
                move_subtree_connected('fgk', [3,4,5,6,7,8,0], 20, 0);
            },300);
        },
    },{
        "backward": function() {
            update_node_values('fgk',[4,3,1],[1,3,5]);
            move_subtree('fgk', [1,2,3,4,5,6,7,8,0], 30, 37.875);

            update_fgk_input("bookke", "eper");

            timeout = setTimeout(function() {
                move_subtree_connected('fgk', [2], 20, 0);
                move_subtree_connected('fgk', [3,4,5,6,7,8,0], -20, 0);
            },300);
        },
        "forward":  function() {
            update_node_values('fgk',[8],[2]);

            svg.select('.node#fgk-7').style('fill', '#af3131');
            svg.select('.node#fgk-8').style('fill', '#af3131');
        },
    },{
        "backward": function() {
            update_node_values('fgk',[8],[1]);

            svg.select('.node#fgk-7').style('fill', '#2e3037');
            svg.select('.node#fgk-8').style('fill', '#2e3037');
        },
        "forward":  function() {
            svg.select('.node#fgk-7').style('fill', '#2e3037');
            svg.select('.node#fgk-8').style('fill', '#2e3037');

            swap_subtrees('fgk', [7], [8]);

            update_node_values('fgk',[4],[3]);

            svg.select('.node#fgk-2').style('fill', '#af3131');
            svg.select('.node#fgk-4').style('fill', '#af3131');
        },
    },{
        "backward": function() {
            svg.select('.node#fgk-7').style('fill', '#af3131');
            svg.select('.node#fgk-8').style('fill', '#af3131');

            swap_subtrees('fgk', [7], [8]);

            update_node_values('fgk',[4],[2]);

            svg.select('.node#fgk-2').style('fill', '#2e3037');
            svg.select('.node#fgk-4').style('fill', '#2e3037');           
        },
        "forward":  function() {
            swap_subtrees('fgk', [2], [4,6,7,8,0]);

            remap_ids('fgk', [6,7,4,5], [4,5,6,7]);

            update_node_values('fgk',[1],[7]);

            svg.select('.node#fgk-2').style('fill', '#2e3037');
            svg.select('.node#fgk-6').style('fill', '#2e3037');

            update_fgk_input("bookkeep", "er");
        },
    },{
        "backward": function() {
            svg.select('.node#fgk-2').style('fill', '#af3131');
            svg.select('.node#fgk-6').style('fill', '#af3131');

            swap_subtrees('fgk', [2,4,5,8,0], [6]);

            remap_ids('fgk', [4,5,6,7], [6,7,4,5]);

            update_node_values('fgk',[1],[6]);

            update_fgk_input("bookkee", "per");
        },
        "forward":  function() {
            insert_fgk_node('fgk', [30, 75], 'p', 1, 9, 10);
            remap_ids('fgk', [8,9], [9,8]);
        },
    },{
        "backward": function() {
            remap_ids('fgk', [8,9], [9,8]);
            uninsert_fgk_node('fgk', [30, 75], 9, 10);
        },
        "forward":  function() {
            update_node_values('fgk',[4,2,1],[2,4,8]);

            update_fgk_input("bookkeepe", "r");
        },
    },{
        "backward": function() {
            update_node_values('fgk',[4,2,1],[1,3,7]);

            update_fgk_input("bookkeep", "er");
        },
        "forward":  function() {
            update_node_values('fgk',[5],[3]);

            svg.select('.node#fgk-5').style('fill', '#af3131');
            svg.select('.node#fgk-7').style('fill', '#af3131');
        },
    },{
        "backward": function() {
            update_node_values('fgk',[5],[2]);

            svg.select('.node#fgk-5').style('fill', '#2e3037');
            svg.select('.node#fgk-7').style('fill', '#2e3037');
        },
        "forward":  function() {
            svg.select('.node#fgk-5').style('fill', '#2e3037');
            svg.select('.node#fgk-7').style('fill', '#2e3037');

            swap_subtrees('fgk', [5], [7]);

            update_node_values('fgk',[3,1],[5,9]);

            update_fgk_input("bookkeeper", "");
        },
    },{
        "backward": function() {
            svg.select('.node#fgk-5').style('fill', '#af3131');
            svg.select('.node#fgk-7').style('fill', '#af3131');

            swap_subtrees('fgk', [5], [7]);

            update_node_values('fgk',[3,1],[4,8]);

            update_fgk_input("bookkeepe", "r");           
        },
        "forward":  function() {
            move_subtree('fgk', [1,2,3,4,5,6,7,8,9,10,0], 0, -31.875);

            timeout = setTimeout(function() {
                insert_fgk_node('fgk', [30, 75], 'r', 1, 11, 12);
                remap_ids('fgk', [10,11], [11,10]);
            },500);
        },
    },{
        "backward": function() {
            remap_ids('fgk', [10,11], [11,10]);
            uninsert_fgk_node('fgk', [30, 75], 11, 12);

            setTimeout(function() {
                svg.select('.edge#fgk-11-0').remove()
                move_subtree('fgk', [1,2,3,4,5,6,7,8,9,10,0], 0, 31.875);
            },500);
        },
        "forward":  function() {
            update_node_values('fgk',[8],[2]);

            svg.select('.node#fgk-8').style('fill', '#af3131');
            svg.select('.node#fgk-9').style('fill', '#af3131');
        },
    },{
        "backward": function() {
            update_node_values('fgk',[8],[1]);

            svg.select('.node#fgk-8').style('fill', '#2e3037');
            svg.select('.node#fgk-9').style('fill', '#2e3037');
        },
        "forward":  function() {
            svg.select('.node#fgk-8').style('fill', '#2e3037');
            svg.select('.node#fgk-9').style('fill', '#2e3037');

            swap_subtrees('fgk', [8,10,11,12,0], [9]);

            update_node_values('fgk',[4],[3]);

            svg.select('.node#fgk-4').style('fill', '#af3131');
            svg.select('.node#fgk-6').style('fill', '#af3131');
        },
    },{
        "backward": function() {
            svg.select('.node#fgk-8').style('fill', '#af3131');
            svg.select('.node#fgk-9').style('fill', '#af3131');

            swap_subtrees('fgk', [9,10,11,12,0], [8]);

            update_node_values('fgk',[4],[2]); 

            svg.select('.node#fgk-4').style('fill', '#2e3037');
            svg.select('.node#fgk-6').style('fill', '#2e3037');          
        },
        "forward":  function() {
            svg.select('.node#fgk-4').style('fill', '#2e3037');
            svg.select('.node#fgk-6').style('fill', '#2e3037');

            swap_subtrees('fgk', [4,8,9,10,11,12,0], [6]);

            update_node_values('fgk',[3,1],[6,10]);
        },
    },{
        "backward": function() {
            svg.select('.node#fgk-4').style('fill', '#af3131');
            svg.select('.node#fgk-6').style('fill', '#af3131');

            swap_subtrees('fgk', [6,8,9,10,11,12,0], [4]);

            update_node_values('fgk',[3,1],[5,9]); 
        },
        "forward":  function() {
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
    },{
        "backward": function() {
            d3.select('#fgk-input').style('display','block').transition().style('opacity', 1);
            update_node_values('fgk',[4,5,7,8,11,12],[2,2,3,1,1,1]); 
        },
        "forward":  none,
    },{
        "backward": none,
        "forward":  none,
    },{
        "backward": none,
        "forward":  none,
    },{
        "backward": function() {
            clearTimeout(timeout);

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
        "forward":  none,
    },{
        "backward": none,
        "forward":  none,
    },{
        "backward": none,
        "forward":  none,
    },{
        "backward": none,
        "forward":  none,
    }
]

