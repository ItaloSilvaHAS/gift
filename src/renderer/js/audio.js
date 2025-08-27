
class AudioManager {
    constructor() {
        this.bgMusic = document.getElementById('bg-music');
        this.sfxPlayer = document.getElementById('sfx-player');
        this.jumpscareAudio = document.getElementById('jumpscare-audio');
        
        this.masterVolume = 0.75;
        this.musicVolume = 0.6;
        this.sfxVolume = 0.8;
        
        this.currentMusic = null;
        this.soundLibrary = {};
        this.musicLibrary = {};
        
        this.initializeAudio();
        this.loadSoundLibrary();
    }

    initializeAudio() {
        // Set initial volumes
        this.updateVolumes();
        
        // Handle music loops
        this.bgMusic.addEventListener('ended', () => {
            if (this.currentMusic && this.musicLibrary[this.currentMusic].loop) {
                this.bgMusic.currentTime = 0;
                this.bgMusic.play();
            }
        });
    }

    loadSoundLibrary() {
        // Define sound effects (placeholder paths)
        this.soundLibrary = {
            // UI Sounds
            'menu_hover': { path: 'assets/audio/sfx/menu_hover.ogg', volume: 0.5 },
            'menu_click': { path: 'assets/audio/sfx/menu_click.ogg', volume: 0.7 },
            'choice_select': { path: 'assets/audio/sfx/choice_select.ogg', volume: 0.6 },
            
            // Typing sounds
            'type1': { path: 'assets/audio/sfx/type1.ogg', volume: 0.3 },
            'type2': { path: 'assets/audio/sfx/type2.ogg', volume: 0.3 },
            'type3': { path: 'assets/audio/sfx/type3.ogg', volume: 0.3 },
            
            // Horror sounds
            'heartbeat': { path: 'assets/audio/sfx/heartbeat.ogg', volume: 0.8 },
            'whisper': { path: 'assets/audio/sfx/whisper.ogg', volume: 0.7 },
            'scream': { path: 'assets/audio/sfx/scream.ogg', volume: 0.9 },
            'door_creak': { path: 'assets/audio/sfx/door_creak.ogg', volume: 0.6 },
            'footsteps': { path: 'assets/audio/sfx/footsteps.ogg', volume: 0.5 },
            
            // Combat sounds
            'gunshot': { path: 'assets/audio/sfx/gunshot.ogg', volume: 0.8 },
            'reload': { path: 'assets/audio/sfx/reload.ogg', volume: 0.7 },
            'empty_click': { path: 'assets/audio/sfx/empty_click.ogg', volume: 0.6 },
            
            // Jumpscare sounds
            'jumpscare_low': { path: 'assets/audio/sfx/jumpscare_low.ogg', volume: 0.6 },
            'jumpscare_medium': { path: 'assets/audio/sfx/jumpscare_medium.ogg', volume: 0.8 },
            'jumpscare_high': { path: 'assets/audio/sfx/jumpscare_high.ogg', volume: 1.0 },
            'jumpscare_extreme': { path: 'assets/audio/sfx/jumpscare_extreme.ogg', volume: 1.0 }
        };
        
        // Define music tracks
        this.musicLibrary = {
            'menu_theme': { 
                path: 'assets/audio/music/menu_theme.ogg', 
                volume: 0.8, 
                loop: true,
                fadeIn: true
            },
            'chapter1_ambient': { 
                path: 'assets/audio/music/chapter1_ambient.ogg', 
                volume: 0.6, 
                loop: true,
                fadeIn: true
            },
            'tension_build': { 
                path: 'assets/audio/music/tension_build.ogg', 
                volume: 0.7, 
                loop: false,
                fadeIn: false
            },
            'shadow_encounter': { 
                path: 'assets/audio/music/shadow_encounter.ogg', 
                volume: 0.8, 
                loop: true,
                fadeIn: false
            },
            'trauma_flashback': { 
                path: 'assets/audio/music/trauma_flashback.ogg', 
                volume: 0.5, 
                loop: false,
                fadeIn: true
            }
        };
    }

