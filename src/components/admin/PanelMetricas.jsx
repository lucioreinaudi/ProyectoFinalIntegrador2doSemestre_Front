import { useEffect, useState } from 'react';
import api from '../../api/client';
import { mensajeDeError } from '../../api/errores';
import { infoEstado } from '../../features/reclamos/estados';
import Icon from '../Icon';

// "56 h" -> "2 días y 8 h". Menos de un dia se muestra en horas.
function formatearDuracion(horas) {
    if (horas == null) return 'Sin datos';
    if (horas < 1) return 'Menos de 1 h';
    if (horas < 24) return `${Math.round(horas)} h`;
    const dias = Math.floor(horas / 24);
    const resto = Math.round(horas - dias * 24);
    return `${dias} día${dias === 1 ? '' : 's'}${resto > 0 ? ` y ${resto} h` : ''}`;
}

function plural(n, singular, pluralTexto) {
    return `${n} ${n === 1 ? singular : pluralTexto}`;
}

// Numero grande con su etiqueta, con el mismo formato que las tarjetas de acceso
// rapido del Home (.quick-card): cuadradito con icono arriba, texto abajo.
// tono: color del icono (info | bajo | medio | alto); destacada: fondo de marca.
const Tarjeta = ({ icono, tono = 'info', valor, etiqueta, detalle, destacada = false }) => (
    <div className={`metrica-tarjeta tono-${tono} ${destacada ? 'destacada' : ''}`}>
        <span className="metrica-icono"><Icon name={icono} size={20} /></span>
        <span className="metrica-valor">{valor}</span>
        <span className="metrica-etiqueta">{etiqueta}</span>
        {detalle && <span className="metrica-detalle">{detalle}</span>}
    </div>
);

// Barras horizontales de una sola serie: un solo color, sin leyenda (el titulo la
// nombra), y el numero escrito al lado de cada barra para no depender del largo.
// renderNombre permite mostrar la etiqueta con otro formato (ej. la pildora del estado).
const Barras = ({ icono, titulo, subtitulo, datos, total, renderNombre }) => {
    const maximo = Math.max(1, ...datos.map((d) => d.cantidad));
    return (
        <section className="card-box metrica-grafico">
            <div className="section-head-title-row metrica-grafico-head">
                <span className="section-head-icon" style={{ background: 'var(--info-bg)', color: 'var(--brand-1)' }}>
                    <Icon name={icono} size={18} />
                </span>
                <div>
                    <h3>{titulo}</h3>
                    {subtitulo && <p>{subtitulo}</p>}
                </div>
            </div>

            {datos.length === 0 ? (
                <p className="detalle-vacio">Todavía no hay datos.</p>
            ) : (
                <ul className="metrica-barras">
                    {datos.map((d) => {
                        const porcentaje = total > 0 ? Math.round((d.cantidad / total) * 100) : 0;
                        return (
                            <li key={d.clave} title={`${d.nombre}: ${d.cantidad} (${porcentaje}%)`} className={d.cantidad === 0 ? 'vacia' : ''}>
                                <span className="barra-nombre">{renderNombre ? renderNombre(d) : d.nombre}</span>
                                <span className="barra-pista" aria-hidden="true">
                                    <span className="barra-relleno" style={{ width: `${(d.cantidad / maximo) * 100}%` }} />
                                </span>
                                <span className="barra-valor">
                                    {d.cantidad}
                                    <small>{porcentaje}%</small>
                                </span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
};

// Pestana Metricas (Q15): numeros reales calculados en el back (GET /api/admin/metricas).
const PanelMetricas = () => {
    const [recarga, setRecarga] = useState(0);
    const [resultado, setResultado] = useState({ clave: null, datos: null, error: null, hora: null });
    const clave = String(recarga);
    const cargando = resultado.clave !== clave;

    useEffect(() => {
        let activo = true;
        api.get('/api/admin/metricas')
            .then((res) => {
                if (activo) setResultado({ clave, datos: res.data, error: null, hora: new Date() });
            })
            .catch((err) => {
                if (activo) setResultado({ clave, datos: null, error: mensajeDeError(err, 'No se pudieron cargar las métricas'), hora: null });
            });
        return () => { activo = false; };
    }, [clave]);

    const m = resultado.datos;
    const resueltos = m?.reclamosPorEstado.find((e) => e.clave === 'resuelto')?.cantidad ?? 0;
    const pendientes = m ? m.reclamosPorEstado
        .filter((e) => ['recibido', 'en revision', 'en proceso'].includes(e.clave))
        .reduce((suma, e) => suma + e.cantidad, 0) : 0;

    return (
        <div className="metricas">
            <div className="admin-seccion-head">
                <div>
                    <h2>Métricas</h2>
                    {resultado.hora && (
                        <span className="admin-total">
                            Actualizado a las {resultado.hora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                </div>
                <button type="button" className="btn btn-outline btn-chico" onClick={() => setRecarga((n) => n + 1)} disabled={cargando}>
                    <Icon name="clock" size={16} /> {cargando ? 'Actualizando...' : 'Actualizar'}
                </button>
            </div>

            {resultado.error && !cargando && <div className="aviso error">{resultado.error}</div>}
            {!m && cargando && <p className="detalle-vacio">Calculando métricas...</p>}

            {m && (
                <div className={cargando ? 'cargando-suave' : ''}>
                    <div className="metricas-tarjetas">
                        <Tarjeta destacada icono="list" valor={m.totalReclamos} etiqueta="Reclamos recibidos"
                            detalle={`${plural(pendientes, 'pendiente', 'pendientes')} · ${plural(m.reclamosPublicados, 'publicado', 'publicados')}`} />
                        <Tarjeta icono="check" tono="bajo" valor={resueltos} etiqueta="Resueltos"
                            detalle={m.totalReclamos > 0 ? `${Math.round((resueltos / m.totalReclamos) * 100)}% del total` : 'según su estado actual'} />
                        <Tarjeta icono="clock" tono="medio" valor={formatearDuracion(m.horasPromedioResolucion)} etiqueta="Tiempo promedio de resolución"
                            detalle={m.reclamosResueltosAlgunaVez > 0
                                ? `sobre ${plural(m.reclamosResueltosAlgunaVez, 'reclamo resuelto', 'reclamos resueltos')}`
                                : 'todavía no se resolvió ninguno'} />
                        <Tarjeta icono="alert-triangle" tono="alto" valor={m.alertasActivas} etiqueta="Alertas activas" detalle="visibles en el Home" />
                        <Tarjeta icono="user" valor={m.vecinosRegistrados} etiqueta="Vecinos registrados" />
                    </div>

                    <div className="metricas-graficos">
                        <Barras icono="filter" titulo="Por estado" subtitulo="Estado actual de cada reclamo"
                            datos={m.reclamosPorEstado} total={m.totalReclamos}
                            renderNombre={(d) => <span className={`estado-pill ${infoEstado(d.clave).clase}`}>{d.nombre}</span>} />
                        <Barras icono="list" titulo="Por categoría" subtitulo="De la más reportada a la menos"
                            datos={m.reclamosPorCategoria} total={m.totalReclamos} />
                        <Barras icono="map" titulo="Por zona" subtitulo="Dónde se reporta más"
                            datos={m.reclamosPorZona} total={m.totalReclamos} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PanelMetricas;
