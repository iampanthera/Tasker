### Task Manager App

## This project is made using React, Express, NodeJs, Mongoose, and Docker.

- Frontend uses React, Tailwind Css
- Backend is made using MondoDB, Express and Mongoose
- Nginx is used to orchestrate backend with frontend using the /api route inside the same container

In order to run the project simple run the following command:

`docker-compose up --build`

This will run the application inside the docker container after pulling the config image and installing all the dependencies.
