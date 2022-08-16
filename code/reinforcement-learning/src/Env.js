class Env:
    def __init__(
        self, 
        start:tuple = (1,3), 
        rows:int = 4,
        columns:int = 4,
        wins = {(3,2):2,(0,0):3}, # Specify indices where episode terminates with a win
        losses = {(2,2):-5},      # Specify indices where episode terminates with a loss
        obstacles = {}, # Not used
        deterministic:bool = True,
        exploring_starts=False,   # Randomly initialize the agent
        exploring_starts_prob=0.4, # Probability of selecting a random initial state instead of specified one
    ):
        # Set up the board
        self.start = start
        self.state = start
        self.rows = rows
        self.columns = columns
        self.board = np.zeros([rows, columns])
        self.exploring_starts = exploring_starts
        self.exploring_starts_prob = exploring_starts_prob
        
        # Deterministic env or stochastic (stochastic not implemented)
        self.deterministic:bool = deterministic
        
        # Winning and losing states with respective rewards
        self.wins = wins
        self.losses = losses
        
        # Initialize agent randomly from an available state
        if self.exploring_starts:
            self.available_starts = []
            for row in range(self.rows):
                for column in range(self.columns):
                    if (row,column) in self.wins or (row,column) in self.losses:
                        continue
                    self.available_starts.append((row,column))
        else:
            self.available_starts = self.start
        
    def _giveReward(self, state):
        if state in self.wins:
            return self.wins[self.state]
        elif state in self.losses:
            return self.losses[self.state]
        else:
            return 0

    def _isEndFunc(self, state):
        if (state in self.wins) or (state in self.losses):
            return True
    
    def reset(self,):
        if self.exploring_starts and np.random.random() < self.exploring_starts_prob:
            self.state = self.available_starts[np.random.choice(len(self.available_starts))]  
        else: 
            self.available_starts
        return self.start, self._giveReward(self.start), self._isEndFunc(self.start)

    def step(self, action):
        """
        action: up, down, left, right
        -------------
        0 | 1 | 2| 3|
        1 |
        2 |
        return next position
        """
        if self.deterministic:
            if action == "up":
                nxtState = (self.state[0] - 1, self.state[1])
            elif action == "down":
                nxtState = (self.state[0] + 1, self.state[1])
            elif action == "left":
                nxtState = (self.state[0], self.state[1] - 1)
            else:
                nxtState = (self.state[0], self.state[1] + 1)
            # if next state legal
            if (nxtState[0] >= 0) and (nxtState[0] <= (self.rows -1)):
                if (nxtState[1] >= 0) and (nxtState[1] <= (self.columns -1)):
                    self.state = nxtState
            return self.state, self._giveReward(self.state), self._isEndFunc(self.state)

    def render(self):
        self.board[self.state] = 1
        for i in range(0, self.rows):
            print('-----------------')
            out = '| '
            for j in range(0, self.columns):
                if self.board[i, j] == 1:
                    token = '*'
                if self.board[i, j] == -1:
                    token = 'z'
                if self.board[i, j] == 0:
                    token = '0'
                out += token + ' | '
            print(out)
        print('-----------------')