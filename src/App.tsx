import './App.css';
import { Menu } from './components/Menu';
import { Footer } from './components/Footer';
import { Login } from './features/login/Login';
import { Insert } from './features/insert/Insert';
import { Active } from './features/active/Active';
import { History } from './features/history/History';
import { Userdata } from './features/userdata/Userdata';
import { selectUser } from './features/login/loginSlice';
import { useDispatch, useSelector } from 'react-redux';

import { Route, Switch, Redirect } from 'react-router-dom';
import { useEffect } from 'react';
import { whoAmIAsync } from './features/whoami/whoAmISlice';

export const App = () => {
    const user = useSelector(selectUser);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(whoAmIAsync());
    }, [dispatch]);

    return (
        <div className="App">
            <Menu />
            <div className="content">
                {user ? (
                    <Switch>
                        <Redirect exact from="/" to="/insert" />
                        <Route path="/insert" component={Insert} />
                        <Route path="/active" component={Active} />
                        <Route path="/history" component={History} />
                        <Route path="/userdata" component={Userdata} />
                    </Switch>
                ) : (
                    <Login />
                )}
            </div>
            <Footer />
        </div>
    );
};
