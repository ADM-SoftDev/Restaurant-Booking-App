import { environment } from './../../../environments/environment';

import { Booked, PaymentConfirm, PaymentIntentBack } from './../../shared/models/payment-model';
import { Cliente } from './cliente';
import { Component, OnInit, ViewChild  } from '@angular/core';
import {FormGroup ,FormBuilder, Validators, AbstractControl, FormArray} from '@angular/forms';
import {BreakpointObserver} from '@angular/cdk/layout';
import {StepperOrientation} from '@angular/material/stepper';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import { StripeService, StripeCardComponent, StripePaymentElementComponent } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions, Appearance, PaymentIntent, loadStripe } from '@stripe/stripe-js';
import { PaymentService } from 'src/app/services/payment.service';
import { MatDialog } from '@angular/material/dialog';
import {DailogPayment} from 'src/app/shared/dialogs/dailog-payment';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentDatosFacturacion } from 'src/app/shared/models/payment-datos';


const ELEMENT_RESERVA: Cliente[] = [ { nombre: 'Lucia', Coste: 123, CodigoReserva: 'KGD002', Email:'jdelhado@gmail.com'}];

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})

export class PaymentComponent implements OnInit {

  disableSelect = new FormControl(false);

  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  paymentBuy: FormGroup;
  paymentDatosFacturacion = new  PaymentDatosFacturacion();
  booked: Booked;

  bookedConfirm: string;
  paying = false;
  successMessage: string = 'Espera ..... ';

//variables de tabla Datos de  PAyment DataSource
  displayedColumnsPay: string[] = ['nombre', 'email', 'direccion','ciudad','codigoPostal', 'precio'];
  arrayFacturacion:PaymentDatosFacturacion[];
  dataFacturacion = new MatTableDataSource<PaymentDatosFacturacion>;


  /** variables de Formulario **/
  titles_cargoTarjeta = environment.title_Pago;
  datos_Cliente = environment.desdcip_pago;
  titles_Informacion = environment.title_Resumen;
  datos_datosFacturacion = environment.descrip_Facturacion;
  datos_datosReserva = environment.descrip_DatosReserva;
  titles_confirmacion = environment.title_Confirm;
  info = environment.info;




  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'es'
  };



  constructor(
              private stripeService: StripeService,
              public dialog: MatDialog,
              private  paymentService: PaymentService,
              private formBuilder: FormBuilder,
              breakpointObserver: BreakpointObserver) {
      this.stepperOrientation = breakpointObserver
        .observe('(min-width: 800px)')
        .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));

  }

  ngOnInit(){
    this.booked = this.paymentService.getBooked()
    this.paymentBuy =  this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      address: ['', [Validators.required]],
      zipcode: ['', [Validators.required]],
      city: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.pattern(/\d+/)]]
    });

    this.dataFacturacion = new MatTableDataSource<PaymentDatosFacturacion>(

      );
    }
    /** TABLA DE DATOS RESERVA */
    columns = [
      {
        columnDef: 'nombre',
        header: 'Nombre',
        cell: (element: Booked) => `${element.name}`,
      },
      {
        columnDef: 'email',
        header: 'Correo',
        cell: (element: Booked) => `${element.email}`,
      },
      {
        columnDef: 'codigoReserva',
        header: 'Reserva',
        cell: (element: Booked) => `${element.locator}`,
      },
      {
        columnDef: 'coste',
        header: 'Precio',
        cell: (element: Booked) => `${element.precio}`,
      },
      {
        columnDef: 'fecha',
        header: 'Fecha',
        cell: (element: Booked) => `${element.fecha}`,
      },
      {
        columnDef: 'personas',
        header: 'Reserva para',
        cell: (element: Booked) => `${element.personas}`,
      }
    ];
    //dataReserva = ELEMENT_RESERVA;
    dataReserva = new MatTableDataSource<Booked>();
    displayedColumns = this.columns.map(c => c.columnDef);

    resultadoFormGroup = this.formBuilder.group({
      resultadoCtrl: ['', Validators.required],
    });
    stepperOrientation: Observable<StepperOrientation>;

  cancel() {
    this.paymentService
      .cancel(this.bookedConfirm)
      .subscribe(
        (data: any) =>
          (this.successMessage = 'Pago Cancelado con Exito. Mire su bandeja de entrada')
        );
  }

  confirm() {
    const paymentConfir: PaymentConfirm = {
      email: this.booked.email,
      locator: this.booked.locator,
      name: this.booked.name,
      paymentId: this.bookedConfirm
    }
    this.paymentService
    .confirmPayment(paymentConfir)
    .subscribe(
      (data: any) =>
        (this.successMessage = 'Pago Confirmado con Exito. Mire su bandeja de entrada')
      );
  }

/*  Este metodo incluye un campo para cargar el precio, pero sale error en Execute Intent al recuperar el Id, aun que consigue hacer la operacion Payment*/
  pagarTarjeta(): void {
    this.load();
    const name = this.paymentDatosFacturacion.nombre;
    if(this.paymentBuy.valid){
      this.stripeService
        .createToken(this.card.getCard(), {name})
        .subscribe((result) => {
          if (result.token) {
            this.booked.precio = this.paymentDatosFacturacion.precio;
            const paymentIntent: PaymentIntentBack = {
              descripcion: this.booked.name + ':' + this.booked.locator ,
              precio: this.booked.precio
            };
            this.executeIntent(paymentIntent);
            //this.cargarDatosForm(this.paymentDatosFacturacion);

          } else if (result.error) {
            // Error creating the token
            console.log(result.error.message);
          }
        });
    }else {
      console.log(this.paymentBuy);
    }


  }

  executeIntent(payment: PaymentIntentBack) {
    this.paymentService.pagarPayment(payment).subscribe((result: any) => this.bookedConfirm  = result.result.id)
  }

  clear() {
    this.paymentBuy.patchValue({
      name: '',
      email: '',
      address: '',
      zipcode: '',
      city: '',
    });
  }
//Metodo para mostrar el precio en el formulario
  get amount() {
    if(
      !this.paymentBuy.get('amount') ||
      !this.paymentBuy.get('amount')?.value
    )
      return 0;
    const amount = this.paymentBuy.get('amount')?.value
    return Number(amount) /100;
  }


//Metodo que obtiene los datos del Formulario de Payment
  load() {
    this.paymentDatosFacturacion.nombre = this.paymentBuy.get('name')?.value;
    this.paymentDatosFacturacion.ciudad = this.paymentBuy.get('ciudad')?.value;
    this.paymentDatosFacturacion.email = this.paymentBuy.get('email')?.value;
    this.paymentDatosFacturacion.direccion = this.paymentBuy.get('address')?.value;
    this.paymentDatosFacturacion.cp = this.paymentBuy.get('zipcode')?.value;
    this.paymentDatosFacturacion.precio = (this.paymentBuy.get('amount')?.value)/100;
  }

// Metodo de Experimento para crear un subscribe y enlazar con DataSource sin Resultado
  private cargarDatosForm(paymentDatosFacturacion : PaymentDatosFacturacion){
    return  this.formBuilder.group({
      nombre: [paymentDatosFacturacion.nombre],
      email: [paymentDatosFacturacion.email],
      direccion: [paymentDatosFacturacion.direccion],
      ciudad: [paymentDatosFacturacion.direccion],
      codigoPostal:  [paymentDatosFacturacion.cp],
      precio:   [paymentDatosFacturacion.precio]
    });
  }

}
