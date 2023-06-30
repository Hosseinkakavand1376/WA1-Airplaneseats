import axios from 'axios';

const SERVER_URL = 'http://localhost:3001/api/';

// Utility function for handling HTTP errors
function handleResponseError(error) {
  if (error.response) {
    throw new Error(error.response.data.error);
  } else if (error.request) {
    throw new Error('Cannot communicate with the server');
  } else {
    throw new Error('Unknown error occurred');
  }
}

/**
 * This function wants username and password inside a "credentials" object.
 * It executes the log-in.
 */
const logIn = async (credentials) => {
  return getJson(fetch(SERVER_URL + 'sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',  // this parameter specifies that authentication cookie must be forwarded
    body: JSON.stringify(credentials),
  }));
};

/**
 * This function is used to verify if the user is still logged-in.
 * It returns a JSON object with the user info.
 */
const getUserInfo = async () => {
  return getJson(fetch(SERVER_URL + 'sessions/current', {
      credentials: 'include' // this parameter specifies that authentication cookie must be forwarded
  }));
};

/**
 * This function destroy the current user's session and execute the log-out.
 */
const logOut = async() => {
  return getJson(fetch(SERVER_URL + 'sessions/current', {
      method: 'DELETE',
      credentials: 'include' // this parameter specifies that authentication cookie must be forwarded
  }));
}


// Save reservation data
async function saveReservation(data) {
  try {
    const response = await axios.post(`${SERVER_URL}reservation`, data);
    return response.data;
  } catch (error) {
    handleResponseError(error);
  }
}

// Fetch reservation data
async function getReservation() {
  try {
    const response = await axios.get(`${SERVER_URL}reservation`);
    return response.data;
  } catch (error) {
    handleResponseError(error);
  }
}

// Select seats
async function selectSeats(seats) {
  try {
    const response = await axios.post(`${SERVER_URL}seats/select`, { seats });
    return response.data;
  } catch (error) {
    console.log(error.response);
  }
}

const API = {
  logIn,
  logOut,
  getUserInfo,
  saveReservation,
  getReservation,
  selectSeats,
};

export default API;
