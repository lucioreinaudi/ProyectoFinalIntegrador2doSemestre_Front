import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { NIVEL_LABEL } from '../features/alertas/alertas';
import useTiposAlerta, { infoTipo } from '../features/alertas/tiposAlerta';


// Exportada para reutilizarla en el detalle de la alerta.
export const FotoAlerta = ({ alerta: a }) => {
    const [falla, setFalla] = useState(false);
    // Foto real de la alerta; si no hay, la imagen de referencia de su tipo
    // (la que cargo el municipio en Configuracion, o la incluida en el front).
    const tipo = infoTipo(a.tipo, useTiposAlerta());
    const src = a.imagenUrl || tipo.imagen;
    const esReferencia = !a.imagenUrl;

    if (!src || falla) {
        return (
            <div className={`af-photo nivel-${a.nivel}`}>
                <Icon name={tipo.icono} size={80} />
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
// "Mostrar menos" vuelve a la cantidad inicial de una.
const AlertsList = ({ alertas, cargando = false, error = false, cantidadInicial }) => {
    const [visibles, setVisibles] = useState(cantidadInicial ?? Infinity);
    const listaRef = useRef(null);

    const mostrarMenos = () => {
        setVisibles(cantidadInicial);
        // Si estaba mas abajo, la pagina se achica de golpe y quedaria en otra
        // seccion: se vuelve al principio de la lista de alertas.
        listaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

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
        <div ref={listaRef} className="alertas-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
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

            {(alertas.length > visibles || visibles > cantidadInicial) && (
                <div className="mostrar-mas">
                    {alertas.length > visibles && (
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => setVisibles((v) => v + cantidadInicial)}
                        >
                            Mostrar más (quedan {alertas.length - visibles})
                        </button>
                    )}
                    {visibles > cantidadInicial && (
                        <button type="button" className="btn btn-outline" onClick={mostrarMenos}>
                            Mostrar menos
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default AlertsList;