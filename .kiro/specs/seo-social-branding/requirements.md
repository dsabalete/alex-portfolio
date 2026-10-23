# Requirements Document

## Introduction

Este documento define los requisitos para mejorar el SEO, los metadatos de Open Graph y el branding social del sitio portafolio de Àlex Sabalete (Director · Editor · DOP). El sitio, construido con React 19 + TypeScript + Vite, ya cuenta con etiquetas SEO base en `index.html` (meta description, Open Graph completos, Twitter Cards y datos estructurados Schema.org JSON-LD) y un hook `useSEO` que actualiza dinámicamente el título y la descripción por ruta.

Sin embargo, existen brechas que esta especificación aborda:

- La misma imagen de previsualización OG (el póster del reel) se comparte en todas las rutas, sin imágenes relevantes por página.
- No existen URLs canónicas ni `og:url` por ruta, lo que puede generar problemas de contenido duplicado.
- Los datos estructurados JSON-LD están codificados de forma estática en `index.html` y pueden desincronizarse de `src/data/projects.json` (la única fuente de verdad de los proyectos).
- La página 404 (`NotFoundPage`) no gestiona el SEO ni indica a los buscadores que no debe indexarse.
- No hay una configuración centralizada de la URL base del sitio para construir URLs canónicas.

Esta especificación define requisitos para imágenes OG dinámicas por ruta, URLs canónicas, generación dinámica de datos estructurados desde una única fuente de verdad, y gestión de SEO en la página 404.

## Glossary

- **Portfolio_Site**: La aplicación React + TypeScript + Vite que renderiza el sitio portafolio de Àlex Sabalete.
- **SEO_Manager**: El hook/módulo responsable de gestionar dinámicamente los metadatos del `document.head` (título, descripción, etiquetas Open Graph, URLs canónicas y JSON-LD) en cada cambio de ruta. La implementación actual es el hook `useSEO`.
- **Structured_Data_Generator**: El módulo responsable de construir objetos Schema.org JSON-LD a partir de los datos de proyectos.
- **OG_Preview_Image**: La URL de la imagen de Open Graph mostrada en las tarjetas de previsualización de las plataformas sociales (WhatsApp, Telegram, LinkedIn, Instagram, X/Twitter) al compartir un enlace.
- **Canonical_URL**: El valor de la etiqueta `<link rel="canonical">` que indica a los motores de búsqueda la URL preferida de una página.
- **Project_Data**: La colección de entradas de proyectos definida en `src/data/projects.json`, que sirve como única fuente de verdad para la información de los proyectos.
- **Site_URL**: La URL base configurada del sitio portafolio, obtenida de la variable de entorno `VITE_SITE_URL`.
- **Route**: Una ruta de página dentro de la aplicación: `/` (HomePage), `/about` (AboutPage), `/contacte` (ContactePage), o cualquier ruta no coincidente (NotFoundPage).
- **Social_Platform**: Una plataforma que rendera tarjetas de previsualización de enlaces a partir de metadatos Open Graph, incluyendo WhatsApp, Telegram, LinkedIn, Instagram y X/Twitter.
- **JSON-LD**: El formato basado en JSON para codificar Linked Data, utilizado aquí para datos estructurados Schema.org embebidos en etiquetas `<script type="application/ld+json">`.
- **noindex**: La directiva `<meta name="robots" content="noindex">` que indica a los motores de búsqueda que no indexen una página.
- **Default_Reel_Poster**: La imagen póster por defecto del reel del portafolio alojada en Cloudinary (1200×630), utilizada como imagen OG de reserva cuando una ruta no define una imagen específica.

## Requirements

### Requirement 1: Imágenes de previsualización Open Graph dinámicas por ruta

**User Story:** Como visitante que comparte un enlace del portafolio en una plataforma social, quiero que la tarjeta de previsualización muestre una imagen relevante a la página compartida, para que el enlace sea visualmente atractivo y contextualmente apropiado.

#### Acceptance Criteria

1. WHEN el SEO_Manager se invoca con un valor de OG_Preview_Image para una Route, THE SEO_Manager SHALL establecer las etiquetas meta `og:image` y `twitter:image` a la URL de esa imagen.
2. WHEN el SEO_Manager se invoca sin un valor de OG_Preview_Image, THE SEO_Manager SHALL establecer las etiquetas meta `og:image` y `twitter:image` al Default_Reel_Poster.
3. WHEN la Route `/` (HomePage) se renderiza, THE Portfolio_Site SHALL proporcionar el Default_Reel_Poster como OG_Preview_Image para esa Route.
4. WHEN la Route `/about` (AboutPage) se renderiza, THE Portfolio_Site SHALL proporcionar la foto de perfil de Àlex Sabalete como OG_Preview_Image para esa Route, distinta del Default_Reel_Poster.
5. WHEN la Route cambia de una página a otra, THE SEO_Manager SHALL actualizar las etiquetas meta `og:image` y `twitter:image` para reflejar el OG_Preview_Image de la nueva Route.
6. WHEN el SEO_Manager establece un OG_Preview_Image, THE SEO_Manager SHALL también establecer las etiquetas meta `og:image:width` y `og:image:height` a 1200 y 630 respectivamente.

### Requirement 2: URLs canónicas y og:url

**User Story:** Como motor de búsqueda, quiero que cada página declare una URL canónica, para que se eviten problemas de contenido duplicado y se indexe la página correcta.

#### Acceptance Criteria

