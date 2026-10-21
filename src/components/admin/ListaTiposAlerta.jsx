import { useEffect, useState } from 'react';
import api from '../../api/client';
import { mensajeDeError } from '../../api/errores';
import { subirImagenTipoAlerta } from '../../features/alertas/imagen';
import { ICONOS, invalidarTiposAlerta } from '../../features/alertas/tiposAlerta';
import Icon from '../Icon';
import Modal from './Modal';
import SelectorImagenAlerta from './SelectorImagenAlerta';

// ABM de tipos de alerta (Configuracion, SCRUM-94): nombre, icono e imagen de
// referencia (la que se ve en el Home cuando una alerta no tiene foto propia).
// No hay borrado fisico: las alertas apuntan al tipo. Dar de baja = deja de
// ofrecerse al crear alertas; las que ya lo usan no cambian.
const ListaTiposAlerta = () => {
    const [recarga, setRecarga] = useState(0);
    const [resultado, setResultado] = useState({ clave: null, datos: null, error: null });
    const clave = String(recarga);
    const cargando = resultado.clave !== clave;

    const [aviso, setAviso] = useState(null); // { tipo: 'ok' | 'error', texto }
    const [modal, setModal] = useState(null); // null | { tipo: 'nuevo' } | { tipo: 'editar', item }
    const [ocupadoId, setOcupadoId] = useState(null);

    useEffect(() => {
        let activo = true;
        api.get('/api/tipos-alerta')
            .then((res) => { if (activo) setResultado({ clave, datos: res.data, error: null }); })
            .catch((err) => {
                if (activo) setResultado({ clave, datos: null, error: mensajeDeError(err, 'No se pudieron cargar los tipos de alerta') });
            });
        return () => { activo = false; };
    }, [clave]);

    const recargar = (texto) => {
        invalidarTiposAlerta(); // que el Home y los formularios vean el cambio
        setAviso({ tipo: 'ok', texto });
        setRecarga((n) => n + 1);
    };

    const guardar = async (datos) => {
        const cuerpo = { nombre: datos.nombre.trim(), icono: datos.icono, imagenUrl: datos.imagenUrl || null };
        if (modal.tipo === 'nuevo') {
            await api.post('/api/tipos-alerta', cuerpo);
            setModal(null);
            recargar('Tipo de alerta creado.');
        } else {
            await api.put(`/api/tipos-alerta/${modal.item.id}`, cuerpo);
            setModal(null);
            recargar('Tipo de alerta actualizado.');
        }
    };

    const cambiarActiva = async (item) => {
        setOcupadoId(item.id);
        setAviso(null);
        try {
            await api.patch(`/api/tipos-alerta/${item.id}/activa`, { activa: !item.activa });
            recargar(item.activa ? 'Tipo dado de baja: ya no se ofrece al crear alertas.' : 'Tipo reactivado.');
        } catch (err) {
            setAviso({ tipo: 'error', texto: mensajeDeError(err, 'No se pudo cambiar el estado') });
        } finally {
            setOcupadoId(null);
        }
    };

    const datos = resultado.datos || [];

    return (
        <div className="catalogo">
            <div className="admin-seccion-head">
                <h2>Tipos de alerta</h2>
                <button type="button" className="btn btn-primary btn-chico" onClick={() => setModal({ tipo: 'nuevo' })}>
                    <Icon name="plus" size={16} /> Nuevo tipo
                </button>
            </div>
            <p className="admin-ayuda">
                La imagen de cada tipo es la que se muestra en el Home cuando una alerta no tiene foto propia.
            </p>

            {aviso && <div className={`aviso ${aviso.tipo}`}>{aviso.texto}</div>}
            {resultado.error && !cargando && <div className="aviso error">{resultado.error}</div>}
            {!resultado.datos && cargando && <p className="detalle-vacio">Cargando...</p>}

            <ul className={`tipos-grid ${cargando ? 'cargando' : ''}`}>
                {datos.map((item) => {
                    const imagen = item.imagenUrl;
                    return (
                        <li key={item.id} className={`card-box tipo-item ${item.activa ? '' : 'inactiva'}`}>
                            <div className="tipo-imagen">
                                {imagen ? <img src={imagen} alt="" /> : <Icon name={item.icono} size={40} />}
                            </div>
                            <div className="tipo-cuerpo">
                                <div>
                                    <Icon name={item.icono} size={16} /> <strong>{item.nombre}</strong>
                                    {!item.activa && <span className="chip inactiva">Dado de baja</span>}
                                </div>
                                <span className="admin-reclamo-meta">
                                    {imagen ? 'Con imagen de referencia' : 'Sin imagen: se muestra el ícono'}
                                </span>
                                <div className="admin-reclamo-acciones">
                                    <button type="button" className="btn btn-outline btn-chico" disabled={ocupadoId === item.id}
                                        onClick={() => setModal({ tipo: 'editar', item })}>Editar</button>
                                    <button type="button" className={`link-btn ${item.activa ? 'texto-peligro' : ''}`}
                                        disabled={ocupadoId === item.id} onClick={() => cambiarActiva(item)}>
                                        {item.activa ? 'Dar de baja' : 'Reactivar'}
                                    </button>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {modal && (
                <Modal titulo={modal.tipo === 'nuevo' ? 'Nuevo tipo de alerta' : 'Editar tipo de alerta'} onCerrar={() => setModal(null)}>
                    <FormTipo
                        inicial={modal.tipo === 'nuevo'
                            ? { nombre: '', icono: 'alert-triangle', imagenUrl: null, clave: null }
                            : { nombre: modal.item.nombre, icono: modal.item.icono, imagenUrl: modal.item.imagenUrl, clave: modal.item.clave }}
                        onGuardar={guardar}
                        onCancelar={() => setModal(null)}
                    />
                </Modal>
            )}
        </div>
    );
};

const FormTipo = ({ inicial, onGuardar, onCancelar }) => {
    const [datos, setDatos] = useState(inicial);
    const [enviando, setEnviando] = useState(false);
    const [subiendo, setSubiendo] = useState(false);
    const [error, setError] = useState(null);

    const enviar = async (e) => {
        e.preventDefault();
        setError(null);
        setEnviando(true);
        try {
            await onGuardar(datos);
        } catch (err) {
            setError(mensajeDeError(err, 'No se pudo guardar el tipo de alerta'));
            setEnviando(false);
        }
    };

    return (
        <form className="admin-form" onSubmit={enviar}>
            <label className="admin-campo">
                Nombre
                <input type="text" required maxLength={60} placeholder="Ej: Inundación" value={datos.nombre}
                    onChange={(e) => setDatos({ ...datos, nombre: e.target.value })} />
            </label>

            <div className="admin-campo">
                Ícono
                <div className="iconos-opciones" role="group" aria-label="Elegir ícono">
                    {ICONOS.map((i) => (
                        <button key={i.valor} type="button" title={i.label} aria-label={i.label}
                            aria-pressed={datos.icono === i.valor} onClick={() => setDatos({ ...datos, icono: i.valor })}>
                            <Icon name={i.valor} size={20} />
                        </button>
                    ))}
                </div>
            </div>

            <SelectorImagenAlerta
                titulo="Imagen de referencia"
                textoSinImagen="Sin imagen: en el Home se muestra el ícono del tipo."
                subir={subirImagenTipoAlerta}
                imagenUrl={datos.imagenUrl}
                onChange={(url) => setDatos({ ...datos, imagenUrl: url })}
                onSubiendo={setSubiendo}
            />

            {error && <div className="aviso error">{error}</div>}

            <div className="admin-reclamo-acciones">
                <button type="submit" className="btn btn-primary btn-chico" disabled={enviando || subiendo || !datos.nombre.trim()}>
                    {enviando ? 'Guardando...' : 'Guardar'}
                </button>
                <button type="button" className="btn btn-outline btn-chico" onClick={onCancelar} disabled={enviando}>Cancelar</button>
            </div>
        </form>
    );
};

export default ListaTiposAlerta;
