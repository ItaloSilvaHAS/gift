class MenuSystem {
    constructor() {
        this.currentScreen = 'main-menu';
        this.bindEvents();
        this.initializeMenu();
    }

    bindEvents() {
        // Main menu buttons
        document.getElementById('new-game-btn')?.addEventListener('click', () => this.startNewGame());
        document.getElementById('load-game-btn')?.addEventListener('click', () => this.showLoadMenu());
        document.getElementById('options-btn')?.addEventListener('click', () => this.showOptionsMenu());
        document.getElementById('exit-btn')?.addEventListener('click', () => this.exitGame());

        // Load menu
        document.getElementById('back-to-menu')?.addEventListener('click', () => this.showMainMenu());
        
        // Chapter selector buttons
        document.querySelectorAll('.chapter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const chapterNumber = parseInt(e.currentTarget.dataset.chapter);
                this.startChapter(chapterNumber);
            });
        });

        // Options menu
        document.getElementById('options-back')?.addEventListener('click', () => this.showMainMenu());
        document.getElementById('master-volume')?.addEventListener('input', (e) => this.updateMasterVolume(e.target.value));
        document.getElementById('music-volume')?.addEventListener('input', (e) => this.updateMusicVolume(e.target.value));
        document.getElementById('sfx-volume')?.addEventListener('input', (e) => this.updateSfxVolume(e.target.value));
        document.getElementById('jumpscare-intensity')?.addEventListener('change', (e) => this.updateJumpscareIntensity(e.target.value));

        // Game menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        menuToggle?.addEventListener('click', () => {
            if (this.currentScreen === 'game-screen') {
                this.showPauseMenu();
            } else {
                this.showMainMenu();
            }
        });

        // Quick save button
        const quickSaveBtn = document.getElementById('quick-save-btn');
        quickSaveBtn?.addEventListener('click', () => {
            window.saveSystem?.quickSave();
        });

        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'Escape':
                    this.handleEscapeKey();
                    break;
                case 'F11':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
            }
        });

        // Menu button hover effects
        document.querySelectorAll('.menu-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                window.audioManager?.playSound('menu_hover');
            });

            btn.addEventListener('click', () => {
                window.audioManager?.playSound('menu_click');
            });
        });
    }

    initializeMenu() {
        // Ensure macabre music is playing
        window.audioManager?.ensureMacabreMusicPlaying();

        // Load settings
        this.loadSettings();

        // Show main menu
        this.showMainMenu();

        // Add atmospheric effects
        this.startMenuEffects();
    }

    startMenuEffects() {
        // Random glitch effects on title
        setInterval(() => {
            const title = document.querySelector('.game-title');
            if (title && Math.random() < 0.1) {
                title.style.animation = 'none';
                setTimeout(() => {
                    title.style.animation = '';
                }, 100);
            }
        }, 5000);

        // Random blood drops
        setInterval(() => {
            if (this.currentScreen === 'main-menu' && Math.random() < 0.3) {
                this.createBloodDrop();
            }
        }, 3000);

        // Occasional whisper sounds
        setInterval(() => {
            if (this.currentScreen === 'main-menu' && Math.random() < 0.05) {
                window.audioManager?.playSound('whisper');
            }
        }, 10000);
    }

    createBloodDrop() {
        const drop = document.createElement('div');
        drop.style.cssText = `
            position: fixed;
            top: -10px;
            left: ${Math.random() * 100}vw;
            width: 3px;
            height: 10px;
            background: linear-gradient(to bottom, transparent, #aa0000);
            z-index: 1000;
            pointer-events: none;
            animation: bloodFall 3s linear forwards;
        `;

        document.body.appendChild(drop);

        setTimeout(() => {
            document.body.removeChild(drop);
        }, 3000);
    }

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
        }
    }

    showMainMenu() {
        this.showScreen('main-menu');
        window.audioManager?.playMusic('menu_theme');
    }

    async showLoadMenu() {
        this.showScreen('load-menu');

        // Populate save slots
        try {
            if (window.saveSystem) {
                await window.saveSystem.populateSaveSlots();
            } else {
                console.error('Save system not available');
                this.showNotification('Sistema de salvamento não disponível', 2000);
            }
        } catch (error) {
            console.error('Error loading save slots:', error);
            this.showNotification('Erro ao carregar saves', 2000);
        }
    }

    showOptionsMenu() {
        this.showScreen('options-menu');
        this.updateOptionsDisplay();
    }

    showGameScreen() {
        this.showScreen('game-screen');
        window.audioManager?.playMusic('gameplay_music', true);
    }

    startNewGame() {
        // Reset game state
        window.gameState = new GameState();

        // Show loading screen
        this.showScreen('loading-screen');

        // Load Chapter 1
        setTimeout(() => {
            this.showGameScreen();
            this.startChapter1();
        }, 2000);
    }

    startChapter1() {
        console.log('Starting Chapter 1...');

        // Load Chapter 1 properly
        if (window.gameController) {
            window.gameController.loadChapter(1);
        } else {
            console.error('GameController not found!');
        }
    }

    startChapter(chapterNumber) {
        console.log(`Starting Chapter ${chapterNumber}...`);

        // Reset game state for fresh chapter start
        window.gameState = new GameState();
        window.gameState.currentChapter = chapterNumber;
        
        // Set appropriate karma/flags based on chapter
        if (chapterNumber >= 2) {
            window.gameState.karma = 10; // Some karma for later chapters
        }
        if (chapterNumber >= 3) {
            window.gameState.flags.evellyTrustLevel = 2;
            window.gameState.flags.ezraRivalry = 1;
        }

        // Show loading screen
        this.showScreen('loading-screen');

        // Load the chapter after a brief delay
        setTimeout(() => {
            this.showGameScreen();
            if (window.gameController) {
                window.gameController.loadChapter(chapterNumber);
            } else {
                console.error('GameController not found!');
            }
        }, 1500);
    }

    exitGame() {
        if (confirm('Tem certeza que deseja sair do jogo?')) {
            // In web environment, just redirect or close tab
            window.location.reload();
        }
    }

    showPauseMenu() {
        // Criar menu de pausa se não existir
        let pauseMenu = document.getElementById('pause-menu');
        if (!pauseMenu) {
            pauseMenu = document.createElement('div');
            pauseMenu.id = 'pause-menu';
            pauseMenu.className = 'screen';
            pauseMenu.innerHTML = `
                <div class="menu-container">
                    <h2>Jogo Pausado</h2>
                    <div class="menu-buttons">
                        <button id="resume-game-btn" class="menu-btn">Continuar</button>
                        <button id="save-game-btn" class="menu-btn">Salvar Jogo</button>
                        <button id="pause-options-btn" class="menu-btn">Opções</button>
                        <button id="pause-main-menu-btn" class="menu-btn">Menu Principal</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(pauseMenu);
            
            // Bind eventos do pause menu
            document.getElementById('resume-game-btn')?.addEventListener('click', () => {
                this.showGameScreen();
            });
            
            document.getElementById('save-game-btn')?.addEventListener('click', () => {
                window.saveSystem?.saveGame('manual_save');
                this.showNotification('Jogo salvo!');
            });
            
            document.getElementById('pause-options-btn')?.addEventListener('click', () => {
                this.showOptionsMenu();
            });
            
            document.getElementById('pause-main-menu-btn')?.addEventListener('click', () => {
                if (confirm('Tem certeza que deseja voltar ao menu principal? Progresso não salvo será perdido.')) {
                    this.showMainMenu();
                }
            });
        }
        
        this.showScreen('pause-menu');
    }

    handleEscapeKey() {
        switch(this.currentScreen) {
            case 'game-screen':
                this.showPauseMenu();
                break;
            case 'pause-menu':
                this.showGameScreen();
                break;
            case 'load-menu':
            case 'options-menu':
                this.showMainMenu();
                break;
            case 'main-menu':
                // Do nothing or show exit confirmation
                break;
        }
    }

    toggleGameMenu() {
        if (this.currentScreen === 'game-screen') {
            this.showMainMenu();
        } else if (this.currentScreen === 'main-menu') {
            this.showGameScreen();
        }
    }

    toggleFullscreen() {
        // Use web fullscreen API instead of Electron
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    }

    // Settings management
    updateMasterVolume(value) {
        window.gameState.settings.masterVolume = parseInt(value);
        window.audioManager?.setMasterVolume(value);
        this.saveSettings();
    }

    updateMusicVolume(value) {
        window.gameState.settings.musicVolume = parseInt(value);
        window.audioManager?.setMusicVolume(value);
        this.saveSettings();
    }

    updateSfxVolume(value) {
        window.gameState.settings.sfxVolume = parseInt(value);
        window.audioManager?.setSfxVolume(value);
        this.saveSettings();
    }

    updateJumpscareIntensity(value) {
        window.gameState.settings.jumpscareIntensity = value;
        this.saveSettings();
    }

    updateOptionsDisplay() {
        const settings = window.gameState.settings;

        document.getElementById('master-volume').value = settings.masterVolume;
        document.getElementById('music-volume').value = settings.musicVolume;
        document.getElementById('sfx-volume').value = settings.sfxVolume;
        document.getElementById('jumpscare-intensity').value = settings.jumpscareIntensity;
    }

    saveSettings() {
        localStorage.setItem('evelly-adventure-settings', JSON.stringify(window.gameState.settings));
    }

    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('evelly-adventure-settings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                Object.assign(window.gameState.settings, settings);

                // Apply audio settings
                window.audioManager?.setMasterVolume(settings.masterVolume);
                window.audioManager?.setMusicVolume(settings.musicVolume);
                window.audioManager?.setSfxVolume(settings.sfxVolume);
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    // Utility methods
    showNotification(message, duration = 3000) {
        const notification = document.createElement('div');
        notification.className = 'menu-notification';
        notification.textContent = message;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: #ff6666;
            padding: 1rem 2rem;
            border: 1px solid #666;
            font-family: 'Orbitron', monospace;
            z-index: 10002;
            animation: fadeInOut 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            document.body.removeChild(notification);
        }, duration);
    }
}

// Additional CSS for blood drop animation
const bloodDropCSS = `
@keyframes bloodFall {
    0% {
        transform: translateY(-10px);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    100% {
        transform: translateY(100vh);
        opacity: 0.5;
    }
}
`;

const style = document.createElement('style');
style.textContent = bloodDropCSS;
document.head.appendChild(style);

// Initialize menu system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.menuSystem = new MenuSystem();
});