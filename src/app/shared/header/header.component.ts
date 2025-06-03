import { Component, OnInit, HostListener, ElementRef, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { gsap } from 'gsap';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  scrolled = false;
  isBrowser: boolean;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    // Animación inicial de entrada
    gsap.from('.navbar', {
      duration: 1.2,
      y: -100,
      opacity: 0,
      ease: 'power4.out',
    });

    gsap.from('.navbar__logo, .navbar__title, .navbar__links a', {
      duration: 1,
      opacity: 0,
      y: -20,
      stagger: 0.2,
      delay: 0.5,
      ease: 'power2.out',
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!this.isBrowser) return;

    this.scrolled = window.scrollY > 50;
    const nav = this.el.nativeElement.querySelector('.navbar');

    if (this.scrolled) {
      gsap.to(nav, {
        duration: 0.5,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        backgroundColor: '#121212',
        color: '#ffffff',
        ease: 'power2.out',
      });
    } else {
      gsap.to(nav, {
        duration: 0.5,
        boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
        backgroundColor: 'transparent',
        color: '#ffffff',
        ease: 'power2.inOut',
      });
    }
  }
}
