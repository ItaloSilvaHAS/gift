class Chapter5 {
    constructor() {
        this.name = 'O Coração do HollowMind';
        this.totalScenes = 12;
        this.currentCharacters = {};
        this.inventory = {
            hasKey: false,
            hasScrewdriver: false,
            hasKeycard: false
        };
        this.locations = {
            currentLocation: 'hub',
            visitedLocations: []
        };
        this.elevatorFixed = false;
        this.erzaKnockedOut = false;
    }

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
            default:
                element.style.left = '50%';
                element.style.transform = 'translateX(-50%)';
                break;
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

    changeBackground(imageName, transitionType = 'fade') {
        const background = document.getElementById('background');
        
        let imagePath;
        if (imageName.includes('.')) {
            imagePath = `./assets/images/backgrounds/${imageName}`;
        } else {
            imagePath = `./assets/images/backgrounds/${imageName}.jpg`;
        }
        
        if (transitionType === 'fade') {
            background.style.transition = 'opacity 1s ease';
            background.style.opacity = '0';
            
            setTimeout(() => {
                background.style.backgroundImage = `url('${imagePath}')`;
                background.style.opacity = '1';
            }, 1000);
        } else {
            background.style.backgroundImage = `url('${imagePath}')`;
        }
    }

    clearScreen() {
        Object.keys(this.currentCharacters).forEach(char => {
            this.hideCharacter(char);
        });
        
        const effectsDiv = document.getElementById('effects');
        if (effectsDiv) {
            effectsDiv.innerHTML = '';
        }
    }

    async start() {
        console.log('Iniciando Capítulo 5: O Coração do HollowMind');
        
        window.gameState.currentChapter = 5;
        window.gameState.currentScene = 1;
        
        this.clearScreen();
        this.changeBackground('cap55.jpg', 'fade');
        
        setTimeout(() => {
            this.scene1_HubIntroduction();
        }, 1500);
    }

    scene1_HubIntroduction() {
        const hubIntro = {
            speaker: '',
            text: 'O hub de HollowMind se estende à sua frente. Um lugar assustadoramente comum - como qualquer hospital. Mas você sente que há algo errado. Muito errado.',
            effects: [{ type: 'ambient' }]
        };

        window.dialogueSystem.showDialogue(hubIntro);
        
        window.dialogueSystem.setNextAction(() => {
            this.hubNavigation();
        });
    }

    hubNavigation() {
        const choices = [
            {
                text: 'Ir até o balcão da recepção',
                type: 'reception',
                karma: 0
            },
            {
                text: 'Investigar o elevador quebrado',
                type: 'elevator',
                karma: 0
            },
            {
                text: 'Explorar as salas de espera',
                type: 'waiting_rooms',
                karma: 0
            }
        ];

        if (this.inventory.hasKey) {
            choices.push({
                text: 'Tentar usar a chave na porta de saída',
                type: 'exit_door',
                karma: 0
            });
        }

        const navDialogue = {
            speaker: '',
            text: 'Para onde você quer ir?',
            choices: choices
        };

        window.dialogueSystem.showDialogue(navDialogue);
        
        window.dialogueSystem.setNextAction((choice) => {
            this.handleNavigation(choice);
        });
    }

    handleNavigation(choice) {
        const choiceType = choice?.type || 'reception';
        
        switch(choiceType) {
            case 'reception':
                this.exploreReception();
                break;
            case 'elevator':
                this.exploreElevator();
                break;
            case 'waiting_rooms':
                this.exploreWaitingRooms();
                break;
            case 'exit_door':
                this.tryExitDoor();
                break;
            default:
                this.exploreReception();
        }
    }

    // ==================== RECEPÇÃO ====================

    exploreReception() {
        this.locations.currentLocation = 'reception';
        
        const receptionDialogue = {
            speaker: '',
            text: 'O balcão da recepção está coberto de poeira. Papéis antigos espalhados. Um computador quebrado. Mas algo brilha embaixo de uma pilha de documentos...',
            choices: [
                {
                    text: 'Investigar o que está brilhando',
                    type: 'investigate_shine',
                    karma: 5
                },
                {
                    text: 'Procurar nos arquivos',
                    type: 'search_files',
                    karma: 3
                },
                {
                    text: 'Voltar ao hub central',
                    type: 'back_to_hub',
                    karma: 0
                }
            ]
        };

        window.dialogueSystem.showDialogue(receptionDialogue);
        
        window.dialogueSystem.setNextAction((choice) => {
            if (choice?.type === 'investigate_shine') {
                this.findKeycard();
            } else if (choice?.type === 'search_files') {
                this.searchFiles();
            } else {
                this.hubNavigation();
            }
        });
    }

    findKeycard() {
        if (this.inventory.hasKeycard) {
            const alreadyHaveDialogue = {
                speaker: '',
                text: 'Você já pegou o cartão-chave daqui.',
                choices: [{ text: 'Voltar', type: 'back' }]
            };
            window.dialogueSystem.showDialogue(alreadyHaveDialogue);
            window.dialogueSystem.setNextAction(() => this.hubNavigation());
            return;
        }

        this.inventory.hasKeycard = true;
        
        const keycardDialogue = {
            speaker: '',
            text: 'Você encontrou um CARTÃO-CHAVE! Está escrito: "ACESSO - PAINEL DE MANUTENÇÃO". Isso pode ser útil...',
            choices: [{ text: 'Continuar explorando', type: 'continue' }]
        };

        window.dialogueSystem.showDialogue(keycardDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.hubNavigation();
        });
    }

    searchFiles() {
        const filesDialogue = {
            speaker: '',
            text: 'Os arquivos falam sobre o "Projeto Marionete" - experimentos com pacientes traumatizados. Você encontra uma pasta marcada "EXPERIMENTO NÉVOA"...',
            choices: [{ text: 'Abrir a pasta', type: 'open_folder' }]
        };

        window.dialogueSystem.showDialogue(filesDialogue);
        window.dialogueSystem.setNextAction(() => this.readFogExperiment());
    }

    readFogExperiment() {
        const fogDialogue = {
            speaker: '',
            text: '"EXPERIMENTO NÉVOA - PACIENTE Nº2: E.V., 24 anos. Trauma severo após evento de incêndio com múltiplas vítimas. Culpa extrema. Dissociação da realidade. Objetivo: Indução de névoa mental através de exposição controlada a gatilhos traumáticos. Resultados: Paciente demonstra fragmentação de personalidade. Esquizofrenia induzida progredindo conforme esperado. Recomendação: Continuar experimentos até colapso total da psique."',
            effects: [{ type: 'horror' }]
        };

        window.dialogueSystem.showDialogue(fogDialogue);
        window.dialogueSystem.setNextAction(() => this.afterReadingFiles());
    }

    afterReadingFiles() {
        const reactionDialogue = {
            speaker: 'Evelly',
            text: 'Não... não... ELES FIZERAM ISSO COMIGO?! Isso explica tudo... as vozes, as alucinações, a sensação de estar perdendo a sanidade... Eles me torturaram. Me transformaram em um experimento.',
            choices: [{ text: 'Voltar ao hub', type: 'back' }]
        };

        window.dialogueSystem.showDialogue(reactionDialogue);
        window.dialogueSystem.setNextAction(() => this.hubNavigation());
    }

    // ==================== SALAS DE ESPERA ====================

    exploreWaitingRooms() {
        this.locations.currentLocation = 'waiting_rooms';
        
        const waitingDialogue = {
            speaker: '',
            text: 'As salas de espera estão desertas. Cadeiras viradas, revistas velhas no chão. Mas em uma das salas, você nota algo escondido atrás de um vaso de plantas mortas...',
            choices: [
                {
                    text: 'Investigar atrás do vaso',
                    type: 'investigate_vase',
                    karma: 5
                },
                {
                    text: 'Procurar em outros lugares',
                    type: 'search_elsewhere',
                    karma: 0
                },
                {
                    text: 'Voltar ao hub',
                    type: 'back',
                    karma: 0
                }
            ]
        };

        window.dialogueSystem.showDialogue(waitingDialogue);
        
        window.dialogueSystem.setNextAction((choice) => {
            if (choice?.type === 'investigate_vase') {
                this.findKey();
            } else if (choice?.type === 'search_elsewhere') {
                this.searchElsewhere();
            } else {
                this.hubNavigation();
            }
        });
    }

    findKey() {
        if (this.inventory.hasKey) {
            const alreadyHaveDialogue = {
                speaker: '',
                text: 'Você já pegou a chave daqui.',
                choices: [{ text: 'Voltar', type: 'back' }]
            };
            window.dialogueSystem.showDialogue(alreadyHaveDialogue);
            window.dialogueSystem.setNextAction(() => this.hubNavigation());
            return;
        }

        this.inventory.hasKey = true;
        
        const keyDialogue = {
            speaker: '',
            text: 'Você encontrou uma CHAVE MISTERIOSA! Ela parece antiga e tem um símbolo estranho gravado. Onde ela se encaixa?',
            choices: [{ text: 'Guardar a chave e continuar', type: 'continue' }]
        };

        window.dialogueSystem.showDialogue(keyDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaWarningAboutKey();
        });
    }

    erzaWarningAboutKey() {
        this.hubNavigation();
    }

    searchElsewhere() {
        const elsewhereDialogue = {
            speaker: '',
            text: 'Você não encontra nada de útil nas outras salas. Apenas sombras e silêncio.',
            choices: [{ text: 'Voltar', type: 'back' }]
        };

        window.dialogueSystem.showDialogue(elsewhereDialogue);
        window.dialogueSystem.setNextAction(() => this.hubNavigation());
    }

    // ==================== PORTA DE SAÍDA (TRAP) ====================

    tryExitDoor() {
        if (!this.erzaKnockedOut) {
            this.erzaTriesToStop();
        } else {
            this.proceedToExitDoor();
        }
    }

    erzaTriesToStop() {
        this.clearScreen();
        
        setTimeout(() => {
            this.showCharacter('ezra', 'angry', 'right');
            
            const erzaStopDialogue = {
                speaker: 'Ezra',
                text: 'EVELLY, NÃO! Você não pode fugir! Isso não vai funcionar! Precisamos enfrentar isso juntas!',
                choices: [
                    {
                        text: 'Convencer Erza que você precisa tentar',
                        type: 'convince',
                        karma: 5
                    },
                    {
                        text: 'Nocautear Erza e seguir sozinha',
                        type: 'knockout',
                        karma: -15
                    },
                    {
                        text: 'Reconsiderar e voltar',
                        type: 'reconsider',
                        karma: 10
                    }
                ]
            };

            window.dialogueSystem.showDialogue(erzaStopDialogue);
            
            window.dialogueSystem.setNextAction((choice) => {
                if (choice?.type === 'knockout') {
                    this.knockoutErza();
                } else if (choice?.type === 'convince') {
                    this.convinceErza();
                } else {
                    this.hubNavigation();
                }
            });
        }, 200);
    }

    knockoutErza() {
        this.erzaKnockedOut = true;
        this.hideCharacter('ezra');
        
        window.gameState.adjustKarma(-20, 'Nocauteou Erza');
        
        const knockoutDialogue = {
            speaker: '',
            text: 'Você empurra Erza com força. Ela bate a cabeça e cai inconsciente. Os sinais de sua loucura estão cada vez mais claros. Você está sozinha agora.',
            effects: [{ type: 'madness' }]
        };

        window.dialogueSystem.showDialogue(knockoutDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.proceedToExitDoor();
        });
    }

    convinceErza() {
        const convinceDialogue = {
            speaker: 'Evelly',
            text: 'Erza, eu PRECISO tentar. Se não funcionar, tentaremos outra coisa. Mas preciso saber... por favor.',
            choices: [{ text: 'Continuar', type: 'continue' }]
        };

        window.dialogueSystem.showDialogue(convinceDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaReluctantlyAgrees();
        });
    }

    erzaReluctantlyAgrees() {
        this.showCharacter('ezra', 'sad', 'right');
        
        const agreeDialogue = {
            speaker: 'Ezra',
            text: '...Tudo bem. Mas prometa que se algo der errado, você vai me ouvir. Promete?',
            choices: [{ text: 'Eu prometo', type: 'promise' }]
        };

        window.dialogueSystem.showDialogue(agreeDialogue);
        window.dialogueSystem.setNextAction(() => this.proceedToExitDoor());
    }

    proceedToExitDoor() {
        const doorDialogue = {
            speaker: '',
            text: 'Você se aproxima da porta de saída. A luz verde brilha tentadoramente. LIBERDADE. Você insere a chave na fechadura...',
            effects: [{ type: 'tension' }]
        };

        window.dialogueSystem.showDialogue(doorDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.triggerExitJumpscare();
        });
    }

    triggerExitJumpscare() {
        setTimeout(() => {
            window.gameController.showRandomJumpscare(4000, () => {
                this.afterExitJumpscare();
            });
        }, 1500);
    }

    afterExitJumpscare() {
        window.gameState.adjustKarma(-10, 'Tentou fugir');
        
        const afterDialogue = {
            speaker: '',
            text: 'A porta EXPLODE em sua cara. Gritos ensurdecedores. Imagens de fogo e morte. Você cai no chão, tremendo. FUGIR É INÚTIL. A mensagem está clara.',
            effects: [{ type: 'trauma' }]
        };

        window.dialogueSystem.showDialogue(afterDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            if (!this.erzaKnockedOut) {
                this.erzaHelpsAfterJumpscare();
            } else {
                this.aloneAfterJumpscare();
            }
        });
    }

    erzaHelpsAfterJumpscare() {
        const helpDialogue = {
            speaker: 'Evelly',
            text: 'Fugir não é a resposta... Preciso ENFRENTAR isso! O elevador... talvez seja o caminho!',
            choices: [{ text: 'Continuar', type: 'continue' }]
        };

        window.dialogueSystem.showDialogue(helpDialogue);
        window.dialogueSystem.setNextAction(() => this.hubNavigation());
    }

    aloneAfterJumpscare() {
        const aloneDialogue = {
            speaker: 'Evelly',
            text: '...Erza estava certa. Eu deveria ter ouvido. Mas agora estou sozinha. Preciso consertar isso. O elevador... é a única saída.',
            choices: [{ text: 'Continuar', type: 'continue' }]
        };

        window.dialogueSystem.showDialogue(aloneDialogue);
        window.dialogueSystem.setNextAction(() => this.hubNavigation());
    }

    // ==================== ELEVADOR ====================

    exploreElevator() {
        this.locations.currentLocation = 'elevator';
        
        if (!this.inventory.hasKeycard) {
            this.elevatorNeedsKeycard();
        } else {
            this.elevatorWithKeycard();
        }
    }

    elevatorNeedsKeycard() {
        const noKeycardDialogue = {
            speaker: '',
            text: 'O elevador está apagado. Há um painel de manutenção ao lado, mas está trancado. Você precisa de um cartão-chave para abrir.',
            choices: [{ text: 'Voltar e procurar o cartão', type: 'back' }]
        };

        window.dialogueSystem.showDialogue(noKeycardDialogue);
        window.dialogueSystem.setNextAction(() => this.hubNavigation());
    }

    elevatorWithKeycard() {
        const keycardDialogue = {
            speaker: '',
            text: 'Você usa o cartão-chave no painel de manutenção. Ele se abre revelando fios coloridos e um teclado numérico. Você pode tentar consertar o elevador!',
            choices: [
                {
                    text: 'Tentar consertar o elevador',
                    type: 'fix_elevator',
                    karma: 10
                },
                {
                    text: 'Voltar e explorar mais',
                    type: 'back',
                    karma: 0
                }
            ]
        };

        window.dialogueSystem.showDialogue(keycardDialogue);
        
        window.dialogueSystem.setNextAction((choice) => {
            if (choice?.type === 'fix_elevator') {
                this.startElevatorMinigame();
            } else {
                this.hubNavigation();
            }
        });
    }

    // ==================== MINIGAME DO ELEVADOR ====================

    startElevatorMinigame() {
        const minigameIntro = {
            speaker: '',
            text: 'Você precisa reconectar os fios na ordem correta e inserir o código de reset. Concentre-se!',
            effects: [{ type: 'challenge' }]
        };

        window.dialogueSystem.showDialogue(minigameIntro);
        
        window.dialogueSystem.setNextAction(() => {
            this.runElevatorWiringGame();
        });
    }

    runElevatorWiringGame() {
        const effectsDiv = document.getElementById('effects');
        
        const minigameContainer = document.createElement('div');
        minigameContainer.id = 'elevator-minigame';
        minigameContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.95);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #00ff00;
            font-family: 'Orbitron', monospace;
        `;

        const correctCode = '4825';
        let playerCode = '';

        minigameContainer.innerHTML = `
            <h2 style="font-size: 2rem; margin-bottom: 2rem; text-shadow: 0 0 10px #00ff00;">
                PAINEL DE MANUTENÇÃO DO ELEVADOR
            </h2>
            <div id="code-display" style="font-size: 3rem; margin-bottom: 2rem; letter-spacing: 1rem; min-width: 300px; text-align: center; border: 2px solid #00ff00; padding: 1rem; pointer-events: none;">
                ----
            </div>
            <p style="margin-bottom: 2rem; color: #ffaa00; pointer-events: none;">
                Dica: O código está nos arquivos da recepção. Tente 4825.
            </p>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; pointer-events: auto;">
                <button class="num-btn" data-num="1" style="width: 60px; height: 60px; font-size: 1.5rem; background: #111; color: #00ff00; border: 2px solid #00ff00; cursor: pointer; pointer-events: auto;">1</button>
                <button class="num-btn" data-num="2" style="width: 60px; height: 60px; font-size: 1.5rem; background: #111; color: #00ff00; border: 2px solid #00ff00; cursor: pointer; pointer-events: auto;">2</button>
                <button class="num-btn" data-num="3" style="width: 60px; height: 60px; font-size: 1.5rem; background: #111; color: #00ff00; border: 2px solid #00ff00; cursor: pointer; pointer-events: auto;">3</button>
                <button class="num-btn" data-num="4" style="width: 60px; height: 60px; font-size: 1.5rem; background: #111; color: #00ff00; border: 2px solid #00ff00; cursor: pointer; pointer-events: auto;">4</button>
                <button class="num-btn" data-num="5" style="width: 60px; height: 60px; font-size: 1.5rem; background: #111; color: #00ff00; border: 2px solid #00ff00; cursor: pointer; pointer-events: auto;">5</button>
                <button class="num-btn" data-num="6" style="width: 60px; height: 60px; font-size: 1.5rem; background: #111; color: #00ff00; border: 2px solid #00ff00; cursor: pointer; pointer-events: auto;">6</button>
                <button class="num-btn" data-num="7" style="width: 60px; height: 60px; font-size: 1.5rem; background: #111; color: #00ff00; border: 2px solid #00ff00; cursor: pointer; pointer-events: auto;">7</button>
                <button class="num-btn" data-num="8" style="width: 60px; height: 60px; font-size: 1.5rem; background: #111; color: #00ff00; border: 2px solid #00ff00; cursor: pointer; pointer-events: auto;">8</button>
                <button class="num-btn" data-num="9" style="width: 60px; height: 60px; font-size: 1.5rem; background: #111; color: #00ff00; border: 2px solid #00ff00; cursor: pointer; pointer-events: auto;">9</button>
                <button id="clear-btn" style="width: 60px; height: 60px; font-size: 1.2rem; background: #aa0000; color: #fff; border: 2px solid #ff0000; cursor: pointer; pointer-events: auto;">CLR</button>
                <button class="num-btn" data-num="0" style="width: 60px; height: 60px; font-size: 1.5rem; background: #111; color: #00ff00; border: 2px solid #00ff00; cursor: pointer; pointer-events: auto;">0</button>
                <button id="enter-btn" style="width: 60px; height: 60px; font-size: 1.2rem; background: #006600; color: #fff; border: 2px solid #00ff00; cursor: pointer; pointer-events: auto;">OK</button>
            </div>
        `;

        effectsDiv.appendChild(minigameContainer);

        const codeDisplay = document.getElementById('code-display');
        const numButtons = document.querySelectorAll('.num-btn');
        const clearBtn = document.getElementById('clear-btn');
        const enterBtn = document.getElementById('enter-btn');

        numButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (playerCode.length < 4) {
                    playerCode += btn.dataset.num;
                    codeDisplay.textContent = playerCode.padEnd(4, '-');
                }
            });
        });

        clearBtn.addEventListener('click', () => {
            playerCode = '';
            codeDisplay.textContent = '----';
        });

        enterBtn.addEventListener('click', () => {
            this.checkElevatorCode(playerCode, correctCode, minigameContainer);
        });
    }

    checkElevatorCode(playerCode, correctCode, container) {
        const codeDisplay = document.getElementById('code-display');
        
        if (playerCode === correctCode) {
            codeDisplay.style.color = '#00ff00';
            codeDisplay.textContent = '✓ OK ✓';
            
            setTimeout(() => {
                container.remove();
                this.elevatorFixed = true;
                this.elevatorMinigameSuccess();
            }, 1500);
        } else {
            codeDisplay.style.color = '#ff0000';
            codeDisplay.textContent = 'ERRO';
            
            setTimeout(() => {
                container.remove();
                this.elevatorMinigameFailure();
            }, 1500);
        }
    }

    elevatorMinigameSuccess() {
        window.gameState.adjustKarma(20, 'Elevador consertado');
        
        const successDialogue = {
            speaker: '',
            text: 'O elevador ganha vida! Luzes piscam, um zumbido mecânico ressoa. As portas se abrem lentamente, revelando um interior escuro. É hora de descer ao coração do HollowMind.',
            effects: [{ type: 'success' }]
        };

        window.dialogueSystem.showDialogue(successDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.finalChoice();
        });
    }

    elevatorMinigameFailure() {
        window.gameState.adjustKarma(-5, 'Falha no elevador');
        
        const failureDialogue = {
            speaker: '',
            text: 'Código incorreto! O painel emite faíscas. Algo está vindo...',
            effects: [{ type: 'danger' }]
        };

        window.dialogueSystem.showDialogue(failureDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            window.gameController.showRandomJumpscare(2000, () => {
                this.afterElevatorJumpscare();
            });
        });
    }

    afterElevatorJumpscare() {
        const afterDialogue = {
            speaker: '',
            text: 'Você recupera o fôlego. Precisa tentar de novo. O código deve estar em algum lugar...',
            choices: [{ text: 'Tentar novamente', type: 'retry' }]
        };

        window.dialogueSystem.showDialogue(afterDialogue);
        window.dialogueSystem.setNextAction(() => this.hubNavigation());
    }

    // ==================== ESCOLHA FINAL ====================

    finalChoice() {
        if (!this.erzaKnockedOut) {
            this.finalChoiceWithErza();
        } else {
            this.finalChoiceAlone();
        }
    }

    finalChoiceWithErza() {
        const erzaFinalDialogue = {
            speaker: 'Evelly',
            text: 'Este elevador vai me levar ao núcleo. Ao coração de tudo isso. Estou pronta. O tormento só vai acabar se eu enfrentá-lo.',
            choices: [
                {
                    text: 'Entrar no elevador',
                    type: 'face_it',
                    karma: 15
                }
            ]
        };

        window.dialogueSystem.showDialogue(erzaFinalDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.enterElevator();
        });
    }

    finalChoiceAlone() {
        const aloneChoiceDialogue = {
            speaker: 'Evelly',
            text: 'Estou sozinha agora. Mas isso é culpa minha. O elevador me espera. Não há mais volta. O tormento só vai acabar quando eu enfrentá-lo de frente.',
            choices: [
                {
                    text: 'Entrar no elevador sozinha',
                    type: 'alone',
                    karma: 5
                }
            ]
        };

        window.dialogueSystem.showDialogue(aloneChoiceDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.enterElevator();
        });
    }

    enterElevator() {
        this.changeBackground('elevador5.png', 'fade');
        
        const enterDialogue = {
            speaker: '',
            text: 'Você entra no elevador. As portas se fecham atrás de você. Um único botão brilha: "SUBSOLO - NÚCLEO".',
            effects: [{ type: 'descent' }]
        };

        window.dialogueSystem.showDialogue(enterDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyReflection();
        });
    }

    evellyReflection() {
        const reflectionDialogue = {
            speaker: 'Evelly (Pensamento)',
            text: 'Eu acordei aqui... neste lugar estranho. A Erza estava comigo desde o início, instigando-me a avançar, a explorar, a descobrir a verdade. Tudo parece tão lúdico e ao mesmo tempo tão real...'
        };

        window.dialogueSystem.showDialogue(reflectionDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyLooksAtErza();
        });
    }

    evellyLooksAtErza() {
        const lookDialogue = {
            speaker: 'Evelly (Pensamento)',
            text: 'Eu olho ao meu redor. Por um momento... tudo parece derreter como cera. As paredes se distorcem, derretem, reformam. Eu fecho os olhos com força e...'
        };

        window.dialogueSystem.showDialogue(lookDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.criticalChoice();
        });
    }

    criticalChoice() {
        const choices = [];
        
        if (!this.erzaKnockedOut) {
            choices.push({
                text: 'Sacar a arma e atirar em Erza',
                type: 'shoot_erza',
                karma: -50
            });
        }

        choices.push({
            text: 'Seguir em frente',
            type: 'continue_chapter6',
            karma: 10
        });

        const choiceDialogue = {
            speaker: '',
            text: 'Algo não está certo. Você sente um peso no peito. Uma escolha crucial se apresenta.',
            choices: choices
        };

        window.dialogueSystem.showDialogue(choiceDialogue);
        
        window.dialogueSystem.setNextAction((choice) => {
            if (choice && choice.type === 'shoot_erza') {
                this.shootErza_BadEnding();
            } else {
                this.endChapter5();
            }
        });
    }

    shootErza_BadEnding() {
        window.audioManager?.playSound('gunshot');
        
        const shootDialogue = {
            speaker: '',
            text: 'BANG! O tiro ecoa no elevador. E então... tudo começa a desmoronar.'
        };

        window.dialogueSystem.showDialogue(shootDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.realityCollapse();
        });
    }

    realityCollapse() {
        const background = document.getElementById('background');
        background.style.transition = 'all 2s ease';
        background.style.opacity = '0';
        background.style.filter = 'blur(20px)';

        const collapseDialogue = {
            speaker: '',
            text: 'As paredes derretem. O chão se dissolve. Você está caindo... caindo... caindo em um VAZIO absoluto.'
        };

        window.dialogueSystem.showDialogue(collapseDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.voidScene();
        });
    }

    voidScene() {
        const background = document.getElementById('background');
        background.style.backgroundImage = 'none';
        background.style.backgroundColor = '#000000';
        background.style.opacity = '1';
        background.style.filter = 'none';

        const voidDialogue = {
            speaker: '',
            text: 'Escuridão absoluta. Silêncio ensurdecedor. Você não sente seu corpo. Não sente nada. Apenas... vazio.'
        };

        window.dialogueSystem.showDialogue(voidDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.shadowAppears();
        });
    }

    shadowAppears() {
        const disturbingDialogue = {
            speaker: '',
            text: 'Então, da escuridão, você sente. Uma presença antiga, maligna, que sempre esteve lá. Observando. Esperando. Se alimentando da sua dor.'
        };

        window.dialogueSystem.showDialogue(disturbingDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            setTimeout(() => {
                window.gameController.showRandomJumpscare(4000, () => {
                    this.shadowSpeaks();
                });
            }, 1000);
        });
    }

    shadowSpeaks() {
        const shadowDialogue = {
            speaker: 'A Sombra',
            text: 'Se entregando à dor... Fraca. Patética. Você nunca poderia escapar. Você é MINHA. Sempre foi. Sua alma me pertence desde o momento em que acendeu aquele fósforo no teatro. Cada grito, cada chama, cada morte... foi você. E agora... você é NADA.'
        };

        window.dialogueSystem.showDialogue(shadowDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.hospitalSounds();
        });
    }

    hospitalSounds() {
        const soundsDialogue = {
            speaker: '',
            text: 'Você ouve... sons abafados. Vozes. Bips de máquinas. Uma voz masculina, profissional, distante.'
        };

        window.dialogueSystem.showDialogue(soundsDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.deathAnnouncement();
        });
    }

    deathAnnouncement() {
        const dateTime = new Date().toLocaleString('pt-BR');
        
        const deathDialogue = {
            speaker: 'Paramédico',
            text: `Hora do óbito: ${dateTime}. Paciente E.V., 24 anos. Causa: Parada cardiorrespiratória induzida por trauma psicológico severo. Projeto Marionete oficialmente encerrado. A cobaia não resistiu aos efeitos da Névoa.`
        };

        window.dialogueSystem.showDialogue(deathDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.showBadEndingCredits();
        });
    }

    showBadEndingCredits() {
        const effectsDiv = document.getElementById('effects');
        
        const creditsDiv = document.createElement('div');
        creditsDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #000;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #ff0000;
            font-family: 'Orbitron', monospace;
            opacity: 0;
            transition: opacity 3s ease;
        `;

        creditsDiv.innerHTML = `
            <h1 style="font-size: 4rem; margin-bottom: 2rem; text-shadow: 0 0 20px #ff0000;">
                FINAL 1
            </h1>
            <h2 style="font-size: 2.5rem; color: #aa0000; text-shadow: 0 0 15px #660000;">
                TRAGÉDIA
            </h2>
            <p style="margin-top: 3rem; font-size: 1.2rem; color: #666; max-width: 600px; text-align: center;">
                Evelly sucumbiu à loucura.<br>
                A Névoa consumiu tudo.<br>
                Não há escapatória da dor que você mesmo criou.
            </p>
            <button onclick="location.reload()" style="margin-top: 3rem; padding: 1rem 2rem; background: #660000; color: #fff; border: 2px solid #ff0000; font-family: 'Orbitron', monospace; font-size: 1rem; cursor: pointer;">
                Voltar ao Menu
            </button>
        `;

        effectsDiv.appendChild(creditsDiv);

        setTimeout(() => {
            creditsDiv.style.opacity = '1';
        }, 100);
    }

    endChapter5() {
        window.gameState.progressToNextChapter();
        window.gameState.flags.erzaKnockedOut = this.erzaKnockedOut;
        window.saveSystem.autoSave();
        
        const endDialogue = {
            speaker: '',
            text: 'O elevador desce. E desce. E desce. As luzes piscam. Você fecha os olhos. Quando os abrir novamente... tudo será diferente.',
            choices: [
                {
                    text: 'Continuar para o Capítulo 6...',
                    type: 'neutral'
                }
            ]
        };

        window.dialogueSystem.showDialogue(endDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.clearScreen();
            setTimeout(() => {
                if (window.gameController) {
                    window.gameController.loadChapter(6);
                } else {
                    console.error('GameController não encontrado!');
                }
            }, 1000);
        });
    }
}

window.Chapter5 = Chapter5;
