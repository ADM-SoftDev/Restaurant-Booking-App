import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { BookingReserva } from '../shared/models/booking-reserva';
import { RestaurantLight } from '../shared/models/resturant-light-model';

const API_REST = 'http://localhost:7082/booking-restaurant/v1/';
const API2_RESERV = 'http://localhost:7082/booking-reservation/v1/';
//const API = 'booking-restaurant/v1/';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) { }

  getRestaurant(id: number) {
    //return this.http.get(API_REST + 'restaurant' +  '/' + id)
    return this.http.get(`${environment.API_Booking_Rest}/restaurant/${id}`)
  }

  getAllRestaurants() {
    //return this.http.get(API_REST + 'restaurants');
    return this.http.get( `${environment.API_Booking_Rest}/restaurants `);
  }

  createReservation(bookingReserva: BookingReserva){
    //return this.http.post(API2_RESERV + 'createReserva', bookingReserva);
    return this.http.post(`${environment.API_Booking_Reserv}/createReserva/`,bookingReserva)
  }

  cancelReservation(numReserva: string) {
    /*const options = {
      header: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }*/
    const headers = {'Content-Type': 'application/json'}
    //return this.http.delete(API2_RESERV + 'cancelarReserva?locator=' + numReserva + options);
    return this.http.delete(`${environment.API_Booking_Reserv}/cancelarReserva?locator=${numReserva}`,{headers});
  }

  getAllRestaurantsMocks() {
    const restaurantes: RestaurantLight[] = [];

    let restaurante = new RestaurantLight;
    restaurante.description = 'gran via 23';
    restaurante.id_restaurante=1;
    restaurante.name="cassa Luquita";
    restaurante.image="https://media-cdn.tripadvisor.com/media/photo-s/11/f3/e8/08/zona-de-barra.jpg";

    const restaurante1: RestaurantLight = {
      id_restaurante: 2,
      description: "comida española - peruana",
      name: "Restaurante Alex",
      image: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/restaurante-quintoelemento-elle-3-1643276654.jpg?crop=1.00xw:1.00xh;0,0&resize=640:*"
    }

    restaurantes.push(restaurante);
    restaurantes.push(restaurante1);

    return of(restaurantes);
  }

}
