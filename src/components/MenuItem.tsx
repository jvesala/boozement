import React from 'react';
import './MenuItem.css';
import { NavLink } from 'react-router-dom';

interface MenuItemProps {
    href: string;
    title: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ href, title }) => {
    return (
        <div className="MenuItem">
            <NavLink to={href}>{title}</NavLink>
        </div>
    );
};

export default MenuItem;
