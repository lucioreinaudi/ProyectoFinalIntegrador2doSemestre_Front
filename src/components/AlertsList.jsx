import React, { useState } from 'react';
import Icon from './Icon';

// Foto de referencia por tipo de alerta (cambiar una = reemplazar el archivo en public/img/alertas/)
const FOTO_REFERENCIA = {
    'cloud-rain': '/img/alertas/tormenta.jpg',
    wind: '/img/alertas/viento.jpg',
    zap: '/img/alertas/electricidad.jpg',
    tree: '/img/alertas/arbol.jpg',
};

const NIVEL_LABEL = { alto: 'Nivel alto', medio: 'Precaución', bajo: 'Informativo' };

const FotoAlerta = ({ alerta: a }) => {
    const [falla, setFalla] = useState(false);
    // Foto real subida por el municipio (sin tinte); si no hay, la de referencia con tinte del nivel.
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

const AlertsList = ({ alertas }) => {
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
            {alertas.map((a) => (
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

                        <button
                            className="btn btn-primary"
                            onClick={() => alert('Próximamente: Detalle de la alerta')}
                        >
                            Ver alerta completa <Icon name="arrow-right" size={16} />
                        </button>
                    </div>
                    <FotoAlerta alerta={a} />
                </div>
            ))}
        </div>
    );
};

export default AlertsList;