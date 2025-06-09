import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatImportModule } from '../../shared/mat-import/mat-import.module';
import { Inventory } from '../../models/table';
import { ExcelImportComponent } from '../dialog-boxes/excel-import/excel-import.component';
import { MatDialog } from '@angular/material/dialog';
import { AddInventoryComponent } from '../dialog-boxes/add-inventory/add-inventory.component';
import { AssignDeviceComponent } from '../dialog-boxes/assign-device/assign-device.component';
import { DeviceHistoryComponent } from '../dialog-boxes/device-history/device-history.component';
import { ImportExcelService } from '../../services/import-excel.service';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { addInventory, ButtonIndex } from '../../models/dialog-boxes';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { displayNameMapping } from './column-header-mappings';
import { MarkReturnableComponent } from '../dialog-boxes/mark-returnable/mark-returnable.component';
import { ChangeStatusComponent } from '../dialog-boxes/change-status/change-status.component';
import { SearchService } from '../../shared/search.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [MatImportModule, DatePipe, CommonModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit, OnDestroy {
  selectedIndex: ButtonIndex = ButtonIndex.AllDevices;
  ButtonIndex = ButtonIndex;
  statusMapping = [
    'alldevices',
    'active',
    'intransit',
    'stock',
    'outofwarranty',
    'noncompliant',
    'returnable',
    'recalled',
    'offboarding',
    'ordered'
  ];
  displayNameMapping = displayNameMapping;
  displayedColumns: string[] = []; // Will hold the dynamic column names
  displayedColumnsWithActions: string[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  filterParams: any = { inventorySearch: '' };
  isLoading!: boolean;
  page: number = 1;
  pageSize: number = 50;
  searchQuaryInventory = new FormControl('');
  private unsubscribe$ = new Subject<void>(); // Subject to manage unsubscriptions
  showMarkReturnableButton!:boolean; // Flag to control "Mark as Returnable" button
  showChangeStatusButton!:boolean; // Flag to control "Change Status" button
  showDeviceHistoryButton!:boolean; // Flag to control "Devices History" button
  private previousScrollTop: number = 0;
  private previousScrollLeft: number = 0;
  // Track the last selected status
  private previousStatus: string = '';

  constructor(
    private searchService: SearchService,
    private dialog: MatDialog,
    private _importExcelService: ImportExcelService
  ) {
    this._importExcelService.refreshData.subscribe(() => {
      this.getInventoryList();
    });
  }

  ngOnInit(): void {
    this.loadSelectedButton();
    this.getInventoryList();
    this.initializeInventorySearch();
  }

  initializeInventorySearch(): void {
    const status = this.statusMapping[this.selectedIndex];
    console.log("search",status);
    
    this.searchService.searchQuery$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((query) => {
        this.filterParams = { inventorySearch: query };
        this.page = 1;
        this.dataSource.data = [];
        this.isLoading = true;
        console.log(this.filterParams);
        
        return this._importExcelService.allInventoryList(this.filterParams, this.page, this.pageSize,status);
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe(
      (inventoryList: any) => {
        console.log(inventoryList);
        
        if (inventoryList && inventoryList.devices && inventoryList.devices.length > 0) {
          this.dataSource.data = [...this.dataSource.data, ...inventoryList.devices];
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    console.log('Component destroyed');
  }

  showButtons(status: string){
        this.showDeviceHistoryButton = true;
        this.showChangeStatusButton = true;
        this.showMarkReturnableButton = true;
    switch (status) {
      case 'allDevices':
        this.showDeviceHistoryButton = true;
        this.showChangeStatusButton = true;
        this.showMarkReturnableButton = true;
        console.log('Case: allDevices');
        break;
  
      case 'active':
        console.log('Case: active');
        this.showDeviceHistoryButton = true;
        this.showChangeStatusButton = true;
        this.showMarkReturnableButton = false;
        break;
  
      case 'intransit':
        console.log('Case: intransit');
        this.showDeviceHistoryButton = true;
        this.showChangeStatusButton = false;
        this.showMarkReturnableButton = false;
        break;
  
      case 'stock':
        console.log('Case: stock');
        this.showDeviceHistoryButton = true;
        this.showChangeStatusButton = false;
        this.showMarkReturnableButton = false;
        break;
  
      case 'outofwarranty':
        console.log('Case: outofwarranty');
        this.showDeviceHistoryButton = true;
        this.showChangeStatusButton = true;
        this.showMarkReturnableButton = false;
        break;
  
      case 'noncompliant':
        console.log('Case: noncompliant');
        this.showDeviceHistoryButton = true;
        this.showChangeStatusButton = true;
        this.showMarkReturnableButton = true;
        break;
  
      case 'returnable':
        console.log('Case: returnable');
        this.showDeviceHistoryButton = true;
        this.showChangeStatusButton = true;
        this.showMarkReturnableButton = false;
        break;
  
      case 'recalled':
        console.log('Case: recalled');
        this.showDeviceHistoryButton = true;
        this.showChangeStatusButton = true;
        this.showMarkReturnableButton = false;
        break;
  
      case 'offboarding':
        console.log('Case: offboarding');
        this.showDeviceHistoryButton = true;
        this.showChangeStatusButton = true;
        this.showMarkReturnableButton = false;
        break;
  
      // default:
      //   console.error('Invalid status:', status);
      //   break;
    }
  }
  
  getInventoryList() {
    const status = this.statusMapping[this.selectedIndex];
    this.showButtons(status);
  
    // Reset columns and data only if status changes
    if (status !== this.previousStatus) {
      this.displayedColumns = [];
      this.displayedColumnsWithActions = [];
      this.dataSource.data = []; // Clear previous data
    }
  
    this._importExcelService.allInventoryList(this.filterParams, this.page, this.pageSize, status).subscribe({
      next: (data: any) => {
        console.log("Status:sadsa", status);
        if (data.devices && data.devices.length > 0) {
          // If data is available, set the columns and data
          this.displayedColumns = Object.keys(data.devices[0]);
          this.displayedColumnsWithActions = [...this.displayedColumns, 'actions']; // Include "actions" column
          this.dataSource.data = [...this.dataSource.data, ...data.devices];
        } else {
          // If data is null or empty, reset columns and data
          this.displayedColumns = [];
          this.displayedColumnsWithActions = []; // Do not include "actions" column
          this.dataSource.data = []; // Clear the data source
        }
        this.previousStatus = status; // Update the previous status after fetching data
      },
      error: (err) => {
        console.error('Error fetching inventory:', err);
        this.displayedColumns = [];
        this.displayedColumnsWithActions = []; // Do not include "actions" column on error
        this.dataSource.data = []; // Clear the data source on error
      }
    });
  }
  onButtonClick(index: ButtonIndex): void {
    this.dataSource.data = []; 
    this.selectedIndex = index;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('selectedButton', index.toString());
    }
    this.getInventoryList(); // Refresh data with new status
  
    // Reset scroll position when changing tabs
    const tableContainer = document.querySelector('.table-container');
    if (tableContainer) {
      tableContainer.scrollTop = 0;  // Reset vertical scroll to top
      tableContainer.scrollLeft = 0; // Reset horizontal scroll to left
    }
  }
  

  loadSelectedButton(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedIndex = localStorage.getItem('selectedButton');
      if (storedIndex) {
        this.selectedIndex = parseInt(storedIndex, 10) as ButtonIndex;
      }
    }
  }

  isDateColumn(value: any): boolean {
    return typeof value === 'string' && 
           /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z/.test(value);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterParams.serialNumber = filterValue.trim();
    this.page = 1;
    this.dataSource.data = [];
    this.getInventoryList();
  }

  onInventoryTableScroll(event: any) {
    if (!this.dataSource.data || this.dataSource.data.length === 0) {
      return; 
    }
    const target = event.target;
    const isVerticalScroll = target.scrollTop !== this.previousScrollTop;
    const isHorizontalScroll = target.scrollLeft !== this.previousScrollLeft;
    this.previousScrollTop = target.scrollTop;
    this.previousScrollLeft = target.scrollLeft;
    if (isVerticalScroll && !isHorizontalScroll) {
      const bottom = target.scrollHeight - target.scrollTop - target.clientHeight <= 10;
      if (!this.isLoading && bottom) {
        this.page++;
        this.getInventoryList();
      }
    }
  }

  openAssignInventoryDialog(element: any) {
    const dialogRef = this.dialog.open(AssignDeviceComponent, {
      width: 'auto',
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dataSource.data = []; 
      this.getInventoryList()
      console.log('The dialog was closed');
    });
  }

  openChangeStatusDialog(element: any) {
    const dialogRef = this.dialog.open(ChangeStatusComponent, {
      width: 'auto',
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dataSource.data = []; 
      this.getInventoryList()
      console.log('The dialog was closed');
    });
  }

  openDeviceHistory(element: addInventory, isTrue: boolean) {
    const dialogRef = this.dialog.open(DeviceHistoryComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: { element: element, isTrue: isTrue }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openImportDialog() {
    const dialogRef = this.dialog.open(ExcelImportComponent, {
      width: 'auto',
      data: {},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddInventoryComponent, {
      width: 'auto',
      height: '420px',
      data: {},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openMarkReturnableDialog(element: any) {
    const dialogRef = this.dialog.open(MarkReturnableComponent, {
      width: 'auto',
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dataSource.data = []; 
      this.getInventoryList()
      console.log('The dialog was closed');
    });
  }
}
