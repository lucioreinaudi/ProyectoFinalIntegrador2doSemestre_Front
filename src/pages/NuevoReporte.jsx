import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '../components/Icon';
import LocationPicker from '../components/LocationPicker';
import api from '../api/client';
import { crearReclamo } from '../features/reclamos/reclamosSlice';

const NuevoReporte = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { crearStatus, crearError } = useSelector((state) => state.reclamos);

    // Zonas y categorias reales, traidas del back (antes eran una lista fija
    // inventada en el front, que no correspondia a ninguna fila real de la BD).
    const [zonas, setZonas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [cargandoCatalogos, setCargandoCatalogos] = useState(true);
    const [errorCatalogos, setErrorCatalogos] = useState(false);

    const [titulo, setTitulo] = useState('');
    const [zonaId, setZonaId] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [categoriaOtro, setCategoriaOtro] = useState('');
    const [desc, setDesc] = useState('');
    const [coordenadas, setCoordenadas] = useState(null);

    useEffect(() => {
        let activo = true;
        Promise.all([api.get('/api/zonas'), api.get('/api/categorias')])
            .then(([resZonas, resCategorias]) => {
                if (!activo) return;
                setZonas(resZonas.data);
                setCategorias(resCategorias.data);
            })
            .catch(() => {
                if (activo) setErrorCatalogos(true);
            })
            .finally(() => {
                if (activo) setCargandoCatalogos(false);
            });
        return () => { activo = false; };
    }, []);

    const categoriaSeleccionada = categorias.find((c) => String(c.id) === categoriaId);
    const esOtro = categoriaSeleccionada?.nombre?.toLowerCase() === 'otro';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!zonaId) {
            alert('Por favor, seleccioná una zona.'); return;
        }
        if (!categoriaId) {
            alert('Por favor, seleccioná un tipo de problema.'); return;
        }
        if (esOtro && categoriaOtro.trim() === '') {
            alert('Por favor, especificá de qué se trata el problema.'); return;
        }
        if (!coordenadas) {
            alert('Por favor, marcá la ubicación en el mapa.'); return;
        }
        if (!desc) {
            alert('Por favor, agregá una descripción breve.'); return;
        }

        // Si la categoria es "Otro", el titulo se arma con lo que escribio el
        // usuario (el campo Titulo si lo completo, o si no lo que puso al
        // especificar el problema) + "(Otro)" al lado, para que quede claro
        // para el admin que esa categoria no existe en el back todavia.
        // Si no es "Otro", el titulo es el campo Titulo, o si no el nombre
        // de la categoria elegida.
        let tituloFinal;
        if (esOtro) {
            // Aca el titulo general no aplica: el nombre de este reclamo es siempre
            // lo que se escribio en "Especifica el problema", para que no haya dos
            // campos compitiendo por lo mismo.
            tituloFinal = `${categoriaOtro.trim()} (Otro)`;
        } else {
            tituloFinal = titulo.trim() || categoriaSeleccionada.nombre;
        }

        try {
            await dispatch(crearReclamo({
                titulo: tituloFinal,
                descripcion: desc,
                // No hay columnas de lat/lng en Reclamo, asi que las coordenadas
                // se guardan como texto dentro de ubicacion.
                ubicacion: `Lat: ${coordenadas.lat}, Lng: ${coordenadas.lng}`,
                zonaId: Number(zonaId),
                categoriaId: Number(categoriaId),
            })).unwrap();
            alert('¡Reporte enviado correctamente!');
            navigate('/mis-reportes');
        } catch {
            // El error ya queda en el estado (reclamosSlice) y se muestra abajo.
        }
    };

    if (cargandoCatalogos) {
        return (
            <div className="page-wrap">
                <h1 className="page-title">Reportar un problema</h1>
                <p>Cargando...</p>
            </div>
        );
    }

    if (errorCatalogos) {
        return (
            <div className="page-wrap">
                <h1 className="page-title">Reportar un problema</h1>
                <p>No se pudieron cargar las zonas y categorías. Intentá de nuevo más tarde.</p>
            </div>
        );
    }

    return (
        <div className="page-wrap">
            <h1 className="page-title">Reportar un problema</h1>

            {crearError && (
                <p style={{ color: '#c0392b', fontSize: '.9rem', marginBottom: '1rem' }}>
                    No se pudo enviar el reporte. Intentá de nuevo.
                </p>
            )}

            <form onSubmit={handleSubmit}>

                {/* TITULO (opcional). No se muestra si la categoria es "Otro": ahi el
                    titulo sale de "Especifica el problema", para no tener dos campos
                    que hacen lo mismo. */}
                {!esOtro && (
                    <div className="field">
                        <label htmlFor="titulo">Título (opcional)</label>
                        <input
                            type="text"
                            id="titulo"
                            placeholder="Ej: Bache grande esquina San Martín y Belgrano"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                        />
                    </div>
                )}

                {/* ZONA */}
                <div className="field">
                    <label htmlFor="zona">Zona</label>
                    <select id="zona" value={zonaId} onChange={(e) => setZonaId(e.target.value)} required>
                        <option value="" disabled>Seleccioná una zona</option>
                        {zonas.map((z) => (
                            <option key={z.id} value={z.id}>{z.nombre}</option>
                        ))}
                    </select>
                </div>

                {/* TIPO DE PROBLEMA (categorias reales) */}
                <div className="field">
                    <label>Tipo de problema</label>
                    <div className="chip-select" role="group">
                        {categorias.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                className="chip-option"
                                aria-pressed={categoriaId === String(c.id)}
                                onClick={() => setCategoriaId(String(c.id))}
                            >
                                {c.nombre}
                            </button>
                        ))}
                    </div>
                </div>

                {/* INPUT CONDICIONAL SI ELIGE "OTRO" */}
                {esOtro && (
                    <div className="field" style={{ marginTop: '0.5rem', animation: 'fadeIn 0.3s' }}>
                        <label htmlFor="categoria-otro">Especificá el problema</label>
                        <input
                            type="text"
                            id="categoria-otro"
                            placeholder="Ej: Semáforo roto, caño de agua..."
                            value={categoriaOtro}
                            onChange={(e) => setCategoriaOtro(e.target.value)}
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

                <button type="submit" className="btn btn-primary btn-lg btn-block" style={{ marginTop: '1rem' }} disabled={crearStatus === 'loading'}>
                    {crearStatus === 'loading' ? 'Enviando...' : 'Enviar reporte'}
                </button>
            </form>
        </div>
    );
};

export default NuevoReporte;
