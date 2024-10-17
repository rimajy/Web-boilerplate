// src/components/WeatherCard.js
import React from 'react';
import './WeatherCard.css'; // Імпорт CSS-файлу
import 'bootstrap/dist/css/bootstrap.min.css'; // Імпорт Bootstrap

const WeatherCard = ({ weather }) => {

    const { date, maxTemp, minTemp, precipitation } = weather;

    // Функція для вибору іконки погоди на основі кількості опадів
    const getWeatherIcon = (precipitation) => {
        if (precipitation >= 0.1 ) {
            return 'https://img.icons8.com/color-glass/42/000000/rain.png'; // сильний дощ
        } else {
            return 'https://img.icons8.com/color-glass/42/000000/sun.png'; // сонячно
        }
    };

    // Перетворення дати на об'єкт Date
    const dateObj = new Date(date);

    // Отримання дня тижня
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dayOfWeek = dateObj.toLocaleDateString('en', options);
    return (
        <div className="weather-card">
            <h3>{dayOfWeek}</h3>
            <img src={getWeatherIcon(precipitation)} alt="Weather Icon" />
            <p>Максимальна температура: {maxTemp} °C</p>
            <p>Мінімальна температура: {minTemp} °C</p>
            <p>Опади: {precipitation} мм</p>
        </div>
    );
};

export default WeatherCard;

