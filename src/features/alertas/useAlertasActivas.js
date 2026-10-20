import { useEffect, useState } from 'react'
import api from '../../api/client'
import { alertaParaVista } from './alertas'

// Alertas activas para el Home y /alertas (GET /api/alertas/estado/activa, publico:
// se ven sin login). Las zonas del filtro salen de las mismas alertas, asi no hace
// falta pedir /api/zonas (que todavia exige sesion).
export default function useAlertasActivas() {
    const [estado, setEstado] = useState({ cargando: true, error: false, alertas: [] })

    useEffect(() => {
        let activo = true
        api.get('/api/alertas/estado/activa')
            .then((res) => {
                if (activo) setEstado({ cargando: false, error: false, alertas: res.data.map(alertaParaVista) })
            })
            .catch(() => {
                if (activo) setEstado({ cargando: false, error: true, alertas: [] })
            })
        return () => { activo = false }
    }, [])

    const zonas = [...new Set(estado.alertas.map((a) => a.zona))].sort()
    return { ...estado, zonas }
}
