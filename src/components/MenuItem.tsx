import React from 'react';
import './MenuItem.css';

interface MenuItemProps {
    href: string;
    title: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ href, title }) => {
    return (
        <div className="MenuItem">
            <a href={href}>{title}</a>
        </div>
    );
};

export default MenuItem;
