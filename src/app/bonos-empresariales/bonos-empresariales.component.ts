import { Component, OnInit } from "@angular/core";
import { BonosService } from "../services/BonosEmpresariales/bonos.service";
import * as jwt_decode from "jwt-decode";
import { Color, Label } from "ng2-charts";
import { from } from "rxjs";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { MultiDataSet, PluginServiceGlobalRegistrationAndOptions } from 'ng2-charts';
import { DashboardService } from "../services/dashboard/dashboard.service"
import { parse } from "bowser";
import { TranslateEngineService } from "../services/translate/translate-engine.service";
import { formatDate } from "@angular/common";

@Component({
  selector: "app-bonos-empresariales",
  templateUrl: "./bonos-empresariales.component.html",
  styleUrls: ["./bonos-empresariales.component.css"],
})
export class BonosEmpresarialesComponent implements OnInit {
  userToken: string;
  id_cliente: string;

  arrayComisionesCobradas;
  arrayComisionesPorCobrar;
  arraySaldosMensuales;
/*********************************************************/
   lineChartData: ChartDataSets[] = [
     {  }

  ];

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
    }
  ];

  lineChartLegend = false;
  lineChartPlugins = [];
  lineChartType = 'line';
/*********************************************************/
  
  constructor(
    private bonosService: BonosService,
    private dashboardService: DashboardService,
    private translateservice: TranslateEngineService

  ) {
    this.leerToken();
    let anio = new Date().getFullYear();
    let month = new Date().getMonth()+1;
    console.log( anio + " " + month) 
    this.getGraficaBonosPagados(this.id_cliente) 
    this.getMontosBonosPagados(this.id_cliente)
    this.getMontoBonosPPagar(this.id_cliente)
    this.getComisionesPorCobrar(this.id_cliente, month, anio)
    this.getComisionesCobradas(this.id_cliente, month, anio)
    this.getNivelesCalificados(this.id_cliente)
    this.getMontoSmartAccount(this.id_cliente)
    this.getMontosBonosPagadosDinamico(this.id_cliente, "mensual")
    this.getRangoActual(this.id_cliente)
    this.getAcumuladoActual(this.id_cliente)
    this.getnexGoal(this.id_cliente)
    this.ingresosGenerados(this.id_cliente)
    this.getNivelesAcumulacion(this.id_cliente)
    this.getFechaPago(this.id_cliente)
    this.getNextLevel(this.id_cliente)
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
        console.log(data)
        console.log(this.recibe = data["recibe"]);

        if (this.saldo <= 0)
        {
          this.saldo = 1
          this.ocultaSaldoIngresoMensual=false
        }
        if (this.lSuperior == "0") {this.lSuperior ="1000"}
 

        this.needleValue = this.saldo/1000
          this.options = {
            hasNeedle: true,
            needleColor: '#11458E',
            needleUpdateSpeed: this.saldo,
            arcColors: ['#0093D6', 'rgba(0, 147, 214, 0.1)'],
            arcDelimiters: [this.saldo/10000],
            rangeLabel: [this.lInferior.toString(), this.lSuperior.toString()],
            needleStartValue: this.saldo/10000,
          }
        },
      (err) => {
        //this.showNotification('top','left');
        console.log(err);
      }
    );
  }

/********************************************************************** */
/*                                 Fecha Pago                           */
/********************************************************************** */
  fecPago ;
  getFechaPago(idSuscriptor) {
    this.bonosService.getFechaPago(idSuscriptor).subscribe(
      (res) => { 
        var fecha = new Date(res[0]["Pago_Fec"])
        var fecha2 = new Date(formatDate(
          fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset()),
          "yyyy-MM-dd HH:mm:ss", 
          "en"
        ));
        this.fecPago = new Date(fecha2.getUTCFullYear(), fecha2.getUTCMonth(), fecha2.getUTCDate(), fecha2.getUTCHours(), fecha2.getUTCMinutes(), fecha2.getUTCSeconds());
    })
  }

