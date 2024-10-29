import { Component, OnInit } from "@angular/core";
import { DatePipe, formatDate } from "@angular/common";
import { UsuarioService } from "../services/usuario/usuario.service";
import { TranslateEngineService } from "../services/translate/translate-engine.service";
import Swal from "sweetalert2";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NgForm } from "@angular/forms";
import * as jwt_decode from "jwt-decode";
import { AuthService } from "../services/login/login.service";


@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
  // providers: [DatePipe],
})

export class ProfileComponent implements OnInit {
  /************Variables********/
  /********* Profile page **************/
  arrayGender = [
    { "id": "Profile.TabProfile.FormPersonal.Gender.Option1","name":"Woman" },
    { "id": "Profile.TabProfile.FormPersonal.Gender.Option2","name":"Man" },
    { "id": "Profile.TabProfile.FormPersonal.Gender.Option3","name":"Other" },
  ];
  idGenerico: number;
  idUser;
  userToken;
  /********  Profile Tab ********************/
  personalDataForm: FormGroup;
  addressForm: FormGroup;
  passwordForm: FormGroup;
  walletForm: FormGroup;
  arrayPaises;
  arrayCiudades;
  formData = new FormData();
  hidePersonalData = true;
  avatar;
  image;
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
  /********  Beneficiaries Tab ********************/
  totalPercentage = 0;
  showDesignatedBenef = true;
  showRegisterBenef = false;
  showEditForm = false;
  addBeneficiaryForm: FormGroup;
  editBeneficiaryForm: FormGroup;
  designateAUCForm: FormGroup;
  arrayBeneficiaries;
  email;
  AUC;
  validPercentage = false;
  enableAddButton = true;

  /******************************/
  constructor(
    private userService: UsuarioService,
    private translateservice: TranslateEngineService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    
  }
  
