import Icon from '../components/Icon';

const InfoUtil = () => {
    return (
        <div className="page-wrap">
            <h1 className="page-title">Información Útil</h1>
            <p style={{ color: 'var(--texto-2)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                Directorio de contactos de emergencia de Laboulaye, dependencias municipales y guía de uso de la plataforma.
            </p>

            {/* SECCIÓN 1: EMERGENCIAS (Botones para llamar) */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--texto-1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon name="alert-circle" size={20} color="#ef4444" /> Teléfonos de Emergencia
                </h2>

                <div className="info-list">
                    <a href="tel:107" className="info-item" style={{ textDecoration: 'none', transition: 'transform 0.2s' }}>
                        <div className="ii" style={{ background: '#fef2f2', color: '#ef4444' }}>
                            <Icon name="activity" />
                        </div>
                        <div>
                            <strong>Hospital Regional Ramón J. Cárcano</strong>
                            <span>Emergencias Médicas (107)</span>
                        </div>
                    </a>

                    <a href="tel:101" className="info-item" style={{ textDecoration: 'none', transition: 'transform 0.2s' }}>
                        <div className="ii" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                            <Icon name="shield" />
                        </div>
                        <div>
                            <strong>Policía de la Provincia</strong>
                            <span>Comando Radioeléctrico (101)</span>
                        </div>
                    </a>

                    <a href="tel:100" className="info-item" style={{ textDecoration: 'none', transition: 'transform 0.2s' }}>
                        <div className="ii" style={{ background: '#fff7ed', color: '#f97316' }}>
                            <Icon name="alert-triangle" />
                        </div>
                        <div>
                            <strong>Bomberos Voluntarios</strong>
                            <span>Emergencias y rescates (100)</span>
                        </div>
                    </a>
                </div>
            </section>

            {/* SECCIÓN 2: DEPENDENCIAS MUNICIPALES */}
            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--texto-1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon name="map-pin" size={20} color="var(--brand-1)" /> Dependencias Municipales
                </h2>

                <div className="info-list">
                    <div className="info-item">
                        <div className="ii"><Icon name="home" /></div>
                        <div>
                            <strong>Edificio Municipal Central</strong>
                            <span>Av. Independencia 258 | Lunes a Viernes 07:00 a 13:30 hs.</span>
                        </div>
                    </div>
                    <div className="info-item">
                        <div className="ii"><Icon name="truck" /></div>
                        <div>
                            <strong>Obras y Servicios Públicos</strong>
                            <span>Atención de reclamos por recolección, alumbrado y barrido.</span>
                        </div>
                    </div>
                    <div className="info-item">
                        <div className="ii"><Icon name="users" /></div>
                        <div>
                            <strong>Atención al Ciudadano</strong>
                            <span>Tel: (03385) 42-0000 | consultas@laboulaye.gob.ar</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN 3: GUÍA DE LA PLATAFORMA */}
            <section>
                <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--texto-1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon name="help-circle" size={20} color="var(--brand-1)" /> ¿Cómo funciona la App?
                </h2>

                <div className="card-box" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ fontWeight: '900', color: 'var(--brand-1)', fontSize: '1.4rem', lineHeight: '1' }}>1</div>
                        <div>
                            <strong style={{ display: 'block', color: 'var(--texto-1)', marginBottom: '0.2rem' }}>Generá tu reporte</strong>
                            <span style={{ fontSize: '0.9rem', color: 'var(--texto-2)', lineHeight: '1.4', display: 'block' }}>Desde "Nuevo reporte" elegí la categoría, agregá una foto del problema y la ubicación exacta donde te encontrás.</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ fontWeight: '900', color: 'var(--brand-1)', fontSize: '1.4rem', lineHeight: '1' }}>2</div>
                        <div>
                            <strong style={{ display: 'block', color: 'var(--texto-1)', marginBottom: '0.2rem' }}>Derivación automática</strong>
                            <span style={{ fontSize: '0.9rem', color: 'var(--texto-2)', lineHeight: '1.4', display: 'block' }}>El sistema envía tu caso instantáneamente al área correspondiente de la Municipalidad para su gestión.</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ fontWeight: '900', color: 'var(--brand-1)', fontSize: '1.4rem', lineHeight: '1' }}>3</div>
                        <div>
                            <strong style={{ display: 'block', color: 'var(--texto-1)', marginBottom: '0.2rem' }}>Seguimiento en tiempo real</strong>
                            <span style={{ fontSize: '0.9rem', color: 'var(--texto-2)', lineHeight: '1.4', display: 'block' }}>Desde "Mis reportes" vas a poder controlar si tu caso está Pendiente, En proceso o finalmente Resuelto.</span>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default InfoUtil;