/********************************************************************** */
/*                     Gráfica Niveles de Acumulación                   */
/********************************************************************** */
  nivelAcumulacion ;
  getNivelesAcumulacion(idSuscriptor) {
    this.bonosService.getNivelesAcumulacion(idSuscriptor).subscribe(
      (res) => { 
        //console.log(this.nivelAcumulacion = res[0]["Nivel"])
        this.nivelAcumulacion = (parseInt(res[0]["Nivel"])*10 * 100) / 60
        console.log(this.nivelAcumulacion )
    })
  }

/********************************************************************** */
/*              Obtiene Rango Actual y Fecha de Calificación            */
/********************************************************************** */
  montoParaSiguienteMeta=0
  getnexGoal(id_cliente) {
    this.bonosService.getnexGoal(id_cliente).subscribe(
      (res) => { 
      console.log( this.montoParaSiguienteMeta = res[0]["Suma"])
    })
  }
/********************************************************************** */
/*           Cambia periódo de calculo grafica bonos pagados            */
/********************************************************************** */
  onChange(deviceValue) {
    this.leerToken();
    this.getMontosBonosPagadosDinamico(this.id_cliente, deviceValue.toString())
  }
/********************************************************************** */
/*                           Monto Bonos Pagados                        */
/********************************************************************** */
  montoBonosPagadosDinamico = 0;
  getMontosBonosPagadosDinamico(idSuscriptor, periodo) {
    this.bonosService.getMontosBonosPagadosDinamico(idSuscriptor, periodo).subscribe(
    (res) => { 
        console.log(res)
        this.montoBonosPagadosDinamico=0
        let val: any = res
        let arr_data_soc = []
        let arr_labels = []
        var meses = [this.translateservice.getTranslate('Bonus.Jan'), "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        console.log("meses", meses);
        val.forEach((element) => {
          console.log("element", element);
          if (element['Comis_Fec']) {
            var fecha = new Date(element['Comis_Fec'])
            element['Comis_Fec'] = formatDate(
              fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset()),
              "yyyy-MM-dd", 
              "en"
            );
            if(periodo == "mensual") {
              console.log ('mensual fecha', fecha);
              // arr_labels.push(fecha.getMonth() + ' ' + fecha.getDate()) // Duda
              arr_labels.push(formatDate(
                fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset()), 
                "MMM dd", 
                "en"
              )); // Duda
            }
            if (periodo == "anual")
            { 
              arr_labels.push(meses [element.Comis_Fec-1])
            }
            this.montoBonosPagadosDinamico = this.montoBonosPagadosDinamico + element.Comis_USD
            arr_data_soc.push(element.Comis_USD)
          }

        })

        this.lineChartData = [{ data:arr_data_soc , label: this.translateservice.getTranslate('Bonus.Bonus')}];
        this.lineChartLabels = arr_labels
        console.log("arr_labels", arr_labels)
        console.log(arr_data_soc)
    })
  }

/********************************************************************** */
/*                           Monto Bonos Pagados                        */
/********************************************************************** */
  montoSmartAccount = 0;
  getMontoSmartAccount(idSuscriptor) {
    this.bonosService.getMontoSmartAccount(idSuscriptor).subscribe(
    (res) => { 
      console.log(this.montoSmartAccount = res[0]["monto"])
    })
  }

/********************************************************************** */
/*                           Monto Bonos Pagados                        */
/********************************************************************** */
  montosBonosPagados = 0;
  getMontosBonosPagados(idSuscriptor) {
    this.bonosService.getMontosBonosPagados(idSuscriptor).subscribe(
      (res) => { 
      this.montosBonosPagados = res[0]["monto"]
        console.log(this.montosBonosPagados)
      })
  }
  
/********************************************************************** */
/*                           Monto Bonos x Pagar                        */
/********************************************************************** */
  montoBonosPPagar = 0;
  getMontoBonosPPagar(idSuscriptor) {
    this.bonosService.getMontoBonosPPagar(idSuscriptor).subscribe(
      (res) => { 
        //this.montosBonosPagados = res[0]["monto"]
        if (res[0]["monto"] == null)
          res[0]["monto"] = 0
        else if  (res[0]["monto"] != null)
          console.log(this.montoBonosPPagar = res[0]["monto"])
        
      })
  }


