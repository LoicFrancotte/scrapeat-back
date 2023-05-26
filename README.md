# Recipe-Scrapping-App - Backend

This project is a backend for a recipe scrapping application, built with Node.js, Express, GraphQL, Apollo Server, MongoDB, Faker.js, Cheerio and Passport. The application allows a user to insert the URL of a cooking recipe website, and the script retrieves only the information relevant to that recipe on the website, removing any irrelevant information. The user will receive the recipe without any unnecessary information from the original website and can save it to their "recipe book."

Please note that this application is designed to work only with links from the following websites: [Marmiton](https://marmiton.org), [CuisineAZ](https://cuisineaz.com), and [Cuisine Actuelle](https://cuisineactuelle.fr).

## Database Schema

![Database Schema](https://imgur.com/StaIMt0.png)

## Table of Contents

- [Live Application](#live-application)
- [Frontend Repository](#frontend-repository)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Populating the Database with Fake Data](#populating-the-database-with-fake-data)

## Live Application

You can try the live application at the following address:
[Live App!](https://scrap-eat-one.vercel.app/)

![screen](https://imgur.com/LFtA9PT.png)

## Frontend Repository

The frontend source code is located in the following repository: 
[Frontend Repository](https://github.com/Onllsan/scrapEAT)

## Features

- Insert the URL of a cooking recipe website from [Marmiton](https://marmiton.org), [CuisineAZ](https://cuisineaz.com), and [Cuisine Actuelle](https://cuisineactuelle.fr) to extract relevant information
- Remove irrelevant information from the recipe webpage
- Save recipes to a "recipe book" (Comming soon)
- User authentication via Facebook and Google (Comming soon)

## Technologies

- Node.js
- Express
- GraphQL
- Apollo Server
- MongoDB
- Faker.js
- Cheerio
- Passport

## Installation

1. Clone this repository

2. Install dependencies:

- `npm install`

3. Copy the `.env.example` file as `.env` and configure the environment variables according to your needs.

4. Start the server:

- `npm run dev`

## Populating the Database with Fake Data

To populate the database with fake data using the `faker.js` script, follow these steps:

1. Build the project:

- `npm run build`

2. Navigate to the `dist` directory:

- `cd dist`

3. Navigate to the `script` directory:

- `cd script`

4. Run the `seedDb.js` script:

- `node seedDb.js`