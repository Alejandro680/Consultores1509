import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Perfil } from '../perfil-detalle/perfil-detalle';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-carousel-perfil',
  imports: [CommonModule],
  templateUrl: './carousel-perfil.html',
  styleUrl: './carousel-perfil.css',
})
export class CarouselPerfil {
 @Input() perfiles: Perfil[] = [];
  @Output() perfilSeleccionado = new EventEmitter<Perfil>();

  slideActual = 0;
  TamañoGrupo = window.innerWidth < 650 ? 1 : 3; // 👈 dinámico

  get totalSlides(): number {
    return Math.ceil(this.perfiles.length / this.TamañoGrupo);
  }

  get slides(): Perfil[][] {
    const slides: Perfil[][] = [];
    for (let i = 0; i < this.perfiles.length; i += this.TamañoGrupo) {
      slides.push(this.perfiles.slice(i, i + this.TamañoGrupo));
    }
    return slides;
  }

  @HostListener('window:resize', [])
  onResize() {
    this.TamañoGrupo = window.innerWidth < 650 ? 1 : 3;
    this.slideActual = 0; // opcional: reinicia al primer slide
  }

  irAlSlide(index: number): void {
    this.slideActual = index;
  }

  anterior(): void {
    this.slideActual = (this.slideActual - 1 + this.totalSlides) % this.totalSlides;
  }

  siguiente(): void {
    this.slideActual = (this.slideActual + 1) % this.totalSlides;
  }

  seleccionarPerfil(perfil: Perfil): void {
    this.perfilSeleccionado.emit(perfil);
  }

}
