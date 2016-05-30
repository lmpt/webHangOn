import Spline from "../spline-objects/spline";
export interface iTrackObject {
    defaultZ: number;
    trackSpline: Spline;
}

export abstract class TrackObject implements iTrackObject {
    defaultZ = 0;
    trackSpline = new Spline([]);
    buildRoadSpline (): void {
        let newSpline = new Spline(),
            oldSpline = this.trackSpline.getVectors(),
            x = 0,
            y = 0,
            z = 0;

        for(let i = 0; i < oldSpline.length; i++) {
            x += oldSpline[i].x;
            y += oldSpline[i].y;
            z += (oldSpline[i].z - this.defaultZ);
            newSpline.addVector(new THREE.Vector3( x, y, z ));
        }
        this.trackSpline = newSpline;
    }
}
