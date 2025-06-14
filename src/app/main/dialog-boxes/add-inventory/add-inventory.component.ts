import { Component, OnInit } from '@angular/core';
import { MatImportModule } from '../../../shared/mat-import/mat-import.module';
import { ExcelImportComponent } from '../excel-import/excel-import.component';
import { MatDialog } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import {
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { NativeDateModule } from '@angular/material/core';
import { ImportExcelService } from '../../../services/import-excel.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ApisService } from '../../../services/apis.service';

@Component({
  selector: 'app-add-inventory',
  standalone: true,
  imports: [MatImportModule, ReactiveFormsModule, MatDatepickerModule,CommonModule],
  templateUrl: './add-inventory.component.html',
  styleUrl: './add-inventory.component.scss',
})
export class AddInventoryComponent implements OnInit {
  inventoryForm: FormGroup;
  previousData: any;
  statusOptions!: string[];
  deviceTypeOptions!: string[];
  locationOptions!: string[];
  modelOptions!: string[];
  // isDisabled: boolean = true;
  constructor(
    private dialog: MatDialog,
    private _fb: FormBuilder,
    private _importService: ImportExcelService,
    private _apisService: ApisService,
    private _snackbar: MatSnackBar
  ) {
    this.inventoryForm = this._fb.group({
      serialNumber: ['', [Validators.required]],
      purchaseDate: ['', [Validators.required]],
      deliveryDate: ['', [Validators.required]],
      lastPhysicalInventory: ['', [Validators.required]],
      orderNumber: ['', [Validators.required]],
      warrantyTill: ['', [Validators.required]],
      manfId: ['', [Validators.required]],
      model: ['', [Validators.required]],
      status: ['In Stock'],
      deviceType: ['', [Validators.required]],
      location: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.previousData = localStorage.getItem('inventoryFormData');
    this._apisService.masterData().subscribe((res: any) => {
      console.log(res);
      
      this.deviceTypeOptions = res?.deviceTypes?.map((device: any) => device.name);
      this.modelOptions = res?.machineModels?.map((model: any) => model.name);
      this.locationOptions = res?.countries?.map((country: any) => country.name);
      this.statusOptions = res?.status?.map((status: any) => status.name);  
    })

    this.inventoryForm.get('status')?.disable();
  }

  OpenExcelImport(): void {
    // Close the current dialog
    this.dialog.closeAll();

    // Open the Excel import dialog (or component)
    this.dialog.open(ExcelImportComponent, {
      width: '400px', // Optional: specify width of dialog
    });
  }

  onClickSave(): void {
    const formData = this.inventoryForm.getRawValue();
    console.log(formData);
    
    localStorage.setItem('inventoryFormData', JSON.stringify(formData));
    const payload = {
      ...this.transformData(formData),
    };
   
    this._importService.addInventory(payload).subscribe(
      (res: any) => {
          this._snackbar.open('Record saved successfully', undefined, { duration: 3000 })
          this.inventoryForm.reset();
          this.inventoryForm?.get('status')?.setValue('In Stock', { emitEvent: false })
          this._importService.refreshData.next(Math.random());
       
      },
      (error) => {
        this._snackbar.open('Record already exists', undefined, { duration: 3000, panelClass: 'custom-style' })
      }
    );
  }

  autofillForm(): void {
    const saveFormValues = JSON.parse(
      localStorage.getItem('inventoryFormData') || ''
    );
    if (!!saveFormValues) {
      this.inventoryForm.patchValue(saveFormValues);
    }
  }

  transformData(formData: any) {
    return {
      serialnumber: formData.serialNumber || '', 
      purchasedate: this.formatDate(formData.purchaseDate),
      deliverydate: this.formatDate(formData.deliveryDate),
      endofwarranty: this.formatDate(formData.warrantyTill),
      lastphysicalinventory: this.formatDate(
        formData.lastPhysicalInventory || ''
      ), 
      ordernumber: formData.orderNumber || '',
      manufacturerid: formData.manfId, 
      model: formData.model, 
      statusid: formData.status, 
      deviceType: formData.deviceType, 
      location: formData.location,
      description: null, 
    };
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0] + 'T00:00:00';
  }
}
