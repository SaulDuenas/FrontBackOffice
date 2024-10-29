import { Component, OnInit, ViewEncapsulation, ɵConsole } from "@angular/core";
import * as jwt_decode from "jwt-decode";

import { CuentasService } from "../services/Cuentas/cuentas.service";
import { formatDate } from "@angular/common";
import { PagerService } from "../services/pager/pager.service";
import { UsuarioService } from "../services/usuario/usuario.service";
import html2canvas from "html2canvas";
import domtoimage from "dom-to-image";
import Swal from "sweetalert2";
import { element } from "protractor";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { Color, Label } from "ng2-charts";
import { TranslateEngineService } from "../services/translate/translate-engine.service";

import jsPDF from "jspdf";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from "html-to-pdfmake";

import { DatePipe } from "@angular/common";
import { timeStamp } from "console";

interface ANIO {
  value: string;
  viewValue: string;
}
interface MONTHS {
  tag: string;
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-table-list",
  templateUrl: "./table-list.component.html",
  styleUrls: ["./table-list.component.css"],
  encapsulation: ViewEncapsulation.None,
})

export class TableListComponent implements OnInit {
  anios: ANIO[] = [
    { value: "2015", viewValue: "2015" },
    { value: "2016", viewValue: "2016" },
    { value: "2017", viewValue: "2017" },
    { value: "2018", viewValue: "2018" },
    { value: "2019", viewValue: "2019" },
    { value: "2020", viewValue: "2020" },
    { value: "2021", viewValue: "2021" },
  ];

  months: MONTHS[] = [
    { tag: "Jan", value: "1", viewValue: "Enero"},
    { tag: "Feb", value: "2", viewValue: "Febrero"},
    { tag: "Mar", value: "3", viewValue: "Marzo" },
    { tag: "Apr", value: "4", viewValue: "Abril" },
    { tag: "May", value: "5", viewValue: "Mayo" },
    { tag: "Jun", value: "6", viewValue: "Junio" },
    { tag: "Jul", value: "7", viewValue: "Julio" },
    { tag: "Aug", value: "8", viewValue: "Agosto" },
    { tag: "Sep", value: "9", viewValue: "Septiembre" },
    { tag: "Oct", value: "10", viewValue: "Octubre" },
    { tag: "Nov", value: "11", viewValue: "Noviembre" },
    { tag: "Dec", value: "12", viewValue: "Diciembre" },
  ];

  /*********************************************************/
  lineChartData: ChartDataSets[] = [{ }];

  lineChartLabels: Label[] = [];

  lineChartOptions = {
        responsive: true, 
    maintainAspectRatio: false ,
    labels: {
        fontSize: 10,
        usePointStyle: true
      }
  };

  lineChartColors: Color[] = [
    {
      borderColor: '#5FC868',
      backgroundColor: '#ebf8ec'//'rgba(95, 200, 104)',
    },
       {
      borderColor: '#0093D6',
      backgroundColor: '#dff1fa',
    },
  ];

  lineChartLegend = false;
  lineChartPlugins = [];
  lineChartType = 'line';
  /********************************************************************** */
  /*                              Constructor                             */
  /********************************************************************** */
  constructor(
    private ctasService: CuentasService,
    private pagerService: PagerService,
    private userService: UsuarioService,
    private translateservice: TranslateEngineService
  ) {
    this.leerToken()
    this.myDate = formatDate(new Date(), "yyyy/MM/dd", "en");
    this.getGraficaSmarAccountMembresiaPlanes(this.idCliente, "mensual")
    this.getSaldoMembresia(this.idCliente, "mensual")
    this.getSaldoTotalMembresia(this.idCliente)
    this.getGadgetSaldoMembresia(this.idCliente, "mensual")
    this.getGadgetSaldoPlanesAdicionales(this.idCliente, "mensual")
    this.getGadgetRetiros(this.idCliente, "mensual")
    this.getGadgetRendimientos(this.idCliente, "mensual") 
    this.getUserData()
  
  }


  varWallet=""
  getUserData() {
    this.leerToken()
    this.userService.getUser(this.email).subscribe(
      (res) => { 
         console.log(this.varWallet = res["WALLET"].substring(0,4) + "..." +  res["WALLET"].substring(res["WALLET"].length-4,res["WALLET"].length)  )
      }
    )
  }

  /********************************************************************** */
  /*               Saldo Rendimientos por Mes - Año  Gadget               */
  /********************************************************************** */
  gadgetRendimientos ;
  getGadgetRendimientos(idSuscriptor, periodo) {
    this.ctasService.getGadgetRendimientos(idSuscriptor,periodo).subscribe(
      (data) => {
        console.log(this.gadgetRendimientos = data["Saldo"]);
      },
      (err) => {
        console.log("error");
      }
    );
  }

  /********************************************************************** */
  /*                   Saldo Retiros por Mes - Año  Gadget                */
  /********************************************************************** */
  gadgetRetiros ;
  getGadgetRetiros(idSuscriptor, periodo) {
    this.ctasService.getGadgetRetiros(idSuscriptor,periodo).subscribe(
      (data) => {
        console.log(this.gadgetRetiros = data["Saldo"]);
      },
      (err) => {
        console.log("error");
      }
    );
  }


  /********************************************************************** */
  /*                 Saldo Membresía por Mes - Año  Gadget                */
  /********************************************************************** */
  gadgetSaldomembresia ;
  getGadgetSaldoMembresia(idSuscriptor, periodo) {
    this.ctasService.getGadgetSaldoMembresia(idSuscriptor,periodo).subscribe(
      (data) => {
        console.log(this.gadgetSaldomembresia = data["Saldo"]);
      },
      (err) => {
        console.log("error");
      }
    );
  }

  /********************************************************************** */
  /*              Saldo P. Adicionales por Mes - Año  Gadget              */
  /********************************************************************** */
  gadgetSaldoPlanesAdicionales;
  getGadgetSaldoPlanesAdicionales(idSuscriptor, periodo) {
    this.ctasService.getGadgetSaldoPlanesAdicionales(idSuscriptor,periodo).subscribe(
      (data) => {
        console.log(this.gadgetSaldoPlanesAdicionales = data["Saldo"]);
      },
      (err) => {
        console.log("error");
      }
    );
  }

