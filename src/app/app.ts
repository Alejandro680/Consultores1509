import { AfterViewInit, Component, HostListener, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';

// ============================================
// INTERFACES
// ============================================

interface Servicio {
  title: string;
  desc: string;
  icon: string;
  url: string;
}

interface MensajeChat {
  texto: string;
  esUsuario: boolean;
  timestamp: Date;
  tipo?: 'texto' | 'paquete' | 'servicio' | 'opciones' | 'formulario';
  data?: any;
}

interface PaqueteServicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  duracion: string;
  incluye: string[];
  icono: string;
}

interface ServicioChat {
  nombre: string;
  descripcion: string;
  accion: string;
}

interface EstadoConversacion {
  paso: string;
  contexto: any;
  ultimoMensaje?: string;
}

interface InfoCliente {
  nombre?: string;
  telefono?: string;
  email?: string;
  empresa?: string;
  empleados?: number;
  interes?: string;
  paqueteSeleccionado?: string;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit, OnInit {

  // ============================================
  // PROPIEDADES DEL CARRUSEL Y NAVBAR
  // ============================================

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
  isBrowser: boolean;

  // ============================================
  // PROPIEDADES DEL CHATBOT
  // ============================================

  showChatbot = false;
  mensajes: MensajeChat[] = [];
  mensajeUsuario = '';
  chatbotEstaEscribiendo = false;
  chatForm: FormGroup;

  // Estado del flujo conversacional
  estadoConversacion: EstadoConversacion = {
    paso: 'inicio',
    contexto: {}
  };

  infoCliente: InfoCliente = {};

  flujoContacto = [
    { paso: 'nombre', pregunta: '📝 ¿Cuál es tu nombre?', campo: 'nombre', validacion: 'texto' },
    { paso: 'telefono', pregunta: '📱 ¿Cuál es tu número de teléfono?', campo: 'telefono', validacion: 'telefono' },
    { paso: 'email', pregunta: '📧 ¿Cuál es tu correo electrónico?', campo: 'email', validacion: 'email' },
    { paso: 'empresa', pregunta: '🏢 ¿Cuál es el nombre de tu empresa?', campo: 'empresa', validacion: 'texto' },
    { paso: 'confirmacion', pregunta: '✅ ¿Confirmas que los datos son correctos?', campo: 'confirmacion', validacion: 'si_no' }
  ];

  // Datos de paquetes
  paquetesDisponibles: PaqueteServicio[] = [
    {
      id: 1,
      nombre: 'PAQUETE BÁSICO LEGAL',
      descripcion: 'Ideal para pequeñas empresas que inician',
      precio: '$5,000 MXN',
      duracion: '3 meses',
      incluye: [
        'Consultas ilimitadas vía email',
        '2 consultas telefónicas al mes',
        'Revisión de contratos básicos'
      ],
      icono: 'fas fa-rocket'
    },
    {
      id: 2,
      nombre: 'PAQUETE CORPORATIVO',
      descripcion: 'Para empresas en crecimiento',
      precio: '$12,000 MXN',
      duracion: '6 meses',
      incluye: [
        'Consultas ilimitadas (email y teléfono)',
        'Elaboración de contratos',
        'Representación legal'
      ],
      icono: 'fas fa-building'
    },
    {
      id: 3,
      nombre: 'PAQUETE PREMIUM',
      descripcion: 'Solución integral para corporativos',
      precio: '$25,000 MXN',
      duracion: '12 meses',
      incluye: [
        'Consultas 24/7 con abogado asignado',
        'Gestión legal completa',
        'Defensa en juicios'
      ],
      icono: 'fas fa-crown'
    }
  ];

  serviciosChatbot: ServicioChat[] = [
    {
      nombre: 'PREVENCIÓN LAVADO DINERO',
      descripcion: 'Curso y asesoría completa',
      accion: 'curso'
    },
    {
      nombre: 'DERECHO CORPORATIVO',
      descripcion: 'Asesoría empresarial',
      accion: 'corporativo'
    },
    {
      nombre: 'CONSULTA RÁPIDA',
      descripcion: '30 min con especialista',
      accion: 'consulta'
    }
  ];

  // ============================================
  // CONSTRUCTOR
  // ============================================

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private fb: FormBuilder) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.chatForm = this.fb.group({
      mensaje: ['']
    });
  }

  // ============================================
  // CICLO DE VIDA
  // ============================================

  ngOnInit(): void {
    this.agruparServicios();
    this.inicializarChatbot();
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    setTimeout(() => {
      const mainCarousel = document.getElementById('mainCarousel');
      if (mainCarousel) {
        new bootstrap.Carousel(mainCarousel, { interval: 5000 });
      }

      const servicesCarousel = document.getElementById('servicesCarousel');
      if (servicesCarousel) {
        new bootstrap.Carousel(servicesCarousel, {
          interval: false,
          wrap: true
        });
      }

      this.setupIntersectionObserver();
    }, 500);
  }

  // ============================================
  // MÉTODOS DE SERVICIOS Y CARRUSEL
  // ============================================

  agruparServicios(): void {
    const serviciosRaw = this.items.find(i => i.type === 'servicios')?.servicios || [];
    const TamañoGrupo = 3;
    for (let i = 0; i < serviciosRaw.length; i += TamañoGrupo) {
      this.serviciosAgrupados.push(serviciosRaw.slice(i, i + TamañoGrupo));
    }
  }

  setupIntersectionObserver() {
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
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
    sections.forEach(section => observer.observe(section));
  }

  animateSingleCounter(counter: HTMLElement) {
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

  navegarAServicio(servicio: any) {
    console.log('Navegando a:', servicio.url);
  }

  scrollToCursos(event: Event): void {
    event.preventDefault();
    const cursosSection = document.getElementById('cursos');
    if (cursosSection) {
      cursosSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.isBrowser) return;
    this.showFloatingBtn = window.scrollY > 800;
  }

  // ============================================
  // MÉTODOS DEL CHATBOT - INICIALIZACIÓN
  // ============================================

  inicializarChatbot(): void {
    this.mensajes = [
      {
        texto: '¡Hola! Soy el Asistente Virtual de Consultores 1509. 👋',
        esUsuario: false,
        timestamp: new Date(),
        tipo: 'texto'
      },
      {
        texto: 'Selecciona una opción para comenzar:',
        esUsuario: false,
        timestamp: new Date(),
        tipo: 'opciones',
        data: {
          preguntas: [
            { numero: '1', icono: '📦', texto: 'Ver nuestros PAQUETES', accion: 'paquetes' },
            { numero: '2', icono: '⚖️', texto: 'Consultar SERVICIOS', accion: 'servicios' },
            { numero: '3', icono: '📞', texto: 'Hablar con un asesor', accion: 'asesor' },
            { numero: '4', icono: '💰', texto: 'Solicitar cotización', accion: 'cotizacion' },
            { numero: '5', icono: '🎓', texto: 'Cursos PLD', accion: 'curso' }
          ]
        }
      }
    ];
  }

  toggleChatbot(): void {
    this.showChatbot = !this.showChatbot;
    if (this.showChatbot) {
      setTimeout(() => this.scrollChatAlFinal(), 100);
    }
  }

  // ============================================
  // MÉTODOS DEL CHATBOT - MENSAJES
  // ============================================

  enviarMensaje(): void {
    if (!this.mensajeUsuario.trim()) return;

    const mensajeUser: MensajeChat = {
      texto: this.mensajeUsuario,
      esUsuario: true,
      timestamp: new Date(),
      tipo: 'texto'
    };
    this.mensajes.push(mensajeUser);

    const consulta = this.mensajeUsuario.toLowerCase();
    this.mensajeUsuario = '';
    this.scrollChatAlFinal();
    this.chatbotEstaEscribiendo = true;

    setTimeout(() => {
      this.procesarRespuestaBot(consulta);
      this.chatbotEstaEscribiendo = false;
      this.scrollChatAlFinal();
    }, 800);
  }

  procesarRespuestaBot(consulta: string): void {
    // Verificar si estamos en medio de un flujo
    if (this.estadoConversacion.paso !== 'inicio') {
      this.procesarFlujoConversacional(consulta);
      return;
    }

    let respuesta = '';
    let tipoRespuesta: 'texto' | 'paquete' | 'servicio' | 'opciones' = 'texto';
    let dataRespuesta: any = null;

    // Detectar intención del usuario
    if (consulta.includes('paquete') || consulta.includes('precio') || consulta === '1') {
      respuesta = '📦 Te muestro nuestros paquetes disponibles. ¿Cuál te interesa?';
      tipoRespuesta = 'paquete';
      dataRespuesta = this.paquetesDisponibles;
    }
    else if (consulta.includes('servicio') || consulta === '2') {
      respuesta = '⚖️ Estos son nuestros servicios especializados. ¿Sobre cuál quieres más información?';
      tipoRespuesta = 'servicio';
      dataRespuesta = this.serviciosChatbot;
    }
    else if (consulta.includes('asesor') || consulta.includes('hablar') || consulta === '3') {
      respuesta = '📞 ¡Excelente! Un asesor se comunicará contigo. Primero, necesito algunos datos:';
      this.iniciarFlujoContacto();
      return;
    }
    else if (consulta.includes('cotiz') || consulta === '4') {
      respuesta = '💰 Para una cotización personalizada, necesito conocer más sobre tu negocio.';
      this.iniciarFlujoCotizacion();
      return;
    }
    else if (consulta.includes('curso') || consulta.includes('pld') || consulta === '5') {
      respuesta = '🎓 Nuestro curso PLD incluye certificación oficial. ¿Te gustaría inscribirte?';
      this.iniciarFlujoCurso();
      return;
    }
    else {
      respuesta = '🤔 ¿Te interesa conocer nuestros paquetes o servicios?\n\nResponde con el número:\n1️⃣ Paquetes\n2️⃣ Servicios\n3️⃣ Asesor\n4️⃣ Cotización\n5️⃣ Cursos PLD';
    }

    const mensajeBot: MensajeChat = {
      texto: respuesta,
      esUsuario: false,
      timestamp: new Date(),
      tipo: tipoRespuesta,
      data: dataRespuesta
    };

    this.mensajes.push(mensajeBot);
  }

  // ============================================
  // MÉTODOS DEL CHATBOT - FLUJO CONVERSACIONAL
  // ============================================

  obtenerPasoActual(): number {
    const indices: { [key: string]: number } = {
      'nombre': 1,
      'telefono': 2,
      'email': 3,
      'empresa': 4,
      'confirmacion': 5
    };
    return indices[this.estadoConversacion.paso] || 0;
  }

  iniciarFlujoContacto(): void {
    this.estadoConversacion = {
      paso: 'nombre',
      contexto: { tipo: 'contacto' }
    };

    const mensajeBot: MensajeChat = {
      texto: this.flujoContacto[0].pregunta,
      esUsuario: false,
      timestamp: new Date(),
      tipo: 'texto'
    };
    this.mensajes.push(mensajeBot);
  }

  iniciarFlujoCotizacion(): void {
    this.estadoConversacion = {
      paso: 'nombre',
      contexto: { tipo: 'cotizacion' }
    };

    const mensajeBot: MensajeChat = {
      texto: '📋 Para darte una cotización precisa, necesito algunos datos:\n\n' + this.flujoContacto[0].pregunta,
      esUsuario: false,
      timestamp: new Date(),
      tipo: 'texto'
    };
    this.mensajes.push(mensajeBot);
  }

  iniciarFlujoCurso(): void {
    this.estadoConversacion = {
      paso: 'nombre',
      contexto: { tipo: 'curso' }
    };

    const mensajeBot: MensajeChat = {
      texto: '🎓 Para inscribirte en el curso PLD, necesito tus datos:\n\n' + this.flujoContacto[0].pregunta,
      esUsuario: false,
      timestamp: new Date(),
      tipo: 'texto'
    };
    this.mensajes.push(mensajeBot);
  }

  procesarFlujoConversacional(respuesta: string): void {
    const pasoActual = this.estadoConversacion.paso;
    const contexto = this.estadoConversacion.contexto;

    // Permitir cancelar el flujo
    if (respuesta.toLowerCase() === 'cancelar' || respuesta === '0') {
      this.cancelarFlujo();
      return;
    }

    const pasoInfo = this.flujoContacto.find(p => p.paso === pasoActual);

    if (!pasoInfo) {
      this.estadoConversacion.paso = 'inicio';
      this.procesarRespuestaBot(respuesta);
      return;
    }

    // Validar la respuesta
    if (!this.validarRespuesta(respuesta, pasoInfo.validacion)) {
      const mensajeError: MensajeChat = {
        texto: '❌ Por favor, ingresa un ' + this.obtenerMensajeValidacion(pasoInfo.validacion),
        esUsuario: false,
        timestamp: new Date(),
        tipo: 'texto'
      };
      this.mensajes.push(mensajeError);
      return;
    }

    // Guardar la respuesta
    contexto[pasoInfo.campo] = respuesta;

    // Siguiente paso
    const indiceActual = this.flujoContacto.findIndex(p => p.paso === pasoActual);
    const siguientePaso = this.flujoContacto[indiceActual + 1];

    if (siguientePaso) {
      this.estadoConversacion.paso = siguientePaso.paso;
      const mensajeBot: MensajeChat = {
        texto: siguientePaso.pregunta,
        esUsuario: false,
        timestamp: new Date(),
        tipo: 'texto'
      };
      this.mensajes.push(mensajeBot);
    } else {
      this.finalizarFlujoConversacional();
    }
  }

  validarRespuesta(respuesta: string, tipo: string): boolean {
    switch (tipo) {
      case 'texto':
        return respuesta.trim().length > 2;
      case 'telefono':
        const telefonoRegex = /^[0-9]{10}$/;
        return telefonoRegex.test(respuesta.replace(/\D/g, ''));
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(respuesta);
      case 'si_no':
        return ['si', 'sí', 'no', 'yes', 'y'].includes(respuesta.toLowerCase());
      default:
        return true;
    }
  }

  obtenerMensajeValidacion(tipo: string): string {
    switch (tipo) {
      case 'texto': return 'texto válido (mínimo 3 caracteres)';
      case 'telefono': return 'número de teléfono válido (10 dígitos)';
      case 'email': return 'correo electrónico válido (ejemplo@correo.com)';
      case 'si_no': return '"si" o "no"';
      default: return 'dato válido';
    }
  }

  finalizarFlujoConversacional(): void {
    const contexto = this.estadoConversacion.contexto;
    const tipo = contexto.tipo;

    let mensajeFinal = '';

    switch (tipo) {
      case 'contacto':
        mensajeFinal = `✅ ¡Gracias ${contexto.nombre}! He registrado tus datos:\n\n📱 Teléfono: ${contexto.telefono}\n📧 Email: ${contexto.email}\n🏢 Empresa: ${contexto.empresa}\n\n📞 Un asesor te contactará en las próximas 24 horas.`;
        this.guardarContacto(contexto);
        break;
      case 'cotizacion':
        mensajeFinal = `✅ ¡Gracias ${contexto.nombre}! He recibido tu solicitud de cotización.\n\n📊 Un especialista evaluará tu caso y te enviará una cotización personalizada a ${contexto.email} en máximo 48 horas.`;
        this.enviarCotizacion(contexto);
        break;
      case 'curso':
        mensajeFinal = `✅ ¡Excelente ${contexto.nombre}! Te has pre-inscrito al curso PLD.\n\n📧 Enviaremos la información de pago y fechas a ${contexto.email}.\n\n🎓 ¡Te esperamos!`;
        this.inscribirCurso(contexto);
        break;
      default:
        mensajeFinal = `✅ ¡Gracias ${contexto.nombre}! Hemos recibido tu información.`;
    }

    const mensajeBot: MensajeChat = {
      texto: mensajeFinal + '\n\n¿Necesitas algo más?',
      esUsuario: false,
      timestamp: new Date(),
      tipo: 'texto'
    };
    this.mensajes.push(mensajeBot);

    // Reiniciar el flujo
    this.estadoConversacion = { paso: 'inicio', contexto: {} };

    // Mostrar opciones nuevamente
    setTimeout(() => {
      const opcionesMsg: MensajeChat = {
        texto: 'Puedes elegir una opción:\n1️⃣ Ver PAQUETES\n2️⃣ Ver SERVICIOS\n3️⃣ Hablar con asesor\n4️⃣ Cotización\n5️⃣ Cursos PLD',
        esUsuario: false,
        timestamp: new Date(),
        tipo: 'texto'
      };
      this.mensajes.push(opcionesMsg);
      this.scrollChatAlFinal();
    }, 1000);
  }

  cancelarFlujo(): void {
    this.estadoConversacion = { paso: 'inicio', contexto: {} };
    const mensajeBot: MensajeChat = {
      texto: '❌ Flujo cancelado. ¿En qué más puedo ayudarte?',
      esUsuario: false,
      timestamp: new Date(),
      tipo: 'texto'
    };
    this.mensajes.push(mensajeBot);
  }

  // ============================================
  // MÉTODOS DEL CHATBOT - ACCIONES
  // ============================================

  guardarContacto(contexto: any): void {
    console.log('Contacto guardado:', contexto);
    // Aquí puedes enviar a un API
  }

  enviarCotizacion(contexto: any): void {
    console.log('Solicitud de cotización:', contexto);
  }

  inscribirCurso(contexto: any): void {
    console.log('Pre-inscripción curso:', contexto);
  }

  seleccionarOpcionChat(accion: string): void {
    let mensajeUsuario = '';

    switch (accion) {
      case 'paquetes':
        mensajeUsuario = '1';
        break;
      case 'servicios':
        mensajeUsuario = '2';
        break;
      case 'asesor':
        mensajeUsuario = '3';
        break;
      case 'cotizacion':
        mensajeUsuario = '4';
        break;
      case 'curso':
        mensajeUsuario = '5';
        break;
      default:
        mensajeUsuario = accion;
    }

    const mensajeUser: MensajeChat = {
      texto: mensajeUsuario,
      esUsuario: true,
      timestamp: new Date(),
      tipo: 'texto'
    };
    this.mensajes.push(mensajeUser);
    this.scrollChatAlFinal();
    this.chatbotEstaEscribiendo = true;

    setTimeout(() => {
      this.procesarRespuestaBot(mensajeUsuario);
      this.chatbotEstaEscribiendo = false;
      this.scrollChatAlFinal();
    }, 800);
  }

  seleccionarOpcion(opcion: string, data?: any): void {
    this.mensajeUsuario = opcion;
    this.enviarMensaje();
  }

  seleccionarPaquete(paquete: PaqueteServicio): void {
    const mensajeConfirmacion = `✨ Has seleccionado: ${paquete.nombre}\n\n💰 ${paquete.precio}\n📅 ${paquete.duracion}\n\n¿Deseas agendar una llamada con un asesor?\n\nResponde "si" o "no"`;

    const mensajeBot: MensajeChat = {
      texto: mensajeConfirmacion,
      esUsuario: false,
      timestamp: new Date(),
      tipo: 'texto'
    };
    this.mensajes.push(mensajeBot);
    this.scrollChatAlFinal();

    // Iniciar flujo de confirmación
    this.estadoConversacion = {
      paso: 'confirmar_paquete',
      contexto: { paquete: paquete, tipo: 'confirmacion_paquete' }
    };
  }

  solicitarAsesor(): void {
    const mensajeBot: MensajeChat = {
      texto: '📞 Déjanos tus datos y te contactamos inmediatamente:\n\n📱 WhatsApp: (33) 19839037\n📧 Email: asesores@consultores1509.com\n\nO escribe "cancelar" para volver al menú.',
      esUsuario: false,
      timestamp: new Date(),
      tipo: 'texto'
    };
    this.mensajes.push(mensajeBot);
    this.scrollChatAlFinal();
  }

  // ============================================
  // MÉTODOS DEL CHATBOT - UTILIDADES
  // ============================================

  scrollChatAlFinal(): void {
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  formatearHora(fecha: Date): string {
    return fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.enviarMensaje();
    }
  }
}
