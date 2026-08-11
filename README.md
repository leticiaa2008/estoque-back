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
Execute os códigos:
```text
-- ============================================================
-- SISTEMA DE CONTROLE DE ESTOQUE + ARQUIVO MORTO
-- Estrutura de SKU: FFF.TTT.PPPP
-- ============================================================

-- Limpa as tabelas caso já existam
DROP TABLE IF EXISTS movimentacoes CASCADE;
DROP TABLE IF EXISTS produtos CASCADE;
DROP TABLE IF EXISTS tipos CASCADE;
DROP TABLE IF EXISTS familias CASCADE;


-- ============================================================
-- 1. FAMÍLIAS
-- ============================================================

CREATE TABLE familias (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    codigo INTEGER NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT familias_codigo_valido
        CHECK (codigo BETWEEN 1 AND 999)
);


-- ============================================================
-- 2. TIPOS
-- ============================================================

CREATE TABLE tipos (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    familia_id BIGINT NOT NULL,
    codigo INTEGER NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_tipo_familia
        FOREIGN KEY (familia_id)
        REFERENCES familias(id)
        ON DELETE CASCADE,

    CONSTRAINT tipos_codigo_valido
        CHECK (codigo BETWEEN 1 AND 999),

    CONSTRAINT tipo_codigo_unico_por_familia
        UNIQUE (familia_id, codigo)
);


-- ============================================================
-- 3. PRODUTOS / ITENS
-- ============================================================

CREATE TABLE produtos (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,

    familia_id BIGINT NOT NULL,
    tipo_id BIGINT NOT NULL,

    codigo_produto INTEGER NOT NULL,

    -- SKU final: FFF.TTT.PPPP
    sku VARCHAR(12) NOT NULL UNIQUE,

    nome VARCHAR(150) NOT NULL,
    descricao TEXT,

    localizacao VARCHAR(200) NOT NULL,

    quantidade INTEGER NOT NULL DEFAULT 0,
    estoque_minimo INTEGER NOT NULL DEFAULT 0,

    qr_code TEXT,

    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_produto_familia
        FOREIGN KEY (familia_id)
        REFERENCES familias(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_produto_tipo
        FOREIGN KEY (tipo_id)
        REFERENCES tipos(id)
        ON DELETE RESTRICT,

    CONSTRAINT produto_codigo_valido
        CHECK (codigo_produto BETWEEN 1 AND 9999),

    CONSTRAINT quantidade_valida
        CHECK (quantidade >= 0),

    CONSTRAINT estoque_minimo_valido
        CHECK (estoque_minimo >= 0)
);


-- ============================================================
-- 4. MOVIMENTAÇÕES
-- ============================================================

CREATE TABLE movimentacoes (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,

    produto_id BIGINT NOT NULL,

    tipo_movimentacao VARCHAR(10) NOT NULL,

    quantidade INTEGER NOT NULL,

    estoque_anterior INTEGER NOT NULL,
    estoque_posterior INTEGER NOT NULL,

    responsavel VARCHAR(150) NOT NULL,

    motivo TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_movimentacao_produto
        FOREIGN KEY (produto_id)
        REFERENCES produtos(id)
        ON DELETE RESTRICT,

    CONSTRAINT tipo_movimentacao_valido
        CHECK (tipo_movimentacao IN ('ENTRADA', 'SAIDA')),

    CONSTRAINT quantidade_movimentacao_valida
        CHECK (quantidade > 0),

    CONSTRAINT estoque_anterior_valido
        CHECK (estoque_anterior >= 0),

    CONSTRAINT estoque_posterior_valido
        CHECK (estoque_posterior >= 0)
);


-- ============================================================
-- ÍNDICES
-- ============================================================

CREATE INDEX idx_tipos_familia
ON tipos(familia_id);

CREATE INDEX idx_produtos_familia
ON produtos(familia_id);

CREATE INDEX idx_produtos_tipo
ON produtos(tipo_id);

CREATE INDEX idx_produtos_sku
ON produtos(sku);

CREATE INDEX idx_produtos_nome
ON produtos(nome);

CREATE INDEX idx_produtos_localizacao
ON produtos(localizacao);

CREATE INDEX idx_movimentacoes_produto
ON movimentacoes(produto_id);

CREATE INDEX idx_movimentacoes_data
ON movimentacoes(created_at);


-- ============================================================
-- FUNÇÃO PARA ATUALIZAR updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION atualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trigger_produtos_updated_at
BEFORE UPDATE ON produtos
FOR EACH ROW
EXECUTE FUNCTION atualizar_updated_at();


-- ============================================================
-- FUNÇÃO PARA GERAR SKU AUTOMATICAMENTE
-- ============================================================

CREATE OR REPLACE FUNCTION gerar_sku_produto()
RETURNS TRIGGER AS $$
DECLARE
    codigo_familia INTEGER;
    codigo_tipo INTEGER;
    proximo_codigo INTEGER;
BEGIN

    -- Busca o código da família
    SELECT codigo
    INTO codigo_familia
    FROM familias
    WHERE id = NEW.familia_id;

    -- Busca o código do tipo
    SELECT codigo
    INTO codigo_tipo
    FROM tipos
    WHERE id = NEW.tipo_id;

    -- Descobre o próximo produto daquela família/tipo
    SELECT COALESCE(MAX(codigo_produto), 0) + 1
    INTO proximo_codigo
    FROM produtos
    WHERE familia_id = NEW.familia_id
      AND tipo_id = NEW.tipo_id;

    -- Define o código numérico do produto
    NEW.codigo_produto := proximo_codigo;

    -- Monta o SKU:
    -- FFF.TTT.PPPP
    NEW.sku :=
        LPAD(codigo_familia::TEXT, 3, '0')
        || '.' ||
        LPAD(codigo_tipo::TEXT, 3, '0')
        || '.' ||
        LPAD(proximo_codigo::TEXT, 4, '0');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trigger_gerar_sku
BEFORE INSERT ON produtos
FOR EACH ROW
EXECUTE FUNCTION gerar_sku_produto();


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE familias ENABLE ROW LEVEL SECURITY;
ALTER TABLE tipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimentacoes ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- POLÍTICAS TEMPORÁRIAS PARA DESENVOLVIMENTO
-- ============================================================

CREATE POLICY "Permitir leitura familias"
ON familias
FOR SELECT
USING (true);

CREATE POLICY "Permitir inserção familias"
ON familias
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Permitir atualização familias"
ON familias
FOR UPDATE
USING (true)
WITH CHECK (true);


CREATE POLICY "Permitir leitura tipos"
ON tipos
FOR SELECT
USING (true);

CREATE POLICY "Permitir inserção tipos"
ON tipos
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Permitir atualização tipos"
ON tipos
FOR UPDATE
USING (true)
WITH CHECK (true);


CREATE POLICY "Permitir leitura produtos"
ON produtos
FOR SELECT
USING (true);

CREATE POLICY "Permitir inserção produtos"
ON produtos
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Permitir atualização produtos"
ON produtos
FOR UPDATE
USING (true)
WITH CHECK (true);


CREATE POLICY "Permitir leitura movimentacoes"
ON movimentacoes
FOR SELECT
USING (true);

CREATE POLICY "Permitir inserção movimentacoes"
ON movimentacoes
FOR INSERT
WITH CHECK (true);


-- ============================================================
-- DADOS INICIAIS
-- ============================================================

INSERT INTO familias (codigo, nome, descricao)
VALUES
(1, 'Documentos', 'Documentos e arquivos administrativos'),
(2, 'Materiais', 'Materiais diversos'),
(3, 'Equipamentos', 'Equipamentos e eletrônicos');


INSERT INTO tipos (familia_id, codigo, nome, descricao)
VALUES
(
    (SELECT id FROM familias WHERE codigo = 1),
    1,
    'Caixas de Arquivo',
    'Caixas utilizadas para armazenamento de documentos'
),
(
    (SELECT id FROM familias WHERE codigo = 1),
    2,
    'Pastas',
    'Pastas e documentos organizacionais'
),
(
    (SELECT id FROM familias WHERE codigo = 2),
    1,
    'Material de Escritório',
    'Materiais utilizados no escritório'
),
(
    (SELECT id FROM familias WHERE codigo = 3),
    1,
    'Eletrônicos',
    'Equipamentos eletrônicos'
);


-- ============================================================
-- TESTE
-- ============================================================

-- Criar um produto de teste
INSERT INTO produtos (
    familia_id,
    tipo_id,
    nome,
    descricao,
    localizacao,
    quantidade,
    estoque_minimo
)
VALUES (
    (SELECT id FROM familias WHERE codigo = 1),
    (
        SELECT id
        FROM tipos
        WHERE familia_id = (
            SELECT id FROM familias WHERE codigo = 1
        )
        AND codigo = 1
    ),
    'Caixa de Arquivo Morto',
    'Caixa para armazenamento de documentos',
    'Estante B - Prateleira 3',
    20,
    5
);


-- Visualizar o produto criado
SELECT
    p.id,
    p.sku,
    p.nome,
    f.nome AS familia,
    t.nome AS tipo,
    p.localizacao,
    p.quantidade,
    p.estoque_minimo,
    p.created_at
FROM produtos p
JOIN familias f ON f.id = p.familia_id
JOIN tipos t ON t.id = p.tipo_id;
```

