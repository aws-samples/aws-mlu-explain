import { multiply, add, reshape } from "mathjs";

// Finds the index of the maximum
function argMax(array) {
    return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

// Finds the index of the minimum
function argMin(array) {
    return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] < r[0] ? a : r))[1];
}

// Helper function to generate numbers which are normally distributed
function gaussianRandom(mean=0, stdev=1) {
    let u = 1 - Math.random(); //Converting [0,1) to (0,1)
    let v = Math.random();
    let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}


export class MultiArmBandit{
    constructor(
        armsMeans = [2,5],
        armsStds = [1.0, 1.0],
        epsilon = 0.2,
        alpha = 0.1,
    ){
        this.armsMeans = armsMeans;
        this.armsStds = armsStds;
        this.epsilon = epsilon;
        this.alpha = alpha;
        this.qValues = new Array(this.armsMeans);
        for (let i=0; i<this.armsMeans.length; i++){
            this.qValues[i] = 0;
        }

         // Check if the dimensions of armsMean and armsStd are valid
        if (this.armsMeans.length != this.armsStds.length){
            throw "armsMeans and armsStd need to have the same length";
        }
    }

    // Reset the Q-Values to zeros
    resetQValues(){
        this.qValues = new Array(this.armsMeans);
        for (let i=0; i<this.armsMeans.length; i++){
            this.qValues[i] = 0;
        }
        // Start with agent favoring the suboptimal choice
        this.qValues[argMin(this.armsMeans)] = Math.max(...this.armsMeans);
    }

   // Update the Q-Values
   updateQValues(reward, index){
        this.qValues[index] += this.alpha* (reward - this.qValues[index]);
   }

   // Pull an arm and generate the reward
   pullBanditArm(index){
        return gaussianRandom(this.armsMeans[index], this.armsStds[index]);
   }

   // Run one trial
   runTrial(){
    let bandit_index;
    if (Math.random() < this.epsilon){
        bandit_index = Math.floor(Math.random() * this.armsMeans.length);
    } else{
        bandit_index = argMax(this.qValues);
    }
    let reward = this.pullBanditArm(bandit_index);
    this.updateQValues(reward, bandit_index);
    
    return this.qValues
   }
        
   // Run simulaiton over defined time steps
   runTrials(numTrials=100){
        episodicValues = new Array(this.armsMeans).fill(
            new Array(numTrials).fill(0)
        );

        for (var i=0; i<numTrials; i +=1){
            // Epsilon greedy action selection
            if (Math.random() < this.epsilon){
                bandit_index = Math.floor(Math.random() * this.armsMeans.length);
            } else{
                bandit_index = argMax(this.qValues);
            }

            reward = this.pullBanditArm(bandit_index);
            this.updateQValues(reward, bandit_index);
        }

        return episodicValues;
   }


}