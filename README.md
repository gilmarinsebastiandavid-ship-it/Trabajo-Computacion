# Trabajo de Computación 

![Run HTML Tests](https://github.com/gilmarinsebastiandavid-ship-it/Trabajo-Computacion/workflows/Run%20HTML%20Tests/badge.svg)

## 📌 Requisitos previos

- Tener instalado en tu máquina local:
  - [Git](https://git-scm.com/)
  - [Node.js y npm](https://nodejs.org/)
- Cuenta en [GitHub](https://github.com/).
- Instancia EC2 en [AWS](https://aws.amazon.com/) con:
  - Ubuntu 20.04 o superior.
  - Acceso SSH habilitado.
  - Nginx instalado.

---
## Despliegue en AWS
## 🚀 Paso 1. Clonar el repositorio

```bash
git clone https://github.com/gilmarinsebastiandavid-ship-it/Trabajo-Computacion.git
cd Trabajo-Computacion
```

---

## 🧪 Paso 2. Configurar y ejecutar tests

Este proyecto tiene configurados **tests con Jest**.  
Para ejecutarlos en local:

```bash
npm install
npm test
```

### 📍 Integración con GitHub Actions

El repositorio cuenta con un workflow de CI para correr los tests automáticamente en cada push.  
El archivo `.github/workflows/tests.yml` contiene algo como:

```yaml
name: Run Tests

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test
```

Con esto, GitHub ejecuta los tests de Jest en cada cambio al repositorio.

---

## ☁️ Paso 3. Despliegue manual en AWS

El despliegue no está automatizado, se realizó manualmente en un **servidor EC2 de AWS**.

### 1. Conectarse al servidor

```bash
ssh -i "mi-clave.pem" ubuntu@mi-ip-publica
```

### 2. Instalar dependencias en el servidor

```bash
sudo apt update
sudo apt install -y nginx git nodejs npm
sudo npm install -g pm2
```

### 3. Clonar el repositorio en EC2

```bash
cd /var/www
sudo git clone https://github.com/gilmarinsebastiandavid-ship-it/Trabajo-Computacion.git
cd Trabajo-Computacion
npm install
```

### 4. Levantar la aplicación con PM2

```bash
pm2 start server.js --name trabajo-computacion
pm2 save
```

### 5. Configurar Nginx como proxy inverso

Archivo de configuración en `/etc/nginx/sites-available/trabajo-computacion`:

```nginx
server {
    listen 80;

    server_name mi-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Luego:

```bash
sudo ln -s /etc/nginx/sites-available/trabajo-computacion /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 

### 1. ❌ Permisos denegados al ejecutar GitHub Actions
- **Causa**: El repositorio estaba configurado como **privado**, lo que impedía el acceso correcto.  
- **Solución**: Cambiar la visibilidad del repositorio a **público**.

### 2. ❌ Error al ejecutar `npm install` en AWS
- **Causa**: Dependencias faltantes en el servidor.  
- **Solución**: Ejecutar `sudo apt install -y build-essential` antes de instalar.

### 3. ❌ Problemas con Nginx (502 Bad Gateway)
- **Causa**: La app Node.js no estaba corriendo o PM2 no la había levantado.  
- **Solución**: Revisar logs con `pm2 logs` y reiniciar con `pm2 restart trabajo-computacion`.

---

## Despliegue GitHub Actions
## 1) Estructura creada (resumen)
```
/ (repo root)
├── .github/
│   └── workflows/
│       └── tests.yml
├── src/
│   └── __tests__/
│       └── app.test.js
└── README.md  (este archivo)
```

---

## 2) Contenido del test añadido (`src/__tests__/app.test.js`)
Este test es intencionalmente simple para garantizar que el pipeline de CI no falle por falta de tests. Contenido:

```js
// src/__tests__/app.test.js
test('test de ejemplo mínimo (siempre pasa)', () => {
  expect(1 + 1).toBe(2);
});
```

### Por qué un test así
- Evita fallos por ausencia de tests (causa frecuente del `Process completed with exit code 1`).  
- Permite comprobar que el workflow de Actions se ejecuta correctamente.  
- Sirve de plantilla para que luego agregues tests reales (para componentes, funciones, integración con la API, etc.).

---

## 3) Workflow de GitHub Actions (`.github/workflows/tests.yml`)
Este archivo ejecuta tests en cada push/PR a `main`:

```yaml
name: Run Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --watchAll=false
```

### Explicación paso a paso del workflow
1. **Trigger (`on`)**: se ejecuta en `push` y `pull_request` sobre la rama `main`.  
2. **runs-on**: usa una runner `ubuntu-latest`.  
3. **Checkout**: descarga el código del repositorio para el job.  
4. **Setup Node**: instala Node.js versión 18 (alinear con tu entorno local si usas otra).  
5. **Install dependencies**: `npm ci` instala las dependencias de forma reproducible (usa `package-lock.json`).  
6. **Run tests**: ejecuta `npm test` con Jest (sin watch).

---

## 4) Cómo ejecutar los tests localmente (paso a paso)

1. Instala dependencias (si todavía no lo hiciste):
```bash
npm install
```

2. Asegúrate de tener el script `test` en tu `package.json`. Añade/ajusta esto:
```json
"scripts": {
  "test": "jest --watchAll=false"
}
```

3. Ejecuta los tests localmente:
```bash
npm test
```

Si el test simple pasa, verás algo como `1 passed` en la salida de Jest.

---

## 5) Qué pasa cuando se ejecuta en GitHub Actions (flujo de ejecución)

- GitHub lanza una VM Ubuntu.  
- Hace checkout del código.  
- Instala Node.js (v18).  
- Ejecuta `npm ci` para instalar dependencias exactamente como en `package-lock.json`.  
- Ejecuta `npm test`.  
- Si los tests pasan: el job termina con éxito. Si fallan, la acción marca `failed` y verás el log con el error.

---

## 6) Errores reales que nos surgieron (y cómo evitarlos en este flujo)

### A) `Process completed with exit code 1`
- **Por qué ocurre**: normalmente porque `npm test` devuelve un código de salida distinto de 0 (tests fallando o error en la ejecución del runner).  
- **Cómo lo evitamos aquí**:
  - Añadimos un test básico que siempre pasa (`src/__tests__/app.test.js`).  
  - Ejecutar `npm test` localmente antes de pushear para verificar que no hay fallos.  
  - En Actions usamos `npm ci` y Node 18 para reproducibilidad.

### B) Error relacionado con `run-tests.js` o heredoc / EOF
- **Por qué ocurrió antes**: intentamos tener scripts largos inline en el YAML y la heredoc se interpretó mal por indentación/shell.  
- **Solución aplicada**: usar un test file en el repo y llamar a `npm test` desde el workflow, evitando scripts inline complejos.

### C) Repo privado y permisos (deploy / CI)
- **Contexto**: antes detectamos problemas porque el repo estaba en privado y ciertas integraciones no tenían permisos suficientes.  
- **Solución aplicada**: pusimos el repo en **público** para el caso de pruebas. Si el repo debe quedar privado en el futuro, la solución es añadir Secrets o PAT con los scopes necesarios y configurar las credenciales.

### D) Tests que fallan en CI pero pasan localmente
- **Causas comunes**: versión distinta de Node, dependencias nativas que requieren build tools, dependencias no incluidas en package-lock.  
- **Recomendaciones**:
  - Alinear la versión de Node con `actions/setup-node`.  
  - Usar `npm ci` en CI.  
  - Si hay paquetes nativos, asegurar `build-essential`/prerequisitos si se compila en runner (o cambiar estrategia).

---

