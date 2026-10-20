import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Icon from '../components/Icon';
import api from '../api/client';
import LocationPicker from '../components/LocationPicker';
import GaleriaFotos from '../components/GaleriaFotos';
import { selectUsuario } from '../features/auth/authSlice';
import { infoEstado } from '../features/reclamos/estados';

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

    // ?reclamo=<id> abre ese reclamo (lo usa la campanita de notificaciones).
    const [searchParams] = useSearchParams();
    const reclamoDeLaUrl = Number(searchParams.get('reclamo')) || null;

    // Id del reclamo abierto (solo uno a la vez). Si cambia el ?reclamo= de la URL
    // (otra notificacion estando ya en esta pagina), se abre ese: se ajusta el
    // estado durante el render, que es la forma que recomienda React para esto.
    const [abiertoId, setAbiertoId] = useState(reclamoDeLaUrl);
    const [reclamoUrlPrevio, setReclamoUrlPrevio] = useState(reclamoDeLaUrl);
    if (reclamoDeLaUrl !== reclamoUrlPrevio) {
        setReclamoUrlPrevio(reclamoDeLaUrl);
        setAbiertoId(reclamoDeLaUrl);
    }

    // Historial de cada reclamo que ya se pidio, para no volver a pedirlo.
    // Esta "cargando" mientras el abierto todavia no tiene su historial guardado.
    const [historiales, setHistoriales] = useState({});
    const cargandoHistorial = abiertoId !== null && !(abiertoId in historiales);

    useEffect(() => {
        if (!usuario) return;
        let activo = true;

        // Ya viene con el estado actual y "publicado" (SCRUM-80): un solo pedido,
        // en vez de uno extra por cada reclamo como antes.
        api.get('/api/reclamos/me')
            .then((res) => { if (activo) setReportes(res.data); })
            .catch(() => { if (activo) setError(true); })
            .finally(() => { if (activo) setCargando(false); });

        return () => { activo = false; };
    }, [usuario]);

    // El historial completo se pide recien al abrir un reclamo, no el de todos de entrada.
    useEffect(() => {
        if (abiertoId === null || abiertoId in historiales) return;
        let activo = true;
        api.get(`/api/estados-reclamo/reclamo/${abiertoId}`)
            .then((res) => { if (activo) setHistoriales((prev) => ({ ...prev, [abiertoId]: res.data })); })
            .catch(() => { if (activo) setHistoriales((prev) => ({ ...prev, [abiertoId]: [] })); });
        return () => { activo = false; };
    }, [abiertoId, historiales]);

    // Si se llego desde una notificacion, llevar la vista hasta ese reclamo.
    useEffect(() => {
        if (!cargando && reclamoDeLaUrl) {
            document.getElementById(`reclamo-${reclamoDeLaUrl}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [cargando, reclamoDeLaUrl]);

    const toggleAbierto = (id) => {
        setAbiertoId(abiertoId === id ? null : id);
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
                        const info = infoEstado(r.estadoActual);
                        const abierto = abiertoId === r.id;
                        const historial = historiales[r.id] || [];
                        // El motivo del rechazo es el comentario del ultimo estado (rechazado).
                        const motivoRechazo = r.estadoActual === 'rechazado' && historial.length > 0
                            ? historial[historial.length - 1].comentario
                            : null;
                        return (
                            <div key={r.id} id={`reclamo-${r.id}`} className="reclamo-item">
                                <div
                                    className="reclamo-item-header"
                                    onClick={() => toggleAbierto(r.id)}
                                    role="button"
                                    tabIndex={0}
                                    aria-expanded={abierto}
                                    onKeyDown={(e) => { if (e.key === 'Enter') toggleAbierto(r.id); }}
                                >
                                    <div>
                                        <div className="top" style={{ marginBottom: 0 }}>
                                            <strong>{r.titulo}</strong>
                                            <span className="reclamo-chips">
                                                {/* Q30: el vecino ve que su reclamo se hizo publico */}
                                                {r.publicado && <span className="chip publicado">Publicado</span>}
                                                <span className={`estado-pill ${info.clase}`}>{info.label}</span>
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

                                        {motivoRechazo && (
                                            <div className="aviso error" style={{ marginBottom: 0 }}>
                                                <strong>Motivo del rechazo:</strong> {motivoRechazo}
                                            </div>
                                        )}

                                        {r.publicado && (
                                            <div className="aviso ok" style={{ marginBottom: 0 }}>
                                                Tu reclamo fue publicado como alerta para informar a los vecinos de la zona.
                                            </div>
                                        )}

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
                                        {(r.fotos?.length > 0 || r.fotoUrl) && (
                                            <div className="fila">
                                                <span className="fila-label">Fotos</span>
                                                <GaleriaFotos fotos={r.fotos} fotoUrl={r.fotoUrl} titulo={r.titulo} />
                                            </div>
                                        )}
                                        <div className="fila">
                                            <span className="fila-label">Reportado el</span>
                                            <span>{formatearFechaCompleta(r.fechaCreacion)}</span>
                                        </div>

                                        <div className="fila">
                                            <span className="fila-label">Historial de estados</span>
                                            {cargandoHistorial ? (
                                                <span>Cargando historial...</span>
                                            ) : (
                                                <div className="historial">
                                                    {historial.map((h) => {
                                                        const infoH = infoEstado(h.estado);
                                                        return (
                                                            <div key={h.id} className="historial-item">
                                                                <div>
                                                                    <span className={`estado-pill ${infoH.clase}`}>
                                                                        {infoH.label}
                                                                    </span>
                                                                    {/* Lo que el municipio le dejo al vecino en cada cambio */}
                                                                    {h.comentario && <p className="historial-comentario">{h.comentario}</p>}
                                                                </div>
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
