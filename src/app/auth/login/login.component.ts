import { Component } from '@angular/core';
import { MatImportModule } from '../../shared/mat-import/mat-import.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatImportModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
loginForm: FormGroup;

  constructor(private fb: FormBuilder,private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
        // Example token logic (simulate login)
        localStorage.setItem('token', '123456'); // Save token on login
        this.router.navigate(['/dashboard']);
      }
    }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    }

}
