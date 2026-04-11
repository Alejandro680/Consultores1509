import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';

// Interfaz simplificada sin expansión
interface Servicio {
  title: string;
  desc: string;
  icon: string;
  url: string; // Añadimos una propiedad para el destino del botón
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit, OnInit {

  // ... (Tus slides se mantienen igual) ...
  slides = [
    { src: 'assets/IMAGEN FONDO 01-01.jpeg', caption: '' },
    { src: 'https://picsum.photos/1200/400?random=2', caption: '' },
    { src: 'https://picsum.photos/1200/400?random=3', caption: '' },
    { src: 'https://picsum.photos/1200/400?random=4', caption: '' },
    { src: 'https://picsum.photos/1200/400?random=5', caption: '' }
  ];

  items = [
    {
      id: 'inicio',
      label:'',
      navLabel:'INICIO',
      type: 'inicio',
      content: {}
    },
    {
      id: 'quienes',
      label:'QUIENES SOMOS',
      navLabel:'QUIENES SOMOS',
      type: 'quienes',
      content: {
        title: 'CONSULTORES 1509',
        subtitle: 'Conocimiento, experiencia y compromiso en cada solución jurídica',
        description1: 'Fundada en 2012, es una firma especializada en materia legal, corporativa, contractual, societaria e inmobiliaria.',
        description2: 'Nuestro equipo está integrado por profesionales con sólida formación técnica y amplia trayectoria.',
        button: 'MÁS SOBRE NOSOTROS'
      },
      stats: [
        { value: 15855, label: 'VISITAS A LA PAGINA', icon: 'assets/ICONO A-01.png' },
        { value: 253, label: 'DEMANDAS ACTIVAS', icon: 'assets/ICONO B-01.png' },
        { value: 15855, label: 'DEMANDAS GANADAS', icon: 'assets/ICONO C-01.png' }
      ]
    },
    {
      id: 'servicios',
      navLabel:'SERVICIOS',
      label: 'NUESTROS SERVICIOS',
      type: 'servicios',
      servicios: [
        {
          title: 'PREVENCIÓN DE LAVADO DE DINERO',
          desc: 'Ayudamos a nuestros clientes en un esfuerzo conjunto entre autoridades, entidades financieras y empresas...',
          icon: 'assets/ICONO 4-01.png',
          url: '/lavado-dinero'
        },
        {
          title: 'DERECHO ADMINISTRATIVO',
          desc: 'Asesorar, representar y defender los intereses de nuestros clientes frente a la administracion publica...',
          icon: 'assets/ICONO 2-01.png',
          url: '/derecho-administrativo'
        },
        {
          title: 'DERECHO CORPORATIVO',
          desc: 'Asesoramos a nuestros clientes para garantizar que sus empresas y/o negocios cumplan con todas las leyes...',
          icon: 'assets/ICONO 6-01.png',
          url: '/derecho-corporativo'
        },
        {
          title: 'PREVENCIÓN DE CIVIL / FAMILIAR',
          desc: 'Asesoramos y representamos legalmente a nuestros clientes en jucios, medicacion y redaccion de documentos...',
          icon: 'assets/ICONO 5-01.png',
          url: '/civil-familiar'
        },
        {
          title: 'DERECHO MERCANTIL',
          desc: 'Asesoramos y representamos a nuestros clientes en asuntos legales relacionados con sus actividades comerciales...',
          icon: 'assets/ICONO 3-01.png',
          url: '/derecho-mercantil'
        },
        {
          title: 'DERECHO INTELECTUAL',
          desc: 'Asesoramos a nuestros clientes a proteger sus creaciones como obras literarias, marcas y derechos de autor.',
          icon: 'assets/ICONO 1-01.png',
          url: '/derecho-intelectual'
        }
      ]
    },
     {
      id: 'cursos',
      navLabel:'CURSOS',
      label: '',
      type: '',
      content: {}
    },
    {
      id: 'contacto',
      navLabel: 'CONTACTO',
      label:'PROCESO DE DEMANDA',
      type: 'proceso',
     // En tu app.ts, dentro del objeto de contacto
      pasos: [
        { number: 1, title: 'REQUEST CALL', desc: 'Lorem ipsum...', icon: 'fas fa-phone-alt' },
        { number: 2, title: 'CONSULTATION', desc: 'Lorem ipsum...', icon: 'fas fa-comments' },
        { number: 3, title: 'PLANNING', desc: 'Lorem ipsum...', icon: 'fas fa-project-diagram' },
        { number: 4, title: 'WORK PROCESS', desc: 'Lorem ipsum...', icon: 'fas fa-gavel' },
        { number: 5, title: 'CORRECTING', desc: 'Lorem ipsum...', icon: 'fas fa-pen-nib' },
        { number: 6, title: 'DELIVER', desc: 'Lorem ipsum...', icon: 'fas fa-check-double' }
      ],
        content: { button: 'CONTACTO' }
    }
  ];

  serviciosAgrupados: any[][] = [];
  showFloatingBtn = false;

  ngOnInit(): void {
    this.agruparServicios();
  }

  agruparServicios(): void {
    const serviciosRaw = this.items.find(i => i.type === 'servicios')?.servicios || [];
    const TamañoGrupo = 6;
    for (let i = 0; i < serviciosRaw.length; i += TamañoGrupo) {
      this.serviciosAgrupados.push(serviciosRaw.slice(i, i + TamañoGrupo));
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const servicesCarousel = document.getElementById('servicesCarousel');
      if (servicesCarousel) {
        new bootstrap.Carousel(servicesCarousel, { interval: 5000 });
      }

      const scrollContent = document.body;
      if (scrollContent) {
        new bootstrap.ScrollSpy(scrollContent, {
          target: '#navbar-example',
          offset: 200
        });
      }

      this.setupIntersectionObserver();
    }, 300);
  }

  // --- NUEVA FUNCIÓN DE NAVEGACIÓN ---
  navegarAServicio(servicio: any) {
    console.log('Navegando a:', servicio.url);
    // Aquí puedes usar el Router de Angular si tienes rutas configuradas:
    // this.router.navigate([servicio.url]);
    // O una redirección externa:
    // window.location.href = servicio.url;
  }


  setupIntersectionObserver() {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          const counters = entry.target.querySelectorAll('.counter');
          counters.forEach(c => this.animateSingleCounter(c as HTMLElement));
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    });

    sections.forEach(s => observer.observe(s));
  }

  animateSingleCounter(counter: HTMLElement) {
    const target = +counter.getAttribute('data-target')!;
    let count = 0;
    const step = Math.ceil(target / 100);

    const updateCount = () => {
      count += step;
      if (count > target) count = target;
      counter.textContent = count.toLocaleString();
      if (count < target) requestAnimationFrame(updateCount);
    };
    updateCount();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showFloatingBtn = window.scrollY > 400;
  }
}
