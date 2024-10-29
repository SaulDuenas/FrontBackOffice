import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  ElementRef,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UsuarioService } from "../services/usuario/usuario.service";
import * as jwt_decode from "jwt-decode";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
@Component({
  selector: "app-request-psw",
  templateUrl: "./request-psw.component.html",
  styleUrls: ["./request-psw.component.css"],
})
export class RequestPswComponent implements OnInit {
  Token;
  id;
  nombreCiente;
  reqPswEmail;
  reqPsw;
  reqPswRepit;

  expiroLink = false;
  constructor(
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.validatoken(this.route.snapshot.params["token"]);
  }

  ngAfterViewInit() {
    //this.elementRef.nativeElement.ownerDocument.body.style.background =" -webkit-gradient(linear, left top, left bottom, from(#164194), to(#29bdef)) fixed";
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage =
      " url('../../assets/img/smart_fondo.png')";
  }

  cambiarContrasena() {
    if (
      this.reqPswEmail == "" ||
      this.reqPswEmail == null ||
      this.reqPswEmail == undefined
    ) {
      this.showMessage(
        "info",
        "Ingresa la cuenta de correo electrónico que usaste para registrarte en SMART"
      );
      return;
    }
    if (this.reqPswEmail != this.id) {
      this.reqPswEmail = "";
      this.showMessage(
        "info",
        "El correo que ingresaste no coincide con el que registraste en SMART"
      );
      return;
    }
    if (this.reqPsw == "" || this.reqPsw == null || this.reqPsw == undefined) {
      this.showMessage("info", "Por favor ingresa una contraseña");
    }
    if (this.reqPsw.length <= 7) {
      this.showMessage(
        "info",
        "Tu contraseña debe tener por lo menos 7 caracteres"
      );
      return;
    }
    if (this.reqPsw != this.reqPswRepit) {
      this.showMessage(
        "info",
        "Las contraseñas no coinciden, por favor verificalas"
      );
      this.reqPsw = "";
      this.reqPswRepit = "";
      return;
    }
    this.usuarioService
      .changePassword(this.reqPswEmail, this.reqPsw)
      .subscribe((res) => {
        console.log(res);
      });
  }

  showMessage(icono, texto) {
    Swal.fire({
      position: "top-end",
      icon: icono,
      title: texto,
      showConfirmButton: false,
      timer: 5000,
    }).then((response) => {
      this.router.navigate(["/login"]);
    });
  }

  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) return null;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token: string): boolean {
    const date = this.getTokenExpirationDate(token);
    console.log(date);
    if (date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  private validatoken(idToken: string) {
    this.Token = idToken;
    var decoded = jwt_decode(this.Token);
    this.id = decoded["id"];
    this.nombreCiente = decoded["nombre"];
    if (this.isTokenExpired(this.Token)) {
      console.log("Token expiró ");
      this.expiroLink = true;
    } else {
      console.log(this.id + " " + this.nombreCiente + " " + " " + decoded.exp);
      this.expiroLink = false;
    }

    /*     var current_time = new Date().getTime() / 1000;
    if (current_time > decoded.exp) {
      console.log("Token expiró " + current_time + " " + decoded.exp);
    } else {
      console.log(
        this.id + " " + this.nombre + " " + +current_time + " " + decoded.exp
      );
    } */
  }
}
