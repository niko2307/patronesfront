import { Component, AfterViewInit, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideIconsModule } from '../lucide-icons.module'; 
import gsap from 'gsap';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconsModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements AfterViewInit {
  private host = inject(ElementRef<HTMLElement>);

  ngAfterViewInit(): void {
    // Solo ejecuta si estamos en el navegador (no en SSR)
    if (typeof window !== 'undefined') {
      const items = this.host.nativeElement.querySelectorAll('.fo-item');
      if (items.length > 0) {
        gsap.from(items, {
          opacity: 0,
          y: 40,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out'
        });
      }
    }
  }
}