/**
 * Created by leothornton on 21/06/15.
 */
define([
  "../utility/vector",
  "../tracks/test",
  "../splineObjects/roadBase",
  "../splineObjects/roadSides-1",
  "../splineObjects/roadSides-2",
  "../splineObjects/land"
  ], function (
  vectorUtility,
  testTrack,
  roadBase,
  roadSides1,
  roadSides2,
  land
  ) {
  return {
    renderer: new THREE.WebGLRenderer({antialias: true}),
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 30 ),
    currentSpline: 0,
    currentSpeed: 0.2,
    roadSpline: null,
    frameCount: 0,
    player: {
      position: new THREE.Vector3(0, 3, 2),
      cameraOffset: new  THREE.Vector3(-.75, 0, 0)
    },
    materials: {
      roadBase: new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "texture/road1.jpg" ) }),
      road1: new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "texture/road-side1.jpg" )}),
      road2: new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "texture/road-strip1.jpg" )}),
      ground: new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "texture/grass1.jpg" )}),
      sky: new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "texture/sky1.jpg" ), side: THREE.DoubleSide})
    },
    skyPlane : null,
    setup: function() {
      this.camera.up = new THREE.Vector3(0,1,0);
      this.renderer.setSize( window.innerWidth, window.innerHeight );
      document.body.appendChild( this.renderer.domElement );

      this.roadSpline = vectorUtility.buildSpline(testTrack.trackSpline);

      this.roadSpline = vectorUtility.smoothSpline(this.roadSpline);


      roadBase.build(
        this.roadSpline,
        this.scene,
        this.materials.roadBase
      );

      roadSides1.build(
        this.roadSpline,
        this.scene,
        this.materials.road1
        );

      roadSides2.build(
        this.roadSpline,
        this.scene,
        this.materials.road2
        );

      land.build(
        this.roadSpline,
        this.scene,
        this.materials.ground
        );

      var planeGeometry = new THREE.PlaneGeometry( 150, 35, 1 );
      this.skyPlane = new THREE.Mesh( planeGeometry, this.materials.sky );
      this.scene.add( this.skyPlane );


      this.skyPlane.rotation.x = 0;
      this.skyPlane.rotation.y = 0;
      this.skyPlane.rotation.z = 0;

      this.camera.position.z = 2;
      this.camera.position.y = 3;
      this.camera.rotation.x = 0;

      this.scene.fog = new THREE.Fog( 0xf2f7ff, 1, 25000 );

      this.scene.add( new THREE.AmbientLight( 0xeef0ff ) );
    },
    loop: function() {
             this.frameCount ++;

      if(this.frameCount > 7) {
        this.swapMettColor(this.materials.roadBase, 0, 1);
        //this.swapMettColor(this.materials.road1, 0, 1);
      }


      if(this.frameCount > 5) {
             this.frameCount = 0;
        //this.swapMettColor(this.materials.ground, 0, 1);
      }


      if(this.camera.position.z < this.roadSpline[this.currentSpline].z) {
        this.currentSpline++;
      }

      this.camera.position.z += -this.currentSpeed;

      var xdiffFromSpline = vectorUtility.diff(this.camera.position.x, this.roadSpline[this.currentSpline].x);

      var ydiffFromSpline = vectorUtility.diff(this.camera.position.y, this.roadSpline[this.currentSpline].y + 2);

      this.camera.position.x += xdiffFromSpline / 10;
      this.camera.position.y += ydiffFromSpline / 10;

      this.skyPlane.position.z = this.camera.position.z -29.9999;
      this.skyPlane.position.x = this.camera.position.x;
      this.skyPlane.position.y = this.camera.position.y + 7;

//      this.camera.lookAt(new THREE.Vector3(this.roadSpline[this.currentSpline+5].x,
//        this.roadSpline[this.currentSpline+10].y,
//        this.roadSpline[this.currentSpline+10].z));

      this.camera.position = this.position + this.cameraOffset;

      this.renderer.render( this.scene, this.camera );
    },
    swapMettColor: function (array_object, index_a, index_b) {
      var temp = array_object[index_a].color;
      array_object[index_a].color = array_object[index_b].color;
      array_object[index_b].color = temp;
    }
  };
});