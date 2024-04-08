import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./event/components/eventlist.component').then(
        m => m.EventListComponent
      ),
  },
];
