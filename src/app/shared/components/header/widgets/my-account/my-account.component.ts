import { Component, HostListener, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AccountUser } from '../../../../interface/account.interface';
import { AccountState } from '../../../../state/account.state';
import { AuthState } from '../../../../state/auth.state';
import { Logout } from '../../../../action/auth.action';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent {

  @Input() style: string = 'basic';

  @Select(AuthState.isAuthenticated) isAuthenticated$: Observable<boolean>;
  @Select(AccountState.user) user$: Observable<AccountUser>;

  isOpen = false;

  constructor(private store: Store) {}

  toggle() {
    this.isOpen = !this.isOpen;
  }

  close() {
    this.isOpen = false;
  }

  logout() {
    this.isOpen = false;
    this.store.dispatch(new Logout());
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('app-my-account')) {
      this.isOpen = false;
    }
  }

}
