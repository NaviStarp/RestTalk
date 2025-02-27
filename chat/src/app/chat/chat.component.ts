import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule, DatePipe } from '@angular/common';

interface Chat {
  id: number;
  chat_type: string;
  name: string;
  created_at: string;
  updated_at: string;
  users: number[];
}

interface Message {
  id: number;
  chat: number;
  sender: number;
  text: string;
  created_at: string;
  updated_at: string;
  read?: boolean;
  delivered?: boolean;
  image_url?: string;
}

@Component({
  selector: 'app-chat',
  imports: [FormsModule, DatePipe, CommonModule],
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  showAddChatModal = false;
  chats: Chat[] = [];
  current_chat: number | null = null;
  current_chat_messages: Message[] = [];
  message = '';
  userId: number;
  typingUsers: {[chatId: number]: boolean} = {};
  lastReadMessageId: number | null = null;
  lastMessageDates: {[date: string]: boolean} = {};

  constructor(private auth: AuthService, private cdr: ChangeDetectorRef) {
    const userIdStr = localStorage.getItem('userId') || '0';
    this.userId = parseInt(userIdStr);
  }

  ngOnInit() {
    this.loadChats();
    // Simular recepción de nuevos mensajes cada 30 segundos
    setInterval(() => this.simulateIncomingMessage(), 30000);
  }
  
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  loadChats() {
    this.auth.get_chats().subscribe((response: any) => {
      this.chats = response;
      this.cdr.detectChanges();
    });
  }

  select_chat(chat_id: number) {
    this.current_chat = chat_id;
    this.current_chat_messages = [];
    this.lastMessageDates = {};
    this.loadMessages(chat_id);
  }

  loadMessages(chat_id: number) {
    this.auth.get_messages(chat_id, (messages: Message[]) => {
      // Añadir propiedades adicionales a los mensajes
      this.current_chat_messages = messages.map(msg => ({
        ...msg,
        read: msg.sender === this.userId || Math.random() > 0.3, // Simulación
        delivered: msg.sender === this.userId || Math.random() > 0.1 // Simulación
      }));
      
      // Establecer el último mensaje leído como el último de la lista
      if (this.current_chat_messages.length > 0) {
        this.lastReadMessageId = this.current_chat_messages[this.current_chat_messages.length - 1].id;
      }
      
      this.cdr.detectChanges();
      this.scrollToBottom();
    });
  }

  send_message() {
    if (!this.message.trim() || this.current_chat === null) {
      return;
    }
    
    const newMessage: Message = {
      id: this.generateTempId(),
      chat: this.current_chat,
      sender: this.userId,
      text: this.message,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      delivered: true,
      read: false
    };
    
    // Añadir mensaje temporalmente a la lista local
    this.current_chat_messages.push(newMessage);
    const tempMessage = this.message;
    this.message = '';
    this.cdr.detectChanges();
    this.scrollToBottom();

    // Enviar mensaje al servidor
    this.auth.send_message(newMessage).subscribe((response: Message) => {
      // Actualizar el mensaje temporal con la respuesta del servidor
      const index = this.current_chat_messages.findIndex(m => m.id === newMessage.id);
      if (index !== -1) {
        this.current_chat_messages[index] = {
          ...response,
          delivered: true,
          read: false
        };
      }
      this.cdr.detectChanges();
    }, error => {
      // En caso de error, mostramos un indicador de error
      const index = this.current_chat_messages.findIndex(m => m.id === newMessage.id);
      if (index !== -1) {
        this.current_chat_messages[index].text = tempMessage + ' ⚠️';
      }
      this.cdr.detectChanges();
    });
  }

  // Generar un ID temporal negativo para mensajes nuevos
  generateTempId(): number {
    return -Math.floor(Math.random() * 1000000);
  }

  // Métodos para mensajes
  isMyMessage(message: Message): boolean {
    return message.sender === this.userId;
  }

  getSenderName(senderId: number): string {
    // En una aplicación real, obtendrías esta información de tu base de datos
    const user = this.chats
      .flatMap(chat => chat.users)
      .find(u => u === senderId);
    return user ? `Usuario ${senderId}` : `Usuario ${senderId}`;
  }

  getCurrentChatName(): string {
    const currentChat = this.chats.find(chat => chat.id === this.current_chat);
    return currentChat ? currentChat.name : '';
  }

  // Determinar si el contacto está en línea
  isContactOnline(): boolean {
    // Simulación: contactos con ID par están en línea
    const currentChat = this.chats.find(chat => chat.id === this.current_chat);
    if (!currentChat) return false;
    
    // Para chats grupales, considera que están en línea
    if (currentChat.chat_type === 'group') return true;
    
    // Para chats 1:1, buscar el otro usuario
    const otherUserId = currentChat.users.find(id => id !== this.userId);
    return otherUserId ? otherUserId % 2 === 0 : false;
  }

  // Obtener el último acceso
  getLastSeen(): string {
    return 'hoy a las 12:45';
  }

  // Verificar si un chat es grupal
  isGroupChat(): boolean {
    const currentChat = this.chats.find(chat => chat.id === this.current_chat);
    return currentChat?.chat_type === 'group';
  }

  // Determinar si un mensaje es secuencial (mismo remitente que el anterior)
  isSequentialMessage(index: number): boolean {
    if (index === 0) return false;
    
    const currentMsg = this.current_chat_messages[index];
    const prevMsg = this.current_chat_messages[index - 1];
    
    // Comprobar si es del mismo remitente y dentro de 2 minutos
    return currentMsg.sender === prevMsg.sender && 
           this.isWithinTimeWindow(currentMsg.created_at, prevMsg.created_at, 2);
  }

  // Comprobar si dos fechas están dentro de una ventana de tiempo (en minutos)
  isWithinTimeWindow(date1: string, date2: string, minutes: number): boolean {
    const time1 = new Date(date1).getTime();
    const time2 = new Date(date2).getTime();
    return Math.abs(time1 - time2) < minutes * 60 * 1000;
  }

  // Obtener la fecha formateada de un mensaje
  formatDate(date: string): string {
    const messageDate = new Date(date);
    const today = new Date();
    
    // Si es hoy
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Hoy';
    }
    
    // Si es ayer
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    }
    
    // Formato general: "Lunes, 22 de febrero"
    return messageDate.toLocaleDateString('es', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  }

  // Determinar si se debe mostrar un separador de fecha
  shouldShowDateSeparator(index: number): boolean {
    if (index === 0) return true;
    
    const currentDate = new Date(this.current_chat_messages[index].created_at).toDateString();
    const prevDate = new Date(this.current_chat_messages[index - 1].created_at).toDateString();
    
    return currentDate !== prevDate;
  }

  // Obtener todas las fechas únicas de los mensajes
  getMessageDates(): string[] {
    const dates: string[] = [];
    
    this.current_chat_messages.forEach(msg => {
      const dateStr = new Date(msg.created_at).toDateString();
      if (!this.lastMessageDates[dateStr]) {
        this.lastMessageDates[dateStr] = true;
        dates.push(msg.created_at);
      }
    });
    
    return dates;
  }

  // Verificar si un mensaje tiene una imagen
  hasImage(message: Message): boolean {
    return !!message.image_url;
  }

  // Abrir visor de imágenes
  openImageViewer(imageUrl: string | undefined): void {
    if (imageUrl) {
      // Implementación del visor de imágenes
      console.log('Abriendo imagen:', imageUrl);
    }
  }

  // Formatear texto del mensaje con emojis, enlaces, etc.
  formatMessageText(text: string): string {
    // Ejemplo básico: convertir URLs en enlaces
    return text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
  }

  // Verificar si es el primer mensaje no leído
  isFirstUnreadMessage(message: Message): boolean {
    if (!message || message.read) return false;
    
    const index = this.current_chat_messages.findIndex(m => m.id === message.id);
    if (index <= 0) return false;
    
    // Es el primer mensaje no leído si el anterior está leído
    return this.current_chat_messages[index - 1].read === true;
  }

  // Verificar si un mensaje es nuevo (para animación)
  isNewMessage(message: Message): boolean {
    // Considerar nuevo si se envió en los últimos 10 segundos
    const now = new Date().getTime();
    const messageTime = new Date(message.created_at).getTime();
    return now - messageTime < 10000;
  }

  // Verificar si un mensaje ha sido leído
  isMessageRead(message: Message): boolean {
    return !!message.read;
  }

  // Verificar si un mensaje ha sido entregado
  isMessageDelivered(message: Message): boolean {
    return !!message.delivered;
  }

  // Verificar si alguien está escribiendo
  isTyping(): boolean {
    return this.current_chat !== null && !!this.typingUsers[this.current_chat];
  }

  // Marcar todos los mensajes como leídos
  markAllAsRead(): void {
    this.current_chat_messages.forEach(msg => {
      if (!this.isMyMessage(msg)) {
        msg.read = true;
      }
    });
    this.cdr.detectChanges();
  }

  // Desplazarse al final del contenedor de mensajes
  scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = 
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) { }
  }

  // Simular un mensaje entrante (para demostración)
  simulateIncomingMessage(): void {
    if (this.current_chat === null) return;
    
    // Simulación: 30% de probabilidad de recibir un mensaje
    if (Math.random() > 0.7) {
      const otherUsers = this.chats
        .find(c => c.id === this.current_chat)?.users
        .filter(u => u !== this.userId);
      
      if (otherUsers && otherUsers.length > 0) {
        const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
        
        // Crear mensaje de simulación
        const newMessage: Message = {
          id: this.generateTempId(),
          chat: this.current_chat,
          sender: randomUser,
          text: `Este es un mensaje de prueba generado automáticamente (${new Date().toLocaleTimeString()})`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          delivered: true,
          read: false
        };
        
        // Añadir el mensaje a la lista
        this.current_chat_messages.push(newMessage);
        this.cdr.detectChanges();
        this.scrollToBottom();
      }
    }

  }
  openAddChatModal() {
    alert('Abriendo modal de agregar chat...');
    this.showAddChatModal = true;
  }
  closeAddChatModal() {
    this.showAddChatModal = false;
  }
}