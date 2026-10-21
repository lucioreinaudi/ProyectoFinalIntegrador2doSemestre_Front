import { useEffect, useState } from 'react';
import api from '../../api/client';
import { mensajeDeError } from '../../api/errores';

// ABM de zonas o de categorias para la pestana Configuracion (seccion 7.2):
// alta, edicion (nombre y, en zonas, descripcion) y baja logica / reactivacion.
// No hay borrado fisico: reclamos, alertas y usuarios apuntan a estos registros.
// tipo: 'zonas' | 'categorias'. conDescripcion: solo las zonas la tienen.
const ListaCatalogo = ({ tipo, titulo, singular, conDescripcion = false }) => {
    const [recarga, setRecarga] = useState(0);
    const [resultado, setResultado] = useState({ clave: null, datos: null, error: null });
    const clave = `${tipo}-${recarga}`;
    const cargando = resultado.clave !== clave;

    const [aviso, setAviso] = useState(null); // { tipo: 'ok' | 'error', texto }
    const [nuevo, setNuevo] = useState({ nombre: '', descripcion: '' });
    const [editando, setEditando] = useState(null); // { id, nombre, descripcion }
    const [ocupado, setOcupado] = useState(false);

    // El panel usa la variante /api/admin/..., que trae tambien las dadas de baja.
    useEffect(() => {
        let activo = true;
        api.get(`/api/admin/${tipo}`)
            .then((res) => { if (activo) setResultado({ clave, datos: res.data, error: null }); })
            .catch((err) => {
                if (activo) setResultado({ clave, datos: null, error: mensajeDeError(err, `No se pudieron cargar las ${titulo.toLowerCase()}`) });
            });
        return () => { activo = false; };
    }, [clave, tipo, titulo]);

    // Ejecuta una accion contra el back y, si sale bien, recarga la lista.
    const ejecutar = async (accion, textoOk) => {
        setOcupado(true);
        setAviso(null);
        try {
            await accion();
            setAviso({ tipo: 'ok', texto: textoOk });
            setRecarga((n) => n + 1);
            return true;
        } catch (err) {
            setAviso({ tipo: 'error', texto: mensajeDeError(err, 'No se pudo guardar') });
            return false;
        } finally {
            setOcupado(false);
        }
    };

    const cuerpo = (datos) => (conDescripcion
        ? { nombre: datos.nombre.trim(), descripcion: datos.descripcion.trim() || null }
        : { nombre: datos.nombre.trim() });

    const crear = async (e) => {
        e.preventDefault();
        const ok = await ejecutar(() => api.post(`/api/${tipo}`, cuerpo(nuevo)), `${singular} creada.`);
        if (ok) setNuevo({ nombre: '', descripcion: '' });
    };

    const guardarEdicion = async (e) => {
        e.preventDefault();
        const ok = await ejecutar(() => api.put(`/api/${tipo}/${editando.id}`, cuerpo(editando)), `${singular} actualizada.`);
        if (ok) setEditando(null);
    };

    const cambiarActiva = (item) => ejecutar(
        () => api.patch(`/api/${tipo}/${item.id}/activa`, { activa: !item.activa }),
        item.activa
            ? `${singular} dada de baja: ya no aparece en los formularios.`
            : `${singular} reactivada.`,
    );

    const datos = resultado.datos || [];

    return (
        <div className="catalogo">
            <div className="admin-seccion-head">
                <h2>{titulo}</h2>
                {resultado.datos && <span className="admin-total">{datos.filter((x) => x.activa).length} activas de {datos.length}</span>}
            </div>

            <form className="catalogo-alta" onSubmit={crear}>
                <input type="text" required maxLength={100} placeholder={`Nueva ${singular.toLowerCase()}`} aria-label={`Nombre de la nueva ${singular.toLowerCase()}`}
                    value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} disabled={ocupado} />
                {conDescripcion && (
                    <input type="text" placeholder="Descripción (opcional)" aria-label="Descripción"
                        value={nuevo.descripcion} onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })} disabled={ocupado} />
                )}
                <button type="submit" className="btn btn-primary btn-chico" disabled={ocupado || !nuevo.nombre.trim()}>Agregar</button>
            </form>

            {aviso && <div className={`aviso ${aviso.tipo}`}>{aviso.texto}</div>}
            {resultado.error && !cargando && <div className="aviso error">{resultado.error}</div>}
            {!resultado.datos && cargando && <p className="detalle-vacio">Cargando...</p>}

            <ul className={`catalogo-lista ${cargando ? 'cargando' : ''}`}>
                {datos.map((item) => (
                    <li key={item.id} className={`card-box catalogo-item ${item.activa ? '' : 'inactiva'}`}>
                        {editando?.id === item.id ? (
                            <form className="catalogo-edicion" onSubmit={guardarEdicion}>
                                <input type="text" required maxLength={100} aria-label="Nombre" value={editando.nombre}
                                    onChange={(e) => setEditando({ ...editando, nombre: e.target.value })} disabled={ocupado} />
                                {conDescripcion && (
                                    <input type="text" placeholder="Descripción (opcional)" aria-label="Descripción" value={editando.descripcion}
                                        onChange={(e) => setEditando({ ...editando, descripcion: e.target.value })} disabled={ocupado} />
                                )}
                                <div className="admin-reclamo-acciones">
                                    <button type="submit" className="btn btn-primary btn-chico" disabled={ocupado || !editando.nombre.trim()}>Guardar</button>
                                    <button type="button" className="btn btn-outline btn-chico" onClick={() => setEditando(null)} disabled={ocupado}>Cancelar</button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div>
                                    <strong>{item.nombre}</strong>
                                    {!item.activa && <span className="chip inactiva">Dada de baja</span>}
                                    {conDescripcion && item.descripcion && <span className="admin-reclamo-meta catalogo-desc">{item.descripcion}</span>}
                                </div>
                                <div className="admin-reclamo-acciones">
                                    <button type="button" className="btn btn-outline btn-chico" disabled={ocupado}
                                        onClick={() => setEditando({ id: item.id, nombre: item.nombre, descripcion: item.descripcion || '' })}>
                                        Editar
                                    </button>
                                    <button type="button" className={`link-btn ${item.activa ? 'texto-peligro' : ''}`} disabled={ocupado}
                                        onClick={() => cambiarActiva(item)}>
                                        {item.activa ? 'Dar de baja' : 'Reactivar'}
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListaCatalogo;
