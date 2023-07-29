


import json
import matplotlib.pyplot as plt
import networkx as nx

def distance(x1, y1, x2, y2):
     return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5

print("starting")


with open ("data3.json", "r") as json_file:
    data = json.load(json_file)
closestPrey =[]
isPrey = data[2].get("preyList")
allPosition = data[2].get("positions")
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


# loop through prey list if true, find position of the prey
# loop through predicator (prey list if false) find positon of all preditors
# for each preditor, find the position of the prey nearest
catchDistance = []
index = []
var1 = 0
var2 = 0 
var3 = 0
averageDistance = 0
for i in range(len(preyArr[2])):
    
    for j in range(len(preyArr[2])):    
        dist = distance(preyArr[2][i].get("x"), preyArr[2][i].get("y"), 
                    wolfArr[2][j].get("x"), wolfArr[2][j].get("y"))
        # print(dist)
        if dist <= var1:
            var1 = dist
        elif dist > var1 or dist <= var2:
            var2 = dist
        elif dist > var2 or dist <= var3:
            var3 = dist
            
        averageDistance = (var1 + var2 + var3)/3
        # print(averageDistance)
    catchDistance.append(averageDistance)

    # print(catchDistance)
    index.append(i)
    # print(len(catchDistance))
print(catchDistance)

# test = prey_position 
# print(test)

plt.plot(index, catchDistance)
plt.xlabel ("ticks")
plt.ylabel ("average distance of closest sheep")
plt.title("Catch Distance")
plt.show()