  ngOnInit() {
    this.leerToken();
    /********  Profile Tab ********************/
    this.getCountries();
    let birthDate = formatDate(new Date(), "yyyy/MM/dd", "en");
    this.personalDataForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      surname1: ['', [Validators.required]],
      surname2: '',
      country: '',
      code: '',
      phone: '',
      email: [
        '', 
        [
          Validators.required, 
          Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$")
        ]
      ],
      birthdate: [birthDate, [Validators.required]],
      gender: '',
      rfc: '',
    });
    this.addressForm = this.formBuilder.group({
      city: ['', [Validators.required]],
      street: ['', [Validators.required]],
      ext: '',
      int: '',
      cp: ['', [Validators.required]],
      neighborhood: ['', [Validators.required]],
      state: ['', [Validators.required]],
    });
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
    this.walletForm = this.formBuilder.group({
      wallet: ['', [Validators.required]],
    });
    this.personalDataForm.disable();

    this.getUserData(this.email);
    
    /********  Beneficiaries Tab ********************/
    let myDate = formatDate(new Date(), "yyyy/MM/dd", "en");
    
    this.addBeneficiaryForm = this.formBuilder.group({
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
    this.editBeneficiaryForm = this.formBuilder.group({
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
    this.designateAUCForm = this.formBuilder.group({
      managerId: ['', Validators.required],
    });
    this.getBeneficiaries();
    this.getTotalPercentage();
    this.getAUC();
    console.log("user", this.idUser);
    console.log("Generico", this.idGenerico);
    
  }
  
  /********* Profile page **************/
  leerToken() {
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
      var decoded = jwt_decode(this.userToken);
      this.email = decoded["Email"];
      //this.avatar = decoded["avatar"];
      /*identificacionAnverso,
                identificacionReverso: results[0].identificacionReverso,
                compDomicilio: results[0].compDomicilio,*/
      this.idGenerico = decoded["idGenerico"];
      this.idUser = decoded["id_cliente"];
    } else {
      console.log("No hay token");
      this.userToken = "";
    }

    return this.userToken;
  }
  
  /******** Profile Tab ********************/
  getCountries() {
    this.userService.getCountry().subscribe(
      (data) => {
        this.arrayPaises = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getUserData(email) {
    this.userService.getUser(email).subscribe(
      (res) => {
        var date = new Date(res["DATEBORN"]);
        this.personalDataForm = this.formBuilder.group({
          name: [res["NAME"], [Validators.required]],
          surname1: [res["LASTNAME"], [Validators.required]],
          surname2: res["SLASTNAME"],
          country: res["COUNTRY"],
          code: res["COUNTRY_CODE"],
          phone: res["TELEPHONE"],
          email: [
            email, 
            [
              Validators.required, 
              Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$")
            ]
          ],
          birthdate: [
            formatDate(
              date.setMinutes(date.getMinutes() + date.getTimezoneOffset()),
              "yyyy-MM-dd", 
              "en"
            ), 
            [Validators.required]
          ],
          gender: res["GENDER"],
          rfc: res["RFC"],
        });
        this.addressForm = this.formBuilder.group({
          city: [res["CITY"], [Validators.required]],
          street: [res["STREET"], [Validators.required]],
          ext: res["NUMBER"],
          int: res["NUMBER_INT"],
          cp: [res["PC"], [Validators.required]],
          neighborhood: [res["COLONIA"], [Validators.required]],
          state: [res["STATE"], [Validators.required]],
        });
        this.walletForm = this.formBuilder.group({
          wallet: [res["WALLET"], [Validators.required]],
        });
        this.avatar = res["avatar"];
        this.getAvatar("avatar", 1);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  handleImage(files: FileList) {
    this.formData.delete("archivo");
    this.formData.append("archivo", files[0], this.idGenerico + "_" + files[0].name);
    this.userService.subirImagen(this.formData, "avatar").subscribe((data) => {
      this.userService
        .setImagenToSuscriber(this.idGenerico, this.idGenerico + "_" + files[0].name, 1)
        .subscribe(
          (data) => {
            Swal.fire({
              buttonsStyling: false,
              customClass: {
                confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc'
              },
              title: this.translateservice.getTranslate('Profile.TabProfile.PhotoMsg.Title'),
              text: this.translateservice.getTranslate('Profile.TabProfile.PhotoMsg.SuccessMsg'),
              icon: "success"
              }
            );
          }
        ),
        (err) => {
          Swal.fire({
            buttonsStyling: false,
            customClass: {
              confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc'
            },
            title: this.translateservice.getTranslate('Profile.TabProfile.PhotoMsg.Title'),
            text: this.translateservice.getTranslate('Profile.TabProfile.PhotoMsg.ErrorMsg'),
            icon: "error"
            }
          );
          console.log(err);
        };
    }),
      (err) => {
        console.log(err);
      };
  }

  getAvatar(type, number) {
    let myimage;
    switch (number) {
      case 1:
        myimage = this.avatar;
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
        }
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  setPersonalData(personalData) {
    var date = new Date(personalData["birthdate"]);
    let data = {
      "email": this.email,
      "nombre": personalData["name"]?.trim(), 
      "paterno": personalData["surname1"]?.trim(),
      "materno": personalData["surname2"]?.trim(), 
      "telephone": personalData["phone"]?.trim(), 
      "Pais": personalData["country"]?.trim(),
      "COUNTRY_CODE": personalData["code"]?.trim(), 
      "DATEBORN": formatDate(
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset()),
        "yyyy-MM-dd", 
        "en"
      ) + "T00:00:00.000Z", // API error
      "GENDER": personalData["gender"]?.trim(),
      "RFC": personalData["rfc"]?.trim()
    };

    this.userService.updateUserPersonalData(data).subscribe(
      (res) => {
        Swal.fire({
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc'
          },
          title: "Actualización de datos",
          text: "Sus datos se actualizaron exitosamente",
          icon: "success"
          }
        );
      },
      (err) => {
        Swal.fire({
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc'
          },
          title: "Actualización de datos",
          text: "Error al actualizar, compruebe su conexión a internet",
          icon: "error"
        }          
        );
        console.log(err);
      }
    );
  }

  setAddress(addressData) {
    let data = {
      "email": this.email,
      "CITY": addressData["city"]?.trim(), 
      "direccion": addressData["street"]?.trim(),
      "NUMBER": addressData["ext"]?.trim(), 
      "NUMBER_INT": addressData["int"]?.trim(), 
      "cp": addressData["cp"]?.trim(),
      "COLONIA": addressData["neighborhood"]?.trim(), 
      "STATE": addressData["state"]?.trim()
    };

    this.userService.updateUserAddress(data).subscribe(
      (res) => {
        Swal.fire({

          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc'
          },
          title: this.translateservice.getTranslate('Profile.TabProfile.FormAddress.ResponseMsg.Title'), 
          text: this.translateservice.getTranslate('Profile.TabProfile.FormAddress.ResponseMsg.Success'), 
          icon: "success"

        });
      },
      (err) => {
        Swal.fire({

          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc'
          },
          title: this.translateservice.getTranslate('Profile.TabProfile.FormAddress.ResponseMsg.Title'), 
          text: this.translateservice.getTranslate('Profile.TabProfile.FormAddress.ResponseMsg.Error'), 
          icon: "error"

        });
        console.log(err);
      }
    );
  }
  /* Password alerta */
  setPassword(data) {

    /* Funcion para cambiar contrasñea */
    if (data.newPassword === data.confirmPassword) {
      this.userService.validatePassword(this.email, data.password).subscribe(
        (res) => {
          if (res['success']) {
            this.userService
              .setPassword(this.email, data.newPassword)
              .subscribe(
                (data) => {
                  if (data["success"]) {
                    Swal.fire({
                      buttonsStyling: false,
                      customClass: {
                        confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc'
                      },
                      title: this.translateservice.getTranslate('Profile.TabProfile.FormPassword.ResponseMsg.Title'), 
                      text: this.translateservice.getTranslate('Profile.TabProfile.FormPassword.ResponseMsg.Success'), 
                      icon: "success"
                    });
                  }
                },
                (err) => {
                  Swal.fire(
                    {
                      buttonsStyling: false,
                      customClass: {
                        confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc'
                      },
                      title: this.translateservice.getTranslate('Profile.TabProfile.FormPassword.ResponseMsg.Title'), 
                      text: this.translateservice.getTranslate('Profile.TabProfile.FormPassword.ResponseMsg.Error'), 
                      icon: "error"
                    });
                  console.log(err);
                }
              );
          } else {
            Swal.fire(
              {
                buttonsStyling: false,
                customClass: {
                  confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc'
                },
                title: this.translateservice.getTranslate('Profile.TabProfile.FormPassword.ResponseMsg.Title'), 
                text: this.translateservice.getTranslate('Profile.TabProfile.FormPassword.ResponseMsg.Error'), 
                icon: "error"
              });
          }

        },
        (err) => {

        }
      );

    } else {
      Swal.fire({
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc'
        },
        title: this.translateservice.getTranslate('Profile.TabProfile.FormPassword.ResponseMsg.Title'), 
        text: this.translateservice.getTranslate('Profile.TabProfile.FormPassword.ResponseMsg.Error2'), 
        icon: "error"
      });
    }
    /* Fin de la funcion para cambiar contraseña */
    
  }

  // Wallet alerta

  setWallet(data) {
    
    Swal.fire({
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc',
          cancelButton: 'btn btn-round ml-3 txt-btn-sbc'
        },
        title: this.translateservice.getTranslate('Profile.TabProfile.FormWallet.ConfirmationMsg.Title'),
        html: `<span>${this.translateservice.getTranslate('Profile.TabProfile.FormWallet.ConfirmationMsg.Msg01')}</span>
        <input type="text" class="input-modal-sbc" id="usuario" name="usuario" placeholder="${this.translateservice.getTranslate('Profile.TabProfile.FormWallet.ConfirmationMsg.User')}">
        <input type="text" class="input-modal-sbc" id="password" name="password" placeholder="${this.translateservice.getTranslate('Profile.TabProfile.FormWallet.ConfirmationMsg.Password')}">
        <input type="text" class="input-modal-sbc" id="auth" name="auth" placeholder="${this.translateservice.getTranslate('Profile.TabProfile.FormWallet.ConfirmationMsg.Google')}">`,
        icon: 'warning',
        confirmButtonText: this.translateservice.getTranslate('Profile.TabProfile.FormWallet.ConfirmationMsg.Continue'),
        cancelButtonText: this.translateservice.getTranslate('Profile.TabProfile.FormWallet.ConfirmationMsg.Cancel'),
        showCancelButton: true,
        showCloseButton: true
      }
    ).then((result) => {

        if (result.isConfirmed) {
          this.userService.setWallet(data.wallet.trim(), this.idGenerico).subscribe(
            (data) => {
              Swal.fire({
                buttonsStyling: false,
                customClass: {
                  confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc'
                },
                title: this.translateservice.getTranslate('Profile.TabProfile.FormWallet.ResponseMsg.Title'), 
                text: this.translateservice.getTranslate('Profile.TabProfile.FormWallet.ResponseMsg.Success'), 
                icon: "success"

              });
            },
            (error) => {
              Swal.fire({

                buttonsStyling: false,
                customClass: {
                  confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc'
                },
                title: this.translateservice.getTranslate('Profile.TabProfile.FormWallet.ResponseMsg.Title'), 
                text: this.translateservice.getTranslate('Profile.TabProfile.FormWallet.ResponseMsg.Error'), 
                icon: "error"

              }
                
              );
              console.log(error);
            }
          );
        }

    });
  }

  /********  Beneficiaries Tab ********************/
  editBeneficiary(benef) {
    this.editBeneficiaryForm.reset();
    var date = new Date(benef.fechaNac);
    let names = benef.nombre?.trim();
    if (benef.snombre) {
      names += " " + benef.snombre.trim();
    }
    this.editBeneficiaryForm = this.formBuilder.group({
      id: [benef.id],
      idUser: [this.idUser],
      name: [names, [Validators.required]],
      surname1: [benef.apaterno?.trim(), [Validators.required]],
      surname2: benef.amaterno?.trim(),
      birthdate: [
        formatDate(
          date.setMinutes(date.getMinutes() + date.getTimezoneOffset()),
          "yyyy-MM-dd", 
          "en"
        ),
        [Validators.required]],
      email: [
        benef.email?.trim(),
        [
          Validators.required, 
          Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$")
        ]
      ],
      homePhone: benef.telCasa?.trim(),
      mobilePhone: benef.telMovil?.trim(),
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
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc',
        cancelButton: 'btn btn-round ml-3 txt-btn-sbc'
      },
      title: this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.DeleteMsg.Title'),
      text: text,
      icon: "question",
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.DeleteMsg.Yes'),
      cancelButtonText: this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.DeleteMsg.No'),
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteBeneficiary(benef.id).subscribe(
          (result) => {
            Swal.fire({
              buttonsStyling: false,
              customClass: {
                confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc',
              },
              title: this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.DeleteMsg.Done'), 
              text: this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.DeleteMsg.Success'), 
              icon: "success"
            }
              
            );
            this.getBeneficiaries();
            this.getTotalPercentage();
            this.getAUC();
            this.showDesignatedBenefFunc();
            // Actualizar AUC
          },
          (err) => {
            Swal.fire({
              
              buttonsStyling: false,
              customClass: {
                confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc',
              },
              title: this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.DeleteMsg.Title'), 
              text: this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.DeleteMsg.Error'), 
              icon: "error"
            }
              
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

  getAUC() {
    this.AUC = null;
    this.userService
      .getBeneficiaries(this.idUser)
      .subscribe((dataBeneficiaries) => {
        let status = dataBeneficiaries["status"];
        if (status == "ok") {
          dataBeneficiaries["data"].forEach(element => {
            if (element.isManager == 1) {
              this.AUC = element;
            }
          });
        }
        if (status == "notFoud") {
          console.log("No hay datos de beneficiarios");
        }
      }),
      (err) => {
        console.log(err);
      };
  }

  getBeneficiaries() {
    this.arrayBeneficiaries = null;
    this.userService
      .getBeneficiaries(this.idUser)
      .subscribe((dataBeneficiaries) => {
        let status = dataBeneficiaries["status"];
        if (status == "ok") {
          this.arrayBeneficiaries = dataBeneficiaries["data"];
        }
        if (status == "notFoud") {
          console.log("No hay datos de beneficiarios");
        }
      }),
      (err) => {
        console.log(err);
      };
  }

  addBeneficiary(beneficiaryData) {
    this.userService.getTotalPercent(this.idUser).subscribe((data) => {
      console.log("pe", data["porcTotal"]);
      if (!data["porcTotal"]) {
        data["porcTotal"] = 0;
      }
      console.log("pe", data["porcTotal"]);
      if (parseInt(data["porcTotal"]) + beneficiaryData["percentage"] <= 100) {
        let names = beneficiaryData["name"]?.trim().split(" ");
        let name;
        let sname;
        if (names.length > 1) {
          name = names[0];
          names.splice(0, 1);
          sname = names.join(" ");
        } else {
          name = beneficiaryData["name"];
          sname = "";
        }

        let data = {
          "idGenerico": this.idUser,
          "nombre": name, 
          "snombre": sname, 
          "apaterno": beneficiaryData["surname1"]?.trim(),
          "amaterno": beneficiaryData["surname2"]?.trim(), 
          "fecnac": beneficiaryData["birthdate"], 
          "correo": beneficiaryData["email"]?.trim(),
          "telCasa": beneficiaryData["homePhone"]?.trim(), 
          "telMovil": beneficiaryData["mobilePhone"]?.trim(), 
          "porcentaje": parseInt(beneficiaryData["percentage"])
        };
    
        this.userService
          .createBeneficiary(data)
          .subscribe((data) => {
            Swal.fire({
              buttonsStyling: false,
              customClass: {
                confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc',
              },
              title: this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.AddMsg.Title'),
              text: this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.AddMsg.Success'),
              icon: "success"
            }
              
            );
            this.addBeneficiaryForm.reset();
            this.getTotalPercentage();
            this.getBeneficiaries();
          }),
          (err) => {
            Swal.fire({

              buttonsStyling: false,
              customClass: {
                confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc',
              },
              title: this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.AddMsg.Title'), 
              text: this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.AddMsg.Error'), 
              icon: "error"

            }
              
            );
            console.log(err);
          };

      } else {
        Swal.fire({

          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc',
          },
          title: this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.AddMsg.Title'),
          text: this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.AddMsg.Error2'),
          icon: "error"

        });
      }
    });

    this.showDesignatedBenefFunc();
  }

  updateBeneficiary(benef) {
    this.userService.getTotalPercent(this.idUser).subscribe((data) => {
      if (parseInt(data["porcTotal"]) - benef["oldPercentage"] + benef["percentage"] <= 100) {
        let names = benef["name"]?.trim().split(" ");
        let name;
        let sname;
        if (names.length > 1) {
          name = names[0];
          names.splice(0, 1);
          sname = names.join(" ");
        } else {
          name = benef["name"];
          sname = "";
        }

        let data = {
          "idGenerico": this.idUser,
          "nombre": name, 
          "snombre": sname, 
          "apaterno": benef["surname1"]?.trim(),
          "amaterno": benef["surname2"]?.trim(), 
          "fecnac": benef["birthdate"], 
          "correo": benef["email"]?.trim(),
          "telCasa": benef["homePhone"]?.trim(), 
          "telMovil": benef["mobilePhone"]?.trim(), 
          "porcentaje": parseInt(benef["percentage"])
        };

        this.userService
          .updateBeneficiary(data, benef.id)
          .subscribe((data) => {
            Swal.fire({
              buttonsStyling: false,
              customClass: {
                confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc',
              },
              title: this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.UpdateMsg.Title'),
              text: this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.UpdateMsg.Success'),
              icon: "success"
            }
              
            );
            this.editBeneficiaryForm.reset();
            this.getTotalPercentage();
            this.getBeneficiaries();
            this.showDesignatedBenefFunc();
          }),
          (err) => {
            Swal.fire({

              buttonsStyling: false,
              customClass: {
                confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc',
              },
              title: this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.UpdateMsg.Title'),
              text: this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.UpdateMsg.Error'),
              icon: "error"
              
            }
              
            );
            console.log(err);
          };
      } else {
        Swal.fire({

          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc',
          },
          title: this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.UpdateMsg.Title'),
          text: this.translateservice.getTranslate('Profile.TabBeneficiaries.Designated.UpdateMsg.Error2'),
          icon: "error"

        }
          
        );
      }
    });
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
  /* Designar Administrador Universal de Comunidad */
  setAUC(selected) {
    if (selected.managerId) {
      this.designateAUCForm = this.formBuilder.group({
        managerId: [selected.managerId],
      });
    }

    this.userService.getBeneficiary(selected.managerId).subscribe(
      (data) => {
        console.log("beneficiary data", data[0]);
        let text = "";
        let name = "";
        if (data[0].nombre) {
          name += data[0].nombre + " ";
        }
        if (data[0].snombre) {
          name += data[0].snombre + " ";
        }
        if (data[0].apaterno) {
          name += data[0].apaterno + " ";
        }
        if (data[0].amaterno) {
          name += data[0].amaterno + " ";
        }
        if (name) {
          text = 
            this.translateservice.getTranslate('Profile.TabBeneficiaries.AUC.DesignateMsg.Msg01') +
            name +
            this.translateservice.getTranslate('Profile.TabBeneficiaries.AUC.DesignateMsg.Msg03');
        } else {
          text = 
            this.translateservice.getTranslate('Profile.TabBeneficiaries.AUC.DesignateMsg.Msg01') +
            this.translateservice.getTranslate('Profile.TabBeneficiaries.AUC.DesignateMsg.Msg02') +
            this.translateservice.getTranslate('Profile.TabBeneficiaries.AUC.DesignateMsg.Msg03');
        }
        Swal.fire({
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc',
            cancelButton: 'btn btn-round ml-3 txt-btn-sbc'
          },
          title: this.translateservice.getTranslate('Profile.TabBeneficiaries.AUC.DesignateMsg.Title'),
          html: `<span>${ text }</span><br>
          <span>${this.translateservice.getTranslate('Profile.TabBeneficiaries.AUC.DesignateMsg.Msg04')}</span>
          <input type="text" class="input-modal-sbc" id="usuario" name="usuario" placeholder="${this.translateservice.getTranslate('Profile.TabBeneficiaries.AUC.DesignateMsg.User')}">
          <input type="text" class="input-modal-sbc" id="password" name="password" placeholder="${this.translateservice.getTranslate('Profile.TabBeneficiaries.AUC.DesignateMsg.Password')}">
          <input type="text" class="input-modal-sbc" id="auth" name="auth" placeholder="${this.translateservice.getTranslate('Profile.TabBeneficiaries.AUC.DesignateMsg.Google')}">`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: this.translateservice.getTranslate('Profile.TabBeneficiaries.AUC.DesignateMsg.Yes'),
          cancelButtonText: this.translateservice.getTranslate('Profile.TabBeneficiaries.AUC.DesignateMsg.No'),
        }).then((result) => {
          if (result.isConfirmed) {
            let data = {
              id: selected.managerId,
              idSuscriptor: this.idUser,
            };
            this.userService.addManager(data).subscribe(
              (data) => {
                Swal.fire({
                  buttonsStyling: false,
                  customClass: {
                    confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc'
                  },
                  title: this.translateservice.getTranslate('Profile.TabBeneficiaries.AUC.DesignateMsg.Done'),
                  text: this.translateservice.getTranslate('Profile.TabBeneficiaries.AUC.DesignateMsg.Success'),
                  icon: "success"
                }
                  
                );
                this.getAUC();
              },
              (err) => {
                Swal.fire({
                  buttonsStyling: false,
                  customClass: {
                    confirmButton: 'btn btn-success btn-round ml-3 txt-btn-sbc'
                  },
                  title: this.translateservice.getTranslate('Profile.TabBeneficiaries.AUC.DesignateMsg.Done'),
                  text: this.translateservice.getTranslate('Profile.TabBeneficiaries.AUC.DesignateMsg.Error'),
                  icon: "error"
                }
                  
                );
                console.log(err);
              }
            );
          }
        });

      },
      (err) => {
        console.log(err);
      }
    );

    
  }


}