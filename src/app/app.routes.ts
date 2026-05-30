import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { MasSobreNosostros } from './pages/sobre-nosostros/sobre-nosostros';
import { SerConsultor } from './pages/components/ser-consultor/ser-consultor';


export const routes: Routes = [
  {
      path: '',
      component: HomeComponent,
      title: 'Consultores 1509 | Inicio'
  },

  // Ruta Sobre Nosotros
  {
    path: 'sobre-nosotros',
    component: MasSobreNosostros,
    title: 'Consultores 1509 | Sobre Nosotros'
  },

  {
    path: 'ser-consultor/:id',
    component: SerConsultor,
    title: 'Consultores 1509 | ServicioConsultor'
  },

  // Redireccionar rutas no encontradas al inicio
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
