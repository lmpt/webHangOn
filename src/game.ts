import Race from "./game-modes/race";

let raceMode = new Race();
raceMode.setup();

function renderLoop() {
    requestAnimationFrame(renderLoop);
    raceMode.loop();
}
renderLoop();