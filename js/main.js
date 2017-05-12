$(document).ready(function() {
    $('.mask#fgk').css({
        'top': 'calc(' + $('.mask#basic').css('top') + ' + ' + $('.mask#basic').css('padding-bottom') + ' + ' + ($('.mask#basic').height() - 150) + 'px)'
    });

    $('.mask#end').css({
        'top': 'calc(' + $('.mask#fgk').css('top') + ' + ' + $('.mask#fgk').css('padding-top') + ' + ' + $('.mask#fgk').css('padding-bottom') + ' + '+ $('.mask#fgk').height() + 'px)'
    });

    $('body').height(($('.mask#end').position()['top'] + $('.mask#end').height() + 2000) + 'px');

    if ($(window).width() < 1010 || $(window).height() < 550) screen_warning.open();

    init_scrolling();
});

$(window).resize(function() {    
    $('.mask#fgk').css({
        'top': 'calc(' + $('.mask#basic').css('top') + ' + ' + $('.mask#basic').css('padding-bottom') + ' + ' + $('.mask#basic').height() + 'px)'
    });

    $('.mask#end').css({
        'top': 'calc(' + $('.mask#fgk').css('top') + ' + ' + $('.mask#fgk').css('padding-top') + ' + ' + $('.mask#fgk').css('padding-bottom') + ' + ' + $('.mask#fgk').height() + 'px)'
    });

    $('body').height(($('.mask#end').position()['top'] + $('.mask#end').height() + 2000) + 'px');
    
    if ($(window).width() < 1010 || $(window).height() < 550) {
        if ($('#screen-warning').css('display') != "block") screen_warning.open();
    } else {
        screen_warning.close();
    }

    if ($(window).scrollTop() > $('.mask#end').position()['top'] + $('.mask#end').height() - 50) {
        if ($('.word-select').css('display') == 'none') $('.word-select').fadeIn();
    } else {
        if ($('.word-select').css('display') == 'block') $('.word-select').fadeOut();
    }
});

$(window).scroll(function() {
    if ($(window).scrollTop() > $('.mask#end').position()['top'] + $('.mask#end').height() - 50) {
        if ($('.word-select').css('display') == 'none') {
            $('.word-select').fadeIn();
            $('.tooltip').removeClass('left').addClass('middle');
        }
    } else {
        if ($('.word-select').css('display') == 'block') {
            $('.word-select').fadeOut();
            $('.tooltip').removeClass('middle').addClass('left');
        }
    }
});

$('.word-select select').change(function() {
    svg.selectAll('.node').remove()
    svg.selectAll('.node-text').remove()
    svg.selectAll('.edge').remove()

    var w = $('.word-select select').val();    
    var t1 = trees[w + '-1'];
    var t2 = trees[w + '-2'];
    build_tree('basic', t1['tree'], '', t1['height'], t1['root-pos'], t1['gap-size']);
    if (t2) build_tree('fgk', t2['tree'], '', t2['height'], t2['root-pos'], t2['gap-size']);
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