Depois:
```text
-- =========================================================
-- FAMÍLIAS
-- =========================================================

INSERT INTO familias (codigo, nome, descricao)
VALUES
(001, 'Documentos', 'Documentos e arquivos administrativos'),
(002, 'Materiais de Escritório', 'Materiais utilizados no escritório'),
(003, 'Equipamentos', 'Equipamentos eletrônicos e tecnológicos'),
(004, 'Materiais de Limpeza', 'Produtos e materiais de limpeza'),
(005, 'Materiais Escolares', 'Materiais utilizados em atividades escolares'),
(006, 'Patrimônio', 'Bens e patrimônios da instituição'),
(007, 'Arquivos Financeiros', 'Documentos relacionados ao setor financeiro'),
(008, 'Recursos Humanos', 'Documentos e materiais do setor de RH')
ON CONFLICT (codigo) DO NOTHING;


-- =========================================================
-- TIPOS
-- =========================================================

INSERT INTO tipos (codigo, familia_id, nome, descricao)
SELECT 001, id, 'Caixas de Arquivo', 'Caixas para armazenamento de documentos'
FROM familias
WHERE codigo = 001
ON CONFLICT DO NOTHING;

INSERT INTO tipos (codigo, familia_id, nome, descricao)
SELECT 002, id, 'Pastas', 'Pastas para organização de documentos'
FROM familias
WHERE codigo = 001
ON CONFLICT DO NOTHING;

INSERT INTO tipos (codigo, familia_id, nome, descricao)
SELECT 003, id, 'Documentos', 'Documentos armazenados'
FROM familias
WHERE codigo = 001
ON CONFLICT DO NOTHING;


INSERT INTO tipos (codigo, familia_id, nome, descricao)
SELECT 001, id, 'Canetas', 'Canetas para uso administrativo'
FROM familias
WHERE codigo = 002
ON CONFLICT DO NOTHING;

INSERT INTO tipos (codigo, familia_id, nome, descricao)
SELECT 002, id, 'Papéis', 'Papéis e folhas'
FROM familias
WHERE codigo = 002
ON CONFLICT DO NOTHING;

INSERT INTO tipos (codigo, familia_id, nome, descricao)
SELECT 003, id, 'Pastas Organizadoras', 'Pastas para organização'
FROM familias
WHERE codigo = 002
ON CONFLICT DO NOTHING;


INSERT INTO tipos (codigo, familia_id, nome, descricao)
SELECT 001, id, 'Computadores', 'Computadores e notebooks'
FROM familias
WHERE codigo = 003
ON CONFLICT DO NOTHING;

INSERT INTO tipos (codigo, familia_id, nome, descricao)
SELECT 002, id, 'Periféricos', 'Teclados, mouses e acessórios'
FROM familias
WHERE codigo = 003
ON CONFLICT DO NOTHING;

INSERT INTO tipos (codigo, familia_id, nome, descricao)
SELECT 003, id, 'Monitores', 'Monitores de computador'
FROM familias
WHERE codigo = 003
ON CONFLICT DO NOTHING;


INSERT INTO tipos (codigo, familia_id, nome, descricao)
SELECT 001, id, 'Produtos de Limpeza', 'Produtos químicos e de limpeza'
FROM familias
WHERE codigo = 004
ON CONFLICT DO NOTHING;

INSERT INTO tipos (codigo, familia_id, nome, descricao)
SELECT 002, id, 'Utensílios de Limpeza', 'Vassouras, rodos e similares'
FROM familias
WHERE codigo = 004
ON CONFLICT DO NOTHING;


INSERT INTO tipos (codigo, familia_id, nome, descricao)
SELECT 001, id, 'Cadernos', 'Cadernos escolares'
FROM familias
WHERE codigo = 005
ON CONFLICT DO NOTHING;

INSERT INTO tipos (codigo, familia_id, nome, descricao)
SELECT 002, id, 'Materiais de Desenho', 'Materiais para desenho'
FROM familias
WHERE codigo = 005
ON CONFLICT DO NOTHING;


INSERT INTO tipos (codigo, familia_id, nome, descricao)
SELECT 001, id, 'Móveis', 'Móveis e mobiliário'
FROM familias
WHERE codigo = 006
ON CONFLICT DO NOTHING;

INSERT INTO tipos (codigo, familia_id, nome, descricao)
SELECT 002, id, 'Equipamentos Patrimoniais', 'Equipamentos registrados como patrimônio'
FROM familias
WHERE codigo = 006
ON CONFLICT DO NOTHING;


INSERT INTO tipos (codigo, familia_id, nome, descricao)
SELECT 001, id, 'Notas Fiscais', 'Notas fiscais arquivadas'
FROM familias
WHERE codigo = 007
ON CONFLICT DO NOTHING;

INSERT INTO tipos (codigo, familia_id, nome, descricao)
SELECT 002, id, 'Comprovantes', 'Comprovantes financeiros'
FROM familias
WHERE codigo = 007
ON CONFLICT DO NOTHING;


INSERT INTO tipos (codigo, familia_id, nome, descricao)
SELECT 001, id, 'Documentos de Funcionários', 'Documentação de colaboradores'
FROM familias
WHERE codigo = 008
ON CONFLICT DO NOTHING;

INSERT INTO tipos (codigo, familia_id, nome, descricao)
SELECT 002, id, 'Contratos', 'Contratos de trabalho'
FROM familias
WHERE codigo = 008
ON CONFLICT DO NOTHING;
```

