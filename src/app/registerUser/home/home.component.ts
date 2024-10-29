import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from "@angular/core";
import * as jwt_decode from "jwt-decode";
import { NgForm } from "@angular/forms";
import { UsuarioService } from "../../services/usuario/usuario.service";
import { TranslateEngineService } from "../../services/translate/translate-engine.service";
import { DatePipe, formatDate } from "@angular/common";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ValidadoresService } from "../../services/Validadores/validadores.service";
import { AuthService } from "../../services/login/login.service";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import * as Bowser from "bowser";
import { ImageElementContainer } from "html2canvas/dist/types/dom/replaced-elements/image-element-container";
import Swal from "sweetalert2";
import { CuentasService } from "../../services/Cuentas/cuentas.service";
import { Pipe, PipeTransform } from "@angular/core";
import { MatStepper } from '@angular/material/stepper';
import { Observable, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Pipe({ name: "tooltipList" })
export class TooltipListPipe implements PipeTransform {
  transform(lines: string[]): string {
    let list: string = "";

    lines.forEach((line) => {
      list += "• " + line + "\n";
    });

    return list;
  }
}

declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
   providers: [{
     provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
     
   }, DatePipe],
  //encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
   @ViewChild('stepper') stepper: MatStepper;
  /********************************** */
/********************************** */

  index = 0;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  userToken: string;
  peticion: any;
  habilitarBotonPlanes: boolean = false;
  intIndice = 1;
  fileToUpload: File = null;
  email: string;
  countryCode: string;
  telephone: string;
  nombre: string;
  paterno: string;
  materno: string;
  direccion: string;
  Pais: string;
  cp: string;
  RFC: string;
  SPONSOR: string;
  WALLET: string;
  Facebook: string;
  Twitter: string;
  Instagram: string;
  Youtube: string;
  Linkedin: string;
  demi: string;
  cant: number = 0;
  reference: string;
  Aboutme: string;
  fnacimiento: string;
  genero: string;
  idGenerico: number;
  idUsuario;
  COUNTRY_CODE: string;
  NUMBER_INT: string;
  NUMBER: string;
  COLONIA: String;
  CITY: String;
  STATE: string;
  image;
  avatar;
  reverso;
  anverso;
  domicilio;
  documentType;
  avatarFiles: any[];
  repitPassword;
  newPassword;
  oldPassword;
  ocultarReverso = true;
  public selectedFile: File = null;
  public status: number;
  public idUser: number;
  selectedIndex;
  arrayPaises;
  arrayCiudades;
  arraySponsor;
  admingralCta;
  formaReg: FormGroup;
  error: string;
  userId: number = 1;
  uploadResponse = { status: "", message: "", filePath: "" };
  hide = true;
  favoriteSeason: string;
  montoEditar = 0;
  idBeneficiarioSeleccionado;
  hideNewBeneficiary: boolean = true;
  isIne: boolean = true;
  isPassport: boolean = false;
  isIdentityCard: boolean = false;
  formData = new FormData();

  montoPesosMex;  
  montoUSD = 635
  refPago = "0011225412"

  showBTC = false;
  showPesos = false;
  showMainPanel = true;

  instructions = false;
  base64textString;

  public scanData:any;
  backsideImageData: any;
  docType="ID";
  baseUriIdentityMind = "https://sbcmexico.us:3000/api/users/identity";

  validateWithIdentityMind(data): Observable<any> {
    let url = `${this.baseUriIdentityMind}`;

    console.log("userdata" + JSON.stringify(data));

    return this.http.post(url, data).pipe(catchError(this.errorMgmt));
  }

  sendDataToServer() {
    this.peticion={
    man: this.email,                                                                      // "johndsmith@fakeemail.com", //Something that will be unique to each KYC user that comes into the platform.
    bco: "MX",                                                                            //Billing (source) country. ISO 3166-1 alpha-2 country code of the billing address of the transaction. Default is US   this.countryCode, //
    bc: this.CITY,                                                                        // "Spokane", //Billing (source) city
    //bs: "WA",                                                                           //Billing (source) state
    bz: this.cp,                                                                          //"99216", //Billing (source) zip / postal code
    bsn: this.direccion + " " + this.NUMBER + " " + this.NUMBER_INT + " " + this.COLONIA, //"123 Main", //Billing (source) street. Includes house number, street name, and apt. number
    bfn: this.nombre,                                                                     //"John", //billing first name
    //bmn: this.paterno,                                                                  //"Douglas", //billing middle name
    bln: this.paterno + " " + this.materno,                                               //"Smith", //billing last names (materno Paterno)
    dob: this.fnacimiento,                                                                //"1980-01-01", //date of birth
    phn: this.telephone,                                                                  //"5094961234", //Customer primary phone number
    //pm: "5094961234",                                                                   //Customer mobile phone number
    tea: this.email,                                                                      //"johndsmith@fakeemail.com", //Email address for the user
    stage: "1",
    profile: "DEFAULT",
    docType: this.docType, 
    docCountry: "MX",                                                                      //Issuing Country in 2 letter ISO 3166 format
    backsideImageData : this.backsideImageData,
    scanData: this.scanData, 
    //ip: "192.168.0.1"                                                                    //Customer’s IP address
    }
    this.userService.validateWithIdentityMind(this.peticion).subscribe(
      (res) => {
        this.leerToken()
        console.log(this.idGenerico)
        this.setKYCResp(this.idGenerico, res);
        if (res === "ACCEPT" || res === "MANUAL_REVIEW") {
          this.valKYC = false
          this.showNotification(
            "Verificación de identidad",
            "La validación de su identidad fue un éxito",
            "success"
          );
        } else
          this.valKYC = true
          this.showNotification(
            "Verificación de identidad",
            "Sus datos se acualizarón con éxito, en breve, uno de nuestros asesores se pondrá en contacto con usted",
            "info"
          );
      },
      (err) => {
        console.log(err);
        //this.setKYCResp(this.idGenerico, err);
      }
    );
    this.library_books = true;
    console.log(this.peticion)
  }

  countryCodes = [
    { pais: "Afganistán", code: "93" },
    { pais: "Albania", code: "355" },
    { pais: "Alemania", code: "49" },
    { pais: "Andorra", code: "376" },
    { pais: "Angola", code: "244" },
    { pais: "Anguila", code: "1 264" },
    { pais: "Antártida", code: "672" },
    { pais: "Antigua y Barbuda", code: "1 268" },
    { pais: "Arabia Saudita", code: "966" },
    { pais: "Argelia", code: "213" },
    { pais: "Argentina", code: "54" },
    { pais: "Armenia", code: "374" },
    { pais: "Aruba", code: "297" },
    { pais: "Australia", code: "61" },
    { pais: "Austria", code: "43" },
    { pais: "Azerbaiyán", code: "994" },
    { pais: "Bélgica", code: "32" },
    { pais: "Bahamas", code: "1 242" },
    { pais: "Bahrein", code: "973" },
    { pais: "Bangladesh", code: "880" },
    { pais: "Barbados", code: "1 246" },
    { pais: "Belice", code: "501" },
    { pais: "Benín", code: "229" },
    { pais: "Bhután", code: "975" },
    { pais: "Bielorrusia", code: "375" },
    { pais: "Birmania", code: "95" },
    { pais: "Bolivia", code: "591" },
    { pais: "Bosnia y Herzegovina", code: "387" },
    { pais: "Botsuana", code: "267" },
    { pais: "Brasil", code: "55" },
    { pais: "Brunéi", code: "673" },
    { pais: "Bulgaria", code: "359" },
    { pais: "Burkina Faso", code: "226" },
    { pais: "Burundi", code: "257" },
    { pais: "Cabo Verde", code: "238" },
    { pais: "Camboya", code: "855" },
    { pais: "Camerún", code: "237" },
    { pais: "Canadá", code: "1" },
    { pais: "Chad", code: "235" },
    { pais: "Chile", code: "56" },
    { pais: "China", code: "86" },
    { pais: "Chipre", code: "357" },
    { pais: "Ciudad del Vaticano", code: "39" },
    { pais: "Colombia", code: "57" },
    { pais: "Comoras", code: "269" },
    { pais: "República del Congo", code: "242" },
    { pais: "República Democrática del Congo", code: "243" },
    { pais: "Corea del Norte", code: "850" },
    { pais: "Corea del Sur", code: "82" },
    { pais: "Costa de Marfil", code: "225" },
    { pais: "Costa Rica", code: "506" },
    { pais: "Croacia", code: "385" },
    { pais: "Cuba", code: "53" },
    { pais: "Curazao", code: "5999" },
    { pais: "Dinamarca", code: "45" },
    { pais: "Dominica", code: "1 767" },
    { pais: "Ecuador", code: "593" },
    { pais: "Egipto", code: "20" },
    { pais: "El Salvador", code: "503" },
    { pais: "Emiratos Árabes Unidos", code: "971" },
    { pais: "Eritrea", code: "291" },
    { pais: "Eslovaquia", code: "421" },
    { pais: "Eslovenia", code: "386" },
    { pais: "España", code: "34" },
    { pais: "Estados Unidos de América", code: "1" },
    { pais: "Estonia", code: "372" },
    { pais: "Etiopía", code: "251" },
    { pais: "Filipinas", code: "63" },
    { pais: "Finlandia", code: "358" },
    { pais: "Fiyi", code: "679" },
    { pais: "Francia", code: "33" },
    { pais: "Gabón", code: "241" },
    { pais: "Gambia", code: "220" },
    { pais: "Georgia", code: "995" },
    { pais: "Ghana", code: "233" },
    { pais: "Gibraltar", code: "350" },
    { pais: "Granada", code: "1 473" },
    { pais: "Grecia", code: "30" },
    { pais: "Groenlandia", code: "299" },
    { pais: "Guadalupe", code: "590" },
    { pais: "Guam", code: "1 671" },
    { pais: "Guatemala", code: "502" },
    { pais: "Guayana Francesa", code: "594" },
    { pais: "Guernsey", code: "44" },
    { pais: "Guinea", code: "224" },
    { pais: "Guinea Ecuatorial", code: "240" },
    { pais: "Guinea-Bissau", code: "245" },
    { pais: "Guyana", code: "592" },
    { pais: "Haití", code: "509" },
    { pais: "Honduras", code: "504" },
    { pais: "Hong kong", code: "852" },
    { pais: "Hungría", code: "36" },
    { pais: "India", code: "91" },
    { pais: "Indonesia", code: "62" },
    { pais: "Irán", code: "98" },
    { pais: "Irak", code: "964" },
    { pais: "Irlanda", code: "353" },
    { pais: "Isla de Man", code: "44" },
    { pais: "Isla de Navidad", code: "61" },
    { pais: "Isla Norfolk", code: "672" },
    { pais: "Islandia", code: "354" },
    { pais: "Islas Bermudas", code: "1 441" },
    { pais: "Islas Caimán", code: "1 345" },
    { pais: "Islas Cocos (Keeling)", code: "61" },
    { pais: "Islas Cook", code: "682" },
    { pais: "Islas de Åland", code: "358" },
    { pais: "Islas Feroe", code: "298" },
    { pais: "Islas Georgias del Sur y Sandwich del Sur", code: "500" },
    { pais: "Islas Maldivas", code: "960" },
    { pais: "Islas Malvinas", code: "500" },
    { pais: "Islas Marianas del Norte", code: "1 670" },
    { pais: "Islas Marshall", code: "692" },
    { pais: "Islas Pitcairn", code: "870" },
    { pais: "Islas Salomón", code: "677" },
    { pais: "Islas Turcas y Caicos", code: "1 649" },
    { pais: "Islas Ultramarinas Menores de Estados Unidos", code: "246" },
    { pais: "Islas Vírgenes Británicas", code: "1 284" },
    { pais: "Islas Vírgenes de los Estados Unidos", code: "1 340" },
    { pais: "Israel", code: "972" },
    { pais: "Italia", code: "39" },
    { pais: "Jamaica", code: "1 876" },
    { pais: "Japón", code: "81" },
    { pais: "Jersey", code: "44" },
    { pais: "Jordania", code: "962" },
    { pais: "Kazajistán", code: "7" },
    { pais: "Kenia", code: "254" },
    { pais: "Kirguistán", code: "996" },
    { pais: "Kiribati", code: "686" },
    { pais: "Kuwait", code: "965" },
    { pais: "Líbano", code: "961" },
    { pais: "Laos", code: "856" },
    { pais: "Lesoto", code: "266" },
    { pais: "Letonia", code: "371" },
    { pais: "Liberia", code: "231" },
    { pais: "Libia", code: "218" },
    { pais: "Liechtenstein", code: "423" },
    { pais: "Lituania", code: "370" },
    { pais: "Luxemburgo", code: "352" },
    { pais: "México", code: "52" },
    { pais: "Mónaco", code: "377" },
    { pais: "Macao", code: "853" },
    { pais: "Macedônia", code: "389" },
    { pais: "Madagascar", code: "261" },
    { pais: "Malasia", code: "60" },
    { pais: "Malawi", code: "265" },
    { pais: "Mali", code: "223" },
    { pais: "Malta", code: "356" },
    { pais: "Marruecos", code: "212" },
    { pais: "Martinica", code: "596" },
    { pais: "Mauricio", code: "230" },
    { pais: "Mauritania", code: "222" },
    { pais: "Mayotte", code: "262" },
    { pais: "Micronesia", code: "691" },
    { pais: "Moldavia", code: "373" },
    { pais: "Mongolia", code: "976" },
    { pais: "Montenegro", code: "382" },
    { pais: "Montserrat", code: "1 664" },
    { pais: "Mozambique", code: "258" },
    { pais: "Namibia", code: "264" },
    { pais: "Nauru", code: "674" },
    { pais: "Nepal", code: "977" },
    { pais: "Nicaragua", code: "505" },
    { pais: "Niger", code: "227" },
    { pais: "Nigeria", code: "234" },
    { pais: "Niue", code: "683" },
    { pais: "Noruega", code: "47" },
    { pais: "Nueva Caledonia", code: "687" },
    { pais: "Nueva Zelanda", code: "64" },
    { pais: "Omán", code: "968" },
    { pais: "Países Bajos", code: "31" },
    { pais: "Pakistán", code: "92" },
    { pais: "Palau", code: "680" },
    { pais: "Palestina", code: "970" },
    { pais: "Panamá", code: "507" },
    { pais: "Papúa Nueva Guinea", code: "675" },
    { pais: "Paraguay", code: "595" },
    { pais: "Perú", code: "51" },
    { pais: "Polinesia Francesa", code: "689" },
    { pais: "Polonia", code: "48" },
    { pais: "Portugal", code: "351" },
    { pais: "Puerto Rico", code: "1" },
    { pais: "Qatar", code: "974" },
    { pais: "Reino Unido", code: "44" },
    { pais: "República Centroafricana", code: "236" },
    { pais: "República Checa", code: "420" },
    { pais: "República Dominicana", code: "1 809" },
    { pais: "República de Sudán del Sur", code: "211" },
    { pais: "Reunión", code: "262" },
    { pais: "Ruanda", code: "250" },
    { pais: "Rumanía", code: "40" },
    { pais: "Rusia", code: "7" },
    { pais: "Sahara Occidental", code: "212" },
    { pais: "Samoa", code: "685" },
    { pais: "Samoa Americana", code: "1 684" },
    { pais: "San Bartolomé", code: "590" },
    { pais: "San Cristóbal y Nieves", code: "1 869" },
    { pais: "San Marino", code: "378" },
    { pais: "San Martín (Francia)", code: "1 599" },
    { pais: "San Pedro y Miquelón", code: "508" },
    { pais: "San Vicente y las Granadinas", code: "1 784" },
    { pais: "Santa Elena", code: "290" },
    { pais: "Santa Lucía", code: "1 758" },
    { pais: "Santo Tomé y Príncipe", code: "239" },
    { pais: "Senegal", code: "221" },
    { pais: "Serbia", code: "381" },
    { pais: "Seychelles", code: "248" },
    { pais: "Sierra Leona", code: "232" },
    { pais: "Singapur", code: "65" },
    { pais: "Sint Maarten", code: "1 721" },
    { pais: "Siria", code: "963" },
    { pais: "Somalia", code: "252" },
    { pais: "Sri lanka", code: "94" },
    { pais: "Sudáfrica", code: "27" },
    { pais: "Sudán", code: "249" },
    { pais: "Suecia", code: "46" },
    { pais: "Suiza", code: "41" },
    { pais: "Surinám", code: "597" },
    { pais: "Svalbard y Jan Mayen", code: "47" },
    { pais: "Swazilandia", code: "268" },
    { pais: "Tayikistán", code: "992" },
    { pais: "Tailandia", code: "66" },
    { pais: "Taiwán", code: "886" },
    { pais: "Tanzania", code: "255" },
    { pais: "Territorio Británico del Océano Índico", code: "246" },
    { pais: "Timor Oriental", code: "670" },
    { pais: "Togo", code: "228" },
    { pais: "Tokelau", code: "690" },
    { pais: "Tonga", code: "676" },
    { pais: "Trinidad y Tobago", code: "1 868" },
    { pais: "Tunez", code: "216" },
    { pais: "Turkmenistán", code: "993" },
    { pais: "Turquía", code: "90" },
    { pais: "Tuvalu", code: "688" },
    { pais: "Ucrania", code: "380" },
    { pais: "Uganda", code: "256" },
    { pais: "Uruguay", code: "598" },
    { pais: "Uzbekistán", code: "998" },
    { pais: "Vanuatu", code: "678" },
    { pais: "Venezuela", code: "58" },
    { pais: "Vietnam", code: "84" },
    { pais: "Wallis y Futuna", code: "681" },
    { pais: "Yemen", code: "967" },
    { pais: "Yibuti", code: "253" },
    { pais: "Zambia", code: "260" },
    { pais: "Zimbabue", code: "263" },
  ];
  /********** Beneficiaries variables ************/ 
  totalPercentage = 0;
  showDesignatedBenef = true;
  showRegisterBenef = false;
  showEditForm = false;
  addBeneficiaryForm: FormGroup;
  editBeneficiaryForm: FormGroup;
  designateAUCForm: FormGroup;
  arrayBeneficiaries;
  AUC;
  validPercentage = false;
  enableAddButton = true;

  /********************************** */
  /********************************** */
  memberships = [
    { value: "15", viewValue: "Basic" },
    { value: "16", viewValue: "Premium" },
    { value: "15", viewValue: "Basic Smart Pack" },
    { value: "16", viewValue: "Premium Smart Pack" }
  ]

  seasons = [
    { docto: "INE", descripcion: "Descripción uno" },
    { docto: "Pasaporte", descripcion: "Descripción dos" },
    {
      docto: "Tarjeta de Identificación Nacional",
      descripcion: "Descripción tres",
    },
  ];

  generos = [
    { valor: "M", muestraValor: "Masculino" },
    { valor: "F", muestraValor: "Femenino" },
  ];

  options: any[] = [
    { name: "Facebook" },
    { name: "Twitter" },
    { name: "Email" },
    { name: "Youtube" },
    { name: "Google" },
    { name: "Por invitación de un familiar o amigo" },
    { name: "Otro" },
  ];

  totalAsignado;
  porAsignar;

  Active;
  constructor(
    private http: HttpClient,
    private _formBuilder: FormBuilder,
    private fb: FormBuilder,
    private httpClient: HttpClient,
    public datepipe: DatePipe,
    private userService: UsuarioService,
    private elementRef: ElementRef,
    private validadores: ValidadoresService,
    private authService: AuthService,
    private cuentasService: CuentasService,
    private translateservice: TranslateEngineService,
  ) {
    this.documentType = 1;
    this.isIne = true;
    this.selectedIndex = 0;
    this.getIP();
    let userAgent = Bowser.parse(window.navigator.userAgent);
    let browser = Bowser.getParser(window.navigator.userAgent);
    let userAgentDetails = JSON.stringify(userAgent, null, 4);
    let browserDetails = JSON.stringify(browser.getBrowser(), null, 4);
    this.getCountries();
  }


  ngOnInit() {
    this.getSmartPack(211);
    this.leerToken();
    this.getCountries();
    this.getUserData(this.email);
    this.getKYCResp(this.idGenerico);
    this.getNotificacionesPago(this.idGenerico)
    this.buildFormRegistros();

    /********** Beneficiaries Tab ************/

    let myDate = formatDate(new Date(), "yyyy/MM/dd", "en");
    this.addBeneficiaryForm = this.fb.group({
      idUser: [this.idUser],
      name: ['', [Validators.required]],
      surname1: ['', [Validators.required]],
      surname2: '',
      birthdate: [myDate, [Validators.required]],
      email: [
        '', 
        [
          Validators.required, 
          Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$")
        ]
      ],
      homePhone: '',
      mobilePhone: '',
      percentage: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(0), Validators.max(100)]],
    });
    this.editBeneficiaryForm = this.fb.group({
      id: '',
      idUser: [this.idUser],
      name: ['', [Validators.required]],
      surname1: ['', [Validators.required]],
      surname2: '',
      birthdate: [
        formatDate( myDate, "yyyy-MM-dd", "en" ), 
        [Validators.required]],
        email: [
          '', 
        [
          Validators.required, 
          Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$")
        ]
      ],
      homePhone: '',
      mobilePhone: '',
      percentage: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1), Validators.max(100)]],
      oldPercentage: ''
    });
    this.designateAUCForm = this.fb.group({
      managerId: ['', Validators.required],
    });
    // this.getBeneficiaries();
    // this.getTotalPercentage();
    // this.getAUC();
  }

  buildFormRegistros() {
    console.log(this.nombre)
        this.formaReg = this.fb.group({
          nombre: [this.nombre,[Validators.required]],
          paterno: ["", [Validators.required]],
          materno: ["", [Validators.required]],
          email: ["",[Validators.required,Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$"),],],
          telephone: ["", , this.validadores.existeUsuario],
          Pais: ["",[Validators.required],],
          fnacimiento: ["",[Validators.required]],
          genero: ["", Validators.required],
          RFC: ["", Validators.required],
          CITY: ["", Validators.required],
          direccion: ["", Validators.required],
          NUMBER: ["", Validators.required],
          NUMBER_INT: ["", Validators.required],
          cp: ["", Validators.required],
          COLONIA: ["", Validators.required],
          STATE: ["", Validators.required],
        });
  }
/*************************************************************************/
/*******************SECCIÓN SELECCIÓN SMART PACK**************************/
/*************************************************************************/
  tipoPlan;
  idMembresia;
  costoMembresia;
  rendMembresia;
  claseTitular;
  textSP;
  botonSP;
  rendPlan;
  montoPlan;
  costoPlan;
  idPlanContratado;
  idPlan;
  idMembre;
  nombrePlan;
  colorTabla;
  mostrarAdicionales;
  amountDisabled;
  newId_suscriber;
  notificacionPago = false;
  datosNotificacionPago = true;
  id_suscriber;
  isPack = false
  
  handleImage(files: FileList) {
    console.log(files[0].name);
    this.formData.delete("archivo");
    this.formData.append("archivo", files[0]);
    this.userService.subirImagen(this.formData, "avatar").subscribe((data) => {
      this.userService
        .setImagenToSuscriber(this.idUsuario, files[0].name, 1)
        .subscribe((data) => {}),
        (err) => {
          console.log(err);
        };
    }),
      (err) => {
        console.log(err);
      };
  }

  adquirirMembresia() {
    if(this.isPack) { this.adquirirSmartPack()}
    else {
     Swal.fire({
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc',
        cancelButton: 'btn btn-light btn-round mr-3 txt-btn-sbc'
      },
      title: "",
      html:
        "<h2>Membresía</h2><br>" +
        "<div><img src='../assets/img/bars_color.png' alt='' /></div><br><br>" +
        "Estás adquiriendo una Membresía de <b>" +
        this.costoMembresia +
        " USD </b> con RMC del <b>" +
         this.rendPlan +
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
        this.leerToken();
        console.log(this.idGenerico)
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
                    this.idPlan,
                    latest_date,
                    this.costoMembresia,
                     this.rendPlan
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
  }

  sendMail() {
      console.log(this.nombre)
    console.log(this.paterno)
    console.log(this.email)
    this.userService
    .envioEmailGeneral(
      "mail@smartbusinesscorp.info",
      this.email,
      {},
      this.getHTML(),
      "Notificación de pago"
    )
    .subscribe(
      (data) => {
        console.log(data)
      },
      (err) => {
        console.log(err)
      }
    );
  }

  adquirirSmartPack() {
    let date = new Date();
    let idNewMembership;
    let idNewPlan;
    var latest_date = this.datepipe.transform(date, "yyyy-MM-dd");
    Swal.fire({
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc',
        cancelButton: 'btn btn-light btn-round mr-3 txt-btn-sbc'
      },
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
                            "Ismael Almaraz", //TODO
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
          "https://www.smartbusinesscenter.com.mx/membrepack?cities=" +
          btoa(stringData);
        this.sendMail();
        this.authService.logout();
        window.open(url, "_blank");
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getSmartPack(value) {
    console.log("getSmartPack = "+this.tipoPlan)
    if (this.tipoPlan == "premiumSP") {
      this.nombremembresia = "Premium"
      console.log("getSmartPack = "+value)
      this.idMembresia = 16;
      this.costoMembresia = 825;
      this.rendMembresia = 5;
      this.selectPlanPlatinumSP(value);
      this.claseTitular = "tablePremium";
      this.textSP = "textPremium";
      this.botonSP = "botonPremium";
    }

    if (this.tipoPlan == "basicSP") {
      this.nombremembresia = "Basic"
      this.idMembresia = 15;
      this.costoMembresia = 635;
      this.rendMembresia = 4;
      this.selectPlanBasicSP(value);
      this.claseTitular = "tableBasic";
      this.textSP = "textBasic";
      this.botonSP = "botonBasic";
    }
    this.isPack = true
    this.idMembre =  this.idMembresia;
    


  }

  selectPlanBasicSP(value) {
         console.log("selectPlanPlatinumSP")
    this.idPlanContratado = value;
    switch (value) {
      case "211": {
        this.idPlan = "211";
        console.log(1);
        this.rendPlan = "3";
        this.montoPlan = 500 + this.costoMembresia;
        this.costoPlan = 500;
        break;
      }
      case "212": {
        this.idPlan = "212";
        console.log(1);
        this.rendPlan = "3.5";
        this.montoPlan = 1000 + this.costoMembresia;
        this.costoPlan = 1000;
        break;
      }
      case "213": {
        this.idPlan = "213";
        console.log(1);
        this.rendPlan = "4.5";
        this.montoPlan = 2000 + this.costoMembresia;
        this.costoPlan = 2000;
        break;
      }
      case "215": {
        this.idPlan = "215";
        console.log(1);
        this.rendPlan = "5.5";
        this.montoPlan = 5000 + this.costoMembresia;
        this.costoPlan = 5000;
        break;
      }
      case "216": {
        this.idPlan = "216";
        console.log(1);
        this.rendPlan = "6.5";
        this.montoPlan = 10000 + this.costoMembresia;
        this.costoPlan = 10000;
        break;
      }
    }
  }

  selectPlanPlatinumSP(value) {
     console.log("selectPlanPlatinumSP")
    this.idPlanContratado = value;
    switch (value) {
      case "211": {
        this.idPlan = "211";
        console.log(1);
        this.rendPlan = "5";
        this.montoPlan = 500 + this.costoMembresia;
        this.costoPlan = 500;
        break;
      }
      case "212": {
        this.idPlan = "212";
        console.log(1);
        this.rendPlan = "5.5";
        this.montoPlan = 1000 + this.costoMembresia;
        this.costoPlan = 1000;
        break;
      }
      case "213": {
        this.idPlan = "213";
        console.log(1);
        this.rendPlan = "6";
        this.montoPlan = 2000 + this.costoMembresia;
        this.costoPlan = 2000;
        break;
      }
      case "215": {
        this.idPlan = "215";
        console.log(1);
        this.rendPlan = "7";
        this.montoPlan = 5000 + this.costoMembresia;
        this.costoPlan = 5000;
        break;
      }
      case "216": {
        this.idPlan = "217";
        console.log(1);
        this.rendPlan = "8";
        this.montoPlan = 10000 + this.costoMembresia;
        this.costoPlan = 10000;
        break;
      }
    }
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
      this.montoPlan = "825";
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

  toggleChange(event) {
    console.log(event.source.value);
    this.getSmartPack(event.source.value);
  }

  postNewAccount(id_susciber, id_plan, fec_contrat, monto, porcent) {
    this.cuentasService
      .postNewAccount(id_susciber, id_plan, fec_contrat, monto, porcent)
      .subscribe(
        (data) => {
          var dataToEncrypt = {
            Liverpool: id_susciber,
            Londres: "ismael almaraz",//TODO
            Leicester: "ismaelalmaraz@live.com",//TODO
            Bradford: data["lastIdCuenta"],
            Belfast: monto,
          };
          console.log(dataToEncrypt);
          this.userService.getEncrptedDataForPayment(dataToEncrypt).subscribe(
            (data) => {
              //console.log(data);
              let stringData: string = "";
              for (let clave in data) {
                console.log(clave + ":" + data[clave]);
                stringData += data[clave] + "|";
              }
              //console.log(btoa(stringData));
              let url =
                "https://www.smartbusinesscenter.com.mx/membre?cities=" +
                btoa(stringData);
              this.sendMail();
              this.authService.logout();
              window.open(url, "_blank");
            },
            (error) => {
              console.log(error);
            }
          );

          console.log(data);
/*           Swal.fire({
            icon: "success",
            title: "¡Felicidades!",
            text: "La transacción fue un éxito",
          }); */
        },
        (err) => {
          console.log(err);
        }
      );
  }
/****************************FIN******************************************/

  showBTCPanel(montoPlan, idPlan, rendPlan) {
    this.idPlan = idPlan;
    this.rendPlan = rendPlan;
    this.costoMembresia = montoPlan
    console.log(this.costoMembresia + " " + this.rendPlan + " " + this.idPlan)
    this.showBTC = true;
    this.showMainPanel=false;
     this.instructions = false;
  }
  
  showBTCSPPanel(montoPlan, idPlan, rendPlan, tipoPlan) {
    this.tipoPlan = tipoPlan;
    console.log(tipoPlan)
    this.selectPlan(tipoPlan);
    this.idPlan = idPlan;
    this.rendPlan = rendPlan;
    this.costoMembresia = montoPlan
    console.log(this.costoMembresia + " " + this.rendPlan + " " + this.idPlan)
    this.showBTC = true;
    this.showMainPanel=false;
     this.instructions = false;
  }
  
  nombremembresia=""
  showInstructions(montoPlan, idPlan, rendPlan) { 

    if(idPlan == 15)
      this.nombremembresia = "Basic" 
    if(idPlan == 16)
      this.nombremembresia = "Premium" 
    this.isPack = false;
    this.costoMembresia = montoPlan
    this.rendPlan = rendPlan;
    this.idPlan = idPlan;
    this.showBTC = false;
    this.showMainPanel=false;
    this.instructions = true;
  }

  showInstructionsSP() { 
        console.log(this.costoPlan)
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
    this.isPack = true
    this.showBTC = false;
    this.showMainPanel=false;
    this.instructions = true;
  }

  showPesosPanel(usd) {
    this.montoUSD = usd
    let x = new Intl.NumberFormat("en-IN").format(usd * 20);
    this.montoPesosMex = x.toString();
    this.showPesos = true;
    this.showMainPanel=false;
  }

  showMainPanelFunc() {
    console.log("showMainPanel")
    this.showMainPanel = true;
    this.showPesos = false;
    this.showBTC = false;
    this.instructions = false;
  }

  notificarPago() {

    this.setNotificacionPago();
  }

  selectedValue;
  montoMX;
  referenciaPago;
  fecPago;

  setNotificacionPago() { 
    console.log( this.selectedValue + " " + this.montoMX + " " + this.referenciaPago)
    if (this.selectedValue == undefined || this.montoMX == undefined || this.referenciaPago == undefined || this.fecPago == undefined) { 
      Swal.fire('Any fool can use a computer')
          this.notificacionPago = false
    this.datosNotificacionPago = true;
      return;
    }
        this.notificacionPago = true
    this.datosNotificacionPago = false;
    this.leerToken()
    this.userService.setNotificacionPago(
      this.montoMX ,
      this.selectedValue ,
      this.referenciaPago,
      this.fecPago,
      this.idGenerico
    ).subscribe((res) => {
      console.log(res)
    })
  }

  /************ Beneficiaries Tab *********************/
  editBeneficiary(benef) {
    this.editBeneficiaryForm.reset();
    var date = new Date(benef.fechaNac);
    let names = benef.nombre.trim();
    if (benef.snombre) {
      names += " " + benef.snombre.trim();
    }
    this.editBeneficiaryForm = this.fb.group({
      id: [benef.id],
      idUser: [this.idUser],
      name: [names, [Validators.required]],
      surname1: [benef.apaterno.trim(), [Validators.required]],
      surname2: benef.amaterno.trim(),
      birthdate: [
        formatDate(
          date.setMinutes(date.getMinutes() + date.getTimezoneOffset()),
          "yyyy-MM-dd", 
          "en"
        ),
        [Validators.required]],
      email: [
        benef.email.trim(),
        [
          Validators.required, 
          Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$")
        ]
      ],
      homePhone: benef.telCasa.trim(),
      mobilePhone: benef.telMovil.trim(),
      percentage: [parseInt(benef.porcentaje), [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(0), Validators.max(100)]],
      oldPercentage: [parseInt(benef.porcentaje)]
    });

    this.showEditForm = true;    
  }

  deleteBeneficiary(benef) {
    let text = "";
    let name = "";
    if (benef.nombre) {
      name += benef.nombre + " ";
    }
    if (benef.snombre) {
      name += benef.snombre + " ";
    }
    if (benef.apaterno) {
      name += benef.apaterno + " ";
    }
    if (benef.amaterno) {
      name += benef.amaterno + " ";
    }
    if (name) {
      text = 
        this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.DeleteMsg.Msg01') +
        name +
        this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.DeleteMsg.Msg03');
    } else {
      text = 
        this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.DeleteMsg.Msg01') +
        this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.DeleteMsg.Msg02') +
        this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.DeleteMsg.Msg03');
    }
    Swal.fire({
      title: this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.DeleteMsg.Title'),
      text: text,
      icon: "question",
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.DeleteMsg.Yes'),
      cancelButtonText: this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.DeleteMsg.No'),
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteBeneficiary(benef.id).subscribe(
          (result) => {
            Swal.fire(
              this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.DeleteMsg.Done'), 
              this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.DeleteMsg.Success'), 
              "success"
            );
            this.getTotalPercentage();
            this.showDesignatedBenefFunc();
            // Actualizar AUC
          },
          (err) => {
            Swal.fire(
              this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.DeleteMsg.Title'), 
              this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.DeleteMsg.Error'), 
              "error"
            );
            console.log(err);
          }
        );
      }
    });
  }

  showRegisterBenefFunc() {
    /* Show register beneficiarie form */
    this.showRegisterBenef = true;
    this.showDesignatedBenef = false;
  }

  showDesignatedBenefFunc() {
    /* Show designated beneficiaries table */
    this.showRegisterBenef = false;
    this.showDesignatedBenef = true;
    this.showEditForm = false;
  }

  getTotalPercentage() {
    this.userService.getTotalPercent(this.idUser).subscribe((data) => {
      this.totalPercentage = parseInt(data["porcTotal"]);
      if(this.totalPercentage == 100) {
        this.enableAddButton = true;
      } else {
        this.enableAddButton = false;
      }
    });
  }

  /************** FIN Beneficiaries Tab ************************/

  validaFormRegistro() {
    var respuesta =true;
    var msg;
    if (this.telephone.trim() == "") {respuesta = false; msg ="por favor agregue un número telefónico"} 
      if( this.nombre.trim()  == "") {respuesta = false; msg ="por favor agregue su nombre completo"}
      if( this.paterno.trim()  == "") { respuesta = false; msg ="por favor agregue su Apellido Paterno"}
      //if( this.materno.trim()  == "") {respuesta = false; msg =""}
      if( this.direccion.trim()  == "") {respuesta = false; msg ="por favor agregue su dirección"}
      if( this.Pais.trim()  == "") { respuesta = false;msg ="por favor agregue su país"}
      if( this.cp.trim()  == "") { respuesta = false;msg ="por favor agregue su Código Postal"}
      //if( this.RFC.trim()  == "") { respuesta = false;msg =""}
      if( this.COUNTRY_CODE.trim()  == "") { respuesta = false;msg ="por favor agregue el código telefónico de su país"}
      //if( this.NUMBER_INT.trim()  == "") { respuesta = false;msg =""}
      if( this.NUMBER.trim()  == "") { respuesta = false;msg ="por favor agregue el número de su casa"}
      if( this.COLONIA.trim()  == "") {respuesta = false; msg ="por favor agregue su colonia"}
      if( this.CITY.trim()  == "") {respuesta = false; msg ="por favor agregue su ciudad"}
      if( this.STATE.trim()  == "") {respuesta = false; msg ="por favor agregue su estado"}
    if (this.domicilio.trim() == "") { respuesta = false; msg ="por favor agregue su domicilio"}
    if (respuesta == false) {
      Swal.fire(
      "Completa tus Datos",
      "Antes de continuar, "+msg,
      "warning"
      );
    }

    return respuesta ;
  }

  move(index: number) { 

    if (!this.validaFormRegistro()) {

    } else {
      this.stepper.selectedIndex = index; 
      console.log(index);
      switch (index) {
        case 1: this.stepPerson = true; break
      }
    }
  }

  setKYCResp(id,respuesta) {
    this.userService.setRespKYC(id,respuesta).subscribe(
      (result) => {
        console.log(result);   
      },
      (err) => {
        console.log(err);
      }
    );
  }

  stepPerson=false
  library_books=false
  person_add=false
  attach_money=false
  touch_app=false
  valKYC = true

  goToFinish() {
    this.stepper.selectedIndex = 4;
    this.attach_money=true;
  }

  getNotificacionesPago(id) {
    this.leerToken();
    this.userService.getNotificacionesPago(id).subscribe(
      (result) => {
        if (Object.keys(result).length > 0){
          console.log(Object.keys(result).length)

          this.notificacionPago = true;
          this.datosNotificacionPago = false;
          this.attach_money = true
          this.touch_app = true
          this.stepper.selectedIndex = 4;
        }
      }
    )
  }

  getKYCResp(id) {
    this.userService.getRespKYC(id).subscribe(
      (result) => {
        console.log(result["kyc"]);
        if (result["kyc"] == null)
          console.log("sin validación")
        else {
          console.log("validado KYC")
          this.stepper.selectedIndex = 2;
          this.stepPerson = true
          this.library_books = true
          if (result["kyc"] == "ACCEPT") {
            this.valKYC =false
          }
        }
          
      },
      (err) => {
        console.log(err);
      }
    );
  }

  goBack() {
    console.log("go back");
    this.selectedIndex = 0;
  }

  cambiarContrasena() {
    if (this.newPassword === this.repitPassword) {
      this.authService
        .changePassword(this.idUsuario, this.oldPassword, this.newPassword)
        .subscribe(
          (data) => {
            Swal.fire("Tu contraseña se actualizó con éxito", "", "success");
            this.idUsuario = "";
            this.oldPassword = "";
            this.newPassword = "";
            this.repitPassword = "";
          },
          (err) => {
            console.log(err);
          }
        );
    } else {
      Swal.fire(
        "Tu confirmación de contraseña no coincide con la contraseña nueva.",
        "",
        "error"
      );
    }
  }

  guardarWallet() {
    this.userService.setWallet(this.WALLET, this.idUsuario).subscribe(
      (data) => {},
      (error) => {}
    );
  }

  passport(ID) {
    this.documentType = ID;
    this.isIne = true;
    console.log(this.documentType);
    this.ocultarReverso = true;
    if (this.documentType === 1) {
      this.docType = "ID";
      this.ocultarReverso = true;
    }
    if (this.documentType === 2) {
      this.docType = "PP"
      this.ocultarReverso = false;
    }
    if (this.documentType === 3) {
      this.docType = "DL"
      this.ocultarReverso = true;
    }
    console.log(this.documentType + " " + this.ocultarReverso + " " + this.docType);
  }

  getAvatar(type, number) {
    let myimage;
    switch (number) {
      case 1:
        myimage = this.avatar;
        break;
      case 2:
        myimage = this.reverso;
        break;
      case 3:
        myimage = this.anverso;
        break;
      case 4:
        myimage = this.domicilio;
        break;
    }
    console.log(myimage + " " + type + " " + number);
    this.userService.getAvatar(myimage, type).subscribe(
      (data) => {
        this.createImageFromBlob(data, number);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  createImageFromBlob(image: Blob, number) {
    let reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        switch (number) {
          case 1:
            this.image = reader.result;
            break;
          case 2:
            this.reverso = reader.result;
            break;
          case 3:
            this.anverso = reader.result;
            break;
          case 4:
            this.domicilio = reader.result;
            break;
        }
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  getBase64(file: File): Observable<string> {
   const sub = new Subject<string>();
   var reader = new FileReader();

   reader.onload = () => {
      const content: string = reader.result as string;
      sub.next(content);
      sub.complete();
   };

   reader.readAsDataURL(file);
   return sub.asObservable();
  } 
  
  handleImageAnverso(files: FileList) {
    console.log("id generico" + this.idUsuario);
    this.formData.delete("archivo");
    this.formData.append("archivo", files[0]);
    //this.getBase64(files[0]);

    this.getBase64(files[0]).subscribe(
      (response: any)   => this.scanData = response ,
      error => console.log(error), 
    )

    console.log(this.scanData);
    this.userService
      .subirImagen(this.formData, "documento")
      .subscribe((data) => {
        this.userService
          .setImagenToSuscriber(this.idUsuario, files[0].name, 2)
          .subscribe((data) => {}),
          (err) => {
            console.log(err);
          };
      }),
      (err) => {
        console.log(err);
      };
  }

  handleImageReverso(files: FileList) {
    this.handleFileSelect(files)
    this.formData.delete("archivo");
    this.formData.append("archivo", files[0]);
    
    this.getBase64(files[0]).subscribe(
      (response: any)   => this.backsideImageData = response ,
      error => console.log(error), 
    )
    this.userService
      .subirImagen(this.formData, "documento")
      .subscribe((data) => {
        this.userService
          .setImagenToSuscriber(this.idUsuario, files[0].name, 3)
          .subscribe((data) => {}),
          (err) => {
            console.log(err);
          };
      }),
      (err) => {
        console.log(err);
      };
  }

  handleImageCompDom(files: FileList) {
    console.log(files[0].name);
    this.formData.delete("archivo");
    this.formData.append("archivo", files[0]);
    this.userService
      .subirImagen(this.formData, "documento")
      .subscribe((data) => {
        this.userService
          .setImagenToSuscriber(this.idUsuario, files[0].name, 4)
          .subscribe((data) => {}),
          (err) => {
            console.log(err);
          };
      }),
      (err) => {
        console.log(err);
      };
  }

  handleFileSelect(evt){
    var file = evt[0];
    if ( file) {
        var reader = new FileReader();

        reader.onload =this._handleReaderLoaded.bind(this);

        reader.readAsBinaryString(file);
    }
  }

  _handleReaderLoaded(readerEvt) {
     var binaryString = readerEvt.target.result;
            this.base64textString= btoa(binaryString);
  }

  getIP() {
    this.userService.getIP_Client().subscribe(
      (data) => {
        //console.log("mi IP es: " + data["ip"]);
      },
      (err) => {
        //this.showNotification('top','left');
        console.log(err);
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

  onCountrySelection(event) {
    if (event.isUserInput) {
      //console.log(event.source.value); //
      this.getCities(event.source.value);
    }
  }

  getCities(countryCode) {
    this.userService.getCities(countryCode).subscribe(
      (data) => {
        this.arrayCiudades = data;
      },
      (err) => {
        //this.showNotification('top','left');
        console.log(err);
      }
    );
  }

  getUserData(email) {
    this.userService.getUser(email).subscribe(
      (res) => {
        console.log(res);
        this.telephone = res["TELEPHONE"];
        this.nombre = res["NAME"];
        this.paterno = res["LASTNAME"];
        this.materno = res["SLASTNAME"];
        this.direccion = res["STREET"];
        this.Pais = res["COUNTRY"];
        this.cp = res["PC"];
        this.RFC = res["RFC"];
        this.reference = res["REFERENCE"];
        this.WALLET = res["WALLET"];
        this.Facebook = res["FACEBOOK"];
        this.Twitter = res["TWITTER"];
        this.Instagram = res["INSTAGRAM"];
        this.Youtube = res["YOUTUBE"];
        this.Linkedin = res["LIKEDIN"];
        this.idGenerico = res["idGenerico"];
        this.COUNTRY_CODE = res["COUNTRY_CODE"];
        this.NUMBER_INT = res["NUMBER_INT"];
        this.NUMBER = res["NUMBER"];
        this.COLONIA = res["COLONIA"];
        this.CITY = res["CITY"];
        this.STATE = res["STATE"];
        this.avatar = res["avatar"];
        this.reverso = res["identificacionReverso"];
        this.anverso = res["identificacionAnverso"];
        this.domicilio = res["compDomicilio"];
        console.log(res["avatar"]);
        console.log(res["identificacionReverso"]);
        console.log(res["identificacionAnverso"]);
        console.log(res["compDomicilio"]);
        if (res["DATEBORN"] != null) {
          this.fnacimiento = res["DATEBORN"].substring(0, 10);
        }

        this.genero = res["GENDER"];
        this.getAvatar("avatar", 1);
        this.getAvatar("documento", 2);
        this.getAvatar("documento", 3);
        this.getAvatar("documento", 4);
      },
      (err) => {
        //this.showNotification('top','left');
        console.log(err);
      }
    );
  }

  ngAfterViewInit() {
    /*     this.elementRef.nativeElement.ownerDocument.body.style.background =
      " -webkit-gradient(linear, left top, left bottom, from(#f4f4f4 ), to(#f4f4f4)) fixed"; */
    //this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage=" url('../../assets/img/smart_fondo.png')";
  }

  showNotification(title, message, type) {
    //const type = ['','info','success','warning','danger'];

    //const color = Math.floor((Math.random() * 4) + 1);

    $.notify(
      {
        icon: "notifications",
        message:
          "Welcome to <b>Material Dashboard</b> - a beautiful freebie for every web developer.",
      },
      {
        type: type,
        timer: 4000,
        placement: {
          from: "top",
          align: "right",
        },
        template:
          '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">' +
          title +
          "</span> " +
          '<span data-notify="message">' +
          message +
          "</span>" +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          "</div>" +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
          "</div>",
      }
    );
  }

  guardarDoctos() {
    this.showNotification(
      "Actualización de datos",
      "Sus datos se actualizaron exitosamente",
      "info"
    );
  }

  updateProspect(forma: NgForm) {
    this.selectedIndex = 1;
    if (!this.validaFormRegistro()) {
      return;
    }
    this.nombre = forma.value.nombre;
    this.paterno = forma.value.paterno;
    this.email = forma.value.email;
    this.peticion = {
      man: forma.value.nombre + forma.value.paterno + forma.value.materno,
      soc: "facebook",
      tea: forma.value.email,
      bc: forma.value.Ciudad,
      bco: forma.value.Pais,
      bfn: forma.value.nombre,
      bln: forma.value.paterno,
      bs: forma.value.Pais,
      bsn: forma.value.direccion,
    };

 
    console.log(forma.value);
    this.userService.updateUser(forma.value).subscribe(
      (res) => {

      },
      (err) => {
        this.showNotification(
          "Actualización de datos",
          "Error al actualizar, compruebe su conexión a internet",
          "danger"
        );
        console.log(err);
      }
    );
  }

  leerToken() {
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
      var decoded = jwt_decode(this.userToken);
      console.log(decoded)
      this.email = decoded["Email"];
      //this.avatar = decoded["avatar"];
      /*identificacionAnverso,
                identificacionReverso: results[0].identificacionReverso,
                compDomicilio: results[0].compDomicilio,*/
      this.idGenerico = decoded["idGenerico"];
      this.idUsuario = decoded["idGenerico"];
      this.idUser = decoded["id_cliente"];
      console.log("token decoded", decoded);
    } else {
      console.log("No hay token");
      this.userToken = "";
    }

    return this.userToken;
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(error.error);
    return throwError(error.error.err.errors.email.message);
  }

  getHTML() {
    return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"> 
<style>
@font-face {
font-family: 'Roboto'; font-style: normal; font-weight: 400; src: url(https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.ttf) format('truetype');}
</style>        
<style type="text/css">
.ExternalClass{width:100%}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{line-height:150%}a{text-decoration:none}body,td,input,textarea,select{margin:unset;font-family:unset}input,textarea,select{font-size:unset}@media screen and (max-width: 600px){table.row th.col-lg-1,table.row th.col-lg-2,table.row th.col-lg-3,table.row th.col-lg-4,table.row th.col-lg-5,table.row th.col-lg-6,table.row th.col-lg-7,table.row th.col-lg-8,table.row th.col-lg-9,table.row th.col-lg-10,table.row th.col-lg-11,table.row th.col-lg-12{display:block;width:100% !important}.d-mobile{display:block !important}.d-desktop{display:none !important}.w-lg-25{width:auto !important}.w-lg-25>tbody>tr>td{width:auto !important}.w-lg-50{width:auto !important}.w-lg-50>tbody>tr>td{width:auto !important}.w-lg-75{width:auto !important}.w-lg-75>tbody>tr>td{width:auto !important}.w-lg-100{width:auto !important}.w-lg-100>tbody>tr>td{width:auto !important}.w-lg-auto{width:auto !important}.w-lg-auto>tbody>tr>td{width:auto !important}.w-25{width:25% !important}.w-25>tbody>tr>td{width:25% !important}.w-50{width:50% !important}.w-50>tbody>tr>td{width:50% !important}.w-75{width:75% !important}.w-75>tbody>tr>td{width:75% !important}.w-100{width:100% !important}.w-100>tbody>tr>td{width:100% !important}.w-auto{width:auto !important}.w-auto>tbody>tr>td{width:auto !important}.p-lg-0>tbody>tr>td{padding:0 !important}.pt-lg-0>tbody>tr>td,.py-lg-0>tbody>tr>td{padding-top:0 !important}.pr-lg-0>tbody>tr>td,.px-lg-0>tbody>tr>td{padding-right:0 !important}.pb-lg-0>tbody>tr>td,.py-lg-0>tbody>tr>td{padding-bottom:0 !important}.pl-lg-0>tbody>tr>td,.px-lg-0>tbody>tr>td{padding-left:0 !important}.p-lg-1>tbody>tr>td{padding:0 !important}.pt-lg-1>tbody>tr>td,.py-lg-1>tbody>tr>td{padding-top:0 !important}.pr-lg-1>tbody>tr>td,.px-lg-1>tbody>tr>td{padding-right:0 !important}.pb-lg-1>tbody>tr>td,.py-lg-1>tbody>tr>td{padding-bottom:0 !important}.pl-lg-1>tbody>tr>td,.px-lg-1>tbody>tr>td{padding-left:0 !important}.p-lg-2>tbody>tr>td{padding:0 !important}.pt-lg-2>tbody>tr>td,.py-lg-2>tbody>tr>td{padding-top:0 !important}.pr-lg-2>tbody>tr>td,.px-lg-2>tbody>tr>td{padding-right:0 !important}.pb-lg-2>tbody>tr>td,.py-lg-2>tbody>tr>td{padding-bottom:0 !important}.pl-lg-2>tbody>tr>td,.px-lg-2>tbody>tr>td{padding-left:0 !important}.p-lg-3>tbody>tr>td{padding:0 !important}.pt-lg-3>tbody>tr>td,.py-lg-3>tbody>tr>td{padding-top:0 !important}.pr-lg-3>tbody>tr>td,.px-lg-3>tbody>tr>td{padding-right:0 !important}.pb-lg-3>tbody>tr>td,.py-lg-3>tbody>tr>td{padding-bottom:0 !important}.pl-lg-3>tbody>tr>td,.px-lg-3>tbody>tr>td{padding-left:0 !important}.p-lg-4>tbody>tr>td{padding:0 !important}.pt-lg-4>tbody>tr>td,.py-lg-4>tbody>tr>td{padding-top:0 !important}.pr-lg-4>tbody>tr>td,.px-lg-4>tbody>tr>td{padding-right:0 !important}.pb-lg-4>tbody>tr>td,.py-lg-4>tbody>tr>td{padding-bottom:0 !important}.pl-lg-4>tbody>tr>td,.px-lg-4>tbody>tr>td{padding-left:0 !important}.p-lg-5>tbody>tr>td{padding:0 !important}.pt-lg-5>tbody>tr>td,.py-lg-5>tbody>tr>td{padding-top:0 !important}.pr-lg-5>tbody>tr>td,.px-lg-5>tbody>tr>td{padding-right:0 !important}.pb-lg-5>tbody>tr>td,.py-lg-5>tbody>tr>td{padding-bottom:0 !important}.pl-lg-5>tbody>tr>td,.px-lg-5>tbody>tr>td{padding-left:0 !important}.p-0>tbody>tr>td{padding:0 !important}.pt-0>tbody>tr>td,.py-0>tbody>tr>td{padding-top:0 !important}.pr-0>tbody>tr>td,.px-0>tbody>tr>td{padding-right:0 !important}.pb-0>tbody>tr>td,.py-0>tbody>tr>td{padding-bottom:0 !important}.pl-0>tbody>tr>td,.px-0>tbody>tr>td{padding-left:0 !important}.p-1>tbody>tr>td{padding:4px !important}.pt-1>tbody>tr>td,.py-1>tbody>tr>td{padding-top:4px !important}.pr-1>tbody>tr>td,.px-1>tbody>tr>td{padding-right:4px !important}.pb-1>tbody>tr>td,.py-1>tbody>tr>td{padding-bottom:4px !important}.pl-1>tbody>tr>td,.px-1>tbody>tr>td{padding-left:4px !important}.p-2>tbody>tr>td{padding:8px !important}.pt-2>tbody>tr>td,.py-2>tbody>tr>td{padding-top:8px !important}.pr-2>tbody>tr>td,.px-2>tbody>tr>td{padding-right:8px !important}.pb-2>tbody>tr>td,.py-2>tbody>tr>td{padding-bottom:8px !important}.pl-2>tbody>tr>td,.px-2>tbody>tr>td{padding-left:8px !important}.p-3>tbody>tr>td{padding:16px !important}.pt-3>tbody>tr>td,.py-3>tbody>tr>td{padding-top:16px !important}.pr-3>tbody>tr>td,.px-3>tbody>tr>td{padding-right:16px !important}.pb-3>tbody>tr>td,.py-3>tbody>tr>td{padding-bottom:16px !important}.pl-3>tbody>tr>td,.px-3>tbody>tr>td{padding-left:16px !important}.p-4>tbody>tr>td{padding:24px !important}.pt-4>tbody>tr>td,.py-4>tbody>tr>td{padding-top:24px !important}.pr-4>tbody>tr>td,.px-4>tbody>tr>td{padding-right:24px !important}.pb-4>tbody>tr>td,.py-4>tbody>tr>td{padding-bottom:24px !important}.pl-4>tbody>tr>td,.px-4>tbody>tr>td{padding-left:24px !important}.p-5>tbody>tr>td{padding:48px !important}.pt-5>tbody>tr>td,.py-5>tbody>tr>td{padding-top:48px !important}.pr-5>tbody>tr>td,.px-5>tbody>tr>td{padding-right:48px !important}.pb-5>tbody>tr>td,.py-5>tbody>tr>td{padding-bottom:48px !important}.pl-5>tbody>tr>td,.px-5>tbody>tr>td{padding-left:48px !important}.s-lg-1>tbody>tr>td,.s-lg-2>tbody>tr>td,.s-lg-3>tbody>tr>td,.s-lg-4>tbody>tr>td,.s-lg-5>tbody>tr>td{font-size:0 !important;line-height:0 !important;height:0 !important}.s-0>tbody>tr>td{font-size:0 !important;line-height:0 !important;height:0 !important}.s-1>tbody>tr>td{font-size:4px !important;line-height:4px !important;height:4px !important}.s-2>tbody>tr>td{font-size:8px !important;line-height:8px !important;height:8px !important}.s-3>tbody>tr>td{font-size:16px !important;line-height:16px !important;height:16px !important}.s-4>tbody>tr>td{font-size:24px !important;line-height:24px !important;height:24px !important}.s-5>tbody>tr>td{font-size:48px !important;line-height:48px !important;height:48px !important}}@media yahoo{.d-mobile{display:none !important}.d-desktop{display:block !important}.w-lg-25{width:25% !important}.w-lg-25>tbody>tr>td{width:25% !important}.w-lg-50{width:50% !important}.w-lg-50>tbody>tr>td{width:50% !important}.w-lg-75{width:75% !important}.w-lg-75>tbody>tr>td{width:75% !important}.w-lg-100{width:100% !important}.w-lg-100>tbody>tr>td{width:100% !important}.w-lg-auto{width:auto !important}.w-lg-auto>tbody>tr>td{width:auto !important}.p-lg-0>tbody>tr>td{padding:0 !important}.pt-lg-0>tbody>tr>td,.py-lg-0>tbody>tr>td{padding-top:0 !important}.pr-lg-0>tbody>tr>td,.px-lg-0>tbody>tr>td{padding-right:0 !important}.pb-lg-0>tbody>tr>td,.py-lg-0>tbody>tr>td{padding-bottom:0 !important}.pl-lg-0>tbody>tr>td,.px-lg-0>tbody>tr>td{padding-left:0 !important}.p-lg-1>tbody>tr>td{padding:4px !important}.pt-lg-1>tbody>tr>td,.py-lg-1>tbody>tr>td{padding-top:4px !important}.pr-lg-1>tbody>tr>td,.px-lg-1>tbody>tr>td{padding-right:4px !important}.pb-lg-1>tbody>tr>td,.py-lg-1>tbody>tr>td{padding-bottom:4px !important}.pl-lg-1>tbody>tr>td,.px-lg-1>tbody>tr>td{padding-left:4px !important}.p-lg-2>tbody>tr>td{padding:8px !important}.pt-lg-2>tbody>tr>td,.py-lg-2>tbody>tr>td{padding-top:8px !important}.pr-lg-2>tbody>tr>td,.px-lg-2>tbody>tr>td{padding-right:8px !important}.pb-lg-2>tbody>tr>td,.py-lg-2>tbody>tr>td{padding-bottom:8px !important}.pl-lg-2>tbody>tr>td,.px-lg-2>tbody>tr>td{padding-left:8px !important}.p-lg-3>tbody>tr>td{padding:16px !important}.pt-lg-3>tbody>tr>td,.py-lg-3>tbody>tr>td{padding-top:16px !important}.pr-lg-3>tbody>tr>td,.px-lg-3>tbody>tr>td{padding-right:16px !important}.pb-lg-3>tbody>tr>td,.py-lg-3>tbody>tr>td{padding-bottom:16px !important}.pl-lg-3>tbody>tr>td,.px-lg-3>tbody>tr>td{padding-left:16px !important}.p-lg-4>tbody>tr>td{padding:24px !important}.pt-lg-4>tbody>tr>td,.py-lg-4>tbody>tr>td{padding-top:24px !important}.pr-lg-4>tbody>tr>td,.px-lg-4>tbody>tr>td{padding-right:24px !important}.pb-lg-4>tbody>tr>td,.py-lg-4>tbody>tr>td{padding-bottom:24px !important}.pl-lg-4>tbody>tr>td,.px-lg-4>tbody>tr>td{padding-left:24px !important}.p-lg-5>tbody>tr>td{padding:48px !important}.pt-lg-5>tbody>tr>td,.py-lg-5>tbody>tr>td{padding-top:48px !important}.pr-lg-5>tbody>tr>td,.px-lg-5>tbody>tr>td{padding-right:48px !important}.pb-lg-5>tbody>tr>td,.py-lg-5>tbody>tr>td{padding-bottom:48px !important}.pl-lg-5>tbody>tr>td,.px-lg-5>tbody>tr>td{padding-left:48px !important}.s-lg-0>tbody>tr>td{font-size:0 !important;line-height:0 !important;height:0 !important}.s-lg-1>tbody>tr>td{font-size:4px !important;line-height:4px !important;height:4px !important}.s-lg-2>tbody>tr>td{font-size:8px !important;line-height:8px !important;height:8px !important}.s-lg-3>tbody>tr>td{font-size:16px !important;line-height:16px !important;height:16px !important}.s-lg-4>tbody>tr>td{font-size:24px !important;line-height:24px !important;height:24px !important}.s-lg-5>tbody>tr>td{font-size:48px !important;line-height:48px !important;height:48px !important}}
</style>
</head>
<body style="text-align: center; text-align: -webkit-center;">
<table bgcolor="#ffffff" style="max-width: 600px; height: 100%; margin-left: auto; margin-right: auto;">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 15px; line-height: 20px; color: #000000; text-align: center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td valign="top" style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0;" align="left">
<img class="img-fluid" style="display: block; height: auto; line-height: 100%; outline: none; text-decoration: none; width: 100%; max-width: 100%; border: 0 none;" src="https://raw.githubusercontent.com/SaulDuenas/Emails_Smart/main/img/header_bitcoin.png">
<table class="container-fluid pt-4" border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; width: 100%;">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 15px; line-height: 20px; color: #000000; text-align: center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 24px 16px 0;" align="left">
<table style="width: 100% padding-left: 15px padding-right: 15px; font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; font-style: normal; font-weight: normal; font-size: 17px; line-height: 20px; color: #000000; height: auto; margin-left: auto; margin-right: auto;" class="clear-table" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 15px; line-height: 20px; color: #000000; text-align: center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td style="padding-bottom: 25px; border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0;" align="left">  
<h4 style="margin-top: 0; margin-bottom: 0; font-weight: 900; vertical-align: baseline; font-size: 25px; line-height: 29px; font-family: 'Roboto','Arial'; color: #164194; text-shadow: 0 0 10px #FFF;" align="center">
Hola, ${this.nombre} ${this.paterno}: </h4> 
</td>
</tr>
<tr>
<td class="text-center" style="padding-bottom: 25px; border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0;" align="center"> 
Hemos recibido la notificación del pago de tu membresía ${this.nombremembresia}.
</td>
</tr>
<tr>
<td class="text-center" style="padding-bottom: 25px; border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px;" align="center"> 
<span class="highlighted-text" style="color: #0093D6; font-weight: bold;">
Tu pago se verá reflejado en un lapso de 48 a 72 horas hábiles y te confirmaremos por correo electrónico la activación de tu Cuenta Smart.</span>   
</td>
</tr>
<tr>
<td class="text-center" style="padding-bottom: 25px; border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0;" align="center">  
</td>
</tr>
</tbody>
</table>
<table class="clear-table" style="margin-top: 0px; font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; font-style: normal; font-weight: normal; font-size: 17px; line-height: 20px; color: #000000; width: auto; height: auto; margin-left: auto; margin-right: auto;" border="0" cellspacing="0" cellpadding="0">
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
</body>
</html>`
}
}
