import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/material';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    providePrimeNG({
            theme: {
                 preset: Aura,
                options: {
                    prefix: 'p',
          darkModeSelector: 'class', // Usa clase para activar dark manualmente
          cssLayer: false
                }
            }
        }),
    provideHttpClient(),
    provideClientHydration(),
    provideAnimationsAsync()
  ]
};
