import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
      provideHttpClient(
      withFetch(),      // Usar fetch API en lugar de XMLHttpRequest
      // withInterceptors([])  // Opcional: para interceptores
    )
  ]
};
