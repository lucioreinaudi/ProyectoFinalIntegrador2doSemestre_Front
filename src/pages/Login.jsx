import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';

const Login = () => {
    const navigate = useNavigate();
    const [credenciales, setCredenciales] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Enviando credenciales al back:", credenciales);
        // Acá iría la lógica real contra tu API. Por ahora simulamos que entra:
        alert('¡Sesión iniciada con éxito!');
        navigate('/'); // Redirige al inicio
    };

    return (
        <div className="page-wrap" style={{ maxWidth: '400px', marginTop: '4rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'inline-flex', background: 'var(--brand-1)', color: 'white', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
                    <Icon name="user" size={32} />
                </div>
                <h1 className="page-title" style={{ marginBottom: '.5rem' }}>Iniciar Sesión</h1>
                <p style={{ color: 'var(--texto-3)', fontSize: '.9rem' }}>Ingresá a tu cuenta de Conectar Laboulaye</p>
            </div>

            <div className="card-box">
                <form onSubmit={handleLogin}>
                    <div className="field">
                        <label htmlFor="email">Correo electrónico</label>
                        <input type="email" id="email" name="email" value={credenciales.email} onChange={handleChange} required autoFocus />
                    </div>

                    <div className="field">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label htmlFor="password">Contraseña</label>
                            <button type="button" className="link-btn" style={{ fontSize: '.8rem', padding: 0 }} onClick={() => alert('Próximamente: Recuperar contraseña')}>
                                ¿Olvidaste tu clave?
                            </button>
                        </div>
                        <input type="password" id="password" name="password" value={credenciales.password} onChange={handleChange} required />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1.5rem' }}>
                        Ingresar
                    </button>
                </form>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '.9rem' }}>
                <span style={{ color: 'var(--texto-2)' }}>¿No tenés una cuenta? </span>
                <Link to="/registro" style={{ color: 'var(--brand-1)', fontWeight: '600' }}>Registrate acá</Link>
            </div>
        </div>
    );
};

export default Login;