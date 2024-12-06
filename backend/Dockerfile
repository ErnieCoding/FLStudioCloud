FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy requirements.txt and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the project files
COPY . .

# Expose the port Django will run on
EXPOSE 8000

# Run Django development server (change to production server in final setup)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

