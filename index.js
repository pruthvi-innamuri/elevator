// variables and imports
class Party {
    constructor(id, start, end){
        this.elevator = 0; // which elevator should pick up this party
        this.id = id;
        this.start = start;
        this.end = end;
        this.direction = (this.end - this.start)/Math.abs(this.end - this.start); // 1 = Up, -1 = Down
        this.closestElevator = 1;
    }
    getClosest() {
        let dist1 = Elevator.getDistance(this.getStart, this.getDirection, elevator1.getCurr, elevator1.getDirection, elevator1);
        let dist2 = Elevator.getDistance(this.getStart, this.getDirection, elevator2.getCurr, elevator2.getDirection, elevator2);
        


        if (dist1 < dist2) {
            this.closestElevator = 1;
        } else {
            this.closestElevator = 2;
        }

        return this.closestElevator;
    }


    get getElevator() {
        return this.elevator;
    }

    set setElevator(x) {
        this.elevator = x;
    }

    get getid() {
        return this.id;
    }

    get getStart() {
        return this.start;
    }

    get getend() {
        return this.end;
    }

    get getDirection() {
        return this.direction;
    }
}


//////////////////////////////////////////////////////////////////////////////


class Elevator {
    static levels = 20;

    static getDistance (partyFloor, partyD, elevatorFloor, elevatorD, elevator) {
        let dist = 0;
        if (elevatorD > partyD || (elevatorD == partyD && partyFloor < elevatorFloor && partyD == 1)) {
            let upperBound = elevator.getUpperBound();
            dist = (upperBound - elevatorFloor) + (upperBound - partyFloor);
            
            //dist = (Elevator.levels - partyFloor - 1) + (Elevator.levels - elevatorFloor - 1);
        } else if (elevatorD < partyD || (elevatorD == partyD && partyFloor > elevatorFloor && partyD == -1)) {
            let lowerBound = elevator.getUpperBound();
            dist = (partyFloor - lowerBound) + (elevatorFloor - lowerBound);

        } else {
            dist = partyFloor - elevatorFloor;
        }
        
        return Math.abs(dist);

    }

    constructor(id) {

        this.ms = 1; // current wait time on current floor
        this.switch = false;
        this.id = id;
        this.curr = 0;  // current floor
        // all people going in at this level
        this.out = new Array(n); // all people going out at this level
        for (let i = 0; i < n; i+=1) {
            this.out[i] = new Array();
        }
        
        this.direction = 1;  // up = 1, down = -1
        this.busy = false; // is the elevator moving rn or stationary.

    }

    get getid (){
        return this.id;
    }

    get getCurr (){
        return this.curr;
    }

    set setCurr (level) {
        this.curr = level;
    }

    get getBusy () {
        return this.busy;
    }

    set setBusy (busy) {
        this.busy = busy;
    }

    get getDirection () {
        return this.direction;
    }

    set setDirection (direction) {
        this.direction = direction;
    }

    get getIn () {
        return Elevator.in;
    }
    
    get getOut () {
        return this.out;
    }

    get getMs () {
        return this.ms;
    }

    set setMs (ms) {
        this.ms = ms;
    }

    // Bounds = farthest an elevator will travel on current pass
    getUpperBound() {
        let i = Elevator.levels - 1;
        for (i = i; i >= this.curr; i-=1) {
            if (this.getFloorOut(i).length > 0 || this.getFloorIn(i).length > 0) {
                return i;
            }
        }

        return this.getCurr;
    }

    
    getLowerBound() {
        for (let i = 0; i <= this.curr; i+=1) {
            if (this.getFloorOut(i).length > 0 || this.getFloorIn(i).length > 0) {
                return i;
            }
        }
        
        return this.getCurr;
    }

    setFloorIn(floor, val) {
        Elevator.in[floor] = val;
    }

    addFloorIn(floor, party) {
        Elevator.in[floor].push(party);
    }

