import { Component, OnInit } from "@angular/core";
import * as jwt_decode from "jwt-decode";
import {Color,Label} from "ng2-charts";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { BonosService } from "../services/BonosEmpresariales/bonos.service";
import { UsuarioService } from "../services/usuario/usuario.service";
import Swal from "sweetalert2";
import { MultiDataSet,PluginServiceGlobalRegistrationAndOptions } from 'ng2-charts';
import { ChangeDetectorRef } from "@angular/core";
import { DashboardService } from "../services/dashboard/dashboard.service"
import {  CuentasService } from "../services/Cuentas/cuentas.service";
import { TranslateEngineService } from "../services/translate/translate-engine.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {

/********************************************************************************************************* */
/*                                                   Variables                                             */
/********************************************************************************************************* */
  public numAsociados ;
  public canvasWidth = 320
  public needleValue = 0
  public options = {}
  id_cliente;
  userToken;
  isProspect;
  ocultar: boolean = false;
  habilitarBotonPlanes = true;
  vOcultarBanner:boolean;
  showPopUp;
  slides = [{'image': '../assets/img/baners/banner1.jpg'}, {'image': '../assets/img/baners/slide2.jpg'},{'image': '../assets/img/baners/slide1.jpg'}, {'image': 'https://gsr.dev/material2-carousel/assets/demo.png'}];
  /* Ocultar banner */
  ocultarBanner():void{
    this.vOcultarBanner = true;
  };

/********************************************************************************************************* */
/*                                    Grafica Afiliados Ejecutivo master                                   */
/********************************************************************************************************* */
  numAfiliadosXCalif=0
  getAfiliadosMasterExecutive(idCliente) {
    this.dashboardService.getAfiliadosMasterExecutive(idCliente).subscribe(
      (res) => {
        console.log(this.numAfiliadosXCalif = res["Socios"])
      },
      (err) => {
        console.log("err");
      }
    );
  }

/********************************************************************************************************* */
/*                                      Grafica Semanas Ejecutivo master                                   */
/********************************************************************************************************* */
  numSemanasXCalif=0
  getSemanasMasterExecutive(idCliente) {
    this.dashboardService.getSemanasMasterExecutive(idCliente).subscribe(
      (res) => {
        console.log(this.numSemanasXCalif = res["Semanas"])
      },
      (err) => {
        console.log("err");
      }
    );
  }
/********************************************************************************************************* */
/*                                          Ingresos Generados                                             */
/********************************************************************************************************* */
  saldo;
  lInferior:string="0";
  lSuperior:string="0";
  recibe;
  ocultaSaldoIngresoMensual=true;
  ingresosGenerados(idCliente) {
    //107142
    this.dashboardService.ingresosGenerados(idCliente).subscribe(
      (data) => {
        this.saldo = data["saldo"];
        this.lInferior =data["lInferior"];
        this.lSuperior = data["lSuperior"];
        console.log(this.recibe = data["recibe"]);
        let divisor=10000
        if (this.saldo <= 0)
        {
          this.saldo = 1
          this.ocultaSaldoIngresoMensual=false
        }
        if (this.lSuperior == "0") {this.lSuperior ="1000"}
        if (this.lSuperior == "0") {divisor=10000}

        this.needleValue = this.saldo / 10000
        console.log(this.needleValue)
          this.options = {
            hasNeedle: true,
            needleColor: '#11458E',
            needleUpdateSpeed: 1000,
            arcColors: ['#0093D6', 'rgba(0, 147, 214, 0.1)'],
            arcDelimiters: [this.saldo/divisor],
            rangeLabel: [this.lInferior.toString(), this.lSuperior.toString()],
            needleStartValue: this.saldo/divisor,
        }
        console.log(this.options)
        },
      (err) => {
        //this.showNotification('top','left');
        console.log(err);
      }
    );
  }
  
