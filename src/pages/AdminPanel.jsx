import React, { useState } from 'react';
import Icon from '../components/Icon';
import CambiarPassword from '../components/admin/CambiarPassword';
import PanelAlertas from '../components/admin/PanelAlertas';
import PanelConfiguracion from '../components/admin/PanelConfiguracion';
import PanelReclamos from '../components/admin/PanelReclamos';
import PanelUsuarios from '../components/admin/PanelUsuarios';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('reclamos');

  const [cambiandoPassword, setCambiandoPassword] = useState(false);

  return (
    <div className="page-wrap" style={{ maxWidth: '1100px' }}>
      
      {/* ENCABEZADO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Panel de Administración</h1>
          <p style={{ color: 'var(--texto-2)', fontSize: '0.9rem', margin: '0.2rem 0 0 0' }}>Gestión interna de Conectar Laboulaye</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn btn-outline" style={{ fontSize: '0.85rem' }} onClick={() => setCambiandoPassword(true)}>Cambiar contraseña</button>
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
      {/* Conectada al back (SCRUM-81). Metricas sigue siendo maqueta hasta SCRUM-87. */}
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

      {/* ==================== USUARIOS (solo lectura) ==================== */}
      {activeTab === 'usuarios' && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <PanelUsuarios />
        </div>
      )}

      {/* ==================== CONFIGURACIÓN ==================== */}
      {activeTab === 'configuracion' && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <PanelConfiguracion />
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

      {cambiandoPassword && <CambiarPassword onCerrar={() => setCambiandoPassword(false)} />}
    </div>
  );
};

export default AdminPanel;