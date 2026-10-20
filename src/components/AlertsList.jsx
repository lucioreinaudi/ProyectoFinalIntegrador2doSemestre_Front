import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { NIVEL_LABEL } from '../features/alertas/alertas';

// Foto de referencia por tipo de alerta (cambiar una = reemplazar el archivo en public/img/alertas/)
const FOTO_REFERENCIA = {
    'cloud-rain': '/img/alertas/tormenta.jpg',
    wind: '/img/alertas/viento.jpg',
    zap: '/img/alertas/electricidad.jpg',
    tree: '/img/alertas/arbol.jpg',
};


// Exportada para reutilizarla en el detalle de la alerta.
export const FotoAlerta = ({ alerta: a }) => {
    const [falla, setFalla] = useState(false);
    // Foto real subida por el municipio; si no hay, la de referencia por tipo.
    const src = a.imagenUrl || FOTO_REFERENCIA[a.foto];
    const esReferencia = !a.imagenUrl;

    if (!src || falla) {
        return (
            <div className={`af-photo nivel-${a.nivel}`}>
                <Icon name={a.foto || 'alert-triangle'} size={80} />
                <span className="cap">Imagen ilustrativa</span>
            </div>
        );
    }
    return (
        <div className={`af-photo con-foto nivel-${a.nivel}`}>
            <img src={src} alt={esReferencia ? '' : a.titulo} loading="lazy" onError={() => setFalla(true)} />
            <span className="cap">{esReferencia ? 'Imagen de referencia' : 'Foto de la zona'}</span>
        </div>
    );
};

// cantidadInicial: cuantas mostrar de entrada (sin ella, se muestran todas).
// "Mostrar mas" suma esa misma cantidad cada vez, para que la pagina no se haga
// larguisima si hay muchas alertas activas. Quien la usa le pasa un key que
// cambia con los filtros, asi al filtrar vuelve a la cantidad inicial.
const AlertsList = ({ alertas, cargando = false, error = false, cantidadInicial }) => {
    const [visibles, setVisibles] = useState(cantidadInicial ?? Infinity);

    if (cargando) {
        return <p style={{ color: 'var(--texto-3)' }}>Cargando alertas...</p>;
    }
    if (error) {
        return (
            <div className="empty-state">
                <Icon name="alert-triangle" size={40} />
                <p>No se pudieron cargar las alertas. Intentá de nuevo más tarde.</p>
            </div>
        );
    }

    // Si no hay alertas para el filtro, mostramos que está todo bien
    if (!alertas || alertas.length === 0) {
        return (
            <div className="empty-state">
                <Icon name="check" size={40} />
                <p>No hay alertas activas en esta zona.</p>
            </div>
        );
    }

    return (
        <div className="alertas-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {alertas.slice(0, visibles).map((a) => (
                <div className={`alert-feature nivel-${a.nivel}`} key={a.id}>
                    <div>
                        <div className="af-head">
                            <span className={`af-icon nivel-${a.nivel}`}>
                                <Icon name="alert-triangle" size={22} />
                            </span>
                            <div>
                                <span className="chip estado-activa">ALERTA ACTIVA</span>
                                <h3>{a.titulo}</h3>
                                <div className="af-meta">
                                    <span className="chip zona"><Icon name="map" size={12} /> {a.zona}</span>
                                    <span className={`chip nivel-${a.nivel}`}>{NIVEL_LABEL[a.nivel]}</span>
                                </div>
                                <div className="af-fecha"><Icon name="clock" size={15} /> {a.hora}</div>
                            </div>
                        </div>
                        <p className="af-desc">{a.desc}</p>

                        <Link to={`/alertas/${a.id}`} className="btn btn-primary">
                            Ver alerta completa <Icon name="arrow-right" size={16} />
                        </Link>
                    </div>
                    <FotoAlerta alerta={a} />
                </div>
            ))}

            {alertas.length > visibles && (
                <button
                    type="button"
                    className="btn btn-outline mostrar-mas"
                    onClick={() => setVisibles((v) => v + cantidadInicial)}
                >
                    Mostrar más (quedan {alertas.length - visibles})
                </button>
            )}
        </div>
    );
};

export default AlertsList;