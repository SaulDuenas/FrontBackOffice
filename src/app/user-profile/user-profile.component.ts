import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  ElementRef,
} from "@angular/core";
import * as jwt_decode from "jwt-decode";
import { NgForm } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { UsuarioService } from "../services/usuario/usuario.service";
import { UploadService } from "../services/upload/upload.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatePipe, formatDate } from "@angular/common";
import { Observable } from "rxjs";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ValidadoresService } from "../services/Validadores/validadores.service";
import { AuthService } from "../services/login/login.service";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import * as Bowser from "bowser";
import { ImageElementContainer } from "html2canvas/dist/types/dom/replaced-elements/image-element-container";
import Swal from "sweetalert2";
import { MatRadioChange } from "@angular/material/radio";

import { Pipe, PipeTransform } from "@angular/core";

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
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None,
})
export class UserProfileComponent implements OnInit {
  userToken: string;

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
  regBen: boolean = false;
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
  arrayBeneficiaries;
  admingralCta;
  forma: FormGroup;
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
    private fb: FormBuilder,
    private httpClient: HttpClient,
    public datepipe: DatePipe,
    private userService: UsuarioService,
    private elementRef: ElementRef,
    private validadores: ValidadoresService,
    private authService: AuthService
  ) {
    this.documentType = 1;
    this.isIne = true;
    this.selectedIndex = 0;
    this.getIP();
    let name = "Angular";
    let userAgent = Bowser.parse(window.navigator.userAgent);
    let browser = Bowser.getParser(window.navigator.userAgent);
    let userAgentDetails = JSON.stringify(userAgent, null, 4);
    let browserDetails = JSON.stringify(browser.getBrowser(), null, 4);
    this.crearFormulario();
  }

  radioChange($event: MatRadioChange, nombre, apellido) {
    console.log($event.source.name, $event.value);
    this.genAdmin($event.value, nombre, apellido);
  }

  showEdit = false;

  cancelupdate() {
    this.showEdit = false;
    this.crearFormulario();
  }
  editarBeneficiario(id, montoEditar) {
    this.Active = "Active";
    this.leerToken();
    this.idBeneficiarioSeleccionado = id;
    this.montoEditar = montoEditar;
    this.showEdit = true;
    console.log(id);
    this.userService.getBeneficiary(id).subscribe(
      (result) => {
        console.log(result[0]);

        this.forma = this.fb.group({
          idGenerico: [this.idGenerico],
          nombre: [
            result[0]["nombre"],
            [Validators.required, Validators.minLength(5)],
          ],
          apellido: [
            result[0]["apaterno"],
            [Validators.required, this.validadores.noHerrera],
          ],
          apellido2: [result[0]["amaterno"], [this.validadores.noHerrera]],
          correo: [
            result[0]["email"],
            [
              Validators.required,
              Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$"),
            ],
          ],
          usuario: ["", , this.validadores.existeUsuario],
          fecnac: [
            formatDate(result[0]["fechaNac"], "yyyy-MM-dd", "en"),
            [Validators.required],
          ],
          telCasa: [result[0]["telCasa"]],
          telMovil: [result[0]["telMovil"], Validators.required],
          porcentaje: [result[0]["porcentaje"], Validators.required],
        });
      },
      (err) => {
        console.log(err);
      }
    );

    /*     console.log(id);
    console.log(this.forma.controls);
 */
  }

  delete(id, nombre, apellido) {
    Swal.fire({
      title: "Eliminar Beneficiario",
      text:
        "¿Estás seguro de eliminar a " +
        nombre +
        " " +
        apellido +
        " de tu lista de Beneficiarios?",
      icon: "question",
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteBeneficiary(id).subscribe(
          (result) => {
            this.leerToken();
            //Swal.fire("¡Listo!", "El Beneficiario fue eliminado.", "success");
            this.getBeneficiaries();
            this.getTotalAmountForBeneficiaries(this.idUsuario);
          },
          (err) => {
            console.log(err);
          }
        );
      }
    });
  }

  genAdmin(id, nombre, apellido) {
    Swal.fire({
      title: "Administrador Universal de la Comunidad",
      text:
        "¿Quieres designar a " +
        nombre +
        " " +
        apellido +
        " como el Administrador Universal de la Comunidad?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        this.setManager(id, this.idUsuario);
        Swal.fire(
          "¡Listo!",
          "A partir de ahora el Beneficiario es Administrador Universal de la Comunidad.",
          "success"
        );
      }
    });
  }

  validaTotalAsignado() {
    this.userService.getTotalPercent(this.idUsuario).subscribe((data) => {
      console.log(data["porcTotal"]);
      if (parseInt(data["porcTotal"]) < 100) {
        Swal.fire(
          "Completa tus Beneficiarios",
          "Antes de continuar, asigna el 100% a tus beneficiarios",
          "info"
        );
        this.selectedIndex = 2;
      }
    });
  }

  getTotalAmountForBeneficiaries(id) {
    this.userService.getTotalAmountForBeneficiaries(id).subscribe(
      (result) => {
        console.log("Asignado " + result["asignado"]);
        console.log("Por Asignar " + result["porAsignar"]);
        this.totalAsignado = result["asignado"];
        this.porAsignar = result["porAsignar"];
      },
      (err) => {
        console.log(err);
      }
    );
  }

  validaBeneficiarios($event) {
    let clickedIndex = $event.index;
    this.selectedIndex = $event.index;
    if (clickedIndex === 3 || clickedIndex === 1) {
      this.validaTotalAsignado();
    }
    console.log(clickedIndex);
  }
  nextOne() {
    this.userService.getTotalPercent(this.idUsuario).subscribe((data) => {
      console.log(data["porcTotal"]);
      if (parseInt(data["porcTotal"]) < 100) {
        Swal.fire(
          "Completa tus Beneficiarios",
          "Antes de continuar, asigna el 100% a tus beneficiarios",
          "info"
        );
        this.selectedIndex = 2;
      } else {
        this.selectedIndex = 1;
      }
    });
  }
  nextTwo() {
    this.selectedIndex = 2;
    this.guardarDoctos();
  }
  nextTree() {
    this.userService.getTotalPercent(this.idUsuario).subscribe((data) => {
      if (parseInt(data["porcTotal"]) < 100) {
        Swal.fire(
          "Completa tus Beneficiarios",
          "Antes de continuar, asigna el 100% a tus beneficiarios",
          "info"
        );
        this.selectedIndex = 2;
      } else {
        this.selectedIndex = 3;
      }
    });
  }
  nextFour() {
    this.selectedIndex = 4;
    this.guardarWallet();
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
      this.ocultarReverso = true;
    }
    if (this.documentType === 2) {
      this.ocultarReverso = false;
    }
    if (this.documentType === 3) {
      this.ocultarReverso = true;
    }
    console.log(this.documentType + " " + this.ocultarReverso);
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

  onSubmit() {}

  handleImageAnverso(files: FileList) {
    console.log("id generico" + this.idUsuario);
    this.formData.delete("archivo");
    this.formData.append("archivo", files[0]);
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

  handleImageReverso(files: FileList) {
    console.log(files[0].name);
    this.formData.delete("archivo");
    this.formData.append("archivo", files[0]);
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

  crearFormulario() {
    this.leerToken();
    this.getTotalAmountForBeneficiaries(this.idGenerico);
    let myDate = formatDate(new Date(), "yyyy/MM/dd", "en");
    this.forma = this.fb.group({
      idGenerico: [this.idGenerico],
      nombre: ["", [Validators.required]],
      apellido: ["", [Validators.required, this.validadores.noHerrera]],
      apellido2: ["", [this.validadores.noHerrera]],
      correo: [
        "",
        [
          Validators.required,
          Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$"),
        ],
      ],
      usuario: ["", , this.validadores.existeUsuario],
      fecnac: [myDate, Validators.required],
      telCasa: [""],
      telMovil: ["", Validators.required],
      porcentaje: [0, Validators.required],
    });
  }

  ngOnInit() {
    this.leerToken();
    this.getCountries();
    this.getUserData(this.email);
    this.getTotalAmountForBeneficiaries(this.idGenerico);
    // this.getSponsor();
    this.forma.reset({
      porcentaje: 0,
      idGenerico: this.idGenerico,
    });

    this.userService.getTotalPercent(this.idGenerico).subscribe((data) => {
      if (parseInt(data["porcTotal"]) == 100) {
        this.hideNewBeneficiary = false;
      }
    }),
      (err) => {
        console.log(err);
      };
    this.getBeneficiaries();
  }

  getBeneficiaries() {
    this.leerToken();
    this.arrayBeneficiaries = null;
    this.userService
      .getBeneficiaries(this.idGenerico)
      .subscribe((dataBeneficiaries) => {
        let status = dataBeneficiaries["status"];
        if (status == "ok") {
          console.log(dataBeneficiaries);
          this.arrayBeneficiaries = dataBeneficiaries["data"];
          this.regBen = true;
        }
        if (status == "notFoud") {
          this.regBen = false;
        }
      }),
      (err) => {
        console.log(err);
      };
  }

  get pasatiempos() {
    return this.forma.get("pasatiempos") as FormArray;
  }

  get telFijoNoValido() {
    return (
      this.forma.get("telCasa").invalid && this.forma.get("telCasa").touched
    );
  }

  get telMovilNoValido() {
    return (
      this.forma.get("telMovil").invalid && this.forma.get("telMovil").touched
    );
  }
  get nombreNoValido() {
    return this.forma.get("nombre").invalid && this.forma.get("nombre").touched;
  }

  get apellidoNoValido() {
    return (
      this.forma.get("apellido").invalid && this.forma.get("apellido").touched
    );
  }

  get fecNacNoValido() {
    return this.forma.get("fecnac").invalid && this.forma.get("fecnac").touched;
  }

  get correoNoValido() {
    return this.forma.get("correo").invalid && this.forma.get("correo").touched;
  }

  get usuarioNoValido() {
    return (
      this.forma.get("usuario").invalid && this.forma.get("usuario").touched
    );
  }

  get distritoNoValido() {
    return (
      this.forma.get("direccion.distrito").invalid &&
      this.forma.get("direccion.distrito").touched
    );
  }

  get ciudadNoValido() {
    return (
      this.forma.get("direccion.ciudad").invalid &&
      this.forma.get("direccion.ciudad").touched
    );
  }

  get pass1NoValido() {
    return this.forma.get("pass1").invalid && this.forma.get("pass1").touched;
  }

  get telPorcentajeNoValido() {
    const porcentaje = this.forma.get("porcentaje").value;
    if (porcentaje > 100) {
      return true;
    }
    if (porcentaje <= 0) {
      return true;
    }
    return false;
  }

  get pass2NoValido() {
    const pass1 = this.forma.get("pass1").value;
    const pass2 = this.forma.get("pass2").value;

    return pass1 === pass2 ? false : true;
  }

  crearListeners() {
    /*     this.forma.valueChanges.subscribe((valor) => {
      console.log(valor);
    });
    this.forma.statusChanges.subscribe((status) => console.log({ status })); */
    //this.forma.get("nombre").valueChanges.subscribe(console.log);
  }

  accion() {
    this.guardar(this.showEdit);
  }

  callSaveUpdateSerivice(isUpdate) {
    this.userService
      .createBeneficiary(
        this.forma.value,
        // isUpdate,
        // this.idBeneficiarioSeleccionado
      )
      .subscribe((data) => {
        this.showNotification(
          "Porcentaje por beneficiario",
          "El beneficiario se asignó con éxito",
          "success"
        );
        this.userService
          .getBeneficiaries(this.idGenerico)
          .subscribe((dataBeneficiaries) => {
            console.log(dataBeneficiaries);
            this.arrayBeneficiaries = dataBeneficiaries["data"];

            this.regBen = true;
          }),
          (err) => {
            console.log(err);
          };
      }),
      (err) => {
        console.log(err);
      };

    this.getTotalAmountForBeneficiaries(this.idUsuario);
    this.forma.reset({
      porcentaje: 0,
      idGenerico: this.idGenerico,
    });
  }

  guardar(isUpdate) {
    if (this.forma.invalid) {
      return Object.values(this.forma.controls).forEach((control) => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach((control) =>
            control.markAsTouched()
          );
        } else {
          control.markAsTouched();
        }
      });
    }

    console.log(this.idUsuario);
    this.leerToken();
    this.userService.getTotalPercent(this.idUsuario).subscribe((data) => {
      if (parseInt(data["porcTotal"]) == 100) {
        this.hideNewBeneficiary = false;
        this.userService
          .updateBeneficiaryComplete(this.idUsuario)
          .subscribe((data) => {});
      }

      if (isUpdate) {
        if (
          parseInt(data["porcTotal"]) -
            this.montoEditar +
            parseInt(this.forma.get("porcentaje").value) >
          100
        ) {
          this.showNotification(
            "Porcentaje por beneficiario",
            "Lo sentimos, solo puede asignar un máximo de 100%",
            "danger"
          );
        } else {
          this.callSaveUpdateSerivice(isUpdate);
          this.showEdit = false;
        }
      } else {
        if (
          parseInt(data["porcTotal"]) +
            parseInt(this.forma.get("porcentaje").value) >
          100
        ) {
          console.log(
            parseInt(data["porcTotal"]) +
              parseInt(this.forma.get("porcentaje").value)
          );
          this.showNotification(
            "Porcentaje por beneficiario",
            "Lo sentimos, solo puede asignar un máximo de 100%",
            "danger"
          );
        } else {
          this.callSaveUpdateSerivice(isUpdate);
          this.showEdit = false;
        }
      }
    }),
      (err) => {
        console.log(err);
      };
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

  /*   getSponsor() {
    this.userService.getSponsor().subscribe(
      (data) => {
        this.arraySponsor = data;
        //console.log(data);
      },
      (err) => {
        //this.showNotification('top','left');
        console.log(err);
      }
    );
  } */

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
    //console.log(forma);
    /*     return this.httpClient
      .post("http://localhost:3000/api/users/avatar", this.formData)
      .subscribe(
        (response) => {
          alert("File Uploaded Successfully");
        },
        (error) => {
          alert("Something Went Wrong !!!");
        }
      ); */
    let peticion = {
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

    this.userService.validateWithIdentityMind(peticion).subscribe(
      (res) => {
        //console.log(res);
        if (res == "ACCEPT") {
          this.showNotification(
            "Verificación de identidad",
            "La validación de su identidad fue un éxito",
            "success"
          );
        } else
          this.showNotification(
            "Verificación de identidad",
            "Sus datos se acualizarón con éxito, en breve, uno de nuestros asesores se pondrá en contacto con usted",
            "info"
          );
      },
      (err) => {
        console.log(err);
        this.showNotification(
          "Actualización de datos",
          "Sus datos se actualizaron exitosamente",
          "success"
        );
      }
    );

    //console.log(forma.value);
    this.userService.updateUser(forma.value).subscribe(
      (res) => {
        this.showNotification(
          "Actualización de datos",
          "Sus datos se actualizaron exitosamente",
          "info"
        );
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

  setManager(idBeneficiario, IdSusciber) {
    console.log("detManaget");
    let data = {
      id: idBeneficiario,
      idSuscriptor: IdSusciber,
    };
    this.userService.addManager(data).subscribe(
      (data) => {
        this.userService
          .getBeneficiaries(IdSusciber)
          .subscribe((dataBeneficiaries) => {
            let status = dataBeneficiaries["status"];
            if (status == "ok") {
              console.log(dataBeneficiaries);
              this.arrayBeneficiaries = dataBeneficiaries["data"];
            }
            if (status == "notFoud") {
              this.regBen = false;
            }
          }),
          (err) => {
            console.log(err);
          };
      },
      (err) => {
        console.log(err);
      }
    );
  }

  leerToken() {
    //console.log("leyebdo token");
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
      var decoded = jwt_decode(this.userToken);
      this.email = decoded["Email"];
      //this.avatar = decoded["avatar"];
      /*identificacionAnverso,
                identificacionReverso: results[0].identificacionReverso,
                compDomicilio: results[0].compDomicilio,*/
      this.idGenerico = decoded["idGenerico"];
      this.idUsuario = decoded["idGenerico"];
      console.log("id - Generico " + this.idGenerico);
    } else {
      console.log("No hay token");
      this.userToken = "";
    }

    return this.userToken;
  }
}
