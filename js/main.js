$(document).ready(function() {
    $('.tab').click(function() {
        var sibs = $('.page')
        var ix   = $(this).parent().index();

        $('.tab.top').removeClass('top');
        $(sibs[ix]).find('.tab').addClass('top');

        if ($(sibs[ix]).hasClass('closed')) {
            // open everything greater than it
            for (var i = 0; i <= ix; i++) {
                $(sibs[i]).removeClass('closed');
            }
        } else {
            // close everything lesser than it
            for (var i = ix + 1; i <= 2; i++) {
                if (i == 0) continue;
                $(sibs[i]).addClass('closed');
            }
        }
    });

    var width  = $('.svg-container').width();
    var height = $('.svg-container').height();
    var svgs = d3.selectAll(".svg-container").append("svg")
                                             .attr("width", width)
                                             .attr("height", height);
});