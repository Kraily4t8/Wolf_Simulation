


import json
import matplotlib.pyplot as plt
import networkx as nx

def distance(x1, y1, x2, y2):
     return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5

print("starting")


with open ("data3.json", "r") as json_file:
    data = json.load(json_file)
closestPrey =[]
isPrey = data[0].get("preyList")
allPosition = data[0].get("positions")
# split wolvese and sheep array based on the true/false
preyArr = []  #50
wolfArr = []  #5
for i in range(len(isPrey)):
    if isPrey[i] == True:        
        preyArr.append(allPosition[i])
    else:    
        wolfArr.append(allPosition[i])

#----save for debugging----
# print(len(preyArr))
#wolf location  1st wolf of first interval
# print(wolfArr[0][0])
# print(wolfArr[0][0].get("x"))
# print(len(allPosition[0]))
#----end-------------------

# loop through all ticks
# loop through prey list to find distance of all sheep
# loop through predicator (prey list if false) find positon of all preditors
# for each preditor, find the position of the prey nearest
catchDistance = []
index = []

#calulate for every tick
for i in range(len(preyArr[2])):
    
    alldistance = []  
    lowest5 = []
    averageDistance = 0.0
    
    for j in range(len(preyArr[2])):  
        dist = 0        
        dist = distance(preyArr[2][i].get("x"), preyArr[2][i].get("y"), 
                    wolfArr[2][j].get("x"), wolfArr[2][j].get("y"))
        
        alldistance.append(dist)
    # print("alldistance: " + str(len(alldistance)))
    
    lowest5 = sorted(alldistance)[:5]
    print(lowest5)
    averageDistance = sum(lowest5)
    averageDistance = averageDistance/len(lowest5)
    averageDistance = round(averageDistance, 2)
    # print("avedistance: " + str(averageDistance))
    
    catchDistance.append(averageDistance)

    # print(catchDistance)
    index.append(i)
    # print(len(catchDistance))
# print(catchDistance)

# test = prey_position 
# print(test)

def plotgraph():
    plt.plot(index, catchDistance)
    plt.xlabel ("per 100 ticks")
    plt.ylabel ("average distance of closest sheep")
    plt.title("Catch Distance")
    plt.show()

plotgraph()

