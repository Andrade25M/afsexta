import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RefreshService {
  private listUpdated$ = new Subject<void>();

  notifyListUpdated() { this.listUpdated$.next(); }
  onListUpdated(): Observable<void> { return this.listUpdated$.asObservable(); }
}
