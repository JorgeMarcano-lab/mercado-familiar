# 🛒 Mercado Familiar — PWA

App de lista de mercado semanal para toda la familia.  
Funciona en el navegador del teléfono e instalable en la pantalla de inicio.

---

## 🚀 Publicar en Netlify (gratis, paso a paso)

### Paso 1 — Sube el código a GitHub

1. Ve a **github.com** y crea una cuenta gratuita (si no tienes)
2. Haz clic en **"New repository"**
3. Nombre: `mercado-familiar`, privado o público, sin README
4. Haz clic en **"Create repository"**
5. En tu Mac, abre Terminal y ejecuta:

```bash
cd ruta/a/mercado-familiar   # la carpeta del proyecto

git init
git add .
git commit -m "primera version"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/mercado-familiar.git
git push -u origin main
```

---

### Paso 2 — Conecta con Netlify

1. Ve a **netlify.com** → crear cuenta gratis (puedes entrar con tu cuenta de GitHub)
2. Haz clic en **"Add new site"** → **"Import an existing project"**
3. Elige **GitHub** → autoriza → selecciona el repo `mercado-familiar`
4. En la configuración de build:
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
5. Haz clic en **"Deploy site"**

Netlify construye y publica automáticamente. En ~2 minutos te da un link como:  
👉 `https://mercado-familiar-abc123.netlify.app`

---

### Paso 3 — Nombre personalizado (opcional, gratis)

En Netlify → Site settings → Domain management → puedes cambiar el subdominio a algo como:  
`https://mercado-familia.netlify.app`

---

### Paso 4 — Instalar en el teléfono como app

**iPhone (Safari):**
1. Abre el link en Safari
2. Toca el ícono de compartir (cuadrado con flecha arriba)
3. Toca **"Añadir a pantalla de inicio"**
4. La app aparece con ícono propio, sin barra del navegador

**Android (Chrome):**
1. Abre el link en Chrome
2. Aparece un banner automático "Instalar app"
3. O toca los tres puntos → "Instalar aplicación"

---

### Cada vez que hagas cambios

```bash
git add .
git commit -m "descripcion del cambio"
git push
```

Netlify detecta el push y redeploya automáticamente. La familia ve la versión nueva al recargar.

---

## 📁 Estructura del proyecto

```
mercado-familiar/
├── public/
│   ├── index.html          # HTML base
│   └── manifest.json       # Configura el nombre, ícono, colores de la PWA
├── src/
│   ├── App.jsx             # Navegación y tabs
│   ├── index.js            # Entrada React
│   ├── index.css           # Variables de colores y estilos globales
│   ├── components/
│   │   ├── Modal.jsx       # Bottom sheet reutilizable
│   │   └── ItemModal.jsx   # Modal agregar/editar producto
│   ├── hooks/
│   │   └── useStore.js     # Estado global + persistencia (localStorage)
│   ├── data/
│   │   └── items.js        # Productos, categorías, secciones ALDI, tiendas
│   └── screens/
│       ├── PlanScreen.jsx  # Tab Planificar
│       ├── ShopScreen.jsx  # Tab Comprar
│       └── HistoryScreen.jsx # Tab Historial
└── package.json
```

---

## ✏️ Personalizar el recorrido ALDI

Edita `src/data/items.js` → array `ALDI_SECTIONS`.  
Cada sección: `order` (posición en tu recorrido), `name`, `emoji`, `items[]`.

---

## 🔧 Correr localmente

```bash
npm install
npm start
```

Abre **http://localhost:3000** en el navegador.
