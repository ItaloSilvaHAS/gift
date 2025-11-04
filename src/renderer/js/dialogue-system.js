
class DialogueSystem {
    constructor() {
        this.currentDialogue = null;
        this.currentChoices = [];
        this.isTyping = false;
        this.typewriterSpeed = 30; // ms per character
        this.autoAdvance = false;
        this.autoAdvanceDelay = 3000;
        this.nextAction = null; // Função para executar no próximo clique/Enter
        
        this.dialogueBox = document.getElementById('dialogue-box');
        this.speakerName = document.querySelector('.speaker-name');
        this.dialogueText = document.querySelector('.dialogue-text');
        this.choicesContainer = document.querySelector('.dialogue-choices');
        
        this.bindEvents();
    }

    bindEvents() {
        // Click to advance dialogue
        document.addEventListener('click', (e) => {
            if (e.target.closest('.choice-btn')) return; // Don't advance on choice click
            
            if (this.isTyping) {
                this.skipTypewriter();
            } else if (this.currentDialogue && this.currentChoices.length === 0) {
                if (this.nextAction) {
                    const action = this.nextAction;
                    this.nextAction = null;
                    this.hideDialogue();
                    action();
                } else {
                    this.advanceDialogue();
                }
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'Space':
                case 'Enter':
                    if (this.isTyping) {
                        this.skipTypewriter();
                    } else if (this.currentChoices.length === 0) {
                        if (this.nextAction) {
                            const action = this.nextAction;
                            this.nextAction = null;
                            this.hideDialogue();
                            action();
                        } else {
                            this.advanceDialogue();
                        }
                    }
                    e.preventDefault();
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                    const choiceIndex = parseInt(e.key) - 1;
                    if (this.currentChoices[choiceIndex] && !this.isTyping) {
                        this.selectChoice(choiceIndex);
                        e.preventDefault();
                    }
                    break;
            }
        });
    }

    showDialogue(dialogueData) {
        this.currentDialogue = dialogueData;
        this.currentChoices = dialogueData.choices || [];
        
        // Show dialogue box
        this.dialogueBox.style.display = 'flex';
        
        // Set speaker name
        this.speakerName.textContent = dialogueData.speaker || '';
        
        // Apply speaker styling
        this.applySpeakerStyling(dialogueData.speaker);
        
        // Type out the text
        this.typewriterText(dialogueData.text);
        
        // Show choices after text is complete
        if (this.currentChoices.length > 0) {
            setTimeout(() => {
                this.showChoices();
            }, this.calculateTypewriterDuration(dialogueData.text) + 300);
        }
        
        // Handle special effects
        if (dialogueData.effects) {
            this.applyDialogueEffects(dialogueData.effects);
        }
    }

    applySpeakerStyling(speaker) {
        // Remove previous speaker classes
        this.dialogueBox.classList.remove('speaker-evelly', 'speaker-ezra', 'speaker-shadow', 'speaker-narrator');
        
        // Apply speaker-specific styling
        switch(speaker.toLowerCase()) {
            case 'evelly':
                this.dialogueBox.classList.add('speaker-evelly');
                this.speakerName.style.color = '#ff6666';
                break;
            case 'ezra':
                this.dialogueBox.classList.add('speaker-ezra');
                this.speakerName.style.color = '#6666ff';
                break;
            case 'sombra':
            case 'shadow':
                this.dialogueBox.classList.add('speaker-shadow');
                this.speakerName.style.color = '#aa0000';
                this.applyHorrorEffects();
                break;
            case '':
                this.dialogueBox.classList.add('speaker-narrator');
                this.speakerName.style.color = '#cccccc';
                break;
        }
    }

