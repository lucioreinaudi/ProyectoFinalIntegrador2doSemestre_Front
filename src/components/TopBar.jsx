import React, { useState, useEffect, useRef } from 'react';
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

    // --- LÓGICA EASTER EGG SCRUM 67 ---
    const [clicksNecesarios] = useState(() => Math.floor(Math.random() * 2) + 6);
    const [clicksActuales, setClicksActuales] = useState(0);
    const [mostrarEasterEgg, setMostrarEasterEgg] = useState(false);
    const timerResetRef = useRef(null);

    useEffect(() => {
        let timer;
        if (mostrarEasterEgg) {
            timer = setTimeout(() => {
                setMostrarEasterEgg(false);
                setClicksActuales(0);
            }, 6700);
        }
        return () => clearTimeout(timer);
    }, [mostrarEasterEgg]);

    const handleLogoClick = (e) => {
        // Evita el comportamiento predeterminado del link mientras clickeas
        e.preventDefault();

        // Reinicia el timeout si el usuario tarda más de 2.5s entre click y click
        if (timerResetRef.current) clearTimeout(timerResetRef.current);

        const nuevoConteo = clicksActuales + 1;

        if (nuevoConteo >= clicksNecesarios) {
            setMostrarEasterEgg(true);
            setClicksActuales(0);
        } else {
            setClicksActuales(nuevoConteo);
            // Si deja de clickear por 2.5 segundos, reseteamos el contador
            timerResetRef.current = setTimeout(() => {
                setClicksActuales(0);
            }, 2500);
        }
    };
    // ----------------------------------

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <header className="topbar">
            <a href="#contenido-principal" className="saltar-contenido">Saltar al contenido</a>
            <div className="topbar-inner">

                {/* LOGO Y MARCA CON EASTER EGG */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div 
                        className="brand" 
                        onClick={handleLogoClick} 
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        role="button"
                        tabIndex={0}
                    >
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
                    </div>

                    {/* GATITO EASTER EGG (6.7 segundos) */}
                    {mostrarEasterEgg && (
                        <div className="easter-cat-container">
                            <img 
                                src="https://media.tenor.com/_i3CPf0XlJYAAAAM/nub-nub-cat.gif" 
                                alt="SixSeven Easter Egg Cat" 
                                className="easter-cat-img"
                            />
                        </div>
                    )}
                </div>

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