import { Component, Input, OnInit } from '@angular/core';
import { CustomIconComponent } from "../custom-icon/custom-icon.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-tab-button',
  imports: [CommonModule, CustomIconComponent],
  templateUrl: './custom-tab-button.component.html',
  styleUrls: ['./custom-tab-button.component.css'],
})
export class CustomTabButtonComponent implements OnInit {
  /** ------------------------------------- Variables de Inicio ------------------------------------- **/
  @Input() label: string = '';
  @Input() selected: string = '';
  @Input() class: string = '';
  @Input() icon: string = '';
  @Input() span: string = '';
  @Input() enabled: boolean = true;
  /** ----------------------------------------- Constructor ----------------------------------------- **/
  constructor() { }

  /** ------------------------------------------- OnInit -------------------------------------------- **/
  ngOnInit() { }

  /** ------------------------------------------- Methods ------------------------------------------- **/

  /** ---------------------------------------- Methods onClick -------------------------------------- **/

}
