# MaicoFit — Setup del backend

Guía de configuración manual de los 3 servicios externos. El código ya está
listo: solo falta crear las cuentas, pegar las credenciales en `.env.local`
y configurar los journeys en Brevo.

## Arquitectura (resumen)

- **Supabase**: login + base de datos (Postgres). Free tier.
- **Mercado Pago**: Plan Esencial = suscripción con débito automático mensual
  (preapproval). Programa 1 a 1 = pago único (Checkout Pro, permite cuotas).
- **Brevo**: mails automáticos. La página solo emite eventos
  (`user_registered`, `checkout_started`, `purchase_completed`); los journeys
  con delays y condiciones viven en Brevo. **Maico edita los mails en el panel
  de Brevo**, sin tocar código.

La verdad de los pagos la escribe el webhook de MP (firmado + idempotente).
Si Brevo está caído, los envíos quedan encolados en la tabla `brevo_jobs` y
los reintenta `/api/jobs/brevo`.

---

## 1. Supabase (bloquea todo lo demás — hacer primero)

1. Crear proyecto en https://supabase.com (región **South America (São Paulo)**).
2. **SQL Editor → New query** → pegar TODO el contenido de `supabase/schema.sql` → Run.
3. **Project Settings → API** → copiar a `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon public)
   - `SUPABASE_SERVICE_ROLE_KEY` (service_role — secreta)
4. **Authentication → Sign In / Up → Email**: desactivar **"Confirm email"**
   (el mail de bienvenida lo manda Brevo; el mailer de Supabase está limitado a ~2/hora).
5. **Authentication → URL Configuration**: Site URL = `http://localhost:3006`.

## 2. Mercado Pago (bloquea los pagos)

1. Con la cuenta MP del desarrollador: https://www.mercadopago.com.ar/developers
   → **Tus integraciones → Crear aplicación**.
2. **Cuentas de prueba**: crear un comprador y un vendedor de prueba (país AR).
3. Entrar al panel **con el vendedor de prueba** → crear una aplicación → copiar
   su **Access Token de producción** (de la cuenta de prueba) a `MP_ACCESS_TOKEN`.
4. **Webhooks** (recién cuando pruebes pagos): configurar la URL
   `https://<tu-tunel>/api/webhooks/mercadopago` con los topics:
   - `payment`
   - `subscription_preapproval`
   - `subscription_authorized_payment`
   y copiar la **clave secreta** a `MP_WEBHOOK_SECRET`.
5. **Túnel para que los webhooks lleguen a tu PC** (los webhooks no llegan a localhost):
   ```
   cloudflared tunnel --url http://localhost:3006
   ```
   (o `ngrok http 3006` con dominio fijo gratuito, así no re-pegás la URL en MP
   en cada arranque). Poner esa URL https en `NEXT_PUBLIC_APP_URL` mientras pruebes.
6. **Tarjeta de prueba**: Mastercard `5031 7557 3453 0604`, venc. `11/30`, CVV `123`.
   Titular `APRO` = aprobado, `OTHE` = rechazado. DNI cualquiera.
7. ⚠️ Antes del lanzamiento: verificar que la cuenta REAL de Maico esté
   verificada y habilitada para suscripciones.

## 3. Brevo (arrancar temprano — el DNS demora horas)

1. Crear cuenta en https://www.brevo.com (hay UI en español).
2. **Dominio remitente** (necesita el dominio que va a comprar Maico):
   Settings → Senders & Domains → agregar dominio → cargar los registros
   **SPF + DKIM + DMARC** en el DNS. Sin esto los mails caen en spam.
3. **Atributos de contacto** (Contacts → Settings → Contact attributes), crear:
   - `NOMBRE` (texto)
   - `HA_COMPRADO` (boolean)
   - `PLAN_COMPRADO` (texto)
   - `FECHA_COMPRA` (fecha)
4. **Listas** (Contacts → Lists): crear `Registrados` y `Descuento popup`.
   Copiar los IDs numéricos a `BREVO_LIST_ID_GENERAL` y `BREVO_LIST_ID_DESCUENTO`.
5. **API key**: Settings → SMTP & API → API Keys → copiar a `BREVO_API_KEY`.
6. **Automations / Journeys** (los contenidos los redacta Maico en el editor):

   | Journey | Trigger (evento) | Pasos |
   |---|---|---|
   | Bienvenida | `user_registered` | Mail de bienvenida inmediato |
   | Carrito abandonado | `checkout_started` | Esperar 3 h → **condición: si `HA_COMPRADO` = true, salir** → mail "te quedó pendiente" → esperar 5 días → **misma condición** → mail follow-up |
   | Gracias por tu compra | `purchase_completed` | Mail con el contenido del plan (links/PDFs). Se puede ramificar por la propiedad `plan` del evento (esencial vs 1a1) |

   En el journey de carrito abandonado, configurar además la **exit condition**
   "el contacto realiza el evento `purchase_completed`". La condición por
   atributo `HA_COMPRADO` es el segundo cinturón: aunque la exit condition
   falle, nadie que compró recibe un mail de abandono.

   Eventos disponibles que emite la página:
   - `user_registered` (props: `nombre`)
   - `checkout_started` (props: `plan`, `amount`)
   - `purchase_completed` (props: `plan`, `amount`)
   - `popup_discount_claimed` (props: `plan`, `descuento`)

## 4. Variables de entorno

Copiar `.env.example` a `.env.local` y completar. Generar `CRON_SECRET` random:
`openssl rand -hex 32` (o cualquier string largo).

## 5. Probar localmente

```
npm run dev -- -p 3006
```

1. `/registro` → crear cuenta → debería aparecer el contacto en Brevo y
   llegar el mail de bienvenida (si el journey está activo).
2. `/planes` → "Comprar con Mercado Pago" → pagar con la tarjeta de prueba.
3. Verificar en Supabase (Table Editor): `checkouts` → `completed`,
   `orders`/`subscriptions` con el pago.
4. `/cuenta` → ver el estado del plan, probar "Cancelar suscripción".
5. Outbox: si Brevo falló en algún paso, procesar a mano:
   `curl -X POST http://localhost:3006/api/jobs/brevo -H "x-cron-secret: <CRON_SECRET>"`

## 6. Deploy a Vercel (cuando el boceto esté aprobado)

1. Importar el repo en Vercel, cargar TODAS las env vars (con credenciales
   de producción de MP).
2. Crear `vercel.json` con el cron del outbox:
   ```json
   { "crons": [{ "path": "/api/jobs/brevo", "schedule": "*/15 * * * *" }] }
   ```
   (Vercel manda `Authorization: Bearer $CRON_SECRET` automáticamente si la
   env var `CRON_SECRET` existe.)
3. Reconfigurar el webhook de MP con la URL de producción → nuevo `MP_WEBHOOK_SECRET`.
4. Supabase: Site URL = dominio final. `NEXT_PUBLIC_APP_URL` = dominio final.
5. Smoke test con un pago real de monto mínimo + reembolso.
