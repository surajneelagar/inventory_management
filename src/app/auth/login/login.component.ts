import { Component } from '@angular/core';
import { MatImportModule } from '../../shared/mat-import/mat-import.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatImportModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router, 
    private _authService: AuthService,
    private _snackbar: MatSnackBar
  ) {
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
    this._authService.logIn(payload).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this._authService.getUser(payload.email).subscribe((user: any) => {
          const userId = user.id;
          console.log("User ID:", userId);
          this._authService.setUserId(userId); 
          this.router.navigate(['/dashboard']); 
        });
      },
      error: (err) => {
        console.error('Login failed:', err);
        this._snackbar.open(err.error.message, undefined, {
          duration: 3000,
          panelClass: 'custom-style'
        });
      }
    });
  }

}
