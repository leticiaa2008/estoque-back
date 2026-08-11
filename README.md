# 📦 Sistema de Controle de Estoque & Arquivo Morto via QR Code

Sistema web Fullstack desenvolvido para facilitar o controle de estoque e a gestão de materiais armazenados em arquivo morto/depósito.

A aplicação permite cadastrar produtos, controlar entradas e saídas, consultar o estoque e utilizar a câmera do celular para realizar operações através de QR Codes.

---

## 👩‍💻 Projeto

**Projeto Prático - 4º Semestre**

**Curso:** Técnico em Desenvolvimento de Sistemas / Software  
**Instituição:** SENAI  
**Professor:** Adriano Rosa Mazetto

---

# 🎯 Objetivo

O objetivo do sistema é facilitar o controle e a organização de materiais armazenados em estoque e arquivo morto.

Através do sistema, o funcionário pode:

- 📦 Cadastrar produtos
- 🏷️ Gerar códigos estruturados para os produtos
- 📱 Escanear QR Codes pelo celular
- 📥 Registrar entradas de produtos
- 📤 Registrar retiradas de produtos
- 📊 Consultar o estoque
- ⚠️ Identificar produtos com estoque baixo
- 📍 Consultar a localização dos produtos
- 👤 Registrar o responsável pela movimentação
- 🕐 Consultar o histórico de movimentações
- 🔎 Pesquisar produtos por código, nome, família ou tipo

---

# 🛠️ Tecnologias utilizadas

## Frontend

- HTML5
- CSS3
- Tailwind CSS
- JavaScript Vanilla
- QR Code Scanner
- QR Code Generator

## Backend

- Node.js
- Express.js
- API REST
- CORS
- Dotenv

## Banco de dados

- Supabase
- PostgreSQL

## Deploy

- Vercel
- GitHub

---

# 📁 Estrutura do projeto

```text
estoque/
│
├── backend/
│   │
│   ├── controllers/
│   │   ├── produtoController.js
│   │   ├── movimentacaoController.js
│   │   └── familiaController.js
│   │
│   ├── routes/
│   │   ├── produtos.js
│   │   ├── movimentacoes.js
│   │   └── familias.js
│   │
│   ├── config/
│   │   └── supabase.js
│   │
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── .gitignore
│
├── frontend/
│   │
│   ├── index.html
│   ├── scanner.html
│   ├── app.js
│   ├── scanner.js
│   └── style.css
│
├── sql/
│   └── database.sql
│
└── README.md

```

A estrutura pode variar de acordo com a organização final do projeto.

# 🗃️ Banco de Dados

O sistema utiliza o Supabase, que possui PostgreSQL como banco de dados.

As principais entidades utilizadas pelo sistema são:

## 👨‍👩‍👧 Famílias

Responsáveis por agrupar os produtos.

Exemplos:

Documentos
Materiais de Escritório
Equipamentos
Materiais de Limpeza
Materiais Escolares
Patrimônio

## 📂 Tipos

Representam os subgrupos das famílias.

Exemplos:

Caixas de Arquivo
Pastas
Canetas
Papéis
Computadores
Periféricos
Monitores

## 📦 Produtos

Armazena os produtos cadastrados no sistema.

Principais informações:

Código
Nome
Descrição
Família
Tipo
Localização
Quantidade
Estoque mínimo

## 🔄 Movimentações

Registra todas as entradas e saídas realizadas.

Informações armazenadas:

Produto
Tipo de movimentação
Quantidade
Responsável
Motivo
Data e hora

# 🏷️ Sistema de códigos SKU

Todos os produtos seguem obrigatoriamente o padrão:
```text
FFF.TTT.PPPP
```
Onde:
```text
FFF = Família
TTT = Tipo
PPPP = Número do produto
```
Exemplo
```text
001.001.0042
```
Representação:
```text
001 → Documentos
001 → Caixas de Arquivo
0042 → Produto
```
Outro exemplo:
```text
003.002.0001
```
Representação:
```text
003 → Equipamentos
002 → Periféricos
0001 → Primeiro produto
```
# ⚙️ Pré-requisitos

Antes de executar o projeto, é necessário possuir instalado:

-Node.js
-npm
-Git

Recomenda-se utilizar uma versão atual do Node.js.

Para verificar se o Node.js está instalado:
```text
node -v
```

# 📥 Instalação

## 1. Clonar o repositório
```text
git clone COLE_AQUI_A_URL_DO_SEU_GITHUB
```
Depois entre na pasta:
```text
cd estoque
```
# 📦 Instalar dependências

Entre na pasta do backend:
```text
cd backend
```
Execute:
```text
npm install
```
Esse comando instalará todas as dependências necessárias para executar a API.

# 🔐 Configuração do Supabase

O projeto utiliza variáveis de ambiente para proteger as informações de conexão com o banco.

