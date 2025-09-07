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
        try {
            const saveData = this.createSaveData();
            const fileName = slotName || `save_${Date.now()}`;
            
            // Save to localStorage instead of server
            localStorage.setItem(`evelly_save_${fileName}`, JSON.stringify(saveData));
            
            this.showSaveNotification('Jogo salvo!');
            console.log(`Game saved to ${fileName}`);
            return fileName;
        } catch (error) {
            console.error('Save failed:', error);
            this.showSaveNotification('Erro ao salvar!', 'error');
            return null;
        }
    }

    async loadGame(fileName) {
        try {
            const saveDataString = localStorage.getItem(`evelly_save_${fileName}`);
            
            if (!saveDataString) {
                throw new Error('Save file not found');
            }
            
            const saveData = JSON.parse(saveDataString);
            
            if (this.validateSaveData(saveData)) {
                window.gameState.loadSaveData(saveData);

                // Reload appropriate chapter/scene
                await this.loadChapterScene(saveData.chapter, saveData.scene);

                this.showSaveNotification('Jogo carregado!');
                console.log(`Game loaded from ${fileName}`);

                return true;
            } else {
                throw new Error('Invalid save data');
            }
        } catch (error) {
            console.error('Load failed:', error);
            this.showSaveNotification('Erro ao carregar!', 'error');
            return false;
        }
    }

    async getSaveList() {
        try {
            const saveDetails = [];
            
            // Get all saves from localStorage
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('evelly_save_')) {
                    try {
                        const fileName = key.replace('evelly_save_', '');
                        const saveDataString = localStorage.getItem(key);
                        const saveData = JSON.parse(saveDataString);
                        
                        if (this.validateSaveData(saveData)) {
                            saveDetails.push({
                                fileName: fileName,
                                ...this.extractSaveInfo(saveData)
                            });
                        }
                    } catch (error) {
                        console.warn(`Failed to load save info for ${key}:`, error);
                    }
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

    quickSave() {
        this.saveGame(this.quickSaveSlot);
        this.showSaveNotification('Quick Save!');
    }

    async quickLoad() {
        const success = await this.loadGame(this.quickSaveSlot);
        if (!success) {
            this.showSaveNotification('Nenhum quick save encontrado!', 'warning');
        }
    }

    autoSave() {
        // Only auto-save at significant points
        if (window.gameState.autoSaveEnabled) {
            this.saveGame(this.autoSaveSlot);
        }
    }

    async loadChapterScene(chapter, scene) {
        console.log(`Loading Chapter ${chapter}, Scene ${scene}`);

        // Update game state
        window.gameState.currentChapter = chapter;
        window.gameState.currentScene = scene;

        // Use game controller to load chapter
        if (window.gameController && window.gameController.loadChapter) {
            await window.gameController.loadChapter(chapter);
        } else {
            console.error('GameController not available for chapter loading');
        }
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
            const saves = await this.getSaveList();
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
                        <h3>Save ${index + 1}</h3>
                        <p>Capítulo ${save.chapter}, Cena ${save.scene}</p>
                        <p>Karma: ${save.karma}</p>
                        <small>${save.dateString || new Date(save.timestamp).toLocaleString('pt-BR')}</small>
                    </div>
                    <div class="save-actions">
                        <button onclick="window.saveSystem.loadGameFromMenu('${save.fileName}')" class="load-btn">Carregar</button>
                        <button onclick="window.saveSystem.deleteSave('${save.fileName}')" class="delete-btn">Deletar</button>
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

    deleteSave(fileName) {
        try {
            localStorage.removeItem(`evelly_save_${fileName}`);
            this.showSaveNotification('Save deletado com sucesso!');
            
            // Refresh the save list
            this.populateSaveSlots();
        } catch (error) {
            console.error('Error deleting save:', error);
            this.showSaveNotification('Erro ao deletar save!', 'error');
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