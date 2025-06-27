import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatImportModule } from '../../../shared/mat-import/mat-import.module';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImportExcelService } from '../../../services/import-excel.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApisService } from '../../../services/apis.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-assign-device',
  standalone: true,
  imports: [MatImportModule, CommonModule],
  templateUrl: './assign-device.component.html',
  styleUrl: './assign-device.component.scss'
})
export class AssignDeviceComponent implements OnInit, OnDestroy {
  assignDevice!: FormGroup;
  assignedToOptions: any[] = []; 
  filteredAssignedToOptions: any[] = []; 
  email!: string;
  filterParams: any = {
    displayName: ''
  };
  isLoading = false; 
  page = 1; 
  searchControl = new FormControl(''); 
  private searchSubject = new Subject<string>();
  private searchQuery = '';
  private unsubscribe$ = new Subject<void>(); 
  currentID: any;

  constructor(
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _importExcelService: ImportExcelService,
    private _apisService: ApisService,
    private _authService: AuthService,
    private _snackbar: MatSnackBar,
     private _dialogRef: MatDialogRef<AssignDeviceComponent>
  ) {
    this.email = data.userEmailId;
    this.assignDevice = this._fb.group({
      serialNumber: [data.serialNumber, Validators.required],
      assignedTo: ['', Validators.required],
      trackingNumber: [''],
      comment: ['']
    });
  }

  ngOnInit(): void {
    // this.getInventoryAssignment();
    this.setupSearch();
    this._authService.getUserIdObservable().subscribe(userId => {
        console.log("User ID from service:", userId);
        this.currentID = userId
    });
    this._apisService.getUser(this.currentID).subscribe((data: any) => {
      console.log(data); 
      this.filteredAssignedToOptions = data
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(); 
    this.unsubscribe$.complete();
  }

  getInventoryAssignment(): void {
    this.isLoading = true; 
    this._importExcelService.allInventoryAssignment(this.searchQuery, this.page).subscribe((data: any) => {
      this.assignedToOptions = [...this.assignedToOptions, ...data]; 
      this.filteredAssignedToOptions = [...this.assignedToOptions]; 
      this.isLoading = false; 
    });
  }

  setupSearch(): void {
    this.searchControl.valueChanges.pipe(
      filter((value): value is string => value !== null), 
      debounceTime(300), 
      distinctUntilChanged(), 
      switchMap((searchValue: string) => {
        this.searchQuery = searchValue;
        this.page = 1; 
        this.assignedToOptions = []; 
        console.log(this.searchQuery);
        
        return this._importExcelService.allInventoryAssignment(this.searchQuery, this.page);
      }),
      takeUntil(this.unsubscribe$) 
    ).subscribe(
      (data: any) => {
        if(data && data.length)
        {
          this.assignedToOptions = data;
          this.filteredAssignedToOptions = [...this.assignedToOptions];
        } else {
          console.error("Invalid");
          
        }
      this.isLoading = false;
    },
    (error) => {
      console.error('Failed to fetch inventory data', error);
      this.isLoading = false;
    }
  );
  }

  onInventoryTableScroll(event: any) {
    const bottom = event.target.scrollHeight - event.target.scrollTop - event.target.clientHeight <= 10;
    if (!this.isLoading && bottom) {
      this.page++;
      this.getInventoryAssignment();
    }
  }

  transformData(formData: any) {
    return {
      SerialNumber: formData.serialNumber,
      AssignedUserEmail: formData.assignedTo,
      TrackingNumber: formData.trackingNumber,
      Description: formData.comment
    };
  }

  onClickSave() {
    const formData = this.assignDevice.getRawValue();
    console.log(formData);
    
    const payload = {
      ...this.transformData(formData)
    };
    console.log(payload);
    
    this._importExcelService.assignDevice(payload).subscribe(
      (res: any) => {
        this._snackbar.open('Inventory assigned successfully', undefined, { duration: 3000, panelClass: 'addInve' });
        this._dialogRef.close()
      },
      (error) => {
        this._snackbar.open('Inventory already assigned', undefined, { duration: 3000, panelClass: 'custom-style' });
        this._dialogRef.close()
      }
    );
  }
}