
class Chapter2 {
    constructor() {
        this.name = 'O Setor das Vozes';
        this.totalScenes = 3;
        this.currentPuzzle = null;
        this.currentCharacters = {};
        this.voicePuzzle = {
            correctSequence: ['4', '7', '2', '9'], // Senha do painel
            playerInput: [],
            currentStep: 0,
            failures: 0,
            maxFailures: 2,
            isListening: false,
            voiceClues: [
                { audio: 'voice_four', text: 'Quatro... sempre quatro...', digit: '4' },
                { audio: 'voice_seven', text: 'Sete lágrimas caíram...', digit: '7' },
                { audio: 'voice_two', text: 'Dois corações batendo...', digit: '2' },
                { audio: 'voice_nine', text: 'Nove aplausos ecoando...', digit: '9' }
            ]
        };
        this.shadowEncounter = {
            isActive: false,
            health: 3, // Número de tiros para atrasar
            position: 0, // Distância da Sombra
            maxDistance: 10
        };
    }

    // ====== SISTEMA DE EXIBIÇÃO DE PERSONAGENS ======
    showCharacter(characterName, expression = 'neutral', position = 'center') {
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
        
        let imagePath = `assets/images/characters/${characterName}_${expression}.png`;
        
        charElement.innerHTML = `
            <img src="${imagePath}" 
                 alt="${characterName}" 
                 class="character-sprite"
                 onerror="this.style.display='none'; console.warn('Imagem não encontrada: ${imagePath}');">
        `;
        
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
        const charElement = this.currentCharacters[characterName];
        if (charElement) {
            const img = charElement.querySelector('.character-sprite');
            const newPath = `assets/images/characters/${characterName}_${newExpression}.png`;
            img.src = newPath;
        }
    }

    // ====== SISTEMA DE MUDANÇA DE FUNDO ======
    changeBackground(backgroundName, transition = 'fade') {
        const background = document.getElementById('background');
        const imagePath = `assets/images/backgrounds/${backgroundName}.jpg`;
        
        if (transition === 'fade') {
            background.style.transition = 'opacity 1s ease';
            background.style.opacity = '0';
            
            setTimeout(() => {
                background.style.backgroundImage = `url(${imagePath})`;
                background.style.opacity = '1';
            }, 500);
        } else {
            background.style.backgroundImage = `url(${imagePath})`;
        }
    }

    async loadChapter() {
        console.log('Carregando Capítulo 2: O Setor das Vozes');
        
        this.applyChapterStyling();
        await this.startScene1();
    }

    applyChapterStyling() {
        const gameScreen = document.getElementById('game-screen');
        gameScreen.classList.remove('chapter-1');
        gameScreen.classList.add('chapter-2');
        
        // Música ambiente mais tensa
        window.audioManager?.playMusic('voice_sector_ambient', true);
    }

    // ====== CENA 1: ENTRADA NO SETOR DAS VOZES ======
    async startScene1() {
        window.gameState.currentScene = 1;
        
        this.fadeFromBlack();
        
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
            text: 'A porta se fecha atrás de vocês com um estalo metálico. O silêncio toma conta… mas não é silêncio completo. Há algo escondido nele. Como se o próprio ar sussurrasse seu nome.',
            effects: [
                { type: 'fadeIn', duration: 2000 }
            ]
        };

        window.dialogueSystem.showDialogue(narrativeDialogue);
        
