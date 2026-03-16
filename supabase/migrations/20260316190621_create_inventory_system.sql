/*
  # K&M Torneadora - Sistema de Controle de Estoque
  
  Sistema completo de gestão de fornecedores, produtos e associações para fabricante de maquinário de garimpo.

  1. Novas Tabelas
    
    - `fornecedores`
      - `id` (bigserial, primary key) - Identificador único
      - `nome` (text) - Razão social do fornecedor
      - `cnpj` (text) - CNPJ do fornecedor
      - `material_fornecido` (text) - Tipo de material que fornece (Ferro, Engrenagens, Revestimento, Chapas, Outro)
      - `email` (text) - E-mail de contato
      - `telefone` (text) - Telefone de contato
      - `created_at` (timestamptz) - Data de cadastro
    
    - `produtos`
      - `id` (bigserial, primary key) - Identificador único
      - `nome` (text) - Nome do equipamento (Draga, Maraca, Guincho, etc)
      - `categoria` (text) - Categoria do equipamento (Extração, Içamento, Perfuração, Hidráulico, Outro)
      - `descricao` (text) - Descrição detalhada do equipamento
      - `preco` (numeric) - Preço de fabricação em reais
      - `quantidade` (integer) - Quantidade em estoque
      - `fornecedor_id` (bigint) - FK para fornecedor responsável pelo material
      - `created_at` (timestamptz) - Data de cadastro

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas permitem leitura pública para consultas
    - Inserção, atualização e exclusão requerem autenticação
    - Sistema projetado para uso interno da empresa

  3. Relacionamentos
    - produtos.fornecedor_id → fornecedores.id (opcional, para rastrear fornecedor principal)
    
  4. Dados Iniciais
    - 4 fornecedores pré-cadastrados (AçoForte, EngreTech, RevMax, Chapas & Metais)
    - 5 equipamentos pré-cadastrados (Draga, Maraca, Guincho, Abacaxi, Lança)
*/

-- Tabela de Fornecedores
CREATE TABLE IF NOT EXISTS fornecedores (
  id bigserial PRIMARY KEY,
  nome text NOT NULL,
  cnpj text NOT NULL,
  material_fornecido text NOT NULL,
  email text DEFAULT '',
  telefone text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Tabela de Produtos (Maquinário)
CREATE TABLE IF NOT EXISTS produtos (
  id bigserial PRIMARY KEY,
  nome text NOT NULL,
  categoria text DEFAULT 'Outro',
  descricao text DEFAULT '',
  preco numeric NOT NULL,
  quantidade integer DEFAULT 0,
  fornecedor_id bigint REFERENCES fornecedores(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança para Fornecedores
CREATE POLICY "Permitir leitura pública de fornecedores"
  ON fornecedores FOR SELECT
  USING (true);

CREATE POLICY "Permitir inserção autenticada de fornecedores"
  ON fornecedores FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Permitir atualização autenticada de fornecedores"
  ON fornecedores FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir exclusão autenticada de fornecedores"
  ON fornecedores FOR DELETE
  TO authenticated
  USING (true);

-- Políticas de Segurança para Produtos
CREATE POLICY "Permitir leitura pública de produtos"
  ON produtos FOR SELECT
  USING (true);

CREATE POLICY "Permitir inserção autenticada de produtos"
  ON produtos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Permitir atualização autenticada de produtos"
  ON produtos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir exclusão autenticada de produtos"
  ON produtos FOR DELETE
  TO authenticated
  USING (true);

-- Inserir Fornecedores Iniciais
INSERT INTO fornecedores (nome, cnpj, material_fornecido, email, telefone) VALUES
  ('AçoForte Ltda', '11.111.111/0001-11', 'Ferro', 'contato@acoforte.com', '(69) 99001-0001'),
  ('EngreTech S.A.', '22.222.222/0001-22', 'Engrenagens', 'vendas@engretech.com', '(69) 99002-0002'),
  ('RevMax Ind.', '33.333.333/0001-33', 'Revestimento', 'rev@revmax.com', '(69) 99003-0003'),
  ('Chapas & Metais Ltda', '44.444.444/0001-44', 'Chapas', 'chapas@metais.com', '(69) 99004-0004')
ON CONFLICT DO NOTHING;

-- Inserir Produtos Iniciais
INSERT INTO produtos (nome, categoria, descricao, preco, quantidade) VALUES
  ('Draga', 'Extração', 'Equipamento para extração de minério em leitos de rios', 45000, 3),
  ('Maraca', 'Extração', 'Bomba de sucção para garimpo em áreas alagadas', 12000, 5),
  ('Guincho', 'Içamento', 'Guincho mecânico para movimentação de cargas pesadas', 8500, 8),
  ('Abacaxi', 'Perfuração', 'Equipamento de perfuração para garimpo em solo duro', 22000, 4),
  ('Lança', 'Hidráulico', 'Lança hidráulica de alta pressão para desmonte de barranco', 6500, 10)
ON CONFLICT DO NOTHING;