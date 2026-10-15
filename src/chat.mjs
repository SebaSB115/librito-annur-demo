import { getDemoProduct } from './catalog.mjs';

const text = (value) => ({ type: 'text', text: value });
const product = (id) => ({ type: 'product', product: getDemoProduct(id) });
const simplify = (value) => value.toLocaleLowerCase('es').normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

export function newSession() {
  return { stage: 'welcome', lastProduct: null, turns: 0 };
}

export function greeting() {
  return {
    messages: [text('¡Salam! Soy Librito, tu guía de lectura en Librería Annur. ¿Buscas un título concreto o te ayudo a elegir por dónde empezar?')],
    suggestions: ['Busco un libro', 'Quiero empezar a leer', 'Ver el pack de profetas'],
    stage: 'welcome',
  };
}

function result(state, messages, suggestions = []) {
  return { messages, suggestions, stage: state.stage };
}

export function answer(state, rawText) {
  const input = simplify(rawText);
  state.turns += 1;

  if (/buscar un libro en la tienda/.test(input)) {
    state.stage = 'catalog';
    return result(state, [text('Cuéntame qué título buscas. En esta demo puedo mostrarte el recorrido, pero no consultar el catálogo real.')], []);
  }

  if (/no respondes|no contest|esperando respuesta/.test(input)) {
    state.stage = 'human';
    return result(state, [text('Perdona la espera. Retomo tu consulta y la pasaría a una persona de Annur para darte una respuesta concreta. ¿Qué dato necesitas confirmar?')], ['Busco un libro', 'Tengo una duda de envío']);
  }

  if (/argentina|america del sur|envio|enviar|entrega|pais/.test(input)) {
    state.stage = 'human';
    const destination = /argentina/.test(input) ? 'Argentina' : null;
    return result(state, [text(destination
      ? 'Antes de proponerte una compra para Argentina, Annur debe confirmar si entrega allí y en qué condiciones. En esta prueba no tengo la política de envíos vigente. ¿Qué libros te interesan?'
      : 'Antes de proponerte una compra, Annur debe confirmar si entrega en tu destino y en qué condiciones. En esta prueba no tengo la política de envíos vigente. ¿A qué país sería el envío?')], ['Hablar con Annur', 'Busco un libro']);
  }

  if (/ibn qayyim|medicina del profeta|traducid|disponib|lo teneis|lo tienen/.test(input)) {
    state.stage = 'human';
    return result(state, [text('No puedo confirmar ese título ni su traducción con el catálogo de prueba. ¿Buscas esa obra exacta o una alternativa sobre el mismo tema? Una persona de Annur debe validar la disponibilidad antes de enviarte un enlace.')], ['Esa obra exacta', 'Una alternativa', 'Hablar con Annur']);
  }

  if (state.stage === 'reading' && /adult|nin|infantil|pequen|familia/.test(input)) {
    const child = /nin|infantil|pequen|familia/.test(input);
    state.stage = 'offer';
    state.lastProduct = child ? 'prophets' : 'starter';
    return result(state, [
      text(child
        ? 'Para una lectura infantil, esta ficha sirve para mostrar cómo sería una recomendación. Annur tendría que confirmar edad recomendada y contenido.'
        : 'Para empezar como adulto, primero propondría una lectura introductoria. El título exacto debe elegirlo Annur; esta ficha muestra el formato del recorrido.'),
      product(state.lastProduct),
      text('¿Quieres revisar la ficha o pedir al equipo una selección real para comprar?'),
    ], ['Ver ficha', 'Pedir selección real']);
  }

  if (/empezar|aprend|orden|islam|primer libro|recomend/.test(input)) {
    state.stage = 'reading';
    return result(state, [text('Claro. Para recomendarte libros en orden, dime una cosa: ¿la lectura es para un adulto o para niños? Así evito enviarte un catálogo sin orientación.')], ['Para adultos', 'Para niños']);
  }

  if (/profeta|pack|historias/.test(input)) {
    state.stage = 'offer';
    state.lastProduct = 'prophets';
    return result(state, [text('En el video se envía este pack. Aquí puedes probar cómo se mostraría su ficha con portada y siguiente paso. Precio, contenido y stock siguen pendientes de comprobar.'), product('prophets'), text('¿Quieres revisar la ficha o preguntar por la compra?')], ['Ver ficha', 'Quiero comprar', 'Tengo una duda de envío']);
  }

  if (/ficha|vista|preview/.test(input) && state.lastProduct) {
    state.stage = 'offer';
    return result(state, [product(state.lastProduct), text('¿Te ayudo con alguna duda antes de comprar o prefieres pedir una recomendación personalizada?')], ['Quiero comprar', 'Otra recomendación']);
  }

  if (/comprar|carrito|pagar|enlace/.test(input)) {
    state.stage = 'handoff';
    return result(state, [text('Este es el punto de cierre de la prueba. En la versión conectada, aquí se enviaría la ficha real de Shopify con precio y disponibilidad verificados. Esta preview no abre carrito ni registra pedidos.')], ['Pedir selección real', 'Otra recomendación']);
  }

  if (/gracias/.test(input)) {
    state.stage = 'followup';
    return result(state, [text(state.lastProduct
      ? '¡De nada! ¿Te quedó alguna duda sobre el libro o el envío antes de decidir?'
      : '¡Con gusto! Si me dices qué tema te interesa, puedo orientarte.')], ['Ver ficha', 'Tengo una duda de envío']);
  }

  if (/humano|persona|asesor|equipo|seleccion real|alternativa|obra exacta/.test(input)) {
    state.stage = 'human';
    return result(state, [text('Dejaría tu consulta preparada para el equipo Annur. En esta preview no se envía ningún mensaje ni se guardan datos de contacto. Cuéntame qué libro o tema quieres que comprueben.')], ['Busco un libro', 'Quiero empezar a aprender']);
  }

  if (/busco un libro|libro especifico/.test(input)) {
    state.stage = 'catalog';
    return result(state, [text('Dime el título o tema que tienes en mente. Esta demo muestra la conversación, sin buscar en el catálogo real.')], ['Ver el pack de profetas']);
  }

  if (state.stage === 'catalog') {
    return result(state, [text('Esa búsqueda necesitaría conexión con la tienda para comprobar la ficha, el precio y la disponibilidad. En esta demo puedo mostrarte la ficha ilustrativa del pack de profetas.')], ['Ver el pack de profetas', 'Quiero empezar a aprender']);
  }

  state.stage = 'discover';
  return result(state, [text('Te ayudo a concretarlo. ¿Buscas un título específico, quieres empezar a aprender o necesitas saber si podemos enviártelo?')], ['Busco un libro', 'Quiero empezar a aprender', 'Tengo una duda de envío']);
}
