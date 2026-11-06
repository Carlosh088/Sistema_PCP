# Painel de PCP — Planejamento e Controle da Produção

Aplicação web para cadastrar ordens de produção, organizar filas por máquina e acompanhar a execução do planejamento industrial. O sistema surgiu de uma rotina que dependia de uma planilha Excel para inserir ordens, reordenar prioridades e atualizar as filas de trabalho.

[**Testar demonstração interativa**](https://carlosh088.github.io/Sistema_PCP/)

## O problema

A cada ciclo de planejamento, a equipe precisava inserir informações na planilha, distribuir ordens entre máquinas e reorganizar as filas conforme as prioridades mudavam. O planejamento atualizado servia de referência para quem acompanhava e executava a produção.

O painel reuniu essas tarefas em uma interface que mostra a situação de cada máquina, os itens da fila e o histórico. Também preservou a exportação da programação para uso fora do painel.

## Funcionalidades

- **Cadastro de produção.** Criação de ordens com código, nome do produto, peso total, turno e máquina.
- **Busca de produto por código.** Preenchimento do nome a partir do catálogo disponível no ambiente.
- **Planejamento por máquina.** Visualização da produção em andamento e das próximas ordens, com possibilidade de reordenar e remanejar itens.
- **Estimativa de duração.** Cálculo do tempo previsto a partir do peso total da ordem e da capacidade horária da máquina. Por exemplo, uma ordem de 60 kg em uma máquina configurada para 30 kg/h tem duração estimada de duas horas.
- **Acompanhamento da execução.** Controles para iniciar, pausar, retomar e concluir uma ordem, com consulta ao histórico de produções concluídas.
- **Relatórios.** Exportação da fila em Excel e PDF para consulta e impressão.
- **Simulação acelerada.** Modo que permite observar a evolução do tempo de produção durante a demonstração.

## Tecnologias e arquitetura

| Tecnologia | Papel no projeto |
|---|---|
| **HTML, CSS e JavaScript** | Estruturam as telas e implementam as interações, a gestão das filas, os cálculos de duração e a atualização do painel. |
| **Tailwind CSS** | Complementa o CSS da aplicação na composição da interface, com classes de espaçamento, cores e layout responsivo. |
| **Supabase Auth** | Autentica os usuários no sistema original. A aplicação consulta o perfil para definir os controles disponíveis na interface. |
| **Supabase Database / PostgreSQL** | Persiste o catálogo de produtos, as ordens de produção, o histórico e os registros relacionados às fichas técnicas no sistema original. |
| **Supabase Realtime** | Ajuda a atualizar as filas e o histórico quando os dados de produção são alterados por outra sessão. |
| **xlsx-js-style** | Gera a planilha Excel da programação, com formatação para leitura e impressão. |
| **jsPDF e AutoTable** | Montam o relatório PDF a partir das filas exibidas no painel. |
| **Web App Manifest e Service Worker** | Compõem a estrutura de PWA e permitem guardar em cache os arquivos estáticos selecionados quando a aplicação é hospedada. |

### Como o Supabase entra no fluxo

No sistema original, o navegador autentica o usuário pelo Supabase Auth e consulta seu perfil. A interface usa esse perfil para exibir os controles correspondentes. Quando uma ordem é criada, movida ou concluída, a aplicação atualiza os registros no PostgreSQL por meio do cliente JavaScript do Supabase. A assinatura Realtime ajuda as outras sessões a refletir essas alterações no painel.

```text
Navegador
   ├── Supabase Auth → sessão do usuário
   ├── Supabase Database / PostgreSQL → produtos, ordens e histórico
   └── Supabase Realtime → atualização entre sessões
```

A geração de Excel e PDF acontece no navegador com os dados exibidos na aplicação.

### Como a versão de portfólio funciona

Na demonstração, `demo-data.js` fornece um catálogo fictício e exemplos de produção para cinco máquinas. A interface usa essa camada local para consultar e alterar os dados, então o visitante pode testar o fluxo de cadastro e filas sem criar uma conta. Os dados da sessão ficam no navegador, e **Reiniciar demonstração** restaura os exemplos iniciais.

| | Sistema original | Demonstração de portfólio |
|---|---|---|
| **Acesso** | Autenticação pelo Supabase | Acesso direto pelo navegador |
| **Dados** | PostgreSQL no Supabase | Exemplos fictícios em `demo-data.js` |
| **Atualizações** | Persistência no banco e sincronização entre sessões | Alterações locais à sessão do navegador |
| **Finalidade** | Apoiar o planejamento de produção | Permitir a avaliação da interface e do fluxo de trabalho |

## Hospedagem

A demonstração é publicada no **GitHub Pages**. O serviço entrega os arquivos estáticos da aplicação, e o navegador executa o JavaScript. Os estilos e as bibliotecas de exportação são carregados por CDN, por isso é recomendável estar conectado à internet ao abrir a demonstração.

O GitHub Pages hospeda a versão pública do painel. No ambiente original, o Supabase fornece os serviços de autenticação, banco de dados e sincronização.

## Como testar

1. Abra a [demonstração do PCP](https://carlosh088.github.io/Sistema_PCP/).
2. Clique em **+ Nova Produção**.
3. Use o código fictício `DEMO-001` para consultar um produto.
4. Informe o **peso total do produto**, escolha o turno e selecione a máquina.
5. Cadastre a ordem e experimente reorganizar a fila, iniciar a produção ou exportar a programação.

Para abrir localmente, baixe os arquivos da demonstração, preserve a estrutura de pastas e abra `index.html` no navegador.

## Resultado observado

Na rotina original, o tempo de planejamento passou de cerca de **40 minutos para até 10 minutos por ciclo**. Isso equivale a aproximadamente **30 minutos economizados por ciclo**, ou **75% de redução**. Os valores são estimativas da rotina de uso.

## Minha contribuição

Identifiquei o problema na rotina do PCP, defini os fluxos e as regras do painel com base no processo de produção e conduzi a implementação e a adoção da ferramenta. Usei IA como apoio na geração de código e fiz ajustes durante o desenvolvimento para adequar a solução ao uso da equipe.
