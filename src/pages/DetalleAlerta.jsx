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
        <div className="page-wrap detalle-alerta-wrap">
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
                <article className={`detalle-alerta nivel-${a.nivel}`}>
                    {/* ENCABEZADO: estado, titulo y datos principales */}
                    <header className="detalle-alerta-head">
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
                                <span className="af-fecha"><Icon name="clock" size={15} /> {a.hora}</span>
                            </div>
                        </div>
                    </header>

                    {a.estado !== 'activa' && (
                        <div className="aviso info">Esta alerta ya finalizó: la información puede no estar vigente.</div>
                    )}

                    <div className="detalle-alerta-cuerpo">
                        {/* TEXTO: lo que paso y que hacer */}
                        <div className="detalle-alerta-texto">
                            <h2>Qué está pasando</h2>
                            <p className="detalle-alerta-desc">{a.desc}</p>

                            {a.recomendaciones && (
                                <div className="alerta-recomendaciones">
                                    <h2><Icon name="info" size={16} /> Recomendaciones</h2>
                                    <p>{a.recomendaciones}</p>
                                </div>
                            )}
                        </div>

                        {/* LATERAL: foto con proporcion fija (no se estira con el texto) y datos */}
                        <aside className="detalle-alerta-lateral">
                            <div className="detalle-alerta-foto">
                                <FotoAlerta alerta={a} />
                            </div>
                            <dl className="detalle-alerta-datos">
                                <div><dt>Zona</dt><dd>{a.zona}</dd></div>
                                <div><dt>Nivel</dt><dd>{NIVEL_LABEL[a.nivel]}</dd></div>
                                <div><dt>Emitida</dt><dd>{a.hora}</dd></div>
                                {a.cantidadReclamos > 0 && (
                                    <div>
                                        <dt>Reportes</dt>
                                        <dd>{a.cantidadReclamos} vecino{a.cantidadReclamos === 1 ? '' : 's'}</dd>
                                    </div>
                                )}
                            </dl>
                        </aside>
                    </div>
                </article>
            )}
        </div>
    );
};

export default DetalleAlerta;
