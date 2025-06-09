import { Component } from '@angular/core';
import { MatImportModule } from '../../shared/mat-import/mat-import.module';
import { MatDialog } from '@angular/material/dialog';
import { DispatchedInventoryComponent } from '../dialog-boxes/dispatched-inventory/dispatched-inventory.component';
import { DeviceHistoryComponent } from '../dialog-boxes/device-history/device-history.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  status: string;  // Add this line
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', status: 'In Transit'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', status: 'Delivered'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', status: 'In Transit'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', status: 'Returned'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B', status: 'In Transit'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C', status: 'Delivered'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N', status: 'In Transit'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O', status: 'Returned'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F', status: 'In Transit'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne', status: 'Delivered'},
];


@Component({
  selector: 'app-transit',
  standalone: true,
  imports: [MatImportModule],
  templateUrl: './transit.component.html',
  styleUrl: './transit.component.scss'
})
export class TransitComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'status'];  // Add 'status' here
  dataSource = ELEMENT_DATA;
  constructor(public dialog: MatDialog) {}


 openDeviceHistory(element: string, isTrue: boolean) {
      const dialogRef = this.dialog.open(DeviceHistoryComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          element: element,
          isTrue: isTrue // Sending the true value here
        }
      });
    
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
}
