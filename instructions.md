ayudame a crear un proyecto en vue 3 con typescript con vue router y pinia, que sirva de motor de micro-frontends.

por ejemplo 

el proyecto tendra carpetas generales de 
componentes
stores
views
states
services
interfaces
routes
_frontends pero dentro de esta carpeta iran los fornt ends por ejemplo

--- user
    -componentes
    -stores
    -views
    -states
    -services
    -interfaces
    -routes
    config.ts --- Este archivo incluir toda la configuracion nombre y datos del fron end necesarios

lo que quiero es que si yo creo una nueva carperta como la de usuarios automaticamnte desde sus configuracion se carguen las rutas, vistas y todo lo necesario para funcionar, y que en su archivo de configuracion se declare por ejemplo el uso de componetes padre por ejemplo el layouy o menu    


Entonces genera este proyecto y crea el prime microfrontend que sea una vista CRUD a la ruta de localhost:3000/api/user ese proyecto se encuentra en /Users/leganuxm4/Documents/GitHub/express-ts-base/src/modules/users por si gustas tomar de referencia

usa la forma de vue de setup API muy importante 

