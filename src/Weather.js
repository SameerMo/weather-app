import React, { useEffect, useState } from 'react';
import axios from 'axios';
import apiKeys from './apiKeys';

const Weather = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);

    const fetchData = async (query) => {
        try {
            const response = await axios.get(
                `${apiKeys.base}weather?q=${query}&units=metric&appid=${apiKeys.key}`
            );
            setWeatherData(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getWeatherByCoords = async (lat, lon) => {
        try {
            const response = await axios.get(
                `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKeys.key}`
            );
            setWeatherData(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    getWeatherByCoords(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error(error);
                    // If location is disabled default to London
                    fetchData('London');
                }
            );
        } else {
            console.error("Geolocation not available");
            // If location is disabled default to London
            fetchData('London');
        }
    }, []);

    const handleInputChange = (e) => {
        setCity(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchData(city);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter city name"
                    value={city}
                    onChange={handleInputChange}
                />
                <button type="submit">Get Weather</button>
            </form>
            {weatherData ? (
                <>
                    <h2>{weatherData.name}</h2>
                    <p>Temperature: {weatherData.main.temp}°C</p>
                    <p>Description: {weatherData.weather[0].description}</p>
                    <p>Feels like : {weatherData.main.feels_like}°C</p>
                    <p>Humidity : {weatherData.main.humidity}%</p>
                    <p>Pressure : {weatherData.main.pressure}</p>
                    <p>Wind Speed : {weatherData.wind.speed}m/s</p>
                </>
            ) : (
                <p>Loading weather data...</p>
            )}
        </div>
    );
};

export default Weather;
