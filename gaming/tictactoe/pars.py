from .models import players

def checkInput(alias, roomcode, role):
    if len(alias) == 0 or len(roomcode) == 0 or role == "0":
        return False
    return True

def isTheAliasOrTheRoomCodeAlreadyUsed(alias, roomcode):
    if players.objects.filter(gcreator=alias).first() is not None or players.objects.filter(oppenent=alias).first() is not None:
        return -1
    if players.objects.filter(roomcode=roomcode).first() is not None:
        return -2
    return 0

def isGoodClick(pos, player, role):
    print(f"pos: {type(pos)} | player: {type(player)} | role: {type(role)}")
    theBoard, x_o = "", ""
    if (role == 1):
        print("Looking For Creator Valid Click")
        theBoard = players.objects.filter(gcreator=player).first().board
        x_o == 'X'
    elif (role == 2):
        print("Looking For Oppenent Valid Click")
        theBoard = players.objects.filter(oppenent=player).first().board
        x_o = 'O'
    for i in theBoard:
        print(i, ' ', end='')
    # if theBoard[pos] == '.':
    #     return False
    #theBoard = theBoard[:pos] + x_o + theBoard[pos+1:]
    print(f"The New Board -> {theBoard}")
    return True