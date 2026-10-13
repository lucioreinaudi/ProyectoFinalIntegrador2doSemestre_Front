import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Icon from './Icon';
import PanelAccesibilidad from './PanelAccesibilidad';
import { logout, selectEstaLogueado, selectUsuario } from '../features/auth/authSlice';
import { alternarTema, selectTema } from '../features/preferencias/preferenciasSlice';

const TopBar = () => {
    const estaLogueado = useSelector(selectEstaLogueado);
    const usuario = useSelector(selectUsuario);
    const esOscuro = useSelector(selectTema) === 'oscuro';
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <header className="topbar">
            <a href="#contenido-principal" className="saltar-contenido">Saltar al contenido</a>
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
                    {estaLogueado && (
                        <NavLink to="/mis-reportes" className={({ isActive }) => isActive ? 'active-link' : ''}>
                            <Icon name="list" size={18} /><span>Mis reportes</span>
                        </NavLink>
                    )}
                    {/* "Mi cuenta" ya no va aca: queda solo el de "Hola, {nombre}" de mas abajo,
                        que apunta a la misma ruta (/cuenta) y ya depende de la sesion. */}
                </nav>

                {/* ACCIONES RAPIDAS */}
                <div className="topbar-actions">
                    <button
                        type="button"
                        className="icon-btn"
                        title={esOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                        aria-label={esOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                        onClick={() => dispatch(alternarTema())}
                    >
                        <Icon name={esOscuro ? 'sun' : 'moon'} />
                    </button>
                    <PanelAccesibilidad />
                    <button className="icon-btn" title="Notificaciones">
                        <Icon name="bell" />
                        <span className="badge-dot">3</span>
                    </button>

                    {/* LÓGICA DE INGRESO / USUARIO LOGUEADO */}
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '0.5rem', paddingLeft: '0.5rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                        {estaLogueado ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Link to="/cuenta" className="icon-btn wide" title="Mi cuenta" style={{ textDecoration: 'none' }}>
                                    <Icon name="user" />
                                    <span className="a11y-label" style={{ display: 'inline-block', marginLeft: '0.3rem', fontWeight: '600' }}>
                                        Hola, {usuario?.nombre}
                                    </span>
                                </Link>
                                <button type="button" className="icon-btn" title="Salir" onClick={handleLogout}>
                                    <Icon name="logout" />
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                <Link to="/login" style={{ color: 'var(--texto-2)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                                    Ingresar
                                </Link>
                                <Link to="/registro" style={{ backgroundColor: 'var(--brand-fondo)', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </header>
    );
};

export default TopBar;