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
    });

    document.getElementById("start_sim").addEventListener("click", () => {
        startSim();
    });

    gameEngine.init(ctx);
    gameEngine.start();
});

/**
 * Start simulation without hooks for data collection.
 */
function reset() {
    gameEngine.entities = [];

    gameEngine.ticks = 0;

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
}

/**
 * Connect to remote database.
 */
function databaseConnectSetup() {
    socket = io.connect('http://73.225.31.4:8888'); //connect out
    
    // socket.on("find", function (array) {
    //     if (array.length > 0) parseData(array);
    //     else console.log("Empty data.");
    // });

    params.dbConnectSuccess = true; //log that we've successfully connected
}

/**
 * Start simulation with data hooks for data collection.
 */
function startSim() {
    //first run setup
    if (!params.simMode) {

        //verify user isn't a meanie
        var runCountInput = document.getElementById("numberInput").value;
        if (runCountInput == '' || isNaN(runCountInput) || runCountInput < 1) {
            console.log('Invalid run count input');
            return;
        }

        var targetTickInput = document.getElementById("tickTarget").value;
        if (targetTickInput == '' || isNaN(targetTickInput) || targetTickInput < 100) {
            console.log('Invalid tick count input');
            return;
        }

        //turn on data collection mode
        params.simMode = true; //ensure sim mode is on
        params.runTarget = runCountInput;
        params.tickTarget = targetTickInput;
        params.runCount = 0;

        //setup socket stuff if not previously performed
        if (!params.dbConnectSuccess) {
            databaseConnectSetup();
        }

        //save the slider values this set of runs is for
        params.slider = { //grab this run's slider values
            cohesion: parseFloat(document.getElementById("coh_weight").value),
            alignment: parseFloat(document.getElementById("ali_weight").value),
            separation: parseFloat(document.getElementById("sep_weight").value)
        };

    } else { //mode already engaged, begin next run
        params.runCount++;
    }

    console.log('Starting run #' + params.runCount);

    //we do this both when a new setup happens, and when a new run happens
    params.posData = []; //build/empty list for positional data lists
    params.isPrey = [];
    params.insertCol = 0; //where in the lists we insert data
    gameEngine.entities = [];
    gameEngine.ticks = 0;

    for (var i = 0; i < 50; i++) {
        circle = new Circle(gameEngine, true);
        gameEngine.addEntity(circle);
        params.posData[i] = []; //build list for positional data
        params.isPrey[i] = true;
    }
    for (var i = 0; i < 5; i++) {
        circle = new Circle(gameEngine, false);
        gameEngine.addEntity(circle);
        params.posData[i + 50] = []; //build list for positional data
        params.isPrey[i + 50] = false;
    }

    gameEngine.weakened = gameEngine.entities[0];
    gameEngine.weakened.debug = true;
    gameEngine.weakened.MaxSpeed *= 0.70;
    gameEngine.weakened.color = "teal";
}

/**
 * Upload results to DB.
 */
function simUpload() {
    console.log('Uploading run #' + params.runCount);
    //collect data in JSON to yeet out
    var data = {
        db: "tcss435",
        collection: "red3",
        data: {
            runType: 'test',
            runNumber: params.runCount,
            sliders: params.slider,
            preyList: params.isPrey,
            positions: params.posData
        }
    };

    //yeet
    // socket.emit("insert", data);
    printDataDebug(data);
}

/**
 * Below are print functions for data to ensure shape is correct.
 * @param {params.posData} positions 
 */
function printDataDebug(data) {
    // console.log('data: ' + data.data.positions);
    console.log('d: ' + data.db);
    console.log('c: ' + data.collection);
    console.log('da: ' + data.data);
    console.log('rt: ' + data.data.runType);
    console.log('rn: ' + data.data.runNumber);
    console.log('sl: ' + data.data.sliders);
    console.log('sl: ' + data.data.preyList);
    testData(data.data.positions);
}

function testData(positions) {
    for (let i = 0; i < positions.length; i++) {
        var thisLine = 'i:'+i+': ';
        for (let j = 0; j < positions[i].length; j++) {
            thisLine += '{' + debugGet(positions[i][j]) + '}, ';
        }
        console.log(thisLine);
    }
}

function debugGet(obj) {
    return ('x: ' + obj.x + ', y: ' + obj.y);
}

function debugDisp(obj) {
    var j = params.insertCol;
    console.log('x: ' + obj[j].x + ', y: ' + obj[j].y);
}