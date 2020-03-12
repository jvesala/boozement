import React from 'react';
import './App.css';
import { Menu } from './components/Menu';
import { Login } from './components/Login';

export const App = () => {
    return (
        <div className="App">
            <Menu />
            <Login />
        </div>
    );
};
