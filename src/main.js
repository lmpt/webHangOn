/**
 * Created by leothornton on 21/06/15.
 */
requirejs(["../bower_components/three.js/three.min"], function() {

  requirejs(["gameMode/race"], function(raceMode) {
    raceMode.setup();

    function renderLoop() {
      requestAnimationFrame( renderLoop );
      raceMode.loop();
    }
    renderLoop();

  });

});