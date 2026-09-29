import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import AlertsList from '../components/AlertsList';

// Datos estáticos
const ZONAS = ["Zona Norte", "Zona Centro", "Zona Sur", "Zona Este", "Zona Oeste"];

const ALERTAS = [
    { id: 'a1', nivel: 'alto', zona: 'Zona Norte', titulo: 'Tormenta y riesgo de anegamiento', hora: 'Hoy · 16:45 hs', foto: 'cloud-rain', desc: 'Se esperan lluvias intensas en las próximas horas, con acumulación de agua en calles bajas del barrio y alrededores de la Ruta 7.' },
    { id: 'a2', nivel: 'medio', zona: 'Zona Sur', titulo: 'Viento fuerte', hora: 'Hoy · 12:30 hs', foto: 'wind', desc: 'Ráfagas de viento de hasta 70 km/h previstas para la tarde. Precaución con estructuras livianas y ramas sueltas.' },
    { id: 'a3', nivel: 'medio', zona: 'Zona Centro', titulo: 'Corte de energía eléctrica programado', hora: 'Hoy · 10:15 hs', foto: 'zap', desc: 'Trabajos de mantenimiento en la red eléctrica del microcentro. El corte está previsto entre las 14:00 y las 18:00 hs.' },
    { id: 'a4', nivel: 'bajo', zona: 'Zona Este', titulo: 'Árbol caído', hora: 'Ayer · 18:20 hs', foto: 'tree', desc: 'Cuadrillas municipales están trabajando en la zona retirando un árbol caído tras la tormenta del fin de semana.' },
];

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
    // Estados para los filtros
    const [filtroZona, setFiltroZona] = useState('todas');
    const [filtroNivel, setFiltroNivel] = useState('todos');

    // Lógica de filtrado
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
                        {ACCIONES_RAPIDAS.map((accion) => (
                            <Link to={accion.ruta} key={accion.titulo} className={`quick-card ${accion.primary ? 'primary' : ''}`}>
                                <span className="qi"><Icon name={accion.icono} /></span>
                                <strong>{accion.titulo}</strong>
                                <span>{accion.desc}</span>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Home;