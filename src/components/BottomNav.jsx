import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from './Icon';

const BottomNav = () => {
    return (
        <nav className="bottom-nav" aria-label="Navegación principal">
            <NavLink to="/" className={({ isActive }) => isActive ? 'bn-item active-link' : 'bn-item'}>
                <Icon name="home" size={22} />
                <span>Inicio</span>
            </NavLink>
            <NavLink to="/reporte" className={({ isActive }) => isActive ? 'bn-item active-link' : 'bn-item'}>
                <Icon name="plus" size={22} />
                <span>Reportar</span>
            </NavLink>
            <NavLink to="/mis-reportes" className={({ isActive }) => isActive ? 'bn-item active-link' : 'bn-item'}>
                <Icon name="list" size={22} />
                <span>Mis reportes</span>
            </NavLink>
            <NavLink to="/cuenta" className={({ isActive }) => isActive ? 'bn-item active-link' : 'bn-item'}>
                <Icon name="user" size={22} />
                <span>Mi cuenta</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;