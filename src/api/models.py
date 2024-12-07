from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
import bcrypt

# Custom User Manager
class Users(models.Model):
    """
    This model corresponds to the 'Users' table in the PostgreSQL database.
    """
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50, unique=True, null=False)
    email = models.EmailField(max_length=100, unique=True, null=False)
    password = models.CharField(max_length=255, null=False)  # Store raw password

    class Meta:
        db_table = 'Users'

    def check_password(self, raw_password: str) -> bool:
        """
        Compares the provided password with the stored password.
        """
        return self.password == raw_password

# Projects Model
class Projects(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(
        Users,  # References the custom Users model
        on_delete=models.CASCADE,
    )
    title = models.CharField(max_length=100, null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Projects'

# Version_History Model
class Version_History(models.Model):
    id = models.AutoField(primary_key=True)
    project_id = models.ForeignKey(
        Projects,
        on_delete=models.CASCADE,
    )
    version_number = models.IntegerField(default=0, null=False)

    class Meta:
        db_table = 'Version_History'
