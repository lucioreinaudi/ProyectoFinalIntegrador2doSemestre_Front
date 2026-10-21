import { useEffect, useState } from 'react';
import api from '../../api/client';
import { mensajeDeError } from '../../api/errores';
import { formatearFecha } from '../../features/reclamos/formato';

const TAMANIO_PAGINA = 15;
const ESPERA_BUSQUEDA_MS = 400; // no pedir al back con cada tecla

// Pestana Usuarios (Q5, Q13): solo lectura. Columnas: nombre y apellido, DNI,
// email, telefono, zona, rol, fecha de registro y cantidad de reclamos.
// Filtros: texto (nombre, apellido, DNI o email), zona y rol. El back filtra y pagina.
const PanelUsuarios = () => {
    const [texto, setTexto] = useState('');
    const [textoBuscado, setTextoBuscado] = useState('');
    const [zonaId, setZonaId] = useState('');
    const [rol, setRol] = useState('');
    const [pagina, setPagina] = useState(0);
    const [zonas, setZonas] = useState([]);
    const [resultado, setResultado] = useState({ clave: null, datos: null, error: null });

    const clave = JSON.stringify({ textoBuscado, zonaId, rol, pagina });
    const cargando = resultado.clave !== clave;

    useEffect(() => {
        let activo = true;
        api.get('/api/admin/zonas')
            .then((res) => { if (activo) setZonas(res.data); })
            .catch(() => { /* sin zonas, el filtro queda vacio */ });
        return () => { activo = false; };
    }, []);

    // El texto se aplica cuando se deja de escribir un momento.
    useEffect(() => {
        const espera = setTimeout(() => {
            setTextoBuscado(texto.trim());
            setPagina(0);
        }, ESPERA_BUSQUEDA_MS);
        return () => clearTimeout(espera);
    }, [texto]);

    useEffect(() => {
        let activo = true;
        const params = { pagina, tamanio: TAMANIO_PAGINA };
        if (textoBuscado) params.texto = textoBuscado;
        if (zonaId) params.zonaId = zonaId;
        if (rol) params.rol = rol;
        api.get('/api/admin/usuarios', { params })
            .then((res) => { if (activo) setResultado({ clave, datos: res.data, error: null }); })
            .catch((err) => {
                if (activo) setResultado({ clave, datos: null, error: mensajeDeError(err, 'No se pudieron cargar los usuarios') });
            });
        return () => { activo = false; };
    }, [clave, textoBuscado, zonaId, rol, pagina]);

    const cambiarFiltro = (setter) => (e) => {
        setter(e.target.value);
        setPagina(0);
    };

    const datos = resultado.datos;

    return (
        <div>
            <div className="admin-seccion-head">
                <h2>Usuarios</h2>
                {datos && <span className="admin-total">{datos.totalElementos} usuario{datos.totalElementos === 1 ? '' : 's'}</span>}
            </div>

            <div className="admin-filtros" role="group" aria-label="Filtrar usuarios">
                <label>
                    Buscar
                    <input type="text" placeholder="Nombre, apellido, DNI o email" value={texto} onChange={(e) => setTexto(e.target.value)} />
                </label>
                <label>
                    Zona
                    <select value={zonaId} onChange={cambiarFiltro(setZonaId)}>
                        <option value="">Todas</option>
                        {zonas.map((z) => <option key={z.id} value={z.id}>{z.activa ? z.nombre : `${z.nombre} (dada de baja)`}</option>)}
                    </select>
                </label>
                <label>
                    Rol
                    <select value={rol} onChange={cambiarFiltro(setRol)}>
                        <option value="">Todos</option>
                        <option value="vecino">Vecino</option>
                        <option value="municipio">Municipio</option>
                    </select>
                </label>
            </div>

            {resultado.error && !cargando && <div className="aviso error">{resultado.error}</div>}
            {!datos && cargando && <p className="detalle-vacio">Cargando usuarios...</p>}

            {datos && datos.contenido.length === 0 && !cargando && (
                <div className="empty-state"><p>No hay usuarios con esos filtros.</p></div>
            )}

            {datos && datos.contenido.length > 0 && (
                <div className={`card-box tabla-contenedor ${cargando ? 'cargando' : ''}`} aria-busy={cargando}>
                    <table className="tabla-admin">
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>DNI</th>
                                <th>Contacto</th>
                                <th>Zona</th>
                                <th>Registro</th>
                                <th className="centrado">Reclamos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datos.contenido.map((u) => (
                                <tr key={u.id}>
                                    <td>
                                        <strong>{[u.nombre, u.apellido].filter(Boolean).join(' ')}</strong>
                                        <span className={`chip rol-${u.rol}`}>{u.rol === 'municipio' ? 'Municipio' : 'Vecino'}</span>
                                    </td>
                                    <td>{u.documento || '-'}</td>
                                    <td>
                                        <a href={`mailto:${u.email}`}>{u.email}</a>
                                        {u.telefono && <span className="admin-reclamo-meta tabla-sub">{u.telefono}</span>}
                                    </td>
                                    <td>{u.zonaNombre || '-'}</td>
                                    <td>{formatearFecha(u.fechaRegistro)}</td>
                                    <td className="centrado"><strong>{u.cantidadReclamos}</strong></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {datos && datos.totalPaginas > 1 && (
                <nav className="paginacion" aria-label="Paginas de usuarios">
                    <button type="button" className="btn btn-outline btn-chico" disabled={pagina === 0 || cargando}
                        onClick={() => setPagina((p) => p - 1)}>Anterior</button>
                    <span>Página {datos.pagina + 1} de {datos.totalPaginas}</span>
                    <button type="button" className="btn btn-outline btn-chico" disabled={pagina + 1 >= datos.totalPaginas || cargando}
                        onClick={() => setPagina((p) => p + 1)}>Siguiente</button>
                </nav>
            )}
        </div>
    );
};

export default PanelUsuarios;
