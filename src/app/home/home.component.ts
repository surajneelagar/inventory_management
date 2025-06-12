import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatImportModule } from '../shared/mat-import/mat-import.module'; 
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { AddInventoryComponent } from '../main/dialog-boxes/add-inventory/add-inventory.component';
import { ExcelImportComponent } from '../main/dialog-boxes/excel-import/excel-import.component';
import { AssignDeviceComponent } from '../main/dialog-boxes/assign-device/assign-device.component';
import { Subscription } from 'rxjs';
import { SearchService } from '../shared/search.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatImportModule, CommonModule,MatMenuModule],  // Import MatImportModule here
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  activeHeader!: string;
  dashboardTitle: string = 'Dashboard';
  inventoryTitle: string = 'Inventory';
  transitTitle: string = ' Transit ';
  private routerSubscription!: Subscription;
  onDashboard: boolean = false;
  constructor(
    private dialog: MatDialog,
    public router: Router, 
    private activatedRoute: ActivatedRoute,
    private searchService: SearchService) {}

  ngOnInit(): void {
    // Set active header based on the current route when the page is loaded
    this.setActiveHeaderFromRoute();

      // Listen to router events to update active header on route changes
      this.routerSubscription = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.setActiveHeaderFromRoute();
        }
      });
  }
  ngOnDestroy(): void {
    // Unsubscribe from router events when the component is destroyed
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchService.setSearchQuery(query);
  }

  setActiveHeader(header: string): void {
    this.activeHeader = header;

    // Navigate based on the clicked header
    switch (header) {
      case 'dashboard':
        this.onDashboard = true;
        this.router.navigate(['/dashboard']);
        
        break;
      case 'inventory':
        this.router.navigate(['/inventory']);
        break;
      case 'transit':
        this.router.navigate(['/transit']);
        break;
      default:
        break;
    }
  }

  setActiveHeaderFromRoute(): void {
    // Default to 'dashboard' if the route is not matched
    const currentRoute = this.router.url;

    if (currentRoute.includes('/dashboard')) {
      this.activeHeader = 'dashboard';
    } else if (currentRoute.includes('/inventory')) {
      this.activeHeader = 'inventory';
    } else if (currentRoute.includes('/transit')) {
      this.activeHeader = 'transit';
    } else {
      // Fallback to dashboard if no known route is found
      this.activeHeader = 'dashboard';
    }
  }
  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddInventoryComponent, {
      width: 'auto', // Optional: specify width of dialog
      height:'420px',
      data: {}, // Optional: Pass data to the dialog
      disableClose: true 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openAssignInventoryDialog() {
    const dialogRef = this.dialog.open(AssignDeviceComponent, {
      width: 'auto', // Optional: specify width of dialog
      data: {}, // Optional: Pass data to the dialog
      disableClose: true 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openImportDialog() {
    const dialogRef = this.dialog.open(ExcelImportComponent, {
      width: '400px', // Optional: specify width of dialog
      data: {}, // Optional: Pass data to the dialog
      disableClose: true 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
