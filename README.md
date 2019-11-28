# Node / Express / MongoDB

> ### Simple library Node web app (Express + MongoDB) codebase containing real world examples.

This repo is mostly complete, but it was created for educational purposes only.

# Getting started

To get the Node server running locally:

- Clone this repo
- `npm install` to install all required dependencies
- Install [MongoDB Community Server](https://www.mongodb.com/download-center/community) and run it by executing `mongod`
- `npm start` to run the local server

# Code Overview

## Dependencies

- [axios](https://github.com/axios/axios) - Promise based HTTP client for the browser and Node.js
- [ejs](https://github.com/mde/ejs) - Embedded JavaScript templates
- [express](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [express-session](https://github.com/expressjs/session) - Simple session middleware for Express
- [mongodb](https://github.com/mongodb/node-mongodb-native) - The official MongoDB driver for Node.js. Provides a high-level API on top of mongodb-core that is meant for end users
- [passport](https://github.com/jaredhanson/passport) - Express comaptible authentication middleware for Node.js
- [passport-local](https://github.com/jaredhanson/passport-local) - Passport strategy for authenticating with a username and password

## Application Structure

- `.env` - The central location for environment variables and API keys.
- `app.js` - The entry point to the application. This file defines our express server, configure dependencies, and also requires the routes we'll be using in the application.
- `config/` - This folder contains configuration for passport authentication as well as navigation.
- `controllers/` - It contains logic for different routes. Functions that get the requested data, create an HTML page filled with the data and return it to the user view.
- `routes/` - Contains definitions of expected API queries to forward supported requests (and any information encoded in request URLs) to the appropriate controller functions.
- `services/` - This folder contains files and functions that help communicate with external resources such as a database or Goodreads website.
- `views/` - Here are the views (templates) used by controllers to render data.
