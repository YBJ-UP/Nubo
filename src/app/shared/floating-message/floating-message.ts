import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-floating-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-message.html',
  styleUrls: ['./floating-message.css']
})
export class FloatingMessage {
  @Input() visible = false;
  @Input() title = '';
  @Input() message = '';
  @Input() type: 'success' | 'error' | 'info' | 'warning' = 'info';
  @Input() primaryLabel = 'Aceptar';
  @Input() secondaryLabel?: string;
  @Input() stackButtons = false;

  @Output() primary = new EventEmitter<void>();
  @Output() secondary = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  onPrimary(): void {
    this.primary.emit();
    this.visible = false;
  }

  onSecondary(): void {
    this.secondary.emit();
    this.visible = false;
  }

  onClose(): void {
    this.closed.emit();
    this.visible = false;
  }
}
