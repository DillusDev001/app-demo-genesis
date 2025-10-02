import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-check-box',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './custom-check-box.component.html',
  styleUrls: ['./custom-check-box.component.css']
})
export class CustomCheckBoxComponent implements OnInit {
  /** ------------------------------------- Variables de Inicio ------------------------------------- **/
  @Input() label: string = '';
  @Input() control!: FormControl;

  /** ----------------------------------------- Constructor ----------------------------------------- **/
  constructor() { }

  /** ------------------------------------------- OnInit -------------------------------------------- **/
  ngOnInit() { }

  /** ------------------------------------------- Methods ------------------------------------------- **/

  /** ---------------------------------------- Methods onClick -------------------------------------- **/


}
