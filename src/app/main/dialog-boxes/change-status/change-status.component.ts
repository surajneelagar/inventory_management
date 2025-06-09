import { Component, Inject } from '@angular/core';
import { MatImportModule } from '../../../shared/mat-import/mat-import.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImportExcelService } from '../../../services/import-excel.service';
@Component({
  selector: 'app-change-status',
  standalone: true,
  imports: [MatImportModule, CommonModule],
  templateUrl: './change-status.component.html',
  styleUrl: './change-status.component.scss'
})
export class ChangeStatusComponent {
  changeStatus!: FormGroup;
  statusOptions!: string[] 

  constructor(
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _importService: ImportExcelService,
    private _snackbar : MatSnackBar,
    private _dialogRef: MatDialogRef<ChangeStatusComponent>
    
  ) {
    console.log(data);

    this.changeStatus = this._fb.group({
      serialNumber: [data.serialNumber, Validators.required],
      assignedTo: [data.assignTo, Validators.required],
      currentStock: [data.status, Validators.required],
      updataStatus: ['' ,Validators.required]
    });

    this._importService.masterData().subscribe((res: any) => {
      this.statusOptions = res?.status?.map((status: any) => status.name);  
    })
  
  }
  
  transformData(formData: any) {
    return {
      serialNumber: formData.serialNumber,
      status: formData.updataStatus
    };
  }
  
  onClickSave() {
    const formData = this.changeStatus.getRawValue();
    console.log(formData);
  
    const payload = {
      ...this.transformData(formData)
    };
    console.log("Payload", payload);
  
    this._importService.updateInventoryStatus(payload).subscribe(
      (res: any) => {
        this._snackbar.open('Inventory status changed successfully', undefined, { duration: 3000, panelClass: 'addInve' });
        this._dialogRef.close()
      },
      (error) => {
        this._snackbar.open('Error in status changing', undefined, { duration: 3000, panelClass: 'custom-style' });
        this._dialogRef.close()
      }
    );
  }
}
