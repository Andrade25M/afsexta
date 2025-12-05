import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTransactions(filters?: any): Observable<Transaction[]> {
    let params = new HttpParams();
    if (filters?.category) params = params.set('category', filters.category);
    if (filters?.type) params = params.set('type', filters.type);
    return this.http.get<any[]>(`${this.baseUrl}/movimentos`, { params }).pipe(
      map(list => list.map(item => this.fromBackendToTransaction(item)))
    );
  }

  createTransaction(t: Transaction): Observable<Transaction> {
    const payload = this.toBackendPayload(t);
    return this.http.post<any>(`${this.baseUrl}/movimentos`, payload).pipe(
      map(obj => this.fromBackendToTransaction(obj))
    );
  }

  deleteTransaction(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/movimentos/${id}`);
  }

  private toBackendPayload(t: Transaction) {
    return {
      categoria: t.category,
      descricao: t.description,
      valor: t.amount,
      tipo: this.typeToBackend(t.type),
      date: t.date
    };
  }

  private typeToBackend(value: any): 'receita'|'despesa' {
    if (!value) return 'despesa';
    const v = String(value).toLowerCase();
    if (v === 'receita' || v === 'income') return 'receita';
    return 'despesa';
  }
  private fromBackendToTransaction(obj: any): Transaction {
    return {
      _id: obj._id || obj.id,
      type: this.normalizeType(obj.tipo || obj.type),
      category: obj.categoria || obj.category,
      amount: obj.valor || obj.amount,
      date: obj.date || obj.data || new Date().toISOString(),
      description: obj.descricao || obj.description || ''
    } as Transaction;
  }

  private normalizeType(value: any): 'income'|'expense' {
    if (!value) return 'expense';
    const v = String(value).toLowerCase();
    if (v === 'receita' || v === 'income') return 'income';
    if (v === 'despesa' || v === 'expense' || v === 'expensive') return 'expense';
    return 'expense';
  }
}
