import { Component, HostListener, Inject, PLATFORM_ID, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatbotAIService } from './services/chatbot-ai.service.ts';

// ============================================
// INTERFACES
// ============================================
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
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit, AfterViewInit, OnDestroy {

  isBrowser: boolean;
  isMenuOpen = false;



  private chatInicializado = false;
  private observer: IntersectionObserver | null = null;

  navItems = [
    { id: 'inicio', navLabel: 'INICIO', path: '/' },
    { id: 'quienes', navLabel: 'QUIENES SOMOS', path: '/quienes' },
    { id: 'servicios', navLabel: 'SERVICIOS', path: '/servicios' },
    { id: 'cursos', navLabel: 'CURSOS', path: '/cursos' },
    { id: 'contacto', navLabel: 'CONTACTO', path: '/contacto' }
  ];

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

  // Chatbot
  showChatbot = false;
  mensajes: MensajeChat[] = [];
  mensajeUsuario = '';
  chatbotEstaEscribiendo = false;
  showFloatingBtn = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private chatbotAI: ChatbotAIService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }



  ngOnInit(): void {
    if (!this.chatInicializado) {
      this.inicializarChatbot();
      this.chatInicializado = true;
    }
  }

  ngAfterViewInit() {
     if (this.isBrowser) {
    this.detectarElementosVisibles();
  }
  }

  /**
 * Cierra el menú hamburguesa SOLO en dispositivos móviles
 */
