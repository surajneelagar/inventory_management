import { Component, Inject, ViewChild } from '@angular/core';
import { MatImportModule } from '../../../shared/mat-import/mat-import.module';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';  
import { CommonModule } from '@angular/common';
import { ViewUploadedInventoryComponent } from '../view-uploaded-inventory/view-uploaded-inventory.component';
import { ImportExcelService } from '../../../services/import-excel.service';
import { error } from 'console';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-excel-import',
  standalone: true,
  imports: [MatImportModule,CommonModule,HttpClientModule],
  templateUrl: './excel-import.component.html',
  styleUrl: './excel-import.component.scss'
})
export class ExcelImportComponent {
  @ViewChild('fileInput') fileInput: any; // Reference to file input element
  selectedFile: File | null = null;
  jsonData: any = [];
  tableData:any =[]; 
  constructor(
    @Inject(MAT_DIALOG_DATA)
     public data: any,
     private dialog : MatDialog,
     private _importExcelService: ImportExcelService
    ) {}


  
// Triggered when a file is selected through the file input
onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    // Check if a file has already been selected
    if (this.selectedFile) {
      // Case 1: If the same file is selected again (same name and size), show an alert
      if (this.selectedFile.name === file.name && this.selectedFile.size === file.size) {
        alert('This file is already selected.');
        return; // Prevent selecting the same file
      }

      // Case 2: If a different file is selected, show a confirmation dialog
      const confirmReplace = confirm('You have already selected a file. Do you want to replace it with the new file?');
      if (!confirmReplace) {
        return; // If the user cancels, prevent replacing the file
      }
    }

    // Validate the selected file type
    if (this.isExcelFile(file)) {
      this.selectedFile = file;
      this.handleFile(file);
    } else {
      this.resetFileInput();
    }
  }
}


  // Triggered when a file is dragged and dropped into the area
  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file && this.isExcelFile(file)) {
      this.selectedFile = file;
      this.handleFile(file);
    } else {
      this.resetFileInput();
    }
  }

  // Triggered when dragging a file over the drop area
  onDragOver(event: DragEvent): void {
    event.preventDefault(); // Required to allow dropping
  }

  // Validate if the file is an Excel (.xlsx) file
  isExcelFile(file: File): boolean {
    return file.name.endsWith('.xlsx');
  }

  // Handle the selected file 
  handleFile(file: File): void {
    console.log('File selected:', file.name);
  }

  // Reset file input in case of invalid file type
  resetFileInput(): void {
    alert('Only .xlsx files are accepted.');
    this.selectedFile = null;
  }

  onContinue() {
    if (this.selectedFile) {
      const fileReader = new FileReader();
      const formData = new FormData();
      formData.append('formFile', this.selectedFile);
      this._importExcelService.importExcel(formData).subscribe(
        (res) => {
          console.log('File imported successfully:', res);
          this.tableData = res;
          this.dialog.closeAll();
          this.dialog.open(ViewUploadedInventoryComponent, {
            maxWidth: '100%',
            maxHeight: '100%',
            data: this.tableData,
            disableClose: true  
          });
        },
        (error) => {
         
        }
      );
      // fileReader.onload = (e) => {
      //   const data = e.target?.result as ArrayBuffer;
      //   const workbook = XLSX.read(data, { type: 'array' });
      //   const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      //   const jsonData = XLSX.utils.sheet_to_json(worksheet, {raw: false});
      //   console.log('Excel data in JSON format:', jsonData);
      //   this.dialog.closeAll();
      //   this.dialog.open(ViewUploadedInventoryComponent, {
      //     maxWidth: '100%',
      //     maxHeight: '100%',
      //     data: this.tableData,
      //     disableClose: true  
      //   });
      // };
      // fileReader.readAsArrayBuffer(this.selectedFile);
    
    }
  }
  

  downloadSampleTemplate() {
    const data = [
      ['Serial Number','Purchase Date','Delivery Date','Warranty Till','Last Physical Inventory','Network Identifier','Order Number','Manf Id','Model', 'Status','Type']
    ];
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const wb: XLSX.WorkBook = {
      Sheets: { 'Sheet1': ws },
      SheetNames: ['Sheet1']
    };
    const excelFile = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelFile], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'Sample_Template.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}