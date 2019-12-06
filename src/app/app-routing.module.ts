import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { DashboardComponent } from './components/dashboard/dashboard.component'
import { HistoricalComponent } from './components/historical/historical.component'
import { LogsComponent } from './components/logs/logs.component'
import { SettingsComponent } from './components/settings/settings.component'
import { AuthGuard } from './guards/auth.guard'
import { LoginGuard } from './guards/login.guard'
import { LoginComponent } from './components/login/login.component'
import { SideBarComponent } from './components/sideBar/sideBar.component'
import { RegistrationComponent } from './components/registration/registration.component'
import { AdminSideBarComponent } from './components/admin/adminSideBar/adminSideBar.component'
import { AdminGuard } from './guards/admin.guard'
import { AdminSettingsComponent } from './components/admin/adminSettings/adminSettings.component'
import { AdminUserManagementComponent } from './components/admin/adminUserMgt/adminUserMgt.component'
import { LanguageComponent } from './components/admin/language/language.component'
import { SetupComponent } from './components/setup/setup.component'
import { SetupGuard } from './guards/setup.guard'

const routes: Routes = [
  {path: '', redirectTo: 'setup', pathMatch: 'full'},
  {path: 'setup', component: SetupComponent, canActivate:[SetupGuard]},
  {path: 'login', component: LoginComponent, canActivate:[LoginGuard]},
  {path: 'register', component: RegistrationComponent, canActivate:[LoginGuard]},
  {path: 'user', component: SideBarComponent, canActivate:[AuthGuard],
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardComponent, pathMatch:'full'},
      {path: 'history', component: HistoricalComponent},
      {path: 'logs', component: LogsComponent},
      {path: 'settings', component: SettingsComponent}
    ]},
  {path: 'system', component: AdminSideBarComponent, canActivate:[AdminGuard],
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: AdminSettingsComponent, pathMatch: 'full'},
      {path: 'users', component: AdminUserManagementComponent, pathMatch: 'full'},
      {path: 'language', component: LanguageComponent, pathMatch: 'full'}
    ]},
  { path: '**', redirectTo: 'user'}
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
