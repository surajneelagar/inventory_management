import { Component, Inject } from '@angular/core';
import { MatImportModule } from '../../../shared/mat-import/mat-import.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms'; // Import this
import { NgFor } from '@angular/common';
import { ImportExcelService } from '../../../services/import-excel.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-uploaded-inventory',
  standalone: true,
  imports: [
    MatImportModule,
    FormsModule,
    NgFor,
    CommonModule
  ],
  templateUrl: './view-uploaded-inventory.component.html',
  styleUrls: ['./view-uploaded-inventory.component.scss'],
})
export class ViewUploadedInventoryComponent {
  columns: any[] = [];
  dataSource: any[] = [];
  displayedColumns: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ViewUploadedInventoryComponent>,
    private importService: ImportExcelService,
    private _snackBar: MatSnackBar
  ) {
    console.log('Received Data:', data);

    this.columns = data?.value?.data?.columns;
    this.dataSource = data?.value?.data?.data?.map((item: any) => {
      const lowerCaseItem: any = {};

      // Loop through each key-value pair in the item
      Object.keys(item).forEach((key) => {
        lowerCaseItem[key.toLowerCase()] = item[key]; // Convert key to lowercase
      });

      return lowerCaseItem; // Return the new item with lowercase keys
    });

    this.displayedColumns = this.columns.map((column) => column.key);
    this.columns.sort((a, b) => a.order - b.order);

    console.log('Processed Data:', this.dataSource);
  }


//   // Method to map and transform the incoming data
// transformData(data: any[]): any[] {
//   return data.map((item) => ({
//     serialNumber: item['Serial Number'],
//     purchaseDate: item['Purchase Date'] || null, // Handling missing or undefined fields
//     deliveryDate: item['Delivery Date'] || null,
//     warrantyTill: item['Warranty Till'] || null,
//     lastPhysicalInventory: item['Last Physical Inventory'] || null,
//     networkIdentifier: item['Network Identifier'] || null,
//     orderNumber: item['Order Number'] || null,
//     manfId: item['Manf ID'] || null,
//     model: item['Model'] || null,
//     status: item['Status'] || null,
//     // Bind 'type' from incoming data or set default value if missing
//     type: item['Type'] || null, // If 'Type' is not available, fallback to 'null'
//   }));
// }


  hasError(element: any, column: any): boolean {
    return column.isRequired && !element[column.key];
  }

  trackByFn(index: number, item: any): any {
    return item.key; 
  }

  saveData(): void {
    const payload = {
      Data: [...this.dataSource],
    };

    // Check for validation errors
    const errors: any[] = []; 
    for (const row of this.dataSource) {
      for (const column of this.columns) {
        if (column.isRequired && !row[column.key]) {
          errors.push({ row: row, column: column }); 
        }
      }
    }

    if (errors.length > 0) {
      // Display all errors at once using alert
      let errorMessage = "Please fill in the following required fields\n";
      // errors.forEach(error => {
      //   // errorMessage += `- Required field '${error.column.displayName}' is empty in row\n`; 
      // });

        // Display snackbar with the error message and a custom 'warn' class
        this._snackBar.open(errorMessage, undefined, {
          duration: 3000, 
          panelClass: ["custom-style"]
        });
        
      // alert(errorMessage); 

      // Highlight invalid cells
      errors.forEach(error => {
        // Find the corresponding cell element
        const cell = document.querySelector(`[data-row-index="${this.dataSource.indexOf(error.row)}"][data-column-index="${this.columns.indexOf(error.column)}"]`); 
        if (cell) {
          cell.classList.add('invalid'); 
        }
      });

      return; 
    }

    // Proceed with data upload if no errors
    this.importService.uploadExcelFile(payload).subscribe(
      (res) => {
        console.log("Incomming Data", res);
        // You can still use MatSnackBar or other notifications here if needed
        // this.snackbar.open(res?.value?.message, undefined, { duration: 3000 }); 
        this.importService.refreshData.next(Math.random());
      },
      (error) => {}
    );
    this.dialogRef.close();
  }
  
}