import { Injectable,EventEmitter } from '@angular/core';
import { TranslateService,LangChangeEvent } from '@ngx-translate/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

import countryLangSource from "../../../assets/lang/CountryLang.json";
import languagesSupportSource from "../../../assets/lang/SupportLang.json";

import { exit } from 'process';

declare interface LangCountry {
  code: string;
  country_name: string;
  language: string;
}

declare interface Tongue {
  id: string;
  name: string;
  
}

declare interface Language {
  id: string;
  short_name: string;
  title: string;
  tongues: Tongue[];
  path: string;
}

export let LanguageList: Language[] = languagesSupportSource;
export let countrylanglist: LangCountry[] = countryLangSource;

export var selectedLanguage = 'en';  // english default

@Injectable({
  providedIn: 'root'
})


export class TranslateEngineService {

    baseUrlGetCountry = "https://ipinfo.io/?token=1e6271f2449986";
    headers = new HttpHeaders().set("Content-Type", "application/json"); 
    translateCore: TranslateService;

    constructor(private http: HttpClient,
                private translate: TranslateService) { 

      this.translateCore = translate;

      // Load support Languages 
      let Langs = Array<string>();
      
      let itemsProcessed = 0;

      LanguageList.forEach((lang, index, array) => { 
        Langs.push(lang.id);
        lang.title = this.getTongueName(selectedLanguage,lang.tongues);

        itemsProcessed++;
        if(itemsProcessed === array.length)  this.translateCore.addLangs(Langs);       // this.translateCore.addLangs(['es', 'en']);
      });

      // select default lang
      this.translateCore.setDefaultLang(selectedLanguage);
      this.translateCore.use(selectedLanguage);
           
    //console.log(countryLangList);

  }
  
  public onLangChangeSuscription(fun: Function) {
    this.translateCore.onLangChange.subscribe((item) => fun());
  }

  public getLanguages() {
    return LanguageList;
  }

  public changeLangByCountry(country_code:string) {
    countrylanglist.forEach(item => {

      if (item.code == country_code) {
        console.log(item);
        this.changeLang(item.language);
        exit;
      }
    });
  }

  public changeLang(lang: string) {
    selectedLanguage = lang;
    this.translateCore.use(selectedLanguage);

    LanguageList.forEach (lang => {
      lang.title = this.getTongueName(selectedLanguage,lang.tongues);
    });
  }


  public getLangSelected() {
    return selectedLanguage;
  } 

  public getTranslate(tag: string) {

    var retval: string="";
    this.translateCore.get(tag).subscribe((res: string) => {
        
        retval = res;
    });

    return retval; 

  }

  public getStreamTranslate(tag: string,stream: Object) {

    var retval: string="";
    this.translateCore.stream(tag,stream).subscribe((res: string) => { 
      retval = res;
    });

    return retval; 

  }

  public getNameLang() {
    var retval="";
  
    LanguageList.forEach (lang => {
      if (lang.id == selectedLanguage) {
        retval = lang.short_name;
        exit;
      }
    });

    return retval;
  }


  public getTongueName(tag:string,tongue:Tongue[]) {

    var retval="";
    tongue.forEach(tong => {
      if (tong.id == tag) {
        retval = tong.name;
        exit;
      }
    });

    return retval;
  }

  getCountry_Client() {
    let url = `${this.baseUrlGetCountry}`;
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
    console.log(error.error);
    return throwError(error.error.err.errors.email.message);
  }
 
}