  /********************************************************************** */
  /*              Obtiene el monto total de la cuenta Smart               */
  /********************************************************************** */
  totalSaldoMembresia;
  getSaldoTotalMembresia(idSuscriptor) {
    this.ctasService.getSaldoTotalMembresia(idSuscriptor).subscribe(
      (data) => {
        console.log(this.totalSaldoMembresia = data[0]["Total"]);
      },
      (err) => {
        //this.showNotification('top','left');
        console.log("error");
      }
    );
  }


  /********************************************************************** */
  /*                           Saldo Membresía Mes y Año                  */
  /********************************************************************** */
    getSaldoMembresia(idSuscriptor,periodo) {
    console.log("obteniendo estado de cuenta");
    this.ctasService.getSaldoMembresia(idSuscriptor,periodo).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        //this.showNotification('top','left');
        console.log("error");
      }
    );
  }

  /********************************************************************** */
  /*           Grafica Smart Account Membresía + Planes (Azul)            */
  /********************************************************************** */
  arr_DatosAzul=[]
  getGraficaSmarAccountMembresiaPlanes(idSuscriptor, periodo) {
    this.arr_DatosAzul=[]
        console.log(periodo)
        this.ctasService.getGraficaSmarAccountMembresiaPlanes(idSuscriptor, periodo).subscribe(
          (res) => {
        this.getGraficaSmarAccountMembresia(idSuscriptor, periodo)
         console.log(res)
        let val:any=res
        let arr_data = []
        let arr_labels = []
        val.forEach((element) => {
          arr_data.push(element.Cuenta)
          if(periodo == "mensual")
            arr_labels.push(element.Dia)
          if(periodo == "anual")
            arr_labels.push(element.Mes)
        }) 
            this.arr_DatosAzul =  arr_data
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /********************************************************************** */
  /*               Grafica Smart Account Membresía (verde)                */
  /********************************************************************** */
  getGraficaSmarAccountMembresia(idSuscriptor, periodo) {
    this.ctasService.getGraficaSmarAccountMembresia(idSuscriptor, periodo).subscribe(
      (res) => {
        console.log(res)
        let val:any=res
        let arr_data = []
        let arr_labels = []
        val.forEach((element) => {
          arr_data.push(element.Cuenta)
          if(periodo == "mensual")
            arr_labels.push(element.Dia)
          if(periodo == "anual")
            arr_labels.push(element.Mes)
        })
        console.log(this.arr_DatosAzul)
        console.log(arr_data)
        this.lineChartData = [
          { data: arr_data, label: 'Saldo Membresía' },
          { data: this.arr_DatosAzul, label: 'Saldo Membresía + Planes' }
        ];
        this.lineChartLabels = arr_labels;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  
  /********************************************************************** */
  /*              Selecciona Periodo  de visualización de datos           */
  /********************************************************************** */
  montoBononsTotalesGenerados: any = 0;
  
  onChange(deviceValue) {
    this.leerToken();
    this.getGraficaSmarAccountMembresiaPlanes(this.idCliente,  deviceValue.toString())
    this.getGraficaSmarAccountMembresia(this.idCliente, deviceValue.toString())
    this.getGadgetSaldoMembresia(this.idCliente, deviceValue.toString())
    this.getGadgetSaldoPlanesAdicionales(this.idCliente, deviceValue.toString())
    this.getGadgetRetiros(this.idCliente, deviceValue.toString())
    this.getGadgetRendimientos(this.idCliente, deviceValue.toString()) 
    deviceValue=""
  }

/*********************************************************/
/******************Grafica de rendimientos ***************/
  rendChartData: ChartDataSets[] = [{ data: [1600, 2500, 3800, 250,3000], label: 'Rendimiento' }];
  rendChartLabels: Label[] = ['Abr', 'May', 'Jun', 'Jul','Aug'];

  rendChartOptions = {
    layout: {
      padding: {
          left: 5,
          right: 5,
          top: 5,
          bottom: 5
      }
    },
    responsive: true, 
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        display:false
      }],
      xAxes: [{
        display:false
      }]
    },
    legend: {
        display:false
      }
  };

  rendChartColors: Color[] = [
       {
      borderColor: '#0093D6',
      backgroundColor: '#F8F8F8',
    },
  ];

  rendChartLegend = false;
  rendChartPlugins = [];
  rendChartType = 'line';
/************************************************* */
  /******************Grafica de SAldo Membresía ***************/
     membresiaChartData: ChartDataSets[] = [
     { data: [1526, 1576, 1620, 1705,1725], label: 'Saldo Inicial' }

  ];

  membresiaChartLabels: Label[] = ['Abr', 'May', 'Jun', 'Jul','Aug'];

  membresiaChartOptions = {
    layout: {
      padding: {
          left: 5,
          right: 5,
          top: 5,
          bottom: 5
      }
    },
    responsive: true, 
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        display:false
      }],
      xAxes: [{
        display:false
      }]
    },
    legend: {
        display:false
      }
  };

  membresiaChartColors: Color[] = [

       {
      borderColor: '#5FC868',
      backgroundColor: '#F8F8F8'//'rgba(95, 200, 104)',
    },
  ];

  membresiaChartLegend = false;
  membresiaChartPlugins = [];
  membresiaChartType = 'line';
/******************************************************* */
  /******************Grafica de Planes Adicional ***************/
     planesChartData: ChartDataSets[] = [
     { data: [1450, 3200, 3605, 3752,3600], label: 'Saldo Inicial' }

  ];

  planesChartLabels: Label[] = ['Abr', 'May', 'Jun', 'Jul','Aug'];

  planesChartOptions = {
    layout: {
      padding: {
          left: 5,
          right: 5,
          top: 5,
          bottom: 5
      }
    },
    responsive: true, 
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        display:false
      }],
      xAxes: [{
        display:false
      }]
    },
    legend: {
        display:false
      }
  };

  planesChartColors: Color[] = [

       {
      borderColor: '#0093D6',
      backgroundColor: '#F8F8F8',
    },
  ];

  planesChartLegend = false;
  planesChartPlugins = [];
  planesChartType = 'line';
