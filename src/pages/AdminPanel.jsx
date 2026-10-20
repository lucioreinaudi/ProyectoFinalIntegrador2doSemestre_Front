import React, { useState } from 'react';
import Icon from '../components/Icon';
import PanelAlertas from '../components/admin/PanelAlertas';
import PanelReclamos from '../components/admin/PanelReclamos';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('reclamos');

  // --- DATOS SIMULADOS ---
  const [usuarios] = useState([
    { id: 1, nombre: 'Ana Gómez', documento: '34567890', email: 'ana@email.com', telefono: '3385550123', zona: 'Centro', rol: 'vecino', fechaRegistro: '01/08/2026', cantReclamos: 4 },
    { id: 2, nombre: 'Carlos Ruiz', documento: '29888777', email: 'cruiz@email.com', telefono: '3385112233', zona: 'Norte', rol: 'municipio', fechaRegistro: '15/07/2026', cantReclamos: 0 }
  ]);

  const [zonas] = useState([
    { id: 1, nombre: 'Centro', descripcion: 'Casco céntrico', activa: true },
    { id: 2, nombre: 'Norte', descripcion: 'Barrios zona norte', activa: true }
  ]);

  const [categorias] = useState([
    { id: 1, nombre: 'Alumbrado', activa: true },
    { id: 2, nombre: 'Otro', activa: true }
  ]);

  // --- ESTADOS PARA MODALES Y FILTROS ---
  const [filtroUsuario, setFiltroUsuario] = useState('');
  

  const usuariosFiltrados = usuarios.filter(u => 
    `${u.nombre}`.toLowerCase().includes(filtroUsuario.toLowerCase()) || 
    u.documento.includes(filtroUsuario) || 
    u.email.toLowerCase().includes(filtroUsuario.toLowerCase())
  );

  return (
    <div className="page-wrap" style={{ maxWidth: '1100px' }}>
      
      {/* ENCABEZADO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Panel de Administración</h1>
          <p style={{ color: 'var(--texto-2)', fontSize: '0.9rem', margin: '0.2rem 0 0 0' }}>Gestión interna de Conectar Laboulaye</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn btn-outline" style={{ fontSize: '0.85rem' }}>Cambiar contraseña</button>
          <span style={{ background: 'var(--brand-1)', color: '#fff', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Icon name="shield" size={16} /> Municipio
          </span>
        </div>
      </div>

      {/* PESTAÑAS */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--borde)', paddingBottom: '1rem', overflowX: 'auto' }}>
        <button className={`btn ${activeTab === 'reclamos' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('reclamos')}>
          <Icon name="inbox" size={18} /> Reclamos
        </button>
        <button className={`btn ${activeTab === 'alertas' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('alertas')}>
          <Icon name="alert-triangle" size={18} /> Alertas
        </button>
        <button className={`btn ${activeTab === 'usuarios' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('usuarios')}>
          <Icon name="users" size={18} /> Usuarios
        </button>
        <button className={`btn ${activeTab === 'configuracion' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('configuracion')}>
          <Icon name="settings" size={18} /> Configuración
        </button>
        <button className={`btn ${activeTab === 'metricas' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('metricas')}>
          <Icon name="bar-chart-2" size={18} /> Métricas
        </button>
      </div>

      {/* ==================== RECLAMOS ==================== */}
      {/* Conectada al back (SCRUM-81). Usuarios, Configuracion y Metricas siguen siendo maqueta. */}
      {activeTab === 'reclamos' && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <PanelReclamos />
        </div>
      )}

      {/* ==================== ALERTAS ==================== */}
      {/* Conectada al back (SCRUM-83) */}
      {activeTab === 'alertas' && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <PanelAlertas />
        </div>
      )}

      {/* ==================== USUARIOS (Solo lectura) ==================== */}
      {activeTab === 'usuarios' && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Directorio de Usuarios</h2>
            <div className="field" style={{ margin: 0, width: '100%', maxWidth: '300px' }}>
              <input 
                type="text" 
                placeholder="Buscar por Nombre, DNI o Email..." 
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
                  <th style={{ padding: '1rem', color: 'var(--texto-2)', fontSize: '0.9rem' }}>Vecino</th>
                  <th style={{ padding: '1rem', color: 'var(--texto-2)', fontSize: '0.9rem' }}>DNI</th>
                  <th style={{ padding: '1rem', color: 'var(--texto-2)', fontSize: '0.9rem' }}>Contacto</th>
                  <th style={{ padding: '1rem', color: 'var(--texto-2)', fontSize: '0.9rem' }}>Zona</th>
                  <th style={{ padding: '1rem', color: 'var(--texto-2)', fontSize: '0.9rem' }}>Registro</th>
                  <th style={{ padding: '1rem', color: 'var(--texto-2)', fontSize: '0.9rem', textAlign: 'center' }}>Reclamos</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--borde)' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>
                      {user.nombre}
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--texto-3)', textTransform: 'uppercase' }}>{user.rol}</span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--texto-2)' }}>{user.documento}</td>
                    <td style={{ padding: '1rem', color: 'var(--texto-2)', fontSize: '0.85rem' }}>{user.email}<br/>{user.telefono}</td>
                    <td style={{ padding: '1rem', color: 'var(--texto-2)' }}>{user.zona}</td>
                    <td style={{ padding: '1rem', color: 'var(--texto-2)', fontSize: '0.9rem' }}>{user.fechaRegistro}</td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold' }}>{user.cantReclamos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== CONFIGURACIÓN ==================== */}
      {activeTab === 'configuracion' && (
        <div style={{ animation: 'fadeIn 0.3s ease-out', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          {/* Zonas */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Zonas</h2>
              <button className="link-btn"><Icon name="plus" size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {zonas.map(z => (
                <div key={z.id} className="card-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1rem', opacity: z.activa ? 1 : 0.5 }}>
                  <div>
                    <strong style={{ display: 'block' }}>{z.nombre}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--texto-3)' }}>{z.descripcion}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="link-btn"><Icon name="edit-2" size={16} /></button>
                    <button className="link-btn" style={{ color: z.activa ? '#ef4444' : '#10b981' }}><Icon name={z.activa ? 'eye-off' : 'eye'} size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categorías */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Categorías</h2>
              <button className="link-btn"><Icon name="plus" size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {categorias.map(c => (
                <div key={c.id} className="card-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1rem', opacity: c.activa ? 1 : 0.5 }}>
                  <strong style={{ display: 'block' }}>{c.nombre}</strong>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="link-btn"><Icon name="edit-2" size={16} /></button>
                    <button className="link-btn" style={{ color: c.activa ? '#ef4444' : '#10b981' }}><Icon name={c.activa ? 'eye-off' : 'eye'} size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ==================== MÉTRICAS ==================== */}
      {activeTab === 'metricas' && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Métricas en tiempo real</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="card-box" style={{ textAlign: 'center', borderTop: '4px solid var(--brand-1)' }}>
              <span style={{ display: 'block', fontSize: '2rem', fontWeight: '900', color: 'var(--texto-1)' }}>342</span>
              <span style={{ color: 'var(--texto-2)', fontSize: '0.9rem' }}>Reclamos Históricos</span>
            </div>
            <div className="card-box" style={{ textAlign: 'center', borderTop: '4px solid #10b981' }}>
              <span style={{ display: 'block', fontSize: '2rem', fontWeight: '900', color: 'var(--texto-1)' }}>215</span>
              <span style={{ color: 'var(--texto-2)', fontSize: '0.9rem' }}>Resueltos</span>
            </div>
            <div className="card-box" style={{ textAlign: 'center', borderTop: '4px solid #ef4444' }}>
              <span style={{ display: 'block', fontSize: '2rem', fontWeight: '900', color: 'var(--texto-1)' }}>12</span>
              <span style={{ color: 'var(--texto-2)', fontSize: '0.9rem' }}>Alertas Activas</span>
            </div>
            <div className="card-box" style={{ textAlign: 'center', borderTop: '4px solid #8b5cf6' }}>
              <span style={{ display: 'block', fontSize: '2rem', fontWeight: '900', color: 'var(--texto-1)' }}>1,250</span>
              <span style={{ color: 'var(--texto-2)', fontSize: '0.9rem' }}>Vecinos Registrados</span>
            </div>
            <div className="card-box" style={{ textAlign: 'center', borderTop: '4px solid #f59e0b' }}>
              <span style={{ display: 'block', fontSize: '2rem', fontWeight: '900', color: 'var(--texto-1)' }}>4.2 días</span>
              <span style={{ color: 'var(--texto-2)', fontSize: '0.9rem' }}>Tpo. Promedio Resolución</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;