
class GameController {
    constructor() {
        this.isInitialized = false;
        this.currentChapter = null;
        this.chapters = {};
        
        this.init();
    }

    async init() {
        console.log('Initializing Evelly Adventure...');
        
        // Wait for all systems to be ready
        await this.waitForSystems();
        
        // Initialize game systems
        this.initializeSystems();
        
        // Preload critical assets
        await this.preloadAssets();
        
        // Ensure macabre music is playing
        setTimeout(() => {
            window.audioManager?.ensureMacabreMusicPlaying();
        }, 2000);
        
        this.isInitialized = true;
        console.log('Evelly Adventure initialized successfully!');
    }

    async waitForSystems() {
        // Wait for required global objects
        while (!window.gameState || !window.audioManager || !window.dialogueSystem || !window.saveSystem) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    initializeSystems() {
        // Set up chapter loading system
        this.setupChapterSystem();
        
        // Initialize combat system
        this.setupCombatSystem();
        
        // Initialize puzzle system
        this.setupPuzzleSystem();
        
        // Set up automatic systems
        this.setupAutoSystems();
        
        // Initialize jumpscare system
        this.setupJumpscareSystem();
    }

    setupChapterSystem() {
        this.chapters = {
            1: {
                name: 'O Despertar',
                scenes: 10,
                module: null
            },
            2: {
                name: 'O Setor das Vozes',
                scenes: 8,
                module: null
            },
            3: {
                name: 'A Tragédia Esquecida',
                scenes: 5,
                module: null
            },
            4: {
                name: 'Fragmentos da Verdade',
                scenes: 4,
                module: null
            },
            5: {
                name: 'O Coração do HollowMind',
                scenes: 5,
                module: null
            },
            6: {
                name: 'Renascimento ou Eternidade',
                scenes: 6,
                module: null
            }
        };
    }

    setupCombatSystem() {
        document.addEventListener('keydown', (e) => {
            if (this.isInCombat && e.key === ' ') {
                e.preventDefault();
                this.firePrimaryWeapon();
            }
        });

        document.addEventListener('mousedown', (e) => {
            if (this.isInCombat && e.button === 0) {
                e.preventDefault();
                this.firePrimaryWeapon();
            }
        });
    }

    setupPuzzleSystem() {
        this.puzzleSystem = {
            currentPuzzle: null,
            solvedPuzzles: [],
            failedAttempts: 0
        };
    }

    setupJumpscareSystem() {
        // Lista de imagens de jumpscare disponíveis
        this.jumpscareImages = [
            'jp (1).jpg',
            'jp (2).jpg',
            'jp (3).jpg',
            'jp (4).jpg',
            'jp (5).jpg',
            'jp (6).jpg',
            'jp (7).jpg',
            'jp (8).jpg',
            'jp (9).jpg',
            'jp (10).jpg',
            'jp (11).jpg'
        ];
    }

    // Sistema global de jumpscare que escolhe uma imagem aleatória
    showRandomJumpscare(duration = 3000, callback = null) {
        // Escolher imagem aleatória
        const randomIndex = Math.floor(Math.random() * this.jumpscareImages.length);
        const jumpscareImage = this.jumpscareImages[randomIndex];
        
        // Tocar som de jumpscare no volume MÁXIMO
        window.audioManager?.playJumpscare('extreme');
        
        // Criar elemento de jumpscare
        const jumpscareDiv = document.createElement('div');
        jumpscareDiv.id = 'jumpscare-screen';
        jumpscareDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-image: url('./assets/images/backgrounds/${jumpscareImage}');
            background-size: cover;
            background-position: center;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: jumpscareFlash 0.1s ease-in-out 0s 3;
        `;
        
        document.body.appendChild(jumpscareDiv);
        
        // Efeito de shake na tela
        document.body.style.animation = 'shake 0.5s ease-in-out';
        
        // Remover após o tempo especificado
        setTimeout(() => {
            jumpscareDiv.remove();
            document.body.style.animation = '';
            if (callback) callback();
        }, duration);
        
        console.log(`Jumpscare! Usando imagem: ${jumpscareImage}`);
    }

    setupAutoSystems() {
        // Auto-save every 5 minutes during gameplay
        setInterval(() => {
            if (window.gameState.autoSaveEnabled && this.currentChapter) {
                window.saveSystem.autoSave();
            }
        }, 300000);

        // Dynamic audio adjustment
        setInterval(() => {
            if (window.audioManager) {
                window.audioManager.updateAmbientAudio();
            }
        }, 10000);

        // Fear level decay over time
        setInterval(() => {
            if (window.gameState.flags.fearLevel > 0) {
                window.gameState.flags.fearLevel = Math.max(0, window.gameState.flags.fearLevel - 0.1);
            }
        }, 30000);
    }

    async preloadAssets() {
        // Preload critical audio
        if (window.audioManager) {
            window.audioManager.preloadAudio();
        }

        // Preload first chapter assets (placeholder)
        console.log('Preloading Chapter 1 assets...');
    }

    // Chapter Management
    async loadChapter(chapterNumber) {
        if (this.currentChapter === chapterNumber) return;

        console.log(`Loading Chapter ${chapterNumber}...`);
        
        const chapter = this.chapters[chapterNumber];
        if (!chapter) {
            console.error(`Chapter ${chapterNumber} not found!`);
            return false;
        }

        // Show loading screen
        window.menuSystem?.showScreen('loading-screen');

        try {
            // Wait for Chapter to be available
            let attempts = 0;
            const chapterClass = `Chapter${chapterNumber}`;
            while (!window[chapterClass] && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
            
            // Carregar módulo do capítulo dinamicamente
            if (chapterNumber === 1 && window.Chapter1) {
                chapter.module = new window.Chapter1();
                console.log('Chapter 1 module created successfully');
            } else if (chapterNumber === 2 && window.Chapter2) {
                chapter.module = new window.Chapter2();
                console.log('Chapter 2 module created successfully');
            } else if (chapterNumber === 3 && window.Chapter3) {
                chapter.module = new window.Chapter3();
                console.log('Chapter 3 module created successfully');
            } else if (chapterNumber === 4 && window.Chapter4) {
                chapter.module = new window.Chapter4();
                console.log('Chapter 4 module created successfully');
            } else if (chapterNumber === 5 && window.Chapter5) {
                chapter.module = new window.Chapter5();
                console.log('Chapter 5 module created successfully');
            } else if (chapterNumber === 6 && window.Chapter6) {
                chapter.module = new window.Chapter6();
                console.log('Chapter 6 module created successfully');
            } else {
                throw new Error(`Chapter ${chapterNumber} module not found after waiting`);
            }
            
            // Set current chapter
            this.currentChapter = chapterNumber;
            window.gameState.currentChapter = chapterNumber;
            window.gameState.currentScene = 1;

            // Apply chapter-specific settings
            this.applyChapterSettings(chapter);

            // Hide loading screen and show game first
            window.menuSystem?.showGameScreen();

            // Load the chapter using its module
            if (chapter.module) {
                if (chapter.module.start) {
                    await chapter.module.start();
                } else if (chapter.module.startChapter) {
                    await chapter.module.startChapter();
                } else if (chapter.module.loadChapter) {
                    await chapter.module.loadChapter();
                } else {
                    throw new Error('Chapter module has no start/load method');
                }
            } else {
                throw new Error('Chapter module not found');
            }

            return true;
        } catch (error) {
            console.error(`Failed to load Chapter ${chapterNumber}:`, error);
            
            // Show error message
            if (window.dialogueSystem) {
                window.dialogueSystem.showDialogue({
                    speaker: 'Sistema',
                    text: `Erro ao carregar Capítulo ${chapterNumber}. Verifique o console para mais detalhes.`,
                    choices: [{
                        text: 'Voltar ao Menu',
                        type: 'neutral'
                    }]
                });
            }
            
            return false;
        }
    }

    applyChapterSettings(chapter) {
        // Apply chapter-specific visual themes, music, etc.
        const gameScreen = document.getElementById('game-screen');
        
        // Remove previous chapter classes
        gameScreen.classList.remove('chapter-1', 'chapter-2', 'chapter-3', 'chapter-4', 'chapter-5', 'chapter-6');
        
        // Add current chapter class
        gameScreen.classList.add(`chapter-${this.currentChapter}`);
    }

    async startScene(sceneNumber) {
        console.log(`Starting Chapter ${this.currentChapter}, Scene ${sceneNumber}`);
        
        window.gameState.currentScene = sceneNumber;
        
        // For now, show placeholder content
        this.showPlaceholderScene(sceneNumber);
        
        // Hide loading screen and show game
        window.menuSystem?.showGameScreen();
    }

    showPlaceholderScene(sceneNumber) {
        // This is a placeholder until actual chapter content is implemented
        const sceneData = this.getPlaceholderSceneData(sceneNumber);
        
        // Set background
        const background = document.getElementById('background');
        background.style.backgroundImage = `url(${sceneData.background})`;
        
        // Show initial dialogue
        if (sceneData.dialogue) {
            setTimeout(() => {
                window.dialogueSystem.showDialogue(sceneData.dialogue);
            }, 1000);
        }
    }

    getPlaceholderSceneData(sceneNumber) {
        const placeholderScenes = {
            1: {
                background: 'assets/images/backgrounds/noxhaven_street.jpg',
                dialogue: {
                    speaker: '',
                    text: 'As ruas de Noxhaven estão desertas. O ar está pesado com o cheiro de metal e medo. Evelly caminha pelas sombras, tentando esquecer o que aconteceu no teatro.',
                    choices: [
                        {
                            text: 'Investigar os sons estranhos vindos do beco',
                            type: 'control',
                            karma: 5,
                            significant: true
                        },
                        {
                            text: 'Confrontar diretamente qualquer ameaça',
                            type: 'rage',
                            karma: -10,
                            significant: true
                        },
                        {
                            text: 'Tentar encontrar um lugar seguro para se esconder',
                            type: 'redemption',
                            karma: 0,
                            significant: false
                        }
                    ]
                }
            }
        };

        return placeholderScenes[sceneNumber] || {
            background: 'assets/images/backgrounds/default.jpg',
            dialogue: {
                speaker: '',
                text: `Esta é a cena ${sceneNumber} do capítulo ${this.currentChapter}. O conteúdo será implementado em breve.`,
                choices: [{
                    text: 'Continuar',
                    type: 'neutral'
                }]
            }
        };
    }

    // Combat System
    firePrimaryWeapon() {
        if (!this.isInCombat) return;

        if (window.gameState.useAmmo(1)) {
            window.audioManager?.playSound('gunshot');
            this.processWeaponHit();
        } else {
            window.audioManager?.playSound('empty_click');
            this.showMessage('Sem munição!');
        }
    }

    processWeaponHit() {
        // Combat logic will be implemented here
        console.log('Weapon fired!');
    }

    enterCombatMode() {
        this.isInCombat = true;
        document.body.classList.add('combat-mode');
        
        // Show crosshair cursor
        document.body.style.cursor = 'crosshair';
        
        // Play tension music
        window.audioManager?.playMusic('shadow_encounter', false);
        
        console.log('Combat mode activated');
    }

    exitCombatMode() {
        this.isInCombat = false;
        document.body.classList.remove('combat-mode');
        document.body.style.cursor = 'default';
        
        console.log('Combat mode deactivated');
    }

    // Puzzle System
    startPuzzle(puzzleData) {
        this.puzzleSystem.currentPuzzle = puzzleData;
        console.log('Puzzle started:', puzzleData.name);
        
        // Puzzle implementation will go here
    }

    solvePuzzle(solution) {
        if (!this.puzzleSystem.currentPuzzle) return false;
        
        const isCorrect = this.checkPuzzleSolution(solution);
        
        if (isCorrect) {
            this.puzzleSystem.solvedPuzzles.push(this.puzzleSystem.currentPuzzle.id);
            window.gameState.adjustKarma(5, 'Puzzle resolvido');
            this.showMessage('Puzzle resolvido!');
        } else {
            this.puzzleSystem.failedAttempts++;
            window.gameState.flags.failedAttempts++;
            window.gameState.adjustKarma(-2, 'Falha no puzzle');
            this.showMessage('Solução incorreta...');
        }
        
        return isCorrect;
    }

    checkPuzzleSolution(solution) {
        // Puzzle solution checking logic
        return solution === this.puzzleSystem.currentPuzzle.solution;
    }

    // Utility Methods
    showMessage(text, duration = 3000) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'game-message';
        messageDiv.textContent = text;
        
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: #ff6666;
            padding: 1rem 2rem;
            border: 2px solid #666;
            font-family: 'Orbitron', monospace;
            font-size: 1.1rem;
            z-index: 10000;
            animation: messageShow 0.3s ease;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'messageHide 0.3s ease forwards';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, duration);
    }

    triggerHorrorEvent(eventType, intensity = 'medium') {
        switch(eventType) {
            case 'jumpscare':
                window.audioManager?.playJumpscare(intensity);
                break;
            case 'shadow_encounter':
                this.shadowEncounter(intensity);
                break;
            case 'trauma_flashback':
                this.traumaFlashback();
                break;
        }
        
        window.gameState.flags.fearLevel += 1;
    }

    shadowEncounter(intensity) {
        window.gameState.flags.shadowEncounters++;
        
        // Start combat mode
        this.enterCombatMode();
        
        // Show shadow dialogue
        window.dialogueSystem?.showDialogue({
            speaker: 'Sombra',
            text: 'Você não pode fugir de mim, Evelly... Eu sou tudo que você teme...',
            effects: [
                { type: 'shake' },
                { type: 'glitch', duration: 2000 }
            ]
        });
    }

    traumaFlashback() {
        // Trigger flashback sequence
        console.log('Trauma flashback triggered');
        
        window.audioManager?.playMusic('trauma_flashback');
        window.gameState.flags.traumaFlashbacks.push({
            chapter: this.currentChapter,
            scene: window.gameState.currentScene,
            timestamp: Date.now()
        });
    }

    // Debug methods
    debugTeleportToChapter(chapter, scene = 1) {
        this.loadChapter(chapter);
        window.gameState.currentScene = scene;
        console.log(`Debug: Teleported to Chapter ${chapter}, Scene ${scene}`);
    }

    debugTriggerEvent(eventName) {
        console.log(`Debug: Triggering ${eventName}`);
        
        switch(eventName) {
            case 'jumpscare':
                this.triggerHorrorEvent('jumpscare', 'extreme');
                break;
            case 'combat':
                this.enterCombatMode();
                break;
            case 'shadow':
                this.shadowEncounter('high');
                break;
        }
    }

}

// Additional message animations CSS
const messageCSS = `
@keyframes messageShow {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.8);
    }
    100% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}

@keyframes messageHide {
    0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
    100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.8);
    }
}
`;

const messageStyle = document.createElement('style');
messageStyle.textContent = messageCSS;
document.head.appendChild(messageStyle);

// Initialize game controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.gameController = new GameController();
});

// Global debug access
window.debug = {
    teleport: (chapter, scene) => window.gameController?.debugTeleportToChapter(chapter, scene),
    trigger: (event) => window.gameController?.debugTriggerEvent(event),
    karma: (value) => window.gameState?.debugSetKarma(value),
    save: () => window.saveSystem?.saveGame('debug_save'),
    load: () => window.saveSystem?.loadGame('debug_save.json'),
    chapter2: () => window.gameController?.loadChapter(2)
};
