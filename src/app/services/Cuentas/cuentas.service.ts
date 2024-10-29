import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { environment } from "../../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class CuentasService {
  baseUri: string = environment.baseURL; 
  baseUri2: string = "https://sbcmexico.us:4000/api/1.0"
  userToken;
  //headers = new HttpHeaders().set("Content-Type", "application/json");

  constructor(private http: HttpClient) { }
  /********************************************************************************************************* */
  /*                                             Leer Token                                                  */
  /********************************************************************************************************* */
  leerToken() {
    console.log("leyendo token");
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
    } else {
      console.log("No hay token");
      this.userToken = "";
    }

    return this.userToken;
  }
  
  /********************************************************************** */
  /*                 Saldo Membresía por Mes - Año  Gadget                */
  /********************************************************************** */
  getGadgetSaldoMembresia(idSuscriptor,periodo) {
    let url = `${this.baseUri2}/cuenta/smartaccount/gadget/membresia/saldo/${periodo}/${idSuscriptor}`;
    this.leerToken()
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  /********************************************************************** */
  /*              Saldo P. Adicionales por Mes - Año  Gadget              */
  /********************************************************************** */
  getGadgetSaldoPlanesAdicionales(idSuscriptor,periodo) {
    let url = `${this.baseUri2}/cuenta/smartaccount/gadget/planes/saldo/${periodo}/${idSuscriptor}`; 
    this.leerToken()
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  /********************************************************************** */
  /*               Saldo Rendimientos por Mes - Año  Gadget              */
  /********************************************************************** */
  getGadgetRendimientos(idSuscriptor,periodo) {
    let url = `${this.baseUri2}/cuenta/smartaccount/gadget/rendimientos/saldo/${periodo}/${idSuscriptor}`; 
    this.leerToken()
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  /********************************************************************** */
  /*                   Saldo Retiros por Mes - Año  Gadget                */
  /********************************************************************** */
  getGadgetRetiros(idSuscriptor,periodo) {
    let url = `${this.baseUri2}/cuenta/smartaccount/gadget/retiros/${periodo}/${idSuscriptor}`; 
    this.leerToken()
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }
  /********************************************************************** */
  /*              Obtiene el monto total de la cuenta Smart               */
  /********************************************************************** */
  getSaldoTotalMembresia(idSuscriptor) {
    let url = `${this.baseUri2}/cuenta/smartaccount/total/${idSuscriptor}`;
    this.leerToken()
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  /********************************************************************** */
  /*                           Saldo Membresía Mes y Año                  */
  /********************************************************************** */
  getSaldoMembresia(idSuscriptor,periodo) {
    let url = `${this.baseUri2}/cuenta/smartaccount/membresia/saldo/${periodo}/${idSuscriptor}`;
    this.leerToken()
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  /********************************************************************** */
  /*           Grafica Smart Account Membresía + Planes (Azul)            */
  /********************************************************************** */
  getGraficaSmarAccountMembresiaPlanes(idSuscriptor,periodo) {
    let url = `${this.baseUri2}/cuenta/smartaccount/grafica/azul/${periodo}/${idSuscriptor}`;
    this.leerToken()
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken);
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  /********************************************************************** */
  /*            Obtiene el nivel que elsocio tiene actualmente            */
  /********************************************************************** */
  getNivelSocio(id_Cliente) {
    let url = `${this.baseUri}/api/users/nivel/${id_Cliente}`;
    this.leerToken()
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  /********************************************************************** */
  /*               Grafica Smart Account Membresía (verde)                */
  /********************************************************************** */
  getGraficaSmarAccountMembresia(idSuscriptor,periodo) {
    let url = `${this.baseUri2}/cuenta/smartaccount/grafica/${periodo}/${idSuscriptor}`;
    this.leerToken()
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  postRetiro(id_cuenta, id_susciber, ret_usd) { // TODO token
    let data = {
      id_cuenta: id_cuenta,
      id_suscriber: id_susciber,
      ret_usd: ret_usd,
    };
    console.log(data);
    let url = `${this.baseUri}/api/cuenta/retiro`;
    return this.http.post(url, data).pipe(catchError(this.errorMgmt));
  }

  getMontoActual(id_Cliente) {
    let url = `${this.baseUri}/api/calculate/current/${id_Cliente}`;
    this.leerToken()
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  postNewAccount(id_susciber, id_plan, fec_contrat, monto, porcent) { //TODO Token
    let data = {
      id_susciber: id_susciber,
      id_plan: id_plan,
      fec_contrat: fec_contrat,
      monto: monto,
      porcent: porcent,
    };
    let url = `${this.baseUri}/api/cuenta/new`;
    console.log("userdata" + JSON.stringify(data));
    return this.http.post(url, data).pipe(catchError(this.errorMgmt));
  }

  getEstadoCuenta(id_Cliente,lang:string="es") {
    console.log("servicio obteniendo estado de cuenta " + id_Cliente);
    this.leerToken()
    let url = `${this.baseUri}/api/cuenta/estado/${id_Cliente}`;   //https://sbcmexico.us:3000/api/cuenta/estado/${idSuscriptor}/${lang}
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        console.log(res);
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  getMontoInicial(id_Cliente) {
    let url = `${this.baseUri}/api/calculate/initial/${id_Cliente}`;
    this.leerToken()
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  getNoPlanes(id_Cliente) {
    let url = `${this.baseUri}/api/calculate/count/${id_Cliente}`;
    this.leerToken()
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  getMembresia(id_Cliente, type): Observable<any> {
    let url = `${this.baseUri}/api/cuenta/${id_Cliente}/${type}`;
    this.leerToken()
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  getPlanes(idCliente) {
    let url = `${this.baseUri}/api/cuenta/plan/${idCliente}/customer`;
    this.leerToken()
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  getPlanById(id_cuenta) {
    console.log(id_cuenta);
    let url = `${this.baseUri}/api/cuenta/${id_cuenta}/plan`;
    this.leerToken()
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }
  getPlan(id_plan): Observable<any> {
    let url = `${this.baseUri}/api/cuenta/plan/selectplan/${id_plan}`;
    this.leerToken()
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  getDetInversion(idSuscriber, id_cta, month, year): Observable<any> {
    let url = `${this.baseUri}/smartaccount/detalles/inversion/${year}/${month}/${id_cta}/${idSuscriber}`;
    this.leerToken()
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  getCtaRendMesAnio(id_cta, month, year): Observable<any> {
    let url = `${this.baseUri}/api/cuenta/${id_cta}/rendimientos/${month}/${year}`;
    this.leerToken()
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  getCtaRend(id_cta, type): Observable<any> {
    let url = `${this.baseUri}/api/cuenta/${id_cta}/rendimientos/${type}`;
    this.leerToken()
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
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

    return throwError(error.error.err.errors.email.message);
  }
}
