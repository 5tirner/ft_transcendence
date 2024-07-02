from .models import players
import os

os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"

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
    x_o, tmp = "", ""
    if (role == 1):
        print("Looking For `X` Valid Click")
        tmp = players.objects.filter(gcreator=player).first()
        x_o = 'X'
    elif (role == 2):
        print("Looking For `O` Valid Click")
        tmp = players.objects.filter(oppenent=player).first()
        x_o = 'O'
    if (tmp.board[pos] != '.'):
        print(f"The Pos Already Used by {x_o}")
        return False
    x, o = 0, 0
    for i in tmp.board:
        if i == 'X':
            x += 1
        elif i == 'O':
            o += 1
    print(f"The Board Befor -> {tmp.board}")
    if o < x and x_o == 'X' and role == 2:
        print("X Play On O Turn")
        return False
    if x <= o and x_o == 'O' and role == 1:
        print("O Play On X Turn")
        return False
    tmp.board = tmp.board[:pos] + x_o + tmp.board[pos + 1:]
    tmp.save()
    print(f"The Board After -> {tmp.board}")
    return True