        setTimeout(() => {
            this.showSectorDescription();
        }, 6000);
    }

    showSectorDescription() {
        // Fundo do Setor das Vozes
        this.changeBackground('voice_sector_corridor');
        this.startFlickeringLights();
        this.startWaterReflectionEffect();
        
        const sectorDialogue = {
            speaker: '',
            text: 'Vocês entram no Setor das Vozes — corredores estreitos, com caixas de som quebradas nas paredes, rangendo estática. As luzes piscam em intervalos irregulares, como um coração enfermo. O chão está alagado, refletindo imagens distorcidas.',
            effects: [
                { type: 'ambient_static' }
            ]
        };

        window.dialogueSystem.showDialogue(sectorDialogue);
        
        setTimeout(() => {
            this.showMicrophonesDetail();
        }, 7000);
    }

    startFlickeringLights() {
        const gameScreen = document.getElementById('game-screen');
        
        this.flickerInterval = setInterval(() => {
            if (Math.random() < 0.4) {
                gameScreen.style.filter = 'brightness(0.2)';
                setTimeout(() => {
                    gameScreen.style.filter = 'brightness(1)';
                }, 50 + Math.random() * 150);
            }
        }, 800 + Math.random() * 1200);
    }

    startWaterReflectionEffect() {
        const gameScreen = document.getElementById('game-screen');
        const reflection = document.createElement('div');
        reflection.className = 'water-reflection';
        reflection.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 30%;
            background: linear-gradient(to top, rgba(100, 150, 200, 0.1) 0%, transparent 100%);
            animation: waterRipple 3s ease-in-out infinite;
            pointer-events: none;
            z-index: 3;
        `;
        
        gameScreen.appendChild(reflection);
        
        // CSS para animação da água
        const waterCSS = `
            @keyframes waterRipple {
                0%, 100% { transform: scaleY(1) scaleX(1); }
                50% { transform: scaleY(0.95) scaleX(1.02); }
            }
        `;
        
        if (!document.getElementById('water-effects-css')) {
            const style = document.createElement('style');
            style.id = 'water-effects-css';
            style.textContent = waterCSS;
            document.head.appendChild(style);
        }
    }

    showMicrophonesDetail() {
        const micDetailDialogue = {
            speaker: '',
            text: 'Pendurados em fios soltos, há microfones quebrados. Alguns balançam sozinhos, mesmo sem vento. O ar parece denso, carregado de memórias não ditas.',
            effects: [
                { type: 'creaking_sounds' }
            ]
        };

        window.dialogueSystem.showDialogue(micDetailDialogue);
        
        // Som de microfones balançando
        window.audioManager?.playSound('creaking_microphones');
        
        setTimeout(() => {
            this.introduceEzraReaction();
        }, 5000);
    }

    introduceEzraReaction() {
        // Mostrar Ezra desconfortável
        this.showCharacter('ezra', 'uncomfortable', 'right');
        
        const ezraDialogue = {
            speaker: 'Ezra',
            text: 'Droga… que lugar é esse? Parece uma sala de ensaio esquecida. Se começarem a tocar música aqui, juro que vou atirar no primeiro alto-falante que ver.',
            effects: [
                { type: 'tension_building' }
            ]
        };

        window.dialogueSystem.showDialogue(ezraDialogue);
        
        setTimeout(() => {
            this.triggerFirstVoices();
        }, 4000);
    }

    triggerFirstVoices() {
        // Som de estática aumentando
        window.audioManager?.playSound('static_buildup');
        
        // Efeito visual de distorção
        const gameScreen = document.getElementById('game-screen');
        gameScreen.style.filter = 'contrast(1.2) saturate(0.8)';
        
        const voiceDialogue = {
            speaker: 'Sussurros nas paredes',
            text: 'Evelly… Evelly… você… errou… perdeu o compasso… todos te viram…',
            effects: [
                { type: 'voice_distortion' },
                { type: 'shake' }
            ]
        };

        window.dialogueSystem.showDialogue(voiceDialogue);
        
        // Restaurar filtro após o diálogo
        setTimeout(() => {
            gameScreen.style.filter = '';
        }, 3000);
        
        setTimeout(() => {
            this.ezraReactionToVoices();
        }, 5000);
    }

    ezraReactionToVoices() {
        // Ezra fica mais tenso
        this.changeCharacterExpression('ezra', 'nervous');
        
        const ezraQuestionDialogue = {
            speaker: 'Ezra',
            text: 'Você ouviu isso também… ou a névoa já começou a brincar com a minha cabeça?',
            choices: [
                {
                    text: 'Não ouvi nada. Está ficando paranoico.',
                    type: 'rage',
                    karma: -3,
                    significant: true,
                    consequences: [
                        { type: 'relationship', character: 'ezra', value: -2 },
                        { type: 'flag', flag: 'ezraDistrust', value: (window.gameState?.flags?.ezraDistrust || 0) + 1 }
                    ]
                },
                {
                    text: 'Sim… eu ouvi. E não gostei.',
                    type: 'control',
                    karma: 2,
                    significant: true,
                    consequences: [
                        { type: 'relationship', character: 'ezra', value: 1 },
                        { type: 'flag', flag: 'evellyHonesty', value: (window.gameState?.flags?.evellyHonesty || 0) + 1 }
                    ]
                },
                {
                    text: 'Não importa o que ouvimos. O importante é sair daqui.',
                    type: 'control',
                    karma: 1,
                    significant: true,
                    consequences: [
                        { type: 'relationship', character: 'ezra', value: 0 },
                        { type: 'flag', flag: 'evellyFocus', value: (window.gameState?.flags?.evellyFocus || 0) + 1 }
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

        window.dialogueSystem.showDialogue(ezraQuestionDialogue);
        
        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(window.dialogueSystem);
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            const selectedChoice = window.dialogueSystem.currentChoices[choiceIndex];
            originalSelectChoice(choiceIndex);
            
            setTimeout(() => {
                this.handleEzraResponseChoice(selectedChoice);
            }, 1000);
            
            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    handleEzraResponseChoice(choice) {
        let responseDialogue;
        
        switch(choice.type) {
            case 'rage': // Negar
                responseDialogue = {
                    speaker: 'Ezra',
                    text: '*olha desconfiado* Claro… você sempre foi boa em mentir quando convinha. Vamos logo.',
                    effects: [{ type: 'trust_decreased' }]
                };
                break;
                
            case 'control':
                if (choice.karma === 2) { // Admitir
                    responseDialogue = {
                        speaker: 'Ezra',
                        text: '*suspira aliviado* Pelo menos você não está tentando me enganar. Isso significa que não estou louco… ainda.',
                        effects: [{ type: 'trust_increased' }]
                    };
                } else { // Desviar
                    responseDialogue = {
                        speaker: 'Ezra',
                        text: '*balança a cabeça* Sempre pragmática. Talvez você esteja certa, mas isso não torna as coisas menos perturbadoras.',
                        effects: [{ type: 'respect_maintained' }]
                    };
                }
                break;
                
            case 'neutral': // Silêncio
                this.triggerShadowTaunt();
                return;
        }
        
        responseDialogue.choices = [{
            text: 'Continuar...',
            type: 'neutral'
        }];
        
        window.dialogueSystem.showDialogue(responseDialogue);
        
        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(window.dialogueSystem);
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            originalSelectChoice(choiceIndex);
            
            setTimeout(() => {
                this.triggerTerrorEvent();
            }, 1000);
            
            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    triggerShadowTaunt() {
        const shadowDialogue = {
            speaker: 'A Sombra',
            text: 'Você se calou de novo… como sempre… O silêncio foi sua perdição antes, será de novo.',
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
        
        window.gameState.flags.fearLevel += 2;
        window.audioManager?.playSound('shadow_whisper_intense');
        
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
        this.changeCharacterExpression('ezra', 'terrified');
        
        const ezraFearDialogue = {
            speaker: 'Ezra',
            text: '*olha ao redor nervoso* Que diabos foi isso?! Evelly, nós precisamos sair AGORA!',
            effects: [{ type: 'urgency' }],
            choices: [{
                text: 'Continuar...',
                type: 'neutral'
            }]
        };

        window.dialogueSystem.showDialogue(ezraFearDialogue);
        
        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(window.dialogueSystem);
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            originalSelectChoice(choiceIndex);
            
            setTimeout(() => {
                this.triggerTerrorEvent();
            }, 1000);
            
            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    // ====== EVENTO DE TERROR ======
    triggerTerrorEvent() {
        window.audioManager?.playSound('applause_distorted');
        
        // Apagar luzes por alguns segundos
        const gameScreen = document.getElementById('game-screen');
        gameScreen.style.transition = 'filter 0.5s ease';
        gameScreen.style.filter = 'brightness(0.1)';
        
        // Mostrar reflexos assombrados na água
        this.showSpectralReflections();
        
        const terrorDialogue = {
            speaker: '',
            text: 'De repente, os microfones quebrados começam a transmitir aplausos distorcidos, misturados a gritos de dor. As luzes apagam. No reflexo da água, Evelly vê silhuetas de plateia batendo palmas — mas quando olha para cima, não há ninguém.',
            effects: [
                { type: 'jumpscare', intensity: 'medium' },
                { type: 'audio_distortion' }
            ]
        };

        window.dialogueSystem.showDialogue(terrorDialogue);
        
        setTimeout(() => {
            // Restaurar luzes
            gameScreen.style.filter = 'brightness(1)';
            this.ezraShootsAtShadow();
        }, 4000);
    }

    showSpectralReflections() {
        const gameScreen = document.getElementById('game-screen');
        const spectralDiv = document.createElement('div');
        spectralDiv.className = 'spectral-reflections';
        spectralDiv.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 30%;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30"><g opacity="0.3"><rect x="10" y="15" width="2" height="10" fill="white"/><rect x="20" y="12" width="2" height="15" fill="white"/><rect x="30" y="18" width="2" height="8" fill="white"/><rect x="40" y="10" width="2" height="18" fill="white"/><rect x="50" y="16" width="2" height="12" fill="white"/><rect x="60" y="14" width="2" height="14" fill="white"/><rect x="70" y="20" width="2" height="6" fill="white"/><rect x="80" y="13" width="2" height="16" fill="white"/></g></svg>') repeat-x;
            animation: spectralFlicker 2s ease-in-out infinite;
            z-index: 4;
            pointer-events: none;
        `;
        
        gameScreen.appendChild(spectralDiv);
        
        // Remover após o evento
        setTimeout(() => {
            if (spectralDiv.parentNode) {
                spectralDiv.remove();
            }
        }, 8000);
        
        // CSS para animação espectral
        const spectralCSS = `
            @keyframes spectralFlicker {
                0%, 100% { opacity: 0.1; }
                25% { opacity: 0.4; }
                50% { opacity: 0.2; }
                75% { opacity: 0.6; }
            }
        `;
        
        if (!document.getElementById('spectral-effects-css')) {
            const style = document.createElement('style');
            style.id = 'spectral-effects-css';
            style.textContent = spectralCSS;
            document.head.appendChild(style);
        }
    }

    ezraShootsAtShadow() {
        // Som de tiro
        window.audioManager?.playSound('gunshot_echo');
        
        // Efeito visual de flash do tiro
        const gameScreen = document.getElementById('game-screen');
        gameScreen.style.filter = 'brightness(3)';
        setTimeout(() => {
            gameScreen.style.filter = 'brightness(1)';
        }, 100);
        
        const ezraShootDialogue = {
            speaker: 'Ezra',
            text: '*dispara contra uma sombra, mas a bala só ricocheteia na parede* Não são reais… certo? CERTO!?',
            effects: [
                { type: 'muzzle_flash' },
                { type: 'echo_effect' }
            ]
        };

        window.dialogueSystem.showDialogue(ezraShootDialogue);
        
        setTimeout(() => {
            this.transitionToVoicePuzzle();
        }, 4000);
    }

    // ====== PUZZLE DO SETOR DAS VOZES ======
    transitionToVoicePuzzle() {
        const puzzleIntroDialogue = {
            speaker: '',
            text: 'No final do corredor, uma porta blindada com um painel quebrado. O sistema pede uma senha, mas as telas estão cobertas de estática. Você precisa filtrar as vozes que ecoam nos alto-falantes para descobrir os dígitos corretos.',
            effects: [{ type: 'puzzle_transition' }],
            choices: [{
                text: 'Iniciar puzzle das vozes...',
                type: 'neutral'
            }]
        };

        window.dialogueSystem.showDialogue(puzzleIntroDialogue);
        
        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(window.dialogueSystem);
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            originalSelectChoice(choiceIndex);
            
            setTimeout(() => {
                this.initializeVoicePuzzle();
            }, 500);
            
            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    initializeVoicePuzzle() {
        window.dialogueSystem.hideDialogue();
        this.createVoicePuzzleInterface();
        this.startVoicePuzzle();
    }

    createVoicePuzzleInterface() {
        const puzzleDiv = document.createElement('div');
        puzzleDiv.id = 'voice-puzzle';
        puzzleDiv.innerHTML = `
            <div class="puzzle-container">
                <h2>Decodifique a Senha das Vozes</h2>
                <div class="door-panel">
                    <div class="password-display">
                        <span class="digit" id="digit-0">?</span>
                        <span class="digit" id="digit-1">?</span>
                        <span class="digit" id="digit-2">?</span>
                        <span class="digit" id="digit-3">?</span>
                    </div>
                </div>
                <div class="voice-controls">
                    <button id="listen-voices" class="listen-btn">🎧 Escutar Vozes</button>
                    <div class="number-pad">
                        ${[1,2,3,4,5,6,7,8,9,0].map(num => 
                            `<button class="number-btn" data-number="${num}">${num}</button>`
                        ).join('')}
                    </div>
                    <button id="clear-input" class="control-btn">Limpar</button>
                    <button id="submit-password" class="control-btn">Confirmar</button>
                </div>
                <div class="puzzle-info">
                    <p>Falhas: <span id="failure-count">0</span>/2</p>
                    <p id="puzzle-status">Escute as vozes para descobrir a senha...</p>
                    <button id="skip-voice-puzzle" style="margin-top: 1rem; background: #444; color: #ccc; padding: 0.5rem 1rem; border: 1px solid #666; cursor: pointer;">Pular Puzzle</button>
                </div>
            </div>
        `;
        
        puzzleDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.95);
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
                background: rgba(20, 20, 20, 0.95);
                border: 2px solid #666;
                border-radius: 10px;
                max-width: 600px;
                width: 90%;
            }
            
            .door-panel {
                background: #222;
                border: 3px solid #444;
                padding: 1rem;
                margin: 1rem 0;
                border-radius: 8px;
            }
            
            .password-display {
                display: flex;
                justify-content: center;
                gap: 1rem;
                margin: 1rem 0;
            }
            
            .digit {
                display: inline-block;
                width: 60px;
                height: 60px;
                line-height: 60px;
                background: #333;
                border: 2px solid #666;
                border-radius: 8px;
                font-size: 2rem;
                font-weight: bold;
                color: #ff6666;
                text-align: center;
            }
            
            .digit.filled {
                background: #444;
                border-color: #ff6666;
                box-shadow: 0 0 10px rgba(255, 102, 102, 0.3);
            }
            
            .voice-controls {
                margin: 2rem 0;
            }
            
            .listen-btn {
                background: #0066ff;
                color: white;
                border: none;
                padding: 1rem 2rem;
                border-radius: 8px;
                font-size: 1.1rem;
                cursor: pointer;
                margin-bottom: 1rem;
                transition: background 0.3s ease;
            }
            
            .listen-btn:hover {
                background: #0088ff;
            }
            
            .listen-btn:disabled {
                background: #666;
                cursor: not-allowed;
            }
            
            .number-pad {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 0.5rem;
                margin: 1rem 0;
                max-width: 300px;
                margin-left: auto;
                margin-right: auto;
            }
            
            .number-btn {
                width: 50px;
                height: 50px;
                background: #333;
                border: 2px solid #666;
                color: white;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1.2rem;
                transition: all 0.2s ease;
            }
            
            .number-btn:hover {
                background: #555;
                border-color: #888;
            }
            
            .control-btn {
                background: #666;
                color: white;
                border: none;
                padding: 0.8rem 1.5rem;
                border-radius: 6px;
                cursor: pointer;
                margin: 0 0.5rem;
                transition: background 0.3s ease;
            }
            
            .control-btn:hover {
                background: #888;
            }
            
            .puzzle-info {
                margin-top: 1rem;
                font-size: 1rem;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(puzzleDiv);
        
        this.bindVoicePuzzleEvents();
    }

    bindVoicePuzzleEvents() {
        const listenBtn = document.getElementById('listen-voices');
        const numberBtns = document.querySelectorAll('.number-btn');
        const clearBtn = document.getElementById('clear-input');
        const submitBtn = document.getElementById('submit-password');
        const skipBtn = document.getElementById('skip-voice-puzzle');
        
        listenBtn.addEventListener('click', () => {
            this.playVoiceClues();
        });
        
        numberBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.addDigitToPassword(e.target.dataset.number);
            });
        });
        
        clearBtn.addEventListener('click', () => {
            this.clearPasswordInput();
        });
        
        submitBtn.addEventListener('click', () => {
            this.submitPassword();
        });
        
        skipBtn.addEventListener('click', () => {
            document.getElementById('voice-puzzle').remove();
            this.finishVoicePuzzle(true);
        });
    }

    startVoicePuzzle() {
        // Tocar vozes automaticamente uma vez
        setTimeout(() => {
            this.playVoiceClues();
        }, 1000);
    }

    playVoiceClues() {
        const listenBtn = document.getElementById('listen-voices');
        const statusEl = document.getElementById('puzzle-status');
        
        listenBtn.disabled = true;
        statusEl.textContent = 'Escutando as vozes...';
        
        let clueIndex = 0;
        const playNextClue = () => {
            if (clueIndex < this.voicePuzzle.voiceClues.length) {
                const clue = this.voicePuzzle.voiceClues[clueIndex];
                
                // Tocar efeito de estática antes da voz
                window.audioManager?.playSound('static_burst');
                
                setTimeout(() => {
                    // Simular voz distorcida
                    this.playDistortedVoice(clue.text);
                    
                    clueIndex++;
                    setTimeout(playNextClue, 3000);
                }, 500);
            } else {
                statusEl.textContent = 'Digite a senha de 4 dígitos...';
                listenBtn.disabled = false;
            }
        };
        
        playNextClue();
    }

    playDistortedVoice(text) {
        // Mostrar o texto brevemente para dar dica
        const statusEl = document.getElementById('puzzle-status');
        const originalText = statusEl.textContent;
        
        statusEl.textContent = `"${text}"`;
        statusEl.style.color = '#ff6666';
        statusEl.style.animation = 'glitch 0.5s ease-in-out';
        
        // Tocar som de voz distorcida
        window.audioManager?.playSound('voice_whisper');
        
        setTimeout(() => {
            statusEl.textContent = originalText;
            statusEl.style.color = 'white';
            statusEl.style.animation = '';
        }, 2000);
    }

    addDigitToPassword(digit) {
        if (this.voicePuzzle.playerInput.length < 4) {
            this.voicePuzzle.playerInput.push(digit);
            
            const digitEl = document.getElementById(`digit-${this.voicePuzzle.playerInput.length - 1}`);
            digitEl.textContent = digit;
            digitEl.classList.add('filled');
            
            // Som de input
            window.audioManager?.playSound('beep');
        }
    }

    clearPasswordInput() {
        this.voicePuzzle.playerInput = [];
        
        for (let i = 0; i < 4; i++) {
            const digitEl = document.getElementById(`digit-${i}`);
            digitEl.textContent = '?';
            digitEl.classList.remove('filled');
        }
        
        window.audioManager?.playSound('clear_input');
    }

    submitPassword() {
        if (this.voicePuzzle.playerInput.length !== 4) {
            document.getElementById('puzzle-status').textContent = 'Digite os 4 dígitos da senha!';
            return;
        }
        
        const password = this.voicePuzzle.playerInput.join('');
        const correctPassword = this.voicePuzzle.correctSequence.join('');
        
        if (password === correctPassword) {
            this.solveVoicePuzzleSuccess();
        } else {
            this.handleVoicePuzzleFailure();
        }
    }

    handleVoicePuzzleFailure() {
        this.voicePuzzle.failures++;
        this.clearPasswordInput();
        
        const failureCountEl = document.getElementById('failure-count');
        const statusEl = document.getElementById('puzzle-status');
        
        failureCountEl.textContent = this.voicePuzzle.failures;
        
        window.audioManager?.playSound('error_buzz');
        
        // Efeito visual de erro
        const puzzleContainer = document.querySelector('.puzzle-container');
        puzzleContainer.style.background = 'rgba(100, 0, 0, 0.9)';
        puzzleContainer.style.animation = 'shake 0.5s ease-in-out';
        
        if (this.voicePuzzle.failures >= this.voicePuzzle.maxFailures) {
            statusEl.textContent = 'Falhas demais! A Sombra está chegando...';
            
            setTimeout(() => {
                document.getElementById('voice-puzzle').remove();
                this.triggerShadowEncounter();
            }, 2000);
        } else {
            statusEl.textContent = 'Senha incorreta! Escute as vozes novamente...';
            
            setTimeout(() => {
                puzzleContainer.style.background = 'rgba(20, 20, 20, 0.95)';
                puzzleContainer.style.animation = '';
            }, 1000);
        }
    }

    solveVoicePuzzleSuccess() {
        window.audioManager?.playSound('access_granted');
        
        const statusEl = document.getElementById('puzzle-status');
        statusEl.textContent = 'Acesso liberado! Porta desbloqueada.';
        
        // Efeito visual de sucesso
        const puzzleContainer = document.querySelector('.puzzle-container');
        puzzleContainer.style.background = 'rgba(0, 100, 0, 0.9)';
        
        setTimeout(() => {
            document.getElementById('voice-puzzle').remove();
            this.finishVoicePuzzle(true);
        }, 2000);
    }

    finishVoicePuzzle(success) {
        if (success) {
            const successDialogue = {
                speaker: '',
                text: 'A porta blindada se abre com um clique satisfatório. O corredor à frente parece ainda mais escuro, mas pelo menos vocês podem prosseguir.',
                effects: [{ type: 'door_opening' }]
            };

            window.dialogueSystem.showDialogue(successDialogue);
            
            setTimeout(() => {
                this.transitionToTheaterRoom();
            }, 4000);
        }
    }

    // ====== PRIMEIRA APARIÇÃO FÍSICA DA SOMBRA ======
    triggerShadowEncounter() {
        this.shadowEncounter.isActive = true;
        
        // Música de tensão extrema
        window.audioManager?.playMusic('shadow_chase', false);
        
        const shadowAppearDialogue = {
            speaker: '',
            text: 'A estática se intensifica até se tornar ensurdecedora. Do fim do corredor, uma figura alta e deformada emerge das sombras. Seus braços são longos demais, e seu rosto muda entre máscaras teatrais quebradas — riso, choro, raiva.',
            effects: [
                { type: 'jumpscare', intensity: 'extreme' },
                { type: 'screen_distortion' }
            ]
        };

        window.dialogueSystem.showDialogue(shadowAppearDialogue);
        
        setTimeout(() => {
            this.startShadowCombat();
        }, 5000);
    }

    startShadowCombat() {
        window.dialogueSystem.hideDialogue();
        this.createShadowCombatInterface();
        this.shadowEncounter.position = 10; // Sombra começa longe
        this.updateShadowPosition();
        this.startShadowAdvance();
    }

    createShadowCombatInterface() {
        const combatDiv = document.createElement('div');
        combatDiv.id = 'shadow-combat';
        combatDiv.innerHTML = `
            <div class="combat-container">
                <div class="shadow-distance">
                    <h2>A Sombra se aproxima!</h2>
                    <div class="distance-bar">
                        <div class="distance-fill" id="shadow-distance-fill"></div>
                        <span class="distance-text" id="distance-text">Distância: 10m</span>
                    </div>
                </div>
                <div class="combat-actions">
                    <button id="shoot-shadow" class="action-btn shoot-btn">🎯 Atirar (Espaço)</button>
                    <button id="force-panel" class="action-btn panel-btn">🔧 Forçar Painel</button>
                </div>
                <div class="combat-info">
                    <p>Munição: <span id="combat-ammo">${window.gameState.inventory.ammo}</span></p>
                    <p id="combat-status">Atrase a Sombra atirando enquanto Ezra força o painel!</p>
                </div>
            </div>
        `;
        
        combatDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            color: white;
            font-family: 'Orbitron', monospace;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .combat-container {
                text-align: center;
                padding: 2rem;
                background: rgba(20, 20, 20, 0.95);
                border: 2px solid #ff0000;
                border-radius: 10px;
                max-width: 500px;
                width: 90%;
            }
            
            .shadow-distance {
                margin-bottom: 2rem;
            }
            
            .distance-bar {
                position: relative;
                width: 100%;
                height: 40px;
                background: #333;
                border: 2px solid #666;
                border-radius: 20px;
                overflow: hidden;
                margin: 1rem 0;
            }
            
            .distance-fill {
                height: 100%;
                background: linear-gradient(to right, #ff0000, #ff6666);
                transition: width 0.5s ease;
                border-radius: 18px;
            }
            
            .distance-text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-weight: bold;
                color: white;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            }
            
            .combat-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin: 2rem 0;
            }
            
            .action-btn {
                padding: 1rem 2rem;
                border: none;
                border-radius: 8px;
                font-size: 1.1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: 'Orbitron', monospace;
            }
            
            .shoot-btn {
                background: #ff4444;
                color: white;
            }
            
            .shoot-btn:hover {
                background: #ff6666;
                transform: scale(1.05);
            }
            
            .panel-btn {
                background: #4444ff;
                color: white;
            }
            
            .panel-btn:hover {
                background: #6666ff;
                transform: scale(1.05);
            }
            
            .combat-info {
                margin-top: 1rem;
                font-size: 1rem;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(combatDiv);
        
        this.bindShadowCombatEvents();
    }

    bindShadowCombatEvents() {
        const shootBtn = document.getElementById('shoot-shadow');
        const panelBtn = document.getElementById('force-panel');
        
        shootBtn.addEventListener('click', () => {
            this.shootAtShadow();
        });
        
        panelBtn.addEventListener('click', () => {
            this.ezraForcePanel();
        });
        
        // Atirar com espaço
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' && this.shadowEncounter.isActive) {
                e.preventDefault();
                this.shootAtShadow();
            }
        });
    }

    updateShadowPosition() {
        const distanceFill = document.getElementById('shadow-distance-fill');
        const distanceText = document.getElementById('distance-text');
        
        if (distanceFill && distanceText) {
            const percentage = (this.shadowEncounter.position / this.shadowEncounter.maxDistance) * 100;
            distanceFill.style.width = `${100 - percentage}%`;
            distanceText.textContent = `Distância: ${this.shadowEncounter.position}m`;
        }
    }

    startShadowAdvance() {
        this.shadowAdvanceInterval = setInterval(() => {
            if (this.shadowEncounter.position > 0) {
                this.shadowEncounter.position -= 1;
                this.updateShadowPosition();
                
                if (this.shadowEncounter.position <= 0) {
                    this.shadowReachesPlayer();
                }
            }
        }, 2000); // Sombra avança a cada 2 segundos
    }

    shootAtShadow() {
        if (window.gameState.useAmmo(1)) {
            // Atualizar display de munição
            const ammoDisplay = document.getElementById('combat-ammo');
            if (ammoDisplay) {
                ammoDisplay.textContent = window.gameState.inventory.ammo;
            }
            
            // Efeito visual de tiro
            window.audioManager?.playSound('gunshot_echo');
            this.shadowEncounter.position = Math.min(this.shadowEncounter.maxDistance, this.shadowEncounter.position + 2);
            this.updateShadowPosition();
            
            const statusEl = document.getElementById('combat-status');
            statusEl.textContent = 'Acertou! A Sombra recua temporariamente...';
            
            setTimeout(() => {
                statusEl.textContent = 'Continue atirando para atrasar a Sombra!';
            }, 1500);
        } else {
            const statusEl = document.getElementById('combat-status');
            statusEl.textContent = 'Sem munição! Ezra, force o painel!';
            window.audioManager?.playSound('empty_click');
        }
    }

    ezraForcePanel() {
        const statusEl = document.getElementById('combat-status');
        statusEl.textContent = 'Ezra está forçando o painel... Continue atrasando a Sombra!';
        
        // Ezra demora para forçar o painel
        setTimeout(() => {
            if (this.shadowEncounter.position > 2) {
                this.shadowCombatSuccess();
            } else {
                statusEl.textContent = 'A Sombra está muito perto! Atire mais!';
            }
        }, 4000);
    }

    shadowReachesPlayer() {
        clearInterval(this.shadowAdvanceInterval);
        
        document.getElementById('shadow-combat').remove();
        
        const shadowCatchDialogue = {
            speaker: 'A Sombra',
            text: 'Evelly… você perdeu o compasso… de novo… como naquela noite…',
            effects: [
                { type: 'jumpscare', intensity: 'extreme' },
                { type: 'game_over_effect' }
            ]
        };

        window.dialogueSystem.showDialogue(shadowCatchDialogue);
        
        // Perder munição e vida como punição
        window.gameState.useAmmo(5);
        window.gameState.flags.fearLevel += 5;
        
        setTimeout(() => {
            this.showGameOverChoice();
        }, 4000);
    }

    shadowCombatSuccess() {
        clearInterval(this.shadowAdvanceInterval);
        this.shadowEncounter.isActive = false;
        
        document.getElementById('shadow-combat').remove();
        
        const successDialogue = {
            speaker: 'Ezra',
            text: '*ofegante* Consegui! A porta está aberta! Vamos, AGORA!',
            effects: [{ type: 'relief' }]
        };

        window.dialogueSystem.showDialogue(successDialogue);
        
        setTimeout(() => {
            this.transitionToTheaterRoom();
        }, 3000);
    }

    showGameOverChoice() {
        const gameOverDialogue = {
            speaker: '',
            text: 'A Sombra a engolfou em memórias dolorosas. Você pode tentar novamente ou retornar ao menu principal.',
            choices: [
                {
                    text: 'Tentar puzzle novamente',
                    type: 'neutral'
                },
                {
                    text: 'Voltar ao Menu Principal',
                    type: 'neutral'
                }
            ]
        };

        window.dialogueSystem.showDialogue(gameOverDialogue);
        
        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(window.dialogueSystem);
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            originalSelectChoice(choiceIndex);
            
            if (choiceIndex === 0) {
                // Retry puzzle
                setTimeout(() => {
                    this.initializeVoicePuzzle();
                }, 500);
            } else {
                // Return to menu
                setTimeout(() => {
                    window.menuSystem?.showScreen('main-menu');
                    window.dialogueSystem.hideDialogue();
                }, 500);
            }
            
            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    // ====== TRANSIÇÃO PARA A SALA DO TEATRO ======
    transitionToTheaterRoom() {
        // Limpar efeitos visuais
        this.clearChapterEffects();
        
        const transitionDialogue = {
            speaker: '',
            text: 'A porta finalmente se abre. Vocês entram em uma sala mais escura ainda, cheia de poltronas velhas viradas para um palco improvisado. No palco, uma única cadeira iluminada por um holofote. Vazia. Esperando alguém.',
            effects: [{ type: 'fadeToBlack', duration: 4000 }]
        };

        window.dialogueSystem.showDialogue(transitionDialogue);
        
        setTimeout(() => {
            this.finishChapter2();
        }, 6000);
    }

    clearChapterEffects() {
        // Parar luz piscando
        if (this.flickerInterval) {
            clearInterval(this.flickerInterval);
        }
        
        // Remover efeitos de água
        const waterReflection = document.querySelector('.water-reflection');
        if (waterReflection) {
            waterReflection.remove();
        }
        
        // Restaurar filtros
        const gameScreen = document.getElementById('game-screen');
        gameScreen.style.filter = '';
    }

    finishChapter2() {
        // Auto-save
        window.gameState.progressToNextChapter();
        window.saveSystem.autoSave();
        
        const chapterEndDialogue = {
            speaker: '',
            text: 'Fim do Capítulo 2: O Setor das Vozes. Evelly enfrentou seus primeiros ecos do passado, mas o pior ainda está por vir...',
            choices: [
                {
                    text: 'Continuar para o Capítulo 3',
                    type: 'neutral',
                    nextChapter: 3
                },
                {
                    text: 'Voltar ao Menu Principal',
                    type: 'neutral',
                    nextScene: 'main_menu'
                }
            ]
        };

        window.dialogueSystem.showDialogue(chapterEndDialogue);
        
        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(window.dialogueSystem);
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            originalSelectChoice(choiceIndex);
            
            setTimeout(() => {
                if (choiceIndex === 0) {
                    // Continuar para Capítulo 3 (quando implementado)
                    alert('Capítulo 3 será implementado em breve!');
                    window.menuSystem?.showScreen('main-menu');
                } else {
                    window.menuSystem?.showScreen('main-menu');
                }
                window.dialogueSystem.hideDialogue();
            }, 500);
            
            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }
}

// Exportar para uso global
window.Chapter2 = Chapter2;