Depois: 
```text
ALTER TABLE produtos
ADD COLUMN IF NOT EXISTS codigo VARCHAR(20);
```

Depois:
```text
ALTER TABLE produtos
ADD CONSTRAINT produtos_codigo_unique UNIQUE (codigo);
```

Depois: 
```text
INSERT INTO produtos
(codigo, nome, descricao, familia_id, tipo_id, localizacao, quantidade, estoque_minimo)
VALUES
(
'001.001.0001',
'Caixa de Arquivo 2024',
'Documentos administrativos do ano de 2024',
(SELECT id FROM familias WHERE codigo = 1 LIMIT 1),
(SELECT id FROM tipos WHERE codigo = 1 LIMIT 1),
'Estante A - Prateleira 1',
15,
5
);
INSERT INTO produtos
(codigo, nome, descricao, familia_id, tipo_id, localizacao, quantidade, estoque_minimo)
VALUES

(
'001.001.0002',
'Caixa de Arquivo 2023',
'Documentos administrativos do ano de 2023',
(SELECT id FROM familias WHERE codigo = 1 LIMIT 1),
(SELECT id FROM tipos WHERE codigo = 1 LIMIT 1),
'Estante A - Prateleira 2',
8,
3
),

(
'001.001.0003',
'Caixa de Arquivo 2022',
'Documentos administrativos do ano de 2022',
(SELECT id FROM familias WHERE codigo = 1 LIMIT 1),
(SELECT id FROM tipos WHERE codigo = 1 LIMIT 1),
'Estante A - Prateleira 3',
2,
5
),

(
'001.002.0001',
'Pasta de Funcionários',
'Documentação funcional',
(SELECT id FROM familias WHERE codigo = 1 LIMIT 1),
(SELECT id FROM tipos WHERE codigo = 2 LIMIT 1),
'Estante B - Prateleira 1',
25,
10
),

(
'001.002.0002',
'Pasta de Contratos',
'Contratos administrativos',
(SELECT id FROM familias WHERE codigo = 1 LIMIT 1),
(SELECT id FROM tipos WHERE codigo = 2 LIMIT 1),
'Estante B - Prateleira 2',
12,
5
),

(
'002.001.0001',
'Caneta Azul',
'Caneta esferográfica azul',
(SELECT id FROM familias WHERE codigo = 2 LIMIT 1),
(SELECT id FROM tipos WHERE codigo = 1 LIMIT 1),
'Estante C - Prateleira 1',
80,
20
),

(
'002.001.0002',
'Caneta Preta',
'Caneta esferográfica preta',
(SELECT id FROM familias WHERE codigo = 2 LIMIT 1),
(SELECT id FROM tipos WHERE codigo = 1 LIMIT 1),
'Estante C - Prateleira 1',
45,
15
),

(
'002.001.0003',
'Caneta Vermelha',
'Caneta esferográfica vermelha',
(SELECT id FROM familias WHERE codigo = 2 LIMIT 1),
(SELECT id FROM tipos WHERE codigo = 1 LIMIT 1),
'Estante C - Prateleira 1',
5,
10
),

(
'002.002.0001',
'Papel A4',
'Pacote de papel sulfite A4',
(SELECT id FROM familias WHERE codigo = 2 LIMIT 1),
(SELECT id FROM tipos WHERE codigo = 2 LIMIT 1),
'Estante C - Prateleira 2',
35,
10
),

(
'003.001.0001',
'Notebook Dell',
'Notebook para uso administrativo',
(SELECT id FROM familias WHERE codigo = 3 LIMIT 1),
(SELECT id FROM tipos WHERE codigo = 1 LIMIT 1),
'Estante D - Prateleira 1',
6,
2
),

(
'003.001.0002',
'Notebook Lenovo',
'Notebook para uso administrativo',
(SELECT id FROM familias WHERE codigo = 3 LIMIT 1),
(SELECT id FROM tipos WHERE codigo = 1 LIMIT 1),
'Estante D - Prateleira 1',
3,
2
),

(
'003.002.0001',
'Mouse USB',
'Mouse óptico USB',
(SELECT id FROM familias WHERE codigo = 3 LIMIT 1),
(SELECT id FROM tipos WHERE codigo = 2 LIMIT 1),
'Estante D - Prateleira 2',
25,
8
),

(
'003.002.0002',
'Teclado USB',
'Teclado USB padrão ABNT2',
(SELECT id FROM familias WHERE codigo = 3 LIMIT 1),
(SELECT id FROM tipos WHERE codigo = 2 LIMIT 1),
'Estante D - Prateleira 2',
18,
5
),

(
'003.002.0003',
'Webcam',
'Webcam USB para reuniões',
(SELECT id FROM familias WHERE codigo = 3 LIMIT 1),
(SELECT id FROM tipos WHERE codigo = 2 LIMIT 1),
'Estante D - Prateleira 3',
4,
2
),

(
'003.003.0001',
'Monitor 21 Polegadas',
'Monitor LED de 21 polegadas',
(SELECT id FROM familias WHERE codigo = 3 LIMIT 1),
(SELECT id FROM tipos WHERE codigo = 3 LIMIT 1),
'Estante D - Prateleira 4',
7,
2
),

(
'004.001.0001',
'Desinfetante',
'Desinfetante para limpeza geral',
(SELECT id FROM familias WHERE codigo = 4 LIMIT 1),
(SELECT id FROM tipos WHERE codigo = 1 LIMIT 1),
'Estante E - Prateleira 1',
20,
5
),

(
'004.001.0002',
'Álcool 70%',
'Álcool para higienização',
(SELECT id FROM familias WHERE codigo = 4 LIMIT 1),
(SELECT id FROM tipos WHERE codigo = 1 LIMIT 1),
'Estante E - Prateleira 1',
3,
8
),

(
'004.002.0001',
'Vassoura',
'Vassoura para limpeza',
(SELECT id FROM familias WHERE codigo = 4 LIMIT 1),
(SELECT id FROM tipos WHERE codigo = 2 LIMIT 1),
'Estante E - Prateleira 2',
10,
3
),

(
'004.002.0002',
'Rodo',
'Rodo para limpeza',
(SELECT id FROM familias WHERE codigo = 4 LIMIT 1),
(SELECT id FROM tipos WHERE codigo = 2 LIMIT 1),
'Estante E - Prateleira 2',
8,
3
),

(
'005.001.0001',
'Caderno Universitário',
'Caderno de 200 folhas',
(SELECT id FROM familias WHERE codigo = 5 LIMIT 1),
(SELECT id FROM tipos WHERE codigo = 1 LIMIT 1),
'Estante F - Prateleira 1',
30,
10
),

(
'005.002.0001',
'Lápis de Cor',
'Caixa de lápis de cor',
(SELECT id FROM familias WHERE codigo = 5 LIMIT 1),
(SELECT id FROM tipos WHERE codigo = 2 LIMIT 1),
'Estante F - Prateleira 2',
15,
5
),

(
'006.001.0001',
'Cadeira de Escritório',
'Cadeira giratória para escritório',
(SELECT id FROM familias WHERE codigo = 6 LIMIT 1),
(SELECT id FROM tipos WHERE codigo = 1 LIMIT 1),
'Depósito A - Setor 1',
12,
3
),

(
'006.001.0002',
'Mesa de Escritório',
'Mesa para escritório',
(SELECT id FROM familias WHERE codigo = 6 LIMIT 1),
(SELECT id FROM tipos WHERE codigo = 1 LIMIT 1),
'Depósito A - Setor 2',
5,
2
);
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

# Site pronto e hospedado na vercel
https://estoque-back-pk7lamyws-leticiaa2008s-projects.vercel.app/
