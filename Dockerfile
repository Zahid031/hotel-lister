
# Use official Python image
FROM python:3.11-slim-bullseye

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set workdir in the container
WORKDIR /code

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy entire project
COPY . .
EXPOSE 8001

CMD ["python", "manage.py", "runserver", "0.0.0.0:8001"]

