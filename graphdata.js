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
        const avgDistancesThisRun = [];

        const {preyList, positions} = run;

        const preyCount = preyList.filter(Boolean).length; //50
        const predatorCount = preyList.length - preyCount; //5

        if (preyCount === 0 || predatorCount === 0) return;

        const minDistances = [];

        for (let measuredTick = 0; measuredTick < positions[0].length; measuredTick++) {
            let preyPosList = [];
            let predatorPosList = [];

            for(let i = 0; i < positions.length; i++) { //length should equal 55
                if(i < 50){
                    preyPosList.push(positions[i][measuredTick]);
                } else {
                    predatorPosList.push(positions[i][measuredTick]);
                }
            }

            for(let i = 0; i < preyPosList.length; i++) {
                //calculateDistance
                let minDistance = Number.MAX_VALUE;
                let prey = preyPosList[i]
                predatorPosList.forEach(predator => {
                    const distance = calculateDistance(prey, predator);
                    minDistance = Math.min(minDistance, distance);
                });
                minDistances.push(minDistance);
            }
            //reduce uses a callback funciton, need further assistance to understand
            const averageMinDistance = minDistances.reduce((acc, val) => acc + val, 0) / minDistances.length;
            avgDistancesThisRun.push(averageMinDistance);
        }

        avgDistancesForEachRun.push(avgDistancesThisRun);
    });
   
    for(let measuredTick = 0; measuredTick < avgDistancesForEachRun[0].length; measuredTick++) { // for each measured Tick 
        let thisTicksData = [];
        for(let currentRun = 0; currentRun < avgDistancesForEachRun.length; currentRun++) { //for each run i
            //avg THIS TICK
            thisTicksData.push(avgDistancesForEachRun[currentRun][measuredTick]);
        }
        let avgThisTick = thisTicksData.reduce((acc, val) => acc + val, 0) / thisTicksData.length;
        avgDistancesAcrossAllRuns.push(avgThisTick);
    }

    return avgDistancesAcrossAllRuns;
}

// Function to plot the data, probably correct.
function plotData(data) {
    const timeSteps = data[0].positions[0].length; //251
    const averageDistances = findAverageMinimumDistances(data);
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