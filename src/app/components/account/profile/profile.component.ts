import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { getLocalDataLogged, setLocalDataLogged } from '../../../core/utils/storage.utils';
import { CommonModule } from '@angular/common';
import { FirebaseGenesisService } from '../../../core/services/firebase.genesis.service';
import { environment } from '../../../../environments/environment';
import { Usuario } from '../../../core/interfaces/app/comprador/usuario.inteface';
import { ResultFirebase } from '../../../core/interfaces/api/result-firebase.interface';
import { NotificationService } from '../../../core/services/ui/notification.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  firebaseService = inject(FirebaseGenesisService);
  notificationService = inject(NotificationService);

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      whatsapp: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const localData = getLocalDataLogged();
    if (localData && localData.usuario) {
      this.firebaseService.findDocByField<Usuario>(
        environment.collection.usuario,
        'idUsuario',
        localData.usuario.idUsuario
      ).then((userResult: ResultFirebase<Usuario>) => {
        if (userResult.success && userResult.data) {
          const user = userResult.data;
          this.profileForm.patchValue({
            nombre: user.nombre,
            email: user.email,
            whatsapp: user.whatsapp
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const localData = getLocalDataLogged();
      if (localData && localData.usuario) {
        this.firebaseService.updateDoc(
          environment.collection.usuario,
          this.profileForm.value,
          localData.usuario.idUsuario
        ).then(result => {
          console.log(result)
          const updatedData = { ...localData };
          updatedData.usuario = { ...updatedData.usuario, ...this.profileForm.value };
          setLocalDataLogged(updatedData);
          this.notificationService.notify('success', '¡Datos actualizados correctamente!');
        });
      }
    }
  }
}
