System.register(["./kdTree.js"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function vec2Length(a) {
        return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
    }
    function vec2Normalize(from, out) {
        var num = vec2Length(from);
        if (num > Number.MIN_VALUE) {
            out[0] = from[0] / num;
            out[1] = from[1] / num;
        }
        else {
            out[0] = 0;
            out[1] = 0;
        }
    }
    function vec2ScaleByNum(from, scale, out) {
        out[0] = from[0] * scale;
        out[1] = from[1] * scale;
    }
    function vec2Subtract(a, b, out) {
        out[0] = a[0] - b[0];
        out[1] = a[1] - b[1];
    }
    function vec2Add(a, b, out) {
        out[0] = a[0] + b[0];
        out[1] = a[1] + b[1];
    }
    var kdTree_js_1, data, svgNS, helpv2, helpv2s, main;
    return {
        setters: [
            function (kdTree_js_1_1) {
                kdTree_js_1 = kdTree_js_1_1;
            }
        ],
        execute: function () {
            data = [[1, 1], [2, 2], [3, 3], [5, 6]];
            svgNS = "http://www.w3.org/2000/svg";
            helpv2 = [0, 0];
            helpv2s = [];
            main = (function () {
                function main() {
                    this.pointes = [];
                    this.pointeDic = {};
                    this.inited = false;
                    console.error("fffff");
                    var kdt = new kdTree_js_1.kdTree();
                    kdt.buildTree(data);
                    var out = [];
                    kdt.find([1.49, 1.5], out);
                    var out_ = [];
                    kdt.search(0.75, [1.5, 1.5], out_);
                    this.kd = kdt;
                    this.init();
                }
                main.prototype.init = function () {
                    var cir = this.makeACir();
                    var ssvg = document.getElementsByClassName("ssvg")[0];
                    var self = this;
                    ssvg.appendChild(cir);
                    var movePoint = [0, 0];
                    var searchR = 30;
                    ssvg.onpointermove = function (ev) {
                        if (ev.offsetX == movePoint[0] && ev.offsetY == movePoint[1])
                            return;
                        movePoint[0] = ev.offsetX;
                        movePoint[1] = ev.offsetY;
                        var arr = self.crateCirData(searchR, movePoint);
                        cir.setAttribute("points", arr.toString());
                        if (self.inited) {
                            var pos_1 = [];
                            self.kd.search(searchR, movePoint, helpv2s);
                            helpv2s.forEach(function (v2) {
                                if (v2) {
                                    var key = v2[0] + "_" + v2[1];
                                    pos_1.push(self.pointeDic[key]);
                                }
                            });
                            if (pos_1.length > 0) {
                                self.pointes.forEach(function (sub) {
                                    if (sub) {
                                        sub.setAttribute("fill", "white");
                                    }
                                });
                                pos_1.forEach(function (po) {
                                    if (po) {
                                        po.setAttribute("fill", "red");
                                    }
                                });
                            }
                        }
                    };
                    ssvg.onpointerdown = function (ev) {
                        var pos = [ev.offsetX, ev.offsetY];
                        self.makeCirPoint(10, pos, ssvg);
                    };
                    var maxW = 460;
                    var maxH = 560;
                    var num = 200;
                    var rsize = 6;
                    var kdData = [];
                    for (var i = 0; i < num; i++) {
                        var w = Math.random() * maxW;
                        var h = Math.random() * maxH;
                        var pos = [w, h];
                        kdData.push(pos);
                        var key = w + "_" + h;
                        var po = this.makeCirPoint(rsize, pos, ssvg);
                        this.pointes.push(po);
                        this.pointeDic[key] = po;
                    }
                    this.kd.buildTree(kdData);
                    this.inited = true;
                };
                main.prototype.makeCirPoint = function (r, pos, root) {
                    var cc = document.createElementNS(svgNS, "circle");
                    cc.setAttribute("cx", "" + pos[0]);
                    cc.setAttribute("cy", "" + pos[1]);
                    cc.setAttribute("stroke", "black");
                    cc.setAttribute("stroke-width", "1");
                    cc.setAttribute("r", "" + r);
                    cc.setAttribute("fill", "white");
                    root.appendChild(cc);
                    return cc;
                };
                main.prototype.makeACir = function () {
                    var r = 10;
                    var center = [0, 0];
                    var pointrs = this.crateCirData(r, center);
                    var linecc = document.createElementNS(svgNS, "polyline");
                    var pp = pointrs.toString();
                    linecc.setAttribute("points", pp);
                    linecc.setAttribute("style", "fill:none;stroke:red;stroke-width:1");
                    return linecc;
                };
                main.prototype.crateCirData = function (r, center) {
                    var edge = 20;
                    var angle = Math.PI / edge * 2;
                    var arr = [];
                    for (var i = 0; i < edge; i++) {
                        var a = angle * i;
                        var x = Math.sin(a);
                        var y = Math.cos(a);
                        var pos = [x, y];
                        vec2Normalize(pos, pos);
                        vec2ScaleByNum(pos, r, pos);
                        vec2Add(pos, center, pos);
                        arr.push(pos);
                    }
                    if (arr.length > 0) {
                        arr.push(arr[0]);
                    }
                    return arr;
                };
                return main;
            }());
            exports_1("main", main);
        }
    };
});
//# sourceMappingURL=main.js.map