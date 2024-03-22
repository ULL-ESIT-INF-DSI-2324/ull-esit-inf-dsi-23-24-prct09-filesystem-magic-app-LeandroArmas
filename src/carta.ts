export enum Color {
  Blanco = "Blanco",
  Azul = "Azul",
  Negro = "Negro",
  Rojo = "Rojo",
  Verde = "Verde",
  Incoloro = "Incoloro",
  Multicolor = "Multicolor"
}

export enum Tipo {
  Tierra = "Tierra",
  Criatura = "Criatura",
  Encantamiento = "Encantamiento",
  Conjuro = "Conjuro",
  Instantaneo = "Instantaneo",
  Artefacto = "Artefacto",
  Planeswalker = "Planeswalker"
}

export enum Rareza {
  Comun = "Comun",
  Infrecuente = "Infrecuente",
  Rara = "Rara",
  Mitica = "Mitica"
}

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
