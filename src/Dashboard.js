// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WeatherCard from './WeatherCard';
import 'bootstrap/dist/css/bootstrap.min.css'; // Імпорт Bootstrap
import './Dashbord.css'; // Імпорт ваших стилів

const Dashboard = () => {
    const navigate = useNavigate();
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const cookies = document.cookie.split(';');
        const loggedIn = cookies.some(cookie => cookie.trim().startsWith('loggedIn=true'));

        if (!loggedIn) {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=50.4501&longitude=30.5234&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=Europe/Kiev");
                if (!response.ok) {
                    throw new Error('Не вдалося завантажити дані про погоду.');
                }
                const data = await response.json();
                console.log(data);

                const limitedWeatherData = {
                    time: data.daily.time.slice(0, 5),
                    temperature_2m_max: data.daily.temperature_2m_max.slice(0, 5),
                    temperature_2m_min: data.daily.temperature_2m_min.slice(0, 5),
                    precipitation_sum: data.daily.precipitation_sum.slice(0, 5),
                    weathercode: data.daily.weathercode.slice(0, 5),
                };

                setWeatherData(limitedWeatherData); // Зберігаємо дані про погоду на 5 днів
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchWeather();
    }, []);

    if (loading) return <p>Завантаження...</p>;
    if (error) return <p>{error}</p>;

    // Перевірка на правильний формат даних
    if (!weatherData || !weatherData.time) {
        return <p>Неправильний формат даних.</p>;
    }

    return (
        <div className="container position-relative">
            <h2 className="title">Weather in Kyiv</h2>
            <div className="row week-forecast mt-4">
                {weatherData.time.map((_, index) => (
                    <div className="col text-center" key={index}>
                        <WeatherCard weather={{
                            date: weatherData.time[index],
                            maxTemp: weatherData.temperature_2m_max[index],
                            minTemp: weatherData.temperature_2m_min[index],
                            precipitation: weatherData.precipitation_sum[index],
                        }} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
