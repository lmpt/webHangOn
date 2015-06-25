/**
 * Created by leothornton on 23/06/15.
 */
/**
 * Created by leothornton on 22/06/15.
 */
define(["../utility/vector"], function (vectorUtility) {
  return {
    build: function(spline, scene, roadMaterial) {

      roadMaterial.map.generateMipmaps = true;
      roadMaterial.map.minFilter = THREE.LinearFilter;
      roadMaterial.map.magFilter = THREE.LinearFilter;
      roadMaterial.map.wrapS = roadMaterial.map.wrapT = THREE.RepeatWrapping;
      roadMaterial.map.repeat.set( 1, 1 );

      roadObjs = [];

      for(i = 0; i < (spline.length -1); i++) {

        var roadGeometry = new THREE.Geometry();
        var sX = spline[i].x;
        var sY = spline[i].y;
        var sZ = spline[i].z;
        var nsX = spline[i+1].x;
        var nsY = spline[i+1].y;
        var nsZ = spline[i+1].z;


        roadGeometry.vertices.push(
          new THREE.Vector3( sX + 3.9, sY, sZ ),
          new THREE.Vector3( sX + 3.5,  sY, sZ ),
          new THREE.Vector3( nsX + 3.5, nsY, nsZ ),
          new THREE.Vector3( nsX + 3.9, nsY, nsZ),

          new THREE.Vector3( sX - 3.9, sY, sZ ),
          new THREE.Vector3( sX - 3.5,  sY, sZ ),
          new THREE.Vector3( nsX - 3.5, nsY, nsZ ),
          new THREE.Vector3( nsX - 3.9, nsY, nsZ)
        );


        roadGeometry.faces.push(
          new THREE.Face3( 1, 0, 2 ),
          new THREE.Face3( 2, 0, 3 ),
          new THREE.Face3( 4, 5, 6 ),
          new THREE.Face3( 4, 6, 7 )
        );

        roadGeometry.faceVertexUvs[0].push(
          [
            new THREE.Vector2(1,.45),
            new THREE.Vector2(1,.55),
            new THREE.Vector2(0,.45)
          ],
          [
            new THREE.Vector2(0,.45),
            new THREE.Vector2(1,.55),
            new THREE.Vector2(0,.55)
          ],
          [
            new THREE.Vector2(1,.45),
            new THREE.Vector2(1,.55),
            new THREE.Vector2(0,.55)
          ],
          [
            new THREE.Vector2(1,.55),
            new THREE.Vector2(0,.45),
            new THREE.Vector2(0,.55)
          ]
        );

        var road = new THREE.Mesh( roadGeometry, roadMaterial );

        scene.add( road );

        roadObjs.push(road);

      }

      return roadObjs;
    }
  };
});