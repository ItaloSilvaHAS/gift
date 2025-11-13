class Chapter7 {
    constructor() {
        this.name = 'O Fim ou o Recomeço';
        this.totalScenes = 10;
        this.currentCharacters = {};
        this.combatRound = 0;
        this.evellyHP = 100;
        this.erzaHP = 100;
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
        console.log('Iniciando Capítulo 7: O Fim ou o Recomeço');
        
        window.gameState.currentChapter = 7;
        window.gameState.currentScene = 1;
        
        this.clearScreen();
        this.changeBackground('cap55.jpg', 'fade');
        
        setTimeout(() => {
            this.openingScene();
        }, 1500);
    }

    openingScene() {
        const openingDialogue = {
            speaker: '',
            text: 'A Névoa se dissipa. Você está de volta ao vazio. Mas desta vez... algo é diferente. Você sente... CLAREZA.'
        };

        window.dialogueSystem.showDialogue(openingDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaAppears();
        });
    }

    erzaAppears() {
        this.showCharacter('erza', 'angry', 'right');
        
        const erzaDialogue = {
            speaker: 'Erza',
            text: 'Evelly... chegamos ao fim. Mas só UMA de nós pode sair daqui. A Névoa exige... um sacrifício.'
        };

        window.dialogueSystem.showDialogue(erzaDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyResponds();
        });
    }

    evellyResponds() {
        const evellyDialogue = {
            speaker: 'Evelly',
            text: 'Não... não pode ser assim. Nós podemos sair JUNTAS! Por favor, Erza. Não faça isso!'
        };

        window.dialogueSystem.showDialogue(evellyDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaExplains();
        });
    }

    erzaExplains() {
        this.showCharacter('erza', 'sad', 'right');
        
        const explainDialogue = {
            speaker: 'Erza',
            text: 'Eu... talvez eu nunca tenha sido real, Evelly. Talvez eu seja apenas uma projeção da sua mente. Mas se for pra você viver... eu vou lutar.'
        };

        window.dialogueSystem.showDialogue(explainDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.finalChoice();
        });
    }

    finalChoice() {
        const choiceDialogue = {
            speaker: '',
            text: 'Erza saca uma arma. Você também está armada. Este é o momento. Lutar... ou fazer as pazes?',
            choices: [
                {
                    text: 'Lutar até a morte',
                    type: 'fight',
                    karma: -30
                },
                {
                    text: 'Tentar fazer as pazes',
                    type: 'peace',
                    karma: 50
                }
            ]
        };

        window.dialogueSystem.showDialogue(choiceDialogue);
        
        window.dialogueSystem.setNextAction((choice) => {
            if (choice && choice.type === 'fight') {
                this.startCombatMinigame();
            } else {
                this.makePeace();
            }
        });
    }

    // ==================== COMBATE ATÉ A MORTE ====================

    startCombatMinigame() {
        const combatIntro = {
            speaker: '',
            text: 'Vocês se encaram. Armas em punho. Apenas uma pode sobreviver. O combate começa AGORA!'
        };

        window.dialogueSystem.showDialogue(combatIntro);
        
        window.dialogueSystem.setNextAction(() => {
            this.runCombatMinigame();
        });
    }

    runCombatMinigame() {
        const effectsDiv = document.getElementById('effects');
        
        const combatContainer = document.createElement('div');
        combatContainer.id = 'combat-minigame';
        combatContainer.style.cssText = `
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
            font-family: 'Orbitron', monospace;
        `;

        this.combatRound = 0;
        this.evellyHP = 100;
        this.erzaHP = 100;

        combatContainer.innerHTML = `
            <h2 style="font-size: 2.5rem; color: #ff0000; text-shadow: 0 0 10px #ff0000; margin-bottom: 3rem;">
                COMBATE MORTAL
            </h2>
            <div style="display: flex; width: 80%; justify-content: space-between; margin-bottom: 3rem;">
                <div style="text-align: center;">
                    <h3 style="color: #00ffff; font-size: 1.5rem;">EVELLY</h3>
                    <div style="width: 300px; height: 30px; background: #333; border: 2px solid #00ffff; margin-top: 1rem;">
                        <div id="evelly-hp-bar" style="width: 100%; height: 100%; background: linear-gradient(90deg, #00ffff, #0099ff); transition: width 0.3s;"></div>
                    </div>
                    <p style="color: #fff; margin-top: 0.5rem;"><span id="evelly-hp">100</span> HP</p>
                </div>
                <div style="text-align: center;">
                    <h3 style="color: #ff00ff; font-size: 1.5rem;">ERZA</h3>
                    <div style="width: 300px; height: 30px; background: #333; border: 2px solid #ff00ff; margin-top: 1rem;">
                        <div id="erza-hp-bar" style="width: 100%; height: 100%; background: linear-gradient(90deg, #ff00ff, #ff0099); transition: width 0.3s;"></div>
                    </div>
                    <p style="color: #fff; margin-top: 0.5rem;"><span id="erza-hp">100</span> HP</p>
                </div>
            </div>
            <div id="combat-prompt" style="font-size: 1.5rem; color: #ffff00; margin-bottom: 2rem; text-align: center; min-height: 50px;">
                Prepare-se...
            </div>
            <div id="combat-buttons" style="display: flex; gap: 2rem;">
                <button id="attack-btn" style="
                    padding: 1.5rem 3rem;
                    background: #660000;
                    color: #fff;
                    border: 3px solid #ff0000;
                    font-family: 'Orbitron', monospace;
                    font-size: 1.3rem;
                    cursor: pointer;
                    box-shadow: 0 0 20px #ff0000;
                    display: none;
                ">
                    ATACAR
                </button>
                <button id="dodge-btn" style="
                    padding: 1.5rem 3rem;
                    background: #000066;
                    color: #fff;
                    border: 3px solid #0000ff;
                    font-family: 'Orbitron', monospace;
                    font-size: 1.3rem;
                    cursor: pointer;
                    box-shadow: 0 0 20px #0000ff;
                    display: none;
                ">
                    DESVIAR
                </button>
            </div>
            <div id="combat-timer" style="margin-top: 2rem; font-size: 2rem; color: #ff0000; display: none;">
                <span id="timer-value">3</span>
            </div>
        `;

        effectsDiv.appendChild(combatContainer);

        setTimeout(() => {
            this.startCombatRound();
        }, 2000);
    }

    startCombatRound() {
        this.combatRound++;
        
        const promptDiv = document.getElementById('combat-prompt');
        const attackBtn = document.getElementById('attack-btn');
        const dodgeBtn = document.getElementById('dodge-btn');
        const timerDiv = document.getElementById('combat-timer');
        const timerValue = document.getElementById('timer-value');
        
        if (this.evellyHP <= 0) {
            this.evellyDefeated();
            return;
        }
        
        if (this.erzaHP <= 0) {
            this.erzaDefeated();
            return;
        }

        const actions = [
            { text: 'Erza está mirando em você! O que você faz?', correct: 'dodge', damage: 30 },
            { text: 'Erza está distraída! Momento perfeito para atacar!', correct: 'attack', damage: 25 },
            { text: 'Erza está recarregando! ATAQUE AGORA!', correct: 'attack', damage: 35 },
            { text: 'Erza está correndo em sua direção! DESVIE!', correct: 'dodge', damage: 40 }
        ];

        const action = actions[Math.floor(Math.random() * actions.length)];
        
        promptDiv.textContent = action.text;
        attackBtn.style.display = 'inline-block';
        dodgeBtn.style.display = 'inline-block';
        timerDiv.style.display = 'block';

        let timeLeft = 3;
        timerValue.textContent = timeLeft;
        let responded = false;

        const countdown = setInterval(() => {
            timeLeft--;
            timerValue.textContent = timeLeft;
            
            if (timeLeft <= 0 && !responded) {
                clearInterval(countdown);
                responded = true;
                this.handleCombatTimeout(action.damage);
            }
        }, 1000);

        const handleChoice = (choice) => {
            if (responded) return;
            responded = true;
            clearInterval(countdown);
            
            attackBtn.style.display = 'none';
            dodgeBtn.style.display = 'none';
            timerDiv.style.display = 'none';

            if (choice === action.correct) {
                this.handleCorrectChoice(action);
            } else {
                this.handleWrongChoice(action.damage);
            }
        };

        attackBtn.onclick = () => handleChoice('attack');
        dodgeBtn.onclick = () => handleChoice('dodge');
    }

    handleCorrectChoice(action) {
        const promptDiv = document.getElementById('combat-prompt');
        
        if (action.correct === 'attack') {
            this.erzaHP = Math.max(0, this.erzaHP - action.damage);
            promptDiv.textContent = `ACERTO! Você causou ${action.damage} de dano em Erza!`;
            promptDiv.style.color = '#00ff00';
        } else {
            promptDiv.textContent = 'DESVIOU! Você evitou o ataque de Erza!';
            promptDiv.style.color = '#00ffff';
        }

        this.updateHealthBars();

        setTimeout(() => {
            promptDiv.style.color = '#ffff00';
            this.erzaTurn();
        }, 1500);
    }

    handleWrongChoice(damage) {
        const promptDiv = document.getElementById('combat-prompt');
        
        this.evellyHP = Math.max(0, this.evellyHP - damage);
        promptDiv.textContent = `ERRO! Você tomou ${damage} de dano!`;
        promptDiv.style.color = '#ff0000';

        this.updateHealthBars();

        setTimeout(() => {
            promptDiv.style.color = '#ffff00';
            this.erzaTurn();
        }, 1500);
    }

    handleCombatTimeout(damage) {
        const promptDiv = document.getElementById('combat-prompt');
        const attackBtn = document.getElementById('attack-btn');
        const dodgeBtn = document.getElementById('dodge-btn');
        const timerDiv = document.getElementById('combat-timer');
        
        attackBtn.style.display = 'none';
        dodgeBtn.style.display = 'none';
        timerDiv.style.display = 'none';
        
        this.evellyHP = Math.max(0, this.evellyHP - damage);
        promptDiv.textContent = `TEMPO ESGOTADO! Você tomou ${damage} de dano!`;
        promptDiv.style.color = '#ff0000';

        this.updateHealthBars();

        setTimeout(() => {
            promptDiv.style.color = '#ffff00';
            this.erzaTurn();
        }, 1500);
    }

    erzaTurn() {
        const damage = Math.floor(Math.random() * 15) + 10;
        this.evellyHP = Math.max(0, this.evellyHP - damage);
        
        const promptDiv = document.getElementById('combat-prompt');
        promptDiv.textContent = `Erza contra-ataca! Você recebeu ${damage} de dano!`;
        promptDiv.style.color = '#ff6666';

        this.updateHealthBars();

        setTimeout(() => {
            promptDiv.style.color = '#ffff00';
            this.startCombatRound();
        }, 1500);
    }

    updateHealthBars() {
        const evellyHPBar = document.getElementById('evelly-hp-bar');
        const erzaHPBar = document.getElementById('erza-hp-bar');
        const evellyHPText = document.getElementById('evelly-hp');
        const erzaHPText = document.getElementById('erza-hp');

        evellyHPBar.style.width = `${this.evellyHP}%`;
        erzaHPBar.style.width = `${this.erzaHP}%`;
        evellyHPText.textContent = this.evellyHP;
        erzaHPText.textContent = this.erzaHP;
    }

    evellyDefeated() {
        const combatContainer = document.getElementById('combat-minigame');
        if (combatContainer) {
            combatContainer.remove();
        }

        const deathDialogue = {
            speaker: '',
            text: 'Você cai. O mundo gira. Erza está sobre você. Fumegante. E então... tudo escurece.'
        };

        window.dialogueSystem.showDialogue(deathDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.showDeathEnding();
        });
    }

    erzaDefeated() {
        const combatContainer = document.getElementById('combat-minigame');
        if (combatContainer) {
            combatContainer.remove();
        }

        window.audioManager?.playSound('gunshot');

        const victoryDialogue = {
            speaker: '',
            text: 'Erza cai. Sangue. Muito sangue. Você venceu. Mas a que custo?'
        };

        window.dialogueSystem.showDialogue(victoryDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.afterVictory();
        });
    }

    afterVictory() {
        this.hideCharacter('erza');
        
        const afterDialogue = {
            speaker: 'Evelly',
            text: 'Eu... eu matei ela. Eu matei a única pessoa que estava comigo. O que eu fiz? O QUE EU FIZ?!'
        };

        window.dialogueSystem.showDialogue(afterDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.showDeathEnding();
        });
    }

    showDeathEnding() {
        const effectsDiv = document.getElementById('effects');
        
        const creditsDiv = document.createElement('div');
        creditsDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #330000 0%, #000000 100%);
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
                FINAL 4
            </h1>
            <h2 style="font-size: 2.5rem; color: #cc0000; text-shadow: 0 0 15px #660000;">
                MORTE E SOLIDÃO
            </h2>
            <p style="margin-top: 3rem; font-size: 1.2rem; color: #999; max-width: 600px; text-align: center; line-height: 1.8;">
                Evelly e Erza lutaram até o fim.<br>
                Apenas uma sobreviveu.<br>
                Mas a vitória não trouxe libertação.<br>
                Apenas mais dor. Mais culpa. Mais vazio.<br>
                A Névoa sempre vence.
            </p>
            <button onclick="location.reload()" style="margin-top: 3rem; padding: 1rem 2rem; background: #660000; color: #fff; border: 2px solid #ff0000; font-family: 'Orbitron', monospace; font-size: 1rem; cursor: pointer; box-shadow: 0 0 10px #ff0000;">
                Voltar ao Menu
            </button>
        `;

        effectsDiv.appendChild(creditsDiv);

        setTimeout(() => {
            creditsDiv.style.opacity = '1';
        }, 100);
    }

    // ==================== FAZER AS PAZES ====================

    makePeace() {
        const peaceDialogue = {
            speaker: 'Evelly',
            text: 'NÃO! Eu não vou lutar com você, Erza! Se eu aprendi alguma coisa... é que a violência não resolve nada. Eu ESCOLHO fazer as pazes!'
        };

        window.dialogueSystem.showDialogue(peaceDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyDropsWeapon();
        });
    }

    evellyDropsWeapon() {
        const dropDialogue = {
            speaker: '',
            text: 'Você solta sua arma. Ela cai no chão com um eco metálico. Você estende a mão para Erza.'
        };

        window.dialogueSystem.showDialogue(dropDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaHesitates();
        });
    }

    erzaHesitates() {
        this.showCharacter('erza', 'sad', 'right');
        
        const hesitateDialogue = {
            speaker: 'Erza',
            text: 'Evelly... você tem certeza? A Névoa... ela vai...'
        };

        window.dialogueSystem.showDialogue(hesitateDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyInsists();
        });
    }

    evellyInsists() {
        const insistDialogue = {
            speaker: 'Evelly',
            text: 'Eu tenho certeza. Erza... real ou não... você me ajudou. Você esteve comigo. E eu não vou te abandonar. NUNCA.'
        };

        window.dialogueSystem.showDialogue(insistDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaAccepts();
        });
    }

    erzaAccepts() {
        this.showCharacter('erza', 'happy', 'right');
        
        const acceptDialogue = {
            speaker: 'Erza',
            text: '...Obrigada, Evelly. Por me escolher. Por escolher a esperança ao invés do medo.'
        };

        window.dialogueSystem.showDialogue(acceptDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.theyHug();
        });
    }

    theyHug() {
        const hugDialogue = {
            speaker: '',
            text: 'Vocês se abraçam. E então... algo muda. A Névoa começa a se dissipar. De verdade desta vez.'
        };

        window.dialogueSystem.showDialogue(hugDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.lightAppears();
        });
    }

    lightAppears() {
        const background = document.getElementById('background');
        background.style.transition = 'all 3s ease';
        background.style.filter = 'brightness(2)';
        
        const lightDialogue = {
            speaker: '',
            text: 'LUZ. Luz branca. Pura. Você nunca viu nada tão bonito. E você sente... PAZ.'
        };

        window.dialogueSystem.showDialogue(lightDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.awakening();
        });
    }

    awakening() {
        this.clearScreen();
        this.changeBackground('fundocena3.jpeg', 'fade');
        
        const awakeDialogue = {
            speaker: '',
            text: 'Você abre os olhos. Luz suave. Teto branco. Você está... em um hospital? Mas não é a Névoa. Isso é... REAL.'
        };

        window.dialogueSystem.showDialogue(awakeDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.confusedEvelly();
        });
    }

    confusedEvelly() {
        const confusedDialogue = {
            speaker: 'Evelly',
            text: 'Onde... onde eu estou? O que aconteceu? Eu não me lembro de... nada.'
        };

        window.dialogueSystem.showDialogue(confusedDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.nurseAppears();
        });
    }

    nurseAppears() {
        const nurseDialogue = {
            speaker: 'Enfermeira',
            text: 'Você está acordada! Graças a Deus! Calma, querida. Você passou por um procedimento experimental. É normal não se lembrar.'
        };

        window.dialogueSystem.showDialogue(nurseDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyAsks();
        });
    }

    evellyAsks() {
        const askDialogue = {
            speaker: 'Evelly',
            text: 'Procedimento? Experimental? Eu... eu não entendo.'
        };

        window.dialogueSystem.showDialogue(askDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.nurseExplains();
        });
    }

    nurseExplains() {
        const explainDialogue = {
            speaker: 'Enfermeira',
            text: 'O Projeto Névoa. Você sofreu um trauma severo há anos. O projeto foi criado para ajudar pessoas como você... a processar e superar seus traumas através de simulações mentais.'
        };

        window.dialogueSystem.showDialogue(explainDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyRealizesThetruth();
        });
    }

    evellyRealizesThetruth() {
        const realizeDialogue = {
            speaker: 'Evelly',
            text: 'Então... tudo aquilo era... uma simulação? A Névoa? Os monstros? Erza?'
        };

        window.dialogueSystem.showDialogue(realizeDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.nurseContinues();
        });
    }

    nurseContinues() {
        const continueDialogue = {
            speaker: 'Enfermeira',
            text: 'Tudo fazia parte do tratamento. Você reviveu seu trauma repetidamente até que sua mente pudesse finalmente processá-lo e... aceitá-lo. E você conseguiu. Você SUPEROU.'
        };

        window.dialogueSystem.showDialogue(continueDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.finalRealization();
        });
    }

    finalRealization() {
        const finalDialogue = {
            speaker: 'Evelly',
            text: 'Eu... eu me lembro agora. O incêndio. As pessoas. Mas... eu não sinto mais... culpa. Eu sinto... paz. Pela primeira vez em anos.'
        };

        window.dialogueSystem.showDialogue(finalDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.showRedemptionEnding();
        });
    }

    showRedemptionEnding() {
        const effectsDiv = document.getElementById('effects');
        
        const creditsDiv = document.createElement('div');
        creditsDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #ffffff 0%, #e6f7ff 100%);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #003366;
            font-family: 'Orbitron', monospace;
            opacity: 0;
            transition: opacity 3s ease;
        `;

        creditsDiv.innerHTML = `
            <h1 style="font-size: 4rem; margin-bottom: 2rem; text-shadow: 0 0 20px #66ccff; color: #0066cc;">
                FINAL 5
            </h1>
            <h2 style="font-size: 2.5rem; color: #0099ff; text-shadow: 0 0 15px #66ccff;">
                RENASCIMENTO
            </h2>
            <p style="margin-top: 3rem; font-size: 1.2rem; color: #333; max-width: 700px; text-align: center; line-height: 1.8;">
                Evelly escolheu o perdão ao invés da vingança.<br>
                A paz ao invés da guerra.<br>
                E com isso, ela finalmente se libertou.<br><br>
                O Projeto Névoa foi um sucesso.<br>
                Evelly despertou sem memória do trauma,<br>
                mas com a paz interior que sempre buscou.<br><br>
                Às vezes, esquecer é a única forma de seguir em frente.<br>
                E começar de novo.
            </p>
            <button onclick="location.reload()" style="margin-top: 3rem; padding: 1rem 2rem; background: #0066cc; color: #fff; border: 2px solid #66ccff; font-family: 'Orbitron', monospace; font-size: 1rem; cursor: pointer; box-shadow: 0 0 10px #66ccff;">
                Voltar ao Menu
            </button>
        `;

        effectsDiv.appendChild(creditsDiv);

        setTimeout(() => {
            creditsDiv.style.opacity = '1';
        }, 100);
    }
}

window.Chapter7 = Chapter7;
