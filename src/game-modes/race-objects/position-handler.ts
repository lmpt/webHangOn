import Vector3 = THREE.Vector3;

export default class PositionHandler {
    public player: iPlayer = {
        transform: new THREE.Vector3(0, 2,-1),
        cameraOffset: new  THREE.Vector3(-.75, 0, 0)
    };

    public skyPlane = null;
    public mFar = null;
    public mClose = null;
    public currentSpeed = null;
    public roadSpline = null;

    public depthOffset = new THREE.Vector2();
    public currentSpline = 0;
    public xdiffFromSpline = null;
    public ydiffFromSpline = null;
    public zdiffFromSpline = null;
    public perToNextSpline = null;
    public xDif = null;
    public yDif = null;
    public deafultZ = null;

    private config = {
        heightFromGround: 2,
        xSplineDiffSmoothing: 25,
        ySplineDiffSmoothing: 15,
        yDiffChoke: 0.01,
        xDiffChoke: 0.01,
        yUpdateChoke: 0.001,
        xStepPerFrame: 0.05,
        yStepPerFrame: 0.05,
        yResetStepPerFrame: 0.0025,
        backdropDepthOffset: -30,
        xBackdropOffsetSkyPlane: 1,
        xBackdropOffsetFar: 4,
        xBackdropOffsetClose: 8,
        yBackdropOffsetSkyPlane: 10,
        yBackdropOffsetFar: 15,
        yBackdropOffsetClose: 20
    };
    
    public updatePositions(xOffset: number) :void {

        if(this.player.transform.z < this.roadSpline[this.currentSpline].z) {
            this.currentSpline++;
        }

        this.player.transform.z += - this.currentSpeed;

        this.xdiffFromSpline = this.diff(this.player.transform.x, this.roadSpline[this.currentSpline].x);

        this.ydiffFromSpline = this.diff(this.player.transform.y, this.roadSpline[this.currentSpline].y + this.config.heightFromGround);

        this.zdiffFromSpline = this.diff(this.player.transform.z, this.roadSpline[this.currentSpline].z);

        this.perToNextSpline = (this.zdiffFromSpline + this.deafultZ) / 2 - 1;

        this.xDif = (this.xdiffFromSpline / this.config.xSplineDiffSmoothing) * this.perToNextSpline;
        this.yDif = (this.ydiffFromSpline / this.config.ySplineDiffSmoothing) * this.perToNextSpline;

        this.player.transform.x += this.xDif;
        this.player.transform.y += this.yDif;

        if(this.yDif > this.config.yDiffChoke || this.yDif < -this.config.yDiffChoke) {
            if (this.yDif > 0) {
                this.depthOffset.y += this.config.yStepPerFrame * this.yDif;
            } else if (this.yDif < 0) {
                this.depthOffset.y -= this.config.yStepPerFrame * this.yDif;
            }
        } else if(this.depthOffset.y > this.config.yUpdateChoke || this.depthOffset.y < -this.config.yUpdateChoke) {
            if (this.depthOffset.y > 0) {
                this.depthOffset.y -= this.config.yResetStepPerFrame * this.perToNextSpline;
            } else {
                this.depthOffset.y += this.config.yResetStepPerFrame * this.perToNextSpline;
            }
        }

        if(this.xDif > this.config.xDiffChoke || this.xDif < -this.config.xDiffChoke) {
            if (this.xDif > 0) {
                this.depthOffset.x += this.config.xStepPerFrame * this.xDif;
            } else if (this.xDif < 0) {
                this.depthOffset.x += this.config.xStepPerFrame * this.xDif;
            }
        }

        this.skyPlane.position.z = this.player.transform.z + (this.config.backdropDepthOffset + 0.0001);
        this.skyPlane.position.x = this.player.transform.x - (this.depthOffset.x * this.config.xBackdropOffsetSkyPlane) + (xOffset * 0.95);
        this.skyPlane.position.y = this.player.transform.y - (this.depthOffset.y * this.config.yBackdropOffsetSkyPlane) + 10;

        this.mFar.position.z = this.player.transform.z + (this.config.backdropDepthOffset + 0.0002);
        this.mFar.position.x = this.player.transform.x - (this.depthOffset.x * this.config.xBackdropOffsetFar) + (xOffset * 0.85);
        this.mFar.position.y = this.player.transform.y - (this.depthOffset.y * this.config.yBackdropOffsetFar) + 2;

        this.mClose.position.z = this.player.transform.z + (this.config.backdropDepthOffset + 0.0003);
        this.mClose.position.x = this.player.transform.x - (this.depthOffset.x * this.config.xBackdropOffsetClose) + (xOffset * 0.8);
        this.mClose.position.y = this.player.transform.y - (this.depthOffset.y * this.config.yBackdropOffsetClose) + 2;
    }

    getPlayerRoadYOffset(): number {
        return ((this.roadSpline[this.currentSpline +1].y - this.roadSpline[this.currentSpline].y) * (this.perToNextSpline)) + this.roadSpline[this.currentSpline].y;
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

interface iPlayer {
    transform: Vector3;
    cameraOffset: Vector3;
}