    typewriterText(text) {
        this.isTyping = true;
        this.dialogueText.innerHTML = '';
        
        // Handle route-specific text modifications
        const modifiedText = this.applyRouteTextModifications(text);
        
        let charIndex = 0;
        const typeInterval = setInterval(() => {
            if (charIndex < modifiedText.length) {
                this.dialogueText.innerHTML += modifiedText[charIndex];
                charIndex++;
                
                // Play typing sound occasionally
                if (charIndex % 3 === 0) {
                    this.playTypingSound();
                }
            } else {
                clearInterval(typeInterval);
                this.isTyping = false;
                this.onTypewriterComplete();
            }
        }, this.typewriterSpeed);
        
        this.currentTypeInterval = typeInterval;
    }

    skipTypewriter() {
        if (this.currentTypeInterval) {
            clearInterval(this.currentTypeInterval);
            this.dialogueText.innerHTML = this.applyRouteTextModifications(this.currentDialogue.text);
            this.isTyping = false;
            this.onTypewriterComplete();
        }
    }

    onTypewriterComplete() {
        // Diálogos agora só avançam com clique/Enter - sem auto-advance
        // O usuário deve clicar ou apertar Enter para continuar
    }

    setNextAction(action) {
        // Define uma função para executar quando o usuário clicar/apertar Enter
        this.nextAction = action;
    }

    calculateTypewriterDuration(text) {
        return text.length * this.typewriterSpeed;
    }

    applyRouteTextModifications(text) {
        const currentRoute = window.gameState.getCurrentRoute();
        
        if (!currentRoute) return text;
        
        // Modify text based on current emotional state/route
        switch(currentRoute) {
            case 'rage':
                return text.replace(/\./g, '!').replace(/\?/g, '?!');
            case 'control':
                return text; // Keep text clinical and precise
            case 'redemption':
                return text; // Add empathetic undertones
        }
        
        return text;
    }

