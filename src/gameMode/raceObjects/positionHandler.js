/**
 * Created by leothornton on 02/07/15.
 */
define(
  ["../../utility/vector"],
  function(vectorUtility) {
  return {
    skyPlane: null,
    mFar: null,
    mClose: null,
    currentSpeed: null,
    roadSpline: null,
    player: {
      transform: new THREE.Vector3(0, 2,-1),
      cameraOffset: new  THREE.Vector3(-.75, 0, 0)
    },
    depthOffset: new THREE.Vector2(),
    currentSpline: 0,
    xdiffFromSpline: null,
    ydiffFromSpline: null,
    zdiffFromSpline: null,
    perToNextSpline: null,
    xDif: null,
    yDif: null,
    config: {
      heightFromGround: 2,
      xSplineDiffSmoothing: 25,
      ySplineDiffSmoothing: 15,
      yDiffChoke: 0.01,
      xDiffChoke: 0.01,
      yUpdateChoke: 0.001,
      xStepPerFrame: 0.05,
      yStepPerFrame: 0.05,
      yResetStepPerFrame: 0.0025,
      backdropDepthOffset: -30,
      xBackdropOffsetSkyPlane: 1,
      xBackdropOffsetFar: 4,
      xBackdropOffsetClose: 8,
      yBackdropOffsetSkyPlane: 10,
      yBackdropOffsetFar: 15,
      yBackdropOffsetClose: 20
    },
    deafultZ: null,
    updatePositions: function(xOffset) {

      if(this.player.transform.z < this.roadSpline[this.currentSpline].z) {
        this.currentSpline++;
      }

      this.player.transform.z += -this.currentSpeed;

      this.xdiffFromSpline = vectorUtility.diff(this.player.transform.x, this.roadSpline[this.currentSpline].x);

      ydiffFromSpline = vectorUtility.diff(this.player.transform.y, this.roadSpline[this.currentSpline].y + this.config.heightFromGround);

      zdiffFromSpline = vectorUtility.diff(this.player.transform.z, this.roadSpline[this.currentSpline].z);

      this.perToNextSpline = (zdiffFromSpline + this.deafultZ) / 2 - 1;

      xDif = (this.xdiffFromSpline / this.config.xSplineDiffSmoothing) * this.perToNextSpline;
      yDif = (ydiffFromSpline / this.config.ySplineDiffSmoothing) * this.perToNextSpline;

      this.player.transform.x += xDif;
      this.player.transform.y += yDif;

      if(yDif > this.config.yDiffChoke || yDif < -this.config.yDiffChoke) {
        if (yDif > 0) {
          this.depthOffset.y += this.config.yStepPerFrame * yDif;
        } else if (yDif < 0) {
          this.depthOffset.y -= this.config.yStepPerFrame * yDif;
        }
      } else if(this.depthOffset.y > this.config.yUpdateChoke || this.depthOffset.y < -this.config.yUpdateChoke) {
        if (this.depthOffset.y > 0) {
          this.depthOffset.y -= this.config.yResetStepPerFrame * this.perToNextSpline;
        } else {
          this.depthOffset.y += this.config.yResetStepPerFrame * this.perToNextSpline;
        }
      }


      if(xDif > this.config.xDiffChoke || xDif < -this.config.xDiffChoke) {
        if (xDif > 0) {
          this.depthOffset.x += this.config.xStepPerFrame * xDif;
        } else if (xDif < 0) {
          this.depthOffset.x += this.config.xStepPerFrame * xDif;
        }
      }

      this.skyPlane.position.z = this.player.transform.z + (this.config.backdropDepthOffset + 0.0001);
      this.skyPlane.position.x = this.player.transform.x - (this.depthOffset.x * this.config.xBackdropOffsetSkyPlane) + (xOffset * 0.95);
      this.skyPlane.position.y = this.player.transform.y - (this.depthOffset.y * this.config.yBackdropOffsetSkyPlane) + 10;

      this.mFar.position.z = this.player.transform.z + (this.config.backdropDepthOffset + 0.0002);
      this.mFar.position.x = this.player.transform.x - (this.depthOffset.x * this.config.xBackdropOffsetFar) + (xOffset * 0.85);
      this.mFar.position.y = this.player.transform.y - (this.depthOffset.y * this.config.yBackdropOffsetFar) + 2;

      this.mClose.position.z = this.player.transform.z + (this.config.backdropDepthOffset + 0.0003);
      this.mClose.position.x = this.player.transform.x - (this.depthOffset.x * this.config.xBackdropOffsetClose) + (xOffset * 0.8);
      this.mClose.position.y = this.player.transform.y - (this.depthOffset.y * this.config.yBackdropOffsetClose) + 2;
    },
    getPlayerRoadYOffset: function() {
      return ((this.roadSpline[this.currentSpline +1].y - this.roadSpline[this.currentSpline].y) * (this.perToNextSpline)) + this.roadSpline[this.currentSpline].y;
    }
  };
});