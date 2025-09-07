
class Chapter1 {
    constructor() {
        this.name = 'O Despertar';
        this.totalScenes = 3;
        this.currentPuzzle = null;
        this.currentCharacters = {}; // Para rastrear personagens na tela
    }

    // ====== SISTEMA DE EXIBIÇÃO DE PERSONAGENS ======
    showCharacter(characterName, expression = 'neutral', position = 'center') {
        // Como usar:
        // this.showCharacter('evelly', 'angry', 'left');
        // this.showCharacter('ezra', 'smirk', 'right');
        
        const charactersDiv = document.getElementById('characters');
        
        // Remove personagem anterior se existir
        const existingChar = document.getElementById(`char-${characterName}`);
        if (existingChar) {
            existingChar.remove();
        }
        
        // Cria novo elemento do personagem
        const charElement = document.createElement('div');
        charElement.id = `char-${characterName}`;
        charElement.className = `character character-${position}`;
        
        // ====== ARQUIVOS DE PERSONAGENS ======
        // Suporte para PNG e WEBP
        let imagePath = `./assets/images/characters/${characterName}_${expression}.png`;
        
        // Mapping específico para cada personagem e suas expressões
        if (characterName === 'ezra' || characterName === 'erza') {
            // Mapear expressões da Erza/Ezra
            const erzaExpressionMap = {
                'neutral': 'ErzaSpriteCasual.webp',
                'casual': 'ErzaSpriteCasual.webp',
                'angry': 'ErzaSprite_angry.webp',
                'smirk': 'ErzaSprite_smirk.webp',
                'happy': 'ErzaSprite_happy.webp',
                'sad': 'ErzaSprite_sad.webp',
                'surprised': 'ErzaSprite_surprised.webp',
                'cautious': 'ErzaSpriteCasual.webp', // fallback para casual
                'nervous': 'ErzaSpriteCasual.webp'   // fallback para casual
            };
            
            const spriteFile = erzaExpressionMap[expression] || 'ErzaSpriteCasual.webp';
            imagePath = `./assets/images/characters/${spriteFile}`;
        }
        
        charElement.innerHTML = `
            <img src="${imagePath}" 
                 alt="${characterName}" 
                 class="character-sprite"
                 onerror="this.style.display='none'; console.warn('Imagem não encontrada: ${imagePath}');">
        `;
        
        // Estilos de posicionamento
        this.applyCharacterPosition(charElement, position);
        
        charactersDiv.appendChild(charElement);
        this.currentCharacters[characterName] = charElement;
        
        // Animação de entrada
        charElement.style.opacity = '0';
        charElement.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            charElement.style.transition = 'all 0.5s ease';
            charElement.style.opacity = '1';
            charElement.style.transform = 'translateY(0)';
        }, 100);
    }

    applyCharacterPosition(element, position) {
        // Estilos CSS para posicionamento dos personagens
        element.style.cssText = `
            position: absolute;
            bottom: 30%;
            z-index: 5;
            max-height: 70vh;
        `;
        
        switch(position) {
            case 'left':
                element.style.left = '10%';
                break;
            case 'right':
                element.style.right = '10%';
                break;
            case 'center':
                element.style.left = '50%';
                element.style.transform = 'translateX(-50%)';
                break;
        }
        
        // Estilo da imagem
        const img = element.querySelector('.character-sprite');
        if (img) {
            img.style.cssText = `
                max-height: 100%;
                max-width: 400px;
                object-fit: contain;
                filter: drop-shadow(0 0 20px rgba(0,0,0,0.5));
            `;
        }
    }

    hideCharacter(characterName) {
        // Remove personagem da tela
        const charElement = this.currentCharacters[characterName];
        if (charElement) {
            charElement.style.opacity = '0';
            charElement.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                charElement.remove();
                delete this.currentCharacters[characterName];
            }, 500);
        }
    }

    changeCharacterExpression(characterName, newExpression) {
        // Muda expressão do personagem sem animação de saída/entrada
        const charElement = this.currentCharacters[characterName];
        if (charElement) {
            const img = charElement.querySelector('.character-sprite');
            const newPath = `./assets/images/characters/${characterName}_${newExpression}.png`;
            img.src = newPath;
        }
    }

    // ====== SISTEMA DE MUDANÇA DE FUNDO ======
    changeBackground(backgroundName, transition = 'fade') {
        const background = document.getElementById('background');
        
        // Map background names to actual filenames
        const backgroundMap = {
            'fundocena1': 'fundocena1.jpg',
            'fundocena2': 'fundocena2.avif',
            'fundocena3': 'fundocena3.jpeg',
            'JumpScare1': 'JumpScare1.jpg'
        };
        
        const filename = backgroundMap[backgroundName] || `${backgroundName}.jpg`;
        const imagePath = `assets/images/backgrounds/${filename}`;
        
        if (transition === 'fade') {
            background.style.transition = 'opacity 1s ease';
            background.style.opacity = '0';
            
            setTimeout(() => {
                background.style.backgroundImage = `url(${imagePath})`;
                background.style.backgroundSize = 'cover';
                background.style.backgroundPosition = 'center';
                background.style.opacity = '1';
            }, 500);
        } else {
            background.style.backgroundImage = `url(${imagePath})`;
            background.style.backgroundSize = 'cover';
            background.style.backgroundPosition = 'center';
        }
    }

    async loadChapter() {
        console.log('Carregando Capítulo 1: O Despertar');
        
        // Aplicar configurações visuais do capítulo
        this.applyChapterStyling();
        
        // Começar pela cena inicial
        await this.startScene1();
    }

    applyChapterStyling() {
        const gameScreen = document.getElementById('game-screen');
        gameScreen.classList.add('chapter-1');
        
        // Música ambiente do capítulo
        window.audioManager?.playMusic('hollow_mind_ambient', true);
    }

    // Cena 1: Despertar
    async startScene1() {
        window.gameState.currentScene = 1;
        
        // Fade in da tela preta
        this.fadeFromBlack();
        
        // Narrativa inicial
        setTimeout(() => {
            this.showOpeningNarrative();
        }, 2000);
    }

    fadeFromBlack() {
        const fadeDiv = document.createElement('div');
        fadeDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: black;
            z-index: 9999;
            opacity: 1;
            transition: opacity 3s ease;
        `;
        
        document.body.appendChild(fadeDiv);
        
        setTimeout(() => {
            fadeDiv.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(fadeDiv);
            }, 3000);
        }, 500);
    }

    showOpeningNarrative() {
        const narrativeDialogue = {
            speaker: '',
            text: 'Acordar. O gosto metálico na boca. O som distante de sirenes ecoando pela cidade. E o coração acelerado, como se fosse um compasso que perdeu o ritmo. Você está viva… mas a cidade não é mais a mesma.',
            effects: [
                { type: 'fadeIn', duration: 2000 }
            ]
        };

        window.dialogueSystem.showDialogue(narrativeDialogue);
        
        // Agora espera clique do usuário para continuar
        window.dialogueSystem.setNextAction(() => {
            this.showEnvironmentDescription();
        });
    }

    showEnvironmentDescription() {
        // ====== FUNDO ESPECÍFICO DO CAPÍTULO 1 ======
        const background = document.getElementById('background');
        background.style.backgroundImage = 'url(./assets/images/backgrounds/fundocena1.jpg)';
        background.style.filter = 'contrast(0.8) brightness(0.6)';
        
        // ====== EXEMPLOS DE OUTRAS IMAGENS DE FUNDO ======
        // background.style.backgroundImage = 'url(./assets/images/backgrounds/noxhaven_street.jpg)';
        // background.style.backgroundImage = 'url(./assets/images/backgrounds/laboratory.jpg)';
        // background.style.backgroundImage = 'url(./assets/images/backgrounds/theater_ruins.jpg)';
        
        // Adicionar efeito de luzes piscando
        this.startFlickeringLights();
        
        const environmentDialogue = {
            speaker: '',
            text: 'Evelly desperta em um corredor escuro do Centro de Pesquisa HollowMind. As luzes piscam em intervalos irregulares, lembrando holofotes de um palco. A névoa vermelha se infiltra pelas rachaduras, ondulando como uma plateia invisível.',
            effects: [
                { type: 'flicker', duration: 3000 }
            ]
        };

        window.dialogueSystem.showDialogue(environmentDialogue);
        
        // Espera clique do usuário
        window.dialogueSystem.setNextAction(() => {
            this.showFloorDetails();
        });
    }

    startFlickeringLights() {
        const gameScreen = document.getElementById('game-screen');
        
        setInterval(() => {
            if (Math.random() < 0.3) {
                gameScreen.style.filter = 'brightness(0.3)';
                setTimeout(() => {
                    gameScreen.style.filter = 'brightness(1)';
                }, 100 + Math.random() * 200);
            }
        }, 1000 + Math.random() * 2000);
    }

    showFloorDetails() {
        const detailsDialogue = {
            speaker: '',
            text: 'No chão: cápsulas quebradas, partituras queimadas, rastros de sangue. Na parede: palavras rabiscadas às pressas — "A Sombra observa."',
            effects: [
                { type: 'horror_ambiance' }
            ]
        };

        window.dialogueSystem.showDialogue(detailsDialogue);
        
        // Tocar som de eco assombrado
        window.audioManager?.playSound('distant_whispers');
        
        // Espera clique do usuário
        window.dialogueSystem.setNextAction(() => {
            this.introduceEzra();
        });
    }

    introduceEzra() {
        // Som de passos
        window.audioManager?.playSound('footsteps_echo');
        
        // ====== EZRA COM SPRITE ESPECÍFICO ======
        this.showCharacter('ezra', 'neutral');
        
        // Introdução do Ezra
        const ezraIntroDialogue = {
            speaker: 'Ezra',
            text: 'Olha só… a estrela caída voltou dos mortos. Achei que a névoa já tinha te engolido. Mas pensando bem… palco errado pra morrer, né?',
            effects: [
                { type: 'character_intro', character: 'ezra' }
            ]
        };

        window.dialogueSystem.showDialogue(ezraIntroDialogue);
        
        // Espera clique do usuário
        window.dialogueSystem.setNextAction(() => {
            this.ezraThreat();
        });
    }

    ezraThreat() {
        // Som de arma sendo engatilhada
        window.audioManager?.playSound('gun_cock');
        
        // ====== EXEMPLO: MUDANDO EXPRESSÃO DO PERSONAGEM ======
        // Ezra fica mais agressivo
        this.changeCharacterExpression('ezra', 'angry');
        
        const threatDialogue = {
            speaker: 'Ezra',
            text: 'Tem duas opções, Evelly. Ou me segue, ou eu sigo sozinho. Mas se decidir atrapalhar… vou garantir que os holofotes fiquem todos em você quando a névoa chegar.',
            choices: [
                {
                    text: 'Tente acompanhar meu ritmo se conseguir, Ezra. Não vou deixar você roubar a cena.',
                    type: 'rage',
                    karma: -5,
                    significant: true,
                    consequences: [
                        { type: 'relationship', character: 'ezra', value: -2 },
                        { type: 'flag', flag: 'ezraRivalry', value: (window.gameState?.flags?.ezraRivalry || 0) + 2 }
                    ]
                },
                {
                    text: 'Não temos tempo para brigas. A saída é prioridade, não o espetáculo.',
                    type: 'control',
                    karma: 3,
                    significant: true,
                    consequences: [
                        { type: 'relationship', character: 'ezra', value: 1 },
                        { type: 'flag', flag: 'evellyTrustLevel', value: (window.gameState?.flags?.evellyTrustLevel || 0) + 1 }
                    ]
                },
                {
                    text: 'Se quiser morrer sozinho, faça isso. O palco nunca coube a dois protagonistas mesmo.',
                    type: 'rage',
                    karma: -8,
                    significant: true,
                    consequences: [
                        { type: 'relationship', character: 'ezra', value: -3 },
                        { type: 'flag', flag: 'ezraRivalry', value: (window.gameState?.flags?.ezraRivalry || 0) + 3 }
                    ]
                },
                {
                    text: '[Ficar em silêncio]',
                    type: 'neutral',
                    karma: -2,
                    significant: true,
                    consequences: [
                        { type: 'fear', amount: 2 },
                        { type: 'flag', flag: 'shadowTaunts', value: true }
                    ]
                }
            ]
        };

        window.dialogueSystem.showDialogue(threatDialogue);
        
        // Override do método selectChoice para continuar a história
        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(window.dialogueSystem);
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            const selectedChoice = window.dialogueSystem.currentChoices[choiceIndex];
            
            // Executa a seleção original
            originalSelectChoice(choiceIndex);
            
            // Continua a história baseada na escolha
            setTimeout(() => {
                this.handleChoiceResponse(selectedChoice);
            }, 1000);
            
            // Restaura o método original
            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    handleChoiceResponse(choice) {
        let responseDialogue;
        
        switch(choice.type) {
            case 'rage':
                if (choice.karma === -8) { // Crueldade - terceira opção
                    responseDialogue = {
                        speaker: 'Ezra',
                        text: '*ri friamente* Perfeito. Pelo menos agora sei que você não mudou nada. Vamos ver quem sobrevive a essa apresentação.',
                        effects: [{ type: 'tension_rise' }]
                    };
                } else { // Competitiva - primeira opção
                    responseDialogue = {
                        speaker: 'Ezra',
                        text: '*sorri debochado* Ah, agora sim! A Evelly que eu lembro. Vamos ver se você consegue acompanhar quando a coisa ficar séria.',
                        effects: [{ type: 'rivalry_established' }]
                    };
                }
                break;
                
            case 'control': // Segunda opção
                responseDialogue = {
                    speaker: 'Ezra',
                    text: '*baixa ligeiramente a arma* Hm. Pelo menos você aprendeu a pensar antes de falar. Talvez isso nos mantenha vivos.',
                    effects: [{ type: 'respect_gained' }]
                };
                break;
                
            case 'neutral': // Quarta opção - Silêncio
                // Silêncio - trigger da Sombra
                window.audioManager?.playSound('shadow_whisper');
                this.triggerShadowTaunt();
                return;
        }
        
        // Mostrar resposta do Ezra com um botão para continuar
        responseDialogue.choices = [{
            text: 'Continuar...',
            type: 'neutral'
        }];
        
        window.dialogueSystem.showDialogue(responseDialogue);
        
        // Override temporário para continuar a história após o clique
        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(window.dialogueSystem);
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            // Executa a seleção original
            originalSelectChoice(choiceIndex);
            
            // Continua para o puzzle
            setTimeout(() => {
                this.startRhythmPuzzle();
            }, 1000);
            
            // Restaura o método original
            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    triggerShadowTaunt() {
        const shadowDialogue = {
            speaker: 'A Sombra',
            text: 'Mais uma vez… você não disse nada quando deveria.',
            effects: [
                { type: 'glitch', duration: 2000 },
                { type: 'shake' }
            ],
            choices: [{
                text: '...',
                type: 'neutral'
            }]
        };

        window.dialogueSystem.showDialogue(shadowDialogue);
        
        // Aumentar fear level
        window.gameState.flags.fearLevel += 2;
        
        // Som assombrado
        window.audioManager?.playSound('shadow_laugh');
        
        // Override temporário para continuar após a reação da Sombra
        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(window.dialogueSystem);
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            originalSelectChoice(choiceIndex);
            
            setTimeout(() => {
                this.ezraReactionToShadow();
            }, 1000);
            
            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    ezraReactionToShadow() {
        const ezraReactionDialogue = {
            speaker: 'Ezra',
            text: '*olha ao redor nervoso* Que diabos foi isso? Evelly, nós precisamos sair AGORA!',
            effects: [{ type: 'urgency' }],
            choices: [{
                text: 'Continuar...',
                type: 'neutral'
            }]
        };

        window.dialogueSystem.showDialogue(ezraReactionDialogue);
        
        // Override temporário para ir para o puzzle
        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(window.dialogueSystem);
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            originalSelectChoice(choiceIndex);
            
            setTimeout(() => {
                this.startRhythmPuzzle();
            }, 1000);
            
            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    startRhythmPuzzle() {
        // Descrição do puzzle
        const puzzleIntroDialogue = {
            speaker: '',
            text: 'De repente, as luzes do corredor piscam em padrões rítmicos, lembrando batidas musicais. Uma porta de segurança bloqueia o caminho. É preciso reproduzir o padrão das luzes como se fosse uma partitura quebrada.',
            effects: [{ type: 'puzzle_start' }],
            choices: [{
                text: 'Iniciar puzzle...',
                type: 'neutral'
            }]
        };

        window.dialogueSystem.showDialogue(puzzleIntroDialogue);
        
        // Override temporário para iniciar o puzzle
        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(window.dialogueSystem);
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            originalSelectChoice(choiceIndex);
            
            setTimeout(() => {
                this.initializeRhythmGame();
            }, 500);
            
            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    initializeRhythmGame() {
        // Esconder diálogo
        window.dialogueSystem.hideDialogue();
        
        // Criar interface do puzzle
        this.createRhythmInterface();
        
        // Inicializar o puzzle
        this.rhythmPuzzle = {
            pattern: [1, 3, 2, 4], // Sequência simplificada de luzes (1-4)
            playerInput: [],
            currentStep: 0,
            failures: 0,
            maxFailures: 2, // Reduzido para ser menos frustrante
            isShowingPattern: true
        };
        
        this.showRhythmPattern();
    }

    createRhythmInterface() {
        const puzzleDiv = document.createElement('div');
        puzzleDiv.id = 'rhythm-puzzle';
        puzzleDiv.innerHTML = `
            <div class="puzzle-container">
                <h2>Reproduza o Padrão das Luzes</h2>
                <div class="light-buttons">
                    <button class="light-btn" data-light="1"></button>
                    <button class="light-btn" data-light="2"></button>
                    <button class="light-btn" data-light="3"></button>
                    <button class="light-btn" data-light="4"></button>
                </div>
                <div class="puzzle-info">
                    <p>Falhas: <span id="failure-count">0</span>/2</p>
                    <p id="puzzle-status">Observe o padrão...</p>
                    <button id="skip-puzzle" style="margin-top: 1rem; background: #444; color: #ccc; padding: 0.5rem 1rem; border: 1px solid #666; cursor: pointer;">Pular Puzzle</button>
                </div>
            </div>
        `;
        
        puzzleDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            color: white;
            font-family: 'Orbitron', monospace;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .puzzle-container {
                text-align: center;
                padding: 2rem;
                background: rgba(20, 20, 20, 0.9);
                border: 2px solid #666;
                border-radius: 10px;
            }
            
            .light-buttons {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
                margin: 2rem 0;
            }
            
            .light-btn {
                width: 80px;
                height: 80px;
                background: #333;
                border: 2px solid #666;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .light-btn:hover {
                background: #555;
            }
            
            .light-btn.active {
                background: #ff6666 !important;
                box-shadow: 0 0 20px #ff6666;
                animation: pulse 0.3s ease;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            .puzzle-info {
                margin-top: 1rem;
                font-size: 1.1rem;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(puzzleDiv);
        
        // Bind dos eventos dos botões
        const buttons = puzzleDiv.querySelectorAll('.light-btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (!this.rhythmPuzzle.isShowingPattern) {
                    this.handleLightClick(parseInt(e.target.dataset.light));
                }
            });
        });
        
        // Botão de pular puzzle
        const skipBtn = puzzleDiv.querySelector('#skip-puzzle');
        skipBtn.addEventListener('click', () => {
            document.getElementById('rhythm-puzzle').remove();
            this.finishScene1(true); // Conta como sucesso
        });
    }

    showRhythmPattern() {
        const buttons = document.querySelectorAll('.light-btn');
        const statusEl = document.getElementById('puzzle-status');
        
        statusEl.textContent = 'Observe o padrão...';
        
        let stepIndex = 0;
        const showStep = () => {
            if (stepIndex < this.rhythmPuzzle.pattern.length) {
                const lightIndex = this.rhythmPuzzle.pattern[stepIndex] - 1;
                
                // Acender a luz
                buttons[lightIndex].classList.add('active');
                window.audioManager?.playSound(`light_${this.rhythmPuzzle.pattern[stepIndex]}`);
                
                setTimeout(() => {
                    buttons[lightIndex].classList.remove('active');
                    stepIndex++;
                    
                    setTimeout(showStep, 400);
                }, 600);
            } else {
                // Padrão mostrado, permitir input do jogador
                this.rhythmPuzzle.isShowingPattern = false;
                statusEl.textContent = 'Agora reproduza o padrão!';
            }
        };
        
        setTimeout(showStep, 1000);
    }

    handleLightClick(lightNumber) {
        const buttons = document.querySelectorAll('.light-btn');
        const button = buttons[lightNumber - 1];
        
        // Feedback visual
        button.classList.add('active');
        setTimeout(() => {
            button.classList.remove('active');
        }, 200);
        
        // Som
        window.audioManager?.playSound(`light_${lightNumber}`);
        
        // Verificar se está correto
        if (lightNumber === this.rhythmPuzzle.pattern[this.rhythmPuzzle.currentStep]) {
            this.rhythmPuzzle.currentStep++;
            
            if (this.rhythmPuzzle.currentStep >= this.rhythmPuzzle.pattern.length) {
                // Puzzle resolvido!
                this.solvePuzzleSuccess();
            }
        } else {
            // Erro!
            this.handlePuzzleFailure();
        }
    }

    handlePuzzleFailure() {
        this.rhythmPuzzle.failures++;
        this.rhythmPuzzle.currentStep = 0;
        
        const failureCountEl = document.getElementById('failure-count');
        const statusEl = document.getElementById('puzzle-status');
        
        failureCountEl.textContent = this.rhythmPuzzle.failures;
        
        // JUMPSCARE! Maximum volume horror effect
        window.audioManager?.playJumpscare('extreme');
        
        if (this.rhythmPuzzle.failures >= this.rhythmPuzzle.maxFailures) {
            this.solvePuzzleFailure();
        } else {
            statusEl.textContent = 'Erro! Tente novamente...';
            
            // Mostrar padrão novamente
            setTimeout(() => {
                this.rhythmPuzzle.isShowingPattern = true;
                this.showRhythmPattern();
            }, 1500);
        }
    }

    solvePuzzleSuccess() {
        window.audioManager?.playSound('puzzle_success');
        
        const statusEl = document.getElementById('puzzle-status');
        statusEl.textContent = 'Padrão correto! Porta desbloqueada.';
        
        // Remover interface do puzzle
        setTimeout(() => {
            document.getElementById('rhythm-puzzle').remove();
            this.finishScene1(true);
        }, 2000);
    }

    solvePuzzleFailure() {
        // Remover puzzle imediatamente
        const puzzleElement = document.getElementById('rhythm-puzzle');
        if (puzzleElement) {
            puzzleElement.remove();
        }
        
        // JUMPSCARE IMEDIATO! - Volume máximo para assustar
        window.audioManager?.playJumpscare('extreme');
        this.showJumpScare();
    }

    showJumpScare() {
        // Tocar som de jumpscare no volume MÁXIMO para assustar
        window.audioManager?.playJumpscare('extreme');
        
        // Criar elemento de jumpscare
        const jumpscareDiv = document.createElement('div');
        jumpscareDiv.id = 'jumpscare-screen';
        jumpscareDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-image: url('./assets/images/backgrounds/JumpScare1.jpg');
            background-size: cover;
            background-position: center;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: jumpscareFlash 0.1s ease-in-out 0s 3;
        `;
        
        document.body.appendChild(jumpscareDiv);
        
        // Efeito de shake na tela
        document.body.style.animation = 'shake 0.5s ease-in-out';
        
        // Após 3 segundos, mostrar game over
        setTimeout(() => {
            jumpscareDiv.remove();
            document.body.style.animation = '';
            this.showGameOver();
        }, 3000);
    }

    showGameOver() {
        // Tela de Game Over
        const gameOverDiv = document.createElement('div');
        gameOverDiv.id = 'game-over-screen';
        gameOverDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(45deg, #000000, #330000);
            color: #ff0000;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Nosifer', cursive;
            text-align: center;
        `;
        
        gameOverDiv.innerHTML = `
            <h1 style="font-size: 4rem; margin-bottom: 2rem; text-shadow: 0 0 20px #ff0000;">GAME OVER</h1>
            <p style="font-size: 1.5rem; margin-bottom: 3rem; font-family: 'Orbitron', monospace;">A Sombra te consumiu...</p>
            <button id="restart-game" style="
                background: #660000;
                color: white;
                border: 2px solid #ff0000;
                padding: 1rem 2rem;
                font-size: 1.2rem;
                font-family: 'Orbitron', monospace;
                cursor: pointer;
                transition: all 0.3s ease;
            ">TENTAR NOVAMENTE</button>
        `;
        
        document.body.appendChild(gameOverDiv);
        
        // Evento do botão restart
        document.getElementById('restart-game').addEventListener('click', () => {
            gameOverDiv.remove();
            // Reiniciar o capítulo 1
            window.gameState.currentChapter = 1;
            window.gameState.currentScene = 1;
            if (window.gameController && window.gameController.loadChapter) {
                window.gameController.loadChapter(1);
            } else {
                window.location.reload();
            }
        });
    }

    showShadowFailureDialogue() {
        // Fade para vermelho
        const gameScreen = document.getElementById('game-screen');
        gameScreen.style.filter = 'sepia(100%) hue-rotate(-50deg) saturate(200%)';
        
        const shadowFailureDialogue = {
            speaker: 'A Sombra',
            text: 'Evelly… perdeu o compasso de novo… como antes. Você nunca aprendeu a seguir o ritmo, não é?',
            effects: [
                { type: 'glitch', duration: 3000 },
                { type: 'shake' },
                { type: 'jumpscare', intensity: 'medium' }
            ],
            choices: [
                {
                    text: 'Continuar...',
                    type: 'neutral'
                }
            ]
        };

        window.dialogueSystem.showDialogue(shadowFailureDialogue);
        
        // Perder munição como punição
        if (window.gameState) {
            window.gameState.useAmmo(3);
            window.gameState.flags.fearLevel += 3;
        }
        
        // Override para continuar após o diálogo
        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(window.dialogueSystem);
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            originalSelectChoice(choiceIndex);
            
            setTimeout(() => {
                // Restaurar filtro
                gameScreen.style.filter = '';
                this.finishScene1(false);
            }, 1000);
            
            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    finishScene1(success) {
        let finalDialogue;
        
        if (success) {
            // Baseado na relação com Ezra
            if (window.gameState.flags.ezraRivalry > 2) {
                finalDialogue = {
                    speaker: 'Ezra',
                    text: '*irritado* Que sorte a sua. Mas não pense que isso muda alguma coisa entre nós.',
                    effects: [{ type: 'tension_maintained' }]
                };
            } else {
                finalDialogue = {
                    speaker: 'Ezra',
                    text: 'Hm. Não foi mal. Talvez você ainda tenha alguma utilidade.',
                    effects: [{ type: 'grudging_respect' }]
                };
            }
        } else {
            finalDialogue = {
                speaker: 'Ezra',
                text: '*balança a cabeça* Sempre a mesma coisa com você, Evelly. Vamos embora antes que seja tarde demais.',
                effects: [{ type: 'disappointment' }]
            };
        }

        window.dialogueSystem.showDialogue(finalDialogue);
        
        setTimeout(() => {
            this.transitionToScene2();
        }, 4000);
    }

    transitionToScene2() {
        const transitionDialogue = {
            speaker: '',
            text: 'A cena termina quando ambos atravessam a porta e entram no setor principal do HollowMind. O som dos aplausos distorcidos desaparece, e dá lugar ao silêncio opressor da instalação.',
            effects: [{ type: 'fadeToBlack', duration: 3000 }]
        };

        window.dialogueSystem.showDialogue(transitionDialogue);
        
        // Auto-save no final da cena
        setTimeout(() => {
            window.gameState.progressToNextScene();
            window.saveSystem.autoSave();
            
            // Por enquanto, mostrar mensagem de continuação
            setTimeout(() => {
                this.showContinuationMessage();
            }, 3000);
        }, 6000);
    }

    showContinuationMessage() {
        const continuationDialogue = {
            speaker: '',
            text: 'Capítulo 1 completo! A história continua...',
            effects: [{ type: 'fadeToBlack', duration: 2000 }]
        };

        window.dialogueSystem.showDialogue(continuationDialogue);
        
        // Transição automática para o Capítulo 2
        setTimeout(() => {
            window.dialogueSystem.hideDialogue();
            
            // Atualizar estado do jogo para o capítulo 2
            window.gameState.currentChapter = 2;
            window.gameState.currentScene = 1;
            
            // Salvar progresso antes de carregar o próximo capítulo
            window.saveSystem.autoSave();
            
            // Carregar Capítulo 2
            setTimeout(() => {
                if (window.gameController && window.gameController.loadChapter) {
                    window.gameController.loadChapter(2);
                } else {
                    // Fallback: tentar inicializar o Capítulo 2 diretamente
                    if (window.Chapter2) {
                        const chapter2 = new window.Chapter2();
                        chapter2.startChapter();
                    } else {
                        console.error('Capítulo 2 não encontrado! Voltando ao menu...');
                        window.menuSystem?.showScreen('main-menu');
                    }
                }
            }, 1000);
        }, 4000);
    }
}

// Exportar para uso global
window.Chapter1 = Chapter1;
