import { Component, OnInit} from "@angular/core";
import { Network, DataSet, Node, Edge, IdType } from "vis-network/standalone";
import { OrganizationService } from "../services/organization/organization.service";
import Swal from "sweetalert2";
import { TranslateEngineService } from "../services/translate/translate-engine.service";

import * as jwt_decode from "jwt-decode";
import { formatDate } from "@angular/common";

let PartnersList;
let ProspectList;
let GuestList;
let FilterPatner = {direct:false, promotes:false, assigned:false,investment:false,order:"ASC"};

interface IDateList {
  tag: string;
  value: string;
  label: string;
}

interface IPatnerType {
  tag: string;
  value: string;
  label: string;
}


@Component({
  selector: "app-organization",
  templateUrl: "./organization.component.html",
  styleUrls: ["./organization.component.css"],
})

export class OrganizationComponent implements OnInit {
  constructor(
    private organizationService: OrganizationService,
    private translateservice: TranslateEngineService
  ) {}


  DateList: IDateList[] = [   
    {
      tag: "Community.LastWeek",
      value: "ALL",
      label: "Todos" ,    
    },     
    {
      tag: "Community.LastMonth",
      value: "LastMonth",
      label: "Último mes" ,    
    },  
    {
      tag: "Community.LastYear",
      value: "LastYear",
      label: "Último año" ,    
    },          
  ];

PatnerType: IPatnerType[] = [

  {
    tag: "Community.All",
    value: "all",
    label: "Todos" ,    
  },      
  {
    tag: "Community.DirectAssociate",
    value: "direct",
    label: "Afiliados Directo" ,    
  }, 
  {
    tag: "Community.Promotes",
    value: "promotes",
    label: "Me promueve" ,    
  }, 
  {
    tag: "Community.Assigned",
    value: "assigned",
    label: "Asignado" ,    
  }, 
  {
    tag: "Community.Partner",
    value: "patner",
    label: "Socio" ,    
  }, 
  {
    tag: "Community.Investment",
    value: "investment",
    label: "Con inversión" ,    
  }, 

];
 
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
      title: this.translateservice.getTranslate('Community.DeleteMsg.Title'),
      text: this.translateservice.getTranslate('Community.DeleteMsg.Msg'),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: this.translateservice.getTranslate('Community.DeleteMsg.Confirm'),
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc'
          },
          title: this.translateservice.getTranslate('Community.DeleteMsg.Success'), 
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
      title: this.translateservice.getTranslate('Community.EmailMsg.Title'), 
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

    return this.userToken;
  }

  public ngOnInit(): void {

    this.translateservice.onLangChangeSuscription(this.changeLangHandler);
    this.changeLangHandler();

    this.leerToken();

    this.getNumerals(this.id_cliente);

    this.getGuest(this.id_cliente);
    this.getProspects(this.id_cliente);
    this.getOrganization(this.id_cliente);
    this.GetPartnerDetail(this.id_cliente,0,0,0,0,FilterPatner["order"]);

  }

  private getOrganization(idSuscriber) {

    this.organizationService.getComunity(idSuscriber).subscribe((dataresult) => {
      console.log("dataresult", dataresult);
      PartnersList = dataresult;
      this.setNetWork();


    });

  }

  // 

  private GetPartnerDetail(idSuscriber,direct=0,promotes=0,assigned=0,investment=0,order='ASC')
  {
    this.organizationService.getPartnerDetail(idSuscriber,direct,promotes,assigned,investment,order)
        .subscribe((dataresult) => {

          if (dataresult != null) {
            this.PartnerListView =dataresult;
          }
          else{
            this.PartnerListView = [];
          }
          

    });

  }


  private getProspects(idSuscriber) {
    this.organizationService.getProspect(idSuscriber).subscribe((result) => {
      ProspectList = result;
     console.log(ProspectList)
      this.PropectLisView=this.getProspectsListView();
  
  //    this.setProspecNumeral(null,this.getjustdate(new Date()));

    });
  }
  
  private getGuest(idSuscriber) {
    this.organizationService.getGuest(idSuscriber).subscribe((result) => {
      GuestList = result;
      this.GuestListView = this.GetGuestListView();
   
      //   this.setGuestNumeral(null,this.getjustdate(new Date()));

    });
  }

  GuestTotal;
  PropectTotal;
  AfiliateTotal;
  PatnerTotal;


  private getNumerals(idSuscriber,date='NULL') {

    this.organizationService.getNumerals(idSuscriber,date).subscribe((result) => {
        
      // let reg_date = new Date (new Date());
      //       let reg_date_format = reg_date != null? formatDate(reg_date.setMinutes((reg_date.getMinutes() + reg_date.getTimezoneOffset())),'yyyy-MM-dd','en'):"";
        
        if (date == 'NULL') {
          this.GuestTotal = result[0]['Guests'];
          this.PropectTotal =result[0]['Propects'];
          this.AfiliateTotal =result[0]['Directs'];
          this.PatnerTotal =result[0]['Partners'];
        
          this.setNumeral('Guest', this.GuestTotal , this.GuestTotal ); 
          this.setNumeral('Prospect', this.PropectTotal , this.PropectTotal ); 
          this.setNumeral('Affiliates', this.AfiliateTotal , this.AfiliateTotal ); 
          this.setNumeral('Partner', this.PatnerTotal , this.PatnerTotal ); 
        }
        else {
          this.setNumeral('Guest', result[0]['Guests'] , this.GuestTotal ); 
          this.setNumeral('Prospect', result[0]['Propects'] , this.PropectTotal ); 
          this.setNumeral('Affiliates', result[0]['Directs'], this.AfiliateTotal ); 
          this.setNumeral('Partner', result[0]['Partners'] , this.PatnerTotal ); 
        }
   
    });


  }


  private getjustdate(date) {
    return (date.getFullYear() +"-"+ (date.getMonth()+1) +"-"+ date.getDate());
  }

  private GetMonthPrevious(date) {
    let offset: Date = new Date(date);
    offset.setMonth(offset.getMonth() - 1);
    return ((offset.getFullYear()) +"-"+ (offset.getMonth()+1) +"-"+ offset.getDate());
  }

  private GetYearPrevious(date) {
    let offset: Date = new Date(date);
    offset.setFullYear(offset.getFullYear() - 1);
    return  ((offset.getFullYear()) +"-"+ (offset.getMonth()+1) +"-"+ offset.getDate());
  }


  private setNumeral(parameter,counter,total) {

    let porcent = Math.round((counter/total)*100);
    this.CommunityNumeral[parameter]['counter'] = counter < 9 ? "0"+counter.toString(): counter.toString();
    this.CommunityNumeral[parameter]['porcent'] = porcent < 9 ? "0"+porcent.toString(): porcent.toString();
  }


  public getTypePartnerLabel(partner) {

   return (partner['EsAsignado'] == 1)? this.PatnerType[3]["label"]:
                      (partner['Promueve'] == 1)?  this.PatnerType[2]["label"]:
                      (partner['Level'] == 1)?  this.PatnerType[1]["label"]:
                      this.PatnerType[5]["label"];
  
  } 


  public getStrDate(partner) {
    let reg_date = new Date (partner['date']);
    let reg_date_format = partner['date'] != null? formatDate(reg_date.setMinutes((reg_date.getMinutes() + reg_date.getTimezoneOffset())),'yyyy-MM-dd','en'):"";
    return reg_date_format;
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

    //let path_image = "../../assets/img/comunidad/network/";
    //let nodes = [];
    //let edges = [];

   // console.log("PartnersList");
   // console.log(PartnersList);

    // define image
    
    /*
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
    
    */

 
   this.organizationService.getNetwork(this.id_cliente).subscribe((result) => {

    let nodes = result["data"][0]["nodes"];
    let edges = result["data"][1]["edges"];

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

  });



   

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

   // let ActualDate = this.getjustdate(new Date()); // get actual date without HH:mm:ss
  //  let MinDate = new Date();
    let MinDate='';  
  
    this.DateList[1]['value']

    switch(option) {
      case this.DateList[1]['value']:
        MinDate = this.GetMonthPrevious(new Date()); // get lastmonth date without HH:mm:ss
        this.getNumerals(this.id_cliente,MinDate);
        break;
      case this.DateList[2]['value']:
        MinDate = this.GetYearPrevious(new Date())  // get lastyear date without HH:mm:ss
        this.getNumerals(this.id_cliente,MinDate);
        break;
      default:    
        //MinDate = 'NULL';  
        this.getNumerals(this.id_cliente);
    }

  }

  public PatnerSelectChangeHandler (parameter) {

    if (parameter != 'all') {
      FilterPatner[parameter] = !FilterPatner[parameter];
    }
    else {
     
      for (var key in FilterPatner) {
        if (key != "order") FilterPatner[key] = 0;
      }

    }

    console.log(FilterPatner);
  
    this.GetPartnerDetail(this.id_cliente
                          ,(FilterPatner["direct"] == true)?1:0
                          ,(FilterPatner["promotes"] == true)?1:0
                          ,(FilterPatner["assigned"] == true)?1:0
                          ,(FilterPatner["investment"] == true)?1:0
                          ,FilterPatner["order"]);

  }

  public SortedDateSelectChangeHandler(pOrder) { 
   
    FilterPatner["order"]=pOrder;

    this.GetPartnerDetail(this.id_cliente
                          ,(FilterPatner["direct"] == true)?1:0
                          ,(FilterPatner["promotes"] == true)?1:0
                          ,(FilterPatner["assigned"] == true)?1:0
                          ,(FilterPatner["investment"] == true)?1:0
                         ,FilterPatner["order"]);

  }


  private changeLangHandler = () => {

    this.DateList.forEach( item => {

      this.translateservice.translateCore.get(item.tag).subscribe((res: string) => {
        
          item.label = res;
      });

    });


    this.PatnerType.forEach( item => {

      this.translateservice.translateCore.get(item.tag).subscribe((res: string) => {
        
          item.label = res;
      });

    });

  }


}
