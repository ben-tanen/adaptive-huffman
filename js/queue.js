var event_queue = [ ];

function addToQueue(f, d) {
    event_queue.push({
        "f": f,
        "d": d,
        "r": false,
    });
}

setInterval(function() {
    if (event_queue.length > 0 && !event_queue[0]['r']) {
        event_queue[0]['r'] = true;
        event_queue[0]['f']();

        setTimeout(function() {
            event_queue.splice(0,1);
        }, event_queue[0]['d']);
    }
}, 1);

