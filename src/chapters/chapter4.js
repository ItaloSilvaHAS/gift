class Chapter4 {
    constructor() {
        this.name = 'Fragmentos da Verdade';
        this.totalScenes = 8;
        this.currentPuzzle = null;
        this.currentCharacters = {};
        this.minigameActive = false;
        this.playerChoice = null;
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
                background.style.backgroundSize = 'cover';
                background.style.backgroundPosition = 'center';
                background.style.opacity = '1';
            }, 1000);
        } else {
            background.style.backgroundImage = `url('${imagePath}')`;
            background.style.backgroundSize = 'cover';
            background.style.backgroundPosition = 'center';
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
            this.scene1_Wandering();
        }, 500);
    }

    scene1_Wandering() {
        this.changeBackground('EveErza4cap.png', 'fade');
        
        const openingDialogue = {
            speaker: '',
            text: 'Vocês caminham pelos corredores intermináveis. As paredes parecem respirar. O ar está denso, carregado de memórias que não são suas... ou são?',
            effects: [{ type: 'fadeIn', duration: 2000 }]
        };

        window.dialogueSystem.showDialogue(openingDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.scene2_ErzaQuestion();
        });
    }

    scene2_ErzaQuestion() {
        this.showCharacter('ezra', 'nervous', 'right');
        
        const ezraDialogue = {
            speaker: 'Ezra',
            text: 'Evelly... eu preciso te perguntar algo. Por que você está aqui? Em HollowMind, quero dizer. Eu... eu não sei a resposta. Mas tenho a sensação de que VOCÊ sabe.',
            effects: [{ type: 'question' }]
        };

        window.dialogueSystem.showDialogue(ezraDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.scene3_EvellyResponse();
        });
    }

    scene3_EvellyResponse() {
        const responseDialogue = {
            speaker: 'Evelly',
            text: 'Eu... não sei. Ou talvez... não queira saber. Tem algo na minha mente, como uma porta trancada que eu tenho medo de abrir.',
            choices: [
                {
                    text: 'Tentar se lembrar, enfrentar a verdade',
                    type: 'brave',
                    karma: 10
                },
                {
                    text: 'Evitar pensar nisso, continuar andando',
                    type: 'avoid',
                    karma: -5
                },
                {
                    text: 'Pedir ajuda a Erza para entender',
                    type: 'trust',
                    karma: 5
                }
            ]
        };

        window.dialogueSystem.showDialogue(responseDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.scene4_MemoryFlash();
        });
    }

    scene4_MemoryFlash() {
        const flashDialogue = {
            speaker: '',
            text: 'De repente, uma dor lancinante atinge sua cabeça. Fragmentos de memórias começam a emergir - um palco em chamas, gritos, e... suas próprias mãos tremendo enquanto segurava algo.',
            effects: [{ type: 'pain' }]
        };

        window.dialogueSystem.showDialogue(flashDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.startMemoryMinigame();
        });
    }

    // ==================== MINIGAME 1: SEQUÊNCIA DE MEMÓRIA ====================

    startMemoryMinigame() {
        this.minigameActive = true;
        
        const minigameIntroDialogue = {
            speaker: '',
            text: 'Imagens piscam na sua mente em sequência rápida. Você precisa se concentrar e memorizar a ordem das cores que aparecem!',
            effects: [{ type: 'warning' }]
        };

        window.dialogueSystem.showDialogue(minigameIntroDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.runMemorySequenceGame();
        });
    }

    runMemorySequenceGame() {
        const effectsDiv = document.getElementById('effects');
        
        const minigameContainer = document.createElement('div');
        minigameContainer.id = 'memory-minigame';
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
            color: #ff6666;
            font-family: 'Orbitron', monospace;
        `;

        minigameContainer.innerHTML = `
            <h2 style="font-size: 2rem; margin-bottom: 2rem; text-shadow: 0 0 10px #ff0000;">
                TESTE DE REAÇÃO!
            </h2>
            <div id="memory-display" style="width: 400px; height: 400px; background: #111; border: 3px solid #666; display: flex; align-items: center; justify-content: center; font-size: 3rem; margin-bottom: 2rem; transition: all 0.3s;">
                Aguarde...
            </div>
            <p id="minigame-instruction" style="font-size: 1.3rem; margin-top: 1rem; text-align: center; max-width: 600px;">
                Pressione <strong>ESPAÇO</strong> quando a cor <strong style="color: #ff0000;">VERMELHA</strong> aparecer!
            </p>
            <p id="minigame-score" style="font-size: 1.1rem; margin-top: 1rem; color: #ffaa00;">
                Acertos: 0 / 3
            </p>
        `;

        effectsDiv.appendChild(minigameContainer);

        setTimeout(() => {
            this.startReactionGame();
        }, 2000);
    }

    startReactionGame() {
        const memoryDisplay = document.getElementById('memory-display');
        const scoreDisplay = document.getElementById('minigame-score');
        const instructionDisplay = document.getElementById('minigame-instruction');
        
        const colors = ['#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const targetColor = '#ff0000';
        
        let score = 0;
        let attempts = 0;
        const maxAttempts = 12;
        let currentColor = null;
        let gameActive = true;
        
        instructionDisplay.innerHTML = 'Pressione <strong>ESPAÇO</strong> quando a cor <strong style="color: #ff0000;">VERMELHA</strong> aparecer!<br><span style="color: #ff6666; font-size: 0.9rem;">ATENÇÃO: Aperte apenas quando for vermelho! Erros custam pontos!</span>';
        scoreDisplay.textContent = 'Acertos: 0 / 5';
        
        const showRandomColor = () => {
            if (attempts >= maxAttempts) {
                this.endReactionGame(score >= 5);
                return;
            }
            
            attempts++;
            const isTarget = Math.random() < 0.35;
            
            if (isTarget) {
                currentColor = targetColor;
                memoryDisplay.style.background = targetColor;
                memoryDisplay.textContent = '🎯';
            } else {
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                currentColor = randomColor;
                memoryDisplay.style.background = randomColor;
                memoryDisplay.textContent = '⭕';
            }
            
            setTimeout(() => {
                memoryDisplay.style.background = '#111';
                memoryDisplay.textContent = 'Aguarde...';
                currentColor = null;
                
                const nextDelay = 500 + Math.random() * 800;
                setTimeout(showRandomColor, nextDelay);
            }, 750);
        };
        
        const spaceHandler = (e) => {
            if (e.code === 'Space' && gameActive) {
                e.preventDefault();
                
                if (currentColor === targetColor) {
                    score++;
                    scoreDisplay.textContent = `Acertos: ${score} / 5`;
                    scoreDisplay.style.color = '#00ff00';
                    memoryDisplay.textContent = '✓ ACERTO!';
                } else if (currentColor !== null) {
                    score = Math.max(0, score - 1);
                    scoreDisplay.textContent = `Acertos: ${score} / 5`;
                    scoreDisplay.style.color = '#ff0000';
                    memoryDisplay.textContent = '✗ ERRO!';
                } else {
                    score = Math.max(0, score - 1);
                    scoreDisplay.textContent = `Acertos: ${score} / 5`;
                    scoreDisplay.style.color = '#ff0000';
                    memoryDisplay.textContent = '✗ CEDO DEMAIS!';
                }
                
                setTimeout(() => {
                    scoreDisplay.style.color = '#ffaa00';
                }, 300);
            }
        };
        
        document.addEventListener('keydown', spaceHandler);
        
        this.reactionGameCleanup = () => {
            gameActive = false;
            document.removeEventListener('keydown', spaceHandler);
        };
        
        showRandomColor();
    }

    endReactionGame(success) {
        if (this.reactionGameCleanup) {
            this.reactionGameCleanup();
        }
        
        setTimeout(() => {
            const minigameContainer = document.getElementById('memory-minigame');
            if (minigameContainer) {
                minigameContainer.remove();
            }

            this.minigameActive = false;

            if (success) {
                this.memoryGameSuccess();
            } else {
                this.memoryGameFailure();
            }
        }, 1500);
    }

    memoryGameSuccess() {
        window.gameState.adjustKarma(10, 'Memória recuperada');
        
        const successDialogue = {
            speaker: 'Evelly',
            text: 'Eu me lembro agora... era uma noite de estreia. O teatro estava cheio. Mas algo deu errado. Muito errado. E eu... eu estava lá.',
            effects: [{ type: 'realization' }]
        };

        window.dialogueSystem.showDialogue(successDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.scene5_TheRevelation();
        });
    }

    memoryGameFailure() {
        window.gameState.adjustKarma(-5, 'Falha na memória');
        
        const failureWarning = {
            speaker: '',
            text: 'A dor se intensifica. Sua mente não consegue processar. Algo está vindo das sombras...',
            effects: [{ type: 'warning' }]
        };

        window.dialogueSystem.showDialogue(failureWarning);
        
        window.dialogueSystem.setNextAction(() => {
            window.gameController.showRandomJumpscare(2500, () => {
                this.afterFirstJumpscare();
            });
        });
    }

    afterFirstJumpscare() {
        const afterDialogue = {
            speaker: 'Ezra',
            text: 'EVELLY! Você está bem? Por um momento pensei que... Vamos continuar. Precisamos sair daqui.',
            effects: [{ type: 'concern' }]
        };

        window.dialogueSystem.showDialogue(afterDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.scene5_TheRevelation();
        });
    }

    scene5_TheRevelation() {
        this.showCharacter('ezra', 'cautious', 'right');
        
        const revelationDialogue = {
            speaker: 'Ezra',
            text: 'Evelly, você não acha estranho? Digo...tudo isso. Você se lembra o que estava fazendo antes de chegar aqui? Hollowmind, o centro psiquiatrico. E se... e se tudo isso for parte de algo maior? Algo que você está tentando esconder até de si mesma? Quero dizer, você lembra de algo, não é? Lembra do que estava fazendo antes de acordar aqui?',
            effects: [{ type: 'discovery' }]
        };

        window.dialogueSystem.showDialogue(revelationDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.scene6_EvellyReaction();
        });
    }

    scene6_EvellyReaction() {
        const reactionDialogue = {
            speaker: 'Evelly',
            text: 'Eu... eu não sei. Estou confusa. Tudo isso é tão... surreal.',
            choices: [
                {
                    text: 'Aceitar a realidade e investigar mais',
                    type: 'acceptance',
                    karma: 10
                },
                {
                    text: 'Negar e tentar fugir',
                    type: 'denial',
                    karma: -10
                },
                {
                    text: 'Pedir a Erza para explicar tudo',
                    type: 'trust',
                    karma: 5
                }
            ]
        };

        window.dialogueSystem.showDialogue(reactionDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.scene7_FinalMoment();
        });
    }

    scene7_FinalMoment() {
        const finalDialogue = {
            speaker: '',
            text: 'O ambiente começa a se distorcer. As paredes derretem como cera. Vozes ecoam de todos os lados. "Marionete... marionete... dance para nós..."',
            effects: [{ type: 'horror' }]
        };

        window.dialogueSystem.showDialogue(finalDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.scene8_Collapse();
        });
    }

    scene8_Collapse() {
        this.showCharacter('ezra', 'nervous', 'right');
        
        const collapseDialogue = {
            speaker: 'Ezra',
            text: 'Evelly? EVELLY! Não! Fica comigo! Por favor!',
            effects: [{ type: 'panic' }]
        };

        window.dialogueSystem.showDialogue(collapseDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyFaints();
        });
    }

    evellyFaints() {
        const background = document.getElementById('background');
        background.style.transition = 'opacity 3s ease';
        background.style.opacity = '0';
        
        this.clearScreen();

        const faintDialogue = {
            speaker: '',
            text: 'Tudo escurece. Você sente seu corpo desabar. A última coisa que ouve é a voz de Erza chamando seu nome, cada vez mais distante...',
            effects: [{ type: 'fadeOut' }]
        };

        window.dialogueSystem.showDialogue(faintDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.transitionToHub();
        });
    }

    transitionToHub() {
        setTimeout(() => {
            const transitionDialogue = {
                speaker: '',
                text: '...',
                effects: [{ type: 'blackScreen' }]
            };

            window.dialogueSystem.showDialogue(transitionDialogue);
            
            window.dialogueSystem.setNextAction(() => {
                this.wakingUp();
            });
        }, 2000);
    }

    wakingUp() {
        this.changeBackground('cap55.jpg', 'fade');
        
        const wakeDialogue = {
            speaker: '',
            text: 'Você desperta lentamente. Luzes fluorescentes brancas ferem seus olhos. O cheiro de desinfetante hospitalar invade suas narinas. Você está... em um hospital?',
            effects: [{ type: 'fadeIn', duration: 3000 }]
        };

        window.dialogueSystem.showDialogue(wakeDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaCarriedYou();
        });
    }

    erzaCarriedYou() {
        this.showCharacter('ezra', 'nervous', 'right');
        
        const erzaDialogue = {
            speaker: 'Ezra',
            text: 'Você acordou! Graças a Deus. Eu te carreguei até aqui. Parece ser algum tipo de... recepção? Hub central? Não sei se aquilo tudo antes foi real ou... uma alucinação coletiva.',
            effects: [{ type: 'relief' }]
        };

        window.dialogueSystem.showDialogue(erzaDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.hubDescription();
        });
    }

    hubDescription() {
        const hubDialogue = {
            speaker: '',
            text: 'Vocês estão em um hall de entrada hospitalar. À frente, uma porta de saída com luz verde. À esquerda, um balcão de recepção abandonado. À direita, um elevador com luzes apagadas. Salas de espera vazias cercam o ambiente.',
            choices: [
                {
                    text: 'Entender o que aconteceu e seguir em frente',
                    type: 'continue',
                    karma: 5
                }
            ]
        };

        window.dialogueSystem.showDialogue(hubDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.endChapter4();
        });
    }

    endChapter4() {
        window.gameState.progressToNextChapter();
        window.saveSystem.autoSave();
        
        const endDialogue = {
            speaker: '',
            text: 'Você se levanta, ainda tonta. Este lugar parece real. Muito real. Talvez mais real do que tudo que você viu antes. Fim do Capítulo 4.',
            choices: [
                {
                    text: 'Continuar para o Capítulo 5...',
                    type: 'neutral'
                }
            ]
        };

        window.dialogueSystem.showDialogue(endDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.clearScreen();
            setTimeout(() => {
                if (window.gameController) {
                    window.gameController.loadChapter(5);
                } else {
                    console.error('GameController não encontrado!');
                }
            }, 1000);
        });
    }
}

window.Chapter4 = Chapter4;
