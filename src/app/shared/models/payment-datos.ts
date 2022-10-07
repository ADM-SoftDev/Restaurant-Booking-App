export class PaymentDatosFacturacion {

    private _nombre: string;
    private _email: string;
    private _direccion: string;
    private _cp: number;
    private _ciudad: string;
    private _precio: number;

    public get nombre(): string {
        return this._nombre;
    }
    public set nombre(value: string) {
        this._nombre = value;
    }

    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }

    public get direccion(): string {
        return this._direccion;
    }
    public set direccion(value: string) {
        this._direccion = value;
    }

    public get cp(): number {
        return this._cp;
    }
    public set cp(value: number) {
        this._cp = value;
    }
    public get ciudad(): string {
        return this._ciudad;
    }
    public set ciudad(value: string) {
        this._ciudad = value;
    }
    public get precio(): number {
        return this._precio;
    }
    public set precio(value: number) {
        this._precio = value;
    }

}