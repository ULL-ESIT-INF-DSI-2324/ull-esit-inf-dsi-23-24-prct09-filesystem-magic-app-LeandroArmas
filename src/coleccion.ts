import * as fs from 'fs';
import chalk from 'chalk';
import { Carta } from './carta.js';

export class ColeccionCartas {
	private coleccion: Carta[] = [];

	private ImprimirConColor(carta: string): void {
		const CartaJson = JSON.parse(carta);
		let resultado = '';
		resultado += `ID: ${CartaJson.id}\n`;
		resultado += `Nombre: ${CartaJson.nombre}\n`;
		resultado += `Coste de maná: ${CartaJson.costeMana}\n`;
		resultado += `Color: ${CartaJson.color}\n`;
		resultado += `Linea de tipo: ${CartaJson.tipo}\n`;
		resultado += `Rareza: ${CartaJson.rareza}\n`;
		resultado += `Texto de reglas: ${CartaJson.textoReglas}\n`;
		if (CartaJson.tipo === 'Criatura') {
			resultado += `Fuerza/Resistencia: ${CartaJson.fuerzaResistencia}\n`;
		}
		if (CartaJson.tipo === 'Planeswalker') {
			resultado += `Marcas de lealtad: ${CartaJson.marcasLealtad}\n`;
		}
		resultado += `Valor de mercado: ${CartaJson.valorMercado}\n`;
	
		switch (CartaJson.color) {
			case 'Blanco':
				console.log(chalk.white(resultado));
				break;
			case 'Azul':
				console.log(chalk.blue(resultado));
				break;
			case 'Negro':
				console.log(chalk.black(resultado));
				break;
			case 'Rojo':
				console.log(chalk.red(resultado));
				break;
			case 'Verde':
				console.log(chalk.green(resultado));
				break;
			case 'Incoloro':
				console.log(chalk.gray(resultado));
				break;
			case 'Multicolor':
				console.log(chalk.magenta(resultado));
				break;
			default:
				console.log(chalk.red('No se reconoce el color!'));
				break;
		}
  }

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

	public actualizarCarta(carta: Carta, usuario: string): void {
		const DirectorioUsuario = `./cartas/${usuario}`;
    const RutaCarta = `${DirectorioUsuario}/${carta.id}.json`;

    if (!fs.existsSync(RutaCarta)) {
      console.log(chalk.red(`La carta no existe en la colección de ${usuario}!`));
    } else {
      fs.writeFileSync(RutaCarta, JSON.stringify(carta, null, 2));
      console.log(chalk.green(`Carta actualizada en la colección de ${usuario}!`));
    }

	}

	public eliminarCarta(id: number, usuario: string): void {
		const DirectorioUsuario = `./cartas/${usuario}`;
    const RutaCarta = `${DirectorioUsuario}/${id}.json`;

    if (!fs.existsSync(RutaCarta)) {
      console.log(chalk.red(`La carta no existe en la colección de ${usuario}!`));
    } else {
      fs.unlinkSync(RutaCarta);
      console.log(chalk.green(`Carta eliminada de la colección de ${usuario}!`));
    }

	}

	public listarCartas(usuario: string): void {
		const DirectorioUsuario = `./cartas/${usuario}`;

    if (!fs.existsSync(DirectorioUsuario)) {
      console.log(chalk.red(`${usuario} no tiene una colección de cartas`));
    } else {
			const archivos = fs.readdirSync(DirectorioUsuario);
      archivos.forEach((archivo) => {
        const carta = fs.readFileSync(`${DirectorioUsuario}/${archivo}`).toString();
        this.ImprimirConColor(carta);
      });
    }

	}

	public mostrarCarta(id: number, usuario: string): void {
		const DirectorioUsuario = `./cartas/${usuario}`;
    const RutaCarta = `${DirectorioUsuario}/${id}.json`;

    if (!fs.existsSync(RutaCarta)) {
      console.log(chalk.red(`Carta no encontrada en la colección de ${usuario}`));
    } else {
      const carta = fs.readFileSync(RutaCarta).toString();
      this.ImprimirConColor(carta);
    }
	}
}
