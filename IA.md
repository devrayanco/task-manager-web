# 🤖 Relatório de Uso de IA - Desafio Full Stack

## 1. Metodologia e Filosofia de Uso

Conforme as instruções do desafio, utilizei ferramentas de IA generativa (Google Gemini) estritamente como um acelerador e assistente de "pair programming".

A minha abordagem foi atuar como o arquiteto e "piloto" do projeto. Eu defini a direção estratégica, os padrões de arquitetura (como a refatoração para endpoints RESTful) e a escolha de tecnologias. A IA atuou como "co-piloto", gerando o código-padrão (boilerplate) e auxiliando na depuração, o que me permitiu focar nas decisões de design e na qualidade do código.

Este log destaca as principais decisões e intervenções críticas que tomei durante o processo.

## 2. Resumo de Intervenções Críticas (Me vs. IA)

Antes do log detalhado, destaco três intervenções-chave onde a minha supervisão foi crucial para o sucesso do projeto:

### Correção de Biblioteca Obsoleta (Liderança Técnica)
A IA sugeriu o uso da biblioteca `react-beautiful-dnd`, que está descontinuada pela Atlassian e não é compatível com React 18+ (Strict Mode).

**Minha Intervenção:** Eu identifiquei a obsolescência da biblioteca, pesquisei o fork mantido pela comunidade e direcionei o uso da `@hello-pangea/dnd`. A IA então adaptou-se à minha escolha.

### Design de API (Visão de Arquitetura)
Para a atualização de tarefas, a IA sugeriu um único endpoint `PUT /api/tasks/{id}` com um DTO que exigia todos os campos (título e status).

**Minha Intervenção:** Eu discordei desta abordagem, pois ela fere o Princípio da Responsabilidade Única (SRP) e não é RESTful. Direcionei a refatoração para dois endpoints distintos (`PUT /tasks/{id}/status` e `PUT /tasks/{id}/title`) que aceitam uma string pura no body. Isto tornou a API mais limpa, eficiente e alinhada com as necessidades do frontend (Kanban).

### Qualidade de Código e Refatoração (Manutenibilidade)
Após a implementação do Kanban, identifiquei que o componente `TasksPage.tsx` havia se tornado um "God Component" (anti-padrão), misturando busca de dados, gestão de estado global, lógica de D&D e renderização.

**Minha Intervenção:** Solicitei proativamente a refatoração, quebrando a página em componentes menores e com responsabilidades únicas (`KanbanBoard`, `KanbanColumn`, `TaskCard`, `CreateTaskForm`), seguindo as melhores práticas do React.

## 3. Log Detalhado de Interação

Abaixo segue o histórico curado das principais etapas do projeto.

### Bloco 1: Estrutura do Backend (.NET)

**Prompt (Eu):** "Estou criando um projeto WebApi no intuito de criar um sistema de cadastro de tarefas com login, me ajude a criar um script com a estrutura inicial do projeto .NET 8 Web API, instalar os pacotes do EF Core para sql server, JWT e configurar o Swagger para autenticação."

**Observação:** Nesse ponto a IA serviu mais como um revisor eu já tinha em mente como criar o projeto pela interface do visual studio, no entanto pedi para que ela gerasse o script de criação do projeto para que não perdesse tempo buscando os pacotes do Nuget e para não deixar nenhum detalhe de fora no momento de criação do projeto, o que acelerou o setup.

**Prompt (Eu):** "a partir das entidades que estou fornecendo me dê sugestões para os modelos (User, Task)"

**Observação:** Forneci informações das entidades que pensava em criar e ela aprimorou, nesse ponto a Ia me sugeriu validações que eu não tinha pensado.

**Prompt (Eu):** "estou criando a Autenticação (Auth) com JWT padrão em muitos projetos, que melhorias pode me sugerir"

**Observação:** A IA sugeriu `BCrypt.Net` (o que aprovei) e isolou a lógica de token num `TokenService`, o que é uma boa prática que decidi manter.

### Bloco 2: Refatoração para Kanban

**Prompt (Eu):** "me ajude implementar um sistema de arrastar e soltar (drag-and-drop) estilo Trello"

**Observação:** A IA propôs o plano de refatoração do backend (trocar `bool IsCompleted` por um `Enum TaskStatus`). Antes estava usando uma coluna em boleano apenas para marcar como feito ou não

### Bloco 3: Estrutura e Refatoração do Frontend (React)

**Prompt (Eu):** " vamos otimizar a page `taskPage`, podemos quebrar, componentizar é o ideal para projetos React e para manutenabilidade do código."

**Observação:** A IA sugeriu a criação dos componentes `CreateTaskForm`, `TaskCard`, `KanbanColumn` e `KanbanBoard`, para ser importado na page `TasksPage`.

### Bloco 4: Finalização

**Prompt (Eu):** "Para finalizar, vamos melhorar meu `README.md`..."

**Observação:** Forneci meu exemplo README.md e pedi à IA para melhorar os dois READMEs (backend e frontend) com as informações que forneci, o que acelerou muito a documentação.

## 4. Conclusão

A IA foi uma ferramenta poderosa para acelerar tarefas de boilerplate (configuração inicial, criação de ficheiros, escrita de CSS). No entanto, a direção estratégica, as decisões de arquitetura (como o design da API), a correção de informações obsoletas (como a biblioteca de D&D) e a garantia de qualidade do código (como a refatoração de componentes) foram contribuições diretas da minha parte.