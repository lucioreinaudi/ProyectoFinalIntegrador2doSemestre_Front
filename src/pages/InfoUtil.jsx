import React from 'react';
import Icon from '../components/Icon';

const INFO_UTIL = [
    { id: 1, icono: 'book', tit: 'Guía ante inundaciones', sub: 'Qué hacer antes, durante y después de una alerta hídrica' },
    { id: 2, icono: 'clock', tit: 'Horarios de atención municipal', sub: 'Defensa Civil y mesa de entradas' },
    { id: 3, icono: 'info', tit: 'Preguntas frecuentes', sub: 'Cómo funciona Conectar Laboulaye' },
];

const InfoUtil = () => {
    return (
        <div className="page-wrap">
            <h1 className="page-title">Información útil</h1>
            <div className="info-list">
                {INFO_UTIL.map((info) => (
                    <div key={info.id} className="info-item">
                        <span className="ii"><Icon name={info.icono} size={18} /></span>
                        <div>
                            <strong>{info.tit}</strong>
                            <span>{info.sub}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InfoUtil;