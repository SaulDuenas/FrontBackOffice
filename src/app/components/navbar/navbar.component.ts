import { Component, OnInit, ElementRef } from "@angular/core";
import { ROUTES } from "../sidebar/sidebar.component";
import { environment } from "../../../environments/environment";
import { TranslateEngineService } from "../../services/translate/translate-engine.service";

import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { Router } from "@angular/router";
import * as jwt_decode from "jwt-decode";
import Swal from "sweetalert2";
import { UsuarioService } from "../../services/usuario/usuario.service";
import {  CuentasService } from "../../services/Cuentas/cuentas.service";
import * as uuid from "uuid";
@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  baseUri: string = environment.baseURL;
  private listTitles: any[];
  location: Location;
  mobile_menu_visible: any = 0;
  private toggleButton: any;
  private sidebarVisible: boolean;
  userToken;
  Nombre: string;
  apellido;
  idCliente;
  email;
  avatar;
  image;
  emailEjecutivo;
  telefonoEjecutivo;
  inviteTo;
  noInvitacion;
  Languages;
  LangName = "";

  constructor(
    private userService: UsuarioService,
    location: Location,
    private element: ElementRef,
    private router: Router,
    private translateservice: TranslateEngineService,
    private cuentasService: CuentasService
  ) {
    this.location = location;
    this.sidebarVisible = false;
    this.LangName = this.translateservice.getNameLang();
    this.changeSideBarMenu();
        this.leerToken();
    this.getNivelSocio(this.idCliente)
  }

  // SADB: function to change language
  changeLang(lang: string) {
   
    this.translateservice.changeLang(lang);
    this.LangName = this.translateservice.getNameLang();
  
    this.changeSideBarMenu();
  }

  changeSideBarMenu() {
   
    for (let point of ROUTES) {
      
      this.translateservice.translateCore.get(point.tag).subscribe((res: string) => {
      point.title = res;   
      });
    }
  }
   
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

  /********************************************************************** */
  /*                                Cerrar Sesión                         */
  /********************************************************************** */
  logout() {
    localStorage.removeItem("token");
    this.router.navigate(["login"]);
  }

  ngOnInit() {
 
    this.Languages =  this.translateservice.getLanguages();
  //  console.log(this.Languages);
    
    this.leerToken();
    this.getNivelSocio(this.idCliente)
    this.listTitles = ROUTES.filter((listTitle) => listTitle);
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggler")[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
      var $layer: any = document.getElementsByClassName("close-layer")[0];
      if ($layer) {
        $layer.remove();
        this.mobile_menu_visible = 0;
      }
    });

  }


  zfill(number, width) {
    var numberOutput = Math.abs(number); /* Valor absoluto del número */
    var length = number.toString().length; /* Largo del número */
    var zero = "0"; /* String de cero */

    if (width <= length) {
      if (number < 0) {
        return "-" + numberOutput.toString();
      } else {
        return numberOutput.toString();
      }
    } else {
      if (number < 0) {
        return "-" + zero.repeat(width - length) + numberOutput.toString();
      } else {
        return zero.repeat(width - length) + numberOutput.toString();
      }
    }
  }

  esEmailValido(email: string): boolean {
    let mailValido = false;
    ("use strict");

    var EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (email.match(EMAIL_REGEX)) {
      mailValido = true;
    }
    return mailValido;
  }

  generaLink() {

    var local_Msg02 = this.translateservice.getTranslate('NavButton.Msg02');
    var local_Copy = this.translateservice.getTranslate('NavButton.Copy');
    var local_MsgCopyLink = this.translateservice.getTranslate('NavButton.MsgCopyLink');

    let link = "https://www.sbcmexico.club//#/registro/" + this.idCliente;
    (async () => {
      const { value: formValues } = await Swal.fire({
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc',
          cancelButton: 'btn btn-round mr-3 txt-btn-sbc'
        },
        title: local_Msg02,
        showCloseButton: true,
        html:
          '<input type="text" id="nombreInvitado" value ="' +
          link +
          '" class="input-modal-sbc" >',
        focusConfirm: false,
        confirmButtonText: local_Copy,
        showCancelButton: false,
        reverseButtons: true,
        preConfirm: () => {
          return [<HTMLInputElement>document.getElementById("nombreInvitado")];
        },
      });

      if (formValues) {
        console.log("copiando wallet");
        formValues[0].select();
        document.execCommand("copy");
        formValues[0].setSelectionRange(0, 0);

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
          title: local_MsgCopyLink,
        });
      }
    })();
  }

  invitarAmigo() {

    var local_Msg01 = this.translateservice.getTranslate('NavButton.Msg01');
    var local_PlaceHolderGuest = this.translateservice.getTranslate('NavButton.PlaceHolderGuest');
    var local_PlaceHolderEmail = this.translateservice.getTranslate('NavButton.PlaceHolderEmail' );
    var local_Cancel = this.translateservice.getTranslate('NavButton.Cancel');
    var local_SendInvitation = this.translateservice.getTranslate('NavButton.SendInvitation'); 

    var local_MsgNameRequired = this.translateservice.getTranslate('NavButton.MsgNameRequired' );
    var local_MsgEmailRequired = this.translateservice.getTranslate('NavButton.MsgEmailRequired');
    var local_MsgEmailValid = this.translateservice.getTranslate('NavButton.MsgEmailValid'); 

    (async () => {
      const { value: formValues } = await Swal.fire({
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc'
        },
        title: 'Haz una invitación',
        imageUrl: './../assets/img/misc-icons/verified-user-success.svg',
        imageWidth: 200,
        imageHeight: 200,
        showCloseButton: true,
        confirmButtonText: local_SendInvitation,
        html:
          '<span class="h4">' + local_Msg01 + '</span>'+
          '<input id="nombreInvitado" class="input-modal-sbc" Placeholder="'+ local_PlaceHolderGuest + '" type="text">' +
          '<input id="emailInvitado" class="input-modal-sbc" Placeholder="' + local_PlaceHolderEmail +'" type="email" name="email">',
        focusConfirm: false,
        preConfirm: () => {
          return [
            (<HTMLInputElement>document.getElementById("nombreInvitado")).value,
            (<HTMLInputElement>document.getElementById("emailInvitado")).value,
          ];
        },
      });

      if (formValues) {
        if (formValues[0] === "") {
          Swal.fire({
            buttonsStyling: false,
            customClass: {
            confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc'
            },
            title: local_MsgNameRequired,
            icon: 'error',
          });
          return;
        }
        if (formValues[1] === "") {
          Swal.fire( {
            buttonsStyling: false,
            customClass: {
            confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc'
            },
            title: local_MsgEmailRequired,
            icon: 'error',
          });
          return;
        }
        if (this.esEmailValido(formValues[1]) === false) {
          Swal.fire({
            buttonsStyling: false,
            customClass: {
            confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc'
            },
            title: local_MsgEmailValid,
            icon: 'error',
          });
          return;
        }

        this.inviteTo = formValues[0];
        this.userService
          .envioEmailGeneral(
            "mail@smartbusinesscorp.info",
            formValues[1],
            {},
            this.getHTML(),
            "Te invito a formar parte de Smart"
          )
          .subscribe(
            (data) => {
              this.userService
                .setGuest(this.idCliente, formValues[0], formValues[1])
                .subscribe((data) => {
                  console.log(data);
                });
              Swal.fire( {
                buttonsStyling: false,
                customClass: {
                confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc'
                },
                  title: this.translateservice.getStreamTranslate('NavButton.MsgSendConfirm', {name: formValues[0]}),
                  text: formValues[1],
                  icon: 'success'
                }
              );
              let datos = {
                idSocio: this.idCliente,
                noInvitacion: this.noInvitacion,
                email: formValues[1],
              };
            },
            (err) => {
              Swal.fire({
                buttonsStyling: false,
                customClass: {
                confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc'
                },
                title: this.translateservice.getTranslate('NavButton.MsgSendFail'),
                icon: 'warning'
                }
              );
            }
          );
      }
    })();
  }

  getAvatar(type) {
    this.userService.getAvatar(this.avatar, type).subscribe(
      (data) => {
        this.createImageFromBlob(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        this.image = reader.result;
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  leerToken() {
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
      var decoded = jwt_decode(this.userToken);
      this.Nombre = decoded["FirstName"];
      this.apellido = decoded["LastName"];
      this.avatar = decoded["avatar"];
      this.emailEjecutivo = decoded["Email"];
      this.telefonoEjecutivo = decoded["Telephone"];

      console.log(this.avatar);
      if (decoded["id_cliente"] === null) {
        this.idCliente = "000000";
      } else {
        this.idCliente = this.zfill(decoded["id_cliente"], 6);
      }
      this.getAvatar("avatar");
    } else {
      this.userToken = "";
    }
    return this.userToken;
  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName("body")[0];
    setTimeout(function () {
      toggleButton.classList.add("toggled");
    }, 500);

    body.classList.add("nav-open");

    this.sidebarVisible = true;
  }
  sidebarClose() {
    const body = document.getElementsByTagName("body")[0];
    this.toggleButton.classList.remove("toggled");
    this.sidebarVisible = false;
    body.classList.remove("nav-open");
  }
  sidebarToggle() {
    // const toggleButton = this.toggleButton;
    // const body = document.getElementsByTagName('body')[0];
    var $toggle = document.getElementsByClassName("navbar-toggler")[0];

    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
    const body = document.getElementsByTagName("body")[0];

    if (this.mobile_menu_visible == 1) {
      // $('html').removeClass('nav-open');
      body.classList.remove("nav-open");
      if ($layer) {
        $layer.remove();
      }
      setTimeout(function () {
        $toggle.classList.remove("toggled");
      }, 400);

      this.mobile_menu_visible = 0;
    } else {
      setTimeout(function () {
        $toggle.classList.add("toggled");
      }, 430);

      var $layer = document.createElement("div");
      $layer.setAttribute("class", "close-layer");

      setTimeout(function () {
        $layer.classList.add("visible");
      }, 100);

      $layer.onclick = function () {
        //asign a function
        body.classList.remove("nav-open");
        this.mobile_menu_visible = 0;
        $layer.classList.remove("visible");
        setTimeout(function () {
          $layer.remove();
          $toggle.classList.remove("toggled");
        }, 400);
      }.bind(this);

      body.classList.add("nav-open");
      this.mobile_menu_visible = 1;
    }
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return "Dashboard";
  }

  /*    this.inviteTo = result.value;
this.noInvitacion = uuid.v4(); */
  getHTML() {
    let strHtml = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<style>@font-face {
font-family: 'Roboto'; font-style: normal; font-weight: 400; src: url(https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.ttf) format('truetype');}
</style>        <style type="text/css">
.ExternalClass{width:100%}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{line-height:150%}a{text-decoration:none}body,td,input,textarea,select{margin:unset;font-family:unset}input,textarea,select{font-size:unset}@media screen and (max-width: 600px){table.row th.col-lg-1,table.row th.col-lg-2,table.row th.col-lg-3,table.row th.col-lg-4,table.row th.col-lg-5,table.row th.col-lg-6,table.row th.col-lg-7,table.row th.col-lg-8,table.row th.col-lg-9,table.row th.col-lg-10,table.row th.col-lg-11,table.row th.col-lg-12{display:block;width:100% !important}.d-mobile{display:block !important}.d-desktop{display:none !important}.w-lg-25{width:auto !important}.w-lg-25>tbody>tr>td{width:auto !important}.w-lg-50{width:auto !important}.w-lg-50>tbody>tr>td{width:auto !important}.w-lg-75{width:auto !important}.w-lg-75>tbody>tr>td{width:auto !important}.w-lg-100{width:auto !important}.w-lg-100>tbody>tr>td{width:auto !important}.w-lg-auto{width:auto !important}.w-lg-auto>tbody>tr>td{width:auto !important}.w-25{width:25% !important}.w-25>tbody>tr>td{width:25% !important}.w-50{width:50% !important}.w-50>tbody>tr>td{width:50% !important}.w-75{width:75% !important}.w-75>tbody>tr>td{width:75% !important}.w-100{width:100% !important}.w-100>tbody>tr>td{width:100% !important}.w-auto{width:auto !important}.w-auto>tbody>tr>td{width:auto !important}.p-lg-0>tbody>tr>td{padding:0 !important}.pt-lg-0>tbody>tr>td,.py-lg-0>tbody>tr>td{padding-top:0 !important}.pr-lg-0>tbody>tr>td,.px-lg-0>tbody>tr>td{padding-right:0 !important}.pb-lg-0>tbody>tr>td,.py-lg-0>tbody>tr>td{padding-bottom:0 !important}.pl-lg-0>tbody>tr>td,.px-lg-0>tbody>tr>td{padding-left:0 !important}.p-lg-1>tbody>tr>td{padding:0 !important}.pt-lg-1>tbody>tr>td,.py-lg-1>tbody>tr>td{padding-top:0 !important}.pr-lg-1>tbody>tr>td,.px-lg-1>tbody>tr>td{padding-right:0 !important}.pb-lg-1>tbody>tr>td,.py-lg-1>tbody>tr>td{padding-bottom:0 !important}.pl-lg-1>tbody>tr>td,.px-lg-1>tbody>tr>td{padding-left:0 !important}.p-lg-2>tbody>tr>td{padding:0 !important}.pt-lg-2>tbody>tr>td,.py-lg-2>tbody>tr>td{padding-top:0 !important}.pr-lg-2>tbody>tr>td,.px-lg-2>tbody>tr>td{padding-right:0 !important}.pb-lg-2>tbody>tr>td,.py-lg-2>tbody>tr>td{padding-bottom:0 !important}.pl-lg-2>tbody>tr>td,.px-lg-2>tbody>tr>td{padding-left:0 !important}.p-lg-3>tbody>tr>td{padding:0 !important}.pt-lg-3>tbody>tr>td,.py-lg-3>tbody>tr>td{padding-top:0 !important}.pr-lg-3>tbody>tr>td,.px-lg-3>tbody>tr>td{padding-right:0 !important}.pb-lg-3>tbody>tr>td,.py-lg-3>tbody>tr>td{padding-bottom:0 !important}.pl-lg-3>tbody>tr>td,.px-lg-3>tbody>tr>td{padding-left:0 !important}.p-lg-4>tbody>tr>td{padding:0 !important}.pt-lg-4>tbody>tr>td,.py-lg-4>tbody>tr>td{padding-top:0 !important}.pr-lg-4>tbody>tr>td,.px-lg-4>tbody>tr>td{padding-right:0 !important}.pb-lg-4>tbody>tr>td,.py-lg-4>tbody>tr>td{padding-bottom:0 !important}.pl-lg-4>tbody>tr>td,.px-lg-4>tbody>tr>td{padding-left:0 !important}.p-lg-5>tbody>tr>td{padding:0 !important}.pt-lg-5>tbody>tr>td,.py-lg-5>tbody>tr>td{padding-top:0 !important}.pr-lg-5>tbody>tr>td,.px-lg-5>tbody>tr>td{padding-right:0 !important}.pb-lg-5>tbody>tr>td,.py-lg-5>tbody>tr>td{padding-bottom:0 !important}.pl-lg-5>tbody>tr>td,.px-lg-5>tbody>tr>td{padding-left:0 !important}.p-0>tbody>tr>td{padding:0 !important}.pt-0>tbody>tr>td,.py-0>tbody>tr>td{padding-top:0 !important}.pr-0>tbody>tr>td,.px-0>tbody>tr>td{padding-right:0 !important}.pb-0>tbody>tr>td,.py-0>tbody>tr>td{padding-bottom:0 !important}.pl-0>tbody>tr>td,.px-0>tbody>tr>td{padding-left:0 !important}.p-1>tbody>tr>td{padding:4px !important}.pt-1>tbody>tr>td,.py-1>tbody>tr>td{padding-top:4px !important}.pr-1>tbody>tr>td,.px-1>tbody>tr>td{padding-right:4px !important}.pb-1>tbody>tr>td,.py-1>tbody>tr>td{padding-bottom:4px !important}.pl-1>tbody>tr>td,.px-1>tbody>tr>td{padding-left:4px !important}.p-2>tbody>tr>td{padding:8px !important}.pt-2>tbody>tr>td,.py-2>tbody>tr>td{padding-top:8px !important}.pr-2>tbody>tr>td,.px-2>tbody>tr>td{padding-right:8px !important}.pb-2>tbody>tr>td,.py-2>tbody>tr>td{padding-bottom:8px !important}.pl-2>tbody>tr>td,.px-2>tbody>tr>td{padding-left:8px !important}.p-3>tbody>tr>td{padding:16px !important}.pt-3>tbody>tr>td,.py-3>tbody>tr>td{padding-top:16px !important}.pr-3>tbody>tr>td,.px-3>tbody>tr>td{padding-right:16px !important}.pb-3>tbody>tr>td,.py-3>tbody>tr>td{padding-bottom:16px !important}.pl-3>tbody>tr>td,.px-3>tbody>tr>td{padding-left:16px !important}.p-4>tbody>tr>td{padding:24px !important}.pt-4>tbody>tr>td,.py-4>tbody>tr>td{padding-top:24px !important}.pr-4>tbody>tr>td,.px-4>tbody>tr>td{padding-right:24px !important}.pb-4>tbody>tr>td,.py-4>tbody>tr>td{padding-bottom:24px !important}.pl-4>tbody>tr>td,.px-4>tbody>tr>td{padding-left:24px !important}.p-5>tbody>tr>td{padding:48px !important}.pt-5>tbody>tr>td,.py-5>tbody>tr>td{padding-top:48px !important}.pr-5>tbody>tr>td,.px-5>tbody>tr>td{padding-right:48px !important}.pb-5>tbody>tr>td,.py-5>tbody>tr>td{padding-bottom:48px !important}.pl-5>tbody>tr>td,.px-5>tbody>tr>td{padding-left:48px !important}.s-lg-1>tbody>tr>td,.s-lg-2>tbody>tr>td,.s-lg-3>tbody>tr>td,.s-lg-4>tbody>tr>td,.s-lg-5>tbody>tr>td{font-size:0 !important;line-height:0 !important;height:0 !important}.s-0>tbody>tr>td{font-size:0 !important;line-height:0 !important;height:0 !important}.s-1>tbody>tr>td{font-size:4px !important;line-height:4px !important;height:4px !important}.s-2>tbody>tr>td{font-size:8px !important;line-height:8px !important;height:8px !important}.s-3>tbody>tr>td{font-size:16px !important;line-height:16px !important;height:16px !important}.s-4>tbody>tr>td{font-size:24px !important;line-height:24px !important;height:24px !important}.s-5>tbody>tr>td{font-size:48px !important;line-height:48px !important;height:48px !important}}@media yahoo{.d-mobile{display:none !important}.d-desktop{display:block !important}.w-lg-25{width:25% !important}.w-lg-25>tbody>tr>td{width:25% !important}.w-lg-50{width:50% !important}.w-lg-50>tbody>tr>td{width:50% !important}.w-lg-75{width:75% !important}.w-lg-75>tbody>tr>td{width:75% !important}.w-lg-100{width:100% !important}.w-lg-100>tbody>tr>td{width:100% !important}.w-lg-auto{width:auto !important}.w-lg-auto>tbody>tr>td{width:auto !important}.p-lg-0>tbody>tr>td{padding:0 !important}.pt-lg-0>tbody>tr>td,.py-lg-0>tbody>tr>td{padding-top:0 !important}.pr-lg-0>tbody>tr>td,.px-lg-0>tbody>tr>td{padding-right:0 !important}.pb-lg-0>tbody>tr>td,.py-lg-0>tbody>tr>td{padding-bottom:0 !important}.pl-lg-0>tbody>tr>td,.px-lg-0>tbody>tr>td{padding-left:0 !important}.p-lg-1>tbody>tr>td{padding:4px !important}.pt-lg-1>tbody>tr>td,.py-lg-1>tbody>tr>td{padding-top:4px !important}.pr-lg-1>tbody>tr>td,.px-lg-1>tbody>tr>td{padding-right:4px !important}.pb-lg-1>tbody>tr>td,.py-lg-1>tbody>tr>td{padding-bottom:4px !important}.pl-lg-1>tbody>tr>td,.px-lg-1>tbody>tr>td{padding-left:4px !important}.p-lg-2>tbody>tr>td{padding:8px !important}.pt-lg-2>tbody>tr>td,.py-lg-2>tbody>tr>td{padding-top:8px !important}.pr-lg-2>tbody>tr>td,.px-lg-2>tbody>tr>td{padding-right:8px !important}.pb-lg-2>tbody>tr>td,.py-lg-2>tbody>tr>td{padding-bottom:8px !important}.pl-lg-2>tbody>tr>td,.px-lg-2>tbody>tr>td{padding-left:8px !important}.p-lg-3>tbody>tr>td{padding:16px !important}.pt-lg-3>tbody>tr>td,.py-lg-3>tbody>tr>td{padding-top:16px !important}.pr-lg-3>tbody>tr>td,.px-lg-3>tbody>tr>td{padding-right:16px !important}.pb-lg-3>tbody>tr>td,.py-lg-3>tbody>tr>td{padding-bottom:16px !important}.pl-lg-3>tbody>tr>td,.px-lg-3>tbody>tr>td{padding-left:16px !important}.p-lg-4>tbody>tr>td{padding:24px !important}.pt-lg-4>tbody>tr>td,.py-lg-4>tbody>tr>td{padding-top:24px !important}.pr-lg-4>tbody>tr>td,.px-lg-4>tbody>tr>td{padding-right:24px !important}.pb-lg-4>tbody>tr>td,.py-lg-4>tbody>tr>td{padding-bottom:24px !important}.pl-lg-4>tbody>tr>td,.px-lg-4>tbody>tr>td{padding-left:24px !important}.p-lg-5>tbody>tr>td{padding:48px !important}.pt-lg-5>tbody>tr>td,.py-lg-5>tbody>tr>td{padding-top:48px !important}.pr-lg-5>tbody>tr>td,.px-lg-5>tbody>tr>td{padding-right:48px !important}.pb-lg-5>tbody>tr>td,.py-lg-5>tbody>tr>td{padding-bottom:48px !important}.pl-lg-5>tbody>tr>td,.px-lg-5>tbody>tr>td{padding-left:48px !important}.s-lg-0>tbody>tr>td{font-size:0 !important;line-height:0 !important;height:0 !important}.s-lg-1>tbody>tr>td{font-size:4px !important;line-height:4px !important;height:4px !important}.s-lg-2>tbody>tr>td{font-size:8px !important;line-height:8px !important;height:8px !important}.s-lg-3>tbody>tr>td{font-size:16px !important;line-height:16px !important;height:16px !important}.s-lg-4>tbody>tr>td{font-size:24px !important;line-height:24px !important;height:24px !important}.s-lg-5>tbody>tr>td{font-size:48px !important;line-height:48px !important;height:48px !important}}
</style>
</head>
<body style="outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border: 0;" bgcolor="#ffffff">
<table valign="top" class="text-center body" style="outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; text-align: center !important; margin: 0; padding: 0; border: 0;" bgcolor="#ffffff">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 15px; line-height: 20px; color: #000000; text-align: center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td valign="top" style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0;" align="left">
<table class="container  m-0 p-0" border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; width: 100%;">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 15px; line-height: 20px; color: #000000; text-align: center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td align="center" style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0; padding: 0;">
<!--[if (gte mso 9)|(IE)]>
<table align="center">
<tbody>
<tr>
<td width="600">
<![endif]-->
<table align="center" border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; width: 100%; max-width: 600px; margin: 0 auto;">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 15px; line-height: 20px; color: #000000; text-align: center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0;" align="left">  
<img class="img-fluid" style="display: block; height: auto; line-height: 100%; outline: none; text-decoration: none; width: 100%; max-width: 100%; border: 0 none;" src="https://raw.githubusercontent.com/SaulDuenas/Emails_Smart/main/img/header_azul.png">
<table class="container-fluid pt-4" border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; width: 100%;">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 15px; line-height: 20px; color: #000000; text-align: center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 24px 16px 0;" align="left">
<table style="width: 100%; font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; font-style: normal; font-weight: normal; font-size: 17px; line-height: 20px; color: #000000; height: auto; margin-left: auto; margin-right: auto;" class="clear-table" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 15px; line-height: 20px; color: #000000; text-align: center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0; padding: 15px 15px 25px;" align="left">  
<h3 style="margin-top: 0; margin-bottom: 0; font-weight: bold; vertical-align: baseline; font-size: 20px; line-height: 23px; font-family: 'Roboto','Arial'; font-style: normal; color: #000000; text-shadow: 0px 0px 50px #FFFFFF;" align="left">¡Hola, ${this.inviteTo}!</h3>
</td>
</tr>
<tr>
<td style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0; padding: 15px;" align="justify"> 
¿Ya encontraste la mejor opción para multiplicar tu capital? En Smart Business Corp no sólo puedes ahorrar e 
invertir sino también desarrollarte en el mundo del emprendimiento a través de nuestro  <span class="highlighted-text" style="color: #0093D6; font-weight: bold;">Ecosistema Emprendedor.</span>
</td>
</tr>       
<tr>
<td style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0; padding: 15px;" align="justify"> 
Estos son algunos de los beneficios del Ecosistema:
</td>
</tr>
<tr>
<td class="text-center" style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0;" align="center"> 
<table class="row space-bottom" border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; margin-right: -15px; margin-left: -15px; table-layout: fixed; width: 100%; margin-bottom: 25px;">
<thead>
<tr>
<th class="col-lg-4" align="left" valign="top" style="line-height: 24px; font-size: 16px; min-height: 1px; padding-right: 15px; padding-left: 15px; font-weight: normal; width: 33.333333%; margin: 0;">
<div class="text-center" style="" align="center">
<img style="height: auto; line-height: 100%; outline: none; text-decoration: none; margin: 0px; padding: 0px; border: 0 none;" src="https://raw.githubusercontent.com/SaulDuenas/Emails_Smart/main/img/SB_Live.png" alt="Icon person">
</div>      
</th>
<th class="col-lg-8 my-aling-elem" align="left" valign="top" style="line-height: 24px; font-size: 16px; min-height: 1px; padding-right: 15px; padding-left: 15px; font-weight: normal; width: 66.666667%; margin: 0;">
<span class="text-benefits" style="font-weight: bold; font-size: 15px; line-height: 18px; color: #164194; text-shadow: 0px 0px 50px #FFFFFF;"> Canal de contenido enfocado en la Educación Financiera. </span>
</th>            
</tr>
</thead>
</table>
<table class="row space-bottom" border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; margin-right: -15px; margin-left: -15px; table-layout: fixed; width: 100%; margin-bottom: 25px;">
<thead>
<tr><th class="col-lg-4" align="left" valign="top" style="line-height: 24px; font-size: 16px; min-height: 1px; padding-right: 15px; padding-left: 15px; font-weight: normal; width: 33.333333%; margin: 0;">
<div class="text-center" style="" align="center">
<img aling="center" style="height: auto; line-height: 100%; outline: none; text-decoration: none; margin: 0px; padding: 0px; border: 0 none;" src="https://raw.githubusercontent.com/SaulDuenas/Emails_Smart/main/img/SB_Innovator.png" alt="Icon person">
</div>                
</th>
<th class="col-lg-8 my-aling-elem" align="left" valign="top" style="line-height: 24px; font-size: 16px; min-height: 1px; padding-right: 15px; padding-left: 15px; font-weight: normal; width: 66.666667%; margin: 0;">
<span class="text-benefits" style="font-weight: bold; font-size: 15px; line-height: 18px; color: #164194; text-shadow: 0px 0px 50px #FFFFFF;"> Incubadora de negocios, en la cual podrás invertir en proyectos productivos. </span>
</th>          
</tr>
</thead>
</table>            
<table class="row space-bottom" border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; margin-right: -15px; margin-left: -15px; table-layout: fixed; width: 100%; margin-bottom: 25px;">
<thead>
<tr>
<th class="col-lg-4 text-center" align="left" valign="top" style="line-height: 24px; font-size: 16px; min-height: 1px; padding-right: 15px; padding-left: 15px; font-weight: normal; width: 33.333333%; margin: 0;">
<div class="text-center" style="" align="center">
<img style="height: auto; line-height: 100%; outline: none; text-decoration: none; margin: 0px; padding: 0px; border: 0 none;" src="https://raw.githubusercontent.com/SaulDuenas/Emails_Smart/main/img/SB_Academy.png" alt="Icon person">
</div>
</th>
<th class="col-lg-8 my-aling-elem" align="left" valign="top" style="line-height: 24px; font-size: 16px; min-height: 1px; padding-right: 15px; padding-left: 15px; font-weight: normal; width: 66.666667%; margin: 0;">
<span class="text-benefits" style="font-weight: bold; font-size: 15px; line-height: 18px; color: #164194; text-shadow: 0px 0px 50px #FFFFFF;"> Tiene para ti contenido para tu desarrollo empresarial y prepararte para el éxito. </span>                 
</th>
</tr>
</thead>
</table>      
</td>
</tr>     
<tr>
<td style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0; padding: 15px;" align="justify"> 
El primer paso es <span class="highlighted-text" style="color: #0093D6; font-weight: bold;">adquirir tu Membresía,</span> la cual te dará acceso a todos los beneficios de la 
comunidad SBC además de brindarte tu primera inversión con rendimiento mensual compuesto.
</td>
</tr>
<tr>
<td style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0; padding: 15px;" align="center"> 
<span class="highlighted-text" style="font-size: 18px; font-weight: 900; line-height: 21px; color: #0093D6;"> Regístrate y comienza tu camino hacia la Paz Financiera.</span> 
</td>
</tr>
<tr>
<td style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0; padding: 15px;" align="center"> 
<a href="https://www.sbcmexico.club/#/registro/${this.idCliente}" target="_blank" class="button-blue" style="background-color: #164194; text-decoration: none; display: inline-block; color: #FFFFFF; border-radius: 5px; font-weight: bold; font-style: normal; font-size: 17px; line-height: 40px; padding: 0px 40px;"> Registrarme </a>
</td>
</tr>
</tbody>
</table>
<table class="clear-table" style="margin-top: 30px; font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; font-style: normal; font-weight: normal; font-size: 17px; line-height: 20px; color: #000000; width: auto; height: auto; margin-left: auto; margin-right: auto;" border="0" cellspacing="0" cellpadding="0">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 15px; line-height: 20px; color: #000000; text-align: center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td align="center" class="text-center text-message" style="border-spacing: 0px; border-collapse: collapse; line-height: 15px; font-size: 15px; font-style: normal; font-weight: normal; color: #164194; text-shadow: 0px 0px 50px #FFFFFF; margin: 0;">  
Cualquier duda o aclaración envíanos un correo<br> a
<b><a class="url-link" href="mailto:asesoria@smartbusinesscorp.com" target="_blank" style="color: #0093D6;">
asesoria@smartbusinesscorp.com
</a>
</b>
o un whatsapp al
<b><a class="url-link" href="https://bit.ly/asesoriasbc" target="_blank" style="color: #0093D6;">
+52 56 1175 4467
</a>
</b>
</td>    
</tr>
<tr>
<td class="text-center text-message" style="border-spacing: 0px; border-collapse: collapse; line-height: 15px; font-size: 15px; font-style: normal; font-weight: normal; color: #164194; text-shadow: 0px 0px 50px #FFFFFF; margin: 0;" align="center"> 
<h5 style="margin-top: 25px; margin-bottom: 25px; font-weight: 900; vertical-align: baseline; font-size: 22px; line-height: 29px; font-family: 'Roboto','Arial'; color: #164194; text-shadow: 0 0 10px #FFF;" align="center">Equipo de Smart Business Corp</h5> </td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table> 
<img class="img-fluid" style="display: block; height: auto; line-height: 100%; outline: none; text-decoration: none; width: 100%; max-width: 100%; border: 0 none;" src="https://raw.githubusercontent.com/SaulDuenas/Emails_Smart/main/img/footer.png">
<table class="container-fluid  p-0 m-0" border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; width: 100%;">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 15px; line-height: 20px; color: #000000; text-align: center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 0;" align="left"> 
<div class="pre-footer-background-dark-blue" style="background-color: #164194; height: auto; width: auto; padding-bottom: 15px; padding-top: 15px;">
<div class="pre-footer-text" style="font-size: 11px; font-style: normal; font-weight: 300; line-height: 12px; color: #FFFFFF; text-shadow: 0px 0px 50px #FFFFFF;" align="center">
<div style="padding-bottom: 15px;">
<a target="_blank" href="https://www.facebook.com/smartbusinesscorpoficial" style="padding-top: 5px; text-decoration: none; border: none;">
<img src="https://raw.githubusercontent.com/SaulDuenas/Emails_Smart/main/img/facebook.png" class="social_icon" style="height: 30px; line-height: 100%; outline: none; text-decoration: none; width: 30px; padding-left: 2px; padding-right: 2px; border: 0 none;">
</a>
<a target="_blank" href="https://www.youtube.com/smartbusinesscorp" style="padding-top: 5px; text-decoration: none; border: none;">
<img src="https://raw.githubusercontent.com/SaulDuenas/Emails_Smart/main/img/youtube.png" class="social_icon" style="height: 30px; line-height: 100%; outline: none; text-decoration: none; width: 30px; padding-left: 2px; padding-right: 2px; border: 0 none;">
</a>
<a target="_blank" href="https://www.instagram.com/smartbusinesscorp" style="padding-top: 5px; text-decoration: none; border: none;">
<img src="https://raw.githubusercontent.com/SaulDuenas/Emails_Smart/main/img/instagram.png" class="social_icon" style="height: 30px; line-height: 100%; outline: none; text-decoration: none; width: 30px; padding-left: 2px; padding-right: 2px; border: 0 none;">
</a>
<a target="_blank" href="https://twitter.com/SBC_Mexico" style="padding-top: 5px; text-decoration: none; border: none;">
<img src="https://raw.githubusercontent.com/SaulDuenas/Emails_Smart/main/img/twitter.png" class="social_icon" style="height: 30px; line-height: 100%; outline: none; text-decoration: none; width: 30px; padding-left: 2px; padding-right: 2px; border: 0 none;">
</a>
<a target="_blank" href="https://www.linkedin.com/company/smartbusinesscorp" style="padding-top: 5px; text-decoration: none; border: none;">
<img src="https://raw.githubusercontent.com/SaulDuenas/Emails_Smart/main/img/linkedin.png" class="social_icon" style="height: 30px; line-height: 100%; outline: none; text-decoration: none; width: 30px; padding-left: 2px; padding-right: 2px; border: 0 none;">
</a>
</div>     
<div> © 2020 Smart Fund Limited.</div>
<div style="padding-left: 40px; padding-right: 40px;"> No respondas a este correo electrónico. Este buzón no se supervisa y no recibirá respuesta. Si quieres dejar de recibir correos de este remitente,<a href="#" target="_blank" style="color: #00B3F9;"> haz clic aquí.</a>  </div>
</div>
</div>
</td>
</tr>
</tbody>
</table>
<table class="s-3 w-100" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 15px; line-height: 20px; color: #000000; text-align: center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td height="16" style="border-spacing: 0px; border-collapse: collapse; line-height: 16px; font-size: 16px; width: 100%; height: 16px; margin: 0;" align="left"> 
</td>
</tr>
</tbody>
</table>
<table class="container-fluid  " border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; width: 100%;">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 15px; line-height: 20px; color: #000000; text-align: center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 0 16px;" align="left">
<div class="text-center footer-text adjust-width" style="padding-left: 15px; padding-right: 15px; font-size: 10px; line-height: 12px; text-shadow: 0px 0px 50px #FFFFFF;" align="center">  <span style="font-weight: bold; color: #164194;"> SBC SMARTFUND LIMITED ("SBC")</span> Es una empresa de la República de Vanuatu con domicilio comercial en Pot 805/103 Rue D'Auvergne, Port Vila, Vanuatu con número de registro 700358.</div>
</td>
</tr>
</tbody>
</table>
<table class="s-3 w-100" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 15px; line-height: 20px; color: #000000; text-align: center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td height="16" style="border-spacing: 0px; border-collapse: collapse; line-height: 16px; font-size: 16px; width: 100%; height: 16px; margin: 0;" align="left"> 
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<!--[if (gte mso 9)|(IE)]>
</td>
</tr>
</tbody>
</table>
<![endif]-->
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</body>
</html>`;

    return strHtml;
  }
  getConfirmHTML() {
    let strHtml =
      '<body style="background-color:#d1d5e1; font-family: arial" ><table align="center" border = "0" cellpadding = "0" cellspacing = "0"width = "550" bgcolor = "white" style = "border:none;" ><tbody><tr><td align="center" ><table align="center" border = "0" cellpadding = "0" cellspacing = "0" class="col-550" width = "550" >' +
      '<tbody><tr><td align="center" style = "background-color: white;height: 20px;padding-top: 10px;padding-bottom: 10px; "> <a href = "https://smartfundlimited.com/home/" style = "text-decoration: none;" ><p style="color: #164194;font-weight: light;font-size: 12px; "> Smart Business Corp ®' +
      '</p></a></td></tr></tbody></table></td></tr><tr style = "height: 300px;" ><td align="center" style = "border: none; " ><img src="http://sbcmexico.us:2000/mailActivaCta/head.png" width = "550px" ><p align="center" > <img src="http://sbcmexico.us:2000/mailActivaCta/mail.png" width = "20%" > </p><p style = "font-weight: bolder;font-size: 21px; ' +
      'letter-spacing: 0.025em;color:#164194; ">Confirma tu correo electrónico.</p></td></tr><tr style = "display: inline-block;" ><td style="height: 150px;padding: 35px;border: none;background-color: white; "><h4 style = "text-align: left;align-items: center;font-family: arial; ">' +
      '[[Nombre completo del nuevo suscriptor]], te saludamos con gusto.</h4><p class="data"style = "text-align: justify; align-items: center;font-size: 14px;padding-bottom: 12px; "> Hemos recibido una solicitud de registro en <b style = "color:#0093d6;" > SMART BUSINESS CORP.</b> Es necesario que verifiques tu correo electrónico.' +
      '</p> <p style = "font-size: 14px; text-align: justify;" > Da clic en el siguiente botón para confirmar tu correo y aceptar el registro.De esta forma podrás continuar con el proceso para la activación de tu cuenta. </p><table style = "align-items: center;" > <tr align="center" > <td><a href="" >' +
      '<p style="background-color: #27bcee; padding: 15px; text-align: center; font-size: 14px; border-radius: 10px; color: #ffffff; font-weight: bolder;" > Confirmar Correo </p></tr></td> </table></a><p style="font-size: 14px;text-align: justify;" > Agradecemos tu confianza, haremos que tu experiencia sea inigualable. </p>' +
      '</p><p align = "center" style = "color:#164194; font-weight: 700; padding: 0px 40px 10px 40px; font-size: 12px;" > Cualquier duda o aclaración envíanos un correo a <a href = "mailto:asesoria@smartbusinesscorp.com" target = "_top" > asesoria@smartbusinesscorp.com</a> o un whatsapp al  <a href="https://bit.ly/asesoriasbc">+52 56 1175 4467</a></p>' +
      '<p align = "center" style = "font-size: 14px; color: #164194; font-weight: bolder;" > Equipo de Smart Business Corp </p></td></tr><tr><td><img src="http://sbcmexico.us:2000/mailActivaCta/foot.png" width = "550px" > </td></tr><tr style = "border: none; background-color: #164194;' +
      'height: 60px;color: white;padding: 10px;text-align: center; "> <td height = "40px" align = "center" ><a href="https://www.facebook.com/smartbusinesscorpoficial"style = "border:none;' +
      'text-decoration: none;padding: 5px; "> <img src = "http://sbcmexico.us:2000/mailActivaCta/facebook.png" height = "70%" /></a> <a href = "https://www.youtube.com/smartbusinesscorp"' +
      'style = "border:none; text-decoration: none;padding: 5px; "> <img src = "http://sbcmexico.us:2000/mailActivaCta/youtube.png" height = "70%" /></a> ' +
      '<a href = "https://www.instagram.com/smartbusinesscorp/?hl=es"style = "border:none; text-decoration: none;padding: 5px; "> <img src = "http://sbcmexico.us:2000/mailActivaCta/instagram.png" height = "70%" /></a>' +
      '<a href = "https://twitter.com/SBC_Mexico?fbclid=IwAR3SkYNSlUj8NsnaUTCdoDZJYX2L55SL55TFUzFFCxjunMqJL0F_9TDEu-"style = "border:none; text-decoration: none;padding: 5px; "> <img src = "http://sbcmexico.us:2000/mailActivaCta/twitter.png" height = "70%" /></a> ' +
      '<a href = "https://www.linkedin.com/company/smartbusinesscorp/?originalSubdomain=mx"style = "border:none; text-decoration: none;' +
      'padding: 5px; "> <img src = "http://sbcmexico.us:2000/mailActivaCta/linkedin.png" height = "70%" /></a> </td> </tr> <tr><td bgcolor="164194" style = "font-family:&#39;Open Sans&#39;, Arial, sans-serif; font-size: 11px; line-height: 14px;' +
      'color: white;padding-top: 0px; " valign = "top" align = "center" >© 2020 Smart Fund Limited.<br>No respondas a este correo electrónico.Este buzón no se supervisa y no recibirá respuesta.' +
      'Si quieres dejar de recibir correos de este remitente,<a href="#"target = "_blank"style = "text-decoration:none; color: #44dff6; ">haz clic aquí.</a> ' +
      '<p style = "padding:20px; color:#164294; background-color: white;" > <b>SBC SMARTFUND LIMITED("SBC") </b> Es una empresa de la República de Vanuatu con domicilio comercial en Pot 805/103 Rue D&#39; Auvergne, Port Vila, Vanuatu con número de registro 700358.</p>' +
      "</td> </tr> </tbody></table></td ></tr> </tr> </tbody> </table> </body>";
    return strHtml;
  }
}
