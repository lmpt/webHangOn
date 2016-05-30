import Spline from "./spline";
import Scene = THREE.Scene;
import MeshPhongMaterial = THREE.MeshPhongMaterial;

export class RoadSides2 {
    constructor(roadSpline:Spline, scene:Scene, material:MeshPhongMaterial) {

        material.map.generateMipmaps = true;
        material.map.minFilter = THREE.LinearFilter;
        material.map.magFilter = THREE.LinearFilter;

        let roadObjs:THREE.Mesh[] = [],
            spline = roadSpline.getVectors();

        for (let i = 0; i < (spline.length - 1); i++) {
            var roadGeometry = new THREE.Geometry();
            var sX = spline[i].x;
            var sY = spline[i].y;
            var sZ = spline[i].z;
            var nsX = spline[i + 1].x;
            var nsY = spline[i + 1].y;
            var nsZ = spline[i + 1].z;


            roadGeometry.vertices.push(
                new THREE.Vector3(sX + 3.3, sY + 0.0001, sZ),
                new THREE.Vector3(sX + 3.15, sY + 0.0001, sZ),
                new THREE.Vector3(nsX + 3.15, nsY + 0.0001, nsZ),
                new THREE.Vector3(nsX + 3.3, nsY + 0.0001, nsZ),

                new THREE.Vector3(sX - 3.3, sY + 0.0001, sZ),
                new THREE.Vector3(sX - 3.15, sY + 0.0001, sZ),
                new THREE.Vector3(nsX - 3.15, nsY + 0.0001, nsZ),
                new THREE.Vector3(nsX - 3.3, nsY + 0.0001, nsZ)
            );


            roadGeometry.faces.push(
                new THREE.Face3(1, 0, 2),
                new THREE.Face3(2, 0, 3),
                new THREE.Face3(4, 5, 6),
                new THREE.Face3(4, 6, 7)
            );

            roadGeometry.faceVertexUvs[0].push(
                [
                    new THREE.Vector2(.8, .5),
                    new THREE.Vector2(.8, .6),
                    new THREE.Vector2(0, .6)
                ],
                [
                    new THREE.Vector2(0, .5),
                    new THREE.Vector2(.8, .6),
                    new THREE.Vector2(0, .6)
                ],
                [
                    new THREE.Vector2(.8, .5),
                    new THREE.Vector2(.8, .6),
                    new THREE.Vector2(0, .6)
                ],
                [
                    new THREE.Vector2(.8, .6),
                    new THREE.Vector2(0, .5),
                    new THREE.Vector2(0, .6)
                ]
            );

            var road = new THREE.Mesh(roadGeometry, material);

            scene.add(road);

            roadObjs.push(road);
        }

        return roadObjs;

    }
}