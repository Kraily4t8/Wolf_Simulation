const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");

	var circle;
    for (var i = 0; i < 50; i++) {
        circle = new Circle(gameEngine, true);
        gameEngine.addEntity(circle);
    }
    for (var i = 0; i < 5; i++) {
        circle = new Circle(gameEngine, false);
        gameEngine.addEntity(circle);
    }
    gameEngine.weakened = gameEngine.entities[0];
    gameEngine.weakened.debug = true;
    gameEngine.weakened.MaxSpeed *= 0.70;
    gameEngine.weakened.color = "teal";

    document.getElementById("reset").addEventListener("click", () => {

        reset();
        console.log("reset clicked");
	});

	gameEngine.init(ctx);

	gameEngine.start();
});


function reset() {
    for (var i = 0; i < gameEngine.entities.length; i++) {
        gameEngine.entities[i].removeFromWorld = true;
    }

    for (var i = 0; i < 50; i++) {
        // gameEngine.entities[i].removeFromWorld = true;
        //gameEngine.removeFromWorld(gameEngine.entities[i]);
        circle = new Circle(gameEngine, true);
        gameEngine.addEntity(circle);
    }
    for (var i = 0; i < 5; i++) {
        //gameEngine.removeFromWorld(gameEngine.entities[i]);
        // gameEngine.entities[i].removeFromWorld = true;
        circle = new Circle(gameEngine, false);
        gameEngine.addEntity(circle);
    }
}
