import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import Icon from './Icon';
import { formatearFechaHora } from '../features/reclamos/formato';

const CADA_CUANTO_MS = 60000; // revisa si hay notificaciones nuevas cada 1 minuto

// Campanita del vecino (Q17): contador de no leidas y desplegable con la lista.
// Las notificaciones las crea el back solo (cambio de estado y publicacion).
// Clic en una = marcarla leida e ir a Mis Reportes con ese reclamo abierto.
const Notificaciones = () => {
    const navigate = useNavigate();
    const [notificaciones, setNotificaciones] = useState([]);
    const [abierto, setAbierto] = useState(false);
    const contenedorRef = useRef(null);

    const cargar = () => {
        api.get('/api/notificaciones/me')
            .then((res) => setNotificaciones(res.data))
            .catch(() => { /* si falla, queda la lista anterior */ });
    };

    // Al montar y despues cada minuto.
    useEffect(() => {
        let activo = true;
        const pedir = () => {
            api.get('/api/notificaciones/me')
                .then((res) => { if (activo) setNotificaciones(res.data); })
                .catch(() => { /* si falla, queda la lista anterior */ });
        };
        pedir();
        const intervalo = setInterval(pedir, CADA_CUANTO_MS);
        return () => { activo = false; clearInterval(intervalo); };
    }, []);

    // Cerrar con clic afuera o con Escape.
    useEffect(() => {
        if (!abierto) return undefined;
        const alClic = (e) => {
            if (contenedorRef.current && !contenedorRef.current.contains(e.target)) setAbierto(false);
        };
        const alTecla = (e) => { if (e.key === 'Escape') setAbierto(false); };
        document.addEventListener('mousedown', alClic);
        document.addEventListener('keydown', alTecla);
        return () => {
            document.removeEventListener('mousedown', alClic);
            document.removeEventListener('keydown', alTecla);
        };
    }, [abierto]);

    const noLeidas = notificaciones.filter((n) => !n.leida).length;

    const alternar = () => {
        if (!abierto) cargar(); // al abrir, trae lo ultimo
        setAbierto(!abierto);
    };

    const abrirNotificacion = async (n) => {
        setAbierto(false);
        if (!n.leida) {
            // Se marca leida en pantalla enseguida; el back valida que sea del usuario.
            setNotificaciones((prev) => prev.map((x) => (x.id === n.id ? { ...x, leida: true } : x)));
            api.patch(`/api/notificaciones/${n.id}/leida`).catch(() => cargar());
        }
        navigate(`/mis-reportes?reclamo=${n.reclamoId}`);
    };

    return (
        <div className="notif" ref={contenedorRef}>
            <button
                type="button"
                className="icon-btn"
                title="Notificaciones"
                aria-label={noLeidas > 0 ? `Notificaciones, ${noLeidas} sin leer` : 'Notificaciones'}
                aria-expanded={abierto}
                onClick={alternar}
            >
                <Icon name="bell" />
                {noLeidas > 0 && <span className="badge-dot">{noLeidas > 9 ? '9+' : noLeidas}</span>}
            </button>

            {abierto && (
                <div className="notif-panel" role="dialog" aria-label="Notificaciones">
                    <div className="notif-head">Notificaciones</div>
                    {notificaciones.length === 0 ? (
                        <p className="notif-vacio">No tenés notificaciones.</p>
                    ) : (
                        <ul className="notif-lista">
                            {notificaciones.map((n) => (
                                <li key={n.id}>
                                    <button type="button" className={`notif-item ${n.leida ? '' : 'no-leida'}`}
                                        onClick={() => abrirNotificacion(n)}>
                                        <span className="notif-mensaje">{n.mensaje}</span>
                                        <span className="notif-fecha">{formatearFechaHora(n.fecha)}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default Notificaciones;
