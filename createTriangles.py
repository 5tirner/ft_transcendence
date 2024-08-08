import sys

# print(f"List Of Argement: {sys.argv}")

if len(sys.argv) > 2:
    raise Exception("Bad ARgement")

elif len(sys.argv) == 2:
    numbers = '1234567890'
    for i in sys.argv[1]:
        if numbers.find(i) == -1:
            raise Exception("Bad Argement")
t = 1
try:
    trianglehight = int(sys.argv[1])
    print("Working On Your Triangle...\n\n")
    space = ''
    for i in range(trianglehight):
        space  = space + ' '
except:
    print('You Can choise The Height Of Your Triangle, Example: [python test.py 5]\n\n')
    trianglehight = 5
    space = '     '

for i in range(trianglehight):
    print(space, end='')
    space = space.replace(' ', '', 1)
    for j in range(t):
        print('*', end='')
    print('')
    t += 2
