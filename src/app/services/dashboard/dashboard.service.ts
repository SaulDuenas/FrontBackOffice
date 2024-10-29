import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { catchError, map } from "rxjs/operators";
import {HttpClient,HttpHeaders,HttpErrorResponse} from "@angular/common/http";
import { throwError } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
userToken
/********************************************************************************************************* */
/*                                                 Variables                                               */
/********************************************************************************************************* */
  constructor(private http: HttpClient) {}
  baseUri: string = "https://sbcmexico.us:4000/api/1.0"; // environment.baseURL;
  //headers = new HttpHeaders().set("Content-Type", "application/json").append("Authorization","");

/********************************************************************************************************* */
/*                                       Grafica Saldos Smart Account                                      */
/********************************************************************************************************* */
  getSmartAccount(idCliente, periodo) {
    let url = `${this.baseUri}/dashboard/saldo/${periodo}/cliente/${idCliente}`;
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

/********************************************************************************************************* */
/*                                         Grafica Ejecutivo master                                        */
/********************************************************************************************************* */
  getMasterExecutive(idCliente) {
    let url = `${this.baseUri}/dashboard/afiliadosEMaster/${idCliente}`;
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

/********************************************************************************************************* */
/*                                     Grafica Afiliados Ejecutivo master                                  */
/********************************************************************************************************* */
  getAfiliadosMasterExecutive(idCliente) {
    let url = `${this.baseUri}/dashboard/afiliadosEMaster/${idCliente}`;
    console.log(url)
    let headers = new HttpHeaders();
    this.leerToken()
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        console.log(res)
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

/********************************************************************************************************* */
/*                                       Grafica Semans Ejecutivo master                                   */
/********************************************************************************************************* */
  getSemanasMasterExecutive(idCliente) {
    let url = `${this.baseUri}/dashboard/semanasEMaster/${idCliente}`;
    console.log(url)
    let headers = new HttpHeaders();
    this.leerToken()
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        console.log(res)
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

/********************************************************************************************************* */
/*                                          Bonos generados Monto                                          */
/********************************************************************************************************* */
  getMontoBonosGenerados(idCliente,periodo) {
    let url = `${this.baseUri}/dashboard/bonos_generados/${periodo}/cliente/${idCliente}`;
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
/*              Porcentaje de crecimiento Bonos x Mex xAño              */
/********************************************************************** */
  getCrecimientoBonos(idSuscriptor,periodo) {
    let url = `${this.baseUri}/dashboard/bonos/porcentaje/${periodo}/${idSuscriptor}`; 
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
/*           Porcentaje de crecimiento Comunidad x Mex xAño             */
/********************************************************************** */
  getCrecimientoComunidad(idSuscriptor,periodo) {
    let url = `${this.baseUri}/dashboard/comunidad/porcentaje/${periodo}/${idSuscriptor}`; 
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
        map((res: Response) => {
          return res || {};
        }),
        catchError(this.errorMgmt)
    );
  }

/********************************************************************************************************* */
/*                                       Socios generados Cantidad                                         */
/********************************************************************************************************* */
  getSociosGeneradosCantidad(idCliente,periodo) {
    let url = `${this.baseUri}/dashboard/comunidad/${periodo}/cliente/${idCliente}`;
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

/********************************************************************************************************* */
/*                                 Grafica de Bonos generados Cantidad                                     */
/********************************************************************************************************* */
  getGraficaBonosGeneradosCantidad(idCliente,periodo) {
    let url = `${this.baseUri}/dashboard/grafica/bonos/${periodo}/${idCliente}`;
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

/********************************************************************************************************* */
/*                                Grafica de Socios generados Cantidad                                     */
/********************************************************************************************************* */
  getGraficaSociosGeneradosCantidad(idCliente,periodo) {
    let url = `${this.baseUri}/dashboard/grafica/comunidad/${periodo}/${idCliente}`;
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

/********************************************************************************************************* */
/*                                             Ingreso Mensual                                             */
/********************************************************************************************************* */
  ingresosGenerados(idCliente) {
    let url = `${this.baseUri}/dashboard/ingreso_mensual/${idCliente}`;
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json").append("x-access-token", this.userToken)
    return this.http.get(url, { headers: headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

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

/********************************************************************************************************* */
/*                                            Manejo de errores                                            */
/********************************************************************************************************* */
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
