import { Routes } from '@angular/router';
import { ToDoComponent } from './todo.component';

export const routes: Routes = [
  { path: '', redirectTo: '/todo', pathMatch: 'full' },
  { path: 'todo', component: ToDoComponent },
];
