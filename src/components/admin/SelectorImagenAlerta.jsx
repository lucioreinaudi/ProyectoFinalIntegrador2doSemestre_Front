import { useRef, useState } from 'react';
import { mensajeDeError } from '../../api/errores';
import { subirImagenAlerta } from '../../features/alertas/imagen';
import { MAX_MB, TIPOS_FOTO, validarFoto } from '../../features/reclamos/fotos';
import Icon from '../Icon';

// Imagen de una alerta, elegida por el municipio (Q26). Tres opciones:
// - una de las fotos del reclamo (solo al publicar; ya estan en Supabase),
// - una imagen subida desde su computadora (se sube al elegirla),
// - ninguna: el Home usa la imagen de referencia segun el tipo de alerta.
// onSubiendo(true/false) avisa al formulario para que no se guarde a mitad de una subida.
// titulo, textoSinImagen y subir permiten reutilizarlo para la imagen de un tipo de
// alerta (subir: la funcion que sube el archivo y devuelve su URL).
const SelectorImagenAlerta = ({
    imagenUrl, onChange, fotosReclamo = [], onSubiendo, subir = subirImagenAlerta,
    titulo = 'Imagen de la alerta',
    textoSinImagen = 'Sin imagen: en el Home se muestra la imagen de referencia según el tipo.',
}) => {
    const inputRef = useRef(null);
    const [subiendo, setSubiendo] = useState(false);
    const [error, setError] = useState(null);

    const elegirArchivo = async (e) => {
        const archivo = e.target.files?.[0];
        e.target.value = ''; // permite volver a elegir el mismo archivo
        if (!archivo) return;

        const motivo = validarFoto(archivo);
        if (motivo) {
            setError(motivo);
            return;
        }
        setError(null);
        setSubiendo(true);
        onSubiendo?.(true);
        try {
            onChange(await subir(archivo));
        } catch (err) {
            setError(mensajeDeError(err, 'No se pudo subir la imagen'));
        } finally {
            setSubiendo(false);
            onSubiendo?.(false);
        }
    };

    const esDelReclamo = imagenUrl && fotosReclamo.includes(imagenUrl);

    return (
        <div className="admin-campo">
            {titulo}

            <div className="imagen-alerta">
                {imagenUrl ? (
                    <div className="imagen-alerta-actual">
                        <img src={imagenUrl} alt="Imagen elegida para la alerta" />
                        <div>
                            <span className="admin-reclamo-meta">
                                {esDelReclamo ? 'Foto del reclamo' : 'Imagen elegida'}
                            </span>
                            <button type="button" className="link-btn" onClick={() => onChange(null)} disabled={subiendo}>
                                Quitar imagen
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="detalle-vacio">{textoSinImagen}</p>
                )}

                {fotosReclamo.length > 0 && (
                    <div>
                        <span className="admin-reclamo-meta">Usar una foto del reclamo:</span>
                        <ul className="imagen-alerta-opciones">
                            {fotosReclamo.map((url, i) => (
                                <li key={url}>
                                    <button
                                        type="button"
                                        aria-pressed={imagenUrl === url}
                                        aria-label={`Usar la foto ${i + 1} del reclamo`}
                                        onClick={() => onChange(url)}
                                        disabled={subiendo}
                                    >
                                        <img src={url} alt="" loading="lazy" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <input ref={inputRef} type="file" accept={TIPOS_FOTO.join(',')} hidden onChange={elegirArchivo} />
                <button type="button" className="btn btn-outline btn-chico" onClick={() => inputRef.current?.click()} disabled={subiendo}>
                    <Icon name="camera" size={16} /> {subiendo ? 'Subiendo imagen...' : 'Subir desde tu computadora'}
                </button>
                <span className="admin-reclamo-meta">JPG, PNG o WEBP · hasta {MAX_MB} MB</span>

                {error && <div className="aviso error" role="alert">{error}</div>}
            </div>
        </div>
    );
};

export default SelectorImagenAlerta;
