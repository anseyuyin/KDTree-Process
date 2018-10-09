import { kdTree } from "./kdTree.js";
import { Icommand, commandMgr, setState, batState } from "./command.js";

//temp map data
var data = [[1,1],[2,2],[3,3],[5,6]];
let svgNS="http://www.w3.org/2000/svg";
let helpv2 = [0,0];
let helpv2s = [];
export class main {
    kd : kdTree;
    constructor() {
        console.error(`fffff`);
        let kdt = new kdTree();
        kdt.buildTree(data);

        let out = [];
        kdt.find([1.49,1.5],out);
        let out_ = [];
        kdt.search(0.75,[1.5,1.5],out_);
        
        this.kd = kdt;
        this.init();
    }

    pointes : Element[] = [];
    pointeDic : {[key:string]:Element} = {};
    inited = false;
    init(){
        // cir 
        let cir = this.makeACir();

        //test
        let ssvg = document.getElementsByClassName("ssvg")[0];
        let self = this;
        ssvg.appendChild(cir);

        let movePoint = [0,0];
        let searchR = 30;
        ssvg.onpointermove = function(this:GlobalEventHandlers,ev:PointerEvent){
            if(ev.offsetX==movePoint[0] && ev.offsetY==movePoint[1] )return;
            movePoint[0] = ev.offsetX;
            movePoint[1] = ev.offsetY;
            let arr = self.crateCirData(searchR,movePoint);
            cir.setAttribute("points",arr.toString());

            //判断搜索
            if(self.inited){
                let pos = [];

                //find near
                // self.kd.find(movePoint,helpv2);
                // let key = `${helpv2[0]}_${helpv2[1]}`;
                // pos.push(self.pointeDic[key]);

                //search by range 
                self.kd.search(searchR,movePoint,helpv2s);
                helpv2s.forEach(v2=>{
                    if(v2){
                        let key = `${v2[0]}_${v2[1]}`;
                        pos.push(self.pointeDic[key]);
                    }
                });

                //刷新显示
                if(pos.length > 0){
                    self.pointes.forEach(sub=>{
                        if(sub){
                            sub.setAttribute("fill","white");
                        }
                    });
                    pos.forEach(po=>{
                        if(po){
                            po.setAttribute("fill","red");
                        }
                    });
                }
            }
        }
        
        ssvg.onpointerdown =function(this:GlobalEventHandlers,ev:PointerEvent){
            // let pos = [ev.offsetX,ev.offsetY];
            // self.makeCirPoint(10,pos,ssvg);
        }

        //创建 xx  个点
        let maxW = 460;
        let maxH = 560;
        let num = 200;
        let rsize = 6;
        let kdData = [];
        for(let i=0 ;i< num ; i++){
            let w = Math.random() * maxW;
            let h = Math.random() * maxH;
            let pos = [w,h];
            kdData.push(pos);
            let key = `${w}_${h}`;
            let po = this.makeCirPoint(rsize,pos,ssvg);
            this.pointes.push(po);
            this.pointeDic[key] = po; 
        }

        //kd tree 
        this.kd.buildTree(kdData);
        this.inited = true;
    }


    //创建 圆点
    makeCirPoint(r:number,pos:number[],root:Element){
        let cc = document.createElementNS(svgNS,"circle");
        cc.setAttribute("cx",`${pos[0]}`);
        cc.setAttribute("cy",`${pos[1]}`);
        cc.setAttribute("stroke","black");
        cc.setAttribute("stroke-width","1");
        cc.setAttribute("r",`${r}`);
        cc.setAttribute("fill","white");
        root.appendChild(cc);
        return cc;
    }

    //创建 圆框
    makeACir(){
        let r = 10;
        let center = [0,0];
        let pointrs = this.crateCirData(r,center);

        let linecc = document.createElementNS(svgNS,"polyline");
        let pp  =pointrs.toString();
        linecc.setAttribute("points",pp);
        linecc.setAttribute("style","fill:none;stroke:red;stroke-width:1");
        return linecc;
    }

    crateCirData(r:number,center:number[] ):number[]{
        let edge = 20;
        let angle = Math.PI/edge * 2;
        let arr = [];
        for(let i = 0;i<edge ; i++){
            let a = angle * i;
            let x = Math.sin(a);
            let y = Math.cos(a);
            let pos = [x,y];
            vec2Normalize(pos,pos);
            vec2ScaleByNum(pos,r,pos);
            vec2Add(pos,center,pos);
            arr.push(pos);
        }

        if(arr.length > 0 ){
            arr.push(arr[0]);
        }
        return arr;
    }

}

// math v2

function vec2Length(a: number[]): number {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
}

function vec2Normalize(from: number[], out: number[]) {
    let num: number = vec2Length(from);
    if (num > Number.MIN_VALUE) {
        out[0] = from[0] / num;
        out[1] = from[1] / num;
    } else {
        out[0] = 0;
        out[1] = 0;
    }
}

function vec2ScaleByNum(from: number[], scale: number, out: number[]) {
    out[0] = from[0] * scale;
    out[1] = from[1] * scale;
}

function vec2Subtract(a: number[], b: number[], out: number[]) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
}

function vec2Add(a: number[], b: number[], out: number[]) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
}
