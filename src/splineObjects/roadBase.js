/**
 * Created by leothornton on 22/06/15.
 */
define(function () {
  return {
    build: function(spline, scene, roadMaterial) {

      roadObjs = [];

      for(i = 0; i < (spline.length -1); i++) {

        var roadGeometry = new THREE.Geometry();
        var sX = spline[i].x;
        var sY = spline[i].y;
        var sZ = spline[i].z;
        var nsX = spline[i+1].x;
        var nsY = spline[i+1].y;
        var nsZ = spline[i+1].z;


        roadMaterial.map.generateMipmaps = true;
        roadMaterial.map.minFilter = THREE.LinearFilter;
        roadMaterial.map.magFilter = THREE.LinearFilter;

        roadGeometry.vertices.push(
          new THREE.Vector3( sX + 3.5, sY, sZ ),
          new THREE.Vector3( sX - 3.5,  sY, sZ ),
          new THREE.Vector3( nsX - 3.5, nsY, nsZ ),
          new THREE.Vector3( nsX + 3.5, nsY, nsZ)
        );

        var face = new THREE.Face3( 1, 0, 2);
        var face2 = new THREE.Face3( 2, 0, 3);


        roadGeometry.faces.push(
          face,
          face2
        );



        roadGeometry.faceVertexUvs[0].push(
          [
            new THREE.Vector2(1,1),
            new THREE.Vector2(0,1),
            new THREE.Vector2(1,0)
          ],
          [
            new THREE.Vector2(1,0),
            new THREE.Vector2(0,1),
            new THREE.Vector2(0,0)
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