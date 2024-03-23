# Práctica 9 - Aplicación para coleccionistas de cartas Magic

<p align="center">
  <a href="https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-LeandroArmas/actions/workflows/node.js.yml">
    <img alt="Tests badge" src="https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-LeandroArmas/actions/workflows/node.js.yml/badge.svg">
  </a>
  <a href="https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-LeandroArmas/actions/workflows/coveralls.yml">
    <img alt="Coveralls badge" src="https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-LeandroArmas/actions/workflows/coveralls.yml/badge.svg?branch=main">
  </a>
  <a href="https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-LeandroArmas">
    <img alt="Sonar badge" src="https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-LeandroArmas&metric=alert_status">
  </a>
</p>

## Índice
1. [Introducción](#introducción)
2. [Estructura](#estructura)
3. [Desarrollo](#desarrollo)
   - [Fichero `carta.ts`](#fichero-cartats)
   - [Fichero `coleccion.ts`](#fichero-coleccionts)
   - [Fichero `index.ts`](#fichero-indexts)
4. [Modificación](#modificación)
   - [Desarrollo](#desarrollo-1)
5. [Conclusiones](#conclusiones)


## Introducción

En esta práctica, se ha desarrollado una aplicación para gestionar una colección de cartas Magic. Esta aplicación permite almacenar información por usuarios como añadir, modificar, eliminar, listar y leer. Además de la programación básica en TypeScript hacemos uso de la API síncrona de Node.js para trabajar con el sistema de ficheros, el paquete yargs para trabajar con argumentos y el paquete chalk para aplicar diferentes estilos a las salidas. 

Para ello hemos tenido que instalar algunos paquetes como: 
```
npm i chalk

npm i --save-dev c8

npm i yargs

npm i --save-dev @types/yargs
```
## Estructura

Nuestra estructura para la información del programa se basa en un directorio `/cartas` que contiene tantos subdirectorios como usuarios haya con sus correspondientes combres, y dentro de cada subdirectorio tantos ficheros JSON como cartas tenga el usuario, cada uno llamado con el identificador de la carta que representa. 

```
cartas
  |-- usuario1
  |     |-- 1.json
  |     |-- 2.json
  |-- usuario2
  |     |-- 3.json
  |     |-- 4.json
  |-- usuario3
        |-- 5.json
        |-- 6.json
```

## Desarrollo

Para desarrollar nuestro programa se han utilizado tres ficheros: `carta.ts`, `coleccion.ts` e `index.ts`

### - fichero /carta.ts

El archivo `carta.ts` contiene la definición de la clase `Carta`, que representa una carta del juego. En este archivo se definen los atributos de una carta, como el ID, nombre, coste de maná, color, tipo, rareza, texto de reglas, valor de mercado, fuerza/resistencia (en caso de ser una criatura) y marcas de lealtad (en caso de ser un planeswalker). También incluye los enumerados para `Color`, `Tipo` y `Rareza`.

Además, se incluye la implementación del constructor de la clase, que inicializa los atributos de la carta y maneja los casos especiales según el tipo de carta. Aquí tienes un ejemplo del código:

```typescript
export class Carta {
  constructor(
    public id: number,
    public nombre: string,
    public costeMana: number,
    public color: Color,
    public tipo: Tipo,
    public rareza: Rareza,
    public textoReglas: string,
    public valorMercado: number,
    public fuerzaResistencia?: [number, number],
    public marcasLealtad?: number
  ) {
    this.id = id;
    this.nombre = nombre;
    this.costeMana = costeMana;
    this.color = color;
    this.tipo = tipo;
    this.rareza = rareza;
    this.textoReglas = textoReglas;
    this.valorMercado = valorMercado;
    if (tipo === Tipo.Criatura) {
      this.fuerzaResistencia = fuerzaResistencia;
    }
    if (tipo === Tipo.Planeswalker) {
      this.marcasLealtad = marcasLealtad;
    }
  }
}
```

### - fichero /coleccion.ts

El archivo `Coleccion.ts` contiene la implementación de la clase `ColeccionCartas`, que gestiona la colección de cartas de un usuario. En este archivo se definen métodos para `agregar`, `actualizar`, `eliminar`, `listar` y `mostrar` cartas. 

Se utiliza el módulo fs de Node.js para interactuar con el sistema de archivos y almacenar las cartas en archivos JSON. 

A continuación, se muestra un fragmento de código que ilustra cómo se agrega una carta a la colección:

```typescript
public agregarCarta(carta: Carta, usuario: string): void {
  const DirectorioUsuario = `./cartas/${usuario}`;
  const RutaCarta = `${DirectorioUsuario}/${carta.id}.json`;
  
  if (!fs.existsSync(DirectorioUsuario)) {
    fs.mkdirSync(DirectorioUsuario, { recursive: true });
  }

  if (fs.existsSync(RutaCarta)) {
    console.log(chalk.red(`La carta ya existe en la colección de ${usuario}!`));
  } else {
    fs.writeFileSync(RutaCarta, JSON.stringify(carta, null, 2));
    console.log(chalk.green(`Nueva carta añadida a la colección de ${usuario}!`));
  }
}
```

Destacar que se hace uso del paquete `Chalk` para imprimir los mensajes o la informacion de las cartas según su color correspondiente.

### - fichero /index.ts

El archivo `index.ts` contiene la integración de la aplicación con la interfaz de línea de comandos (CLI) utilizando la biblioteca `yargs`. Aquí se definen los comandos disponibles, como `add`, `update`, `remove`, `list` y `show`, y se proporciona la lógica para ejecutar cada comando y realizar las operaciones correspondientes en la colección de cartas. 

A continuación, se muestra un ejemplo de cómo se define el comando `show` y se implementa su lógica:

```typescript
const coleccion = new ColeccionCartas;

let argv = yargs(hideBin(process.argv))
  .command(
    'show',
    'Mostrar la info de una carta',
    {
      usuario: { description: 'Nombre del usuario', type: 'string', demandOption: true },
      id: { description: 'ID de la carta', type: 'number', demandOption: true },
    },
    (argv) => {
      coleccion.mostrarCarta( argv.id, argv.usuario);
    },
  )
  .help().argv;
```

## Modificación

El objetivo de este ejercicio fue desarrollar una solución en TypeScript para procesar archivos CSV y JSON que contienen información sobre una instancia del problema de la mochila. Se implementó una clase abstracta ProcesadorMochila con dos subclases CSVProcessor y JSONProcessor siguiendo el patrón de diseño `Template` para manejar cada tipo de archivo respectivamente. 

### Desarrollo

- **Análisis de Requisitos**: Se analizó el problema del procesamiento de archivos de mochila y se identificaron los formatos admitidos: CSV y JSON. Se definieron las estructuras de datos necesarias para representar la información de la mochila, como `ElementoMochila` y `Mochila`.

- **Diseño de Clases y Métodos**: Se diseñó una clase abstracta `ProcesadorMochila` que define un esqueleto para el procesamiento de archivos de mochila. Se implementaron métodos abstractos `initMochila` y `evaluateMochila` para inicializar y mostrar la información de la mochila respectivamente.

- **Implementación de Funcionalidades**: Se implementaron las subclases `CSVProcessor` y `JSONProcessor` que extienden de `ProcesadorMochila`. Cada subclase implementa los métodos abstractos de acuerdo al formato de archivo correspondiente.

- **Manejo de Archivos**: Se utilizó el módulo `fs` de Node.js para leer archivos de manera asíncrona. Se implementó un método `readFile` en la clase `ProcesadorMochila` para leer el contenido de los archivos.

## Conclusiones
En conclusión, la implementación de esta aplicación ha permitido gestionar de manera eficiente una colección de cartas de un juego mediante una interfaz de línea de comandos (CLI). Se han utilizado diversas herramientas y técnicas de desarrollo de software, como TypeScript, yargs, y manejo de errores, para lograr un sistema robusto y fácil de usar.

La aplicación proporciona una forma conveniente de agregar, actualizar, eliminar, listar y mostrar cartas, lo que facilita la administración de la colección para los usuarios. Además, la documentación proporcionada ayuda a comprender rápidamente el funcionamiento de la aplicación y cómo utilizarla de manera efectiva.

