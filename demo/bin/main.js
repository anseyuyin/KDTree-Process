System.register(["./kdTree.js"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var kdTree_js_1, data, main;
    return {
        setters: [
            function (kdTree_js_1_1) {
                kdTree_js_1 = kdTree_js_1_1;
            }
        ],
        execute: function () {
            data = [[1, 1], [2, 2], [3, 3], [5, 6]];
            main = (function () {
                function main() {
                    console.error("fffff");
                    var kdt = new kdTree_js_1.kdTree();
                    kdt.buildTree(data);
                    var out = [];
                    kdt.find([1.49, 1.5], out);
                    debugger;
                    var out_ = [];
                    kdt.search(0.75, [1.5, 1.5], out_);
                    debugger;
                }
                return main;
            }());
            exports_1("main", main);
        }
    };
});
//# sourceMappingURL=main.js.map