/********************************************************************************************************* */
/*                                          Gráfica Bonos generados                                        */
/********************************************************************************************************* */ 
  bonoChartData: ChartDataSets[] = [
     {  }

  ];

  bonoChartLabels: Label[] = [];

  bonoChartOptions = {
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

  bonoChartColors: Color[] = [
       {
      borderColor: '#5FC868',
      backgroundColor: 'rgba(95, 200, 104, 0.1)',
    },
  ];

  bonoChartLegend = false;
  bonoChartPlugins = [];
  bonoChartType = 'line';
  

/********************************************************************************************************* */
/*                                              Ejecutivo Master                                           */
/********************************************************************************************************* */
  public doughnutChartLabels: Label[] = ['X','Y'];
  public doughnutChartData: MultiDataSet = [
    [0, 12],  //el 100% es doce
  ];
  public doughnutChartType: ChartType = 'doughnut';
  doughnutChartLegend = false;
  doughnutChartOptions = { 
            responsive: true, 
    maintainAspectRatio: false ,
    cutoutPercentage: 80,
  }
  doughnutChartChartColors: Array<any> = [
    {
      backgroundColor: ['#0093D6', '#F3F3F2'],
      borderColor: ['#0093D6', '#F3F3F2']
    }
  ];

  /********************************************************************** */
  /*            Obtiene el nivel que elsocio tiene actualmente            */
  /********************************************************************** */
  imagenNivel = "";
  descNivel = ""
  getNivelSocio(id_Cliente) {
        this.cuentasService.getNivelSocio(id_Cliente).subscribe(
          (data) => {
            console.log(data)
            console.log(data[0]["IDNIVEL"])
            this.descNivel = data[0]["Descripcion"]
            this.imagenNivel = "../../assets/img/Niveles/" + data[0]["IDNIVEL"] + ".png"
            console.log(this.imagenNivel)
      },
      (error) => {
        console.log(error);
      }
    );
  }

  mostrarGrafica = false;
  getMasterExecutive(idCliente) {
    this.dashboardService.getMasterExecutive(idCliente).subscribe(
      (data) =>
      {
        console.log(data["Socios"])
        this.numAsociados = 50
         if (data["Socios"] == undefined)
        { this.numAsociados = 0 }
        else
        { this.numAsociados = data["Socios"] } 
        if (this.numAsociados === 12)
          this.mostrarGrafica = false
        else
          this.mostrarGrafica = true
      },
      (err) => {
        //this.showNotification('top','left');
        console.log(err);
      }
    );
  }
  public doughnutChartPlugins: PluginServiceGlobalRegistrationAndOptions[] = [{
    afterDraw(chart) {
      
      const ctx = chart.ctx;

      
      var txt1 = '1';
      const sidePadding = 60;

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);

      const stringWidth = ctx.measureText(txt1).width;

      const fontSizeToUse = 30;
      ctx.font = '4rem Arial';
      ctx.fillStyle = '#5F5F5F';
      console.log(this.numAfiliadosXCalif )
      ctx.fillText( this.numAfiliadosXCalif  , centerX, centerY - 20);
      var fontSizeToUse1 = 2;
      ctx.font = fontSizeToUse1 + 'em Arial';
      ctx.fillText("de 15", centerX, centerY + 30);
    }
  }];

/********************************************************************************************************* */
/*                                                Constructor                                              */
/********************************************************************************************************* */
  constructor(
    private dashboardService: DashboardService,
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef,
    private cuentasService: CuentasService,
    private translateservice: TranslateEngineService
  ) {
    this.leerToken();
    this.getSemanasMasterExecutive(this.id_cliente)
    this.getNivelSocio(this.id_cliente)
    this.getCrecimientoComunidad(this.id_cliente, "mensual")
    this.getCrecimientoBonos(this.id_cliente, "mensual")
    this.getGraficaSociosGeneradosCantidad(this.id_cliente, "mensual")
    this.getGraficaBonosGeneradosCantidad(this.id_cliente, "mensual")
    
  }

/********************************************************************************************************* */
/*                                 Grafica de Bonos generados Cantidad                                     */
/********************************************************************************************************* */
  getGraficaBonosGeneradosCantidad(idSuscriptor, periodo) {
    console.log(periodo)
    this.dashboardService.getGraficaBonosGeneradosCantidad(idSuscriptor, periodo).subscribe(
      (res) => {
        console.log(res)
        let val:any=res
        let arr_data = []
        let arr_labels = []
        val.forEach((element) => {
          arr_labels.push(element.Cuenta)
          if(periodo == "mensual")
            arr_data.push(element.Dia)
          if(periodo == "anual")
            arr_data.push(element.Mes)
        })

        this.bonoChartData = [{ data: arr_labels, label: this.translateservice.getTranslate('Dashboard.LabelBonus')}];

        this.bonoChartLabels = arr_data

      },
      (err) => {
        console.log("err");
      }
    );
  }

