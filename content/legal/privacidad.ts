import type { ILegalDocument } from "@/interfaces/legal";

/** Política de privacidad de La Guía de Chile (texto plano, sin HTML). Borrador: los «[completar: …]» siguen pendientes de revisión legal. */
export const PRIVACY: ILegalDocument = {
  title: "Política de privacidad",
  updatedAt: "2026-11-12",
  draft: true,
  intro:
    "Aquí te contamos qué datos tuyos guardamos, para qué los usamos, con quién los compartimos y cómo puedes acceder a ellos, corregirlos o pedir que los borremos. Esta política sigue la Ley 19.628 sobre protección de datos personales, con los cambios de la Ley 21.719.",
  sections: [
    {
      id: "responsable",
      title: "Quién es responsable de tus datos",
      paragraphs: [
        "El responsable de tus datos es [completar: razón social], RUT [completar: RUT], con domicilio en [completar: domicilio postal].",
        "Su representante legal es [completar: nombre del representante legal]. [completar: si existe, nombre del encargado de prevención o delegado de protección de datos; si no, borrar esta frase].",
        "Para cualquier consulta sobre tus datos, escríbenos desde la página Contacto o al correo laguiadechilecl at gmail.com.",
      ],
    },
    {
      id: "datos-que-tratamos",
      title: "Qué datos guardamos",
      paragraphs: [
        "Solo guardamos lo que necesitamos para que el sitio funcione. Casi todo nos lo das tú. La dirección IP del formulario de contacto y las estadísticas de las fichas se registran solas cuando se usa el sitio. No obtenemos datos tuyos de otras fuentes.",
        "Estos son los datos:",
      ],
      bullets: [
        "Tu cuenta: nombre, apellido, correo, roles y fecha de creación. De la contraseña no guardamos el texto: la transformamos con un algoritmo de hash, que no permite recuperarla.",
        "Tus publicaciones: los textos, precios, horarios e imágenes que subes, y los datos de contacto que eliges mostrar, como teléfono, WhatsApp, correo, sitio web, dirección, comuna, redes sociales y nombre de contacto.",
        "Tus favoritos: qué fichas, avisos, propiedades, eventos, lugares o noticias guardaste.",
        "El formulario de contacto: tu nombre, correo, asunto, mensaje, la fecha y la dirección IP desde la que escribiste.",
        "Las estadísticas de las fichas: cuántas veces al día se vio cada ficha y cuántas veces se tocaron sus botones de WhatsApp, Llamar o Sitio web. Son totales por ficha y no dicen quién las visitó.",
      ],
    },
    {
      id: "para-que",
      title: "Para qué los usamos",
      paragraphs: [
        "Usamos tus datos solo para estos fines. Cada uno se apoya en una razón que la ley reconoce:",
      ],
      bullets: [
        "Crear y mantener tu cuenta, guardar tus favoritos y mostrar tus publicaciones. Lo necesitamos para darte el servicio que pediste al registrarte.",
        "Revisar tus publicaciones antes de mostrarlas y avisarte el motivo si se rechazan. Es nuestro interés legítimo en mantener el sitio confiable.",
        "Enviarte el correo de bienvenida cuando creas tu cuenta. Es parte del servicio que pediste al registrarte.",
        "Responder lo que nos escribes por el formulario de contacto. [completar: base de licitud; propuesta para el abogado: nuestro interés legítimo en atender a quien nos escribe, o tu consentimiento al enviar el formulario].",
        "Usar la dirección IP del formulario para limitar los envíos repetidos y prevenir abusos. También es un interés legítimo nuestro.",
        "Mostrarte en tu panel las visitas y los clics de tus fichas. También es parte del servicio que pediste.",
      ],
    },
    {
      id: "lo-que-no-hacemos",
      title: "Lo que no hacemos con tus datos",
      paragraphs: [
        "No vendemos ni cedemos tus datos a nadie.",
        "No tomamos decisiones automatizadas sobre ti ni armamos perfiles con tus datos.",
      ],
    },
    {
      id: "datos-publicos",
      title: "Qué datos quedan a la vista",
      paragraphs: [
        "Lo que pones en una publicación lo puede ver cualquier persona que visite el sitio, incluidos los datos de contacto. Publica solo los que quieras compartir.",
        "El correo de tu cuenta no aparece en el sitio, salvo que lo escribas como dato de contacto en una publicación.",
        "Las imágenes se guardan tal como las subes. Si una foto tiene datos de ubicación, quítalos antes de subirla.",
      ],
    },
    {
      id: "correos",
      title: "Los correos que enviamos",
      paragraphs: [
        "Enviamos solo dos tipos de correo. Cuando creas tu cuenta, te llega uno de bienvenida. Cuando nos escribes por el formulario de contacto, tu mensaje llega a nuestro buzón con tu correo como dirección de respuesta, para que podamos contestarte.",
        "Estos correos salen a través de Resend, un servicio de envío de correo.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies y almacenamiento en tu navegador",
      paragraphs: [
        "Usamos dos cookies propias. La primera, lgdc-auth, mantiene tu sesión abierta. Se crea al iniciar sesión, dura hasta siete días y se borra cuando cierras sesión. El código de las páginas no puede leerla.",
        "La segunda, sidebar_state, solo se usa en tu panel: recuerda si dejaste abierta o cerrada la barra lateral y dura siete días. No lleva datos tuyos.",
        "Si eliges el modo claro u oscuro, tu navegador guarda esa preferencia. No se envía a nuestros servidores.",
        "Las fichas con dirección muestran un mapa de Google Maps. Cuando el mapa se carga, Google puede usar sus propias cookies según su política de privacidad.",
      ],
    },
    {
      id: "proveedores",
      title: "Con quién compartimos datos",
      paragraphs: [
        "Trabajamos con proveedores que tratan datos por encargo nuestro y solo para estos fines:",
      ],
      bullets: [
        "Resend, para enviar los correos de bienvenida y de contacto. Recibe tu nombre, tu correo y, en los de contacto, tu mensaje.",
        "[completar: proveedor de hosting del sitio y de la base de datos], donde se guardan las cuentas, las publicaciones, los favoritos y los mensajes.",
        "Las imágenes que subes se guardan en un servicio de almacenamiento de archivos: [completar: proveedor del almacenamiento de imágenes en producción y dónde se aloja].",
        "Gmail, de Google, donde está nuestro buzón laguiadechilecl at gmail.com. Ahí llegan los mensajes del formulario de contacto (tu nombre, correo, asunto y mensaje) y los correos que nos escribes directamente, y desde ahí los respondemos.",
      ],
    },
    {
      id: "otras-consultas",
      title: "Otras consultas a terceros",
      paragraphs: [
        "Para mostrar el clima, las farmacias de turno y los resúmenes de las ciudades, nuestros servidores consultan a Open-Meteo, Boostr y Wikipedia. Esas consultas no llevan datos tuyos.",
        "Si una ley o una autoridad competente nos lo exige, entregaremos los datos que corresponda.",
      ],
    },
    {
      id: "datos-fuera-de-chile",
      title: "Datos fuera de Chile",
      paragraphs: [
        "Algunos de nuestros proveedores procesan datos fuera de Chile: Resend, en [completar: país o región donde Resend procesa los datos]; el hosting, en [completar: país del hosting]; el almacenamiento de imágenes, en [completar: país del almacenamiento de imágenes], y Gmail (Google), donde está nuestro buzón de correo, en [completar: país o región donde Google procesa los datos de Gmail].",
        "[completar: garantías que respaldan la transferencia, p. ej. cláusulas contractuales del proveedor].",
      ],
    },
    {
      id: "conservacion",
      title: "Cuánto tiempo guardamos tus datos",
      paragraphs: [
        "Guardamos los datos de tu cuenta, tus publicaciones y tus favoritos mientras tu cuenta exista. Si pides cerrarla, los borramos [completar: plazo y qué se conserva por obligación legal].",
        "Las publicaciones archivadas o vencidas salen del sitio, pero las seguimos guardando para que puedas recuperarlas. Si quieres que las borremos, pídelo desde Contacto.",
        "Los mensajes del formulario de contacto y su dirección IP se guardan durante [completar: plazo de conservación de los mensajes de contacto].",
      ],
    },
    {
      id: "seguridad",
      title: "Cómo protegemos tus datos",
      paragraphs: [
        "Las contraseñas se guardan transformadas con un algoritmo de hash, nunca en texto legible. El código de las páginas no puede leer la cookie de sesión, y en el sitio publicado esa cookie solo viaja por conexiones seguras.",
        "Cuando cambias tu contraseña, se cierran las sesiones que tengas abiertas en otros dispositivos.",
        "Limitamos los intentos de inicio de sesión, de registro y de envío del formulario de contacto para frenar abusos. Los correos salen por una conexión cifrada.",
        "Solo el equipo que administra el sitio puede ver las cuentas y los mensajes de contacto.",
      ],
    },
    {
      id: "tus-derechos",
      title: "Tus derechos",
      paragraphs: [
        "Rectificar, suprimir u oponerte siempre es gratis. El acceso también, al menos una vez cada tres meses.",
        "Tienes estos derechos sobre tus datos personales:",
      ],
      bullets: [
        "Acceso: saber si tratamos tus datos, cuáles, para qué y por cuánto tiempo.",
        "Rectificación: corregir datos inexactos, desactualizados o incompletos.",
        "Supresión: pedir que borremos tus datos cuando ya no sean necesarios, cuando retires tu consentimiento o en los demás casos que fija la ley.",
        "Oposición: pedir que dejemos de usar tus datos para un fin determinado, en los casos que fija la ley.",
        "Portabilidad: recibir una copia de tus datos en un formato electrónico de uso común.",
        "Bloqueo: pedir que suspendamos por un tiempo el uso de tus datos mientras resolvemos una solicitud de rectificación, supresión u oposición.",
      ],
    },
    {
      id: "desde-tu-panel",
      title: "Lo que puedes hacer desde tu panel",
      paragraphs: [
        "Algunos cambios no necesitan solicitud. Desde tu panel puedes hacerlos tú:",
      ],
      bullets: [
        "Cambiar tu nombre y apellido.",
        "Cambiar tu contraseña.",
        "Editar o archivar tus publicaciones.",
        "Quitar favoritos.",
      ],
    },
    {
      id: "como-ejercerlos",
      title: "Cómo ejercer tus derechos",
      paragraphs: [
        "Escríbenos desde la página Contacto o al correo laguiadechilecl at gmail.com. Indica tu nombre, el correo de tu cuenta, el derecho que quieres ejercer y a qué datos se refiere. Si pides una corrección, dinos qué hay que cambiar.",
        "Antes de responderte, podemos pedirte que confirmes tu identidad.",
        "Te avisaremos que recibimos tu solicitud y te responderemos en un plazo de hasta 30 días corridos. Si necesitamos más tiempo, te lo diremos, y el plazo podrá extenderse una sola vez por otros 30 días. Si pides el bloqueo temporal, te responderemos dentro de dos días hábiles.",
        "Si rechazamos tu solicitud o no te respondemos a tiempo, puedes reclamar ante la Agencia de Protección de Datos Personales.",
      ],
    },
    {
      id: "menores",
      title: "Menores de edad",
      paragraphs: [
        "Para crear una cuenta debes tener al menos 18 años. Si sabes que un menor creó una cuenta, avísanos desde Contacto.",
      ],
    },
    {
      id: "cambios",
      title: "Cambios a esta política",
      paragraphs: [
        "Si cambiamos esta política, actualizaremos la fecha del inicio. Si el cambio afecta la forma en que usamos tus datos, te lo avisaremos en el sitio o por correo antes de que empiece a regir.",
      ],
    },
    {
      id: "contacto",
      title: "Contacto",
      paragraphs: [
        "Si tienes dudas sobre esta política o sobre tus datos, escríbenos desde la página Contacto o al correo laguiadechilecl at gmail.com.",
      ],
    },
  ],
};
