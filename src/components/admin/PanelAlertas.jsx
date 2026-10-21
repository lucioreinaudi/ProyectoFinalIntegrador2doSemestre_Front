import { useEffect, useState } from 'react';
import api from '../../api/client';
import { mensajeDeError } from '../../api/errores';
import { ALERTA_VACIA, NIVELES, alertaAFormulario, formularioABody, labelTipo } from '../../features/alertas/alertas';
import { formatearFechaHora } from '../../features/reclamos/formato';
import Icon from '../Icon';
import FormAlerta from './FormAlerta';
import Modal from './Modal';

// Pestana Alertas del panel: todas las alertas (activas y finalizadas), con
// alta, edicion, finalizar/reactivar y eliminar (seccion 6 de la especificacion).
// Las alertas son pocas, asi que se traen todas y los filtros son locales.
const PanelAlertas = () => {
    const [recarga, setRecarga] = useState(0);
    const [resultado, setResultado] = useState({ clave: null, datos: null, error: null });
    const [zonas, setZonas] = useState([]);

    const [filtroEstado, setFiltroEstado] = useState('activa');
    const [filtroZona, setFiltroZona] = useState('');
    const [filtroNivel, setFiltroNivel] = useState('');

    const [modal, setModal] = useState(null); // null | { tipo: 'nueva' } | { tipo: 'editar', alerta }
    const [aviso, setAviso] = useState(null); // { tipo: 'ok' | 'error', texto }
    const [confirmarEliminar, setConfirmarEliminar] = useState(null); // id de la alerta
    const [ocupadoId, setOcupadoId] = useState(null); // alerta con una accion en curso

    const clave = String(recarga);
    const cargando = resultado.clave !== clave;

    useEffect(() => {
        let activo = true;
        api.get('/api/admin/zonas') // incluye dadas de baja (filtros y alertas viejas)
            .then((res) => { if (activo) setZonas(res.data); })
            .catch(() => { /* sin zonas, el formulario no deja guardar */ });
        return () => { activo = false; };
    }, []);

    useEffect(() => {
        let activo = true;
        api.get('/api/alertas')
            .then((res) => { if (activo) setResultado({ clave, datos: res.data, error: null }); })
            .catch((err) => {
                if (activo) setResultado({ clave, datos: null, error: mensajeDeError(err, 'No se pudieron cargar las alertas') });
            });
        return () => { activo = false; };
    }, [clave]);

    const recargar = (texto) => {
        setAviso(texto ? { tipo: 'ok', texto } : null);
        setRecarga((n) => n + 1);
    };

    const crear = async (datos) => {
        await api.post('/api/alertas', formularioABody(datos));
        setModal(null);
        recargar('Alerta emitida.');
    };

    const editar = async (id, datos) => {
        await api.put(`/api/alertas/${id}`, formularioABody(datos));
        setModal(null);
        recargar('Alerta actualizada.');
    };

    const cambiarEstado = async (alerta) => {
        const nuevo = alerta.estado === 'activa' ? 'finalizada' : 'activa';
        setOcupadoId(alerta.id);
        try {
            await api.patch(`/api/alertas/${alerta.id}/estado`, { estado: nuevo });
            recargar(nuevo === 'finalizada' ? 'Alerta finalizada: ya no se muestra en el Home.' : 'Alerta reactivada.');
        } catch (err) {
            setAviso({ tipo: 'error', texto: mensajeDeError(err, 'No se pudo cambiar el estado') });
        } finally {
            setOcupadoId(null);
        }
    };

    const eliminar = async (id) => {
        setOcupadoId(id);
        try {
            await api.delete(`/api/alertas/${id}`);
            setConfirmarEliminar(null);
            recargar('Alerta eliminada.');
        } catch (err) {
            // 409 si tiene reclamos vinculados: el back explica que hay que finalizarla.
            setConfirmarEliminar(null);
            setAviso({ tipo: 'error', texto: mensajeDeError(err, 'No se pudo eliminar la alerta') });
        } finally {
            setOcupadoId(null);
        }
    };

    const alertas = (resultado.datos || []).filter((a) =>
        (!filtroEstado || a.estado === filtroEstado) &&
        (!filtroZona || String(a.zonaId) === filtroZona) &&
        (!filtroNivel || a.nivelGravedad === filtroNivel));

    return (
        <div>
            <div className="admin-seccion-head">
                <h2>Alertas</h2>
                <button type="button" className="btn btn-primary btn-chico" onClick={() => setModal({ tipo: 'nueva' })}>
                    <Icon name="plus" size={16} /> Nueva alerta
                </button>
            </div>

            <div className="admin-filtros" role="group" aria-label="Filtrar alertas">
                <label>
                    Estado
                    <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                        <option value="activa">Activas</option>
                        <option value="finalizada">Finalizadas</option>
                        <option value="">Todas</option>
                    </select>
                </label>
                <label>
                    Zona
                    <select value={filtroZona} onChange={(e) => setFiltroZona(e.target.value)}>
                        <option value="">Todas</option>
                        {zonas.map((z) => (
                            <option key={z.id} value={z.id}>{z.activa === false ? `${z.nombre} (dada de baja)` : z.nombre}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Nivel
                    <select value={filtroNivel} onChange={(e) => setFiltroNivel(e.target.value)}>
                        <option value="">Todos</option>
                        {NIVELES.map((n) => <option key={n.valor} value={n.valor}>{n.label}</option>)}
                    </select>
                </label>
            </div>

            {aviso && <div className={`aviso ${aviso.tipo}`}>{aviso.texto}</div>}
            {resultado.error && !cargando && <div className="aviso error">{resultado.error}</div>}
            {!resultado.datos && cargando && <p className="detalle-vacio">Cargando alertas...</p>}

            {resultado.datos && alertas.length === 0 && (
                <div className="empty-state"><p>No hay alertas con esos filtros.</p></div>
            )}

            {alertas.length > 0 && (
                <div className={`admin-lista ${cargando ? 'cargando' : ''}`} aria-busy={cargando}>
                    {alertas.map((a) => (
                        <div key={a.id} className={`card-box admin-reclamo ${a.estado === 'finalizada' ? 'finalizada' : ''}`}>
                            <div>
                                <div className="admin-reclamo-titulo">
                                    <strong>{a.titulo}</strong>
                                    <span className={`chip nivel-${a.nivelGravedad}`}>Nivel {a.nivelGravedad}</span>
                                    <span className="chip zona">{a.zonaNombre}</span>
                                </div>
                                <span className="admin-reclamo-meta">
                                    {formatearFechaHora(a.fechaEmision)} · {labelTipo(a.tipo)} · Origen:{' '}
                                    {a.cantidadReclamos > 0 ? `Desde reclamos (${a.cantidadReclamos})` : 'Municipio'}
                                </span>
                            </div>
                            <div className="admin-reclamo-acciones">
                                <span className={`estado-alerta ${a.estado}`}>{a.estado === 'activa' ? 'Activa' : 'Finalizada'}</span>
                                {confirmarEliminar === a.id ? (
                                    <>
                                        <span className="admin-reclamo-meta">¿Eliminarla?</span>
                                        <button type="button" className="btn btn-peligro btn-chico" disabled={ocupadoId === a.id}
                                            onClick={() => eliminar(a.id)}>Sí, eliminar</button>
                                        <button type="button" className="btn btn-outline btn-chico" disabled={ocupadoId === a.id}
                                            onClick={() => setConfirmarEliminar(null)}>No</button>
                                    </>
                                ) : (
                                    <>
                                        <button type="button" className="btn btn-outline btn-chico"
                                            onClick={() => setModal({ tipo: 'editar', alerta: a })}>Editar</button>
                                        <button type="button" className="btn btn-outline btn-chico" disabled={ocupadoId === a.id}
                                            onClick={() => cambiarEstado(a)}>
                                            {a.estado === 'activa' ? 'Finalizar' : 'Reactivar'}
                                        </button>
                                        {/* Solo para alertas creadas por error: con reclamos vinculados el back responde 409 */}
                                        <button type="button" className="link-btn texto-peligro"
                                            onClick={() => setConfirmarEliminar(a.id)}>Eliminar</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modal?.tipo === 'nueva' && (
                <Modal titulo="Nueva alerta" onCerrar={() => setModal(null)}>
                    <FormAlerta inicial={ALERTA_VACIA} zonas={zonas} textoBoton="Emitir alerta"
                        onGuardar={crear} onCancelar={() => setModal(null)} />
                </Modal>
            )}

            {modal?.tipo === 'editar' && (
                <Modal titulo="Editar alerta" onCerrar={() => setModal(null)}>
                    <FormAlerta inicial={alertaAFormulario(modal.alerta)} zonas={zonas} textoBoton="Guardar cambios"
                        onGuardar={(datos) => editar(modal.alerta.id, datos)} onCancelar={() => setModal(null)} />
                </Modal>
            )}
        </div>
    );
};

export default PanelAlertas;
