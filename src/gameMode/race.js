/**
 * Created by leothornton on 21/06/15.
 */
define([
  "../utility/vector",
  "../tracks/test",
  "gameMode/raceObjects/stageBuilder",
  "gameMode/raceObjects/positionHandler",
  "../../bower_components/mousetrap/mousetrap.min"
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
    currentSpeed: 0,
    roadSpline: null,
    cameraPosition: null,
    player: {
      object: new THREE.Mesh( new THREE.BoxGeometry(.7, 1, 1 ), new THREE.MeshPhongMaterial( { color: 0xeeeeee }) ),
      offset: new THREE.Vector3(0, -1.52, -3.5),
      zClamp: 0.5,
      xSpeed: 0,
      xStep: 0.005,
      xClamp: 0.1,
      roadClamp: 6
    },
    input: {
      steer: null,
      gas: false,
      brake: false,
      turbo: false
    },
    setup: function() {
      Mousetrap.reset();
      stageBuilder.setupScene(this.scene, this.camera, this.renderer, track);

      positionHandler.skyPlane = stageBuilder.skyPlane;
      positionHandler.mFar = stageBuilder.mFar;
      positionHandler.mClose = stageBuilder.mClose;
      positionHandler.roadSpline = stageBuilder.roadSpline;
      positionHandler.deafultZ = track.deafultZ;

      this.scene.add( this.player.object );

      var input = this.input;

      Mousetrap.bind('left', function() { input.steer = "left"; });
      Mousetrap.bind('left', function() { if(input.steer == "left") {input.steer = null;} }, 'keyup');
      Mousetrap.bind('right', function() { input.steer = "right"; });
      Mousetrap.bind('right', function() { if(input.steer == "right") {input.steer = null;} }, 'keyup');
      Mousetrap.bind('space', function() { input.gas = true; });
      Mousetrap.bind('space', function() { input.gas = false; }, 'keyup');
      Mousetrap.bind('a', function() { input.brake = true; });
      Mousetrap.bind('a', function() { input.brake = false; }, 'keyup');
      Mousetrap.bind('s', function() { input.turbo = true; });
      Mousetrap.bind('s', function() { input.turbo = false; }, 'keyup');



    },
    loop: function() {

      if(this.input.gas) {
        this.currentSpeed += 0.005;
      } else if(this.currentSpeed > 0.005) {
        this.currentSpeed -= 0.005;
      }

      if(this.input.steer == "left") {
        this.player.xSpeed += (this.player.xStep * this.currentSpeed);
      } else if(this.input.steer == "right") {
        this.player.xSpeed -= (this.player.xStep * this.currentSpeed);
      } else {
        if (this.player.xSpeed > 0.01) {
          this.player.xSpeed -= this.player.xStep;
        } else if(this.player.xSpeed < -0.01) {
          this.player.xSpeed += this.player.xStep;
        } else {
          this.player.xSpeed = 0;
        }
      }

      this.player.object.rotation.z = this.player.xSpeed * 5;

      this.player.xSpeed = vectorUtility.clamp(this.player.xSpeed, -this.player.xClamp, this.player.xClamp);

      this.currentSpeed = vectorUtility.clamp(this.currentSpeed, 0, this.player.zClamp);

      this.player.offset.x -= this.player.xSpeed;

      positionHandler.currentSpeed = this.currentSpeed;

      positionHandler.updatePositions(this.player.offset.x);

      this.cameraPosition = positionHandler.player.transform;

      this.player.offset.x = vectorUtility.clamp(this.player.offset.x, -this.player.roadClamp, this.player.roadClamp);

      if((this.player.offset.x - positionHandler.xdiffFromSpline > 4 || this.player.offset.x - positionHandler.xdiffFromSpline < -4)) {
        console.log("crash");
      }

//    console.log(this.player.offset.x - positionHandler.xdiffFromSpline);

      this.player.object.position.x = positionHandler.player.transform.x + this.player.offset.x;
      this.player.object.position.y = positionHandler.getPlayerRoadYOffset() + .5;
      this.player.object.position.z = positionHandler.player.transform.z + this.player.offset.z;

      this.camera.position.x = this.cameraPosition.x + this.player.offset.x;
      this.camera.position.y = this.cameraPosition.y;
      this.camera.position.z = this.cameraPosition.z;

      this.renderer.render(this.scene, this.camera);
    }
  };
});