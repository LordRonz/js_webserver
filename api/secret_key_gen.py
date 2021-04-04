import secrets
import string

s = string.ascii_letters * 2 + string.digits + string.punctuation
password = ''.join(secrets.choice(s) for i in range(32))
print(password)