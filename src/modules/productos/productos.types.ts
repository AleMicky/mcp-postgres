export interface Producto {
    id: number;
    nombre: string;
    stock: number;
    precio: number;
}

export interface CrearProductoInput {
    nombre: string;
    stock: number;
    precio: number;
}

export interface ActualizarStockInput {
    id: number;
    stock: number;
}