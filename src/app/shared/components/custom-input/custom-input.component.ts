import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.css'
})
export class CustomInputComponent implements OnInit {
  /** ------------------------------------- Variables de Inicio ------------------------------------- **/
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = '';
  @Input() control!: FormControl;
  @Input() autofocus: boolean = false;
  @Input() classInput: string = '';
  @Input() style: number = 1;
  @Input() id: string = `input-${Math.random().toString(36).substring(2, 9)}`;
  @Input() numberValidation: boolean = false;

  @Output() textChange = new EventEmitter<string>();

  //@Output() keydown = new EventEmitter<KeyboardEvent>();
  //@Output() response = new EventEmitter<any>();

  @ViewChild('innerElement') private innerElement!: ElementRef<HTMLButtonElement>;

  isFocused = false;

  isPassword!: boolean;
  iconPassword!: string;
  isHidden: boolean = true;

  /** ----------------------------------------- Constructor ----------------------------------------- **/
  constructor() {

  }

  /** ------------------------------------------- OnInit -------------------------------------------- **/
  ngOnInit(): void {
    this.isPassword = this.type === 'password';
    this.iconPassword = this.isPassword ? 'fa-solid fa-eye fa-lg' : '';
  }

  /** ------------------------------------------- Methods ------------------------------------------- **/
  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
  }

  get nativeElement(): HTMLButtonElement {
    return this.innerElement.nativeElement;
  }

  /** -------------------------------------------- Events ------------------------------------------- **/
  inputKeyPress(e: any) {
    const input = e.target;
    const currentInputValue = input.value;
    const pressedKey = e.key;

    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];

    if (this.numberValidation) {
      if (!allowedKeys.includes(pressedKey)) {
        e.preventDefault();
        return;
      }

      if (['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'].includes(pressedKey)) {
        return;
      }

      const nextInputValue = currentInputValue.slice(0, input.selectionStart) + pressedKey + currentInputValue.slice(input.selectionEnd);

      const regex = /^\d*(\.\d{0,2})?$/;

      if (pressedKey === '.' && (currentInputValue.length === 0 || currentInputValue.includes('.'))) {
        e.preventDefault();
        return;
      }

      if (!regex.test(nextInputValue)) {
        e.preventDefault();
      }
    }
  }

  /** --------------------------------------- Methods onClick --------------------------------------- **/
  showOrHiddenPassword() {
    this.isFocused = true;
    this.isHidden = !this.isHidden;

    this.iconPassword = this.isHidden ? 'fa-solid fa-eye fa-lg' : 'fa-solid fa-eye-slash fa-lg'
    this.type = this.isHidden ? 'password' : 'text'
  }

}