import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import LocationPicker from '../components/LocationPicker';

const TIPOS_RECLAMO = ['Calle anegada', 'Corte de luz', 'Árbol caído', 'Calle inundada', 'Otro'];

const NuevoReporte = () => {
    const navigate = useNavigate();

    const [tipo, setTipo] = useState('');
    const [tipoOtro, setTipoOtro] = useState(''); // <-- Nuevo estado para el input libre
    const [desc, setDesc] = useState('');
    const [coordenadas, setCoordenadas] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validaciones
        if (!tipo) {
            alert('Por favor, seleccioná un tipo de problema.'); return;
        }
        if (tipo === 'Otro' && tipoOtro.trim() === '') {
            alert('Por favor, especificá de qué se trata el problema.'); return;
        }
        if (!coordenadas) {
            alert('Por favor, marcá la ubicación en el mapa.'); return;
        }
        if (!desc) {
            alert('Por favor, agregá una descripción breve.'); return;
        }

        // Si seleccionó "Otro", mandamos lo que escribió en el input. Si no, mandamos el botón que tocó.
        const tipoFinal = tipo === 'Otro' ? tipoOtro : tipo;

        console.log("Datos para el Back:", {
            tipo: tipoFinal,
            lat: coordenadas.lat,
            lng: coordenadas.lng,
            desc
        });

        alert('¡Reporte enviado correctamente!');
        navigate('/mis-reportes');
    };

    return (
        <div className="page-wrap">
            <h1 className="page-title">Reportar un problema</h1>
            <p style={{ marginTop: '-.9rem', color: 'var(--texto-3)', fontSize: '.9rem', marginBottom: '1.5rem' }}>
                Podés reportar sin crear una cuenta. Cuanta más información nos des, más rápido podemos actuar.
            </p>

            <form onSubmit={handleSubmit}>

                {/* TIPO DE PROBLEMA */}
                <div className="field">
                    <label>Tipo de problema</label>
                    <div className="chip-select" role="group">
                        {TIPOS_RECLAMO.map((t) => (
                            <button
                                key={t}
                                type="button"
                                className="chip-option"
                                aria-pressed={tipo === t}
                                onClick={() => setTipo(t)}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* INPUT CONDICIONAL SI ELIGE "OTRO" */}
                {tipo === 'Otro' && (
                    <div className="field" style={{ marginTop: '0.5rem', animation: 'fadeIn 0.3s' }}>
                        <label htmlFor="tipo-otro">Especificá el problema</label>
                        <input
                            type="text"
                            id="tipo-otro"
                            placeholder="Ej: Semáforo roto, caño de agua..."
                            value={tipoOtro}
                            onChange={(e) => setTipoOtro(e.target.value)}
                            autoFocus
                        />
                    </div>
                )}

                {/* UBICACIÓN EXACTA (MAPA) */}
                <div className="field" style={{ position: 'relative', zIndex: 1 }}>
                    <label>Ubicación exacta</label>
                    <LocationPicker position={coordenadas} setPosition={setCoordenadas} />
                </div>

                {/* DESCRIPCIÓN */}
                <div className="field">
                    <label htmlFor="reclamo-desc">Descripción detallada</label>
                    <textarea
                        id="reclamo-desc"
                        placeholder="Contanos qué está pasando y dónde exactamente…"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                    ></textarea>
                </div>

                {/* FOTO */}
                <div className="field">
                    <label>Foto (opcional)</label>
                    <button type="button" className="photo-drop" onClick={() => alert('Próximamente...')}>
                        <span style={{ display: 'inline-flex', margin: '0 auto .4rem' }}>
                            <Icon name="camera" size={28} />
                        </span>
                        <div>Tocá para agregar una foto</div>
                    </button>
                </div>

                <button type="submit" className="btn btn-primary btn-lg btn-block" style={{ marginTop: '1rem' }}>
                    Enviar reporte
                </button>
            </form>
        </div>
    );
};

export default NuevoReporte;