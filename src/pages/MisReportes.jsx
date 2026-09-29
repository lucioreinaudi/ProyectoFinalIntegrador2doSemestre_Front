import React from 'react';
import Icon from '../components/Icon';

const ESTADO_LABEL = {
    recibido: 'Recibido',
    proceso: 'En proceso',
    resuelto: 'Resuelto'
};

const MIS_REPORTES = [
    { id: 1, tipo: 'Calle anegada', zona: 'Zona Norte', hace: 'hace 2 días', estado: 'proceso' },
    { id: 2, tipo: 'Árbol caído', zona: 'Zona Sur', hace: 'hace 5 días', estado: 'resuelto' },
    { id: 3, tipo: 'Corte de luz', zona: 'Zona Centro', hace: 'hace 1 día', estado: 'recibido' },
];

const MisReportes = () => {
    return (
        <div className="page-wrap">
            <h1 className="page-title">Mis reportes</h1>

            {MIS_REPORTES.length === 0 ? (
                <div className="empty-state">
                    <Icon name="list" size={40} />
                    <p>Todavía no hiciste ningún reporte.</p>
                </div>
            ) : (
                <div id="lista-reclamos">
                    {MIS_REPORTES.map((r) => (
                        <div key={r.id} className="reclamo-item">
                            <div className="top">
                                <strong>{r.tipo}</strong>
                                <span className={`estado-pill ${r.estado}`}>
                                    {ESTADO_LABEL[r.estado]}
                                </span>
                            </div>
                            <div className="meta">
                                {r.zona} · {r.hace}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MisReportes;