    updateVolumes() {
        this.bgMusic.volume = this.masterVolume * this.musicVolume;
        this.sfxPlayer.volume = this.masterVolume * this.sfxVolume;
        this.jumpscareAudio.volume = this.masterVolume * this.sfxVolume;
    }

    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume / 100));
        this.updateVolumes();
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume / 100));
        this.updateVolumes();
    }

    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume / 100));
        this.updateVolumes();
    }

    playMusic(trackName, fadeIn = true) {
        if (!this.musicLibrary[trackName]) {
            console.error(`Music track '${trackName}' not found`);
            return;
        }
        
        const track = this.musicLibrary[trackName];
        
        if (fadeIn && this.currentMusic) {
            this.fadeOutCurrentMusic(() => {
                this.startMusic(trackName, track);
            });
        } else {
            this.startMusic(trackName, track);
        }
    }

    startMusic(trackName, track) {
        this.bgMusic.src = track.path;
        this.bgMusic.volume = track.fadeIn ? 0 : (this.masterVolume * this.musicVolume * track.volume);
        this.currentMusic = trackName;
        
        this.bgMusic.play().then(() => {
            if (track.fadeIn) {
                this.fadeInMusic(track.volume);
            }
        }).catch(error => {
            console.error('Failed to play music:', error);
        });
    }

    fadeInMusic(targetVolume, duration = 2000) {
        const targetVol = this.masterVolume * this.musicVolume * targetVolume;
        const step = targetVol / (duration / 50);
        
        const fadeInterval = setInterval(() => {
            if (this.bgMusic.volume < targetVol - step) {
                this.bgMusic.volume += step;
            } else {
                this.bgMusic.volume = targetVol;
                clearInterval(fadeInterval);
            }
        }, 50);
    }

    fadeOutCurrentMusic(callback, duration = 1000) {
        const step = this.bgMusic.volume / (duration / 50);
        
        const fadeInterval = setInterval(() => {
            if (this.bgMusic.volume > step) {
                this.bgMusic.volume -= step;
            } else {
                this.bgMusic.volume = 0;
                this.bgMusic.pause();
                clearInterval(fadeInterval);
                if (callback) callback();
            }
        }, 50);
    }

    stopMusic(fadeOut = true) {
        if (fadeOut) {
            this.fadeOutCurrentMusic();
        } else {
            this.bgMusic.pause();
            this.bgMusic.volume = 0;
        }
        this.currentMusic = null;
    }

    playSound(soundName, volume = null) {
        if (!this.soundLibrary[soundName]) {
            console.error(`Sound '${soundName}' not found`);
            return;
        }
        
        const sound = this.soundLibrary[soundName];
        const soundVolume = volume !== null ? volume : sound.volume;
        
        // Clone audio for overlapping sounds
        const audio = new Audio(sound.path);
        audio.volume = this.masterVolume * this.sfxVolume * soundVolume;
        
        audio.play().catch(error => {
            console.error('Failed to play sound:', error);
        });
        
        return audio;
    }

    playJumpscare(intensity = 'medium') {
        const jumpscareIntensity = window.gameState.settings.jumpscareIntensity || intensity;
        const soundName = `jumpscare_${jumpscareIntensity}`;
        
        if (this.soundLibrary[soundName]) {
            this.jumpscareAudio.src = this.soundLibrary[soundName].path;
            this.jumpscareAudio.volume = this.masterVolume * this.sfxVolume * this.soundLibrary[soundName].volume;
            this.jumpscareAudio.play();
            
            // Track jumpscare for adaptive horror
            window.gameState.flags.jumpscareCount++;
            
            // Apply screen effects
            this.applyJumpscareEffects(jumpscareIntensity);
        }
    }

    applyJumpscareEffects(intensity) {
        // Screen flash
        const flash = document.createElement('div');
        flash.className = 'jumpscare';
        document.body.appendChild(flash);
        
        setTimeout(() => {
            document.body.removeChild(flash);
        }, 100);
        
        // Screen shake duration based on intensity
        const shakeDuration = {
            low: 300,
            medium: 500,
            high: 800,
            extreme: 1200
        };
        
        document.body.classList.add('screen-shake');
        setTimeout(() => {
            document.body.classList.remove('screen-shake');
        }, shakeDuration[intensity] || 500);
    }

    playHeartbeat(bpm = 60, duration = 5000) {
        const interval = 60000 / bpm; // ms between beats
        const heartbeatSound = 'heartbeat';
        
        const heartbeatInterval = setInterval(() => {
            this.playSound(heartbeatSound, 0.6);
        }, interval);
        
        setTimeout(() => {
            clearInterval(heartbeatInterval);
        }, duration);
        
        return heartbeatInterval;
    }

    playAmbientLoop(soundName, duration = null) {
        const audio = this.playSound(soundName);
        
        if (duration) {
            setTimeout(() => {
                audio.pause();
            }, duration);
        }
        
        return audio;
    }

    // Dynamic audio based on game state
    updateAmbientAudio() {
        const currentRoute = window.gameState.getCurrentRoute();
        const fearLevel = window.gameState.flags.fearLevel;
        
        // Adjust music based on route and fear level
        if (fearLevel > 8) {
            this.playMusic('tension_build', false);
        } else if (currentRoute === 'rage' && fearLevel > 5) {
            this.playAmbientLoop('heartbeat', 10000);
        }
    }

    preloadAudio() {
        // Preload critical audio files
        const criticalSounds = ['jumpscare_medium', 'gunshot', 'scream'];
        
        criticalSounds.forEach(soundName => {
            if (this.soundLibrary[soundName]) {
                const audio = new Audio(this.soundLibrary[soundName].path);
                audio.preload = 'auto';
            }
        });
    }
}

// Initialize global audio manager
window.audioManager = new AudioManager();
