import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Transaction } from '../../models/transaction.model';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [TransactionFormComponent, DecimalPipe]
})
export class HomeComponent implements OnInit {

  transactions: Transaction[] = [];
  balance = 0;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.api.getTransactions().subscribe(list => {
      this.transactions = list;
      this.balance = this.transactions.reduce((sum, t) =>
        sum + (t.type === 'income' ? t.amount : -t.amount), 0);
    });
  }

  refresh() { this.load(); }
}
