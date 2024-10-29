import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { JSDocCommentStmt } from "@angular/compiler";
import { RequestOptions } from "@angular/http";
import { data } from "jquery";

@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  //authorization Basic c21hcnRidXNpbmVzczo1ZWVjOGRjZjc1MWFlM2RkOGE2MzAyNmQ2NzE0NDQ2ZmY0ZmI5ZGFh
  // Configuration
  baseUri: string = environment.baseURL; //"https://sbc-back-end.herokuapp.com";
 //  baseUri = "https://app-dev-edo-cuenta.herokuapp.com";

  baseImageURL: string = environment.baseImageURL;
  headers = new HttpHeaders().set("Content-Type", "application/json");

  /*headers_identityMind = new HttpHeaders({
    'Content-Type': 'application/json',
     'Authorization': "Basic c21hcnRidXNpbmVzczo1ZWVjOGRjZjc1MWFlM2RkOGE2MzAyNmQ2NzE0NDQ2ZmY0ZmI5ZGFh"
  })*/

  baseUriIdentityMind = "https://sbcmexico.us:3000/api/users/identity";
  baseURLGetIp = "http://api.ipify.org?format=json";
  // Constructor
  constructor(private http: HttpClient) { }

  getNotificacionesPago(id) {
    let url = `${this.baseUri}/api/users/notificaciones/${id}`;
    console.log(url)
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  getRespKYC(id) {
    let url = `${this.baseUri}/api/users/kyc/${id}`;
    console.log(url)
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  setRespKYC(id, resp) {
    let data = {
      "resp":resp,
    };
    let url = `${this.baseUri}/api/users/kyc/${id}`;
    console.log(url);
    return this.http.put(url, data).pipe(catchError(this.errorMgmt));
  }

  setGuest(idSuscriber, nombreInvitado, correoInvitado) {
    let data = {
      nombre: nombreInvitado,
      email: correoInvitado,
      id_suscriber: idSuscriber,
    };
    
    let url = `${this.baseUri}/api/users/newGuest`;
    console.log(url);
    console.log("userdata" + JSON.stringify(data));
    return this.http.post(url, data).pipe(catchError(this.errorMgmt));
  }

  setNotificacionPago(_monto,_idplan,_referencia,_fechaPago,_idProspecto) {
    let data = {
      monto : _monto,
      idPlan  : _idplan,
      referencia  :_referencia,
      fechaPago: _fechaPago,
      idProspecto:_idProspecto
    };
    console.log("hola");
    let url = `${this.baseUri}/api/pagos/notificacion`;
    console.log("userdata" + JSON.stringify(data));
    return this.http.post(url, data).pipe(catchError(this.errorMgmt));
  }

  getIdUUID(uuid) {
    let url = `${this.baseUri}/api/users/uuid/${uuid}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        console.log(res);
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  getInvitacion(id, email) {
    let url = `${this.baseUri}/api/users/val/${id}/${email}/invitado`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        console.log(res);
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  // Create
  createUser(data): Observable<any> {
    let url = `${this.baseUri}/api/users`;
    return this.http.post(url, data).pipe(catchError(this.errorMgmt));
  }

  deleteBeneficiary(id) {
    let url = `${this.baseUri}/api/beneficiarios/${id}`;
    return this.http
      .delete(url, { headers: this.headers })
      .pipe(catchError(this.errorMgmt));
  }

  getBeneficiary(id) {
    let url = `${this.baseUri}/api/beneficiarios/select/${id}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  updateBeneficiary(data, idBeneficiario): Observable<any> {
    let url = `${this.baseUri}/api/beneficiarios/${idBeneficiario}`;
    return this.http.put(url, data).pipe(catchError(this.errorMgmt));
  }

  createBeneficiary(data): Observable<any> {
    let url = `${this.baseUri}/api/beneficiarios`;
    return this.http.post(url, data).pipe(catchError(this.errorMgmt));
  }

  getIP_Client() {
    let url = `${this.baseURLGetIp}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  setHidePopUp(idSuscriber): Observable<any> {
    let data = {};
    let url = `${this.baseUri}/api/users/show/popup/${idSuscriber}`;
    return this.http
      .put(url, data, { headers: this.headers })
      .pipe(catchError(this.errorMgmt));
  }

  showPopUp(idSuscriber) {
    let url = `${this.baseUri}/api/users/show/popup/${idSuscriber}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }
  getTotalPercent(idGenerico) {
    let url = `${this.baseUri}/api/beneficiarios/${idGenerico}/porctotal`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  getBeneficiaries(idGenerico) {
    let url = `${this.baseUri}/api/beneficiarios/${idGenerico}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  getAvatar(avatar, type) {
    let url = `${this.baseImageURL}/imagen/${type}/${avatar}`;
    let result: Observable<any> = this.http.get(url, { responseType: "blob" });
    return result;
  }

  setImagenToSuscriber(suscriber, avatar, type): Observable<any> {
    let data = {
      suscriber: suscriber,
      avatar: avatar,
      type: type,
    };
    return this.http.put(`${this.baseUri}/api/users/avatar`, data);
  }

  subirImagen(image: any, type): Observable<any> {
    return this.http.put(`${this.baseImageURL}/upload/${type}/003`, image);
  }

  validatePassword(email, password) {
    const data = {
      email: email,
      password: password
    };
    return this.http.post(`${this.baseUri}/authenticate`, data);
  }

  setPassword(email, newPassword): Observable<any> {
    const data = {
      id_suscriber: email,
      newPassword: newPassword,
    };
    return this.http.put(`${this.baseUri}/api/users/password/change`, data);
  }

  enviarInvitacion(data): Observable<any> {
    let url = `${this.baseUri}/api/users/invitado`;
    return this.http.post(url, data).pipe(catchError(this.errorMgmt));
  }

  validateWithIdentityMind(data): Observable<any> {
    let url = `${this.baseUriIdentityMind}`;

    console.log("userdata" + JSON.stringify(data));

    return this.http.post(url, data).pipe(catchError(this.errorMgmt));
  }

  envioEmailGeneral(from, to, jsonData, htmlMessage, Asunto) {
    var mailOptions = {
      from: from,
      to: to,
      subject: Asunto,
      html: htmlMessage,
    };
    console.log(mailOptions);
    let url = `${this.baseUri}/api/email/`;
    console.log("enviando...");
    return this.http.post(url, mailOptions).pipe(catchError(this.errorMgmt));
  }

  validaDataComplete(idSuscriber) {
    let url = `${this.baseUri}/api/users/datacomplete/${idSuscriber}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  // Send mail
  envioEmail(receptor, myId) {
    let valUrl =
      "https://www.sbcmexico.club/#/registro?email=" +
      receptor +
      "&setorval=" +
      myId;
    console.log(valUrl);
    var mailOptions = {
      from: "mail@smartbusinesscorp.info",
      to: receptor,
      subject: " Confirma tu correo electrónico",
      html: this.getHTLMVerificacionEmail(valUrl),
    };
    console.log(mailOptions);
    let url = `${this.baseUri}/api/email/`;
    console.log("enviando..." + JSON.stringify(mailOptions) );
    return this.http.post(url, mailOptions).pipe(catchError(this.errorMgmt));
  }

  // Validate email
  getEmail(email): Observable<any> {
    let url = `${this.baseUri}/api/users/validate/${email}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  // Get all employees
  getUsers() {
    return this.http.get(`${this.baseUri}`);
  }

  /**************************************************** */

  setPostToPaymentSystem() {
    console.log("enviando fuera del sistema");
    let test_this = { search: "person" };
    let headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
    });

    let op = {
      headers: headers,
    };

    this.http
      .post("http://localhost/SMART/membre.php", test_this, op)
      .subscribe(
        (data) => {
          console.log(data);
        },
        (err) => console.log(err)
      );
  }

  getEncrptedDataForPayment(dataToEncrypt) {
    let url = `${this.baseUri}/api/users/encrypt/`;

    return this.http.post(url, dataToEncrypt).pipe(catchError(this.errorMgmt));
  }
  /***************************************************** */
  // Get employee
  getUser(email): Observable<any> {
    let url = `${this.baseUri}/api/users/${email}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  getTotalAmountForBeneficiaries(idSuscriber) {
    //https://sbcmexico.us:3000/api/beneficiarios/asignado/3
    console.log(idSuscriber);
    let url = `${this.baseUri}/api/beneficiarios/asignado/${idSuscriber}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  // Get Country
  getSponsor(idSuscriber): Observable<any> {
    let url = `${this.baseUri}/api/sponsor/${idSuscriber}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  changePassword(user, pass) {
    let data = {
      id_suscriber: user,
      newPassword: pass,
    };
    let url = `${this.baseUri}/api/users/password/change`;
    return this.http
      .put(url, data, { headers: this.headers })
      .pipe(catchError(this.errorMgmt));
  }

  // Get Country
  getCountry(): Observable<any> {
    let url = `${this.baseUri}/api/countries`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  setWallet(wallet, idSuscriber): Observable<any> {
    let data = {
      wallet: wallet,
      id_suscriber: idSuscriber,
    };
    let url = `${this.baseUri}/api/users/wallet/`;
    return this.http
      .put(url, data, { headers: this.headers })
      .pipe(catchError(this.errorMgmt));
  }

  // Get City
  getCities(codeCountry): Observable<any> {
    let url = `${this.baseUri}/api/cities/${codeCountry}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  addManager(data): Observable<any> {
    let url = `${this.baseUri}/api/beneficiarios/manager`;
    return this.http
      .put(url, data, { headers: this.headers })
      .pipe(catchError(this.errorMgmt));
  }

  // Update employee
  updateUser(data): Observable<any> {
    let url = `${this.baseUri}/api/users`;
    return this.http
      .put(url, data, { headers: this.headers })
      .pipe(catchError(this.errorMgmt));
  }

  updateUserPersonalData(data): Observable<any> {
    let url = `${this.baseUri}/api/users/profile/personal`;
    return this.http
      .put(url, data, { headers: this.headers })
      .pipe(catchError(this.errorMgmt));
  }

  updateUserAddress(data): Observable<any> {
    let url = `${this.baseUri}/api/users/profile/address`;
    return this.http
      .put(url, data, { headers: this.headers })
      .pipe(catchError(this.errorMgmt));
  }

  // Delete employee
  deleteUser(id): Observable<any> {
    let url = `${this.baseUri}/delete/${id}`;
    return this.http
      .delete(url, { headers: this.headers })
      .pipe(catchError(this.errorMgmt));
  }

  updateBeneficiaryComplete(idSuscriber) {
    let url = `${this.baseUri}/api/users/${idSuscriber}/beneficiarycomplete`;
    return this.http
      .put(url, {}, { headers: this.headers })
      .pipe(catchError(this.errorMgmt));
  }

  getNextIdSuscriber(idgen) {
    let url = `${this.baseUri}/api/users/idgen/${idgen}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  setNextIdSuscriber(idGenerico, newIdSuscriber) {
    let url = `${this.baseUri}/api/users/${idGenerico}/suscriber`;
    return this.http
      .put(url, { newIdSuscriber: newIdSuscriber }, { headers: this.headers })
      .pipe(catchError(this.errorMgmt));
  }

  // Error handling
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

  getTokenReqPsw(email: string) {
    let options = {
      email: email,
    };
    console.log(options);
    let url = `${this.baseUri}/api/users/request/password`;
    return this.http.post(url, options).pipe(catchError(this.errorMgmt));
  }

  sendTokenReqPsw(email, link, nombre) {
    this.envioEmailGeneral(
      "mail@smartbusinesscorp.info",
      email,
      {},
      this.getHTMLReqPassword(email, link, nombre),
      "Recuperación de Contraseña"
    ).subscribe((res) => {});
  }

  getHTLMVerificacionEmail(link) {
    return `
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
<img class="img-fluid" style="display: block; height: auto; line-height: 100%; outline: none; text-decoration: none; width: 100%; max-width: 100%; border: 0 none;" src="https://raw.githubusercontent.com/SaulDuenas/Emails_Smart/main/img/header_manos.png">
<table class="container-fluid pt-5" border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; width: 100%;">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 15px; line-height: 20px; color: #000000; text-align: center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 48px 16px 0;" align="left">
<table style="width: 100%; font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; font-style: normal; font-weight: normal; font-size: 17px; line-height: 20px; color: #000000; height: auto; margin-left: auto; margin-right: auto;" class="clear-table" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 15px; line-height: 20px; color: #000000; text-align: center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td style="padding-bottom: 25px; border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0;" align="left">  
<h4 style="margin-top: 0; margin-bottom: 0; font-weight: 900; vertical-align: baseline; font-size: 25px; line-height: 29px; font-family: 'Roboto','Arial'; color: #164194; text-shadow: 0 0 10px #FFF;" align="center">¡Hola! </h4> 
</td>
</tr>
<tr>
<td class="text-center" style="padding-bottom: 25px; border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0;" align="center"> 
Estás a unos pasos de formar parte de la comunidad <span class="highlighted-text" style="color: #0093D6; font-weight: bold;">Smart Business Corp.</span>  
Verifica tu correo electrónico y podrás continuar con tu registro: 
</td>
</tr>
<tr>
<td class="text-center ml-4 mr-4" style="padding-bottom: 25px; width: 100%; border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0;" align="center"> 
<a href="${link}" target="_blank" class="button-blue" style="background-color: #0093D6; text-decoration: none; display: inline-block; color: #FFFFFF; border-radius: 5px; font-weight: bold; font-style: normal; font-size: 17px; line-height: 40px; padding: 0px 40px;">
Verificar correo
</a>  
</td>
</tr>
<tr>
<td class="text-center ml-4 mr-4" style="padding-bottom: 25px; width: 100%; border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0;" align="center">  
Agradecemos tu confianza, en SBC tu seguridad es nuestra prioridad. </td>
</tr>
</tbody>
</table>
<table class="clear-table" style="margin-top: 50px; font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; font-style: normal; font-weight: normal; font-size: 17px; line-height: 20px; color: #000000; width: auto; height: auto; margin-left: auto; margin-right: auto;" border="0" cellspacing="0" cellpadding="0">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 15px; line-height: 20px; color: #000000; text-align: center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td class="text-center text-message" style="border-spacing: 0px; border-collapse: collapse; line-height: 15px; font-size: 15px; font-style: normal; font-weight: normal; color: #164194; text-shadow: 0px 0px 50px #FFFFFF; margin: 0;" align="center">  Cualquier duda o aclaración envíanos un correo a 
<a class="url-link" href="mailto:asesoria@smartbusinesscorp.com" target="_blank" style="color: #0093D6;"> asesoria@smartbusinesscorp.com</a> </td>
</tr>
<tr>
<td class="text-center text-message" style="border-spacing: 0px; border-collapse: collapse; line-height: 15px; font-size: 15px; font-style: normal; font-weight: normal; color: #164194; text-shadow: 0px 0px 50px #FFFFFF; margin: 0;" align="center">  o un whatsapp al 
<a class="url-link" href="https://api.whatsapp.com/send?phone=525611754467" target="_blank" style="color: #0093D6;">+52 56 1175 4467</a> </td>
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
  }

  getHTMLReqPassword(email, link, nombre) {
    console.log(link);
    let uri = "https://desarrollo.d377f21s89xzzp.amplifyapp.com/#/newpassword/" + link;
    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<style>@font-face {
font-family: 'Roboto'; font-style: normal; font-weight: 400; src: url(https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.ttf) format('truetype');}
</style><style type="text/css">
.ExternalClass{width:100%}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{line-height:150%}a{text-decoration:none}body,td,input,textarea,select{margin:unset;font-family:unset}input,textarea,select{font-size:unset}@media screen and (max-width: 600px){table.row th.col-lg-1,table.row th.col-lg-2,table.row th.col-lg-3,table.row th.col-lg-4,table.row th.col-lg-5,table.row th.col-lg-6,table.row th.col-lg-7,table.row th.col-lg-8,table.row th.col-lg-9,table.row th.col-lg-10,table.row th.col-lg-11,table.row th.col-lg-12{display:block;width:100% !important}.d-mobile{display:block !important}.d-desktop{display:none !important}.w-lg-25{width:auto !important}.w-lg-25>tbody>tr>td{width:auto !important}.w-lg-50{width:auto !important}.w-lg-50>tbody>tr>td{width:auto !important}.w-lg-75{width:auto !important}.w-lg-75>tbody>tr>td{width:auto !important}.w-lg-100{width:auto !important}.w-lg-100>tbody>tr>td{width:auto !important}.w-lg-auto{width:auto !important}.w-lg-auto>tbody>tr>td{width:auto !important}.w-25{width:25% !important}.w-25>tbody>tr>td{width:25% !important}.w-50{width:50% !important}.w-50>tbody>tr>td{width:50% !important}.w-75{width:75% !important}.w-75>tbody>tr>td{width:75% !important}.w-100{width:100% !important}.w-100>tbody>tr>td{width:100% !important}.w-auto{width:auto !important}.w-auto>tbody>tr>td{width:auto !important}.p-lg-0>tbody>tr>td{padding:0 !important}.pt-lg-0>tbody>tr>td,.py-lg-0>tbody>tr>td{padding-top:0 !important}.pr-lg-0>tbody>tr>td,.px-lg-0>tbody>tr>td{padding-right:0 !important}.pb-lg-0>tbody>tr>td,.py-lg-0>tbody>tr>td{padding-bottom:0 !important}.pl-lg-0>tbody>tr>td,.px-lg-0>tbody>tr>td{padding-left:0 !important}.p-lg-1>tbody>tr>td{padding:0 !important}.pt-lg-1>tbody>tr>td,.py-lg-1>tbody>tr>td{padding-top:0 !important}.pr-lg-1>tbody>tr>td,.px-lg-1>tbody>tr>td{padding-right:0 !important}.pb-lg-1>tbody>tr>td,.py-lg-1>tbody>tr>td{padding-bottom:0 !important}.pl-lg-1>tbody>tr>td,.px-lg-1>tbody>tr>td{padding-left:0 !important}.p-lg-2>tbody>tr>td{padding:0 !important}.pt-lg-2>tbody>tr>td,.py-lg-2>tbody>tr>td{padding-top:0 !important}.pr-lg-2>tbody>tr>td,.px-lg-2>tbody>tr>td{padding-right:0 !important}.pb-lg-2>tbody>tr>td,.py-lg-2>tbody>tr>td{padding-bottom:0 !important}.pl-lg-2>tbody>tr>td,.px-lg-2>tbody>tr>td{padding-left:0 !important}.p-lg-3>tbody>tr>td{padding:0 !important}.pt-lg-3>tbody>tr>td,.py-lg-3>tbody>tr>td{padding-top:0 !important}.pr-lg-3>tbody>tr>td,.px-lg-3>tbody>tr>td{padding-right:0 !important}.pb-lg-3>tbody>tr>td,.py-lg-3>tbody>tr>td{padding-bottom:0 !important}.pl-lg-3>tbody>tr>td,.px-lg-3>tbody>tr>td{padding-left:0 !important}.p-lg-4>tbody>tr>td{padding:0 !important}.pt-lg-4>tbody>tr>td,.py-lg-4>tbody>tr>td{padding-top:0 !important}.pr-lg-4>tbody>tr>td,.px-lg-4>tbody>tr>td{padding-right:0 !important}.pb-lg-4>tbody>tr>td,.py-lg-4>tbody>tr>td{padding-bottom:0 !important}.pl-lg-4>tbody>tr>td,.px-lg-4>tbody>tr>td{padding-left:0 !important}.p-lg-5>tbody>tr>td{padding:0 !important}.pt-lg-5>tbody>tr>td,.py-lg-5>tbody>tr>td{padding-top:0 !important}.pr-lg-5>tbody>tr>td,.px-lg-5>tbody>tr>td{padding-right:0 !important}.pb-lg-5>tbody>tr>td,.py-lg-5>tbody>tr>td{padding-bottom:0 !important}.pl-lg-5>tbody>tr>td,.px-lg-5>tbody>tr>td{padding-left:0 !important}.p-0>tbody>tr>td{padding:0 !important}.pt-0>tbody>tr>td,.py-0>tbody>tr>td{padding-top:0 !important}.pr-0>tbody>tr>td,.px-0>tbody>tr>td{padding-right:0 !important}.pb-0>tbody>tr>td,.py-0>tbody>tr>td{padding-bottom:0 !important}.pl-0>tbody>tr>td,.px-0>tbody>tr>td{padding-left:0 !important}.p-1>tbody>tr>td{padding:4px !important}.pt-1>tbody>tr>td,.py-1>tbody>tr>td{padding-top:4px !important}.pr-1>tbody>tr>td,.px-1>tbody>tr>td{padding-right:4px !important}.pb-1>tbody>tr>td,.py-1>tbody>tr>td{padding-bottom:4px !important}.pl-1>tbody>tr>td,.px-1>tbody>tr>td{padding-left:4px !important}.p-2>tbody>tr>td{padding:8px !important}.pt-2>tbody>tr>td,.py-2>tbody>tr>td{padding-top:8px !important}.pr-2>tbody>tr>td,.px-2>tbody>tr>td{padding-right:8px !important}.pb-2>tbody>tr>td,.py-2>tbody>tr>td{padding-bottom:8px !important}.pl-2>tbody>tr>td,.px-2>tbody>tr>td{padding-left:8px !important}.p-3>tbody>tr>td{padding:16px !important}.pt-3>tbody>tr>td,.py-3>tbody>tr>td{padding-top:16px !important}.pr-3>tbody>tr>td,.px-3>tbody>tr>td{padding-right:16px !important}.pb-3>tbody>tr>td,.py-3>tbody>tr>td{padding-bottom:16px !important}.pl-3>tbody>tr>td,.px-3>tbody>tr>td{padding-left:16px !important}.p-4>tbody>tr>td{padding:24px !important}.pt-4>tbody>tr>td,.py-4>tbody>tr>td{padding-top:24px !important}.pr-4>tbody>tr>td,.px-4>tbody>tr>td{padding-right:24px !important}.pb-4>tbody>tr>td,.py-4>tbody>tr>td{padding-bottom:24px !important}.pl-4>tbody>tr>td,.px-4>tbody>tr>td{padding-left:24px !important}.p-5>tbody>tr>td{padding:48px !important}.pt-5>tbody>tr>td,.py-5>tbody>tr>td{padding-top:48px !important}.pr-5>tbody>tr>td,.px-5>tbody>tr>td{padding-right:48px !important}.pb-5>tbody>tr>td,.py-5>tbody>tr>td{padding-bottom:48px !important}.pl-5>tbody>tr>td,.px-5>tbody>tr>td{padding-left:48px !important}.s-lg-1>tbody>tr>td,.s-lg-2>tbody>tr>td,.s-lg-3>tbody>tr>td,.s-lg-4>tbody>tr>td,.s-lg-5>tbody>tr>td{font-size:0 !important;line-height:0 !important;height:0 !important}.s-0>tbody>tr>td{font-size:0 !important;line-height:0 !important;height:0 !important}.s-1>tbody>tr>td{font-size:4px !important;line-height:4px !important;height:4px !important}.s-2>tbody>tr>td{font-size:8px !important;line-height:8px !important;height:8px !important}.s-3>tbody>tr>td{font-size:16px !important;line-height:16px !important;height:16px !important}.s-4>tbody>tr>td{font-size:24px !important;line-height:24px !important;height:24px !important}.s-5>tbody>tr>td{font-size:48px !important;line-height:48px !important;height:48px !important}}@media yahoo{.d-mobile{display:none !important}.d-desktop{display:block !important}.w-lg-25{width:25% !important}.w-lg-25>tbody>tr>td{width:25% !important}.w-lg-50{width:50% !important}.w-lg-50>tbody>tr>td{width:50% !important}.w-lg-75{width:75% !important}.w-lg-75>tbody>tr>td{width:75% !important}.w-lg-100{width:100% !important}.w-lg-100>tbody>tr>td{width:100% !important}.w-lg-auto{width:auto !important}.w-lg-auto>tbody>tr>td{width:auto !important}.p-lg-0>tbody>tr>td{padding:0 !important}.pt-lg-0>tbody>tr>td,.py-lg-0>tbody>tr>td{padding-top:0 !important}.pr-lg-0>tbody>tr>td,.px-lg-0>tbody>tr>td{padding-right:0 !important}.pb-lg-0>tbody>tr>td,.py-lg-0>tbody>tr>td{padding-bottom:0 !important}.pl-lg-0>tbody>tr>td,.px-lg-0>tbody>tr>td{padding-left:0 !important}.p-lg-1>tbody>tr>td{padding:4px !important}.pt-lg-1>tbody>tr>td,.py-lg-1>tbody>tr>td{padding-top:4px !important}.pr-lg-1>tbody>tr>td,.px-lg-1>tbody>tr>td{padding-right:4px !important}.pb-lg-1>tbody>tr>td,.py-lg-1>tbody>tr>td{padding-bottom:4px !important}.pl-lg-1>tbody>tr>td,.px-lg-1>tbody>tr>td{padding-left:4px !important}.p-lg-2>tbody>tr>td{padding:8px !important}.pt-lg-2>tbody>tr>td,.py-lg-2>tbody>tr>td{padding-top:8px !important}.pr-lg-2>tbody>tr>td,.px-lg-2>tbody>tr>td{padding-right:8px !important}.pb-lg-2>tbody>tr>td,.py-lg-2>tbody>tr>td{padding-bottom:8px !important}.pl-lg-2>tbody>tr>td,.px-lg-2>tbody>tr>td{padding-left:8px !important}.p-lg-3>tbody>tr>td{padding:16px !important}.pt-lg-3>tbody>tr>td,.py-lg-3>tbody>tr>td{padding-top:16px !important}.pr-lg-3>tbody>tr>td,.px-lg-3>tbody>tr>td{padding-right:16px !important}.pb-lg-3>tbody>tr>td,.py-lg-3>tbody>tr>td{padding-bottom:16px !important}.pl-lg-3>tbody>tr>td,.px-lg-3>tbody>tr>td{padding-left:16px !important}.p-lg-4>tbody>tr>td{padding:24px !important}.pt-lg-4>tbody>tr>td,.py-lg-4>tbody>tr>td{padding-top:24px !important}.pr-lg-4>tbody>tr>td,.px-lg-4>tbody>tr>td{padding-right:24px !important}.pb-lg-4>tbody>tr>td,.py-lg-4>tbody>tr>td{padding-bottom:24px !important}.pl-lg-4>tbody>tr>td,.px-lg-4>tbody>tr>td{padding-left:24px !important}.p-lg-5>tbody>tr>td{padding:48px !important}.pt-lg-5>tbody>tr>td,.py-lg-5>tbody>tr>td{padding-top:48px !important}.pr-lg-5>tbody>tr>td,.px-lg-5>tbody>tr>td{padding-right:48px !important}.pb-lg-5>tbody>tr>td,.py-lg-5>tbody>tr>td{padding-bottom:48px !important}.pl-lg-5>tbody>tr>td,.px-lg-5>tbody>tr>td{padding-left:48px !important}.s-lg-0>tbody>tr>td{font-size:0 !important;line-height:0 !important;height:0 !important}.s-lg-1>tbody>tr>td{font-size:4px !important;line-height:4px !important;height:4px !important}.s-lg-2>tbody>tr>td{font-size:8px !important;line-height:8px !important;height:8px !important}.s-lg-3>tbody>tr>td{font-size:16px !important;line-height:16px !important;height:16px !important}.s-lg-4>tbody>tr>td{font-size:24px !important;line-height:24px !important;height:24px !important}.s-lg-5>tbody>tr>td{font-size:48px !important;line-height:48px !important;height:48px !important}}
</style>
</head>
<body style="outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: 'Roboto','Arial'; line-height: 20px; font-weight: normal; font-size: 17px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; font-style: normal; text-align: -webkit-center; margin: 0; padding: 0; border: 0;" bgcolor="#ffffff">
<table valign="top" class="text-center body" style="outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; text-align: center !important; margin: 0; padding: 0; border: 0;" bgcolor="#ffffff">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 17px; line-height: 20px; color: #000000; text-align: -webkit-center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td valign="top" style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0;" align="left">
<table class="container" border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; width: 100%;">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 17px; line-height: 20px; color: #000000; text-align: -webkit-center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td align="center" style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0; padding: 0 16px;">
<table align="center" border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; width: 100%; max-width: 600px; margin: 0 auto;">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 17px; line-height: 20px; color: #000000; text-align: -webkit-center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0;" align="left">
<table class="s-3 w-100" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 17px; line-height: 20px; color: #000000; text-align: -webkit-center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td height="16" style="border-spacing: 0px; border-collapse: collapse; line-height: 16px; font-size: 16px; width: 100%; height: 16px; margin: 0;" align="left">
</td>
</tr>
</tbody>
</table>
<div class=" ">
<table class="container-fluid m-0 p-0" border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; width: 100%;">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 17px; line-height: 20px; color: #000000; text-align: -webkit-center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 0;" align="left">
<table class="row m-0 p-0" border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; margin-right: -15px; margin-left: -15px; table-layout: fixed; width: 100%;">
<thead>
<tr>
<th class="col-4" align="left" valign="top" style="line-height: 24px; font-size: 16px; min-height: 1px; padding-right: 15px; padding-left: 15px; font-weight: normal; width: 33.333333%; margin: 0;">
<table class="p-0" border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse;">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 17px; line-height: 20px; color: #000000; text-align: -webkit-center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0; padding: 0;" align="left">
<img class="logo m-0 " src="https://raw.githubusercontent.com/SaulDuenas/Emails_Smart/main/img/smb_logo.png" style="height: 41px; line-height: 100%; outline: none; text-decoration: none; width: 124px; border: 0 none;">
</td>
</tr>
</tbody>
</table>  
</th>
<th class="col-8" align="left" valign="top" style="line-height: 24px; font-size: 16px; min-height: 1px; padding-right: 15px; padding-left: 15px; font-weight: normal; width: 66.666667%; margin: 0;">      
</th>
</tr>
</thead>
</table>
</td>
</tr>
</tbody>
</table>
</div>
<table class="s-3 w-100" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 17px; line-height: 20px; color: #000000; text-align: -webkit-center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td height="16" style="border-spacing: 0px; border-collapse: collapse; line-height: 16px; font-size: 16px; width: 100%; height: 16px; margin: 0;" align="left">
</td>
</tr>
</tbody>
</table>
<img class="img-fluid" style="display: block; height: auto; line-height: 100%; outline: none; text-decoration: none; width: 100%; max-width: 100%; border: 0 none;" src="https://raw.githubusercontent.com/SaulDuenas/Emails_Smart/main/img/candado.png">
<table class="container-fluid pt-5" border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; width: 100%;">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 17px; line-height: 20px; color: #000000; text-align: -webkit-center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 48px 16px 0;" align="left">
<table style="width: 100%; font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; font-style: normal; font-weight: normal; font-size: 17px; line-height: 20px; color: #000000; height: auto; margin-left: auto; margin-right: auto;" class="clear-table" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 17px; line-height: 20px; color: #000000; text-align: -webkit-center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td style="padding-bottom: 25px; border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0;" align="left">  
<h4 style="margin-top: 0; margin-bottom: 0; font-weight: 900; vertical-align: baseline; font-size: 25px; line-height: 29px; font-family: 'Roboto','Arial'; color: #164194; text-shadow: 0 0 10px #FFF;" align="center">Hola, ${nombre}: </h4> 
</td>
</tr>
<tr>
<td class="text-center" style="padding-bottom: 25px; border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0;" align="center"> 
¿Olvidaste tu contraseña?  
</td>
</tr>
<tr>
<td class="text-center ml-4 mr-4" style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0;" align="center"> 
Recibimos una solicitud de recuperación de contraseña para acceder a tu cuenta SBC. El correo con el que realizaste la solicitud es: 
</td>
</tr>
<tr>
<td class="text-center ml-4 mr-4" style="padding-bottom: 25px; width: 100%; border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0;" align="center">  
${email}. 
</td>
</tr>
<tr>
<td class="text-center ml-4 mr-4" style="padding-bottom: 25px; width: 100%; border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0;" align="center">  
Para continuar con el proceso da clic en el siguiente botón:  
</td>
</tr>
<tr>
<td class="text-center ml-4 mr-4" style="padding-bottom: 25px; width: 100%; border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0;" align="center"> 
<a href="${uri}" target="_blank" class="button-blue" style="background-color: #0093D6; text-decoration: none; display: inline-block; color: #FFFFFF; border-radius: 5px; font-weight: bold; font-style: normal; font-size: 17px; line-height: 40px; padding: 0px 40px;">
Crear nueva contraseña
</a>  
</td>
</tr>
<tr>
<td class="text-center ml-4 mr-4" style="padding-bottom: 25px; width: 100%; border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0;" align="center">  
Si tú no hiciste esta solicitud, ignora este correo. </td>
</tr>
<tr>
<td class="text-center  text-important ml-4 mr-4" style="width: 100%; border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 18px; color: #0093D6; font-weight: bold; margin: 0;" align="center">  IMPORTANTE </td>
</tr>
<tr>
<td class="d-flex text-center text-important ml-3 mr-3" style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 18px; color: #0093D6; font-weight: bold; margin: 0;" align="center">  
<table class="mx-auto" align="center" border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; margin: 0 auto;">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 17px; line-height: 20px; color: #000000; text-align: -webkit-center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; margin: 0;" align="left">
<ul class="list-inline  justify-content-center" style="list-style-type: none; text-align: center; padding-left: 0px;">
<li>° Nunca compartas tu contraseña con alguien más.</li>
<li>° Crea contraseñas difíciles de adivinar y nunca utilices información personal.</li>
<li>° Asegúrate de incluir letras mayúsculas y minúsculas, números y símbolos.</li>
<li>° Utiliza contraseñas diferentes para cada cuenta en Internet.</li>
</ul>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table class="clear-table" style="margin-top: 50px; font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; font-style: normal; font-weight: normal; font-size: 17px; line-height: 20px; color: #000000; width: auto; height: auto; margin-left: auto; margin-right: auto;" border="0" cellspacing="0" cellpadding="0">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 17px; line-height: 20px; color: #000000; text-align: -webkit-center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td class="text-center text-message" style="border-spacing: 0px; border-collapse: collapse; line-height: 15px; font-size: 15px; font-style: normal; font-weight: normal; color: #164194; text-shadow: 0px 0px 50px #FFFFFF; margin: 0;" align="center">  Cualquier duda o aclaración envíanos un correo a 
<a class="url-link" href="mailto:asesoria@smartbusinesscorp.com" target="_blank" style="color: #0093D6;"> asesoria@smartbusinesscorp.com</a> </td>
</tr>
<tr>
<td class="text-center text-message" style="border-spacing: 0px; border-collapse: collapse; line-height: 15px; font-size: 15px; font-style: normal; font-weight: normal; color: #164194; text-shadow: 0px 0px 50px #FFFFFF; margin: 0;" align="center">  o un whatsapp al 
<a class="url-link" href="https://api.whatsapp.com/send?phone=525611754467" target="_blank" style="color: #0093D6;">+52 56 1175 4467</a> </td>
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
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 17px; line-height: 20px; color: #000000; text-align: -webkit-center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
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
<span> © 2020 Smart Fund Limited.</span>
<div style="padding-left: 40px; padding-right: 40px;"> No respondas a este correo electrónico. Este buzón no se supervisa y no recibirá respuesta. Si quieres dejar de recibir correos de este remitente,<a href="#" target="_blank" style="color: #00B3F9;"> haz clic aquí.</a> </div>
</div>
</div>  
</td>
</tr>
</tbody>
</table>
<table class="s-3 w-100" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 17px; line-height: 20px; color: #000000; text-align: -webkit-center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td height="16" style="border-spacing: 0px; border-collapse: collapse; line-height: 16px; font-size: 16px; width: 100%; height: 16px; margin: 0;" align="left"> 
</td>
</tr>
</tbody>
</table>
<table class="container-fluid  " border="0" cellpadding="0" cellspacing="0" style="font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; width: 100%;">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 17px; line-height: 20px; color: #000000; text-align: -webkit-center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
<tr>
<td style="border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 0 16px;" align="left">       
<div class="text-center footer-text adjust-width" style="padding-left: 15px; padding-right: 15px; font-size: 10px; line-height: 12px; text-shadow: 0px 0px 50px #FFFFFF;" align="center">  <span style="font-weight: bold; color: #164194;"> SBC SMARTFUND LIMITED ("SBC")</span> Es una empresa de la República de Vanuatu con domicilio comercial en Pot 805/103 Rue D'Auvergne, Port Vila, Vanuatu con número de registro 700358.</div>
</td>
</tr>
</tbody>
</table>
<table class="s-3 w-100" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
<tbody style="background-color: #FFFFFF; font-family: 'Roboto','Arial'; font-style: normal; font-weight: normal; font-size: 17px; line-height: 20px; color: #000000; text-align: -webkit-center; text-shadow: 0px 0px 50px #FFFFFF; height: 100%; with: 100%;">
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
  }
}
