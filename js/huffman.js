/*******************/
/*** HELPER FXNS ***/
/*******************/

function sort_dict_keys(d) {
    var sortable = [ ];
    for (var k in d) sortable.push([k, d[k]]);
    sortable.sort(function(a, b) {
        return a[1] - b[1];
    });
    return sortable.map(function(a) { return a[0]; });
}

function string_freq(s) {
    var cs = { };
    for (var i = 0; i < s.length; i++) {
        if (s[i] in cs) cs[s[i]] = cs[s[i]] + 1;
        else cs[s[i]] = 1;
    }
    return cs;
}

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

/*************/
/* TREE DATE */
/*************/

var trees = {
    "bookkeeper": {
        "root-pos": [775, 76.25],
        "gap-size": [20, 75, 1.75],
        "height": 5,
        "tree": {
            "key": "bekopr",
            "val": 10,
            "id": 1,
            "left-child": {
                "key": "bepr",
                "val": 6,
                "id": 2,
                "left-child": {
                    "key": "e",
                    "val": 3,
                    "id": 4,
                    "left-child": null,
                    "right-child": null
                },
                "right-child": {
                    "key": "bpr",
                    "val": 3,
                    "id": 5,
                    "left-child": {
                        "key": "b",
                        "val": 1,
                        "id": 8,
                        "left-child": null,
                        "right-child": null
                    },
                    "right-child": {
                        "key": "pr",
                        "val": 2,
                        "id": 9,
                        "left-child": {
                            "key": "p",
                            "val": 1,
                            "id": 10,
                            "left-child": null,
                            "right-child": null
                        },
                        "right-child": {
                            "key": "r",
                            "val": 1,
                            "id": 11,
                            "left-child": null,
                            "right-child": null
                        }
                    }
                }
            },
            "right-child": {
                "key": "ko",
                "val": 4,
                "id": 3,
                "left-child": {
                    "key": "k",
                    "val": 2,
                    "id": 6,
                    "left-child": null,
                    "right-child": null
                },
                "right-child": {
                    "key": "o",
                    "val": 2,
                    "id": 7,
                    "left-child": null,
                    "right-child": null
                }
            }
        }
    },
    "mississippi": {
        "root-pos": [775, 113.75],
        "gap-size": [25, 75, 2],
        "height": 4,
        "tree": {
            "key": "mips",
            "val": 11,
            "id": 1,
            "left-child": {
                "key": "s",
                "val": 4,
                "id": 2,
                "left-child": null,
                "right-child": null
            },
            "right-child": {
                "key": "mip",
                "val": 7,
                "id": 3,
                "left-child": {
                    "key": "mp",
                    "val": 3,
                    "id": 4,
                    "left-child": {
                        "key": "m",
                        "val": 1,
                        "id": 6,
                        "left-child": null,
                        "right-child": null
                    },
                    "right-child": {
                        "key": "p",
                        "val": 2,
                        "id": 7,
                        "left-child": null,
                        "right-child": null
                    }
                },
                "right-child": {
                    "key": "i",
                    "val": 4,
                    "id": 5,
                    "left-child": null,
                    "right-child": null
                }
            }
        }
    },
    "engineering": {
        "root-pos": [775, 113.75],
        "gap-size": [25, 75, 2],
        "height": 4,
        "tree": {
            "key": "eginr",
            "val": 11,
            "id": 1,
            "left-child": {
                "key": "gir",
                "val": 5,
                "id": 2,
                "left-child": {
                    "key": "g",
                    "val": 2,
                    "id": 4,
                    "left-child": null,
                    "right-child": null
                },
                "right-child": {
                    "key": "ir",
                    "val": 3,
                    "id": 5,
                    "left-child": {
                        "key": "i",
                        "val": 2,
                        "id": 8,
                        "left-child": null,
                        "right-child": null
                    },
                    "right-child": {
                        "key": "r",
                        "val": 1,
                        "id": 9,
                        "left-child": null,
                        "right-child": null
                    }
                }
            },
            "right-child": {
                "key": "en",
                "val": 6,
                "id": 3,
                "left-child": {
                    "key": "e",
                    "val": 3,
                    "id": 6,
                    "left-child": null,
                    "right-child": null
                },
                "right-child": {
                    "key": "n",
                    "val": 3,
                    "id": 7,
                    "left-child": null,
                    "right-child": null
                }
            }
        }
    },
    "sleeplessness": {
        "root-pos": [775, 76.25],
        "gap-size": [20, 75, 1.75],
        "height": 5,
        "tree": {
            "key": "elnps",
            "val": 14,
            "id": 1,
            "left-child": {
                "key": "e",
                "val": 5,
                "id": 2,
                "left-child": null,
                "right-child": null
            },
            "right-child": {
                "key": "lnps",
                "val": 9,
                "id": 3,
                "left-child": {
                    "key": "lnp",
                    "val": 4,
                    "id": 5,
                    "left-child": {
                        "key": "np",
                        "val": 2,
                        "id": 6,
                        "left-child": {
                            "key": "n",
                            "val": 1,
                            "id": 8,
                            "left-child": null,
                            "right-child": null
                        },
                        "right-child": {
                            "key": "p",
                            "val": 1,
                            "id": 9,
                            "left-child": null,
                            "right-child": null
                        }
                    },
                    "right-child": {
                        "key": "l",
                        "val": 2,
                        "id": 7,
                        "left-child": null,
                        "right-child": null
                    }
                },
                "right-child": {
                    "key": "s",
                    "val": 5,
                    "id": 4,
                    "left-child": null,
                    "right-child": null
                }
            }
        }
    }
}

// t = tree
// p = path string
// h = tree height
// r = root position (x, y)
// g = gap (base gap, multiplier)
function build_tree(id, t, p, h, r, g) {
    if (!t) return null;

    var n1 = build_tree(id, t['left-child'],  p + '0', h, r, g),
        n2 = build_tree(id, t['right-child'], p + '1', h, r, g);

    if (t['left-child'] && t['right-child']) {
        var [n, txt] = new_circ_node(r[0] + horz_offset(h, p, g[0], g[2]), r[1] + vert_offset(p, g[1]), t['key'], t['val'], t['val']);
    } else {
        var [n, txt] = new_rect_node(r[0] + horz_offset(h, p, g[0], g[2]), r[1] + vert_offset(p, g[1]), t['key'], t['val'], t['key']);
    }

    n.attr('id', id + '-' + t['id']);
    txt.attr('id', id + '-' + t['id']);

    if (n1) {
        var p1 = connect_p2c(n, n1);
        p1.attr('id', id + '-' + t['id'] + '-' + t['left-child']['id']);
    }
    if (n2) {
        var p2 = connect_p2c(n, n2);
        p2.attr('id', id + '-' + t['id'] + '-' + t['right-child']['id']);
    }

    return n;
} 