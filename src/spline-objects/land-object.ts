import Spline from "./spline";
import Scene = THREE.Scene;
import MeshPhongMaterial = THREE.MeshPhongMaterial;

export class LandObject {
    constructor(roadSpline:Spline, scene:Scene, material:MeshPhongMaterial) {
        material.map.generateMipmaps = true;
        material.map.minFilter = THREE.LinearFilter;
        material.map.magFilter = THREE.LinearFilter;
        material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
        material.map.repeat.set(40, 1);

        let roadObjs:THREE.Mesh[] = [],
            spline = roadSpline.getVectors();

        for (let i = 0; i < (spline.length - 1); i++) {

            let roadGeometry = new THREE.Geometry(),
                sX = spline[i].x,
                sY = spline[i].y,
                sZ = spline[i].z,
                nsX = spline[i + 1].x,
                nsY = spline[i + 1].y,
                nsZ = spline[i + 1].z;

            roadGeometry.vertices.push(
                new THREE.Vector3(sX + 100, sY - 0.01, sZ),
                new THREE.Vector3(sX - 100, sY - 0.01, sZ),
                new THREE.Vector3(nsX - 100, nsY - 0.01, nsZ),
                new THREE.Vector3(nsX + 100, nsY - 0.01, nsZ)
            );

            roadGeometry.faces.push(
                new THREE.Face3(1, 0, 2),
                new THREE.Face3(2, 0, 3)
            );

            roadGeometry.faceVertexUvs[0].push(
                [
                    new THREE.Vector2(1, 1),
                    new THREE.Vector2(0, 1),
                    new THREE.Vector2(1, 0)
                ],
                [
                    new THREE.Vector2(1, 0),
                    new THREE.Vector2(0, 1),
                    new THREE.Vector2(0, 0)
                ]
            );

            var road = new THREE.Mesh(roadGeometry, material);
            scene.add(road);
            roadObjs.push(road);
        }

        return roadObjs;

    }
}