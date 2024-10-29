import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UsuarioService } from "../services/usuario/usuario.service";
import { CuentasService } from "../services/Cuentas/cuentas.service";
import { DatePipe } from "@angular/common";
import * as jwt_decode from "jwt-decode";
import Swal from "sweetalert2";
import { ComponentFixture } from "@angular/core/testing";
import { AuthService } from "../services/login/login.service";

@Component({
  selector: "app-addaditionalplan",
  templateUrl: "./addaditionalplan.component.html",
  styleUrls: ["./addaditionalplan.component.css"],
  providers: [DatePipe],
})
export class AddaditionalplanComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private userService: UsuarioService,
    private cuentasService: CuentasService,
    public datepipe: DatePipe,
    private authService: AuthService
  ) {
    this.leerToken();
  }

  private sub: any;
  claseTitular;
  textSP;
  botonSP;

  idPlan;
  tipoPlan: string;
  nombrePlan: string;
  rendPlan;
  montoPlan; //Almacena el todal del pla mas la membresia
  costoPlan;
  colorTabla: string;
  mostrarAdicionales = false;
  amountDisabled = true;
  userToken: string;
  idGenerico: number;
  id_suscriber: number;
  id_cliente: number;
  lastIdCta;
  newId_suscriber;
  idPlanContratado = 211;

  costoMembresia;
  idMembresia;
  rendMembresia;
  ngOnInit(): void {
    this.tipoPlan = this.route.snapshot.params["plan"];
    this.getSmartPack(211);
    this.selectPlan(this.tipoPlan);
    this.idPlanContratado = 211;
  }

  adquirirSmartPack() {
    if (this.costoPlan == undefined) {
      Swal.fire({
        position: "top-end",
        icon: "info",
        title: "Seleccina un plan adicional",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    let date = new Date();
    let idNewMembership;
    let idNewPlan;
    var latest_date = this.datepipe.transform(date, "yyyy-MM-dd");
    Swal.fire({
      title: "",
      html:
        "<h2>Smart Pack</h2><br>" +
        "<div><img src='../assets/img/bars_color.png' alt='' /></div><br><br>" +
        "Estás adquiriendo una Membresía de <b>" +
        this.costoMembresia +
        " USD</b> con <br> RMC del <b>" +
        this.rendMembresia +
        "%</b> y un Plan Adicional de <b>" +
        this.costoPlan +
        " USD</b> con<br> RMC del <b>" +
        this.rendPlan +
        "%.</b><br><br>" +
        "El proceso de pago continuará en una nueva <br>ventana.<br><br>" +
        "Por seguridad, cerraremos esta sesión.<br><br>" +
        "¿Deseas continuar?",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        this.leerToken();
        //let date = new Date();

        //var latest_date = this.datepipe.transform(date, "yyyy-MM-dd");
        this.userService
          .getNextIdSuscriber(this.idGenerico)
          .subscribe((data) => {
            this.newId_suscriber = data["nextid"] + 1;
            this.userService
              .setNextIdSuscriber(this.idGenerico, this.newId_suscriber)
              .subscribe((data) => {
                this.cuentasService
                  .postNewAccount(
                    this.newId_suscriber,
                    this.idMembresia,
                    latest_date,
                    this.costoMembresia,
                    this.rendMembresia
                  )
                  .subscribe(
                    (data) => {
                      console.log(data);
                      idNewMembership = data["lastIdCuenta"];

                      this.cuentasService
                        .postNewAccount(
                          this.newId_suscriber,
                          this.idPlanContratado,
                          latest_date,
                          this.costoPlan,
                          this.rendPlan
                        )
                        .subscribe((data) => {
                          idNewPlan = data["lastIdCuenta"];
                          this.callSytemPayment(
                            this.newId_suscriber,
                            "Ismael Almaraz",  //TODO
                            "ismaelalmaraz@live.commx", //TODO
                            idNewMembership,
                            idNewPlan,
                            this.montoPlan
                          );
                          console.log(data);
                        });
                    },
                    (err) => {
                      console.log(err);
                    }
                  );
              });
          });
      }
    });
  }

  callSytemPayment(
    newIdSuscriber,
    nombre,
    email,
    idMembresia,
    idPlan,
    montototal
  ) {
    var dataToEncrypt = {
      Liverpool: newIdSuscriber,
      Londres: nombre,
      Leicester: email,
      Bradford: idMembresia,
      Bristol: idPlan,
      Belfast: montototal,
    };
    console.log(dataToEncrypt);
    this.userService.getEncrptedDataForPayment(dataToEncrypt).subscribe(
      (data) => {
        console.log(data);
        let stringData: string = "";
        for (let clave in data) {
          console.log(clave + ":" + data[clave]);
          stringData += data[clave] + "|";
        }
        console.log(btoa(stringData));
        let url =
          "https://www.smartbusinesscenter.com.mx/membre?cities=" +
          btoa(stringData);
        this.authService.logout();
        window.open(url, "_blank");
      },
      (error) => {
        console.log(error);
      }
    );
  }

  guardarPlan() {
    this.userService.getNextIdSuscriber(this.idGenerico).subscribe(
      (data) => {
        console.log(this.tipoPlan);
        if (
          this.tipoPlan == "basico" ||
          this.tipoPlan == "premium" ||
          this.tipoPlan == "basicSP" ||
          this.tipoPlan == "premiumSP"
        ) {
          this.id_suscriber = data["nextid"] + 1;
          console.log(data["nextid"]);
          this.userService
            .setNextIdSuscriber(this.idGenerico, this.id_suscriber)
            .subscribe(
              (data) => {
                console.log(data);
                let date = new Date();
                let latest_date = this.datepipe.transform(date, "yyyy-MM-dd");
                console.log(latest_date);
                this.postNewAccount(
                  this.id_suscriber,
                  this.idPlan,
                  latest_date,
                  this.montoPlan,
                  this.rendPlan
                );
              },
              (err) => {
                //this.showNotification('top','left');
                console.log(err);
              }
            );
        } else {
          let date = new Date();
          let latest_date = this.datepipe.transform(date, "yyyy-MM-dd");

          Swal.fire({
            title: "Plan adicional",
            text: "Ahora vamos a adquirir un nuevo plan, ¿quieres continuar?",
            icon: "question",
            showCancelButton: true,
            showCloseButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Continuar",
          }).then((result) => {
            if (result.value) {
              this.postNewAccount(
                this.id_cliente,
                this.idPlan,
                latest_date,
                this.montoPlan,
                this.rendPlan
              );
            }
          });
        }
      },
      (err) => {
        //this.showNotification('top','left');
        console.log(err);
      }
    );
  }

  leerToken() {
    console.log("leyendo token");
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
      var decoded = jwt_decode(this.userToken);
      this.idGenerico = decoded["idGenerico"];
      this.id_cliente = decoded["id_cliente"];
    } else {
      console.log("No hay token");
      this.userToken = "";
    }

    return this.userToken;
  }

  toggleChange(event) {
    console.log(event.source.value);
    this.getSmartPack(event.source.value);
  }

  getSmartPack(value) {
    if (this.tipoPlan == "premiumSP") {
      this.idMembresia = 16;
      this.costoMembresia = 835;
      this.rendMembresia = 2;
      this.selectPlanPlatinumSP(value);
      this.claseTitular = "tablePremium";
      this.textSP = "textPremium";
      this.botonSP = "botonPremium";
    }

    if (this.tipoPlan == "basicSP") {
      this.idMembresia = 15;
      this.costoMembresia = 635;
      this.rendMembresia = 5;
      this.selectPlanBasicSP(value);
      this.claseTitular = "tableBasic";
      this.textSP = "textBasic";
      this.botonSP = "botonBasic";
    }
  }

  selectPlanBasicSP(value) {

    this.idPlanContratado = value;
    switch (value) {
      case "211": {
        console.log(1);
        this.rendPlan = "3";
        this.montoPlan = 500 + this.costoMembresia;
        this.costoPlan = 500;
        break;
      }
      case "212": {
        console.log(1);
        this.rendPlan = "3.5";
        this.montoPlan = 1000 + this.costoMembresia;
        this.costoPlan = 1000;
        break;
      }
      case "213": {
        console.log(1);
        this.rendPlan = "4.5";
        this.montoPlan = 2000 + this.costoMembresia;
        this.costoPlan = 2000;
        break;
      }
      case "215": {
        console.log(1);
        this.rendPlan = "5.5";
        this.montoPlan = 5000 + this.costoMembresia;
        this.costoPlan = 5000;
        break;
      }
      case "216": {
        console.log(1);
        this.rendPlan = "6.5";
        this.montoPlan = 10000 + this.costoMembresia;
        this.costoPlan = 10000;
        break;
      }
    }
  }

  selectPlanPlatinumSP(value) {
    this.idPlanContratado = value;
    switch (value) {
      case "211": {
        console.log(1);
        this.rendPlan = "5";
        this.montoPlan = 500 + this.costoMembresia;
        this.costoPlan = 500;
        break;
      }
      case "212": {
        console.log(1);
        this.rendPlan = "5.5";
        this.montoPlan = 1000 + this.costoMembresia;
        this.costoPlan = 1000;
        break;
      }
      case "213": {
        console.log(1);
        this.rendPlan = "6";
        this.montoPlan = 2000 + this.costoMembresia;
        this.costoPlan = 2000;
        break;
      }
      case "215": {
        console.log(1);
        this.rendPlan = "7";
        this.montoPlan = 5000 + this.costoMembresia;
        this.costoPlan = 5000;
        break;
      }
      case "216": {
        console.log(1);
        this.rendPlan = "8";
        this.montoPlan = 10000 + this.costoMembresia;
        this.costoPlan = 10000;
        break;
      }
    }
  }

  copyToClipboard(inputElement, message) {
    console.log("copiando wallet");
    inputElement.select();
    document.execCommand("copy");
    inputElement.setSelectionRange(0, 0);
    let mymessage;
    switch (message) {
      case 2:
        mymessage = "Tu wallet se copio al portapapeles";
        break;
      case 1:
        mymessage = "El monto se copio al portapapeles";
        break;
    }

    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "success",
      title: mymessage,
    });
  }

  postNewAccount(id_susciber, id_plan, fec_contrat, monto, porcent) {
    this.cuentasService
      .postNewAccount(id_susciber, id_plan, fec_contrat, monto, porcent)
      .subscribe(
        (data) => {
          console.log(data);
          Swal.fire({
            icon: "success",
            title: "¡Felicidades!",
            text: "La transacción fue un éxito",
          });
        },
        (err) => {
          console.log(err);
        }
      );
  }

  selectPlan(plan) {
    this.amountDisabled = true;
    switch (plan) {
      /**************************P L A N E S ***************************/
      case "500usd": {
        this.idPlan = 11;
        this.nombrePlan = "PLAN 500";
        this.rendPlan = "2.5";
        this.montoPlan = "500";
        this.colorTabla = "#1ab7d1";
        this.mostrarAdicionales = false;
        break;
      }
      case "1000usd": {
        this.idPlan = 12;
        this.nombrePlan = "PLAN 1000";
        this.rendPlan = "3";
        this.montoPlan = "1000";
        this.colorTabla = "#4ab6e8";
        this.mostrarAdicionales = false;
        break;
      }
      case "2000usd": {
        this.idPlan = 13;
        this.nombrePlan = "PLAN 2000";
        this.rendPlan = "4";
        this.montoPlan = "2000";
        this.colorTabla = "#1a99d5";
        this.mostrarAdicionales = false;
        break;
      }
      case "5000usd": {
        this.idPlan = 15;
        this.nombrePlan = "PLAN 5K";
        this.rendPlan = "5";
        this.montoPlan = "5000";
        this.colorTabla = "#14559d";
        this.mostrarAdicionales = false;
        break;
      }
      case "10000usd": {
        this.idPlan = 16;
        this.nombrePlan = "PLAN 10K";
        this.rendPlan = "6";
        this.montoPlan = "10000";
        this.colorTabla = "#233776";
        this.mostrarAdicionales = false;
        break;
      }
      case "plus10000usd": {
        this.idPlan = 17;
        this.nombrePlan = "PLAN +10K";
        this.rendPlan = "6";
        this.montoPlan = "10000";
        this.colorTabla = "#b4a268";
        this.mostrarAdicionales = false;
        this.amountDisabled = false;
        break;
      }
      /**************************M E M B R E S Í A S********************/
      case "basico": {
        this.idPlan = 1;
        this.nombrePlan = "BASIC";
        this.rendPlan = "2";
        this.montoPlan = "635";
        this.colorTabla = "#1ab7d1";
        this.mostrarAdicionales = false;
        break;
      }
      case "premium": {
        this.idPlan = 3;
        this.nombrePlan = "PREMIUM";
        this.rendPlan = "5";
        this.montoPlan = "825";
        this.colorTabla = "#4ab6e8";
        this.mostrarAdicionales = false;
        break;
      }
      case "basicSP": {
        this.idPlan = 12;
        this.nombrePlan = "BASIC SMART PACK";
        this.rendPlan = "4";
        this.montoPlan = "635";
        this.colorTabla = "#1a99d5";
        this.mostrarAdicionales = true;
        this.getSmartPack("1");
        break;
      }
      case "premiumSP": {
        this.nombrePlan = "PREMIUM SMART PACK";
        this.rendPlan = "5";
        this.montoPlan = "835";
        this.colorTabla = "#14559d";
        this.mostrarAdicionales = true;
        this.getSmartPack("1");
        break;
      }
      default: {
        //statements;
        break;
      }
    }
  }
}
