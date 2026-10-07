import React, { useState } from 'react';
import Icon from '../components/Icon';
import LocationPicker from '../components/LocationPicker';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('metricas');

    // --- ESTADOS DE DATOS ---
    const [metricas] = useState({
        totalReportes: 342, resueltos: 215, enProceso: 84, pendientes: 43, usuarios: 1250
    });

    const [alertas, setAlertas] = useState([
        { id: 1, titulo: 'Alerta Meteorológica (Amarilla)', tipo: 'warning', fecha: '07/10/2026', estado: 'Activa' },
        { id: 2, titulo: 'Corte de calle programado', tipo: 'info', fecha: '08/10/2026', estado: 'Programada' }
    ]);

    const [usuarios, setUsuarios] = useState([
        { id: 1, nombre: 'Ana', apellido: 'Gómez', documento: '34567890', email: 'ana.gomez@email.com', telefono: '3385550123', rol: 'Vecino', estado: 'Activo' },
        { id: 2, nombre: 'Carlos', apellido: 'Ruiz', documento: '29888777', email: 'cruiz@email.com', telefono: '3385112233', rol: 'Admin', estado: 'Activo' },
        { id: 3, nombre: 'Luis', apellido: 'Paz', documento: '40111222', email: 'luis.paz@email.com', telefono: '3385998877', rol: 'Vecino', estado: 'Bloqueado' }
    ]);

    // --- ESTADOS PARA FILTROS Y MODALES ---
    const [filtroUsuario, setFiltroUsuario] = useState('');

    const [showAlertaModal, setShowAlertaModal] = useState(false);
    const [nuevaAlerta, setNuevaAlerta] = useState({ titulo: '', descripcion: '', tipo: 'info', imagen: null, ubicacion: null });

    const [showUserModal, setShowUserModal] = useState(false);
    const [usuarioEdit, setUsuarioEdit] = useState(null);

    // --- LÓGICA DE FILTRADO ---
    const usuariosFiltrados = usuarios.filter(u => {
        const nombreCompleto = `${u.nombre} ${u.apellido}`.toLowerCase();
        return nombreCompleto.includes(filtroUsuario.toLowerCase()) || u.documento.includes(filtroUsuario);
    });

    // --- HANDLERS PARA ALERTAS ---
    const handleImagenAlerta = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNuevaAlerta({ ...nuevaAlerta, imagen: URL.createObjectURL(file) });
        }
    };

    const handleCrearAlerta = (e) => {
        e.preventDefault();
        const nueva = {
            id: Date.now(),
            titulo: nuevaAlerta.titulo,
            tipo: nuevaAlerta.tipo,
            fecha: new Date().toLocaleDateString('es-AR'),
            estado: 'Activa'
        };
        setAlertas([nueva, ...alertas]);
        setShowAlertaModal(false);
        setNuevaAlerta({ titulo: '', descripcion: '', tipo: 'info', imagen: null, ubicacion: null });
    };

    // --- HANDLERS PARA USUARIOS ---
    const abrirModalEdicion = (user) => {
        setUsuarioEdit({ ...user });
        setShowUserModal(true);
    };

    const handleGuardarUsuario = (e) => {
        e.preventDefault();
        const usuariosActualizados = usuarios.map(u =>
            u.id === usuarioEdit.id ? usuarioEdit : u
        );
        setUsuarios(usuariosActualizados);
        setShowUserModal(false);
    };

    return (
        <div className="page-wrap" style={{ maxWidth: '1000px' }}>

            {/* ENCABEZADO */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="page-title" style={{ margin: 0 }}>Panel de Administración</h1>
                    <p style={{ color: 'var(--texto-2)', fontSize: '0.9rem', margin: '0.2rem 0 0 0' }}>Gestión interna de Conectar Laboulaye</p>
                </div>
                <span style={{ background: 'var(--brand-1)', color: '#fff', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Icon name="shield" size={16} /> Modo Admin
                </span>
            </div>

            {/* PESTAÑAS */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--borde)', paddingBottom: '1rem', overflowX: 'auto' }}>
                <button className={`btn ${activeTab === 'metricas' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('metricas')}>
                    <Icon name="bar-chart-2" size={18} /> Métricas
                </button>
                <button className={`btn ${activeTab === 'alertas' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('alertas')}>
                    <Icon name="alert-triangle" size={18} /> Gestión de Alertas
                </button>
                <button className={`btn ${activeTab === 'usuarios' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('usuarios')}>
                    <Icon name="users" size={18} /> Usuarios
                </button>
            </div>

            {/* ==================== MÉTRICAS ==================== */}
            {activeTab === 'metricas' && (
                <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Resumen General</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div className="card-box" style={{ textAlign: 'center', borderTop: '4px solid var(--brand-1)' }}>
                            <span style={{ display: 'block', fontSize: '2rem', fontWeight: '900', color: 'var(--texto-1)' }}>{metricas.totalReportes}</span>
                            <span style={{ color: 'var(--texto-2)', fontSize: '0.9rem' }}>Reportes Totales</span>
                        </div>
                        <div className="card-box" style={{ textAlign: 'center', borderTop: '4px solid #10b981' }}>
                            <span style={{ display: 'block', fontSize: '2rem', fontWeight: '900', color: 'var(--texto-1)' }}>{metricas.resueltos}</span>
                            <span style={{ color: 'var(--texto-2)', fontSize: '0.9rem' }}>Resueltos</span>
                        </div>
                        <div className="card-box" style={{ textAlign: 'center', borderTop: '4px solid #f59e0b' }}>
                            <span style={{ display: 'block', fontSize: '2rem', fontWeight: '900', color: 'var(--texto-1)' }}>{metricas.enProceso}</span>
                            <span style={{ color: 'var(--texto-2)', fontSize: '0.9rem' }}>En Proceso</span>
                        </div>
                        <div className="card-box" style={{ textAlign: 'center', borderTop: '4px solid #8b5cf6' }}>
                            <span style={{ display: 'block', fontSize: '2rem', fontWeight: '900', color: 'var(--texto-1)' }}>{metricas.usuarios}</span>
                            <span style={{ color: 'var(--texto-2)', fontSize: '0.9rem' }}>Vecinos Registrados</span>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================== ALERTAS ==================== */}
            {activeTab === 'alertas' && (
                <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Alertas Activas</h2>
                        <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={() => setShowAlertaModal(true)}>
                            <Icon name="plus" size={16} /> Nueva Alerta
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {alertas.map(alerta => (
                            <div key={alerta.id} className="card-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                                <div>
                                    <strong style={{ display: 'block', color: 'var(--texto-1)' }}>{alerta.titulo}</strong>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--texto-3)' }}>Fecha de creación: {alerta.fecha}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ background: alerta.estado === 'Activa' ? '#fef2f2' : '#eff6ff', color: alerta.estado === 'Activa' ? '#ef4444' : '#3b82f6', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                        {alerta.estado}
                                    </span>
                                    <button className="link-btn" style={{ color: '#ef4444' }} onClick={() => setAlertas(alertas.filter(a => a.id !== alerta.id))}>
                                        <Icon name="trash-2" size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {alertas.length === 0 && <p style={{ color: 'var(--texto-3)', textAlign: 'center', padding: '2rem' }}>No hay alertas activas.</p>}
                    </div>
                </div>
            )}

            {/* ==================== USUARIOS ==================== */}
            {activeTab === 'usuarios' && (
                <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Cuentas Registradas</h2>
                        <div className="field" style={{ margin: 0, width: '100%', maxWidth: '300px' }}>
                            <input
                                type="text"
                                placeholder="Buscar por Nombre, Apellido o DNI..."
                                style={{ padding: '0.6rem' }}
                                value={filtroUsuario}
                                onChange={(e) => setFiltroUsuario(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="card-box" style={{ padding: 0, overflow: 'hidden', overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: 'var(--fondo)', borderBottom: '2px solid var(--borde)' }}>
                                <tr>
                                    <th style={{ padding: '1rem', color: 'var(--texto-2)', fontSize: '0.9rem' }}>Nombre y Apellido</th>
                                    <th style={{ padding: '1rem', color: 'var(--texto-2)', fontSize: '0.9rem' }}>DNI</th>
                                    <th style={{ padding: '1rem', color: 'var(--texto-2)', fontSize: '0.9rem' }}>Rol</th>
                                    <th style={{ padding: '1rem', color: 'var(--texto-2)', fontSize: '0.9rem' }}>Estado</th>
                                    <th style={{ padding: '1rem', color: 'var(--texto-2)', fontSize: '0.9rem', textAlign: 'center' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuariosFiltrados.length > 0 ? usuariosFiltrados.map(user => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid var(--borde)' }}>
                                        <td style={{ padding: '1rem', fontWeight: '500' }}>{user.nombre} {user.apellido}</td>
                                        <td style={{ padding: '1rem', color: 'var(--texto-2)' }}>{user.documento}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', background: user.rol === 'Admin' ? 'var(--brand-1)' : '#e2e8f0', color: user.rol === 'Admin' ? '#fff' : 'var(--texto-1)', borderRadius: '4px' }}>
                                                {user.rol}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ fontSize: '0.8rem', color: user.estado === 'Activo' ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                                                {user.estado}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <button className="link-btn" title="Modificar cuenta" style={{ margin: '0 auto' }} onClick={() => abrirModalEdicion(user)}>
                                                <Icon name="settings" size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--texto-3)' }}>No se encontraron usuarios con ese criterio.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ==================== MODAL NUEVA ALERTA ==================== */}
            {showAlertaModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
                    <div className="card-box" style={{ width: '100%', maxWidth: '600px', padding: '1.5rem', animation: 'fadeIn 0.2s ease-out', maxHeight: '90vh', overflowY: 'auto' }}>

                        {/* ENCABEZADO CON LA X */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--borde)', paddingBottom: '0.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Crear Nueva Alerta</h3>
                            <button type="button" className="icon-btn" onClick={() => setShowAlertaModal(false)} style={{ padding: '0.2rem' }} title="Cerrar">
                                <Icon name="x" size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCrearAlerta}>
                            <div className="field">
                                <label>Título de la alerta</label>
                                <input type="text" required placeholder="Ej: Calle cortada por obras" value={nuevaAlerta.titulo} onChange={(e) => setNuevaAlerta({ ...nuevaAlerta, titulo: e.target.value })} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="field">
                                    <label>Nivel de importancia</label>
                                    <select value={nuevaAlerta.tipo} onChange={(e) => setNuevaAlerta({ ...nuevaAlerta, tipo: e.target.value })}>
                                        <option value="info">Informativa</option>
                                        <option value="warning">Precaución</option>
                                        <option value="success">Resolución</option>
                                    </select>
                                </div>
                                <div className="field">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Icon name="image" size={14} /> Imagen ilustrativa (Opcional)</label>
                                    <input type="file" accept="image/*" onChange={handleImagenAlerta} />
                                    {nuevaAlerta.imagen && (
                                        <div style={{ marginTop: '0.5rem', borderRadius: '4px', overflow: 'hidden', height: '60px' }}>
                                            <img src={nuevaAlerta.imagen} alt="Vista previa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="field" style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem' }}>
                                    <Icon name="map-pin" size={14} /> Ubicar en el mapa manualmente
                                </label>
                                <LocationPicker
                                    position={nuevaAlerta.ubicacion}
                                    setPosition={(coords) => setNuevaAlerta({ ...nuevaAlerta, ubicacion: coords })}
                                    soloPinManual={true}
                                />
                            </div>

                            <div className="field">
                                <label>Descripción / Detalles</label>
                                <textarea rows="3" required placeholder="Explicá brevemente la situación..." value={nuevaAlerta.descripcion} onChange={(e) => setNuevaAlerta({ ...nuevaAlerta, descripcion: e.target.value })}></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowAlertaModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Publicar Alerta</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ==================== MODAL EDITAR USUARIO ==================== */}
            {showUserModal && usuarioEdit && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
                    <div className="card-box" style={{ width: '100%', maxWidth: '550px', padding: '1.5rem', animation: 'fadeIn 0.2s ease-out', maxHeight: '90vh', overflowY: 'auto' }}>

                        {/* ENCABEZADO CON LA X */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Modificar Cuenta de Usuario</h3>
                            <button type="button" className="icon-btn" onClick={() => setShowUserModal(false)} style={{ padding: '0.2rem', marginTop: '-0.2rem' }} title="Cerrar">
                                <Icon name="x" size={20} />
                            </button>
                        </div>

                        <p style={{ color: 'var(--texto-2)', marginBottom: '1.5rem', fontSize: '0.9rem', borderBottom: '1px solid var(--borde)', paddingBottom: '0.5rem' }}>
                            Editando perfil de ID #{usuarioEdit.id}
                        </p>

                        <form onSubmit={handleGuardarUsuario}>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                                <div className="field">
                                    <label>Nombre</label>
                                    <input type="text" required value={usuarioEdit.nombre} onChange={(e) => setUsuarioEdit({ ...usuarioEdit, nombre: e.target.value })} />
                                </div>
                                <div className="field">
                                    <label>Apellido</label>
                                    <input type="text" required value={usuarioEdit.apellido} onChange={(e) => setUsuarioEdit({ ...usuarioEdit, apellido: e.target.value })} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                                <div className="field">
                                    <label>Documento (DNI)</label>
                                    <input type="number" required value={usuarioEdit.documento} onChange={(e) => setUsuarioEdit({ ...usuarioEdit, documento: e.target.value })} />
                                </div>
                                <div className="field">
                                    <label>Teléfono</label>
                                    <input type="tel" value={usuarioEdit.telefono} onChange={(e) => setUsuarioEdit({ ...usuarioEdit, telefono: e.target.value })} />
                                </div>
                            </div>

                            <div className="field">
                                <label>Correo Electrónico</label>
                                <input type="email" required value={usuarioEdit.email} onChange={(e) => setUsuarioEdit({ ...usuarioEdit, email: e.target.value })} />
                            </div>

                            <div style={{ borderTop: '1px solid var(--borde)', marginTop: '1rem', paddingTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                                <div className="field">
                                    <label>Rol en el sistema</label>
                                    <select value={usuarioEdit.rol} onChange={(e) => setUsuarioEdit({ ...usuarioEdit, rol: e.target.value })}>
                                        <option value="Vecino">Vecino (Estándar)</option>
                                        <option value="Admin">Administrador (Acceso total)</option>
                                    </select>
                                </div>
                                <div className="field">
                                    <label>Estado de la cuenta</label>
                                    <select value={usuarioEdit.estado} onChange={(e) => setUsuarioEdit({ ...usuarioEdit, estado: e.target.value })}>
                                        <option value="Activo">Activo (Permitir acceso)</option>
                                        <option value="Bloqueado">Bloqueado (Restringir acceso)</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowUserModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Guardar Cambios</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminPanel;