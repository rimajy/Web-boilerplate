import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';  // Підключаємо CSS

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === '' || password === '') {
            setError('Будь ласка, введіть логін та пароль.');
            return;
        }

        if (username === 'mark' && password === '5') {
            document.cookie = 'loggedIn=true; path=/';
            navigate('/dashboard');
        } else {
            setError('Некоректні дані для входу.');
        }
    };

    return (
        <div className="login-page">
            <div className="form">
                <h2>Authorization</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="login"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Sign in</button>
                </form>
                {error && <p className="message">{error}</p>}
            </div>
        </div>
    );
};

export default LoginPage;
