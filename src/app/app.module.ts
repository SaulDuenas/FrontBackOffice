import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from "@angular/common/http";
import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";
import { ToastrModule } from "ngx-toastr";
import { AppComponent } from "./app.component";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { DashboardComponent } from "../app/dashboard/dashboard.component";
import { LoginComponent } from "./login/login.component";
import { AProfileComponent } from "./layouts/a-profile/a-profile.component";
import { ProfileComponent } from "./profile/profile.component";
import {
  UserProfileComponent,
  TooltipListPipe,
} from "../app/user-profile/user-profile.component";
import { TableListComponent } from "../app/table-list/table-list.component";
import { from } from "rxjs";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatTabsModule } from "@angular/material/tabs";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule} from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { CuentaComponent } from "./cuenta/cuenta.component";
import { ACuentaComponent } from "./layouts/a-cuenta/a-cuenta.component";
import { RegistroComponent } from "./registro/registro.component";

import { LoaderComponent } from "./loader/loader.component";
import { LoaderService } from "./services/loader/loader.service";
import { LoaderInterceptor } from "./services/interceptors/loader-interceptor.service";

import { BrowserModule } from "@angular/platform-browser";
import { AdicionalComponent } from "./adicional/adicional.component";
import { AAdicionalesComponent } from "./layouts/a-adicionales/a-adicionales.component";
import { ASelectplanComponent } from "./layouts/a-selectplan/a-selectplan.component";
import { SelectplanComponent } from "./selectplan/selectplan.component";
import { AddaditionalplanComponent } from "./addaditionalplan/addaditionalplan.component";
import { AAddaditionalplanComponent } from "./layouts/a-addaditionalplan/a-addaditionalplan.component";
import { OrganizationComponent } from "./organization/organization.component";
import { AOrganizationComponent } from "./layouts/a-organization/a-organization.component";
import { AddMembershipComponent } from "./add-membership/add-membership.component";
import { AAddmembershipComponent } from "./layouts/a-addmembership/a-addmembership.component";
import { BonosEmpresarialesComponent } from "./bonos-empresariales/bonos-empresariales.component";
import { ABonosEmpresarialesComponent } from "./layouts/a-bonos-empresariales/a-bonos-empresariales.component";
import { ChartsModule } from "ng2-charts";

import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { EcosistemaSmartComponent } from "./ecosistema-smart/ecosistema-smart.component";
import { AEcosistemaSmartComponent } from "./layouts/a-ecosistema-smart/a-ecosistema-smart.component";
import { AKitVentaComponent } from "./layouts/a-kit-venta/a-kit-venta.component";
import { KitVentaComponent } from "./kit-venta/kit-venta.component";

import { ModalStartComponent } from "./modal-start/modal-start.component";
import { RegisterComponent } from "./register/register.component";
import { RequestPswComponent } from './request-psw/request-psw.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HomeComponent   } from './registerUser/home/home.component';
import { PersonalesComponent } from './registerUser/personales/personales.component';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { GaugeChartModule } from 'angular-gauge-chart';
import { AHomeComponent } from './layouts/a-home/a-home.component'
// search module
import { Ng2SearchPipeModule } from 'ng2-search-filter';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/lang/', '.json');
}
@NgModule({
  imports: [
    Ng2SearchPipeModule,
    GaugeChartModule,
    MatCarouselModule.forRoot(),
    ChartsModule,
    BrowserModule,
    MatSelectModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatRippleModule,
    MatButtonModule,
    MatInputModule,
    MatRadioModule,
    MatTabsModule,
    MatCheckboxModule,
    MatStepperModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonToggleModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    SweetAlert2Module.forRoot(),
    TranslateModule.forRoot({
    loader: {
              provide: TranslateLoader,
              useFactory: (createTranslateLoader),
              deps: [HttpClient]
            }
    })
  ],
  declarations: [
    TooltipListPipe,
    AppComponent,
    AdminLayoutComponent,
    DashboardComponent,
    LoginComponent,
    AProfileComponent,
    ProfileComponent,
    UserProfileComponent,
    TableListComponent,
    ACuentaComponent,
    RegistroComponent,
    LoaderComponent,
    AdicionalComponent,
    AAdicionalesComponent,
    ASelectplanComponent,
    SelectplanComponent,
    AddaditionalplanComponent,
    AAddaditionalplanComponent,
    OrganizationComponent,
    AOrganizationComponent,
    AddMembershipComponent,
    AAddmembershipComponent,
    BonosEmpresarialesComponent,
    ABonosEmpresarialesComponent,
    EcosistemaSmartComponent,
    AEcosistemaSmartComponent,
    HomeComponent,
    AKitVentaComponent,
    KitVentaComponent,
    ModalStartComponent,
    RegisterComponent,
    RequestPswComponent,
    PersonalesComponent,
    AHomeComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
