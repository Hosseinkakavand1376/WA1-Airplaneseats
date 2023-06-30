[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/TsciYmrA)
# Exam 2: "Exam airplaneseats"
## Student: s308581 Hossein Kakavand 

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

- POST `/api/something`
  - request parameters and request body content
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

## Database Tables

- Table `users` -  id username password 
- Table `flights` - Plane_type"  TEXT,
  "Num_rows"  INTEGER,"Num_seats_per_row"  INTEGER
- Table `reservations` - "ID"  INTEGER,
  "User_ID"  INTEGER,
  "Plane_Type"  TEXT,
  "Seat_Row"  TEXT,
  "Seat_position"  TEXT,
  "Status"  TEXT,
  "Num_seats_reserved"  INTEGER


## Main React Components

- `LoginForm` (in `./componnents/Auth.jsx`): Used in log in page and will handle login with Passport module
- `LogoutButton` (in `./componnents/Auth.jsx`): Log out button on homepage for logging out to the homepage
- `SeatVisualization` (in `./componnents/Menu.jsx`): drop down menu for choosing a plane type.
- `Login` (in `./componnents/FlightSeatsComponent.jsx`): this component is making a seat visualization in the seatVisualization page, and also initialize the texts that should be shown in this page.
- `Logout` (in `./componnents/FlightSeatsComponent.jsx`): A button for reserving a flight. After confirming a reservation this button will change to the cancel reservation button, to allow the user to cancel his/her reservation.
- `confirmationReservation` (in `./componnents/NavbarComponent.jsx`): A navbar which contains login/logout button and the name of the site.
- `App` (in `./App.jsx`): Main component that handle all actions and other components, also it has local storage for states so states will not be lost on refresh.

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- user1@email.com, user1 (plus any other requested info)
- user2@email.com, user2 (plus any other requested info)
