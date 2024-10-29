import { Component, OnInit } from '@angular/core';
import * as jwt_decode from 'jwt-decode';

import { CuentasService } from "../services/Cuentas/cuentas.service";
import {formatDate} from '@angular/common';
import { PagerService }  from '../services/pager/pager.service'

@Component({
  selector: 'app-adicional',
  templateUrl: './adicional.component.html',
  styleUrls: ['./adicional.component.css']
})
export class AdicionalComponent implements OnInit  {

  // array of all items to be paged
  private allItems: any[];

  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];

myDate;

verTodo:boolean = false;
verDetalle:boolean = false;


arrayEstadoCuenta;


userToken;
Nombre:string;
idCliente;
email;
idPlan;
desc_plan;
Plan_Porc;

fec_contrat_cta;
fec_inicalc_cta;
Id_plan;
Rend_fec
Ren_USD

Id_cuenta;

saldoTotal;
saldoInicial;
noPlanes;

constructor(private ctasService:CuentasService, private pagerService:PagerService) { 
this.myDate = formatDate(new Date(), 'yyyy/MM/dd', 'en');
}

ngOnInit(): void {
this.leerToken();

this.getSaldoActual(this.idCliente);
this.getMontoInicial(this.idCliente);
this.getNoPlanes(this.idCliente);
this.getEstdoCuenta(this.idCliente);
}

setPage(page: number) {

}


changeViewe()
{
this.verTodo = !this.verTodo;
}

getEstdoCuenta(idCliente){
this.ctasService.getEstadoCuenta(idCliente).subscribe(
  (data) =>{
    this.arrayEstadoCuenta = data
  }, (err) => {
    //this.showNotification('top','left');
    console.log( "error");
  });
}

getSaldoActual(idCliente){
this.ctasService.getMontoActual(idCliente).subscribe(
  (data) =>{
    this. saldoTotal = data["MontoActual"]
  }, (err) => {
    //this.showNotification('top','left');
    console.log( "error");
  });
}

getMontoInicial(idCliente){
this.ctasService.getMontoInicial(idCliente).subscribe(
  (data) =>{
    this. saldoInicial = data["TotalInicial"]
  }, (err) => {
    //this.showNotification('top','left');
    console.log(err);
  });
}

getNoPlanes(idCliente){
this.ctasService.getNoPlanes(idCliente).subscribe(
  (data) =>{
    this.noPlanes = data[0]["Cuentas"];
  }, (err) => {
    //this.showNotification('top','left');
    console.log(err);
  });
}



leerToken() {
if ( localStorage.getItem('token') ) {
  this.userToken = localStorage.getItem('token');
  var decoded = jwt_decode( this.userToken); 
  this.Nombre = decoded['FirstName']
  this.idCliente = decoded['id_cliente']

} else {
    console.log("No hay token")
  this.userToken = '';
}
return this.userToken;
}
}
