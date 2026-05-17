import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;

  strength = {
    rules: {
      length: false,
      upper: false,
      number: false,
      special: false
    },
    percent: '0%',
    color: '#ddd',
    label: '—'
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    });

    this.signupForm.get('password')?.valueChanges.subscribe(val => {
      this.updateStrength(val || '');
    });
  }

  toggle(input: HTMLInputElement) {
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  updateStrength(val: string) {
    const rules = {
      length: val.length >= 8,
      upper: /[A-Z]/.test(val),
      number: /[0-9]/.test(val),
      special: /[^A-Za-z0-9]/.test(val)
    };

    const score = Object.values(rules).filter(Boolean).length;

    const levels = [
      { pct: '0%', color: '#ddd', text: '—' },
      { pct: '25%', color: '#dc3545', text: 'Weak' },
      { pct: '50%', color: '#fd7e14', text: 'Fair' },
      { pct: '75%', color: '#ffc107', text: 'Good' },
      { pct: '100%', color: '#28a745', text: 'Strong' }
    ];

    const level = val ? levels[score] : levels[0];

    this.strength = {
      rules,
      percent: level.pct,
      color: level.color,
      label: level.text
    };
  }

  isMatch(): boolean {
    return this.signupForm.value.password === this.signupForm.value.confirmPassword;
  }

  submit() {
    if (this.signupForm.invalid || !this.isMatch()) return;

    console.log(this.signupForm.value);
  }
}