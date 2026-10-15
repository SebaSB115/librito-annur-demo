# Librito · demo web de Librería Annur

Vista interactiva para presentar a dirección el diseño y el recorrido de conversación de **Librito**. Es un sitio de muestra separado de Shopify: no instala una aplicación, no cambia el tema publicado y no crea pedidos.

## Qué se puede probar

- Abrir y cerrar el chat en escritorio o móvil.
- Elegir preguntas sugeridas, escribir mensajes y reiniciar la conversación.
- Ver una recomendación ilustrativa y la ficha de ejemplo del pack de profetas.
- Ver cómo el chat responde cuando faltan datos verificados de stock, precio o envío.

Las respuestas siguen reglas locales en el navegador. **Esta versión pública no consulta el catálogo real, no usa IA, no envía mensajes a Annur y no guarda lo escrito.** Las fichas y el fondo de la tienda son ilustrativos. El prototipo local original, fuera de este repositorio, sí incluye una consulta de solo lectura al catálogo público; GitHub Pages no ejecuta ese servidor.

## Abrir localmente

Sirve esta carpeta con un servidor estático, por ejemplo:

```powershell
python -m http.server 4178
```

Abre `http://127.0.0.1:4178/`. El sitio se publica desde la raíz de la rama principal mediante GitHub Pages.

## Límites de la demo

El siguiente paso, sujeto a una decisión de alcance y pruebas separadas, sería conectar el chat a Shopify para verificar catálogo, precio y disponibilidad, además de definir cuándo derivar una consulta a una persona. Esta demo no implementa esas integraciones.
