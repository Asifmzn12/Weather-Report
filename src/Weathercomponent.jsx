import { useState, useEffect } from 'react';
import { TiWeatherCloudy } from 'react-icons/ti';
import { FaWind, FaTint, FaTemperatureLow, FaMapMarkerAlt } from 'react-icons/fa';

const Weathercomponent = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [autoDetect, setAutoDetect] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (autoDetect) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=e4391ab8bf17fb4737695ab96e4db987&units=metric`);
                        const data = await response.json();
                        setWeatherData(data);
                        setError('');
                    } catch (error) {
                        console.error('Error fetching weather data:', error);
                    }
                },
                (error) => {
                    console.error('Error getting user location:', error);
                }
            );
        }
    }, [autoDetect]);

    const handleSearch = async () => {
        if (!city) {
            setError('Please enter a city name.');
            return;
        }

        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=e4391ab8bf17fb4737695ab96e4db987&units=metric`);
            const data = await response.json();
            if (data.cod === '404') {
                setError('City not found. Please enter a valid city name.');
                setWeatherData(null);
            } else {
                setWeatherData(data);
                setError('');
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setError('Error fetching weather data. Please try again later.');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleAutoDetectChange = () => {
        setError('');
        setAutoDetect(!autoDetect);
    };

    const handleCityInputChange = (event) => {
        setCity(event.target.value);
        setAutoDetect(false);
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="card mt-5">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Weather Dashboard <TiWeatherCloudy /></h2>
                            <div className="d-flex justify-content-center mb-3">
                                <img src="https://www.freeiconspng.com/thumbs/weather-icon-png/weather-icon-png-25.png" className="img-fluid" alt="Weather Icon" />
                            </div>
                            <div className="row">
                                <div className="col-lg-9 col-sm-7 col-12 mb-3">
                                    <input
                                        type="text"
                                        className="form-control rounded p-3"
                                        value={city}
                                        onChange={handleCityInputChange}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Enter city name"
                                    />
                                </div>
                                <div className="col-lg-3 col-sm-5 ">
                                    <button className="btn btn-primary p-3 w-100 rounded" type="button" onClick={handleSearch} disabled={!city}>Search</button>
                                </div>
                            </div>
                            <div className="form-check my-3">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="autoDetect"
                                    checked={autoDetect}
                                    onChange={handleAutoDetectChange}
                                />
                                <label className="form-check-label" htmlFor="autoDetect">Auto-detect my location</label>
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            {weatherData && (
                                <div className="weather-details py-3">
                                    <h3 className='my-4'><FaMapMarkerAlt className="icons" /> {weatherData.name}</h3>
                                    <div className="d-flex flex-column flex-md-row  gap-3 align-items-start justify-content-center">
                                        <p><FaWind className="icons" /> Wind Speed: {weatherData.wind.speed} m/s</p>
                                        <p><FaTint className="icons" /> Humidity: {weatherData.main.humidity}%</p>
                                        <p><FaTemperatureLow className="icons" /> Temperature: {weatherData.main.temp}°C</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Weathercomponent;
