![kapita_chat](/../ImgBranch/ImgForBaseReadMe/Kapitan_chat.png)
# Kapitan Chat
is chat for real ♂ pirates ♂ 


## Table of Contents

- [About the project](#about-the-project)
- [Main features](#main-features)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Models](#models)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend installation](#backend-installation)
  - [Frontend installation](#frontend-installation)
  - [Environment variables](#environment-variables)

## About the project

`Kapitan Chat` is a pet chat project built as a learning and experimental playground for:
- practicing full-stack patterns (React + Django REST);
- working with WebSockets and real-time message updates;
- implementing user settings (theme, language, locale);
- practicing Git workflow (branches, PRs, merges, conflicts).


## Main features

- **Registration and authentication**
  - JWT-based authentication;
  - storing tokens on the client and automatically attaching them to requests.

- **Chat list and conversations**
  - list of dialogs;
  - viewing message history;
  - selected chat indicators.

- **`Double-chat` mode**
  - open two chats at the same time;
  - resizable panels (resizable layout);
  - convenient work with multiple dialogs.

- **User settings**
  - choose interface language (JSON-based locales);
  - switch theme (light / dark);
  - store settings on the backend.

- **Message handling**
  - send text messages;
  - edit and delete messages;
  - support for attachments (files).

- **Real-time interface**
  - message updates without page reload;
  - WebSocket connection for chats.

## Architecture

The repository is organized as a monorepo:

```
KapitanChat/
  kapitan_chat_backend/   # Django + DRF backend
  kapitan_chat_frontend/  # React frontend
  README.md
  LICENSE
  package-lock.json
```
[!NOTE]
TECH STACK

Tech stack

Backend

Python 3.x

Django

Django REST Framework

djangorestframework-simplejwt (JWT authentication)

django-cors-headers

Frontend

React

Vite (dev server and bundler)

react-router-dom

axios

emoji-mart

resizable-panel

Other

WebSocket / Django Channels (real-time chat)

GitHub as the main code hosting

Models
                ┌────────────────────────────────────┐
                │              User                  │
                │  (django.contrib.auth.models.User) │
                └────────────────────────────────────┘
                   │1                              1│
                   │ OneToOne                       │
                   ▼                                ▼
   ┌───────────────────────────┐      ┌───────────────────────────┐
   │         Profile           │      │       UserSettings        │
   ├───────────────────────────┤      ├───────────────────────────┤
   │ user : OneToOne → User    │      │ user    : OneToOne → User │
   │ bio  : Text               │      │ language: Lang (enum)     │
   │ phone_number : Char(16)   │      │ theme   : bool (dark?)    │
   │ profile_picture_id : str  │      └───────────────────────────┘
   └───────────────────────────┘
                                         ▲
                                         │
                                         │ uses
                                         │
                             ┌───────────────────────┐
                             │         Lang          │
                             ├───────────────────────┤
                             │ another               │
                             │ en-US                 │
                             │ ru-RU                 │
                             │ uk-UA                 │
                             └───────────────────────┘


                        Users and chats
┌───────────────────────────────────────────────────────────────────┐
│                              Chat                                │
├───────────────────────────────────────────────────────────────────┤
│ id          : PK                                                 │
│ name        : Char(32, blank=True)                               │
│ description : Char(256, blank=True)                              │
│ type        : ChatType (enum)                                    │
│ created_at  : DateTime                                           │
│ updated_at  : DateTime                                           │
│ created_by  : FK → User                                          │
│ users       : ManyToMany → User (chat participants)              │
└───────────────────────────────────────────────────────────────────┘
             ▲                         ▲
             │                         │
             │ created_by (FK)         │ M2M (many users ↔ many chats)
             │                         │


        ┌───────────────────────┐
        │       ChatType        │
        ├───────────────────────┤
        │ DIRECT   (direct)     │
        │ GROUP    (group)      │
        │ CHANNEL  (channel)    │
        └───────────────────────┘


                     Messages and attachments
┌───────────────────────────────────────────────────────────────┐
│                          Message                             │
├───────────────────────────────────────────────────────────────┤
│ id         : PK                                              │
│ content    : Text (null=True)                               │
│ is_edited  : bool                                           │
│ created_at : DateTime                                       │
│ user       : FK → User (author)                             │
│ chat       : FK → Chat (which chat the message belongs to)  │
│ reply_to   : FK → Message (null=True, related_name="replies")│
│             (reply to another message)                      │
└───────────────────────────────────────────────────────────────┘
             ▲
             │ 1─many (one message → many attachments)
             │
┌───────────────────────────────────────────────────────────────┐
│                         Attachment                           │
├───────────────────────────────────────────────────────────────┤
│ id         : PK                                              │
│ name       : Char (file name)                               │
│ storage_id : Char (external storage file ID, null=True)     │
│ type       : Char (MIME / file type)                        │
│ message    : FK → Message (null=True, on_delete=SET_NULL)   │
└───────────────────────────────────────────────────────────────┘



[!WARNING]
GETTING STARTED

Getting started
Prerequisites

Git

Python ≥ 3.12

Node.js ≥ 18

npm

Backend installation
cd kapitan_chat_backend

# virtual environment
python -m venv venv
# Windows:
# venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# dependencies
pip install -r requirements.txt

# create migrations
py manage.py makemigrations

# apply migrations
python manage.py migrate

# run backend
uvicorn kapitan_chat_backend.asgi:application --reload

Frontend installation
cd ../kapitan_chat_frontend

# install npm dependencies
npm install

# run dev server
npm run dev


Environment variables

...To be added soon
env

Apache 2.0 License
