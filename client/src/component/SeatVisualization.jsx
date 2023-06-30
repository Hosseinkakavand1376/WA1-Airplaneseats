import React from 'react';

function SeatVisualization({ planeType, numRows, numColumns, onSeatClick, selectedSeats }) {
  const generateSeats = () => {
    console.log('Generating Seats...');
    const generatedSeats = [];
    for (let row = 1; row <= numRows; row++) {
      for (let col = 1; col <= numColumns; col++) {
        const seatId = `${row}${String.fromCharCode(64 + col)}`;
        const seat = {
          id: seatId,
          status: 'available',
        };
        generatedSeats.push(seat);
      }
    }
    return generatedSeats;
  };

  const seatMap = generateSeats();

  const getSeatStatusCount = (status) => {
    return seatMap.filter((seat) => seat.status === status).length;
  };

  const handleSeatClick = (seatId) => {
    const clickedSeat = seatMap.find((seat) => seat.id === seatId);
    if (clickedSeat) {
      onSeatClick([clickedSeat]); 
    }
  };


  const renderSeatMap = () => {
    return seatMap.map((seat) => {
      const isSelected = selectedSeats.some((selectedSeat) => selectedSeat.id === seat.id);
      const seatClass = `seat ${seat.status} ${isSelected ? 'selected' : ''}`;
      return (
        <div
          key={seat.id}
          className={seatClass}
          style={{ flexBasis: `calc(100% / ${numColumns+1})` }}
          onClick={() => handleSeatClick(seat.id)}
        >
          {seat.id}
        </div>
      );
    
    });
  };

  return (
    <div className="seat-visualization">
      <h2>Seat Map ({planeType})</h2>
      <div className="seat-map">
        <div className="seat-numeric-view">
          <div className="seat-grid">
            {renderSeatMap()}
          </div>
        </div>
        <div className="seat-graphical-view">
          <div className="seat-status available"></div>
          <div className="seat-status occupied"></div>
          <div className="seat-status requested"></div>
        </div>
      </div>
      <div className="seat-info">
        <div className="seat-info-item">
          <div className="seat-status available"></div>
          <span >Available: {getSeatStatusCount('available')}</span>
        </div>
        <div className="seat-info-item">
          <div className="seat-status occupied"></div>
          <span>Occupied: {getSeatStatusCount('occupied')}</span>
        </div>
        <div className="seat-info-item">
          <div className="seat-status requested"></div>
          <span>Requested: {getSeatStatusCount('requested')}</span>
        </div>
      </div>
    </div>
  );
}

export default SeatVisualization;
