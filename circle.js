function Circle(game, prey) {
    this.game = game;
    this.radius = 3;
    this.prey = prey;
    this.coWeight = 0.25;
    this.alWeight = 0.075;
    this.seWeight = 25;
    this.fleeWeight = 10000;
    this.endurance = 1.33;
    if (this.prey) {
        this.visualRadius = parseFloat(document.getElementById("prey_radius").value);
        this.MaxSpeed = parseFloat(document.getElementById("prey_max_speed").value);
        this.maxSpeed = this.MaxSpeed;
        this.decay = parseFloat(document.getElementById("prey_decay").value, 10);
        this.minSpeed = parseFloat(document.getElementById("prey_min_speed").value);
        this.color = "White";
        this.x = 375 + Math.random() * 50;
        this.y = 650 + Math.random() * 50;
        var bit = { x: Math.floor(Math.random() * 2), y: Math.floor(Math.random() * 2) };
        this.velocity = { x: Math.pow(-1, bit.x) * Math.random() * 1000, y: Math.pow(-1, bit.y) * Math.random() * 1000 };
    } else {
        this.coWeight = parseFloat(document.getElementById("coh_weight").value);
        this.alWeight = parseFloat(document.getElementById("ali_weight").value);
        this.seWeight = parseFloat(document.getElementById("sep_weight").value);
        this.fleeWeight = parseFloat(document.getElementById("fle_weight").value);
        this.endurance = parseFloat(document.getElementById("endu").value);

        this.visualRadius = parseFloat(document.getElementById("predator_radius").value);
        this.MaxSpeed = parseFloat(document.getElementById("predator_max_speed").value);
        this.maxSpeed = this.MaxSpeed;
        this.decay = parseFloat(document.getElementById("predator_decay").value);
        this.minSpeed = parseFloat(document.getElementById("predator_min_speed").value);
        this.color = "Red";
        this.x = 390 + Math.random() * 20
        this.y = 780 + Math.random() * 20 - this.radius;
        this.velocity = { x: 0, y: -this.maxSpeed };
    }

    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > this.maxSpeed) {
        var ratio = this.maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }

};

Circle.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Circle.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Circle.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

Circle.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Circle.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

