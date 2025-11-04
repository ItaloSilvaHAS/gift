class Chapter6Route2 {
    constructor() {
        this.name = 'O Núcleo - Rota com Erza';
        this.currentLocation = 'elevator_exit';
        this.inventory = {
            hasRedKey: false,
            hasBlueKey: false,
            hasFuse: false,
            hasCrowbar: false
        };
        this.doors = {
            redDoorOpen: false,
            blueDoorOpen: false,
            mainDoorOpen: false
        };
        this.powerOn = false;
        this.currentCharacters = {};
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

    start() {
        console.log('Iniciando Capítulo 6 - Rota com Erza');
        
        this.changeBackground('cap66.jpg', 'fade');
        this.clearScreen();
        
        setTimeout(() => {
            this.elevatorOpening();
        }, 1000);
    }

    elevatorOpening() {
        const openingDialogue = {
            speaker: '',
            text: 'O elevador para. As portas se abrem. Vocês veem um enorme complexo subterrâneo - paredes de concreto, luzes piscando, corredores se bifurcando em todas as direções.'
        };

        window.dialogueSystem.showDialogue(openingDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaSpeaks();
        });
    }

    erzaSpeaks() {
        const erzaDialogue = {
            speaker: 'Evelly',
            text: 'Eu... lembro de ter visto documentos na recepção. Falavam sobre algo chamado "Experimento Névoa" e "Indutor de Trauma Profundo". Isso é onde eles faziam... experimentos. Em pessoas como você.'
        };

        window.dialogueSystem.showDialogue(erzaDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyReacts();
        });
    }

    evellyReacts() {
        const evellyDialogue = {
            speaker: 'Evelly',
            text: 'Então tudo isso... era um experimento. Eles me transformaram nisso. Quebraram minha mente. Me fizeram acreditar que... que eu era culpada. Mas talvez... talvez haja uma forma de reverter.'
        };

        window.dialogueSystem.showDialogue(evellyDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaExplains();
        });
    }

    erzaExplains() {
        const explainDialogue = {
            speaker: 'Evelly',
            text: 'Os documentos mencionavam uma "Sala de Controle Central". Se conseguirmos chegar lá, talvez possamos desativar a Névoa e... te libertar.'
        };

        window.dialogueSystem.showDialogue(explainDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.startHub();
        });
    }

    // ==================== SISTEMA DE BACKTRACKING ====================

    startHub() {
        this.currentLocation = 'hub';
        this.showNavigationChoices();
    }

    showNavigationChoices() {
        const choices = [];

        choices.push({
            text: 'Ir para o corredor leste (Porta Vermelha)',
            type: 'red_corridor',
            karma: 0
        });

        choices.push({
            text: 'Ir para o corredor oeste (Porta Azul)',
            type: 'blue_corridor',
            karma: 0
        });

        if (this.powerOn) {
            choices.push({
                text: 'Ir para a Sala de Controle Central',
                type: 'control_room',
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
        const choiceType = choice?.type || 'red_corridor';
        
        switch(choiceType) {
            case 'red_corridor':
                this.exploreRedCorridor();
                break;
            case 'blue_corridor':
                this.exploreBlueCorridor();
                break;
            case 'control_room':
                this.exploreControlRoom();
                break;
            default:
                this.exploreRedCorridor();
        }
    }

    // ==================== CORREDOR VERMELHO ====================

    exploreRedCorridor() {
        this.currentLocation = 'red_corridor';
        
        const corridorDialogue = {
            speaker: '',
            text: 'O corredor vermelho é estreito e claustrofóbico. No fim, há uma porta vermelha trancada. Ao lado, um painel de energia desligado.'
        };

        window.dialogueSystem.showDialogue(corridorDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.redCorridorOptions();
        });
    }

    redCorridorOptions() {
        const choices = [
            {
                text: 'Examinar o painel de energia',
                type: 'examine_panel',
                karma: 0
            },
            {
                text: 'Tentar abrir a porta vermelha',
                type: 'try_red_door',
                karma: 0
            },
            {
                text: 'Voltar ao hub central',
                type: 'back_hub',
                karma: 0
            }
        ];

        const optionsDialogue = {
            speaker: '',
            text: 'O que você quer fazer?',
            choices: choices
        };

        window.dialogueSystem.showDialogue(optionsDialogue);
        
        window.dialogueSystem.setNextAction((choice) => {
            if (choice?.type === 'examine_panel') {
                this.examinePanel();
            } else if (choice?.type === 'try_red_door') {
                this.tryRedDoor();
            } else {
                this.startHub();
            }
        });
    }

    examinePanel() {
        if (!this.inventory.hasFuse) {
            const panelDialogue = {
                speaker: '',
                text: 'O painel está queimado. Falta um FUSÍVEL. Você precisa encontrar um fusível de reposição.'
            };

            window.dialogueSystem.showDialogue(panelDialogue);
            window.dialogueSystem.setNextAction(() => this.redCorridorOptions());
        } else if (!this.powerOn) {
            this.installFuse();
        } else {
            const alreadyOnDialogue = {
                speaker: '',
                text: 'A energia já está ligada.'
            };

            window.dialogueSystem.showDialogue(alreadyOnDialogue);
            window.dialogueSystem.setNextAction(() => this.redCorridorOptions());
        }
    }

    installFuse() {
        this.powerOn = true;
        
        const installDialogue = {
            speaker: '',
            text: 'Você instala o fusível. O painel ganha vida com um zumbido elétrico. As luzes do complexo se acendem. A Sala de Controle Central agora deve estar acessível!'
        };

        window.dialogueSystem.showDialogue(installDialogue);
        window.dialogueSystem.setNextAction(() => this.redCorridorOptions());
    }

    tryRedDoor() {
        if (!this.inventory.hasRedKey) {
            const lockedDialogue = {
                speaker: '',
                text: 'A porta vermelha está trancada. Você precisa de uma CHAVE VERMELHA.'
            };

            window.dialogueSystem.showDialogue(lockedDialogue);
            window.dialogueSystem.setNextAction(() => this.redCorridorOptions());
        } else {
            this.openRedDoor();
        }
    }

    openRedDoor() {
        this.doors.redDoorOpen = true;
        
        const openDialogue = {
            speaker: '',
            text: 'Você usa a chave vermelha. A porta se abre com um rangido. Dentro... uma sala de experimentação. Mesas cirúrgicas. Instrumentos de tortura. E no centro... um FUSÍVEL!'
        };

        window.dialogueSystem.showDialogue(openDialogue);
        window.dialogueSystem.setNextAction(() => {
            this.findFuse();
        });
    }

    findFuse() {
        this.inventory.hasFuse = true;
        
        const fuseDialogue = {
            speaker: '',
            text: 'Você pega o FUSÍVEL. Este item pode reativar a energia do complexo.'
        };

        window.dialogueSystem.showDialogue(fuseDialogue);
        window.dialogueSystem.setNextAction(() => this.redCorridorOptions());
    }

    // ==================== CORREDOR AZUL ====================

    exploreBlueCorridor() {
        this.currentLocation = 'blue_corridor';
        
        const corridorDialogue = {
            speaker: '',
            text: 'O corredor azul é iluminado por luzes fluorescentes azuladas. No fim, há uma porta azul. Ao lado, uma caixa de metal trancada.'
        };

        window.dialogueSystem.showDialogue(corridorDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.blueCorridorOptions();
        });
    }

    blueCorridorOptions() {
        const choices = [
            {
                text: 'Examinar a caixa de metal',
                type: 'examine_box',
                karma: 0
            },
            {
                text: 'Tentar abrir a porta azul',
                type: 'try_blue_door',
                karma: 0
            },
            {
                text: 'Voltar ao hub central',
                type: 'back_hub',
                karma: 0
            }
        ];

        const optionsDialogue = {
            speaker: '',
            text: 'O que você quer fazer?',
            choices: choices
        };

        window.dialogueSystem.showDialogue(optionsDialogue);
        
        window.dialogueSystem.setNextAction((choice) => {
            if (choice?.type === 'examine_box') {
                this.examineBox();
            } else if (choice?.type === 'try_blue_door') {
                this.tryBlueDoor();
            } else {
                this.startHub();
            }
        });
    }

    examineBox() {
        if (!this.inventory.hasCrowbar) {
            const boxDialogue = {
                speaker: '',
                text: 'A caixa está trancada com cadeado. Você precisa de algo para forçar a abertura. Um PÉ DE CABRA seria útil.'
            };

            window.dialogueSystem.showDialogue(boxDialogue);
            window.dialogueSystem.setNextAction(() => this.blueCorridorOptions());
        } else if (!this.inventory.hasBlueKey) {
            this.openBox();
        } else {
            const emptyDialogue = {
                speaker: '',
                text: 'A caixa já está vazia.'
            };

            window.dialogueSystem.showDialogue(emptyDialogue);
            window.dialogueSystem.setNextAction(() => this.blueCorridorOptions());
        }
    }

    openBox() {
        this.inventory.hasBlueKey = true;
        
        const openDialogue = {
            speaker: '',
            text: 'Você força a caixa com o pé de cabra. Dentro está uma CHAVE AZUL!'
        };

        window.dialogueSystem.showDialogue(openDialogue);
        window.dialogueSystem.setNextAction(() => this.blueCorridorOptions());
    }

    tryBlueDoor() {
        if (!this.inventory.hasBlueKey) {
            const lockedDialogue = {
                speaker: '',
                text: 'A porta azul está trancada. Você precisa de uma CHAVE AZUL.'
            };

            window.dialogueSystem.showDialogue(lockedDialogue);
            window.dialogueSystem.setNextAction(() => this.blueCorridorOptions());
        } else {
            this.openBlueDoor();
        }
    }

    openBlueDoor() {
        this.doors.blueDoorOpen = true;
        
        const openDialogue = {
            speaker: '',
            text: 'A porta azul se abre. Dentro você encontra um depósito de ferramentas. Entre ferramentas enferrujadas, você vê um PÉ DE CABRA e uma CHAVE VERMELHA!'
        };

        window.dialogueSystem.showDialogue(openDialogue);
        window.dialogueSystem.setNextAction(() => {
            this.findTools();
        });
    }

    findTools() {
        this.inventory.hasCrowbar = true;
        this.inventory.hasRedKey = true;
        
        const toolsDialogue = {
            speaker: '',
            text: 'Você pega o PÉ DE CABRA e a CHAVE VERMELHA. Estes itens serão úteis!'
        };

        window.dialogueSystem.showDialogue(toolsDialogue);
        window.dialogueSystem.setNextAction(() => this.blueCorridorOptions());
    }

    // ==================== SALA DE CONTROLE ====================

    exploreControlRoom() {
        this.currentLocation = 'control_room';
        
        const controlDialogue = {
            speaker: '',
            text: 'Você entra na Sala de Controle Central. Monitores cobrem as paredes. Você vê imagens de todas as vítimas da Névoa - incluindo VOCÊ.'
        };

        window.dialogueSystem.showDialogue(controlDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.findShutdownButton();
        });
    }

    findShutdownButton() {
        const buttonDialogue = {
            speaker: '',
            text: 'No centro, um console com um grande botão vermelho: "DESATIVAR PROJETO MARIONETE".'
        };

        window.dialogueSystem.showDialogue(buttonDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.finalDecision();
        });
    }

    finalDecision() {
        const decisionDialogue = {
            speaker: 'Evelly',
            text: 'Este é o momento. Se eu desativar a Névoa... eu serei livre. Mas... também perderei tudo que me trouxe até aqui. Inclusive... ela.',
            choices: [
                {
                    text: 'Pressionar o botão e desativar a Névoa',
                    type: 'shutdown',
                    karma: 50
                },
                {
                    text: 'Recusar e voltar',
                    type: 'refuse',
                    karma: -20
                }
            ]
        };

        window.dialogueSystem.showDialogue(decisionDialogue);
        
        window.dialogueSystem.setNextAction((choice) => {
            if (choice && choice.type === 'shutdown') {
                this.shutdownNevoa();
            } else {
                this.startHub();
            }
        });
    }

    shutdownNevoa() {
        const shutdownDialogue = {
            speaker: '',
            text: 'Você pressiona o botão. O complexo inteiro treme. Sirenes tocam. As luzes piscam violentamente. E então... silêncio.'
        };

        window.dialogueSystem.showDialogue(shutdownDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.continueToChapter7();
        });
    }

    continueToChapter7() {
        window.gameState.progressToNextChapter();
        window.gameState.flags.nevoaShutdown = true;
        window.saveSystem.autoSave();
        
        const continueDialogue = {
            speaker: '',
            text: 'A Névoa se dissipa. Você sente... clareza. Pela primeira vez em muito tempo. Fim do Capítulo 6.',
            choices: [
                {
                    text: 'Continuar para o Capítulo 7...',
                    type: 'neutral'
                }
            ]
        };

        window.dialogueSystem.showDialogue(continueDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.clearScreen();
            setTimeout(() => {
                if (window.gameController) {
                    window.gameController.loadChapter(7);
                } else {
                    console.error('GameController não encontrado!');
                }
            }, 1000);
        });
    }
}

window.Chapter6Route2 = Chapter6Route2;
