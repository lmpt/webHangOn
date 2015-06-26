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
    depthOffset: new THREE.Vector2(),
    materials: {
      roadBase: new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "texture/road1.jpg" ) }),
      road1: new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "texture/road-side1.jpg" )}),
      road2: new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "texture/road-strip1.jpg" )}),
      ground: new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "texture/grass1.jpg" )}),
      sky: new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "texture/sky1.jpg" ), side: THREE.DoubleSide}),
      mFar: new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "texture/mountain-back1.png" ), side: THREE.DoubleSide, transparent: true}),
      mClose: new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "texture/mountain-front1.png" ), side: THREE.DoubleSide, transparent: true})
    },
    skyPlane : null,
    mFar: null,
    mClose: null,
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

      var skyGeometry = new THREE.PlaneGeometry( 120, 35, 1 );
      this.skyPlane = new THREE.Mesh( skyGeometry, this.materials.sky );
      this.scene.add( this.skyPlane );

      var mFarGeometry = new THREE.PlaneGeometry( 150, 35, 1 );
      this.mFar = new THREE.Mesh( mFarGeometry, this.materials.mFar );
      this.scene.add( this.mFar );

      var mCloseGeometry = new THREE.PlaneGeometry( 150, 35, 1 );
      this.mClose = new THREE.Mesh( mCloseGeometry, this.materials.mClose );
      this.scene.add( this.mClose );



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

      var zdiffFromSpline = vectorUtility.diff(this.camera.position.z, this.roadSpline[this.currentSpline].z);

      var perToNextSpline = (zdiffFromSpline + 4) / 2 - 1;

      var xDif = (xdiffFromSpline / 10) * perToNextSpline;
      var yDif = (ydiffFromSpline / 10) * perToNextSpline;

      this.camera.position.x += xDif;
      this.camera.position.y += yDif;

      if(yDif > 0.01 || yDif < -0.01) {
        if (yDif > 0) {
          this.depthOffset.y += .05 * yDif;
        } else if (yDif < 0) {
          this.depthOffset.y -= .05 * yDif;
        }
      } else {
        if (this.depthOffset.y > 0) {
          this.depthOffset.y -= .001 * perToNextSpline;
        } else if (this.depthOffset.y < 0) {
          this.depthOffset.y += .001 * perToNextSpline;
        }
      }

      if(xDif > 0.03 || xDif < -0.03) {
        if (xDif > 0) {
          this.depthOffset.x += .1 * xDif;
        } else if (xDif < 0) {
          this.depthOffset.x -= .1 * xDif;
        }
      } else if(this.depthOffset.x > 0.06 || this.depthOffset.x < -0.06) {
        if (this.depthOffset.x > 0) {
          this.depthOffset.x -= .05;
        } else if (this.depthOffset.x < 0) {
          this.depthOffset.x += .05;
        }
      }

      //this.depthOffset.y = vectorUtility.clamp(this.depthOffset.y, -2, 2);



      this.skyPlane.position.z = this.camera.position.z -29.9999;
      this.skyPlane.position.x = this.camera.position.x;
      this.skyPlane.position.y = this.camera.position.y - (this.depthOffset.y * 5) + 10;

      this.mFar.position.z = this.camera.position.z -29.9998;
      this.mFar.position.x = this.camera.position.x - this.depthOffset.x * 2;
      this.mFar.position.y = this.camera.position.y - (this.depthOffset.y * 10) + 2;

      this.mClose.position.z = this.camera.position.z -29.9997;
      this.mClose.position.x = this.camera.position.x -this.depthOffset.x * 4;
      this.mClose.position.y = this.camera.position.y - (this.depthOffset.y * 20) + 2;

      this.renderer.render( this.scene, this.camera );
    },
    swapMettColor: function (array_object, index_a, index_b) {
      var temp = array_object[index_a].color;
      array_object[index_a].color = array_object[index_b].color;
      array_object[index_b].color = temp;
    }
  };
});