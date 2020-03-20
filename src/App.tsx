import React from 'react';
import './App.css';
import { Menu } from './components/Menu';
import { Login } from './features/login/Login';
import { Insert } from './features/insert/Insert';
import { selectUser } from './features/login/loginSlice';
import { useSelector } from 'react-redux';

export const App = () => {
    const user = useSelector(selectUser);

    return (
        <div className="App">
            <Menu />
            {user ? <Insert /> : <Login />}
        </div>
    );
};
