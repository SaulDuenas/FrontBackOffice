import { Component, OnInit } from '@angular/core';
import * as jwt_decode from 'jwt-decode';

import { CuentasService } from "../services/Cuentas/cuentas.service";

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css']
})
export class CuentaComponent implements OnInit {

  arrayCuentas;
  arrayRendimientos;

  userToken;
  Nombre:string;
  idCliente;
  email;

  constructor(private ctasService:CuentasService) { }

  ngOnInit(): void {
    console.log("inicio")
    this.leerToken();
    this.getCuentas(this.idCliente);
  }

  getCuentas(idCliente){

  }


  leerToken() {
    if ( localStorage.getItem('token') ) {
      this.userToken = localStorage.getItem('token');
      var decoded = jwt_decode( this.userToken); 
      this.Nombre = decoded['FirstName']
      this.idCliente = decoded['id_cliente']
        console.log("Nombre ")
    } else {
        console.log("No hay token")
      this.userToken = '';
    }
    return this.userToken;
}

}
