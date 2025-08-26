# Trabajo-Computacion

# 📘 Proyecto Plan de Estudios Interactivo

Este proyecto consiste en un sitio web estático compuesto por un archivo `HTML` y un `CSS`, desplegado en una instancia **Ubuntu en AWS** utilizando **Nginx**.

---

## 🚀 Pasos realizados

### 1. Preparación de la instancia:
1. Actualizar los paquetes:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

---

### 2. Instalación del servidor web
1. Instalar **Nginx**:
   ```bash
   sudo apt install nginx -y
   ```
2. Habilitar y arrancar el servicio:
   ```bash
   sudo systemctl enable nginx
   sudo systemctl start nginx
   ```

---

### 3. Clonar y copiar el repositorio
1. Instalar Git:
   ```bash
   sudo apt install git -y
   ```
2. Clonar el repositorio:
   ```bash
   git clone https://github.com/<tu-usuario>/<tu-repo>.git
   ```
3. Copiar los archivos del proyecto al directorio raíz de Nginx:
   ```bash
   sudo cp -r <nombre-del-repo>/* /var/www/html/
   ```

---

### 4. Configuración del sitio
1. Mover y renombrar el archivo principal como `index.html`:
   ```bash
   cd /var/www/html/
   sudo mv "Plan de estudios interactivo/Plan_Estudios.html" index.html
   ```
2. Mover el CSS al mismo directorio:
   ```bash
   sudo mv "Plan de estudios interactivo/estilos.css" .
   ```
3. Ajustar la ruta del CSS dentro de `index.html`:
   ```html
   <link rel="stylesheet" href="estilos.css">
   ```
4. Eliminar la carpeta sobrante (opcional):
   ```bash
   sudo rm -r "Plan de estudios interactivo"
   ```

---

### 5. Reiniciar Nginx
Para aplicar cambios:
```bash
sudo systemctl restart nginx
```

---

## 🌍 Resultado
Ahora tu sitio está disponible en la IP pública de tu instancia:  

👉 `http://<tu-ip-de-aws>/`

