import React, { useState, useContext } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AuthContext from './Auth';
function Login() {
  const { setIsLoggedIn } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    // Perform login logic here
    if (username && password) {
      // Login successful
      console.log('Login successful');
      setIsLoggedIn(true);
      navigate('/');
      // Perform any additional actions upon successful login
      // Reset the form
      setUsername('');
      setPassword('');
    } else {
      // Login failed
      console.log('Login failed');
      // Perform any additional actions upon failed login
    }
  };

  return (
    <Container>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="navigation">
        <Link to="/seat-select">
          <Button>Home</Button>
        </Link>
        <Button type="submit">Login</Button>
      </div>
        
      </form>
      
    </Container>
  );
}

export default Login;
