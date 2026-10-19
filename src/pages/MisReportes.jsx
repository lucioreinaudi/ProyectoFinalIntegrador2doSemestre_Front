import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Icon from '../components/Icon';
import api from '../api/client';
import LocationPicker from '../components/LocationPicker';
import { selectUsuario } from '../features/auth/authSlice';

// Mismos valores que el CHECK de EstadoReclamo en la BD.
const ESTADO_INFO = {
    recibido: { label: 'Recibido', clase: 'recibido' },
    'en revision': { label: 'En revisión', clase: 'revision' },
    'en proceso': { label: 'En proceso', clase: 'proceso' },
    resuelto: { label: 'Resuelto', clase: 'resuelto' },
};

function formatearHace(fechaIso) {
    const fecha = new Date(fechaIso);
    const diffMs = Date.now() - fecha.getTime();
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHoras < 1) return 'hace menos de una hora';
    if (diffHoras < 24) return `hace ${diffHoras} hora${diffHoras === 1 ? '' : 's'}`;
    const diffDias = Math.floor(diffHoras / 24);
    return `hace ${diffDias} día${diffDias === 1 ? '' : 's'}`;
}

function formatearFechaCompleta(fechaIso) {
    return new Date(fechaIso).toLocaleString('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
}

// NuevoReporte guarda las coordenadas como texto (no hay columnas lat/lng en Reclamo),
// con el formato "Lat: -34.123, Lng: -63.456". Esto las vuelve a sacar para poder
// mostrar el mapa. Si el texto no tiene ese formato (ubicacion cargada a mano, por
// ejemplo), simplemente no se muestra el mapa, solo el texto.
function parsearCoordenadas(ubicacionTexto) {
    if (!ubicacionTexto) return null;
    const match = ubicacionTexto.match(/Lat:\s*(-?\d+\.?\d*),\s*Lng:\s*(-?\d+\.?\d*)/);
    if (!match) return null;
    return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
}

const MisReportes = () => {
    const usuario = useSelector(selectUsuario);
    const [reportes, setReportes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);

    // Id del reclamo abierto (solo uno a la vez), y el historial de cada uno
    // que ya se pidio, guardado para no volver a pedirlo si se cierra y se
    // vuelve a abrir el mismo.
    const [abiertoId, setAbiertoId] = useState(null);
    const [historiales, setHistoriales] = useState({});
    const [cargandoHistorial, setCargandoHistorial] = useState(null);

    useEffect(() => {
        if (!usuario) return;
        let activo = true;

        api.get(`/api/reclamos/usuario/${usuario.id}`)
            .then(async (res) => {
                // ReclamoResponse no trae el estado actual (vive en otra tabla),
                // asi que hay que pedirlo aparte por cada reclamo.
                const conEstado = await Promise.all(
                    res.data.map(async (r) => {
                        try {
                            const resEstado = await api.get(`/api/estados-reclamo/reclamo/${r.id}/actual`);
                            return { ...r, estado: resEstado.data.estado };
                        } catch {
                            return { ...r, estado: 'recibido' };
                        }
                    })
                );
                if (activo) setReportes(conEstado);
            })
            .catch(() => {
                if (activo) setError(true);
            })
            .finally(() => {
                if (activo) setCargando(false);
            });

        return () => { activo = false; };
    }, [usuario]);

    const toggleAbierto = async (id) => {
        if (abiertoId === id) {
            setAbiertoId(null);
            return;
        }
        setAbiertoId(id);
        // El historial completo se pide recien al abrir, no para los 8 (o los que sean)
        // reclamos de entrada: ya hacemos un pedido por reclamo solo para el estado actual,
        // no tiene sentido pedir ademas el historial de todos de una.
        if (!historiales[id]) {
            setCargandoHistorial(id);
            try {
                const res = await api.get(`/api/estados-reclamo/reclamo/${id}`);
                setHistoriales((prev) => ({ ...prev, [id]: res.data }));
            } catch {
                setHistoriales((prev) => ({ ...prev, [id]: [] }));
            } finally {
                setCargandoHistorial(null);
            }
        }
    };

    if (!usuario) {
        return (
            <div className="page-wrap">
                <h1 className="page-title">Mis reportes</h1>
                <div className="card-box">
                    <p>Tenés que iniciar sesión para ver esta página.</p>
                </div>
            </div>
        );
    }

    if (cargando) {
        return (
            <div className="page-wrap">
                <h1 className="page-title">Mis reportes</h1>
                <p>Cargando...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-wrap">
                <h1 className="page-title">Mis reportes</h1>
                <p>No se pudieron cargar tus reportes. Intentá de nuevo más tarde.</p>
            </div>
        );
    }

    return (
        <div className="page-wrap">
            <h1 className="page-title">Mis reportes</h1>

            {reportes.length === 0 ? (
                <div className="empty-state">
                    <Icon name="list" size={40} />
                    <p>Todavía no hiciste ningún reporte.</p>
                </div>
            ) : (
                <div id="lista-reclamos">
                    {reportes.map((r) => {
                        const info = ESTADO_INFO[r.estado] || { label: r.estado, clase: 'recibido' };
                        const abierto = abiertoId === r.id;
                        return (
                            <div key={r.id} className="reclamo-item">
                                <div
                                    className="reclamo-item-header"
                                    onClick={() => toggleAbierto(r.id)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => { if (e.key === 'Enter') toggleAbierto(r.id); }}
                                >
                                    <div>
                                        <div className="top" style={{ marginBottom: 0 }}>
                                            <strong>{r.titulo}</strong>
                                            <span className={`estado-pill ${info.clase}`}>
                                                {info.label}
                                            </span>
                                        </div>
                                        <div className="meta">
                                            {r.categoriaNombre} · {r.zonaNombre} · {formatearHace(r.fechaCreacion)}
                                        </div>
                                    </div>
                                    <Icon name="chevron" size={20} className={`chevron ${abierto ? 'abierto' : ''}`} />
                                </div>

                                {abierto && (
                                    <div className="reclamo-item-detalle">

                                        {r.descripcion && (
                                            <div className="fila">
                                                <span className="fila-label">Descripción</span>
                                                <span>{r.descripcion}</span>
                                            </div>
                                        )}
                                        {r.ubicacion && (
                                            <div className="fila">
                                                <span className="fila-label">Ubicación</span>
                                                <span>{r.ubicacion}</span>
                                                {parsearCoordenadas(r.ubicacion) && (
                                                    <div style={{ marginTop: '.5rem' }}>
                                                        <LocationPicker
                                                            position={parsearCoordenadas(r.ubicacion)}
                                                            setPosition={() => {}}
                                                            soloPinManual
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className="fila">
                                            <span className="fila-label">Reportado el</span>
                                            <span>{formatearFechaCompleta(r.fechaCreacion)}</span>
                                        </div>

                                        <div className="fila">
                                            <span className="fila-label">Historial de estados</span>
                                            {cargandoHistorial === r.id ? (
                                                <span>Cargando historial...</span>
                                            ) : (
                                                <div className="historial">
                                                    {(historiales[r.id] || []).map((h) => {
                                                        const infoH = ESTADO_INFO[h.estado] || { label: h.estado, clase: 'recibido' };
                                                        return (
                                                            <div key={h.id} className="historial-item">
                                                                <span className={`estado-pill ${infoH.clase}`}>
                                                                    {infoH.label}
                                                                </span>
                                                                <span className="fecha">{formatearFechaCompleta(h.fecha)}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MisReportes;
