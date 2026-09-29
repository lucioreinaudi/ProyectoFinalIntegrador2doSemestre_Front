import React from 'react';

const ICONS = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/>',
    plus: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    bell: '<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    a11y: '<circle cx="12" cy="4.5" r="1.8"/><path d="M4 8.5c3-1.2 13-1.2 16 0"/><path d="M12 9v5m0 0-3 7m3-7 3 7"/><path d="M9 12h6"/>',
    phone: '<path d="M5 4h3l2 5-2 1a12 12 0 0 0 6 6l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
    flame: '<path d="M12 3c1 3-2 4-2 7a4 4 0 0 0 8 0c0-2-1-3-1-3s2 2 2 6a7 7 0 1 1-14 0c0-5 4-6 7-10Z"/>',
    shield: '<path d="M12 3 5 6v6c0 5 3 7.5 7 9 4-1.5 7-4 7-9V6Z"/>',
    heart: '<path d="M12 20s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 5c-2.5 4.6-9.5 9-9.5 9Z"/><path d="M8 11h2l1.5-3 2 5 1-2H16"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1"/>',
    camera: '<path d="M4 8h3l1.5-2h7L17 8h3v11H4Z"/><circle cx="12" cy="13.5" r="3.2"/>',
    map: '<path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.3"/>',
    chevron: '<path d="m7 10 5 5 5-5"/>',
    left: '<path d="M15 5 8 12l7 7"/>',
    right: '<path d="M9 5l7 7-7 7"/>',
    'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.3 2.3L16 10"/>',
    share: '<circle cx="18" cy="5" r="2.2"/><circle cx="6" cy="12" r="2.2"/><circle cx="18" cy="19" r="2.2"/><path d="m8 10.7 8-4.4M8 13.3l8 4.4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8v.01"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    book: '<path d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5Z"/><path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5Z"/>',
    megaphone: '<path d="M3 11v2a2 2 0 0 0 2 2h1l2 5h2l-1-5h2l9 4V6l-9 4H6a2 2 0 0 0-2 2z"/>',
    'alert-triangle': '<path d="M12 4 2 20h20L12 4Z"/><path d="M12 10v4m0 3v.01"/>',
    'cloud-rain': '<path d="M7 16a4 4 0 0 1 .5-8 5.5 5.5 0 0 1 10.5 1.6A3.5 3.5 0 0 1 17.5 16Z"/><path d="M8 19v1M12 19v1M16 19v1"/>',
    wind: '<path d="M3 8h9.5a2.5 2.5 0 1 0-2-4"/><path d="M3 13h13.5a2.5 2.5 0 1 1-2 4"/><path d="M3 18h7"/>',
    zap: '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/>',
    tree: '<path d="M12 2 6 11h3l-4 6h5v5h4v-5h5l-4-6h3Z"/>',
    sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/>',
    filter: '<path d="M4 5h16M7 12h10M10 19h4"/>',
};

const Icon = ({ name, size = 20, className = '' }) => {
    const svgContent = ICONS[name];

    if (!svgContent) {
        console.warn(`Icono "${name}" no encontrado.`);
        return null;
    }

    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: svgContent }}
        />
    );
};

export default Icon;