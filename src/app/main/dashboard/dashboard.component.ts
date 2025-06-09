import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatImportModule } from '../../shared/mat-import/mat-import.module';
import { CommonModule } from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { Dashboard, UserList } from '../../models/table'
import {animate, state, style, transition, trigger} from '@angular/animations';
import { DeviceHistoryComponent } from '../dialog-boxes/device-history/device-history.component';
import { MatDialog } from '@angular/material/dialog';
import { ImportExcelService } from '../../services/import-excel.service';
import { addInventory } from '../../models/dialog-boxes';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatImportModule, CommonModule,MatTooltipModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  cardLable = ['All Devices', 'Non-Compliant','Returnable', 'Warranty Expired', 'In Transit'];
  inventoryDisplayedColumns: string[] = ['serialNumber','warrantyTill','lastSyncDate','model','status','type']; 
  inventoryToDisplayWithExpand = [...this.inventoryDisplayedColumns, 'expand']; 
  userDisplayedColumns: string[] = ['displayName', 'allocatedMachinesCount', 'deAllocatedMachinesCount','location']; 
  userDisplayedColumnsWithExpand= [...this.userDisplayedColumns, 'expand']; 
  inventoryDataSource :Dashboard[] = [];
  userDataSource : UserList[] = [];
  expandedElement!: Dashboard | null;
  isLoading: boolean = false; 
  page: number = 1; 
  pageSize: number = 50;
  userEmailId : any; 
  deviceData!: any[];
  searchQuaryInventory = new FormControl('');
  searchQuaryUser = new FormControl('')
  filterParams: any = {
    inventorySearch: '',
    // serialNumber: '',
    // orderId: '',
    // status: '',
  }
  userfilterParams: any = {
    displayName: ''
  }
  private unsubscribe$ = new Subject<void>(); // Subject to manage unsubscriptions
  
  constructor(
    private dialog: MatDialog,
    private  _importExcelService: ImportExcelService
  ){
    
  }

  ngOnInit(): void {
    this.getInventoryList();
    this.getUserList();  
    // Initialize the debounced search
    this.initializeInventorySearch();
    this.initializeUserSearch();
}


initializeInventorySearch(): void {
  // Debounced search for inventory
  this.searchQuaryInventory.valueChanges.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    switchMap((inventoryValue) => {
      console.log('Inventory search input:', inventoryValue);

      this.filterParams = {
        inventorySearch: inventoryValue,
        // serialNumber: inventoryValue,
        // orderId: inventoryValue,
        // status: inventoryValue,
      };
      this.page = 1;
      this.inventoryDataSource = [];
      this.isLoading = true; // Show loading indicator
      console.log(this.filterParams);
      
      return this._importExcelService.inventoryList(this.filterParams, this.page, this.pageSize);
    }),
    takeUntil(this.unsubscribe$) // Unsubscribe when component is destroyed
  ).subscribe(
    (inventoryList: any) => {
      if (inventoryList && inventoryList.length) {
        this.inventoryDataSource = [...this.inventoryDataSource, ...inventoryList];
      } else {
        console.error('Invalid response structure');
      }
      this.isLoading = false;
    },
    (error) => {
      console.error('Failed to fetch inventory data', error);
      this.isLoading = false;
    }
  );
}

initializeUserSearch(): void {
  // Debounced search for users
  this.searchQuaryUser.valueChanges.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    switchMap((userValue) => {
      console.log('User search input:', userValue);
      this.userfilterParams = { 
        displayName: userValue 
      };
      this.page = 1;
      this.userDataSource = [];
      this.isLoading = true; // Show loading indicator
      return this._importExcelService.userList(this.userfilterParams, this.page, this.pageSize);
    }),
    takeUntil(this.unsubscribe$) // Unsubscribe when component is destroyed
  ).subscribe(
    (userList: any) => {
      if (userList && userList.length) {
        this.userDataSource = [...this.userDataSource, ...userList];
      } else {
        console.error('Invalid response structure');
      }
      this.isLoading = false;
    },
    (error) => {
      console.error('Failed to fetch user data', error);
      this.isLoading = false;
    }
  );
}

