import { useEffect, useState } from 'react'
import api from '../../api/client'

// Tipos de alerta (tormenta, viento, ... y los que agregue el municipio), que
// vienen del back (GET /api/tipos-alerta, publico) desde SCRUM-94.
// Se piden una sola vez y se comparten entre todos los componentes que los usan.
let pedido = null

export function cargarTiposAlerta() {
    if (!pedido) {
        pedido = api.get('/api/tipos-alerta')
            .then((res) => res.data)
            .catch((err) => { pedido = null; throw err })
    }
    return pedido
}

// Despues de crear o editar un tipo en Configuracion, para que el resto lo vuelva a pedir.
export function invalidarTiposAlerta() {
    pedido = null
}

export default function useTiposAlerta() {
    const [tipos, setTipos] = useState([])
    useEffect(() => {
        let activo = true
        cargarTiposAlerta()
            .then((datos) => { if (activo) setTipos(datos) })
            .catch(() => { /* sin la lista, se usan los valores por defecto de infoTipo */ })
        return () => { activo = false }
    }, [])
    return tipos
}

// Nombre, icono e imagen de referencia de un tipo, por su clave. Todas las
// imagenes viven en Supabase (se cargan desde Configuracion); si un tipo no tiene,
// se muestra su icono.
export function infoTipo(clave, tipos) {
    const tipo = tipos.find((t) => t.clave === clave)
    return {
        nombre: tipo?.nombre || clave,
        icono: tipo?.icono || 'alert-triangle',
        imagen: tipo?.imagenUrl || null,
    }
}

// Mismos iconos que acepta el back (TipoAlertaService.ICONOS).
export const ICONOS = [
    { valor: 'alert-triangle', label: 'Advertencia' },
    { valor: 'cloud-rain', label: 'Lluvia' },
    { valor: 'wind', label: 'Viento' },
    { valor: 'zap', label: 'Electricidad' },
    { valor: 'tree', label: 'Árbol' },
    { valor: 'flame', label: 'Fuego' },
    { valor: 'sun', label: 'Sol / calor' },
    { valor: 'moon', label: 'Noche' },
    { valor: 'shield', label: 'Seguridad' },
    { valor: 'info', label: 'Información' },
    { valor: 'megaphone', label: 'Aviso' },
    { valor: 'map', label: 'Mapa / calle' },
    { valor: 'building', label: 'Edificio' },
    { valor: 'heart', label: 'Salud' },
    { valor: 'phone', label: 'Teléfono' },
]
