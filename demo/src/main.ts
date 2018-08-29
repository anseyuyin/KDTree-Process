import { kdTree } from "./kdTree.js";
import { Icommand, commandMgr, setState, batState } from "./command.js";

//temp map data
var data = [[1,1],[2,2],[3,3],[5,6]];

export class main {
    constructor() {
        console.error(`fffff`);
        let kdt = new kdTree();
        kdt.buildTree(data);

        let out = [];
        kdt.find([1.49,1.5],out);
        debugger;
        let out_ = [];
        kdt.search(0.75,[1.5,1.5],out_);
        debugger
    }
}
