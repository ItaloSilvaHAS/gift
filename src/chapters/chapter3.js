class Chapter3 {
    constructor() {
        this.name = 'A Tragédia Esquecida';
        this.totalScenes = 5;
        this.currentPuzzle = null;
        this.currentCharacters = {};
        
        // Piano puzzle system
        this.pianoPuzzle = {
            correctSequence: [1, 4, 7, 3, 6], // Sequência das luzes/notas
            playerInput: [],
            currentStep: 0,
            failures: 0,
            maxFailures: 3,
            isActive: false,
            lightsFlashing: false
        };
        
        // Fog chase system
        this.fogChase = {
            isActive: false,
            playerPosition: 0,
            fogPosition: -5,
            maxDistance: 15,
            timeRemaining: 30,
            currentPath: [],
            safeRooms: []
        };
        
        // Story flags
        this.storyFlags = {
            tragicMemoryChoice: null,
            ezraConfidence: 0,
            terrorLevel: 0,
            revealedConnection: false
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
                background.style.backgroundImage = `url('${imagePath}')`;
                background.style.backgroundSize = 'cover';
                background.style.backgroundPosition = 'center';
                background.style.opacity = '1';
            }, 500);
        } else {
            background.style.backgroundImage = `url('${imagePath}')`;
            background.style.backgroundSize = 'cover';
            background.style.backgroundPosition = 'center';
        }
    }

    // ====== SISTEMA DE EFEITOS VISUAIS ======
    addTheaterEffect() {
        const gameScreen = document.getElementById('game-screen');
        
        // Criar efeito de luz piscando no palco
        const spotlight = document.createElement('div');
        spotlight.className = 'theater-spotlight';
        spotlight.style.cssText = `
            position: absolute;
            top: 10%;
            left: 50%;
            transform: translateX(-50%);
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
            border-radius: 50%;
            z-index: 3;
            pointer-events: none;
            animation: spotlightFlicker 3s infinite;
        `;
        
        gameScreen.appendChild(spotlight);
        
        // Adicionar CSS da animação
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spotlightFlicker {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
            }
        `;
        document.head.appendChild(style);
    }

    addMannequinsEffect() {
        const gameScreen = document.getElementById('game-screen');
        
        // Criar manequins nas poltronas
        for (let i = 0; i < 6; i++) {
            const mannequin = document.createElement('div');
            mannequin.className = 'mannequin';
            mannequin.style.cssText = `
                position: absolute;
                bottom: 40%;
                left: ${20 + (i * 10)}%;
                width: 40px;
                height: 80px;
                background: linear-gradient(to bottom, #222, #000);
                border-radius: 50% 50% 0 0;
                z-index: 2;
                box-shadow: 0 0 10px rgba(255,0,0,0.3);
                transition: transform 0.3s ease;
            `;
            
            mannequin.addEventListener('mouseover', () => {
                mannequin.style.transform = 'scale(1.1) rotate(5deg)';
            });
            
            mannequin.addEventListener('mouseout', () => {
                mannequin.style.transform = 'scale(1) rotate(0deg)';
            });
            
            gameScreen.appendChild(mannequin);
        }
    }

    // ====== PUZZLE DO PIANO ======
    startPianoPuzzle() {
        this.pianoPuzzle.isActive = true;
        this.pianoPuzzle.failures = 0;
        this.pianoPuzzle.currentStep = 0;
        this.pianoPuzzle.playerInput = [];
        
        const puzzleDialogue = {
            speaker: '',
            text: 'Um grande piano quebrado bloqueia a saída. As teclas estão manchadas de sangue seco, mas ainda funcionam. As luzes acima do palco começam a piscar em uma sequência... Você precisa reproduzir a melodia.',
            choices: [
                {
                    text: 'Tentar tocar a melodia',
                    type: 'neutral'
                },
                {
                    text: 'Procurar outra saída',
                    type: 'coward'
                }
            ]
        };

        window.dialogueSystem.showDialogue(puzzleDialogue);
        
        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(window.dialogueSystem);
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            originalSelectChoice(choiceIndex);
            
            setTimeout(() => {
                if (choiceIndex === 0) {
                    this.showPianoInterface();
                } else {
                    this.seekAlternativeExit();
                }
                window.dialogueSystem.hideDialogue();
            }, 500);
            
            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    showPianoInterface() {
        const gameScreen = document.getElementById('game-screen');
        
        // Criar interface do piano
        const pianoInterface = document.createElement('div');
        pianoInterface.id = 'piano-interface';
        pianoInterface.style.cssText = `
            position: absolute;
            bottom: 10%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.9);
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #8B0000;
            z-index: 10;
        `;
        
        pianoInterface.innerHTML = `
            <div style="color: white; text-align: center; margin-bottom: 10px;">
                <h3>Piano da Tragédia</h3>
                <p>Reproduza a sequência das luzes</p>
                <p>Falhas: ${this.pianoPuzzle.failures}/${this.pianoPuzzle.maxFailures}</p>
            </div>
            <div id="piano-keys" style="display: flex; gap: 5px;">
                ${Array.from({length: 8}, (_, i) => 
                    `<button class="piano-key" data-note="${i + 1}" style="
                        width: 40px;
                        height: 80px;
                        background: white;
                        border: 1px solid #000;
                        color: black;
                        cursor: pointer;
                        transition: all 0.2s;
                    ">${i + 1}</button>`
                ).join('')}
            </div>
            <div style="margin-top: 10px; text-align: center;">
                <button id="start-sequence" style="
                    background: #8B0000;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                ">Ver Sequência</button>
                <button id="reset-piano" style="
                    background: #444;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-left: 10px;
                ">Recomeçar</button>
            </div>
        `;
        
        gameScreen.appendChild(pianoInterface);
        this.bindPianoEvents();
    }

    bindPianoEvents() {
        const keys = document.querySelectorAll('.piano-key');
        const startBtn = document.getElementById('start-sequence');
        const resetBtn = document.getElementById('reset-piano');
        
        keys.forEach(key => {
            key.addEventListener('click', (e) => {
                if (!this.pianoPuzzle.lightsFlashing) {
                    this.playPianoNote(parseInt(e.target.dataset.note));
                }
            });
        });
        
        startBtn.addEventListener('click', () => {
            this.showLightSequence();
        });
        
        resetBtn.addEventListener('click', () => {
            this.resetPianoInput();
        });
    }

    showLightSequence() {
        this.pianoPuzzle.lightsFlashing = true;
        const keys = document.querySelectorAll('.piano-key');
        
        let step = 0;
        const flashInterval = setInterval(() => {
            if (step < this.pianoPuzzle.correctSequence.length) {
                const noteIndex = this.pianoPuzzle.correctSequence[step] - 1;
                const key = keys[noteIndex];
                
                // Efeito visual na tecla
                key.style.background = '#FFD700';
                key.style.transform = 'scale(1.1)';
                
                // Som da nota (simulado)
                this.playNoteSound(noteIndex + 1);
                
                setTimeout(() => {
                    key.style.background = 'white';
                    key.style.transform = 'scale(1)';
                }, 600);
                
                step++;
            } else {
                clearInterval(flashInterval);
                this.pianoPuzzle.lightsFlashing = false;
                
                // Adicionar efeito dos manequins batendo palmas
                this.mannequinsApplaud();
            }
        }, 800);
    }

    mannequinsApplaud() {
        const mannequins = document.querySelectorAll('.mannequin');
        
        // Som de palmas em descompasso
        let clapCount = 0;
        const clapInterval = setInterval(() => {
            mannequins.forEach((mannequin, index) => {
                setTimeout(() => {
                    mannequin.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        mannequin.style.transform = 'scale(1)';
                    }, 200);
                }, index * 100);
            });
            
            clapCount++;
            if (clapCount >= 3) {
                clearInterval(clapInterval);
            }
        }, 1000);
    }

    playPianoNote(note) {
        this.pianoPuzzle.playerInput.push(note);
        
        // Efeito visual
        const key = document.querySelector(`[data-note="${note}"]`);
        key.style.background = '#8B0000';
        key.style.color = 'white';
        
        setTimeout(() => {
            key.style.background = 'white';
            key.style.color = 'black';
        }, 300);
        
        this.playNoteSound(note);
        this.checkPianoInput();
    }

    checkPianoInput() {
        const currentLength = this.pianoPuzzle.playerInput.length;
        const correctNote = this.pianoPuzzle.correctSequence[currentLength - 1];
        const playerNote = this.pianoPuzzle.playerInput[currentLength - 1];
        
        if (playerNote !== correctNote) {
            this.failPianoAttempt();
        } else if (this.pianoPuzzle.playerInput.length === this.pianoPuzzle.correctSequence.length) {
            this.solvePianoPuzzle();
        }
    }

    failPianoAttempt() {
        this.pianoPuzzle.failures++;
        this.pianoPuzzle.playerInput = [];
        
        // Efeito visual de erro
        const pianoInterface = document.getElementById('piano-interface');
        pianoInterface.style.border = '2px solid #FF0000';
        pianoInterface.style.background = 'rgba(255,0,0,0.3)';
        
        setTimeout(() => {
            pianoInterface.style.border = '2px solid #8B0000';
            pianoInterface.style.background = 'rgba(0,0,0,0.9)';
        }, 1000);
        
        if (this.pianoPuzzle.failures >= this.pianoPuzzle.maxFailures) {
            this.failPianoPuzzle();
        } else {
            // Atualizar contador de falhas
            const failureDisplay = pianoInterface.querySelector('p');
            failureDisplay.textContent = `Falhas: ${this.pianoPuzzle.failures}/${this.pianoPuzzle.maxFailures}`;
        }
    }

    solvePianoPuzzle() {
        // Remover interface do piano
        const pianoInterface = document.getElementById('piano-interface');
        if (pianoInterface) {
            pianoInterface.remove();
        }
        
        // Som de sucesso
        this.playSuccessSound();
        
        // Diálogo de sucesso
        const successDialogue = {
            speaker: '',
            text: 'A melodia ressoa pelo teatro vazio. O piano se move lentamente, revelando uma porta oculta. Os manequins param de bater palmas e se voltam para olhar diretamente para você.',
            effects: [{ type: 'pianoSuccess' }]
        };
        
        window.dialogueSystem.showDialogue(successDialogue);
        
        setTimeout(() => {
            window.dialogueSystem.hideDialogue();
            this.startCrucialDialogue();
        }, 4000);
    }

    seekAlternativeExit() {
        const searchDialogue = {
            speaker: '',
            text: 'Você procura por outra saída, mas as paredes estão seladas. Não há escapatória. O piano parece ser a única forma de abrir a passagem. Os manequins observam, esperando.',
            choices: [
                {
                    text: 'Voltar e tentar o piano',
                    type: 'neutral'
                },
                {
                    text: 'Insistir em procurar outra saída',
                    type: 'stubborn'
                }
            ]
        };

        window.dialogueSystem.showDialogue(searchDialogue);
        
        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(window.dialogueSystem);
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            originalSelectChoice(choiceIndex);
            
            setTimeout(() => {
                if (choiceIndex === 0) {
                    window.dialogueSystem.hideDialogue();
                    setTimeout(() => {
                        this.showPianoInterface();
                    }, 500);
                } else {
                    window.dialogueSystem.hideDialogue();
                    setTimeout(() => {
                        this.startCrucialDialogue();
                    }, 500);
                }
            }, 500);
            
            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    failPianoPuzzle() {
        // Game Over devido aos manequins
        const gameOverDialogue = {
            speaker: '',
            text: 'Os manequins se levantam de suas poltronas, rostos derretidos se contorcendo em sorrisos terríveis. Eles avançam lentamente em sua direção, aplaudindo em um ritmo hipnótico...',
            effects: [{ type: 'gameOver' }]
        };
        
        window.dialogueSystem.showDialogue(gameOverDialogue);
        
        setTimeout(() => {
            window.gameState.resetToLastCheckpoint();
            window.menuSystem.showScreen('main-menu');
        }, 6000);
    }

    resetPianoInput() {
        this.pianoPuzzle.playerInput = [];
        this.pianoPuzzle.currentStep = 0;
    }

    playNoteSound(note) {
        // Simula som da nota do piano
        console.log(`Playing piano note: ${note}`);
        // Aqui você adicionaria o som real
    }

    playSuccessSound() {
        console.log('Playing success sound');
        // Som de sucesso do puzzle
    }

    // ====== DIÁLOGO CRUCIAL ======
    startCrucialDialogue() {
        this.changeBackground('fundocena3', 'fade');
        this.showCharacter('evelly', 'worried', 'left');
        this.showCharacter('ezra', 'serious', 'right');
        
        const dialogue1 = {
            speaker: 'Ezra',
            text: 'Evelly... você não parece bem. Desde que acordamos aqui, não para de ouvir coisas. Me diz uma coisa... você se lembra da trágica noite?',
            effects: [{ type: 'shadowWhispers' }]
        };
        
        window.dialogueSystem.showDialogue(dialogue1);
        
        setTimeout(() => {
            window.dialogueSystem.hideDialogue();
            this.addShadowWhispers();
            
            setTimeout(() => {
                this.showTragicMemoryChoices();
            }, 3000);
        }, 5000);
    }

    addShadowWhispers() {
        const whisperText = document.createElement('div');
        whisperText.className = 'shadow-whispers';
        whisperText.textContent = 'Não lembra... não lembra... não lembra...';
        whisperText.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #8B0000;
            font-size: 24px;
            font-family: 'Nosifer', cursive;
            text-shadow: 0 0 10px #8B0000;
            opacity: 0.7;
            z-index: 8;
            animation: whisperFloat 3s infinite;
        `;
        
        document.getElementById('game-screen').appendChild(whisperText);
        
        setTimeout(() => {
            whisperText.remove();
        }, 3000);
    }

    showTragicMemoryChoices() {
        const memoryChoices = {
            speaker: '',
            text: 'As palavras de Ezra ecoam em sua mente. As sombras sussurram dúvidas. Como você responde?',
            choices: [
                {
                    text: '[Negar] "Não lembro. Se você sabe... fale."',
                    type: 'denial',
                    effect: 'ezraConfidence'
                },
                {
                    text: '[Aceitar] "Eu lembro... e não quero fugir disso."',
                    type: 'acceptance',
                    effect: 'flashback'
                },
                {
                    text: '[Relutante] "Cale a boca. Eu não vou me lembrar disso agora."',
                    type: 'anger',
                    effect: 'terror'
                }
            ]
        };
        
        window.dialogueSystem.showDialogue(memoryChoices);
        
        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(window.dialogueSystem);
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            originalSelectChoice(choiceIndex);
            
            this.storyFlags.tragicMemoryChoice = choiceIndex;
            
            setTimeout(() => {
                window.dialogueSystem.hideDialogue();
                setTimeout(() => {
                    this.processTragicMemoryChoice(choiceIndex);
                }, 500);
            }, 500);
            
            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    processTragicMemoryChoice(choice) {
        switch(choice) {
            case 0: // Negar
                this.storyFlags.ezraConfidence++;
                this.showEzraDescription();
                break;
            case 1: // Aceitar
                this.startFlashbackSequence();
                break;
            case 2: // Relutante
                this.storyFlags.terrorLevel++;
                this.startShadowAttack();
                break;
        }
    }

    showEzraDescription() {
        this.changeCharacterExpression('ezra', 'concerned');
        
        const ezraDialogue = {
            speaker: 'Ezra',
            text: 'O show... o desabamento... as pessoas que morreram enquanto você brilhava no palco. Você estava cantando quando o teto rachou. Teve a chance de avisar todos, mas... continuou sua apresentação.',
            effects: [{ type: 'memoryFragments' }]
        };
        
        window.dialogueSystem.showDialogue(ezraDialogue);
        
        // Usar nextAction para aguardar clique do usuário
        window.dialogueSystem.nextAction = () => {
            this.continueAfterEzraDescription();
        };
    }
    
    continueAfterEzraDescription() {
        const continuation = {
            speaker: '',
            text: 'As memórias se tornam mais claras. O corredor à frente parece se estender infinitamente, e uma névoa estranha começa a se formar atrás de vocês.',
            effects: []
        };
        
        window.dialogueSystem.showDialogue(continuation);
        
        window.dialogueSystem.nextAction = () => {
            this.startFogChase();
        };
    }

    startFlashbackSequence() {
        // Escurecer tela para flashback
        const gameScreen = document.getElementById('game-screen');
        gameScreen.style.filter = 'sepia(1) contrast(1.2)';
        
        const flashbackDialogue = {
            speaker: '',
            text: 'FLASHBACK: Você está no palco, holofotes quentes em seu rosto. O público aplaude. Então você ouve - um estalo sinistro vindo do teto. O que você faz?',
            choices: [
                {
                    text: 'Continuar cantando - o show deve continuar',
                    type: 'selfish',
                    karma: -2
                },
                {
                    text: 'Parar e avisar o público do perigo',
                    type: 'heroic',
                    karma: +2
                }
            ]
        };
        
        window.dialogueSystem.showDialogue(flashbackDialogue);
        
        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(window.dialogueSystem);
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            originalSelectChoice(choiceIndex);
            
            // Atualizar karma baseado na escolha
            if (choiceIndex === 0) {
                window.gameState.adjustKarma(-2);
            } else {
                window.gameState.adjustKarma(2);
            }
            
            setTimeout(() => {
                this.endFlashback();
                window.dialogueSystem.hideDialogue();
            }, 500);
            
            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    endFlashback() {
        const gameScreen = document.getElementById('game-screen');
        gameScreen.style.filter = '';
        
        const postFlashbackDialogue = {
            speaker: '',
            text: 'A memória se fragmenta novamente. Você volta ao presente, mas as lembranças deixaram sua marca. Ezra observa você com uma expressão indecifrável.',
            effects: [{ type: 'memoryFade' }]
        };
        
        window.dialogueSystem.showDialogue(postFlashbackDialogue);
        
        setTimeout(() => {
            window.dialogueSystem.hideDialogue();
            this.startFogChase();
        }, 3000);
    }

    startShadowAttack() {
        this.storyFlags.terrorLevel++;
        
        // Escurecer corredor
        const gameScreen = document.getElementById('game-screen');
        gameScreen.style.filter = 'brightness(0.3)';
        
        // Mostrar sombra
        this.addShadowEffect();
        
        const shadowAttackDialogue = {
            speaker: '',
            text: 'As vozes da Sombra explodem em fúria! O corredor escurece e uma presença terrível se materializa atrás de vocês. CORRA!',
            effects: [{ type: 'shadowAttack' }]
        };
        
        window.dialogueSystem.showDialogue(shadowAttackDialogue);
        
        setTimeout(() => {
            window.dialogueSystem.hideDialogue();
            this.startQuickTimeEvent();
        }, 2000);
    }

    addShadowEffect() {
        const shadow = document.createElement('div');
        shadow.className = 'shadow-entity';
        shadow.style.cssText = `
            position: absolute;
            top: 0;
            right: -100px;
            width: 200px;
            height: 100%;
            background: linear-gradient(to left, rgba(0,0,0,0.9), transparent);
            z-index: 7;
            animation: shadowAdvance 3s ease-out forwards;
        `;
        
        document.getElementById('game-screen').appendChild(shadow);
    }

    startQuickTimeEvent() {
        const qteInterface = document.createElement('div');
        qteInterface.id = 'qte-interface';
        qteInterface.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255,0,0,0.9);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            z-index: 10;
            color: white;
            font-size: 24px;
        `;
        
        qteInterface.innerHTML = `
            <h3>QUICK TIME EVENT!</h3>
            <p>Pressione ESPAÇO rapidamente para fugir!</p>
            <div id="qte-progress" style="
                width: 200px;
                height: 20px;
                background: #333;
                border: 2px solid white;
                margin: 10px auto;
                overflow: hidden;
            ">
                <div id="qte-bar" style="
                    width: 0%;
                    height: 100%;
                    background: #00FF00;
                    transition: width 0.1s;
                "></div>
            </div>
            <p id="qte-timer">5</p>
        `;
        
        document.getElementById('game-screen').appendChild(qteInterface);
        this.runQuickTimeEvent();
    }

    runQuickTimeEvent() {
        let progress = 0;
        let timeLeft = 5;
        let spacePressed = 0;
        const requiredPresses = 10;
        
        const qteBar = document.getElementById('qte-bar');
        const qteTimer = document.getElementById('qte-timer');
        
        // Event listener para espaço
        const spaceHandler = (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                spacePressed++;
                progress = (spacePressed / requiredPresses) * 100;
                qteBar.style.width = `${progress}%`;
                
                if (progress >= 100) {
                    this.successQTE();
                    document.removeEventListener('keydown', spaceHandler);
                    return;
                }
            }
        };
        
        document.addEventListener('keydown', spaceHandler);
        
        // Timer countdown
        const timer = setInterval(() => {
            timeLeft--;
            qteTimer.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                document.removeEventListener('keydown', spaceHandler);
                
                if (progress < 100) {
                    this.failQTE();
                }
            }
        }, 1000);
    }

    successQTE() {
        const qteInterface = document.getElementById('qte-interface');
        if (qteInterface) qteInterface.remove();
        
        // Limpar efeitos
        const gameScreen = document.getElementById('game-screen');
        gameScreen.style.filter = '';
        
        const shadow = document.querySelector('.shadow-entity');
        if (shadow) shadow.remove();
        
        const successDialogue = {
            speaker: '',
            text: 'Vocês correm pelo corredor escuro, a Sombra perdendo terreno. Finalmente chegam a uma área segura, ofegantes mas vivos.',
            effects: [{ type: 'escapeSuccess' }]
        };
        
        window.dialogueSystem.showDialogue(successDialogue);
        
        setTimeout(() => {
            window.dialogueSystem.hideDialogue();
            this.startFogChase();
        }, 3000);
    }

    failQTE() {
        const qteInterface = document.getElementById('qte-interface');
        if (qteInterface) qteInterface.remove();
        
        // Game Over
        const gameOverDialogue = {
            speaker: '',
            text: 'A Sombra os alcança. Dedos gelados como gelo tocam sua nuca. A escuridão consome tudo...',
            effects: [{ type: 'gameOver' }]
        };
        
        window.dialogueSystem.showDialogue(gameOverDialogue);
        
        setTimeout(() => {
            window.gameState.resetToLastCheckpoint();
            window.menuSystem.showScreen('main-menu');
        }, 4000);
    }

    addMemoryFragments() {
        // Adicionar efeitos visuais de memórias fragmentadas
        const fragments = document.createElement('div');
        fragments.className = 'memory-fragments';
        fragments.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 6;
        `;
        
        // Criar vários fragmentos
        for (let i = 0; i < 5; i++) {
            const fragment = document.createElement('div');
            fragment.style.cssText = `
                position: absolute;
                top: ${Math.random() * 80}%;
                left: ${Math.random() * 80}%;
                width: 100px;
                height: 100px;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.3);
                animation: fragmentFloat ${2 + Math.random() * 3}s ease-in-out infinite;
            `;
            fragments.appendChild(fragment);
        }
        
        document.getElementById('game-screen').appendChild(fragments);
        
        setTimeout(() => {
            fragments.remove();
        }, 3000);
    }

    // ====== CORRIDA DA NÉVOA ======
    startFogChase() {
        this.fogChase.isActive = true;
        this.fogChase.playerPosition = 0;
        this.fogChase.fogPosition = -5;
        this.fogChase.timeRemaining = 30;
        
        const introDialogue = {
            speaker: '',
            text: 'De repente, o corredor atrás de vocês se fecha! Uma névoa vermelha e viva avança como uma onda mortal. Vocês precisam correr!',
            effects: [{ type: 'fogChaseStart' }]
        };
        
        window.dialogueSystem.showDialogue(introDialogue);
        
        setTimeout(() => {
            window.dialogueSystem.hideDialogue();
            this.showFogChaseInterface();
        }, 3000);
    }

    showFogChaseInterface() {
        const gameScreen = document.getElementById('game-screen');
        
        // Criar interface da corrida
        const chaseInterface = document.createElement('div');
        chaseInterface.id = 'fog-chase-interface';
        chaseInterface.style.cssText = `
            position: absolute;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #8B0000;
            color: white;
            text-align: center;
            z-index: 10;
            min-width: 400px;
        `;
        
        chaseInterface.innerHTML = `
            <h3>Corrida da Névoa</h3>
            <div id="chase-status">
                <p>Distância da Névoa: <span id="fog-distance">${Math.abs(this.fogChase.playerPosition - this.fogChase.fogPosition)}</span></p>
                <p>Tempo: <span id="chase-timer">${this.fogChase.timeRemaining}s</span></p>
            </div>
            <div id="path-choices" style="margin-top: 20px;">
                <p id="path-description">Você está em um corredor. Para onde seguir?</p>
                <div style="display: flex; gap: 10px; justify-content: center; margin-top: 10px;">
                    <button class="path-choice" data-path="left" style="
                        background: #4A4A4A;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                    ">← Esquerda</button>
                    <button class="path-choice" data-path="forward" style="
                        background: #4A4A4A;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                    ">↑ Frente</button>
                    <button class="path-choice" data-path="right" style="
                        background: #4A4A4A;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                    ">→ Direita</button>
                </div>
            </div>
        `;
        
        gameScreen.appendChild(chaseInterface);
        this.bindFogChaseEvents();
        this.startFogChaseTimer();
    }

    bindFogChaseEvents() {
        const pathButtons = document.querySelectorAll('.path-choice');
        
        pathButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const choice = e.target.dataset.path;
                this.processFogChaseChoice(choice);
            });
        });
    }

    processFogChaseChoice(choice) {
        // Disable buttons temporarily
        const pathButtons = document.querySelectorAll('.path-choice');
        pathButtons.forEach(btn => btn.disabled = true);
        
        // Process choice based on karma and random chance
        const karma = window.gameState.karma;
        let outcome = this.determineFogChaseOutcome(choice, karma);
        
        this.fogChase.playerPosition += outcome.advance;
        this.fogChase.fogPosition += 1; // Fog always advances
        
        this.updateFogChaseDisplay();
        
        setTimeout(() => {
            if (outcome.result === 'death') {
                this.fogChaseGameOver();
            } else if (outcome.result === 'secret') {
                this.discoverSecretRoom();
            } else if (this.fogChase.playerPosition >= this.fogChase.maxDistance) {
                this.escapeFogChase();
            } else if (this.fogChase.fogPosition >= this.fogChase.playerPosition) {
                this.fogChaseGameOver();
            } else {
                this.continueFogChase(outcome.description);
            }
        }, 1000);
    }

    determineFogChaseOutcome(choice, karma) {
        const outcomes = {
            left: [
                { advance: 2, result: 'safe', description: 'O corredor à esquerda está limpo.' },
                { advance: 0, result: 'death', description: 'Beco sem saída! A névoa os alcança.' },
                { advance: 3, result: 'secret', description: 'Você encontra uma sala secreta!' }
            ],
            forward: [
                { advance: 1, result: 'safe', description: 'Você avança pelo corredor principal.' },
                { advance: 2, result: 'safe', description: 'O caminho à frente está desobstruído.' }
            ],
            right: [
                { advance: 2, result: 'safe', description: 'O corredor à direita leva mais longe.' },
                { advance: 0, result: 'death', description: 'Uma armadilha! O chão desaba.' },
                { advance: 4, result: 'secret', description: 'Você encontra um atalho secreto!' }
            ]
        };
        
        const choiceOutcomes = outcomes[choice];
        let selectedOutcome;
        
        if (karma > 5) {
            // Alto karma - vozes guiam para escolhas certas
            selectedOutcome = choiceOutcomes.filter(o => o.result !== 'death')[0] || choiceOutcomes[0];
        } else if (karma < -5) {
            // Baixo karma - vozes enganam
            const chance = Math.random();
            if (chance < 0.4) {
                selectedOutcome = choiceOutcomes.find(o => o.result === 'death') || choiceOutcomes[0];
            } else {
                selectedOutcome = choiceOutcomes[Math.floor(Math.random() * choiceOutcomes.length)];
            }
        } else {
            // Karma neutro - chance equilibrada
            selectedOutcome = choiceOutcomes[Math.floor(Math.random() * choiceOutcomes.length)];
        }
        
        return selectedOutcome;
    }

    updateFogChaseDisplay() {
        const fogDistance = Math.abs(this.fogChase.playerPosition - this.fogChase.fogPosition);
        document.getElementById('fog-distance').textContent = fogDistance;
    }

    continueFogChase(description) {
        const pathDescription = document.getElementById('path-description');
        pathDescription.textContent = description + ' Continue correndo!';
        
        const pathButtons = document.querySelectorAll('.path-choice');
        pathButtons.forEach(btn => btn.disabled = false);
    }

    discoverSecretRoom() {
        const secretDialogue = {
            speaker: '',
            text: 'Você encontra uma sala secreta com suprimentos médicos e munição! Sua saúde é restaurada e você ganha 6 cartuchos.',
            effects: [{ type: 'secretRoom' }]
        };
        
        // Adicionar itens ao inventário
        window.gameState.addAmmo(6);
        window.gameState.flags.healthRestored = true;
        
        window.dialogueSystem.showDialogue(secretDialogue);
        
        setTimeout(() => {
            window.dialogueSystem.hideDialogue();
            this.continueFogChase('Você encontrou suprimentos! Continue.');
        }, 3000);
    }

    fogChaseGameOver() {
        const chaseInterface = document.getElementById('fog-chase-interface');
        if (chaseInterface) chaseInterface.remove();
        
        this.fogChase.isActive = false;
        
        const gameOverDialogue = {
            speaker: '',
            text: 'A névoa vermelha os envolve. Vocês sentem suas memórias se dissolvendo, suas formas se desfazendo na névoa viva...',
            effects: [{ type: 'gameOver' }],
            choices: [
                {
                    text: 'Tentar novamente',
                    type: 'retry'
                },
                {
                    text: 'Voltar ao menu',
                    type: 'menu'
                }
            ]
        };
        
        window.dialogueSystem.showDialogue(gameOverDialogue);
        
        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(window.dialogueSystem);
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            originalSelectChoice(choiceIndex);
            
            setTimeout(() => {
                window.dialogueSystem.hideDialogue();
                if (choiceIndex === 0) {
                    // Tentar novamente
                    this.startFogChase();
                } else {
                    // Voltar ao menu
                    window.menuSystem.showScreen('main-menu');
                }
            }, 500);
            
            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    escapeFogChase() {
        const chaseInterface = document.getElementById('fog-chase-interface');
        if (chaseInterface) chaseInterface.remove();
        
        this.fogChase.isActive = false;
        
        const escapeDialogue = {
            speaker: '',
            text: 'Vocês conseguem! A névoa não consegue seguir além desta porta blindada. Ofegantes, vocês se encontram em uma sala de controle antiga.',
            effects: [{ type: 'escapeSuccess' }]
        };
        
        window.dialogueSystem.showDialogue(escapeDialogue);
        
        setTimeout(() => {
            window.dialogueSystem.hideDialogue();
            this.enterControlRoom();
        }, 4000);
    }

    startFogChaseTimer() {
        const timer = setInterval(() => {
            this.fogChase.timeRemaining--;
            document.getElementById('chase-timer').textContent = `${this.fogChase.timeRemaining}s`;
            
            if (this.fogChase.timeRemaining <= 0) {
                clearInterval(timer);
                this.fogChaseGameOver();
            }
            
            if (!this.fogChase.isActive) {
                clearInterval(timer);
            }
        }, 1000);
    }

    // ====== SALA DE CONTROLE E REVELAÇÃO ======
    enterControlRoom() {
        this.changeBackground('fundocena1', 'fade');
        this.showCharacter('evelly', 'shocked', 'left');
        this.showCharacter('ezra', 'suspicious', 'right');
        
        // Criar interface do painel de controle
        this.createControlPanel();
        
        const controlRoomDialogue = {
            speaker: '',
            text: 'Uma sala de controle antiga, cheia de monitores que ainda funcionam. Um painel central mostra um mapa parcial do HollowMind.',
            effects: [{ type: 'controlRoom' }]
        };
        
        window.dialogueSystem.showDialogue(controlRoomDialogue);
        
        setTimeout(() => {
            window.dialogueSystem.hideDialogue();
            this.showMapRevealation();
        }, 5000);
    }

    createControlPanel() {
        const gameScreen = document.getElementById('game-screen');
        
        const controlPanel = document.createElement('div');
        controlPanel.id = 'control-panel';
        controlPanel.style.cssText = `
            position: absolute;
            bottom: 30%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,50,0,0.9);
            border: 2px solid #00FF00;
            padding: 15px;
            border-radius: 10px;
            color: #00FF00;
            font-family: 'Orbitron', monospace;
            font-size: 12px;
            z-index: 6;
            min-width: 300px;
        `;
        
        controlPanel.innerHTML = `
            <div style="text-align: center; margin-bottom: 10px;">
                <h4>SISTEMA HOLLOWMIND</h4>
                <div style="border: 1px solid #00FF00; padding: 10px; margin: 10px 0;">
                    <p>MAPA DO COMPLEXO</p>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; margin: 10px 0;">
                        <div style="background: #00FF00; height: 20px;"></div>
                        <div style="background: #FF0000; height: 20px;"></div>
                        <div style="background: #00FF00; height: 20px;"></div>
                        <div style="background: #00FF00; height: 20px;"></div>
                        <div style="background: #FFFF00; height: 20px;"></div>
                        <div style="background: #FF0000; height: 20px;"></div>
                        <div style="background: #FF0000; height: 20px;"></div>
                        <div style="background: #FF0000; height: 20px;"></div>
                        <div style="background: #FF0000; height: 20px;"></div>
                    </div>
                    <p style="font-size: 10px;">VERDE: SEGURO | VERMELHO: CONTAMINADO | AMARELO: NÚCLEO</p>
                </div>
                <div style="border: 1px solid #00FF00; padding: 10px;">
                    <p>CHAVE DE ACESSO NECESSÁRIA:</p>
                    <p style="color: #FFFF00; font-size: 14px; font-weight: bold;">EVELLY HOLLOW</p>
                </div>
            </div>
        `;
        
        gameScreen.appendChild(controlPanel);
    }

    showMapRevealation() {
        this.changeCharacterExpression('ezra', 'shocked');
        
        const revelationDialogue = {
            speaker: 'Ezra',
            text: 'Olha isso... não estamos presos só no HollowMind. A névoa se espalhou pela cidade. Se não chegarmos ao Núcleo da Pesquisa, nada vai parar isso.',
            effects: [{ type: 'mapReveal' }]
        };
        
        window.dialogueSystem.showDialogue(revelationDialogue);
        
        setTimeout(() => {
            window.dialogueSystem.hideDialogue();
            this.showBiometricReveal();
        }, 6000);
    }

    showBiometricReveal() {
        // Destacar o nome no painel
        const biometricElement = document.querySelector('#control-panel p[style*="FFFF00"]');
        if (biometricElement) {
            biometricElement.style.animation = 'biometricPulse 2s infinite';
        }
        
        const biometricDialogue = {
            speaker: 'Ezra',
            text: 'E adivinha? A única chave de acesso registrada... é o seu nome, Evelly. Então, me diz. Você era parte do experimento ou só mais uma cobaia?',
            effects: [{ type: 'biometricReveal' }]
        };
        
        window.dialogueSystem.showDialogue(biometricDialogue);
        
        setTimeout(() => {
            window.dialogueSystem.hideDialogue();
            this.triggerTerrorEvent();
        }, 7000);
    }

    // ====== EVENTO DE TERROR ======
    triggerTerrorEvent() {
        this.storyFlags.terrorLevel++;
        this.storyFlags.revealedConnection = true;
        
        // Efeito de som alto
        this.addTerrorEffects();
        
        const terrorDialogue = {
            speaker: '',
            text: 'Antes que Evelly possa responder, os alto-falantes ligam sozinhos. Um grito ensurdecedor ecoa pela sala!',
            effects: [{ type: 'terrorScream' }]
        };
        
        window.dialogueSystem.showDialogue(terrorDialogue);
        
        setTimeout(() => {
            window.dialogueSystem.hideDialogue();
            this.showDistortedImages();
        }, 5000);
    }

    addTerrorEffects() {
        const gameScreen = document.getElementById('game-screen');
        
        // Efeito de tela tremendo
        gameScreen.style.animation = 'screenShake 3s ease-in-out';
        
        // Efeito de luz vermelha piscando
        const redFlash = document.createElement('div');
        redFlash.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: red;
            opacity: 0;
            z-index: 9;
            animation: redFlash 0.5s ease-in-out 6;
        `;
        
        gameScreen.appendChild(redFlash);
        
        setTimeout(() => {
            redFlash.remove();
            gameScreen.style.animation = '';
        }, 3000);
    }

    showDistortedImages() {
        // Simular imagens distorcidas no painel
        const controlPanel = document.getElementById('control-panel');
        if (controlPanel) {
            controlPanel.style.filter = 'hue-rotate(180deg) contrast(2)';
            controlPanel.innerHTML = `
                <div style="text-align: center; color: #FF0000;">
                    <h4>ERRO SISTEMA</h4>
                    <div style="border: 1px solid #FF0000; padding: 10px;">
                        <p style="animation: glitchText 1s infinite;">ACESSO NEGADO</p>
                        <p style="animation: glitchText 1.5s infinite;">MEMÓRIA CORROMPIDA</p>
                        <p style="animation: glitchText 0.8s infinite;">SUJEITO 001: EVELLY</p>
                    </div>
                </div>
            `;
        }
        
        // Mostrar sombra no vidro
        this.addShadowInGlass();
        
        const imagesDialogue = {
            speaker: '',
            text: 'O painel mostra imagens distorcidas do acidente no palco. A Sombra aparece atrás do vidro, batendo palmas lentamente, como aprovando a revelação.',
            effects: [{ type: 'distortedImages' }]
        };
        
        window.dialogueSystem.showDialogue(imagesDialogue);
        
        setTimeout(() => {
            window.dialogueSystem.hideDialogue();
            this.showFinalChoices();
        }, 6000);
    }

    addShadowInGlass() {
        const gameScreen = document.getElementById('game-screen');
        
        const shadowGlass = document.createElement('div');
        shadowGlass.className = 'shadow-in-glass';
        shadowGlass.style.cssText = `
            position: absolute;
            top: 20%;
            right: 10%;
            width: 150px;
            height: 200px;
            background: rgba(0,0,0,0.8);
            border: 2px solid #444;
            border-radius: 5px;
            z-index: 7;
        `;
        
        // Silhueta da sombra
        const shadowSilhouette = document.createElement('div');
        shadowSilhouette.style.cssText = `
            position: absolute;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 120px;
            background: #000;
            clip-path: polygon(40% 0%, 60% 0%, 65% 30%, 80% 30%, 80% 50%, 75% 60%, 85% 70%, 85% 100%, 15% 100%, 15% 70%, 25% 60%, 20% 50%, 20% 30%, 35% 30%);
            animation: shadowClap 2s infinite;
        `;
        
        shadowGlass.appendChild(shadowSilhouette);
        gameScreen.appendChild(shadowGlass);
    }

    // ====== ESCOLHA FINAL DO CAPÍTULO ======
    showFinalChoices() {
        this.changeCharacterExpression('ezra', 'demanding');
        this.changeCharacterExpression('evelly', 'conflicted');
        
        const finalDialogue = {
            speaker: 'Ezra',
            text: 'Decide logo, Evelly. Vai me dizer quem diabos você é... ou vamos correr até não restar nada pra salvar?',
            choices: [
                {
                    text: '[Enfrentar a Verdade] Exigir respostas e encarar a ligação com o HollowMind',
                    type: 'truth',
                    nextChapter: '4a'
                },
                {
                    text: '[Negar e Fugir] Entrar em pânico e forçar fuga imediata',
                    type: 'denial',
                    nextChapter: '4b'
                }
            ]
        };
        
        window.dialogueSystem.showDialogue(finalDialogue);
        
        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(window.dialogueSystem);
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            originalSelectChoice(choiceIndex);
            
            this.storyFlags.finalChoice = choiceIndex;
            window.gameState.flags.chapter3Choice = choiceIndex;
            
            setTimeout(() => {
                window.dialogueSystem.hideDialogue();
                setTimeout(() => {
                    this.finishChapter3(choiceIndex);
                }, 500);
            }, 500);
            
            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    finishChapter3(choice) {
        // Explosão do painel
        this.explodeControlPanel();
        
        let endingText;
        if (choice === 0) {
            endingText = 'Evelly decide enfrentar a verdade sobre sua ligação com o HollowMind. O próximo capítulo revelará os segredos do laboratório...';
            window.gameState.flags.truthPath = true;
        } else {
            endingText = 'Evelly entra em pânico e força a fuga. O próximo capítulo os levará pela cidade consumida pela névoa...';
            window.gameState.flags.denialPath = true;
        }
        
        // Auto-save
        window.gameState.progressToNextChapter();
        window.saveSystem.autoSave();
        
        const chapterEndDialogue = {
            speaker: '',
            text: `Fim do Capítulo 3: A Tragédia Esquecida. ${endingText}`,
            choices: [
                {
                    text: 'Continuar para o Capítulo 4',
                    type: 'neutral',
                    nextChapter: 4
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
                    // Tentar carregar Capítulo 4 (quando implementado)
                    if (window.gameController && window.gameController.loadChapter) {
                        window.gameController.loadChapter(4);
                    } else {
                        alert('Capítulo 4 será implementado em breve!');
                        window.menuSystem?.showScreen('main-menu');
                    }
                } else {
                    window.menuSystem?.showScreen('main-menu');
                }
                window.dialogueSystem.hideDialogue();
            }, 500);
            
            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    explodeControlPanel() {
        const controlPanel = document.getElementById('control-panel');
        if (controlPanel) {
            // Efeito de explosão
            controlPanel.style.animation = 'panelExplode 2s ease-out forwards';
            
            // Criar faíscas
            for (let i = 0; i < 10; i++) {
                const spark = document.createElement('div');
                spark.style.cssText = `
                    position: absolute;
                    top: ${controlPanel.offsetTop + Math.random() * 100}px;
                    left: ${controlPanel.offsetLeft + Math.random() * 200}px;
                    width: 3px;
                    height: 3px;
                    background: #FFD700;
                    animation: sparkFly ${1 + Math.random()}s ease-out forwards;
                    z-index: 11;
                `;
                document.getElementById('game-screen').appendChild(spark);
                
                setTimeout(() => spark.remove(), 2000);
            }
            
            setTimeout(() => {
                controlPanel.remove();
            }, 2000);
        }
    }

    // ====== MÉTODO PRINCIPAL DO CAPÍTULO ======
    async loadChapter() {
        console.log('Loading Chapter 3: A Tragédia Esquecida');
        
        // Limpar tela
        this.clearScreen();
        
        // Narrativa inicial
        await this.showOpeningNarrative();
        
        // Entrar no teatro
        await this.enterTheater();
        
        // Iniciar puzzle do piano
        this.startPianoPuzzle();
    }

    async showOpeningNarrative() {
        this.changeBackground('fundocena3', 'fade');
        
        const openingDialogue = {
            speaker: '',
            text: 'O silêncio da sala de poltronas parece mais sufocante do que os gritos. O palco à frente, vazio, iluminado por um holofote único, dá a impressão de que sempre houve alguém sentado lá. Esperando Evelly.',
            effects: [{ type: 'fadeFromBlack', duration: 3000 }],
            choices: [{
                text: 'Continuar...',
                type: 'neutral'
            }]
        };
        
        window.dialogueSystem.showDialogue(openingDialogue);
        
        return new Promise(resolve => {
            const originalSelectChoice = window.dialogueSystem.selectChoice.bind(window.dialogueSystem);
            window.dialogueSystem.selectChoice = (choiceIndex) => {
                originalSelectChoice(choiceIndex);
                setTimeout(() => {
                    window.dialogueSystem.hideDialogue();
                    resolve();
                }, 500);
                window.dialogueSystem.selectChoice = originalSelectChoice;
            };
        });
    }

    async enterTheater() {
        this.changeBackground('fundocena3', 'fade');
        this.showCharacter('evelly', 'nervous', 'left');
        this.showCharacter('ezra', 'cautious', 'right');
        
        // Adicionar efeitos do teatro
        this.addTheaterEffect();
        this.addMannequinsEffect();
        
        const theaterDialogue = {
            speaker: '',
            text: 'Evelly e Ezra avançam pela sala das poltronas. Os assentos parecem ocupados, mas, ao se aproximar, notam que são apenas manequins queimados, de rostos derretidos, todos voltados para o palco. O chão de madeira range como um tablado antigo.',
            effects: [{ type: 'theaterAmbience' }],
            choices: [{
                text: 'Continuar...',
                type: 'neutral'
            }]
        };
        
        window.dialogueSystem.showDialogue(theaterDialogue);
        
        return new Promise(resolve => {
            const originalSelectChoice = window.dialogueSystem.selectChoice.bind(window.dialogueSystem);
            window.dialogueSystem.selectChoice = (choiceIndex) => {
                originalSelectChoice(choiceIndex);
                setTimeout(() => {
                    window.dialogueSystem.hideDialogue();
                    resolve();
                }, 500);
                window.dialogueSystem.selectChoice = originalSelectChoice;
            };
        });
    }

    clearScreen() {
        // Limpar personagens
        Object.keys(this.currentCharacters).forEach(name => {
            this.hideCharacter(name);
        });
        
        // Limpar efeitos especiais
        const gameScreen = document.getElementById('game-screen');
        const effects = gameScreen.querySelectorAll('.theater-spotlight, .mannequin, .shadow-entity, .memory-fragments, .shadow-in-glass');
        effects.forEach(effect => effect.remove());
        
        // Limpar interfaces
        const interfaces = gameScreen.querySelectorAll('#piano-interface, #fog-chase-interface, #control-panel, #qte-interface');
        interfaces.forEach(gameInterface => gameInterface.remove());
        
        // Resetar filtros
        gameScreen.style.filter = '';
        gameScreen.style.animation = '';
    }

    // Método para limpar efeitos quando o capítulo termina
    cleanup() {
        this.clearScreen();
        this.pianoPuzzle.isActive = false;
        this.fogChase.isActive = false;
    }
}

// Registrar globalmente para o sistema de capítulos
window.Chapter3 = Chapter3;

// Adicionar estilos CSS necessários
const chapterStyles = document.createElement('style');
chapterStyles.textContent = `
    @keyframes whisperFloat {
        0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
        50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
    }
    
    @keyframes fragmentFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
        50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
    }
    
    @keyframes shadowAdvance {
        0% { right: -100px; }
        100% { right: 20px; }
    }
    
    @keyframes shadowClap {
        0%, 100% { transform: translateX(-50%) scaleX(1); }
        50% { transform: translateX(-50%) scaleX(0.8); }
    }
    
    @keyframes screenShake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
        20%, 40%, 60%, 80% { transform: translateX(2px); }
    }
    
    @keyframes redFlash {
        0%, 100% { opacity: 0; }
        50% { opacity: 0.6; }
    }
    
    @keyframes glitchText {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-2px); }
        40% { transform: translateX(2px); }
        60% { transform: translateX(-1px); }
        80% { transform: translateX(1px); }
    }
    
    @keyframes biometricPulse {
        0%, 100% { transform: scale(1); color: #FFFF00; }
        50% { transform: scale(1.1); color: #FF0000; }
    }
    
    @keyframes panelExplode {
        0% { transform: translateX(-50%) scale(1); opacity: 1; }
        50% { transform: translateX(-50%) scale(1.2); opacity: 0.8; }
        100% { transform: translateX(-50%) scale(0.8); opacity: 0; }
    }
    
    @keyframes sparkFly {
        0% { transform: translate(0, 0) scale(1); opacity: 1; }
        100% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0); opacity: 0; }
    }
`;

document.head.appendChild(chapterStyles);