/********************************************************************** */
/*                          Gráfica Bonos Pagados                       */
/********************************************************************** */
  labels = [];
  values = []
  getGraficaBonosPagados(idSuscriptor) {
    this.bonosService.getGraficaBonosPagados(idSuscriptor).subscribe(
      (res) => { 
        this.values = res[1]
        this.doughnutChartLabels = res[0]

        this.doughnutChartData = [this.values]
        console.log("dona", this.values)
      })
  }

  public doughnutChartLabels: Label[] = this.labels; // ['dólares','Por Multiplicación','Ingreso Mensual por Acumulado','Por Acumulación','Por Asignación','Afiliados Directos'];
  public doughnutChartData: MultiDataSet = [this.values];
  public doughnutChartType: ChartType = 'doughnut';
  doughnutChartLegend = true;
  doughnutChartOptions = { 
  				responsive: true,
				legend: {
					position: 'bottom',
                labels: {
                    boxWidth: 20,
                    padding: 20
                }
				},
				title: {
					display: false
				},
				animation: {
					animateScale: true,
					animateRotate: true
				},
    maintainAspectRatio: false ,
    cutoutPercentage: 60,
  }
  doughnutChartChartColors: Array<any> = [
    {
      backgroundColor: ['#F7C944', '#ED6A8F','#B4D543','#34BDEC','#1ED6A5','#EF9134'],
      borderColor: ['#F7C944', '#ED6A8F','#B4D543','#34BDEC','#1ED6A5','#EF9134']
    }
  ];

  public doughnutChartPlugins: PluginServiceGlobalRegistrationAndOptions[] = [{
    afterDraw(chart) {
      const ctx = chart.ctx;

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.font = '4rem Arial';
      ctx.fillStyle = '#5F5F5F';
    }
  }];

  
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }



  /********************************************************************* */
 /*********************************************************/
  public canvasWidth = 320
  public needleValue = 60
  public options = {
    hasNeedle: true,
    needleColor: '#11458E',
    needleUpdateSpeed: 1000,
    arcColors: ['#0093D6', 'rgba(0, 147, 214, 0.1)'],
    arcDelimiters: [60],
    rangeLabel: ['60', '120'],
    needleStartValue: 0,
  }
  /****************************** */
  chartReady = false;
  barChartReady = false;


  public barChartOptions: ChartOptions = {
    responsive: true,
  };

  MontosParaBonos: number[] = [60000, 12000];

  public barChartLabels: Label[] = ["Monto para cálculo"];
  public barChartType: ChartType = "bar";
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartColors: Color[] = [
    { backgroundColor: "#233776" },
    { backgroundColor: "#14559d" },
    { backgroundColor: "#1a99d5" },
    { backgroundColor: "#4ab6e8" },
    { backgroundColor: "#1ab7d1" },
  ];

  public barChartData: ChartDataSets[] = [];


  ngOnInit(): void {}


  /********************************************************************** */
  /*                       Tabla Comisiones x Cobrar                      */
  /********************************************************************** */
  getComisionesPorCobrar(idSuscriber,dia,mes) {
    this.bonosService.getComisionesXCobrar(idSuscriber,dia,mes).subscribe(   //TODO CAMBIAR VALORES HARD CODE
      (res) => {
        console.log(res);
          this.arrayComisionesPorCobrar = res;
          console.log(this.arrayComisionesPorCobrar);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /********************************************************************** */
  /*                        Tabla Comisiones Cobradas                     */
/********************************************************************** */
  nextLevel=""
    getNextLevel(idSuscriber) {
    this.bonosService.getNextLevel(idSuscriber).subscribe(
      (res) => {
        console.log(this.nextLevel = res[0]["Descripcion"]);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  
  /********************************************************************** */
  /*                        Tabla Comisiones Cobradas                     */
  /********************************************************************** */
  getComisionesCobradas(idSuscriber, dia, mes) {
    this.bonosService.getComisionesCobradas(idSuscriber,dia,mes).subscribe( 
      (res) => {
        this.arrayComisionesCobradas = res;
        this.arrayComisionesCobradas.forEach(element => {
          if(element['Comis_Fec']) {
            var date = new Date(element['Comis_Fec']);
            element['Comis_Fec'] = formatDate(
              date.setMinutes(date.getMinutes() + date.getTimezoneOffset()),
              "yyyy-MM-dd", 
              "en"
            );
          }
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /********************************************************************** */
  /*                            Niveles Calificados                       */
  /********************************************************************** */
  nivelesCalificados=[];
  montoOriginal: any = 0;
  montoCalculo: any = 0;
  flag
  percent = "";
  getNivelesCalificados(idSuscriber) {
    console.log("cobradas")
    this.bonosService.getNivelesCalificados(idSuscriber).subscribe( 
      (res) => {
        var niveles: any = res;
        
        niveles.forEach(element =>
        {
          this.flag = false
          this.percent = "";
          if (element.Nivel_MontoOrig != element.Nivel_MontoCalc)
          { 
            this.flag = true
            this.percent = "60%"
          }
          let json= {
            "Nivel_Num": element.Nivel_Num,
            "Nivel_Asoc": element.Nivel_Asoc,
            "Nivel_MontoOrig": element.Nivel_MontoOrig,
            "Nivel_MontoCalc": element.Nivel_MontoCalc,
            "Nivel_Fec": element.Nivel_Fec,
            "flag": this.flag,
            "percent":this.percent
          }

          this.nivelesCalificados.push(json) 
          this.montoOriginal = this.montoOriginal + element.Nivel_MontoOrig
          this.montoCalculo = this.montoCalculo + element.Nivel_MontoCalc
        });
        console.log(this.nivelesCalificados);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  

/********************************************************************** */
/*               Obtiene Acumulado Actual y Fecha de Corte              */
/********************************************************************** */
  acumuladorangoActual: any = ""
  fecCorte: any =""
  getAcumuladoActual(idSuscriptor) {
    this.bonosService.getAcumuladoActual(idSuscriptor).subscribe(
      (res) => {
        console.log(this.acumuladorangoActual = res[0]["Monto"]);
        if (res[0]["Fecha"]) {
          var fecha = new Date(res[0]["Fecha"]);
          var fecha2 = new Date(formatDate(
            fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset()),
            "yyyy-MM-dd HH:mm:ss", 
            "en"
          ));

        }
        this.fecCorte = new Date(
          fecha2.getUTCFullYear(), 
          fecha2.getUTCMonth(), 
          fecha2.getUTCDate(),  
          fecha2.getUTCHours(), 
          fecha2.getUTCMinutes(), 
          fecha2.getUTCSeconds()
        );
      },
      (err) => {
        console.log(err);
      }
    );
  }
  
/********************************************************************** */
/*              Obtiene Rango Actual y Fecha de Calificación            */
/********************************************************************** */
  rangoActual: any = ""
  fecCalificacion: any = ""
  mostrarIMA = true;
  getRangoActual(idSuscriptor) {
    this.bonosService.getRangoActual(idSuscriptor).subscribe(
      (res) => {
        if (res[0]["Descripcion"] == "NA") {
          this.mostrarIMA = false
        } else {
          console.log(this.rangoActual = res[0]["Descripcion"]);
          if (res[0]["FecNivel"]) {
            var fecha = new Date(res[0]["FecNivel"]);
            var fecha2 = new Date(formatDate(
              fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset()),
              "yyyy-MM-dd HH:mm:ss", 
              "en"
            ));
          }
          this.fecCalificacion = new Date(
            fecha2.getUTCFullYear(), 
            fecha2.getUTCMonth(), 
            fecha2.getUTCDate(),  
            fecha2.getUTCHours(), 
            fecha2.getUTCMinutes(), 
            fecha2.getUTCSeconds()
          );
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /********************************************************************** */
  /*                                 Leer Token                           */
  /********************************************************************** */
  leerToken() {
    console.log("leyebdo token");
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
      var decoded = jwt_decode(this.userToken);
      this.id_cliente = decoded["id_cliente"];
    } else {
      console.log("No hay token");
      this.userToken = "";
    }

    return this.userToken;
  }
}
