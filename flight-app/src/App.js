import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import SearchAirports from './SearchAirports';
import SearchFlight from './SearchFlight';

function App() {
  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: 'GET',
        url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport',
        params: {
          query: 'new',
          locale: 'en-US'
        },
        headers: {
          'x-rapidapi-key': 'a98f740603msh715edb03b3e02cfp18182ejsn0b0f565bfd13',
          'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">Navbar</a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavAltMarkup"
              aria-controls="navbarNavAltMarkup"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav">
                <Link className="nav-link" to="/airports">
                  <button type="button" className="btn btn-outline-secondary">Airports</button>
                </Link>
                <Link className="nav-link" to="/flights">
                  <button type="button" className="btn btn-outline-secondary">Flights</button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/airports" element={<SearchAirports />} />
          <Route path="/flights" element={<SearchFlight />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
