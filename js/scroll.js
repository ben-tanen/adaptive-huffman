function init_scrolling() {
    d3.graphScroll()
        .sections(d3.selectAll('.section'))
        .offset(20)
        .on('active', function(i){
            if (scroll_pos < i) {
                console.log('scrolling forward:', i);
                fxns[i]['forward']()
            } else {
                console.log('scrolling backward:', i);
                fxns[i]['backward']()
            }

            scroll_pos = i;
        });
}

var scroll_pos = 0;
var none = function() { return; };
var fxns = [
    { // header
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

