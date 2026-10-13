import { useEffect, useId, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from './Icon';
import {
    selectPreferencias,
    agrandarTexto,
    achicarTexto,
    alternarAltoContraste,
    alternarReducirMovimiento,
    alternarSubrayarEnlaces,
    restablecerAccesibilidad,
    TAMANOS_TEXTO,
} from '../features/preferencias/preferenciasSlice';

// Interruptor accesible (role="switch") reutilizado por cada opcion on/off
const Interruptor = ({ etiqueta, descripcion, activo, onCambiar }) => (
    <button
        type="button"
        role="switch"
        aria-checked={activo}
        className="a11y-opcion"
        onClick={onCambiar}
    >
        <span className="a11y-opcion-texto">
            <strong>{etiqueta}</strong>
            <small>{descripcion}</small>
        </span>
        <span className={`a11y-switch${activo ? ' activo' : ''}`} aria-hidden="true" />
    </button>
);

const PanelAccesibilidad = () => {
    const [abierto, setAbierto] = useState(false);
    const contenedorRef = useRef(null);
    const botonRef = useRef(null);
    const panelId = useId();
    const dispatch = useDispatch();
    const { tamanoTexto, altoContraste, reducirMovimiento, subrayarEnlaces } =
        useSelector(selectPreferencias);

    // Cerrar con Escape (devolviendo el foco al boton) o con click afuera
    useEffect(() => {
        if (!abierto) return;

        const alPresionarTecla = (e) => {
            if (e.key === 'Escape') {
                setAbierto(false);
                botonRef.current?.focus();
            }
        };
        const alHacerClick = (e) => {
            if (!contenedorRef.current?.contains(e.target)) setAbierto(false);
        };

        document.addEventListener('keydown', alPresionarTecla);
        document.addEventListener('mousedown', alHacerClick);
        return () => {
            document.removeEventListener('keydown', alPresionarTecla);
            document.removeEventListener('mousedown', alHacerClick);
        };
    }, [abierto]);

    const porcentaje = TAMANOS_TEXTO[tamanoTexto];

    return (
        <div className="a11y-contenedor" ref={contenedorRef}>
            <button
                ref={botonRef}
                type="button"
                className={`icon-btn wide${abierto ? ' activo' : ''}`}
                title="Accesibilidad"
                aria-label="Opciones de accesibilidad"
                aria-expanded={abierto}
                aria-controls={panelId}
                onClick={() => setAbierto((v) => !v)}
            >
                <Icon name="a11y" /><span className="a11y-label">Accesibilidad</span>
            </button>

            {abierto && (
                <div
                    id={panelId}
                    className="a11y-panel"
                    role="dialog"
                    aria-label="Opciones de accesibilidad"
                >
                    <div className="a11y-panel-header">
                        <h2>Accesibilidad</h2>
                        <button
                            type="button"
                            className="icon-btn"
                            aria-label="Cerrar opciones de accesibilidad"
                            onClick={() => { setAbierto(false); botonRef.current?.focus(); }}
                        >
                            <Icon name="x" size={18} />
                        </button>
                    </div>

                    <div className="a11y-texto" role="group" aria-label="Tamaño del texto">
                        <span className="a11y-opcion-texto">
                            <strong>Tamaño del texto</strong>
                            <small aria-live="polite">{porcentaje}%</small>
                        </span>
                        <div className="a11y-texto-botones">
                            <button
                                type="button"
                                onClick={() => dispatch(achicarTexto())}
                                disabled={tamanoTexto === 0}
                                aria-label="Achicar texto"
                            >
                                A−
                            </button>
                            <button
                                type="button"
                                onClick={() => dispatch(agrandarTexto())}
                                disabled={tamanoTexto === TAMANOS_TEXTO.length - 1}
                                aria-label="Agrandar texto"
                            >
                                A+
                            </button>
                        </div>
                    </div>

                    <Interruptor
                        etiqueta="Alto contraste"
                        descripcion="Textos y bordes más marcados"
                        activo={altoContraste}
                        onCambiar={() => dispatch(alternarAltoContraste())}
                    />
                    <Interruptor
                        etiqueta="Reducir animaciones"
                        descripcion="Quita transiciones y movimientos"
                        activo={reducirMovimiento}
                        onCambiar={() => dispatch(alternarReducirMovimiento())}
                    />
                    <Interruptor
                        etiqueta="Subrayar enlaces"
                        descripcion="Hace más fácil distinguir los links"
                        activo={subrayarEnlaces}
                        onCambiar={() => dispatch(alternarSubrayarEnlaces())}
                    />

                    <button
                        type="button"
                        className="a11y-restablecer"
                        onClick={() => dispatch(restablecerAccesibilidad())}
                    >
                        Restablecer
                    </button>
                </div>
            )}
        </div>
    );
};

export default PanelAccesibilidad;
