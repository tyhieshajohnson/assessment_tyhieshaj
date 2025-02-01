import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

function SearchAirports() {
  const [airports, setAirports] = useState([]);
  const [searchQueryOrigin, setSearchQueryOrigin] = useState('');
  const [searchQueryDestination, setSearchQueryDestination] = useState('');
  const [originAirport, setOriginAirport] = useState(null);
  const [destinationAirport, setDestinationAirport] = useState(null);
  const [error, setError] = useState(null);
  const [flights, setFlights] = useState([]);
  const [loadingFlights, setLoadingFlights] = useState(false);
  const [flightError, setFlightError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async (query) => {
      if (!query) {
        setAirports([]);
        return;
      }

      const options = {
        method: 'GET',
        url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport',
        params: { query, locale: 'en-US' },
        headers: {
          'x-rapidapi-key': 'a98f740603msh715edb03b3e02cfp18182ejsn0b0f565bfd13',
          'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
        },
      };

      try {
        setError(null);
        const response = await axios.request(options);
        const filteredAirports = response.data.data.filter(item => item.navigation.entityType === "AIRPORT");
        setAirports(filteredAirports);
      } catch (error) {
        console.error('Error fetching airport data:', error);
        setError('Failed to fetch airports. Please try again.');
      }
    };

    if (searchQueryOrigin) {
      fetchData(searchQueryOrigin);
    } else if (searchQueryDestination) {
      fetchData(searchQueryDestination);
    }
  }, [searchQueryOrigin, searchQueryDestination]);

  const handleSelectAirport = (airport, type) => {
    if (type === 'origin') {
      setOriginAirport(airport);
      setSearchQueryOrigin(airport.presentation.title);
    } else if (type === 'destination') {
      setDestinationAirport(airport);
      setSearchQueryDestination(airport.presentation.title);
    }
  };

  const handleNext = async () => {
    if (!originAirport || !destinationAirport) {
      return;
    }

    setLoadingFlights(true);
    setFlightError(null);

    const options = {
      method: 'GET',
      url: 'https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlightsComplete',
      params: {
        originSkyId: originAirport.skyId,
        destinationSkyId: destinationAirport.skyId,
        originEntityId: originAirport.entityId,
        destinationEntityId: destinationAirport.entityId,
        cabinClass: 'economy',
        adults: '1',
        sortBy: 'best',
        currency: 'USD',
        market: 'en-US',
        countryCode: 'US'
      },
      headers: {
        'x-rapidapi-key': 'a98f740603msh715edb03b3e02cfp18182ejsn0b0f565bfd13',
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      setFlights(response.data.data);
      setLoadingFlights(false);
      navigate('/flights', { state: { originAirport, destinationAirport, flights: response.data.data } });
    } catch (error) {
      console.error('Error fetching flights:', error);
      setFlightError('Failed to fetch flights. Please try again.');
      setLoadingFlights(false);
    }
  };

  const filteredAirportsForDestination = airports.filter(
    (airport) => !originAirport || airport.skyId !== originAirport.skyId
  );
  const filteredAirportsForOrigin = airports.filter(
    (airport) => !destinationAirport || airport.skyId !== destinationAirport.skyId
  );

  return (
    <div className="search-airports-container">
      <h1>Choose Airports</h1>

      <input
        type="text"
        className="search-bar"
        placeholder="Search for an origin airport"
        value={searchQueryOrigin}
        onChange={(e) => setSearchQueryOrigin(e.target.value)}
      />
      {error && <p className="error-message">{error}</p>}
      <ul className="airports-list">
        {filteredAirportsForOrigin.map((airport) => (
          <li key={airport.skyId} className="airport-item">
            <button
              className="airport-button"
              onClick={() => handleSelectAirport(airport, 'origin')}
            >
              {airport.presentation.title} ({airport.skyId})
            </button>
          </li>
        ))}
      </ul>

      <input
        type="text"
        className="search-bar"
        placeholder="Search for a destination airport"
        value={searchQueryDestination}
        onChange={(e) => setSearchQueryDestination(e.target.value)}
      />
      {error && <p className="error-message">{error}</p>}
      <ul className="airports-list">
        {filteredAirportsForDestination.map((airport) => (
          <li key={airport.skyId} className="airport-item">
            <button
              className="airport-button"
              onClick={() => handleSelectAirport(airport, 'destination')}
            >
              {airport.presentation.title} ({airport.skyId})
            </button>
          </li>
        ))}
      </ul>

      <button
        className="next-button"
        onClick={handleNext}
        disabled={!originAirport || !destinationAirport}
      >
        Next
      </button>

      {loadingFlights && <p>Loading flights...</p>}
      {flightError && <p className="error-message">{flightError}</p>}
    </div>
  );
}

export default SearchAirports;
