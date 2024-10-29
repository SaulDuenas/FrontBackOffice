import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  ElementRef,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../services/login/login.service";
import { UsuarioService } from "../services/usuario/usuario.service";
import { TranslateEngineService } from "../services/translate/translate-engine.service";
//import { CaptchaService} from "../../services/captcha/captcha.service";
import Swal from "sweetalert2";

import * as uuid from "uuid";
declare var $: any;

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  isTextFieldType: boolean;
  email = "";
  password = "";
  arrayPaises;
  avProvacidad;
  termCond;
  Pais;
  ReqIp;
  closeActiveSesion: boolean = false;

  codigoInvitacion;
  emailReg = "";
  passwordReg = "";
  repitpassword;
  idValidator = "";
  idSuscriber;
  hide = true;
  idSuscriberInv;
  sponsor;
  Languages;
  LangName = "";
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private elementRef: ElementRef,
    private authService: AuthService,
    private userService: UsuarioService,
    private toastr: ToastrService,
    private translateservice: TranslateEngineService
  ) {
    this.getCountries();

    this.userService.getIP_Client().subscribe(
      (data) => {
        console.log("mi IP es: " + data["ip"]);
        this.ReqIp = data["ip"];
      },
      (err) => {
        console.log(err);
      }
    );

    console.log("get country suscriber");
    this.translateservice.getCountry_Client().subscribe(
      (data) => {
         // console.log(data);
         // console.log(data["country"]);
          this.translateservice.changeLangByCountry(data["country"]);
          this.LangName=this.translateservice.getNameLang();
      },
      (err) => {
        //this.showNotification('top','left');
        console.log(err);
        this.LangName=this.translateservice.getNameLang();
      }
      
    );  

  }

  // SADB: Funcion para cambiar el idioma
  changeLang(lang: string) {
    this.translateservice.changeLang(lang);
    this.LangName = this.translateservice.getNameLang();
  }

  ngOnInit(): void {

    this.Languages =  this.translateservice.getLanguages();
    this.idSuscriberInv = this.route.snapshot.params["invitacion"];
    console.log(this.idSuscriberInv);
    this.userService.getSponsor(this.idSuscriberInv).subscribe(
      (data) => {
        this.sponsor = data[0]["NAME"] + " " + data[0]["LASTNAME"];
      },
      (error) => {
        console.log("error");
      }
    );
  }

  getCountries() {
    this.userService.getCountry().subscribe(
      (data) => {
        this.arrayPaises = data;
        console.log(data);
      },
      (err) => {
        //this.showNotification('top','left');
        console.log(err);
      }
    );
  }

  ngAfterViewInit() {
    //this.elementRef.nativeElement.ownerDocument.body.style.background =" -webkit-gradient(linear, left top, left bottom, from(#164194), to(#29bdef)) fixed";
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage =
      " url('../../assets/img/smart_fondo.png')";
  }
  showNotification(from, align, type, message) {
    $.notify(
      {
        icon: "Notification",
        message: message,
      },
      {
        type: type,
        timer: 4000,
        placement: {
          from: from,
          align: align,
        },
        template:
          '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          "</div>" +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
          "</div>",
      }
    );
  }

  /*   validarId() {
    this.userService.getIdUUID(this.codigoInvitacion).subscribe(
      (data) => {
        this.idSuscriber = data["idSocio"];
        console.log(data["idSocio"]);
      },
      (err) => {
        console.log(err);
      }
    );
  } */

  validarRegistroCompleto() {
    let ready: Boolean = true;

    console.log(this.passwordReg + " " + this.repitpassword);
    if (this.passwordReg != this.repitpassword) {
      ready = false;
      Swal.fire(
      this.translateservice.getTranslate("Register.PassNoMatch"),  //  "Las contraseñas no coinciden",  
      this.translateservice.getTranslate("Register.PleaseTryAgain"),  //  "Por favor vuelve a intentarlo",
        "warning"
      );
    }

    if (this.termCond != true) {
      ready = false;
      Swal.fire(
        this.translateservice.getTranslate("Register.AcceptTermCondition"),   //  "Para registrarte debes aceptar los Términos y Condiciones",  
        "warning"
      );
    }
    if (this.avProvacidad != true) {
      ready = false;
      Swal.fire(
        this.translateservice.getTranslate("Register.AcceptPrivacyNotice"),   //  "Para registrarte debes aceptar el aviso de privacidad",
        "warning"
      );
    }
    return ready;
  }

  registerNewProspect(forma: NgForm) {
    if (forma.invalid) {
      this.showNotification(
        "top",
        "left",
        "warning",
        this.translateservice.getTranslate('Register.ValidationMsg') //"Hay campos vacíos, por favor verifique." 
      );
      return;
    }
    this.userService.getEmail(forma.value.email).subscribe(
      (res) => {
        console.log("resp" + res.success);
        if (res.success == false) {
          Swal.fire(                                 
            this.translateservice.getStreamTranslate("Register.EmailValidationMsg", {email: forma.value.email}),  //   "El email " +  forma.value.email +  " ya fue registrado anteriormente."
            "",
            "error"
          );
          return;
        } else {
          console.log("Email disponible");
          //this.validarId();
          forma.value.idValidator = btoa(uuid.v4());

          if (this.validarRegistroCompleto() == true) {
            this.userService.createUser(forma.value).subscribe(
              (res) => {
                console.log("mail " + forma.value.email) 
                this.userService
                  .envioEmail(forma.value.email, forma.value.idValidator)
                  .subscribe((res) => {
                    Swal.fire(
                      "Tu registro fue un éxito",
                      "por favor revisa tu correo electrónico",    //   "Tu registro fue un éxito", "por favor revisa tu correo electrónico",
                      "success"
                    );
                  });
              },
              (err) => {
                Swal.fire(
                  "Usuario y/o contraseña inválido.",
                  "Por favor verificalo",
                  "error"
                );
              }
            );
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  login(forma: NgForm) {
    console.log("Trayin start session...");
    if (forma.invalid) {
      /*Object.values(forma.controls).forEach( control=>{
            control.markAllAsTouched();
          });*/
      this.showNotification(
        "top",
        "left",
        "warning",
        this.translateservice.getTranslate('Register.ValidationMsg')   //  "Hay campos vacíos, por favor verifique."
      );
      return;
    }
    this.authService.login(forma.value).subscribe(
      (data) => {
        console.log("data" + JSON.stringify(data));
        if (data["success"] == false) {
          if (data["message"] == "Email no validado") {
            this.showNotification(
              "top",
              "left",
              "danger",
              "Su correo aún no ha sido validado.</br>No olvides revisar tu bandeja de Spam."
            );
          } else if (data["message"] == "Hay una conexion activa") {
            console.log("Hay una conexion activa");
            Swal.fire(
              "Ya tienes una sesión abierta.",
              "No puedes iniciar sesión hasta que hayas cerrado todas las sesiones abiertas en otros dispositivos",
              "info"
            );
          } else if (
            data["message"] == "Authentication failed. Wrong password."
          ) {
            console.log("Error login");
            this.showNotification(
              "top",
              "left",
              "danger",
              "Usuario y/o contraseña inválido."
            );
          }
        } else {
          console.log("sesion iniciada");
          this.router.navigateByUrl("/home");
        }
      },
      (err) => {
        this.showNotification(
          "top",
          "left",
          "danger",
          "Ocurrio un error inesperado, por favor verifique su conexion a internet."
        );
        console.log(err);
      }
    );
  }
}
