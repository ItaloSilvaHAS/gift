class Chapter4Rota2 {
    constructor() {
        this.name = 'Fragmentos da Verdade - Rejeitar o Chamado';
        this.totalScenes = 4;
        this.currentPuzzle = null;
        this.currentCharacters = {};
        
        // Sistema de Batimento Cardíaco
        this.heartbeatSystem = {
            isActive: false,
            currentBPM: 70,
            targetBPM: 80,
            tolerance: 10,
            sequence: [],
            playerClicks: [],
            timeRemaining: 0,
            failures: 0,
            maxFailures: 3
        };
        
        // Puzzle da Cirurgia
        this.surgeryPuzzle = {
            isActive: false,
            heartPieces: [
                { id: 'ventricle_left', name: 'Ventrículo Esquerdo', placed: false },
                { id: 'ventricle_right', name: 'Ventrículo Direito', placed: false },
                { id: 'atrium_left', name: 'Átrio Esquerdo', placed: false },
                { id: 'atrium_right', name: 'Átrio Direito', placed: false },
                { id: 'aorta', name: 'Aorta', placed: false },
                { id: 'vena_cava', name: 'Veia Cava', placed: false }
            ],
            correctOrder: ['atrium_right', 'ventricle_right', 'atrium_left', 'ventricle_left', 'aorta', 'vena_cava'],
            currentStep: 0,
            failures: 0,
            maxFailures: 2
        };
        
        // Puzzle dos Registros
        this.recordsPuzzle = {
            isActive: false,
            files: [
                { id: 'file1', name: 'Acidentes Domésticos 2019', content: 'Relatórios de acidentes menores...', isCorrect: false },
                { id: 'file2', name: 'Incêndio Teatro Municipal', content: 'INCÊNDIO NO TEATRO MUNICIPAL - Data: [CENSURADO]. Durante apresentação teatral "Ecos da Alma", um curto-circuito causou...', isCorrect: true },
                { id: 'file3', name: 'Emergências Psiquiátricas', content: 'Pacientes com distúrbios relacionados a trauma...', isCorrect: false },
                { id: 'file4', name: 'Projeto Marionete - CONFIDENCIAL', content: 'PROJETO: MARIONETE - Participantes: [LISTA REDACTED]. Objetivo: Estudar efeitos de trauma coletivo...', isCorrect: true },
                { id: 'file5', name: 'Relatórios de Óbito 2019', content: 'Vítimas do incêndio do Teatro Municipal...', isCorrect: false }
            ],
            correctFiles: ['file2', 'file4'],
            foundFiles: [],
            searchAttempts: 0,
            maxSearchAttempts: 8
        };
        
        // Estado da memória fragmentada
        this.memoryState = {
            fragments: [],
            intensity: 0,
            isActive: false
        };
    }

    // ====== SISTEMA DE EXIBIÇÃO DE PERSONAGENS ======
    showCharacter(characterName, expression = 'neutral', position = 'center') {
        const charactersDiv = document.getElementById('characters');
        
        const existingChar = document.getElementById(`char-${characterName}`);
        if (existingChar) {
            existingChar.remove();
        }
        
        const charElement = document.createElement('div');
        charElement.id = `char-${characterName}`;
        charElement.className = `character character-${position}`;
        
        let imagePath;
        
        if (characterName === 'ezra' || characterName === 'erza') {
            const erzaExpressionMap = {
                'neutral': 'ErzaSpriteCasual.webp',
                'casual': 'ErzaSpriteCasual.webp',
                'angry': 'ErzaSprite_angry.webp',
                'smirk': 'ErzaSprite_smirk.webp',
                'happy': 'ErzaSprite_happy.webp',
                'sad': 'ErzaSprite_sad.webp',
                'surprised': 'ErzaSprite_surprised.webp',
                'cautious': 'ErzaSpriteCasual.webp',
                'nervous': 'ErzaSpriteCasual.webp'
            };
            
            const spriteFile = erzaExpressionMap[expression] || 'ErzaSpriteCasual.webp';
            imagePath = `./assets/images/characters/${spriteFile}`;
        } else {
            imagePath = `./assets/images/characters/${characterName}_${expression}.png`;
        }
        
        charElement.innerHTML = `
            <img src="${imagePath}" 
                 alt="${characterName}" 
                 class="character-sprite"
                 onerror="this.style.display='none'; console.warn('Imagem não encontrada: ${imagePath}');">
        `;
        
        this.applyCharacterPosition(charElement, position);
        charactersDiv.appendChild(charElement);
        this.currentCharacters[characterName] = charElement;
        
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
        if (this.currentCharacters[characterName]) {
            this.hideCharacter(characterName);
            setTimeout(() => {
                this.showCharacter(characterName, newExpression, 'center');
            }, 600);
        }
    }

    // ====== INÍCIO DO CAPÍTULO ======
    async start() {
        console.log('Iniciando Capítulo 4 - Rota B: Rejeitar o Chamado');
        
        // Configurar estado do capítulo
        window.gameState.currentChapter = 4;
        window.gameState.currentScene = 1;
        window.gameState.flags.currentRoute = 'hospital';
        
        // Aplicar estilo do capítulo
        this.applyChapterStyling();
        
        // Iniciar primeira cena
        await this.startScene1();
    }

    applyChapterStyling() {
        const gameScreen = document.getElementById('game-screen');
        gameScreen.classList.add('chapter-4-hospital');
        
        // Música ambiente do hospital
        window.audioManager?.playMusic('hospital_ambience', true);
        
        // Aplicar filtros visuais do hospital
        const background = document.getElementById('background');
        background.style.backgroundImage = 'url(./assets/images/backgrounds/fundocena3.jpeg)';
        background.style.filter = 'grayscale(0.7) contrast(1.1) brightness(0.5)';
        
        // Efeitos de luzes fluorescentes piscando
        this.startFluorescentEffects();
    }

    startFluorescentEffects() {
        const effectsDiv = document.getElementById('effects');
        
        // Criar efeito de luzes fluorescentes
        const fluorescentLight = document.createElement('div');
        fluorescentLight.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(180deg, 
                rgba(255, 255, 255, 0.1) 0%, 
                transparent 20%, 
                transparent 80%, 
                rgba(255, 255, 255, 0.05) 100%);
            z-index: 1;
            animation: fluorescentFlicker 3s ease-in-out infinite;
        `;
        
        effectsDiv.appendChild(fluorescentLight);
        
        // Adicionar CSS para animação
        if (!document.getElementById('hospital-styles')) {
            const style = document.createElement('style');
            style.id = 'hospital-styles';
            style.textContent = `
                @keyframes fluorescentFlicker {
                    0%, 100% { opacity: 0.8; }
                    10% { opacity: 0.2; }
                    15% { opacity: 0.9; }
                    20% { opacity: 0.1; }
                    25% { opacity: 0.8; }
                    90% { opacity: 0.8; }
                    95% { opacity: 0.3; }
                }
                @keyframes heartbeat-pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ====== CENA 1: CHEGADA AO HOSPITAL ======
    async startScene1() {
        window.gameState.currentScene = 1;
        
        const arrivalDialogue = {
            speaker: '',
            text: 'Vocês seguem por um hospital abandonado. O ar carrega um cheiro pesado de mofo e ferrugem. Corredores intermináveis se estendem à frente, cheios de macas quebradas e instrumentos cirúrgicos cobertos de poeira.',
            effects: [{ type: 'fadeIn', duration: 2000 }]
        };

        window.dialogueSystem.showDialogue(arrivalDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.hospitalAtmosphere();
        });
    }

    hospitalAtmosphere() {
        // Tocar sons de hospital assombrado
        window.audioManager?.playSound('hospital_ambience');
        
        const atmosphereDialogue = {
            speaker: '',
            text: 'Em contraste com qualquer palco teatral, este lugar é brutalmente clínico e frio. As luzes fluorescentes piscam irregularmente, criando sombras que dançam pelos corredores como fantasmas de pacientes há muito esquecidos.',
            effects: [{ type: 'atmospheric' }]
        };

        window.dialogueSystem.showDialogue(atmosphereDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyDiscomfort();
        });
    }

    evellyDiscomfort() {
        const evellyDialogue = {
            speaker: 'Evelly',
            text: 'Este lugar... é o oposto de qualquer teatro. Não há magia aqui, só realidade crua. Posso sentir meu coração acelerando apenas de estar aqui.',
            effects: [{ type: 'character_unease' }]
        };

        window.dialogueSystem.showDialogue(evellyDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.ezraConcern();
        });
    }

    ezraConcern() {
        this.showCharacter('ezra', 'cautious', 'right');
        
        const ezraDialogue = {
            speaker: 'Ezra',
            text: 'Evelly, você está bem? Sua respiração está acelerada. Este lugar está afetando você mais do que deveria...',
            effects: [{ type: 'concern' }]
        };

        window.dialogueSystem.showDialogue(ezraDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.firstHeartbeatTrigger();
        });
    }

    firstHeartbeatTrigger() {
        // Iniciar primeiro teste do sistema de batimento cardíaco
        this.startHeartbeatSystem('Evelly se sente sobrecarregada pelo ambiente hospitalar');
    }

    // ====== SISTEMA DE BATIMENTO CARDÍACO ======
    startHeartbeatSystem(reason) {
        this.heartbeatSystem.isActive = true;
        this.heartbeatSystem.currentBPM = 70 + Math.random() * 20;
        this.heartbeatSystem.targetBPM = 80;
        this.heartbeatSystem.timeRemaining = 10;
        
        const stressMsg = document.createElement('div');
        stressMsg.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(139, 0, 0, 0.9);
            color: white;
            padding: 1rem;
            border-radius: 10px;
            text-align: center;
            z-index: 1001;
        `;
        stressMsg.innerHTML = `
            <h3>SITUAÇÃO DE ESTRESSE</h3>
            <p>${reason}</p>
            <p>Mantenha o ritmo cardíaco estável!</p>
        `;
        
        document.body.appendChild(stressMsg);
        
        setTimeout(() => {
            stressMsg.remove();
            this.showHeartbeatInterface();
        }, 2000);
    }

    showHeartbeatInterface() {
        const heartbeatContainer = document.createElement('div');
        heartbeatContainer.id = 'heartbeat-puzzle';
        heartbeatContainer.style.cssText = `
            position: fixed;
            bottom: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            padding: 2rem;
            border-radius: 15px;
            border: 2px solid #FF0000;
            z-index: 1000;
            text-align: center;
            width: 400px;
        `;
        
        heartbeatContainer.innerHTML = `
            <h3 style="color: #FF0000; margin-bottom: 1rem;">
                Controle Cardíaco
            </h3>
            <div id="heartbeat-display" style="margin-bottom: 1rem;">
                <div id="heart-icon" style="font-size: 3rem; color: #FF0000; animation: heartbeat-pulse 1s infinite;">
                    ♥
                </div>
                <div id="bpm-display" style="color: white; font-size: 1.5rem; margin-top: 0.5rem;">
                    ${Math.round(this.heartbeatSystem.currentBPM)} BPM
                </div>
            </div>
            <div style="margin-bottom: 1rem;">
                <div style="color: #FFD700;">Target: ${this.heartbeatSystem.targetBPM} BPM</div>
                <div id="time-remaining" style="color: white;">
                    Tempo: ${this.heartbeatSystem.timeRemaining}s
                </div>
            </div>
            <button id="heartbeat-click" onclick="chapter4Rota2.handleHeartbeatClick()" 
                    style="padding: 1rem 2rem; background: #FF0000; color: white; 
                           border: none; border-radius: 10px; cursor: pointer; 
                           font-size: 1.2rem; width: 100%;">
                Clique no Ritmo
            </button>
            <div style="margin-top: 1rem; color: #AAA; font-size: 0.9rem;">
                Clique em sincronia com o coração para manter o ritmo estável
            </div>
        `;
        
        document.body.appendChild(heartbeatContainer);
        
        this.runHeartbeatTimer();
    }

    runHeartbeatTimer() {
        const timer = setInterval(() => {
            this.heartbeatSystem.timeRemaining--;
            
            const timeDisplay = document.getElementById('time-remaining');
            if (timeDisplay) {
                timeDisplay.textContent = `Tempo: ${this.heartbeatSystem.timeRemaining}s`;
            }
            
            // Atualizar BPM baseado na performance
            this.updateHeartbeat();
            
            if (this.heartbeatSystem.timeRemaining <= 0) {
                clearInterval(timer);
                this.completeHeartbeatChallenge();
            }
        }, 1000);
    }

    handleHeartbeatClick() {
        const currentTime = Date.now();
        this.heartbeatSystem.playerClicks.push(currentTime);
        
        // Manter apenas os últimos 5 cliques para calcular ritmo
        if (this.heartbeatSystem.playerClicks.length > 5) {
            this.heartbeatSystem.playerClicks.shift();
        }
        
        // Feedback visual do clique
        const heartIcon = document.getElementById('heart-icon');
        if (heartIcon) {
            heartIcon.style.transform = 'scale(1.2)';
            setTimeout(() => {
                heartIcon.style.transform = 'scale(1)';
            }, 100);
        }
    }

    updateHeartbeat() {
        if (this.heartbeatSystem.playerClicks.length >= 2) {
            // Calcular BPM baseado nos cliques do jogador
            const clicks = this.heartbeatSystem.playerClicks;
            const intervals = [];
            
            for (let i = 1; i < clicks.length; i++) {
                intervals.push(clicks[i] - clicks[i-1]);
            }
            
            const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
            const calculatedBPM = 60000 / avgInterval; // Converter ms para BPM
            
            // Suavizar mudança de BPM
            this.heartbeatSystem.currentBPM = (this.heartbeatSystem.currentBPM * 0.7) + (calculatedBPM * 0.3);
        }
        
        // Atualizar display
        const bpmDisplay = document.getElementById('bpm-display');
        if (bpmDisplay) {
            const displayBPM = Math.round(this.heartbeatSystem.currentBPM);
            bpmDisplay.textContent = `${displayBPM} BPM`;
            
            // Colorir baseado na proximidade do target
            const diff = Math.abs(displayBPM - this.heartbeatSystem.targetBPM);
            if (diff <= this.heartbeatSystem.tolerance) {
                bpmDisplay.style.color = '#00FF00';
            } else if (diff <= this.heartbeatSystem.tolerance * 2) {
                bpmDisplay.style.color = '#FFFF00';
            } else {
                bpmDisplay.style.color = '#FF0000';
            }
        }
    }

    completeHeartbeatChallenge() {
        const finalBPM = Math.round(this.heartbeatSystem.currentBPM);
        const diff = Math.abs(finalBPM - this.heartbeatSystem.targetBPM);
        
        let success = diff <= this.heartbeatSystem.tolerance;
        
        const heartbeatDiv = document.getElementById('heartbeat-puzzle');
        if (heartbeatDiv) {
            heartbeatDiv.remove();
        }
        
        if (success) {
            window.audioManager?.playSound('heartbeat_calm');
            this.proceedAfterHeartbeat();
        } else {
            this.heartbeatSystem.failures++;
            if (this.heartbeatSystem.failures >= this.heartbeatSystem.maxFailures) {
                this.heartbeatGameOver();
            } else {
                this.handleHeartbeatFailure();
            }
        }
    }

    handleHeartbeatFailure() {
        window.audioManager?.playSound('heartbeat_panic');
        
        const panicDialogue = {
            speaker: 'Evelly',
            text: 'Meu coração... está disparado... Não consigo controlar... As memórias estão voltando...',
            effects: [{ type: 'panic' }]
        };

        window.dialogueSystem.showDialogue(panicDialogue);
        
        // Efeito visual de pânico
        const panicEffect = document.createElement('div');
        panicEffect.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(255, 0, 0, 0.3);
            z-index: 999;
            animation: panic-flash 0.5s ease-in-out 3;
        `;
        
        if (!document.getElementById('panic-styles')) {
            const style = document.createElement('style');
            style.id = 'panic-styles';
            style.textContent = `
                @keyframes panic-flash {
                    0%, 100% { opacity: 0; }
                    50% { opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(panicEffect);
        
        setTimeout(() => {
            panicEffect.remove();
            this.proceedAfterHeartbeat();
        }, 2000);
    }

    heartbeatGameOver() {
        const gameOverMsg = document.createElement('div');
        gameOverMsg.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #000;
            color: #FF0000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            font-family: 'Creepster', cursive;
        `;
        
        gameOverMsg.innerHTML = `
            <h1 style="font-size: 3rem; margin-bottom: 2rem;">COLAPSO CARDÍACO</h1>
            <p style="font-size: 1.5rem; margin-bottom: 2rem;">O estresse foi demais para suportar...</p>
            <button onclick="window.location.reload();" 
                    style="padding: 1rem 2rem; font-size: 1.2rem; 
                           background: #8B0000; color: white; border: none; 
                           border-radius: 10px; cursor: pointer;">
                Tentar Novamente
            </button>
        `;
        
        document.body.appendChild(gameOverMsg);
        window.audioManager?.playSound('flatline');
    }

    proceedAfterHeartbeat() {
        this.heartbeatSystem.isActive = false;
        
        window.dialogueSystem.setNextAction(() => {
            this.exploreHospital();
        });
    }

    exploreHospital() {
        const explorationDialogue = {
            speaker: '',
            text: 'Vocês avançam pelos corredores do hospital. À medida que caminham, Evelly nota que este lugar desperta memórias fragmentadas - não de palcos e aplausos, mas de sirenes e gritos.',
            choices: [
                {
                    text: 'Investigar a ala cirúrgica (esquerda)',
                    type: 'investigate_surgery',
                    karma: 2,
                    consequences: [{ type: 'flag', flag: 'investigatedSurgery', value: true }]
                },
                {
                    text: 'Procurar a sala de arquivos (direita)',
                    type: 'investigate_records',
                    karma: 0,
                    consequences: [{ type: 'flag', flag: 'investigatedRecords', value: true }]
                },
                {
                    text: 'Ignorar tudo e tentar encontrar a saída',
                    type: 'avoid_investigation',
                    karma: -3,
                    consequences: [{ type: 'flag', flag: 'avoidedInvestigation', value: true }]
                }
            ]
        };

        window.dialogueSystem.showDialogue(explorationDialogue);
        
        window.dialogueSystem.setNextAction((choice) => {
            this.processExplorationChoice(choice);
        });
    }

    processExplorationChoice(choice) {
        if (choice.consequences) {
            window.gameState.applyConsequences(choice.consequences);
        }
        
        if (choice.type === 'investigate_surgery') {
            this.startScene2Surgery();
        } else if (choice.type === 'investigate_records') {
            this.startScene2Records();
        } else {
            // Forçar a investigação eventualmente
            setTimeout(() => {
                this.forcedInvestigation();
            }, 1000);
        }
    }

    forcedInvestigation() {
        const forcedDialogue = {
            speaker: '',
            text: 'Vocês tentam encontrar a saída, mas todas as portas estão trancadas. O hospital parece não querer deixá-los ir sem que enfrentem o que está aqui. Uma porta se abre à força - vocês devem escolher.',
            effects: [{ type: 'forced_choice' }]
        };

        window.dialogueSystem.showDialogue(forcedDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.startScene2Surgery(); // Começar com cirurgia por padrão
        });
    }

    // ====== CENA 2: PUZZLE DA CIRURGIA ======
    async startScene2Surgery() {
        window.gameState.currentScene = 2;
        
        const surgeryDialogue = {
            speaker: '',
            text: 'Vocês entram em uma sala cirúrgica abandonada. No centro, uma mesa de operação com um coração artificial desmontado. Uma placa diz: "Monte novamente para abrir a porta trancada."',
            effects: [{ type: 'scene_transition' }]
        };

        window.dialogueSystem.showDialogue(surgeryDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.startSurgeryPuzzle();
        });
    }

    startSurgeryPuzzle() {
        this.surgeryPuzzle.isActive = true;
        this.currentPuzzle = 'surgery';
        
        const puzzleIntro = {
            speaker: '',
            text: 'O coração artificial está em pedaços. Você deve remontá-lo na ordem correta. Um erro pode fazer o coração "explodir" em sangue...',
            effects: [{ type: 'puzzle_start' }]
        };

        window.dialogueSystem.showDialogue(puzzleIntro);
        
        window.dialogueSystem.setNextAction(() => {
            this.showSurgeryInterface();
        });
    }

    showSurgeryInterface() {
        const surgeryContainer = document.createElement('div');
        surgeryContainer.id = 'surgery-puzzle';
        surgeryContainer.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            padding: 2rem;
            border-radius: 15px;
            border: 2px solid #FF0000;
            z-index: 1000;
            width: 600px;
        `;
        
        surgeryContainer.innerHTML = `
            <h3 style="color: #FF0000; text-align: center; margin-bottom: 1rem;">
                Reconstrução Cardíaca
            </h3>
            <p style="color: white; text-align: center; margin-bottom: 2rem;">
                Monte o coração artificial na ordem anatômica correta
            </p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <div>
                    <h4 style="color: #FFD700; margin-bottom: 1rem;">Peças Disponíveis:</h4>
                    <div id="heart-pieces" style="display: grid; gap: 0.5rem;">
                        ${this.surgeryPuzzle.heartPieces.map(piece => `
                            <button class="heart-piece" data-piece="${piece.id}" 
                                    style="padding: 0.8rem; background: #8B0000; color: white; 
                                           border: 1px solid #FF0000; border-radius: 5px; 
                                           cursor: pointer; transition: all 0.3s; text-align: left;"
                                    ${piece.placed ? 'disabled style="opacity: 0.5;"' : ''}>
                                ${piece.name}
                            </button>
                        `).join('')}
                    </div>
                </div>
                <div>
                    <h4 style="color: #FFD700; margin-bottom: 1rem;">Montagem:</h4>
                    <div id="heart-assembly" style="border: 2px dashed #FF0000; 
                                                   min-height: 300px; padding: 1rem; 
                                                   border-radius: 10px; position: relative;">
                        <div style="color: #AAA; text-align: center; margin-top: 50%;">
                            Coloque as peças aqui na ordem correta
                        </div>
                    </div>
                </div>
            </div>
            <div style="margin-top: 1rem; text-align: center;">
                <div style="color: #FFD700;">
                    Progresso: ${this.surgeryPuzzle.currentStep}/${this.surgeryPuzzle.correctOrder.length}
                </div>
                <div style="color: #FF0000;">
                    Tentativas restantes: ${this.surgeryPuzzle.maxFailures - this.surgeryPuzzle.failures}
                </div>
            </div>
        `;
        
        document.body.appendChild(surgeryContainer);
        
        // Adicionar event listeners
        const pieceBtns = surgeryContainer.querySelectorAll('.heart-piece');
        pieceBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!e.target.disabled) {
                    const pieceId = e.target.dataset.piece;
                    this.selectHeartPiece(pieceId);
                }
            });
            
            btn.addEventListener('mouseenter', (e) => {
                if (!e.target.disabled) {
                    e.target.style.background = '#B22222';
                }
            });
            
            btn.addEventListener('mouseleave', (e) => {
                if (!e.target.disabled) {
                    e.target.style.background = '#8B0000';
                }
            });
        });
    }

    selectHeartPiece(pieceId) {
        const correctPiece = this.surgeryPuzzle.correctOrder[this.surgeryPuzzle.currentStep];
        
        if (pieceId === correctPiece) {
            // Peça correta
            this.placePiece(pieceId);
            this.surgeryPuzzle.currentStep++;
            
            if (this.surgeryPuzzle.currentStep >= this.surgeryPuzzle.correctOrder.length) {
                this.completeSurgeryPuzzle();
            } else {
                this.updateSurgeryInterface();
                window.audioManager?.playSound('medical_beep');
            }
        } else {
            // Peça incorreta
            this.surgeryPuzzle.failures++;
            this.handleSurgeryFailure(pieceId);
        }
    }

    placePiece(pieceId) {
        const assembly = document.getElementById('heart-assembly');
        const piece = this.surgeryPuzzle.heartPieces.find(p => p.id === pieceId);
        
        if (assembly && piece) {
            // Marcar peça como usada
            piece.placed = true;
            
            // Adicionar à montagem
            const placedPiece = document.createElement('div');
            placedPiece.style.cssText = `
                background: #00AA00;
                color: white;
                padding: 0.5rem;
                margin: 0.2rem;
                border-radius: 5px;
                text-align: center;
            `;
            placedPiece.textContent = piece.name;
            
            assembly.appendChild(placedPiece);
            
            // Desabilitar botão
            const pieceBtn = document.querySelector(`[data-piece="${pieceId}"]`);
            if (pieceBtn) {
                pieceBtn.disabled = true;
                pieceBtn.style.opacity = '0.5';
            }
        }
    }

    handleSurgeryFailure(wrongPieceId) {
        window.audioManager?.playSound('heart_explosion');
        
        if (this.surgeryPuzzle.failures >= this.surgeryPuzzle.maxFailures) {
            this.surgeryGameOver();
        } else {
            const failureMsg = document.createElement('div');
            failureMsg.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #8B0000;
                color: white;
                padding: 2rem;
                border-radius: 10px;
                z-index: 1002;
                text-align: center;
            `;
            
            const piece = this.surgeryPuzzle.heartPieces.find(p => p.id === wrongPieceId);
            failureMsg.innerHTML = `
                <h3>ERRO CIRÚRGICO!</h3>
                <p>A peça "${piece.name}" não é a próxima!</p>
                <p>O coração artificial vaza um líquido vermelho...</p>
                <button onclick="this.parentElement.remove();" 
                        style="margin-top: 1rem; padding: 0.5rem 1rem; 
                               background: #4A4A4A; color: white; border: none; 
                               border-radius: 5px; cursor: pointer;">
                    Continuar
                </button>
            `;
            
            document.body.appendChild(failureMsg);
            this.updateSurgeryInterface();
        }
    }

    updateSurgeryInterface() {
        const surgeryDiv = document.getElementById('surgery-puzzle');
        if (surgeryDiv) {
            const progressText = surgeryDiv.querySelector('div[style*="color: #FFD700"]');
            const failuresText = surgeryDiv.querySelector('div[style*="color: #FF0000"]');
            
            if (progressText) {
                progressText.textContent = `Progresso: ${this.surgeryPuzzle.currentStep}/${this.surgeryPuzzle.correctOrder.length}`;
            }
            
            if (failuresText) {
                failuresText.textContent = `Tentativas restantes: ${this.surgeryPuzzle.maxFailures - this.surgeryPuzzle.failures}`;
            }
        }
    }

    completeSurgeryPuzzle() {
        this.surgeryPuzzle.isActive = false;
        
        const surgeryDiv = document.getElementById('surgery-puzzle');
        if (surgeryDiv) {
            surgeryDiv.remove();
        }
        
        window.audioManager?.playSound('heartbeat_steady');
        
        const successDialogue = {
            speaker: '',
            text: 'O coração artificial bate com vida. Uma porta secreta se abre, revelando uma sala de arquivos. Os registros médicos aguardam sua investigação.',
            effects: [{ type: 'success' }]
        };

        window.dialogueSystem.showDialogue(successDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.startScene3Records();
        });
    }

    surgeryGameOver() {
        const gameOverMsg = document.createElement('div');
        gameOverMsg.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #000;
            color: #FF0000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            font-family: 'Creepster', cursive;
        `;
        
        gameOverMsg.innerHTML = `
            <h1 style="font-size: 3rem; margin-bottom: 2rem;">FALHA CIRÚRGICA</h1>
            <p style="font-size: 1.5rem; margin-bottom: 2rem;">O coração explodiu em sangue...</p>
            <button onclick="window.location.reload();" 
                    style="padding: 1rem 2rem; font-size: 1.2rem; 
                           background: #8B0000; color: white; border: none; 
                           border-radius: 10px; cursor: pointer;">
                Tentar Novamente
            </button>
        `;
        
        document.body.appendChild(gameOverMsg);
        window.audioManager?.playSound('surgical_fail');
    }

    // ====== CENA 3: PUZZLE DOS REGISTROS ======
    async startScene3Records() {
        window.gameState.currentScene = 3;
        
        const recordsDialogue = {
            speaker: '',
            text: 'A sala de arquivos se estende à sua frente. Prateleiras altas cheias de prontuários e documentos. Em uma mesa, você encontra arquivos espalhados que falam sobre pacientes, acidentes... e um incêndio no teatro.',
            effects: [{ type: 'scene_transition' }]
        };

        window.dialogueSystem.showDialogue(recordsDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.startRecordsPuzzle();
        });
    }

    startRecordsPuzzle() {
        this.recordsPuzzle.isActive = true;
        this.currentPuzzle = 'records';
        
        const puzzleIntro = {
            speaker: '',
            text: 'Você precisa encontrar os arquivos que ligam Evelly ao incidente. Procure por informações sobre o incêndio no teatro e o misterioso "Projeto Marionete".',
            effects: [{ type: 'puzzle_start' }]
        };

        window.dialogueSystem.showDialogue(puzzleIntro);
        
        window.dialogueSystem.setNextAction(() => {
            this.showRecordsInterface();
        });
    }

    showRecordsInterface() {
        const recordsContainer = document.createElement('div');
        recordsContainer.id = 'records-puzzle';
        recordsContainer.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            padding: 2rem;
            border-radius: 15px;
            border: 2px solid #8B4513;
            z-index: 1000;
            width: 700px;
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        recordsContainer.innerHTML = `
            <h3 style="color: #FFD700; text-align: center; margin-bottom: 1rem;">
                Arquivo de Registros Médicos
            </h3>
            <p style="color: white; text-align: center; margin-bottom: 2rem;">
                Encontre os arquivos que revelam a conexão de Evelly com a tragédia
            </p>
            <div id="files-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
                ${this.recordsPuzzle.files.map(file => `
                    <div class="file-folder" data-file="${file.id}" 
                         style="border: 2px solid #8B4513; border-radius: 5px; 
                                padding: 1rem; cursor: pointer; transition: all 0.3s; 
                                background: #4A4A4A;">
                        <h4 style="color: #FFD700; margin-bottom: 0.5rem;">${file.name}</h4>
                        <p style="color: #AAA; font-size: 0.9rem;">Clique para examinar</p>
                    </div>
                `).join('')}
            </div>
            <div style="text-align: center;">
                <div style="color: #FFD700; margin-bottom: 0.5rem;">
                    Arquivos encontrados: ${this.recordsPuzzle.foundFiles.length}/${this.recordsPuzzle.correctFiles.length}
                </div>
                <div style="color: white;">
                    Tentativas restantes: ${this.recordsPuzzle.maxSearchAttempts - this.recordsPuzzle.searchAttempts}
                </div>
            </div>
        `;
        
        document.body.appendChild(recordsContainer);
        
        // Adicionar event listeners
        const fileFolders = recordsContainer.querySelectorAll('.file-folder');
        fileFolders.forEach(folder => {
            folder.addEventListener('click', (e) => {
                const fileId = e.currentTarget.dataset.file;
                this.examineFile(fileId);
            });
            
            folder.addEventListener('mouseenter', (e) => {
                e.currentTarget.style.background = '#6A6A6A';
                e.currentTarget.style.borderColor = '#FFD700';
            });
            
            folder.addEventListener('mouseleave', (e) => {
                e.currentTarget.style.background = '#4A4A4A';
                e.currentTarget.style.borderColor = '#8B4513';
            });
        });
    }

    examineFile(fileId) {
        const file = this.recordsPuzzle.files.find(f => f.id === fileId);
        this.recordsPuzzle.searchAttempts++;
        
        if (!file) return;
        
        // Mostrar conteúdo do arquivo
        const fileContent = document.createElement('div');
        fileContent.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid #FFD700;
            border-radius: 10px;
            padding: 2rem;
            z-index: 1002;
            max-width: 500px;
            color: white;
        `;
        
        fileContent.innerHTML = `
            <h3 style="color: #FFD700; margin-bottom: 1rem;">${file.name}</h3>
            <div style="margin-bottom: 2rem; line-height: 1.6; color: ${file.isCorrect ? '#00FF00' : '#AAA'};">
                ${file.content}
            </div>
            <div style="text-align: center;">
                <button onclick="chapter4Rota2.closeFileContent('${fileId}', ${file.isCorrect})" 
                        style="padding: 0.5rem 1rem; background: #4A4A4A; color: white; 
                               border: none; border-radius: 5px; cursor: pointer; margin-right: 1rem;">
                    ${file.isCorrect ? 'Arquivo Importante!' : 'Não é relevante'}
                </button>
                <button onclick="this.parentElement.parentElement.remove();" 
                        style="padding: 0.5rem 1rem; background: #8B0000; color: white; 
                               border: none; border-radius: 5px; cursor: pointer;">
                    Fechar
                </button>
            </div>
        `;
        
        document.body.appendChild(fileContent);
    }

    closeFileContent(fileId, isCorrect) {
        // Fechar popup
        const fileContentDiv = document.querySelector('div[style*="position: fixed"]');
        if (fileContentDiv) {
            fileContentDiv.remove();
        }
        
        if (isCorrect && !this.recordsPuzzle.foundFiles.includes(fileId)) {
            this.recordsPuzzle.foundFiles.push(fileId);
            window.audioManager?.playSound('file_found');
            
            // Marcar arquivo como encontrado
            const fileFolder = document.querySelector(`[data-file="${fileId}"]`);
            if (fileFolder) {
                fileFolder.style.background = '#006400';
                fileFolder.style.borderColor = '#00FF00';
            }
        }
        
        // Verificar se puzzle foi completado
        if (this.recordsPuzzle.foundFiles.length >= this.recordsPuzzle.correctFiles.length) {
            setTimeout(() => {
                this.completeRecordsPuzzle();
            }, 500);
        } else if (this.recordsPuzzle.searchAttempts >= this.recordsPuzzle.maxSearchAttempts) {
            this.recordsGameOver();
        } else {
            this.updateRecordsInterface();
        }
    }

    updateRecordsInterface() {
        const recordsDiv = document.getElementById('records-puzzle');
        if (recordsDiv) {
            const foundText = recordsDiv.querySelector('div[style*="color: #FFD700"]');
            const attemptsText = recordsDiv.querySelector('div[style*="color: white"]');
            
            if (foundText) {
                foundText.textContent = `Arquivos encontrados: ${this.recordsPuzzle.foundFiles.length}/${this.recordsPuzzle.correctFiles.length}`;
            }
            
            if (attemptsText) {
                attemptsText.textContent = `Tentativas restantes: ${this.recordsPuzzle.maxSearchAttempts - this.recordsPuzzle.searchAttempts}`;
            }
        }
    }

    completeRecordsPuzzle() {
        this.recordsPuzzle.isActive = false;
        
        const recordsDiv = document.getElementById('records-puzzle');
        if (recordsDiv) {
            recordsDiv.remove();
        }
        
        window.audioManager?.playSound('revelation_chord');
        
        const successDialogue = {
            speaker: '',
            text: 'Você encontrou os arquivos cruciais! O incêndio no teatro e o Projeto Marionete... Evelly está listada nos dois documentos. Agora você conhece a conexão, mas não a verdade completa.',
            effects: [{ type: 'revelation' }]
        };

        window.dialogueSystem.showDialogue(successDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.discoverProjectMarionette();
        });
    }

    recordsGameOver() {
        const gameOverMsg = document.createElement('div');
        gameOverMsg.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #000;
            color: #FF0000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            font-family: 'Creepster', cursive;
        `;
        
        gameOverMsg.innerHTML = `
            <h1 style="font-size: 3rem; margin-bottom: 2rem;">EVIDÊNCIAS PERDIDAS</h1>
            <p style="font-size: 1.5rem; margin-bottom: 2rem;">Você não conseguiu encontrar a conexão...</p>
            <button onclick="window.location.reload();" 
                    style="padding: 1rem 2rem; font-size: 1.2rem; 
                           background: #8B0000; color: white; border: none; 
                           border-radius: 10px; cursor: pointer;">
                Tentar Novamente
            </button>
        `;
        
        document.body.appendChild(gameOverMsg);
        window.audioManager?.playSound('failure_tone');
    }

    discoverProjectMarionette() {
        const revelationDialogue = {
            speaker: '',
            text: 'Os documentos revelam que Evelly fazia parte do "Projeto Marionete" - um estudo sobre trauma coletivo. O incêndio no teatro não foi acidente... foi um experimento.',
            effects: [{ type: 'horrific_revelation' }]
        };

        window.dialogueSystem.showDialogue(revelationDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.ezraReaction();
        });
    }

    ezraReaction() {
        // Determinar reação de Ezra baseado no karma
        const karma = window.gameState.karma;
        let ezraText = '';
        let ezraExpression = 'neutral';
        
        if (karma > 0) {
            ezraText = 'Evelly... isso é terrível, mas você é uma vítima nisso tudo. Não deixe essa descoberta te destruir. Você não teve escolha.';
            ezraExpression = 'sad';
        } else if (karma < -5) {
            ezraText = 'Então era verdade... Você sabia disso? Participou conscientemente? Como posso confiar em você agora?';
            ezraExpression = 'angry';
        } else {
            ezraText = 'Não sei o que pensar... Isso muda tudo. Você é vítima ou cúmplice? A verdade está enterrada mais fundo.';
            ezraExpression = 'cautious';
        }
        
        this.changeCharacterExpression('ezra', ezraExpression);
        
        const ezraDialogue = {
            speaker: 'Ezra',
            text: ezraText,
            effects: [{ type: 'character_reaction' }]
        };

        window.dialogueSystem.showDialogue(ezraDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.startScene4Mirror();
        });
    }

    // ====== CENA 4: O ESPELHO ======
    async startScene4Mirror() {
        window.gameState.currentScene = 4;
        
        const mirrorDialogue = {
            speaker: '',
            text: 'Vocês chegam a uma ala secreta do hospital. No final do corredor, uma porta com um espelho enorme. Através do reflexo, você pode ver não apenas seu rosto, mas ecos de memórias fragmentadas.',
            effects: [{ type: 'dramatic_reveal' }]
        };

        window.dialogueSystem.showDialogue(mirrorDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.mirrorChoice();
        });
    }

    mirrorChoice() {
        const mirrorChoiceDialogue = {
            speaker: '',
            text: 'O espelho aguarda. Nele, você vê fragmentos do passado: o teatro em chamas, rostos gritando, e você... no centro de tudo. A escolha é sua.',
            choices: [
                {
                    text: 'Encarar no espelho (iniciar o flashback traumático)',
                    type: 'face_mirror',
                    karma: 5,
                    consequences: [{ type: 'flag', flag: 'facedMirror', value: true }]
                },
                {
                    text: 'Virar as costas (negar o passado)',
                    type: 'turn_away',
                    karma: -3,
                    consequences: [{ type: 'flag', flag: 'turnedAway', value: true }]
                }
            ]
        };

        window.dialogueSystem.showDialogue(mirrorChoiceDialogue);
        
        window.dialogueSystem.setNextAction((choice) => {
            this.processMirrorChoice(choice);
        });
    }

    processMirrorChoice(choice) {
        if (choice.consequences) {
            window.gameState.applyConsequences(choice.consequences);
        }
        
        if (choice.type === 'face_mirror') {
            this.faceMirrorEnding();
        } else {
            this.turnAwayEnding();
        }
    }

    faceMirrorEnding() {
        const faceDialogue = {
            speaker: '',
            text: 'Você encara o espelho. As memórias invadem sua mente como uma enxurrada. O flashback traumático começa... No próximo capítulo, você reviverá a noite do incêndio.',
            effects: [{ type: 'traumatic_flashback' }]
        };

        window.dialogueSystem.showDialogue(faceDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.completeChapter4Rota2('faced');
        });
    }

    turnAwayEnding() {
        // Ativar sistema de batimento cardíaco de emergência
        this.startHeartbeatSystem('Negar o passado causa extremo estresse psicológico');
        
        setTimeout(() => {
            const shadowDialogue = {
                speaker: '',
                text: 'Você vira as costas, mas o espelho se estilhaça. A sombra aparece atrás de você, segurando-a pelos ombros. "Você pode fugir, mas eu sempre estarei aqui." No próximo capítulo, a negação terá suas consequências.',
                effects: [{ type: 'shadow_force' }]
            };

            window.dialogueSystem.showDialogue(shadowDialogue);
            
            window.dialogueSystem.setNextAction(() => {
                this.completeChapter4Rota2('denied');
            });
        }, 5000);
    }

    completeChapter4Rota2(ending) {
        // Salvar escolha para o próximo capítulo
        window.gameState.flags.chapter4Choice = ending;
        window.gameState.flags.chapter4Route = 'hospital';
        
        let endingText = '';
        
        if (ending === 'faced') {
            endingText = 'Você escolheu encarar a verdade através do espelho. No próximo capítulo, você será forçada a reviver os eventos traumáticos...';
        } else {
            endingText = 'Você tentou negar o passado, mas a sombra não permitiu. No próximo capítulo, a negação trará suas próprias batalhas...';
        }
        
        const endingDialogue = {
            speaker: '',
            text: endingText,
            effects: [{ type: 'chapter_end' }]
        };

        window.dialogueSystem.showDialogue(endingDialogue);
        
        // Auto-save
        window.saveSystem?.autoSave();
        
        window.dialogueSystem.setNextAction(() => {
            this.showChapterComplete();
        });
    }

    showChapterComplete() {
        const completeDiv = document.createElement('div');
        completeDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #2F4F2F, #000);
            color: #FFD700;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            font-family: 'Orbitron', monospace;
        `;
        
        completeDiv.innerHTML = `
            <h1 style="font-size: 3rem; margin-bottom: 2rem; text-shadow: 0 0 20px #FFD700;">
                CAPÍTULO 4 COMPLETO
            </h1>
            <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">
                Rota do Hospital - Rejeitar o Chamado
            </h2>
            <p style="font-size: 1.2rem; margin-bottom: 2rem; text-align: center; max-width: 600px;">
                Sua jornada pelo hospital chegou ao fim. A realidade crua revelou a verdade sobre o Projeto Marionete.
            </p>
            <div style="margin-bottom: 2rem;">
                <p>Karma atual: ${window.gameState.karma}</p>
                <p>Rota escolhida: Hospital</p>
                <p>Decisão final: ${window.gameState.flags.chapter4Choice === 'faced' ? 'Encarou o espelho' : 'Negou o passado'}</p>
            </div>
            <button onclick="window.menuSystem.showMainMenu(); this.parentElement.remove();" 
                    style="padding: 1rem 2rem; font-size: 1.2rem; 
                           background: #2F4F2F; color: #FFD700; border: 2px solid #FFD700; 
                           border-radius: 10px; cursor: pointer; font-family: 'Orbitron', monospace;">
                Voltar ao Menu
            </button>
        `;
        
        document.body.appendChild(completeDiv);
    }

    // ====== MÉTODO AUXILIAR PARA SCENES ALTERNATIVAS ======
    async startScene2Records() {
        // Se chegou aqui direto, pular cirurgia e ir para registros
        window.gameState.currentScene = 2;
        await this.startScene3Records();
    }
}

// Instância global para acesso fácil
window.chapter4Rota2 = new Chapter4Rota2();