1. WHEN el SEO_Manager se invoca para una Route, THE SEO_Manager SHALL establecer una etiqueta `<link rel="canonical">` cuyo `href` sea el Site_URL concatenado con el path de la Route.
2. WHEN el SEO_Manager se invoca para una Route, THE SEO_Manager SHALL establecer la etiqueta meta `og:url` al Site_URL concatenado con el path de la Route.
3. WHEN la variable de entorno Site_URL no está configurada, THE SEO_Manager SHALL omitir la etiqueta Canonical_URL y la etiqueta `og:url` en lugar de emitir una URL malformada.
4. WHEN la Route cambia, THE SEO_Manager SHALL actualizar la Canonical_URL y la etiqueta `og:url` para reflejar el path de la nueva Route.
5. THE Portfolio_Site SHALL obtener el Site_URL de la variable de entorno `VITE_SITE_URL`.

### Requirement 3: Datos estructurados dinámicos desde una única fuente de verdad

**User Story:** Como motor de búsqueda, quiero datos estructurados que reflejen con precisión el portafolio actual de proyectos, para que los rich snippets y las entradas del knowledge graph sean correctos.

#### Acceptance Criteria

1. WHEN la Route `/` (HomePage) se renderiza, THE Structured_Data_Generator SHALL emitir un `ItemList` de Schema.org con entradas `CreativeWork` derivadas de Project_Data.
2. WHEN el Structured_Data_Generator construye el `ItemList`, THE Structured_Data_Generator SHALL leer el título, la descripción, la URL de imagen y el enlace de cada entrada desde Project_Data.
3. THE Structured_Data_Generator SHALL emitir una entrada `Person` de Schema.org y una entrada `WebSite` de Schema.org en cada Route.
4. WHEN la Route `/about` (AboutPage) se renderiza, THE Structured_Data_Generator SHALL emitir una entrada de datos estructurados `AboutPage` o `ProfilePage` de Schema.org que identifique a Àlex Sabalete.
5. WHEN la Route `/contacte` (ContactePage) se renderiza, THE Structured_Data_Generator SHALL emitir una entrada de datos estructurados `ContactPage` de Schema.org con la información de contacto (correo electrónico e Instagram).
6. WHEN la Route NotFoundPage se renderiza, THE Structured_Data_Generator SHALL emitir únicamente las entradas `Person` y `WebSite` sin los datos del portafolio de proyectos.
7. THE Structured_Data_Generator SHALL derivar todos los campos de los proyectos (título, descripción, URL de imagen y enlace) de Project_Data para mantener una única fuente de verdad.

### Requirement 4: Gestión de SEO en la página 404

**User Story:** Como motor de búsqueda, quiero que las páginas 404 queden excluidas de la indexación, para que las páginas inexistentes no aparezcan en los resultados de búsqueda.

#### Acceptance Criteria

1. WHEN la Route NotFoundPage se renderiza, THE SEO_Manager SHALL establecer el título del documento a un título específico de 404.
2. WHEN la Route NotFoundPage se renderiza, THE SEO_Manager SHALL establecer la meta descripción a una descripción específica de 404.
3. WHEN la Route NotFoundPage se renderiza, THE SEO_Manager SHALL establecer una etiqueta `<meta name="robots" content="noindex">` para impedir la indexación.
4. WHEN una Route distinta de NotFoundPage se renderiza tras una Route 404, THE SEO_Manager SHALL eliminar la directiva noindex del `document.head` para que las páginas válidas permanezcan indexables.

### Requirement 5: Preservación del comportamiento SEO existente

**User Story:** Como propietario del sitio, quiero que la funcionalidad SEO existente siga funcionando, para que el comportamiento actual de búsqueda y compartición social no se degrade.

#### Acceptance Criteria

1. WHEN el `document.head` ya contiene una etiqueta meta objetivo del SEO_Manager, THE SEO_Manager SHALL actualizar la etiqueta existente en su lugar en lugar de crear un duplicado.
2. WHEN el SEO_Manager necesita una etiqueta meta que no existe en el `document.head`, THE SEO_Manager SHALL crear la etiqueta y añadirla al `document.head`.
3. WHILE el Portfolio_Site se ejecuta en cualquier Route, THE SEO_Manager SHALL mantener las etiquetas meta `og:type`, `og:site_name`, `og:locale` y `og:locale:alternate` definidas en el `index.html` estático.
4. WHILE el Portfolio_Site se ejecuta en cualquier Route, THE Portfolio_Site SHALL mantener la etiqueta meta `twitter:card` con el valor `summary_large_image` definido en el `index.html` estático.
5. WHEN el SEO_Manager se invoca, THE SEO_Manager SHALL actualizar el título del documento, la meta descripción, `og:title`, `og:description`, `twitter:title` y `twitter:description` como en la implementación existente.

### Requirement 6: Consistencia de serialización de datos estructurados

**User Story:** Como desarrollador, quiero que la generación de datos estructurados sea consistente y reversible, para que la salida JSON-LD represente con precisión los datos de los proyectos.

#### Acceptance Criteria

1. WHEN el Structured_Data_Generator serializa Project_Data a JSON-LD, THE Structured_Data_Generator SHALL producir JSON válido que, al ser parseado de vuelta, produce una estructura equivalente a los campos originales de Project_Data (propiedad de round-trip).
2. WHEN el Structured_Data_Generator emite JSON-LD, THE Structured_Data_Generator SHALL producir JSON parseable por un parser JSON estándar sin errores de sintaxis.
3. WHEN Project_Data contiene títulos o descripciones con caracteres especiales, THE Structured_Data_Generator SHALL serializarlos de forma que el JSON resultante sea válido.
