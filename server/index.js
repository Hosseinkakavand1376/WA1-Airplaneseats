const express = require('express');
const cors = require('cors');
const errorHandler = require('errorhandler');
const bodyParser = require('body-parser');
const daoUsers = require('./dao-users');
const flightDao = require("./flight-dao");

const app = express();
app.use(express.json());

/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

/** Authentication-related imports **/
const passport = require('passport');            // authentication middleware
const LocalStrategy = require('passport-local'); // authentication strategy (username and password)

/** Set up authentication strategy to search in the DB a user with a matching password.**/
passport.use(new LocalStrategy(async function verify(username, password, callback) {
  const user = await daoUsers.getUser(username, password);
  if(!user)
    return callback(null, false, 'Incorrect username or password');  
  return callback(null, user);
}));


// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, callback) { // this user is id + username + name + role
  callback(null, user);
});

// Starting from the data in the session, we extract the current (logged-in) user.
passport.deserializeUser(function (user, callback) { // this user is id + email + name + role
  return callback(null, user); // this will be available in req.user
});

/** Creating the session */
const session = require('express-session');

app.use(session({
  secret: "my secret!!!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

/** Defining authentication verification middleware **/
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated())
      return next();
  return res.status(401).json({error: 'Not authorized'});
}

const db = require('./db');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(errorHandler());


// This route is used for performing login.
app.post('/api/sessions', function(req, res, next) {
  try{
      passport.authenticate('local', (err, user, info) => {
          if(err) return next(err);
          if(!user){
              // display wrong login messages
              return res.status(401).json(info);
          }
          // success, perform the login and extablish a login session
          req.login(user, (err) => {
              if(err) return next(err);
              
              // req.user contains the authenticated user
              return res.json(req.user);
          });
      })(req, res, next);
  } catch(err) {
      res.status(500).json(err.message);
  }
});

// This route checks whether the user is logged in or not.
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
      res.status(200).json(req.user);}
  else
      res.status(401).json({error: 'Not authenticated'});
});

// This route is used for loggin out the current user.
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
      res.status(200).json({});
  });
});


app.post('/api/seats/select', (req, res) => {
  const { planeType, selectedSeats } = req.body;
  const sql = 'UPDATE Reservation SET Plane_Type = ?, Seat_Row = ?, Seat_position = ?, Num_seats_reserved = ? WHERE ID = 1';
  const values = [
    planeType,
    selectedSeats[0].row,
    selectedSeats[0].seatPosition,
    selectedSeats.length
  ];
  
  db.run(sql, values, function(err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ success: 'Selected seats have been reserved' });
    }
  });
});

app.get('/api/seats/:type', (req, res) => {
  const planeType = req.params.type;

  db.get(
    'SELECT Num_rows, Num_seats_per_row FROM Planes WHERE Plane_type = ?',
    [planeType],
    (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      } else if (row) {
        const { Num_rows, Num_seats_per_row } = row;
        res.json({ rows: Num_rows, seatsPerRow: Num_seats_per_row });
      } else {
        res.status(404).json({ error: 'Plane type not found' });
      }
    }
  );
});

app.post('/api/reservation', isLoggedIn, (req, res) => {
  const { planeType, selectedSeats } = req.body;

  db.run(
    'INSERT OR REPLACE INTO Reservation (ID, User_ID, Plane_Type, Seat_Row, Seat_position, Status, Num_seats_reserved) VALUES (1, 1, ?, ?, ?, ?, ?)',
    [
      planeType,
      selectedSeats[0].row,
      selectedSeats[0].seatPosition,
      'reserved',
      selectedSeats.length
    ],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json({ success: true });
      }
    }
  );
});

app.get('/api/reservation', (req, res) => {
  db.get(
    'SELECT Plane_Type, Seat_Row, Seat_position, Num_seats_reserved FROM Reservation WHERE ID = 1',
    (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      } else if (row) {
        const { Plane_Type, Seat_Row, Seat_position, Num_seats_reserved } = row;
        const selectedSeats = Array.from({ length: Num_seats_reserved }, (_, i) => ({
          row: Seat_Row,
          seatPosition: Seat_position
        }));
        res.json({ planeType: Plane_Type, selectedSeats });
      } else {
        res.status(404).json({ error: 'Reservation data not found' });
      }
    }
  );
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

