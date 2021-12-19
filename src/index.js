window.p5 = require("p5");
new p5();

const $System = require("./System");

const LoadObjects = () => {
    require("./PhysicsEngine");
    require("./Particle");
}

window.System = new $System();
LoadObjects();

setup = () => {
    System.setup();

    console.log(System)
}

draw = () => {
    window.System.update();
}

mousePressed = () => {
    window.System.mousePressed();
}

windowResized = () => {
    window.System.windowResized();
}