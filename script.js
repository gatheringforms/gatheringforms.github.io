// Do not judge me for my code, thank you.

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Detector = Matter.Detector,
    Vector = Matter.Vector,
    Svg = Matter.Svg,
    Composite = Matter.Composite;

var engine = Engine.create();

engine.gravity.scale = 0;
var runner = Runner.create();
Runner.run(runner, engine);

var title = "GATHERINGFORMS";
var titleBodies = [];
var titleSVGs = [];

var widthSimulation = 1290;
var heightSimulation = 430;
var padding = 0;

var collisionAmount = 0;

var clicked = false;

function setup() {
    var canvas = createCanvas(windowWidth, (heightSimulation / widthSimulation) * windowWidth);
    resizeBackground(windowWidth, (heightSimulation / widthSimulation) * windowWidth);
    // canvas.parent("canvasContainer");
    initialiseBodies();


}

function resizeBackground(width, height) {
    var body = document.getElementById("canvasBackground");
    body.style.width = (width) + "px";
    body.style.height = (height) + "px";
}

function initialiseBodies() {
    var top = Bodies.rectangle(widthSimulation * 0.5, -50, widthSimulation, 100, {isStatic: true});
    var bottom = Bodies.rectangle(widthSimulation * 0.5, heightSimulation + 50, widthSimulation, 100, {isStatic: true});

    var left = Bodies.rectangle(-50, heightSimulation * 0.5, 100, heightSimulation, {isStatic: true});
    var right = Bodies.rectangle(widthSimulation + 50, heightSimulation * 0.5, 100, heightSimulation, {isStatic: true});

    Composite.add(engine.world, [top, bottom, left, right]);

    for (let i = 0; i < title.length; i++) {
        var size = random(5, 80);
        var newBody = Bodies.rectangle((90 + 35) + 80 * i, heightSimulation * 0.5, 70, 130);
        titleBodies[i] = newBody;
        titleSVGs[i] = loadImage("./assets/" + title[i] + ".svg");    
    }
    Composite.add(engine.world, titleBodies);
}

function draw() {
    
    

    var collisionDetector = Detector.create();
    Detector.setBodies(collisionDetector, titleBodies);
    //background(255);
    clear();
    scale(width / widthSimulation);

    var offset = sin(millis() / 4000 * TWO_PI) * 1;
    engine.gravity.scale = offset * 0.00001;
    var bodies = Composite.allBodies(engine.world);
    for (var i = 0; i < titleBodies.length; i += 1) {
        var titleBody = titleBodies[i];
        var pos = titleBody.position;
        var angle = titleBody.angle;

        push();
        translate(pos.x, pos.y + offset);
        rotate(angle);
        imageMode(CENTER);
        if (millis() % 5000 < 300) {
            var index = noise(millis() * 0.003, i * 100) * 1.5 - 0.5;
            if (index < 0) {
                index = i;
            } else {
                index = floor(index * titleBodies.length);
            }
            image(titleSVGs[index], 0, 0, 70, 130);
        } else {
            image(titleSVGs[i], 0, 0, 70, 130);
        }  
        pop();        
    }

    if (frameCount % 60 == 1) {
        if (!clicked) {
            spreadBodies(1);
        }
        
    } 

    var collisions = Detector.collisions(collisionDetector);
    if (collisions.length > 0) {
        if (collisionAmount < collisions.length) {
            console.log("Boop " + (collisions.length - collisionAmount));
            //soundHit.play();
        }
        collisionAmount = collisions.length;
    }

    filter(INVERT);

}

function spreadBodies(mult) {
    for (var i = 0; i < titleBodies.length; i += 1) {
        var body = titleBodies[i];
        Body.setAngularSpeed(body, random(-0.001, 0.001) * mult);
        var velocity = Vector.create(random(0.1) * mult, 0);
        velocity = Vector.rotate(velocity, random(-TWO_PI, TWO_PI));
        Body.setVelocity(body, velocity);
    }
}
function windowResized() {
  resizeCanvas(windowWidth, (heightSimulation / widthSimulation) * windowWidth);
  resizeBackground(windowWidth, (heightSimulation / widthSimulation) * windowWidth);
}

function mouseClicked() {
    clicked = true;
    spreadBodies(40);
}