    setFloorOut(floor, val) {
        this.out[floor] = val;
    }


    // count of people in floors above or below.
    getCount (floor, arr, d) {
        if (floor >= Elevator.levels || floor < 0){
            return 0;
        } else {
            let bound;
        if (d < 0) {
            bound = -1;
        } else {
            bound = Elevator.levels;
        }

        let s = 0;
        
        for (let i = floor; i != bound; i+=d) {
            s += arr[i].length;
        }      
        return s;

        }
    }

    getFloorIn(floorNum) {
        return Elevator.in[floorNum];
    }

    clearFloorIn(floorNum) {
        Elevator.in[floorNum] = [];
    }

    addFloorOut(floorNum, party) {
        this.out[floorNum].push(party);
    }

    getFloorOut(floorNum) {
        return this.out[floorNum];

    }


    // adding all waiting guests to elevator
    enterParties(floorNum) {
        let currIn = this.getFloorIn(floorNum);
        let leftovers = [];
        for (let i = 0; i < currIn.length; i+=1) {
            if (currIn[i].getClosest() == this.getid) {
                console.log(`Party ${currIn[i].getid} entering Elevator ${this.getid}`);
                this.addFloorOut(currIn[i].getend, currIn[i]);
            } else {
                leftovers.push(currIn[i]);
            }
        }
        
        this.setFloorIn(floorNum,leftovers);
    }


    // exiting all parties in elevator
    exitParties(floorNum) {
        let currOut = this.getFloorOut(floorNum);
        for (let i = 0; i < currOut.length; i+=1) {
            console.log(`Party ${currOut[i].getid} exited Elevator ${this.getid}`);
        }
        this.setFloorOut(floorNum,[]);
    }
    

    // waits for specified milliseconds
    async timer() {
        return new Promise((resolve) => {
            let temp = setInterval(() => {
            if (this.getMs <= 0 || this.closeDoor == true) {
                this.closeDoor = false;
                resolve();
                clearInterval(temp);
            } else {
                this.setMs = this.getMs - 1;
            }}, 500);
        }
        );
    }
    

    // goes from current to the highest necessary floor
    async pass() {
        // iterate each floor, if floor occupied wait 15 seconds, else go next floor. Transfer in to out. Remove out.
        
        const d = this.getDirection;
        let partiesLeft;
        // go in direction d as long as there are parties left
        while (true) {
            this.setMs = 1;
            console.log(`Elevator: ${this.getid}, Floor ${this.getCurr}`);
                
            // the setting and determining the wait time
            if (this.getFloorIn(this.getCurr).length + this.getFloorOut(this.getCurr).length > 0) {
                this.setMs = 5;

                // parties in elevator exiting
                this.exitParties(this.getCurr);

                // parties waiting for elevator are entering
                this.enterParties(this.getCurr);

                // waiting for the guests to move
                let temp = await this.timer();
                
            } else {

                // waiting for the guests to move
                let temp = await this.timer();

            }
            
            // iterate to next floor, only if it is valid floor and there are parties left, else break
            if (this.getCurr + d < Elevator.levels && this.getCurr + d >= 0) {
                partiesLeft = this.getCount(this.getCurr + d, this.getIn, d) + this.getCount(this.getCurr + d, this.getOut, d);

                if (partiesLeft > 0) {
                    this.setCurr = this.getCurr + d;
                
                } else {
                    break;

                }
                
            } else {
                break;

            }
            
        }

        return true;
    }


