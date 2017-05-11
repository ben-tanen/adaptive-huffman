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
