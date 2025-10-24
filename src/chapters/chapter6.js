class Chapter6 {
    constructor() {
        this.name = 'Renascimento ou Eternidade';
        this.totalScenes = 6;
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
        console.log('Iniciando Capítulo 6: FINAL - Renascimento ou Eternidade');
        
        window.gameState.currentChapter = 6;
        window.gameState.currentScene = 1;
        
        this.clearScreen();
        
        const karma = window.gameState.karma;
        
        if (karma > 30) {
            this.finalGoodEnding();
        } else if (karma > 0) {
            this.finalNeutralEnding();
        } else {
            this.finalBadEnding();
        }
    }

    finalGoodEnding() {
        this.changeBackground('fundocena4.jpeg', 'fade');
        
        const scene1 = {
            speaker: '',
            text: 'A fusão entre Evelly e sua Sombra cria uma explosão de luz. O teatro dimensional se desintegra. Vocês sentem como se estivessem atravessando centenas de realidades simultaneamente.',
            effects: [{ type: 'fadeIn', duration: 2000 }]
        };

        window.dialogueSystem.showDialogue(scene1);
        
        window.dialogueSystem.setNextAction(() => {
            this.goodEnding_Part2();
        });
    }

    goodEnding_Part2() {
        this.showCharacter('ezra', 'surprised', 'right');
        
        const scene2 = {
            speaker: 'Ezra',
            text: 'Evelly! Você está... diferente. Seus olhos... você consegue ver além do véu agora, não é?',
        };

        window.dialogueSystem.showDialogue(scene2);
        
        window.dialogueSystem.setNextAction(() => {
            this.goodEnding_Part3();
        });
    }

    goodEnding_Part3() {
        const scene3 = {
            speaker: 'Evelly (Completa)',
            text: 'Sim. Eu me lembro de tudo agora. Todas as vidas. Todos os ciclos. E finalmente... estou livre. O HollowMind foi destruído. As outras vítimas presas também estão livres.',
        };

        window.dialogueSystem.showDialogue(scene3);
        
        window.dialogueSystem.setNextAction(() => {
            this.goodEnding_Final();
        });
    }

    goodEnding_Final() {
        this.changeBackground('fundocena1.jpeg', 'fade');
        
        const finalScene = {
            speaker: '',
            text: 'Vocês acordam em um campo aberto, sob um céu estrelado real. O teatro, a dimensão sombria, tudo desapareceu. Evelly está completa. O ciclo foi quebrado. Pela primeira vez em séculos, ela está verdadeiramente viva. FIM - FINAL VERDADEIRO: RENASCIMENTO',
            choices: [
                {
                    text: 'Créditos',
                    type: 'neutral'
                }
            ]
        };

        window.dialogueSystem.showDialogue(finalScene);
        
        window.dialogueSystem.setNextAction(() => {
            this.showCredits('RENASCIMENTO');
        });
    }

    finalNeutralEnding() {
        this.changeBackground('fundocena3.jpeg', 'fade');
        
        const scene1 = {
            speaker: '',
            text: 'Evelly busca uma terceira opção. Ela não aceita nem rejeita a Sombra. Em vez disso, propõe uma coexistência. A Sombra hesita, mas concorda.',
            effects: [{ type: 'fadeIn', duration: 2000 }]
        };

        window.dialogueSystem.showDialogue(scene1);
        
        window.dialogueSystem.setNextAction(() => {
            this.neutralEnding_Part2();
        });
    }

    neutralEnding_Part2() {
        this.showCharacter('ezra', 'cautious', 'right');
        
        const scene2 = {
            speaker: 'Sombra',
            text: 'Muito bem. Você não fugiu, mas também não aceitou completamente. O ciclo foi... modificado. Você viverá, mas eu permanecerei como sua consciência. Sempre presente.',
        };

        window.dialogueSystem.showDialogue(scene2);
        
        window.dialogueSystem.setNextAction(() => {
            this.neutralEnding_Final();
        });
    }

    neutralEnding_Final() {
        this.changeBackground('fundocena2.avif', 'fade');
        
        const finalScene = {
            speaker: '',
            text: 'O teatro não desaparece completamente. Ele se torna parte da realidade de Evelly, visível apenas para ela. Ela escapa do ciclo, mas carrega as memórias e a Sombra como parte de si. Uma liberdade incompleta. FIM - FINAL NEUTRO: COEXISTÊNCIA',
            choices: [
                {
                    text: 'Créditos',
                    type: 'neutral'
                }
            ]
        };

        window.dialogueSystem.showDialogue(finalScene);
        
        window.dialogueSystem.setNextAction(() => {
            this.showCredits('COEXISTÊNCIA');
        });
    }

    finalBadEnding() {
        this.changeBackground('fundocena2.avif', 'fade');
        
        const scene1 = {
            speaker: '',
            text: 'Evelly ataca a Sombra com toda sua força. Um combate brutal se desenrola no palco dimensional. A Sombra grita, chora, implora. Mas Evelly não para.',
            effects: [{ type: 'fadeIn', duration: 2000 }]
        };

        window.dialogueSystem.showDialogue(scene1);
        
        window.dialogueSystem.setNextAction(() => {
            this.badEnding_Part2();
        });
    }

    badEnding_Part2() {
        const scene2 = {
            speaker: 'Sombra (agonizante)',
            text: 'Você... não entende... Se me destruir... o ciclo... REINICIA...',
        };

        window.dialogueSystem.showDialogue(scene2);
        
        window.dialogueSystem.setNextAction(() => {
            this.badEnding_Part3();
        });
    }

    badEnding_Part3() {
        this.changeBackground('fundocena4.jpeg', 'fade');
        
        const scene3 = {
            speaker: '',
            text: 'A Sombra se desintegra. Por um momento, Evelly sente vitória. Então, tudo escurece. Um som familiar... o alarme de incêndio. O cheiro de fumaça. Ela está de volta no teatro. No dia do incêndio. Novamente.',
        };

        window.dialogueSystem.showDialogue(scene3);
        
        window.dialogueSystem.setNextAction(() => {
            this.badEnding_Final();
        });
    }

    badEnding_Final() {
        this.showCharacter('ezra', 'neutral', 'right');
        
        const finalScene = {
            speaker: 'Ezra',
            text: 'Ei, Evelly! Você está bem? Ficou olhando para o vazio de novo. Vamos, o ensaio vai começar...',
        };

        window.dialogueSystem.showDialogue(finalScene);
        
        window.dialogueSystem.setNextAction(() => {
            this.badEnding_Twist();
        });
    }

    badEnding_Twist() {
        const twistScene = {
            speaker: '',
            text: 'Evelly olha ao redor. Tudo está exatamente como estava. Ela não se lembra de nada do que aconteceu. O ciclo recomeçou. Pela milésima primeira vez. E ela nunca saberá. FIM - FINAL RUIM: CICLO ETERNO',
            choices: [
                {
                    text: 'Créditos',
                    type: 'neutral'
                }
            ]
        };

        window.dialogueSystem.showDialogue(twistScene);
        
        window.dialogueSystem.setNextAction(() => {
            this.showCredits('CICLO ETERNO');
        });
    }

    showCredits(endingType) {
        this.clearScreen();
        
        const creditsDiv = document.createElement('div');
        creditsDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #000, #1a0033);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 3000;
            font-family: 'Orbitron', monospace;
            color: white;
            overflow-y: auto;
            padding: 3rem;
            text-align: center;
        `;
        
        const karma = window.gameState.karma;
        
        creditsDiv.innerHTML = `
            <h1 style="font-size: 3rem; margin-bottom: 1rem; color: #FFD700; text-shadow: 0 0 20px #FFD700;">
                EVELLY: A SOMBRA DO HOLLOWMIND
            </h1>
            
            <h2 style="font-size: 2rem; margin-bottom: 2rem; color: #FF69B4;">
                FINAL OBTIDO: ${endingType}
            </h2>
            
            <div style="margin-bottom: 2rem; padding: 1.5rem; background: rgba(255,255,255,0.1); border-radius: 10px;">
                <p style="font-size: 1.3rem; margin-bottom: 0.5rem;">Karma Final: ${karma}</p>
                <p style="font-size: 1.1rem; color: #DDA0DD;">
                    ${karma > 30 ? '★★★ Perfeito - Você quebrou o ciclo!' : 
                      karma > 0 ? '★★☆ Bom - Você encontrou um equilíbrio.' : 
                      '★☆☆ Você ficou preso no ciclo.'}
                </p>
            </div>
            
            <div style="margin-top: 2rem; line-height: 2;">
                <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #90EE90;">História & Design</h3>
                <p style="font-size: 1.1rem;">Criado com paixão para você</p>
                
                <h3 style="font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; color: #90EE90;">Tecnologia</h3>
                <p style="font-size: 1.1rem;">Electron, JavaScript, HTML5, CSS3</p>
                
                <h3 style="font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; color: #90EE90;">Sistema de Karma</h3>
                <p style="font-size: 1.1rem;">Suas escolhas moldaram esta história</p>
                
                <h3 style="font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; color: #FFD700;">Obrigado por Jogar!</h3>
                <p style="font-size: 1.2rem; margin-top: 1rem;">
                    ${this.getEndingMessage(endingType)}
                </p>
            </div>
            
            <button id="return-menu-btn" style="
                margin-top: 3rem;
                padding: 1rem 3rem;
                font-size: 1.2rem;
                background: linear-gradient(135deg, #8B008B, #FF1493);
                color: white;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                font-family: 'Orbitron', monospace;
                transition: all 0.3s;
            ">VOLTAR AO MENU PRINCIPAL</button>
        `;
        
        document.body.appendChild(creditsDiv);
        
        const returnBtn = document.getElementById('return-menu-btn');
        returnBtn.addEventListener('mouseenter', () => {
            returnBtn.style.transform = 'scale(1.1)';
            returnBtn.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
        });
        returnBtn.addEventListener('mouseleave', () => {
            returnBtn.style.transform = 'scale(1)';
            returnBtn.style.boxShadow = 'none';
        });
        returnBtn.addEventListener('click', () => {
            creditsDiv.remove();
            window.menuSystem?.showScreen('main-menu');
        });
        
        window.gameState.flags.gameCompleted = true;
        window.gameState.flags.endingAchieved = endingType;
        window.saveSystem.autoSave();
    }

    getEndingMessage(endingType) {
        switch(endingType) {
            case 'RENASCIMENTO':
                return 'Você ajudou Evelly a quebrar o ciclo e encontrar a paz verdadeira. Parabéns pelo final perfeito!';
            case 'COEXISTÊNCIA':
                return 'Evelly encontrou um equilíbrio entre aceitar e negar seu passado. Um final agridoce, mas significativo.';
            case 'CICLO ETERNO':
                return 'Evelly permanece presa no ciclo infinito. Talvez, em outra vida, ela encontre a paz...';
            default:
                return 'Obrigado por experimentar esta jornada de horror psicológico!';
        }
    }
}

window.Chapter6 = Chapter6;
