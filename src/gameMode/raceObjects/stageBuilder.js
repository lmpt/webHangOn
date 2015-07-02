/**
 * Created by leothornton on 01/07/15.
 */
define([
  "../../utility/vector",
  "../../splineObjects/roadBase",
  "../../splineObjects/roadSides-1",
  "../../splineObjects/roadSides-2",
  "../../splineObjects/land"
], function (
  vectorUtility,
  roadBase,
  roadSides1,
  roadSides2,
  land) {
return {
    materials: {
      roadBase: new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "texture/road1.jpg" ) }),
      road1: new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "texture/road-side1.jpg" )}),
      road2: new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "texture/road-strip1.jpg" )}),
      ground: new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "texture/grass1.jpg" )}),
      sky: new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "texture/sky1.jpg" ), side: THREE.DoubleSide}),
      mFar: new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "texture/mountain-back1.png" ), side: THREE.DoubleSide, transparent: true}),
      mClose: new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "texture/mountain-front1.png" ), side: THREE.DoubleSide, transparent: true})
    },
    roadSpline: null,
    skyPlane : null,
    mFar: null,
    mClose: null,
    setupScene: function (scene, camera, renderer, track) {
      camera.up = new THREE.Vector3(0,1,0);
      renderer.setSize( window.innerWidth, window.innerHeight );
      document.body.appendChild( renderer.domElement );

      this.roadSpline = vectorUtility.buildSpline(track.trackSpline, track.deafultZ);

      this.roadSpline = vectorUtility.smoothSpline(this.roadSpline);

      roadBase.build(
        this.roadSpline,
        scene,
        this.materials.roadBase
      );

      roadSides1.build(
        this.roadSpline,
        scene,
        this.materials.road1
      );

      roadSides2.build(
        this.roadSpline,
        scene,
        this.materials.road2
      );

      land.build(
        this.roadSpline,
        scene,
        this.materials.ground
      );

      var skyGeometry = new THREE.PlaneGeometry( 120, 35, 1 );
      this.skyPlane = new THREE.Mesh( skyGeometry, this.materials.sky );
      scene.add( this.skyPlane );

      var mFarGeometry = new THREE.PlaneGeometry( 150, 35, 1 );
      this.mFar = new THREE.Mesh( mFarGeometry, this.materials.mFar );
      scene.add( this.mFar );

      var mCloseGeometry = new THREE.PlaneGeometry( 150, 35, 1 );
      this.mClose = new THREE.Mesh( mCloseGeometry, this.materials.mClose );
      scene.add( this.mClose );

      camera.position.z = 2;
      camera.position.y = 3;
      camera.rotation.x = 0;

      scene.fog = new THREE.Fog( 0xf2f7ff, 1, 25000 );

      scene.add( new THREE.AmbientLight( 0xeef0ff ) );

    }
  }});