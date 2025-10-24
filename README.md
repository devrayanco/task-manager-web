# 🖥️ Interface Web - Gerenciador de Tarefas (React + TS + Kanban)

Este projeto é a interface web (frontend) para o [Desafio Técnico - API de Gerenciamento de Tarefas](https://github.com/devrayanco/TaskManagerApi).

A aplicação foi desenvolvida em **React** com **TypeScript** (utilizando Vite) e implementa um sistema completo de gestão de tarefas em formato de quadro **Kanban** (estilo Trello), consumindo a API .NET.

## ✅ Funcionalidades

- **Autenticação:** Sistema de Login e Registo (Cadastro) de utilizadores.
- **Proteção de Rotas:** Utilizadores não autenticados são redirecionados para `/login`.
- **Gestão de Sessão:** O token JWT é armazenado no `localStorage` e gerido globalmente via `AuthContext`.
- **Quadro Kanban:** Visualização das tarefas nas colunas "A Fazer", "Em Andamento" e "Concluído".
- **Arrastar e Soltar (Drag-and-Drop):** Mova tarefas entre as colunas para atualizar o seu status.
- **CRUD Completo de Tarefas:**
    - **Criar:** Adicionar novas tarefas (surgem em "A Fazer").
    - **Editar:** Editar o título de uma tarefa (clique duplo ou botão "Editar").
    - **Excluir:** Remover tarefas.
- **Logout:** Botão para limpar a sessão e deslogar.

## 🌟 Diferenciais Implementados

Este projeto atende aos seguintes requisitos diferenciais do desafio:

- **Uso de TypeScript:** Todo o projeto é tipado.
- **Framework JS (React):** Utilização de React com hooks modernos.
- **Interceptor Axios:** Um interceptor de `axios` é configurado para anexar automaticamente o token JWT (`Authorization: Bearer ...`) a todos os pedidos para a API.
- **Armazenamento de Token:** O token é persistido no `localStorage`.
- **Interface Kanban:** O requisito de "interface simples" foi expandido para um quadro Kanban completo com drag-and-drop.
- **Biblioteca de Ícones:** `react-icons` para uma UI mais polida.

## 🧱 Estrutura de Pastas

/task-manager-web 
├── public/ 
├── src/ 
│ ├── components/ 
│ │ ├── CreateTaskForm.tsx # Formulário de criação de tarefa 
│ │ ├── KanbanBoard.tsx # O quadro (DragDropContext) 
│ │ ├── KanbanColumn.tsx # Uma coluna (Droppable) 
│ │ ├── ProtectedRoute.tsx # Wrapper de rota protegida 
│ │ └── TaskCard.tsx # O card da tarefa (Draggable) 
│ ├── contexts/ 
│ │ └── AuthContext.tsx # Estado global de autenticação 
│ ├── interfaces/ 
│ │ └── task.interface.ts # Tipagem da Tarefa 
│ ├── pages/ 
│ │ ├── LoginPage.tsx # Página de Login 
│ │ ├── RegisterPage.tsx # Página de Registo 
│ │ └── TasksPage.tsx # Página principal (Contêiner do Kanban) 
│ ├── services/ 
│ │ └── api.ts # Configuração do Axios (BaseURL e Interceptor) 
│ ├── App.tsx # Definição das Rotas 
│ ├── index.css # Estilos globais 
│ └── main.tsx # Ponto de entrada (Render) 
├── package.json 
└── README.md


## 🛠️ Tecnologias Utilizadas

- **React 19**
- **Vite** (Build tool)
- **TypeScript**
- **React Router** (`react-router-dom`)
- **Axios** (para chamadas de API, com interceptores)
- **@hello-pangea/dnd** (Kanban)
- **React Icons** (Biblioteca de ícones)
- **CSS** (Puro, com `index.css` global)

## 📦 Instalação e Execução

### Pré-requisito

**O Backend (API) deve estar em execução.** Por favor, siga as instruções de instalação do [repositório da API](https://github.com/devrayanco/TaskManagerApi).

---

1.  **Clone o repositório**
    ```bash
    git clone https://github.com/devrayanco/task-manager-web.git
    cd task-manager-web
    ```

2.  **Instale as dependências**
    ```bash
    npm install
    ```

3.  **Configure o URL da API**
    * Abra o ficheiro `src/services/api.ts`.
    * Altere o `API_URL` para apontar para o URL `https` do seu backend (ex: o URL do Swagger sem o `/swagger`).

    ```typescript
    const API_URL = 'https://localhost:7252/api';
    ```

4.  **Execute o projeto de desenvolvimento**
    ```bash
    npm run dev
    ```

5.  **Acesse a aplicação**
    * O Vite irá disponibilizar a aplicação em `http://localhost:5173`.