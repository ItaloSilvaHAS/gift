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
        if (!this.erzaKnockedOut) {
            this.showCharacter('ezra', 'cautious', 'right');
        }
        
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
            text: 'Os arquivos falam sobre o "Projeto Marionete" - experimentos com pacientes traumatizados. Um nome se destaca: E.V. Evelly... esse é você?',
            choices: [{ text: 'Continuar', type: 'continue' }]
        };

        window.dialogueSystem.showDialogue(filesDialogue);
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
        if (this.erzaKnockedOut) {
            this.hubNavigation();
            return;
        }

        this.showCharacter('ezra', 'nervous', 'right');
        
        const erzaWarning = {
            speaker: 'Ezra',
            text: 'Evelly, espera! Essa chave... eu tenho um pressentimento ruim. Talvez não devêssemos usar ela em qualquer lugar. Precisamos ter cuidado.',
            choices: [{ text: 'Entendido', type: 'understood' }]
        };

        window.dialogueSystem.showDialogue(erzaWarning);
        window.dialogueSystem.setNextAction(() => this.hubNavigation());
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
        this.showCharacter('ezra', 'nervous', 'right');
        
        const helpDialogue = {
            speaker: 'Ezra',
            text: 'EU AVISEI! Fugir não é a resposta! Precisamos ENFRENTAR isso, Evelly! O elevador... talvez seja o caminho!',
            choices: [{ text: 'Você está certa...', type: 'agree' }]
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
            <div id="code-display" style="font-size: 3rem; margin-bottom: 2rem; letter-spacing: 1rem; min-width: 300px; text-align: center; border: 2px solid #00ff00; padding: 1rem;">
                ----
            </div>
            <p style="margin-bottom: 2rem; color: #ffaa00;">
                Dica: O código está nos arquivos da recepção. Tente 4825.
            </p>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                <button class="num-btn" data-num="1" style="width: 60px; height: 60px; font-size: 1.5rem; background: #111; color: #00ff00; border: 2px solid #00ff00; cursor: pointer;">1</button>
                <button class="num-btn" data-num="2" style="width: 60px; height: 60px; font-size: 1.5rem; background: #111; color: #00ff00; border: 2px solid #00ff00; cursor: pointer;">2</button>
                <button class="num-btn" data-num="3" style="width: 60px; height: 60px; font-size: 1.5rem; background: #111; color: #00ff00; border: 2px solid #00ff00; cursor: pointer;">3</button>
                <button class="num-btn" data-num="4" style="width: 60px; height: 60px; font-size: 1.5rem; background: #111; color: #00ff00; border: 2px solid #00ff00; cursor: pointer;">4</button>
                <button class="num-btn" data-num="5" style="width: 60px; height: 60px; font-size: 1.5rem; background: #111; color: #00ff00; border: 2px solid #00ff00; cursor: pointer;">5</button>
                <button class="num-btn" data-num="6" style="width: 60px; height: 60px; font-size: 1.5rem; background: #111; color: #00ff00; border: 2px solid #00ff00; cursor: pointer;">6</button>
                <button class="num-btn" data-num="7" style="width: 60px; height: 60px; font-size: 1.5rem; background: #111; color: #00ff00; border: 2px solid #00ff00; cursor: pointer;">7</button>
                <button class="num-btn" data-num="8" style="width: 60px; height: 60px; font-size: 1.5rem; background: #111; color: #00ff00; border: 2px solid #00ff00; cursor: pointer;">8</button>
                <button class="num-btn" data-num="9" style="width: 60px; height: 60px; font-size: 1.5rem; background: #111; color: #00ff00; border: 2px solid #00ff00; cursor: pointer;">9</button>
                <button id="clear-btn" style="width: 60px; height: 60px; font-size: 1.2rem; background: #aa0000; color: #fff; border: 2px solid #ff0000; cursor: pointer;">CLR</button>
                <button class="num-btn" data-num="0" style="width: 60px; height: 60px; font-size: 1.5rem; background: #111; color: #00ff00; border: 2px solid #00ff00; cursor: pointer;">0</button>
                <button id="enter-btn" style="width: 60px; height: 60px; font-size: 1.2rem; background: #006600; color: #fff; border: 2px solid #00ff00; cursor: pointer;">OK</button>
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
        this.showCharacter('ezra', 'cautious', 'right');
        
        const erzaFinalDialogue = {
            speaker: 'Ezra',
            text: 'Evelly... este elevador vai nos levar ao núcleo. Ao coração de tudo isso. Você está pronta? Não importa o que encontrarmos lá, estaremos juntas.',
            choices: [
                {
                    text: 'Sim. O tormento só vai acabar se eu enfrentá-lo.',
                    type: 'face_it',
                    karma: 15
                },
                {
                    text: 'Estou com medo, mas preciso saber a verdade.',
                    type: 'scared_but_brave',
                    karma: 10
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
        const enterDialogue = {
            speaker: '',
            text: 'Você entra no elevador. As portas se fecham atrás de você. Um único botão brilha: "SUBSOLO - NÚCLEO". Você pressiona. A descida começa. Fim do Capítulo 5.',
            effects: [{ type: 'descent' }]
        };

        window.dialogueSystem.showDialogue(enterDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.endChapter5();
        });
    }

    endChapter5() {
        window.gameState.progressToNextChapter();
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
