import { useEffect, useState } from 'react'
import api from '../../api/client'
import { alertaParaVista, ordenarPorPrioridad } from './alertas'

// Alertas activas para el Home y /alertas (GET /api/alertas/estado/activa, publico:
// se ven sin login). Vienen ordenadas por prioridad. Las zonas del filtro son las
// activas (GET /api/zonas, publico desde SCRUM-85); si ese pedido falla, se usan
// las zonas que aparecen en las alertas.
export default function useAlertasActivas() {
    const [estado, setEstado] = useState({ cargando: true, error: false, alertas: [] })
    const [zonasActivas, setZonasActivas] = useState(null)

    useEffect(() => {
        let activo = true
        api.get('/api/alertas/estado/activa')
            .then((res) => {
                if (activo) setEstado({ cargando: false, error: false, alertas: ordenarPorPrioridad(res.data.map(alertaParaVista)) })
            })
            .catch(() => {
                if (activo) setEstado({ cargando: false, error: true, alertas: [] })
            })
        api.get('/api/zonas')
            .then((res) => { if (activo) setZonasActivas(res.data.map((z) => z.nombre)) })
            .catch(() => { /* se usan las zonas de las alertas */ })
        return () => { activo = false }
    }, [])

    // Tambien se suman las zonas de las alertas, por si alguna esta en una zona
    // que despues se dio de baja (si no, no se podria filtrar por ella).
    const deLasAlertas = estado.alertas.map((a) => a.zona)
    const zonas = [...new Set([...(zonasActivas || []), ...deLasAlertas])].sort()
    return { ...estado, zonas }
}
