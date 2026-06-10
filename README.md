# Trabajo Final DEU

Proyecto de trabajo final para Diseño de Experiencia de Usuario - Facultad de Informática UNLP.

Se trata de una app basada en web para ingreso y visualización de hitos y reportes sobre la ribera sur del Río de la Plata.

## Arquitectura

Se utilizó `yarn` para gestionar dos workspaces:

- `backend`: API NestJS. Utiliza MikroORM para mapear una base de datos PostgreSQL. La API cuenta con documentación OpenAPI (Swagger disponible en `{URL_BASE}/api/docs`)

- `frontend`: aplicación Angular. Utiliza Bootstrap como design system y la biblioteca Leaflet para visualizar e interactuar con mapas de OpenStreetMap.

## Instalación (Docker)

* Requiere [Docker](https://docs.docker.com/engine/) y [Docker Compose](https://docs.docker.com/compose/install).

1. Generar archivo de variables de entorno:

~~~
cp .env.example .env
~~~

2. Modificar `.env`, según sea necesario; en caso de que NO sea para desarrollo local:

  * Descomentar la línea `COMPOSE_FILE` para no usar la config de desarrollo.
  * Configurar una contraseña para la base de datos
  * Configurar una secret key para los tokens JWT
  * La variable `SEED_DATABASE` controla si se ingresarán datos de prueba al levantar la app

3. Compilar imágenes:

~~~
docker compose build
~~~

4. Levantar contenedores:

~~~
docker compose up -d
~~~

Si todo salió bien, podemos acceder a la app a través de:

- Puerto `8000` en caso de instalación productiva
- Puerto `4200` en caso de instalación para desarrollo local

## Usuarios de Prueba

En caso de haber cargado la base con datos de prueba se dispone de tres usuarios de prueba:

* `admin@example.com` con rol Administrador
* `user1@example.com` con rol Colaborador
* `user2@example.com` sin rol especial

La contraseña en todos los casos es `password123`

## Instalación directa (desarrollo)

En caso de no querer usar docker para desarrollar:

1. Instalar postgres 18 o levantar un contenedor postgres 18
2. `yarn install` para instalar dependencias
3. `yarn mikro-orm migrate:up` para generar la base de datos o actualizarla
4. `yarn mikro-orm seeder:run` para cargar datos de prueba
5. `yarn start:backend` inicia el servidor de desarrollo de backend (bloquea)
6. `yarn start` inicia el servidor de desarrollo de frontend (bloquea)

## Comandos Importantes

* Agregar una dependencia:

~~~
yarn workspace <backend|frontend> add <...dependencias>
~~~

