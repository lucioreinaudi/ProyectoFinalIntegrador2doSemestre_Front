import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Icon from './Icon';

const TopBar = () => {
    return (
        <header className="topbar">
            <div className="topbar-inner">

                {/* LOGO Y MARCA */}
                <Link to="/" className="brand">
                    <div className="brand-mark">
                        <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
                            <circle cx="24" cy="24" r="22" fill="var(--superficie)" />
                            <path d="M24 4a20 20 0 0 1 20 20H24Z" fill="#1656A6" />
                            <path d="M44 24a20 20 0 0 1-20 20V24Z" fill="#2FA89A" />
                            <path d="M24 44A20 20 0 0 1 4 24h20Z" fill="#F0A93B" />
                            <path d="M4 24A20 20 0 0 1 24 4v20Z" fill="#0B3B73" />
                            <circle cx="24" cy="24" r="8" fill="var(--superficie)" />
                        </svg>
                    </div>
                    <div className="brand-text">
                        <strong>Conectar Laboulaye</strong>
                        <span>Municipalidad de Laboulaye</span>
                    </div>
                </Link>

                {/* NAVEGACIÓN DESKTOP */}
                <nav className="top-nav" aria-label="Navegación principal">
                    <NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : ''}>
                        <Icon name="home" size={18} /><span>Inicio</span>
                    </NavLink>
                    <NavLink to="/reporte" className={({ isActive }) => isActive ? 'active-link' : ''}>
                        <Icon name="plus" size={18} /><span>Reportar problema</span>
                    </NavLink>
                    <NavLink to="/mis-reportes" className={({ isActive }) => isActive ? 'active-link' : ''}>
                        <Icon name="list" size={18} /><span>Mis reportes</span>
                    </NavLink>
                    <NavLink to="/cuenta" className={({ isActive }) => isActive ? 'active-link' : ''}>
                        <Icon name="user" size={18} /><span>Mi cuenta</span>
                    </NavLink>
                </nav>


                {/* ACCIONES RAPIDAS (Tema, Accesibilidad, Notificaciones) */}
                <div className="topbar-actions">
                    <button className="icon-btn" title="Cambiar tema">
                        <Icon name="moon" />
                    </button>
                    <button className="icon-btn wide" title="Accesibilidad">
                        <Icon name="a11y" /><span className="a11y-label">Accesibilidad</span>
                    </button>
                    <button className="icon-btn" title="Notificaciones">
                        <Icon name="bell" />
                        <span className="badge-dot">3</span>
                    </button>
                    <Link to="/cuenta" className="icon-btn" title="Mi cuenta">
                        <Icon name="user" />
                    </Link>
                </div>

            </div>
        </header >
    );
};

export default TopBar;