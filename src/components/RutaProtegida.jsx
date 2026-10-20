import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUsuario } from '../features/auth/authSlice';
import { rutaInicio } from '../features/auth/rutasPorRol';

// Envuelve una ruta para que solo la pueda ver un rol (ej. rol="municipio").
// - Sin sesion: manda al login, recordando a donde queria ir (state.desde),
//   para volver ahi despues de loguearse.
// - Con sesion pero otro rol: lo manda a la pantalla de inicio de SU rol.
//
// Ojo: esto es solo experiencia de usuario. La proteccion real esta en el back
// (SecurityConfig), que rechaza el pedido aunque alguien llame a la API directo.
const RutaProtegida = ({ rol, children }) => {
    const usuario = useSelector(selectUsuario);
    const location = useLocation();

    if (!usuario) {
        return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
    }

    if (usuario.rol !== rol) {
        return <Navigate to={rutaInicio(usuario)} replace />;
    }

    return children;
};

export default RutaProtegida;
