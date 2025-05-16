
        let localFiles = [];
        let currentLocalAudio = null;
        let currentLocalTrackIndex = -1;
        let currentVolume = 0.7;
        let progressInterval;

        const vinyl = document.getElementById('vinyl');
        const toneArm = document.querySelector('.tone-arm');
        const vinylLabel = document.getElementById('vinyl-label');
        const trackName = document.getElementById('track-name');
        const artistName = document.getElementById('artist-name');
        const playBtn = document.getElementById('play-btn');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const volumeBtn = document.getElementById('volume-btn');
        const volumeSlider = document.getElementById('volume-slider');
        const fileInput = document.getElementById('file-input');
        const playLocalBtn = document.getElementById('play-local-btn');
        const localPlaylist = document.getElementById('local-playlist');
        const progressBar = document.getElementById('progress-bar');
        const progress = document.getElementById('progress');
        const currentTimeDisplay = document.getElementById('current-time');
        const durationDisplay = document.getElementById('duration');

        // Event listeners
        playLocalBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleFileSelect);
        playBtn.addEventListener('click', togglePlay);
        prevBtn.addEventListener('click', playPrevious);
        nextBtn.addEventListener('click', playNext);
        volumeBtn.addEventListener('click', toggleMute);
        volumeSlider.addEventListener('input', adjustVolume);
        progressBar.addEventListener('click', seek);

  
        function handleFileSelect(event) {
            const files = Array.from(event.target.files).filter(file => file.type.startsWith('audio/'));
            
            if (files.length > 0) {
                localFiles = files;
                renderLocalPlaylist();
                playLocalTrack(0); 
            } else {
                alert('No audio files found in the selected folder');
            }
        }

        function renderLocalPlaylist() {
            localPlaylist.innerHTML = '';
            
            localFiles.forEach((file, index) => {
                const trackEl = document.createElement('div');
                trackEl.className = 'local-track-item';
                trackEl.innerHTML = `
                    <div class="track-disc"></div>
                    <div class="track-title">${getDisplayName(file.name)}</div>
                `;
                trackEl.addEventListener('click', () => playLocalTrack(index));
                localPlaylist.appendChild(trackEl);
            });
        }

        function getDisplayName(filename) {
            return filename.replace(/\.[^/.]+$/, "")
                          .replace(/_/g, ' ')
                          .replace(/-/g, ' ');
        }

        function playLocalTrack(index) {
            if (currentLocalAudio) {
                currentLocalAudio.pause();
                clearInterval(progressInterval);
                document.querySelectorAll('.local-track-item').forEach(el => {
                    el.classList.remove('playing');
                });
            }
            
            document.querySelectorAll('.local-track-item')[index].classList.add('playing');
            
            const file = localFiles[index];
            const url = URL.createObjectURL(file);
            currentLocalAudio = new Audio(url);
            currentLocalAudio.volume = currentVolume;
            currentLocalTrackIndex = index;
            
            currentLocalAudio.play();
            
            vinyl.classList.add('playing');
            toneArm.classList.add('playing');
            trackName.textContent = getDisplayName(file.name);
            artistName.textContent = 'Local File';
            vinylLabel.textContent = getDisplayName(file.name);
            
            currentLocalAudio.addEventListener('loadedmetadata', updateDuration);
            progressInterval = setInterval(updateProgress, 1000);
            
            currentLocalAudio.addEventListener('ended', playNextTrack);
        }

        function updateDuration() {
            const duration = currentLocalAudio.duration;
            durationDisplay.textContent = formatTime(duration);
        }

        function updateProgress() {
            if (currentLocalAudio) {
                const currentTime = currentLocalAudio.currentTime;
                const duration = currentLocalAudio.duration;
                const progressPercent = (currentTime / duration) * 100;
                
                progress.style.width = `${progressPercent}%`;
                currentTimeDisplay.textContent = formatTime(currentTime);
            }
        }

        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        }

        function seek(e) {
            if (currentLocalAudio) {
                const progressBarWidth = progressBar.clientWidth;
                const clickPosition = e.offsetX;
                const seekPercentage = clickPosition / progressBarWidth;
                const seekTime = seekPercentage * currentLocalAudio.duration;
                
                currentLocalAudio.currentTime = seekTime;
                progress.style.width = `${seekPercentage * 100}%`;
            }
        }

        function togglePlay() {
            if (currentLocalAudio) {
                if (currentLocalAudio.paused) {
                    currentLocalAudio.play();
                    vinyl.classList.add('playing');
                    toneArm.classList.add('playing');
                    progressInterval = setInterval(updateProgress, 1000);
                } else {
                    currentLocalAudio.pause();
                    vinyl.classList.remove('playing');
                    toneArm.classList.remove('playing');
                    clearInterval(progressInterval);
                }
            }
        }

        function playNextTrack() {
            if (localFiles.length > 0) {
                const nextIndex = (currentLocalTrackIndex + 1) % localFiles.length;
                playLocalTrack(nextIndex);
            }
        }

        function playPreviousTrack() {
            if (localFiles.length > 0) {
                const prevIndex = (currentLocalTrackIndex - 1 + localFiles.length) % localFiles.length;
                playLocalTrack(prevIndex);
            }
        }

        function playNext() {
            playNextTrack();
        }

        function playPrevious() {
            playPreviousTrack();
        }

        function toggleMute() {
            if (currentLocalAudio) {
                if (currentLocalAudio.volume > 0) {
                    currentLocalAudio.volume = 0;
                    volumeBtn.textContent = '🔇';
                    volumeSlider.value = 0;
                } else {
                    currentLocalAudio.volume = currentVolume;
                    volumeBtn.textContent = '🔊';
                    volumeSlider.value = currentVolume;
                }
            }
        }

        function adjustVolume(e) {
            const volume = parseFloat(e.target.value);
            currentVolume = volume;
            
            if (currentLocalAudio) {
                currentLocalAudio.volume = volume;
                volumeBtn.textContent = volume === 0 ? '🔇' : '🔊';
            }
        }
