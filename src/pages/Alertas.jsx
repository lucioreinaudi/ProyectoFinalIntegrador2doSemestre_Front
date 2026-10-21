import { useState } from 'react';
import AlertsList from '../components/AlertsList';
import useAlertasActivas from '../features/alertas/useAlertasActivas';

const Alertas = () => {
    const [filtroZona, setFiltroZona] = useState('todas');
    const [filtroNivel, setFiltroNivel] = useState('todos');

    // Alertas reales del back (publicas, se ven sin login).
    const { alertas, zonas, cargando, error } = useAlertasActivas();

    const alertasFiltradas = alertas.filter(a =>
        (filtroZona === 'todas' || a.zona === filtroZona) &&
        (filtroNivel === 'todos' || a.nivel === filtroNivel)
    );

    return (
        // Mismo ancho que el Home (.content), no el angosto de las paginas de formulario.
        <div className="page-wrap alertas-wrap">
            <div className="alertas-encabezado">
                <div>
                    <h1 className="page-title">Todas las alertas</h1>
                    <p>Alertas activas en Laboulaye. Filtrá por zona o por nivel de gravedad.</p>
                </div>
                {!cargando && !error && (
                    <span className="alertas-total">
                        {alertasFiltradas.length} alerta{alertasFiltradas.length === 1 ? '' : 's'}
                        {alertasFiltradas.length !== alertas.length && ` de ${alertas.length}`}
                    </span>
                )}
            </div>

            <div className="filtros" role="group" aria-label="Filtrar alertas">
                <select
                    aria-label="Filtrar por zona"
                    value={filtroZona}
                    onChange={(e) => setFiltroZona(e.target.value)}
                >
                    <option value="todas">Todas las zonas</option>
                    {zonas.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
                <div className="seg-filtro" role="group" aria-label="Filtrar por nivel de gravedad">
                    <button aria-pressed={filtroNivel === 'todos'} onClick={() => setFiltroNivel('todos')}>Todos</button>
                    <button aria-pressed={filtroNivel === 'alto'} onClick={() => setFiltroNivel('alto')}>Alto</button>
                    <button aria-pressed={filtroNivel === 'medio'} onClick={() => setFiltroNivel('medio')}>Medio</button>
                    <button aria-pressed={filtroNivel === 'bajo'} onClick={() => setFiltroNivel('bajo')}>Bajo</button>
                </div>
            </div>

            {/* De a 10. El key reinicia "Mostrar mas" al cambiar un filtro */}
            <AlertsList
                key={`${filtroZona}-${filtroNivel}`}
                alertas={alertasFiltradas}
                cargando={cargando}
                error={error}
                cantidadInicial={10}
            />
        </div>
    );
};

export default Alertas;
