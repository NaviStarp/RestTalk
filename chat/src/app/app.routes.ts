import { Routes } from '@angular/router';
import { PrivacidadComponent } from './privacidad/privacidad.component';
import { InicioComponent } from './inicio/inicio.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RegistroComponent } from './registro/registro.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { SobreNosotrosComponent } from './sobre-nosotros/sobre-nosotros.component';
import { ChatComponent } from './chat/chat.component';
import { PruebaComponent } from './prueba/prueba.component';

export const routes: Routes = [
    { path: '', component: InicioComponent }, // Ruta por defecto
    { path: 'login', component: InicioSesionComponent }, // Ruta para iniciar sesion
    { path: 'registro', component: RegistroComponent }, // Ruta para registro
    { path: 'privacidad', component: PrivacidadComponent }, // Ruta para privacidad
    { path: 'sobreNosotros', component: SobreNosotrosComponent }, // Ruta para "sobre nosotros"
    { path: 'chat', component: ChatComponent }, // Ruta para chat
    {path: 'prueba', component: PruebaComponent}, // Ruta para prueba
    { path: '**', component: NotFoundComponent }, //Ruta para errores


];
