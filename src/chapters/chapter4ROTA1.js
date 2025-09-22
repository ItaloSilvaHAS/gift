class Chapter4Rota1 {
    constructor() {
        this.name = 'Fragmentos da Verdade - Aceitar o Chamado';
        this.totalScenes = 4;
        this.currentPuzzle = null;
        this.currentCharacters = {};
        
        // Sistema de Palco (Performance)
        this.performanceSystem = {
            isActive: false,
            currentPerformance: null,
            erzaConfidence: 0,
            playerChoices: []
        };
        
        // Puzzle dos Ecos
        this.echoPuzzle = {
            isActive: false,
            correctPath: [2, 1, 3, 0], // Sequência dos corredores corretos
            playerPath: [],
            currentStep: 0,
            failures: 0,
            maxFailures: 2,
            voices: [
                { id: 0, text: "Venha... o palco te espera...", isCorrect: false, danger: true },
                { id: 1, text: "Por aqui... segue minha voz...", isCorrect: true, danger: false },
                { id: 2, text: "A verdade está adiante...", isCorrect: true, danger: false },
                { id: 3, text: "Não tenha medo... só um pouco mais...", isCorrect: true, danger: false }
            ]
        };
        
        // Minigame de Memória Sonora (Simon Says)
        this.musicBoxPuzzle = {
            isActive: false,
            sequence: [],
            playerInput: [],
            currentStep: 0,
            maxSequenceLength: 6,
            failures: 0,
            maxFailures: 3,
            boxes: [
                { id: 'box1', note: 'C', sound: 'music_box_c' },
                { id: 'box2', note: 'D', sound: 'music_box_d' },
                { id: 'box3', note: 'E', sound: 'music_box_e' },
                { id: 'box4', note: 'F', sound: 'music_box_f' },
                { id: 'box5', note: 'G', sound: 'music_box_g' }
            ]
        };
        
        // Estado da sombra
        this.shadowState = {
            manifestation: null, // 'echo', 'monster', 'whisper'
            intensity: 0,
            isActive: false
        };
    }

    // ====== SISTEMA DE EXIBIÇÃO DE PERSONAGENS ======
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
                element.style.left = '50%';
                element.style.transform = 'translateX(-50%)';
                break;
        }
        
        const img = element.querySelector('.character-sprite');
        if (img) {
            img.style.cssText = `
                max-height: 100%;
                max-width: 400px;
                object-fit: contain;
                filter: drop-shadow(0 0 20px rgba(0,0,0,0.5));
            `;
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

    // ====== INÍCIO DO CAPÍTULO ======
    async start() {
        console.log('Iniciando Capítulo 4 - Rota A: Aceitar o Chamado');
        
        // Configurar estado do capítulo
        window.gameState.currentChapter = 4;
        window.gameState.currentScene = 1;
        window.gameState.flags.currentRoute = 'cathedral';
        
        // Aplicar estilo do capítulo
        this.applyChapterStyling();
        
        // Determinar manifestação da sombra baseado no karma
        this.determineShadowManifestation();
        
        // Iniciar primeira cena
        await this.startScene1();
    }

    applyChapterStyling() {
        const gameScreen = document.getElementById('game-screen');
        gameScreen.classList.add('chapter-4-cathedral');
        
        // Música ambiente da catedral
        window.audioManager?.playMusic('cathedral_whispers', true);
        
        // Aplicar filtros visuais da catedral
        const background = document.getElementById('background');
        background.style.backgroundImage = 'url(./assets/images/backgrounds/fundocena2.avif)';
        background.style.filter = 'sepia(0.3) contrast(1.2) brightness(0.4)';
        
        // Efeitos de luz dos vitrais
        this.startStainedGlassEffects();
    }

    startStainedGlassEffects() {
        const effectsDiv = document.getElementById('effects');
        
        // Criar efeito de luzes dos vitrais
        const glassLight = document.createElement('div');
        glassLight.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, 
                transparent 0%, 
                rgba(128, 0, 128, 0.1) 25%, 
                transparent 50%, 
                rgba(0, 0, 255, 0.1) 75%, 
                transparent 100%);
            z-index: 1;
            animation: glassShimmer 8s ease-in-out infinite;
        `;
        
        effectsDiv.appendChild(glassLight);
        
        // Adicionar CSS para animação
        if (!document.getElementById('cathedral-styles')) {
            const style = document.createElement('style');
            style.id = 'cathedral-styles';
            style.textContent = `
                @keyframes glassShimmer {
                    0%, 100% { opacity: 0.3; transform: translateX(-10px); }
                    50% { opacity: 0.7; transform: translateX(10px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    determineShadowManifestation() {
        const karma = window.gameState.karma;
        
        if (karma > 0) {
            this.shadowState.manifestation = 'echo';
        } else if (karma < -5) {
            this.shadowState.manifestation = 'monster';
        } else {
            this.shadowState.manifestation = 'whisper';
        }
        
        console.log(`Manifestação da sombra: ${this.shadowState.manifestation}`);
    }

    // ====== CENA 1: CHEGADA À CATEDRAL ======
    async startScene1() {
        window.gameState.currentScene = 1;
        
        const arrivalDialogue = {
            speaker: '',
            text: 'Vocês chegam a uma catedral abandonada. Vitrais quebrados filtram a luz da lua em feixes distorcidos de cores spectrais. O ar carrega sussurros e cantorias etéreas, como se alguém estivesse ensaiando uma peça teatral macabra.',
            effects: [{ type: 'fadeIn', duration: 2000 }]
        };

        window.dialogueSystem.showDialogue(arrivalDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.evellyReaction();
        });
    }

    evellyReaction() {
        // Tocar sussurros distantes
        window.audioManager?.playSound('distant_whispers');
        
        const evellyDialogue = {
            speaker: 'Evelly',
            text: 'Este lugar... é como se fosse um palco gigante. Posso quase sentir os holofotes me observando através desses vitrais...',
            effects: [{ type: 'character_thought' }]
        };

        window.dialogueSystem.showDialogue(evellyDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.ezraWarning();
        });
    }

    ezraWarning() {
        this.showCharacter('ezra', 'cautious', 'right');
        
        const ezraDialogue = {
            speaker: 'Ezra',
            text: 'Cuidado, Evelly. Esse lugar... as vozes que estou ouvindo não parecem normais. É como se estivessem nos chamando para alguma coisa.',
            effects: [{ type: 'warning' }]
        };

        window.dialogueSystem.showDialogue(ezraDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.hearVoices();
        });
    }

    hearVoices() {
        // Múltiplos sussurros sobrepondo
        window.audioManager?.playSound('choir_whispers');
        
        const voicesDialogue = {
            speaker: '',
            text: 'Súbitamente, vozes ecoam pelos corredores da catedral, vindas de direções diferentes. Cada uma parece estar chamando vocês por caminhos distintos.',
            choices: [
                {
                    text: 'Seguir as vozes que cantam em harmonia (esquerda)',
                    type: 'investigate',
                    karma: 2,
                    consequences: [{ type: 'flag', flag: 'followedHarmony', value: true }]
                },
                {
                    text: 'Seguir a voz sussurrante mais clara (direita)', 
                    type: 'cautious',
                    karma: 0,
                    consequences: [{ type: 'flag', flag: 'followedWhisper', value: true }]
                },
                {
                    text: 'Ignorar todas as vozes e explorar sozinha',
                    type: 'defiant',
                    karma: -3,
                    consequences: [{ type: 'flag', flag: 'ignoredVoices', value: true }]
                }
            ]
        };

        window.dialogueSystem.showDialogue(voicesDialogue);
        
        window.dialogueSystem.setNextAction((choice) => {
            this.processVoiceChoice(choice);
        });
    }

    processVoiceChoice(choice) {
        if (choice.consequences) {
            window.gameState.applyConsequences(choice.consequences);
        }
        
        // Iniciar puzzle dos ecos
        setTimeout(() => {
            this.startEchoPuzzle();
        }, 1000);
    }

    // ====== PUZZLE DOS ECOS ======
    startEchoPuzzle() {
        this.echoPuzzle.isActive = true;
        this.currentPuzzle = 'echo';
        
        const puzzleIntro = {
            speaker: '',
            text: 'Vocês chegam a um cruzamento de corredores. Cada caminho ecoa com vozes diferentes. Apenas uma voz guiará vocês corretamente - as outras levam ao perigo.',
            effects: [{ type: 'puzzle_start' }]
        };

        window.dialogueSystem.showDialogue(puzzleIntro);
        
        window.dialogueSystem.setNextAction(() => {
            this.showEchoPuzzleInterface();
        });
    }

    showEchoPuzzleInterface() {
        const puzzleContainer = document.createElement('div');
        puzzleContainer.id = 'echo-puzzle';
        puzzleContainer.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            padding: 2rem;
            border-radius: 10px;
            border: 2px solid #8B4513;
            z-index: 1000;
        `;
        
        puzzleContainer.innerHTML = `
            <h3 style="color: #FFD700; text-align: center; margin-bottom: 1rem;">
                Puzzle dos Ecos
            </h3>
            <p style="color: white; text-align: center; margin-bottom: 2rem;">
                Escolha o corredor seguindo as vozes corretas. Cuidado - vozes erradas levam ao perigo.
            </p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                ${this.echoPuzzle.voices.map((voice, index) => `
                    <button class="corridor-btn" data-voice="${index}" 
                            style="padding: 1rem; background: #4A4A4A; color: white; 
                                   border: 1px solid #8B4513; border-radius: 5px; 
                                   cursor: pointer; transition: all 0.3s;">
                        Corredor ${index + 1}
                    </button>
                `).join('')}
            </div>
            <div style="margin-top: 1rem; text-align: center;">
                <div id="echo-progress" style="color: #FFD700;">
                    Progresso: ${this.echoPuzzle.currentStep}/${this.echoPuzzle.correctPath.length}
                </div>
                <div id="echo-failures" style="color: #FF4444;">
                    Tentativas restantes: ${this.echoPuzzle.maxFailures - this.echoPuzzle.failures}
                </div>
            </div>
        `;
        
        document.body.appendChild(puzzleContainer);
        
        // Adicionar event listeners
        const corridorBtns = puzzleContainer.querySelectorAll('.corridor-btn');
        corridorBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const voiceId = parseInt(e.target.dataset.voice);
                this.selectCorridor(voiceId);
            });
            
            btn.addEventListener('mouseenter', (e) => {
                const voiceId = parseInt(e.target.dataset.voice);
                this.playVoicePreview(voiceId);
                e.target.style.background = '#6A4A3A';
            });
            
            btn.addEventListener('mouseleave', (e) => {
                e.target.style.background = '#4A4A4A';
            });
        });
    }

    playVoicePreview(voiceId) {
        const voice = this.echoPuzzle.voices[voiceId];
        
        // Simular áudio da voz (substituir por áudio real se disponível)
        if (voice.isCorrect) {
            window.audioManager?.playSound('gentle_whisper');
        } else {
            window.audioManager?.playSound('menacing_whisper');
        }
        
        // Mostrar texto da voz temporariamente
        const voiceText = document.createElement('div');
        voiceText.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: ${voice.isCorrect ? '#00FF00' : '#FF4444'};
            padding: 1rem;
            border-radius: 5px;
            z-index: 1001;
            font-style: italic;
        `;
        voiceText.textContent = `"${voice.text}"`;
        
        document.body.appendChild(voiceText);
        
        setTimeout(() => {
            if (document.body.contains(voiceText)) {
                document.body.removeChild(voiceText);
            }
        }, 2000);
    }

    selectCorridor(voiceId) {
        const correctChoice = this.echoPuzzle.correctPath[this.echoPuzzle.currentStep];
        
        if (voiceId === correctChoice) {
            // Escolha correta
            this.echoPuzzle.currentStep++;
            this.echoPuzzle.playerPath.push(voiceId);
            
            if (this.echoPuzzle.currentStep >= this.echoPuzzle.correctPath.length) {
                // Puzzle completo
                this.completeEchoPuzzle();
            } else {
                // Continuar puzzle
                this.updateEchoPuzzleInterface();
                window.audioManager?.playSound('success_chime');
            }
        } else {
            // Escolha errada
            this.echoPuzzle.failures++;
            this.handleEchoPuzzleFailure(voiceId);
        }
    }

    handleEchoPuzzleFailure(voiceId) {
        const voice = this.echoPuzzle.voices[voiceId];
        
        window.audioManager?.playSound('danger_sting');
        
        if (this.echoPuzzle.failures >= this.echoPuzzle.maxFailures) {
            // Game Over
            this.echoPuzzleGameOver();
        } else {
            // Mostrar consequência mas continuar
            const failureMsg = document.createElement('div');
            failureMsg.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #8B0000;
                color: white;
                padding: 2rem;
                border-radius: 10px;
                z-index: 1002;
                text-align: center;
            `;
            failureMsg.innerHTML = `
                <h3>Caminho Perigoso!</h3>
                <p>"${voice.text}"</p>
                <p>Algo sinistro se aproxima...</p>
                <button onclick="this.parentElement.remove();" 
                        style="margin-top: 1rem; padding: 0.5rem 1rem; 
                               background: #4A4A4A; color: white; border: none; 
                               border-radius: 5px; cursor: pointer;">
                    Continuar
                </button>
            `;
            
            document.body.appendChild(failureMsg);
            this.updateEchoPuzzleInterface();
        }
    }

    updateEchoPuzzleInterface() {
        const progressDiv = document.getElementById('echo-progress');
        const failuresDiv = document.getElementById('echo-failures');
        
        if (progressDiv) {
            progressDiv.textContent = `Progresso: ${this.echoPuzzle.currentStep}/${this.echoPuzzle.correctPath.length}`;
        }
        
        if (failuresDiv) {
            failuresDiv.textContent = `Tentativas restantes: ${this.echoPuzzle.maxFailures - this.echoPuzzle.failures}`;
        }
    }

    completeEchoPuzzle() {
        this.echoPuzzle.isActive = false;
        
        // Remover interface do puzzle
        const puzzleDiv = document.getElementById('echo-puzzle');
        if (puzzleDiv) {
            puzzleDiv.remove();
        }
        
        window.audioManager?.playSound('puzzle_complete');
        
        const successDialogue = {
            speaker: '',
            text: 'Seguindo as vozes corretas, vocês navegam pelos corredores em segurança e chegam ao salão principal da catedral, onde caixas de música antigas aguardam...',
            effects: [{ type: 'success' }]
        };

        window.dialogueSystem.showDialogue(successDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.startScene2();
        });
    }

    echoPuzzleGameOver() {
        // Implementar Game Over
        const gameOverMsg = document.createElement('div');
        gameOverMsg.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #000;
            color: #FF0000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            font-family: 'Creepster', cursive;
        `;
        
        gameOverMsg.innerHTML = `
            <h1 style="font-size: 3rem; margin-bottom: 2rem;">PERDIDO NAS VOZES</h1>
            <p style="font-size: 1.5rem; margin-bottom: 2rem;">As vozes enganaram você...</p>
            <button onclick="window.location.reload();" 
                    style="padding: 1rem 2rem; font-size: 1.2rem; 
                           background: #8B0000; color: white; border: none; 
                           border-radius: 10px; cursor: pointer;">
                Tentar Novamente
            </button>
        `;
        
        document.body.appendChild(gameOverMsg);
        window.audioManager?.playSound('jumpscare');
    }

    // ====== CENA 2: SALÃO DAS CAIXAS DE MÚSICA ======
    async startScene2() {
        window.gameState.currentScene = 2;
        
        const scene2Dialogue = {
            speaker: '',
            text: 'O salão principal se abre diante de vocês. Cinco caixas de música ornamentadas estão dispostas em semicírculo, cada uma emanando uma aura etérea. Elas parecem estar esperando por uma melodia específica.',
            effects: [{ type: 'scene_transition' }]
        };

        window.dialogueSystem.showDialogue(scene2Dialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.ezraObservation();
        });
    }

    ezraObservation() {
        this.changeCharacterExpression('ezra', 'cautious');
        
        const ezraDialogue = {
            speaker: 'Ezra',
            text: 'Essas caixas... elas estão vibrando levemente. Como se estivessem aguardando uma sequência específica. Cuidado, Evelly. Algo me diz que uma melodia errada pode despertar coisas que é melhor deixar dormindo.',
            effects: [{ type: 'warning' }]
        };

        window.dialogueSystem.showDialogue(ezraDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.startMusicBoxPuzzle();
        });
    }

    // ====== MINIGAME DE MEMÓRIA SONORA (SIMON SAYS) ======
    startMusicBoxPuzzle() {
        this.musicBoxPuzzle.isActive = true;
        this.currentPuzzle = 'musicBox';
        
        // Gerar sequência aleatória
        this.musicBoxPuzzle.sequence = [];
        for (let i = 0; i < this.musicBoxPuzzle.maxSequenceLength; i++) {
            this.musicBoxPuzzle.sequence.push(Math.floor(Math.random() * this.musicBoxPuzzle.boxes.length));
        }
        
        const puzzleIntro = {
            speaker: '',
            text: 'As caixas de música começam a brilhar. Você deve reproduzir a sequência de notas exatamente como elas tocam. Preste atenção...',
            effects: [{ type: 'puzzle_start' }]
        };

        window.dialogueSystem.showDialogue(puzzleIntro);
        
        window.dialogueSystem.setNextAction(() => {
            this.showMusicBoxInterface();
        });
    }

    showMusicBoxInterface() {
        const puzzleContainer = document.createElement('div');
        puzzleContainer.id = 'musicbox-puzzle';
        puzzleContainer.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            padding: 2rem;
            border-radius: 15px;
            border: 3px solid #FFD700;
            z-index: 1000;
            text-align: center;
        `;
        
        puzzleContainer.innerHTML = `
            <h3 style="color: #FFD700; margin-bottom: 1rem;">Caixas de Música Misteriosas</h3>
            <p style="color: white; margin-bottom: 2rem;">
                Reproduza a sequência tocada pelas caixas
            </p>
            <div id="music-boxes" style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 2rem;">
                ${this.musicBoxPuzzle.boxes.map((box, index) => `
                    <div class="music-box" data-box="${index}" 
                         style="width: 80px; height: 80px; background: #8B4513; 
                                border: 2px solid #FFD700; border-radius: 10px; 
                                display: flex; align-items: center; justify-content: center; 
                                cursor: pointer; transition: all 0.3s; color: white; 
                                font-weight: bold;">
                        ${box.note}
                    </div>
                `).join('')}
            </div>
            <div id="puzzle-status" style="color: #FFD700; margin-bottom: 1rem;">
                Sequência: ${this.musicBoxPuzzle.currentStep + 1}/${this.musicBoxPuzzle.maxSequenceLength}
            </div>
            <div id="failure-status" style="color: #FF4444;">
                Tentativas restantes: ${this.musicBoxPuzzle.maxFailures - this.musicBoxPuzzle.failures}
            </div>
            <button id="start-sequence" onclick="chapter4Rota1.playMusicSequence()" 
                    style="margin-top: 1rem; padding: 0.5rem 1rem; background: #4A4A4A; 
                           color: white; border: none; border-radius: 5px; cursor: pointer;">
                Ouvir Sequência
            </button>
        `;
        
        document.body.appendChild(puzzleContainer);
        
        // Adicionar event listeners
        const musicBoxes = puzzleContainer.querySelectorAll('.music-box');
        musicBoxes.forEach(box => {
            box.addEventListener('click', (e) => {
                const boxIndex = parseInt(e.target.dataset.box);
                this.selectMusicBox(boxIndex);
            });
        });
        
        // Iniciar primeira sequência
        setTimeout(() => {
            this.playMusicSequence();
        }, 1000);
    }

    playMusicSequence() {
        const currentLength = this.musicBoxPuzzle.currentStep + 1;
        const sequence = this.musicBoxPuzzle.sequence.slice(0, currentLength);
        
        // Desabilitar cliques durante a reprodução
        const musicBoxes = document.querySelectorAll('.music-box');
        musicBoxes.forEach(box => box.style.pointerEvents = 'none');
        
        let index = 0;
        const playNext = () => {
            if (index < sequence.length) {
                const boxIndex = sequence[index];
                this.highlightMusicBox(boxIndex);
                
                // Tocar som da caixa
                const box = this.musicBoxPuzzle.boxes[boxIndex];
                window.audioManager?.playSound(box.sound);
                
                index++;
                setTimeout(playNext, 800);
            } else {
                // Reabilitar cliques
                musicBoxes.forEach(box => box.style.pointerEvents = 'auto');
            }
        };
        
        playNext();
    }

    highlightMusicBox(boxIndex) {
        const musicBox = document.querySelector(`[data-box="${boxIndex}"]`);
        if (musicBox) {
            musicBox.style.background = '#FFD700';
            musicBox.style.color = '#000';
            
            setTimeout(() => {
                musicBox.style.background = '#8B4513';
                musicBox.style.color = 'white';
            }, 400);
        }
    }

    selectMusicBox(boxIndex) {
        const currentLength = this.musicBoxPuzzle.currentStep + 1;
        const expectedBox = this.musicBoxPuzzle.sequence[this.musicBoxPuzzle.playerInput.length];
        
        this.musicBoxPuzzle.playerInput.push(boxIndex);
        
        // Tocar som da caixa selecionada
        const box = this.musicBoxPuzzle.boxes[boxIndex];
        window.audioManager?.playSound(box.sound);
        this.highlightMusicBox(boxIndex);
        
        if (boxIndex === expectedBox) {
            // Escolha correta
            if (this.musicBoxPuzzle.playerInput.length >= currentLength) {
                // Sequência completa
                this.musicBoxPuzzle.currentStep++;
                this.musicBoxPuzzle.playerInput = [];
                
                if (this.musicBoxPuzzle.currentStep >= this.musicBoxPuzzle.maxSequenceLength) {
                    // Puzzle completo
                    this.completeMusicBoxPuzzle();
                } else {
                    // Próxima sequência
                    this.updateMusicBoxStatus();
                    setTimeout(() => {
                        this.playMusicSequence();
                    }, 1000);
                }
            }
        } else {
            // Escolha errada
            this.musicBoxPuzzle.failures++;
            this.musicBoxPuzzle.playerInput = [];
            
            if (this.musicBoxPuzzle.failures >= this.musicBoxPuzzle.maxFailures) {
                this.musicBoxGameOver();
            } else {
                this.handleMusicBoxFailure();
            }
        }
    }

    updateMusicBoxStatus() {
        const statusDiv = document.getElementById('puzzle-status');
        const failureDiv = document.getElementById('failure-status');
        
        if (statusDiv) {
            statusDiv.textContent = `Sequência: ${this.musicBoxPuzzle.currentStep + 1}/${this.musicBoxPuzzle.maxSequenceLength}`;
        }
        
        if (failureDiv) {
            failureDiv.textContent = `Tentativas restantes: ${this.musicBoxPuzzle.maxFailures - this.musicBoxPuzzle.failures}`;
        }
    }

    handleMusicBoxFailure() {
        window.audioManager?.playSound('music_box_horror');
        
        const failureMsg = document.createElement('div');
        failureMsg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #8B0000;
            color: white;
            padding: 2rem;
            border-radius: 10px;
            z-index: 1002;
            text-align: center;
        `;
        
        failureMsg.innerHTML = `
            <h3>Melodia Desarmônica!</h3>
            <p>As caixas emitem um som perturbador...</p>
            <p>Algo nas sombras se agita...</p>
            <button onclick="this.parentElement.remove(); chapter4Rota1.playMusicSequence();" 
                    style="margin-top: 1rem; padding: 0.5rem 1rem; 
                           background: #4A4A4A; color: white; border: none; 
                           border-radius: 5px; cursor: pointer;">
                Tentar Novamente
            </button>
        `;
        
        document.body.appendChild(failureMsg);
        this.updateMusicBoxStatus();
    }

    completeMusicBoxPuzzle() {
        this.musicBoxPuzzle.isActive = false;
        
        const puzzleDiv = document.getElementById('musicbox-puzzle');
        if (puzzleDiv) {
            puzzleDiv.remove();
        }
        
        window.audioManager?.playSound('heavenly_chime');
        
        const successDialogue = {
            speaker: '',
            text: 'A melodia correta ressoa pela catedral. As caixas de música param de tocar e um caminho secreto se abre, revelando um corredor que leva ao coração da catedral.',
            effects: [{ type: 'success' }]
        };

        window.dialogueSystem.showDialogue(successDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.startScene3();
        });
    }

    musicBoxGameOver() {
        // Similar ao echo puzzle game over
        const gameOverMsg = document.createElement('div');
        gameOverMsg.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #000;
            color: #FF0000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            font-family: 'Creepster', cursive;
        `;
        
        gameOverMsg.innerHTML = `
            <h1 style="font-size: 3rem; margin-bottom: 2rem;">MELODIA DA PERDIÇÃO</h1>
            <p style="font-size: 1.5rem; margin-bottom: 2rem;">A música despertou algo terrível...</p>
            <button onclick="window.location.reload();" 
                    style="padding: 1rem 2rem; font-size: 1.2rem; 
                           background: #8B0000; color: white; border: none; 
                           border-radius: 10px; cursor: pointer;">
                Tentar Novamente
            </button>
        `;
        
        document.body.appendChild(gameOverMsg);
        window.audioManager?.playSound('entity_scream');
    }

    // ====== CENA 3: ENCONTRO COM A SOMBRA ======
    async startScene3() {
        window.gameState.currentScene = 3;
        
        const encounterDialogue = {
            speaker: '',
            text: 'No coração da catedral, uma figura sombria aguarda. A manifestação varia de acordo com o peso de suas escolhas passadas...',
            effects: [{ type: 'dramatic_pause' }]
        };

        window.dialogueSystem.showDialogue(encounterDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.manifestShadow();
        });
    }

    manifestShadow() {
        this.shadowState.isActive = true;
        
        // Aplicar efeito visual baseado na manifestação
        const effectsDiv = document.getElementById('effects');
        const shadowEffect = document.createElement('div');
        shadowEffect.id = 'shadow-manifestation';
        
        switch (this.shadowState.manifestation) {
            case 'echo':
                this.showEchoManifestation(shadowEffect);
                break;
            case 'monster':
                this.showMonsterManifestation(shadowEffect);
                break;
            case 'whisper':
                this.showWhisperManifestation(shadowEffect);
                break;
        }
        
        effectsDiv.appendChild(shadowEffect);
        
        setTimeout(() => {
            this.shadowDialogue();
        }, 2000);
    }

    showEchoManifestation(element) {
        element.style.cssText = `
            position: absolute;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            width: 300px;
            height: 400px;
            background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3));
            border: 2px solid rgba(255,255,255,0.5);
            border-radius: 10px;
            animation: echo-flicker 2s ease-in-out infinite;
            z-index: 3;
        `;
        
        element.innerHTML = `
            <div style="position: absolute; top: 50%; left: 50%; 
                        transform: translate(-50%, -50%); color: white; 
                        text-align: center; font-style: italic;">
                Sombra de Evelly<br/>
                <small>Eco Distorcido</small>
            </div>
        `;
    }

    showMonsterManifestation(element) {
        element.style.cssText = `
            position: absolute;
            top: 15%;
            left: 50%;
            transform: translateX(-50%);
            width: 350px;
            height: 450px;
            background: radial-gradient(circle, #8B0000, #000);
            border: 3px solid #FF0000;
            border-radius: 20px;
            animation: monster-pulse 1.5s ease-in-out infinite;
            z-index: 3;
        `;
        
        element.innerHTML = `
            <div style="position: absolute; top: 50%; left: 50%; 
                        transform: translate(-50%, -50%); color: #FF0000; 
                        text-align: center; font-weight: bold; font-size: 1.2rem;">
                FIGURA MONSTRUOSA<br/>
                <small style="color: white;">Irreconhecível</small>
            </div>
        `;
    }

    showWhisperManifestation(element) {
        element.style.cssText = `
            position: absolute;
            top: 25%;
            left: 50%;
            transform: translateX(-50%);
            width: 200px;
            height: 300px;
            background: rgba(128, 128, 128, 0.2);
            border: 1px dashed rgba(255,255,255,0.3);
            border-radius: 50%;
            animation: whisper-float 3s ease-in-out infinite;
            z-index: 3;
        `;
        
        element.innerHTML = `
            <div style="position: absolute; top: 50%; left: 50%; 
                        transform: translate(-50%, -50%); color: rgba(255,255,255,0.7); 
                        text-align: center; font-style: italic;">
                ???<br/>
                <small>Sussurro Constante</small>
            </div>
        `;
    }

    shadowDialogue() {
        let shadowText = '';
        let shadowName = 'Sombra';
        
        switch (this.shadowState.manifestation) {
            case 'echo':
                shadowText = 'Olhe para mim, Evelly. Sou você... mas sem as máscaras. Sem as mentiras que conta para si mesma. Aceite a verdade: você sempre soube que fracassar era inevitável.';
                shadowName = 'Eco de Evelly';
                break;
            case 'monster':
                shadowText = 'VOCÊ FEZ ISSO! Cada vida que se perdeu, cada grito que ecoou... foi por sua causa! Não há redenção para quem carrega tanto sangue nas mãos!';
                shadowName = 'Figura Monstruosa';
                break;
            case 'whisper':
                shadowText = 'Sussurros... sempre sussurros... A verdade nunca pode ser dita em voz alta, pode? Só sussurrada nas sombras...';
                shadowName = 'Sussurros';
                break;
        }
        
        const shadowDialogue = {
            speaker: shadowName,
            text: shadowText,
            effects: [{ type: 'shadow_speech' }]
        };

        window.dialogueSystem.showDialogue(shadowDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.startPerformanceSystem();
        });
    }

    // ====== SISTEMA DE PALCO (PERFORMANCE) ======
    startPerformanceSystem() {
        this.performanceSystem.isActive = true;
        
        const performanceIntro = {
            speaker: '',
            text: 'A catedral se transforma em um palco. Holofotes invisíveis se acendem sobre vocês. A sombra aguarda sua performance. Como Evelly responderá à acusação?',
            choices: [
                {
                    text: '[Interpretar a dor] "Sim... eu falhei. E cada dia carrego esse peso como uma marca no peito."',
                    type: 'performance_pain',
                    karma: 5,
                    consequences: [
                        { type: 'relationship', character: 'ezra', value: 2 },
                        { type: 'flag', flag: 'acceptedPain', value: true }
                    ]
                },
                {
                    text: '[Ignorar as falas] "Palavras vazias. Você não é real, apenas uma projeção dos meus medos."',
                    type: 'performance_denial',
                    karma: -2,
                    consequences: [
                        { type: 'relationship', character: 'ezra', value: -1 },
                        { type: 'flag', flag: 'deniedShadow', value: true }
                    ]
                },
                {
                    text: '[Responder agressivamente] "CALE A BOCA! Eu não sou responsável por tudo que aconteceu!"',
                    type: 'performance_rage',
                    karma: -8,
                    consequences: [
                        { type: 'relationship', character: 'ezra', value: -3 },
                        { type: 'flag', flag: 'ragedAtShadow', value: true }
                    ]
                }
            ]
        };

        window.dialogueSystem.showDialogue(performanceIntro);
        
        window.dialogueSystem.setNextAction((choice) => {
            this.processPerformanceChoice(choice);
        });
    }

    processPerformanceChoice(choice) {
        this.performanceSystem.playerChoices.push(choice);
        
        if (choice.consequences) {
            window.gameState.applyConsequences(choice.consequences);
        }
        
        // Reação de Ezra
        this.ezraPerformanceReaction(choice);
    }

    ezraPerformanceReaction(choice) {
        let ezraText = '';
        let ezraExpression = 'neutral';
        
        switch (choice.type) {
            case 'performance_pain':
                ezraText = 'Evelly... sua honestidade é corajosa. Enfrentar a dor ao invés de fugir dela... isso é força real.';
                ezraExpression = 'happy';
                this.performanceSystem.erzaConfidence += 2;
                break;
            case 'performance_denial':
                ezraText = 'Talvez você esteja certa... mas fugir da verdade nunca resolveu nada. Cuidado para não se perder na negação.';
                ezraExpression = 'cautious';
                break;
            case 'performance_rage':
                ezraText = 'Evelly! Controle-se! Sua raiva só está alimentando essa coisa!';
                ezraExpression = 'angry';
                this.performanceSystem.erzaConfidence -= 2;
                break;
        }
        
        this.changeCharacterExpression('ezra', ezraExpression);
        
        const ezraDialogue = {
            speaker: 'Ezra',
            text: ezraText,
            effects: [{ type: 'character_reaction' }]
        };

        window.dialogueSystem.showDialogue(ezraDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.shadowContract();
        });
    }

    shadowContract() {
        const contractDialogue = {
            speaker: 'Sombra',
            text: 'O palco está pronto. Eu ofereço um contrato: continue neste caminho de dor e lembrança, e você chegará à verdade. Mas a verdade... ela dói mais que qualquer ferida física.',
            choices: [
                {
                    text: 'Aceito. Preciso saber a verdade, não importa o custo.',
                    type: 'accept_contract',
                    karma: 3,
                    consequences: [{ type: 'flag', flag: 'acceptedContract', value: true }]
                },
                {
                    text: 'Recuso. Alguns segredos devem permanecer enterrados.',
                    type: 'refuse_contract',
                    karma: -5,
                    consequences: [{ type: 'flag', flag: 'refusedContract', value: true }]
                }
            ]
        };

        window.dialogueSystem.showDialogue(contractDialogue);
        
        window.dialogueSystem.setNextAction((choice) => {
            this.processContractChoice(choice);
        });
    }

    processContractChoice(choice) {
        if (choice.consequences) {
            window.gameState.applyConsequences(choice.consequences);
        }
        
        // Remover sombra
        const shadowElement = document.getElementById('shadow-manifestation');
        if (shadowElement) {
            shadowElement.style.opacity = '0';
            setTimeout(() => {
                shadowElement.remove();
            }, 1000);
        }
        
        setTimeout(() => {
            this.startScene4(choice);
        }, 1500);
    }

    // ====== CENA 4: O VITRAL ======
    async startScene4(contractChoice) {
        window.gameState.currentScene = 4;
        
        const vitralDialogue = {
            speaker: '',
            text: 'Vocês chegam diante de um vitral majestoso, mas rachado. Ele retrata uma cena trágica: um teatro em chamas, figuras correndo em pânico, e no centro... uma silhueta que parece familiar.',
            effects: [{ type: 'dramatic_reveal' }]
        };

        window.dialogueSystem.showDialogue(vitralDialogue);
        
        window.dialogueSystem.setNextAction(() => {
            this.vitralChoice(contractChoice);
        });
    }

    vitralChoice(contractChoice) {
        const isContractAccepted = contractChoice.type === 'accept_contract';
        
        let choiceText = isContractAccepted 
            ? 'Você aceitou enfrentar a verdade. O vitral brilha intensamente, aguardando sua decisão final.'
            : 'Você recusou o contrato, mas o vitral ainda mostra a verdade. A escolha ainda é sua.';
        
        const vitralChoiceDialogue = {
            speaker: '',
            text: choiceText,
            choices: [
                {
                    text: 'Olhar através do vitral (encarar a verdade)',
                    type: 'face_truth',
                    karma: isContractAccepted ? 5 : 2,
                    consequences: [{ type: 'flag', flag: 'facedTruth', value: true }]
                },
                {
                    text: 'Quebrar o vitral (recusar e destruir o símbolo)',
                    type: 'destroy_truth',
                    karma: isContractAccepted ? -8 : -3,
                    consequences: [{ type: 'flag', flag: 'destroyedTruth', value: true }]
                }
            ]
        };

        window.dialogueSystem.showDialogue(vitralChoiceDialogue);
        
        window.dialogueSystem.setNextAction((choice) => {
            this.completeChapter4Rota1(choice);
        });
    }

    completeChapter4Rota1(vitralChoice) {
        if (vitralChoice.consequences) {
            window.gameState.applyConsequences(vitralChoice.consequences);
        }
        
        // Salvar escolha para o próximo capítulo
        window.gameState.flags.chapter4Choice = vitralChoice.type;
        window.gameState.flags.chapter4Route = 'cathedral';
        
        let endingText = '';
        
        if (vitralChoice.type === 'face_truth') {
            endingText = 'Você encara o vitral. As imagens se movem, mostrando a verdade sobre a tragédia. No próximo capítulo, você será forçada a reviver o passado...';
        } else {
            endingText = 'Você quebra o vitral em mil pedaços. Os fragmentos caem como lágrimas de vidro. No próximo capítulo, você tentará negar a memória, mas o passado ainda assim a encontrará...';
        }
        
        const endingDialogue = {
            speaker: '',
            text: endingText,
            effects: [{ type: 'chapter_end' }]
        };

        window.dialogueSystem.showDialogue(endingDialogue);
        
        // Auto-save
        window.saveSystem?.autoSave();
        
        window.dialogueSystem.setNextAction(() => {
            this.showChapterComplete();
        });
    }

    showChapterComplete() {
        const completeDiv = document.createElement('div');
        completeDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #4B0082, #000);
            color: #FFD700;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            font-family: 'Orbitron', monospace;
        `;
        
        completeDiv.innerHTML = `
            <h1 style="font-size: 3rem; margin-bottom: 2rem; text-shadow: 0 0 20px #FFD700;">
                CAPÍTULO 4 COMPLETO
            </h1>
            <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">
                Rota da Catedral - Aceitar o Chamado
            </h2>
            <p style="font-size: 1.2rem; margin-bottom: 2rem; text-align: center; max-width: 600px;">
                Sua jornada pela catedral chegou ao fim. As escolhas que você fez determinarão como o próximo capítulo se desenrolará.
            </p>
            <div style="margin-bottom: 2rem;">
                <p>Karma atual: ${window.gameState.karma}</p>
                <p>Rota escolhida: Catedral</p>
                <p>Decisão final: ${window.gameState.flags.chapter4Choice === 'face_truth' ? 'Encarou a verdade' : 'Destruiu a verdade'}</p>
            </div>
            <button onclick="window.menuSystem.showMainMenu(); this.parentElement.remove();" 
                    style="padding: 1rem 2rem; font-size: 1.2rem; 
                           background: #4B0082; color: #FFD700; border: 2px solid #FFD700; 
                           border-radius: 10px; cursor: pointer; font-family: 'Orbitron', monospace;">
                Voltar ao Menu
            </button>
        `;
        
        document.body.appendChild(completeDiv);
        
        // Adicionar animações CSS
        if (!document.getElementById('chapter4-styles')) {
            const style = document.createElement('style');
            style.id = 'chapter4-styles';
            style.textContent = `
                @keyframes echo-flicker {
                    0%, 100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
                    50% { opacity: 1; transform: translateX(-50%) scale(1.05); }
                }
                @keyframes monster-pulse {
                    0%, 100% { transform: translateX(-50%) scale(1); box-shadow: 0 0 20px #FF0000; }
                    50% { transform: translateX(-50%) scale(1.1); box-shadow: 0 0 40px #FF0000; }
                }
                @keyframes whisper-float {
                    0%, 100% { transform: translateX(-50%) translateY(0px); opacity: 0.5; }
                    50% { transform: translateX(-50%) translateY(-10px); opacity: 0.8; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Instância global para acesso fácil
window.chapter4Rota1 = new Chapter4Rota1();