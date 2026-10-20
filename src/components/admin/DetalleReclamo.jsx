import { useEffect, useState } from 'react';
import api from '../../api/client';
import { mensajeDeError } from '../../api/errores';
import { infoEstado, opcionesDeCambio } from '../../features/reclamos/estados';
import { formatearFechaHora } from '../../features/reclamos/formato';
import Icon from '../Icon';
import LocationPicker from '../LocationPicker';
import GaleriaFotos from '../GaleriaFotos';
import PublicarReclamo from './PublicarReclamo';

// Detalle de un reclamo en el panel (GET /api/admin/reclamos/{id}), en un modal,
// con las acciones del municipio: cambiar estado, reclasificar zona/categoria y
// publicar el reclamo como alerta (SCRUM-83).
const DetalleReclamo = ({ id, zonas, categorias, onCerrar, onCambio }) => {
    const [version, setVersion] = useState(0);
    const [resultado, setResultado] = useState({ clave: null, datos: null, error: null });
    const [aviso, setAviso] = useState(null); // { tipo: 'ok' | 'error', texto }
    const [alertasParaFinalizar, setAlertasParaFinalizar] = useState([]);
    const [finalizando, setFinalizando] = useState(false);
    const [publicando, setPublicando] = useState(false);

    const clave = `${id}-${version}`;
    const cargando = resultado.clave !== clave;

    useEffect(() => {
        let activo = true;
        api.get(`/api/admin/reclamos/${id}`)
            .then((res) => {
                if (activo) setResultado({ clave, datos: res.data, error: null });
            })
            .catch((err) => {
                if (activo) setResultado({ clave, datos: null, error: mensajeDeError(err, 'No se pudo cargar el reclamo') });
            });
        return () => { activo = false; };
    }, [clave, id]);

    // Escape cierra el modal.
    useEffect(() => {
        const alApretar = (e) => { if (e.key === 'Escape') onCerrar(); };
        window.addEventListener('keydown', alApretar);
        return () => window.removeEventListener('keydown', alApretar);
    }, [onCerrar]);

    const r = resultado.datos;

    // Despues de una accion: recargar el detalle y avisarle al listado.
    const recargar = (texto) => {
        setAviso({ tipo: 'ok', texto });
        setVersion((v) => v + 1);
        onCambio();
    };

    const alCambiarEstado = (destino) => {
        recargar('Estado actualizado. Se le envió una notificación al vecino.');
        // Al resolver, si tiene alertas activas vinculadas, se ofrece finalizarlas
        // (no es automatico: lo decide el municipio).
        if (destino === 'resuelto') {
            setAlertasParaFinalizar(r.alertas.filter((a) => a.estado === 'activa'));
        }
    };

    const finalizarAlertas = async () => {
        setFinalizando(true);
        try {
            await Promise.all(alertasParaFinalizar.map((a) =>
                api.patch(`/api/alertas/${a.id}/estado`, { estado: 'finalizada' })));
            setAlertasParaFinalizar([]);
            recargar('Alertas vinculadas finalizadas.');
        } catch (err) {
            setAviso({ tipo: 'error', texto: mensajeDeError(err, 'No se pudieron finalizar las alertas') });
        } finally {
            setFinalizando(false);
        }
    };

    return (
        <div className="modal-fondo" onClick={onCerrar}>
            <div className="card-box modal-caja" role="dialog" aria-modal="true" aria-labelledby="detalle-reclamo-titulo"
                onClick={(e) => e.stopPropagation()}>

                <div className="modal-head">
                    <div>
                        <h3 id="detalle-reclamo-titulo">{r ? r.titulo : 'Reclamo'}</h3>
                        {r && (
                            <div className="admin-reclamo-titulo">
                                <span className={`estado-pill ${infoEstado(r.estadoActual).clase}`}>{infoEstado(r.estadoActual).label}</span>
                                {r.publicado && <span className="chip publicado">Publicado</span>}
                                <span className="admin-reclamo-meta">Reportado el {formatearFechaHora(r.fechaCreacion)}</span>
                            </div>
                        )}
                    </div>
                    <button type="button" className="icon-btn" onClick={onCerrar} title="Cerrar" aria-label="Cerrar">
                        <Icon name="x" size={20} />
                    </button>
                </div>

                {aviso && <div className={`aviso ${aviso.tipo}`}>{aviso.texto}</div>}

                {alertasParaFinalizar.length > 0 && (
                    <div className="aviso info">
                        <p style={{ margin: '0 0 .5rem' }}>
                            Este reclamo tiene {alertasParaFinalizar.length} alerta{alertasParaFinalizar.length === 1 ? '' : 's'} activa{alertasParaFinalizar.length === 1 ? '' : 's'} vinculada{alertasParaFinalizar.length === 1 ? '' : 's'}
                            {' '}({alertasParaFinalizar.map((a) => a.titulo).join(', ')}). ¿Querés finalizarlas?
                        </p>
                        <div className="admin-reclamo-acciones">
                            <button type="button" className="btn btn-primary btn-chico" onClick={finalizarAlertas} disabled={finalizando}>
                                {finalizando ? 'Finalizando...' : 'Finalizar alertas'}
                            </button>
                            <button type="button" className="btn btn-outline btn-chico" onClick={() => setAlertasParaFinalizar([])} disabled={finalizando}>
                                Dejarlas activas
                            </button>
                        </div>
                    </div>
                )}

                {!r && cargando && <p className="detalle-vacio">Cargando...</p>}
                {!r && resultado.error && !cargando && <div className="aviso error">{resultado.error}</div>}

                {r && (
                    <div className="detalle-grid">
                        {/* COLUMNA IZQUIERDA: lo que reporto el vecino (no se edita, Q9) */}
                        <div>
                            <div className="detalle-bloque">
                                <h4>Descripción</h4>
                                <p className="detalle-texto">{r.descripcion || <span className="detalle-vacio">Sin descripción</span>}</p>
                            </div>

                            <div className="detalle-bloque">
                                <h4>Ubicación</h4>
                                {r.lat != null && r.lng != null ? (
                                    <LocationPicker position={{ lat: r.lat, lng: r.lng }} setPosition={() => {}} soloPinManual />
                                ) : (
                                    <p className="detalle-vacio">{r.ubicacion || 'Sin ubicación'}</p>
                                )}
                            </div>

                            <div className="detalle-bloque">
                                <h4>Fotos</h4>
                                {r.fotos?.length > 0 || r.fotoUrl
                                    ? <GaleriaFotos fotos={r.fotos} fotoUrl={r.fotoUrl} titulo={r.titulo} />
                                    : <p className="detalle-vacio">Sin fotos</p>}
                            </div>

                            {/* Datos de contacto: solo los ve el municipio, nunca son publicos (Q10) */}
                            <div className="detalle-bloque">
                                <h4>Vecino</h4>
                                <p className="detalle-texto">
                                    <strong>{[r.vecino.nombre, r.vecino.apellido].filter(Boolean).join(' ')}</strong><br />
                                    <a href={`mailto:${r.vecino.email}`}>{r.vecino.email}</a>
                                    {r.vecino.telefono && <><br /><a href={`tel:${r.vecino.telefono}`}>{r.vecino.telefono}</a></>}
                                </p>
                            </div>
                        </div>

                        {/* COLUMNA DERECHA: acciones e historial */}
                        <div>
                            <div className="detalle-bloque">
                                <h4>Cambiar estado</h4>
                                {/* key: al cambiar el estado se rearma el formulario con las opciones nuevas */}
                                <CambiarEstado
                                    key={`${r.estadoActual}-${r.historial.length}`}
                                    reclamo={r}
                                    onListo={alCambiarEstado}
                                />
                            </div>

                            <div className="detalle-bloque">
                                <h4>Zona y categoría</h4>
                                <Reclasificar
                                    key={`${r.zonaId}-${r.categoriaId}`}
                                    reclamo={r}
                                    zonas={zonas}
                                    categorias={categorias}
                                    onListo={() => recargar('Reclamo reclasificado.')}
                                />
                            </div>

                            <div className="detalle-bloque">
                                <h4>Publicar</h4>
                                {r.estadoActual === 'rechazado' ? (
                                    <p className="detalle-vacio">Un reclamo rechazado no se puede publicar.</p>
                                ) : publicando ? (
                                    <PublicarReclamo
                                        reclamo={r}
                                        zonas={zonas}
                                        onCancelar={() => setPublicando(false)}
                                        onPublicado={(texto) => { setPublicando(false); recargar(texto); }}
                                    />
                                ) : (
                                    <button type="button" className="btn btn-outline btn-chico" onClick={() => setPublicando(true)}>
                                        {r.publicado ? 'Publicar en otra alerta' : 'Publicar como alerta'}
                                    </button>
                                )}
                            </div>

                            <div className="detalle-bloque">
                                <h4>Alertas vinculadas</h4>
                                {r.alertas.length === 0 ? (
                                    <p className="detalle-vacio">No está publicado en ninguna alerta.</p>
                                ) : (
                                    <ul className="detalle-lista">
                                        {r.alertas.map((a) => (
                                            <li key={a.id}>
                                                <strong>{a.titulo}</strong>
                                                <span className={`chip nivel-${a.nivelGravedad}`}>{a.nivelGravedad}</span>
                                                <span className="admin-reclamo-meta">{a.estado} · vinculada el {formatearFechaHora(a.fechaVinculacion)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="detalle-bloque">
                                <h4>Historial</h4>
                                <ul className="detalle-lista">
                                    {[...r.historial].reverse().map((h) => (
                                        <li key={h.id}>
                                            <span className={`estado-pill ${infoEstado(h.estado).clase}`}>{infoEstado(h.estado).label}</span>
                                            <span className="admin-reclamo-meta">{formatearFechaHora(h.fecha)}</span>
                                            {h.comentario && <p className="detalle-comentario">{h.comentario}</p>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Formulario de cambio de estado: solo ofrece las transiciones validas.
const CambiarEstado = ({ reclamo, onListo }) => {
    const opciones = opcionesDeCambio(reclamo.estadoActual);
    const [destino, setDestino] = useState(opciones[0].valor);
    const [comentario, setComentario] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState(null);

    const opcion = opciones.find((o) => o.valor === destino);

    const enviar = async (e) => {
        e.preventDefault();
        setError(null);
        if (opcion.comentarioObligatorio && !comentario.trim()) {
            setError('Para esta acción el comentario es obligatorio.');
            return;
        }
        setEnviando(true);
        try {
            await api.post('/api/estados-reclamo', {
                reclamoId: reclamo.id,
                estado: destino,
                comentario: comentario.trim() || null,
            });
            onListo(destino);
        } catch (err) {
            setError(mensajeDeError(err, 'No se pudo cambiar el estado'));
            setEnviando(false);
        }
    };

    return (
        <form className="admin-form" onSubmit={enviar}>
            <select value={destino} onChange={(e) => setDestino(e.target.value)} aria-label="Nuevo estado">
                {opciones.map((o) => <option key={o.valor} value={o.valor}>{o.label}</option>)}
            </select>
            <textarea
                rows="3"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                aria-label="Comentario para el vecino"
                placeholder={opcion.comentarioObligatorio
                    ? (destino === 'rechazado' ? 'Motivo del rechazo (obligatorio, lo ve el vecino)' : 'Comentario (obligatorio, lo ve el vecino)')
                    : 'Comentario (opcional, lo ve el vecino)'}
            />
            {error && <div className="aviso error">{error}</div>}
            <button type="submit" className="btn btn-primary btn-chico" disabled={enviando}>
                {enviando ? 'Guardando...' : 'Guardar'}
            </button>
        </form>
    );
};

// Reclasificar zona y/o categoria. Solo se ofrecen las activas (Q29); la actual
// se muestra aunque este dada de baja, para que el selector no quede vacio.
const Reclasificar = ({ reclamo, zonas, categorias, onListo }) => {
    const [zonaId, setZonaId] = useState(String(reclamo.zonaId));
    const [categoriaId, setCategoriaId] = useState(String(reclamo.categoriaId));
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState(null);

    const opcionesDe = (lista, idActual) => lista.filter((x) => x.activa !== false || String(x.id) === String(idActual));
    const cambioZona = zonaId !== String(reclamo.zonaId);
    const cambioCategoria = categoriaId !== String(reclamo.categoriaId);

    const enviar = async (e) => {
        e.preventDefault();
        setError(null);
        const cuerpo = {};
        if (cambioZona) cuerpo.zonaId = Number(zonaId);
        if (cambioCategoria) cuerpo.categoriaId = Number(categoriaId);
        setEnviando(true);
        try {
            await api.patch(`/api/admin/reclamos/${reclamo.id}`, cuerpo);
            onListo();
        } catch (err) {
            setError(mensajeDeError(err, 'No se pudo reclasificar'));
            setEnviando(false);
        }
    };

    const etiqueta = (x) => (x.activa === false ? `${x.nombre} (dada de baja)` : x.nombre);

    return (
        <form className="admin-form" onSubmit={enviar}>
            <select value={zonaId} onChange={(e) => setZonaId(e.target.value)} aria-label="Zona">
                {opcionesDe(zonas, reclamo.zonaId).map((z) => <option key={z.id} value={z.id}>{etiqueta(z)}</option>)}
            </select>
            <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} aria-label="Categoría">
                {opcionesDe(categorias, reclamo.categoriaId).map((c) => <option key={c.id} value={c.id}>{etiqueta(c)}</option>)}
            </select>
            {error && <div className="aviso error">{error}</div>}
            <button type="submit" className="btn btn-outline btn-chico" disabled={enviando || (!cambioZona && !cambioCategoria)}>
                {enviando ? 'Guardando...' : 'Reclasificar'}
            </button>
        </form>
    );
};

export default DetalleReclamo;
