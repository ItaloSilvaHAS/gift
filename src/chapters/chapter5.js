class Chapter5 {
    constructor() {
        this.name = 'O Coração do HollowMind';
        this.totalScenes = 5;
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
        this.changeBackground('fundocena4.jpeg', 'fade');
        
        setTimeout(() => {
            this.scene1_Arrival();
        }, 1500);
    }

    scene1_Arrival() {
        const karma = window.gameState.karma;
        
        const openingText = karma > 0 
            ? 'Após desvendarem os segredos da catedral, vocês encontram um portal dimensional que os leva ao núcleo do HollowMind - uma dimensão sombria onde o teatro original ainda existe, aprisionado entre realidades.'
            : 'Fugindo do hospital, vocês são sugados por uma anomalia espacial e caem no núcleo do HollowMind - uma dimensão onde o teatro incendiado ainda arde em chamas eternas.';

        const openingDialogue = {
            speaker: '',
            text: openingText,
            effects: [{ type: 'fadeIn', duration: 2000 }]
        };

        window.dialogueSystem.showDialogue(openingDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.scene2_TheaterReveal();
        });
    }

    scene2_TheaterReveal() {
        this.changeBackground('fundocena2.avif', 'fade');
        
        const theatreDialogue = {
            speaker: '',
            text: 'O teatro se ergue diante de vocês. Não em ruínas, mas intacto e pulsante. As luzes do palco estão acesas. Uma plateia de sombras os observa em silêncio absoluto.',
            effects: [{ type: 'horror_ambient' }]
        };

        window.dialogueSystem.showDialogue(theatreDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.scene3_EvellyMemory();
        });
    }

    scene3_EvellyMemory() {
        const evellyDialogue = {
            speaker: 'Evelly',
            text: 'Eu... eu conheço este lugar. Não apenas do incêndio. Eu JÁ ESTIVE aqui antes. Muitas vezes. Como é possível?',
            effects: [{ type: 'character_realization' }]
        };

        window.dialogueSystem.showDialogue(evellyDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.scene4_ShadowConfrontation();
        });
    }

    scene4_ShadowConfrontation() {
        this.showCharacter('ezra', 'cautious', 'right');
        
        const shadowDialogue = {
            speaker: '',
            text: 'Uma figura emerge do palco. A Sombra. Mas agora ela tem forma. E o rosto... é idêntico ao de Evelly, mas distorcido, marcado por cicatrizes de queimaduras.',
            choices: [
                {
                    text: 'Confrontar a Sombra diretamente',
                    type: 'brave',
                    karma: 10
                },
                {
                    text: 'Tentar dialogar e entender',
                    type: 'diplomatic',
                    karma: 15
                },
                {
                    text: 'Preparar para combate',
                    type: 'aggressive',
                    karma: -5
                }
            ]
        };

        window.dialogueSystem.showDialogue(shadowDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.scene5_TruthRevealed();
        });
    }

    scene5_TruthRevealed() {
        const truthDialogue = {
            speaker: 'Sombra',
            text: 'Você não entende, não é? Evelly... EU SOU VOCÊ. A versão que morreu no incêndio. O HollowMind nos mantém presas em um ciclo. Cada vez que você "escapa", a realidade reinicia. Você já viveu isso centenas de vezes.',
            effects: [{ type: 'dramatic_reveal' }]
        };

        window.dialogueSystem.showDialogue(truthDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.scene6_TheChoice();
        });
    }

    scene6_TheChoice() {
        const karma = window.gameState.karma;
        
        const choiceText = karma > 10
            ? 'A Sombra estende a mão. "Você pode me aceitar e nos tornarmos completas, quebrando o ciclo. Ou pode me rejeitar novamente e reiniciar tudo. Pela milésima vez."'
            : 'A Sombra ri amargamente. "Seu karma negativo mostra que você ainda está em negação. Quer fugir de novo? O ciclo nunca vai acabar assim."';

        const finalChoiceDialogue = {
            speaker: 'Sombra',
            text: choiceText,
            choices: [
                {
                    text: 'Aceitar a Sombra e se fundir com ela',
                    type: 'acceptance',
                    karma: 25
                },
                {
                    text: 'Rejeitar e tentar destruí-la',
                    type: 'denial',
                    karma: -20
                },
                {
                    text: 'Procurar uma terceira opção',
                    type: 'alternative',
                    karma: 10
                }
            ]
        };

        window.dialogueSystem.showDialogue(finalChoiceDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.endChapter5();
        });
    }

    endChapter5() {
        window.gameState.progressToNextChapter();
        window.saveSystem.autoSave();
        
        const karma = window.gameState.karma;
        
        const endText = karma > 30
            ? 'Evelly aceita sua sombra. Uma luz intensa envolve ambas. O teatro começa a desmoronar. Será este o fim do ciclo?'
            : karma > 0
            ? 'Evelly hesita, buscando outra saída. O teatro pulsa, como se estivesse vivo, aguardando sua decisão final.'
            : 'Evelly ataca a Sombra. O teatro grita em agonia. Tudo escurece. Quando a luz retorna... vocês estão de volta ao início. Novamente.';

        const endDialogue = {
            speaker: '',
            text: endText + ' Fim do Capítulo 5.',
            choices: [
                {
                    text: 'Continuar para o Capítulo Final...',
                    type: 'neutral'
                }
            ]
        };

        window.dialogueSystem.showDialogue(endDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            if (window.gameController) {
                window.gameController.loadChapter(6);
            }
        });
    }
}

window.Chapter5 = Chapter5;
