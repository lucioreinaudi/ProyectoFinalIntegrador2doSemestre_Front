import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectPreferencias, TAMANOS_TEXTO } from './preferenciasSlice'

// Refleja las preferencias en el <html> como atributos data-*,
// y los estilos de main.scss reaccionan a esos atributos.
const useAplicarPreferencias = () => {
    const { tema, tamanoTexto, altoContraste, reducirMovimiento, subrayarEnlaces } =
        useSelector(selectPreferencias)

    useEffect(() => {
        const html = document.documentElement
        html.dataset.theme = tema === 'oscuro' ? 'dark' : 'light'
        html.style.fontSize = `${TAMANOS_TEXTO[tamanoTexto]}%`
        html.toggleAttribute('data-alto-contraste', altoContraste)
        html.toggleAttribute('data-reducir-movimiento', reducirMovimiento)
        html.toggleAttribute('data-subrayar-enlaces', subrayarEnlaces)
    }, [tema, tamanoTexto, altoContraste, reducirMovimiento, subrayarEnlaces])
}

export default useAplicarPreferencias
