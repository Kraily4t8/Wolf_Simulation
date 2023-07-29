# Wolf_Simulation
Wolf Simulation for University of Washington Tacoma TCSS435: Artificial Intelligence. Goal of project is to modify the <a href="https://github.com/algorithm0r/WolfPack">provided simulation</a> to run a research experiment. We intend to run an experiment about predator herding behaviors by adjusting the decision weights on predators.

The simulation has been updated to include multiple sliders for adjusting behaviors of predators and prey, as well as updating the included code to the modern js object notation.

# Data Collection Mode
It is possible to upload data to the database by following these instructions:
* Enter values:
    * Run Count: How many runs to do with the same settings.
    * Target Tick: What tick to end the simulation at, inclusive.
* Set slider values to desired positions.
* Check the box for Freeze Visual if desired for compute power.
* Click "DataSim".

The simulation will then run for the desired runs, to the ticks. Position data for each entity in the simulation will be recorded every 100 ticks, to be uploaded at the end. Some basic information is given in the console while this is running, to note what run number is currently in progress.

There is a line at the end of *main.simUpload()* which is commented out, if uncommented the data from each run will also be displayed in the console.

When the runs are complete, the simulation will revert to normal and perform a normal simulation without data collection enabled.

The shape of data recorded and uploaded is as follows:
```js
    var data = {
        db: "tcss435",
        collection: "red3",
        data: {
            runType: 'test',
            runNumber: params.runCount, //integer of which run is being uploaded
            sliders: params.slider, //values of the alignment, cohesion, and separation sliders
            preyList: params.isPrey, //a list of which entities are prey (true) or predator (false)
            positions: params.posData //2d list containing JSON marking x and y positions of each entity
        }
    };
```
Basic interaction with the data can be seen in the debug print functions at the end of *main*.

# Resources
* <a href="https://github.com/algorithm0r/WolfPack">WolfPack</a>: Base simulation this project forks from.

<img src="https://github.com/cat-milk/Anime-Girls-Holding-Programming-Books/blob/master/Javascript/Doma_Umaru_Java_Script_The_Good_Parts.png?raw=true" alt="Confusion">