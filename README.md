# Proyecto backend con NodeJS y MongoDB
## Configuración
1. Copie la cadena de conexión de su base de datos en MongoDB.
2. Cree un archivo `.env` en el proyecto.
3. En dicho archivo, ingrese la siguiente información:
   
   ```
   PORT=8080
   MONGO_URI="cadena de conexión a la base de datos"
   JWT_SECRET = "your_secret_key"
   ```
#### Formato de MONGO_URI
   Recuerde que el esquema de conexión SRV URI tiene la siguiente forma:
   
   ```
   mongodb+srv://[username:password@]host[/[defaultauthdb][?options]]

   ```

## Importar datos iniciales a MongoDB
1. Descargue los archivos JSON de la carpeta `demo-data`
2. En su base de datos cree dos colecciones: `users` y `groups`
3. Importe los archivos en las colecciones correspondientes.

## Ejecución del proyecto
Ejecute los siguientes comandos:
1. `npm install` para realizar la instalación de los paquetes.
2. `npm run dev` para ejecutar el proyecto en modo desarollo.
