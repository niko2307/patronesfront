import { Component, computed, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../app/shared/header/header.component';
import { FooterComponent } from '../app/shared/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ventanilla-unica-frontend';

  mostrarLayout = signal(true);

 constructor(private router: Router) {
  this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      const ruta = event.urlAfterRedirects;
      // Oculta layout si estás en /admin o /ciudadano
      this.mostrarLayout.set(
        !ruta.startsWith('/admin') &&
        !ruta.startsWith('/ciudadano')
      );
    }
  });
}

}
