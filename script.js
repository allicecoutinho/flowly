$(document).ready(function () {

    /* ==========================
       BANCO LOCAL
    ========================== */

    let tarefas =
        JSON.parse(
            localStorage.getItem("flowly")
        ) || [];

    renderizar();

    /* ==========================
       ADICIONAR TAREFA
    ========================== */

    $("#btnAdicionar").click(function () {

        adicionarTarefa();

    });

    $("#tituloTarefa").keypress(function (e) {

        if (e.which === 13) {

            e.preventDefault();

            adicionarTarefa();
        }
    });

    function adicionarTarefa() {

        const titulo =
            $("#tituloTarefa")
                .val()
                .trim();

        const comentario =
            $("#comentarioTarefa")
                .val()
                .trim();

        if (!titulo) {

            alert(
                "Digite uma tarefa."
            );

            return;
        }

        tarefas.push({

            id: Date.now(),

            titulo: titulo,

            comentario: comentario,

            status: "pendente",

            criadoEm:
                new Date()
                .toLocaleString(
                    "pt-BR"
                )

        });

        salvar();

        limparFormulario();

        renderizar();
    }

    /* ==========================
       ABAS
    ========================== */

    $(".tab").click(function () {

        $(".tab")
            .removeClass("active");

        $(this)
            .addClass("active");

        renderizar();
    });

    /* ==========================
       CONCLUIR / REABRIR
    ========================== */

    $(document).on(
        "click",
        ".btn-check",
        function () {

            const id =
                Number(
                    $(this).data("id")
                );

            tarefas =
                tarefas.map(function (tarefa) {

                    if (
                        tarefa.id === id
                    ) {

                        tarefa.status =
                            tarefa.status ===
                            "concluida"
                                ? "pendente"
                                : "concluida";
                    }

                    return tarefa;
                });

            salvar();

            renderizar();
        }
    );

    /* ==========================
       EXCLUIR
    ========================== */

    $(document).on(
        "click",
        ".btn-delete",
        function () {

            const id =
                Number(
                    $(this).data("id")
                );

            const confirmar =
                confirm(
                    "Mover esta tarefa para Excluídas?"
                );

            if (!confirmar) {

                return;
            }

            tarefas =
                tarefas.map(function (tarefa) {

                    if (
                        tarefa.id === id
                    ) {

                        tarefa.status =
                            "excluida";
                    }

                    return tarefa;
                });

            salvar();

            renderizar();
        }
    );

    /* ==========================
       RENDERIZAÇÃO
    ========================== */

    function renderizar() {

        const filtro =
            $(".tab.active")
                .data("filtro");

        $("#listaTarefas")
            .empty();

        let tarefasFiltradas =
            tarefas.filter(
                tarefa =>
                    tarefa.status !==
                    "excluida"
            );

        if (
            filtro === "pendentes"
        ) {

            tarefasFiltradas =
                tarefas.filter(
                    tarefa =>
                        tarefa.status ===
                        "pendente"
                );
        }

        if (
            filtro === "concluidas"
        ) {

            tarefasFiltradas =
                tarefas.filter(
                    tarefa =>
                        tarefa.status ===
                        "concluida"
                );
        }

        if (
            filtro === "excluidas"
        ) {

            tarefasFiltradas =
                tarefas.filter(
                    tarefa =>
                        tarefa.status ===
                        "excluida"
                );
        }

        tarefasFiltradas.forEach(
            function (tarefa) {

                let botoes = "";

                if (
                    tarefa.status !==
                    "excluida"
                ) {

                    botoes = `

                        <button
                            class="btn-check"
                            data-id="${tarefa.id}">

                            ${
                                tarefa.status ===
                                "concluida"
                                    ? "Reabrir"
                                    : "Concluir"
                            }

                        </button>

                        <button
                            class="btn-delete"
                            data-id="${tarefa.id}">

                            Excluir

                        </button>

                    `;
                }

                const card = $(`

                    <li class="tarefa ${
                        tarefa.status ===
                        "concluida"
                            ? "concluida"
                            : ""
                    }">

                        <div class="tarefa-info">

                            <div class="titulo">

                                ${tarefa.titulo}

                            </div>

                            ${
                                tarefa.comentario
                                    ?

                                `<div class="comentario">

                                    ${tarefa.comentario}

                                </div>`

                                    :

                                ""
                            }

                        </div>

                        <div class="acoes">

                            ${botoes}

                        </div>

                    </li>

                `);

                $("#listaTarefas")
                    .append(card);

                card
                    .hide()
                    .fadeIn(250);
            }
        );

        atualizarDashboard();

        atualizarEstadoVazio();
    }

    /* ==========================
       DASHBOARD
    ========================== */

    function atualizarDashboard() {

        const pendentes =
            tarefas.filter(
                tarefa =>
                    tarefa.status ===
                    "pendente"
            ).length;

        const concluidas =
            tarefas.filter(
                tarefa =>
                    tarefa.status ===
                    "concluida"
            ).length;

        const excluidas =
            tarefas.filter(
                tarefa =>
                    tarefa.status ===
                    "excluida"
            ).length;

        $("#contadorPendentes")
            .text(pendentes);

        $("#contadorConcluidas")
            .text(concluidas);

        $("#contadorExcluidas")
            .text(excluidas);
    }

    /* ==========================
       ESTADO VAZIO
    ========================== */

    function atualizarEstadoVazio() {

        const filtro =
            $(".tab.active")
                .data("filtro");

        let quantidade = 0;

        let titulo = "";
        let texto = "";

        switch (filtro) {

            case "pendentes":

                quantidade =
                    tarefas.filter(
                        t =>
                            t.status ===
                            "pendente"
                    ).length;

                titulo =
                    "Sem tarefas pendentes.";

                texto =
                    "Bom trabalho!";

                break;

            case "concluidas":

                quantidade =
                    tarefas.filter(
                        t =>
                            t.status ===
                            "concluida"
                    ).length;

                titulo =
                    "Nenhuma tarefa concluída.";

                texto =
                    "Sua próxima conquista começa agora.";

                break;

            case "excluidas":

                quantidade =
                    tarefas.filter(
                        t =>
                            t.status ===
                            "excluida"
                    ).length;

                titulo =
                    "Nada por aqui.";

                texto =
                    "Nenhuma tarefa foi excluída.";

                break;

            default:

                quantidade =
                    tarefas.filter(
                        t =>
                            t.status !==
                            "excluida"
                    ).length;

                titulo =
                    "Sua lista está vazia.";

                texto =
                    "Por onde vamos começar?";
        }

        $("#estadoVazio h2")
            .text(titulo);

        $("#estadoVazio p")
            .text(texto);

        if (
            quantidade === 0
        ) {

            $("#estadoVazio")
                .show();

        } else {

            $("#estadoVazio")
                .hide();
        }
    }

    /* ==========================
       LOCAL STORAGE
    ========================== */

    function salvar() {

        localStorage.setItem(
            "flowly",
            JSON.stringify(tarefas)
        );
    }

    /* ==========================
       LIMPAR FORMULÁRIO
    ========================== */

    function limparFormulario() {

        $("#tituloTarefa")
            .val("");

        $("#comentarioTarefa")
            .val("");

        $("#tituloTarefa")
            .focus();
    }

});
