import React from 'react';
import { Container, Button } from 'react-bootstrap';

function CancelReservation({ onCancelReservation }) {
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel your reservation?')) {
      onCancelReservation();
    }
  };

  return (
    <Container>
      <h1>Cancel Reservation</h1>
      <p>Are you sure you want to cancel your reservation?</p>
      <Button variant="danger" onClick={handleCancel}>
        Cancel Reservation
      </Button>
    </Container>
  );
}

export default CancelReservation;
