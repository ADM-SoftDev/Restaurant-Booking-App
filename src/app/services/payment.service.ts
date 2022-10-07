import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { PaymentConfirm } from './../shared/models/payment-model';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Booked } from '../shared/models/payment-model';
import { PaymentIntentBack} from 'src/app/shared/models/payment-model';
import { PaymentDatosFacturacion } from '../shared/models/payment-datos';





@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private booked: Booked ;
  private  API_Payment = 'http://localhost:7082/booking-payment/v1/';

  constructor(
              private readonly http: HttpClient
            ) { }

  setBooked(booked: Booked) {
    this.booked = booked;
  }

  getBooked() {
    return this.booked;
  }

  pagarPayment(payment : PaymentIntentBack) {
    //return this.http.post(this.API_Payment + 'paymentIntent', payment)
    return this.http.post(`${environment.API_Booking_Payment}/paymentIntent`,payment );
  }

  cancel(id: string){
    //return this.http.post(this.API_Payment + 'paymentCancel/'+ 'paymentId', {});
    return this.http.post(`${environment.API_Booking_Payment}/paymentCancel/`+id , {});
  }

  confirmPayment(paymentConfirm: PaymentConfirm){
        //return this.http.post(this.API_Payment + 'paymentConfirm/' + paymentConfirm.paymentId, paymentConfirm);
    return this.http.post(`${environment.API_Booking_Payment}/paymentConfirm` + paymentConfirm.paymentId,  paymentConfirm);
  }

}
