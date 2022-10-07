import { Component, OnInit } from '@angular/core';
import { BookingService } from 'src/app/services/booking.service';
import { RestaurantLight } from 'src/app/shared/models/resturant-light-model';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {

  public restaurante: RestaurantLight[] = [];

  constructor(private appService: BookingService) { }

  ngOnInit(): void {
   // this.appService.getAllRestaurantsMocks().subscribe((result: any) => {
    //this.restaurante = result;
    this.appService.getAllRestaurants().subscribe((result: any) => {
      this.restaurante = result.data;
    });
  }

}
