import { Link } from 'react-router-dom';
import Icon from './Icon';
import { CONSEJOS } from '../data/consejos';

const Paso = ({ titulo, items, clase }) => (
    <div className={`consejo-paso ${clase}`}>
        <h3>{titulo}</h3>
        <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>
    </div>
);

const ConsejosSeguridad = () => (
    <div className="section">
        <div className="section-head">
            <div className="section-head-title-row">
                <span className="section-head-icon" style={{ background: 'var(--info-bg)', color: 'var(--brand-1)' }}><Icon name="shield" /></span>
                <div className="section-head-text">
                    <h2>Consejos de seguridad</h2>
                    <p>Tocá una tarjeta para ver qué hacer antes, durante y después.</p>
                </div>
            </div>
        </div>
        <div className="info-list">
            {CONSEJOS.map(c => (
                <details key={c.tit} className="consejo">
                    <summary className="info-item">
                        <span className="ii"><Icon name={c.icono} size={18} /></span>
                        <div><strong>{c.tit}</strong><span>{c.txt}</span></div>
                        <span className="consejo-chev"><Icon name="chevron" size={18} /></span>
                    </summary>
                    <div className="consejo-body">
                        <Paso titulo="Antes" items={c.antes} clase="antes" />
                        <Paso titulo="Durante" items={c.durante} clase="durante" />
                        <Paso titulo="Después" items={c.despues} clase="despues" />
                        <a className="consejo-llamar" href={`tel:${c.llamar.tel.replace(/[^0-9]/g, '')}`}>
                            <Icon name="phone" size={16} /> Llamar a {c.llamar.nombre}: <strong>{c.llamar.tel}</strong>
                        </a>
                    </div>
                </details>
            ))}
        </div>
        <Link to="/info" className="link-btn" style={{ marginTop: '.6rem' }}>Ver más información útil <Icon name="arrow-right" /></Link>
    </div>
);

export default ConsejosSeguridad;
