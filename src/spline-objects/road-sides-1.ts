import Spline from "./spline";
import Scene = THREE.Scene;
import MeshPhongMaterial = THREE.MeshPhongMaterial;

export class RoadSides1 {
    constructor(roadSpline:Spline, scene:Scene, material:MeshPhongMaterial) {

        material.map.generateMipmaps = true;
        material.map.minFilter = THREE.LinearFilter;
        material.map.magFilter = THREE.LinearFilter;
        material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
        material.map.repeat.set(1, 1);

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
                new THREE.Vector3(sX + 3.9, sY, sZ),
                new THREE.Vector3(sX + 3.5, sY, sZ),
                new THREE.Vector3(nsX + 3.5, nsY, nsZ),
                new THREE.Vector3(nsX + 3.9, nsY, nsZ),

                new THREE.Vector3(sX - 3.9, sY, sZ),
                new THREE.Vector3(sX - 3.5, sY, sZ),
                new THREE.Vector3(nsX - 3.5, nsY, nsZ),
                new THREE.Vector3(nsX - 3.9, nsY, nsZ)
            );

            roadGeometry.faces.push(
                new THREE.Face3(1, 0, 2),
                new THREE.Face3(2, 0, 3),
                new THREE.Face3(4, 5, 6),
                new THREE.Face3(4, 6, 7)
            );

            roadGeometry.faceVertexUvs[0].push(
                [
                    new THREE.Vector2(1, .45),
                    new THREE.Vector2(1, .55),
                    new THREE.Vector2(0, .45)
                ],
                [
                    new THREE.Vector2(0, .45),
                    new THREE.Vector2(1, .55),
                    new THREE.Vector2(0, .55)
                ],
                [
                    new THREE.Vector2(1, .45),
                    new THREE.Vector2(1, .55),
                    new THREE.Vector2(0, .55)
                ],
                [
                    new THREE.Vector2(1, .55),
                    new THREE.Vector2(0, .45),
                    new THREE.Vector2(0, .55)
                ]
            );

            var road = new THREE.Mesh(roadGeometry, material);

            scene.add(road);

            roadObjs.push(road);
        }

        return roadObjs;

    }
}