import { Component, OnInit } from '@angular/core';
import { finalize, timeout, filter } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { RefreshService } from '../services/refresh.service';
import { Transaction } from '../models/transaction.model';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista.html',
  styleUrls: ['./lista.css']
})
export class ListaComponent {

  movimentos: Transaction[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService, private router: Router, private refresh: RefreshService) {}

  ngOnInit() {
    this.load();
    this.router.events.pipe(filter((e: any) => e instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
      if (e.urlAfterRedirects === '/lista') this.load();
    });
    this.refresh.onListUpdated().subscribe(() => this.load());
  }

  load() {
    this.loading = true;
    this.error = '';
    this.api.getTransactions()
      .pipe(timeout(5000), finalize(() => { this.loading = false; }))
      .subscribe({
        next: (dados: Transaction[]) => this.movimentos = dados,
        error: (err) => {
          this.error = 'Erro ao carregar movimentos: ' + (err?.message || err?.status || 'timeout');
          console.error(err);
        }
      });
  }

  remove(id?: string) {
    if (!id) return;
    if (!confirm('Excluir movimento?')) return;
    this.loading = true;
    this.api.deleteTransaction(id)
      .pipe(timeout(5000), finalize(() => { this.loading = false; }))
      .subscribe({
        next: () => this.load(),
        error: (err) => {
          this.error = 'Erro ao excluir movimento: ' + (err?.message || err?.status || 'timeout');
          console.error(err);
        }
      });
  }
}
