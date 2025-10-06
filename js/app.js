document.addEventListener('DOMContentLoaded', () => {

    const languageSwitcher = document.getElementById('lang-switcher');

    // Función para cargar los archivos JSON de idioma
    const fetchTranslations = async (lang) => {
        try {
            const response = await fetch(`lang/navbar_${lang}.json`);
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo de idioma: navbar_${lang}.json`);
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            return null; // Devuelve null si hay un error
        }
    };

    // Función para aplicar las traducciones (la misma que antes)
    const applyTranslations = (translations) => {
        if (!translations) return; // No hacer nada si no hay traducciones
        
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            const translation = key.split('.').reduce((obj, i) => (obj ? obj[i] : null), translations);
            if (translation) {
                element.textContent = translation;
            }
        });
    };

    // Función principal para cambiar y guardar el idioma
    const changeLanguage = async (lang) => {
        // Guarda el idioma seleccionado en localStorage
        localStorage.setItem('language', lang);
        
        // Actualiza el valor del desplegable para que muestre el idioma actual
        languageSwitcher.value = lang;
        
        // Carga y aplica las traducciones
        const translations = await fetchTranslations(lang);
        applyTranslations(translations);
        
        // Actualiza el atributo 'lang' de la etiqueta <html>
        document.documentElement.lang = lang;
    };

    // Evento que se dispara cuando el usuario cambia la opción en el desplegable
    languageSwitcher.addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        changeLanguage(selectedLanguage);
    });

    // Función para inicializar el idioma al cargar la página
    const initializeLanguage = () => {
        // 1. Obtiene el idioma guardado en localStorage
        const savedLanguage = localStorage.getItem('language');
        
        // 2. Si no hay idioma guardado, detecta el del navegador
        //    (ej. "es-ES", "en-US"). Tomamos solo las dos primeras letras ("es", "en").
        const browserLanguage = navigator.language.slice(0, 2);

        // 3. Decide qué idioma usar: el guardado, el del navegador, o 'es' por defecto
        const currentLanguage = savedLanguage || browserLanguage || 'es';
        
        // Carga el idioma decidido
        changeLanguage(currentLanguage);
    };

    // Llama a la función de inicialización cuando la página carga
    initializeLanguage();
});