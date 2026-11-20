# 💻 TechFans - Tienda Online de Tecnología

Este proyecto es un **Trabajo Práctico Integrador** de desarrollo web front-end. Simula una tienda online de productos tecnológicos y periféricos con estética pastel, diseño responsivo multipágina e interactividad completa mediante JavaScript.

---

## 🛠️ Funcionalidades y Requisitos Implementados

1. **Estructura Semántica y Multipágina:** Uso de `<header>`, `<nav>`, `<main>`, `<section>`, `<article>` y `<footer>`.
2. **Estilos y Diseño Responsivo (`styles.css`):**
   - Tipografías de **Google Fonts** (*Roboto*) y fondos con degradados lineales pastel.
   - Maquetación con **Flexbox** (catálogo de productos), **CSS Grid** (reseñas) y **Media Queries** (adaptación móvil).
3. **Interactividad con JavaScript (`script.js`):**
   - **Consumo de API REST (`fetch`):** Carga dinámica de productos tecnológicos desde *FakeStoreAPI* renderizados en tarjetas.
   - **Validación de Formulario:** Verificación en tiempo real de campos requeridos y formato de correo antes de enviar los datos a **Formspree**.
   - **Manipulación del DOM:** Actualización dinámica de vistas y notificaciones emergentes al interactuar con el sitio.
4. **Carrito de Compras Dinámico:**
   - Persistencia de datos mediante **`localStorage`** para conservar los productos al recargar o cerrar el navegador.
   - Contador de artículos en tiempo real en la barra de navegación.
   - Vista dedicada (`carrito.html`) para modificar cantidades (`+`/`-`), eliminar productos, vaciar el carrito y calcular el total automáticamente.
5. **SEO y Accesibilidad:**
   - Metaetiquetas (`description`, `keywords`, `author`) y títulos descriptivos en cada página.
   - Atributos `alt` en imágenes, etiquetas `aria-label` / `aria-live` y estilos `:focus-visible` para navegación por teclado.

---

## 📂 Estructura del Proyecto

```text
├── index.html          # Página de Inicio
├── productos.html      # Catálogo dinámico conectado a Fetch API
├── resenas.html        # Opiniones de clientes con CSS Grid
├── contacto.html       # Formulario validado con JS y Formspree
├── carrito.html        # Gestión y edición del carrito de compras
├── styles.css          # Estilos globales, responsivos y de accesibilidad
├── script.js           # Lógica de API, Carrito (localStorage) y Validaciones
├── README.md           # Documentación del proyecto
└── img/                # Recursos multimedia locales
```