/********************************************************************************************************* */
/*                                Grafica de Socios generados Cantidad                                     */
/********************************************************************************************************* */
  getGraficaSociosGeneradosCantidad(idSuscriptor, periodo) {
    this.dashboardService.getGraficaSociosGeneradosCantidad(idSuscriptor, periodo).subscribe(
      (res) => {
        let val:any=res
        let arr_data_soc = []
        let arr_labels = []
        val.forEach((element) => {
          arr_labels.push(element.Cuenta)
          if(periodo == "mensual")
            arr_data_soc.push(element.Dia)
          if(periodo == "anual")
            arr_data_soc.push(element.Mes)
        })

        this.rendChartData = [{ data: arr_labels, label: this.translateservice.getTranslate('Dashboard.LabelAssociates') }];

        this.rendChartLabels = arr_data_soc

      },
      (err) => {
        console.log("err");
      }
    );
  }
/********************************************************************************************************* */
/*                                              Gráfica Comunidad                                          */
/********************************************************************************************************* */
  rendChartData: ChartDataSets[] = [{  }];

  rendChartLabels: Label[] = [];

  rendChartOptions = {
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
      borderColor: ' #B61600',
      backgroundColor: 'rgba(182, 22, 0, 0.1)',
    },
  ];

  rendChartLegend = false;
  rendChartPlugins = [];
  rendChartType = 'line';


/********************************************************************** */
/*             Porcentaje de crecimiento Bonos x Mex x Año              */
/********************************************************************** */
  porcentajeBonos = 0;
  getCrecimientoBonos(idSuscriptor, periodo) {
    this.dashboardService.getCrecimientoBonos(idSuscriptor, periodo).subscribe(
      (res) => {
         let actual;
        let anterior;
        if (anterior == 0 && (actual == 0 || actual == null))
          this.porcentajeBonos = 0
        else if (anterior == 0)
          this.porcentajeBonos = 100
        else if (anterior > 0)
          this.porcentajeBonos = ((actual * 100) / anterior)-100

      },
      (err) => {
        console.log("err");
      }
    );
  }

/********************************************************************** */
/*           Porcentaje de crecimiento Comunidad x Mex xAño             */
/********************************************************************** */
  porcentajeComunidad = 0;
  getCrecimientoComunidad(idSuscriptor, periodo) {
    this.dashboardService.getCrecimientoComunidad(idSuscriptor, periodo).subscribe(
      (res) => {
        let actual;
        let anterior;
        
        if (anterior == 0 && actual == 0)
          this.porcentajeComunidad = 0
        else if (anterior == 0)
          this.porcentajeComunidad = 100
        else if (anterior > 0)
          this.porcentajeComunidad = ((actual * 100) / anterior)-100


      },
      (err) => {
        console.log("err");
      }
    );
  }

/********************************************************************************************************* */
/*                                             Grafica Smart Account                                       */
/********************************************************************************************************* */
  smartAccountLabelsMes=[];
  smartAccountSaldos=[];
  smartAccountLabesAnio = [];
  
  onItemChange(value){
    this.leerToken();
    
    this.gatSaldos(this.id_cliente,value);
  }

  gatSaldos(idCliente, periodo) {
    this.dashboardService.getSmartAccount(idCliente, periodo).subscribe(
      (data) => {
        //this.arrayPaises = data;
        if(periodo=="mensual") {
          this.lineChartLabels = data[0];    // Index 0 es para mes intdex 1 año
        }
          
        if (periodo == "anual") {
          this.lineChartLabels = data[1];    // Index 0 es para mes intdex 1 año
        }
        this.smartAccountLabesAnio = data[1]; //año
        this.lineChartData = [{ data: data[2], label: this.translateservice.getTranslate('Dashboard.LabelBalance')}]
        //this.isDataAvailable=true;
      },
      (err) => {
        //this.showNotification('top','left');
        console.log(err);
      }
    );
  }
  
  lineChartData: ChartDataSets[] = [
     /* { data: [1000, 15000, 16700, 9000, 30000, 11000, 1000, 9000, 38000], label: 'Saldo Inicial' }, */
     { data: this.smartAccountSaldos, label: this.translateservice.getTranslate('Dashboard.LabelTotalBalance') },

  ];

  lineChartLabels: Label[] = this.smartAccountLabesAnio; // ['2012', '2013', '2014','2015', '2016', '2017', '2018', '2019', '2020'];

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
  public text= 4;
  ngAfterViewInit(): void {
    this.cdr.detectChanges();


      let that=this;
  this.doughnutChartPlugins= [{
    beforeDraw(chart) {
      const ctx = chart.ctx;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);

      //const stringWidth = ctx.measureText(txt1).width;

      const fontSizeToUse = 30;
      ctx.font = '4rem Arial';
      ctx.fillStyle = '#5F5F5F';
   
      ctx.fillText( that.numAsociados  , centerX, centerY - 20);
      var fontSizeToUse1 = 2;
      ctx.font = fontSizeToUse1 + 'em Arial';
      ctx.fillText(`de 12`, centerX, centerY + 30);
    },
  }]
  }