/************************************************* */
/******************Grafica de Planes Retiros ***************/
  retirosChartData: ChartDataSets[] = [
  { data: [1450, 1469, 1501, 1250,1400], label: 'Saldo Inicial' }

  ];

  retirosChartLabels: Label[] = ['Abr', 'May', 'Jun', 'Jul','Aug'];

  retirosChartOptions = {
    layout: {
      padding: {
          left: 5,
          right: 5,
          top: 5,
          bottom: 5
      }
    },
    responsive: true, 
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        display:false
      }],
      xAxes: [{
        display:false
      }]
    },
    legend: {
        display:false
      }
  };

  retirosChartColors: Color[] = [

       {
      borderColor: '#0093D6',
      backgroundColor: '#F8F8F8',
    },
  ];

  retirosChartLegend = false;
  retirosChartPlugins = [];
  retirosChartType = 'line';
/************************************************* */
  /******************Grafica de Crecimiento de Inversión ***************/
  invChartData: ChartDataSets[] = [{}];

  invChartLabels: Label[] = [];

  invChartOptions = {
      responsive: true, 
    	maintainAspectRatio: false,
			spanGaps: false,
			elements: {
				line: {
					tension: 0
				}
			},
			plugins: {
				filler: {
					propagate: false
				}
			},
			scales: {
        xAxes: [{
          display:true,
					ticks: {
						autoSkip: false,
						maxRotation: 90,
						minRotation: 90
          },
				}]
			}
  };

  invChartColors: Color[] = [

       {
     borderColor: '#5FC868',
      backgroundColor: 'rgba(95, 200, 104,0)',
    },
  ];

  invChartLegend = false;
  invChartPlugins = [];
  invChartType = 'line';
