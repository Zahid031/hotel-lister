## git clone

git clone https://github.com/syful-islam/ComplyWiseApi.git

git remote add origin https://github.com/syful-islam/ComplyWiseApi.git

## run application

~/projects/python$ source djvenv/bin/activate
cd ComplyWiseApi/

python3 manage.py runserver 8080

## Migration script

python3 manage.py makemigrations

## in production

python3 manage.py migrate

## in production for swagger

python3 manage.py collectstatic

## Batch Command to update in github

git add .
git commit -m "Employee Model View Created"
git push origin main

## Command to pull to production from github

git pull origin main

sudo systemctl restart gunicorn.service

sudo systemctl restart nginx
sudo supervisorctl restart all

os user pass: qazwsx!@#

## Credintial for server

ssh elastic@66.70.242.9 -p3000
elastic!@#123!@#
http://66.70.242.9:3001/

## view the Swagger or ReDoc documentation

http://127.0.0.1:8000/swagger/ or
http://127.0.0.1:8000/redoc/

## re-publish to production

sudo -u postgres psql

DROP DATABASE complywise;
CREATE DATABASE complywise;

git stash
git pull origin main

python3 manage.py migrate

sudo rm -r staticfiles/
python3 manage.py collectstatic

sudo systemctl restart complywiseapi



ALTER DATABASE complywise OWNER TO complywise_user;

GRANT ALL PRIVILEGES ON DATABASE complywise TO complywise_user;

GRANT ALL PRIVILEGES ON SCHEMA public TO complywise_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO complywise_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO complywise_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO complywise_user;
