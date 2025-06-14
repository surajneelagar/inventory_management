import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatImportModule } from '../../shared/mat-import/mat-import.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatImportModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  transformData(data: any) {
    return {
      name: data.name,
      email: data.email,
      password: data.password
    };
  }

  onRegister() {
    if (this.registerForm.invalid) return;

    const payload = this.transformData(this.registerForm.value);
    console.log("Payload:", payload);

    this._authService.signUp(payload).subscribe({
      next: res => {
        console.log('Registration success:', res);
        this.router.navigate(['/login']); // navigate after success
      },
      error: err => {
        console.error('Registration failed:', err);
      }
    });
  }
}