/********************************************************************************************************* */
/*                                                   App Init                                              */
/********************************************************************************************************* */
    isDataAvailable:boolean;
  ngOnInit() {
    this.isDataAvailable =false;
    this.leerToken();
    this.gatSaldos(this.id_cliente, "mensual");
    this.getMasterExecutive(this.id_cliente)
    this.getMontoBonosGenerados(this.id_cliente, "mensual")
    this.getSociosGeneradosCantidad(this.id_cliente, "mensual")
    this.ingresosGenerados(this.id_cliente)
    this.getAfiliadosMasterExecutive(this.id_cliente)
    this.isDataAvailable =true;
    if (this.ocultar == false) {
      return;
    }
    this.leerToken();
    if (
      this.id_cliente == null ||
      this.id_cliente == undefined ||
      this.id_cliente == ""
    ) {
      return;
    }
    this.usuarioService
      .validaDataComplete(this.id_cliente)
      .subscribe((data) => {

      });
    console.log(this.habilitarBotonPlanes);
  }
/********************************************************************************************************* */
/*                                              Bonos Generados                                            */
/********************************************************************************************************* */
  montoBononsTotalesGenerados: any = 0;
  
  onChange(deviceValue) {
    this.leerToken();
    this.getMontoBonosGenerados(this.id_cliente, deviceValue.toString())
    this.getCrecimientoBonos(this.id_cliente, deviceValue.toString())
       this.getGraficaBonosGeneradosCantidad(this.id_cliente,deviceValue.toString())
  }

  getMontoBonosGenerados(idCliente,periodo) {
        this.dashboardService.getMontoBonosGenerados(idCliente,periodo).subscribe(
          (data) => {
            console.log(data)
            if (data["Comis"] == null) {
              this.montoBononsTotalesGenerados = "0";
            } else {
              this.montoBononsTotalesGenerados = data["Comis"];
            }
      },
      (err) => {
        //this.showNotification('top','left');
        console.log(err);
      }
    );
  }
  

/********************************************************************************************************* */
/*                                             Cantidad Socios                                             */
/********************************************************************************************************* */
  cantidadSociosGenerados: any = 0;
  
  onChangeSocios(deviceValue) {
    console.log(JSON.stringify(deviceValue));
    this.leerToken();
    this.getSociosGeneradosCantidad(this.id_cliente, deviceValue.toString())
    this.getCrecimientoComunidad(this.id_cliente, deviceValue.toString())
    this.getGraficaSociosGeneradosCantidad(this.id_cliente, deviceValue.toString())
  }

  getSociosGeneradosCantidad(idCliente,periodo) {
        this.dashboardService.getSociosGeneradosCantidad(idCliente,periodo).subscribe(
      (data) => {
            if (data["Socios"] == null) {
              this.cantidadSociosGenerados = "0";
            } else {
              this.cantidadSociosGenerados = data["Socios"];
            }
      },
      (err) => {
        //this.showNotification('top','left');
        console.log(err);
      }
    );
  }


/********************************************************************************************************* */
/*                                            Lee token desde storage                                      */
/********************************************************************************************************* */
  leerToken() {
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
      var decoded = jwt_decode(this.userToken);
      this.isProspect = decoded["isProspect"];
      this.id_cliente = decoded["id_cliente"];

      if (this.isProspect == "0") {
        this.ocultar = true;
      }
      if (this.isProspect == "1") {
        this.ocultar = false;
      }
    } else {
      console.log("No hay token");
      this.userToken = "";
    }
    return this.userToken;
  }
}