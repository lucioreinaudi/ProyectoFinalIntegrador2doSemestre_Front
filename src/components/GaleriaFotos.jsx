import { useEffect, useState } from 'react'
import Icon from './Icon'

// Fotos de un reclamo: miniaturas, y al tocar una se ve ampliada. Si el back
// todavia no manda la lista "fotos" pero si "fotoUrl" (reclamos viejos), usa esa.
const GaleriaFotos = ({ fotos, fotoUrl, titulo }) => {
    const lista = fotos?.length ? fotos : (fotoUrl ? [fotoUrl] : [])
    const [abierta, setAbierta] = useState(null)

    // Esc cierra la foto ampliada.
    useEffect(() => {
        if (abierta === null) return
        const alTeclear = (e) => { if (e.key === 'Escape') setAbierta(null) }
        window.addEventListener('keydown', alTeclear)
        return () => window.removeEventListener('keydown', alTeclear)
    }, [abierta])

    if (lista.length === 0) return null

    const mover = (paso) => setAbierta((i) => (i + paso + lista.length) % lista.length)

    return (
        <>
            <ul className="galeria-fotos">
                {lista.map((url, i) => (
                    <li key={url}>
                        <button
                            type="button"
                            onClick={() => setAbierta(i)}
                            aria-label={`Ampliar foto ${i + 1} de ${lista.length}`}
                        >
                            <img src={url} alt={`Foto ${i + 1} del reclamo ${titulo || ''}`} loading="lazy" />
                        </button>
                    </li>
                ))}
            </ul>

            {abierta !== null && (
                <div
                    className="galeria-visor"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Foto ampliada"
                    onClick={() => setAbierta(null)}
                >
                    <button type="button" className="galeria-cerrar" onClick={() => setAbierta(null)} aria-label="Cerrar">
                        <Icon name="x" size={22} />
                    </button>
                    <img
                        src={lista[abierta]}
                        alt={`Foto ${abierta + 1} del reclamo ${titulo || ''}`}
                        onClick={(e) => e.stopPropagation()}
                    />
                    {lista.length > 1 && (
                        <div className="galeria-nav" onClick={(e) => e.stopPropagation()}>
                            <button type="button" onClick={() => mover(-1)}>Anterior</button>
                            <span>{abierta + 1} / {lista.length}</span>
                            <button type="button" onClick={() => mover(1)}>Siguiente</button>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default GaleriaFotos
