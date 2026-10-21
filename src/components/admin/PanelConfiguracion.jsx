import ListaCatalogo from './ListaCatalogo';

// Pestana Configuracion (Q12, seccion 7.2): zonas y categorias.
// Dar de baja = desaparecen de "Reportar problema" y de los formularios del panel,
// pero siguen en los filtros y en los reclamos/alertas que ya las usan (Q16, Q29).
const PanelConfiguracion = () => (
    <div>
        <p className="admin-ayuda">
            Las zonas y categorías no se borran: al darlas de baja dejan de aparecer al reportar un problema
            y en los formularios del panel, pero los reclamos y alertas que ya las usan no cambian.
        </p>
        <div className="configuracion-grid">
            <ListaCatalogo tipo="zonas" titulo="Zonas" singular="Zona" conDescripcion />
            <ListaCatalogo tipo="categorias" titulo="Categorías" singular="Categoría" />
        </div>
    </div>
);

export default PanelConfiguracion;
