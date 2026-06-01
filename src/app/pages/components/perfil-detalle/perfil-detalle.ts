import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';


export interface Perfil {
  id: number;
  nombre: string;
  cargo: string;
  descripcionCorta: string;
  descripcionCompleta: string;
  imagen: string;
}

@Component({
  selector: 'app-perfil-detalle',
  imports: [CommonModule],
  templateUrl: './perfil-detalle.html',
  styleUrl: './perfil-detalle.css',
    animations: [
    trigger('slideInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('0.3s ease-in', style({ opacity: 0, transform: 'translateY(30px)' }))
      ])
    ])
  ]
})
export class PerfilDetalle {
  @Input() perfilSeleccionado: Perfil | null = null;
  @Output() cerrar = new EventEmitter<void>();

  cerrarDetalle(): void {
    this.cerrar.emit();
  }
}
