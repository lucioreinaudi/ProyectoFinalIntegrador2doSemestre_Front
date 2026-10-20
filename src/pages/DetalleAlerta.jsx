import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client';
import Icon from '../components/Icon';
import { FotoAlerta } from '../components/AlertsList';
import { NIVEL_LABEL, alertaParaVista } from '../features/alertas/alertas';

// Detalle publico de una alerta (GET /api/alertas/{id}, se ve sin login).
// Campos de Q27: titulo, zona, nivel, fecha, descripcion, recomendaciones, foto y
// "Reportado por N vecinos" (solo el contador, nunca nombres ni datos).
const DetalleAlerta = () => {
    const { id } = useParams();
    const [resultado, setResultado] = useState({ id: null, alerta: null, error: false });
    const cargando = resultado.id !== id;

    useEffect(() => {
        let activo = true;
        api.get(`/api/alertas/${id}`)
            .then((res) => { if (activo) setResultado({ id, alerta: alertaParaVista(res.data), error: false }); })
            .catch(() => { if (activo) setResultado({ id, alerta: null, error: true }); });
        return () => { activo = false; };
    }, [id]);

    const a = resultado.alerta;

    return (
        <div className="page-wrap">
            <Link to="/alertas" className="link-btn volver">
                <Icon name="left" size={16} /> Todas las alertas
            </Link>

            {cargando && <p style={{ color: 'var(--texto-3)' }}>Cargando alerta...</p>}

            {!cargando && resultado.error && (
                <div className="empty-state">
                    <Icon name="alert-triangle" size={40} />
                    <p>No encontramos esa alerta.</p>
                </div>
            )}

            {!cargando && a && (
                <article className={`alert-feature nivel-${a.nivel} alerta-detalle`}>
                    <div>
                        <div className="af-head">
                            <span className={`af-icon nivel-${a.nivel}`}>
                                <Icon name="alert-triangle" size={22} />
                            </span>
                            <div>
                                {a.estado === 'activa'
                                    ? <span className="chip estado-activa">ALERTA ACTIVA</span>
                                    : <span className="chip">ALERTA FINALIZADA</span>}
                                <h1 className="alerta-detalle-titulo">{a.titulo}</h1>
                                <div className="af-meta">
                                    <span className="chip zona"><Icon name="map" size={12} /> {a.zona}</span>
                                    <span className={`chip nivel-${a.nivel}`}>{NIVEL_LABEL[a.nivel]}</span>
                                </div>
                                <div className="af-fecha"><Icon name="clock" size={15} /> {a.hora}</div>
                            </div>
                        </div>

                        <p className="af-desc">{a.desc}</p>

                        {a.recomendaciones && (
                            <div className="alerta-recomendaciones">
                                <h2>Recomendaciones</h2>
                                <p>{a.recomendaciones}</p>
                            </div>
                        )}

                        {a.cantidadReclamos > 0 && (
                            <p className="alerta-reportes">
                                <Icon name="user" size={15} /> Reportado por {a.cantidadReclamos} vecino{a.cantidadReclamos === 1 ? '' : 's'}
                            </p>
                        )}
                    </div>
                    <FotoAlerta alerta={a} />
                </article>
            )}
        </div>
    );
};

export default DetalleAlerta;
