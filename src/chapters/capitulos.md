
# Estrutura dos Capítulos - Evelly Adventure

Este diretório conterá os módulos de cada capítulo da visual novel.

## Estrutura de Capítulo

Cada capítulo deve seguir esta estrutura:

```
src/chapters/
├── chapter1.js          # Módulo principal do capítulo
├── chapter1/
│   ├── scenes/         # Cenas individuais
│   │   ├── scene1.js
│   │   ├── scene2.js
│   │   └── ...
│   ├── puzzles/        # Puzzles específicos do capítulo
│   ├── combat/         # Sequências de combate
│   ├── data/          # Dados do capítulo (diálogos, choices, etc.)
│   │   ├── dialogues.json
│   │   ├── characters.json
│   │   └── endings.json
│   └── assets/        # Assets específicos do capítulo
│       ├── backgrounds/
│       ├── characters/
│       └── sounds/
```

## Sistema de Roteamento

Cada capítulo deve implementar:

1. **Múltiplos Finais**: Mínimo 5 finais por capítulo
   - 2 permitem continuar para o próximo capítulo
   - 3 resultam em morte/fim de jogo

2. **Sistema de Karma**: Escolhas que afetam:
   - Diálogos subsequentes
   - Disponibilidade de rotas
   - Forma da Sombra
   - Sobrevivência de personagens

3. **Rotas Principais**:
   - **Rota da Raiva**: Escolhas agressivas, confrontacionais
   - **Rota do Controle**: Escolhas lógicas, calculadas  
   - **Rota da Redenção**: Escolhas empáticas, de aceitação

## Mecânicas por Capítulo

### Capítulo 1: "O Despertar"
- Introdução aos controles
- Primeiro encontro com a Sombra
- Estabelecimento do sistema de karma
- Tutorial de combate básico

### Capítulo 2: "Nas Profundezas" 
- Puzzles psicológicos complexos
- Desenvolvimento da rivalidade com Ezra
- Primeiros flashbacks traumáticos

### Capítulo 3: "A Névoa Vermelha"
- Combate intenso com criaturas da névoa
- Puzzles que se adaptam às escolhas anteriores
- Múltiplas rotas começam a divergir significativamente

### Capítulo 4: "Ecos do Passado"
- Sequências de flashback jogáveis
- Confrontos psicológicos com trauma
- Decisões que determinam quem sobrevive

### Capítulo 5: "O Confronto Final"
- Boss fight com a Sombra
- Múltiplos finais baseados em todas as escolhas anteriores
- Resolução do arco narrativo de Evelly

## Implementação

Quando implementar um capítulo:

1. Crie o arquivo `chapterX.js` principal
2. Defina todas as cenas no módulo
3. Implemente o sistema de escolhas com consequências
4. Adicione puzzles e sequências de combate
5. Configure os finais múltiplos
6. Teste todas as rotas possíveis

## Exemplo de Estrutura de Cena

```javascript
const scene1 = {
    id: 'ch1_scene1',
    background: 'noxhaven_street_night',
    music: 'ambient_tension',
    characters: ['evelly'],
    
    dialogue: {
        speaker: 'Evelly',
        text: 'As ruas estão diferentes... há algo errado no ar.',
        
        choices: [
            {
                text: 'Investigar o som estranho',
                type: 'control',
                karma: 5,
                consequences: [{type: 'flag', flag: 'investigated_sound', value: true}],
                nextScene: 'ch1_scene2a'
            },
            {
                text: 'Gritar para chamar atenção',
                type: 'rage', 
                karma: -5,
                consequences: [{type: 'flag', flag: 'made_noise', value: true}],
                nextScene: 'ch1_scene2b'
            }
        ]
    }
};
```
