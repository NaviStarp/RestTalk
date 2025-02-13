# Textify Rest Framework

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=git,python,django,rest,postgres" />
  </a>
</p>

**ES:** Un Rest Framework hecho en Django que permite la autenticación con Google y el cifrado de mensajes para un chat seguro.

**EN:** A Rest Framework built in Django that enables Google authentication and message encryption for a secure chat.

---

# Descripción del Proyecto

Este proyecto implementa un backend robusto para un chat seguro, utilizando Django Rest Framework. Las principales funcionalidades incluyen:

- **Autenticación con Google OAuth 2.0**
- **Cifrado de mensajes** para garantizar la seguridad y privacidad
- **API Restful** para la gestión de usuarios y mensajes
- **Base de datos en PostgreSQL**
- **Gestor de dependencias con `pip` o `conda`**

Para instalar las dependencias, usa el siguiente comando:

```sh
pip install -r requirements.txt
```

Si usas `conda`:

```sh
conda create --name textify_env --file requirements.txt
```

## Instalación y Configuración

1. Clona este repositorio:

   ```sh
   git clone https://github.com/NaviStarp/RestTalk.git
   cd RestTalk/bd
   ```

2. Crea un entorno virtual y actívalo:

   ```sh
   python -m venv venv
   source venv/bin/activate  # En Windows usa: venv\Scripts\activate
   ```

3. Instala las dependencias:

   ```sh
   pip install -r requirements.txt
   ```

4. Configura las credenciales de Google OAuth en `.env`:

   ```env
    GOOGLE_OAUTH_CLIENT_ID= Id del cliente
    GOOGLE_OAUTH_CLIENT_SECRET= Secreto del cliente
    GOOGLE_OAUTH_CALLBACK_URL= URL a la que devuelve google

   ```

5. Aplica migraciones y ejecuta el servidor:

   ```sh
   python manage.py migrate
   python manage.py runserver
   ```

## Autores

<div style="text-align: center;">

![GitHub contributors](https://img.shields.io/github/contributors/NaviStarp/RestTalk)

- [NaviStarp](https://github.com/NaviStarp) ![GitHub User's stars](https://img.shields.io/github/stars/NaviStarp)
- [Sebastian-Manrique](https://github.com/Sebastian-Manrique) ![GitHub User's stars](https://img.shields.io/github/stars/Sebastian-Manrique)
- [Javiiiii11](https://github.com/Javiiiii11) ![GitHub User's stars](https://img.shields.io/github/stars/Javiiiii11)
- [IgnacioDrako](https://github.com/IgnacioDrako) ![GitHub User's stars](https://img.shields.io/github/stars/IgnacioDrako)

</div>

## Licencia

**ES:** Este proyecto está licenciado bajo la licencia de [MIT License](LICENSE).

**EN:** This project is licensed under the [MIT License](LICENSE).

