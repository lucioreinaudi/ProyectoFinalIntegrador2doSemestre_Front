import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '../components/Icon';
import { login } from '../features/auth/authSlice';
import { ROL_MUNICIPIO } from '../features/auth/rutasPorRol';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { status, error } = useSelector((state) => state.auth);
    const [credenciales, setCredenciales] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { usuario } = await dispatch(login(credenciales)).unwrap();
            // El municipio siempre va a su panel. El vecino vuelve a la pagina que
            // queria ver antes de que RutaProtegida lo mandara al login (o al Home).
            const destino = usuario.rol === ROL_MUNICIPIO ? '/admin' : (location.state?.desde || '/');
            navigate(destino, { replace: true });
        } catch {
            // El error ya queda guardado en el estado (authSlice) y se muestra abajo.
        }
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
                {error && (
                    <p style={{ color: '#c0392b', fontSize: '.85rem', marginBottom: '1rem' }}>
                        {error === 401 ? 'Email o contraseña incorrectos' : 'Ocurrió un error, intentá de nuevo'}
                    </p>
                )}
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

                    <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1.5rem' }} disabled={status === 'loading'}>
                        {status === 'loading' ? 'Ingresando...' : 'Ingresar'}
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