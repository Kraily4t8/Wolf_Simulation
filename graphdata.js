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
//*check distance between wolf and closest sheep
function findAverageMinimumDistances(data) {
    const distances = [];

    data.forEach(run => {
        const {preyList, positions} = run;
        const preyCount = preyList.filter(Boolean).length;
        const predatorCount = preyList.length - preyCount;

        if (preyCount === 0 || predatorCount === 0) return;

        const minDistances = [];
        
        for(let i = 0; i < 50; i++){
            //for each prey
            positions[i].forEach(prey => {
                let minDistance = Number.MAX_VALUE;

                //index 50 to 54 are predators
                //for each of the 5 predators
                positions.slice(50).forEach(predators => {
                    //confusing
                    predators.forEach(predator => {
                        const distance = calculateDistance(prey, predator);
                        minDistance = Math.min(minDistance, distance);
                    });
                });

                minDistances.push(minDistance);
            });
        }

        //reduce uses a callback funciton, need further assistance to understand
        const averageMinDistance = minDistances.reduce((acc, val) => acc + val, 0) / minDistances.length;
        distances.push(averageMinDistance);
    });

    return distances;
}

// Function to plot the data, probably correct.
function plotData(data) {
    const timeSteps = data[0].positions[0].length;
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