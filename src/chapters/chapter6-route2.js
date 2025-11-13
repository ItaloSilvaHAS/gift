class Chapter6Route2 {
    constructor() {
        this.name = 'O Núcleo - Rota com Erza';
        this.currentLocation = 'elevator_exit';
        this.inventory = {
            hasRedKey: false,
            hasBlueKey: false,
            hasFuse: false,
            hasCrowbar: false,
            hasPassword: false
        };
        this.doors = {
            redDoorOpen: false,
            blueDoorOpen: false,
            mainDoorOpen: false
        };
        this.powerOn = false;
        this.currentCharacters = {};
        this.hallucinationCount = 0;
        this.computerPassword = '1984';
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
        
        this.changeBackground('rota2cap6.avif', 'fade');
        this.clearScreen();
        
        setTimeout(() => {
            this.elevatorOpening();
        }, 1000);
    }

    elevatorOpening() {
        this.changeBackground('rota2cap6.avif', 'fade');
        
        const openingDialogue = {
            speaker: '',
            text: 'O elevador para. As portas se abrem. Vocês veem um enorme complexo subterrâneo - paredes de concreto, luzes piscando, corredores se bifurcando em todas as direções. Tudo está escuro.'
        };

        window.dialogueSystem.showDialogue(openingDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaSpeaks();
        });
    }

    erzaSpeaks() {
        this.showCharacter('erza', 'nervous', 'right');
        
        const erzaDialogue = {
            speaker: 'Erza',
            text: 'Evelly... lembro de ter visto documentos na recepção. Falavam sobre algo chamado "Experimento Névoa" e "Indutor de Trauma Profundo". Esse lugar... é onde eles faziam experimentos. Em pessoas como você.'
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
            speaker: 'Erza',
            text: 'Os documentos mencionavam uma "Sala de Controle Central". Se conseguirmos chegar lá, talvez possamos desativar a Névoa e... te libertar. Mas está tudo escuro. Precisamos ligar a energia primeiro.'
        };

        window.dialogueSystem.showDialogue(explainDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.findInitialKey();
        });
    }

    findInitialKey() {
        const keyDialogue = {
            speaker: '',
            text: 'Você olha ao redor do hub central. No chão, próximo ao elevador, você vê algo brilhando... uma CHAVE AZUL!'
        };

        window.dialogueSystem.showDialogue(keyDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.pickupBlueKey();
        });
    }

    pickupBlueKey() {
        this.inventory.hasBlueKey = true;
        
        const pickupDialogue = {
            speaker: 'Evelly',
            text: 'Peguei a chave azul. Deve servir para abrir alguma porta por aqui.'
        };

        window.dialogueSystem.showDialogue(pickupDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.startHub();
        });
    }

    // ==================== SISTEMA DE BACKTRACKING ====================

    startHub() {
        this.currentLocation = 'hub';
        this.triggerRandomHallucination();
    }

    triggerRandomHallucination() {
        if (Math.random() > 0.6 && this.hallucinationCount < 5) {
            const hallucinations = [
                {
                    text: 'Você ouve... gritos distantes. Gritos de agonia. Você pergunta: "Erza, você ouviu isso?"',
                    erzaResponse: 'Ouvir o quê? Evelly, está tudo em silêncio aqui.'
                },
                {
                    text: 'Uma sombra passa rápida no canto da sua visão. Você se vira, mas não há nada. "Erza, você viu isso?"',
                    erzaResponse: 'Vi o quê? Evelly... você está bem?'
                },
                {
                    text: 'O cheiro de fumaça invade suas narinas. Fogo. FOGO! "Erza, você está sentindo? O fogo!"',
                    erzaResponse: 'Não tem fogo aqui, Evelly. Respira fundo. É só a sua mente.'
                },
                {
                    text: 'Você ouve sussurros. Palavras incompreensíveis. Elas dizem coisas sobre você. Coisas terríveis.',
                    erzaResponse: 'Evelly, não tem ninguém aqui além de nós. Foca em mim. Você está bem.'
                }
            ];

            const hallucination = hallucinations[Math.floor(Math.random() * hallucinations.length)];
            this.hallucinationCount++;

            setTimeout(() => {
                const hallucinationDialogue = {
                    speaker: '',
                    text: hallucination.text
                };

                window.dialogueSystem.showDialogue(hallucinationDialogue);
                
                window.dialogueSystem.setNextAction(() => {
                    const erzaResponseDialogue = {
                        speaker: 'Erza',
                        text: hallucination.erzaResponse
                    };

                    window.dialogueSystem.showDialogue(erzaResponseDialogue);
                    window.dialogueSystem.setNextAction(() => {
                        this.showNavigationChoices();
                    });
                });
            }, 1000);
        } else {
            this.showNavigationChoices();
        }
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
                text: 'O painel está queimado. Falta um FUSÍVEL. Você precisa encontrar um fusível de reposição em algum lugar deste complexo.'
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
            text: 'Você instala o fusível. O painel ganha vida com um zumbido elétrico. As luzes do complexo piscam e se acendem gradualmente. A Sala de Controle Central agora deve estar acessível!'
        };

        window.dialogueSystem.showDialogue(installDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaReactsToLights();
        });
    }

    erzaReactsToLights() {
        this.showCharacter('erza', 'surprised', 'right');
        
        const erzaDialogue = {
            speaker: 'Erza',
            text: 'Conseguimos! Agora podemos ver... oh meu Deus. Evelly, olhe ao redor. Este lugar é... perturbador.'
        };

        window.dialogueSystem.showDialogue(erzaDialogue);
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
            text: 'Você usa a chave vermelha. A porta se abre com um rangido. Dentro... uma sala de experimentação. Mesas cirúrgicas. Instrumentos de tortura. E no centro... um FUSÍVEL e um PAPEL com anotações!'
        };

        window.dialogueSystem.showDialogue(openDialogue);
        window.dialogueSystem.setNextAction(() => {
            this.findFuseAndPassword();
        });
    }

    findFuseAndPassword() {
        this.inventory.hasFuse = true;
        this.inventory.hasPassword = true;
        
        const fuseDialogue = {
            speaker: '',
            text: 'Você pega o FUSÍVEL e lê o papel: "Senha do Sistema Central: 1984". Este é o ano do livro sobre vigilância e controle mental...'
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
            text: 'Você pega o PÉ DE CABRA e a CHAVE VERMELHA. Estes itens serão úteis para continuar explorando!'
        };

        window.dialogueSystem.showDialogue(toolsDialogue);
        window.dialogueSystem.setNextAction(() => this.blueCorridorOptions());
    }

    // ==================== SALA DE CONTROLE ====================

    exploreControlRoom() {
        this.currentLocation = 'control_room';
        
        if (!this.powerOn) {
            const noPowerDialogue = {
                speaker: '',
                text: 'A sala de controle está escura. Você precisa ligar a energia primeiro.'
            };
            window.dialogueSystem.showDialogue(noPowerDialogue);
            window.dialogueSystem.setNextAction(() => this.startHub());
            return;
        }
        
        const controlDialogue = {
            speaker: '',
            text: 'Você entra na Sala de Controle Central. Monitores cobrem as paredes. Você vê imagens de todas as vítimas da Névoa - incluindo VOCÊ. Seu rosto. Seus gritos. Tudo gravado.'
        };

        window.dialogueSystem.showDialogue(controlDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.seeTheCenter();
        });
    }

    seeTheCenter() {
        const centerDialogue = {
            speaker: '',
            text: 'No centro da sala, um enorme console. Acima dele, um letreiro: "PROJETO NÉVOA - HOLLOWMIND". Este é o coração de tudo.'
        };

        window.dialogueSystem.showDialogue(centerDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyHasVisions();
        });
    }

    evellyHasVisions() {
        const visionDialogue = {
            speaker: 'Evelly',
            text: 'Eu... estou vendo coisas. Imagens fragmentadas. Médicos. Cirurgias. Eletrodos na minha cabeça. Drogas sendo injetadas. Eles... MEXERAM NA MINHA MENTE!'
        };

        window.dialogueSystem.showDialogue(visionDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaComforts();
        });
    }

    erzaComforts() {
        this.showCharacter('erza', 'sad', 'right');
        
        const comfortDialogue = {
            speaker: 'Erza',
            text: 'Evelly, foca em mim. Nós vamos descobrir a verdade. Vamos acabar com isso. Olha, tem um computador ali. Tenta ligar.'
        };

        window.dialogueSystem.showDialogue(comfortDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.accessComputer();
        });
    }

    accessComputer() {
        if (!this.inventory.hasPassword) {
            const noPasswordDialogue = {
                speaker: '',
                text: 'O computador está ligado, mas pede uma senha. Você precisa encontrar a senha em algum lugar do complexo.'
            };
            window.dialogueSystem.showDialogue(noPasswordDialogue);
            window.dialogueSystem.setNextAction(() => this.startHub());
            return;
        }

        const passwordDialogue = {
            speaker: '',
            text: 'Você digita a senha encontrada: "1984". O sistema aceita. A tela se enche de documentos. Arquivos. Relatórios.'
        };

        window.dialogueSystem.showDialogue(passwordDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.readFiles();
        });
    }

    readFiles() {
        const filesDialogue = {
            speaker: '',
            text: 'PROJETO NÉVOA - OBJETIVO: Modificar o córtex pré-frontal através de exposição controlada a traumas reprimidos. EFEITOS COLATERAIS: Mudança de personalidade, esquizofrenia induzida, dissociação da realidade, alucinações persistentes.'
        };

        window.dialogueSystem.showDialogue(filesDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.continueReading();
        });
    }

    continueReading() {
        const moreFilesDialogue = {
            speaker: '',
            text: 'MÉTODO: Criar um mundo mental onde o sujeito revive seu trauma repetidamente até que a culpa seja processada e a personalidade seja "corrigida". TAXA DE SUCESSO: 12%. TAXA DE MORTALIDADE: 67%.'
        };

        window.dialogueSystem.showDialogue(moreFilesDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.epiphany();
        });
    }

    epiphany() {
        this.hideCharacter('erza');
        
        const epiphanyDialogue = {
            speaker: 'Evelly',
            text: 'Isso tudo... é REAL? Ou é tudo na minha cabeça? A Névoa... os monstros... VOCÊ?'
        };

        window.dialogueSystem.showDialogue(epiphanyDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyTurnsToErza();
        });
    }

    evellyTurnsToErza() {
        this.showCharacter('erza', 'nervous', 'right');
        
        const turnDialogue = {
            speaker: '',
            text: 'Você se vira para Erza. Ela está ali. Olhando pra você. Mas... será que ela está MESMO?'
        };

        window.dialogueSystem.showDialogue(turnDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaTries();
        });
    }

    erzaTries() {
        const erzaDialogue = {
            speaker: 'Erza',
            text: 'Evelly, eu sou REAL. Eu estou aqui. Com você. Eu sempre estive. Por favor, acredita em mim!'
        };

        window.dialogueSystem.showDialogue(erzaDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.narratorDoubt();
        });
    }

    narratorDoubt() {
        const doubtDialogue = {
            speaker: '',
            text: 'Mas as palavras ecoam vazias. Tudo ao seu redor - as paredes, os monitores, até Erza - parece irreal. Construções da sua mente quebrada. Você está sozinha. Sempre esteve.'
        };

        window.dialogueSystem.showDialogue(doubtDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.finalChoice();
        });
    }

    finalChoice() {
        const choices = [];
        
        const hasAmmo = window.gameState && window.gameState.inventory && window.gameState.inventory.ammo > 0;
        
        if (hasAmmo) {
            choices.push({
                text: 'Atirar em Erza',
                type: 'shoot_erza',
                karma: -50
            });
            
            choices.push({
                text: 'Atirar em si mesma',
                type: 'shoot_self',
                karma: -100
            });
        }

        choices.push({
            text: 'Destruir o computador',
            type: 'destroy_computer',
            karma: 30
        });

        choices.push({
            text: 'Confiar em Erza e seguir em frente',
            type: 'trust_erza',
            karma: 50
        });

        const choiceDialogue = {
            speaker: '',
            text: 'Você segura a arma. Suas mãos tremem. O que você faz?',
            choices: choices
        };

        window.dialogueSystem.showDialogue(choiceDialogue);
        
        window.dialogueSystem.setNextAction((choice) => {
            if (choice && choice.type === 'shoot_erza') {
                this.shootErza();
            } else if (choice && choice.type === 'shoot_self') {
                this.shootSelf();
            } else if (choice && choice.type === 'trust_erza') {
                this.trustErza();
            } else {
                this.destroyComputer();
            }
        });
    }

    trustErza() {
        this.hideCharacter('erza');
        
        const trustDialogue = {
            speaker: 'Evelly',
            text: 'Eu... eu confio em você, Erza. Você é real. Você TEM que ser. E mesmo que não seja... eu escolho acreditar.'
        };

        window.dialogueSystem.showDialogue(trustDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaResponds();
        });
    }

    erzaResponds() {
        const erzaDialogue = {
            speaker: 'Erza',
            text: 'Evelly... você não está sozinha. Nunca esteve. Vamos sair daqui. JUNTAS.'
        };

        window.dialogueSystem.showDialogue(erzaDialogue);
        
        setTimeout(() => {
            this.forceChapter7();
        }, 3000);
    }

    forceChapter7() {
        console.log('FORÇANDO TRANSIÇÃO PARA CAPÍTULO 7');
        
        const dialogueBox = document.getElementById('dialogue-box');
        if (dialogueBox) {
            dialogueBox.style.display = 'none';
        }
        
        this.clearScreen();
        
        const background = document.getElementById('background');
        if (background) {
            background.style.opacity = '0';
        }
        
        setTimeout(() => {
            if (window.gameState) {
                window.gameState.currentChapter = 7;
                window.gameState.currentScene = 1;
            }
            
            if (window.gameController) {
                console.log('Chamando loadChapter(7)...');
                window.gameController.currentChapter = null;
                window.gameController.loadChapter(7);
            } else {
                console.error('gameController NÃO EXISTE!');
                alert('ERRO: gameController não encontrado. Abrindo console...');
            }
        }, 1000);
    }

    shootErza() {
        window.audioManager?.playSound('gunshot');
        
        const shootDialogue = {
            speaker: '',
            text: 'BANG! O tiro ecoa. Erza cai. Mas então... ela desaparece. Como fumaça. Você está sozinha. E a realidade começa a desmoronar.'
        };

        window.dialogueSystem.showDialogue(shootDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            if (window.Chapter5) {
                const chapter5 = new window.Chapter5();
                chapter5.realityCollapse();
            }
        });
    }

    shootSelf() {
        window.audioManager?.playSound('gunshot');
        
        const shootDialogue = {
            speaker: '',
            text: 'BANG! Dor. Escuridão. A Névoa te consome completamente.'
        };

        window.dialogueSystem.showDialogue(shootDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            if (window.Chapter5) {
                const chapter5 = new window.Chapter5();
                chapter5.realityCollapse();
            }
        });
    }

    destroyComputer() {
        const destroyDialogue = {
            speaker: 'Evelly',
            text: 'NÃO! Eu vou ACABAR com isso! Se eu não posso confiar em nada, então eu vou DESTRUIR TUDO!'
        };

        window.dialogueSystem.showDialogue(destroyDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.smashComputer();
        });
    }

    smashComputer() {
        const smashDialogue = {
            speaker: '',
            text: 'Você ergue a arma e dispara no console. Uma vez. Duas. Três. O computador explode em faíscas. Alarmes tocam. E então...'
        };

        window.dialogueSystem.showDialogue(smashDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.matrixEnding();
        });
    }

    matrixEnding() {
        const background = document.getElementById('background');
        background.style.transition = 'all 3s ease';
        background.style.filter = 'blur(30px)';
        background.style.opacity = '0.3';
        
        const nevoaDialogue = {
            speaker: '',
            text: 'A Névoa se envolve ao seu redor. Densa. Sufocante. Você não consegue respirar. Não consegue pensar. E então... BIP. BIP. BIP.'
        };

        window.dialogueSystem.showDialogue(nevoaDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.hospitalWakeup();
        });
    }

    hospitalWakeup() {
        this.changeBackground('fundocena3.jpeg', 'fade');
        
        const wakeupDialogue = {
            speaker: '',
            text: 'Você acorda. Luz branca. Teto branco. Você está deitada. Aparelhos conectados ao seu corpo. Tubos. Máquinas. Você está... em um HOSPITAL.'
        };

        window.dialogueSystem.showDialogue(wakeupDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.seeBody();
        });
    }

    seeBody() {
        const bodyDialogue = {
            speaker: '',
            text: 'Você olha para seu corpo. Magra. Pálida. Machucada. Quanto tempo você esteve aqui? Você tenta se mover, mas não consegue. E então... você vê ELES.'
        };

        window.dialogueSystem.showDialogue(bodyDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.doctorsAppear();
        });
    }

    doctorsAppear() {
        const doctorsDialogue = {
            speaker: 'Médico 1',
            text: 'Oh não. Ela acordou. Acordou CEDO DEMAIS. O experimento ainda não está completo!'
        };

        window.dialogueSystem.showDialogue(doctorsDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyStruggles();
        });
    }

    evellyStruggles() {
        const struggleDialogue = {
            speaker: 'Evelly',
            text: 'NÃO! ME SOLTA! EU VOU SAIR DAQUI! ME DEIXA IR!'
        };

        window.dialogueSystem.showDialogue(struggleDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.doctorsHold();
        });
    }

    doctorsHold() {
        const holdDialogue = {
            speaker: 'Médico 2',
            text: 'Segura ela. SEGURA! Não pode deixar ela acordar agora. Precisa voltar pra Névoa. O experimento PRECISA continuar!'
        };

        window.dialogueSystem.showDialogue(holdDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.forcedBack();
        });
    }

    forcedBack() {
        const forceDialogue = {
            speaker: '',
            text: 'Eles te seguram. Contra sua vontade. Uma seringa. Uma injeção. Você sente o líquido frio entrar na sua veia. NÃO!'
        };

        window.dialogueSystem.showDialogue(forceDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.doctorsFinalWords();
        });
    }

    doctorsFinalWords() {
        const finalWordsDialogue = {
            speaker: 'Médico 1',
            text: 'O experimento ainda não acabou, Evelly. Você vai reviver tudo de novo. E de novo. E de novo. Até que você seja CURADA.'
        };

        window.dialogueSystem.showDialogue(finalWordsDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.fadeToBlack();
        });
    }

    fadeToBlack() {
        const background = document.getElementById('background');
        background.style.transition = 'all 2s ease';
        background.style.opacity = '0';
        
        const fadeDialogue = {
            speaker: '',
            text: 'Sua visão escurece. Você está caindo. Caindo de volta na Névoa. De volta ao início. De volta ao pesadelo.'
        };

        window.dialogueSystem.showDialogue(fadeDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.showMatrixEnding();
        });
    }

    showMatrixEnding() {
        const effectsDiv = document.getElementById('effects');
        
        const creditsDiv = document.createElement('div');
        creditsDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #000033 0%, #003300 100%);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #00ff00;
            font-family: 'Orbitron', monospace;
            opacity: 0;
            transition: opacity 3s ease;
        `;

        creditsDiv.innerHTML = `
            <h1 style="font-size: 4rem; margin-bottom: 2rem; text-shadow: 0 0 20px #00ff00;">
                FINAL 3
            </h1>
            <h2 style="font-size: 2.5rem; color: #00aa00; text-shadow: 0 0 15px #006600;">
                A MATRIX
            </h2>
            <p style="margin-top: 3rem; font-size: 1.2rem; color: #aaa; max-width: 700px; text-align: center; line-height: 1.8;">
                Evelly descobriu a verdade.<br>
                Mas a verdade não a libertou.<br>
                Ela está presa em um ciclo infinito de trauma e experimentação.<br>
                O Projeto Névoa nunca termina.<br>
                Ela reviverá tudo. Repetidamente. Eternamente.<br>
                Bem-vinda à sua prisão mental.
            </p>
            <button onclick="location.reload()" style="margin-top: 3rem; padding: 1rem 2rem; background: #003300; color: #00ff00; border: 2px solid #00ff00; font-family: 'Orbitron', monospace; font-size: 1rem; cursor: pointer; box-shadow: 0 0 10px #00ff00;">
                Voltar ao Menu
            </button>
        `;

        effectsDiv.appendChild(creditsDiv);

        setTimeout(() => {
            creditsDiv.style.opacity = '1';
        }, 100);
    }

}

window.Chapter6Route2 = Chapter6Route2;