    // main function to initiate the elevator recursive loop
    async fulltrip() {

        // prevents main loop from being called twice. Like lock and key.
        this.setBusy = true;

        // calculate # parties above (not self-including) and below current level
        let aboveParties = this.getCount(this.getCurr+1, this.getIn, 1) + this.getCount(this.getCurr+1, this.getOut, 1);
        let belowParties = this.getCount(this.getCurr, this.getIn, -1) + this.getCount(this.getCurr, this.getOut, -1);

        // LOOP, occurs while trips are still to be made
        while (aboveParties + belowParties > 0) {

            // determine which direction to go (up = 1 or down = -1).
            if (aboveParties > belowParties ) {
                this.setDirection = 1;
            } else {
                this.setDirection = -1;
            }

            // single pass
            let temp = await this.pass();

            // calculate # parties above (self-including) and below current level
            aboveParties = this.getCount(this.getCurr+1, this.getIn, 1) + this.getCount(this.getCurr+1, this.getOut, 1);
            belowParties = this.getCount(this.getCurr, this.getIn, -1) + this.getCount(this.getCurr, this.getOut, -1);
        }

        // when elevator and waiting lobby are clear
        this.setDirection = this.getDirection * -1; // to flip direction since the current direction has been explored.
        this.setBusy = false;
        return;
    }

}





//////////////////////////////////////////////////////////////////////////////


var n = 20;
var btn = document.getElementById("thebutton");
var btn2 = document.getElementById("hold1");
var btn3 = document.getElementById("hold2");
var btn4 = document.getElementById("close1");
var btn5 = document.getElementById("close2");

var tripID = 0;
var elevator1 = new Elevator(1);
var elevator2 = new Elevator(2);
Elevator.in = new Array(n);
for (let i = 0; i < n; i+=1) {
    Elevator.in[i] = new Array(); 
}


// main event program
btn.addEventListener("click", function() {

    
    let sfloor = parseInt(document.getElementById("sfloor").value);
    let dfloor = parseInt(document.getElementById("dfloor").value);
    
    
    if (isNaN(sfloor) || isNaN(dfloor) || dfloor == sfloor || sfloor < 0 || dfloor < 0 || sfloor >= n || dfloor >= n){
        alert("Invalid input. Enter different integers in both fields.");

    } else {
        tripID += 1;
        let currentParty = new Party(tripID, sfloor, dfloor);

        /* if (elevator1.getBusy == false) {
            elevator1.addFloorIn(sfloor, currentParty);  // adds party
            elevator1.fulltrip();  // initiates trip loop
        } else {
            elevator1.addFloorIn(sfloor, currentParty);  // adds party

        }    

        */

        // handling new request to an elevator
        
        if (elevator1.getBusy == false && elevator2.getBusy == true) {
            console.log("Elevator 1 Starting");
            currentParty.setElevator = 1;
            elevator1.addFloorIn(sfloor, currentParty);  // adds party
            elevator1.fulltrip();  // initiates trip loop
        
        } else if (elevator2.getBusy == false && elevator1.getBusy == true) {
            console.log("Elevator 2 Starting");
            currentParty.setElevator = 2;
            elevator2.addFloorIn(sfloor, currentParty);  // adds party
            elevator2.fulltrip();  // initiates trip loop

        } else if (elevator1.getBusy == elevator2.getBusy) {
            let closest = currentParty.getClosest();
            if (closest == 1) {
                currentParty.setElevator = 1;
                elevator1.addFloorIn(sfloor, currentParty);  // adds party
                
                if (elevator1.getBusy == false){
                    console.log("Elevator 1 Starting");
                    elevator1.fulltrip();
                }
            } else {
                currentParty.setElevator = 2;
                elevator2.addFloorIn(sfloor, currentParty);  // adds party

                if (elevator2.getBusy == false){
                    console.log("Elevator 2 Starting");
                    elevator2.fulltrip();
                }
            }

            
        }

    }

});

// holding open the elevator 1
btn2.addEventListener("click", function() {
    console.log("works");
    elevator1.setMs = elevator1.getMs + 3;
});

// holding open the elevator 2
btn3.addEventListener("click", function() {
    elevator2.setMs = elevator2.getMs + 3;
});

// close elevator 1
btn4.addEventListener("click", function() {
    elevator1.closeDoor = true;
});

// close elevator 2
btn5.addEventListener("click", function() {
    elevator2.closeDoor = true;
});


