import { Component, Inject, OnInit } from '@angular/core';
import { MatImportModule } from '../../../shared/mat-import/mat-import.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ImportExcelService } from '../../../services/import-excel.service';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormBuilder, FormGroup, FormsModule} from '@angular/forms';

@Component({
 selector: 'app-device-history',
 standalone: true,
 imports: [MatImportModule, CommonModule,FormsModule, MatFormFieldModule, MatInputModule],
 templateUrl: './device-history.component.html',
 styleUrls: ['./device-history.component.scss']
})
export class DeviceHistoryComponent implements OnInit {
  historyData: any;
  trackAssignedData: any;
  trackReturnedData: any
  isAssignedComponent: boolean;
  trackingForm!: FormGroup;
  status: string = 'Status';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private _importExcelService: ImportExcelService, 
    private _fb: FormBuilder
  ) {
    console.log('Data received in dialog:', this.data.element);
    this.trackingForm = this._fb.group({
      trackingNumber: [''],
    });
   this.isAssignedComponent = this.data.isTrue;
 }

  ngOnInit(): void {
    this.getDeviceHistory();
  }

  getDeviceHistory() {
    this._importExcelService.deviceHistory(this.data.element).subscribe(
      (response: any) => {
          this.historyData = response.deviceDetail;
          this.trackAssignedData = response.deviceHistory[0];
          this.trackReturnedData = response.deviceHistory[1];
          console.log('History Data:', this.historyData);
      },
      (error) => {
        console.error('API error:', error);
      }
    );
  }

  onSubmit() {
    const trackingNumber = this.trackingForm.get('trackingNumber')?.value;
    console.log('Tracking Number Submitted:', trackingNumber);
    
    // Optionally set status after submission (if desired)
    this.status = trackingNumber // Example, adjust as needed
  }
}