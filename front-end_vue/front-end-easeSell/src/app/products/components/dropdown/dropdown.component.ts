import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent {
  @Output() orderChange: EventEmitter<string> = new EventEmitter<string>();
  orderBy: string = '';

  onOrderChange(value: string): void {
    this.orderBy = value;
    this.orderChange.emit(value);
  }
}
