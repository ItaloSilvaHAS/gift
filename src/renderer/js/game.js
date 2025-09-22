
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
    }

    setupChapterSystem() {
        this.chapters = {
            1: {
                name: 'O Despertar',
                scenes: 10,
                module: null // Will be loaded dynamically
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
                module: null,
                routes: {
                    cathedral: 'Aceitar o Chamado',
                    hospital: 'Rejeitar o Chamado'
                }
            },
            5: {
                name: 'O Confronto Final',
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
            } else if (chapterNumber === 4) {
                // Capítulo 4 tem duas rotas baseadas nas escolhas do jogador
                await this.loadChapter4Route();
                return true;
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
            if (chapter.module && chapter.module.loadChapter) {
                await chapter.module.loadChapter();
            } else {
                throw new Error('Chapter module loadChapter method not found');
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
        gameScreen.classList.remove('chapter-1', 'chapter-2', 'chapter-3', 'chapter-4', 'chapter-5');
        
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

    // ====== MÉTODO PARA CARREGAR ROTAS DO CAPÍTULO 4 ======
    async loadChapter4Route() {
        console.log('Loading Chapter 4 with route selection...');
        
        const chapter = this.chapters[4];
        
        // Determinar qual rota carregar baseado nas escolhas do jogador
        // Se ainda não há escolha feita, apresentar seleção de rota
        let selectedRoute = window.gameState.flags.chapter4Route;
        
        if (!selectedRoute) {
            selectedRoute = await this.presentRouteChoice();
        }
        
        // Aguardar módulos estarem disponíveis
        let attempts = 0;
        while ((!window.Chapter4Rota1 || !window.Chapter4Rota2) && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        // Carregar a rota apropriada
        if (selectedRoute === 'cathedral' && window.Chapter4Rota1) {
            chapter.module = new window.Chapter4Rota1();
            console.log('Chapter 4 Rota 1 (Cathedral) module created successfully');
        } else if (selectedRoute === 'hospital' && window.Chapter4Rota2) {
            chapter.module = new window.Chapter4Rota2();
            console.log('Chapter 4 Rota 2 (Hospital) module created successfully');
        } else {
            throw new Error(`Chapter 4 route module not found: ${selectedRoute}`);
        }
        
        // Set current chapter
        this.currentChapter = 4;
        window.gameState.currentChapter = 4;
        window.gameState.currentScene = 1;
        
        // Apply chapter-specific settings
        this.applyChapterSettings(chapter);
        
        // Hide loading screen and show game
        window.menuSystem?.showGameScreen();
        
        // Start the chapter
        if (chapter.module && chapter.module.start) {
            await chapter.module.start();
        } else {
            throw new Error('Chapter 4 module start method not found');
        }
    }
    
    async presentRouteChoice() {
        return new Promise((resolve) => {
            // Criar interface de escolha de rota
            const routeChoiceDiv = document.createElement('div');
            routeChoiceDiv.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: linear-gradient(135deg, #4B0082, #000);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                font-family: 'Orbitron', monospace;
                color: white;
            `;
            
            routeChoiceDiv.innerHTML = `
                <h1 style="font-size: 3rem; margin-bottom: 2rem; color: #FFD700; text-shadow: 0 0 20px #FFD700;">
                    CAPÍTULO 4
                </h1>
                <h2 style="font-size: 1.8rem; margin-bottom: 1rem; text-align: center;">
                    Fragmentos da Verdade
                </h2>
                <p style="font-size: 1.2rem; margin-bottom: 3rem; text-align: center; max-width: 600px; line-height: 1.6;">
                    A partir daqui, a história se divide em dois caminhos principais. Sua escolha muda completamente a narrativa, inimigos, puzzles e revelações.
                </p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin-bottom: 3rem;">
                    <div class="route-option" data-route="cathedral" 
                         style="background: rgba(139, 0, 139, 0.3); border: 2px solid #8B008B; 
                                border-radius: 15px; padding: 2rem; cursor: pointer; 
                                transition: all 0.3s; text-align: center; min-width: 300px;">
                        <h3 style="color: #FF69B4; font-size: 1.8rem; margin-bottom: 1rem;">🔴 ROTA A</h3>
                        <h4 style="color: #FFD700; font-size: 1.4rem; margin-bottom: 1rem;">Aceitar o Chamado</h4>
                        <p style="font-size: 1rem; line-height: 1.5; margin-bottom: 1rem;">
                            Seguir a direção das vozes e da sombra para uma catedral abandonada.
                        </p>
                        <p style="font-size: 0.9rem; color: #DDA0DD;">
                            Mecânicas: Puzzle dos Ecos, Caixas de Música, Sistema de Palco
                        </p>
                    </div>
                    
                    <div class="route-option" data-route="hospital" 
                         style="background: rgba(0, 100, 0, 0.3); border: 2px solid #006400; 
                                border-radius: 15px; padding: 2rem; cursor: pointer; 
                                transition: all 0.3s; text-align: center; min-width: 300px;">
                        <h3 style="color: #90EE90; font-size: 1.8rem; margin-bottom: 1rem;">🔵 ROTA B</h3>
                        <h4 style="color: #FFD700; font-size: 1.4rem; margin-bottom: 1rem;">Rejeitar o Chamado</h4>
                        <p style="font-size: 1rem; line-height: 1.5; margin-bottom: 1rem;">
                            Ignorar as vozes e fugir da sombra para um hospital abandonado.
                        </p>
                        <p style="font-size: 0.9rem; color: #98FB98;">
                            Mecânicas: Cirurgia do Coração, Registros Médicos, Batimento Cardíaco
                        </p>
                    </div>
                </div>
                
                <p style="color: #FFD700; font-size: 1.1rem; text-align: center; margin-bottom: 1rem;">
                    Escolha sua rota - você não poderá voltar atrás!
                </p>
            `;
            
            document.body.appendChild(routeChoiceDiv);
            
            // Adicionar event listeners
            const routeOptions = routeChoiceDiv.querySelectorAll('.route-option');
            routeOptions.forEach(option => {
                option.addEventListener('click', () => {
                    const route = option.dataset.route;
                    window.gameState.flags.chapter4Route = route;
                    
                    // Feedback visual
                    option.style.transform = 'scale(1.1)';
                    option.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.8)';
                    
                    setTimeout(() => {
                        routeChoiceDiv.remove();
                        resolve(route);
                    }, 1000);
                });
                
                option.addEventListener('mouseenter', () => {
                    option.style.transform = 'scale(1.05)';
                    option.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)';
                });
                
                option.addEventListener('mouseleave', () => {
                    option.style.transform = 'scale(1)';
                    option.style.boxShadow = 'none';
                });
            });
        });
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
