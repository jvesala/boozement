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

import { Route, Routes, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { whoAmIAsync } from './features/whoami/whoAmISlice';

export const App = () => {
  const user = useSelector(selectUser);

  const dispatch = useDispatch<any>();
  useEffect(() => {
    dispatch(whoAmIAsync());
  }, [dispatch]);

  //<Redirect exact from="/" to="/insert" />

  return (
    <div className="App">
      <Menu />
      <div className="content">
        {user ? (
          <Routes>
            <Route path="/insert" element={<Insert />} />
            <Route path="/active" element={<Active />} />
            <Route path="/history" element={<History />} />
            <Route path="/userdata" element={<Userdata />} />
            <Route path="*" element={<Navigate to="/insert" />} />
          </Routes>
        ) : (
          <Login />
        )}
      </div>
      <Footer />
    </div>
  );
};
