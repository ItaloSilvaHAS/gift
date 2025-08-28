class SaveSystem {
    constructor() {
        this.maxSaveSlots = 10;
        this.autoSaveSlot = 'autosave';
        this.quickSaveSlot = 'quicksave';

        this.bindEvents();
    }

    bindEvents() {
        // Quick save/load hotkeys
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 's':
                        e.preventDefault();
                        this.quickSave();
                        break;
                    case 'l':
                        e.preventDefault();
                        this.quickLoad();
                        break;
                }
            }

            // F5 for quick save, F9 for quick load (classic game shortcuts)
            switch(e.key) {
                case 'F5':
                    e.preventDefault();
                    this.quickSave();
                    break;
                case 'F9':
                    e.preventDefault();
                    this.quickLoad();
                    break;
            }
        });
    }

    async saveGame(slotName = null) {
        const { ipcRenderer } = require('electron');

        try {
            const saveData = this.createSaveData();
            const fileName = slotName || `save_${Date.now()}.json`;

            await ipcRenderer.invoke('save-game', saveData);

            this.showSaveNotification('Jogo salvo com sucesso!');
            console.log(`Game saved to ${fileName}`);

            return fileName;
        } catch (error) {
            console.error('Save failed:', error);
            this.showSaveNotification('Erro ao salvar o jogo!', 'error');
            return null;
        }
    }

    async loadGame(fileName) {
        const { ipcRenderer } = require('electron');

        try {
            const saveData = await ipcRenderer.invoke('load-game', fileName);

            if (saveData && this.validateSaveData(saveData)) {
                window.gameState.loadSaveData(saveData);

                // Reload appropriate chapter/scene
                await this.loadChapterScene(saveData.chapter, saveData.scene);

                this.showSaveNotification('Jogo carregado com sucesso!');
                console.log(`Game loaded from ${fileName}`);

                return true;
            } else {
                throw new Error('Invalid save data');
            }
        } catch (error) {
            console.error('Load failed:', error);
            this.showSaveNotification('Erro ao carregar o jogo!', 'error');
            return false;
        }
    }

    async getSaveList() {
        const { ipcRenderer } = require('electron');

        try {
            const saves = await ipcRenderer.invoke('get-saves');
            const saveDetails = [];

            for (const fileName of saves) {
                try {
                    const saveData = await ipcRenderer.invoke('load-game', fileName);
                    if (this.validateSaveData(saveData)) {
                        saveDetails.push({
                            fileName,
                            ...this.extractSaveInfo(saveData)
                        });
                    }
                } catch (error) {
                    console.warn(`Failed to load save info for ${fileName}:`, error);
                }
            }

            // Sort by timestamp (newest first)
            return saveDetails.sort((a, b) => b.timestamp - a.timestamp);
        } catch (error) {
            console.error('Failed to get save list:', error);
            return [];
        }
    }

    createSaveData() {
        const currentDate = new Date();

        return {
            version: '1.0.0',
            timestamp: Date.now(),
            dateString: currentDate.toLocaleString('pt-BR'),

            // Game progress
            chapter: window.gameState.currentChapter,
            scene: window.gameState.currentScene,

            // Player state
            karma: window.gameState.karma,
            choices: [...window.gameState.playerChoices],
            inventory: {...window.gameState.inventory},
            flags: {...window.gameState.flags},

            // Route information
            currentRoute: window.gameState.getCurrentRoute(),
            routeChoices: {
                rage: window.gameState.flags.rageChoices,
                control: window.gameState.flags.controlChoices,
                redemption: window.gameState.flags.redemptionChoices
            },

            // Character states
            charactersAlive: {...window.gameState.flags.charactersAlive},
            relationships: {
                ezraRivalry: window.gameState.flags.ezraRivalry,
                evellyTrustLevel: window.gameState.flags.evellyTrustLevel
            },

            // Horror progression
            terrorLevel: {
                fearLevel: window.gameState.flags.fearLevel,
                jumpscareCount: window.gameState.flags.jumpscareCount,
                shadowEncounters: window.gameState.flags.shadowEncounters
            },

            // Settings
            settings: {...window.gameState.settings},

            // Metadata for save preview
            metadata: {
                location: this.getCurrentLocationName(),
                playTime: this.calculatePlayTime(),
                difficulty: this.getCurrentDifficulty(),
                completionPercentage: this.calculateCompletionPercentage()
            }
        };
    }

    validateSaveData(saveData) {
        return (
            saveData &&
            saveData.version === '1.0.0' &&
            typeof saveData.timestamp === 'number' &&
            typeof saveData.chapter === 'number' &&
            typeof saveData.scene === 'number' &&
            typeof saveData.karma === 'number' &&
            Array.isArray(saveData.choices) &&
            saveData.inventory &&
            saveData.flags
        );
    }

    extractSaveInfo(saveData) {
        return {
            timestamp: saveData.timestamp,
            dateString: saveData.dateString,
            chapter: saveData.chapter,
            scene: saveData.scene,
            karma: saveData.karma,
            currentRoute: saveData.currentRoute,
            location: saveData.metadata?.location || 'Desconhecido',
            playTime: saveData.metadata?.playTime || '0:00',
            difficulty: saveData.metadata?.difficulty || 'Normal',
            completionPercentage: saveData.metadata?.completionPercentage || 0
        };
    }

    async quickSave() {
        await this.saveGame(this.quickSaveSlot);
    }

    async quickLoad() {
        const success = await this.loadGame(`${this.quickSaveSlot}.json`);
        if (!success) {
            this.showSaveNotification('Nenhum quick save encontrado!', 'warning');
        }
    }

    async autoSave() {
        // Only auto-save at significant points
        if (window.gameState.autoSaveEnabled) {
            await this.saveGame(this.autoSaveSlot);
        }
    }

    async loadChapterScene(chapter, scene) {
        // This will be implemented when chapter system is ready
        console.log(`Loading Chapter ${chapter}, Scene ${scene}`);

        // For now, just update the UI
        window.gameState.currentChapter = chapter;
        window.gameState.currentScene = scene;

        // Show loading screen while transitioning
        this.showLoadingScreen(true);

        setTimeout(() => {
            this.showLoadingScreen(false);
        }, 2000);
    }

    showSaveNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `save-notification ${type}`;
        notification.textContent = message;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ff3333' : type === 'warning' ? '#ffaa33' : '#33ff33'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            font-family: 'Orbitron', monospace;
            font-weight: bold;
            z-index: 10001;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    showLoadingScreen(show) {
        const loadingScreen = document.getElementById('loading-screen');
        if (show) {
            loadingScreen.classList.add('active');
        } else {
            loadingScreen.classList.remove('active');
        }
    }

    // Helper methods for save metadata
    getCurrentLocationName() {
        const locationMap = {
            1: 'Centro de Noxhaven',
            2: 'Laboratório HollowMind',
            3: 'Névoa Vermelha',
            4: 'Ruínas do Teatro',
            5: 'Muralhas da Cidade'
        };

        return locationMap[window.gameState.currentChapter] || 'Local Desconhecido';
    }

    calculatePlayTime() {
        // This would track actual play time in a real implementation
        const minutes = Math.floor(window.gameState.playerChoices.length * 2.5);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        return hours > 0 ? 
            `${hours}:${remainingMinutes.toString().padStart(2, '0')}` : 
            `0:${remainingMinutes.toString().padStart(2, '0')}`;
    }

    getCurrentDifficulty() {
        const failedAttempts = window.gameState.flags.failedAttempts;
        const fearLevel = window.gameState.flags.fearLevel;

        if (fearLevel > 8 && failedAttempts > 5) return 'Pesadelo';
        if (fearLevel > 5 && failedAttempts > 2) return 'Difícil';
        if (fearLevel > 3) return 'Normal';
        return 'Fácil';
    }

    calculateCompletionPercentage() {
        const totalChapters = 5; // Assuming 5 chapters total
        const currentProgress = (window.gameState.currentChapter - 1) * 20;
        const sceneProgress = (window.gameState.currentScene - 1) * 5;

        return Math.min(100, currentProgress + sceneProgress);
    }

    // Save slot management for UI
    async populateSaveSlots() {
        const savesList = document.getElementById('saves-list');
        if (!savesList) {
            console.warn('saves-list element not found');
            return;
        }

        try {
            const saves = await this.getSaveFiles();
            savesList.innerHTML = '';

            if (saves.length === 0) {
                savesList.innerHTML = `
                    <div class="no-saves">
                        <p>Nenhum save encontrado</p>
                        <button onclick="window.menuSystem.showMainMenu()" class="menu-btn">Voltar</button>
                    </div>
                `;
                return;
            }

            saves.forEach((save, index) => {
                const saveItem = document.createElement('div');
                saveItem.className = 'save-item';
                saveItem.innerHTML = `
                    <div class="save-info">
                        <h3>${save.name}</h3>
                        <p>Capítulo ${save.data.chapter}, Cena ${save.data.scene}</p>
                        <p>Karma: ${save.data.karma}</p>
                        <small>${new Date(save.data.timestamp).toLocaleString()}</small>
                    </div>
                    <div class="save-actions">
                        <button onclick="window.saveSystem.loadGameFromMenu('${save.filename}')" class="load-btn">Carregar</button>
                        <button onclick="window.saveSystem.deleteSave('${save.filename}')" class="delete-btn">Deletar</button>
                    </div>
                `;
                savesList.appendChild(saveItem);
            });

            // Adicionar botão voltar
            const backButton = document.createElement('button');
            backButton.textContent = 'Voltar ao Menu';
            backButton.className = 'menu-btn';
            backButton.onclick = () => window.menuSystem.showMainMenu();
            savesList.appendChild(backButton);

        } catch (error) {
            console.error('Failed to populate save slots:', error);
            savesList.innerHTML = `
                <div class="error">
                    <p>Erro ao carregar saves</p>
                    <button onclick="window.menuSystem.showMainMenu()" class="menu-btn">Voltar</button>
                </div>
            `;
        }
    }

    async loadGameFromMenu(filename) {
        try {
            const success = await this.loadGame(filename);
            if (success) {
                window.menuSystem.showNotification('Jogo carregado com sucesso!');
                // Carregar o capítulo correto
                setTimeout(() => {
                    window.gameController.loadChapter(window.gameState.currentChapter);
                }, 1000);
            } else {
                window.menuSystem.showNotification('Erro ao carregar o jogo');
            }
        } catch (error) {
            console.error('Error loading game from menu:', error);
            window.menuSystem.showNotification('Erro ao carregar o jogo');
        }
    }

    hideSaveMenu() {
        const loadMenu = document.getElementById('load-menu');
        const mainMenu = document.getElementById('main-menu');

        loadMenu.classList.remove('active');
        mainMenu.classList.add('active');
    }
}

// Global save system instance
window.saveSystem = new SaveSystem();