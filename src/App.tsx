import React from 'react';
import './App.css';
import { Menu } from './components/Menu';
import { Login } from './features/login/Login';
import { Insert } from './features/insert/Insert';
import { Active } from './features/active/Active';
import { History } from './features/history/History';
import { Userdata } from './features/userdata/Userdata';
import { selectUser } from './features/login/loginSlice';
import { useSelector } from 'react-redux';

import { Route } from 'react-router-dom';

export const App = () => {
    const user = useSelector(selectUser);

    return (
        <div className="App">
            <Menu />
            {!user ? <Login /> : ''}

            {user ? <Route path="/insert" component={Insert} /> : ''}
            {user ? <Route path="/active" component={Active} /> : ''}
            {user ? <Route path="/history" component={History} /> : ''}
            {user ? <Route path="/userdata" component={Userdata} /> : ''}
        </div>
    );
};
