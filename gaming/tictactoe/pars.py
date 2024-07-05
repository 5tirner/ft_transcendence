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

async def isWinner(board, c):
    if board[0]==c and board[1]==c and board[2]==c or board[3]==c and board[4] == c and board[5]==c or board[6]==c and board[7]==c and board[8]==c:
        return True
    if board[0]==c and board[3]==c and board[6]==c or board[1]==c and board[4] == c and board[7]==c or board[2]==c and board[5]==c and board[8]==c:
        return True
    if board[0]==c and board[4]==c and board[8]==c or board[2]==c and board[4]==c and board[6]==c:
        return True
    return False

async def isGoodClick(pos, player, role):
    print(f"pos: {type(pos)} | player: {type(player)} | role: {type(role)}")
    tmp = ""
    if (role == 1):
        print("Looking For `X` Valid Click")
        tmp = players.objects.filter(gcreator=player).first()
        print(f"Turn Of {tmp.channel}")
        if tmp.channel == 'O' or tmp.board[pos] != '.' or tmp.gamestat == False or len(tmp.oppenent) == 0:
            return -1
        tmp.board = tmp.board[:pos] + tmp.channel + tmp.board[pos + 1:]
        tmp.channel = 'O'
    elif (role == 2):
        print("Looking For `O` Valid Click")
        tmp = players.objects.filter(oppenent=player).first()
        print(f"Turn Of {tmp.channel}")
        if tmp.channel == 'X' or tmp.board[pos] != '.' or tmp.gamestat == False:
            return -1
        tmp.board = tmp.board[:pos] + tmp.channel + tmp.board[pos + 1:]
        tmp.channel = 'X'
    tmp.save()
    print(f"The Board After -> {tmp.board}")
    if await isWinner(tmp.board, tmp.board[pos]) == True:
        return 1
    if tmp.board.find('.') == -1:
        return 2
    return 0

async def setEndGame(player, role):
    if (role == 1):
        print("X Is Winner Or Draw")
        tmp = players.objects.filter(gcreator=player)
    elif (role == 2):
        print("O IS Winner Or Draw")
        tmp = players.objects.filter(oppenent=player)
    tmp.delete()