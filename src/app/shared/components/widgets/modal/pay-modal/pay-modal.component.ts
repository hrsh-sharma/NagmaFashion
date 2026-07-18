import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Order } from '../../../../../shared/interface/order.interface';
import { FormControl, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SettingState } from '../../../../../shared/state/setting.state';
import { Values } from '../../../../../shared/interface/setting.interface';
import { RePayment } from '../../../../../shared/action/order.action';

@Component({
  selector: 'app-pay-modal',
  templateUrl: './pay-modal.component.html',
  styleUrls: ['./pay-modal.component.scss']
})
export class PayModalComponent {

  @Select(SettingState.setting) setting$: Observable<Values>;

  public isOpen: boolean = false;
  public order: Order;
  public paymentType = new FormControl('', [Validators.required]);

  constructor(private store: Store) {}

  openModal(order: Order) {
    this.order = order;
    this.paymentType.reset();
    this.paymentType.markAsUntouched();
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.paymentType.reset();
    this.paymentType.markAsUntouched();
  }

  submit() {
    this.paymentType.markAllAsTouched();
    if (this.paymentType.valid && this.paymentType.value) {
      const paymentMethod = this.paymentType.value.trim();
      if (!paymentMethod) return;

      const data = {
        order_number: this.order.order_number,
        payment_method: paymentMethod
      };

      this.store.dispatch(new RePayment(data)).subscribe({
        error: (err) => { console.error('Repayment error:', err); },
        complete: () => { this.close(); }
      });
    }
  }
}
