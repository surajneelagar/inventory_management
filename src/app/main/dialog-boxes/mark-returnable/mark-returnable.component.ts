import { Component, Inject } from '@angular/core';
import { MatImportModule } from '../../../shared/mat-import/mat-import.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImportExcelService } from '../../../services/import-excel.service';
import { ApisService } from '../../../services/apis.service';

@Component({
  selector: 'app-mark-returnable',
  standalone: true,
  imports: [MatImportModule, CommonModule],
  templateUrl: './mark-returnable.component.html',
  styleUrls: ['./mark-returnable.component.scss']
})
export class MarkReturnableComponent {
  returnableForm!: FormGroup;
  statusOptions!: string[];
  reasonOption!: string[];
  
  constructor(
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _importService: ImportExcelService,
    private _apisService: ApisService,
    private _snackbar: MatSnackBar,
    private _dialogRef: MatDialogRef<MarkReturnableComponent>
  ) {
    console.log(data);

   
    this.returnableForm = this._fb.group({
      serialNumber: [data.serialNumber, Validators.required],
      assignedTo: [data.assignTo, Validators.required],
      updataStatus: ['', Validators.required], 
      reasons: ['', Validators.required], 
      email: [data.userEmailId, Validators.required],
      trackingNumber: [''],  
      comment: [''] 
    });

    this._apisService.masterData().subscribe((res: any) => {
      this.statusOptions = res?.returnableStatus?.map((returnableStatus: any) => returnableStatus.name);
      this.reasonOption = res?.returnReason?.map((returnReason: any) => returnReason.name);
      console.log(this.reasonOption);
    });
  }

  transformData(formData: any) {
    return {
      serialNumber: formData.serialNumber,
      assignedUserEmail: formData.email,
      reason: formData.reasons,
      description: formData.comment,
      trackingNumber: formData.trackingNumber
    };
  }

  
  onClickSave() {
    const formData = this.returnableForm.getRawValue();  
    console.log(formData);
    const payload = this.transformData(formData);
    console.log("Payload", payload);
    this._importService.returnedInventory(payload).subscribe(
      (res: any) => {
        this._snackbar.open('Marked returned successfully', undefined, { duration: 3000, panelClass: 'addInve' });
        this._dialogRef.close(); 
      },
      (error) => {
        this._snackbar.open('Error in returned', undefined, { duration: 3000, panelClass: 'custom-style' });
      }
    );
  }
}
