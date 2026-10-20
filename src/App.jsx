import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Alertas from './pages/Alertas';
import DetalleAlerta from './pages/DetalleAlerta';
import NuevoReporte from './pages/NuevoReporte';
import MisReportes from './pages/MisReportes';
import MiCuenta from './pages/MiCuenta';
import InfoUtil from './pages/InfoUtil';
import AdminPanel from './pages/AdminPanel';
import RutaProtegida from './components/RutaProtegida';
import { ROL_MUNICIPIO, ROL_VECINO } from './features/auth/rutasPorRol';
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
                    <Route path="/alertas/:id" element={<DetalleAlerta />} />
                    {/* Solo vecinos: el municipio no reporta, no tiene "mis reportes" ni edita su perfil */}
                    <Route path="/reporte" element={<RutaProtegida rol={ROL_VECINO}><NuevoReporte /></RutaProtegida>} />
                    <Route path="/mis-reportes" element={<RutaProtegida rol={ROL_VECINO}><MisReportes /></RutaProtegida>} />
                    <Route path="/cuenta" element={<RutaProtegida rol={ROL_VECINO}><MiCuenta /></RutaProtegida>} />
                    <Route path="/info" element={<InfoUtil />} />
                    {/* El panel es solo para el municipio (sin sesion -> login, vecino -> Home) */}
                    <Route path="/admin" element={<RutaProtegida rol={ROL_MUNICIPIO}><AdminPanel /></RutaProtegida>} />

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