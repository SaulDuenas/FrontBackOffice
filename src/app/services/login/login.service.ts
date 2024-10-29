import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { UserModel } from "../../models/usuario.model";

import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { UsuarioService } from "../../services/usuario/usuario.service";
import { Router } from "@angular/router";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  private url: string = environment.baseURL; 

  userToken: string;

  constructor(
    private http: HttpClient,
    private userService: UsuarioService,
    private router: Router
  ) {
    console.log("leyendo token");
    this.leerToken();
  }

  changePassword(idSuscriber, oldPassword, newPassword) {
    const data = {
      id_suscriber: idSuscriber,
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
    console.log(data);
    return this.http.put(`${this.url}/authenticate/password/change`, data).pipe(
      map((resp) => {
        return resp;
      })
    );


    // const data = {
    //   id_suscriber: idSuscriber,
    //   oldPassword: oldPassword,
    //   newPassword: newPassword,
    // };
    // console.log(data);
    // return this.http.put(`${this.url}/authenticate/password/change`, data).pipe(
    //   map((resp) => {
    //     return resp;
    //   })
    // );
  }

  logout() {
    localStorage.removeItem("token");
    this.router.navigate(["login"]);
  }

  login(usuario: UserModel) {
    let url: string = `${this.url}/authenticate`;
    console.log(url);
    let headers = new HttpHeaders();

    headers = headers.append("content-type", "application/json")

    const authData = {
      ...usuario,
      returnSecureToken: true,
    };
    console.log(authData);
    return this.http.post(url, authData, { headers: headers }).pipe(
      map((resp) => {
        console.log(resp);
        this.guardarToken(resp["token"]);
        return resp;
      }),
      catchError(this.errorMgmt)
    );
  }

  validaEmail(p_email, p_idval) {
    const data = {
      email: p_email,
      idval: p_idval,
    };

    return this.http.post(`${this.url}/api/users/evalidate`, data).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  nuevoUsuario(usuario: UserModel) {
    const authData = {
      ...usuario,
      returnSecureToken: true,
    };

    return this.http.post(`${this.url}/signupNewUser`, authData).pipe(
      map((resp) => {
        this.guardarToken(resp["idToken"]);
        return resp;
      })
    );
  }

  private guardarToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem("token", idToken);

    let hoy = new Date();
    hoy.setSeconds(3600);

    localStorage.setItem("expira", hoy.getTime().toString());
  }

  leerToken() {
    if (localStorage.getItem("token")) {
      console.log("hay token");
      this.userToken = localStorage.getItem("token");
    } else {
      console.log("No hay token");
      this.userToken = "";
    }

    return this.userToken;
  }

  estaAutenticado(): boolean {
    if (this.userToken == undefined) {
      this.router.navigate(["login"]);
    } else {
      console.log(this.userToken);
      if (this.userToken.length < 2) {
        console.log("otra vez token");
        this.router.navigate(["login"]);
      }

      const expira = Number(localStorage.getItem("expira"));
      const expiraDate = new Date();
      expiraDate.setTime(expira);

      if (expiraDate > new Date()) {
        return true;
      } else {
        this.router.navigate(["login"]);
      }
    }
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
    console.log(error);
    return throwError(error.error.err.errors.email.message);
  }
}
