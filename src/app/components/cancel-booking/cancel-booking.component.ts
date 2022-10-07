import { Component, OnInit } from '@angular/core';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-cancel-booking',
  templateUrl: './cancel-booking.component.html',
  styleUrls: ['./cancel-booking.component.css']
})
export class CancelBookingComponent implements OnInit {

  numReserva: any = 'RNS05525';
  state = "Tu reserva aun no ha sido cancelada ";

  constructor(private serviceRest: BookingService) { }

  ngOnInit(): void {
  }

  sendCancel() {
    this.serviceRest.cancelReservation(this.numReserva).subscribe((result:any) => {
      this.state = "Tu reserva se ha cancelado correctamente";
      console.log('Se eliminado Reserva', result.data);
    })
    console.log('Se acaba de eliminar', this.numReserva);
  }

}