/************************************************* */
  // array of all items to be paged
  private allItems: any[];
  ocultarTabla = false;
  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];

  myDate;

  verTodo: boolean = false;
  verDetalle: boolean = false;

  arrayEstadoCuenta;
  arrayCuentas;

  arrayRendimientos_Todo;
  arrayPlanes;

  userToken;
  Nombre: string;
  Apellidos: string;
  idCliente;
  email;
  idPlan;
  desc_plan;
  Plan_Porc;
  year;
  month;

  fec_contrat_cta;
  fec_inicalc_cta;
  Id_plan;
  Rend_fec;
  Ren_USD;

  Id_cuenta;

  saldoTotal;
  saldoInicial;
  noPlanes;

  tituloCard;

  saldoActualPlanesAdicionales = 0;
  SaldoActualMembresia = 0;
  montoMembresia = 0;
  montoPlanesAdicionales = 0;

  totalRetiros = 0;

  mostrarDetEdoCuenta = false;

  today = new Date(); 
 

 
 

  retiro(idCuenta, capital, fechaInicio, plan) {
    //this.ctasService.getNivelSocio(idCuenta)
    this.funcionRetiro(idCuenta, capital, fechaInicio, plan);
    this.leerToken()
    
  }

  padLeft(text, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr(size * -1, size);
  }

  getSumatorias() {
    this.saldoActualPlanesAdicionales = 0;
    this.SaldoActualMembresia = 0;
    this.montoMembresia = 0;
    this.montoPlanesAdicionales = 0;
    console.log(this.arrayEstadoCuenta)
    this.arrayEstadoCuenta.forEach((element) => {
         console.log(element)
      if (element.isPlan == 0) {
        this.saldoActualPlanesAdicionales =
          this.saldoActualPlanesAdicionales + element.Acumulado;
      }
      if (element.isPlan == 1) {
        this.SaldoActualMembresia =
          this.SaldoActualMembresia + element.Acumulado;
      }
      if (element.isPlan == 0) {
        this.montoPlanesAdicionales =
          this.montoPlanesAdicionales + element.capital;
      }
      if (element.isPlan == 1) {
        this.montoMembresia = this.montoMembresia + element.capital;
      }
    });

    this.saldoTotal =
      this.SaldoActualMembresia +
      this.saldoActualPlanesAdicionales -
      this.totalRetiros;
    console.log(
      this.SaldoActualMembresia + " " + this.saldoActualPlanesAdicionales
    );
  }

  funcionRetiro(idCuenta, capital, fechaInicio, plan) {
    var date1: any = new Date(fechaInicio);
    var date2: any = new Date();
    var diffDays: any = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
    this.leerToken()
    let nombre = this.Nombre;
    let myEmail = this.email;
    let walletConf = this.varWallet
    console.log("email-> " + this.email);

    this.leerToken();
    let idSuscriber = this.idCliente;
    let servicioRetiro = this.ctasService;
    let userService = this.userService;
    let este = this;
    let numCte = this.idCliente
    let fecDeposito = new Date();
    /*   fecDeposito = fecDeposito.setDate(fecDeposito.getDate() + 2); */

    Swal.fire({
      buttonsStyling: false,
      customClass: {
      confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc',
      cancelButton: 'btn btn-round ml-3 txt-btn-sbc',
      input: 'input-modal-sbc'
      },
      imageUrl: './../assets/img/misc-icons/verified-user-success.svg',
      imageWidth: 200,
      imageHeight: 200,
      title: this.translateservice.getTranslate('Account.WithdrawMsg.Title'),
      html:
      this.translateservice.getTranslate('Account.WithdrawMsg.Msg01') + "<b>" +
        plan +
        "</b>" +
        "<br><br>" + this.translateservice.getTranslate('Account.WithdrawMsg.Msg02') +
        "<b>" + 
        capital +
        "</b>",

      input: "number",
      inputPlaceholder: this.translateservice.getTranslate('Account.WithdrawMsg.Placeholder'),
      footer: `<p class="text-center">${this.translateservice.getTranslate('Account.WithdrawMsg.Footer01')}: 14% <br> ${this.translateservice.getTranslate('Account.WithdrawMsg.Footer02')}: 0%</p>`,
      cancelButtonText: this.translateservice.getTranslate('Account.WithdrawMsg.Cancel'),
      confirmButtonText: this.translateservice.getTranslate('Account.WithdrawMsg.Continue'),
      showCloseButton: true,
      showCancelButton: true,
    }).then(function (result) {
      if (result) {
        if (result.value > capital) {
          Swal.fire({
            buttonsStyling: false,
            customClass: {
              confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc'
            },
            icon: 'warning',
            title: this.translateservice.getTranslate('Account.NoFundMsg.Title'),
            text: this.translateservice.getTranslate('Account.NoFundMsg.Msg'),
          });
          return;
        }
        if (result.value == undefined) {
          Swal.fire({
            buttonsStyling: false,
            customClass: {
              confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc'
            },
            icon: 'error',
            title: this.translateservice.getTranslate('Account.ErrorMsg.Title'),
            text: this.translateservice.getTranslate('Account.ErrorMsg.Msg'),
          }); /* "Error", "La cantidad no es válida", "error" */
          return;
        }
        if (
          result.value > 0 &&
          result.value <= capital &&
          result.value != undefined
        ) {
          let retiro: number = parseInt(result.value.toString());
          let retiroComision = (retiro * 14) / 100;
          var d = new Date(fechaInicio);
          let strHtml =
            "<b>" +
            plan +
            "</b><br>" +
            "</b> <br>" + this.translateservice.getTranslate('Account.StartDate') +"<b>" +
            fechaInicio.substring(0, 10) +
            "<br></b>" +
            this.translateservice.getTranslate('Account.FutureDate') + "<b>" +
            (d.getFullYear() + 1) +
            "-" +
            d.getMonth() +
            "-" +
            d.getDay() +
            "</b><br><br>" +
            this.translateservice.getTranslate('Account.AvailableBalance') + "<b> " +
            capital +
            " USD";
          strHtml =
            strHtml +
            "<br><br>" + this.translateservice.getTranslate('Account.WithdrawAmmount') + "<b>" +
            result.value +
            " USD</b><br>";
          if (diffDays < 361) {
            strHtml =
              strHtml +
              this.translateservice.getTranslate('Account.Comission') + "<b>" +
              retiroComision +
              " USD</b>";
          }
          strHtml =
            strHtml +
            "<br><br> <span style='color:#11458e' >" + this.translateservice.getTranslate('Account.DepositAmmount') +
            (retiro - retiroComision) +
            " USD </span>";
          strHtml = strHtml + "<br><br>" + this.translateservice.getTranslate('Account.Continue');
          Swal.fire({
            buttonsStyling: false,
            customClass: {
            confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc',
            cancelButton: 'btn btn-round ml-3 txt-btn-sbc',
            input: 'input-modal-sbc'
            },
            imageUrl: './../assets/img/misc-icons/update-icon.svg',
            imageWidth: 100,
            imageHeight: 100,
            title: this.translateservice.getTranslate('Account.Confirm.Title'),
            html: strHtml,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: this.translateservice.getTranslate('Account.Confirm.Yes'),
            cancelButtonText: this.translateservice.getTranslate('Account.Confirm.No'),
          }).then(function (res) {
            if (res.isConfirmed) {
              servicioRetiro
                .postRetiro(idCuenta, idSuscriber, result.value)
                .subscribe((data) => {
                  console.log(data);
                  Swal.fire({
                    buttonsStyling: false,
                    customClass: {
                      confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc'
                    },
                    title: this.translateservice.getTranslate('Account.SuccessMsg.Title'),
                    html: this.translateservice.getTranslate('Account.SuccessMsg.Msg') + idSuscriber,
                    icon: "success",
                  });
                });
              
              userService
                .envioEmailGeneral(
                  "mail@smartbusinesscorp.info",
                  myEmail, //ismaelalmaraz@live.com.mx karenlazcanooo@gmail.commoises.moran@smartbusinesscorp.com
                  "",
                  `
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Retiro de planes adicionales</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
.gray-bg {
background-color: #e5e7e9 !important;
padding: 16px 0;
margin: 0;
}
.table-sbc {
width: 600px;
border: 0;
text-align: center;
background: #ffffff;
margin: 0 auto;
}
/* Media Query */
@media only screen and (max-width: 599px) {
.table-sbc {
width: 100%;
}
}
</style>
</head>
<body style="font-family: Arial; margin: 0; padding: 0;" bgcolor="#e5e7e9">
<div class="gray-bg">
<table class="table-sbc" cellpadding="0" cellspacing="0">
<tr>
<td align="center">
<img src="https://smartbusinesscorp.com/smartbusinesscorp.com/correo/header_4.png" alt="header" width="100%" style="display: block;">
</td>
</tr>   
<tr>
<td style="font-family: Arial; font-weight: 900; font-size: 25px; line-height: 29px; color: #164194; padding: 40px 0px 10px;" align="center">
¡Hola,  ${nombre}!
</td>
</tr>
<tr>
<td style="font-family: Arial; font-size: 15px; line-height: 18px; padding: 22px 107px 0px 91px;">
Solicitaste un retiro de tu Smart Account por la cantidad de ${retiro} USD.
</td>
</tr>
<tr>
<td style="font-family: Arial; font-size: 15px; line-height: 8px; padding: 15px 107px 2px 91px;">
<p><font color="#0093d6"><b>Retiro solicitado</b></font></p>
<p><b>Cantidad a retirar:</b> ${retiro} USD</p>
<p><b>Comisión:</b> ${retiroComision}</p>
<p><b>Total:</b> ${retiro - retiroComision}</p>
</td>
</tr>
<tr>
<td style="font-family: Arial; font-size: 13px; line-height: 15px; text-align: center; padding: 13px 112px 8px;" align="center">
<p>El retiro será realizado en la en la wallet de Bitcoin que tienes registrada en tu Smart Office: </p>
<p><font color="#0093d6" style="font-size: 16px;"><b> ${walletConf}</b></font> <br> 
(poner primero 4 dígitos de la wallet registrada, puntos suspensivos y 4 últimos dígitos de la wallet registrada)</p>
</td>
</tr>
<tr>
<td style="font-family: Arial; font-size: 15px; line-height: 18px; padding: 8px 107px 20px 91px;">
<p>A partir de este momento, tu solicitud será revisada y en un lapso de 48 a 72 horas hábiles podrás recibir tu retiro.</p>
<p>Revisa en tu Smart Office que tu cuenta Wallet de Bitcoin, de lo contrario, el depósito de tu retiro no se realizará.</p>
</td>
</tr>
<tr>
<td style="padding: 10px 0px;" bgcolor="#ffffff">
<table border="0" cellpadding="0" cellspacing="0" align="center" width="240">
<tr>
<td style="border-radius: 5px; padding: 7px 18px;" align="center" width="240" bgcolor="#164194">
<a href="https://sbcmexico.club/#/cuenta" target="_blank" style="font-family: Arial; font-weight: 700; font-size: 17px; text-align: center; text-decoration: none; color: #ffffff; display: inline-block;">
Acceder a Smart Office
</a>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td align="center" style="font-family: Arial; font-weight: 400; font-size: 13px; color: #164194; padding: 20px;">
Cualquier duda o aclaración envíanos un correo<br> a
<b><a href="mailto:asesoria@smartbusinesscorp.com" target="_top" style="color: #0093d6;">
asesoria@smartbusinesscorp.com
</a>
</b>
o un whatsapp al
<b><a href="https://bit.ly/asesoriasbc" style="color: #0093d6;">
+52 56 1175 4467
</a>
</b>
</td>
</tr>
<td align="center" style="font-family: Arial; font-weight: 700; font-size: 20px; line-height: 23px; color: #164194; padding: 20px 0 30px;">
Equipo de Smart Business Corp
</td>
<tr>
<td align="center">
<img src="https://smartbusinesscorp.com/smartbusinesscorp.com/correo/footer.png" alt="¡Hagamos juntos que las cosas sucedan!" width="100%" style="display: block;">
</td>
</tr>   
<tr>
<td style="padding: 16px;" align="center" bgcolor="#164194">
<a href="https://www.facebook.com/smartbusinesscorpoficial" style="padding-top: 5px; text-decoration: none; border: none;">
<img src="https://smartbusinesscorp.com/smartbusinesscorp.com/correo/facebook.png" height="30">
</a>
<a href="https://www.youtube.com/smartbusinesscorp" style="padding-top: 5px; text-decoration: none; border: none;">
<img src="https://smartbusinesscorp.com/smartbusinesscorp.com/correo/youtube.png" height="30">
</a>
<a href="https://www.instagram.com/smartbusinesscorp" style="padding-top: 5px; text-decoration: none; border: none;">
<img src="https://smartbusinesscorp.com/smartbusinesscorp.com/correo/instagram.png" height="30">
</a>
<a href="https://twitter.com/SBC_Mexico" style="padding-top: 5px; text-decoration: none; border: none;">
<img src="https://smartbusinesscorp.com/smartbusinesscorp.com/correo/twitter.png" height="30">
</a>
<a href="https://www.linkedin.com/company/smartbusinesscorp" style="padding-top: 5px; text-decoration: none; border: none;">
<img src="https://smartbusinesscorp.com/smartbusinesscorp.com/correo/linkedin.png" height="30">
</a>
</td>
</tr>
<tr>
<td style="font-family: Arial; font-size: 11px; line-height: 14px; color: #ffffff; padding: 16px; border: #164194;" align="center" bgcolor="#164194">
© 2020 Smart Fund Limited.<br>
No respondas a este correo electrónico. Este buzón no se supervisa y no recibirá respuesta.<br>
Si quieres dejar de recibir correos de este remitente,
<a href="#" target="_blank" style="text-decoration: none; color: #44dff6;">haz clic aquí.</a>
</td>
</tr>
<tr>
<td style="font-family: Arial; font-size: 10px; line-height: 14px; color: #000000; padding: 20px;" align="center" bgcolor="#ffffff">
<b>SBC SMARTFUND LIMITED ("SBC")</b>
Es una empresa de la República de Vanuatu con domicilio <br>comercial en Pot 805/103 Rue D'Auvergne, Port Vila, Vanuatu con número de registro 700358.
</td>
</tr>
</table>
</div>
</body>
</html>`,
              this.translateservice.getTranslate('Account.WithdrawalRequest')
                )
                .subscribe((data) => {este.getEstdoCuenta(idSuscriber)});
            }
          });
        }
      }
    });
  }

  ngOnInit(): void {

    this.translateservice.onLangChangeSuscription(this.changeLangHandler);
    this.changeLangHandler();

    var today = new Date();
    this.month = today.getMonth() + 1;
    this.year = today.getFullYear();
    
    this.leerToken();
    this.getCuentas(this.idCliente, "M");
    this.getSaldoActual(this.idCliente);
    this.getMontoInicial(this.idCliente);
    this.getNoPlanes(this.idCliente);
    this.getEstdoCuenta(this.idCliente);

  }

  setPage(page: number) {
    // get pager object from service
    if (this.arrayRendimientos_Todo == undefined) {
      return;
    }
    this.pager = this.pagerService.getPager(
      this.arrayRendimientos_Todo.length,
      page
    );

    // get current page of items
    console.log("this.arrayRendimientos_Todo");
    console.log(this.arrayRendimientos_Todo);

    this.pagedItems = this.arrayRendimientos_Todo
 
  }

  changeViewe() {
    this.verTodo = !this.verTodo;
  }

  getEstdoCuenta(idCliente) {
    console.log("obteniendo estado de cuenta");
    this.ctasService.getEstadoCuenta(idCliente).subscribe(
      (data) => {
        this.arrayEstadoCuenta = data;
        this.arrayEstadoCuenta.forEach(element => {
          if(element['fechaInicio']) {
            var date = new Date(element['fechaInicio']);
            element['fechaInicio'] = formatDate(
              date.setMinutes(date.getMinutes() + date.getTimezoneOffset()),
              "yyyy-MM-dd", 
              "en"
            );
          }
          if(element['fechaInicioRetiro']) {
            var date = new Date(element['fechaInicioRetiro']);
            element['fechaInicioRetiro'] = formatDate(
              date.setMinutes(date.getMinutes() + date.getTimezoneOffset()),
              "yyyy-MM-dd", 
              "en"
            );
          }
        });
          
        this.getSumatorias();
      },
      (err) => {
        console.log("error");
      }
    );
  }

  onVerDetalle(idcuenta) {
    console.log(idcuenta);
    this.leerToken();
    this.Id_cuenta = idcuenta;
    console.log("Mes " + this.month + " año " + this.year);
    
    this.getCtaRendMesAnio(this.Id_cuenta, this.month, this.year);
    this.setAccountBalancePdfValues(this.Id_cuenta);
    this.ctasService.getPlanById(idcuenta).subscribe(
      (data) => {
        console.log(data);
        this.arrayCuentas = data;

        this.arrayEstadoCuenta.map((x) => (x.isSelected = false));
       
        this.arrayEstadoCuenta.find(
          (x) => x.idcuenta === idcuenta
        ).isSelected = true;

        console.log(data[0]["Id_plan"]);
        if (data[0]["fec_contrat"] != null) {
          this.fec_contrat_cta = data[0]["fec_contrat"].substring(0, 10);
        }
        if (data[0]["fec_inicalc"] != null) {
          this.fec_inicalc_cta = data[0]["fec_inicalc"].substring(0, 10);
        }

        this.Id_cuenta = data[0]["id_cuenta"];
        //this.getPlan(data[0]["Id_plan"]);
        console.log(data)
        this.getRendimientosTodo(data[0]["id_cuenta"]);
        this.getSelectedPlan(data[0]["Id_plan"]);

        //this.tituloCard = "DETALLES DE " + data[0]["Description"];
      },
      (err) => {}
    );
  }

  onBuscar() {
    if (this.Id_cuenta == null || this.Id_cuenta == "") {
      Swal.fire({
        icon: "info",
        text: this.translateservice.getTranslate('Account.InfoMsg'),
      });
    } else {
      console.log("estoy buscando");
      console.log(this.month);
      console.log(this.year);
      console.log(this.Id_cuenta);
      this.getCtaRendMesAnio(this.Id_cuenta, this.month, this.year);
      this.setAccountBalancePdfValues(this.Id_cuenta);
    }
  }

  getSaldoActual(idCliente) {
    console.log("getSaldoActual " + idCliente);
    this.ctasService.getMontoActual(idCliente).subscribe(
      (data) => {
        //this.saldoTotal = data["MontoActual"];
        this.totalRetiros = data["retiros"];
        console.log(this.saldoTotal);
      },
      (err) => {
        //this.showNotification('top','left');
        console.log("no hay saldos");
        this.saldoTotal =
          this.SaldoActualMembresia + this.saldoActualPlanesAdicionales;
      }
    );
  }

  getMontoInicial(idCliente) {
    this.ctasService.getMontoInicial(idCliente).subscribe(
      (data) => {
        this.saldoInicial = data["TotalInicial"];
      },
      (err) => {
        //this.showNotification('top','left');
        console.log(err);
      }
    );
  }

  getNoPlanes(idCliente) {
    this.ctasService.getNoPlanes(idCliente).subscribe(
      (data) => {
        this.noPlanes = data[0]["Cuentas"];
      },
      (err) => {
        //this.showNotification('top','left');
        console.log(err);
      }
    );
  }

  /*getNoPlanes(idCliente){
    this.ctasService.getNoPlanes(idCliente).subscribe(
      (data) =>{
        this.Rend_fec  = data[0]["Rend_fec"]
        this.Ren_USD   = data[0]["Ren_USD"]
      }, (err) => {
        //this.showNotification('top','left');
        console.log(err);
      });
  }*/

  getRendimientosTodo(idcuenta) {
    this.ctasService.getCtaRend(idcuenta, "ALL").subscribe(
      (data) => {
        console.log("data pdf", data);
        this.arrayRendimientos_Todo = data;
        this.arrayRendimientos_Todo.forEach(element => {
          if (element['Rend_fecn']) {
            var date = new Date(element['Rend_fecn']);
            element['Rend_fecn'] = formatDate(
              date.setMinutes(date.getMinutes() + date.getTimezoneOffset()),
              "yyyy-MM-dd", 
              "en"
            )
          }
        });
        
        //this.setPage(1);
      },
      (err) => {
        //this.showNotification('top','left');
        console.log(err);
      }
    );
  }

  // getRendimientos(idcuenta) {
  //   this.ctasService.getCtaRend(idcuenta, "TOP5").subscribe(
  //     (data) => {
  //       this.arrayRendimientos_Todo = data;
  //       console.log("data hey", this.arrayRendimientos_Todo);
  //       this.arrayRendimientos_Todo.forEach(element => {
  //         if (element['Rend_fecn']) {
  //           var date = new Date(element['Rend_fecn']);
  //           element['Rend_fecn'] = formatDate(
  //             date.setMinutes(date.getMinutes() + date.getTimezoneOffset()),
  //             "yyyy-MM-dd", 
  //             "en"
  //           )
  //         }
  //       });
  //     },
  //     (err) => {
  //       //this.showNotification('top','left');
  //       console.log(err);
  //     }
  //   );
  // }

  getGraficaDetInversion(idSuscriber, idcuenta, month, year)
  {
    this.ctasService.getDetInversion(idSuscriber,idcuenta, month, year).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        //this.showNotification('top','left');
        console.log(err);
      }
    );
  }

  dataMes = []
  dataUSD=[]
  dataDates=[]
  getCtaRendMesAnio(idcuenta, month, year) {
    this.ctasService.getCtaRendMesAnio(idcuenta, month, year).subscribe(
      (data) => {
        console.log(data);
        this.dataMes = [];
        this.dataUSD=[];
        this.dataDates=[];
        if (data.status == "ok") {
          this.mostrarDetEdoCuenta = true;
          this.ocultarTabla = false;

          let itemsProcessed = 0;
         
          data.data.forEach((item, index, array) => {

            let reg_date = new Date (item.Rend_fecn);  
            let reg_date_format = item.Rend_fecn != null? formatDate(reg_date.setMinutes((reg_date.getMinutes() + reg_date.getTimezoneOffset())),'yyyy-MM-dd','en'):"";
            item.Rend_fecn = reg_date_format;
           
            itemsProcessed++;
            if(itemsProcessed === array.length) {

              this.arrayRendimientos_Todo = data.data;
              this.ItemsReport = data.data;
            
              this.setPage(1);
              
              this.arrayRendimientos_Todo.forEach(element =>
                {
                    this.dataMes.push(element.REND_day)
                    this.dataUSD.push(element.Ren_USD)
    
                });
                
                if(data.data) {
                  data.data.forEach(element => {
                    if (element['Rend_fecn']) {
                      var date = new Date(element['Rend_fecn']);
                      this.dataDates.push(formatDate(date.setMinutes(date.getMinutes() + date.getTimezoneOffset()), "MMM/dd", "en"));
                    }
                  });
                }
              
              this.invChartData = [{ data: this.dataUSD.reverse(), label: 'Rendimiento' }];
              this.invChartLabels = this.dataDates;
              //this.invChartLabels = ['1', '2', '3', '4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];
              console.log(this.dataMes) 
              console.log(this.dataUSD) 

            }
            
          });

       
        } else {
          this.ocultarTabla = true;
          this.mostrarDetEdoCuenta = false;
        }
      },
      (err) => {
        //this.showNotification('top','left');
        console.log(err);
      }
    );
  }

  getPlanes(id_cliente) {
    this.ctasService.getPlanes(id_cliente).subscribe(
      (data) => {
        this.arrayPlanes = data;
      },
      (err) => {
        //this.showNotification('top','left');
        console.log(err);
      }
    );
  }

  //Obtiene membresia o plan adicional
  getSelectedPlan(id_plan) {
    this.ctasService.getPlan(id_plan).subscribe(
      (dataPlan) => {
        this.arrayCuentas = dataPlan;
        this.desc_plan = dataPlan[0]["Description"];
        this.Plan_Porc = dataPlan[0]["RPercent"];
        this.Id_plan = dataPlan[0]["Plan_ID"];
        this.tituloCard = dataPlan[0]["Description"];

      },
      (err) => {
        //this.showNotification('top','left');
        console.log(err);
      }
    );
  }

  /*   onPlanSelection(event) {
    if (event.isUserInput) {
      console.log(event.source.value);
      this.ctasService.getPlanById(event.source.value).subscribe(
        (data) => {
          this.arrayCuentas = data;
          console.log(data);
          this.fec_contrat_cta = data[0]["fec_contrat"].substring(0, 10);
          this.fec_inicalc_cta = data[0]["fec_inicalc"].substring(0, 10);
          this.Id_cuenta = data[0]["id_cuenta"];
          //this.getPlan(data[0]["Id_plan"]);
          this.getRendimientosTodo(data[0]["id_cuenta"]);
          console.log(data[0]["Id_plan"]);
          this.getSelectedPlan(data[0]["Id_plan"]);

          // this.tituloCard = "DETALLES DE " + data[0]["Description"];
        },
        (err) => {}
      );
    }
  } */

  getCuentas(idCliente, type) {
    this.ctasService.getMembresia(idCliente, type).subscribe(
      (data) => {
        console.log(data);
        if (data["status"] != false) {
          this.arrayCuentas = data;
          if (data[0]["fec_contrat"] != null)
            this.fec_contrat_cta = data[0]["fec_contrat"].substring(0, 10);
          if (data[0]["fec_inicalc"] != null)
            this.fec_inicalc_cta = data[0]["fec_inicalc"].substring(0, 10);
          this.Id_cuenta = data[0]["id_cuenta"];
          this.saldoInicial = data[0]["Monto"];

          //this.getCtaRendMesAnio(data[0]["id_cuenta"], 3, 2020);

          this.getSelectedPlan(data[0]["Id_plan"]);
          this.getPlanes(idCliente);
        }
      },
      (err) => {
        //this.showNotification('top','left');
        console.log(err);
      }
    );
  }

  leerToken() {
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
      var decoded = jwt_decode(this.userToken);
      this.Nombre = decoded["FirstName"];
      this.Apellidos  = decoded["LastName"];
      this.idCliente = decoded["id_cliente"];
      this.email = decoded["Email"];
    } else {
      console.log("No hay token");
      this.userToken = "";
    }
    return this.userToken;
  }

  getHTML(
    plan,
    saldoDipsp,
    montoRetiro,
    comisionRetiro,
    nuevoSaldoDisponible,
    fechaDepositoProgramado
  ) {
    return `
<body style="background-color:#d1d5e1; font-family: arial">
	<table align="center" border="0" cellpadding="0" cellspacing="0"
		width="550" bgcolor="white" style="border:none;">
		<tbody>
			<tr>
				<td align="center">
					<table align="center" border="0" cellpadding="0"
						cellspacing="0" class="col-550" width="550">
						<tbody>
							<tr>
								<td align="center" style="background-color: white;
										height: 20px;
										padding-top: 10px;
										padding-bottom: 10px;">

									<a href="https://smartfundlimited.com/home/" style="text-decoration: none;">
										<p style="color: #164194;
												font-weight:light;
												font-size: 12px;">
											Smart Business Corp ®
										</p>
									</a>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
			<tr style="height: 300px;">
				<td align="center" style="border: none; ">
					<img src="http://sbcmexico.us:2000/mails/images/head.png" width="550px">
					<p align="center"><img src="http://sbcmexico.us:2000/mails/images/adicionalre-8.png" width="20%"></p>
					<p style="font-weight: bolder;font-size: 21px;
							letter-spacing: 0.025em;
							color:#164194;">
							Solicitaste un retiro de un Plan Adicional
					</p>
				</td>
			</tr>

			<tr style="display: inline-block;">
				<td style="height: 150px;
						padding: 35px;
						border: none;
						background-color: white;">

					<h4 style="text-align: left;
							align-items: center;
							font-family: arial;">
<!-- // ANADIR CODIGO PARA NOMBRE DIRECTO DE BASE DE DATOS -->
						Hola, ${this.Nombre}:
				</h4>
					<p class="data"
					style="text-align: justify-all;
							align-items: center;
							font-size: 14px;
							padding-bottom: 12px;">
						Solicitaste un retiro de tu Smart Account. Revisa que tu perfil cuente con tu Wallet de Bitcoin registrada y todos los documentos completos, de lo contrario el pago no se realizará.
						</p>

<!-- // ANADIR CODIGO PARA NOMBRE DIRECTO DE BASE DE DATOS -->
					<table style="border-style: solid; border-color:#0093d6;">
					<tr><td style="padding: 10px 10px 10px 10px">
					<p style="font-size: 14px; "><b>Plan Adicional contratado:</b> ${plan}</p>
					<p style="font-size: 14px; "><b>Saldo disponible a la fecha:</b> ${saldoDipsp} USD</p>
					<p style="font-size: 14px; "><b>Monto del retiro:</b> ${montoRetiro} USD </p>
					<p style="font-size: 14px; "><b>Comisión por el retiro 14%:</b> ${comisionRetiro} USD</p>
					<p style="font-size: 14px; "><b>Nuevo saldo disponible:</b> ${nuevoSaldoDisponible} USD</p>
					<p style="font-size: 14px; "><b>El depósito está programado para:</b> ${fechaDepositoProgramado}</p>
					</td></tr>
					</table>
					<p style="font-weight: bold; font-size: 14px;">El pago se hará en tu wallet de BTC registrada en un lapso entre 48 y 72 horas hábiles: </p>
					<table style="border-style: solid; border-color:#1AB752; margin: auto;">
					<tr><td style="padding: 10px 10px 10px 10px">
					<p style="font-size: 14px;"> [[ PRIMEROS 4 DIGITOS WALLET]]</p>
					</td></tr>
				    </table>
					<p align="center" style="color:#164194; font-weight: 700; padding: 0px 40px 10px 40px; font-size: 12px;">Cualquier duda o aclaración envíanos un correo a <a href="mailto:asesoria@smartbusinesscorp.com" target="_top">asesoria@smartbusinesscorp.com</a> o un whatsapp al  <a href="https://bit.ly/asesoriasbc">+52 56 1175 4467</a></p>
					<p align="center" style="font-size: 14px; color: #164194; font-weight: bolder;"> Equipo de Smart Business Corp </p>
				</td>
			</tr>
			<tr>
				<td><img src="http://sbcmexico.us:2000/mails/images/foot.png" width="550px"></td>
			</tr>
			<tr style="border: none;
			background-color: #164194;
			height: 60px;
			color:white;
			padding: 10px;
			text-align: center;">

<td height="40px" align="center">
	<a href="https://www.facebook.com/smartbusinesscorpoficial"
	style="border:none;
		text-decoration: none;
		padding: 5px;">

	<img src="http://sbcmexico.us:2000/mails/images/facebook.png" height="70%"/>
	</a>

	<a href="https://www.youtube.com/smartbusinesscorp"
	style="border:none;
	text-decoration: none;
	padding: 5px;">

	<img src= "http://sbcmexico.us:2000/mails/images/youtube.png" height="70%"/>
	</a>

	<a href="https://www.instagram.com/smartbusinesscorp/?hl=es"
	style="border:none;
	text-decoration: none;
	padding: 5px;">

<img src="http://sbcmexico.us:2000/mails/images/instagram.png" height="70%"/>
	</a>

	<a href="https://twitter.com/SBC_Mexico?fbclid=IwAR3SkYNSlUj8NsnaUTCdoDZJYX2L55SL55TFUzFFCxjunMqJL0F_9TDEu-"
	style="border:none;
	text-decoration: none;
	padding: 5px;">

<img src="http://sbcmexico.us:2000/mails/images/twitter.png" height="70%"/>
	</a>

	<a href="https://www.linkedin.com/company/smartbusinesscorp/?originalSubdomain=mx"
	style="border:none;
	text-decoration: none;
	padding: 5px;">

<img src="http://sbcmexico.us:2000/mails/images/linkedin.png" height="70%"/>
	</a>
</td>
</tr>
<tr>
<td bgcolor="164194" style="font-family:'Open Sans', Arial, sans-serif;
		font-size:11px; line-height:14px;
		color: white;
		padding-top: 0px;"
	valign="top"
	align="center">
				© 2020 Smart Fund Limited.<br>
				No respondas a este correo electrónico. Este buzón no se supervisa y no recibirá respuesta.
Si quieres dejar de recibir correos de este remitente,
<!-- // INSERTAR CODIGO PARA UNSUSCRIBE -->
				<a href="#"
				target="_blank"
				style="text-decoration:none;
						color: #44dff6;">haz clic aquí.</a>
<p style="padding:20px; color:#164294; background-color: white;"><b>SBC SMARTFUND LIMITED ("SBC")</b> Es una empresa de la República de Vanuatu con domicilio comercial en Pot 805/103 Rue D'Auvergne, Port Vila, Vanuatu con número de registro 700358.</p>
</td>
			</tr>
			</tbody>
		</table></td>
		</tr>
		</tr>
		</tbody>
	</table>
</body>`;
  }

  Name_to_Report;
  ClientId_to_Report;
  Date_Plan_to_Report;
  ActualDate_to_Report;
  DescrPlan_to_Report;

  ItemsReport: any[];
  label_period_report;
  isPlan;
  
  initialCapital_to_Report = 0;
  actualCapital_to_Report = 0;
  currentBalance_to_Report = 0;


  setAccountBalancePdfValues(idcuenta=0) {
    
    const found =  this.arrayEstadoCuenta.find( (x) => x.idcuenta === idcuenta );
   
    this.Name_to_Report = this.Nombre + " " + this.Apellidos;
    this.ClientId_to_Report = this.idCliente;
    if (found["fechaInicio"]) {
      console.log('fechas', found);
      var date = new Date(found["fechaInicio"]);
      this.Date_Plan_to_Report = formatDate(
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset()),
        "yyyy-MM-dd", 
        "en"
      );
      // this.Date_Plan_to_Report =  found["fechaInicio"];
    }
    this.ActualDate_to_Report = this.today;
    this.DescrPlan_to_Report =  found["Description"];

    this.initialCapital_to_Report = found["capital"];
    this.actualCapital_to_Report = found["capital"];
    this.currentBalance_to_Report = found["Acumulado"];

    this.isPlan = found["isPlan"];

    this.label_period_report = this.months[this.month-1].viewValue +", " + this.year;
 
  }

  donwloadPDF() { 

    if (this.mostrarDetEdoCuenta === true) {

      var options = {
        tableAutoSize:true
      };

      var my_styles = {
                        "table-data": {
                          "color": "#474747",
                          "fontSize": "22"
                        }
                    };

      const report_html = document.getElementById('report_account');
   
      // console.log(report_html.innerHTML);
      var html = htmlToPdfmake(report_html.innerHTML,options);
    
      var documentDefinition = { content: [html], styles: [my_styles] };
      pdfMake.createPdf(documentDefinition).download("statement_account_"+ this.idCliente + "_" + this.months[this.month-1].viewValue + "_" + this.year +".pdf");
      return null; 

    }
    
  }

  private changeLangHandler = () => {

    this.months.forEach( item => {

      this.translateservice.translateCore.get( "General.Months." + item.tag).subscribe((res: string) => {
        
          item.viewValue = res;
      });

    });

  }

}


/*


select  sum(Monto) from cuenta, TipoPlanes
where (cuenta.Id_plan = TipoPlanes.Plan_ID) and TipoPlanes.isplan = 1 and Id_suscriber=107372
group by Id_suscriber



select  Id_suscriber, max(ren_usd) total, sum(ren_rendim) from cuenta, TipoPlanes,Rendim
where (cuenta.Id_plan = TipoPlanes.Plan_ID and Rendim.id_cuenta=cuenta.id_cuenta) 
and TipoPlanes.isplan = 0 and Id_suscriber=107372
group by Id_suscriber, cuenta.id_cuenta

*/




