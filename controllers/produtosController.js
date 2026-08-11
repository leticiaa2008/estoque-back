const supabase = require("../config/supabase");


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


        let produtos = data;


        if (estoque_baixo === "true") {

            produtos = produtos.filter(
                produto =>
                    produto.quantidade <= produto.estoque_minimo
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
            nome,
            descricao,
            localizacao,
            quantidade,
            estoque_minimo
        } = req.body;


        if (
            !familia_id ||
            !tipo_id ||
            !nome ||
            !localizacao
        ) {

            return res.status(400).json({
                sucesso: false,
                mensagem:
                    "Família, tipo, nome e localização são obrigatórios."
            });

        }


        const { data, error } = await supabase
            .from("produtos")
            .insert([
                {
                    familia_id,
                    tipo_id,
                    nome,
                    descricao,
                    localizacao,
                    quantidade: quantidade || 0,
                    estoque_minimo: estoque_minimo || 0
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
                mensagem: "Erro ao cadastrar produto.",
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


        const { data, error } = await supabase
            .from("produtos")
            .update({
                nome,
                descricao,
                localizacao,
                estoque_minimo,
                ativo
            })
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