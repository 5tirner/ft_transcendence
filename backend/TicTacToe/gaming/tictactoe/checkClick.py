def isLegalClick(board, symbol, user):
    # print(f"Data Type: {type(data)}")
    # print(f"Data:\n{data}")
    # board = data.get('board')
    x, o = 0, 0
    for i in board:
        if i == "X":
            x+=1
        elif i == "O":
            o+=1
    if symbol == "X" and x > o:
        print(f"Not Turn Of This User {user}")
        raise "BAD CLICK"
    elif symbol == "O" and o == x:
        print(f"Not Turn Of This User {user}")
        raise "BAD CLICK"