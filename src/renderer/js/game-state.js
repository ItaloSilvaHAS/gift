
class GameState {
    constructor() {
        this.currentChapter = 1;
        this.currentScene = 1;
        this.karma = 0; // Range: -100 to +100
        this.playerChoices = [];
        this.inventory = {
            ammo: 12,
            items: []
        };
        this.flags = {
            // Story flags
            evellyTrustLevel: 0,
            ezraRivalry: 0,
            shadowEncounters: 0,
            
            // Route tracking
            rageChoices: 0,
            controlChoices: 0,
            redemptionChoices: 0,
            
            // Character states
            charactersAlive: {
                evelly: true,
                ezra: true,
                lysandra: true
            },
            
            // Puzzle states
            solvedPuzzles: [],
            failedAttempts: 0,
            
            // Terror system
            jumpscareCount: 0,
            fearLevel: 0,
            traumaFlashbacks: []
        };
        
        this.settings = {
            masterVolume: 75,
            musicVolume: 60,
            sfxVolume: 80,
            jumpscareIntensity: 'medium'
        };
        
        this.saveSlots = [];
        this.autoSaveEnabled = true;
        
        this.initializeRouteTracking();
    }

    initializeRouteTracking() {
        this.routes = {
            rage: {
                threshold: 5,
                effects: {
                    dialogueStyle: 'aggressive',
                    shadowForm: 'violent',
                    cityResponse: 'chaotic'
                }
            },
            control: {
                threshold: 5,
                effects: {
                    dialogueStyle: 'calculated',
                    shadowForm: 'methodical',
                    cityResponse: 'systematic'
                }
            },
            redemption: {
                threshold: 5,
                effects: {
                    dialogueStyle: 'compassionate',
                    shadowForm: 'sorrowful',
                    cityResponse: 'healing'
                }
            }
        };
    }

    // Karma system
    adjustKarma(amount, reason) {
        const oldKarma = this.karma;
        this.karma = Math.max(-100, Math.min(100, this.karma + amount));
        
        console.log(`Karma adjusted: ${oldKarma} -> ${this.karma} (${reason})`);
        
        // Update UI
        this.updateKarmaDisplay();
        
        // Trigger route checks
        this.checkRouteProgression();
        
        return this.karma;
    }

    updateKarmaDisplay() {
        const karmaValue = document.getElementById('karma-value');
        const karmaFill = document.getElementById('karma-fill');
        
        if (karmaValue && karmaFill) {
            karmaValue.textContent = this.karma;
            
            // Convert karma (-100 to +100) to percentage (0 to 100)
            const percentage = ((this.karma + 100) / 2);
            karmaFill.style.width = `${percentage}%`;
            
            // Change color based on karma
            if (this.karma < -50) {
                karmaFill.style.background = '#ff0000'; // Pure rage
            } else if (this.karma < -20) {
                karmaFill.style.background = 'linear-gradient(to right, #ff0000, #ff6600)'; // Anger
            } else if (this.karma < 20) {
                karmaFill.style.background = 'linear-gradient(to right, #ffff00, #66ff00)'; // Neutral
            } else if (this.karma < 50) {
                karmaFill.style.background = 'linear-gradient(to right, #66ff00, #00ff00)'; // Good
            } else {
                karmaFill.style.background = '#00ff66'; // Pure redemption
            }
        }
    }

    // Choice tracking
    addChoice(choiceData) {
        this.playerChoices.push({
            chapter: this.currentChapter,
            scene: this.currentScene,
            timestamp: Date.now(),
            ...choiceData
        });
        
        // Update route counters
        if (choiceData.type) {
            this.flags[choiceData.type + 'Choices']++;
        }
        
        // Auto-save after significant choices
        if (choiceData.significant) {
            this.autoSave();
        }
        
        console.log('Choice recorded:', choiceData);
    }

    // Route checking
    checkRouteProgression() {
        const currentRoute = this.getCurrentRoute();
        
        // Apply route effects
        if (currentRoute) {
            this.applyRouteEffects(currentRoute);
        }
    }

