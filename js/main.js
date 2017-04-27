$(document).ready(function() {
    $('.tab').click(function() {
        var sibs = $('.page')
        var ix   = $(this).parent().index();

        if ($(this).parent().hasClass('closed')) {
            // open everything greater than it
            for (var i = 0; i <= ix; i++) {
                $(sibs[i]).removeClass('closed');
            }
        } else {
            // close everything lesser than it
            for (var i = ix; i <= 2; i++) {
                $(sibs[i]).addClass('closed');
            }
        }
    });

    var width  = 805;
    var height = 480;
    var svgs = d3.selectAll(".svg-container").append("svg")
                                             .attr("width", width)
                                             .attr("height", height);
});