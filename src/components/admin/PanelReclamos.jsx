import { useEffect, useState } from 'react';
import api from '../../api/client';
import { mensajeDeError } from '../../api/errores';
import { ESTADOS, infoEstado } from '../../features/reclamos/estados';
import { formatearFecha } from '../../features/reclamos/formato';
import DetalleReclamo from './DetalleReclamo';

const FILTROS_INICIALES = {
    estado: '', zonaId: '', categoriaId: '', desde: '', hasta: '', publicado: '', soloOtro: false,
};
const TAMANIO_PAGINA = 10;

// Pestana Reclamos del panel: listado de GET /api/admin/reclamos con filtros y
// paginacion (el back filtra y pagina; aca solo se arman los parametros).
const PanelReclamos = () => {
    const [filtros, setFiltros] = useState(FILTROS_INICIALES);
    const [pagina, setPagina] = useState(0);
    const [recarga, setRecarga] = useState(0);
    const [abiertoId, setAbiertoId] = useState(null);

    const [zonas, setZonas] = useState([]);
    const [categorias, setCategorias] = useState([]);

    // El resultado guarda para que pedido fue (clave): mientras la clave actual
    // no coincida, el pedido esta en curso. Asi no hace falta un setCargando(true)
    // sincronico dentro del efecto.
    const [resultado, setResultado] = useState({ clave: null, datos: null, error: null });
    const clave = JSON.stringify({ filtros, pagina, recarga });
    const cargando = resultado.clave !== clave;

    // Zonas y categorias para los filtros y la reclasificacion. Se piden una vez.
    // Variante del panel: trae tambien las dadas de baja (siguen en los filtros, Q29).
    useEffect(() => {
        let activo = true;
        Promise.all([api.get('/api/admin/zonas'), api.get('/api/admin/categorias')])
            .then(([resZonas, resCategorias]) => {
                if (!activo) return;
                setZonas(resZonas.data);
                setCategorias(resCategorias.data);
            })
            .catch(() => { /* sin listas, los filtros por zona/categoria quedan vacios */ });
        return () => { activo = false; };
    }, []);

    useEffect(() => {
        let activo = true;
        const params = { pagina, tamanio: TAMANIO_PAGINA };
        if (filtros.estado) params.estado = filtros.estado;
        if (filtros.zonaId) params.zonaId = filtros.zonaId;
        if (filtros.categoriaId) params.categoriaId = filtros.categoriaId;
        if (filtros.desde) params.desde = filtros.desde;
        if (filtros.hasta) params.hasta = filtros.hasta;
        if (filtros.publicado) params.publicado = filtros.publicado;
        if (filtros.soloOtro) params.soloOtro = true;

        api.get('/api/admin/reclamos', { params })
            .then((res) => {
                if (activo) setResultado({ clave, datos: res.data, error: null });
            })
            .catch((err) => {
                if (activo) setResultado({ clave, datos: null, error: mensajeDeError(err, 'No se pudieron cargar los reclamos') });
            });
        return () => { activo = false; };
    }, [clave, filtros, pagina]);

    // Cualquier cambio de filtro vuelve a la primera pagina.
    const cambiarFiltro = (campo, valor) => {
        setFiltros((prev) => ({ ...prev, [campo]: valor }));
        setPagina(0);
    };

    const limpiarFiltros = () => {
        setFiltros(FILTROS_INICIALES);
        setPagina(0);
    };

    const datos = resultado.datos;
    const hayFiltros = JSON.stringify(filtros) !== JSON.stringify(FILTROS_INICIALES);
    // Las dadas de baja siguen en los filtros (Q29), marcadas.
    const nombreConBaja = (item) => (item.activa === false ? `${item.nombre} (dada de baja)` : item.nombre);

    return (
        <div>
            <div className="admin-seccion-head">
                <h2>Gestión de Reclamos</h2>
                {datos && <span className="admin-total">{datos.totalElementos} reclamo{datos.totalElementos === 1 ? '' : 's'}</span>}
            </div>

            <div className="admin-filtros" role="group" aria-label="Filtrar reclamos">
                <label>
                    Estado
                    <select value={filtros.estado} onChange={(e) => cambiarFiltro('estado', e.target.value)}>
                        <option value="">Todos</option>
                        {ESTADOS.map((e) => <option key={e} value={e}>{infoEstado(e).label}</option>)}
                    </select>
                </label>
                <label>
                    Zona
                    <select value={filtros.zonaId} onChange={(e) => cambiarFiltro('zonaId', e.target.value)}>
                        <option value="">Todas</option>
                        {zonas.map((z) => <option key={z.id} value={z.id}>{nombreConBaja(z)}</option>)}
                    </select>
                </label>
                <label>
                    Categoría
                    <select value={filtros.categoriaId} onChange={(e) => cambiarFiltro('categoriaId', e.target.value)}>
                        <option value="">Todas</option>
                        {categorias.map((c) => <option key={c.id} value={c.id}>{nombreConBaja(c)}</option>)}
                    </select>
                </label>
                <label>
                    Publicado
                    <select value={filtros.publicado} onChange={(e) => cambiarFiltro('publicado', e.target.value)}>
                        <option value="">Todos</option>
                        <option value="true">Publicados</option>
                        <option value="false">Sin publicar</option>
                    </select>
                </label>
                <label>
                    Desde
                    <input type="date" value={filtros.desde} onChange={(e) => cambiarFiltro('desde', e.target.value)} />
                </label>
                <label>
                    Hasta
                    <input type="date" value={filtros.hasta} onChange={(e) => cambiarFiltro('hasta', e.target.value)} />
                </label>
                <label className="check">
                    <input type="checkbox" checked={filtros.soloOtro} onChange={(e) => cambiarFiltro('soloOtro', e.target.checked)} />
                    Solo categoría "Otro"
                </label>
                {hayFiltros && (
                    <button type="button" className="link-btn" onClick={limpiarFiltros}>Limpiar filtros</button>
                )}
            </div>

            {resultado.error && !cargando && <div className="aviso error">{resultado.error}</div>}

            {!datos && cargando && <p className="detalle-vacio">Cargando reclamos...</p>}

            {datos && datos.contenido.length === 0 && !cargando && (
                <div className="empty-state">
                    <p>{hayFiltros ? 'No hay reclamos con esos filtros.' : 'Todavía no hay reclamos.'}</p>
                </div>
            )}

            {datos && datos.contenido.length > 0 && (
                <div className={`admin-lista ${cargando ? 'cargando' : ''}`} aria-busy={cargando}>
                    {datos.contenido.map((r) => {
                        const info = infoEstado(r.estadoActual);
                        return (
                            <div key={r.id} className="card-box admin-reclamo">
                                <div>
                                    <div className="admin-reclamo-titulo">
                                        <strong>{r.titulo}</strong>
                                        {r.publicado && <span className="chip publicado">Publicado</span>}
                                    </div>
                                    <span className="admin-reclamo-meta">
                                        {formatearFecha(r.fechaCreacion)} · Vecino: {r.usuarioNombre} · {r.zonaNombre} · {r.categoriaNombre}
                                    </span>
                                </div>
                                <div className="admin-reclamo-acciones">
                                    <span className={`estado-pill ${info.clase}`}>{info.label}</span>
                                    <button type="button" className="btn btn-outline btn-chico" onClick={() => setAbiertoId(r.id)}>
                                        Atender
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {datos && datos.totalPaginas > 1 && (
                <nav className="paginacion" aria-label="Paginas de reclamos">
                    <button type="button" className="btn btn-outline btn-chico" disabled={pagina === 0 || cargando}
                        onClick={() => setPagina((p) => p - 1)}>
                        Anterior
                    </button>
                    <span>Página {datos.pagina + 1} de {datos.totalPaginas}</span>
                    <button type="button" className="btn btn-outline btn-chico" disabled={pagina + 1 >= datos.totalPaginas || cargando}
                        onClick={() => setPagina((p) => p + 1)}>
                        Siguiente
                    </button>
                </nav>
            )}

            {abiertoId && (
                <DetalleReclamo
                    id={abiertoId}
                    zonas={zonas}
                    categorias={categorias}
                    onCerrar={() => setAbiertoId(null)}
                    onCambio={() => setRecarga((n) => n + 1)}
                />
            )}
        </div>
    );
};

export default PanelReclamos;
