# MaicoFit

Landing de ventas para Maico Palazzolo, coach de fitness. Sitio multi-página con foco en conversión.

## Stack

- **Next.js 16** (App Router) + **React 19**
- CSS global puro en `src/index.css` (sin Tailwind ni librerías UI)
- Fuentes: Bebas Neue (títulos) + DM Sans (texto) vía `next/font/google`

## Cómo correrlo

Requisitos: Node.js 18+ (recomendado 20+).

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

Otros comandos:

```bash
npm run build   # build de producción
npm run start   # servir el build
```

## Estructura

```
app/                  # rutas (App Router)
  layout.jsx          # shell global: fonts, CSS, Nav/Footer/popup vía SiteShell
  page.jsx            # / (home)
  planes/page.jsx     # /planes (planes + garantía + testimonios)
  proceso/page.jsx    # /proceso
  historia/page.jsx   # /historia
src/
  index.css           # ÚNICO archivo de estilos (variables en :root)
  views/              # composición de cada página
  components/         # secciones y piezas de UI
public/fotos/         # fotos y videos del cliente
```

## Rutas

| Ruta | Contenido |
|---|---|
| `/` | Hero, stats, ¿esto es para vos?, quote, diferenciales, resumen de planes + garantía, CTA |
| `/planes` | Cards de planes con "Agregar al carrito", franja de garantía 90 días, testimonios |
| `/proceso` | Los 4 pasos del proceso |
| `/historia` | Historia de Maico + frases de mentalidad |

## Pendiente (backend)

- Login / registro (los botones del nav son placeholders)
- Carrito ("Agregar al carrito" en planes y "Quiero el descuento" del popup no tienen handler aún)
- Pasarela de pagos → MercadoPago **Checkout Pro** (crear preferencia desde el back y redirigir al `init_point`)

## Datos del cliente

- WhatsApp: +54 11 4403-6786
- Plan Esencial: $15.000 ARS/mes · Plan 1 a 1: $420.000 ARS (3 meses)
- Popup exit-intent: 10% off → $13.500 ARS
