
// export default App;
import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SeatVisualization from './component/SeatVisualization';
import { Link, Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import Login from './component/Login';
import Logout from './component/Logout';
import AuthContext from './component/Auth';
import API from './API';
import ConfirmationPage from './component/confirmationReservation';
import CancelReservation from './component/cancelReservation';

function App() {
  const [planeType, setPlaneType] = useState(null);
  const [LoggedIn, setIsLoggedIn] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [user, setUser] = useState(null);
  const [isReservationConfirmed, setIsReservationConfirmed] = useState(false); // New state variable
  const navigate = useNavigate();

  const planeTypes = [
    { type: 'local', rows: 15, seatsPerRow: 4 },
    { type: 'regional', rows: 20, seatsPerRow: 5 },
    { type: 'international', rows: 25, seatsPerRow: 6 },
  ];

  useEffect(() => {
    // Load reservation data on component mount or refresh
    loadReservationData();
  }, []);

  useEffect(() => {
    // Save reservation data whenever selectedSeats or planeType change
    if (selectedSeats.length > 0)
      saveReservationData();
  }, [selectedSeats, planeType]);

  const loadReservationData = async () => {
    try {
      const reservation = await API.getReservation();
      setPlaneType(reservation.planeType);
      setSelectedSeats(reservation.selectedSeats);
    } catch (error) {
      console.error('API Error:', error.message);
    }
  };

  const saveReservationData = async () => {
    try {
      await API.saveReservation({
        planeType,
        selectedSeats,
      });
    } catch (error) {
      console.error('API Error:', error.message);
    }
  };

  const handlePlaneTypeSelect = (type) => {
    setPlaneType(type);
  };

  const handleSeatSelect = async (newSelectedSeats) => {
    if (!LoggedIn) {
      alert('You should Login First');
      return;
    }

    // Check if the clicked seat is already selected
    const clickedSeat = newSelectedSeats[0];
    const seatAlreadySelected = selectedSeats.some((seat) => seat.id === clickedSeat.id);

    if (seatAlreadySelected) {
      // Deselect the seat by removing it from the selectedSeats array
      const updatedSeats = selectedSeats.filter((seat) => seat.id !== clickedSeat.id);
      setSelectedSeats(updatedSeats);
    } else {
      // Select the seat by adding it to the selectedSeats array
      const updatedSeats = [
        ...selectedSeats,
        ...newSelectedSeats.map((seat) => ({
          ...seat,
          status: 'selected',
        })),
      ];

      await API.selectSeats(updatedSeats, user);
      setSelectedSeats(updatedSeats);
    }

    setIsReservationConfirmed(false); // Reset the reservation confirmation status
  };

  
  
  const handleLogin = async (credentials) => {
    try {
      const user = await API.getUserInfo(credentials);
      setUser(user);
      setIsLoggedIn(true);
      // Save reservation data after logging in
      saveReservationData();
      // Redirect to the main page
      navigate('/');
    } catch (err) {
      // error is handled and visualized in the login form, do not manage error, throw it
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      await API.logout();
      setIsLoggedIn(false);
      setSelectedSeats([]); // Clear selected seats upon logout
    } catch (error) {
      console.error('API Error:', error.message);
    }
  };
  

  const handleConfirmReservation = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    try {
      const updatedSeats = selectedSeats.map((seat) => ({
        ...seat,
        status: 'occupied',
      }));

      await API.confirmReservation(updatedSeats, user);
      setIsReservationConfirmed(true);
    } catch (error) {
      console.error('API Error:', error.message);
    }
  };
  
  const handleCancelReservation = async () => {
    if (selectedSeats.length === 0) {
      alert('No seats are currently reserved.');
      return;
    }

    try {
      const updatedSeats = selectedSeats.map((seat) => ({
        ...seat,
        status: 'available',
      }));

      await API.cancelReservation(updatedSeats, user);
      setSelectedSeats([]);
    } catch (error) {
      console.error('API Error:', error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ LoggedIn, setIsLoggedIn }}>
      <Container>
        <h1>Welcome</h1>
        <Row>
          {planeTypes.map((planeType) => (
            <Col key={planeType.type}>
              <Link to={`/seat-select/${planeType.type}`}>
                <Button onClick={() => handlePlaneTypeSelect(planeType.type)}>{planeType.type}</Button>
              </Link>
            </Col>
          ))}
        </Row>
        <Routes>
          <Route
            path="/seat-select/:type"
            element={
              <>
                <SeatVisualization
                  planeType={planeType}
                  numRows={planeTypes.find((plane) => plane.type === planeType)?.rows}
                  numColumns={planeTypes.find((plane) => plane.type === planeType)?.seatsPerRow}
                  onSeatClick={handleSeatSelect}
                  selectedSeats={selectedSeats}
                />
                <Row>
                  {/* <Col>
                    {LoggedIn ? (
                      <>
                        <Row>
                          <Col>
                            <Link to="/confirm-reservation">
                              <Button variant="success">Confirm Reservation</Button>
                            </Link>
                          </Col>
                          <Col>
                            <Link to="/cancel-reservation">
                              <Button variant="danger">Cancel Reservation</Button>
                            </Link>
                          </Col>
                        </Row>
                      </>
                    ) : (
                      <Link to="/login">
                        <Button>Login to Show Seats Map</Button>
                      </Link>
                    )}
                  </Col> */}
                  <Col>
  {LoggedIn ? (
    <>
      <Row>
        <Col>
          <Link to="/confirm-reservation">
            <Button variant="success">Confirm Reservation</Button>
          </Link>
        </Col>
        <Col>
          <Link to="/cancel-reservation">
            <Button variant="danger">Cancel Reservation</Button>
          </Link>
        </Col>
        <Col>
          <Link to="/logout">
            <Button variant="secondary">Logout</Button>
          </Link>
        </Col>
      </Row>
    </>
  ) : (
    <Link to="/login">
      <Button>Login to Show Seats Map</Button>
    </Link>
  )}
</Col>
                </Row>
              </>
            }
          />
          <Route path="/confirm-reservation" element={<ConfirmationPage selectedSeats={selectedSeats} />} />
          <Route
            path="/cancel-reservation"
            element={<CancelReservation onCancelReservation={handleCancelReservation} />}
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
          <Route path="/confirm-reservation" element={<ConfirmationPage />} />
          <Route path="/confirm-reservation" element={<ConfirmationPage selectedSeats={selectedSeats} planeType={planeType} />} />
        </Routes>
      </Container>
    </AuthContext.Provider>
  );
}

export default App;
