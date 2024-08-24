import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

authAPI = "https://127.0.0.1:8000/api/signups/"
loginAPI = "https://127.0.0.1:8000/api/logins/"
creatChatroomAPI = "https://127.0.0.1:8000/api/chat/create/"
friendshipAPI = "https://127.0.0.1:8000/api/friendship/"

USER_NUMBER = 5


def create_users():
    """
    create users in db if they don't exist
    """

    # print(2 * "\t", "================= register test users ==================")
    data = {"email": "", "username": "", "password": "1234"}
    for i in range(USER_NUMBER):
        data["email"] = f"user{i}@user.com"
        data["username"] = f"user{i}"
        res = requests.post(authAPI, data=data, verify=False)
    #     print(f"user{i} respons ==>", res.json(), res.status_code)
    # print(2 * "\t", "=======================================================", 2 * "\n")


def get_auth_cookie(user):
    login_data = {"username": user, "password": "1234"}
    res = requests.post(loginAPI, data=login_data, verify=False)
    jwt_token = res.cookies["jwt_token"]
    cooki = {"jwt_token": jwt_token}
    print(f"====> {user} \n\033[32m", jwt_token, "\033[0m")
    return cooki


# def create_chatrooms():
#     # print(2 * "\t", "================= create chatrooms ====================")
#
#     user = {"username": ""}
#
#     for id in range(USER_NUMBER):
#         user_mail = f"user{id}@user.com"
#         cookie = get_auth_cookie(user_mail)
#         for i in range(USER_NUMBER):
#             user["username"] = f"user{i}"
#             res = requests.post(creatChatroomAPI, data=user, cookies=cookie)
#             # print(f"user{i} respons ==>", res.json(), res.status_code)
#
#         user["username"] = "belkarto"
#         res = requests.post(creatChatroomAPI, data=user, cookies=cookie)
#
#     # print(2 * "\t", "=======================================================")
#


def create_friendship():
    # print(2 * "\t", "================= create friendship ===================")
    friend = {"id_target": 1}
    for id in range(USER_NUMBER):
        user_mail = f"user{id}@user.com"
        cookie = get_auth_cookie(user_mail)
        for i in range(USER_NUMBER):
            friend["id_target"] = i + 1
            res = requests.post(
                friendshipAPI, data=friend, cookies=cookie, verify=False
            )
            # print(f"user{i} respons ==>", res.json(), res.status_code)

    cookie = {
        "jwt_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiMmZhIjpmYWxzZSwiZXhwIjoxNzIzOTgzMTkwLCJpYXQiOjE3MjM4OTY3OTB9.hF8BN6qXrX7P6B9HR8UlZe7MG2bSx2kHS2WucyuyY38",
    }
    for i in range(USER_NUMBER):
        friend["id_target"] = i + 1
        res = requests.post(friendshipAPI, data=friend, cookies=cookie, verify=False)
    # print(2 * "\t", "=======================================================")


create_users()
# create_chatrooms()
create_friendship()
