
// export default ConfirmationPage;
import React, { useContext } from 'react';
import { Container, Button, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AuthContext from './Auth';
import Logout from './Logout';
import API from '../API';

function ConfirmationPage({ selectedSeats, planeType }) {
  const { LoggedIn, setIsLoggedIn } = useContext(AuthContext);

  // Filter the selectedSeats array to get only the reserved seats for the logged-in user
  const reservedSeats = selectedSeats.filter((seat) => seat.status === 'occupied' && seat.user === user);

  const handleLogout = async () => {
    try {
      await API.logout();
      setIsLoggedIn(false);
      setSelectedSeats([]); // Clear selected seats upon logout
    } catch (error) {
      console.error('API Error:', error.message);
    }
  };

  return (
    <Container>
      <h1>Confirmation Page</h1>
      <p>Plane Type: {planeType}</p>
      <p>Reserved Seats:</p>
      <ul>
        {reservedSeats.map((seat) => (
          <li key={seat.id}>
            Seat {seat.row}-{seat.column}
          </li>
        ))}
      </ul>
      {/* Add any additional confirmation details or components here */}
      <div>
        <Link to="/seat-select">
          <Button variant="primary">Back</Button>
        </Link>
      
          <Link to="/logout">
            <Button variant="secondary">Logout</Button>
          </Link>
       
      </div>
    </Container>
  );
}

export default ConfirmationPage;
