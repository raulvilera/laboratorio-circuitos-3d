# ⚡ Laboratório de Circuitos 3D

Simulador 3D de circuitos elétricos, pilhas e baterias para as aulas de Ciências (**8º Ano**) e de Química/Física (**2ª Série do Ensino Médio**). Ele roda direto no navegador, sem instalar nada, no computador ou no celular.

**▶ Acesse:** https://raulvilera.github.io/laboratorio-circuitos-3d/

## O que dá para fazer

**Montar circuitos numa placa 3D**
- Componentes: bateria, fios, resistores, lâmpadas, chave, amperímetro e voltímetro.
- O simulador calcula a tensão, a corrente e a potência de verdade (análise nodal) e mostra a corrente circulando.
- Lâmpadas queimam com potência demais, e um curto-circuito gera alerta.
- Cada componente tem uma ficha explicativa: função, como funciona, unidade e exemplos do dia a dia.

**Roteiros guiados** para o aluno estudar sozinho:
- primeiro circuito;
- circuito em série;
- circuito em paralelo;
- circuito misto com medidores;
- curto-circuito.

Cada roteiro verifica automaticamente o que o aluno montou, faz perguntas com explicação e oferece o botão "Fazer por mim".

**Seletor de turma**
- **8º Ano:** linguagem simplificada, sem equações químicas.
- **2ª Série EM:** eletroquímica completa, com oxidação, redução e as equações de cada pilha.

**Por dentro das pilhas e baterias (2ª Série)**
- Pilha de **Volta** (1800), com as bolhas de H₂ e a polarização.
- Pilha de **Daniell** (1836), com ânodo, cátodo e ponte salina.
- Pilha **alcalina** (1959) em corte 3D.
- **Pilha num aparelho:** duas pilhas em série dentro de uma lanterna.
- **Bateria do carro (chumbo-ácido):** um carro 3D que anda, mostrando todas as ligações elétricas (faróis, partida, fusíveis, chassi, bobina e alternador) e a bateria por dentro, com descarga e recarga.
- Elétrons circulando continuamente, com a opção de **seguir um elétron** pelo circuito.
- Vistas da câmera: frente, traseira, laterais, de cima, de baixo e cofre do motor.

**História das pilhas:** uma linha do tempo de Galvani (1780) até o íon-lítio (Nobel de Química de 2019). Cada pesquisador tem o funcionamento da sua pilha, a reação, a tensão e um atalho para vê-la em 3D ou usá-la no circuito.

## Como usar

1. Abra o link acima (ou o arquivo `index.html`).
2. Escolha a turma: **8º Ano** ou **2ª Série EM**.
3. Comece por um **roteiro guiado** ou explore livremente.

Mouse: arraste para girar, use a roda para zoom e o botão direito para mover a câmera. Atalhos: as teclas **1 a 9** escolhem as ferramentas e **Esc** cancela.

## Tecnologia

O simulador é um único arquivo HTML, que usa [Three.js](https://threejs.org/) (carregado da internet) para os gráficos 3D. Por isso precisa de conexão com a internet ao abrir.
