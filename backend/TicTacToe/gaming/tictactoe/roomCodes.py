import random, string

def roomcode(user):
    return user + ''.join(random.choices(string.ascii_uppercase + string.ascii_lowercase + string.digits, k=10))