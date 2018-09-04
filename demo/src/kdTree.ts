class node {
    parent: node;
    left: node; //min region
    right: node; //max region
    axis: number = -1; //axis of dimension
    data: number[] = []; 
    range: number[] = []; //[min,max] 
}

class nodePool {
    private static nodelist: node[] = [];
    static new_node() {
        let n = this.nodelist.pop();
        return n? n: new node();
    }
    static delete_node(n: node) {
        if (!n) return;
        n.parent = n.left = n.right = null;
        n.data.length = n.range.length = 0;
        this.nodelist.push(n);
    }
}

/**
 * k-dimension tree struct 
 */
export class kdTree {
    private dimeAmount = 2; //dimension amount ,must be greater then two
    private rootNode : node;
    /**
     * build kdtree data struct by datas
     * @param datas data array , need to ensure that the dimensions of each data are equal .(examp [[1,2],[3,3]...])
     */
    buildTree(datas:number[][]){
        //clear history
        this.clearTree(this.rootNode);
        this.rootNode = null;

        if(!datas || datas.length < 1)  return;
        this.dimeAmount = datas[0].length;
        this.rootNode = nodePool.new_node();
        this.build(this.rootNode,datas);
    }
    private build(tnode:node,datas:number[][]){
        if(datas.length <= 1){
            let data = datas.pop();
            this.syncData(data,tnode.data);
        }else{
            let axis = this.maxVariance(datas);
            tnode.axis = axis;
            let midIdx = this.mid(axis,datas);
            let data = datas.splice(midIdx,1)[0];
            this.syncData(data,tnode.data);
            
            //slipt arr
            let leftDs = datas.splice(0,midIdx);
            let rightDs = datas;
            if(leftDs.length > 0){
                let leftNode = nodePool.new_node();
                leftNode.parent = tnode;
                tnode.left = leftNode;
                this.build(leftNode,leftDs);
            }

            if(rightDs.length > 0){
                let rightNode = nodePool.new_node();
                rightNode.parent = tnode;
                tnode.right = rightNode;
                this.build(rightNode,rightDs);
            }
        }
    }

    private clearTree(tnode:node){
        if(!tnode)return;
        if(tnode.left)  this.clearTree(tnode.left);
        if(tnode.right)  this.clearTree(tnode.right);
        nodePool.delete_node(tnode);
    }

    /**
     * Search for specified position radius range 
     * @param radius radius of search range
     * @param pos search center position
     * @param out Search result [pos,pos1,pos2....]
     */
    search(radius:number,pos:number[],out:number[][]) :boolean{
        if(radius<0 || !out || !pos || pos.length != this.dimeAmount)return false;
        this.helpNearQueue.length = this.helpBackQueue.length = 0;
        this.helpRadius = radius;
        let root =  this.rootNode;
        this.leafNode(root,pos);
        out.length = 0;
        this.helpNearQueue.forEach(n=>{
            if(n){
                let arr = [];
                this.syncData(n.data,arr);
                out.push(arr);
            }
        });
        return true;
    }

    private helpNearQueue :node[] = [];
    private helpBackQueue :node[] = [];
    private helpRadius: number = Number.MAX_VALUE;
    private helpLastDist: number = Number.MAX_VALUE;
    /**
     * finding one of most near neighbor
     * @param pos finding center position
     * @param out finding result
     */
    find(pos:number[],out:number[]):boolean{
        if(!out || !pos || pos.length != this.dimeAmount) return false;
        this.helpNearQueue.length = this.helpBackQueue.length = 0;
        this.helpRadius = NaN;
        let root =  this.rootNode;
        this.leafNode(root,pos);
        this.syncData(this.helpNearQueue.pop().data,out);
        return true;
    }

    private backNode(tnode:node,data:number[]){
        if(!tnode) return;
        let dist = this.distance(data,tnode.data);
        //判断距离
        if(dist<= this.helpRadius){
            this.insertQueue(this.helpLastDist<dist,this.helpNearQueue,tnode);
            //this.helpNearQueue.push(tnode);
            //this.nearDist = dist;
        }
        this.helpLastDist = dist;
        //判断是否相交
        let isInter = this.intersectSplit(this.helpRadius,data,tnode);
        if(isInter){
            let nextNode = !this.chooseLeft(data,tnode) ? tnode.left: tnode.right;
            this.leafNode(nextNode,data);
        }else{
            let bnode = this.helpBackQueue.pop();
            this.backNode(bnode,data);
        }
    }

    private leafNode(tnode:node,data:number[]){
        if(!tnode) return;
        if(tnode.axis < 0 ){
            this.doLeaf(tnode,data);
        }else{
            this.helpBackQueue.push(tnode);
            //判断选择
            let nextNode = this.chooseLeft(data,tnode) ? tnode.left: tnode.right;
            if(!nextNode){
                this.doLeaf(tnode,data);
            }else{
                this.leafNode(nextNode,data);
            }
        }
    }

    private doLeaf(tnode:node,data:number[]){
        if(!tnode) return;
         //找到叶节点
        let dist = this.distance(data,tnode.data);
        if(isNaN(this.helpRadius)){
            this.helpNearQueue.push(tnode);
            this.helpRadius = dist;
        } else if(dist<= this.helpRadius){
            this.insertQueue(this.helpLastDist<dist,this.helpNearQueue,tnode);
            // this.helpNearQueue.push(tnode);
            //this.nearDist = dist;
        }
        this.helpLastDist = dist;
        //回溯
        let bnode = this.helpBackQueue.pop();
        this.backNode(bnode,data);
    }

    //-----------Tool funs---------------
    //each dimension to compare  Variance , finding of the max
    private maxVariance(datas:number[][]):number{
        if(datas.length < 1) return -1;
        let lastV =0 , dimension = 0;
        for(let i = 0 ;i < this.dimeAmount ; i++){
            let average = 0;
            datas.forEach(data=>{
                average += data[i];
            });
            average /= datas.length;
            let Variance = 0;
            datas.forEach(data=>{
                let Diffv = data[i] - average;
                Variance += Diffv * Diffv;
            });
            Variance /= datas.length;
            if(Variance > lastV){
                lastV = Variance;
                dimension = i;
            }
        }
        return dimension;
    }

    //finding and set the mid data of the axis
    private mid(axis:number,datas:number[][]):number{
        if(datas.length < 1) return;
        datas.sort((a,b)=>{
            return a[axis] - b[axis];
        });
        let midIdx = Math.floor(datas.length/2);
        
        return midIdx;
    }
    //sync data
    private syncData(src:number[] , out :number[]){
        if(!src || !out)return;
        if(out.length != src.length) out.length = 0;
        src.forEach((num,idx)=>{
            out[idx] = num;
        });
    }
    //distance
    private distance(a:number[] , b:number[]):number{
        let num = 0;
        for(let i = 0 ;i< this.dimeAmount ;i++){
            let dif = a[i] - b[i];
            num += dif * dif;
        }
        return Math.sqrt(num);
    }

    private chooseLeft(data:number[] , tnode:node):boolean{
        let axis = tnode.axis
        let num = data[axis];
        return num <= tnode.data[axis];
    }

    private intersectSplit(radius:number,data:number[],tnode:node):boolean{
        return radius >  Math.abs(data[tnode.axis] - tnode.data[tnode.axis]);
    }

    private insertQueue(isIns:boolean,Queue:any[],data:any){
        if(!Queue)return;
        if(Queue.length < 1){
            Queue.push(data);
            return;
        }
        if(!isIns){
            Queue.push(data);
        }else{
            let idx = Queue.length -1;
            Queue.splice(idx,0,data);
        }
    }
}
