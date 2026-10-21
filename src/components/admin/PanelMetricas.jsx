import { useEffect, useState } from 'react';
import api from '../../api/client';
import { mensajeDeError } from '../../api/errores';

// "56 h" -> "2 días y 8 h". Menos de un dia se muestra en horas.
function formatearDuracion(horas) {
    if (horas == null) return 'Sin datos';
    if (horas < 1) return 'Menos de 1 h';
    if (horas < 24) return `${Math.round(horas)} h`;
    const dias = Math.floor(horas / 24);
    const resto = Math.round(horas - dias * 24);
    return `${dias} día${dias === 1 ? '' : 's'}${resto > 0 ? ` y ${resto} h` : ''}`;
}

// Numero grande con su etiqueta (para totales sueltos no hace falta un grafico).
const Tarjeta = ({ valor, etiqueta, detalle }) => (
    <div className="card-box metrica-tarjeta">
        <span className="metrica-valor">{valor}</span>
        <span className="metrica-etiqueta">{etiqueta}</span>
        {detalle && <span className="metrica-detalle">{detalle}</span>}
    </div>
);

// Barras horizontales de una sola serie: un solo color, sin leyenda (el titulo la
// nombra), y el numero escrito al lado de cada barra para no depender del largo.
// El title de cada fila da el detalle al pasar el mouse.
const Barras = ({ titulo, datos, total }) => {
    const maximo = Math.max(1, ...datos.map((d) => d.cantidad));
    return (
        <div className="card-box metrica-barras">
            <h3>{titulo}</h3>
            {datos.length === 0 ? (
                <p className="detalle-vacio">Todavía no hay datos.</p>
            ) : (
                <ul>
                    {datos.map((d) => {
                        const porcentaje = total > 0 ? Math.round((d.cantidad / total) * 100) : 0;
                        return (
                            <li key={d.clave} title={`${d.nombre}: ${d.cantidad} (${porcentaje}%)`}>
                                <span className="barra-nombre">{d.nombre}</span>
                                <span className="barra-pista" aria-hidden="true">
                                    <span className="barra-relleno" style={{ width: `${(d.cantidad / maximo) * 100}%` }} />
                                </span>
                                <span className="barra-valor">{d.cantidad}</span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

// Pestana Metricas (Q15): numeros reales calculados en el back (GET /api/admin/metricas).
const PanelMetricas = () => {
    const [recarga, setRecarga] = useState(0);
    const [resultado, setResultado] = useState({ clave: null, datos: null, error: null });
    const clave = String(recarga);
    const cargando = resultado.clave !== clave;

    useEffect(() => {
        let activo = true;
        api.get('/api/admin/metricas')
            .then((res) => { if (activo) setResultado({ clave, datos: res.data, error: null }); })
            .catch((err) => {
                if (activo) setResultado({ clave, datos: null, error: mensajeDeError(err, 'No se pudieron cargar las métricas') });
            });
        return () => { activo = false; };
    }, [clave]);

    const m = resultado.datos;
    const resueltos = m?.reclamosPorEstado.find((e) => e.clave === 'resuelto')?.cantidad ?? 0;

    return (
        <div>
            <div className="admin-seccion-head">
                <h2>Métricas</h2>
                <button type="button" className="btn btn-outline btn-chico" onClick={() => setRecarga((n) => n + 1)} disabled={cargando}>
                    {cargando ? 'Actualizando...' : 'Actualizar'}
                </button>
            </div>

            {resultado.error && !cargando && <div className="aviso error">{resultado.error}</div>}
            {!m && cargando && <p className="detalle-vacio">Calculando métricas...</p>}

            {m && (
                <div className={cargando ? 'cargando-suave' : ''}>
                    <div className="metricas-tarjetas">
                        <Tarjeta valor={m.totalReclamos} etiqueta="Reclamos recibidos" detalle={`${m.reclamosPublicados} publicados como alerta`} />
                        <Tarjeta valor={resueltos} etiqueta="Resueltos" detalle="según su estado actual" />
                        <Tarjeta valor={formatearDuracion(m.horasPromedioResolucion)} etiqueta="Tiempo promedio de resolución"
                            detalle={m.reclamosResueltosAlgunaVez > 0 ? `sobre ${m.reclamosResueltosAlgunaVez} reclamo${m.reclamosResueltosAlgunaVez === 1 ? '' : 's'} resuelto${m.reclamosResueltosAlgunaVez === 1 ? '' : 's'}` : 'todavía no se resolvió ninguno'} />
                        <Tarjeta valor={m.alertasActivas} etiqueta="Alertas activas" />
                        <Tarjeta valor={m.vecinosRegistrados} etiqueta="Vecinos registrados" />
                    </div>

                    <div className="metricas-graficos">
                        <Barras titulo="Reclamos por estado actual" datos={m.reclamosPorEstado} total={m.totalReclamos} />
                        <Barras titulo="Reclamos por categoría" datos={m.reclamosPorCategoria} total={m.totalReclamos} />
                        <Barras titulo="Reclamos por zona" datos={m.reclamosPorZona} total={m.totalReclamos} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PanelMetricas;
