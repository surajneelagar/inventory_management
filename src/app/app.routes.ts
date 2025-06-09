import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';  // adjust the path if needed
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { InventoryComponent } from './main/inventory/inventory.component';
import { TransitComponent } from './main/transit/transit.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'transit', component: TransitComponent }  // Add Transit route here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
