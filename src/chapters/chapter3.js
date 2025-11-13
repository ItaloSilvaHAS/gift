class Chapter3 {
    constructor() {
        this.name = "A Tragédia Esquecida";
        this.totalScenes = 5;
        this.currentPuzzle = null;
        this.currentCharacters = {};

        // Piano puzzle system
        this.pianoPuzzle = {
            correctSequence: [1, 4, 7, 3, 6], // Sequência das luzes/notas
            playerInput: [],
            currentStep: 0,
            failures: 0,
            maxFailures: 3,
            isActive: false,
            lightsFlashing: false,
        };

        // Maze game system
        this.mazeGame = {
            isActive: false,
            playerX: 1,
            playerY: 1,
            goalX: 13,
            goalY: 13,
            timeRemaining: 45,
            cellSize: 30,
            maze: [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
                [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
                [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
                [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
                [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
                [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ],
        };

        // Story flags
        this.storyFlags = {
            tragicMemoryChoice: null,
            ezraConfidence: 0,
            terrorLevel: 0,
            revealedConnection: false,
        };
    }

    // ====== SISTEMA DE EXIBIÇÃO DE PERSONAGENS ======
    showCharacter(characterName, expression = "neutral", position = "center") {
        const charactersDiv = document.getElementById("characters");

        const existingChar = document.getElementById(`char-${characterName}`);
        if (existingChar) {
            existingChar.remove();
        }

        const charElement = document.createElement("div");
        charElement.id = `char-${characterName}`;
        charElement.className = `character character-${position}`;

        let imagePath;

        // Mapping específico para cada personagem e suas expressões
        if (characterName === "ezra" || characterName === "erza") {
            // Mapear expressões da Erza/Ezra
            const erzaExpressionMap = {
                neutral: "ErzaSprite_happy.webp",
                casual: "ErzaSprite_happy.webp",
                angry: "ErzaSprite_angry.webp",
                smirk: "ErzaSprite_smirk.webp",
                happy: "ErzaSprite_happy.webp",
                sad: "ErzaSprite_angry.webp",
                surprised: "ErzaSprite_happy.webp",
                cautious: "ErzaSprite_smirk.webp",
                nervous: "ErzaSprite_angry.webp",
            };

            const spriteFile =
                erzaExpressionMap[expression] || "ErzaSprite_happy.webp";
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

        charElement.style.opacity = "0";
        charElement.style.transform = "translateY(50px)";

        setTimeout(() => {
            charElement.style.transition = "all 0.5s ease";
            charElement.style.opacity = "1";
            charElement.style.transform = "translateY(0)";
        }, 100);
    }

    applyCharacterPosition(element, position) {
        element.style.cssText = `
            position: absolute;
            bottom: 0;
            z-index: 15;
            height: 65vh;
            display: flex;
            align-items: flex-end;
            justify-content: center;
        `;

        switch (position) {
            case "left":
                element.style.left = "15%";
                break;
            case "right":
                element.style.right = "15%";
                break;
            case "center":
                element.style.left = "50%";
                element.style.transform = "translateX(-50%)";
                break;
        }

        const img = element.querySelector(".character-sprite");
        if (img) {
            img.style.cssText = `
                height: 100%;
                width: auto;
                object-fit: contain;
                filter: drop-shadow(0 0 20px rgba(0,0,0,0.5));
            `;
        }
    }

    hideCharacter(characterName) {
        const charElement = this.currentCharacters[characterName];
        if (charElement) {
            charElement.style.opacity = "0";
            charElement.style.transform = "translateY(50px)";

            setTimeout(() => {
                charElement.remove();
                delete this.currentCharacters[characterName];
            }, 500);
        }
    }

    changeCharacterExpression(characterName, newExpression) {
        const charElement = this.currentCharacters[characterName];
        if (charElement) {
            const img = charElement.querySelector(".character-sprite");

            // Mapear expressões especiais para Erza
            if (characterName === "ezra" || characterName === "erza") {
                const erzaExpressionMap = {
                    neutral: "ErzaSprite_happy.webp",
                    casual: "ErzaSprite_happy.webp",
                    angry: "ErzaSprite_angry.webp",
                    smirk: "ErzaSprite_smirk.webp",
                    happy: "ErzaSprite_happy.webp",
                    sad: "ErzaSprite_angry.webp",
                    surprised: "ErzaSprite_happy.webp",
                    cautious: "ErzaSprite_smirk.webp",
                    nervous: "ErzaSprite_angry.webp",
                };

                const spriteFile =
                    erzaExpressionMap[newExpression] || "ErzaSprite_happy.webp";
                const newPath = `./assets/images/characters/${spriteFile}`;
                img.src = newPath;
                console.log(
                    `Changed Erza expression to ${newExpression} using ${spriteFile}`,
                );
            } else {
                const newPath = `./assets/images/characters/${characterName}_${newExpression}.png`;
                img.src = newPath;
            }
        }
    }

    // ====== SISTEMA DE MUDANÇA DE FUNDO ======
    changeBackground(backgroundName, transition = "fade") {
        const background = document.getElementById("background");

        // Map background names to actual filenames
        const backgroundMap = {
            fundocena1: "fundocena1.jpg",
            fundocena2: "fundocena2.avif",
            fundocena3: "fundocena3.jpeg",
            JumpScare1: "JumpScare1.jpg",
        };

        const filename =
            backgroundMap[backgroundName] || `${backgroundName}.jpg`;
        const imagePath = `assets/images/backgrounds/${filename}`;

        if (transition === "fade") {
            background.style.transition = "opacity 1s ease";
            background.style.opacity = "0";

            setTimeout(() => {
                background.style.backgroundImage = `url('${imagePath}')`;
                background.style.backgroundSize = "cover";
                background.style.backgroundPosition = "center";
                background.style.opacity = "1";
            }, 500);
        } else {
            background.style.backgroundImage = `url('${imagePath}')`;
            background.style.backgroundSize = "cover";
            background.style.backgroundPosition = "center";
        }
    }

    // ====== SISTEMA DE EFEITOS VISUAIS ======
    addTheaterEffect() {
        const gameScreen = document.getElementById("game-screen");

        // Criar efeito de luz piscando no palco
        const spotlight = document.createElement("div");
        spotlight.className = "theater-spotlight";
        spotlight.style.cssText = `
            position: absolute;
            top: 10%;
            left: 50%;
            transform: translateX(-50%);
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
            border-radius: 50%;
            z-index: 3;
            pointer-events: none;
            animation: spotlightFlicker 3s infinite;
        `;

        gameScreen.appendChild(spotlight);

        // Adicionar CSS da animação
        const style = document.createElement("style");
        style.textContent = `
            @keyframes spotlightFlicker {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
            }
        `;
        document.head.appendChild(style);
    }

    addMannequinsEffect() {
        const gameScreen = document.getElementById("game-screen");

        // Criar manequins nas poltronas
        for (let i = 0; i < 6; i++) {
            const mannequin = document.createElement("div");
            mannequin.className = "mannequin";
            mannequin.style.cssText = `
                position: absolute;
                bottom: 40%;
                left: ${20 + i * 10}%;
                width: 40px;
                height: 80px;
                background: linear-gradient(to bottom, #222, #000);
                border-radius: 50% 50% 0 0;
                z-index: 2;
                box-shadow: 0 0 10px rgba(255,0,0,0.3);
                transition: transform 0.3s ease;
            `;

            mannequin.addEventListener("mouseover", () => {
                mannequin.style.transform = "scale(1.1) rotate(5deg)";
            });

            mannequin.addEventListener("mouseout", () => {
                mannequin.style.transform = "scale(1) rotate(0deg)";
            });

            gameScreen.appendChild(mannequin);
        }
    }

    // ====== PUZZLE DO PIANO ======
    startPianoPuzzle() {
        this.pianoPuzzle.isActive = true;
        this.pianoPuzzle.failures = 0;
        this.pianoPuzzle.currentStep = 0;
        this.pianoPuzzle.playerInput = [];

        const puzzleDialogue = {
            speaker: "",
            text: "Um grande piano quebrado bloqueia a saída. As teclas estão manchadas de sangue seco, mas ainda funcionam. As luzes acima do palco começam a piscar em uma sequência... Você precisa reproduzir a melodia.",
            choices: [
                {
                    text: "Tentar tocar a melodia",
                    type: "neutral",
                },
                {
                    text: "Procurar outra saída",
                    type: "coward",
                },
            ],
        };

        window.dialogueSystem.showDialogue(puzzleDialogue);

        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(
            window.dialogueSystem,
        );
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            originalSelectChoice(choiceIndex);

            setTimeout(() => {
                if (choiceIndex === 0) {
                    this.showPianoInterface();
                } else {
                    this.seekAlternativeExit();
                }
                window.dialogueSystem.hideDialogue();
            }, 500);

            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    showPianoInterface() {
        const gameScreen = document.getElementById("game-screen");

        // Criar interface do piano
        const pianoInterface = document.createElement("div");
        pianoInterface.id = "piano-interface";
        pianoInterface.style.cssText = `
            position: absolute;
            bottom: 10%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.9);
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #8B0000;
            z-index: 10;
        `;

        pianoInterface.innerHTML = `
            <div style="color: white; text-align: center; margin-bottom: 10px;">
                <h3>Piano da Tragédia</h3>
                <p>Reproduza a sequência das luzes</p>
                <p>Falhas: ${this.pianoPuzzle.failures}/${this.pianoPuzzle.maxFailures}</p>
            </div>
            <div id="piano-keys" style="display: flex; gap: 5px;">
                ${Array.from(
                    { length: 8 },
                    (_, i) =>
                        `<button class="piano-key" data-note="${i + 1}" style="
                        width: 40px;
                        height: 80px;
                        background: white;
                        border: 1px solid #000;
                        color: black;
                        cursor: pointer;
                        transition: all 0.2s;
                    ">${i + 1}</button>`,
                ).join("")}
            </div>
            <div style="margin-top: 10px; text-align: center;">
                <button id="start-sequence" style="
                    background: #8B0000;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                ">Ver Sequência</button>
                <button id="reset-piano" style="
                    background: #444;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-left: 10px;
                ">Recomeçar</button>
            </div>
        `;

        gameScreen.appendChild(pianoInterface);
        this.bindPianoEvents();
    }

    bindPianoEvents() {
        const keys = document.querySelectorAll(".piano-key");
        const startBtn = document.getElementById("start-sequence");
        const resetBtn = document.getElementById("reset-piano");

        keys.forEach((key) => {
            key.addEventListener("click", (e) => {
                if (!this.pianoPuzzle.lightsFlashing) {
                    this.playPianoNote(parseInt(e.target.dataset.note));
                }
            });
        });

        startBtn.addEventListener("click", () => {
            this.showLightSequence();
        });

        resetBtn.addEventListener("click", () => {
            this.resetPianoInput();
        });
    }

    showLightSequence() {
        this.pianoPuzzle.lightsFlashing = true;
        const keys = document.querySelectorAll(".piano-key");

        let step = 0;
        const flashInterval = setInterval(() => {
            if (step < this.pianoPuzzle.correctSequence.length) {
                const noteIndex = this.pianoPuzzle.correctSequence[step] - 1;
                const key = keys[noteIndex];

                // Efeito visual na tecla
                key.style.background = "#FFD700";
                key.style.transform = "scale(1.1)";

                // Som da nota (simulado)
                this.playNoteSound(noteIndex + 1);

                setTimeout(() => {
                    key.style.background = "white";
                    key.style.transform = "scale(1)";
                }, 600);

                step++;
            } else {
                clearInterval(flashInterval);
                this.pianoPuzzle.lightsFlashing = false;

                // Adicionar efeito dos manequins batendo palmas
                this.mannequinsApplaud();
            }
        }, 800);
    }

    mannequinsApplaud() {
        const mannequins = document.querySelectorAll(".mannequin");

        // Som de palmas em descompasso
        let clapCount = 0;
        const clapInterval = setInterval(() => {
            mannequins.forEach((mannequin, index) => {
                setTimeout(() => {
                    mannequin.style.transform = "scale(1.1)";
                    setTimeout(() => {
                        mannequin.style.transform = "scale(1)";
                    }, 200);
                }, index * 100);
            });

            clapCount++;
            if (clapCount >= 3) {
                clearInterval(clapInterval);
            }
        }, 1000);
    }

    playPianoNote(note) {
        this.pianoPuzzle.playerInput.push(note);

        // Efeito visual
        const key = document.querySelector(`[data-note="${note}"]`);
        key.style.background = "#8B0000";
        key.style.color = "white";

        setTimeout(() => {
            key.style.background = "white";
            key.style.color = "black";
        }, 300);

        this.playNoteSound(note);
        this.checkPianoInput();
    }

    checkPianoInput() {
        const currentLength = this.pianoPuzzle.playerInput.length;
        const correctNote = this.pianoPuzzle.correctSequence[currentLength - 1];
        const playerNote = this.pianoPuzzle.playerInput[currentLength - 1];

        if (playerNote !== correctNote) {
            this.failPianoAttempt();
        } else if (
            this.pianoPuzzle.playerInput.length ===
            this.pianoPuzzle.correctSequence.length
        ) {
            this.solvePianoPuzzle();
        }
    }

    failPianoAttempt() {
        this.pianoPuzzle.failures++;
        this.pianoPuzzle.playerInput = [];

        // Efeito visual de erro
        const pianoInterface = document.getElementById("piano-interface");
        pianoInterface.style.border = "2px solid #FF0000";
        pianoInterface.style.background = "rgba(255,0,0,0.3)";

        setTimeout(() => {
            pianoInterface.style.border = "2px solid #8B0000";
            pianoInterface.style.background = "rgba(0,0,0,0.9)";
        }, 1000);

        if (this.pianoPuzzle.failures >= this.pianoPuzzle.maxFailures) {
            // Jumpscare intenso antes do game over
            window.gameController.showRandomJumpscare(2500, () => {
                this.failPianoPuzzle();
            });
        } else {
            // Jumpscare leve para erro
            window.gameController.showRandomJumpscare(800);

            // Atualizar contador de falhas
            const failureDisplay = pianoInterface.querySelector("p");
            failureDisplay.textContent = `Falhas: ${this.pianoPuzzle.failures}/${this.pianoPuzzle.maxFailures}`;
        }
    }

    solvePianoPuzzle() {
        // Remover interface do piano
        const pianoInterface = document.getElementById("piano-interface");
        if (pianoInterface) {
            pianoInterface.remove();
        }

        // Som de sucesso
        this.playSuccessSound();

        // Diálogo de sucesso
        const successDialogue = {
            speaker: "",
            text: "A melodia ressoa pelo teatro vazio. O piano se move lentamente, revelando uma porta oculta. Os manequins param de bater palmas e se voltam para olhar diretamente para você.",
            effects: [{ type: "pianoSuccess" }],
        };

        window.dialogueSystem.showDialogue(successDialogue);

        setTimeout(() => {
            window.dialogueSystem.hideDialogue();
            this.startCrucialDialogue();
        }, 4000);
    }

    seekAlternativeExit() {
        const searchDialogue = {
            speaker: "",
            text: "Você procura por outra saída, mas as paredes estão seladas. Não há escapatória. O piano parece ser a única forma de abrir a passagem. Os manequins observam, esperando.",
            choices: [
                {
                    text: "Voltar e tentar o piano",
                    type: "neutral",
                },
                {
                    text: "Insistir em procurar outra saída",
                    type: "stubborn",
                },
            ],
        };

        window.dialogueSystem.showDialogue(searchDialogue);

        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(
            window.dialogueSystem,
        );
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            originalSelectChoice(choiceIndex);

            setTimeout(() => {
                if (choiceIndex === 0) {
                    window.dialogueSystem.hideDialogue();
                    setTimeout(() => {
                        this.showPianoInterface();
                    }, 500);
                } else {
                    // Mostrar mensagem de que não há outro caminho
                    const noWayOutDialogue = {
                        speaker: "",
                        text: "Não há outro caminho. As paredes estão completamente seladas e não existe escapatória. O piano é a única forma de sair daqui. Os manequins continuam observando, esperando pacientemente.",
                        choices: [
                            {
                                text: "Aceitar e tentar o piano",
                                type: "neutral",
                            },
                        ],
                    };

                    window.dialogueSystem.showDialogue(noWayOutDialogue);

                    const finalChoiceOriginal =
                        window.dialogueSystem.selectChoice.bind(
                            window.dialogueSystem,
                        );
                    window.dialogueSystem.selectChoice = (finalChoiceIndex) => {
                        finalChoiceOriginal(finalChoiceIndex);

                        setTimeout(() => {
                            window.dialogueSystem.hideDialogue();
                            setTimeout(() => {
                                this.showPianoInterface();
                            }, 500);
                        }, 500);

                        window.dialogueSystem.selectChoice =
                            originalSelectChoice;
                    };
                }
            }, 500);

            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    failPianoPuzzle() {
        // Game Over devido aos manequins
        const gameOverDialogue = {
            speaker: "",
            text: "Os manequins se levantam de suas poltronas, rostos derretidos se contorcendo em sorrisos terríveis. Eles avançam lentamente em sua direção, aplaudindo em um ritmo hipnótico...",
            effects: [{ type: "gameOver" }],
        };

        window.dialogueSystem.showDialogue(gameOverDialogue);

        setTimeout(() => {
            window.gameState.resetToLastCheckpoint();
            window.menuSystem.showScreen("main-menu");
        }, 6000);
    }

    resetPianoInput() {
        this.pianoPuzzle.playerInput = [];
        this.pianoPuzzle.currentStep = 0;
    }

    playNoteSound(note) {
        // Simula som da nota do piano
        console.log(`Playing piano note: ${note}`);
        // Aqui você adicionaria o som real
    }

    playSuccessSound() {
        console.log("Playing success sound");
        // Som de sucesso do puzzle
    }

    // ====== DIÁLOGO CRUCIAL ======
    startCrucialDialogue() {
        this.changeBackground("fundocena3", "fade");
        this.showCharacter("evelly", "worried", "left");
        this.showCharacter("ezra", "serious", "right");

        const dialogue1 = {
            speaker: "Ezra",
            text: "Evelly... você não parece bem. Desde que acordamos aqui, não para de ouvir coisas. Me diz uma coisa... você se lembra da trágica noite?",
            effects: [{ type: "shadowWhispers" }],
        };

        window.dialogueSystem.showDialogue(dialogue1);

        setTimeout(() => {
            window.dialogueSystem.hideDialogue();
            this.addShadowWhispers();

            setTimeout(() => {
                this.showTragicMemoryChoices();
            }, 3000);
        }, 5000);
    }

    addShadowWhispers() {
        const whisperText = document.createElement("div");
        whisperText.className = "shadow-whispers";
        whisperText.textContent = "Não lembra... não lembra... não lembra...";
        whisperText.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #8B0000;
            font-size: 24px;
            font-family: 'Nosifer', cursive;
            text-shadow: 0 0 10px #8B0000;
            opacity: 0.7;
            z-index: 8;
            animation: whisperFloat 3s infinite;
        `;

        document.getElementById("game-screen").appendChild(whisperText);

        setTimeout(() => {
            whisperText.remove();
        }, 3000);
    }

    showTragicMemoryChoices() {
        const memoryChoices = {
            speaker: "",
            text: "As palavras de Ezra ecoam em sua mente. As sombras sussurram dúvidas. Como você responde?",
            choices: [
                {
                    text: '[Negar] "Não lembro. Se você sabe... fale."',
                    type: "denial",
                    effect: "ezraConfidence",
                },
                {
                    text: '[Aceitar] "Eu lembro... e não quero fugir disso."',
                    type: "acceptance",
                    effect: "flashback",
                },
                {
                    text: '[Relutante] "Cale a boca. Eu não vou me lembrar disso agora."',
                    type: "anger",
                    effect: "terror",
                },
            ],
        };

        window.dialogueSystem.showDialogue(memoryChoices);

        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(
            window.dialogueSystem,
        );
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            originalSelectChoice(choiceIndex);

            this.storyFlags.tragicMemoryChoice = choiceIndex;

            setTimeout(() => {
                window.dialogueSystem.hideDialogue();
                setTimeout(() => {
                    this.processTragicMemoryChoice(choiceIndex);
                }, 500);
            }, 500);

            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    processTragicMemoryChoice(choice) {
        switch (choice) {
            case 0: // Negar
                this.storyFlags.ezraConfidence++;
                this.showEzraDescription();
                break;
            case 1: // Aceitar
                this.startFlashbackSequence();
                break;
            case 2: // Relutante
                this.storyFlags.terrorLevel++;
                this.startShadowAttack();
                break;
        }
    }

    showEzraDescription() {
        this.changeCharacterExpression("ezra", "concerned");

        const ezraDialogue = {
            speaker: "Ezra",
            text: "O show... o desabamento... as pessoas que morreram enquanto você brilhava no palco. Você estava cantando quando o teto rachou. Teve a chance de avisar todos, mas... continuou sua apresentação.",
            effects: [{ type: "memoryFragments" }],
        };

        window.dialogueSystem.showDialogue(ezraDialogue);

        // Usar nextAction para aguardar clique do usuário
        window.dialogueSystem.nextAction = () => {
            this.continueAfterEzraDescription();
        };
    }

    continueAfterEzraDescription() {
        const continuation = {
            speaker: "",
            text: "As memórias se tornam mais claras. O corredor à frente parece se estender infinitamente, e uma névoa estranha começa a se formar atrás de vocês.",
            effects: [],
        };

        window.dialogueSystem.showDialogue(continuation);

        window.dialogueSystem.nextAction = () => {
            this.startMazeGame();
        };
    }

    startFlashbackSequence() {
        // Escurecer tela para flashback
        const gameScreen = document.getElementById("game-screen");
        gameScreen.style.filter = "sepia(1) contrast(1.2)";

        const flashbackDialogue = {
            speaker: "",
            text: "FLASHBACK: Você está no palco, holofotes quentes em seu rosto. O público aplaude. Então você ouve - um estalo sinistro vindo do teto. O que você faz?",
            choices: [
                {
                    text: "Continuar cantando - o show deve continuar",
                    type: "selfish",
                    karma: -2,
                },
                {
                    text: "Parar e avisar o público do perigo",
                    type: "heroic",
                    karma: +2,
                },
            ],
        };

        window.dialogueSystem.showDialogue(flashbackDialogue);

        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(
            window.dialogueSystem,
        );
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            originalSelectChoice(choiceIndex);

            // Atualizar karma baseado na escolha
            if (choiceIndex === 0) {
                window.gameState.adjustKarma(-2);
            } else {
                window.gameState.adjustKarma(2);
            }

            setTimeout(() => {
                this.endFlashback();
                window.dialogueSystem.hideDialogue();
            }, 500);

            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    endFlashback() {
        const gameScreen = document.getElementById("game-screen");
        gameScreen.style.filter = "";

        const postFlashbackDialogue = {
            speaker: "",
            text: "A memória se fragmenta novamente. Você volta ao presente, mas as lembranças deixaram sua marca. Ezra observa você com uma expressão indecifrável.",
            effects: [{ type: "memoryFade" }],
        };

        window.dialogueSystem.showDialogue(postFlashbackDialogue);

        setTimeout(() => {
            window.dialogueSystem.hideDialogue();
            this.startMazeGame();
        }, 3000);
    }

    startShadowAttack() {
        this.storyFlags.terrorLevel++;

        // Escurecer corredor
        const gameScreen = document.getElementById("game-screen");
        gameScreen.style.filter = "brightness(0.3)";

        // Mostrar sombra
        this.addShadowEffect();

        const shadowAttackDialogue = {
            speaker: "",
            text: "As vozes da Sombra explodem em fúria! O corredor escurece e uma presença terrível se materializa atrás de vocês. CORRA!",
            effects: [{ type: "shadowAttack" }],
        };

        window.dialogueSystem.showDialogue(shadowAttackDialogue);

        setTimeout(() => {
            window.dialogueSystem.hideDialogue();
            this.startQuickTimeEvent();
        }, 2000);
    }

    addShadowEffect() {
        const shadow = document.createElement("div");
        shadow.className = "shadow-entity";
        shadow.style.cssText = `
            position: absolute;
            top: 0;
            right: -100px;
            width: 200px;
            height: 100%;
            background: linear-gradient(to left, rgba(0,0,0,0.9), transparent);
            z-index: 7;
            animation: shadowAdvance 3s ease-out forwards;
        `;

        document.getElementById("game-screen").appendChild(shadow);
    }

    startQuickTimeEvent() {
        const qteInterface = document.createElement("div");
        qteInterface.id = "qte-interface";
        qteInterface.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255,0,0,0.9);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            z-index: 10;
            color: white;
            font-size: 24px;
        `;

        qteInterface.innerHTML = `
            <h3>QUICK TIME EVENT!</h3>
            <p>Pressione ESPAÇO rapidamente para fugir!</p>
            <div id="qte-progress" style="
                width: 200px;
                height: 20px;
                background: #333;
                border: 2px solid white;
                margin: 10px auto;
                overflow: hidden;
            ">
                <div id="qte-bar" style="
                    width: 0%;
                    height: 100%;
                    background: #00FF00;
                    transition: width 0.1s;
                "></div>
            </div>
            <p id="qte-timer">5</p>
        `;

        document.getElementById("game-screen").appendChild(qteInterface);
        this.runQuickTimeEvent();
    }

    runQuickTimeEvent() {
        let progress = 0;
        let timeLeft = 5;
        let spacePressed = 0;
        const requiredPresses = 10;

        const qteBar = document.getElementById("qte-bar");
        const qteTimer = document.getElementById("qte-timer");

        // Event listener para espaço
        const spaceHandler = (e) => {
            if (e.code === "Space") {
                e.preventDefault();
                spacePressed++;
                progress = (spacePressed / requiredPresses) * 100;
                qteBar.style.width = `${progress}%`;

                if (progress >= 100) {
                    this.successQTE();
                    document.removeEventListener("keydown", spaceHandler);
                    return;
                }
            }
        };

        document.addEventListener("keydown", spaceHandler);

        // Timer countdown
        const timer = setInterval(() => {
            timeLeft--;
            qteTimer.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timer);
                document.removeEventListener("keydown", spaceHandler);

                if (progress < 100) {
                    this.failQTE();
                }
            }
        }, 1000);
    }

    successQTE() {
        const qteInterface = document.getElementById("qte-interface");
        if (qteInterface) qteInterface.remove();

        // Limpar efeitos
        const gameScreen = document.getElementById("game-screen");
        gameScreen.style.filter = "";

        const shadow = document.querySelector(".shadow-entity");
        if (shadow) shadow.remove();

        const successDialogue = {
            speaker: "",
            text: "Vocês correm pelo corredor escuro, a Sombra perdendo terreno. Finalmente chegam a uma área segura, ofegantes mas vivos.",
            effects: [{ type: "escapeSuccess" }],
        };

        window.dialogueSystem.showDialogue(successDialogue);

        setTimeout(() => {
            window.dialogueSystem.hideDialogue();
            this.startMazeGame();
        }, 3000);
    }

    failQTE() {
        const qteInterface = document.getElementById("qte-interface");
        if (qteInterface) qteInterface.remove();

        // Game Over
        const gameOverDialogue = {
            speaker: "",
            text: "A Sombra os alcança. Dedos gelados como gelo tocam sua nuca. A escuridão consome tudo...",
            effects: [{ type: "gameOver" }],
        };

        window.dialogueSystem.showDialogue(gameOverDialogue);

        setTimeout(() => {
            window.gameState.resetToLastCheckpoint();
            window.menuSystem.showScreen("main-menu");
        }, 4000);
    }

    addMemoryFragments() {
        // Adicionar efeitos visuais de memórias fragmentadas
        const fragments = document.createElement("div");
        fragments.className = "memory-fragments";
        fragments.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 6;
        `;

        // Criar vários fragmentos
        for (let i = 0; i < 5; i++) {
            const fragment = document.createElement("div");
            fragment.style.cssText = `
                position: absolute;
                top: ${Math.random() * 80}%;
                left: ${Math.random() * 80}%;
                width: 100px;
                height: 100px;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.3);
                animation: fragmentFloat ${2 + Math.random() * 3}s ease-in-out infinite;
            `;
            fragments.appendChild(fragment);
        }

        document.getElementById("game-screen").appendChild(fragments);

        setTimeout(() => {
            fragments.remove();
        }, 3000);
    }

    // ====== MINIGAME DO LABIRINTO ======
    startMazeGame() {
        this.mazeGame.isActive = true;
        this.mazeGame.playerX = 1;
        this.mazeGame.playerY = 1;
        this.mazeGame.timeRemaining = 45;

        const introDialogue = {
            speaker: "",
            text: "Vocês encontram uma sala estranha. No chão, há um tabuleiro luminoso com um labirinto projetado. Um cubo amarelo brilha no canto - vocês precisam guiá-lo até a saída antes que o tempo acabe!",
            effects: [{ type: "mazeStart" }],
        };

        window.dialogueSystem.showDialogue(introDialogue);

        setTimeout(() => {
            window.dialogueSystem.hideDialogue();
            this.showMazeInterface();
        }, 3000);
    }

    showMazeInterface() {
        const gameScreen = document.getElementById("game-screen");

        const mazeInterface = document.createElement("div");
        mazeInterface.id = "maze-interface";
        mazeInterface.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.9);
            padding: 30px;
            border-radius: 15px;
            border: 3px solid #FFD700;
            text-align: center;
            font-family: 'Orbitron', monospace;
            z-index: 100;
        `;

        mazeInterface.innerHTML = `
            <h3 style="color: #FFD700; margin-bottom: 15px;">LABIRINTO</h3>
            <p style="color: white; margin-bottom: 10px;">Tempo: <span id="maze-timer" style="color: #FF6666;">${this.mazeGame.timeRemaining}s</span></p>
            <p style="color: #888; font-size: 0.9rem; margin-bottom: 15px;">Use as setas do teclado (↑↓←→)</p>
            <canvas id="maze-canvas" width="450" height="450" style="border: 2px solid #FFD700; background: #1a1a1a;"></canvas>
        `;

        gameScreen.appendChild(mazeInterface);
        this.renderMaze();
        this.bindMazeControls();
        this.startMazeTimer();
    }

    renderMaze() {
        const canvas = document.getElementById("maze-canvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const cellSize = this.mazeGame.cellSize;

        // Limpar canvas
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Desenhar labirinto
        for (let y = 0; y < this.mazeGame.maze.length; y++) {
            for (let x = 0; x < this.mazeGame.maze[y].length; x++) {
                if (this.mazeGame.maze[y][x] === 1) {
                    // Parede
                    ctx.fillStyle = "#444";
                    ctx.fillRect(
                        x * cellSize,
                        y * cellSize,
                        cellSize,
                        cellSize,
                    );
                    ctx.strokeStyle = "#666";
                    ctx.strokeRect(
                        x * cellSize,
                        y * cellSize,
                        cellSize,
                        cellSize,
                    );
                }
            }
        }

        // Desenhar objetivo (verde)
        ctx.fillStyle = "#00FF00";
        ctx.fillRect(
            this.mazeGame.goalX * cellSize + 3,
            this.mazeGame.goalY * cellSize + 3,
            cellSize - 6,
            cellSize - 6,
        );

        // Desenhar player (amarelo)
        ctx.fillStyle = "#FFFF00";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#FFFF00";
        ctx.fillRect(
            this.mazeGame.playerX * cellSize + 3,
            this.mazeGame.playerY * cellSize + 3,
            cellSize - 6,
            cellSize - 6,
        );
        ctx.shadowBlur = 0;
    }

    bindMazeControls() {
        this.mazeKeyHandler = (e) => {
            if (!this.mazeGame.isActive) return;

            let newX = this.mazeGame.playerX;
            let newY = this.mazeGame.playerY;

            switch (e.key) {
                case "ArrowUp":
                    newY--;
                    e.preventDefault();
                    break;
                case "ArrowDown":
                    newY++;
                    e.preventDefault();
                    break;
                case "ArrowLeft":
                    newX--;
                    e.preventDefault();
                    break;
                case "ArrowRight":
                    newX++;
                    e.preventDefault();
                    break;
                default:
                    return;
            }

            // Verificar colisão
            if (
                this.mazeGame.maze[newY] &&
                this.mazeGame.maze[newY][newX] === 0
            ) {
                this.mazeGame.playerX = newX;
                this.mazeGame.playerY = newY;
                this.renderMaze();

                // Verificar vitória
                if (
                    newX === this.mazeGame.goalX &&
                    newY === this.mazeGame.goalY
                ) {
                    this.mazeClear();
                }
            }
        };

        document.addEventListener("keydown", this.mazeKeyHandler);
    }

    startMazeTimer() {
        this.mazeTimer = setInterval(() => {
            this.mazeGame.timeRemaining--;
            const timerEl = document.getElementById("maze-timer");
            if (timerEl) {
                timerEl.textContent = `${this.mazeGame.timeRemaining}s`;
                if (this.mazeGame.timeRemaining <= 10) {
                    timerEl.style.color = "#FF0000";
                }
            }

            if (this.mazeGame.timeRemaining <= 0) {
                clearInterval(this.mazeTimer);
                this.mazeGameOver();
            }

            if (!this.mazeGame.isActive) {
                clearInterval(this.mazeTimer);
            }
        }, 1000);
    }

    mazeClear() {
        this.mazeGame.isActive = false;
        clearInterval(this.mazeTimer);
        document.removeEventListener("keydown", this.mazeKeyHandler);

        const mazeInterface = document.getElementById("maze-interface");
        if (mazeInterface) mazeInterface.remove();

        const successDialogue = {
            speaker: "",
            text: "O cubo alcança o objetivo! O tabuleiro se desliga e uma porta secreta se abre. Vocês escaparam!",
            effects: [{ type: "mazeSuccess" }],
        };

        window.dialogueSystem.showDialogue(successDialogue);

        setTimeout(() => {
            window.dialogueSystem.hideDialogue();
            this.enterControlRoom();
        }, 4000);
    }

    mazeGameOver() {
        this.mazeGame.isActive = false;
        clearInterval(this.mazeTimer);
        document.removeEventListener("keydown", this.mazeKeyHandler);

        const mazeInterface = document.getElementById("maze-interface");
        if (mazeInterface) mazeInterface.remove();

        const gameOverDialogue = {
            speaker: "",
            text: "O tempo acabou! O tabuleiro se desintegra e o labirinto desaparece.",
            effects: [{ type: "gameOver" }],
            choices: [
                {
                    text: "Tentar novamente",
                    type: "retry",
                },
                {
                    text: "Voltar ao menu",
                    type: "menu",
                },
            ],
        };

        window.dialogueSystem.showDialogue(gameOverDialogue);

        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(
            window.dialogueSystem,
        );
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            originalSelectChoice(choiceIndex);

            setTimeout(() => {
                window.dialogueSystem.hideDialogue();
                if (choiceIndex === 0) {
                    this.startMazeGame();
                } else {
                    window.menuSystem.showScreen("main-menu");
                }
            }, 500);

            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    // ====== SALA DE CONTROLE E REVELAÇÃO ======
    enterControlRoom() {
        this.changeBackground("fundocena1", "fade");
        this.showCharacter("evelly", "shocked", "left");
        this.showCharacter("ezra", "suspicious", "right");

        // Criar interface do painel de controle
        this.createControlPanel();

        const controlRoomDialogue = {
            speaker: "",
            text: "Uma sala de controle antiga, cheia de monitores que ainda funcionam. Um painel central mostra um mapa parcial do HollowMind.",
            effects: [{ type: "controlRoom" }],
        };

        window.dialogueSystem.showDialogue(controlRoomDialogue);

        setTimeout(() => {
            window.dialogueSystem.hideDialogue();
            this.showMapRevealation();
        }, 5000);
    }

    createControlPanel() {
        const gameScreen = document.getElementById("game-screen");

        const controlPanel = document.createElement("div");
        controlPanel.id = "control-panel";
        controlPanel.style.cssText = `
            position: absolute;
            bottom: 30%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,50,0,0.9);
            border: 2px solid #00FF00;
            padding: 15px;
            border-radius: 10px;
            color: #00FF00;
            font-family: 'Orbitron', monospace;
            font-size: 12px;
            z-index: 6;
            min-width: 300px;
        `;

        controlPanel.innerHTML = `
            <div style="text-align: center; margin-bottom: 10px;">
                <h4>SISTEMA HOLLOWMIND</h4>
                <div style="border: 1px solid #00FF00; padding: 10px; margin: 10px 0;">
                    <p>MAPA DO COMPLEXO</p>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; margin: 10px 0;">
                        <div style="background: #00FF00; height: 20px;"></div>
                        <div style="background: #FF0000; height: 20px;"></div>
                        <div style="background: #00FF00; height: 20px;"></div>
                        <div style="background: #00FF00; height: 20px;"></div>
                        <div style="background: #FFFF00; height: 20px;"></div>
                        <div style="background: #FF0000; height: 20px;"></div>
                        <div style="background: #FF0000; height: 20px;"></div>
                        <div style="background: #FF0000; height: 20px;"></div>
                        <div style="background: #FF0000; height: 20px;"></div>
                    </div>
                    <p style="font-size: 10px;">VERDE: SEGURO | VERMELHO: CONTAMINADO | AMARELO: NÚCLEO</p>
                </div>
                <div style="border: 1px solid #00FF00; padding: 10px;">
                    <p>CHAVE DE ACESSO NECESSÁRIA:</p>
                    <p style="color: #FFFF00; font-size: 14px; font-weight: bold;">EVELLY HOLLOW</p>
                </div>
            </div>
        `;

        gameScreen.appendChild(controlPanel);
    }

    showMapRevealation() {
        this.changeCharacterExpression("ezra", "shocked");

        const revelationDialogue = {
            speaker: "Ezra",
            text: "Olha isso... não estamos presos só no HollowMind. A névoa se espalhou pela cidade. Se não chegarmos ao Núcleo da Pesquisa, nada vai parar isso.",
            effects: [{ type: "mapReveal" }],
        };

        window.dialogueSystem.showDialogue(revelationDialogue);

        setTimeout(() => {
            window.dialogueSystem.hideDialogue();
            this.showBiometricReveal();
        }, 6000);
    }

    showBiometricReveal() {
        // Destacar o nome no painel
        const biometricElement = document.querySelector(
            '#control-panel p[style*="FFFF00"]',
        );
        if (biometricElement) {
            biometricElement.style.animation = "biometricPulse 2s infinite";
        }

        const biometricDialogue = {
            speaker: "Ezra",
            text: "E adivinha? A única chave de acesso registrada... é o seu nome, Evelly. Então, me diz. Você era parte do experimento ou só mais uma cobaia?",
            effects: [{ type: "biometricReveal" }],
        };

        window.dialogueSystem.showDialogue(biometricDialogue);

        setTimeout(() => {
            window.dialogueSystem.hideDialogue();
            this.triggerTerrorEvent();
        }, 7000);
    }

    // ====== EVENTO DE TERROR ======
    triggerTerrorEvent() {
        this.storyFlags.terrorLevel++;
        this.storyFlags.revealedConnection = true;

        // Efeito de som alto
        this.addTerrorEffects();

        const terrorDialogue = {
            speaker: "",
            text: "Antes que Evelly possa responder, os alto-falantes ligam sozinhos. Um grito ensurdecedor ecoa pela sala!",
            effects: [{ type: "terrorScream" }],
        };

        window.dialogueSystem.showDialogue(terrorDialogue);

        setTimeout(() => {
            window.dialogueSystem.hideDialogue();
            this.showDistortedImages();
        }, 5000);
    }

    addTerrorEffects() {
        const gameScreen = document.getElementById("game-screen");

        // Efeito de tela tremendo
        gameScreen.style.animation = "screenShake 3s ease-in-out";

        // Efeito de luz vermelha piscando
        const redFlash = document.createElement("div");
        redFlash.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: red;
            opacity: 0;
            z-index: 9;
            animation: redFlash 0.5s ease-in-out 6;
        `;

        gameScreen.appendChild(redFlash);

        setTimeout(() => {
            redFlash.remove();
            gameScreen.style.animation = "";
        }, 3000);
    }

    showDistortedImages() {
        // Simular imagens distorcidas no painel
        const controlPanel = document.getElementById("control-panel");
        if (controlPanel) {
            controlPanel.style.filter = "hue-rotate(180deg) contrast(2)";
            controlPanel.innerHTML = `
                <div style="text-align: center; color: #FF0000;">
                    <h4>ERRO SISTEMA</h4>
                    <div style="border: 1px solid #FF0000; padding: 10px;">
                        <p style="animation: glitchText 1s infinite;">ACESSO NEGADO</p>
                        <p style="animation: glitchText 1.5s infinite;">MEMÓRIA CORROMPIDA</p>
                        <p style="animation: glitchText 0.8s infinite;">SUJEITO 001: EVELLY</p>
                    </div>
                </div>
            `;
        }

        // Mostrar sombra no vidro
        this.addShadowInGlass();

        const imagesDialogue = {
            speaker: "",
            text: "O painel mostra imagens distorcidas do acidente no palco. A Sombra aparece atrás do vidro, batendo palmas lentamente, como aprovando a revelação.",
            effects: [{ type: "distortedImages" }],
        };

        window.dialogueSystem.showDialogue(imagesDialogue);

        setTimeout(() => {
            window.dialogueSystem.hideDialogue();
            this.showFinalChoices();
        }, 6000);
    }

    addShadowInGlass() {
        const gameScreen = document.getElementById("game-screen");

        const shadowGlass = document.createElement("div");
        shadowGlass.className = "shadow-in-glass";
        shadowGlass.style.cssText = `
            position: absolute;
            top: 20%;
            right: 10%;
            width: 150px;
            height: 200px;
            background: rgba(0,0,0,0.8);
            border: 2px solid #444;
            border-radius: 5px;
            z-index: 7;
        `;

        // Silhueta da sombra
        const shadowSilhouette = document.createElement("div");
        shadowSilhouette.style.cssText = `
            position: absolute;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 120px;
            background: #000;
            clip-path: polygon(40% 0%, 60% 0%, 65% 30%, 80% 30%, 80% 50%, 75% 60%, 85% 70%, 85% 100%, 15% 100%, 15% 70%, 25% 60%, 20% 50%, 20% 30%, 35% 30%);
            animation: shadowClap 2s infinite;
        `;

        shadowGlass.appendChild(shadowSilhouette);
        gameScreen.appendChild(shadowGlass);
    }

    // ====== ESCOLHA FINAL DO CAPÍTULO ======
    showFinalChoices() {
        this.changeCharacterExpression("ezra", "demanding");
        this.changeCharacterExpression("evelly", "conflicted");

        const finalDialogue = {
            speaker: "Ezra",
            text: "Decide logo, Evelly. Vai me dizer quem diabos você é... ou vamos correr até não restar nada pra salvar?",
            choices: [
                {
                    text: "[Enfrentar a Verdade] Exigir respostas e encarar a ligação com o HollowMind",
                    type: "truth",
                    nextChapter: "4a",
                },
                {
                    text: "[Negar e Fugir] Entrar em pânico e forçar fuga imediata",
                    type: "denial",
                    nextChapter: "4b",
                },
            ],
        };

        window.dialogueSystem.showDialogue(finalDialogue);

        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(
            window.dialogueSystem,
        );
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            originalSelectChoice(choiceIndex);

            this.storyFlags.finalChoice = choiceIndex;
            window.gameState.flags.chapter3Choice = choiceIndex;

            setTimeout(() => {
                window.dialogueSystem.hideDialogue();
                setTimeout(() => {
                    this.finishChapter3(choiceIndex);
                }, 500);
            }, 500);

            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    finishChapter3(choice) {
        // Explosão do painel
        this.explodeControlPanel();

        // Mudar para o background final assombrado (jp 11)
        setTimeout(() => {
            this.changeBackground("jp (11)", "fade");
        }, 1000);

        let endingText;
        if (choice === 0) {
            endingText =
                "Evelly decide enfrentar a verdade sobre sua ligação com o HollowMind. O próximo capítulo revelará os segredos...";
            window.gameState.flags.truthPath = true;
            window.gameState.adjustKarma(15, 'Enfrentou a verdade');
        } else {
            endingText =
                "Evelly entra em pânico e força a fuga. O próximo capítulo mostrará as consequências da negação...";
            window.gameState.flags.denialPath = true;
            window.gameState.adjustKarma(-15, 'Negou a verdade');
        }

        // Auto-save
        window.gameState.progressToNextChapter();
        window.saveSystem.autoSave();

        const chapterEndDialogue = {
            speaker: "",
            text: `Fim do Capítulo 3: A Tragédia Esquecida. ${endingText}`,
            choices: [
                {
                    text: "Continuar para o Capítulo 4",
                    type: "neutral",
                    nextChapter: 4,
                },
                {
                    text: "Voltar ao Menu Principal",
                    type: "neutral",
                    nextScene: "main_menu",
                },
            ],
        };

        window.dialogueSystem.showDialogue(chapterEndDialogue);

        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(
            window.dialogueSystem,
        );
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            originalSelectChoice(choiceIndex);

            setTimeout(() => {
                if (choiceIndex === 0) {
                    console.log('Carregando Capítulo 4...');
                    window.dialogueSystem.hideDialogue();
                    
                    if (window.gameController) {
                        window.gameController.loadChapter(4);
                    } else {
                        console.error('GameController não encontrado!');
                        alert('Sistema de capítulos não disponível.');
                        window.menuSystem?.showScreen('main-menu');
                    }
                } else {
                    window.dialogueSystem.hideDialogue();
                    window.menuSystem?.showScreen('main-menu');
                }
            }, 500);

            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    explodeControlPanel() {
        const controlPanel = document.getElementById("control-panel");
        if (controlPanel) {
            // Efeito de explosão
            controlPanel.style.animation = "panelExplode 2s ease-out forwards";

            // Criar faíscas
            for (let i = 0; i < 10; i++) {
                const spark = document.createElement("div");
                spark.style.cssText = `
                    position: absolute;
                    top: ${controlPanel.offsetTop + Math.random() * 100}px;
                    left: ${controlPanel.offsetLeft + Math.random() * 200}px;
                    width: 3px;
                    height: 3px;
                    background: #FFD700;
                    animation: sparkFly ${1 + Math.random()}s ease-out forwards;
                    z-index: 11;
                `;
                document.getElementById("game-screen").appendChild(spark);

                setTimeout(() => spark.remove(), 2000);
            }

            setTimeout(() => {
                controlPanel.remove();
            }, 2000);
        }
    }

    // ====== MÉTODO PRINCIPAL DO CAPÍTULO ======
    startChapter() {
        console.log("Starting Chapter 3: A Tragédia Esquecida");

        // Limpar tela
        this.clearScreen();

        // Iniciar sequência
        setTimeout(() => {
            this.showOpeningNarrative();
        }, 500);
    }

    async loadChapter() {
        console.log("Loading Chapter 3: A Tragédia Esquecida");
        this.startChapter();
    }

    showOpeningNarrative() {
        this.changeBackground("fundocena3", "fade");

        const openingDialogue = {
            speaker: "",
            text: "O silêncio da sala de poltronas parece mais sufocante do que os gritos. O palco à frente, vazio, iluminado por um holofote único, dá a impressão de que sempre houve alguém sentado lá. Esperando Evelly.",
            effects: [{ type: "fadeFromBlack", duration: 3000 }],
            choices: [
                {
                    text: "Continuar...",
                    type: "neutral",
                },
            ],
        };

        window.dialogueSystem.showDialogue(openingDialogue);

        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(
            window.dialogueSystem,
        );
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            originalSelectChoice(choiceIndex);
            setTimeout(() => {
                window.dialogueSystem.hideDialogue();
                this.enterTheater();
            }, 500);
            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    enterTheater() {
        this.changeBackground("fundocena3", "fade");
        this.showCharacter("ezra", "cautious", "center");

        const theaterDialogue = {
            speaker: "",
            text: "Evelly e Ezra avançam pela sala das poltronas. Os assentos parecem ocupados, mas, ao se aproximar, notam que são apenas manequins queimados, de rostos derretidos, todos voltados para o palco. O chão de madeira range como um tablado antigo.",
            effects: [{ type: "theaterAmbience" }],
            choices: [
                {
                    text: "Continuar...",
                    type: "neutral",
                },
            ],
        };

        window.dialogueSystem.showDialogue(theaterDialogue);

        const originalSelectChoice = window.dialogueSystem.selectChoice.bind(
            window.dialogueSystem,
        );
        window.dialogueSystem.selectChoice = (choiceIndex) => {
            originalSelectChoice(choiceIndex);
            setTimeout(() => {
                window.dialogueSystem.hideDialogue();
                this.startPianoPuzzle();
            }, 500);
            window.dialogueSystem.selectChoice = originalSelectChoice;
        };
    }

    clearScreen() {
        // Limpar personagens
        Object.keys(this.currentCharacters).forEach((name) => {
            this.hideCharacter(name);
        });

        // Limpar efeitos especiais
        const gameScreen = document.getElementById("game-screen");
        const effects = gameScreen.querySelectorAll(
            ".theater-spotlight, .mannequin, .shadow-entity, .memory-fragments, .shadow-in-glass",
        );
        effects.forEach((effect) => effect.remove());

        // Limpar interfaces
        const interfaces = gameScreen.querySelectorAll(
            "#piano-interface, #maze-interface, #control-panel, #qte-interface",
        );
        interfaces.forEach((gameInterface) => gameInterface.remove());

        // Resetar filtros
        gameScreen.style.filter = "";
        gameScreen.style.animation = "";
    }

    // Método para limpar efeitos quando o capítulo termina
    cleanup() {
        this.clearScreen();
        this.pianoPuzzle.isActive = false;
        this.mazeGame.isActive = false;
        if (this.mazeTimer) {
            clearInterval(this.mazeTimer);
        }
        if (this.mazeKeyHandler) {
            document.removeEventListener("keydown", this.mazeKeyHandler);
        }
    }
}

// Registrar globalmente para o sistema de capítulos
window.Chapter3 = Chapter3;

// Adicionar estilos CSS necessários
const chapterStyles = document.createElement("style");
chapterStyles.textContent = `
    @keyframes whisperFloat {
        0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
        50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
    }
    
    @keyframes fragmentFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
        50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
    }
    
    @keyframes shadowAdvance {
        0% { right: -100px; }
        100% { right: 20px; }
    }
    
    @keyframes shadowClap {
        0%, 100% { transform: translateX(-50%) scaleX(1); }
        50% { transform: translateX(-50%) scaleX(0.8); }
    }
    
    @keyframes screenShake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
        20%, 40%, 60%, 80% { transform: translateX(2px); }
    }
    
    @keyframes redFlash {
        0%, 100% { opacity: 0; }
        50% { opacity: 0.6; }
    }
    
    @keyframes glitchText {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-2px); }
        40% { transform: translateX(2px); }
        60% { transform: translateX(-1px); }
        80% { transform: translateX(1px); }
    }
    
    @keyframes biometricPulse {
        0%, 100% { transform: scale(1); color: #FFFF00; }
        50% { transform: scale(1.1); color: #FF0000; }
    }
    
    @keyframes panelExplode {
        0% { transform: translateX(-50%) scale(1); opacity: 1; }
        50% { transform: translateX(-50%) scale(1.2); opacity: 0.8; }
        100% { transform: translateX(-50%) scale(0.8); opacity: 0; }
    }
    
    @keyframes sparkFly {
        0% { transform: translate(0, 0) scale(1); opacity: 1; }
        100% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0); opacity: 0; }
    }
`;

document.head.appendChild(chapterStyles);
