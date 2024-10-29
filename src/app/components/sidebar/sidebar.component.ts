import { Component, OnInit } from "@angular/core";
import * as jwt_decode from "jwt-decode";

declare const $: any;
declare interface RouteInfo {
  tag: string;
  path: string;
  title: string;
  icon: string;
  class: string;
  act: boolean;
}
export var ROUTES: RouteInfo[] = [
  {
    tag: "Menu.Dashboard",
    path: "/home",
    title:"Dashboard" , 
    icon: "dashboard",
    class: "",
    act: false,
  },
  {
    tag: "Menu.NewRegister",
    path: "/homeregister",
    title: "Registro",
    icon: "person",
    class: "",
    act: false,
  },
  {
    tag: "Menu.MyProfile",
    path: "/profile",
    title: "Mi Perfil",
    icon: "recent_actors",
    class: "",
    act: false,
  },

  {
    tag: "Menu.AccountStatement",
    path: "/cuenta",
    title: "Estado de Cuenta",
    icon: "account_balance_wallet",
    class: "",
    act: false,
  },
  {
    tag: "Menu.AcquirePlan",
    path: "/selectplan",
    title: "Adquiere un Plan",
    icon: "add_task",
    class: "",
    act: false,
  },
  {
    tag: "Menu.MyCommunity",
    path: "/organization",
    title: "Mi comunidad",
    icon: "people",
    class: "",
    act: false,
  },
  {
    tag: "Menu.BonusComiss",
    path: "/bonos",
    title: "Bonos y Comisiones",
    icon: "monetization_on",
    class: "",
    act: false,
  },
  {
    tag: "Menu.KnowOfSBC",
    path: "/kit/1",
    title: "Conoce + SBC",
    icon: "business_center",
    class: "",
    act: false,
  },
  {
    tag: "Menu.Entrepreneurship",
    path: "/ecosistema",
    title: "Ecosistema Emprendedor",
    icon: "mediation",
    class: "",
    act: false,
  },
   {
    tag: "Menu.CloseSession",
    path: "/upgrade",
    title: "Cerrar Sesión",
    icon: "exit_to_app",
    class: "active-pro",
    act: false,
  }, 
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  userToken;
  isProspect;
  ocultar;

  constructor() {

  }


  ngOnInit() {
    this.leerToken();
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }

  leerToken() {
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
      var decoded = jwt_decode(this.userToken);
      this.isProspect = decoded["isProspect"];
      console.log(this.isProspect);
      if (this.isProspect == "0") {
        ROUTES.forEach(function (element) {
          if (element.title == "Cerrar Sesión" || element.title == "Registro") {
            element.act = true;
          } else
          {
            element.act = false;
          }

        });
      }
      if (this.isProspect == "1") {
        ROUTES.forEach(function (element) {

          if (element.title != "Cerrar Sesión" && element.title != "Registro" && element.title != "Close Session" && element.title != "Register")
          { element.act = true; }
          else
          { element.act = false; }
        });
      } 
    } else {
      this.userToken = "";
    }
    return this.userToken;
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
}
