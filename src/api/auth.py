from .models import Users
from django.core.exceptions import ObjectDoesNotExist

def authenticate_user(username: str, password: str) -> Users:
    """
    Authenticate a user against the Users table.
    Returns the user instance if authentication is successful.
    """
    try:
        # Retrieve the user by username
        user = Users.objects.get(username=username)

        # Validate password
        if user.check_password(password):
            return user
    except ObjectDoesNotExist:
        pass

    return None
