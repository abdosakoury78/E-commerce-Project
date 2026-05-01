import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-filter',
  imports: [ReactiveFormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent implements AfterViewInit, OnDestroy{
  @ViewChildren('myCheckbox')
  checkboxes!: QueryList<ElementRef>;
  @Output() filterChange = new EventEmitter<HTMLInputElement>();

  private subs: Subscription[] = [];

  ngAfterViewInit(): void {
    this.checkboxes.forEach((checkbox) => {
      const sub = fromEvent<Event>(
        checkbox.nativeElement,
        'change'
      ).subscribe(event => {
        const input = event.target as HTMLInputElement;
        // console.log(input.checked);
        // console.log(input.id);
        this.filterChange.emit(input);
      });

      this.subs.push(sub);
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

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
  @Output() clearFilters = new EventEmitter<void>();

  clearAll() {
    this.forms.forEach(form => form.reset());
    this.clearFilters.emit();
  }

}

