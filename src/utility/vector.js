/**
 * Created by leothornton on 21/06/15.
 */
define(function () {
  return {
    diff: function(num1, num2) {
      var diff = Math.abs(num1 - num2);
      if(num1 > num2) {
        return -Math.abs(diff);
      } else {
        return diff;
      }
    },
    smoothSpline: function(spline) {
      var newSpline = [];
      for(i = 0; i < (spline.length -1); i++) {
        var sX = spline[i].x;
        var sY = spline[i].y;
        var sZ = spline[i].z;
        var nsX = spline[i+1].x;
        var nsY = spline[i+1].y;
        var nsZ = spline[i+1].z;
        newSpline.push(spline[i]);

        var newX = sX + (((this.diff(sX, nsX) / 2)) / 1.1);
        var newY = sY + (((this.diff(sY, nsY) / 2)) / 1.1);
        var newZ = sZ + (((this.diff(sZ, nsZ) / 2)) / 1.01);

        newSpline.push(new THREE.Vector3( newX, newY, newZ ));

      }

      newSpline.push(spline[spline.length -1]);

      return newSpline;
    },
    buildSpline: function(diffArray, segmentLength) {
      var newSpline = [];
      var x = 0;
      var y = 0;
      var z = 0;
      for(i = 0; i < diffArray.length; i++) {
        x += diffArray[i].x;
        y += diffArray[i].y;
        z += (diffArray[i].z - segmentLength);
        newSpline.push(new THREE.Vector3( x, y, z ));
      }
      return newSpline;
    },
    clamp: clamp = function(number, min, max) {
      return Math.min(Math.max(number, min), max);
    }
  };
});