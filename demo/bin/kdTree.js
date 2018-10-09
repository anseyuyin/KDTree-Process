System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var node, nodePool, kdTree;
    return {
        setters: [],
        execute: function () {
            node = (function () {
                function node() {
                    this.axis = -1;
                    this.data = [];
                    this.range = [];
                }
                return node;
            }());
            nodePool = (function () {
                function nodePool() {
                }
                nodePool.new_node = function () {
                    var n = this.nodelist.pop();
                    return n ? n : new node();
                };
                nodePool.delete_node = function (n) {
                    if (!n)
                        return;
                    n.parent = n.left = n.right = null;
                    n.data.length = n.range.length = 0;
                    this.nodelist.push(n);
                };
                nodePool.nodelist = [];
                return nodePool;
            }());
            kdTree = (function () {
                function kdTree() {
                    this.dimeAmount = 2;
                    this.helpNearQueue = [];
                    this.helpBackQueue = [];
                    this.helpRadius = Number.MAX_VALUE;
                    this.helpLastDist = Number.MAX_VALUE;
                }
                kdTree.prototype.buildTree = function (datas) {
                    this.clearTree(this.rootNode);
                    this.rootNode = null;
                    if (!datas || datas.length < 1)
                        return;
                    this.dimeAmount = datas[0].length;
                    this.rootNode = nodePool.new_node();
                    this.build(this.rootNode, datas);
                };
                kdTree.prototype.build = function (tnode, datas) {
                    if (datas.length <= 1) {
                        var data = datas.pop();
                        this.syncData(data, tnode.data);
                    }
                    else {
                        var axis = this.maxVariance(datas);
                        tnode.axis = axis;
                        var midIdx = this.mid(axis, datas);
                        var data = datas.splice(midIdx, 1)[0];
                        this.syncData(data, tnode.data);
                        var leftDs = datas.splice(0, midIdx);
                        var rightDs = datas;
                        if (leftDs.length > 0) {
                            var leftNode = nodePool.new_node();
                            leftNode.parent = tnode;
                            tnode.left = leftNode;
                            this.build(leftNode, leftDs);
                        }
                        if (rightDs.length > 0) {
                            var rightNode = nodePool.new_node();
                            rightNode.parent = tnode;
                            tnode.right = rightNode;
                            this.build(rightNode, rightDs);
                        }
                    }
                };
                kdTree.prototype.clearTree = function (tnode) {
                    if (!tnode)
                        return;
                    if (tnode.left)
                        this.clearTree(tnode.left);
                    if (tnode.right)
                        this.clearTree(tnode.right);
                    nodePool.delete_node(tnode);
                };
                kdTree.prototype.search = function (radius, pos, out) {
                    var _this = this;
                    if (radius < 0 || !out || !pos || pos.length != this.dimeAmount)
                        return false;
                    this.helpNearQueue.length = this.helpBackQueue.length = 0;
                    this.helpRadius = radius;
                    var root = this.rootNode;
                    this.leafNode(root, pos);
                    out.length = 0;
                    this.helpNearQueue.forEach(function (n) {
                        if (n) {
                            var arr = [];
                            _this.syncData(n.data, arr);
                            out.push(arr);
                        }
                    });
                    return true;
                };
                kdTree.prototype.find = function (pos, out) {
                    if (!out || !pos || pos.length != this.dimeAmount)
                        return false;
                    this.helpNearQueue.length = this.helpBackQueue.length = 0;
                    this.helpRadius = NaN;
                    var root = this.rootNode;
                    this.leafNode(root, pos);
                    this.syncData(this.helpNearQueue.pop().data, out);
                    return true;
                };
                kdTree.prototype.backNode = function (tnode, data) {
                    if (!tnode)
                        return;
                    var dist = this.distance(data, tnode.data);
                    if (dist <= this.helpRadius) {
                        this.insertQueue(this.helpLastDist < dist, this.helpNearQueue, tnode);
                    }
                    this.helpLastDist = dist;
                    var isInter = this.intersectSplit(this.helpRadius, data, tnode);
                    if (isInter) {
                        var nextNode = !this.chooseLeft(data, tnode) ? tnode.left : tnode.right;
                        this.leafNode(nextNode, data);
                    }
                    else {
                        var bnode = this.helpBackQueue.pop();
                        this.backNode(bnode, data);
                    }
                };
                kdTree.prototype.leafNode = function (tnode, data) {
                    if (!tnode)
                        return;
                    if (tnode.axis < 0) {
                        this.doLeaf(tnode, data);
                    }
                    else {
                        this.helpBackQueue.push(tnode);
                        var nextNode = this.chooseLeft(data, tnode) ? tnode.left : tnode.right;
                        if (!nextNode) {
                            this.doLeaf(tnode, data);
                        }
                        else {
                            this.leafNode(nextNode, data);
                        }
                    }
                };
                kdTree.prototype.doLeaf = function (tnode, data) {
                    if (!tnode)
                        return;
                    var dist = this.distance(data, tnode.data);
                    if (isNaN(this.helpRadius)) {
                        this.helpNearQueue.push(tnode);
                        this.helpRadius = dist;
                    }
                    else if (dist <= this.helpRadius) {
                        this.insertQueue(this.helpLastDist < dist, this.helpNearQueue, tnode);
                    }
                    this.helpLastDist = dist;
                    var bnode = this.helpBackQueue.pop();
                    this.backNode(bnode, data);
                };
                kdTree.prototype.maxVariance = function (datas) {
                    if (datas.length < 1)
                        return -1;
                    var lastV = 0, dimension = 0;
                    var _loop_1 = function (i) {
                        var average = 0;
                        datas.forEach(function (data) {
                            average += data[i];
                        });
                        average /= datas.length;
                        var Variance = 0;
                        datas.forEach(function (data) {
                            var Diffv = data[i] - average;
                            Variance += Diffv * Diffv;
                        });
                        Variance /= datas.length;
                        if (Variance > lastV) {
                            lastV = Variance;
                            dimension = i;
                        }
                    };
                    for (var i = 0; i < this.dimeAmount; i++) {
                        _loop_1(i);
                    }
                    return dimension;
                };
                kdTree.prototype.mid = function (axis, datas) {
                    if (datas.length < 1)
                        return;
                    datas.sort(function (a, b) {
                        return a[axis] - b[axis];
                    });
                    var midIdx = Math.floor(datas.length / 2);
                    return midIdx;
                };
                kdTree.prototype.syncData = function (src, out) {
                    if (!src || !out)
                        return;
                    if (out.length != src.length)
                        out.length = 0;
                    src.forEach(function (num, idx) {
                        out[idx] = num;
                    });
                };
                kdTree.prototype.distance = function (a, b) {
                    var num = 0;
                    for (var i = 0; i < this.dimeAmount; i++) {
                        var dif = a[i] - b[i];
                        num += dif * dif;
                    }
                    return Math.sqrt(num);
                };
                kdTree.prototype.chooseLeft = function (data, tnode) {
                    var axis = tnode.axis;
                    var num = data[axis];
                    return num <= tnode.data[axis];
                };
                kdTree.prototype.intersectSplit = function (radius, data, tnode) {
                    return radius > Math.abs(data[tnode.axis] - tnode.data[tnode.axis]);
                };
                kdTree.prototype.insertQueue = function (isIns, Queue, data) {
                    if (!Queue)
                        return;
                    if (Queue.length < 1) {
                        Queue.push(data);
                        return;
                    }
                    if (!isIns) {
                        Queue.push(data);
                    }
                    else {
                        var idx = Queue.length - 1;
                        Queue.splice(idx, 0, data);
                    }
                };
                return kdTree;
            }());
            exports_1("kdTree", kdTree);
        }
    };
});
//# sourceMappingURL=kdTree.js.map