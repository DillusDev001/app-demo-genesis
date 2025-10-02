import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { getObjectByValue } from '../../../core/utils/utils.utils';

@Component({
  selector: 'app-custom-drop-down',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './custom-drop-down.component.html',
  styleUrls: ['./custom-drop-down.component.css']
})
export class CustomDropDownComponent implements OnInit {
  /** ------------------------------------- Variables de Inicio ------------------------------------- **/
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() control!: FormControl;
  @Input() data!: any[];
  @Input() classSelect: string = '';
  @Input() style: number = 1;
  @Input() id: string = `input-${Math.random().toString(36).substring(2, 9)}`;

  @Output() response = new EventEmitter<any>();

  isFocused = false;

  /** ----------------------------------------- Constructor ----------------------------------------- **/
  constructor() { }

  /** ------------------------------------------- OnInit -------------------------------------------- **/
  ngOnInit(): void { }

  /** ------------------------------------------- Methods ------------------------------------------- **/
  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
  }

  onValueChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;

    if (selectElement.value !== '') {
      const selectedValue = selectElement.value as string;
      const selectedData = getObjectByValue(selectedValue, this.data);

      this.response.emit({
        bool: true,
        data: selectedData
      });
    } else {
      this.response.emit({
        bool: false,
        data: null
      })
    }
    return;
  }

  /** --------------------------------------- Methods onClick --------------------------------------- **/

}
