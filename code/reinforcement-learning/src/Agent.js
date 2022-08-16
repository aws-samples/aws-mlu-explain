class Agent:

    def __init__(self, rows, columns, wins, losses, td_update='sarsa', epsilon=0.1, alpha=0.1, gamma=0.9, lambda_=0.7):
        self.actions = ["up", "down", "left", "right"] if rows>1 else ["left", "right"]
        self.epsilon = epsilon
        self.rows = rows
        self.columns = columns
        
        # For plotting
        self.wins = wins
        self.losses = losses
        
        self.td_update = td_update
        self.alpha = alpha
        self.gamma = gamma
        self.lambda_ = lambda_  # set lambda to 0 for TD(0) update and lamdba to 1 for MC
        
        self.q_values = np.array([])
        # Initializa Q values for each state to zero
        self.reset_q_values()
        
        #Use eligibility trace for faster convergence
        self.trace_matrix = np.array([])
        # Initialize the trace matrix to zeros
        self.reset_trace_matrix()
        
    
    def reset_q_values(self):
        self.q_values = np.zeros((self.rows, self.columns, len(self.actions)))
                
    def reset_trace_matrix(self):
        self.trace_matrix = np.zeros((self.rows, self.columns, len(self.actions)))
        

    def chooseAction(self, state):
        # Choose action based on epsilon-greedy policy

        if np.random.uniform(0, 1) <= self.epsilon:
            action_index = np.random.randint(len(self.actions))
        else:
            # greedy action
            action_index = np.argmax(self.q_values[state[0], state[1], :])
        return self.actions[action_index], action_index

    def run_episodes(self, env, episodes=10, max_steps=2000):
        
        # Store q values for each episode
        episodic_values = np.array([])
        
        for _ in range(episodes):
            
            # Maintain q values for each episode
            if episodic_values.shape[0] == 0:
                episodic_values = np.expand_dims(self.q_values, axis=0)
            else:
                episodic_values = np.append(episodic_values, [self.q_values], axis=0)
            
#             print(list(self.q_values.values()))
            
            state, reward, done = env.reset()
            
            for step in range(max_steps):
#                 env.render()
                action, action_index = self.chooseAction(state)
                q_old = self.q_values[state[0], state[1], action_index]
                
                next_state, reward, done = env.step(action)
                next_action, next_action_index = self.chooseAction(next_state)
                
                # Update Q values
                
                if self.td_update == 'q-learning':
                    #Q-Learning
                    td_error = reward + self.gamma*np.max(self.q_values[next_state[0], next_state[1], :])  - q_old
                elif self.td_update == 'sarsa':
                    #SARSA
                    td_error = reward + self.gamma*self.q_values[next_state[0], next_state[1], action_index]  - q_old
                else:
                    print("Please set 'td_update' to either 'sarsa' or 'q-learning'.")
                
                
                # Stopping criteria
#                 if np.abs(td_error) < 1e-8 and td_error>0:
#                     print("Stopping")
#                     print(td_error)
#                     return 
                
                # Increment the trace matrix
                self.trace_matrix[state[0], state[1], action_index] += 1
    
                # TD(lambda) Update
                self.q_values += self.alpha*(td_error)* self.trace_matrix
                
                # Decay the trace matrix values
                self.trace_matrix = self.trace_matrix * self.gamma * self.lambda_
                
                state = next_state
                
                if done:
                    break
        return (episodic_values)
                
    def print_policy(self, env):
        """
        Print the policy 
        UP = ^
        Down = v
        Left = <
        Right = >
        """
        policy_string = ""
        
        if env.rows == 1:
            for column in range(env.columns):
                state = (0,column)
                action_index = np.argmax(self.q_values[state[0], state[1]])
                if state in env.wins: policy_string += "\t{}\t".format(env.wins[state])
                elif state in env.losses: policy_string += "\t{}\t".format(env.losses[state])
                elif action_index == 0: policy_string += "\t<\t"
                elif action_index == 1: policy_string += "\t>\t"
                
        else:
            for row in range(env.rows):
                for column in range(env.columns):
                    state = (row,column)
                    action_index = np.argmax(self.q_values[state[0], state[1]])

                    if state in env.wins: policy_string += "\t{}\t".format(env.wins[state])
                    elif state in env.losses: policy_string += "\t{}\t".format(env.losses[state])
                    elif action_index == 0: policy_string += "\t^\t"
                    elif action_index == 1: policy_string += "\tv\t"
                    elif action_index == 2: policy_string += "\t<\t"
                    elif action_index == 3: policy_string += "\t>\t"

                policy_string += '\n'
        print(policy_string)

    def plot_q_values(self, episodic_values):     
        fig,ax = plt.subplots(self.rows, self.columns, figsize=(4*self.columns, 4*self.rows))
        
        counter = 0
        for row in range(self.rows):
            for column in range(self.columns):
                #Check whether terminal state
#                 if (row,column) in self.wins or (row,column) in self.losses:
# #                     ax[row][column].text(-2, 10, "Terminal State!")
#                     continue
                for action in range(len(self.actions)):
                    subplot = ax[row][column] if self.rows>1 else ax[column]
                    subplot.plot(episodic_values[:,row, column, action], label=self.actions[action])
                    subplot.set_title("({},{})".format(row, column))
                counter += 1
        handles, labels = subplot.get_legend_handles_labels()
        fig.legend(handles, labels, loc='lower center', prop={'size': 26}, ncol=len(self.actions))