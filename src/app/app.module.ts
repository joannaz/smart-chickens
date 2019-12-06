import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgxDatatableModule } from '@swimlane/ngx-datatable'
import { CodemirrorModule } from '@ctrl/ngx-codemirror'
import { ChartsModule } from 'ng2-charts'
import { LeafletModule } from '@asymmetrik/ngx-leaflet'
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker'
import { GoogleChartsModule } from 'angular-google-charts'
import 'codemirror/mode/javascript/javascript'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './components/app/app.component'

// Guards
import { AuthGuard } from './guards/auth.guard'
import { LoginGuard } from './guards/login.guard'
import { AdminGuard } from './guards/admin.guard'
import { SetupGuard } from './guards/setup.guard'

// Components
import { DoorDisplayComponent } from './components/doorDisplay/doorDisplay.component'
import { SideBarComponent } from './components/sideBar/sideBar.component'
import { CardComponent } from './components/card/card.component'
import { CardSectionComponent } from './components/cardSection/cardSection.component'
import { CardIconComponent } from './components/cardIcon/cardIcon.component'
import { DashboardComponent } from './components/dashboard/dashboard.component'
import { HistoricalComponent } from './components/historical/historical.component'
import { LogsComponent } from './components/logs/logs.component'
import { SettingsComponent, ConfirmDialogComponent } from './components/settings/settings.component'
import { LoginComponent } from './components/login/login.component'
import { RegistrationComponent } from './components/registration/registration.component'
import { AdminSideBarComponent } from './components/admin/adminSideBar/adminSideBar.component'
import { AdminSettingsComponent } from './components/admin/adminSettings/adminSettings.component'
import { AdminUserManagementComponent } from './components/admin/adminUserMgt/adminUserMgt.component'
import { LanguageComponent } from './components/admin/language/language.component'
import { FileUploadModule } from 'ng2-file-upload';
import { CodeEditorComponent, ConfirmCodeDialogComponent } from './components/admin/codeEditor/codeEditor.component'
import { SetupComponent } from './components/setup/setup.component'

// Angular Material Imports
import {MatRadioModule} from '@angular/material/radio'
import {MatSidenavModule} from '@angular/material/sidenav'
import {DemoMaterialModule} from './../material-module'

// Helper imports
import { TimeagoModule } from 'ngx-timeago'
import { MomentModule } from 'angular2-moment'
import { FormsModule } from '@angular/forms'

// Services
import { AuthenticationService } from './services/authentication.service'
import { DoorService } from './services/door.service'
import { RegisterService } from './services/register.service'
import { AdminService } from './services/admin.service'
import { SystemService } from './services/system.service'
import { TitleService } from './services/title.service'
import { UserService } from './services/user.service'
import { CodeService } from './services/code.service'
import { UpdateService } from './services/update.service'

import { ErrorInterceptor } from './helpers/error.interceptor'
import { JwtInterceptor } from './helpers/jwt.interceptor'


@NgModule({
  declarations: [
    AppComponent,
    DoorDisplayComponent,
    SideBarComponent,
    CardComponent,
    CardSectionComponent,
    CardIconComponent,
    DashboardComponent,
    HistoricalComponent,
    LogsComponent,
    SettingsComponent,
    LoginComponent,
    RegistrationComponent,
    AdminSideBarComponent,
    AdminSettingsComponent,
    AdminUserManagementComponent,
    LanguageComponent,
    ConfirmDialogComponent,
    ConfirmCodeDialogComponent,
    CodeEditorComponent,
    SetupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatRadioModule,
    MatSidenavModule,
    DemoMaterialModule,
    TimeagoModule.forRoot(),
    MomentModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxDatatableModule,
    CodemirrorModule,
    ChartsModule,
    LeafletModule,
    LeafletModule.forRoot(),
    NgxMaterialTimepickerModule.forRoot(),
    FileUploadModule,
    GoogleChartsModule.forRoot()
  ],
  providers: [
    AuthGuard,
    LoginGuard,
    AdminGuard,
    SetupGuard,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AuthenticationService,
    DoorService,
    RegisterService,
    AdminService,
    SystemService,
    TitleService,
    UserService,
    CodeService,
    UpdateService
  ],
  entryComponents: [
    ConfirmDialogComponent,
    SettingsComponent,
    ConfirmCodeDialogComponent,
    CodeEditorComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
