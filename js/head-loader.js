// js/head-loader.js - Unificación de recursos NO críticos
(function() {
    const head = document.head;
    const resources = `
        <link rel="stylesheet" href="lib/flaticon/font/flaticon.css">
        <link rel="stylesheet" href="css/fontello.css">

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" media="print" onload="this.media='all'">
        <link rel="stylesheet" href="lib/animate/animate.min.css" media="print" onload="this.media='all'">
        <link rel="stylesheet" href="lib/slick/slick.css" media="print" onload="this.media='all'">
        <link rel="stylesheet" href="lib/slick/slick-theme.css" media="print" onload="this.media='all'">
        <link rel="stylesheet" href="lib/lightbox/css/lightbox.min.css" media="print" onload="this.media='all'">
    `;
    head.insertAdjacentHTML('beforeend', resources);
})();