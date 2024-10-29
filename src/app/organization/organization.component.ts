import { Component, OnInit} from "@angular/core";
import { Network, DataSet, Node, Edge, IdType } from "vis-network/standalone";
import { OrganizationService } from "../services/organization/organization.service";
import Swal from "sweetalert2";

import jwt_decode from 'jwt-decode';

import { formatDate } from "@angular/common";

let PartnersList;
let ProspectList;
let GuestList;
let FilterPatner = {direct:false, promotes:false, assigned:false,investment:false};

@Component({
  selector: "app-organization",
  templateUrl: "./organization.component.html",
  styleUrls: ["./organization.component.css"],
})

export class OrganizationComponent implements OnInit {
  constructor(
    private organizationService: OrganizationService
  ) {}

  DateList = [   
                {
                 "value": "ALL",
                  "label": "Actual",     
                },             
                {
                  "value": "lastmonth",
                  "label": "Último mes", 
                     
                },
                {
                  "value": "lastyear",
                  "label": "Último año",    
                },
              ];

  PatnerType = {all:"Todos", direct:"Afiliado Directo", promotes:"Me promueve", assigned:"Asignado", patner:"Socio",investment:"Con inversión"};

  CommunityNumeral = { Prospect : { counter: "00" ,porcent: "00"}, 
                       Guest : { counter: "00" ,porcent: "00"},
                       Affiliates : { counter: "00" ,porcent: "00"}, 
                       Partner : { counter: "00" ,porcent: "35"}
                     };

  searchText;

  PartnerListView;
  PropectLisView;
  GuestListView;

  userToken;
  id_cliente;
  
