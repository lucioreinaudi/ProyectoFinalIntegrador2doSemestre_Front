import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from './Icon'
import { MAX_FOTOS, MAX_MB, TIPOS_FOTO, validarFoto } from '../features/reclamos/fotos'

// Elige hasta MAX_FOTOS fotos (galeria o camara en el celular), con miniaturas y
// boton para quitar cada una. El estado vive en el padre: recibe y devuelve el
// arreglo de archivos.
const SelectorFotos = ({ fotos, setFotos, deshabilitado = false }) => {
    const inputRef = useRef(null)
    const [errores, setErrores] = useState([])

    // Las miniaturas usan URLs temporales que hay que liberar al cambiar o desmontar.
    const miniaturas = useMemo(() => fotos.map((f) => URL.createObjectURL(f)), [fotos])
    useEffect(() => () => miniaturas.forEach((url) => URL.revokeObjectURL(url)), [miniaturas])

    const agregar = (e) => {
        const nuevas = Array.from(e.target.files || [])
        e.target.value = '' // permite volver a elegir la misma foto
        if (nuevas.length === 0) return

        const problemas = []
        const validas = []
        nuevas.forEach((archivo) => {
            const motivo = validarFoto(archivo)
            if (motivo) problemas.push(motivo)
            else validas.push(archivo)
        })

        const lugar = MAX_FOTOS - fotos.length
        if (validas.length > lugar) {
            problemas.push(`Solo podés subir hasta ${MAX_FOTOS} fotos por reporte.`)
        }
        setErrores(problemas)
        if (lugar > 0 && validas.length > 0) setFotos([...fotos, ...validas.slice(0, lugar)])
    }

    const quitar = (indice) => {
        setErrores([])
        setFotos(fotos.filter((_, i) => i !== indice))
    }

    return (
        <div className="field">
            <label htmlFor="fotos-reclamo">Fotos (opcional, hasta {MAX_FOTOS})</label>

            <input
                ref={inputRef}
                id="fotos-reclamo"
                type="file"
                accept={TIPOS_FOTO.join(',')}
                multiple
                hidden
                onChange={agregar}
            />

            {fotos.length < MAX_FOTOS && (
                <button
                    type="button"
                    className="photo-drop"
                    onClick={() => inputRef.current?.click()}
                    disabled={deshabilitado}
                >
                    <span style={{ display: 'inline-flex', margin: '0 auto .4rem' }}>
                        <Icon name="camera" size={28} />
                    </span>
                    <div>{fotos.length === 0 ? 'Tocá para agregar fotos' : 'Agregar más fotos'}</div>
                    <div className="photo-drop-ayuda">JPG, PNG o WEBP · hasta {MAX_MB} MB cada una</div>
                </button>
            )}

            {fotos.length > 0 && (
                <ul className="fotos-previa">
                    {fotos.map((foto, i) => (
                        <li key={`${foto.name}-${foto.size}-${i}`} className="fotos-previa-item">
                            <img src={miniaturas[i]} alt={`Vista previa de ${foto.name}`} />
                            <button
                                type="button"
                                className="fotos-previa-quitar"
                                onClick={() => quitar(i)}
                                disabled={deshabilitado}
                                aria-label={`Quitar la foto ${foto.name}`}
                            >
                                <Icon name="x" size={16} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {errores.length > 0 && (
                <div className="aviso error" role="alert" style={{ marginTop: '.6rem', marginBottom: 0 }}>
                    {errores.map((e) => <div key={e}>{e}</div>)}
                </div>
            )}
        </div>
    )
}

export default SelectorFotos
