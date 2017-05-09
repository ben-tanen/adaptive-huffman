function init_scrolling() {
    d3.graphScroll()
        .sections(d3.selectAll('.section'))
        .offset(20)
        .on('active', function(i){
            console.log(i + 'th section active');

            if (i == 1) {
                [n2, t2] = move_node([n2, t2], 50, 50);
            }
        });
}

