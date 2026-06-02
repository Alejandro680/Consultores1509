import { Component, AfterViewInit, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import * as bootstrap from 'bootstrap';

interface Servicio {
  title: string;
  desc: string;
  icon: string;
  url: string;
}

// ============================================
// COMPONENTE HOME
// ============================================
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements AfterViewInit, OnInit {

  isBrowser: boolean;
  showFloatingBtn = !false;

  // Slides del carrusel
  slides = [
    { src: 'assets/IMAGEN FONDO 01-01.jpeg', caption: '' },
    { src: '/DISENO PAGINA WEB CONSULTORES 1509-04.jpg.jpeg', caption: '' },
    { src: '/DISENO PAGINA WEB CONSULTORES 1509-05.jpg.jpeg', caption: '' },
    { src: '/DISENO PAGINA WEB CONSULTORES 1509-06.jpg.jpeg', caption: '' },
    { src: '/DISENO PAGINA WEB CONSULTORES 1509-07.jpg.jpeg', caption: '' }
  ];

  // Items de las secciones
  items = [
    {
      id: 'inicio',
      label: '',
      navLabel: 'INICIO',
      type: 'inicio',
      content: {}
    },
    {
      id: 'quienes',
      label: 'QUIENES SOMOS',
      navLabel: 'QUIENES SOMOS',
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
      navLabel: 'SERVICIOS',
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
          title: 'DERECHO CIVIL / FAMILIAR',
          desc: 'Asesoramos y representamos legalmente a nuestros clientes en juicios, mediacion y redaccion de documentos...',
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
      navLabel: 'CURSOS',
      label: '',
      type: '',
      content: {}
    },
    {
      id: 'contacto',
      navLabel: 'CONTACTO',
      label: 'PROCESO DE DEMANDA',
      type: 'proceso',
      pasos: [
        { number: 1, title: 'Solicitar llamada', desc: 'Solicita una llamada de asesoría inicial', icon: 'fas fa-mobile-alt text-primary-dark' },
        { number: 2, title: 'CONSULTA ', desc: 'Consulta detallada de tu caso', icon: 'fas fa-comments text-primary' },
        { number: 3, title: 'PLANIFICACIÓN ', desc: 'Planificación estratégica', icon: 'fas fa-sitemap text-primary-dark' },
        { number: 4, title: 'PROCESO DE TRABAJO', desc: 'Proceso de trabajo legal', icon: 'fas fa-cogs text-primary' },
        { number: 5, title: 'CORRECCIÓN ', desc: 'Ajustes y correcciones',  icon: 'fas fa-pencil-alt text-primary-dark' },
        { number: 6, title: 'ENTREGA ', desc: 'Entrega de resultados', icon: 'fas fa-check-square text-primary' }
      ],
      content: { button: 'CONTACTO' }
    }
  ];

  serviciosAgrupados: any[][] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  irASobreNosotros(): void {
    this.router.navigate(['/sobre-nosotros']);
  }



  // ============================================
  // MÉTODO DE NAVEGACIÓN A SERVICIO ACTUALIZADO
  // ============================================
  navegarAServicio(servicio: any): void {
  console.log('Navegando a:', servicio.title);

  // Crear un slug o identificador único basado en el título del servicio
  let servicioId = '';

  switch (servicio.title) {
    case 'PREVENCIÓN DE LAVADO DE DINERO':
      servicioId = 'prevencion-lavado';
      break;
    case 'DERECHO ADMINISTRATIVO':
      servicioId = 'derecho-administrativo';
      break;
    case 'DERECHO CORPORATIVO':
      servicioId = 'derecho-corporativo';
      break;
    case 'DERECHO CIVIL / FAMILIAR':
      servicioId = 'derecho-civil-familiar';
      break;
    case 'DERECHO MERCANTIL':
      servicioId = 'derecho-mercantil';
      break;
    case 'DERECHO INTELECTUAL':
      servicioId = 'derecho-intelectual';
      break;
    default:
      servicioId = 'prevencion-lavado';
  }

  // Navegar al componente ser-consultor con el ID
  this.router.navigate(['/ser-consultor', servicioId]);
}

  scrollToCursos(event: Event): void {
    event.preventDefault();
    const cursosSection = document.getElementById('cursos');
    if (cursosSection) {
      cursosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }



  ngOnInit(): void {
    this.agruparServicios();

  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    setTimeout(() => {
      // Inicializar carrusel principal
      const mainCarousel = document.getElementById('mainCarousel');
      if (mainCarousel) {
        new bootstrap.Carousel(mainCarousel, { interval: 5000 });
      }

      // Inicializar carrusel de servicios (sin auto-desplazamiento)
      const servicesCarousel = document.getElementById('servicesCarousel');
      if (servicesCarousel) {
      new bootstrap.ScrollSpy(document.body, {
          target: '#navbar-example',
          offset: 100
        });
      }

      // Inicializar ScrollSpy
      const spyElement = document.getElementById('spyNav');
      if (spyElement) {
        new bootstrap.ScrollSpy(document.body, {
          target: '#navbar-example',
          offset: 100
        });
      }

      // Inicializar Intersection Observer para animaciones
      this.setupIntersectionObserver();
    }, 500);
  }



agruparServicios(): void {
  const serviciosRaw = this.items.find(i => i.type === 'servicios')?.servicios || [];
  const TamañoGrupo = window.innerWidth < 768 ? 1 : 3; // 👈 cambia según tamaño
  this.serviciosAgrupados = [];

  for (let i = 0; i < serviciosRaw.length; i += TamañoGrupo) {
    this.serviciosAgrupados.push(serviciosRaw.slice(i, i + TamañoGrupo));
  }
}


  setupIntersectionObserver(): void {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          const counters = entry.target.querySelectorAll('.counter');
          counters.forEach(counter => {
            if (!counter.hasAttribute('data-animated')) {
              this.animateSingleCounter(counter as HTMLElement);
              counter.setAttribute('data-animated', 'true');
            }
          });
        }
      });
    }, {  threshold: 0.1, rootMargin: '0px' });

    sections.forEach(section => observer.observe(section));
  }

  animateSingleCounter(counter: HTMLElement): void {
    const target = parseInt(counter.getAttribute('data-target') || '0', 10);
    let current = 0;
    const increment = target / 60;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString();
      }
    };
    updateCounter();
  }

  @HostListener('window:resize', [])
onResize() {
  this.serviciosAgrupados = [];
  this.agruparServicios();
}


  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.isBrowser) return;
    this.showFloatingBtn = window.scrollY > 800;
  }
}


