import 'mocha';
//import { expect } from 'chai';
import { clientCode, CSVProcessor, JSONProcessor} from '../../src/ejercicio_pe/ejercicio-modificacion.js';

describe('Test de evaluación', () => {
    
    it('crear correctamente sin errores csv', () => {
        const csvProcessor = new CSVProcessor("./src/ejercicio_pe/pruebacsv.csv");
        clientCode(csvProcessor);
    });

    it('crear correctamente sin errores json', () => {
        const jsonProcessor = new JSONProcessor("./src/ejercicio_pe/pruebajson.json");
        clientCode(jsonProcessor);
    });
});