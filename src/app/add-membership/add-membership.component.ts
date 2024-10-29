import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { UsuarioService } from "../services/usuario/usuario.service";
import { CuentasService } from "../services/Cuentas/cuentas.service";
import { DatePipe } from "@angular/common";
import * as jwt_decode from "jwt-decode";
import { AuthService } from "../services/login/login.service";
@Component({
  selector: "app-add-membership",
  templateUrl: "./add-membership.component.html",
  styleUrls: ["./add-membership.component.css"],
  providers: [DatePipe],
})
export class AddMembershipComponent implements OnInit {
  /************Variables********/
  userToken;
  idGenerico;
  id_cliente;
  lastIdCta;
  id_suscriber;
  /******************************/

  constructor(
    public userService: UsuarioService,
    private cuentasService: CuentasService,
    private datepipe: DatePipe,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.leerToken();
    console.log(this.id_cliente);
  }

  leerToken() {
    console.log("leyendo token");
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
      var decoded = jwt_decode(this.userToken);
      this.idGenerico = decoded["idGenerico"];
      this.id_cliente = decoded["id_cliente"];
      console.log(this.idGenerico);
    } else {
      console.log("No hay token");
      this.userToken = "";
    }

    return this.userToken;
  }

  contratar(montoPlan, idPlan, rendPlan) {
    Swal.fire({
      title: "",
      html:
        "<h2>Membresía</h2><br>" +
        "<div><img src='../assets/img/bars_color.png' alt='' /></div><br><br>" +
        "Estás adquiriendo una Membresía de <b>" +
        montoPlan +
        " USD </b> con RMC del <b>" +
        rendPlan +
        "%</b>. <br><br>" +
        "El proceso de pago continuará en una nueva ventana. <br><br>" +
        "Por seguridad, cerraremos esta sesión.<br>" +
        "¿Deseas continuar?",

      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.getNextIdSuscriber(this.idGenerico).subscribe(
          (data) => {
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
                    idPlan,
                    latest_date,
                    montoPlan,
                    rendPlan
                  );
                },
                (err) => {
                  //this.showNotification('top','left');
                  console.log(err);
                }
              );
          },
          (err) => {
            //this.showNotification('top','left');
            console.log(err);
          }
        );
      }
    });
  }

  postNewAccount(id_susciber, id_plan, fec_contrat, monto, porcent) {
    this.cuentasService
      .postNewAccount(id_susciber, id_plan, fec_contrat, monto, porcent)
      .subscribe(
        (data) => {
          var dataToEncrypt = {
            Liverpool: id_susciber,
            Londres: "ismael almaraz", //TODO
            Leicester: "ismaelalmaraz@live.com", //TODO
            Bradford: data["lastIdCuenta"],
            Belfast: monto,
          };
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

  Pack() {
    console.log("contratando pack");
    async () => {
      const { value: fruit } = await Swal.fire({
        title: "Select field validation",
        input: "select",
        inputOptions: {
          Fruits: {
            apples: "Apples",
            bananas: "Bananas",
            grapes: "Grapes",
            oranges: "Oranges",
          },
          Vegetables: {
            potato: "Potato",
            broccoli: "Broccoli",
            carrot: "Carrot",
          },
          icecream: "Ice cream",
        },
        inputPlaceholder: "Select a fruit",
        showCancelButton: true,
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (value === "oranges") {
              //resolve();
            } else {
              resolve("You need to select oranges :)");
            }
          });
        },
      });

      if (fruit) {
        Swal.fire(`You selected: ${fruit}`);
      }
      /*      const { value: fruit } = await Swal.fire({
        title: "Select field validation",
        input: "select",
        inputOptions: {
          Fruits: {
            plan1: "500 usd",
            plan2: "1K",
            plan3: "2k",
            plan4: "5k",
            plan5: "10k",
            plan6: "+10k",
          },
        },
        inputPlaceholder: "Selecciona un Fondo Adicional",
        showCancelButton: true,
        inputValidator: (value) => {
          return new Promise((resolve) => {
            switch (value) {
              case "plan1":
                resolve("Inversión: 500 usd");
                break;
              case "plan2":
                resolve("Inversión: 1000 usd");
                break;
              case "plan3":
                resolve("Inversión: 2000 usd");
                break;
              case "plan4":
                resolve("Inversión: 5000 usd");
                break;
              case "plan5":
                resolve("Inversión: 1000 usd)");
                break;
              case "plan6":
                resolve("Inversión: +1000 usd)");
                break;
            }
          });
        },
      });

      if (fruit) {
        Swal.fire(`You selected: ${fruit}`);
      } */
    };
  } 
  
  /*contratarPack(monto, plan, ganancia) {
    var dataToEncrypt = {
      Liverpool: 107372,
      Londres: "Karla Julia Finkenthal Vélez",
      Leicester: "07karfin@gmail.com",
      Bradford: 1491,
      Belfast: 825,
    };

    Swal.fire({
      title: "Nueva Membresía",
      icon: "info",
      html:
        "Estas a punto de contrar una membresía <b>" +
        plan +
        "</b> por la cantidad de <b>" +
        monto +
        " USD</b>, con una ganancia mensual de <b>" +
        ganancia +
        "%</b>.<br>¿Deseas continuar?",

      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
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
              "https://www.smartbusinesscenter.com.mx/membre/?cities=" +
              btoa(stringData);
            window.open(url, "_blank");
            Swal.fire(
              "¡Hemos enviado tu solicitud para procesar tu pago!",
              "En breve recibiras un correo confirmando tu compra. Por el momento, cerraremos tu sesión para actualizar tus datos",
              "success"
            );
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });
  }

  contratar(monto, plan, ganancia) {
    Swal.fire({
      title: "Nuevo Plan Adicional",
      icon: "info",
      html:
        "Estas a punto de contrar un plan <b>" +
        plan +
        "</b> por la cantidad de <b>" +
        monto +
        " USD</b>, con una ganancia mensual de <b>" +
        ganancia +
        "%</b>.<br>¿Deseas continuar?",

      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        let date = new Date();

        var latest_date = this.datepipe.transform(date, "yyyy-MM-dd");

        this.cuentasService
          .postNewAccount(this.id_cliente, plan, latest_date, monto, ganancia)
          .subscribe(
            (data) => {
              console.log(this.lastIdCta);
              var dataToEncrypt = {
                Liverpool: 107372,
                Londres: "ismael almaraz", //TODO
                Leicester: "ismaelalmaraz@live.com",//TODO
                Bradford: monto,
                Belfast: data["lastIdCuenta"],
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
                      "https://www.smartbusinesscenter.com.mx/membrefon/?cities=" +
                      btoa(stringData);
                    window.open(url, "_blank");
                    Swal.fire(
                      "¡Hemos enviado tu solicitud para procesar tu pago!",
                      "En breve recibiras un correo confirmando tu compra. Por el momento, cerraremos tu sesión para actualizar tus datos",
                      "success"
                    );
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
  } */
}
