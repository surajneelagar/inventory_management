import { Component } from '@angular/core';
import { MatImportModule } from '../../../shared/mat-import/mat-import.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dispatched-inventory',
  standalone: true,
  imports: [MatImportModule,CommonModule],
  templateUrl: './dispatched-inventory.component.html',
  styleUrl: './dispatched-inventory.component.scss'
})
export class DispatchedInventoryComponent {
  diapatchedInventory: FormGroup<any>;
  departments: string[] = ['IT', 'HR', 'Sales', 'Finance']; // Example departments
  constructor(
    private _fb: FormBuilder
  ){
    this.diapatchedInventory = this._fb.group({
        serialNumber : [''],
        type : [''],
        assignedTo : [''],
        location : [''],
        status : ['']
      })
    }

  onClickSave(){
    const form = this.diapatchedInventory.value
    console.log(form);
    
  }
}
