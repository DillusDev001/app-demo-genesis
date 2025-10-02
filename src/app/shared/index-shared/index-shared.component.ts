import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomInputComponent } from "../components/custom-input/custom-input.component";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomButtonComponent } from "../components/custom-button/custom-button.component";
import { CustomLoadingComponent } from "../components/custom-loading/custom-loading.component";
import { CustomDropDownComponent } from "../components/custom-drop-down/custom-drop-down.component";
import { CustomMenuButtonComponent } from "../components/custom-menu-button/custom-menu-button.component";
import { CustomSubMenuButtonComponent } from "../components/custom-sub-menu-button/custom-sub-menu-button.component";
import { CustomStatusIndicatorComponent } from "../components/custom-status-indicator/custom-status-indicator.component";
import { CustomIconComponent } from "../components/custom-icon/custom-icon.component";
import { CustomTabButtonComponent } from "../components/custom-tab-button/custom-tab-button.component";
import { CustomTextAreaComponent } from "../components/custom-text-area/custom-text-area.component";
import { CustomCheckBoxComponent } from "../components/custom-check-box/custom-check-box.component";
import { CustomDotMenuComponent } from "../components/custom-dot-menu/custom-dot-menu.component";
import { CustomModalComponent } from "../components/custom-modal/custom-modal.component";
import { CommonModule } from '@angular/common';
import { EmitterResponse } from '../../core/interfaces/emitter-response.interface';
import { FirebaseGenesisService } from '../../core/services/firebase.genesis.service';
import { environment } from '../../../environments/environment';
import { defaultUsuario, Usuario } from '../../modules/comprador/utils/usuario.inteface';
import { NotificationService } from '../../core/services/ui/notification.service';
import { ModalService } from '../../core/services/ui/modal.service';

@Component({
  selector: 'app-index-shared',
  imports: [CommonModule,
    CustomInputComponent, CustomButtonComponent, CustomLoadingComponent,
    CustomDropDownComponent, CustomMenuButtonComponent, CustomSubMenuButtonComponent,
    CustomStatusIndicatorComponent, CustomIconComponent, CustomTabButtonComponent,
    CustomTextAreaComponent, CustomCheckBoxComponent, CustomDotMenuComponent,
  ],
  templateUrl: './index-shared.component.html',
  styleUrl: './index-shared.component.css'
})
export class IndexSharedComponent implements OnInit {
  /** ------------------------------------- Variables de Inicio ------------------------------------- **/
  // DateFormatMostrar = DateFormatMostrar;

  // Data Local Storeage - Variable
  isOnline!: boolean;

  //dataLocalStorage: DataLocalStorage = defaultDataLocalStorage();

  // Usuario logeado
  //userLogeado!: Usuario;

  // loading spinner
  isLoading: boolean = false;

  // ================  ================ //
  //@Input() type: string = ''; // ver - editar - nuevo
  @Input() type: 'nuevo' | 'editar' | 'ver' | '' = '';
  @Output() response = new EventEmitter<EmitterResponse>();

  formFormulario = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    busqueda: new FormControl('', [Validators.required]),
    value: new FormControl('', [Validators.required]),
    area: new FormControl('', [Validators.required]),
    check: new FormControl(false, [Validators.required]),
  });

  onCloseEmitter: any = { bool: false, data: null }; // para enviar respuesta al cerrar

  data = [
    { data: 'a', value: 'a' },
    { data: 'b', value: 'b' },
    { data: 'c', value: 'c' },
  ]

  menuSelected: string = '';

  showSubMenu1: boolean = false;
  showSubMenu2: boolean = false;

  subMenuSelected: string = '';

  tabSelected: string = 'Tab 1';

  dataDotMenu = [
    { data: 'a', value: 'a' },
    { data: 'b', value: 'b' },
    { data: 'c', value: 'c' },
  ]

  //dataBusquedaUsuario = usuarioArrayBusqueda;

  /** ----------------------------------------- Constructor ----------------------------------------- **/
  constructor(
    private notificationService: NotificationService,
    private modalService: ModalService,
    private firebaseGenesisService: FirebaseGenesisService
  ) { }

  /** ------------------------------------------- OnInit -------------------------------------------- **/
  ngOnInit(): void {

  }

  /** ------------------------------------------- Methods ------------------------------------------- **/

  /** ---------------------------------------- Methods onClick -------------------------------------- **/
  onClickMenuButton(menu: string) {
    this.menuSelected = menu;

    switch (menu) {
      case 'Menú 1':
        this.showSubMenu1 = !this.showSubMenu1;
        this.showSubMenu2 = false;
        break;

      case 'Menú 2':
        this.showSubMenu2 = !this.showSubMenu2;
        this.showSubMenu1 = false;
        break;
    }
  }

  onClickSubMenuButton(menu: string, submenu: string) {
    this.menuSelected = menu;
    this.subMenuSelected = submenu;
  }

  onClickTab(tab: string) {
    this.tabSelected = tab;
  }

  /*'accept' | 'confirm' | 'warning' | 'notification' | 'info' | ''*/
  onClick(type: 'alert' | 'warning' | 'info' | '', button?: string | undefined) {
    console.log('button :', button)
    this.showModal(type, `Modal ${type}`, 'Contenido del Modal', button, 0);
  }

  onClickNotification(type: 'success' | 'error' | 'warning' | 'info', msg: string) {
    this.showNotification(type, msg)
  }

  /** --------------------------------------- Consultas Sevidor ------------------------------------- **/
  async agregar() {
    const usuario: Usuario = {
      idUsuario: 0,
      email: '',
      password: '',
      nombre: '',
      whatsapp: ''
    }
    const create = await this.firebaseGenesisService.createDoc(environment.collection.usuario, usuario);

    console.log(create);
  }

  /** ------------------------------------- Onclick file import ------------------------------------- **/

  /** ------------------------------------------- Receiver ------------------------------------------ **/

  /** -------------------------------------------- Events ------------------------------------------- **/

  /** ----------------------------------------- Child Emiter ---------------------------------------- **/
  onTextChange(text: string) {
    console.log("text change: ", text);
  }

  onResponse(event: EmitterResponse) {
    console.log("event: ", event);
    //this.modalShow = false;
  }

  onResponseModal(event: EmitterResponse) {
    console.log("event: ", event);
    //this.modalShow = false;
  }

  /** --------------------------------------- ShowNotification -------------------------------------- **/
  showNotification(type: 'success' | 'error' | 'warning' | 'info', msg: string) {
    this.notificationService.notify(type, msg);
  }

  /** ------------------------------------------- ShowModal ----------------------------------------- **/
  async showModal(type: 'alert' | 'warning' | 'info' | '', title: string, content: string, button: string | undefined = 'Aceptar', value: string | number) {
    const result = await this.modalService.open({ type, title, content, button, value });

    console.log('Respuesta del modal:', result);
  }
}
