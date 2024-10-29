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

export class KnowSbcService {

  constructor(private http: HttpClient) {  

  }
   //baseUri: string = environment.baseURL;
   baseUri = "https://api-dev-virtual-office-org.herokuapp.com";
  // baseUri = "https://sbcmexico.us:6000";

   headers = new HttpHeaders().set("Content-Type", "application/json");


   getOurPhilosophy(lang: String = "es") {
      return this.getKnowSBSInfo("frontend_filosofia",lang);
   }


   getAdditionalPlansInfo(lang: String = "es") {
      return this.getKnowSBSInfo("frontend_PlanAdd",lang);
   }  


   getAffiliatesProgInfo(lang: String = "es") {
    return this.getKnowSBSInfo("frontend_ProgAfilia",lang);
   } 

   getCorporateHelpInfo(lang: String = "es") {
    return this.getKnowSBSInfo("frontend_AyudaCorp",lang);
   } 
   

   getKnowSBSInfo( key: String = "",lang: String = "es") {

      let url = `${this.baseUri}/api/knowSBC/${key}/${lang}`;
      
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
