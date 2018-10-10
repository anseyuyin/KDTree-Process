export declare class kdTree {
    private dimeAmount;
    private rootNode;
    buildTree(datas: number[][]): void;
    private build(tnode, datas);
    private clearTree(tnode);
    search(radius: number, pos: number[], out: number[][]): boolean;
    private helpNearQueue;
    private helpBackQueue;
    private helpRadius;
    private helpLastMinDist;
    find(pos: number[], out: number[]): boolean;
    private backNode(tnode, data);
    private leafNode(tnode, data);
    private doLeaf(tnode, data);
    private maxVariance(datas);
    private mid(axis, datas);
    private syncData(src, out);
    private distance(a, b);
    private chooseLeft(data, tnode);
    private intersectSplit(radius, data, tnode);
    private insertQueue(isIns, Queue, data);
}
