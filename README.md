
#  Hotel-Lister – Dockerized Django App

I have tried to build the API for Hotel-Lister application.

---

## 🐳 Docker Image

Docker Hub Image:  
➡️ [`zahid03/hotel-lister:latest`](https://hub.docker.com/repository/docker/zahid03/hotel-lister/tags)

### 📥 Pull the image

```bash
docker pull zahid03/hotel-lister:latest
```

### ▶️ Run container

```bash
docker run -d -p 8001:8001 zahid03/blog_app:v1
```

Now you can access from  [http://localhost:8001](http://localhost:8001)

---

## Hotel-Lister

Hotel Lister is a Python application that helps users find, compare, and manage hotel listings from various sources. It provides a streamlined interface for searching hotels based on location, price, amenities, and ratings, making it easier for travelers to find the perfect accommodation for their needs.

```bash
Key Features:
1.User authentication and authorization.
2.Search and Filtering
3.API documentation with swagger.
```


---

## ⚙️ Local Development Setup (Non-Docker)

### 1️⃣ Clone the repository

```bash
git clone git@github.com:Zahid031/hotel-lister.git
cd hotel-lister
```

### 2️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

### 3️⃣ Create the database and apply migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4️⃣ Create a superuser (admin)

```bash
python manage.py createsuperuser
```

### 5️⃣ Start the development server

```bash
python manage.py runserver
```

Visit: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/) to access the admin dashboard.
Here is the live website running on pythonanywhere

```bash
```


---


