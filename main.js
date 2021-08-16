/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / Prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const cd = $('.cd')
const playlist = $('.playlist')
const  heading = $('header h2')
const  cdThumb = $('.cd-thumb')
const  audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('.progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: '3107',
            singer: 'W/n ft Nâu', 
            path: './assets/video/3107.mp3',
            image: './assets/img/3107.jpg'
        },
        {
            name: '3107 2',
            singer: 'W/n ft Nâu', 
            path: './assets/video/3107_2.mp3',
            image: './assets/img/3107_2.jpg'
        },
        {
            name: '3107 3',
            singer: 'W/n ft Nâu', 
            path: './assets/video/3107_3.mp3',
            image: './assets/img/3107_3.jpg'
        },
        {
            name: 'Rồi tới luôn',
            singer: 'Nal', 
            path: './assets/video/roi_toi_luon.mp3',
            image: './assets/img/roi_toi_luon.jpg'
        },
        {
            name: 'Đắm',
            singer: 'Xesi ft Ricky Star', 
            path: './assets/video/dam.mp3',
            image: './assets/img/dam.jpg'
        },
        {
            name: 'Gặp gỡ yêu đương và được bên em',
            singer: 'Phan Mạnh Quỳnh', 
            path: './assets/video/gap_go_yeu_duong_va_duoc_ben_em.mp3',
            image: './assets/img/gap_go_yeu_duong_va_duoc_ben_em.jpg'
        },
        {
            name: '3107',
            singer: 'W/n ft Nâu', 
            path: './assets/video/3107.mp3',
            image: './assets/img/3107.jpg'
        },
        {
            name: '3107 2',
            singer: 'W/n ft Nâu', 
            path: './assets/video/3107_2.mp3',
            image: './assets/img/3107_2.jpg'
        },
        {
            name: '3107 3',
            singer: 'W/n ft Nâu', 
            path: './assets/video/3107_3.mp3',
            image: './assets/img/3107_3.jpg'
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p></div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperty: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        //Xử lí CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        
        // Xử lí phóng to / thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = (newCdWidth > 0 ? newCdWidth : 0) + 'px'
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Xử lí khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause() 
                cdThumbAnimate.pause()
            }
            else {
                audio.play()
                cdThumbAnimate.play()
            }
        }
        
        // Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
        }
        
        // Khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        //Xử lí khi tua song
        progress.oninput = function(e) {
            const seekTime = e.target.value * audio.duration / 100
            audio.currentTime = seekTime
        }

        // Khi next song
        nextBtn.onclick  = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Khi prev song
        prevBtn.onclick  = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Khi random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        //Xử lí lặp lại song
        repeatBtn.onclick  = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xư lí next song khi audio ended
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Lắng nghe hành vi click vào playList
        playlist.onclick = function(e) {    
            const songNode = e.target.closest('.song:not(.active)')
            // Xử lí click vào song
            if (songNode && !e.target.closest('.option')) {
                _this.currentIndex = Number(songNode.dataset.index)
                _this.loadCurrentSong()
                _this.render()
                audio.play()
            }
        }
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 300)
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function() {
        // Load config
        this.loadConfig()

        // Định nghĩa các thuộc tính cho object
        this.defineProperty()

        // Lắng nghe / xử lí các sự kiện (DOM events)
        this.handleEvents()

        // Tải thông tin bìa hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()
        
        // Render playlist
        this.render()
        
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start()