class Chapter6 {
    constructor() {
        this.name = 'O Núcleo da Névoa';
        this.totalScenes = 15;
        this.currentCharacters = {};
        this.erzaAlive = true;
        this.playerShot = false;
        this.controlMinigameActive = false;
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
        this.changeBackground('cap6rota1.avif', 'fade');
        
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
        this.changeBackground('cap6rota1.avif', 'fade');
        
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
        window.audioManager?.playSound('jumpscare');
        
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
            if (window.Chapter5 && window.Chapter5.prototype.realityCollapse) {
                const chapter5 = new window.Chapter5();
                chapter5.realityCollapse();
            } else {
                this.showBadEndingTragedy();
            }
        });
    }

    soloShootShadow() {
        window.audioManager?.playSound('gunshot');
        
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
            this.startControlMinigame();
        });
    }

    startControlMinigame() {
        const minigameIntro = {
            speaker: '',
            text: 'A Sombra avança. Você sente seu corpo convulsionar. Os gritos enchem sua mente. Você precisa RESISTIR. Clique RÁPIDO para manter o controle!'
        };

        window.dialogueSystem.showDialogue(minigameIntro);
        
        window.dialogueSystem.setNextAction(() => {
            this.runControlMinigame();
        });
    }

    runControlMinigame() {
        const effectsDiv = document.getElementById('effects');
        
        const minigameContainer = document.createElement('div');
        minigameContainer.id = 'control-minigame';
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
            font-family: 'Orbitron', monospace;
        `;

        let controlLevel = 100;
        let clicks = 0;
        const targetClicks = 15;
        let timeLeft = 10;
        let gameInterval;
        let countdownInterval;

        minigameContainer.innerHTML = `
            <h2 style="font-size: 2rem; color: #ff0000; text-shadow: 0 0 10px #ff0000;">
                RESISTA À SOMBRA!
            </h2>
            <div style="margin: 2rem; font-size: 1.5rem; color: #fff;">
                Controle: <span id="control-level">${controlLevel}</span>%
            </div>
            <div style="margin: 1rem; font-size: 1.2rem; color: #ff6666;">
                Toques: <span id="click-count">${clicks}</span> / ${targetClicks}
            </div>
            <div style="margin: 1rem; font-size: 1.2rem; color: #ffff00;">
                Tempo: <span id="time-left">${timeLeft}</span>s
            </div>
            <div style="margin-top: 2rem; padding: 2rem 4rem; background: #660000; color: #fff; border: 3px solid #ff0000; font-family: 'Orbitron', monospace; font-size: 1.5rem; box-shadow: 0 0 20px #ff0000; text-align: center;">
                APERTE ESPAÇO!
            </div>
        `;

        effectsDiv.appendChild(minigameContainer);

        const controlLevelSpan = document.getElementById('control-level');
        const clickCountSpan = document.getElementById('click-count');
        const timeLeftSpan = document.getElementById('time-left');

        const handleKeyPress = (e) => {
            if (e.code === 'Space' || e.keyCode === 32) {
                e.preventDefault();
                clicks++;
                clickCountSpan.textContent = clicks;
                controlLevel = Math.min(100, controlLevel + 10);
                controlLevelSpan.textContent = controlLevel;

                if (clicks >= targetClicks) {
                    clearInterval(gameInterval);
                    clearInterval(countdownInterval);
                    document.removeEventListener('keydown', handleKeyPress);
                    minigameContainer.remove();
                    this.controlSuccess();
                }
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        gameInterval = setInterval(() => {
            controlLevel = Math.max(0, controlLevel - 5);
            controlLevelSpan.textContent = controlLevel;

            if (controlLevel <= 0) {
                clearInterval(gameInterval);
                clearInterval(countdownInterval);
                minigameContainer.remove();
                this.controlFailure();
            }
        }, 500);

        countdownInterval = setInterval(() => {
            timeLeft--;
            timeLeftSpan.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(gameInterval);
                clearInterval(countdownInterval);
                minigameContainer.remove();
                this.controlFailure();
            }
        }, 1000);
    }

    controlFailure() {
        this.showBadEndingTragedy();
    }

    controlSuccess() {
        const currentKarma = window.gameState?.karma || 0;
        
        if (currentKarma >= 50) {
            this.liberationEnding();
        } else {
            this.continueToChapter7();
        }
    }

    liberationEnding() {
        const cryingDialogue = {
            speaker: 'Evelly',
            text: 'EU ME ARREPENDO! Eu sinto muito! MUITO! Se eu pudesse voltar... eu faria diferente! EU FARIA TUDO DIFERENTE!'
        };

        window.dialogueSystem.showDialogue(cryingDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.flashbackReveal();
        });
    }

    flashbackReveal() {
        const flashbackDialogue = {
            speaker: '',
            text: 'Um flashback rasga sua mente. Você vê... TUDO. A verdade que você enterrou tão profundamente.'
        };

        window.dialogueSystem.showDialogue(flashbackDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.theaterFlashback();
        });
    }

    theaterFlashback() {
        this.changeBackground('fundocena1.jpg', 'fade');
        
        const theaterDialogue = {
            speaker: '',
            text: 'O show. Seu show. O público gritava seu nome. A adrenalina. A GLÓRIA. "GRITEM MAIS!" você pediu. E então...'
        };

        window.dialogueSystem.showDialogue(theaterDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.fireStarts();
        });
    }

    fireStarts() {
        const fireDialogue = {
            speaker: '',
            text: 'O fogo. Os efeitos pirotécnicos que deveriam apenas empolgar o público... começaram a se alastrar. As cortinas pegaram fogo. O pânico começou.'
        };

        window.dialogueSystem.showDialogue(fireDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.criticalFlashbackChoice();
        });
    }

    criticalFlashbackChoice() {
        const choiceDialogue = {
            speaker: '',
            text: 'Você estava no palco. Podia parar o show. Podia SALVAR todos. Mas a glória... o momento perfeito... ou a vida deles?',
            choices: [
                {
                    text: 'Fugir sozinha - Preservar sua glória',
                    type: 'selfish',
                    karma: -100
                },
                {
                    text: 'Parar o show - Salvar todos',
                    type: 'heroic',
                    karma: 100
                }
            ]
        };

        window.dialogueSystem.showDialogue(choiceDialogue);
        
        window.dialogueSystem.setNextAction((choice) => {
            if (choice && choice.type === 'selfish') {
                setTimeout(() => {
                    window.gameController.showRandomJumpscare(3000, () => {
                        this.showBadEndingTragedy();
                    });
                }, 500);
            } else {
                this.heroicSacrifice();
            }
        });
    }

    heroicSacrifice() {
        const sacrificeDialogue = {
            speaker: 'Evelly',
            text: 'PAREM! SAIAM TODOS! AGORA! O fogo está se espalhando! CORRAM!'
        };

        window.dialogueSystem.showDialogue(sacrificeDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.everyoneEscapes();
        });
    }

    everyoneEscapes() {
        const escapeDialogue = {
            speaker: '',
            text: 'As pessoas correram. Você as guiou. Uma a uma. Todas escaparam. Mas você... você ficou pra trás. As chamas te cercaram. E então...'
        };

        window.dialogueSystem.showDialogue(escapeDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.showLiberationEnding();
        });
    }

    showLiberationEnding() {
        this.changeBackground('fundocena3.jpeg', 'fade');
        
        const endingDialogue = {
            speaker: '',
            text: 'Escuridão. E então... BIP. BIP. BIP.'
        };

        window.dialogueSystem.showDialogue(endingDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.hospitalReveal();
        });
    }

    hospitalReveal() {
        const doctorDialogue = {
            speaker: 'Médico 1',
            text: 'Nível de culpa reduzido em 78%. Córtex pré-frontal demonstrando aceitação do trauma. Projeto Névoa... parcial sucesso.'
        };

        window.dialogueSystem.showDialogue(doctorDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.doctorContinues();
        });
    }

    doctorContinues() {
        const doctor2Dialogue = {
            speaker: 'Médico 2',
            text: 'Mas os sinais vitais estão caindo. Ela não vai resistir. O experimento a empurrou além do limite.'
        };

        window.dialogueSystem.showDialogue(doctor2Dialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.finalDoctorWords();
        });
    }

    finalDoctorWords() {
        const finalDialogue = {
            speaker: 'Médico 1',
            text: 'A Névoa fez seu trabalho. Ela reconstruiu sua psique, forçou-a a confrontar a culpa. Mas o preço... foi alto demais. Paciente E.V.... falecida.'
        };

        window.dialogueSystem.showDialogue(finalDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.showLiberationCredits();
        });
    }

    showLiberationCredits() {
        const effectsDiv = document.getElementById('effects');
        
        const creditsDiv = document.createElement('div');
        creditsDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #000000 0%, #1a0033 100%);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-family: 'Orbitron', monospace;
            opacity: 0;
            transition: opacity 3s ease;
        `;

        creditsDiv.innerHTML = `
            <h1 style="font-size: 4rem; margin-bottom: 2rem; text-shadow: 0 0 20px #00ffff; color: #00ffff;">
                FINAL 2
            </h1>
            <h2 style="font-size: 2.5rem; color: #66ccff; text-shadow: 0 0 15px #0099ff;">
                LIBERTAÇÃO
            </h2>
            <p style="margin-top: 3rem; font-size: 1.2rem; color: #aaa; max-width: 600px; text-align: center; line-height: 1.8;">
                Evelly enfrentou seus demônios.<br>
                No final, ela escolheu o heroísmo sobre a glória.<br>
                A Névoa a libertou... mas custou tudo.<br><br>
                O Projeto Névoa: Forçar a mente a reviver o trauma<br>
                até que a culpa seja processada e aceita.
            </p>
            <button onclick="location.reload()" style="margin-top: 3rem; padding: 1rem 2rem; background: #003366; color: #fff; border: 2px solid #00ffff; font-family: 'Orbitron', monospace; font-size: 1rem; cursor: pointer; box-shadow: 0 0 10px #00ffff;">
                Voltar ao Menu
            </button>
        `;

        effectsDiv.appendChild(creditsDiv);

        setTimeout(() => {
            creditsDiv.style.opacity = '1';
        }, 100);
    }

    showBadEndingTragedy() {
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

    continueToChapter7() {
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
