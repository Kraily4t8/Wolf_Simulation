//params.lastDBResponse;

/**
 * Function that's automatically called when user hits Generate Graph button.
 */
function graphResponse() {
    console.log('Debug for graphdata.js');
    console.log(params.lastDBResponse);

    plotData(params.lastDBResponse);
    console.log('Graphs generated.')
}

function calculateDistance(point1, point2) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// INCORRECT: Function for finding average minimum distances.
// The average (the average distance between each wolf and the closest sheep IN ONE TICK) across all runs
function findAverageMinimumDistances(data) {
    const avgDistancesAcrossAllRuns = [];
    const avgDistancesForEachRun = [];

    //forEach of the 3 runs
    data.forEach(run => {
        //console.log("Data length " + data.length); //data length 3
        const {preyList, positions} = run;

        const preyCount = preyList.filter(Boolean).length; //50
        const predatorCount = preyList.length - preyCount; //5

        if (preyCount === 0 || predatorCount === 0) return;

        const minDistances = [];
        console.log("positions0 length " + positions[0].length); //251 measured ticks
        //console.log("positions0 " + positions[0]); // the xy tuples of positions
        //positions = each entity info, l = 55, 
        //positions[0] = all positions recorded, l = 251
        
        //measuredTick tracking

        for(let i = 0; i < 50; i++){
            //for each prey
            positions[i].forEach(prey => {
                let minDistance = Number.MAX_VALUE;

                //index 50 to 54 are predators
                //for each of the 5 predators
                positions.slice(50).forEach(predators => {
                    //for each predator, determine how far is the closest prey
                    predators.forEach(predator => {
                        const distance = calculateDistance(prey, predator);
                        minDistance = Math.min(minDistance, distance);
                    });
                });
                
                minDistances.push(minDistance);
            });
        }

        for(let i = 0; i < 50; i++){
            //for each prey
            for(let measuredTick = 0; measuredTick < positions[i].length; measuredTick++) {
                let minDistance = Number.MAX_VALUE;

                //index 50 to 54 are predators
                //for each of the 5 predators
                positions.slice(50).forEach(predators => {
                    //for each predator, determine how far is the closest prey
                    predators.forEach(predator => {
                        const distance = calculateDistance(prey, predator);
                        minDistance = Math.min(minDistance, distance);
                    });
                });
                
                minDistances.push(minDistance);
            }
        }

        //reduce uses a callback funciton, need further assistance to understand
        const averageMinDistance = minDistances.reduce((acc, val) => acc + val, 0) / minDistances.length;
        avgDistancesForEachRun.push(averageMinDistance);
    });

    return avgDistancesForEachRun;
}

// Function to plot the data, probably correct.
function plotData(data) {
    const timeSteps = data[0].positions[0].length; //251
    const averageDistances = findAverageMinimumDistances(data);
    console.log("avgDistancesForEachRun " + averageDistances); //3
    const trace = {
        x: timeSteps,
        y: averageDistances,
        mode: "lines+markers",
        type: "scatter",
        name: "Average Min Distance",
    };

    const layout = {
        title: "Average Minimum Distance Between Prey and Predators",
        xaxis: {
            title: "Time Step",
        },
        yaxis: {
            title: "Average Minimum Distance",
        },
    };

    const plotData = [trace];
    Plotly.newPlot("chart", plotData, layout);
}