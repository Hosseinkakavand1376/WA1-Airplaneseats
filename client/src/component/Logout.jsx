
// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// function Logout() {
//   const history = useNavigate();

//   const handleLogout = () => {
//     // Clear user session, reset state, etc.
//     // Example: Clear localStorage or session storage
//     localStorage.removeItem('userToken');

//     // Redirect to the login page
//     history.push('/login');
//   };

//   return (
//     <div className="logout">
//       <h2>Logout</h2>
//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   );
// }

// export default Logout;
import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await onLogout();
    navigate('/');
  };

  return (
    <div>
      <h2>Logout</h2>
      <p>Are you sure you want to log out?</p>
      <Button variant="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default Logout;
