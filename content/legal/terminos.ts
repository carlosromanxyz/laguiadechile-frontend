import type { ILegalDocument } from "@/interfaces/legal";

/** Términos y condiciones de La Guía de Chile (texto plano, sin HTML). Borrador: los «[completar: …]» siguen pendientes de revisión legal. */
export const TERMS: ILegalDocument = {
  title: "Términos y condiciones",
  updatedAt: "2026-11-12",
  draft: true,
  intro:
    "Estos términos explican cómo funciona La Guía de Chile, qué puedes hacer en el sitio y qué esperamos de quienes publican. Léelos con calma: los aceptas al crear una cuenta.",
  sections: [
    {
      id: "quienes-somos",
      title: "Quiénes somos",
      paragraphs: [
        "La Guía de Chile es una guía digital de Chile. Reúne comercios, servicios, avisos clasificados, propiedades, eventos, lugares y noticias de todo el país, para que encuentres lo que buscas cerca de ti.",
        "La Guía de Chile es un proyecto personal, no una empresa. Lo administra una persona natural, [completar: nombre de la persona responsable]. En estos términos la llamamos «La Guía de Chile» o «nosotros».",
        "Puedes escribirnos desde la página Contacto o al correo laguiadechilecl at gmail.com.",
      ],
    },
    {
      id: "aceptacion",
      title: "Aceptación de estos términos",
      paragraphs: [
        "Puedes navegar por el sitio sin aceptar nada. Estos términos rigen para tu cuenta desde que la creas: al hacerlo, marcas la casilla que confirma que los leíste y los aceptas, junto con la Política de privacidad.",
        "Si no estás de acuerdo con ellos, no crees una cuenta.",
        "Para crear una cuenta debes tener al menos 18 años.",
      ],
    },
    {
      id: "que-ofrece",
      title: "Qué ofrece La Guía de Chile",
      paragraphs: [
        "Sin cuenta puedes buscar y ver todo lo publicado en el sitio. Con una cuenta, además, puedes guardar favoritos y publicar.",
        "Hoy usar el sitio y publicar no tiene costo.",
      ],
      bullets: [
        "Comercios y servicios, con su dirección, horario y datos de contacto.",
        "Avisos clasificados de venta, compra, arriendo, búsqueda u oferta.",
        "Propiedades en venta o arriendo.",
        "Eventos con fecha, lugar y precio.",
        "Lugares como atractivos, servicios públicos y de emergencia, ferias y mercados.",
        "Noticias.",
      ],
    },
    {
      id: "cuenta",
      title: "Tu cuenta",
      paragraphs: [
        "Para crear una cuenta te pedimos nombre, apellido, correo y una contraseña de al menos 8 caracteres. Usa datos reales: así podemos contactarte si hay un problema con lo que publicas.",
        "Tu contraseña es personal. Si crees que alguien más la conoce, cámbiala desde tu panel: al hacerlo se cierran las sesiones abiertas en otros dispositivos.",
        "Tu sesión dura hasta siete días o hasta que la cierres. Eres responsable de lo que se haga desde tu cuenta.",
        "Si quieres cerrar tu cuenta, pídelo desde Contacto.",
      ],
    },
    {
      id: "roles",
      title: "Roles",
      paragraphs: [
        "Toda cuenta parte como usuario. Cuando publicas por primera vez, tu cuenta suma el rol que corresponde a lo que publicaste: comercio, servicio, avisador, organizador de eventos, propietario o colaborador de lugares. Una misma cuenta puede tener varios roles.",
        "La Guía de Chile puede ajustar los roles de una cuenta.",
      ],
    },
    {
      id: "publicaciones",
      title: "Publicar en el sitio",
      paragraphs: [
        "Puedes publicar comercios, servicios, avisos clasificados, propiedades, eventos y lugares. Antes de aparecer en el sitio, cada publicación pasa por revisión.",
        "Revisamos lo que publicas y lo aprobamos o lo rechazamos. Si lo rechazamos, te indicamos el motivo en tu panel para que puedas corregirlo.",
        "Los avisos clasificados vencen a los 30 días de publicados.",
        "Desde tu panel puedes editar tus publicaciones y archivarlas para sacarlas del sitio. Si desarchivas una, vuelve a revisión antes de aparecer de nuevo.",
      ],
    },
    {
      id: "contenido",
      title: "Lo que publicas",
      paragraphs: [
        "Lo que publicas es tu responsabilidad: textos, precios, horarios, datos de contacto e imágenes. Debe ser verdadero, estar al día y referirse a algo que puedes ofrecer.",
        "No está permitido publicar:",
      ],
      bullets: [
        "Información falsa o engañosa, o precios y condiciones que no vas a respetar.",
        "Productos o servicios ilegales, o que requieran una autorización que no tienes.",
        "Contenido ofensivo, discriminatorio, violento o sexual.",
        "Datos personales de otras personas sin su permiso.",
        "Imágenes o textos de otros sin autorización, o que infrinjan derechos de autor o de marca.",
        "Publicaciones repetidas o hechas solo para desviar a otros sitios.",
      ],
    },
    {
      id: "moderacion",
      title: "Moderación",
      paragraphs: [
        "Podemos rechazar o retirar una publicación que no cumpla estos términos o la ley, aunque ya esté aprobada. Cuando la rechazamos, te indicamos el motivo.",
        "Revisar una publicación no significa que garanticemos lo que dice: la información la entrega quien publica.",
      ],
    },
    {
      id: "permiso-de-uso",
      title: "Permiso para mostrar tu contenido",
      paragraphs: [
        "Lo que publicas sigue siendo tuyo. Al publicarlo, nos das permiso gratuito y no exclusivo para guardarlo mientras tu cuenta exista, para mostrarlo en La Guía de Chile mientras siga publicado y para adaptar su formato a las distintas pantallas.",
        "Dejamos de mostrarlo cuando archivas la publicación o la retiramos. Lo seguimos guardando para que puedas recuperarlo, salvo que nos pidas borrarlo.",
      ],
    },
    {
      id: "imagenes",
      title: "Imágenes",
      paragraphs: [
        "Algunas fotos de ejemplo y de ciudades provienen de Wikimedia Commons y se usan bajo licencias Creative Commons o de dominio público. El autor y la licencia de cada una están en su página de Wikimedia Commons. Si eres autor de una imagen y quieres que corrijamos su atribución o la retiremos, escríbenos desde Contacto.",
        "Las imágenes que subes a tus publicaciones se guardan en el almacenamiento de archivos del sitio. Aceptamos JPG, PNG y WebP de hasta 5 MB cada una. Sube solo fotos tuyas o que tengas permiso de usar.",
      ],
    },
    {
      id: "tratos-con-terceros",
      title: "Tratos con comercios y anunciantes",
      paragraphs: [
        "La Guía de Chile muestra lo que otros publican. No vendemos los productos ni prestamos los servicios que aparecen en el sitio, ni participamos en lo que acuerdes con quien publica.",
        "Antes de comprar, arrendar o contratar, confirma los datos directamente con el comercio, el servicio o el anunciante.",
        "Si compras o contratas algo, tus derechos como consumidor frente a quien te vende o te presta el servicio siguen vigentes, según la Ley 19.496 sobre protección de los derechos de los consumidores.",
      ],
    },
    {
      id: "servicios-externos",
      title: "Contenido y servicios de terceros",
      paragraphs: [
        "Algunas páginas muestran información de terceros: mapas de Google Maps en las fichas, el clima de Open-Meteo, las farmacias de turno y resúmenes de Wikipedia. Esa información la entregan ellos y puede tener errores o retrasos.",
        "También enlazamos a sitios web y redes sociales que no son nuestros. Lo que pase en ellos se rige por sus propias condiciones.",
      ],
    },
    {
      id: "propiedad-intelectual",
      title: "Marca y diseño del sitio",
      paragraphs: [
        "El nombre La Guía de Chile, su logo y el diseño del sitio son de la persona que administra La Guía de Chile. No puedes usarlos sin nuestro permiso.",
        "Lo publicado por cada comercio, servicio o anunciante es de quien lo publicó.",
      ],
    },
    {
      id: "disponibilidad",
      title: "Disponibilidad y cambios en el sitio",
      paragraphs: [
        "Hacemos lo posible para que el sitio funcione siempre, pero puede haber cortes por mantención o fallas.",
        "Podemos agregar, cambiar o quitar funciones. Si un cambio afecta lo que publicaste, te lo diremos.",
      ],
    },
    {
      id: "responsabilidad",
      title: "Responsabilidad",
      paragraphs: [
        "En la medida en que la ley lo permita, no respondemos por lo que publican otras personas ni por los acuerdos que hagas con ellas.",
        "Nada de estos términos limita los derechos que la ley chilena te reconoce.",
      ],
    },
    {
      id: "cambios",
      title: "Cambios a estos términos",
      paragraphs: [
        "Podemos actualizar estos términos. La fecha de la última actualización aparece al inicio de esta página.",
        "Si el cambio es importante, te lo avisaremos en el sitio o por correo antes de que empiece a regir.",
      ],
    },
    {
      id: "ley-aplicable",
      title: "Ley aplicable",
      paragraphs: [
        "Estos términos se rigen por las leyes de Chile.",
        "Cualquier controversia se verá ante los tribunales de Chile, sin perjuicio de los derechos que la Ley 19.496 te da como consumidor, incluido demandar en el juzgado de policía local de tu domicilio.",
      ],
    },
    {
      id: "contacto",
      title: "Contacto",
      paragraphs: [
        "Si tienes dudas sobre estos términos o quieres reportar una publicación, escríbenos desde la página Contacto o al correo laguiadechilecl at gmail.com.",
      ],
    },
  ],
};
