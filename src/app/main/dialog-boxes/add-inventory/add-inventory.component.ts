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
import { AuthService } from '../../../services/auth.service';

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
  user: any;
  currentID : any;
  // isDisabled: boolean = true;
  constructor(
    private dialog: MatDialog,
    private _fb: FormBuilder,
    private _importService: ImportExcelService,
    private _apisService: ApisService,
    private _snackbar: MatSnackBar,
    private _authService: AuthService
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
    this._authService.getUserIdObservable().subscribe(userId => {
      console.log("User ID from service:", userId);
      this.currentID = userId
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
  console.log('Form Data:', formData);

  // Save a copy in localStorage
  localStorage.setItem('inventoryFormData', JSON.stringify(formData));

  // Transform data if needed
  const payload = {
    ...this.transformData(formData),
  };
console.log(payload);

  // Call API to save inventory
  this._apisService.addInventory(payload).subscribe({
    next: (res: any) => {
      this._snackbar.open('Record saved successfully', undefined, { duration: 3000 });

      // Reset the form and set default value for status
      this.inventoryForm.reset();
      this.inventoryForm.get('status')?.setValue('In Stock', { emitEvent: false });

      // Trigger a refresh (if other components rely on this)
      this._importService.refreshData.next(Math.random());
    },
    error: (err) => {
      console.error('Save failed:', err);
      this._snackbar.open(err.error?.message || 'An error occurred', undefined, {
        duration: 3000,
        panelClass: 'custom-style'
      });
    }
  });
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
    serialNumber: formData.serialNumber || '', 
    purchaseDate: this.formatDate(formData.purchaseDate),
    deliveryDate: this.formatDate(formData.deliveryDate),
    endOfWarranty: this.formatDate(formData.warrantyTill),
    lastPhysicalInventory: this.formatDate(formData.lastPhysicalInventory || ''), 
    orderNumber: formData.orderNumber || '',
    manufacturerID: formData.manfId, // Make sure this is an ID, not name
    model: formData.model?.toUpperCase(), // Normalize casing if needed
    statusID: formData.status?.replace(/\s+/g, ''), // "In Stock" => "InStock"
    deviceType: formData.deviceType?.toUpperCase(), // Normalize casing if backend expects
    location: formData.location,
    description: null,
    userID : this.currentID
  };
}


  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00Z`;
  }

}
