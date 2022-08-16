class MultiArmBandit:
    def __init__(
    self,
    arms_means = [2, 5],
    arms_stds = [1.0, 1.0],
    epsilon=0.2,
    alpha = 0.1,
    ):
        if len(arms_means) != len(arms_stds):
            print("Array of mean values and array of std values have different dimensions")
        
        self.bandits = list(zip(arms_means, arms_stds))
        self.q_values = np.zeros(len(self.bandits))
        
        self.epsilon = epsilon
        self.alpha = alpha

    def _reset_q_values(self,):
        self.q_values = np.zeros(len(self.bandits))

    def _update_q_values(self, reward, index):
        self.q_values[index] +=  self.alpha*(reward - self.q_values[index])
    
    def pull_bandit(self, index):
        bandit = self.bandits[index]
        return np.random.normal(loc=bandit[0], scale=bandit[1])

    
    def run_trails(self, n=100):
        episodic_values = np.array([])
                
        for _ in range(n):
            
            # Store q-values in each run
            if episodic_values.shape[0] == 0:
                episodic_values = np.expand_dims(self.q_values, axis=0)
            else:
                episodic_values = np.append(episodic_values, [self.q_values], axis=0)
            
            # Epsilon greedy action selection
            if np.random.random() < self.epsilon:
                bandit_index = np.random.randint(len(self.bandits))
            else:
                bandit_index = np.argmax(self.q_values)
            
            # Collect reward from the bandit and update Q values
            reward = self.pull_bandit(bandit_index)
            self._update_q_values(reward, bandit_index)
        
        return episodic_values
    
    def plot_q_values(self, episodic_values):
        for i in range(len(self.bandits)):
            plt.plot(episodic_values[:,i], label="Bandit {}".format(i+1))
        plt.title("Q-Values")
        plt.legend()