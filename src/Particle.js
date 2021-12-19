System.Object.Particle = class {

    constructor(x, y) {
        this.PhysicsEngine = new System.Object.PhysicsEngine(this);
        this.PhysicsEngine.setPosition(x, y);
        this.PhysicsEngine.velocity = createVector(0, 0);
        this.PhysicsEngine.velocity.setMag(1)
        this.color = color(255, 255, 255);
        this.stroke = 0;
        this.strokeWeight = 0;

    }

    render() {
        stroke(this.stroke);
        strokeWeight(this.strokeWeight);
        fill(this.color);
        circle(
            this.PhysicsEngine.position.x,
            this.PhysicsEngine.position.y,
            this.PhysicsEngine.radius * 2
        )

        return this;
    }

    update() {
        this.PhysicsEngine.update();

        return this;
    }



    get position() {
        return {
            x: this.PhysicsEngine.position.x,
            y: this.PhysicsEngine.position.y,
        }
    }

    get radius() {
        return this.PhysicsEngine.radius;
    }

    set radius(r) {
        this.PhysicsEngine.radius = r;
    }

}


module.exports = System.Object.Particle;