ngOnDestroy(): void {
  // Ensure all subscriptions are cleaned up when component is destroyed
  this.unsubscribe$.next();
  this.unsubscribe$.complete();
  console.log('Component destroyed');
}

  // Define a map of label to color
  labelColorMap: { [key: string]: string } = {
    'All Devices': '#5873a4',      
    'Non-Compliant': '#106ebe',     
    'Returnable': '#db135b', 
    'Warranty Expired': '#ffc40c', 
    'In Transit': '#284481'    
  };

  // Function to return background color based on label
  getCardColor(label: string): string {
    return this.labelColorMap[label] || '#ffffff';  
  }

  getInventoryList() {
    this.isLoading = true; 
    this._importExcelService.inventoryList(this.filterParams, this.page, this.pageSize).subscribe(
      (inventoryList:any) => {
        // console.log('Inventory List Response:', inventoryList);
        if (inventoryList && !!inventoryList?.length) {
          this.inventoryDataSource = [...this.inventoryDataSource, ...inventoryList];
          // console.log('Inventory DataSource:', this.inventoryDataSource);
        } else {
          console.error('Invalid response structure');
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Failed to fetch inventory data', error);
        this.isLoading = false;
      }
    );
  }

  getUserList(){
    this._importExcelService.userList(this.userfilterParams, this.page, this.pageSize).subscribe(
      (usersList: any) => {
      // console.log("User List Api",users);
      if (usersList && !!usersList?.length) {
        this.userDataSource = [...this.userDataSource, ...usersList];
        // console.log('Inventory DataSource:', this.userDataSource);
      } else {
        console.error('Invalid response structure');
      }
      this.isLoading = false;
    },
    (error) => {
      console.error('Failed to fetch inventory data', error);
      this.isLoading = false;
    })
  }
  
  getDeviceData(userEmailId: string) {
    this._importExcelService.deviceHistoryEmail(userEmailId)
      .subscribe((deviceData: any[]) => {
        this.deviceData = deviceData;
      });
  }
  onInventoryTableScroll(event: any) {
    const bottom = event.target.scrollHeight - event.target.scrollTop - event.target.clientHeight <= 10;
    if (!this.isLoading && bottom) {
      this.page++;
      this.getInventoryList();
    }
  }
  onUserTableScroll(event: any) {
    const bottom = event.target.scrollHeight - event.target.scrollTop - event.target.clientHeight <= 10;
    if (!this.isLoading && bottom) {
      this.page++; 
      this.getUserList(); 
    }
  }
  
  onRowClick(element: any): void {
    this.expandedElement = this.expandedElement === element ? null : element;
    // console.log(element.userEmailId);
    this.getDeviceData(element.userEmailId)
    
  }

  openDeviceHistory(element: addInventory, isTrue:boolean) {
    const dialogRef = this.dialog.open(DeviceHistoryComponent, {
      width: 'auto', // Optional: specify width of dialog
      height: 'auto',
      disableClose: true,
      data: {
        element: element,
        isTrue: isTrue 
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}












///////////////////////////////// Example data ////////////////////////////////

// const USER_DATA: UserList[] = [
//   { userName: 'John Doe', noOfDevice: 3, retunableDevice: 1, location: 'NY' },
//   { userName: 'Jane Smith', noOfDevice: 2, retunableDevice: 1, location: 'LA' },
//   { userName: 'Michael Brown', noOfDevice: 5, retunableDevice: 2, location: 'CHI' },
//   { userName: 'Emily White', noOfDevice: 4, retunableDevice: 3, location: 'SF' },
//   { userName: 'Samuel Green', noOfDevice: 6, retunableDevice: 3, location: 'MIA' },
//   { userName: 'Olivia Taylor', noOfDevice: 7, retunableDevice: 4, location: 'HOU' },
//   { userName: 'David Wilson', noOfDevice: 8, retunableDevice: 2, location: 'DAL' },
//   { userName: 'Sophia Harris', noOfDevice: 3, retunableDevice: 2, location: 'PHX' },
//   { userName: 'James Clark', noOfDevice: 1, retunableDevice: 1, location: 'AUS' },
//   { userName: 'Lily Lewis', noOfDevice: 5, retunableDevice: 2, location: 'SEA' },
//   { userName: 'Jacob Walker', noOfDevice: 2, retunableDevice: 1, location: 'SD' },
//   { userName: 'Isabella Hall', noOfDevice: 4, retunableDevice: 3, location: 'BOS' },
//   { userName: 'Aiden Allen', noOfDevice: 6, retunableDevice: 3, location: 'DEN' },
//   { userName: 'Charlotte Young', noOfDevice: 3, retunableDevice: 2, location: 'CHI' },
//   { userName: 'Ethan King', noOfDevice: 5, retunableDevice: 4, location: 'ATL' },
//   { userName: 'David Wilson', noOfDevice: 8, retunableDevice: 2, location: 'DAL' },
//   { userName: 'Sophia Harris', noOfDevice: 3, retunableDevice: 2, location: 'PHX' },
//   { userName: 'James Clark', noOfDevice: 1, retunableDevice: 1, location: 'AUS' },
//   { userName: 'Lily Lewis', noOfDevice: 5, retunableDevice: 2, location: 'SEA' },
//   { userName: 'Jacob Walker', noOfDevice: 2, retunableDevice: 1, location: 'SD' },
//   { userName: 'Isabella Hall', noOfDevice: 4, retunableDevice: 3, location: 'BOS' },
//   { userName: 'Aiden Allen', noOfDevice: 6, retunableDevice: 3, location: 'DEN' },
//   { userName: 'Charlotte Young', noOfDevice: 3, retunableDevice: 2, location: 'CHI' },
//   { userName: 'Ethan King', noOfDevice: 5, retunableDevice: 4, location: 'ATL' }
// ];


// const ELEMENT_DATA: Dashboard[] = [
//   {
//     "serialNumber": "1MPFGY3",
//     "purchaseDate": null,
//     "deliveryDate": "2023-09-07T16:00:00Z",
//     "warrantyTill": "2026-09-26T15:59:59Z",
//     "assignTo": "Alyana Bianca Carreon",
//     "lastSyncDate": "1/21/2025 10:11",
//     "sources": "Intune",
//     "orderNumber": 4075,
//     "manufacturerId": "Dell Inc.",
//     "model": "Latitude 5440",
//     "status": "Assigned",
//     "deviceType": "Laptop"
// },
// {
//     "serialNumber": "4S1VMV2",
//     "purchaseDate": null,
//     "deliveryDate": "2019-04-13T05:00:00Z",
//     "warrantyTill": "2023-04-13T04:59:59.999Z",
//     "assignTo": null,
//     "lastSyncDate": "1/21/2025 11:11",
//     "sources": "Intune",
//     "orderNumber": 11,
//     "manufacturerId": "Dell Inc.",
//     "model": "Latitude 7490",
//     "status": "Assigned",
//     "deviceType": "Laptop"
// }
// ];
