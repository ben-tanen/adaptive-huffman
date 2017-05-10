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

    if ($(window).width() < 1010 || $(window).height() < 550) screen_warning.open();

    init_scrolling();
});

$(window).resize(function() {
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
    
    if ($(window).width() < 1010 || $(window).height() < 550) {
        if ($('#screen-warning').css('display') != "block") screen_warning.open();
    } else {
        screen_warning.close();
    }
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

/*
var [ n1,  t1] = new_circ_node(775 + horz_offset(5,    "", 20, 1.75), 126.25 + vert_offset(    "", 50), "bokepr", 10, "10");
var [ n2,  t2] = new_circ_node(775 + horz_offset(5,   "0", 20, 1.75), 126.25 + vert_offset(   "0", 50), "bepr",    6,  "6");
var [ n3,  t3] = new_circ_node(775 + horz_offset(5,   "1", 20, 1.75), 126.25 + vert_offset(   "1", 50), "ok",      4,  "4");
var [ n4,  t4] = new_rect_node(775 + horz_offset(5,  "00", 20, 1.75), 126.25 + vert_offset(  "00", 50), "e",       3,  "e");
var [ n5,  t5] = new_circ_node(775 + horz_offset(5,  "01", 20, 1.75), 126.25 + vert_offset(  "01", 50), "bpr",     3,  "3");
var [ n6,  t6] = new_rect_node(775 + horz_offset(5,  "10", 20, 1.75), 126.25 + vert_offset(  "10", 50), "o",       2,  "o");
var [ n7,  t7] = new_rect_node(775 + horz_offset(5,  "11", 20, 1.75), 126.25 + vert_offset(  "11", 50), "k",       2,  "k");
var [ n8,  t8] = new_rect_node(775 + horz_offset(5, "010", 20, 1.75), 126.25 + vert_offset( "010", 50), "b",       1,  "b");
var [ n9,  t9] = new_circ_node(775 + horz_offset(5, "011", 20, 1.75), 126.25 + vert_offset( "011", 50), "pr",      2,  "2");
var [n10, t10] = new_rect_node(775 + horz_offset(5,"0110", 20, 1.75), 126.25 + vert_offset("0110", 50), "p",       1,  "p");
var [n11, t11] = new_rect_node(775 + horz_offset(5,"0111", 20, 1.75), 126.25 + vert_offset("0111", 50), "o",       1,  "o");

var p1  = connect_p2c(n1, n2);
var p2  = connect_p2c(n1, n3);
var p3  = connect_p2c(n2, n4);
var p4  = connect_p2c(n2, n5);
var p5  = connect_p2c(n3, n6);
var p6  = connect_p2c(n3, n7);
var p7  = connect_p2c(n5, n8);
var p8  = connect_p2c(n5, n9);
var p9  = connect_p2c(n9, n10);
var p10 = connect_p2c(n9, n11);
*/


