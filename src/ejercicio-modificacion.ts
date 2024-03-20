import {readFile} from 'fs';

/**
 * Elemento de una mochila
 */
type ElementoMochila = {
    numero: number;
    peso: number;
    beneficio: number;
};

/**
 * Mochila que contiene elementos
 */
type Mochila = {
    capacidad: number;
    numElementos: number;
    elementos: ElementoMochila[];
};

/**
 * Clase abstracta para procesar una mochila
 */
abstract class ProcesadorMochila {
    public mochila: Mochila;

    /**
     * Constructor
     * @param filePath el fichero
     */
    constructor(protected filePath: string) {
        this.mochila = {
        capacidad: 0,
        numElementos: 0,
        elementos: []
        };
    }

    /**
     * Método asíncrono procesar
     * Inicializa la mochila y la muestra
     */
    public async procesar(): Promise<void> {
        await this.initMochila();
        this.evaluateMochila();
    }

    /**
     * Método abstracto initMochila para iniciar la mochila
     */
    protected abstract initMochila(): Promise<void>;

    /**
     * Método abstracto evaluateMochila para mostrar una mochila
     */
    protected abstract evaluateMochila(): void;

    /**
     * Método asíncrono readFile que lee información de un fichero 
     * @param filePath La dirección del fichero
     * @returns 
     */
    protected async readFile(filePath: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
          readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
    }

}

/**
 * Método CSVProcessor para procesar un fichero de tipo CSV
 */
export class CSVProcessor extends ProcesadorMochila {
    
    /**
     * Implementación del método initMochila
     * Se lee el fichero y se divide en lineas
     * Se coprueba que haya el mínimo de líneas y se almacenan en los diferentes atributos
     */
    protected async initMochila(): Promise<void> {
        const fileData = await this.readFile(this.filePath);
        const lines = fileData.trim().split("\n");
        
        if (lines.length >= 2) {
          this.mochila.capacidad = parseInt(lines.shift()!); 
          this.mochila.numElementos = parseInt(lines.shift()!);
        } else {
          throw new Error("El archivo no contiene suficientes líneas.");
        }
      
        lines.forEach(line => {
          const [numero, peso, beneficio] = line.split(",").map(Number);
          this.mochila.elementos.push({ numero, peso, beneficio });
        });
    }

    /**
     * Implementación del método evaluateMochila para mostrar una mochila
     */
    protected evaluateMochila(): void {
        console.log('Evalunado mochila de CSV\n');
        console.log(this.mochila);
    }

}

export class JSONProcessor extends ProcesadorMochila {
    
    /**
     * Implementación del método initMochila
     * Se lee el fichero y se parsea según el tipo JSON
     */
    protected async initMochila(): Promise<void> {
        const fileData = await this.readFile(this.filePath);
        this.mochila = JSON.parse(fileData);
    }

    /**
     * Implementación del método evaluateMochila para mostrar una mochila
     */
    protected evaluateMochila(): void {
        console.log('Evalunado mochila de JSON\n');
        console.log(this.mochila);
    }

}

/**
 * Funcion clientCode que al pasarle un procesador de mochila la procesa
 */
export function clientCode(processor: ProcesadorMochila): void {
    processor.procesar();
}

// Instancias para comprobar el funcionamiento
const csvProcessor = new CSVProcessor("./src/pruebacsv.csv");
const jsonProcessor = new JSONProcessor("./src/pruebajson.json");
clientCode(csvProcessor);
clientCode(jsonProcessor);
