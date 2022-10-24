import { multiply, add, reshape } from "mathjs";

// Finds the index of the maximum
function argMax(array) {
    return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

// Helper function to generate numbers which are normally distributed
function boxMullerTransform() {
    const u1 = Math.random();
    const u2 = Math.random();
    
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);    
    return z0;
}

// Generate normally distributed random number
function randomNormal(mean, std){
    const { z0, _ } = boxMullerTransform();
    
    return z0 * stddev + mean;
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
        this.qValues = new Array(this.armsMeans).fill(0);

         // Check if the dimensions of armsMean and armsStd are valid
        if (this.armsMeans.length != this.armsStds.length){
            throw "armsMeans and armsStd need to have the same length";
        }

    }

    // Reset the Q-Values to zeros
    resetQValues(){
        this.qValues =  new Array(this.armsMeans).fill(0);
    }

   // Update the Q-Values
   updateQValues(reward, index){
        this.qValues[index] += this.alpha* (reward - this.qValues[index]);
   }

   // Pull an arm and generate the reward
   pullBanditArm(index){
        return randomNormal(this.armsMeans[index], this.armsStds[index]);
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