# ⚡ Laboratório de Circuitos 3D

Simulador 3D de circuitos elétricos, pilhas e baterias para as aulas de Ciências (**8º Ano**) e de Química/Física (**2ª Série do Ensino Médio**). Ele roda direto no navegador, sem instalar nada, no computador ou no celular.

**▶ Acesse:** https://raulvilera.github.io/laboratorio-circuitos-3d/

## 📚 Aulas do 8º ano (4º bimestre: Energia e eletricidade)

O botão **📚 Aulas 8º ano** abre as 21 aulas do bimestre. Cada aula tem um **laboratório interativo**, as **ideias-chave**, um roteiro **"Como usar na aula"** para o professor e **questões** com correção na hora. Há também um modo **🔍 Projetor**, com letras maiores, e um modo de tela cheia.

| Aula | Tema | Laboratório |
|---|---|---|
| 1 | Energia no cotidiano | Caça às energias: identificar as formas de energia em 12 situações |
| 2 | Fontes de energia | Classificar fontes renováveis e não renováveis; matriz energética e elétrica do Brasil |
| 3 | Transformação de energia | Pista de skate com barras de energia potencial, cinética e térmica, com e sem atrito |
| 4 | Energias renováveis | Montar a matriz elétrica de uma região ao longo de 24 h (seca, vento, nuvens, apagão, bandeira) |
| 5 | Magnetismo | Ímãs arrastáveis, bússolas, linhas de campo, atração e repulsão, cortar o ímã, a Terra como ímã |
| 6 | Cargas elétricas 1 | Átomo (ganhar e perder elétrons), força entre cargas, polarização (balão e papeizinhos) |
| 7 | Cargas elétricas 2 | Eletrização por atrito, contato e indução (com fio terra); raios e para-raios |
| 8 | Corrente elétrica | Lei de Ohm com material, comprimento, espessura e temperatura do fio; gráfico V × I; chuveiro verão e inverno |
| 9 | CA e CC | Elétrons em CC e CA em câmera lenta; gerador com ímã girando (indução eletromagnética) |
| 10 | Condutores e isolantes | Bancada de teste com 15 materiais e visão dos elétrons livres |
| 11 | Distribuição de energia | Caminho da usina até a casa, transformadores e o experimento das perdas na transmissão |
| 12 | Circuitos elétricos | Circuito com defeitos (fio cortado, sem pilha, lâmpada queimada) e jogo dos símbolos |
| 13 | Série e paralelo | Calculadora visual de associação (série, paralelo, misto), com Req passo a passo |
| 14 | Cuidados com a eletricidade | Quadro com disjuntor (sobrecarga, curto e incêndio), aterramento e "seguro ou perigoso?" |
| 15 e 16 | Simulador de circuitos | As atividades do livro como roteiros guiados no 3D, com folha de registro que confere as respostas |
| 17 | Classificação dos aparelhos | P = U × I, disjuntor de 5 000 W e classificação pela transformação e pelo consumo |
| 18 | Consumo dos aparelhos | Tabela de kWh e R$ por aparelho e comparação de etiquetas de eficiência (Inmetro e Procel) |
| 19 | Ações de economia | Conta de luz com medidor, tarifa, bandeiras e ações de economia |
| 20 | Simulador de economia | Casa modelo da aula (uso padrão × econômico) com os mesmos totais do livro |
| 21 | Consumo sustentável | Descarte do lixo eletrônico, o que há dentro de um celular, ODS 12 |

**Novidades no laboratório 3D:** fusível (queima e protege o circuito), modo **bateria e fios ideais** (valores iguais aos do livro), campo para digitar o valor do resistor e da bateria, e novos roteiros guiados: fusível e todas as atividades das aulas 15 e 16.

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

O laboratório 3D fica no arquivo `index.html`, que usa [Three.js](https://threejs.org/) (carregado da internet) para os gráficos 3D. Por isso precisa de conexão com a internet ao abrir. As aulas do 8º ano ficam na pasta `aulas/` (scripts comuns, sem dependências) e funcionam também abrindo o `index.html` direto do computador. Mantenha a pasta `aulas/` junto do `index.html`.