  public elimina() {
    Swal.fire({
      buttonsStyling: false,
      customClass: {
      confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc',
      cancelButton: 'btn btn-round ml-3 txt-btn-sbc'
      },
      title: "¿Estas seguro de eliminar el registro?",
      text: "Este cambio será irreversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, elimínalo",
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc'
          },
          title: "El registro fue eliminado con éxito", 
          icon: "success"
        });
      }
    });
  }

  email() {
    Swal.fire({
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc'
      },
      title: "¿Estas seguro de eliminar el registro?", 
      text: "", 
      icon: "info"});
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

    this.id_cliente = 107169;

    return this.userToken;
  }

  public ngOnInit(): void {

    this.leerToken();

    this.getGuest(this.id_cliente);
    this.getProspects(this.id_cliente);
    this.getOrganization(this.id_cliente);

  }

  private getOrganization(idSuscriber) {

    this.organizationService.getComunity(idSuscriber).subscribe((dataresult) => {
    
      PartnersList = dataresult;
      this.getPatnerListView(FilterPatner);
      this.setNetWork();

      this.setPartnerNumeral(null,this.getjustdate(new Date()));
      this.setAfiiateNumeral(null,this.getjustdate(new Date()));

    });

  }


  private getProspects(idSuscriber) {
    this.organizationService.getProspect(idSuscriber).subscribe((result) => {
      ProspectList = result;
     console.log(ProspectList)
      this.PropectLisView=this.getProspectsListView();
      this.setProspecNumeral(null,this.getjustdate(new Date()));

    });
  }
  
  private getGuest(idSuscriber) {
    this.organizationService.getGuest(idSuscriber).subscribe((result) => {
      GuestList = result;
      this.GuestListView = this.GetGuestListView();
      this.setGuestNumeral(null,this.getjustdate(new Date()));

    });
  }


  private getjustdate(date) {
    return new Date (date.getFullYear() +"-"+ (date.getMonth()+1) +"-"+ date.getDate());
  }

  private GetMonthPrevious(date) {
    let offset: Date = new Date(date);
    offset.setMonth(offset.getMonth() - 1);
    return new Date ((offset.getFullYear()) +"-"+ (offset.getMonth()+1) +"-"+ offset.getDate());
  }

  private GetYearPrevious(date) {
    let offset: Date = new Date(date);
    offset.setFullYear(offset.getFullYear() - 1);
    return new Date ((offset.getFullYear()) +"-"+ (offset.getMonth()+1) +"-"+ offset.getDate());
  }

  private setPartnerNumeral(minDate,lastDate) {

    let PartnerTotal = 0;
    let PartnerCount = 0;
    let itemsProcessed = 0;

    PartnersList.forEach((partner, index, array) => {
      
      let reg_date = partner.FechaContrato == null?null:new Date(partner.FechaContrato);
      if (reg_date != null) reg_date.setMinutes((reg_date.getMinutes() + reg_date.getTimezoneOffset()))
     
      if (partner.Level != "0") PartnerTotal ++;
      
      if (minDate == null || reg_date == null || (reg_date >= minDate &&  reg_date <= lastDate )) {
       
        if (partner.Level != "0") PartnerCount ++;
      }

      itemsProcessed++;
      if(itemsProcessed === array.length) {
        this.setNumeral('Partner',PartnerCount,PartnerTotal);
      }

    });

  }

  private setAfiiateNumeral(minDate,lastDate) {

    let AffiliateTotal = 0;
    let AffiliateCount = 0;
    let itemsProcessed = 0;

    PartnersList.forEach((partner, index, array) => {
      
      let reg_date = partner.FechaContrato == null?null:new Date(partner.FechaContrato);
      if (reg_date != null) reg_date.setMinutes((reg_date.getMinutes() + reg_date.getTimezoneOffset()))
     
      if (partner.Level == "1") AffiliateTotal ++;
   
      if (minDate == null || reg_date == null || (reg_date >= minDate &&  reg_date <= lastDate )) {
        if (partner.Level == "1") AffiliateCount ++;
      }

      itemsProcessed++;
      if(itemsProcessed === array.length) {
        this.setNumeral('Affiliates',AffiliateCount,AffiliateTotal);
      }

    });

  }

  private setProspecNumeral(minDate,lastDate) {

    let ProspectTotal = 0;
    let ProspectCount = 0;
    let itemsProcessed = 0;

    ProspectList.forEach((propect, index, array) => {
        
      let reg_date = propect.FECNIVEL == null ? null:new Date (propect.FECNIVEL);
      if (reg_date != null) reg_date.setMinutes((reg_date.getMinutes() + reg_date.getTimezoneOffset()));
  
      ProspectTotal++;
      if (minDate == null || reg_date == null || (reg_date >= minDate &&  reg_date <= lastDate )) ProspectCount++;
    
      itemsProcessed++;
      if(itemsProcessed === array.length) {
        this.setNumeral('Prospect',ProspectCount,ProspectTotal);
      }
    });
  
  }

  private setGuestNumeral(minDate,lastDate) {

    let GuestTotal = 0;
    let GuestCount = 0;
    let itemsProcessed = 0;

    GuestList.forEach((guest, index, array) => {
        
      let reg_date = guest.fecha == null ? null:new Date (guest.fecha);
      if (reg_date != null) reg_date.setMinutes((reg_date.getMinutes() + reg_date.getTimezoneOffset()));
  
      GuestTotal++;
      if (minDate == null || reg_date == null || (reg_date >= minDate &&  reg_date <= lastDate )) GuestCount++;
    
      itemsProcessed++;
      if(itemsProcessed === array.length) {
        this.setNumeral('Guest',GuestCount,GuestTotal);
      }
    });
  
  }

  private setNumeral(parameter,counter,total) {

    let porcent = Math.round((counter/total)*100);
    this.CommunityNumeral[parameter]['counter'] = counter < 9 ? "0"+counter.toString(): counter.toString();
    this.CommunityNumeral[parameter]['porcent'] = porcent < 9 ? "0"+porcent.toString(): porcent.toString();
  }


  private getPatnerListView(filter) {

    let dataView = [];
    let itemsProcessed = 0;

    PartnersList.forEach((partner, index, array) => { 

      if (partner.Level > 0) {
     
        if ((!(filter["direct"]) || (filter["direct"] && partner.Level == 1)) &&   // direct
            (!(filter["promotes"]) || (filter["promotes"] && partner.Promueve == 1))  &&   // promote    
            (!(filter["assigned"]) || (filter["assigned"] && partner.EsAsignado == 1)) &&   // assigned
            (!(filter["investment"]) || (filter["investment"] && partner.ConInversion == 1)) ) {
         
            let patnertype = (partner.EsAsignado == 1)? this.PatnerType["assigned"]:
                             (partner.Promueve == 1)? this.PatnerType["promotes"]:
                             (partner.Level == 1)? this.PatnerType["direct"]:
                             this.PatnerType["patner"];

            let reg_date = new Date (partner.FechaContrato);
            let reg_date_format = partner.FechaContrato != null? formatDate(reg_date.setMinutes((reg_date.getMinutes() + reg_date.getTimezoneOffset())),'yyyy-MM-dd','en'):"";

            dataView.push ({
                            "id" : partner.to,
                            "name" : partner.NAME,
                            "lastname": partner.LASTNAME + " " + partner.slastname,
                            "email": partner.email,
                            "phone":partner.telephone,
                            "date":reg_date_format,
                            "partnertype":patnertype,
                          });

        }
      }

      itemsProcessed++;

      if(itemsProcessed === array.length) this.PartnerListView = dataView;
      
    });

  }


  private getProspectsListView () {

    let dataView = [];

    for (let propect of ProspectList) {
      
      let reg_date = new Date (propect.FECNIVEL);
      let reg_date_format = propect.FECNIVEL != null? formatDate(reg_date.setMinutes((reg_date.getMinutes() + reg_date.getTimezoneOffset())),'yyyy-MM-dd','en'):"";
      let phone = propect.TELEPHONE != null ?  propect.COUNTRY_CODE != null ? "(" +propect.COUNTRY_CODE + ")"+  propect.TELEPHONE:"" : "";

      dataView.push ({
        "id": propect.ID,
        "name": propect.NAME,
        "lastname": propect.LASTNAME + " " + propect.SLASTNAME,
        "email": propect.EMAIL,
        "phone":  phone,
        "date": reg_date_format,
        
      });
      
    }

    return dataView;

  }

  private GetGuestListView() {

    let dataView = [];

    for (let guest of GuestList) {

      let reg_date = new Date (guest.fecha);
      let reg_date_format = guest.fecha != null? formatDate(reg_date.setMinutes((reg_date.getMinutes() + reg_date.getTimezoneOffset())),'yyyy-MM-dd','en'):"";

      dataView.push ({
        "id" : guest.id,
        "name" : guest.nombre,
        "email": guest.email,
        "date":reg_date_format,
      });
    }

    return dataView;
  }

  private setNetWork() {

    let path_image = "../../assets/img/comunidad/network/";
    let nodes = [];
    let edges = [];

    console.log("PartnersList");
    console.log(PartnersList);

    // define image
    console.log("Image");
    for (let partner of PartnersList) {

      let image="";

      if (partner.Level == 0) {
        image = "s";
        if (partner.EsEMaster > 0)  image =image + "_m";
        if (partner.ConInversion == 1) image = image + "_i";
      }
      else {
        image = (partner.EsAsignado == 1)? "ad":
                (partner.Promueve == 1)? "sp":
                (partner.Level == 1)? "s":"s";
        if (partner.EsEMaster > 0) image = image + "_m";
        if (partner.ConInversion == 1) image = image + "_i"; 
      }

      image = image + ".png";
      
      nodes.push (
                  {
                    id: partner.to,
                    shape: "image",
                    image:(path_image + image),
                    label: partner.NAME + " " + partner.LASTNAME + " " + partner.slastname,
                    title: this.getHtmlPopUp(partner,(path_image + image)),
                    shadow:{
                            enabled: true,
                            color: 'rgba(0,0,0,0.5)',
                            size:10,
                            x:5,
                            y:5
                          },
                  }
                );

      if (partner.Level > 0) {

        edges.push (
                    {
                      from: partner.from,
                      to: partner.to,
                    }
                  );

      }
    };

    var container = document.getElementById("mynetwork");

    let dataview = {
      nodes,
      edges,
    };

    var options = {
                    layout: {
                        hierarchical: {
                          direction: "UD",
                          nodeSpacing: 200,
                          treeSpacing: 50,
                          levelSeparation: 80,
                          sortMethod: "directed",
                          shakeTowards: "roots",
                        },
                      },
                      physics: false,

                      interaction: {
                          navigationButtons: true,
                          keyboard: false,
                        },

                      edges: {
                        smooth: {
                          type: "cubicBezier",
                          forceDirection: "vertical",
                          roundness: 0.2,
                          enabled: true,
                        },
                        color: "#ADADAD",
                      },
                  };

    var network = new Network(container, dataview, options);

  }

  private getHtmlPopUp(info,PathImg) {

    let reg_date = new Date (info.FechaContrato);
    let reg_date_format = info.FechaContrato != null? formatDate(reg_date.setMinutes((reg_date.getMinutes() + reg_date.getTimezoneOffset())),'yyyy-MM-dd','en'):"";

    let investment = (info.ConInversion == 1)? "Si":"No";

    let patnertype = (info.EsAsignado == 1)? this.PatnerType["assigned"]:
                     (info.Promueve == 1)? this.PatnerType["promotes"]:
                     (info.Level == 1)? this.PatnerType["direct"]:
                     this.PatnerType["patner"];

    return  '<table style="border-collapse: collapse;" border="0" cellspacing="5" cellpadding="0"> ' +
            '  <tbody> ' +
            '    <tr> ' +
            '      <td style="width: 30%; text-align:center;"> ' +
            '       <img width="80%" src="' + PathImg +'" alt="_img" > ' +
            '       <p style=" color: #4D4646; ' +
            '                  font-weight: bold; ' +
            '                  font-size: 12px;"> ID: <span  style="color: #FC2D2D; "> ' + info.to +'</span></p> ' +
            '      </td> ' +
            '      <td style="width: 70%; display:content;"> ' +
            '      <p style ="font-style: normal; ' +
            '                 font-weight: bold; ' +
            '                 font-size: 15px; ' +
            '                 line-height: 18px; ' +
            '                 letter-spacing: 0.01em; ' +
            '                 color: #0093D6;">'+  info.NAME + " " + info.LASTNAME + " " + info.slastname  +'</p> ' + 
            '      <p style="margin:0px; line-height: 15px;"> <span style="font-weight: bold;"> Correo: </span> ' + info.email + ' </p> ' + 
            '      <p style="margin:0px; line-height: 15px;"> <span style="font-weight: bold;"> Teléfono: </span> '+ info.telephone +' </p> ' + 
            '      <p style="margin:0px; line-height: 15px;"> <span style="font-weight: bold;"> Fecha de registro: </span> '+ reg_date_format +' </p> ' + 
            '      <p style="margin:0px; line-height: 15px;"> <span style="font-weight: bold;">  Tipo de socio: </span> ' +patnertype+' </p> ' + 
            '      <p style="margin:0px; line-height: 15px;"> <span style="font-weight: bold;"> Con inversión: </span>' +investment+ '</p>  ' +    
            '      </td> ' + 
            '    </tr> ' + 
            '  </tbody> ' + 
            '</table> ';
  }


  public PeriodSelectChangeHandler (event: any) {
  
    let option = event.target.value;

    let ActualDate = this.getjustdate(new Date()); // get actual date without HH:mm:ss
    let MinDate = new Date();
       
    switch(option) {
      case "lastmonth":
        MinDate = this.GetMonthPrevious(new Date()); // get lastmonth date without HH:mm:ss
        break;
      case "lastyear":
        MinDate = this.GetYearPrevious(new Date())  // get lastyear date without HH:mm:ss
        break;
      default:    
        MinDate = null;  
    }
 
    this.setAfiiateNumeral(MinDate,ActualDate);
    this.setPartnerNumeral(MinDate,ActualDate);
    this.setProspecNumeral(MinDate,ActualDate);
    this.setGuestNumeral(MinDate,ActualDate);
  }

  public PatnerSelectChangeHandler (parameter) {

    if (parameter != 'all') {
      FilterPatner[parameter] = !FilterPatner[parameter];
    }
    else {
     
      for (var key in FilterPatner) {
        FilterPatner[key] = false;
      }

    }

    console.log(FilterPatner);
  
    this.getPatnerListView(FilterPatner);
  }

  public SortedDateSelectChangeHandler(parameter) { 
   
    this.PartnerListView.sort(function(prev, actual) {

      let date_prev = !prev.date ? null: new Date (prev.date);
      let date_actual =  !actual.date ? null: new Date (actual.date);

      if (date_prev != null) date_prev.setMinutes((date_prev.getMinutes() + date_prev.getTimezoneOffset()));
      if (date_actual != null) date_actual.setMinutes((date_actual.getMinutes() + date_actual.getTimezoneOffset()));

      if (parameter == "asc") {
     //   return (date_prev < date_actual)?-1:
     //          (date_prev > date_actual)? 1:
     //          (prev.id < actual.id)?-1:1;

        return (prev.id < actual.id)?-1:1;
      }

      if (parameter == "desc") {
   //     return (date_prev > date_actual)?-1:
   //            (date_prev < date_actual)? 1:
   //            (prev.id > actual.id)?-1:1;

        return (prev.id > actual.id)?-1:1;
      }

      return 0;

    });


  }


}
