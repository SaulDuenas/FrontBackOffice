import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { UsuarioService } from "../services/usuario/usuario.service";
import { DatePipe } from "@angular/common";
import { CuentasService } from "../services/Cuentas/cuentas.service";
import * as jwt_decode from "jwt-decode";
import { AuthService } from "../services/login/login.service";
import { TranslateEngineService } from "../services/translate/translate-engine.service";
@Component({
  selector: "app-selectplan",
  templateUrl: "./selectplan.component.html",
  styleUrls: ["./selectplan.component.css"],
  providers: [DatePipe],
})
export class SelectplanComponent implements OnInit {
  /************Variables********/
  userToken;
  idGenerico;
  id_cliente;
  lastIdCta;
  showBTC = false;
  showMainPanel = true;

  monto;
  plan;
  ganancia;

  /******************************/
  constructor(
    public userService: UsuarioService,
    private cuentasService: CuentasService,
    private datepipe: DatePipe,
    private authService: AuthService,
    private translateservice: TranslateEngineService
  ) {
    this.authService.estaAutenticado();
  }

  ngOnInit(): void {
    this.leerToken();
  }

  onNavigate() {
    window.location.href = "http://localhost/SMART/membre.php";
  }

  showBTCPanel(monto, ganancia, plan) {
    this.monto = monto;
    this.plan = plan;
    this.ganancia = ganancia;
    this.showBTC = true;
    this.showMainPanel = false;
    console.log( this.monto + " " + this.plan + " " + this.ganancia )
  }

  showMainPanelFunc() {
    this.contratar();
    this.showBTC = false;
    this.showMainPanel=true;
  }

