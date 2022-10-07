import { BookingReserva } from 'src/app/shared/models/booking-reserva';

export class Booked extends BookingReserva {
    locator!: string;

}

export interface PaymentIntentBack{
    descripcion: String,
    precio: number;
}

export interface PaymentConfirm {
    email: string;
    locator: string;
    name: string;
    paymentId:string;
}

