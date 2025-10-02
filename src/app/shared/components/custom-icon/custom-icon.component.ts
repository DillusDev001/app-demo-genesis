import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-icon',
  imports: [],
  templateUrl: './custom-icon.component.html',
  styleUrls: ['./custom-icon.component.css']
})
export class CustomIconComponent implements OnInit {
  /** ------------------------------------- Variables de Inicio ------------------------------------- **/
  @Input() span: string = '';
  @Input() icon: string = '';

  /** ----------------------------------------- Constructor ----------------------------------------- **/
  constructor() { }

  /** ------------------------------------------- OnInit -------------------------------------------- **/
  ngOnInit() { }

  /** ------------------------------------------- Methods ------------------------------------------- **/

  /** --------------------------------------- Methods onClick --------------------------------------- **/


}