Circle.prototype.update = function () {
    // update variables
    if (this.prey) {
        this.visualRadius = parseFloat(document.getElementById("prey_radius").value);
        this.MaxSpeed = parseFloat(document.getElementById("prey_max_speed").value);
        this.maxSpeed = this.MaxSpeed;
        this.decay = parseFloat(document.getElementById("prey_decay").value, 10);
        this.minSpeed = parseFloat(document.getElementById("prey_min_speed").value);
        document.getElementById('PreyRadius').innerHTML = "Prey vision radius: " + this.visualRadius;
        document.getElementById('PreyMaxSpeed').innerHTML = "Prey max speed: " + this.MaxSpeed;
        document.getElementById('PreyMinSpeed').innerHTML = "Prey min speed: " + this.minSpeed;
        document.getElementById('PreyDecay').innerHTML = "Prey decay: " + this.decay;
    } else {
        this.coWeight = parseFloat(document.getElementById("coh_weight").value);
        this.alWeight = parseFloat(document.getElementById("ali_weight").value);
        this.seWeight = parseFloat(document.getElementById("sep_weight").value);
        this.fleeWeight = parseFloat(document.getElementById("fle_weight").value);
        this.endurance = parseFloat(document.getElementById("endu").value);

        this.visualRadius = parseFloat(document.getElementById("predator_radius").value);
        this.MaxSpeed = parseFloat(document.getElementById("predator_max_speed").value);
        this.maxSpeed = this.MaxSpeed;
        this.decay = parseFloat(document.getElementById("predator_decay").value);
        this.minSpeed = parseFloat(document.getElementById("predator_min_speed").value);
        document.getElementById('PredatorRadius').innerHTML = "Predator vision radius: " + this.visualRadius;
        document.getElementById('PredatorMaxSpeed').innerHTML = "Predator max speed: " + this.MaxSpeed;
        document.getElementById('PredatorMinSpeed').innerHTML = "Predator min speed: " + this.minSpeed;
        document.getElementById('PredatorDecay').innerHTML = "Predator decay: " + this.decay;

        document.getElementById('Endurance').innerHTML = "Endurance: " + this.endurance;
        document.getElementById('coWeight').innerHTML = "Cohesion weight: " + this.coWeight;
        document.getElementById('alWeight').innerHTML = "Alignment weight: " + this.alWeight;
        document.getElementById('seWeight').innerHTML = "Separation weight: " + this.seWeight;
        document.getElementById('fleeWeight').innerHTML = "Flee weight: " + this.fleeWeight;
    }

    // update max speed
    this.maxSpeed = Math.max(this.minSpeed, this.MaxSpeed * Math.min(this.endurance, 1));
    this.endurance = this.endurance * Math.pow(this.decay, this.game.clockTick);

    //if (this.debug) console.log("speed: " + this.maxSpeed + "end: " + this.endurance);

    // update position
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > this.maxSpeed) {
        var ratio = this.maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    var count = 0;
    var cohesion = { x: 0, y: 0 };
    var alignment = { x: 0, y: 0 };
    var separation = { x: 0, y: 0 };

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];

        // if entities collide
        if (ent !== this && this.collide(ent)) {
            var temp = { x: this.velocity.x, y: this.velocity.y };

            var dist = distance(this, ent);
            var delta = this.radius + ent.radius - dist;
            var difX = (this.x - ent.x) / dist;
            var difY = (this.y - ent.y) / dist;

            this.x += difX * delta / 2;
            this.y += difY * delta / 2;
            ent.x -= difX * delta / 2;
            ent.y -= difY * delta / 2;
        }

        if (ent != this && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius })) {
            var dist = distance(this, ent);
            // if predators flee prey
            if (!this.prey && ent.prey && dist > this.radius + ent.radius + 10) {
                var difX = (ent.x - this.x) / dist;
                var difY = (ent.y - this.y) / dist;
                this.velocity.x += difX * this.fleeWeight / (dist * dist);
                this.velocity.y += difY * this.fleeWeight / (dist * dist);
            }
            // if prey flee predators
            if (this.prey && !ent.prey && dist > this.radius + ent.radius) {
                var difX = (ent.x - this.x) / dist;
                var difY = (ent.y - this.y) / dist;
                this.velocity.x -= difX * this.fleeWeight / (dist * dist);
                this.velocity.y -= difY * this.fleeWeight / (dist * dist);
            }

            // herding
            // if agents are same type
            if (this.prey === ent.prey) {
                count++;

                // cohesion
                cohesion.x += ent.x;
                cohesion.y += ent.y;

                // alignment
                var speed = Math.sqrt(ent.velocity.x * ent.velocity.x + ent.velocity.y * ent.velocity.y);
                alignment.x += ent.velocity.x / speed;
                alignment.y += ent.velocity.y / speed;

                // separation
                separation.x += (ent.x - this.x) / (dist * dist * dist);
                separation.y += (ent.y - this.y) / (dist * dist * dist);
            }
        }
    }

    if (count > 0) {
        cohesion.x = cohesion.x / count;
        cohesion.y = cohesion.y / count;

        dist = distance(this, cohesion);
        var difX = (cohesion.x - this.x) / dist;
        var difY = (cohesion.y - this.y) / dist;

        this.velocity.x += difX * this.coWeight;
        this.velocity.y += difY * this.coWeight;
    }

    // apply alignment
    dist = distance(this, alignment);
    var difX = (alignment.x - this.x) / dist;
    var difY = (alignment.y - this.y) / dist;

    this.velocity.x += difX * this.alWeight;
    this.velocity.y += difY * this.alWeight;

    // apply separation

    this.velocity.x -= separation.x * this.seWeight;
    this.velocity.y -= separation.y * this.seWeight;
};

Circle.prototype.draw = function (ctx) {
    var difX = (this.x - this.game.weakened.x);
    var difY = (this.y - this.game.weakened.y);

    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(400 + difX, 400 + difY, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    ctx.beginPath();
    ctx.strokeStyle = "Black";
    ctx.moveTo(400 + difX, 400 + difY);
    ctx.lineTo(400 + difX + this.velocity.x / speed * this.radius, 400 + difY + this.velocity.y / speed * this.radius);
    ctx.stroke();
    ctx.closePath();
};
