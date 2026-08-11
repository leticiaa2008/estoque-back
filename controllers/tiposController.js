const supabase = require("../config/supabase");


// ======================================================
// LISTAR TIPOS
// ======================================================

async function listarTipos(req, res) {
    try {

        const { familia_id } = req.query;

        let query = supabase
            .from("tipos")
            .select(`
                *,
                familias (
                    id,
                    codigo,
                    nome
                )
            `)
            .order("codigo", { ascending: true });

        if (familia_id) {
            query = query.eq("familia_id", familia_id);
        }

        const { data, error } = await query;

        if (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao buscar tipos.",
                erro: error.message
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
// BUSCAR TIPO
// ======================================================

async function buscarTipo(req, res) {

    try {

        const { id } = req.params;

        const { data, error } = await supabase
            .from("tipos")
            .select(`
                *,
                familias (
                    id,
                    codigo,
                    nome
                )
            `)
            .eq("id", id)
            .single();

        if (error) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Tipo não encontrado."
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
// CRIAR TIPO
// ======================================================

async function criarTipo(req, res) {

    try {

        const {
            familia_id,
            codigo,
            nome,
            descricao
        } = req.body;

        if (!familia_id || !codigo || !nome) {

            return res.status(400).json({
                sucesso: false,
                mensagem: "Família, código e nome são obrigatórios."
            });

        }

        const { data, error } = await supabase
            .from("tipos")
            .insert([
                {
                    familia_id,
                    codigo,
                    nome,
                    descricao
                }
            ])
            .select()
            .single();

        if (error) {

            return res.status(400).json({
                sucesso: false,
                mensagem: "Erro ao criar tipo.",
                erro: error.message
            });

        }

        res.status(201).json({
            sucesso: true,
            mensagem: "Tipo criado com sucesso.",
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
// ATUALIZAR TIPO
// ======================================================

async function atualizarTipo(req, res) {

    try {

        const { id } = req.params;

        const {
            familia_id,
            codigo,
            nome,
            descricao
        } = req.body;

        const { data, error } = await supabase
            .from("tipos")
            .update({
                familia_id,
                codigo,
                nome,
                descricao
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {

            return res.status(400).json({
                sucesso: false,
                mensagem: "Erro ao atualizar tipo.",
                erro: error.message
            });

        }

        res.json({
            sucesso: true,
            mensagem: "Tipo atualizado com sucesso.",
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
// EXCLUIR TIPO
// ======================================================

async function excluirTipo(req, res) {

    try {

        const { id } = req.params;

        const { error } = await supabase
            .from("tipos")
            .delete()
            .eq("id", id);

        if (error) {

            return res.status(400).json({
                sucesso: false,
                mensagem: "Erro ao excluir tipo.",
                erro: error.message
            });

        }

        res.json({
            sucesso: true,
            mensagem: "Tipo excluído com sucesso."
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
    listarTipos,
    buscarTipo,
    criarTipo,
    atualizarTipo,
    excluirTipo
};