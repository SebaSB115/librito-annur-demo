// Fichas de demostración. Nunca representan stock, precio ni catálogo vigente.
export const DEMO_PRODUCTS = Object.freeze({
  prophets: Object.freeze({
    id: 'prophets',
    title: 'Pack 10 historias de profetas',
    eyebrow: 'Referencia observada en el video',
    description: 'Vista de ejemplo para mostrar portada, explicación y paso a compra. La ficha real debe consultarse en Shopify.',
    cover: 'prophets',
  }),
  starter: Object.freeze({
    id: 'starter',
    title: 'Lectura inicial · título por definir',
    eyebrow: 'Producto ilustrativo',
    description: 'El equipo Annur debe escoger un título real y comprobar su contenido antes de recomendarlo.',
    cover: 'starter',
  }),
});

export function getDemoProduct(id) {
  return DEMO_PRODUCTS[id] ?? null;
}
