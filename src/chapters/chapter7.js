class Chapter7 {
    constructor() {
        this.name = 'O Fim ou o Recomeço';
        this.totalScenes = 10;
        this.currentCharacters = {};
        this.combatProgress = 0;
        this.spacebarPresses = 0;
        this.combatPhase = 0;
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
        this.changeBackground('finalcap7.png', 'fade');
        
        setTimeout(() => {
            this.openingScene();
        }, 1500);
    }

    openingScene() {
        const openingDialogue = {
            speaker: '',
            text: 'A Névoa se dissipa lentamente. Você sente o chão sólido sob seus pés. Finalmente... paz.'
        };

        window.dialogueSystem.showDialogue(openingDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaAndEvellyHug();
        });
    }

    erzaAndEvellyHug() {
        const hugDialogue = {
            speaker: '',
            text: 'Erza te abraça. Um abraço caloroso, reconfortante. Por um momento, você se sente segura. Pela primeira vez em muito tempo.'
        };

        window.dialogueSystem.showDialogue(hugDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaSaysGo();
        });
    }

    erzaSaysGo() {
        const goDialogue = {
            speaker: 'Erza',
            text: 'Vai, Evelly. Segue em frente. Você conseguiu. Você mereceu.'
        };

        window.dialogueSystem.showDialogue(goDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyTurnsToLeave();
        });
    }

    evellyTurnsToLeave() {
        const turnDialogue = {
            speaker: '',
            text: 'Você se afasta do abraço. Um sorriso no rosto. Você começa a caminhar. E então... você ouve.'
        };

        window.dialogueSystem.showDialogue(turnDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaStartsToSpeak();
        });
    }

    erzaStartsToSpeak() {
        const erzaDialogue = {
            speaker: 'Erza',
            text: 'Sabe, Evelly... você sempre foi tão inocente. Como uma criança. Acreditaria em qualquer coisa que falassem para você.'
        };

        window.dialogueSystem.showDialogue(erzaDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyTurnsBack();
        });
    }

    evellyTurnsBack() {
        const turnBackDialogue = {
            speaker: '',
            text: 'Você para. Se vira lentamente. E então... você a vê. Erza está ali. Bem na sua frente. MUITO perto. Rosto a rosto. Os olhos dela fixos nos seus.'
        };

        window.dialogueSystem.showDialogue(turnBackDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaDisturbingDialogue1();
        });
    }

    erzaDisturbingDialogue1() {
        const dialogue1 = {
            speaker: 'Erza',
            text: 'E se por acaso... só pudesse sair UMA de nós daqui? Você já parou pra pensar nisso?'
        };

        window.dialogueSystem.showDialogue(dialogue1);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyConfused();
        });
    }

    evellyConfused() {
        const confusedDialogue = {
            speaker: 'Evelly',
            text: 'Erza... do que você está falando? Nós conseguimos! Nós DUAS conseguimos!'
        };

        window.dialogueSystem.showDialogue(confusedDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaDisturbingDialogue2();
        });
    }

    erzaDisturbingDialogue2() {
        const dialogue2 = {
            speaker: 'Erza',
            text: 'Eu vejo o jeito que você segura essa arma, Evelly. O jeito que você olha pra mim. Você já pensou, né? Mais de uma vez... em apontar na minha direção e puxar o gatilho.'
        };

        window.dialogueSystem.showDialogue(dialogue2);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyDenies();
        });
    }

    evellyDenies() {
        const denyDialogue = {
            speaker: 'Evelly',
            text: 'NÃO! Eu nunca... Erza, eu confio em você! O que está acontecendo?!'
        };

        window.dialogueSystem.showDialogue(denyDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaDisturbingDialogue3();
        });
    }

    erzaDisturbingDialogue3() {
        const dialogue3 = {
            speaker: 'Erza',
            text: 'Confiar? Você confia em MIM? Ou você só estava me usando, Evelly? Usando-me como escudo. Como ferramenta. Como... descartável.'
        };

        window.dialogueSystem.showDialogue(dialogue3);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaDisturbingDialogue4();
        });
    }

    erzaDisturbingDialogue4() {
        const dialogue4 = {
            speaker: 'Erza',
            text: 'Porque é isso que eu sou pra você, não é? Uma alucinação. Uma projeção. Algo que você pode DESCARTAR quando não precisar mais.'
        };

        window.dialogueSystem.showDialogue(dialogue4);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyTearsUp();
        });
    }

    evellyTearsUp() {
        const tearsDialogue = {
            speaker: 'Evelly',
            text: 'Para com isso! PARA! Você não é assim! Você não é... você não pode ser...'
        };

        window.dialogueSystem.showDialogue(tearsDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaFinalTwist();
        });
    }

    erzaFinalTwist() {
        const finalDialogue = {
            speaker: 'Erza',
            text: 'Talvez eu seja exatamente isso. Ou talvez... talvez você seja o problema, Evelly. Talvez VOCÊ seja a ilusão. E eu sou a única coisa real aqui.'
        };

        window.dialogueSystem.showDialogue(finalDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.tensionRises();
        });
    }

    tensionRises() {
        const tensionDialogue = {
            speaker: '',
            text: 'O silêncio cai entre vocês. Pesado. Sufocante. As mãos de ambas se movem lentamente em direção às armas. A tensão é palpável. Uma fagulha... e tudo explode.'
        };

        window.dialogueSystem.showDialogue(tensionDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.finalChoice();
        });
    }

    finalChoice() {
        const choiceDialogue = {
            speaker: '',
            text: 'Este é o momento. O ponto de não retorno. Lutar... ou fazer as pazes?',
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
                this.startFightMinigame();
            } else {
                this.makePeace();
            }
        });
    }

    // ==================== MINIGAME DE LUTA FRENÉTICO ====================

    startFightMinigame() {
        const introDialogue = {
            speaker: '',
            text: 'Vocês se lançam uma contra a outra. Não há mais volta. Apenas sangue. Apenas morte.'
        };

        window.dialogueSystem.showDialogue(introDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.runFreneticFight();
        });
    }

    runFreneticFight() {
        const effectsDiv = document.getElementById('effects');
        
        const fightContainer = document.createElement('div');
        fightContainer.id = 'fight-minigame';
        fightContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(10, 0, 0, 0.98);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Orbitron', monospace;
        `;

        this.combatProgress = 0;
        this.spacebarPresses = 0;
        this.combatPhase = 0;

        fightContainer.innerHTML = `
            <div id="fight-progress-container" style="width: 80%; max-width: 800px; height: 40px; background: #1a0000; border: 3px solid #660000; margin-bottom: 2rem; position: relative;">
                <div id="evelly-progress" style="position: absolute; left: 0; top: 0; height: 100%; width: 50%; background: linear-gradient(90deg, #0099ff, #00ffff); transition: width 0.1s;"></div>
                <div id="erza-progress" style="position: absolute; right: 0; top: 0; height: 100%; width: 50%; background: linear-gradient(90deg, #ff0099, #ff00ff); transition: width 0.1s;"></div>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 1.2rem; color: #fff; font-weight: bold; z-index: 10; text-shadow: 0 0 10px #000;">
                    VS
                </div>
            </div>
            <div id="fight-action" style="font-size: 2rem; color: #ff0000; text-shadow: 0 0 20px #ff0000; margin-bottom: 2rem; text-align: center; min-height: 80px; font-weight: bold;">
                APERTE ESPAÇO RÁPIDO!
            </div>
            <div id="fight-timer" style="font-size: 3rem; color: #ffff00; text-shadow: 0 0 30px #ffaa00;">
                <span id="timer-value">10</span>
            </div>
            <div id="press-indicator" style="margin-top: 2rem; font-size: 1.5rem; color: #00ff00; text-shadow: 0 0 10px #00ff00;">
                Pressões: <span id="press-count">0</span>
            </div>
        `;

        effectsDiv.appendChild(fightContainer);

        let timeLeft = 10;
        let lastPressTime = Date.now();
        let pressSpeed = 0;

        const updateAction = () => {
            const actionDiv = document.getElementById('fight-action');
            const currentTime = Date.now();
            const timeSincePress = currentTime - lastPressTime;
            
            if (timeSincePress < 300 && pressSpeed > 3) {
                const evellyActions = [
                    'Evelly agarra o pulso de Erza!',
                    'Evelly desvia e contra-ataca!',
                    'Evelly empurra Erza contra a parede!',
                    'Evelly acerta um soco no rosto de Erza!',
                    'Evelly desarma Erza com um movimento brusco!',
                    'Evelly domina a luta!'
                ];
                actionDiv.textContent = evellyActions[Math.floor(Math.random() * evellyActions.length)];
                actionDiv.style.color = '#00ffff';
                this.combatProgress += 3;
            } else if (timeSincePress > 800) {
                const erzaActions = [
                    'Erza imobiliza Evelly!',
                    'Erza acerta um golpe violento!',
                    'Erza prende Evelly no chão!',
                    'Erza torce o braço de Evelly!',
                    'Erza consegue pegar a arma!',
                    'Erza está ganhando!'
                ];
                actionDiv.textContent = erzaActions[Math.floor(Math.random() * erzaActions.length)];
                actionDiv.style.color = '#ff00ff';
                this.combatProgress -= 3;
            } else {
                const neutralActions = [
                    'Elas lutam ferozmente!',
                    'Sangue respinga no chão!',
                    'Uma luta mortal!',
                    'Ninguém recua!'
                ];
                actionDiv.textContent = neutralActions[Math.floor(Math.random() * neutralActions.length)];
                actionDiv.style.color = '#ff0000';
            }

            this.combatProgress = Math.max(-100, Math.min(100, this.combatProgress));

            const evellyProgressBar = document.getElementById('evelly-progress');
            const erzaProgressBar = document.getElementById('erza-progress');
            
            if (this.combatProgress > 0) {
                evellyProgressBar.style.width = `${50 + this.combatProgress / 2}%`;
                erzaProgressBar.style.width = `${50 - this.combatProgress / 2}%`;
            } else {
                evellyProgressBar.style.width = `${50 + this.combatProgress / 2}%`;
                erzaProgressBar.style.width = `${50 - this.combatProgress / 2}%`;
            }
        };

        const handleSpacebar = (e) => {
            if (e.code === 'Space' || e.keyCode === 32) {
                e.preventDefault();
                this.spacebarPresses++;
                const currentTime = Date.now();
                const timeDiff = currentTime - lastPressTime;
                pressSpeed = 1000 / timeDiff;
                lastPressTime = currentTime;
                
                document.getElementById('press-count').textContent = this.spacebarPresses;
                updateAction();
            }
        };

        document.addEventListener('keydown', handleSpacebar);

        const actionInterval = setInterval(() => {
            updateAction();
        }, 500);

        const countdown = setInterval(() => {
            timeLeft--;
            document.getElementById('timer-value').textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(countdown);
                clearInterval(actionInterval);
                document.removeEventListener('keydown', handleSpacebar);
                fightContainer.remove();
                
                if (this.combatProgress > 20) {
                    this.evellyWins();
                } else if (this.combatProgress < -20) {
                    this.erzaWins();
                } else {
                    this.evellyWins();
                }
            }
        }, 1000);
    }

    evellyWins() {
        const struggle1 = {
            speaker: '',
            text: 'Com um último esforço... você consegue. Suas mãos tremem. Erza está no chão. Ferida. Sangrando.'
        };

        window.dialogueSystem.showDialogue(struggle1);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyGrabsGun();
        });
    }

    evellyGrabsGun() {
        const grabDialogue = {
            speaker: '',
            text: 'Você pega a arma. Aponta para Erza. Ela te olha. Sem medo. Apenas... tristeza.'
        };

        window.dialogueSystem.showDialogue(grabDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaLastWordsBeforeDeath();
        });
    }

    erzaLastWordsBeforeDeath() {
        const lastWords = {
            speaker: 'Erza',
            text: 'Vai... faz logo. Você venceu, Evelly. Mas... você nunca vai se perdoar por isso.'
        };

        window.dialogueSystem.showDialogue(lastWords);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyShootsErza();
        });
    }

    evellyShootsErza() {
        window.audioManager?.playSound('gunshot');
        
        const shootDialogue = {
            speaker: '',
            text: 'BANG!'
        };

        window.dialogueSystem.showDialogue(shootDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.visceralScene();
        });
    }

    visceralScene() {
        const visceral1 = {
            speaker: '',
            text: 'O corpo de Erza estremece. Sangue. MUITO sangue. Escorre pelos lábios dela. Ela tosse. Tenta respirar.'
        };

        window.dialogueSystem.showDialogue(visceral1);
        
        window.dialogueSystem.setNextAction(() => {
            this.visceralScene2();
        });
    }

    visceralScene2() {
        const visceral2 = {
            speaker: '',
            text: 'Os olhos dela te encaram. Cada vez mais vazios. A luz se apagando lentamente. Você vê a vida escapando. Segundo por segundo.'
        };

        window.dialogueSystem.showDialogue(visceral2);
        
        window.dialogueSystem.setNextAction(() => {
            this.visceralScene3();
        });
    }

    visceralScene3() {
        const visceral3 = {
            speaker: '',
            text: 'O sangue forma uma poça ao redor dela. Quente. Vermelho intenso. O cheiro metálico invade suas narinas. Você não consegue desviar o olhar.'
        };

        window.dialogueSystem.showDialogue(visceral3);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaDies();
        });
    }

    erzaDies() {
        const deathDialogue = {
            speaker: '',
            text: 'E então... o último suspiro. Erza para de se mover. Os olhos ficam fixos. Vazios. Ela se foi.'
        };

        window.dialogueSystem.showDialogue(deathDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyRealization();
        });
    }

    evellyRealization() {
        const realizationDialogue = {
            speaker: 'Evelly',
            text: 'O que... o que eu fiz? EU MATEI ELA! Eu... eu...'
        };

        window.dialogueSystem.showDialogue(realizationDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.showTragicEnding();
        });
    }

    erzaWins() {
        const erzaStruggles = {
            speaker: '',
            text: 'Erza é mais forte. Mais rápida. Ela te domina. Você cai. Sua cabeça bate no chão com força.'
        };

        window.dialogueSystem.showDialogue(erzaStruggles);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaPinsEvelly();
        });
    }

    erzaPinsEvelly() {
        const pinDialogue = {
            speaker: '',
            text: 'Você está no chão. Erza está sobre você. A arma apontada para sua cabeça. Você vê lágrimas nos olhos dela.'
        };

        window.dialogueSystem.showDialogue(pinDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaCries();
        });
    }

    erzaCries() {
        const cryDialogue = {
            speaker: 'Erza',
            text: 'Eu não queria... eu NÃO QUERIA que chegasse a isso! Mas... não tem outra forma. Desculpa, Evelly. Desculpa...'
        };

        window.dialogueSystem.showDialogue(cryDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaShootsEvelly();
        });
    }

    erzaShootsEvelly() {
        window.audioManager?.playSound('gunshot');
        
        const bangDialogue = {
            speaker: '',
            text: 'BANG!'
        };

        window.dialogueSystem.showDialogue(bangDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyDying();
        });
    }

    evellyDying() {
        const dyingDialogue = {
            speaker: '',
            text: 'Dor. Dor extrema. Você sente o sangue quente escorrendo. Seu corpo fica pesado. Você não consegue se mover.'
        };

        window.dialogueSystem.showDialogue(dyingDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyLastThoughts();
        });
    }

    evellyLastThoughts() {
        const thoughtsDialogue = {
            speaker: 'Evelly',
            text: 'Então... é assim... que termina? Depois de tudo... eu só... queria...'
        };

        window.dialogueSystem.showDialogue(thoughtsDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaScreams();
        });
    }

    erzaScreams() {
        const screamDialogue = {
            speaker: 'Erza',
            text: 'NÃO! EVELLY! EU MATEI VOCÊ! EU... EU NÃO QUERIA! POR QUÊ?! POR QUE TEVE QUE SER ASSIM?!'
        };

        window.dialogueSystem.showDialogue(screamDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.showTragicEnding();
        });
    }

    showTragicEnding() {
        const effectsDiv = document.getElementById('effects');
        
        const creditsDiv = document.createElement('div');
        creditsDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #000000 0%, #1a0000 100%);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #660000;
            font-family: 'Orbitron', monospace;
            opacity: 0;
            transition: opacity 3s ease;
        `;

        creditsDiv.innerHTML = `
            <h1 style="font-size: 4rem; margin-bottom: 2rem; text-shadow: 0 0 30px #ff0000; color: #ff0000;">
                FINAL 4
            </h1>
            <h2 style="font-size: 2.5rem; color: #990000; text-shadow: 0 0 20px #660000;">
                SACRIFÍCIO VAZIO
            </h2>
            <p style="margin-top: 3rem; font-size: 1.2rem; color: #666; max-width: 700px; text-align: center; line-height: 1.8;">
                Uma teve que morrer.<br>
                A outra teve que matar.<br><br>
                Não houve vitória.<br>
                Não houve libertação.<br>
                Apenas sangue, culpa e arrependimento eterno.<br><br>
                A Névoa não precisou destruí-las.<br>
                Elas se destruíram sozinhas.<br><br>
                E a sobrevivente... carregará esse peso<br>
                pelo resto de sua existência miserável.
            </p>
            <button onclick="location.reload()" style="margin-top: 3rem; padding: 1rem 2rem; background: #330000; color: #ff0000; border: 2px solid #660000; font-family: 'Orbitron', monospace; font-size: 1rem; cursor: pointer; box-shadow: 0 0 20px #660000;">
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
            text: 'NÃO! Eu não vou lutar com você, Erza! Eu escolho... eu ESCOLHO acreditar em você. Mesmo que tudo isso seja uma mentira!'
        };

        window.dialogueSystem.showDialogue(peaceDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyDropsWeapon();
        });
    }

    evellyDropsWeapon() {
        const dropDialogue = {
            speaker: '',
            text: 'Você solta sua arma. Ela cai no chão com um eco metálico. Suas mãos tremem. Mas você não recua.'
        };

        window.dialogueSystem.showDialogue(dropDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaHesitates();
        });
    }

    erzaHesitates() {
        const hesitateDialogue = {
            speaker: 'Erza',
            text: 'Evelly... por que? Por que você não luta? Eu te provoquei. Te manipulei. Te empurrei...'
        };

        window.dialogueSystem.showDialogue(hesitateDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyExplains();
        });
    }

    evellyExplains() {
        const explainDialogue = {
            speaker: 'Evelly',
            text: 'Porque eu entendi, Erza. Você não estava me provocando. Você estava me TESTANDO. Testando se eu aprendi alguma coisa com tudo isso.'
        };

        window.dialogueSystem.showDialogue(explainDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyInsists();
        });
    }

    evellyInsists() {
        const insistDialogue = {
            speaker: 'Evelly',
            text: 'E eu aprendi. Aprendi que a violência nunca resolve nada. Que confiar... mesmo quando dói... é a única forma de seguir em frente.'
        };

        window.dialogueSystem.showDialogue(insistDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaBreaks();
        });
    }

    erzaBreaks() {
        const breakDialogue = {
            speaker: 'Erza',
            text: '...Você passou, Evelly. Você finalmente... passou.'
        };

        window.dialogueSystem.showDialogue(breakDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaDropsWeapon();
        });
    }

    erzaDropsWeapon() {
        const dropDialogue = {
            speaker: '',
            text: 'Erza solta sua arma. Ela também cai com um estrondo. E então... Erza sorri. Um sorriso genuíno. Caloroso.'
        };

        window.dialogueSystem.showDialogue(dropDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaApologizes();
        });
    }

    erzaApologizes() {
        const apologizeDialogue = {
            speaker: 'Erza',
            text: 'Desculpa. Eu precisava ter certeza. Precisava saber se você realmente tinha mudado. E você mudou, Evelly. Você REALMENTE mudou.'
        };

        window.dialogueSystem.showDialogue(apologizeDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.theyHugAgain();
        });
    }

    theyHugAgain() {
        const hugDialogue = {
            speaker: '',
            text: 'Vocês se abraçam novamente. Mas desta vez... é diferente. É um abraço de DESPEDIDA.'
        };

        window.dialogueSystem.showDialogue(hugDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaFades();
        });
    }

    erzaFades() {
        const fadeDialogue = {
            speaker: 'Erza',
            text: 'Vai, Evelly. Segue em frente. Você conseguiu. Você está livre. E eu... eu vou ficar aqui. Porque meu papel acabou.'
        };

        window.dialogueSystem.showDialogue(fadeDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyProtests();
        });
    }

    evellyProtests() {
        const protestDialogue = {
            speaker: 'Evelly',
            text: 'NÃO! Vem comigo! Nós duas podemos sair! ERZA!'
        };

        window.dialogueSystem.showDialogue(protestDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaPhilosophical();
        });
    }

    erzaPhilosophical() {
        const philosophicalDialogue = {
            speaker: 'Erza',
            text: 'Eu não espero que você entenda. Mas... eu sou você. E você é eu. Duas partes do mesmo todo.'
        };

        window.dialogueSystem.showDialogue(philosophicalDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaContinuesPhilosophical();
        });
    }

    erzaContinuesPhilosophical() {
        const continueDialogue = {
            speaker: 'Erza',
            text: 'Você não vai se lembrar de nada disso. Mas saiba que você é forte. Você evoluiu. Você superou.'
        };

        window.dialogueSystem.showDialogue(continueDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.erzaLastWords();
        });
    }

    erzaLastWords() {
        const lastWordsDialogue = {
            speaker: 'Erza',
            text: 'Agora... vai. E vive. Vive por nós duas. Porque você merece essa paz.'
        };

        window.dialogueSystem.showDialogue(lastWordsDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.lightAppears();
        });
    }

    lightAppears() {
        const background = document.getElementById('background');
        background.style.transition = 'all 3s ease';
        background.style.filter = 'brightness(3)';
        
        const lightDialogue = {
            speaker: '',
            text: 'LUZ. Luz branca. Ofuscante. Você nunca viu nada tão bonito. E você sente... PAZ. PAZ VERDADEIRA.'
        };

        window.dialogueSystem.showDialogue(lightDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.showProjectNevoaExplanation();
        });
    }

    showProjectNevoaExplanation() {
        const effectsDiv = document.getElementById('effects');
        
        const explanationDiv = document.createElement('div');
        explanationDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #000000;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #00ff00;
            font-family: 'Orbitron', monospace;
            opacity: 0;
            transition: opacity 2s ease;
            padding: 3rem;
        `;

        explanationDiv.innerHTML = `
            <div style="max-width: 800px; text-align: center; line-height: 2;">
                <h2 style="font-size: 2rem; margin-bottom: 2rem; color: #00ff00; text-shadow: 0 0 20px #00ff00;">
                    [ PROJETO NÉVOA - PROTOCOLO DE ENCERRAMENTO ]
                </h2>
                <p style="font-size: 1.1rem; color: #00cc00; margin-bottom: 1.5rem;">
                    OBJETIVO: Induzir pacientes com traumas severos a um estado mental controlado,<br>
                    onde a própria psique cria cenários que forçam o processamento e superação do trauma.
                </p>
                <p style="font-size: 1.1rem; color: #00cc00; margin-bottom: 1.5rem;">
                    MÉTODO: A "Névoa" age como um véu entre consciente e inconsciente,<br>
                    permitindo que fragmentos da personalidade se manifestem como entidades separadas.
                </p>
                <p style="font-size: 1.1rem; color: #00cc00; margin-bottom: 1.5rem;">
                    No caso da paciente EVELLY:<br>
                    ERZA = Projeção da própria força interior e esperança de Evelly.<br>
                    Uma guardiã criada pela mente para guiá-la através do trauma.
                </p>
                <p style="font-size: 1.3rem; color: #00ff00; margin-top: 2rem; font-weight: bold;">
                    STATUS: TRATAMENTO CONCLUÍDO COM SUCESSO
                </p>
                <p style="font-size: 1rem; color: #008800; margin-top: 1.5rem;">
                    A paciente superou o trauma.<br>
                    Memórias do processo serão suprimidas.<br>
                    Apenas a cura permanecerá.
                </p>
            </div>
        `;

        effectsDiv.appendChild(explanationDiv);

        setTimeout(() => {
            explanationDiv.style.opacity = '1';
        }, 100);

        setTimeout(() => {
            explanationDiv.style.opacity = '0';
            setTimeout(() => {
                explanationDiv.remove();
                this.awakening();
            }, 2000);
        }, 8000);
    }

    awakening() {
        this.clearScreen();
        this.changeBackground('fundocena3.jpeg', 'fade');
        
        const awakeDialogue = {
            speaker: '',
            text: 'Você abre os olhos. Luz suave. Teto branco. Você está... em um hospital. Mas não é a Névoa. Isso é... REAL.'
        };

        window.dialogueSystem.showDialogue(awakeDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.confusedEvelly();
        });
    }

    confusedEvelly() {
        const confusedDialogue = {
            speaker: 'Evelly',
            text: 'Onde... onde eu estou? O que aconteceu?'
        };

        window.dialogueSystem.showDialogue(confusedDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.nurseAppears();
        });
    }

    nurseAppears() {
        const nurseDialogue = {
            speaker: 'Enfermeira',
            text: 'Você está acordada! Graças a Deus! Calma, querida. Você passou por um procedimento experimental. Projeto Névoa. É normal se sentir confusa.'
        };

        window.dialogueSystem.showDialogue(nurseDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyAsks();
        });
    }

    evellyAsks() {
        const askDialogue = {
            speaker: 'Evelly',
            text: 'Névoa? Eu... eu me lembro. Lembro de tudo. Mas... Erza? Ela era real?'
        };

        window.dialogueSystem.showDialogue(askDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.nurseExplains();
        });
    }

    nurseExplains() {
        const explainDialogue = {
            speaker: 'Enfermeira',
            text: 'O tratamento foi bem-sucedido. Você processou e superou o trauma que a atormentava há anos. É um milagre da neurociência moderna.'
        };

        window.dialogueSystem.showDialogue(explainDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyRealizesThetruth();
        });
    }

    evellyRealizesThetruth() {
        const realizeDialogue = {
            speaker: 'Evelly',
            text: 'Eu... eu não me lembro de muita coisa. Mas sinto que algo mudou. Como se um peso tivesse saído dos meus ombros.'
        };

        window.dialogueSystem.showDialogue(realizeDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.finalRealization();
        });
    }

    finalRealization() {
        const finalDialogue = {
            speaker: 'Evelly',
            text: 'Pela primeira vez em anos... eu me sinto em paz. Livre. Como se eu finalmente pudesse respirar.'
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
                Evelly escolheu a confiança ao invés da violência.<br>
                A paz ao invés da guerra.<br>
                E com isso, ela finalmente se libertou.<br><br>
                O Projeto Névoa foi um sucesso.<br>
                Evelly despertou com clareza mental<br>
                e a paz interior que sempre buscou.<br><br>
                Erza nunca foi real... mas o impacto dela foi.<br>
                Às vezes, precisamos criar nossos próprios anjos<br>
                para encontrar a luz na escuridão.
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
