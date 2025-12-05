import { Routes } from '@angular/router';
import { ListaComponent } from './lista/lista';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'lista', component: ListaComponent }
];
