from .models import Users
from django.core.exceptions import ObjectDoesNotExist

def authenticate_user(username: str, password: str) -> bool:
    """
    Authenticate a user by verifying the username and raw password against the database.

    Args:
        username (str): The username to authenticate.
        password (str): The raw password to verify.

    Returns:
        bool: True if authentication is successful, False otherwise.
    """
    try:
        # Fetch the user by username
        user = Users.objects.get(username=username)
        print(f"User found: {user.username}")

        # Compare raw passwords
        return user.check_password(password)

    except Users.DoesNotExist:
        print("User does not exist")
        return False


