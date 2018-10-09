import { kdTree } from "./kdTree.js";
export declare class main {
    kd: kdTree;
    constructor();
    pointes: Element[];
    pointeDic: {
        [key: string]: Element;
    };
    inited: boolean;
    init(): void;
    makeCirPoint(r: number, pos: number[], root: Element): Element;
    makeACir(): Element;
    crateCirData(r: number, center: number[]): number[];
}
