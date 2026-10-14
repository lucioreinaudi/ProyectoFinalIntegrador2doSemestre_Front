import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Icon from '../components/Icon';
import api from '../api/client';
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

const MisReportes = () => {
    const usuario = useSelector(selectUsuario);
    const [reportes, setReportes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);

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
                        return (
                            <div key={r.id} className="reclamo-item">
                                <div className="top">
                                    <strong>{r.categoriaNombre}</strong>
                                    <span className={`estado-pill ${info.clase}`}>
                                        {info.label}
                                    </span>
                                </div>
                                <div className="meta">
                                    {r.zonaNombre} · {formatearHace(r.fechaCreacion)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MisReportes;
