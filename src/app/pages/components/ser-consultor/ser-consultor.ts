import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';


interface ServicioItem {
  id: string;
  titulo: string;
  icono: string;
  iconoTipo: 'fontawesome' | 'png';
  lista: string[];
  descripcion: string;
}

@Component({
  selector: 'app-ser-consultor',
  imports: [CommonModule],
  templateUrl: './ser-consultor.html',
  styleUrl: './ser-consultor.css',
})
export class SerConsultor implements OnInit {

  // Lista de servicios
  serviciosDB: ServicioItem[] = [
    {
      id: 'administrativo',
      titulo: 'DERECHO ADMINISTRATIVO',
      icono: 'assets/ICONO 4-01.png',
      iconoTipo: 'png',
      lista: [
        'PROCEDIMIENTOS ADMINISTRATIVOS',
        'RECURSOS LEGALES',
        'RESPONSABILIDADES ADMINISTRATIVAS',
        'CONTRATACIÓN PÚBLICA'
      ],
      descripcion: 'Asesoría especializada en materia administrativa para empresas y particulares. Gestión de trámites y defensa legal ante entidades gubernamentales.'
    },
    {
      id: 'corporativo',
      titulo: 'DERECHO CORPORATIVO',
      icono: 'assets/ICONO 2-01.png',
      iconoTipo: 'png',
      lista: [
        'CONSTITUCIÓN DE EMPRESAS',
        'GOBIERNO CORPORATIVO',
        'FUSIONES Y ADQUISICIONES',
        'CUMPLIMIENTO NORMATIVO'
      ],
      descripcion: 'Soluciones integrales para empresas en todas las etapas de su desarrollo, desde la constitución hasta su crecimiento.'
    },
    {
      id: 'mercantil',
      titulo: 'DERECHO MERCANTIL',
      icono: 'assets/ICONO 1-01.png',
      iconoTipo: 'png',
      lista: [
        'CONTRATOS MERCANTILES',
        'TÍTULOS DE CRÉDITO',
        'CONCURSOS MERCANTILES',
        'PROPIEDAD INDUSTRIAL'
      ],
      descripcion: 'Asesoría en transacciones comerciales, contratos y resolución de conflictos empresariales.'
    },
    {
      id: 'familiar',
      titulo: 'DERECHO FAMILIAR',
      icono: 'assets/ICONO 5-01.png',
      iconoTipo: 'png',
      lista: [
        'DIVORCIOS',
        'PATRIA POTESTAD',
        'PENSIÓN ALIMENTICIA',
        'SUCESIONES'
      ],
      descripcion: 'Acompañamiento legal en procesos familiares con enfoque humano y profesional.'
    },
    {
      id: 'intelectual',
      titulo: 'PROPIEDAD INTELECTUAL',
      icono: 'assets/ICONO 3-01.png',
      iconoTipo: 'png',
      lista: [
        'REGISTRO DE MARCAS',
        'PATENTES',
        'DERECHOS DE AUTOR',
        'LICENCIAMIENTO'
      ],
      descripcion: 'Protección legal de creaciones intelectuales e industriales.'
    }
  ];

  // Servicio actualmente seleccionado
  servicioActual: string = 'administrativo';

  // Estado de carga
  loading: boolean = false;

  // Getter para obtener el servicio actual
  get servicio(): ServicioItem | undefined {
    return this.serviciosDB.find(s => s.id === this.servicioActual);
  }

  ngOnInit(): void {
    console.log('SerConsultor component initialized');
  }

  // Cambiar el servicio seleccionado
  cambiarServicio(id: string): void {
    if (this.servicioActual === id) return;

    this.loading = true;
    this.servicioActual = id;

    // Simular carga (elimina esto si tienes datos reales)
    setTimeout(() => {
      this.loading = false;
    }, 300);
  }

  // Acción del botón contactar
  contactar(): void {
    console.log('Contactar sobre:', this.servicioActual);
    // Aquí puedes agregar navegación:
    // this.router.navigate(['/contacto'], { queryParams: { servicio: this.servicioActual } });
  }
}
