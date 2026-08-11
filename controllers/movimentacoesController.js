const supabase = require("../config/supabase");


// ======================================================
// ENTRADA DE ESTOQUE
// ======================================================

async function registrarEntrada(req, res) {

    try {

        const {
            sku,
            quantidade,
            responsavel,
            motivo
        } = req.body;


        if (
            !sku ||
            !quantidade ||
            !responsavel
        ) {

            return res.status(400).json({
                sucesso: false,
                mensagem:
                    "SKU, quantidade e responsável são obrigatórios."
            });

        }


        const quantidadeEntrada = Number(quantidade);


        if (quantidadeEntrada <= 0) {

            return res.status(400).json({
                sucesso: false,
                mensagem: "A quantidade deve ser maior que zero."
            });

        }


        // Busca produto
        const { data: produto, error: erroProduto } =
            await supabase
                .from("produtos")
                .select("*")
                .eq("sku", sku)
                .eq("ativo", true)
                .single();


        if (erroProduto || !produto) {

            return res.status(404).json({
                sucesso: false,
                mensagem: "Produto não encontrado."
            });

        }


        const estoqueAnterior = produto.quantidade;

        const estoquePosterior =
            estoqueAnterior + quantidadeEntrada;


        // Atualiza estoque
        const { data: produtoAtualizado, error: erroUpdate } =
            await supabase
                .from("produtos")
                .update({
                    quantidade: estoquePosterior
                })
                .eq("id", produto.id)
                .select()
                .single();


        if (erroUpdate) {

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao atualizar estoque.",
                erro: erroUpdate.message
            });

        }


        // Registra movimentação
        const { data: movimentacao, error: erroMovimentacao } =
            await supabase
                .from("movimentacoes")
                .insert([
                    {
                        produto_id: produto.id,
                        tipo_movimentacao: "ENTRADA",
                        quantidade: quantidadeEntrada,
                        estoque_anterior: estoqueAnterior,
                        estoque_posterior: estoquePosterior,
                        responsavel,
                        motivo: motivo || "Entrada de material"
                    }
                ])
                .select()
                .single();


        if (erroMovimentacao) {

            return res.status(500).json({
                sucesso: false,
                mensagem:
                    "Estoque atualizado, mas houve erro ao registrar histórico.",
                erro: erroMovimentacao.message
            });

        }


        res.status(201).json({
            sucesso: true,
            mensagem: "Entrada registrada com sucesso.",
            produto: produtoAtualizado,
            movimentacao
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
// SAÍDA DE ESTOQUE
// ======================================================

async function registrarSaida(req, res) {

    try {

        const {
            sku,
            quantidade,
            responsavel,
            motivo
        } = req.body;


        if (
            !sku ||
            !quantidade ||
            !responsavel ||
            !motivo
        ) {

            return res.status(400).json({
                sucesso: false,
                mensagem:
                    "SKU, quantidade, responsável e motivo são obrigatórios."
            });

        }


        const quantidadeSaida = Number(quantidade);


        if (quantidadeSaida <= 0) {

            return res.status(400).json({
                sucesso: false,
                mensagem:
                    "A quantidade deve ser maior que zero."
            });

        }


        // Busca produto
        const { data: produto, error: erroProduto } =
            await supabase
                .from("produtos")
                .select("*")
                .eq("sku", sku)
                .eq("ativo", true)
                .single();


        if (erroProduto || !produto) {

            return res.status(404).json({
                sucesso: false,
                mensagem: "Produto não encontrado."
            });

        }


        const estoqueAnterior = produto.quantidade;


        // Verifica saldo
        if (quantidadeSaida > estoqueAnterior) {

            return res.status(400).json({
                sucesso: false,
                mensagem:
                    "Estoque insuficiente para realizar a retirada.",
                estoqueAtual: estoqueAnterior
            });

        }


        const estoquePosterior =
            estoqueAnterior - quantidadeSaida;


        // Atualiza estoque
        const { data: produtoAtualizado, error: erroUpdate } =
            await supabase
                .from("produtos")
                .update({
                    quantidade: estoquePosterior
                })
                .eq("id", produto.id)
                .select()
                .single();


        if (erroUpdate) {

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao atualizar estoque.",
                erro: erroUpdate.message
            });

        }


        // Registra histórico
        const { data: movimentacao, error: erroMovimentacao } =
            await supabase
                .from("movimentacoes")
                .insert([
                    {
                        produto_id: produto.id,
                        tipo_movimentacao: "SAIDA",
                        quantidade: quantidadeSaida,
                        estoque_anterior: estoqueAnterior,
                        estoque_posterior: estoquePosterior,
                        responsavel,
                        motivo
                    }
                ])
                .select()
                .single();


        if (erroMovimentacao) {

            return res.status(500).json({
                sucesso: false,
                mensagem:
                    "Estoque atualizado, mas houve erro ao registrar histórico.",
                erro: erroMovimentacao.message
            });

        }


        res.status(201).json({
            sucesso: true,
            mensagem: "Saída registrada com sucesso.",
            produto: produtoAtualizado,
            movimentacao
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
// HISTÓRICO
// ======================================================

async function listarMovimentacoes(req, res) {

    try {

        const {
            sku,
            tipo,
            responsavel
        } = req.query;


        let query = supabase
            .from("movimentacoes")
            .select(`
                *,
                produtos (
                    id,
                    sku,
                    nome,
                    localizacao
                )
            `)
            .order("created_at", {
                ascending: false
            });


        if (tipo) {

            query = query.eq(
                "tipo_movimentacao",
                tipo.toUpperCase()
            );

        }


        if (responsavel) {

            query = query.ilike(
                "responsavel",
                `%${responsavel}%`
            );

        }


        const { data, error } = await query;


        if (error) {

            return res.status(500).json({
                sucesso: false,
                mensagem:
                    "Erro ao buscar movimentações.",
                erro: error.message
            });

        }


        let movimentacoes = data;


        if (sku) {

            movimentacoes =
                movimentacoes.filter(
                    item =>
                        item.produtos &&
                        item.produtos.sku === sku
                );

        }


        res.json({
            sucesso: true,
            total: movimentacoes.length,
            dados: movimentacoes
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
    registrarEntrada,
    registrarSaida,
    listarMovimentacoes
};