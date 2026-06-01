import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Perfil } from '../perfil-detalle/perfil-detalle';


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

  get totalSlides(): number {
    return Math.ceil(this.perfiles.length / 3);
  }

  get slides(): Perfil[][] {
    const slides: Perfil[][] = [];
    for (let i = 0; i < this.perfiles.length; i += 3) {
      slides.push(this.perfiles.slice(i, i + 3));
    }
    return slides;
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