  contratar() {

    var local_NewPlan = this.translateservice.getTranslate("AcquirePlan.NewPlan");
    var local_MsgPart01 = this.translateservice.getTranslate("AcquirePlan.MsgPart01");
    var local_MsgPart02 = this.translateservice.getTranslate("AcquirePlan.MsgPart02");
    var local_MsgPart03 = this.translateservice.getTranslate("AcquirePlan.MsgPart03");
    var local_MsgPart04 = this.translateservice.getTranslate("AcquirePlan.MsgPart04");
    var local_Continue = this.translateservice.getTranslate("AcquirePlan.Continue");

    var local_yes = this.translateservice.getTranslate("AcquirePlan.Yes");
    var local_no = this.translateservice.getTranslate("AcquirePlan.No");

    Swal.fire({
      title: "",
      html:
      local_NewPlan+"</h2><br>" +
        "<div><img src='../assets/img/Manita.png' alt='' /></div><br><br>" +
        local_MsgPart01+" <b>" +
        this.monto +
        " USD </b> "+local_MsgPart02 + " <b>" +
        this.ganancia +
        "%</b>. <br><br>" +
        local_MsgPart03+" <br><br>" +
        local_MsgPart04+"<br>" +
        local_Continue,
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: local_yes,
      cancelButtonText: local_no,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("entro")
        let date = new Date();

        var latest_date = this.datepipe.transform(date, "yyyy-MM-dd");

        this.cuentasService
          .postNewAccount(this.id_cliente, this.plan, latest_date, this.monto, this.ganancia)
          .subscribe(
            (data) => {
              console.log(this.lastIdCta);
              var dataToEncrypt = {
                Liverpool: this.id_cliente,
                Londres: "ismael almaraz", //TODO
                Leicester: "ismaelalmaraz@live.com.mx", //TODO
                Bradford: data["lastIdCuenta"],
                Belfast: this.monto,
              };
              console.log(dataToEncrypt);
              this.userService
                .getEncrptedDataForPayment(dataToEncrypt)
                .subscribe(
                  (data) => {
                    console.log(data);
                    let stringData: string = "";
                    for (let clave in data) {
                      console.log(clave + ":" + data[clave]);
                      stringData += data[clave] + "|";
                    }
                    console.log(btoa(stringData));
                    let url =
                      "https://www.smartbusinesscenter.com.mx/membrefon?cities=" +
                      btoa(stringData);
                    this.authService.logout();
                    window.open(url, "_blank");
                  },
                  (error) => {
                    console.log(error);
                  }
                );
            },
            (err) => {
              console.log(err);
            }
          );
      }
    });
  }

  getHTMLConfirmacionPlan() {
    return`
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Correo confirmando adquisición de plan</title>
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
<img src="https://smartbusinesscorp.com/smartbusinesscorp.com/correo/header_5.png" alt="header" width="100%" style="display: block;">
</td>
</tr>  
<tr>
<td style="font-family: Arial; font-weight: 900; font-size: 25px; line-height: 29px; color: #164194; padding: 40px 0px 10px;" align="center">
¡Hola, {{username}}!
</td>
</tr>
<tr>
<td style="font-family: Arial; font-size: 15px; line-height: 18px; padding: 22px 107px 0px 91px;">
El Plan Adicional de <b>[[monto del plan adicional]]</b>, ha sido activado con éxito, estos son los datos de activación:
</td>
</tr>
<tr>
<td style="font-family: Arial; font-size: 15px; line-height: 15px; padding: 15px 107px 2px 91px;">
<p><b>Monto:</b> [[monto del plan]]</p>
<p><b>Fecha de activación:</b> [[monto del plan]]</p>
<p><b>Hash de pago:</b> [[hash_del_recibido]]</p>
<p><b>Fecha a partir del cual se generan rendimientos:</b> [[fecha del lunes que comienza a generar rendimientos]]</p>
</td>
</tr>
<tr>
<td style="font-family: Arial; font-size: 15px; line-height: 18px; padding: 22px 107px 20px 91px;">
En tu Smart Office puedes monitorear todos los detalles y rendimientos de tu Smart Account.
</td>
</tr>
<tr>
<td style="padding: 10px 0px;" bgcolor="#ffffff">
<table border="0" cellpadding="0" cellspacing="0" align="center" width="240">
<tr>
<td style="border-radius: 5px; padding: 7px 18px;" align="center" width="240" bgcolor="#0093d6">
<a href="https://sbcmexico.club/#/cuenta" target="_blank" style="font-family: Arial; font-weight: 700; font-size: 17px; text-align: center; text-decoration: none; color: #ffffff; display: inline-block;">
Acceder a Smart Office
</a>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td align="center" style="font-family: Arial; font-weight: 400; font-size: 13px; color: #164194; padding: 20px">
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
</td><tr>
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
</html>`
  }

  leerToken() {
    console.log("leyebdo token");
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

  postNewAccount(id_susciber, id_plan, fec_contrat, monto, porcent) {
    var las_Id_Cta;
    this.cuentasService
      .postNewAccount(id_susciber, id_plan, fec_contrat, monto, porcent)
      .subscribe(
        (data) => {
          las_Id_Cta = data["lastIdCuenta"];
          console.log(data["lastIdCuenta"]);
          this.lastIdCta = las_Id_Cta;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  contratarMas10000(ganancia, plan ) {
    let unLog = this.authService;
    var idCliente = this.id_cliente;
    let localcuentasService = this.cuentasService;
    let localUserService = this.userService;
    let monto;
    var date = this.datepipe.transform(date, "yyyy-MM-dd");
  
    var title_newPlan= this.translateservice.getTranslate("AcquirePlan.NewPlan");
    var local_AmmountInvest = this.translateservice.getTranslate("AcquirePlan.AmmountInvest");
    var local_ammountMin = this.translateservice.getTranslate("AcquirePlan.AmmountMin");
    var local_Ammounth =    this.translateservice.getTranslate("AcquirePlan.Ammounth");
    var local_msgPart01 =  this.translateservice.getTranslate("AcquirePlan.MsgPart01");
    var local_msgPart02 =  this.translateservice.getTranslate("AcquirePlan.MsgPart02");
    var local_msgPart03 =  this.translateservice.getTranslate("AcquirePlan.MsgPart03");
    var local_msgPart04 =  this.translateservice.getTranslate("AcquirePlan.MsgPart04");
    var local_continue = this.translateservice.getTranslate("AcquirePlan.Continue");

    var local_cancel = this.translateservice.getTranslate("AcquirePlan.AmmountCancel");
    var local_yes = this.translateservice.getTranslate("AcquirePlan.Yes");
    var local_no = this.translateservice.getTranslate("AcquirePlan.No");

    Swal.fire({
      title: local_AmmountInvest, // "Ingresa la cantidad a invertir con tu nuevo plan"
      input: "number",
      inputPlaceholder: local_Ammounth , // "Monto"
      showCloseButton: true,
      showCancelButton: true,
      cancelButtonText: local_cancel, // "Cancelar",
    }).then(function (result) {
      if (result) {
        if (result.value <= 10000 || result.value == undefined) {
          Swal.fire({
            icon: "error",
            text: local_ammountMin, // "El valor no puede ser menor a 10,000 USD",
          });
        } else {
          monto = result.value;
          Swal.fire({
            title: "",
            html:
              "<h2>"+ title_newPlan +"</h2><br>" + //  "Nuevo Plan Adicional"
              "<div><img src='../assets/img/Manita.png' alt='' /></div><br><br>" +
              local_msgPart01 + "<b>" +
              result.value +
              " USD </b>" + local_msgPart02 +"<b> 6%</b>. <br><br>" +
              local_msgPart03 +" <br><br>" +
              local_msgPart04 + "<br>" +
              local_continue,

            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: local_yes,
            cancelButtonText: local_no,
          }).then((result) => {
            if (result.isConfirmed) {
              let date = new Date();

              var latest_date = date;
              localcuentasService
                .postNewAccount(idCliente, plan, latest_date, monto, ganancia)
                .subscribe(
                  (data) => {
                    var dataToEncrypt = {
                      Liverpool: idCliente,
                      Londres: "Karla Julia Finkenthal Vélez",
                      Leicester: "07karfin@gdfgdfgdfgdfgdf.com",
                      Bradford: data["lastIdCuenta"],
                      Belfast: monto,
                    };
                    localUserService
                      .getEncrptedDataForPayment(dataToEncrypt)
                      .subscribe(
                        (data) => {
                          console.log(data);
                          let stringData: string = "";
                          for (let clave in data) {
                            console.log(clave + ":" + data[clave]);
                            stringData += data[clave] + "|";
                          }
                          console.log(btoa(stringData));
                          let url =
                            "https://www.smartbusinesscenter.com.mx/membrefon?cities=" +
                            btoa(stringData);
                          unLog.logout();
                          window.open(url, "_blank");
                        },
                        (error) => {
                          console.log(error);
                        }
                      );
                  },
                  (error) => console.log
                );
            }
          });
        }
      } else if (result.value === 0) {
        Swal.fire({ icon: "error", text: "You don't have a bike :(" });
      } else {
        console.log(`modal was dismissed by ${result.dismiss}`);
      }
    });
  }
}
