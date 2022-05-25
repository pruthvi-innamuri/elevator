class Trip {
    constructor(tripID, start, end){
        this.ID = tripID;
        this.start = start;
        this.end = end;
        this.direction = (this.end - this.start)/Math.abs(this.end - this.start); // 1 = Up, -1 = Down
    }

    get getID() {
        return this.ID;
    }

    get getstart() {
        return this.start;
    }

    get getend() {
        return this.end;
    }

    get getdirection() {
        return this.direction;
    }
}



class Elevator {
    constructor() {
        this.floor = 0;
        this.busy = false;
        this.queue = [];
        this.direction = 1;
    }

    get getfloor() {
        return this.floor;
    }


    set setfloor(floor) {
        this.floor = floor;
    }

    get getbusy() {
        return this.busy;
    }

    set setbusy(busy){
        this.busy = busy;
    }

    get getdirection() {
        return this.direction;
    }

    set setdirection(direction) {
        this.direction = direction;
    }

    addQueue(atrip) {
        this.queue.push(atrip);
    }

    startToend(start, end, direction, message) {
        //elevator moving from start to destination
        let travel = setInterval(function() {
            if (start == end) {
                console.log(message);
                clearInterval(travel);
            } else {
                console.log(start);
                start += direction;
            }
        }, 1000);
        return true;

    }


    waitPassengers() {

        // waiting at floor for passengers to enter/exit
        let wait = setTimeout(function() {
            console.log(`Trip #${atrip.getID} completed`);
            clearTimeout(wait);
        }, 5000);
        return true;
    }

    async fullTrip(atrip){
        this.setbusy = true;

        let start = atrip.getstart;
        let end = atrip.getend;
        let message;
        let promise = new Promise((resolve, reject) => {

            //elevator moving from current floor to start
            if (this.getfloor != start) {
                this.setdirection = (atrip.getstart - this.getfloor)/Math.abs(atrip.getstart - this.getfloor);
                message = `Going to starting floor `
                let temp = await this.startToend(this.getfloor, atrip.getstart, this.getdirection, "Going to start floor");
            }

            

            


            
            

            // waiting at floor for passengers to enter/exit
            wait = setTimeout(function() {
                console.log(`Trip #${atrip.getID} completed`);
                clearTimeout(wait);
            }, 5000);


            // setting elevator to end floor
            this.setfloor = current;
            resolve();

        });
        
        let result = await promise;

        // tail recursion, if there are more requests in queue
        if (this.checkBusy()) {
            atrip = this.queue.shift();
            this.startTrip(atrip);
        }
        
        return;
    }

}
