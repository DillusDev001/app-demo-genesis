import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomIconComponent } from "../custom-icon/custom-icon.component";

@Component({
  selector: 'app-custom-sub-menu-button',
  imports: [CommonModule, CustomIconComponent],
  templateUrl: './custom-sub-menu-button.component.html',
  styleUrls: ['./custom-sub-menu-button.component.css']
})
export class CustomSubMenuButtonComponent implements OnInit {
  /** ------------------------------------- Variables de Inicio ------------------------------------- **/
  @Input() label: string = '';
  @Input() selected: string = '';
  @Input() span: string = '';
  @Input() icon: string = '';

  @Output() response = new EventEmitter<any>();
  /** ----------------------------------------- Constructor ----------------------------------------- **/
  constructor() { }

  /** ------------------------------------------- OnInit -------------------------------------------- **/
  ngOnInit() { }

  /** ------------------------------------------- Methods ------------------------------------------- **/

  /** ---------------------------------------- Methods onClick -------------------------------------- **/

}