Dentro da pasta backend, crie um arquivo:
```text
.env
```
Adicione:
```text
PORT=3000

SUPABASE_URL=SUA_URL_DO_SUPABASE
SUPABASE_KEY=SUA_CHAVE_DO_SUPABASE
```

# 🔒 Arquivo .gitignore

Crie um arquivo:
```text
.gitignore
```
E coloque:
```text
node_modules/
.env
.env.local
```
Dessa forma, as chaves do Supabase não serão enviadas para o repositório.

# 🗄️ Configuração do banco

No Supabase, acesse:
```text
SQL Editor
```
Execute o arquivo:
```text
sql/database.sql
```
Esse arquivo contém a estrutura necessária para o banco de dados.

Depois disso, podem ser inseridos os dados iniciais de:

-Famílias
-Tipos
-Produtos

# ▶️ Executando o Backend

Dentro da pasta:
```text
backend/
```
execute:
```text
npm start
```
Caso o projeto utilize o script de desenvolvimento:
```text
npm run dev
```
A API será iniciada em:
```text
http://localhost:3000
```
# 🌐 API

A API disponibiliza endpoints para comunicação entre o frontend e o banco de dados.

Exemplos:
```text
GET    /api/produtos
POST   /api/produtos

GET    /api/familias
POST   /api/familias

GET    /api/tipos
POST   /api/tipos

GET    /api/movimentacoes
POST   /api/movimentacoes
```
Os endpoints podem variar de acordo com a implementação final do backend.

# 📱 Frontend

O frontend foi desenvolvido utilizando:

-HTML

-CSS

-Tailwind CSS

-JavaScript Vanilla

Não são utilizados frameworks SPA como:

-React

-Vue

-Angular

# 🔗 Configuração da URL do Backend

No frontend existe uma variável responsável por armazenar o endereço da API.

Exemplo:
```text
const API_URL = "COLE_AQUI_A_URL_DA_VERCEL";
```
Durante o desenvolvimento local:
```text
const API_URL = "http://localhost:3000";
```
Depois do deploy:
```text
const API_URL = "COLE_AQUI_A_URL_DA_VERCEL";
```
## 🚀 URL da Vercel
```text
COLE_AQUI_A_URL_DO_BACKEND_NA_VERCEL
```
Exemplo:
```text
https://seu-backend.vercel.app
```
⚠️ Substitua pelo endereço real do seu backend depois do deploy.

# 📱 Leitura de QR Code

O sistema possui uma tela específica para leitura dos códigos:
```text
scanner.html
```
O funcionário pode acessar essa página pelo celular e utilizar a câmera do dispositivo para identificar o produto.

Após a leitura, o sistema identifica o código:
```text
001.001.0001
```
E consulta automaticamente o produto correspondente na API.

# 📥 Entrada de produtos

O fluxo de entrada funciona da seguinte maneira:
```text
Funcionário
     ↓
Escaneia QR Code
     ↓
Sistema identifica produto
     ↓
Exibe nome e localização
     ↓
Funcionário informa quantidade
     ↓
Informa responsável
     ↓
Confirma entrada
     ↓
Estoque é atualizado
     ↓
Movimentação é registrada
```

# 📤 Saída de produtos

O fluxo de retirada funciona da seguinte maneira:
```text
Funcionário
     ↓
Escaneia QR Code
     ↓
Sistema identifica produto
     ↓
Consulta estoque atual
     ↓
Funcionário informa quantidade
     ↓
Informa motivo
     ↓
Informa responsável
     ↓
Confirma retirada
     ↓
Sistema verifica o saldo
     ↓
Estoque é atualizado
     ↓
Movimentação é registrada
```

# ⚠️ Validação de estoque

O sistema impede que seja retirada uma quantidade maior que o estoque disponível.

Exemplo:
```text
Estoque atual: 10

Quantidade solicitada: 15
```
Resultado:
```text
❌ Retirada não permitida.

Estoque insuficiente.
```
# 🚨 Alerta de estoque baixo

Cada produto possui um valor de estoque mínimo.

Exemplo:
```text
Quantidade: 3
Estoque mínimo: 5
```
O sistema identifica o produto como:
```text
⚠️ ESTOQUE BAIXO
```
Caso a quantidade seja:
```text
0
```
O produto será identificado como:
```text
🔴 SEM ESTOQUE
```
# 📊 Histórico

Todas as movimentações realizadas são armazenadas no banco de dados.

Exemplo:
```text
| Data             | Produto               | Tipo    | Quantidade | Responsável |
| ---------------- | --------------------- | ------- | ---------: | ----------- |
| 11/08/2026 09:30 | Caixa de Arquivo 2024 | Entrada |          5 | João        |
| 11/08/2026 10:15 | Papel A4              | Saída   |          2 | Maria       |
| 11/08/2026 10:45 | Mouse USB             | Entrada |          3 | Carlos      |
```

# 🔎 Pesquisa

O painel administrativo permite pesquisar produtos por:

-Código

-Nome

-Família

