import { BookingFormComponent } from './booking-form/booking-form.component';
import { Component, OnInit, ViewChild} from '@angular/core';

import { BookingService } from 'src/app/services/booking.service';
import { ActivatedRoute } from '@angular/router';
import { Restaurante } from 'src/app/shared/models/restaurant-model';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  @ViewChild(BookingFormComponent)
  bookingForm!: BookingFormComponent;

  public restaurant = new  Restaurante();
  private idRestaurante: number = 0;

  constructor(
    private serviceRest: BookingService,
    private route: ActivatedRoute,
  ) { this.restaurant = new Restaurante(); }

  ngOnInit(): void {
    this.idRestaurante = Number(this.route.snapshot.paramMap.get('id'));
    this.getRestaurante();
  }


  getRestaurante(){
    this.serviceRest.getRestaurant(this.idRestaurante).subscribe((result: any) => {
      this.bookingForm.restaurant = result.data
      this.restaurant = result.data
      console.log('datos de restaurnate', result);
    });
  }


}
