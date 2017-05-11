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

function clear_text() {
    svg.selectAll('text')
        .transition()
        .style('opacity', 0)
        .remove();
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
            svg.append("text")
                .attr("x", 775)
                .attr("y", 168.75)
                .text("abca")
                .style("font-family", "Roboto Mono")
                .style("font-size", "28px")
                .style("text-anchor", "middle")
                .style("fill", "#39C0BA")
                .style("opacity", 0)
                .transition()
                .style("opacity", 1);

            svg.append("text")
                .attr("x", 775)
                .attr("y", 281.25)
                .text("00 01 10 00")
                .style("font-family", "Roboto Mono")
                .style("font-size", "28px")
                .style("text-anchor", "middle")
                .style("fill", "#39C0BA")
                .style("opacity", 0)
                .transition()
                .delay(500)
                .style("opacity", 1);
        },
    },{
        "backward": function() {
            clear_text();
        },
        "forward": function() {
            clear_text();

            svg.append("text")
                .attr("x", 775)
                .attr("y", 168.75)
                .text("aabaacaa")
                .style("font-family", "Roboto Mono")
                .style("font-size", "28px")
                .style("text-anchor", "middle")
                .style("fill", "#39C0BA")
                .style("opacity", 0)
                .transition()
                .delay(500)
                .style("opacity", 1);

            svg.append("text")
                .attr("x", 775)
                .attr("y", 281.25)
                .text("00 00 01 00 00 10 00 00")
                .style("font-family", "Roboto Mono")
                .style("font-size", "28px")
                .style("text-anchor", "middle")
                .style("fill", "#39C0BA")
                .style("opacity", 0)
                .transition()
                .delay(1000)
                .style("opacity", 1);
        },
    },{
        "backward": function() {
            clear_text();

            svg.append("text")
                .attr("x", 775)
                .attr("y", 168.75)
                .text("abca")
                .style("font-family", "Roboto Mono")
                .style("font-size", "28px")
                .style("text-anchor", "middle")
                .style("fill", "#39C0BA")
                .style("opacity", 0)
                .transition()
                .delay(500)
                .style("opacity", 1);

            svg.append("text")
                .attr("x", 775)
                .attr("y", 281.25)
                .text("00 01 10 00")
                .style("font-family", "Roboto Mono")
                .style("font-size", "28px")
                .style("text-anchor", "middle")
                .style("fill", "#39C0BA")
                .style("opacity", 0)
                .transition()
                .delay(500)
                .style("opacity", 1);
        },
        "forward": function() {
            clear_text();
        },
    },{
        "backward": function() {
            svg.append("text")
                .attr("x", 775)
                .attr("y", 168.75)
                .text("aabaacaa")
                .style("font-family", "Roboto Mono")
                .style("font-size", "28px")
                .style("text-anchor", "middle")
                .style("fill", "#39C0BA")
                .style("opacity", 0)
                .transition()
                .style("opacity", 1);

            svg.append("text")
                .attr("x", 775)
                .attr("y", 281.25)
                .text("00 00 01 00 00 10 00 00")
                .style("font-family", "Roboto Mono")
                .style("font-size", "28px")
                .style("text-anchor", "middle")
                .style("fill", "#39C0BA")
                .style("opacity", 0)
                .transition()
                .style("opacity", 1);
        },
        "forward": none,
    },{
        "backward": none,
        "forward":  function() {
            $('#freq-table').removeClass('hidden');

            var t = trees['bookkeeper'];
            build_tree('basic', t['tree'], '', t['height'], t['root-pos'], t['gap-size']);
            svg.selectAll('.node').style('opacity', 0).style('display', 'none');
            svg.selectAll('.node-text').style('opacity', 0).style('display', 'none');
            svg.selectAll('.edge').style('opacity', 0).style('display', 'none');
        },
    },{
        "backward": function() {
            $('#freq-table').addClass('hidden');

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

            svg.selectAll( '#basic-9').style('display', 'initial').transition().style('opacity', 1);
            svg.selectAll('#basic-11').style('display', 'initial').transition().style('opacity', 1);
            svg.selectAll('#basic-10').style('display', 'initial').transition().style('opacity', 1);
            svg.selectAll('#basic-11').style('display', 'initial').transition().style('opacity', 1);
            svg.select('.edge#basic-9-10').style('display', 'initial').transition().style('opacity', 1);
            svg.select('.edge#basic-9-11').style('display', 'initial').transition().style('opacity', 1);
        },
    },{
        "backward": function() {
            update_freq_table([['b', 1], ['e', 3], ['k', 2], ['o', 2], ['p', 1], ['r', 1]]);
            $('#freq-table th:nth-of-type(' + 5 + '), #freq-table td:nth-of-type(' + 5 + ')').addClass('highlight');
            $('#freq-table th:nth-of-type(' + 6 + '), #freq-table td:nth-of-type(' + 6 + ')').addClass('highlight');

            svg.selectAll('.node')
                .transition().style('opacity', 0)
                .transition().delay(100).style('display', 'none');
            svg.selectAll('.node-text')
                .transition().style('opacity', 0)
                .transition().delay(100).style('display', 'none');
            svg.selectAll('.edge')
                .transition().style('opacity', 0)
                .transition().delay(100).style('display', 'none');
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

            svg.selectAll('#basic-5').style('display', 'initial').transition().style('opacity', 1);
            svg.selectAll('#basic-8').style('display', 'initial').transition().style('opacity', 1);
            svg.select('.edge#basic-5-8').style('display', 'initial').transition().style('opacity', 1);
            svg.select('.edge#basic-5-9').style('display', 'initial').transition().style('opacity', 1);
        },
    },{
        "backward": function() {
            update_freq_table([['b', 1], ['e', 3], ['k', 2], ['o', 2], ['pr', 2]]);

            $('#freq-table th:nth-of-type(' + 5 + '), #freq-table td:nth-of-type(' + 5 + ')').addClass('highlight');
            $('#freq-table th:nth-of-type(' + 1 + '), #freq-table td:nth-of-type(' + 1 + ')').addClass('highlight');

            svg.selectAll('#basic-5')
                .transition().style('opacity', 0)
                .transition().delay(100).style('display', 'none');
            svg.selectAll('#basic-8')
                .transition().style('opacity', 0)
                .transition().delay(100).style('display', 'none');
            svg.select('.edge#basic-5-8')
                .transition().style('opacity', 0)
                .transition().delay(100).style('display', 'none');
            svg.select('.edge#basic-5-9')
                .transition().style('opacity', 0)
                .transition().delay(100).style('display', 'none');
        },
        "forward":  function() {
            update_freq_table([['bpr', 3], ['e', 3], ['ko', 4]]);

            svg.selectAll('#basic-3').style('display', 'initial').transition().style('opacity', 1);
            svg.selectAll('#basic-6').style('display', 'initial').transition().style('opacity', 1);
            svg.selectAll('#basic-7').style('display', 'initial').transition().style('opacity', 1);
            svg.select('.edge#basic-3-6').style('display', 'initial').transition().style('opacity', 1);
            svg.select('.edge#basic-3-7').style('display', 'initial').transition().style('opacity', 1);
        },
    },{
        "backward": function() {
            update_freq_table([['bpr', 3], ['e', 3], ['k', 2], ['o', 2]]);

            svg.selectAll('#basic-3')
                .transition().style('opacity', 0)
                .transition().delay(100).style('display', 'none');
            svg.selectAll('#basic-6')
                .transition().style('opacity', 0)
                .transition().delay(100).style('display', 'none');
            svg.selectAll('#basic-7')
                .transition().style('opacity', 0)
                .transition().delay(100).style('display', 'none');
            svg.select('.edge#basic-3-6')
                .transition().style('opacity', 0)
                .transition().delay(100).style('display', 'none');
            svg.select('.edge#basic-3-7')
                .transition().style('opacity', 0)
                .transition().delay(100).style('display', 'none');
        },
        "forward":  function() {
            update_freq_table([['bepr', 6], ['ko', 4]]);

            svg.selectAll('#basic-2').style('display', 'initial').transition().style('opacity', 1);
            svg.selectAll('#basic-4').style('display', 'initial').transition().style('opacity', 1);
            svg.select('.edge#basic-2-4').style('display', 'initial').transition().style('opacity', 1);
            svg.select('.edge#basic-2-5').style('display', 'initial').transition().style('opacity', 1);
        },
    },{
        "backward": function() {
            update_freq_table([['bpr', 3], ['e', 3], ['ko', 4]]);

            svg.selectAll('#basic-2')
                .transition().style('opacity', 0)
                .transition().delay(100).style('display', 'none');
            svg.selectAll('#basic-4')
                .transition().style('opacity', 0)
                .transition().delay(100).style('display', 'none');
            svg.select('.edge#basic-2-4')
                .transition().style('opacity', 0)
                .transition().delay(100).style('display', 'none');
            svg.select('.edge#basic-2-5')
                .transition().style('opacity', 0)
                .transition().delay(100).style('display', 'none');
        },
        "forward":  function() {
            update_freq_table([['bekopr', 10]]);

            svg.selectAll('#basic-1').style('display', 'initial').transition().style('opacity', 1);
            svg.select('.edge#basic-1-2').style('display', 'initial').transition().style('opacity', 1);
            svg.select('.edge#basic-1-3').style('display', 'initial').transition().style('opacity', 1);
        },
    },{
        "backward": function() {
            update_freq_table([['bepr', 6], ['ko', 4]]);

            svg.selectAll('#basic-1')
                .transition().style('opacity', 0)
                .transition().delay(100).style('display', 'none');
            svg.select('.edge#basic-1-2')
                .transition().style('opacity', 0)
                .transition().delay(100).style('display', 'none');
            svg.select('.edge#basic-1-3')
                .transition().style('opacity', 0)
                .transition().delay(100).style('display', 'none');
        },
        "forward":  function() {
            $('#freq-table').addClass('hidden');
        },
    },{
        "backward": function() {
            $('#freq-table').removeClass('hidden');
        },
        "forward":  function() {
            svg.select('.node#basic-1').transition().style('fill', '#3852ad');
            svg.select('.node#basic-2').transition().delay(200).style('fill', '#3852ad');
            svg.select('.node#basic-5').transition().delay(400).style('fill', '#3852ad');
            svg.select('.node#basic-9').transition().delay(600).style('fill', '#3852ad');
            svg.select('.node#basic-10').transition().delay(800).style('fill', '#3852ad');

            svg.append("text")
                .attr("x", 775)
                .attr("y", 393.75)
                .text("p = 0110")
                .style("font-family", "Roboto Mono")
                .style("font-size", "28px")
                .style("text-anchor", "middle")
                .style("fill", "#39C0BA")
                .style("opacity", 0)
                .transition()
                .delay(1250)
                .style("opacity", 1);
        },
    },{
        "backward": function() {
            svg.selectAll('.node').transition().style('fill', 'initial');
            svg.selectAll('text').filter(function() {
                return d3.select(this).text() === "p = 0110";
            })
                .transition().style('opacity', 0)
                .transition().delay(150).remove();
        },
        "forward":  function() {
            svg.selectAll('.node').transition().style('fill', 'initial');
            svg.selectAll('text').filter(function() {
                return d3.select(this).text() === "p = 0110";
            })
                .transition().style('opacity', 0)
                .transition().delay(150).remove();

            svg.select('.node#basic-1').transition().delay(200).style('fill', '#3852ad');
            svg.select('.node#basic-3').transition().delay(400).style('fill', '#3852ad');
            svg.select('.node#basic-6').transition().delay(600).style('fill', '#3852ad');

            svg.append("text")
                .attr("x", 775)
                .attr("y", 393.75)
                .text("k = 10")
                .style("font-family", "Roboto Mono")
                .style("font-size", "28px")
                .style("text-anchor", "middle")
                .style("fill", "#39C0BA")
                .style("opacity", 0)
                .transition()
                .delay(1000)
                .style("opacity", 1);
        },
    },{
        "backward": function() {
            svg.selectAll('.node').transition().style('fill', 'initial');
            svg.selectAll('text').filter(function() {
                return d3.select(this).text() === "k = 10";
            })
                .transition().style('opacity', 0)
                .transition().delay(150).remove();

            svg.select('.node#basic-1').transition().delay(150).style('fill', '#3852ad');
            svg.select('.node#basic-2').transition().delay(150).style('fill', '#3852ad');
            svg.select('.node#basic-5').transition().delay(150).style('fill', '#3852ad');
            svg.select('.node#basic-9').transition().delay(150).style('fill', '#3852ad');
            svg.select('.node#basic-10').transition().delay(150).style('fill', '#3852ad');

            svg.append("text")
                .attr("x", 775)
                .attr("y", 393.75)
                .text("p = 0110")
                .style("font-family", "Roboto Mono")
                .style("font-size", "28px")
                .style("text-anchor", "middle")
                .style("fill", "#39C0BA")
                .style("opacity", 0)
                .transition()
                .delay(500)
                .style("opacity", 1);
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

