import { ViewEncapsulation } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { KnowSbcService } from "../services/knowSbc/know-sbc.service";
import { TranslateEngineService } from "../services/translate/translate-engine.service";
import * as jwt_decode from "jwt-decode";

let lang: string="es";

@Component({
  selector: "app-kit-venta",
  templateUrl: "./kit-venta.component.html",
  styleUrls: ["./kit-venta.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class KitVentaComponent implements OnInit {
  constructor(private knowSbcService: KnowSbcService,
              private translateservice: TranslateEngineService) {

               

              }

  OurPhilosophyViewData;
  AdditionalPlansViewData;
  AffiliatesProgViewData;
  CorporateHelpViewData;
  
  userToken;
  id_cliente;

  private changeLangHandler = () => {
    console.log("cambie de idioma =>" +  this.translateservice.getLangSelected()  );

    lang = this.translateservice.getLangSelected();

    this.knowSbcService.getOurPhilosophy(lang).subscribe((result) => {
      this.OurPhilosophyViewData = result;
    });

    this.knowSbcService.getAdditionalPlansInfo(lang).subscribe((result) => {
      this.AdditionalPlansViewData = result;
    });

    this.knowSbcService.getAffiliatesProgInfo(lang).subscribe((result) => {
      this.AffiliatesProgViewData = result;
    });

    this.knowSbcService.getCorporateHelpInfo(lang).subscribe((result) => {
      this.CorporateHelpViewData = result;
    });

  }

  ngOnInit(): void {
  
    this.translateservice.onLangChangeSuscription(this.changeLangHandler);
    this.changeLangHandler();

  }

  leerToken() {
    console.log("leyendo token");
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
