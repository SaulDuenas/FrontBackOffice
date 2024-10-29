import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from '../../../environments/environment';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class BonosService {
  baseUri: string = "https://sbcmexico.us:4000/api/1.0" //environment.baseURL 
  headers = new HttpHeaders().set("Content-Type", "application/json");

  constructor(private http: HttpClient) { }
  
  /********************************************************************** */
  /*                          Gráfica Bonos Pagados                       */
  /********************************************************************** */
  getMontoSmartAccount(idSuscriptor) {
    let url = `${this.baseUri}/bonos/monto/${idSuscriptor}`;
    console.log(url);
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        console.log(res)
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  /********************************************************************** */
  /*                          Gráfica Bonos Pagados                       */
  /********************************************************************** */
  getGraficaBonosPagados(idSuscriptor) {
    let url = `${this.baseUri}/bonos/grafica/pagados/${idSuscriptor}`;
    console.log(url);
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        console.log(res)
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  /********************************************************************** */
  /*                           Montos Bonos Pagados                       */
  /********************************************************************** */
  getMontosBonosPagados(idSuscriptor) {
    let url = `${this.baseUri}/bonos/pagados/${idSuscriptor}`;
    console.log(url);
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        console.log(res)
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }


  /********************************************************************** */
  /*                           Montos Bonos Pagados                       */
  /********************************************************************** */
  getMontosBonosPagadosDinamico(idSuscriptor,periodo) {
    let url = `${this.baseUri}/bonos/grafica/pagados/${periodo}/${idSuscriptor}`;
    console.log(url);
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        console.log(res)
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  /********************************************************************** */
  /*                          Monto Bonos por Cobrar                      */
  /********************************************************************** */
  getMontoBonosPPagar(idSuscriptor) {
    let url = `${this.baseUri}/bonos/porcobrar/${idSuscriptor}`;
    console.log(url);
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        console.log(res)
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }


  /********************************************************************** */
  /*                       Tabla Comisiones x Cobrar                      */
  /********************************************************************** */
  getComisionesXCobrar(idSuscriptor,mes,dia) {
    let url = `${this.baseUri}/bonos/lista/pcobrar/${idSuscriptor}/${dia}/${mes}`;
    console.log(url);
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  /********************************************************************** */
  /*                      Obtiene el proximo novel Obj                    */
  /********************************************************************** */
  getNextLevel(idSuscriptor) {
    let url = `${this.baseUri}/bonos/nextlevel/${idSuscriptor}`;  // https://sbcmexico.us:3000/api/comisiones/cobradas/${idSuscriptor}/${lang}
    console.log(url);
    return this.http.get(url, { headers: this.headers }).pipe(
        map((res: Response) => {
          return res || {};
        }),
        catchError(this.errorMgmt)
    );
  }

  /********************************************************************** */
  /*                        Tabla Comisiones Cobradas                     */
  /********************************************************************** */
  getComisionesCobradas(idSuscriptor, mes,dia) {
    console.log("cobradas" + idSuscriptor + " " + dia +  " " + mes)
    let url = `${this.baseUri}/bonos/lista/pagados/${idSuscriptor}/${mes}/${dia}`;  // https://sbcmexico.us:3000/api/comisiones/cobradas/${idSuscriptor}/${lang}
    console.log(url);
    return this.http.get(url, { headers: this.headers }).pipe(
        map((res: Response) => {
          return res || {};
        }),
        catchError(this.errorMgmt)
    );
  }

  /********************************************************************** */
  /*                            Niveles Calificados                       */
  /********************************************************************** */
  getNivelesCalificados(idSuscriptor) {
    let url = `${this.baseUri}/bonos/nivelescalificados/${idSuscriptor}`; 
    console.log(url);
    return this.http.get(url, { headers: this.headers }).pipe(
        map((res: Response) => {
          return res || {};
        }),
        catchError(this.errorMgmt)
    );
  }

  /********************************************************************** */
  /*                                 Fecha Pago                           */
  /********************************************************************** */
  getFechaPago(idSuscriptor) {
    let url = `${this.baseUri}/bonos/fechapago/${idSuscriptor}`; 
    console.log(url);
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
          return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  /********************************************************************** */
  /*                     Gráfica Niveles de Acumulación                   */
  /********************************************************************** */
  getNivelesAcumulacion(idSuscriptor) {
    let url = `${this.baseUri}/bonos/nivelesacumulacion/${idSuscriptor}`; 
    console.log(url);
    return this.http.get(url, { headers: this.headers }).pipe(
        map((res: Response) => {
          return res || {};
        }),
        catchError(this.errorMgmt)
    );
}
  

  /********************************************************************** */
  /*              Obtiene Rango Actual y Fecha de Calificación            */
  /********************************************************************** */
  getRangoActual(idSuscriptor) {
    let url = `${this.baseUri}/bonos/rango/${idSuscriptor}`; 
    console.log(url);
    return this.http.get(url, { headers: this.headers }).pipe(
        map((res: Response) => {
          return res || {};
        }),
        catchError(this.errorMgmt)
    );
  }

  /********************************************************************** */
  /*              Obtiene Rango Actual y Fecha de Calificación            */
  /********************************************************************** */
  getnexGoal(idSuscriptor) {
    let url = `${this.baseUri}/bonos/nextgoal/${idSuscriptor}`; 
    console.log(url);
    return this.http.get(url, { headers: this.headers }).pipe(
        map((res: Response) => {
          return res || {};
        }),
        catchError(this.errorMgmt)
    );
  }

  /********************************************************************** */
  /*               Obtiene Acumulado Actual y Fecha de Corte              */
  /********************************************************************** */
  getAcumuladoActual(idSuscriptor) {
    let url = `${this.baseUri}/bonos/acumuladoactual/${idSuscriptor}`; 
    console.log(url);
    return this.http.get(url, { headers: this.headers }).pipe(
        map((res: Response) => {
          return res || {};
        }),
        catchError(this.errorMgmt)
    );
  }
  getSaldosMensuales(idSuscriptor) {
    let url = `${this.baseUri}/api/comisiones/bono/${idSuscriptor}`;
    console.log(url);
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
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
    console.log("error");
    return throwError(error.error.err.errors.email.message);
  }
}
