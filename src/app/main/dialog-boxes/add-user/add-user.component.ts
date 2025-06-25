import { Component } from '@angular/core';
import { MatImportModule } from '../../../shared/mat-import/mat-import.module';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ApisService } from '../../../services/apis.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [MatImportModule,CommonModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {
  addUserForm: FormGroup;
  currentID : any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddUserComponent>,
    private _authService: AuthService,
    private _snackbar: MatSnackBar,
    private _apisService: ApisService,
  ) {
    this.addUserForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

     this._authService.getUserIdObservable().subscribe(userId => {
      console.log("User ID from service:", userId);
      this.currentID = userId
    });
  }

  transformData(formData: any) {
  return {
    fullname: formData.fullName,
    email: formData.email,
    createrid: this.currentID
  };
}

onSave(): void {
  const formData = this.addUserForm.getRawValue();
  console.log('Form Data:', formData);

  // Save form data to localStorage (optional)
  localStorage.setItem('addUserFormData', JSON.stringify(formData));

  // Prepare payload with transformed data
  const payload = {
    ...this.transformData(formData),
  };
  console.log('Payload:', payload);

  if (this.addUserForm.valid) {
    this._apisService.addUser(payload).subscribe({
      next: (res) => {
        this._snackbar.open('User added successfully', undefined, { duration: 3000 });
        this.addUserForm.reset();
        this.dialogRef.close(res); // Close dialog and send back response if needed
      },
      error: (err) => {
        console.error('Add user failed:', err);
        this._snackbar.open(err.error?.message || 'An error occurred', undefined, {
          duration: 3000,
          panelClass: 'custom-style'
        });
      }
    });
  }
}
}