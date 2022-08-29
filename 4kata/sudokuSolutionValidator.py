correct = [1, 2, 3, 4, 5, 6, 7, 8, 9]

def validSolution(board):
    # check rows
    for row in board:
        if sorted(row) != correct:
            return False
    
    # check columns
    for column in zip(*board):
        if sorted(column) != correct:
            return False
    
    # check regions
    for i in range(3):
        for j in range(3):
            region = []
            for line in board[i*3:(i+1)*3]:
                region += line[j*3:(j+1)*3]
            
            if sorted(region) != correct:
                return False
    
    # if everything correct
    return True