import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Icon from '../components/Icon';
import { selectEsMunicipio, selectEstaLogueado } from '../features/auth/authSlice';
import AlertsList from '../components/AlertsList';
import ConsejosSeguridad from '../components/ConsejosSeguridad';
import useAlertasActivas from '../features/alertas/useAlertasActivas';

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
    const esMunicipio = useSelector(selectEsMunicipio);

    // Estados para los filtros
    const [filtroZona, setFiltroZona] = useState('todas');
    const [filtroNivel, setFiltroNivel] = useState('todos');

    // Alertas reales del back (publicas, se ven sin login).
    const { alertas, zonas, cargando: cargandoAlertas, error: errorAlertas } = useAlertasActivas();

    // Estado para la información del clima
    const [clima, setClima] = useState({
        temperatura: '--',
        condicion: 'Cargando...',
        humedad: 0,
        iconoName: 'cloud-rain'
    });

    // Función auxiliar para mapear la condición al icono correspondiente
    const obtenerIconoClima = (condicionText, esDeDia) => {
        if (!condicionText) return 'cloud-rain';
        const cond = condicionText.toLowerCase();

        if (cond.includes('despejado')) {return esDeDia ? 'sun' : 'moon';}
        if (cond.includes('tormenta')) {return 'zap';}
        if (cond.includes('viento')) {return 'wind';}
        return 'cloud-rain';
    };

    // Llamada al endpoint del clima en el backend
    useEffect(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        fetch('http://localhost:8080/api/clima/actual', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('Error al obtener el clima');
                return res.json();
            })
            .then(data => {
                setClima({
                    temperatura: data.temperatura || '--',
                    condicion: data.condicion || 'Desconocido',
                    humedad: data.humedad || 0,
                    iconoName: obtenerIconoClima(data.condicion, data.esDeDia)
                });
            })
            .catch(err => {
                console.error("Error al cargar clima:", err);
                setClima(prev => ({ ...prev, condicion: 'No disponible' }));
            });
    }, []);

    // Ver mis reportes solo tiene sentido con sesion iniciada. El municipio ve la
    // pagina publica igual que un vecino, pero sin Reportar ni Mis reportes (no le
    // corresponden: RutaProtegida lo sacaria de ahi igual).
    const accionesVisibles = ACCIONES_RAPIDAS.filter(a => {
        if (esMunicipio) return a.ruta !== '/reporte' && a.ruta !== '/mis-reportes';
        return a.ruta !== '/mis-reportes' || estaLogueado;
    });

    // Logica de filtrado
    const alertasFiltradas = alertas.filter(a =>
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
                            <span className="wi"><Icon name={clima.iconoName} size={40} /></span>
                            <div>
                                <div className="loc">Laboulaye</div>
                                <strong>{clima.temperatura}</strong>
                                <div className="desc">{clima.condicion}</div>
                            </div>
                            <div className="weather-minmax">Humedad<br />{clima.humedad}%</div>
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
                            {zonas.map(z => <option key={z} value={z}>{z}</option>)}
                        </select>
                        <div className="seg-filtro" role="group" aria-label="Filtrar por nivel de gravedad">
                            <button aria-pressed={filtroNivel === 'todos'} onClick={() => setFiltroNivel('todos')}>Todos</button>
                            <button aria-pressed={filtroNivel === 'alto'} onClick={() => setFiltroNivel('alto')}>Alto</button>
                            <button aria-pressed={filtroNivel === 'medio'} onClick={() => setFiltroNivel('medio')}>Medio</button>
                            <button aria-pressed={filtroNivel === 'bajo'} onClick={() => setFiltroNivel('bajo')}>Bajo</button>
                        </div>
                    </div>

                    {/* Renderizamos el componente pasándole las alertas ya filtradas */}
                    <AlertsList alertas={alertasFiltradas} cargando={cargandoAlertas} error={errorAlertas} />
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