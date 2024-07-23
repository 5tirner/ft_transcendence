from rest_framework import status, response
import requests

def isAuthUser(req):
    try:
        cookies = req.COOKIES.get('jwt_token')
        print(f"Found Cookies: {cookies}")
        cookies = {'jwt_token': cookies}
    except:
        print("No Cookies Found")
        return None
    try:
        authApiResponse = requests.get('http://auth:8000/api/usercheck', cookies=cookies)
        print(f"AuthResponse: {authApiResponse.json()}")
        if authApiResponse.json().get('errors') is not None:
            print(f"Erros {authApiResponse.json().get('errors')}")
            return None
        if authApiResponse.json().get('message') != "User is authenticated":
            print(f"{authApiResponse.json().get('message')}")
            return None
        if authApiResponse.json().get('isLoged') == False:
            print("No Login")
            return None
    except:
        print("Auth API Failed Succesfully")
        return None
    return authApiResponse