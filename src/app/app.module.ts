import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from "@angular/common/http";

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TableListComponent } from './table-list/table-list.component';
import { TypographyComponent } from './typography/typography.component';
import { IconsComponent } from './icons/icons.component';
import { MapsComponent } from './maps/maps.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UpgradeComponent } from './upgrade/upgrade.component';

import { LoaderComponent } from "./loader/loader.component";
import { LoaderService } from "./services/loader/loader.service";
import { LoaderInterceptor } from "./services/interceptors/loader-interceptor.service";

import { OrganizationComponent } from "./organization/organization.component";
import { AOrganizationComponent } from "./layouts/a-organization/a-organization.component";

import {
  AgmCoreModule
} from '@agm/core';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
Ng2SearchPipeModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
   
    HttpClientModule,

  ],
  declarations: [
    AppComponent,
    LoaderComponent,
    AdminLayoutComponent,
    OrganizationComponent,
    AOrganizationComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
