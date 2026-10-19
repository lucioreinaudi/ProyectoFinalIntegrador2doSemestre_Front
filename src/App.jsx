import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Alertas from './pages/Alertas';
import NuevoReporte from './pages/NuevoReporte';
import MisReportes from './pages/MisReportes';
import MiCuenta from './pages/MiCuenta';
import InfoUtil from './pages/InfoUtil';
import AdminPanel from './pages/AdminPanel';
import useAplicarPreferencias from './features/preferencias/useAplicarPreferencias';

// 1. Importamos las páginas de acceso
import Login from './pages/Login';
import Registro from './pages/Registro';

import './styles/main.scss';

function App() {
    useAplicarPreferencias();

    return (
        <BrowserRouter>
            <TopBar />
            <main id="contenido-principal" tabIndex={-1}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/alertas" element={<Alertas />} />
                    <Route path="/reporte" element={<NuevoReporte />} />
                    <Route path="/mis-reportes" element={<MisReportes />} />
                    <Route path="/cuenta" element={<MiCuenta />} />
                    <Route path="/info" element={<InfoUtil />} />
                    <Route path="/admin" element={<AdminPanel />} />

                    {/* 2. Agregamos las rutas */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/registro" element={<Registro />} />
                </Routes>
            </main>
            <BottomNav />
        </BrowserRouter>
    );
}

export default App;