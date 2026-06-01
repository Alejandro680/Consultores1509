import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Perfil, PerfilDetalle } from '../components/perfil-detalle/perfil-detalle';
import { CarouselPerfil } from '../components/carousel-perfil/carousel-perfil';


interface Valor {
  name: string;
  description: string;
  icon: string;
  iconType: 'fontawesome' | 'png';
  position: 'superior' | 'inferior';
}

@Component({
  selector: 'app-mas-sobre-nosostros',
  imports: [CommonModule, PerfilDetalle, CarouselPerfil],
  templateUrl: './sobre-nosostros.html',
  styleUrls: ['./sobre-nosostros.css'],
  // ✅ ELIMINAMOS las animaciones complejas para que sea instantáneo
})
export class MasSobreNosostros {
   modalAbierto = false;
  expanded = false;
  perfilSeleccionado: Perfil | null = null;



  valores: Valor[] = [
    {
      name: 'ÉTICA',
      description: 'Actuamos con integridad, responsabilidad y respeto a la ley, priorizando siempre el bien común y la dignidad humana.',
      icon: 'assets/ETICA.png',
      iconType: 'png',
      position: 'superior'
    },
    {
      name: 'JUSTICIA SOCIAL',
      description: 'Actuamos con integridad, responsabilidad y respeto a la ley, priorizando siempre el bien común y la dignidad humana.',
      icon: 'assets/golden balanza.png',
      iconType: 'png',
      position: 'superior'
    },
    {
      name: 'EMPATÍA',
      description: 'Actuamos con integridad, responsabilidad y respeto a la ley, priorizando siempre el bien común y la dignidad humana.',
      icon: 'fas fa-handshake',
      iconType: 'fontawesome',
      position: 'inferior'
    },
    {
      name: 'TRANSPARENCIA',
      description: 'Actuamos con integridad, responsabilidad y respeto a la ley, priorizando siempre el bien común y la dignidad humana.',
      icon: 'assets/ICONO SHARE.png',
      iconType: 'png',
      position: 'inferior'
    },
    {
      name: 'EXCELENCIA',
      description: 'Actuamos con integridad, responsabilidad y respeto a la ley, priorizando siempre el bien común y la dignidad humana.',
      icon: 'assets/EXELENCIA.png',
      iconType: 'png',
      position: 'inferior'
    }
  ];

  get valoresSuperiores(): Valor[] {
    return this.valores.filter(v => v.position === 'superior');
  }

  get valoresInferiores(): Valor[] {
    return this.valores.filter(v => v.position === 'inferior');
  }

  toggleExpand(): void {
    this.expanded = !this.expanded;

    if (this.expanded) {
      setTimeout(() => {
        const logoElement = document.querySelector('.centro-container');
        if (logoElement) {
          logoElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 50); // Reducido de 100ms a 50ms
    }
  }

   perfiles: Perfil[] = [
    {
      id: 1,
      nombre: 'Marisela Maldonado Gómez',
      cargo: 'SOCIA DIRECTORA',
      descripcionCorta: 'Licenciada en Derecho, egresada de la Universidad de Guadalajara, en el año de 2008.',
      descripcionCompleta: `Certificada por parte de la Comisión Nacional Bancaria y de Valores con número de Oficio: MAGMPT6-2022-70112-NCOC, como Auditor Externo Independiente y/o Oficial de Cumplimiento en Materia de Prevención de Operaciones con Recursos de Procedencia Ilícita y Financiamiento al Terrorismo. Socia fundadora, coordina las áreas de asesoría corporativa, contractual, societario, Registro de marca, mobiliario y Prevención de Lavado de dinero y manuales operativos.`,
      imagen: 'assets/marisela.jpg'
    },
    {
      id: 2,
      nombre: 'Jose Manuel Gómez Pedraza',
      cargo: 'SOCIO',
      descripcionCorta: 'Lic. en Derecho, egresado de la Universidad de Guadalajara, en el 2018.',
      descripcionCompleta: `Socio fundador, coordina las áreas de asesoría contractual (litigio) y métodos alternos de Solución de Controversias.`,
      imagen: 'assets/jose.jpg'
    },
    {
      id: 3,
      nombre: 'Andrés Gutiérrez Rivera',
      cargo: 'SOCIO',
      descripcionCorta: 'Lic. en Contabilidad, egresado de la Universidad de Guadalajara, en el año 2013.',
      descripcionCompleta: `Socio fundador, coordina las áreas de contable y financiera.`,
      imagen: 'assets/andres.jpg'
    },
    {
      id: 4,
      nombre: 'Jorge Iván Gutiérrez Maldonado',
      cargo: 'PLANTILLA LABORAL',
      descripcionCorta: 'Socio y Abogado egresado de la Universidad de Guadalajara.',
      descripcionCompleta: `Coordina las áreas de litigio y Prevención de Lavado de Dinero.`,
      imagen: 'assets/jorge.jpg'
    }
  ];

  onPerfilSeleccionado(perfil: Perfil): void {
    this.perfilSeleccionado = perfil;
    // Scroll suave al detalle
    setTimeout(() => {
      const detalle = document.querySelector('.perfil-detalle-section');
      if (detalle) {
        detalle.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  cerrarDetalle(): void {
    this.perfilSeleccionado = null;
  }


}
