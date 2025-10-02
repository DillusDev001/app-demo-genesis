import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-text-area',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './custom-text-area.component.html',
  styleUrls: ['./custom-text-area.component.css']
})
export class CustomTextAreaComponent implements OnInit {
  /** ------------------------------------- Variables de Inicio ------------------------------------- **/
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() control!: FormControl;
  @Input() autofocus: boolean = false;
  @Input() classInput: string = '';
  @Input() style: number = 1;
  @Input() rows: number = 5;
  @Input() id: string = `input-${Math.random().toString(36).substring(2, 9)}`;

  @Output() textChange = new EventEmitter<string>();
  @Output() response = new EventEmitter<any>();

  @ViewChild('inputElement') inputElement!: ElementRef;

  isFocused = false;

  isPassword!: boolean;
  iconPassword!: string;
  isHidden: boolean = true;

  /** ----------------------------------------- Constructor ----------------------------------------- **/
  constructor() {
    
  }

  /** ------------------------------------------- OnInit -------------------------------------------- **/
  ngOnInit(): void { }

  /** ------------------------------------------- Methods ------------------------------------------- **/
  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
  }

  /** --------------------------------------- Methods onClick --------------------------------------- **/

}