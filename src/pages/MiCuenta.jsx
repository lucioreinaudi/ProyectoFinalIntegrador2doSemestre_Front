import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '../components/Icon';
import { actualizarPerfil, cambiarPassword, logout, selectUsuario } from '../features/auth/authSlice';

const MiCuenta = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const usuario = useSelector(selectUsuario);
    const { perfilStatus, perfilError, passwordStatus, passwordError } = useSelector((state) => state.auth);

    const fileInputRef = useRef(null);
    const [avatar, setAvatar] = useState(null);

    // Datos reales del usuario logueado. zonaId no se edita desde este formulario
    // (no hay selector de zona aca), pero se guarda igual para mandarlo de vuelta
    // en el PUT: si no se manda, el back la borra (es un PUT, reemplaza todo).
    const [datos, setDatos] = useState({
        nombre: usuario?.nombre || '',
        apellido: usuario?.apellido || '',
        documento: usuario?.documento || '',
        fechaNacimiento: usuario?.fechaNacimiento || '',
        email: usuario?.email || '',
        telefono: usuario?.telefono || '',
        zonaId: usuario?.zonaId ?? null
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

    const handleGuardarDatos = async (e) => {
        e.preventDefault();
        // email no va: el back ni lo acepta (UsuarioActualizarRequest no tiene ese campo).
        const { email, ...datosParaEnviar } = datos;
        try {
            await dispatch(actualizarPerfil(datosParaEnviar)).unwrap();
            alert('Datos personales guardados correctamente.');
        } catch {
            // El error ya queda en el estado (authSlice) y se muestra abajo.
        }
    };

    const handleCambiarPassword = async (e) => {
        e.preventDefault();
        if (passwords.nueva !== passwords.repetir) {
            alert('Las contraseñas nuevas no coinciden.');
            return;
        }
        try {
            await dispatch(cambiarPassword({
                passwordActual: passwords.actual,
                passwordNueva: passwords.nueva
            })).unwrap();
            alert('Contraseña actualizada con éxito.');
            setPasswords({ actual: '', nueva: '', repetir: '' });
        } catch {
            // El error ya queda en el estado (authSlice) y se muestra abajo.
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    // La ruta ya esta protegida con RutaProtegida (App.jsx). Este chequeo queda
    // solo como resguardo, por si el usuario desaparece del estado mientras se
    // muestra la pagina (ej. al cerrar sesion).
    if (!usuario) {
        return (
            <div className="page-wrap">
                <h1 className="page-title">Mi cuenta</h1>
                <div className="card-box">
                    <p>Tenés que iniciar sesión para ver esta página.</p>
                </div>
            </div>
        );
    }

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
                            style={{ padding: 0, fontSize: '.8rem', marginTop: '.3rem' }}
                        >
                            <Icon name="camera" size={14} /> Cambiar foto
                        </button>
                    </div>
                </div>

                <h2 style={{ fontSize: '1.05rem', marginBottom: '1rem', borderBottom: '1px solid var(--borde)', paddingBottom: '.5rem' }}>
                    Datos Personales
                </h2>

                {perfilError && (
                    <p style={{ color: '#c0392b', fontSize: '.85rem', marginBottom: '1rem' }}>
                        No se pudieron guardar los cambios. Intentá de nuevo.
                    </p>
                )}

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

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 1rem' }}>
                        <div className="field">
                            <label htmlFor="email">Correo electrónico</label>
                            <input type="email" id="email" name="email" value={datos.email} disabled title="El email no se puede modificar" />
                        </div>
                        <div className="field">
                            <label htmlFor="telefono">Teléfono</label>
                            <input type="tel" id="telefono" name="telefono" value={datos.telefono} onChange={handleChange} required />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '.5rem' }} disabled={perfilStatus === 'loading'}>
                        {perfilStatus === 'loading' ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                </form>
            </div>

            {/* TARJETA 2: SEGURIDAD Y CONTRASEÑA */}
            <div className="card-box" style={{ marginTop: '1.5rem' }}>
                <h2 style={{ fontSize: '1.05rem', marginBottom: '1rem', borderBottom: '1px solid var(--borde)', paddingBottom: '.5rem' }}>
                    Seguridad
                </h2>
                {passwordError && (
                    <p style={{ color: '#c0392b', fontSize: '.85rem', marginBottom: '1rem' }}>
                        {passwordError === 400 ? 'La contraseña actual es incorrecta.' : 'No se pudo actualizar la contraseña. Intenta de nuevo.'}
                    </p>
                )}
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
                    <button type="submit" className="btn btn-outline btn-block" style={{ marginTop: '.5rem' }} disabled={passwordStatus === 'loading'}>
                        {passwordStatus === 'loading' ? 'Actualizando...' : 'Actualizar contraseña'}
                    </button>
                </form>
            </div>

            <button
                className="btn btn-block"
                style={{ marginTop: '1.5rem', color: 'var(--alto-icono)', backgroundColor: 'var(--alto-bg)' }}
                onClick={handleLogout}
            >
                <Icon name="logout" size={18} /> Cerrar sesión
            </button>
        </div>
    );
};

export default MiCuenta;