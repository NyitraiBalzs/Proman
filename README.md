# ProMan (sprint 2)

## Description: 

> Proman is a Task management application for users create cards and track tasks with them.
> This project was a a team project with CodeCool students (four of us), it focused on 
> understanding the flow of a fullstack application, from database to frontend UI.

## Tech:
- database -> PostgreSQL
- backend(server) -> Python Flask
- AJAX -> fetch API
- UI -> Jinja2/html/css/vanilla JS

## Features:

- User registrtation/login
- task card drag and drop 
- add/delete/modify cards and statuses
- all data saved in database

## Requirements:
- Python 3.8
- PostgreSQL (database)
- enviroment variables:
    - MY_PSQL_DBNAME= your db's name
    - MY_PSQL_USER= your (postgreSQL) username
    - MY_PSQL_HOST= localhost
    - MY_PSQL_PASSWORD= your (postgreSQL) password
- install project requirements with ```$ pip install -r requirements.txt```
- run data/proman_sample_data.sql in your database to setup sample data
