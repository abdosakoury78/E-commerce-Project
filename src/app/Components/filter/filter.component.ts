import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter',
  imports: [ReactiveFormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  forms: FormGroup[] = [
    new FormGroup({
      electronics: new FormControl(false),
      accessories: new FormControl(false),
      footwear: new FormControl(false),
      home: new FormControl(false),
      sports: new FormControl(false)
    }),
    new FormGroup({
      rating4: new FormControl(false),
      rating3: new FormControl(false),
      rating2: new FormControl(false),
      rating1: new FormControl(false)
    }),
    new FormGroup({
      inStock: new FormControl(false)
    })
  ];
  clearAll() {
    this.forms.forEach(form => form.reset());
  }
}
