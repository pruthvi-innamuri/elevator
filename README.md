# Elevator Simulation

## Technologies Used: HTML, Javascript

## Project Scope:

Build a simple two-elevator system for n stories. The system can pick up guests and drop them off at any floor, but must achieve this in the most efficient way possible. The doors at an elevator's current level can be held open indefinitely or closed.


## Setup:
1. Download files in a folder.
2. Open html file.
3. Open up console output.
4. Test different floors and see the simulation run in the console.

### Ex (in chrome):
![image](https://user-images.githubusercontent.com/56245127/170414348-fb74f5fa-20c5-4798-8a10-936ba742f596.png)



## Project Design:

### Language Selection
This task requires event-based input. A naive Python or Java solution won't work since they stop the flow of execution, waiting for input. Hence, Javascript was used for input processing and logic while HTML served as the bare-bone interface.

### Elevator Architecture
Every current guest of the elevator can placed in one of two groups: wanting to go into the elevator or wanting to come out of the elevator. To mirror this, two arrays of height n are used. Each index represents a floor and each floor contains an array of guests. Each guest is represented by a "Party" instance (will be discussed further). 
The first array is state-level, to be shared by all elevator instances, so the closest elevator can pick up the guest. The second array is 
