import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CustomIconComponent } from "../custom-icon/custom-icon.component";

@Component({
  selector: 'app-custom-menu-button',
  imports: [CommonModule, CustomIconComponent],
  templateUrl: './custom-menu-button.component.html',
  styleUrls: ['./custom-menu-button.component.css']
})
export class CustomMenuButtonComponent implements OnInit {
  /** ------------------------------------- Variables de Inicio ------------------------------------- **/
  @Input() label: string = '';
  @Input() selected: string = '';
  @Input() span: string = '';
  @Input() icon: string = '';
  @Input() submenu: boolean = false;
  @Input() expand: boolean = false;

  /** ----------------------------------------- Constructor ----------------------------------------- **/
  constructor() { }

  /** ------------------------------------------- OnInit -------------------------------------------- **/
  ngOnInit() { }

  /** ------------------------------------------- Methods ------------------------------------------- **/

  /** --------------------------------------- Methods onClick --------------------------------------- **/


}
