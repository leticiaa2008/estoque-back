const supabase = require("../config/supabase");

// ======================================================
// HELPER: GERAR SKU AUTOMÁTICO
// ======================================================
async function gerarSKU(familia_id, tipo_id) {
    try {
        // Busca os códigos da família e do tipo para compor o SKU
        const { data: familia } = await supabase
            .from("familias")
            .select("codigo")
            .eq("id", familia_id)
            .single();

        const { data: tipo } = await supabase
            .from("tipos")
            .select("codigo")
            .eq("id", tipo_id)
            .single();

        const prefixoFamilia = familia?.codigo ? String(familia.codigo).padStart(2, '0') : "00";
        const prefixoTipo = tipo?.codigo ? String(tipo.codigo).padStart(2, '0') : "00";

        // Conta quantos produtos existem nessa família/tipo para definir o sequencial
        const { count } = await supabase
            .from("produtos")
            .select("id", { count: "exact", head: true })
            .eq("familia_id", familia_id)
            .eq("tipo_id", tipo_id);

        const sequencial = String((count || 0) + 1).padStart(4, '0');

        return `${prefixoFamilia}.${prefixoTipo}.${sequencial}`;
    } catch (err) {
        // Fallback genérico caso a busca dos códigos falhe
        return `PRD-${Date.now().toString().slice(-6)}`;
    }
}


// ======================================================
// LISTAR PRODUTOS
// ======================================================

async function listarProdutos(req, res) {
    try {
        const {
            busca,
            familia_id,
            tipo_id,
            estoque_baixo
        } = req.query;

        let query = supabase
            .from("produtos")
            .select(`
                *,
                familias (
                    id,
                    codigo,
                    nome
                ),
                tipos (
                    id,
                    codigo,
                    nome
                )
            `)
            .eq("ativo", true)
            .order("created_at", { ascending: false });

        if (familia_id) {
            query = query.eq("familia_id", familia_id);
        }

        if (tipo_id) {
            query = query.eq("tipo_id", tipo_id);
        }

        if (busca) {
            query = query.or(
                `sku.ilike.%${busca}%,nome.ilike.%${busca}%,localizacao.ilike.%${busca}%`
            );
        }

        const { data, error } = await query;

        if (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao buscar produtos.",
                erro: error.message
            });
        }

        let produtos = data || [];

        if (estoque_baixo === "true") {
            produtos = produtos.filter(
                produto => Number(produto.quantidade) <= Number(produto.estoque_minimo)
            );
        }

        res.json({
            sucesso: true,
            total: produtos.length,
            dados: produtos
        });

    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor.",
            erro: error.message
        });
    }
}


// ======================================================
// BUSCAR PRODUTO PELO SKU
// ======================================================

async function buscarProdutoPorSKU(req, res) {
    try {
        const { sku } = req.params;

        const { data, error } = await supabase
            .from("produtos")
            .select(`
                *,
                familias (
                    id,
                    codigo,
                    nome
                ),
                tipos (
                    id,
                    codigo,
                    nome
                )
            `)
            .eq("sku", sku)
            .eq("ativo", true)
            .single();

        if (error || !data) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Produto não encontrado."
            });
        }

        res.json({
            sucesso: true,
            dados: data
        });

    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor.",
            erro: error.message
        });
    }
}


// ======================================================
// CRIAR PRODUTO
// ======================================================

async function criarProduto(req, res) {
    try {
        const {
            familia_id,
            tipo_id,
            sku: skuEnviado,
            nome,
            descricao,
            localizacao,
            quantidade,
            estoque_minimo
        } = req.body;

        // Validação de campos obrigatórios
        if (!familia_id || !tipo_id || !nome || !localizacao) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Os campos familia_id, tipo_id, nome e localizacao são obrigatórios."
            });
        }

        // Se o SKU não for enviado manualmente, gera um automaticamente
        const skuFinal = skuEnviado && skuEnviado.trim() !== ""
            ? skuEnviado.trim()
            : await gerarSKU(familia_id, tipo_id);

        const { data, error } = await supabase
            .from("produtos")
            .insert([
                {
                    familia_id,
                    tipo_id,
                    sku: skuFinal,
                    nome,
                    descricao: descricao || "",
                    localizacao,
                    quantidade: quantidade ? Number(quantidade) : 0,
                    estoque_minimo: estoque_minimo ? Number(estoque_minimo) : 0,
                    ativo: true
                }
            ])
            .select(`
                *,
                familias (
                    id,
                    codigo,
                    nome
                ),
                tipos (
                    id,
                    codigo,
                    nome
                )
            `)
            .single();

        if (error) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Erro ao cadastrar produto no banco de dados.",
                erro: error.message
            });
        }

        res.status(201).json({
            sucesso: true,
            mensagem: "Produto cadastrado com sucesso.",
            dados: data
        });

    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor.",
            erro: error.message
        });
    }
}


// ======================================================
// ATUALIZAR PRODUTO
// ======================================================

async function atualizarProduto(req, res) {
    try {
        const { id } = req.params;

        const {
            nome,
            descricao,
            localizacao,
            estoque_minimo,
            ativo
        } = req.body;

        const updateData = {};
        if (nome !== undefined) updateData.nome = nome;
        if (descricao !== undefined) updateData.descricao = descricao;
        if (localizacao !== undefined) updateData.localizacao = localizacao;
        if (estoque_minimo !== undefined) updateData.estoque_minimo = Number(estoque_minimo);
        if (ativo !== undefined) updateData.ativo = ativo;

        const { data, error } = await supabase
            .from("produtos")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Erro ao atualizar produto.",
                erro: error.message
            });
        }

        res.json({
            sucesso: true,
            mensagem: "Produto atualizado com sucesso.",
            dados: data
        });

    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor.",
            erro: error.message
        });
    }
}


// ======================================================
// DESATIVAR PRODUTO
// ======================================================

async function excluirProduto(req, res) {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("produtos")
            .update({
                ativo: false
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Erro ao desativar produto.",
                erro: error.message
            });
        }

        res.json({
            sucesso: true,
            mensagem: "Produto desativado com sucesso.",
            dados: data
        });

    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor.",
            erro: error.message
        });
    }
}


module.exports = {
    listarProdutos,
    buscarProdutoPorSKU,
    criarProduto,
    atualizarProduto,
    excluirProduto
};
