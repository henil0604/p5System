const EventEmitter = require('events')
const random = require("@helper-modules/random");

System.Object.PhysicsEngine = class {

    constructor(Body) {
        this.Body = Body;

        this.ID = random();
        this.position = createVector();
        this.velocity = createVector();
        this.acceleration = createVector();
        this.mass = 1;
        this.paused = false;
        this.radius = 5;
        this.lastFrame = {};
        this.lifespan = 0;
        this.createdAt = Date.now();
        this.Events = new EventEmitter();

        this.EDGE_COLLISION = true;
        this.GRAVITATIONAL_OBJECTS = [];
        this.GRAVITATIONAL_DISTANCE_CONSTRAIN = [100, 1000]

        this.AIR_DRAG = createVector(0, 0);
        this.AIR_DRAG_MODE = "global";

        this.FRICTION_COEFFICIENT = 0;
        this.FRICTION_MODE = "global";

        this.setEvents().all();

        setInterval(() => {
            this.lastFrame = this.data;
        }, 100);

    }

    setEvents() {

        const once = () => {

        }

        const all = () => {

            once();

        }


        return { once, all };

    }

    $eventTransmiter() {

        const data = this.data;


    }

    update() {
        if (this.paused || System.PAUSED) {
            return this;
        }

        this.$gravity()

        stroke(255, 255, 255, 100);
        fill(255, 255, 255, 100);
        point(this.position.x, this.position.y);

        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.acceleration.mult(0);

        this.$gravitationalObjects();
        this.$edgeCollision();
        this.$airDrag();
        this.$friction();

        this.$eventTransmiter();
        this.lifespan++;

        return this;
    }

    $gravity() {
        this.acceleration.add(System.GRAVITY);
    }

    $friction() {

        if (!this.EDGE_COLLISION) return;

        const data = this.data;
        const friction = this.velocity.copy();
        friction.normalize();
        friction.mult(-1);
        friction.setMag(this.mass * this.FRICTION_COEFFICIENT$$);

        if (data.distanceFromEdge.BOTTOM <= this.radius + 1) {
            this.applyForce(friction);
        }
    }

    $gravitationalObjects() {
        this.GRAVITATIONAL_OBJECTS.forEach(PhysicsObject => {
            PhysicsObject = System.Object.PhysicsEngine.ParseEngine(PhysicsObject);

            if (this.isItSelf(PhysicsObject)) {
                return;
            }

            const GForce = this.gravitationalForce(PhysicsObject);
            this.applyForce(GForce);

        });
    }

    $edgeCollision() {

        if (!this.EDGE_COLLISION) return this;

        const data = this.data;

        if (data.distanceFromEdge.BOTTOM <= this.radius) {
            this.position.y = height - this.radius;
            this.velocity.y = this.velocity.y * System.RESTITUTION_COEFFICIENT;
        }

        if (data.distanceFromEdge.TOP <= this.radius) {
            this.position.y = this.radius;
            this.velocity.y = this.velocity.y * System.RESTITUTION_COEFFICIENT;
        }

        if (data.distanceFromEdge.LEFT <= this.radius) {
            this.position.x = this.radius;
            this.velocity.x = this.velocity.x * System.RESTITUTION_COEFFICIENT;
        }

        if (data.distanceFromEdge.RIGHT <= this.radius) {
            this.position.x = width - this.radius;
            this.velocity.x = this.velocity.x * System.RESTITUTION_COEFFICIENT;
        }


        return this;

    }

    $airDrag() {
        this.applyForce(this.AIR_DRAG$$);
    }

    applyForce(Force) {
        const F = p5.Vector.div(Force, this.mass);
        this.acceleration.add(F);
        return this;
    }

    setPosition(x = this.position.x, y = this.position.y) {
        this.position.x = x;
        this.position.y = y;
        return this;
    }

    setVelocity(x = this.velocity.x, y = this.velocity.y) {
        this.velocity = createVector(x, y)
    }

    get distanceFromGPE() {
        let d = dist(this.position.x, this.position.y, this.position.x, System.GPE_LEVEL);

        if (this.position.y > System.GPE_LEVEL) {
            d = -d;
        }

        return d;
    }

    distanceFromEdge(edge = "") {
        let x1 = this.position.x;
        let y1 = this.position.y;
        let x2;
        let y2;
        let d;

        if (edge == "TOP") {
            x2 = this.position.x;
            y2 = 0;
        }

        if (edge == "BOTTOM") {
            x2 = this.position.x;
            y2 = height;
        }

        if (edge == "LEFT") {
            x2 = 0;
            y2 = this.position.y;
        }

        if (edge == "RIGHT") {
            x2 = width;
            y2 = this.position.y;
        }

        d = dist(x1, y1, x2, y2);

        if (edge == "TOP") {
            d = this.position.y < 0 ? -d : d;
        }

        if (edge == "BOTTOM") {
            d = this.position.y > height ? -d : d;
        }

        if (edge == "LEFT") {
            d = this.position.x < 0 ? -d : d;
        }

        if (edge == "RIGHT") {
            d = this.position.x > width ? -d : d;
        }

        return d;
    }

    get data() {
        let data = {};

        data.position = this.position.copy();
        data.velocity = this.velocity.copy();
        data.acceleration = this.acceleration.copy();
        data.Energy = this.Energy;
        data.KineticEnergy = this.KineticEnergy;
        data.PotentialEnergy = this.PotentialEnergy;
        data.distanceFromGPE = this.distanceFromGPE;
        data.momentum = this.momentum;
        data.mass = this.mass;
        data.radius = this.radius;
        data.distanceFromEdge = {};
        data.distanceFromEdge.TOP = this.distanceFromEdge("TOP");
        data.distanceFromEdge.BOTTOM = this.distanceFromEdge("BOTTOM");
        data.distanceFromEdge.LEFT = this.distanceFromEdge("LEFT");
        data.distanceFromEdge.RIGHT = this.distanceFromEdge("RIGHT");

        return data;
    }

    gravitationalForce(PhysicsObject) {
        PhysicsObject = System.Object.PhysicsEngine.ParseEngine(PhysicsObject);

        const p1 = this.position;
        const p2 = PhysicsObject.position;
        let Force = p5.Vector.sub(p2, p1);
        const c1 = this.GRAVITATIONAL_DISTANCE_CONSTRAIN[0];
        const c2 = this.GRAVITATIONAL_DISTANCE_CONSTRAIN[1];

        const r = constrain(Force.mag(), c1, c2);

        const m1 = this.mass;
        const m2 = PhysicsObject.mass;

        const strength = (System.GRAVITATIONAL_CONSTANT * (m1 * m2)) / r * r;

        Force.setMag(strength);
        return Force;
    }

    intercepts(PhysicsObject) {
        PhysicsObject = System.Object.PhysicsEngine.ParseEngine(PhysicsObject);

        const x1 = this.position.x;
        const y1 = this.position.y;
        const x2 = PhysicsObject.position.x;
        const y2 = PhysicsObject.position.y;

        const distance = dist(x1, y1, x2, y2)
        const r = this.radius + PhysicsObject.radius;

        if (distance <= r) {
            return true;
        }

        return false;
    }

    isItSelf(PhysicsObject) {
        PhysicsObject = System.Object.PhysicsEngine.ParseEngine(PhysicsObject);

        if (PhysicsObject.ID == this.ID) {
            return true;
        }
        return false;
    }

    get AIR_DRAG$$() {
        if (this.AIR_DRAG_MODE == "global") {
            return System.AIR_DRAG;
        }
        return this.AIR_DRAG;
    }

    get FRICTION_COEFFICIENT$$() {
        if (this.FRICTION_MODE == "global") {
            return System.FRICTION_COEFFICIENT;
        }
        return this.FRICTION_COEFFICIENT;
    }

    get weight() {
        return p5.Vector.mult(System.GRAVITY, this.mass);
    }

    get KineticEnergy() {
        return (this.mass * this.velocity.magSq()) / 2;
    }

    get PotentialEnergy() {
        const h = this.distanceFromGPE;
        return (this.mass * System.GRAVITY.mag() * h);
    }

    get Energy() {
        return this.potentialEnergy + this.kineticEnergy;
    }

    get momentum() {
        return this.mass * this.velocity.mag();
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
    }

    static ParseEngine(Object) {
        if (Object instanceof System.Object.Particle) {
            Object = Object.PhysicsEngine;
        }

        return Object
    }

}

module.exports = System.Object.PhysicsEngine;