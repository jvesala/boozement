import React from 'react';
import './Menu.css';

export const Menu = () => {
  return (
    <div className="Menu">
      <header className="Menu-header">
          <div className="logo">
            <h1>Boozement</h1>
          </div>
          <nav id="nav">
            <ul>
              <li className="tab-header"><a href="#insert" id="tab-header-insert">Syötä</a></li>
              <li className="tab-header"><a href="#active" id="tab-header-active">Nyt juonut</a></li>
              <li className="tab-header"><a href="#history" id="tab-header-history">Historia</a></li>
              <li className="tab-header"><a href="#userdata" id="tab-header-userdata">Omat tiedot</a></li>
            </ul>
          </nav>
        </header>
    </div>
  );
};