-Tipo

-Localização

Exemplo de pesquisa:
```text
001.001.0001
```
Resultado:
```text
Caixa de Arquivo 2024

Localização:
Estante A - Prateleira 1

Estoque:
15 unidades
```
# 🏷️ QR Code

Cada produto possui um QR Code relacionado ao seu código SKU.

Exemplo:
```text
001.001.0001
```
O QR Code contém o código utilizado pelo sistema para localizar o produto.

O processo é:
```text
QR Code
   ↓
Código SKU
   ↓
API
   ↓
Supabase
   ↓
Produto
```
# ☁️ Deploy na Vercel

O backend pode ser publicado na Vercel.

Depois do deploy, será gerada uma URL semelhante a:
```text
https://estoque-back.vercel.app
```
Essa URL deverá ser configurada no frontend.

Exemplo:
```text
const API_URL = "https://estoque-back.vercel.app";
```
# 🔑 Variáveis de ambiente na Vercel

No painel da Vercel, acesse:
```text
Project
→ Settings
→ Environment Variables
```
Adicione:
```text
SUPABASE_URL
```
e:
```text
SUPABASE_KEY
```
Exemplo:
```text
SUPABASE_URL = https://seu-projeto.supabase.co

SUPABASE_KEY = sua-chave-do-supabase
```
Também pode ser definida:
```text
PORT = 3000
```

#🧪 Testando a API

A API pode ser testada utilizando ferramentas como:

-Postman

-Thunder Client

-Insomnia

Exemplo:
```text
GET /api/produtos
```
Resposta esperada:
```text
[
  {
    "codigo": "001.001.0001",
    "nome": "Caixa de Arquivo 2024",
    "quantidade": 15,
    "estoque_minimo": 5
  }
]
```

# 📱 Responsividade

O sistema foi desenvolvido pensando em computadores e dispositivos móveis.

No computador:
```text
┌─────────────────────────────────────┐
│           PAINEL DE ESTOQUE         │
│                                     │
│ Produtos | Entradas | Saídas       │
│                                     │
│ Histórico | Relatórios              │
└─────────────────────────────────────┘
```
No celular:
```text
┌───────────────────┐
│ 📦 ESTOQUE        │
├───────────────────┤
│                   │
│ 📷 Escanear QR    │
│                   │
│ 📥 Entrada        │
│                   │
│ 📤 Saída          │
│                   │
│ 📦 Produtos       │
│                   │
└───────────────────┘
```
# 🔒 Segurança

As credenciais do banco de dados não devem ser armazenadas diretamente no código-fonte.

Utilize:
```text
.env
```
e variáveis de ambiente.

O arquivo .env deve permanecer fora do GitHub.

# ⭐ Funcionalidades extras

O projeto pode receber funcionalidades adicionais, como:

🏷️ Impressão de etiquetas
📄 Geração de PDF
📊 Dashboard com gráficos
📈 Relatórios de estoque
🔔 Notificações de estoque baixo
📱 PWA
👥 Sistema de usuários
🔐 Controle de permissões
📷 Leitura de QR Code
🖨️ Impressão de etiquetas
📋 Exportação para Excel/CSV

# 🚀 Fluxo geral do sistema
```text
                    SISTEMA DE ESTOQUE
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
      PRODUTOS          QR CODE         HISTÓRICO
          │                │                │
          ▼                ▼                ▼
      SUPABASE         SCANNER        MOVIMENTAÇÕES
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
                    CONTROLE DE ESTOQUE
```

# 👩‍💻 Desenvolvimento

Projeto desenvolvido como atividade prática do 4º Semestre, com foco em desenvolvimento Fullstack, APIs REST, banco de dados, integração com Supabase e recursos mobile.

# 📚 Aprendizados

Durante o desenvolvimento foram trabalhados conceitos de:

Desenvolvimento Fullstack
APIs REST
Node.js
Express.js
PostgreSQL
Supabase
JavaScript
HTML
CSS
Tailwind CSS
QR Code
Responsividade
Variáveis de ambiente
Git e GitHub
Deploy na Vercel
Controle de estoque
Modelagem de banco de dados

# 📌 Status do projeto
```text
🟢 Em desenvolvimento
```

Funcionalidades principais:

 Banco de dados
 Cadastro de famílias
 Cadastro de tipos
 Cadastro de produtos
 Código SKU
 Controle de quantidade
 Estoque mínimo
 Scanner QR Code
 Entrada via QR Code
 Saída via QR Code
 Histórico completo
 Dashboard
 Impressão de etiquetas
 PWA
 
# 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos e educacionais.

```text
### ⚠️ Só altere estas partes antes de entregar

No README, procure por:

COLE_AQUI_A_URL_DO_SEU_GITHUB
```
e coloque seu repositório.

E procure por:
```text
COLE_AQUI_A_URL_DO_BACKEND_NA_VERCEL
```

e coloque a URL que a Vercel fornecer.
