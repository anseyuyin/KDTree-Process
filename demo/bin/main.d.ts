import { kdTree } from "./kdTree.js";
export declare class main {
    trigger_Near: boolean;
    trigger_Down: boolean;
    kd: kdTree;
    constructor();
    pointes: Element[];
    pointeDic: {
        [key: string]: Element;
    };
    inited: boolean;
    cir: Element;
    init(): void;
    calcuPoints(searchR: any, movePoint: any): void;
    moveCirFrame(searchR: number, movePoint: number[]): void;
    searchNear(movePoint: number[]): void;
    searchPoints(searchR: number, movePoint: number[]): void;
    refreashPoints(points: number[][]): void;
    makeCirPoint(r: number, pos: number[], root: Element): Element;
    makeACir(): Element;
    crateCirData(r: number, center: number[]): number[];
}
