import { Component } from '@angular/core';
import { MatImportModule } from '../../shared/mat-import/mat-import.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatImportModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
loginForm: FormGroup;

  constructor(private fb: FormBuilder,private router: Router, private _authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  transformData(data: any) {
    return {
      email: data.email,
      password: data.password
    };
  }
  onLogin() {
    if (this.loginForm.invalid) return;
    const payload = this.transformData(this.loginForm.value);
    console.log("Payload:", payload);
    this._authService.logIn(payload).subscribe({
        next: (res: any) => {
          // Assuming response includes a token
          console.log(res);
          
          localStorage.setItem('token', res.token);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Login failed:', err);
          alert('Login failed. Please check your credentials.');
        }
      });
  }
}
