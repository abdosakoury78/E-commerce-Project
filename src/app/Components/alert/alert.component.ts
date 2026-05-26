import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {

  @Input() isOpen: boolean = false;

  @Input() title: string = 'Success';

  @Input() message: string = 'Operation completed successfully';

  @Input() type: 'success' | 'error' | 'warning' = 'success';

  @Output() closed = new EventEmitter<void>();

  closeAlert() {
    this.isOpen = false;
    this.closed.emit();
  }
}
