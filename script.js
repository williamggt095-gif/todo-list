let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let filtroAtual = "todas";

// 🌙 carregar modo escuro salvo
if (localStorage.getItem("dark") === "true") {
  document.body.classList.add("dark");
}

function salvar() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function filtrar(tipo) {
  filtroAtual = tipo;
  renderizar();
}

function limparConcluidas() {
  tarefas = tarefas.filter(t => !t.concluida);
  salvar();
  renderizar();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("dark", "true");
  } else {
    localStorage.setItem("dark", "false");
  }
}

function renderizar() {
  const lista = document.getElementById("lista");
  const contador = document.getElementById("contador");

  lista.innerHTML = "";

  tarefas.forEach((tarefa, index) => {

    if (
      (filtroAtual === "pendentes" && tarefa.concluida) ||
      (filtroAtual === "concluidas" && !tarefa.concluida)
    ) {
      return;
    }

    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = tarefa.texto;

    if (tarefa.concluida) {
      span.classList.add("concluida");
    }

    span.onclick = () => {
      tarefas[index].concluida = !tarefas[index].concluida;
      salvar();
      renderizar();
    };

    // ✏️ editar
    const editBtn = document.createElement("button");
    const newLocal = editBtn.textContent = "✏️";

    editBtn.onclick = (e) => {
      e.stopPropagation();
      const novoTexto = prompt("Editar tarefa:", tarefa.texto);

      if (novoTexto && novoTexto.trim() !== "") {
        tarefas[index].texto = novoTexto;
        salvar();
        renderizar();
      }
    };

    // ❌ excluir
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";

    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      tarefas.splice(index, 1);
      salvar();
      renderizar();
    };

    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    lista.appendChild(li);
  });

  const pendentes = tarefas.filter(t => !t.concluida).length;
  contador.textContent = `📊 Pendentes: ${pendentes}`;
}

function adicionarTarefa() {
  const input = document.getElementById("inputTarefa");

  if (input.value.trim() === "") return;

  tarefas.push({
    texto: input.value,
    concluida: false
  });

  input.value = "";
  input.focus();

  salvar();
  renderizar();
}

const input = document.getElementById("inputTarefa");

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    adicionarTarefa();
  }
});

renderizar();