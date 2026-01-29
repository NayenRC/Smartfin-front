📱 Smartfin-front
🧠 Descripción

Smartfin-front es una aplicación frontend moderna desarrollada con React + Vite + Tailwind CSS, pensada para consumir un backend financiero y ofrecer una experiencia de usuario clara, rápida y responsiva.

Forma parte del ecosistema SmartFin, integrándose con el backend de finanzas y chatbot inteligente.

🚀 Funcionalidades principales

Interfaz moderna y responsive

Autenticación de usuarios

Rutas protegidas

Consumo de API REST

Manejo de estado con Context API

Preparado para integración con IA

🛠️ Tecnologías utilizadas

React

Vite

Tailwind CSS

JavaScript (ES6+)

Axios / Fetch

React Router

Vercel (deploy)

📦 Requisitos previos

Node.js 16+

Backend activo (ej: backend-finanzas-chatbot)

Variables de entorno configuradas

📥 Instalación
git clone https://github.com/NayenRC/Smartfin-front.git
cd Smartfin-front
npm install

⚙️ Variables de entorno

Crea un archivo .env:

VITE_API_URL=http://localhost:3000


Ajusta la URL según tu backend (Railway, local, etc).

▶️ Ejecutar en desarrollo
npm run dev


La app se ejecutará en:

http://localhost:5173

📁 Estructura del proyecto
src/
├── components/    # Componentes reutilizables
├── context/       # Context API (Auth, etc.)
├── layouts/       # Layouts generales
├── pages/         # Páginas principales
├── services/      # Configuración y llamadas API
├── App.jsx        # Rutas
└── main.jsx       # Entry point

🔐 Autenticación

Contexto de autenticación

Protección de rutas privadas

Manejo de tokens

Preparado para JWT

🌐 Integración con Backend

Este frontend está diseñado para trabajar con:

API REST

JWT

Backend Node.js / Express

Chatbot financiero con IA

🚀 Deploy

Proyecto preparado para Vercel:

Conectar repositorio

Configurar variables de entorno

Deploy automático

📄 Licencia

Proyecto con fines educativos y académicos.
Puedes agregar licencia MIT si lo deseas.
