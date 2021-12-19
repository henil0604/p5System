
class $System {

    constructor() {
        this.Object = {}

        this.CANVAS = null;

        this.options = {
            width: 400,
            height: 400,
            fullScreen: true
        }

        this.GRAVITY = createVector(0, 0);
        this.GRAVITATIONAL_CONSTANT = 0;

        this.AIR_DRAG = createVector(0, 0);
        this.AIR_DRAG_CALCULATION = false;
        this.AIR_DRAG_COEFFICIENT = 0;

        this.FRICTION_COEFFICIENT = 0;

        this.RESTITUTION_COEFFICIENT = -1;  // NEGATIVE

        this.PAUSED = false;

        this.CountCycles = {};
    }

    setup() {
        this.createCanvas();
        this.cofigure();
        this.p = new System.Object.Particle(width / 2, height / 2);
        this.p.radius = 30;
    }


    createCanvas() {
        this.CANVAS = createCanvas(
            this.size.width,
            this.size.height
        );
        return this;
    }

    cofigure() {
        this.GPE_LEVEL = height;
    }

    update() {
        angleMode(DEGREES);
        background(0, 255);
        this.cofigure();

        this.p.update().render();

        this.$AirDrag();
        this.$CountCycle();
        return this;
    }

    $AirDrag() {

        if (this.AIR_DRAG_CALCULATION) {

            if (this.CountCycles.AIR_DRAG == undefined) {
                this.CountCycles.AIR_DRAG = {
                    count: 0,
                    negativeRandomness: true,
                    randomnessRange: [0, 0]
                };
            }

            const x = random(-1, 1);
            const y = random(-1, 1);

            this.AIR_DRAG = createVector(x, y);

            this.AIR_DRAG.mult(this.AIR_DRAG_COEFFICIENT)
        }
    }

    $CountCycle() {
        for (let key in this.CountCycles) {
            const cycle = this.CountCycles[key];
            let value;

            if (Array.isArray(cycle.randomnessRange)) {
                let randomnessRangeX;
                let randomnessRangeY;
                randomnessRangeX = cycle.randomnessRange[0];
                randomnessRangeY = cycle.randomnessRange[1];
                value = random(randomnessRangeX, randomnessRangeY);
            } else {
                value = 1;
            }

            if (cycle.negativeRandomness) {
                value = random(-1, 1);
            }

            cycle.count += value;
        }
    }

    mousePressed() {
        this.p.PhysicsEngine.applyForce(p5.Vector.random2D().setMag(10))
    }

    windowResized() {
        if (this.options.fullScreen) {
            resizeCanvas(
                this.size.width,
                this.size.height
            );
        }
    }

    get size() {
        if (this.options.fullScreen) {
            return {
                width: windowWidth,
                height: windowHeight
            };
        }

        return {
            width: this.options.width,
            height: this.options.height
        }
    }

}




module.exports = $System;