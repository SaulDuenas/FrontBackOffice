import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { DashboardComponent } from "../app/dashboard/dashboard.component";
import { LoginComponent } from "../app/login/login.component";
import { RegisterComponent } from "../app/register/register.component";
import { AProfileComponent } from "../app/layouts/a-profile/a-profile.component";
import { AHomeComponent } from "../app/layouts/a-home/a-home.component";
import { ProfileComponent } from "../app/profile/profile.component";
import { CuentaComponent } from "../app/cuenta/cuenta.component";
import { TableListComponent } from "../app/table-list/table-list.component";
import { ACuentaComponent } from "../app/layouts/a-cuenta/a-cuenta.component";
import { RegistroComponent } from "../app/registro/registro.component";
import { AAdicionalesComponent } from "../app/layouts/a-adicionales/a-adicionales.component";
import { ASelectplanComponent } from "../app/layouts/a-selectplan/a-selectplan.component";
import { AAddaditionalplanComponent } from "../app/layouts/a-addaditionalplan/a-addaditionalplan.component";
import { AOrganizationComponent } from "../app/layouts/a-organization/a-organization.component";
import { AAddmembershipComponent } from "../app/layouts/a-addmembership/a-addmembership.component";
import { ABonosEmpresarialesComponent } from "../app/layouts/a-bonos-empresariales/a-bonos-empresariales.component";
import { AEcosistemaSmartComponent } from "../app/layouts/a-ecosistema-smart/a-ecosistema-smart.component";
import { AKitVentaComponent } from "../app/layouts/a-kit-venta/a-kit-venta.component";
import { RequestPswComponent } from "../app/request-psw/request-psw.component";
import { from } from "rxjs";
export const routes: Routes = [
  { path: "home", component: AdminLayoutComponent },
  { path: "login", component: LoginComponent },
  { path: "profile", component: AProfileComponent },
  { path: "cuenta", component: ACuentaComponent },
  { path: "registro", component: RegistroComponent },
  { path: "homeregister", component: AHomeComponent },
  { path: "adicional", component: AAdicionalesComponent },
  { path: "selectplan", component: ASelectplanComponent },
  { path: "addplan/:plan", component: AAddaditionalplanComponent },
  { path: "organization", component: AOrganizationComponent },
  { path: "newmembership", component: AAddmembershipComponent },
  { path: "bonos", component: ABonosEmpresarialesComponent },
  { path: "ecosistema", component: AEcosistemaSmartComponent },
  { path: "kit/:id", component: AKitVentaComponent },
  { path: "registro/:invitacion", component: RegisterComponent },
  { path: "newpassword/:token", component: RequestPswComponent },
  { path: "**", redirectTo: "login" },

];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [],
})
export class AppRoutingModule {}
