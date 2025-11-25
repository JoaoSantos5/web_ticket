let filaSP = [];
let filaSG = [];
let filaSE = [];
let ultimasChamadas = [];
let todasAsSenhas = [];
let sequencia = 1;
let atendidas = 0;
let contadorSP = 0;
let contadorSG = 0;
let contadorSE = 0;
let atendidosSP = 0;
let atendidosSG = 0;
let atendidosSE = 0;

let ciclo = ["SP", "SESG", "SP", "SESG"];
let passoCiclo = 0;

function gerarCodigo(tipo) {
    let hoje = new Date();
    let YY = hoje.getFullYear().toString().slice(-2);
    let MM = String(hoje.getMonth() + 1).padStart(2, "0");
    let DD = String(hoje.getDate()).padStart(2, "0");

    let codigo = `${YY}${MM}${DD}-${tipo}${String(sequencia).padStart(3, "0")}`;
    sequencia++;
    return codigo;
}

function emitirSenha(tipo) {
    let codigo = gerarCodigo(tipo);
    
    // peger data e hora atual
    let agora = new Date();
    let dia = String(agora.getDate()).padStart(2, "0");
    let mes = String(agora.getMonth() + 1).padStart(2, "0");
    let ano = agora.getFullYear();
    let hora = String(agora.getHours()).padStart(2, "0");
    let minutos = String(agora.getMinutes()).padStart(2, "0");
    let segundos = String(agora.getSeconds()).padStart(2, "0");
    let dataHora = `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;

    if (tipo === "SP") {
        filaSP.push(codigo);
        contadorSP++;
    } else if (tipo === "SG") {
        filaSG.push(codigo);
        contadorSG++;
    } else if (tipo === "SE") {
        filaSE.push(codigo);
        contadorSE++;
    }
    
    // Add todas as senhas para lista
    todasAsSenhas.unshift({ codigo: codigo, data: dataHora });

    document.getElementById("ultima").textContent = codigo;
    
    // Update senhas totais
    document.getElementById("total-senhas").textContent = sequencia - 1;
    
    // Update priroridade contador
    document.getElementById("total-prioridades").textContent = contadorSP;
    
    // Update display
    atualizarListaSenhas();
}

function chamarProximo() {
    let tipo = ciclo[passoCiclo];
    let chamada = null;
    let tipoChamada = null;

    if (tipo === "SP" && filaSP.length > 0) {
        chamada = filaSP.shift();
        tipoChamada = "SP";
    } else {
        if (filaSE.length > 0) {
            chamada = filaSE.shift();
            tipoChamada = "SE";
        }
        else if (filaSG.length > 0) {
            chamada = filaSG.shift();
            tipoChamada = "SG";
        }
        else if (filaSP.length > 0) {
            chamada = filaSP.shift();
            tipoChamada = "SP";
        }
    }

    passoCiclo = (passoCiclo + 1) % ciclo.length;

    if (!chamada) {
        alert("Nenhuma senha na fila.");
        return;
    }

    document.getElementById("atual").textContent = chamada;
    
    // Update contador senha
    atendidas++;
    document.getElementById("total-atendidas").textContent = atendidas;
    
    // Update prioridade atendidos
    if (tipoChamada === "SP") atendidosSP++;
    else if (tipoChamada === "SG") atendidosSG++;
    else if (tipoChamada === "SE") atendidosSE++;
    
    document.getElementById("total-prioridades-at").textContent = atendidosSP;

    // coleta data e hora atual
    let agora = new Date();
    let dia = String(agora.getDate()).padStart(2, "0");
    let mes = String(agora.getMonth() + 1).padStart(2, "0");
    let ano = agora.getFullYear();
    let hora = String(agora.getHours()).padStart(2, "0");
    let minutos = String(agora.getMinutes()).padStart(2, "0");
    let segundos = String(agora.getSeconds()).padStart(2, "0");
    
    let dataHora = `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;
    let chamadaComData = { codigo: chamada, data: dataHora };

    ultimasChamadas.unshift(chamadaComData);
    if (ultimasChamadas.length > 5) ultimasChamadas.pop();

    atualizarPainel();
}

function atualizarPainel() {
    let painel = document.getElementById("painel-lista");
    painel.innerHTML = "";
    
    ultimasChamadas.forEach(s => {
        let div = document.createElement("div");
        div.textContent = `${s.codigo}`;
        painel.appendChild(div);
    });
}

function atualizarRelatorio() {
    let painel = document.getElementById("total-senhas");
    painel.innerHTML = "";
}

function atualizarListaSenhas() {
    const ul = document.getElementById('myList');
    ul.innerHTML = "";
    todasAsSenhas.forEach(s => {
        const li = document.createElement('li');
        li.textContent = `${s.codigo} - ${s.data}`;
        ul.appendChild(li);
    });
}

window.onload = function() { 
    atualizarPainel();
    atualizarRelatorio();
};

function passarSenha() {
    let senhaAtual = document.getElementById("atual").textContent;
    
    if (!senhaAtual) {
        alert("Nenhuma senha chamada para passar.");
        return;
    }
    
    // Determine tipo prioridade pelp tipo de senha atual
    let tipoPriority = "SP"; 
    if (senhaAtual.includes("-SG")) tipoPriority = "SG";
    else if (senhaAtual.includes("-SE")) tipoPriority = "SE";
    
    // deninuir contadores
    atendidas--;
    if (atendidas < 0) atendidas = 0;
    document.getElementById("total-atendidas").textContent = atendidas;
    
    // deninuir contadores prioridade
    if (tipoPriority === "SP") atendidosSP = Math.max(0, atendidosSP - 1);
    else if (tipoPriority === "SG") atendidosSG = Math.max(0, atendidosSG - 1);
    else if (tipoPriority === "SE") atendidosSE = Math.max(0, atendidosSE - 1);
    
    document.getElementById("total-prioridades-at").textContent = atendidosSP;
    
    // limpar senha atual
    document.getElementById("atual").textContent = "";
    
    alert("Senha " + senhaAtual + " foi passada.");
}