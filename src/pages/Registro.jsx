import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../features/auth/authSlice';

const Registro = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { registerStatus, registerError } = useSelector((state) => state.auth);
    const [datos, setDatos] = useState({
        nombre: '',
        apellido: '',
        documento: '',
        fechaNacimiento: '',
        email: '',
        telefono: '',
        password: '',
        repetirPassword: ''
    });
    const [errorPasswords, setErrorPasswords] = useState('');

    const handleChange = (e) => {
        setDatos({ ...datos, [e.target.name]: e.target.value });
    };

    const handleRegistro = async (e) => {
        e.preventDefault();
        setErrorPasswords('');

        if (datos.password !== datos.repetirPassword) {
            setErrorPasswords('Las contraseñas no coinciden. Por favor, verificalas.');
            return;
        }

        // Armamos el objeto final sin la clave repetida
        const { repetirPassword, ...datosParaEnviar } = datos;

        try {
            await dispatch(register(datosParaEnviar)).unwrap();
            alert('¡Cuenta creada con éxito! Ya podés iniciar sesión.');
            navigate('/login');
        } catch {
            // El error ya queda guardado en el estado (authSlice) y se muestra abajo.
        }
    };

    const mensajeError = () => {
        if (errorPasswords) return errorPasswords;
        if (registerError === 409) return 'Ya existe una cuenta con ese email.';
        if (registerError === 400) return 'Revisá los datos ingresados.';
        if (registerError) return 'Ocurrió un error, intentá de nuevo.';
        return null;
    };

    return (
        <div className="page-wrap" style={{ maxWidth: '600px' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h1 className="page-title" style={{ marginBottom: '.5rem' }}>Crear Cuenta</h1>
                <p style={{ color: 'var(--texto-3)', fontSize: '.9rem' }}>Completá tus datos para sumarte a Conectar Laboulaye</p>
            </div>

            <div className="card-box">
                {mensajeError() && (
                    <p style={{ color: '#c0392b', fontSize: '.85rem', marginBottom: '1rem' }}>
                        {mensajeError()}
                    </p>
                )}
                <form onSubmit={handleRegistro}>

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
                            <input type="email" id="email" name="email" value={datos.email} onChange={handleChange} required />
                        </div>
                        <div className="field">
                            <label htmlFor="telefono">Teléfono</label>
                            <input type="tel" id="telefono" name="telefono" value={datos.telefono} onChange={handleChange} required />
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--borde)', margin: '1rem 0 1.5rem', paddingTop: '1rem' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Seguridad</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 1rem' }}>
                            <div className="field">
                                <label htmlFor="password">Contraseña</label>
                                <input type="password" id="password" name="password" value={datos.password} onChange={handleChange} required minLength="6" />
                            </div>
                            <div className="field">
                                <label htmlFor="repetirPassword">Repetir contraseña</label>
                                <input type="password" id="repetirPassword" name="repetirPassword" value={datos.repetirPassword} onChange={handleChange} required minLength="6" />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={registerStatus === 'loading'}>
                        {registerStatus === 'loading' ? 'Creando cuenta...' : 'Registrarme'}
                    </button>
                </form>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '.9rem' }}>
                <span style={{ color: 'var(--texto-2)' }}>¿Ya tenés una cuenta? </span>
                <Link to="/login" style={{ color: 'var(--brand-1)', fontWeight: '600' }}>Iniciá sesión</Link>
            </div>
        </div>
    );
};

export default Registro;