    getCurrentRoute() {
        const rageCount = this.flags.rageChoices;
        const controlCount = this.flags.controlChoices;
        const redemptionCount = this.flags.redemptionChoices;
        
        if (rageCount >= this.routes.rage.threshold && rageCount > controlCount && rageCount > redemptionCount) {
            return 'rage';
        } else if (controlCount >= this.routes.control.threshold && controlCount > rageCount && controlCount > redemptionCount) {
            return 'control';
        } else if (redemptionCount >= this.routes.redemption.threshold && redemptionCount > rageCount && redemptionCount > controlCount) {
            return 'redemption';
        }
        
        return null; // Neutral/mixed route
    }

    applyRouteEffects(routeType) {
        const effects = this.routes[routeType].effects;
        
        // Store current route for dialogue system
        this.currentRoute = routeType;
        
        // Apply visual effects based on route
        this.applyVisualRouteEffects(routeType);
        
        console.log(`Route applied: ${routeType}`, effects);
    }

    applyVisualRouteEffects(routeType) {
        const gameScreen = document.getElementById('game-screen');
        
        // Remove previous route classes
        gameScreen.classList.remove('route-rage', 'route-control', 'route-redemption');
        
        // Add current route class
        gameScreen.classList.add(`route-${routeType}`);
    }

    // Save/Load system
    createSaveData() {
        return {
            version: '1.0.0',
            timestamp: Date.now(),
            chapter: this.currentChapter,
            scene: this.currentScene,
            karma: this.karma,
            choices: this.playerChoices,
            inventory: {...this.inventory},
            flags: {...this.flags},
            settings: {...this.settings},
            screenshot: null // Could capture scene for preview
        };
    }

    loadSaveData(saveData) {
        if (!saveData || saveData.version !== '1.0.0') {
            console.error('Invalid save data');
            return false;
        }
        
        this.currentChapter = saveData.chapter;
        this.currentScene = saveData.scene;
        this.karma = saveData.karma;
        this.playerChoices = saveData.choices;
        this.inventory = saveData.inventory;
        this.flags = saveData.flags;
        this.settings = saveData.settings;
        
        // Update UI
        this.updateKarmaDisplay();
        this.updateInventoryDisplay();
        
        console.log('Save data loaded successfully');
        return true;
    }

    async autoSave() {
        if (!this.autoSaveEnabled) return;
        
        try {
            await window.saveSystem?.autoSave();
            console.log('Auto-save completed');
        } catch (error) {
            console.error('Auto-save failed:', error);
        }
    }

    // Inventory management
    updateInventoryDisplay() {
        const ammoCount = document.getElementById('ammo-count');
        if (ammoCount) {
            ammoCount.textContent = this.inventory.ammo;
        }
    }

    useAmmo(amount = 1) {
        if (this.inventory.ammo >= amount) {
            this.inventory.ammo -= amount;
            this.updateInventoryDisplay();
            return true;
        }
        return false;
    }

    addAmmo(amount) {
        this.inventory.ammo += amount;
        this.updateInventoryDisplay();
    }

    // Chapter progression
    progressToNextScene() {
        this.currentScene++;
        this.autoSave();
    }

    progressToNextChapter() {
        this.currentChapter++;
        this.currentScene = 1;
        this.autoSave();
        
        console.log(`Advanced to Chapter ${this.currentChapter}`);
    }

    // Ending calculation
    calculateEnding() {
        const route = this.getCurrentRoute();
        const karma = this.karma;
        const survivedCharacters = Object.values(this.flags.charactersAlive).filter(alive => alive).length;
        const traumaLevel = this.flags.fearLevel;
        
        // Complex ending calculation based on multiple factors
        if (route === 'rage' && karma < -50) {
            return survivedCharacters < 2 ? 'destruction' : 'tyranny';
        } else if (route === 'control' && karma > -20 && karma < 20) {
            return traumaLevel > 8 ? 'cold_victory' : 'calculated_survival';
        } else if (route === 'redemption' && karma > 50) {
            return survivedCharacters === 3 ? 'true_redemption' : 'bittersweet_redemption';
        }
        
        // Default/mixed endings
        return karma > 0 ? 'survival' : 'hollow_victory';
    }

    // Debug functions
    resetToChapter(chapter) {
        this.currentChapter = chapter;
        this.currentScene = 1;
        console.log(`Reset to Chapter ${chapter}`);
    }

    debugSetKarma(value) {
        this.karma = Math.max(-100, Math.min(100, value));
        this.updateKarmaDisplay();
        console.log(`Debug: Karma set to ${this.karma}`);
    }
}

// Global game state instance
window.gameState = new GameState();
