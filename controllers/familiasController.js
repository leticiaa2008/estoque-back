const supabase = require("../config/supabase");

// ======================================================
// LISTAR FAMÍLIAS
// ======================================================

async function listarFamilias(req, res) {
    try {
        const { data, error } = await supabase
            .from("familias")
            .select("*")
            .order("codigo", { ascending: true });

        if (error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao buscar famílias.",
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
// BUSCAR FAMÍLIA POR ID
// ======================================================

async function buscarFamilia(req, res) {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("familias")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Família não encontrada."
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
// CRIAR FAMÍLIA
// ======================================================

async function criarFamilia(req, res) {
    try {
        const { codigo, nome, descricao } = req.body;

        if (!codigo || !nome) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Código e nome são obrigatórios."
            });
        }

        const { data, error } = await supabase
            .from("familias")
            .insert([
                {
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
                mensagem: "Não foi possível criar a família.",
                erro: error.message
            });
        }

        res.status(201).json({
            sucesso: true,
            mensagem: "Família criada com sucesso.",
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
// ATUALIZAR FAMÍLIA
// ======================================================

async function atualizarFamilia(req, res) {
    try {
        const { id } = req.params;
        const { codigo, nome, descricao } = req.body;

        const { data, error } = await supabase
            .from("familias")
            .update({
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
                mensagem: "Erro ao atualizar família.",
                erro: error.message
            });
        }

        res.json({
            sucesso: true,
            mensagem: "Família atualizada com sucesso.",
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
// EXCLUIR FAMÍLIA
// ======================================================

async function excluirFamilia(req, res) {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from("familias")
            .delete()
            .eq("id", id);

        if (error) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Não foi possível excluir a família.",
                erro: error.message
            });
        }

        res.json({
            sucesso: true,
            mensagem: "Família excluída com sucesso."
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
    listarFamilias,
    buscarFamilia,
    criarFamilia,
    atualizarFamilia,
    excluirFamilia
};