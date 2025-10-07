import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountMenuComponent } from './account-menu/account-menu.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [RouterModule, AccountMenuComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {

}
