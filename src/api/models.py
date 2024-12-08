from django.db import models

# Users table
class Users(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50, unique=True, null=False)
    email = models.EmailField(max_length=100, unique=True, null=False)
    password = models.CharField(max_length=255, null=False)  # Store raw password
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)


    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email']

    class Meta:
        db_table = 'Users'

    def check_password(self, raw_password: str) -> bool:
        return self.password == raw_password

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

# Repositories table
class Projects(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        db_column='user_id'
    )
    title = models.CharField(max_length=100, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=100, default="")

    class Meta:
        db_table = 'Projects'

# Version History table
class Version_History(models.Model):
    id = models.AutoField(primary_key=True)
    project_id = models.ForeignKey(
        Projects,
        on_delete=models.CASCADE,
        db_column='project_id'
    )
    version_number = models.IntegerField(default=0, null=False)

    class Meta:
        db_table = 'Version_History'

# Comments table
class Comments(models.Model):
    id = models.AutoField(primary_key=True)
    project_id = models.ForeignKey(
        Projects,
        on_delete=models.CASCADE,
        db_column='project_id'
    )
    user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        db_column='user_id'
    )
    content = models.TextField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'comments'

# Files table
class Files(models.Model):
    id = models.AutoField(primary_key=True)
    project_id = models.ForeignKey(
        Projects,
        on_delete=models.CASCADE,
        db_column='project_id'
    )
    user_id = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        db_column='user_id'
    )
    file_name = models.TextField(null=False)
    file_size = models.IntegerField(default=0)
    file_url = models.TextField(null=True)
    file_type = models.TextField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'files'
