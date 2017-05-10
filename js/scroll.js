function init_scrolling() {
    d3.graphScroll()
        .sections(d3.selectAll('.section'))
        .offset(20)
        .on('active', function(i){
            if (scroll_pos < i) {
                for (var j = scroll_pos; j < i; j++) {
                    console.log('scrolling forward:', j, scroll_pos);
                    fxns[j]['forward']()
                }
            } else {
                console.log('scrolling backward:', i, scroll_pos);
                fxns[scroll_pos]['backward']()
            }

            scroll_pos = i;
        });
}

var scroll_pos = 0;
var none = function() { return; };
var fxns = [
    {
        "backward": none,
        "forward":  function() {
            var t = trees['bookkeeper'];
            build_tree('test', t['tree'], '', t['height'], t['root-pos'], t['gap-size']);
            svg.selectAll('.node').style('opacity', '0');
            svg.selectAll('.node-text').style('opacity', '0');
            svg.selectAll('.edge').style('opacity', '0');
        },
    },{
        "backward": function() {
            svg.selectAll('.node').remove();
            svg.selectAll('.node-text').remove();
            svg.selectAll('.edge').remove();
        },
        "forward":  function() {
            $('.fixed-content#freq-table').removeClass('hidden');

            svg.selectAll('.node').transition().style('opacity', '1');
            svg.selectAll('.node-text').transition().style('opacity', '1');
            svg.selectAll('.edge').transition().style('opacity', '1');
        },
    },{
        "backward": function() {
            $('.fixed-content#freq-table').addClass('hidden');

            svg.selectAll('.node').transition().style('opacity', '0');
            svg.selectAll('.node-text').transition().style('opacity', '0');
            svg.selectAll('.edge').transition().style('opacity', '0');
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

