# NC News

NC News is an API serving articles on a range of topics to the frontend app, Katie's NC News. Here is a link to the hosted API:

https://katies-nc-news.herokuapp.com

For a full list of endpoints please visit the following link:

https://katies-nc-news.herokuapp.com/api

## Getting started

To run this API locally please do the following:

### 1. Fork & Clone the repo

### 2. Install dependencies

Once you have forked and cloned the repo, navigate to the root folder of the project in the command line and run the following command:

    npm init

This will install the following dependencies listed in the package.json:

    "dependencies": {
    "body-parser": "^1.18.3",
    "cors": "^2.8.5",
    "express": "^4.16.4",
    "heroku": "^7.19.4",
    "knex": "^0.15.2",
    "pg": "^7.6.1"
    },
    "devDependencies": {
    "chai": "^4.2.0",
    "eslint": "^5.9.0",
    "eslint-config-airbnb": "^17.1.0",
    "eslint-plugin-import": "^2.14.0",
    "husky": "^1.1.4",
    "nodemon": "^1.18.9",
    "supertest": "^3.3.0"
    }

These are the minimum versions required.

### 3. Set up a knexfile.js

The knexfile.js contains key settings to enable knex to interact with the PostgreSQL database in different environments: test/development/production.

Create a knexfile.js in the root of your project and populate it with the following:

    const { DB_URL } = process.env;

    module.exports = {
      development: {
        client: 'pg',
        connection: {
          database: 'nc_news',
        },
        migrations: {
          directory: './db/migrations',
        },
        seeds: {
          directory: './db/seeds',
        },
      },
      test: {
        client: 'pg',
        connection: {
          database: 'nc_news_test',
        },
        migrations: {
          directory: './db/migrations',
        },
        seeds: {
          directory: './db/seeds',
        },
      },
      production: {
        client: 'pg',
        connection: `${DB_URL}?ssl=true`,
        migrations: {
          directory: './db/migrations',
        },
        seeds: {
          directory: './db/seeds',
        },
      },
    };

### 4. Set up a PostgreSQL database

Next you will need to create a database, by running the following command in your terminal:

    psql -f ./db/dev_setup.sql

Connect to PSQL in your terminal, by running the following:

    psql

Then list the available databases by running the following:

    \l

Quit PSQL by typing:

    \q

### 5. Migrate and seed the database

To populate your database, run the following command:

    npm run seed:db

This will rollback any previous migrations you made to your database, create the tables using the migration files located in ./db/migrations, and then seed the database with the development data located in ./db/data/development-data.

### 6. Run the development API

In the root directory, run the following command:

    npm run dev

If the command is successful, you should see the following in your terminal:

    [nodemon] 1.18.9
    [nodemon] to restart at any time, enter `rs`
    [nodemon] watching: *.*
    [nodemon] starting `node listen.js`
    Listening on port 9090

### 7. Navigate to the development API

Once nodemon is running, open your browser and navigate to the following address:

    http://localhost:9090/api

This will give you a list of further endpoints, which are also listed below:

    {
      "/api": {
        "/topics": {
          "GET": "responds with an array of topic objects",
          "POST": "accepts a topic object and responds with the posted object",
          "/:topic/articles": {
            "GET": "responds with an array of article objects for the given topic",
            "POST": "accepts an article object and responds with the posted object"
          }
        },
        "/articles": {
          "GET": "responds with an array of article objects",
          "/:article_id": {
            "GET": "responds with an article object matching the given article_id",
            "PATCH": "accepts a vote_inc object for the given article_id and responds with the updated article object",
            "DELETE": "deletes the article object matching the given article_id",
            "/comments": {
              "GET": "responds with an array of comment object matching the given article_id",
              "POST": "accepts a comment object for the given article_id and responds with the posted object",
              "PATCH": "accepts a vote_inc object for the given article_id and comment_id and responds with the updated comment object",
              "DELETE": "deletes the comment object matching the given article_id and comment_id"
            }
          }
        },
        "/users": {
          "GET": "responds with an array of user articles",
          "/:username": {
            "GET": "responds with a user object matching the given username"
          }
        }
      }
    }

You can then begin making GET, POST, PATCH and DELETE requests via Postman. Once you are finished, close nodemon by pressing CTRL+C in your terminal.

## Testing

This API has been tested throughout development, using Mocha as the test suite, Chai as the assertion library, and Supertest to test the connection to the endpoints.

The test environment runs on a different database to the development environment. Before you run the tests, create the test database by running the following command in your terminal:

    psql -f ./db/test_setup.sql

In ./spec/app.spec.js, you can see that the migrations and seeding occur before each test:

    beforeEach(() => connection.migrate
      .rollback()
      .then(() => connection.migrate.latest())
      .then(() => connection.seed.run()));
    after(() => connection.destroy());

This will ensure that any changes made via the endpoints will not cause subsequent tests to fail.

## Deployment

This version of the API is hosted on Heroku. To host your own version on Heroku, you can follow these steps:

1. Sign up to Heroku on https://signup.heroku.com/

2. Install Heroku globally on your local machine using the following terminal command:
```bash
    npm i -g heroku
```
3. In the root directory of the app log in to Heroku. The following command will make you open a browser to login to Heroku.

4. To create a new app, enter:
```bash
    heroku create <app-name>
```
5. Push the app to heroku:
```bash
    git push heroku master
```
6. In your user area of Heroku, the app should now be available. Click into it and add 'Heroku Postgres' as an add-on. This will act as the database for the application.

7. Click on the settings for the database and check these credentials against the output of the following terminal command:
```bash
heroku config:get DATABASE_URL
```
8. Check that your knexfile.js has the correct production information

## Built with

- [Node](https://nodejs.org/en/) - JavaScript Runtime Environment
- [Express](https://expressjs.com/) - Web application framework
- [Knex](https://knexjs.org/) - SQL Query and Schema Builder
- [Mocha](https://knexjs.org/) - Testing Framework
- [Supertest](https://www.npmjs.com/package/supertest) - Package for testing HTTP requests
- [GitHub](https://github.com/) - used for version control

## Author

Katie Robinson - [Rusty414](https://github.com/Rusty414)

## Acknowledgements

Thanks to all the tutors at Northcoders