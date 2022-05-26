# Elevator Simulation

## Technologies Used: HTML, Javascript

## Project Scope:

Build a simple two-elevator system for n stories. The system can pick up guests and drop them off at any floor, but must achieve this in the most efficient way possible. The doors at an elevator's current level can be held open indefinitely or closed.


## Setup:
1. Download files into a folder.
2. Open html file.
3. Open up console output.
4. Test different floors and see the simulation run in the console.

### Ex (in chrome):
![image](https://user-images.githubusercontent.com/56245127/170414348-fb74f5fa-20c5-4798-8a10-936ba742f596.png)



## Project Design:

### Language Selection:
This task requires event-based input. A naive Python or Java solution fails since it stops the flow of execution, waiting for input. Instead, Javascript is used for input processing and logic while HTML served as the bare-bone interface.

### Elevator Architecture:
Every current guest of the elevator can placed in one of two groups: wanting to go into the elevator or wanting to come out of the elevator. To mirror this, two arrays of height n are used. Each index represents a floor and each floor contains an array of guests. Each guest is represented by a "Party" instance. 
<br>
<br>
The first array is static-level, to be shared by all elevator instances, so the closest elevator can pick up the guest. The second array is object-level since each elevator can have their own set of guests inside that must be dropped off.
<br>
<br>
**The size of the building (n) can be changed. Simply modify global variable n and Elevator.level to equal the desired value (in index.js). 

### Recieving Input:
Each time an input in provided, it is recieved by an Event Listener. The input's validity is then confirmed and a corresponding Party object is made. Afterwards, the receiving elevator is determined based on whether the elevator is free and how far it is. Lastly, the corresponding elevator's "fulltrip" method is called if its loop is not already running (uses lock and key logic). This method is the heart of this program because it runs the "elevator loop".


### Elevator Loop
1. The elevator determines which direction (up = 1, down = -1) has more overall guest requests
2. It continues in that direction till there are no more requests left. This is called a pass (upward pass, downward pass).
3. Repeat

**Both elevators are in this loop concurrently and they might be traveling in the same direction (redundant but faster).  


### Time Control
Time is controlled using Javascript's setInterval promise. The default time between empty floors is 1 sec while the default time for leaving a door open is 5 seconds.
This time can be dynamically controlled using the provided buttons for extending time by 3 seconds (each press, so can indefinitely occur if spammed) or instantly shutting the doors (implemented using an auxiliary control variable).


### Optimizations
Firstly, the overall architecture of this implementation is quite efficient. It allows for multiple trips to be handled by each elevator while a niave implementation would handle singular trips chronologically.
<br>
<br>
Secondly, to dynamically determine the closest elevator for a trip/guest, the trip's direction and the elevator's current direction are considered. For example, consider two elevators at the same floor as a particular trip. One is traveling upwards while the other is traveling downwards. The elevator traveling upward would take longer to handle a trip going downward since it needs to first finish its upward pass and switch directions. Meanwhile, the elevator traveling downwards could straightforwardly pick up the guest on its downward pass. This algorithm is calculated at first for each guest and also every time an elevator arrives at that guest's floor. Hence, it is kept accurate throughout simulation.
<br>
<br>
Lastly, the number of additional guest requests in a certain direction is frequently recalculated to prevent an elevator from traveling extra floors in its current direction. A niave implementation would have each pass go all the way to either end of the building. This optimization allows either elevator to switch directions more frequently/efficiently to handle a wider range of guest trips faster.






