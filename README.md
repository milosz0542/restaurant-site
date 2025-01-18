# Restaurant site
Restaurant site is project for PAI classes at University of Wrocław.

## Technologies
node.js - as basic API holder. <br>
sql.js - for database connection. <br>
sqlite - as database.

## Setup
To run this project, install it locally using npm:

```
$ cd ../restaurant-site
$ npm install
```

and run with

```
$ npm start
```

## Features
- [x] Basic API
- [x] Database connection
- [X] Frontend
- [X] Filtering dishes by category
- [X] Adding new dishes
- [ ] Booking system

## Status
Project is: _in progress_

## Usage
To use this project, you need to have node.js installed. <br>
Then you can run it with `npm start` command.

### User 
User can see all dishes, filter them by category, and make reservations.

### Admin
Admin can add new dishes to the menu, and check reservations.
To login to admin panel, go to `/admin` and use `admin` as login and `admin` as password, feel free to change it or create authentication system.
