function sort_dict_keys(d) {
    var sortable = [ ];
    for (var k in d) sortable.push([k, d[k]]);
    sortable.sort(function(a, b) {
        return a[1] - b[1];
    });
    return sortable.map(function(a) { return a[0]; });
}

/*********************/
/*** BASIC HUFFMAN ***/
/*********************/

// given a dictionary of characters and frequencies
// output the huffman hierarchy
function huffman_tree(cs) {
    // convert dict to tree of leaves
    var t = [ ];
    for (c in cs) {
        t.push({"key": c, "val": cs[c], "children": [ ]});
    }

    // repeat until only one key in huffman tree
    while (t.length > 1) {
        var ks = sort_dict_keys(cs);
        var ka = ks[0],
            kb = ks[1];
        var ia = t.findIndex(function(a) { return a["key"] == ka; }),
            ib = t.findIndex(function(a) { return a["key"] == kb; });

        t.push({"key": ka + kb, "val": cs[ka] + cs[kb], "children": [t[ia], t[ib]]});
        t.splice(ia, 1);
        t.splice(ib - 1, 1);

        cs[ks[0] + ks[1]] = cs[ks[0]] + cs[ks[1]];
        delete cs[ks[0]];
        delete cs[ks[1]];
    }

    return t[0];
}





function fgk_tree(cs) {

}

console.log('basic huffman', d3.hierarchy(huffman_tree({"a": 1, "b": 2, "c": 3})));