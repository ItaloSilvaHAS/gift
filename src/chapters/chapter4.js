class Chapter4 {
    constructor() {
        this.name = 'Fragmentos da Verdade';
        this.totalScenes = 4;
        this.currentPuzzle = null;
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

    changeCharacterExpression(characterName, newExpression) {
        if (this.currentCharacters[characterName]) {
            this.hideCharacter(characterName);
            setTimeout(() => {
                this.showCharacter(characterName, newExpression, 'center');
            }, 600);
        }
    }

    changeBackground(imageName, transitionType = 'fade') {
        const background = document.getElementById('background');
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
        
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
        console.log('Iniciando Capítulo 4: Fragmentos da Verdade');
        
        window.gameState.currentChapter = 4;
        window.gameState.currentScene = 1;
        
        this.clearScreen();
        
        setTimeout(() => {
            this.startScene1();
        }, 500);
    }

    startScene1() {
        const karma = window.gameState.karma;
        
        if (karma > 0) {
            this.changeBackground('fundocena2.avif', 'fade');
            this.startCathedralPath();
        } else {
            this.changeBackground('fundocena3.jpeg', 'fade');
            this.startHospitalPath();
        }
    }

    startCathedralPath() {
        const openingDialogue = {
            speaker: '',
            text: 'Vocês chegam a uma catedral abandonada. Vitrais quebrados filtram a luz da lua em feixes distorcidos. O ar carrega sussurros etéreos, como se alguém estivesse ensaiando uma peça teatral macabra.',
            effects: [{ type: 'fadeIn', duration: 2000 }]
        };

        window.dialogueSystem.showDialogue(openingDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.cathedralEvellyReaction();
        });
    }

    cathedralEvellyReaction() {
        const evellyDialogue = {
            speaker: 'Evelly',
            text: 'Este lugar... é como se fosse um palco gigante. Posso quase sentir os holofotes me observando através desses vitrais...',
            effects: [{ type: 'character_thought' }]
        };

        window.dialogueSystem.showDialogue(evellyDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.cathedralEzraWarning();
        });
    }

    cathedralEzraWarning() {
        this.showCharacter('ezra', 'cautious', 'right');
        
        const ezraDialogue = {
            speaker: 'Ezra',
            text: 'Cuidado, Evelly. Esse lugar... as vozes que estou ouvindo não parecem normais. É como se estivessem nos chamando para alguma coisa.',
            effects: [{ type: 'warning' }]
        };

        window.dialogueSystem.showDialogue(ezraDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.cathedralExploration();
        });
    }

    cathedralExploration() {
        const explorationDialogue = {
            speaker: '',
            text: 'Ao explorar a catedral, vocês encontram evidências de um ritual antigo. Marcas no chão formam padrões estranhos.',
            choices: [
                {
                    text: 'Investigar os símbolos no chão',
                    type: 'investigate',
                    karma: 5
                },
                {
                    text: 'Procurar uma saída imediata',
                    type: 'flee',
                    karma: -5
                }
            ]
        };

        window.dialogueSystem.showDialogue(explorationDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.cathedralConclusion();
        });
    }

    cathedralConclusion() {
        const conclusionDialogue = {
            speaker: '',
            text: 'A catedral revela seus segredos lentamente. Vocês encontram pistas sobre o incêndio do teatro e a verdadeira natureza da sombra. Fim do Capítulo 4 - Rota da Verdade.',
            choices: [
                {
                    text: 'Continuar...',
                    type: 'neutral'
                }
            ]
        };

        window.dialogueSystem.showDialogue(conclusionDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.endChapter4();
        });
    }

    startHospitalPath() {
        const openingDialogue = {
            speaker: '',
            text: 'Vocês chegam a um hospital abandonado. Luzes fluorescentes piscam fracamente nos corredores vazios. O cheiro de desinfetante antigo mistura-se com algo mais sinistro.',
            effects: [{ type: 'fadeIn', duration: 2000 }]
        };

        window.dialogueSystem.showDialogue(openingDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.hospitalEvellyReaction();
        });
    }

    hospitalEvellyReaction() {
        const evellyDialogue = {
            speaker: 'Evelly',
            text: 'Esse lugar... me dá arrepios. É como se cada corredor guardasse um segredo terrível.',
            effects: [{ type: 'character_thought' }]
        };

        window.dialogueSystem.showDialogue(evellyDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.hospitalEzraWarning();
        });
    }

    hospitalEzraWarning() {
        this.showCharacter('ezra', 'nervous', 'right');
        
        const ezraDialogue = {
            speaker: 'Ezra',
            text: 'Evelly, precisamos ter muito cuidado aqui. Esse hospital... já vi esse lugar nos registros. Experimentos estranhos aconteceram aqui.',
            effects: [{ type: 'warning' }]
        };

        window.dialogueSystem.showDialogue(ezraDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.hospitalExploration();
        });
    }

    hospitalExploration() {
        const explorationDialogue = {
            speaker: '',
            text: 'Vocês encontram uma sala de arquivos com documentos sobre o "Projeto Marionete". Os registros falam de experimentos com trauma coletivo.',
            choices: [
                {
                    text: 'Ler os arquivos detalhadamente',
                    type: 'investigate',
                    karma: 5
                },
                {
                    text: 'Fugir deste lugar maldito',
                    type: 'flee',
                    karma: -5
                }
            ]
        };

        window.dialogueSystem.showDialogue(explorationDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.hospitalConclusion();
        });
    }

    hospitalConclusion() {
        const conclusionDialogue = {
            speaker: '',
            text: 'O hospital revela conexões perturbadoras entre o incêndio do teatro e experimentos psicológicos. A verdade começa a se formar. Fim do Capítulo 4 - Rota da Negação.',
            choices: [
                {
                    text: 'Continuar...',
                    type: 'neutral'
                }
            ]
        };

        window.dialogueSystem.showDialogue(conclusionDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.endChapter4();
        });
    }

    endChapter4() {
        window.gameState.progressToNextChapter();
        window.saveSystem.autoSave();
        
        const endDialogue = {
            speaker: '',
            text: 'Fim do Capítulo 4. O próximo capítulo ainda não está disponível.',
            choices: [
                {
                    text: 'Voltar ao Menu Principal',
                    type: 'neutral',
                    nextScene: 'main_menu'
                }
            ]
        };

        window.dialogueSystem.showDialogue(endDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            window.menuSystem?.showScreen('main-menu');
        });
    }
}

window.Chapter4 = Chapter4;