function playLocalTrack(index) {
    if (currentLocalAudio) {
        currentLocalAudio.pause();
        clearInterval(progressInterval);
        document.querySelectorAll('.local-track-item').forEach(el => {
            el.classList.remove('playing');
        });
    }

    document.querySelectorAll('.local-track-item')[index].classList.add('playing');

    const file = localFiles[index];
    const url = URL.createObjectURL(file);
    currentLocalAudio = new Audio(url);
    currentLocalAudio.volume = currentVolume;
    currentLocalTrackIndex = index;

    currentLocalAudio.play();

    vinyl.classList.add('playing');
    toneArm.classList.add('playing');
    trackName.textContent = getDisplayName(file.name);
    artistName.textContent = 'Local File';
    vinylLabel.textContent = getDisplayName(file.name);
    
    playBtn.textContent = '⏸';

    currentLocalAudio.addEventListener('loadedmetadata', updateDuration);
    progressInterval = setInterval(updateProgress, 1000);

    currentLocalAudio.addEventListener('ended', () => {
        playNextTrack();
        playBtn.textContent = '▶';
        vinyl.classList.remove('playing');
        toneArm.classList.remove('playing');
    });
}

function togglePlay() {
    if (currentLocalAudio) {
        if (currentLocalAudio.paused) {
            currentLocalAudio.play();
            vinyl.classList.add('playing');
            toneArm.classList.add('playing');
            progressInterval = setInterval(updateProgress, 1000);
            playBtn.textContent = '⏸';
        } else {
            currentLocalAudio.pause();
            vinyl.classList.remove('playing');
            toneArm.classList.remove('playing');
            clearInterval(progressInterval);
            playBtn.textContent = '▶';
        }
    }
}
