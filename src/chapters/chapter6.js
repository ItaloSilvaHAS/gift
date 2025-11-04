class Chapter6 {
    constructor() {
        this.name = 'O Núcleo da Névoa';
        this.totalScenes = 15;
        this.currentCharacters = {};
        this.erzaAlive = true;
        this.playerShot = false;
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
        console.log('Iniciando Capítulo 6: O Núcleo da Névoa');
        
        window.gameState.currentChapter = 6;
        window.gameState.currentScene = 1;
        
        this.clearScreen();
        
        this.erzaAlive = !window.gameState.flags.erzaKnockedOut;
        
        setTimeout(() => {
            if (this.erzaAlive) {
                this.startRouteWithErza();
            } else {
                this.startRouteSolo();
            }
        }, 500);
    }

    // ==================== ROTA SOLO (SEM ERZA) ====================

    startRouteSolo() {
        this.changeBackground('cap6.jpg', 'fade');
        
        const openingDialogue = {
            speaker: '',
            text: 'O elevador para com um solavanco violento. As portas se abrem lentamente, rangendo. Apenas... escuridão.'
        };

        window.dialogueSystem.showDialogue(openingDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.soloExitElevator();
        });
    }

    soloExitElevator() {
        const exitDialogue = {
            speaker: 'Evelly',
            text: 'Eu saí do elevador. Meus passos ecoam no vazio. Não vejo nada. Apenas sinto... um vazio consumidor.',
            choices: [
                {
                    text: 'Avançar na escuridão',
                    type: 'advance',
                    karma: 5
                },
                {
                    text: 'Ficar parada e esperar',
                    type: 'wait',
                    karma: 0
                }
            ]
        };

        window.dialogueSystem.showDialogue(exitDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.soloAdvanceInDarkness();
        });
    }

    soloAdvanceInDarkness() {
        const advanceDialogue = {
            speaker: '',
            text: 'Você avança (ou tenta ficar parada, mas seus pés se movem sozinhos). O elevador fecha atrás de você com um BANG ensurdecedor. E então...'
        };

        window.dialogueSystem.showDialogue(advanceDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.soloTraumaManifests();
        });
    }

    soloTraumaManifests() {
        const traumaDialogue = {
            speaker: '',
            text: 'GRITOS. Gritos de agonia. Você os conhece. São as vozes daqueles que morreram no teatro. O calor. O CALOR! As chamas lambem sua pele. Você sente tudo novamente.'
        };

        window.dialogueSystem.showDialogue(traumaDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.soloCorridorForms();
        });
    }

    soloCorridorForms() {
        const corridorDialogue = {
            speaker: '',
            text: 'Um corredor se forma ao seu redor. Paredes de carne pulsante. Chão de ossos carbonizados. E lá, no fim do corredor... uma figura se molda.'
        };

        window.dialogueSystem.showDialogue(corridorDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.soloShadowAppears();
        });
    }

    soloShadowAppears() {
        const shadowDialogue = {
            speaker: 'A Sombra',
            text: 'Finalmente... SOZINHA. Sem sua muleta. Sem sua falsa esperança. Agora... você é MINHA.'
        };

        window.dialogueSystem.showDialogue(shadowDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.soloCriticalChoice();
        });
    }

    soloCriticalChoice() {
        const choices = [];
        
        const hasAmmo = window.gameState && window.gameState.inventory && window.gameState.inventory.ammo > 0;
        
        if (hasAmmo) {
            choices.push({
                text: 'Atirar na Sombra',
                type: 'shoot_shadow',
                karma: 5
            });
        }

        choices.push({
            text: 'Tentar se controlar e enfrentar',
            type: 'control',
            karma: 20
        });

        if (hasAmmo) {
            choices.push({
                text: 'Atirar em si mesma',
                type: 'shoot_self',
                karma: -100
            });
        }

        const choiceDialogue = {
            speaker: '',
            text: 'A Sombra avança. Seus dedos negros se estendem. O que você faz?',
            choices: choices
        };

        window.dialogueSystem.showDialogue(choiceDialogue);
        
        window.dialogueSystem.setNextAction((choice) => {
            if (choice && choice.type === 'shoot_self') {
                this.soloShootSelf_BadEnding();
            } else if (choice && choice.type === 'shoot_shadow') {
                this.soloShootShadow();
            } else {
                this.soloControl();
            }
        });
    }

    soloShootSelf_BadEnding() {
        window.audioManager?.playSound('gunshot');
        
        const shootDialogue = {
            speaker: '',
            text: 'BANG! A dor explode em seu peito. Você cai. A Sombra ri. Ri. RI. A escuridão te consome.'
        };

        window.dialogueSystem.showDialogue(shootDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            const background = document.getElementById('background');
            background.style.transition = 'all 2s ease';
            background.style.opacity = '0';
            
            setTimeout(() => {
                if (window.Chapter5 && window.Chapter5.prototype.realityCollapse) {
                    const chapter5 = new window.Chapter5();
                    chapter5.realityCollapse();
                }
            }, 2000);
        });
    }

    soloShootShadow() {
        const shootDialogue = {
            speaker: '',
            text: 'BANG! BANG! BANG! Os tiros atravessam a Sombra... mas ela apenas ri. "Você não pode me matar. Eu sou VOCÊ."'
        };

        window.dialogueSystem.showDialogue(shootDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.soloControl();
        });
    }

    soloControl() {
        const controlDialogue = {
            speaker: 'Evelly',
            text: 'NÃO! Você não é eu! Você é minha culpa, meu medo, minha dor... mas EU ESCOLHO não te alimentar mais!'
        };

        window.dialogueSystem.showDialogue(controlDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.soloContinueToChapter7();
        });
    }

    soloContinueToChapter7() {
        window.gameState.progressToNextChapter();
        window.saveSystem.autoSave();
        
        const continueDialogue = {
            speaker: '',
            text: 'A Sombra hesita. Por um momento, você vê... esperança? Não. É medo. Ela tem medo de você. Fim do Capítulo 6.',
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

    // ==================== ROTA COM ERZA ====================

    startRouteWithErza() {
        console.log('Iniciando rota com Erza (Chapter6Route2)');
        
        if (window.Chapter6Route2) {
            const route2 = new window.Chapter6Route2();
            route2.start();
        } else {
            console.error('Chapter6Route2 não encontrado!');
        }
    }
}

window.Chapter6 = Chapter6;
