import string
import random

def roomcode(login):
    return login + ''.join(random.choices(string.ascii_uppercase + string.ascii_lowercase + string.digits, k=10))