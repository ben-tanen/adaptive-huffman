function init_scrolling() {
    d3.graphScroll()
        .sections(d3.selectAll('.section'))
        .offset(20)
        .on('active', function(i){
            if (scroll_pos < i) {
                for (var j = scroll_pos; j < i; j++) {
                    console.log('scrolling forward:', j, scroll_pos);
                    fxns[j]['forward']();
                }
            } else {
                console.log('scrolling backward:', i, scroll_pos);
                clearTimeout(timeout);
                fxns[scroll_pos]['backward']();

                if (i == 0) {
                    console.log('clearing everything');
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

            var t = trees['bookkeeper'];
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
            svg.select('.node#basic-1').transition().style('fill', '#3852ad');
            svg.select('.node#basic-2').transition().delay(200).style('fill', '#3852ad');
            svg.select('.node#basic-5').transition().delay(400).style('fill', '#3852ad');
            svg.select('.node#basic-9').transition().delay(600).style('fill', '#3852ad');
            svg.select('.node#basic-10').transition().delay(800).style('fill', '#3852ad');

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

            svg.select('.node#basic-1').transition().delay(200).style('fill', '#3852ad');
            svg.select('.node#basic-3').transition().delay(400).style('fill', '#3852ad');
            svg.select('.node#basic-6').transition().delay(600).style('fill', '#3852ad');

            show_text("k = 10", 775, 427.5, "28px", 1000);
        },
    },{
        "backward": function() {
            svg.selectAll('.node').transition().style('fill', '#2e3037');
            clear_all_text();

            svg.select('.node#basic-1').transition().delay(150).style('fill', '#3852ad');
            svg.select('.node#basic-2').transition().delay(150).style('fill', '#3852ad');
            svg.select('.node#basic-5').transition().delay(150).style('fill', '#3852ad');
            svg.select('.node#basic-9').transition().delay(150).style('fill', '#3852ad');
            svg.select('.node#basic-10').transition().delay(150).style('fill', '#3852ad');

            show_text("p = 0110", 775, 427.5, "28px", 500);
        },
        "forward":  function() {
            svg.selectAll('.node').transition().style('fill', '#2e3037');
            clear_all_text();
        },
    },{
        "backward": function() {
            svg.select('.node#basic-1').transition().style('fill', '#3852ad');
            svg.select('.node#basic-3').transition().style('fill', '#3852ad');
            svg.select('.node#basic-6').transition().style('fill', '#3852ad');

            show_text("k = 10", 775, 427.5, "28px", 250);
        },
        "forward":  function() {
            console.log('onto adaptive');
        },
    },{
        "backward": function() {
            svg.selectAll('.node').remove();
            svg.selectAll('.node-text').remove();
            svg.selectAll('.edge').remove();

            var t = trees['bookkeeper'];
            build_tree('basic', t['tree'], '', t['height'], t['root-pos'], t['gap-size']);
        },
        "forward":  function() {
            svg.selectAll('.node').remove();
            svg.selectAll('.node-text').remove();
            svg.selectAll('.edge').remove();

            var t = trees['bookkeeper'];
            build_tree('basic', t['tree'], '', t['height'], t['root-pos'], t['gap-size']);

            $('.word-select select').val('bookkeeper');
        },
    },{
        "backward": none,
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