    showChoices() {
        this.choicesContainer.innerHTML = '';
        
        this.currentChoices.forEach((choice, index) => {
            const choiceButton = document.createElement('button');
            choiceButton.className = `choice-btn ${choice.type || ''}`;
            choiceButton.innerHTML = `${index + 1}. ${choice.text}`;
            
            // Add route-specific styling
            this.styleChoiceByType(choiceButton, choice.type);
            
            choiceButton.addEventListener('click', () => {
                this.selectChoice(index);
            });
            
            this.choicesContainer.appendChild(choiceButton);
        });
        
        // Animate choices in
        this.choicesContainer.style.opacity = '0';
        this.choicesContainer.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            this.choicesContainer.style.transition = 'all 0.3s ease';
            this.choicesContainer.style.opacity = '1';
            this.choicesContainer.style.transform = 'translateY(0)';
        }, 100);
    }

    styleChoiceByType(button, type) {
        switch(type) {
            case 'rage':
                button.style.borderLeft = '4px solid #ff0000';
                button.title = 'Escolha Agressiva (Rota da Raiva)';
                break;
            case 'control':
                button.style.borderLeft = '4px solid #0066ff';
                button.title = 'Escolha Lógica (Rota do Controle)';
                break;
            case 'redemption':
                button.style.borderLeft = '4px solid #00ff66';
                button.title = 'Escolha Empática (Rota da Redenção)';
                break;
        }
    }

    selectChoice(choiceIndex) {
        const selectedChoice = this.currentChoices[choiceIndex];
        if (!selectedChoice) return;
        
        // Record the choice
        window.gameState.addChoice({
            text: selectedChoice.text,
            type: selectedChoice.type,
            karmaChange: selectedChoice.karma || 0,
            consequences: selectedChoice.consequences || [],
            significant: selectedChoice.significant || false
        });
        
        // Apply karma change
        if (selectedChoice.karma) {
            window.gameState.adjustKarma(selectedChoice.karma, selectedChoice.text);
        }
        
        // Apply immediate consequences
        if (selectedChoice.consequences) {
            this.applyChoiceConsequences(selectedChoice.consequences);
        }
        
        // Play choice sound
        window.audioManager?.playSound('choice_select');
        
        // Visual feedback
        const choiceButtons = document.querySelectorAll('.choice-btn');
        choiceButtons[choiceIndex].style.background = 'rgba(255, 255, 255, 0.3)';
        
        // Hide choices
        setTimeout(() => {
            this.choicesContainer.innerHTML = '';
            this.currentChoices = [];
            
            // Continue dialogue or advance scene
            if (selectedChoice.nextDialogue) {
                this.showDialogue(selectedChoice.nextDialogue);
            } else if (selectedChoice.nextScene) {
                this.transitionToScene(selectedChoice.nextScene);
            } else if (this.nextAction) {
                const action = this.nextAction;
                this.nextAction = null;
                this.hideDialogue();
                action(selectedChoice);
            } else {
                this.advanceDialogue();
            }
        }, 500);
    }

    applyChoiceConsequences(consequences) {
        consequences.forEach(consequence => {
            switch(consequence.type) {
                case 'flag':
                    window.gameState.flags[consequence.flag] = consequence.value;
                    break;
                case 'inventory':
                    if (consequence.item === 'ammo') {
                        window.gameState.addAmmo(consequence.amount);
                    }
                    break;
                case 'relationship':
                    window.gameState.flags[consequence.character + 'Relationship'] = consequence.value;
                    break;
                case 'fear':
                    window.gameState.flags.fearLevel += consequence.amount;
                    break;
            }
        });
    }

    applyDialogueEffects(effects) {
        effects.forEach(effect => {
            switch(effect.type) {
                case 'shake':
                    document.body.classList.add('screen-shake');
                    setTimeout(() => {
                        document.body.classList.remove('screen-shake');
                    }, 500);
                    break;
                case 'jumpscare':
                    this.triggerJumpscare(effect.intensity || 'medium');
                    break;
                case 'glitch':
                    this.applyGlitchEffect(effect.duration || 1000);
                    break;
                case 'fadeToBlack':
                    this.fadeToBlack(effect.duration || 2000);
                    break;
            }
        });
    }

    triggerJumpscare(intensity) {
        const jumpscareDiv = document.createElement('div');
        jumpscareDiv.className = 'jumpscare';
        document.body.appendChild(jumpscareDiv);
        
        // Play jumpscare sound
        window.audioManager?.playJumpscare(intensity);
        
        // Screen shake
        document.body.classList.add('screen-shake');
        
        setTimeout(() => {
            document.body.removeChild(jumpscareDiv);
            document.body.classList.remove('screen-shake');
        }, 100);
        
        // Track jumpscare for adaptation
        window.gameState.flags.jumpscareCount++;
    }

    applyGlitchEffect(duration) {
        const glitchOverlay = document.createElement('div');
        glitchOverlay.className = 'glitch-overlay active';
        document.body.appendChild(glitchOverlay);
        
        setTimeout(() => {
            document.body.removeChild(glitchOverlay);
        }, duration);
    }

    fadeToBlack(duration) {
        const fadeDiv = document.createElement('div');
        fadeDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: black;
            z-index: 10000;
            opacity: 0;
            transition: opacity ${duration}ms ease;
        `;
        
        document.body.appendChild(fadeDiv);
        
        setTimeout(() => {
            fadeDiv.style.opacity = '1';
        }, 50);
        
        setTimeout(() => {
            fadeDiv.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(fadeDiv);
            }, duration);
        }, duration);
    }

    playTypingSound() {
        // Randomize typing sound for variety - only if audioManager is available
        if (window.audioManager) {
            const sounds = ['type1', 'type2', 'type3'];
            const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
            window.audioManager.playSound(randomSound);
        }
    }

    hideDialogue() {
        this.dialogueBox.style.display = 'none';
        this.currentDialogue = null;
        this.currentChoices = [];
    }

    advanceDialogue() {
        // This will be called by the chapter system
        // when ready to move to the next dialogue
        console.log('Dialogue advance requested');
    }

    transitionToScene(sceneData) {
        // Handle scene transitions
        console.log('Transitioning to scene:', sceneData);
        window.gameState.progressToNextScene();
    }
}

// Global dialogue system instance
window.dialogueSystem = new DialogueSystem();
