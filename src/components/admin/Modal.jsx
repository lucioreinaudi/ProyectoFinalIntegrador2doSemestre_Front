import { useEffect } from 'react';
import Icon from '../Icon';

// Modal generico del panel: se cierra con la X, con Escape o con un clic afuera.
const Modal = ({ titulo, onCerrar, children, ancho = '640px' }) => {
    useEffect(() => {
        const alApretar = (e) => { if (e.key === 'Escape') onCerrar(); };
        window.addEventListener('keydown', alApretar);
        return () => window.removeEventListener('keydown', alApretar);
    }, [onCerrar]);

    return (
        <div className="modal-fondo" onClick={onCerrar}>
            <div className="card-box modal-caja" style={{ maxWidth: ancho }} role="dialog" aria-modal="true"
                aria-label={titulo} onClick={(e) => e.stopPropagation()}>
                <div className="modal-head">
                    <h3>{titulo}</h3>
                    <button type="button" className="icon-btn" onClick={onCerrar} title="Cerrar" aria-label="Cerrar">
                        <Icon name="x" size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;
