import { useState } from 'react';
import api from '../../api/client';
import { mensajeDeError } from '../../api/errores';
import Modal from './Modal';

// Cambio de contrasena del municipio desde el panel (Q24): es la unica edicion
// de su cuenta. Reutiliza PUT /api/usuarios/me/password (el mismo de Mi Cuenta).
const CambiarPassword = ({ onCerrar }) => {
    const [datos, setDatos] = useState({ actual: '', nueva: '', repetir: '' });
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState(null);
    const [listo, setListo] = useState(false);

    const cambiar = (campo) => (e) => setDatos({ ...datos, [campo]: e.target.value });

    const enviar = async (e) => {
        e.preventDefault();
        setError(null);
        if (datos.nueva.length < 6) {
            setError('La contraseña nueva debe tener al menos 6 caracteres.');
            return;
        }
        if (datos.nueva !== datos.repetir) {
            setError('Las contraseñas nuevas no coinciden.');
            return;
        }
        setEnviando(true);
        try {
            await api.put('/api/usuarios/me/password', { passwordActual: datos.actual, passwordNueva: datos.nueva });
            setListo(true);
        } catch (err) {
            setError(mensajeDeError(err, 'No se pudo cambiar la contraseña'));
        } finally {
            setEnviando(false);
        }
    };

    return (
        <Modal titulo="Cambiar contraseña" onCerrar={onCerrar} ancho="440px">
            {listo ? (
                <div className="admin-form">
                    <div className="aviso ok">Contraseña actualizada. La próxima vez que ingreses, usá la nueva.</div>
                    <button type="button" className="btn btn-primary btn-chico" onClick={onCerrar}>Cerrar</button>
                </div>
            ) : (
                <form className="admin-form" onSubmit={enviar}>
                    <label className="admin-campo">
                        Contraseña actual
                        <input type="password" required autoComplete="current-password" value={datos.actual} onChange={cambiar('actual')} />
                    </label>
                    <label className="admin-campo">
                        Contraseña nueva
                        <input type="password" required minLength={6} autoComplete="new-password" value={datos.nueva} onChange={cambiar('nueva')} />
                    </label>
                    <label className="admin-campo">
                        Repetir contraseña nueva
                        <input type="password" required autoComplete="new-password" value={datos.repetir} onChange={cambiar('repetir')} />
                    </label>
                    {error && <div className="aviso error">{error}</div>}
                    <div className="admin-reclamo-acciones">
                        <button type="submit" className="btn btn-primary btn-chico" disabled={enviando}>
                            {enviando ? 'Guardando...' : 'Cambiar contraseña'}
                        </button>
                        <button type="button" className="btn btn-outline btn-chico" onClick={onCerrar} disabled={enviando}>Cancelar</button>
                    </div>
                </form>
            )}
        </Modal>
    );
};

export default CambiarPassword;
