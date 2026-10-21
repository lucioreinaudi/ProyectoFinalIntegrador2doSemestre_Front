import { useEffect, useState } from 'react';
import api from '../../api/client';
import { mensajeDeError } from '../../api/errores';
import { ALERTA_VACIA, formularioABody } from '../../features/alertas/alertas';
import FormAlerta from './FormAlerta';

// Publicar un reclamo (Q18): crear una alerta nueva precargada con los datos del
// reclamo, o vincularlo a una alerta activa existente (para duplicados).
// El texto publico lo ajusta el municipio: nunca se publican datos del vecino ni
// las coordenadas exactas (Q10). Publicar no cambia el estado del reclamo.
const PublicarReclamo = ({ reclamo, zonas, onPublicado, onCancelar }) => {
    const [modo, setModo] = useState('nueva'); // 'nueva' | 'vincular'

    const [activas, setActivas] = useState(null);
    const [alertaId, setAlertaId] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState(null);

    // Alertas activas a las que todavia no esta vinculado.
    useEffect(() => {
        let activo = true;
        const yaVinculadas = new Set(reclamo.alertas.map((a) => a.id));
        api.get('/api/alertas/estado/activa')
            .then((res) => { if (activo) setActivas(res.data.filter((a) => !yaVinculadas.has(a.id))); })
            .catch(() => { if (activo) setActivas([]); });
        return () => { activo = false; };
    }, [reclamo.alertas]);

    // Precarga con el reclamo. Si su zona esta dada de baja, hay que elegir otra.
    const zonaDelReclamo = zonas.find((z) => z.id === reclamo.zonaId);
    const zonaDadaDeBaja = zonaDelReclamo?.activa === false;
    const inicial = {
        ...ALERTA_VACIA,
        titulo: reclamo.titulo.slice(0, 150),
        descripcion: reclamo.descripcion || '',
        zonaId: zonaDadaDeBaja ? '' : String(reclamo.zonaId),
    };

    // Fotos del reclamo que el municipio puede elegir como imagen de la alerta (Q26).
    // Reclamos viejos sin la lista "fotos" usan fotoUrl.
    const fotosReclamo = reclamo.fotos?.length ? reclamo.fotos : (reclamo.fotoUrl ? [reclamo.fotoUrl] : []);

    const publicarNueva = async (datos) => {
        await api.post(`/api/admin/reclamos/${reclamo.id}/publicar`, {
            alerta: formularioABody(datos),
        });
        onPublicado('Reclamo publicado como alerta nueva. Se le avisó al vecino.');
    };

    const vincular = async (e) => {
        e.preventDefault();
        setError(null);
        setEnviando(true);
        try {
            await api.post(`/api/admin/reclamos/${reclamo.id}/publicar`, { alertaId: Number(alertaId) });
            onPublicado('Reclamo vinculado a la alerta. Se le avisó al vecino.');
        } catch (err) {
            setError(mensajeDeError(err, 'No se pudo vincular el reclamo'));
            setEnviando(false);
        }
    };

    return (
        <div className="publicar-caja">
            <div className="seg-filtro" role="group" aria-label="Cómo publicar">
                <button type="button" aria-pressed={modo === 'nueva'} onClick={() => setModo('nueva')}>Crear alerta nueva</button>
                <button type="button" aria-pressed={modo === 'vincular'} onClick={() => setModo('vincular')}>Vincular a una existente</button>
            </div>

            {modo === 'nueva' && (
                <FormAlerta
                    inicial={inicial}
                    zonas={zonas}
                    textoBoton="Publicar"
                    onGuardar={publicarNueva}
                    onCancelar={onCancelar}
                    fotosReclamo={fotosReclamo}
                />
            )}

            {modo === 'vincular' && (
                <form className="admin-form" onSubmit={vincular}>
                    {activas === null && <p className="detalle-vacio">Cargando alertas activas...</p>}
                    {activas !== null && activas.length === 0 && (
                        <p className="detalle-vacio">No hay alertas activas a las que vincularlo. Creá una nueva.</p>
                    )}
                    {activas !== null && activas.length > 0 && (
                        <label className="admin-campo">
                            Alerta activa
                            <select required value={alertaId} onChange={(e) => setAlertaId(e.target.value)}>
                                <option value="">Elegí una alerta...</option>
                                {activas.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.titulo} · {a.zonaNombre} · nivel {a.nivelGravedad}
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}
                    {error && <div className="aviso error">{error}</div>}
                    <div className="admin-reclamo-acciones">
                        <button type="submit" className="btn btn-primary btn-chico" disabled={enviando || !alertaId}>
                            {enviando ? 'Vinculando...' : 'Vincular'}
                        </button>
                        <button type="button" className="btn btn-outline btn-chico" onClick={onCancelar} disabled={enviando}>
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default PublicarReclamo;
