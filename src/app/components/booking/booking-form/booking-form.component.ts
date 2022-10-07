
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { InfoDialogComponent } from 'src/app/shared/dialogs/info-dialog/info-dialog.component';
import { BookingReserva } from 'src/app/shared/models/booking-reserva';
import { MatDialog } from '@angular/material/dialog';
import { BookingService } from 'src/app/services/booking.service';
import { FormBuilder, Validators } from '@angular/forms';

import { Restaurante } from 'src/app/shared/models/restaurant-model';
import { Router } from '@angular/router';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent implements OnInit {

  public bookingForm: any;
  public bookingReserva = new BookingReserva();
  @Input()
  restaurant: Restaurante = new Restaurante;

  constructor(private formb: FormBuilder,
              private serviceRest: BookingService,
              public dialog: MatDialog,
              private router : Router,
              private servicePayment: PaymentService
              )
  {
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.bookingForm = this.formb.group({
      date: [new Date(), Validators.required],
      time: ['',Validators.required ],
      customers: ['',Validators.required ],
      name:['',Validators.required ],
      email:['',Validators.required ]
    });
  }

  setBookingReserva() {
    this.bookingReserva.restaurantId = this.restaurant.id_restaurante;
    this.bookingReserva.turnId = this.bookingForm.get('time').value;
    this.bookingReserva.fecha = this.bookingForm.get('date').value;
    this.bookingReserva.personas = this.bookingForm.get('customers').value;
    this.bookingReserva.name = this.bookingForm.get('name').value;
    this.bookingReserva.email = this.bookingForm.get('email').value;
    this.bookingReserva.precio = this.restaurant.price;
  }

  sendBooking() {
    this.setBookingReserva();
    this.serviceRest.createReservation(this.bookingReserva).subscribe((result: any ) => {
      console.log('Se ha creado la reserva:',result.data);
      const title = "CODIGO DE RESERVA: " + result.data;
      const info = "Necesitarás el código para poder acceder al restaurante o cancelar la reserva. Por favor guardalo en un lugar seguro";
      this.openDialog(title, info);
    });
    console.log('Se ha enviado los datos booking reserva:',
                  this.bookingForm.get('date').value)
  }

  openDialog(title: string, info: string): void {
    const dialogRef = this.dialog.open(InfoDialogComponent, {
      width: '350px',
      data: {title: title, info: info},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  payBooking() {
    this.setBookingReserva();
    this.serviceRest.createReservation(this.bookingReserva).subscribe((result: any ) => {
    this.servicePayment.setBooked({...this.bookingReserva, locator: result.data})
      this.router.navigate(['/payment'])
    });
    console.log('Se ha enviado los datos booking reserva:',
                  this.bookingForm.get('date').value)
  }

}
