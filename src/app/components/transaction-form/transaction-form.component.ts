import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Transaction } from '../../models/transaction.model';

@Component({
  standalone: true,
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css'],
  imports: [FormsModule]
})
export class TransactionFormComponent {

  @Output() saved = new EventEmitter<void>();

  model: Transaction = {
    type: 'expense',
    category: '',
    amount: 0,
    date: new Date().toISOString().substring(0, 10),
    description: ''
  };

  constructor(private api: ApiService) {}

  submit() {
    this.api.createTransaction(this.model).subscribe(() => {
      this.saved.emit();
      this.model = {
        type: 'expense',
        category: '',
        amount: 0,
        date: new Date().toISOString().substring(0, 10),
        description: ''
      };
    });
  }
}
