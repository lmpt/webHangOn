/**
 * Created by leothornton on 21/06/15.
 */
define([
  "../utility/vector",
  "../tracks/test",
  "gameMode/raceObjects/stageBuilder",
  "gameMode/raceObjects/positionHandler"
  ], function (
  vectorUtility,
  track,
  stageBuilder,
  positionHandler
  ) {
  return {
    renderer: new THREE.WebGLRenderer({antialias: true}),
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 30 ),
    currentSpeed: 0.5,
    roadSpline: null,
    cameraPosition: null,
    setup: function() {

      stageBuilder.setupScene(this.scene, this.camera, this.renderer, track);

      positionHandler.skyPlane = stageBuilder.skyPlane;
      positionHandler.mFar = stageBuilder.mFar;
      positionHandler.mClose = stageBuilder.mClose;
      positionHandler.roadSpline = stageBuilder.roadSpline;
      positionHandler.deafultZ = track.deafultZ;

    },
    loop: function() {

      positionHandler.currentSpeed = this.currentSpeed;

      positionHandler.updatePositions();

      this.cameraPosition = positionHandler.player.transform;

      this.camera.position.x = this.cameraPosition.x;
      this.camera.position.y = this.cameraPosition.y;
      this.camera.position.z = this.cameraPosition.z;

      this.renderer.render(this.scene, this.camera);
    }
  };
});