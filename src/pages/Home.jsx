import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Icon from '../components/Icon';
import { selectEstaLogueado } from '../features/auth/authSlice';
import AlertsList from '../components/AlertsList';
import ConsejosSeguridad from '../components/ConsejosSeguridad';
import { ZONAS, ALERTAS } from '../data/alertas';

// Datos estáticos
const CONTACTOS = [
    { clase: 'bomberos', icono: 'flame', nombre: 'Bomberos', tel: '100' },
    { clase: 'policia', icono: 'shield', nombre: 'Policía', tel: '101' },
    { clase: 'hospital', icono: 'heart', nombre: 'Hospital', tel: '107' },
    { clase: 'municipio', icono: 'building', nombre: 'Municipio', tel: '(3385) 421111' },
];

const ACCIONES_RAPIDAS = [
    { ruta: '/reporte', icono: 'megaphone', titulo: 'Reportar un problema', desc: 'Foto, ubicación y categoría', primary: true },
    { ruta: '/mis-reportes', icono: 'list', titulo: 'Ver mis reportes', desc: 'Seguimiento de tus reportes' },
    { ruta: '/alertas', icono: 'alert-triangle', titulo: 'Ver todas las alertas', desc: 'Información por zona' },
    { ruta: '/info', icono: 'info', titulo: 'Información útil', desc: 'Consejos y recomendaciones' },
];

const Home = () => {
    const estaLogueado = useSelector(selectEstaLogueado);

    // Estados para los filtros
    const [filtroZona, setFiltroZona] = useState('todas');
    const [filtroNivel, setFiltroNivel] = useState('todos');

    // Ver mis reportes solo tiene sentido con sesion iniciada (completa SCRUM-52).
    const accionesVisibles = ACCIONES_RAPIDAS.filter(a => a.ruta !== '/mis-reportes' || estaLogueado);

    // Logica de filtrado
    const alertasFiltradas = ALERTAS.filter(a =>
        (filtroZona === 'todas' || a.zona === filtroZona) &&
        (filtroNivel === 'todos' || a.nivel === filtroNivel)
    );

    return (
        <section className="view is-active" aria-labelledby="tit-inicio">

            {/* HERO Y CLIMA */}
            <div className="hero">
                <div className="hero-inner">
                    <div className="hero-flex">
                        <div>
                            <p className="hero-eyebrow">Bienvenido a</p>
                            <h1 id="tit-inicio">Conectar Laboulaye</h1>
                            <p>Información oficial para estar conectados con nuestra ciudad. Consultá las alertas activas, recibí recomendaciones y reportá problemas en tu zona.</p>
                        </div>
                        <div className="weather-card">
                            <span className="wi"><Icon name="cloud-rain" size={40} /></span>
                            <div>
                                <div className="loc">Laboulaye</div>
                                <strong>18°C</strong>
                                <div className="desc">Lluvias</div>
                            </div>
                            <div className="weather-minmax">Máx. 22°<br />Mín. 16°</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="content">

                {/* CONTACTOS DE EMERGENCIA */}
                <div className="section">
                    <div className="section-head">
                        <div className="section-head-title-row">
                            <span className="section-head-icon" style={{ background: 'var(--info-bg)', color: 'var(--brand-1)' }}>
                                <Icon name="phone" />
                            </span>
                            <div className="section-head-text">
                                <h2>Contactos de emergencia</h2>
                                <p>Tocá una tarjeta para llamar directamente.</p>
                            </div>
                        </div>
                    </div>
                    <div className="contact-grid">
                        {CONTACTOS.map((contacto) => (
                            <a key={contacto.nombre} className={`contact-card ${contacto.clase}`} href={`tel:${contacto.tel.replace(/\s/g, '')}`}>
                                <span className="ci"><Icon name={contacto.icono} /></span>
                                <strong>{contacto.nombre}</strong>
                                <span className="tel"><Icon name="phone" size={14} /> {contacto.tel}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* ALERTAS Y FILTROS */}
                <div className="section">
                    <div className="filtros" role="group" aria-label="Filtrar alertas">
                        <select
                            aria-label="Filtrar por zona"
                            value={filtroZona}
                            onChange={(e) => setFiltroZona(e.target.value)}
                        >
                            <option value="todas">Todas las zonas</option>
                            {ZONAS.map(z => <option key={z} value={z}>{z}</option>)}
                        </select>
                        <div className="seg-filtro" role="group" aria-label="Filtrar por nivel de gravedad">
                            <button aria-pressed={filtroNivel === 'todos'} onClick={() => setFiltroNivel('todos')}>Todos</button>
                            <button aria-pressed={filtroNivel === 'alto'} onClick={() => setFiltroNivel('alto')}>Alto</button>
                            <button aria-pressed={filtroNivel === 'medio'} onClick={() => setFiltroNivel('medio')}>Medio</button>
                            <button aria-pressed={filtroNivel === 'bajo'} onClick={() => setFiltroNivel('bajo')}>Bajo</button>
                        </div>
                    </div>

                    {/* Renderizamos el componente pasándole las alertas ya filtradas */}
                    <AlertsList alertas={alertasFiltradas} />
                </div>

                {/* ACCIONES RÁPIDAS */}
                <div className="section">
                    <div className="section-head">
                        <div className="section-head-title-row">
                            <span className="section-head-icon" style={{ background: 'var(--info-bg)', color: 'var(--brand-1)' }}>
                                <Icon name="megaphone" />
                            </span>
                            <div className="section-head-text">
                                <h2>¿Necesitás hacer algo?</h2>
                                <p>Accedé a las principales acciones del sistema.</p>
                            </div>
                        </div>
                    </div>
                    <div className="quick-grid">
                        {accionesVisibles.map((accion) => (
                            <Link to={accion.ruta} key={accion.titulo} className={`quick-card ${accion.primary ? 'primary' : ''}`}>
                                <span className="qi"><Icon name={accion.icono} /></span>
                                <strong>{accion.titulo}</strong>
                                <span>{accion.desc}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* CONSEJOS DE SEGURIDAD */}
                <ConsejosSeguridad />

            </div>
        </section>
    );
};

export default Home;