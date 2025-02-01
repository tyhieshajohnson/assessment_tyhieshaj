import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FlightSearch = () => {
  const [originQuery, setOriginQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [originSkyId, setOriginSkyId] = useState('');
  const [destinationSkyId, setDestinationSkyId] = useState('');
  const [originEntityId, setOriginEntityId] = useState('');
  const [destinationEntityId, setDestinationEntityId] = useState('');
  const [departureDate, setDepartureDate] = useState('2025-02-20');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch airport suggestions for the origin or destination
  const fetchAirportSuggestions = async (query, setSuggestions) => {
    if (query.length > 2) {
      const options = {
        method: 'GET',
        url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport',
        params: {
          query: query,
          locale: 'en-US'
        },
        headers: {
          'x-rapidapi-key': 'a98f740603msh715edb03b3e02cfp18182ejsn0b0f565bfd13',
          'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        if (response.data.status) {
          setSuggestions(response.data.data.airports);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Handle search submission
  const handleSearch = async () => {
    if (!originSkyId || !destinationSkyId) {
      setError('Please select both origin and destination airports.');
      return;
    }

    setLoading(true);
    setError('');

    const options = {
      method: 'GET',
      url: 'https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlightsComplete',
      params: {
        originSkyId: originSkyId,
        destinationSkyId: destinationSkyId,
        originEntityId: originEntityId,
        destinationEntityId: destinationEntityId,
        date: departureDate,
        returnDate: returnDate || undefined,
        cabinClass: 'economy',
        adults: adults.toString(),
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
      if (response.data.status && Array.isArray(response.data.data.itineraries) && response.data.data.itineraries.length > 0) {
        setFlights(response.data.data.itineraries);
      } else {
        setFlights([]);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('An error occurred while fetching flight data');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Flight Booking System</h1>

      {/* Origin Field */}
      <div>
        <label>Origin:</label>
        <input
          type="text"
          value={originQuery}
          onChange={(e) => {
            setOriginQuery(e.target.value);
            fetchAirportSuggestions(e.target.value, setOriginSuggestions);
          }}
        />
        {originSuggestions.length > 0 && (
          <ul style={{ border: '1px solid #ccc', maxHeight: '200px', overflowY: 'auto' }}>
            {originSuggestions.map((airport) => (
              <li
                key={airport.id}
                onClick={() => {
                  setOriginSkyId(airport.code);
                  setOriginEntityId(airport.entityId);
                  setOriginQuery(airport.name);
                  setOriginSuggestions([]);
                }}
                style={{ padding: '5px', cursor: 'pointer' }}
              >
                {airport.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Destination Field */}
      <div>
        <label>Destination:</label>
        <input
          type="text"
          value={destinationQuery}
          onChange={(e) => {
            setDestinationQuery(e.target.value);
            fetchAirportSuggestions(e.target.value, setDestinationSuggestions);
          }}
        />
        {destinationSuggestions.length > 0 && (
          <ul style={{ border: '1px solid #ccc', maxHeight: '200px', overflowY: 'auto' }}>
            {destinationSuggestions.map((airport) => (
              <li
                key={airport.id}
                onClick={() => {
                  setDestinationSkyId(airport.code);
                  setDestinationEntityId(airport.entityId);
                  setDestinationQuery(airport.name);
                  setDestinationSuggestions([]);
                }}
                style={{ padding: '5px', cursor: 'pointer' }}
              >
                {airport.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Departure and Return Date Fields */}
      <div>
        <label>Departure Date:</label>
        <input
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
        />
      </div>

      <div>
        <label>Return Date (Optional):</label>
        <input
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
        />
      </div>

      {/* Adults Input */}
      <div>
        <label>Adults:</label>
        <input
          type="number"
          value={adults}
          onChange={(e) => setAdults(Number(e.target.value))}
        />
      </div>

      {/* Search Button */}
      <button onClick={handleSearch}>Search Flights</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display flight results */}
      {Array.isArray(flights) && flights.length === 0 && !loading && <p>No flights found</p>}
      {Array.isArray(flights) && flights.length > 0 && (
        <div>
          <h3>{flights.length} flights found</h3>
          {flights.map((flight, index) => {
            const flightDetails = flight.price && flight.price.total
              ? flight.price.total
              : 'Price not available';
            const departureTime = flight.departure
              ? flight.departure.date
              : 'Departure time not available';
            const arrivalTime = flight.arrival
              ? flight.arrival.date
              : 'Arrival time not available';
            const airlineName = flight.airline && flight.airline.name
              ? flight.airline.name
              : 'Airline not available';
            const flightNumber = flight.flightNumber || 'Flight number not available';

            return (
              <div key={index}>
                <h4>Flight: {flightNumber}</h4>
                <p>Price: ${flightDetails}</p>
                <p>Departure: {departureTime}</p>
                <p>Arrival: {arrivalTime}</p>
                <p>Airline: {airlineName}</p>
                <hr />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FlightSearch;