cerrarMenuMovil(): void {
  if (!this.isBrowser) return;

  // Solo ejecutar en móvil (pantalla menor a 992px)
  if (window.innerWidth < 992) {
    const menu = document.querySelector('.navbar-collapse');
    const toggler = document.querySelector('.navbar-toggler');

    if (menu && menu.classList.contains('show')) {
      menu.classList.remove('show');
    }

    if (toggler) {
      toggler.setAttribute('aria-expanded', 'false');
    }
  }
}



  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private detectarElementosVisibles(): void {
    const sections = document.querySelectorAll('section, .animate-fade, .service-card, .curso-container, .proceso-item');

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          this.observer?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    sections.forEach(section => {
      this.observer?.observe(section);
    });
  }

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

  scrollToCursos(event: Event): void {
    event.preventDefault();
    const cursosSection = document.getElementById('cursos');
    if (cursosSection) {
      cursosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

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

  enviarMensaje(): void {
    if (!this.mensajeUsuario.trim()) return;

    const mensajeUser: MensajeChat = {
      texto: this.mensajeUsuario,
      esUsuario: true,
      timestamp: new Date(),
      tipo: 'texto'
    };
    this.mensajes.push(mensajeUser);

    const consulta = this.mensajeUsuario;
    this.mensajeUsuario = '';
    this.scrollChatAlFinal();
    this.chatbotEstaEscribiendo = true;

    setTimeout(() => {
      this.procesarRespuestaBot(consulta);
    }, 500);
  }

  async procesarRespuestaBot(consulta: string): Promise<void> {
    if (this.estadoConversacion.paso !== 'inicio') {
      this.procesarFlujoConversacional(consulta);
      this.chatbotEstaEscribiendo = false;
      this.scrollChatAlFinal();
      return;
    }

    try {
      const respuestaAI = await this.chatbotAI.obtenerRespuestaAI(
        consulta,
        this.mensajes,
        this.paquetesDisponibles,
        this.serviciosChatbot
      );

      const mensajeBot: MensajeChat = {
        texto: respuestaAI.texto,
        esUsuario: false,
        timestamp: new Date(),
        tipo: respuestaAI.tipo,
        data: respuestaAI.data
      };

      this.mensajes.push(mensajeBot);
    } catch (error) {
      console.error('Error al procesar respuesta:', error);
      const mensajeBot: MensajeChat = {
        texto: 'Lo siento, tuve un problema técnico. Por favor, intenta de nuevo o contacta a un asesor al (33) 19839037.',
        esUsuario: false,
        timestamp: new Date(),
        tipo: 'texto'
      };
      this.mensajes.push(mensajeBot);
    } finally {
      this.chatbotEstaEscribiendo = false;
      this.scrollChatAlFinal();
    }
  }

  seleccionarOpcionChat(accion: string): void {
    let mensajeUsuario = '';

    switch (accion) {
      case 'paquetes':
        mensajeUsuario = 'quiero ver los paquetes';
        break;
      case 'servicios':
        mensajeUsuario = 'quiero ver los servicios';
        break;
      case 'asesor':
        mensajeUsuario = 'quiero hablar con un asesor';
        break;
      case 'cotizacion':
        mensajeUsuario = 'quiero una cotización';
        break;
      case 'curso':
        mensajeUsuario = 'información sobre cursos PLD';
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
    }, 500);
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

    this.estadoConversacion = {
      paso: 'confirmar_paquete',
      contexto: { paquete: paquete, tipo: 'confirmacion_paquete' }
    };
  }


  solicitarAsesor(): void {
  // Mostrar información de contacto
  const mensajeInfo: MensajeChat = {
    texto: '📞 **Información de contacto de Consultores 1509**\n\n' +
           '📱 **WhatsApp:** (33) 19839037\n' +
           '📱 **Teléfono:** 33 2228 2578\n' +
           '📧 **Email:** consultores@gmail.com\n\n' +
           '⏰ **Horario de atención:**\n' +
           '   Lunes a Viernes: 9:00 - 19:00 hrs\n' +
           '   Sábados: 10:00 - 14:00 hrs\n\n' +
           '📍 **Dirección:**\n' +
           '   Montevide N° 2789, Col. Providencia\n' +
           '   Guadalajara, Jalisco C.P. 44630',
    esUsuario: false,
    timestamp: new Date(),
    tipo: 'texto'
  };
  this.mensajes.push(mensajeInfo);
  this.scrollChatAlFinal();

  // Opciones adicionales
  setTimeout(() => {
    const opcionesMsg: MensajeChat = {
      texto: '¿Necesitas más información?\n\n1️⃣ Ver PAQUETES\n2️⃣ Ver SERVICIOS\n3️⃣ Volver al menú principal',
      esUsuario: false,
      timestamp: new Date(),
      tipo: 'texto'
    };
    this.mensajes.push(opcionesMsg);
    this.scrollChatAlFinal();
  }, 500);
}

  // ============================================
  // MÉTODOS DE FLUJO CONVERSACIONAL
  // ============================================



  iniciarFlujoContacto(): void {
    const mensajeInfo: MensajeChat = {
      texto: '📞 **Información de contacto de Consultores 1509**\n\n' +
             '📱 **WhatsApp:** (33) 19839037\n' +
             '📱 **Teléfono:** 33 2228 2578\n' +
             '📧 **Email:** consultores@gmail.com\n\n' +
             '⏰ **Horario de atención:**\n' +
             '   Lunes a Viernes: 9:00 - 19:00 hrs\n' +
             '   Sábados: 10:00 - 14:00 hrs\n\n' +
             '📍 **Dirección:**\n' +
             '   Montevide N° 2789, Col. Providencia\n' +
             '   Guadalajara, Jalisco C.P. 44630\n\n' +
             '¿Te gustaría que un asesor te contacte?',
      esUsuario: false,
      timestamp: new Date(),
      tipo: 'texto'
    };
    this.mensajes.push(mensajeInfo);
    this.scrollChatAlFinal();

    setTimeout(() => {
      const opcionesMsg: MensajeChat = {
        texto: 'Responde:\n1️⃣ "Que me contacten"\n2️⃣ "Volver al menú"',
        esUsuario: false,
        timestamp: new Date(),
        tipo: 'texto'
      };
      this.mensajes.push(opcionesMsg);
      this.scrollChatAlFinal();

      this.estadoConversacion = {
        paso: 'contacto_info',
        contexto: { tipo: 'contacto_info' }
      };
    }, 500);
  }

  iniciarFlujoContactoDatos(): void {
    this.estadoConversacion = {
      paso: 'nombre',
      contexto: { tipo: 'contacto' }
    };
    const mensajeBot: MensajeChat = {
      texto: '📝 Perfecto. ¿Cuál es tu nombre?',
      esUsuario: false,
      timestamp: new Date(),
      tipo: 'texto'
    };
    this.mensajes.push(mensajeBot);
    this.scrollChatAlFinal();
  }

  iniciarFlujoCotizacion(): void {
    this.estadoConversacion = {
      paso: 'nombre',
      contexto: { tipo: 'cotizacion' }
    };
    const mensajeBot: MensajeChat = {
      texto: '📋 Para darte una cotización personalizada, necesito algunos datos:\n\n' + this.flujoContacto[0].pregunta,
      esUsuario: false,
      timestamp: new Date(),
      tipo: 'texto'
    };
    this.mensajes.push(mensajeBot);
    this.scrollChatAlFinal();
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
    this.scrollChatAlFinal();
  }

  // ✅ MÉTODO AGREGADO - Obtener el paso actual del flujo
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

  procesarContactoInfo(respuesta: string): void {
    const respuestaLower = respuesta.toLowerCase();

    if (respuestaLower.includes('contact') || respuestaLower.includes('1')) {
      this.iniciarFlujoContactoDatos();
    } else {
      this.cancelarFlujo();
    }
    this.scrollChatAlFinal();
  }

  procesarFlujoConversacional(respuesta: string): void {
    const pasoActual = this.estadoConversacion.paso;
    const contexto = this.estadoConversacion.contexto;

    if (pasoActual === 'contacto_info') {
      this.procesarContactoInfo(respuesta);
      return;
    }

    if (pasoActual === 'confirmar_paquete') {
      if (respuesta.toLowerCase() === 'si' || respuesta.toLowerCase() === 'sí') {
        this.iniciarFlujoContactoDatos();
      } else {
        const mensajeBot: MensajeChat = {
          texto: '👍 Entiendo. ¿En qué más puedo ayudarte?',
          esUsuario: false,
          timestamp: new Date(),
          tipo: 'texto'
        };
        this.mensajes.push(mensajeBot);
        this.estadoConversacion = { paso: 'inicio', contexto: {} };
      }
      return;
    }

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

    contexto[pasoInfo.campo] = respuesta;

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

    this.estadoConversacion = { paso: 'inicio', contexto: {} };

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
      texto: '❌ Flujo cancelado. ¿En qué más puedo ayudarte?\n\n1️⃣ Ver PAQUETES\n2️⃣ Ver SERVICIOS\n3️⃣ Hablar con asesor\n4️⃣ Cotización\n5️⃣ Cursos PLD',
      esUsuario: false,
      timestamp: new Date(),
      tipo: 'texto'
    };
    this.mensajes.push(mensajeBot);
    this.scrollChatAlFinal();
  }

  guardarContacto(contexto: any): void {
    console.log('Contacto guardado:', contexto);
  }

  enviarCotizacion(contexto: any): void {
    console.log('Solicitud de cotización:', contexto);
  }

  inscribirCurso(contexto: any): void {
    console.log('Pre-inscripción curso:', contexto);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.isBrowser) return;
    this.showFloatingBtn = window.scrollY > 800;
  }
}
