import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import NuevoReporte from './pages/NuevoReporte';
import MisReportes from './pages/MisReportes';
import MiCuenta from './pages/MiCuenta';
import InfoUtil from './pages/InfoUtil'; // <-- Acá está el import

import './styles/main.scss';

function App() {
    return (
        <BrowserRouter>
            <TopBar />
            <main id="contenido-principal">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/reporte" element={<NuevoReporte />} />
                    <Route path="/mis-reportes" element={<MisReportes />} />
                    <Route path="/cuenta" element={<MiCuenta />} />
                    <Route path="/info" element={<InfoUtil />} /> {/* <-- Acá está la ruta */}
                </Routes>
            </main>
            <BottomNav />
        </BrowserRouter>
    );
}

export default App;