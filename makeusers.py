import requests

authAPI = "http://127.0.0.1:8000/api/signups/"
loginAPI = "http://127.0.0.1:8000/api/logins/"
creatChatroomAPI = "http://127.0.0.1:8000/api/chat/create/"
friendshipAPI = "http://127.0.0.1:8000/api/friendship/"

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
        res = requests.post(authAPI, data=data)
    #     print(f"user{i} respons ==>", res.json(), res.status_code)
    # print(2 * "\t", "=======================================================", 2 * "\n")


def get_auth_cookie(user):
    login_data = {"username": user, "password": "1234"}
    res = requests.post(loginAPI, data=login_data)
    jwt_token = res.cookies["jwt_token"]
    cooki = {"jwt_token": jwt_token}
    print("====> \n", jwt_token)
    return cooki


def create_chatrooms():
    # print(2 * "\t", "================= create chatrooms ====================")

    user = {"username": ""}

    for id in range(USER_NUMBER):
        user_mail = f"user{id}@user.com"
        cookie = get_auth_cookie(user_mail)
        for i in range(USER_NUMBER):
            user["username"] = f"user{i}"
            res = requests.post(creatChatroomAPI, data=user, cookies=cookie)
            # print(f"user{i} respons ==>", res.json(), res.status_code)

        user["username"] = "belkarto"
        res = requests.post(creatChatroomAPI, data=user, cookies=cookie)

    # print(2 * "\t", "=======================================================")


def create_friendship():
    # print(2 * "\t", "================= create friendship ===================")
    friend = {"id_target": 1}
    for id in range(USER_NUMBER):
        user_mail = f"user{id}@user.com"
        cookie = get_auth_cookie(user_mail)
        for i in range(USER_NUMBER):
            friend["id_target"] = i + 1
            res = requests.post(friendshipAPI, data=friend, cookies=cookie)
            # print(f"user{i} respons ==>", res.json(), res.status_code)

    # print(2 * "\t", "=======================================================")


create_users()
create_chatrooms()
create_friendship()
