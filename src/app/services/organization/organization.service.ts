import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { catchError, map } from "rxjs/operators";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class OrganizationService {
  constructor(private http: HttpClient) {}
  //baseUri: string = environment.baseURL;
  baseUri = "https://api-dev-virtual-office-org.herokuapp.com";

  headers = new HttpHeaders().set("Content-Type", "application/json");

  getComunity(id_head) {
    
    let url = `${this.baseUri}/api/organization/${id_head}`;
   // let url = `${this.baseUri}/api/organization/105500`;
   
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  getProspect(idSuscriber) {
    let url = `${this.baseUri}/api/organization/prospects/${idSuscriber}`;
    console.log(url);
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  getGuest(idSuscriber) {
    let url = `${this.baseUri}/api/organization/guest/${idSuscriber}`;
    console.log(url);
    return this.http.get(url, { headers: this.headers }).pipe(
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
    console.log(error.error);
    return throwError(error.error.err.errors.email.message);
  }
}
