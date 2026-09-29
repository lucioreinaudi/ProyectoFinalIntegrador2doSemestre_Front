import React, { useState, useRef } from 'react';
import Icon from '../components/Icon';

const BARRIOS = ["Zona Norte", "Zona Centro", "Zona Sur", "Zona Este", "Zona Oeste"];

const MiCuenta = () => {
    const fileInputRef = useRef(null);
    const [avatar, setAvatar] = useState(null);

    // 1. Agregamos el email al estado inicial
    const [datos, setDatos] = useState({
        nombre: 'Ana',
        apellido: 'Gómez',
        documento: '34567890',
        fechaNacimiento: '1990-05-15',
        email: 'ana.gomez@email.com', // <-- Campo nuevo
        telefono: '3385 55-0123',
        direccion: 'Sarmiento 123',
        barrio: 'Zona Norte'
    });

    const [passwords, setPasswords] = useState({
        actual: '',
        nueva: '',
        repetir: ''
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setAvatar(previewUrl);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleChange = (e) => {
        setDatos({ ...datos, [e.target.name]: e.target.value });
    };

    const handlePassChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleGuardarDatos = (e) => {
        e.preventDefault();
        console.log("Datos a enviar al back:", { ...datos, avatarFile: fileInputRef.current.files ? fileInputRef.current.files[0] : null });
        alert('Datos personales y foto guardados correctamente.');
    };

    const handleCambiarPassword = (e) => {
        e.preventDefault();
        if (passwords.nueva !== passwords.repetir) {
            alert('Las contraseñas nuevas no coinciden.');
            return;
        }
        console.log("Enviando nueva contraseña al back...");
        alert('Contraseña actualizada con éxito.');
        setPasswords({ actual: '', nueva: '', repetir: '' });
    };

    return (
        <div className="page-wrap">
            <h1 className="page-title">Mi cuenta</h1>

            {/* TARJETA 1: DATOS PERSONALES */}
            <div className="card-box">

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div
                        onClick={triggerFileInput}
                        style={{
                            width: '4.5rem', height: '4.5rem', borderRadius: '50%',
                            background: 'var(--info-bg)', color: 'var(--brand-1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.4rem', fontWeight: '800', cursor: 'pointer',
                            overflow: 'hidden', border: '2px solid var(--info-borde)'
                        }}
                        title="Tocar para cambiar foto"
                    >
                        {avatar ? (
                            <img src={avatar} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            `${datos.nombre.charAt(0)}${datos.apellido.charAt(0)}`
                        )}
                    </div>

                    <div>
                        <strong style={{ display: 'block', fontSize: '1.15rem' }}>{datos.nombre} {datos.apellido}</strong>
                        <span style={{ fontSize: '.85rem', color: 'var(--texto-3)', display: 'block', marginBottom: '.3rem' }}>{datos.barrio}</span>

                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                        <button
                            type="button"
                            className="link-btn"
                            onClick={triggerFileInput}
                            style={{ padding: 0, fontSize: '.8rem' }}
                        >
                            <Icon name="camera" size={14} /> Cambiar foto
                        </button>
                    </div>
                </div>

                <h2 style={{ fontSize: '1.05rem', marginBottom: '1rem', borderBottom: '1px solid var(--borde)', paddingBottom: '.5rem' }}>
                    Datos Personales
                </h2>

                <form onSubmit={handleGuardarDatos}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 1rem' }}>
                        <div className="field">
                            <label htmlFor="nombre">Nombre</label>
                            <input type="text" id="nombre" name="nombre" value={datos.nombre} onChange={handleChange} required />
                        </div>
                        <div className="field">
                            <label htmlFor="apellido">Apellido</label>
                            <input type="text" id="apellido" name="apellido" value={datos.apellido} onChange={handleChange} required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 1rem' }}>
                        <div className="field">
                            <label htmlFor="documento">Documento (DNI)</label>
                            <input type="number" id="documento" name="documento" value={datos.documento} onChange={handleChange} required />
                        </div>
                        <div className="field">
                            <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
                            <input type="date" id="fechaNacimiento" name="fechaNacimiento" value={datos.fechaNacimiento} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* 2. Agrupamos Email y Teléfono en la misma fila */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 1rem' }}>
                        <div className="field">
                            <label htmlFor="email">Correo electrónico</label>
                            <input type="email" id="email" name="email" value={datos.email} onChange={handleChange} required />
                        </div>
                        <div className="field">
                            <label htmlFor="telefono">Teléfono</label>
                            <input type="tel" id="telefono" name="telefono" value={datos.telefono} onChange={handleChange} required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 1rem' }}>
                        <div className="field" style={{ gridColumn: '1 / -1' }}>
                            <label htmlFor="direccion">Dirección</label>
                            <input type="text" id="direccion" name="direccion" value={datos.direccion} onChange={handleChange} required />
                        </div>
                        <div className="field" style={{ gridColumn: '1 / -1' }}>
                            <label htmlFor="barrio">Barrio / Zona</label>
                            <select id="barrio" name="barrio" value={datos.barrio} onChange={handleChange}>
                                {BARRIOS.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '.5rem' }}>
                        Guardar cambios
                    </button>
                </form>
            </div>

            {/* TARJETA 2: SEGURIDAD Y CONTRASEÑA */}
            <div className="card-box" style={{ marginTop: '1.5rem' }}>
                <h2 style={{ fontSize: '1.05rem', marginBottom: '1rem', borderBottom: '1px solid var(--borde)', paddingBottom: '.5rem' }}>
                    Seguridad
                </h2>
                <form onSubmit={handleCambiarPassword}>
                    <div className="field">
                        <label htmlFor="actual">Contraseña actual</label>
                        <input type="password" id="actual" name="actual" value={passwords.actual} onChange={handlePassChange} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 1rem' }}>
                        <div className="field">
                            <label htmlFor="nueva">Nueva contraseña</label>
                            <input type="password" id="nueva" name="nueva" value={passwords.nueva} onChange={handlePassChange} required />
                        </div>
                        <div className="field">
                            <label htmlFor="repetir">Repetir nueva contraseña</label>
                            <input type="password" id="repetir" name="repetir" value={passwords.repetir} onChange={handlePassChange} required />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-outline btn-block" style={{ marginTop: '.5rem' }}>
                        Actualizar contraseña
                    </button>
                </form>
            </div>

            <button
                className="btn btn-block"
                style={{ marginTop: '1.5rem', color: 'var(--alto-icono)', backgroundColor: 'var(--alto-bg)' }}
                onClick={() => alert('Cerrando sesión...')}
            >
                <Icon name="x" size={18} /> Cerrar sesión
            </button>
        </div>
    );
};

export default MiCuenta;