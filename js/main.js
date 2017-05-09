$(document).ready(function() {
    $('.mask#middle').css({
        'top': 'calc(' + $('.mask#basic').css('top') + ' + ' + $('.mask#basic').css('padding-bottom') + ' + ' + $('.mask#basic').height() + 'px)'
    });
    
    $('.mask#fgk').css({
        'top': 'calc(' + $('.mask#middle').css('top') + ' + ' + $('.mask#middle').css('padding-bottom') + ' + ' + $('.mask#middle').height() + 'px)'
    });

    $('.mask#end').css({
        'top': 'calc(' + $('.mask#fgk').css('top') + ' + ' + $('.mask#fgk').css('padding-bottom') + ' + ' + $('.mask#fgk').height() + 'px)'
    });

    $('body').height(($('.mask#end').position()['top'] + $('.mask#end').height() + 800) + 'px');

    init_scrolling();

    $(window).resize(function() {
        if ($(window).width() < 1010 || $(window).height() < 550) {
            if ($('#screen-warning').css('display') != "block") screen_warning.open();
        } else {
            screen_warning.close();
        }
    });
});

var screen_warning = new jBox('Notice', {
  content: 'This page is best viewed in a larger window. Try resizing your window!',
  color: 'black',
  id: 'screen-warning'
});

var width  = $('.svg-container').width(),
    height = $('.svg-container').height();

var svg = d3.select(".svg-container").append("svg")
    .attr("width",  width)
    .attr("height", height);

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var [n1, t1] = new_circ_node(650, 100, "a", 2);
var [n2, t2] = new_rect_node(680, 150, "b", 5);
var [n3, t3] = new_rect_node(620, 150, "c", 8);
var [n4, t4] = new_circ_node(710,  50, "d", 9);
var [n5, t5] = new_circ_node(770, 100, "d", 9);
var [n6, t6] = new_rect_node(800, 150, "b", 5);
var [n7, t7] = new_rect_node(740, 150, "c", 8);

var p1 = connect_p2c(n1, n2);
var p2 = connect_p2c(n1, n3);
var p3 = connect_p2c(n4, n1);