import Vector3 = THREE.Vector3;

export default class Spline implements iSpline {
    vectorArray:Vector3[];

    constructor(inputVectorArray:Vector3[] = []) {
        this.vectorArray = inputVectorArray;
        return this;
    }

    public getVectors():Vector3[] {
        return this.vectorArray;
    }

    public setVectors(inputVectorArray:Vector3[]):void {
        this.vectorArray = inputVectorArray;
    }

    public addVector(inputVector:Vector3):void {
        this.vectorArray.push(inputVector);
    }

    public smoothSpline():void {
        let newSpline = [];
        for (let i = 0; i < (this.vectorArray.length - 1); i++) {
            var sX = this.vectorArray[i].x;
            var sY = this.vectorArray[i].y;
            var sZ = this.vectorArray[i].z;
            var nsX = this.vectorArray[i + 1].x;
            var nsY = this.vectorArray[i + 1].y;
            var nsZ = this.vectorArray[i + 1].z;
            newSpline.push(this.vectorArray[i]);

            var newX = sX + (((this.diff(sX, nsX) / 2)) / 1.1);
            var newY = sY + (((this.diff(sY, nsY) / 2)) / 1.1);
            var newZ = sZ + (((this.diff(sZ, nsZ) / 2)) / 1.01);

            newSpline.push(new THREE.Vector3(newX, newY, newZ));

        }

        newSpline.push(this.vectorArray[this.vectorArray.length - 1]);

        this.vectorArray = newSpline;
    }

    private diff(num1:number, num2:number):number {
        var diff = Math.abs(num1 - num2);
        if (num1 > num2) {
            return -Math.abs(diff);
        } else {
            return diff;
        }
    }
}

export interface iSpline {
    vectorArray:Vector3[];
    new? (inputVectorArray:Vector3[]);
    smoothSpline():void;
    getVectors():Vector3[];
    setVectors(inputVectorArray:Vector3[]);
    addVector(inputVector:Vector3)
}