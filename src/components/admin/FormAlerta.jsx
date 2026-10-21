import { useState } from 'react';
import { mensajeDeError } from '../../api/errores';
import { NIVELES } from '../../features/alertas/alertas';
import useTiposAlerta from '../../features/alertas/tiposAlerta';
import SelectorImagenAlerta from './SelectorImagenAlerta';

// Formulario de alerta, reutilizado para crear, editar y "publicar reclamo como
// alerta nueva". onGuardar(datos) devuelve una promesa: si falla, se muestra el
// mensaje del back sin perder lo que se escribio.
// fotosReclamo: fotos del reclamo que se pueden elegir como imagen (solo al publicar).
// extra: contenido adicional antes de los botones.
const FormAlerta = ({ inicial, zonas, textoBoton, onGuardar, onCancelar, extra, fotosReclamo = [] }) => {
    const [datos, setDatos] = useState(inicial);
    const [enviando, setEnviando] = useState(false);
    const [subiendoImagen, setSubiendoImagen] = useState(false);
    const tiposAlerta = useTiposAlerta();
    // Solo los activos; el que ya tenia la alerta se muestra aunque este dado de baja.
    const tiposVisibles = tiposAlerta.filter((t) => t.activa || t.clave === inicial.tipo);
    const [error, setError] = useState(null);

    const cambiar = (campo, valor) => setDatos((prev) => ({ ...prev, [campo]: valor }));

    // Solo zonas activas (Q29). Si se esta editando una alerta cuya zona despues
    // se dio de baja, esa zona se sigue mostrando (el back lo permite si no se mueve).
    const zonasVisibles = zonas.filter((z) => z.activa !== false || String(z.id) === String(inicial.zonaId));

    const enviar = async (e) => {
        e.preventDefault();
        setError(null);
        setEnviando(true);
        try {
            await onGuardar(datos);
        } catch (err) {
            setError(mensajeDeError(err, 'No se pudo guardar la alerta'));
            setEnviando(false);
        }
    };

    return (
        <form className="admin-form" onSubmit={enviar}>
            <label className="admin-campo">
                Título
                <input type="text" required maxLength={150} value={datos.titulo}
                    onChange={(e) => cambiar('titulo', e.target.value)} placeholder="Ej: Calle cortada por obras" />
            </label>

            <div className="admin-form-fila">
                <label className="admin-campo">
                    Nivel de gravedad
                    <select value={datos.nivelGravedad} onChange={(e) => cambiar('nivelGravedad', e.target.value)}>
                        {NIVELES.map((n) => <option key={n.valor} value={n.valor}>{n.label}</option>)}
                    </select>
                </label>
                <label className="admin-campo">
                    Tipo
                    <select value={datos.tipo} onChange={(e) => cambiar('tipo', e.target.value)}>
                        {tiposVisibles.length === 0 && <option value={datos.tipo}>{datos.tipo}</option>}
                        {tiposVisibles.map((t) => (
                            <option key={t.clave} value={t.clave}>{t.activa ? t.nombre : `${t.nombre} (dado de baja)`}</option>
                        ))}
                    </select>
                </label>
                <label className="admin-campo">
                    Zona
                    <select required value={datos.zonaId} onChange={(e) => cambiar('zonaId', e.target.value)}>
                        <option value="">Elegí una zona...</option>
                        {zonasVisibles.map((z) => (
                            <option key={z.id} value={z.id}>{z.activa === false ? `${z.nombre} (dada de baja)` : z.nombre}</option>
                        ))}
                    </select>
                </label>
            </div>

            <label className="admin-campo">
                Descripción
                <textarea rows="4" required value={datos.descripcion}
                    onChange={(e) => cambiar('descripcion', e.target.value)} placeholder="Qué está pasando (esto lo ven los vecinos)" />
            </label>

            <label className="admin-campo">
                Recomendaciones (opcional)
                <textarea rows="2" value={datos.recomendaciones}
                    onChange={(e) => cambiar('recomendaciones', e.target.value)} placeholder="Ej: Evitar circular por la zona" />
            </label>

            <SelectorImagenAlerta
                imagenUrl={datos.imagenUrl}
                onChange={(url) => cambiar('imagenUrl', url)}
                fotosReclamo={fotosReclamo}
                onSubiendo={setSubiendoImagen}
            />

            {extra}

            {error && <div className="aviso error">{error}</div>}

            <div className="admin-reclamo-acciones">
                <button type="submit" className="btn btn-primary btn-chico" disabled={enviando || subiendoImagen}>
                    {enviando ? 'Guardando...' : textoBoton}
                </button>
                {onCancelar && (
                    <button type="button" className="btn btn-outline btn-chico" onClick={onCancelar} disabled={enviando}>
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
};

export default FormAlerta;
