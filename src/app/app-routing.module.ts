import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './components/booking/booking.component';
import { CancelBookingComponent } from './components/cancel-booking/cancel-booking.component';
import { ExploreComponent } from './components/explore/explore.component';
import { PaymentComponent } from './components/payment/payment.component';

const routes: Routes = [
  {path: '', component: ExploreComponent },
  {path: 'booking/:id', component: BookingComponent },
  {path: 'cancel', component: CancelBookingComponent },
  {path: 'payment', component: PaymentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
