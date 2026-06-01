import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

// Interfaz para respuesta del chatbot
interface RespuestaCopilot {
  texto: string;
  tipo: 'texto' | 'paquete' | 'servicio' | 'opciones';
  data?: any;
}

@Injectable({
  providedIn: 'root'  // ← Esto es importante: hace que el servicio esté disponible globalmente
})
export class ChatbotAIService {

  // 🔴 REEMPLAZA 'TU_API_KEY_AQUI' CON TU API KEY REAL DE OPENAI
 private readonly API_KEY = 'sk-proj-tu-clave-real-que-copiaste-de-openai';
  private readonly API_URL = 'https://api.openai.com/v1/chat/completions';

  private usarAI: boolean = false; // Cambia a true cuando tengas API Key

  constructor(private http: HttpClient) {}

  async obtenerRespuestaAI(
    mensajeUsuario: string,
    historial: any[],
    paquetes: any[],
    servicios: any[]
  ): Promise<RespuestaCopilot> {

    // Si no está activada la IA, usa respuestas básicas
    if (!this.usarAI || this.API_KEY === 'sk-proj-tu-clave-real-que-copiaste-de-openai') {
      return this.respuestaBasica(mensajeUsuario, paquetes, servicios);
    }

    // Contexto del negocio
    const contexto = `
Eres un asistente virtual de "Consultores 1509", una firma legal especializada en:
- Derecho Administrativo, Corporativo, Mercantil, Familiar y Propiedad Intelectual
- Cursos PLD (Prevención de Lavado de Dinero)
- Paquetes de asesoría legal

PAQUETES DISPONIBLES:
${JSON.stringify(paquetes, null, 2)}

SERVICIOS DISPONIBLES:
${JSON.stringify(servicios, null, 2)}

Reglas de respuesta:
1. Sé amable, profesional y conciso
2. Responde en español
3. Si preguntan por precios, muestra los paquetes
4. Si preguntan por contacto, ofrece números: (33) 19839037
`;

    const historialReciente = historial.slice(-5).map(msg => ({
      role: msg.esUsuario ? 'user' : 'assistant',
      content: msg.texto
    }));

    const payload = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: contexto },
        ...historialReciente,
        { role: 'user', content: mensajeUsuario }
      ],
      temperature: 0.7,
      max_tokens: 300
    };

    try {
      const respuesta = await lastValueFrom(
        this.http.post<any>(this.API_URL, payload, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.API_KEY}`
          })
        }).pipe(
          timeout(15000),
          catchError(error => {
            console.error('Error en API:', error);
            throw error;
          })
        )
      );

      if (respuesta && respuesta.choices && respuesta.choices[0]) {
        const textoRespuesta = respuesta.choices[0].message.content;
        return {
          texto: textoRespuesta,
          tipo: 'texto',
          data: null
        };
      }
    } catch (error) {
      console.error('Error llamando a OpenAI:', error);
    }

    return this.respuestaBasica(mensajeUsuario, paquetes, servicios);
  }

  private respuestaBasica(mensaje: string, paquetes: any[], servicios: any[]): RespuestaCopilot {
    const msg = mensaje.toLowerCase();

    if (msg.includes('paquete') || msg.includes('precio') || msg === '1') {
      return {
        texto: '📦 Te muestro nuestros paquetes disponibles:',
        tipo: 'paquete',
        data: paquetes
      };
    }
    if (msg.includes('servicio') || msg === '2') {
      return {
        texto: '⚖️ Estos son nuestros servicios especializados:',
        tipo: 'servicio',
        data: servicios
      };
    }
    if (msg.includes('contact') || msg.includes('asesor') || msg.includes('hablar') || msg === '3') {
      return {
        texto: '📞 Puedes contactarnos al (33) 19839037 o por email a consultores@gmail.com',
        tipo: 'texto'
      };
    }
    if (msg.includes('cotiz') || msg === '4') {
      return {
        texto: '💰 Para una cotización personalizada, por favor comparte tus datos y un asesor te contactará.',
        tipo: 'texto'
      };
    }
    if (msg.includes('curso') || msg.includes('pld') || msg === '5') {
      return {
        texto: '🎓 Nuestro curso PLD incluye certificación oficial. ¿Te gustaría inscribirte?',
        tipo: 'texto'
      };
    }
    return {
      texto: '🤔 ¿En qué puedo ayudarte?\n\n1️⃣ Paquetes\n2️⃣ Servicios\n3️⃣ Asesor\n4️⃣ Cotización\n5️⃣ Cursos PLD',
      tipo: 'texto'
    };
  }
}
