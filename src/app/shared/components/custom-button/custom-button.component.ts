import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-custom-button',
  imports: [CommonModule],
  templateUrl: './custom-button.component.html',
  styleUrl: './custom-button.component.css'
})
export class CustomButtonComponent implements OnInit {
  /** ------------------------------------- Variables de Inicio ------------------------------------- **/
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() type: string = '';
  @Input() class: string = '';
  @Input() valid: boolean = false;

  @Output() response = new EventEmitter<any>();

  @ViewChild('innerButton') private innerButton!: ElementRef<HTMLButtonElement>;
  

  /** ----------------------------------------- Constructor ----------------------------------------- **/
  constructor() { }

  /** ------------------------------------------- OnInit -------------------------------------------- **/
  ngOnInit(): void { }

  /** ------------------------------------------- Methods ------------------------------------------- **/
  get nativeElement(): HTMLButtonElement {
    return this.innerButton.nativeElement;
  }

}
