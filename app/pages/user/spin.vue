<template>
  <div class="main-bg">
    <audio ref="spinAudio" src="/spin.mp3"></audio>
    <div class="main-flex">
      <div class="main-img-col">
        <img src="/sunshine-marketing.png" alt="Marketing" class="main-img" />
      </div>
      <div class="main-wheel-col">
        <div class="spin-center">
          <div class="simple-wheel-outer">
            <div class="wheel-stack">
              <svg width="480" height="480" viewBox="0 0 480 480" class="svg-border">
                <defs>
                  <linearGradient id="border-gradient-outer" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#ffe066" />
                    <stop offset="100%" stop-color="#b5e61d" />
                  </linearGradient>
                  <linearGradient id="border-gradient-inner" x1="1" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#ffe066" />
                    <stop offset="100%" stop-color="#b5e61d" />
                  </linearGradient>
                </defs>
                <circle cx="240" cy="240" r="215" fill="none" stroke="url(#border-gradient-outer)" stroke-width="8" />
                <circle cx="240" cy="240" r="205.5" fill="none" stroke="#17612a" stroke-width="20" />
                <circle cx="240" cy="240" r="175" fill="none" stroke="url(#border-gradient-inner)" stroke-width="8" />
              </svg>
              <svg class="wheel-pointer-svg" width="60" height="54" viewBox="0 0 60 54" style="position:absolute;left:50%;top:-36px;transform:translateX(-50%) rotate(180deg);z-index:20;">
                <polygon points="30,0 60,54 0,54" fill="#ffe066" stroke="#b5e61d" stroke-width="4" />
                <circle cx="30" cy="10" r="8" fill="#fff" stroke="#1b8c2c" stroke-width="4" />
              </svg>
              <svg width="440" height="440" viewBox="0 0 440 440" class="simple-wheel" :style="`position: absolute; left: 20px; top: 20px; transform: rotate(${wheelAngle}deg);`">
                <g v-for="(item, idx) in prizes" :key="item.label">
                  <path :d="segmentPath(idx)" :fill="item.color" stroke="#fff" stroke-width="2" />
                  <text
                    :x="labelPos(idx).x"
                    :y="labelPos(idx).y"
                    :transform="`rotate(${labelAngle(idx)} ${labelPos(idx).x} ${labelPos(idx).y})`"
                    alignment-baseline="middle"
                    class="simple-label"
                  >
                    {{ item.label }}
                  </text>
                </g>
                <circle cx="220" cy="220" r="32" fill="#1b8c2c" stroke="#fff" stroke-width="6" />
              </svg>
            </div>
            <button class="spin-btn-main" @click="onSpin" :disabled="spinning">QUAY</button>
          </div>
        </div>
        <div v-if="showPopup" class="popup-overlay">
          <div class="popup-content">
            <div class="popup-title">Chúc mừng bạn nhận được</div>
            <div class="popup-prize">{{ currentPrize }}</div>
            <button class="popup-close" @click="showPopup = false">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const spinAudio = ref(null)
const size = 440
const prizes = [
  { label: '¥20.000\ncash', color: '#ff9900' },
  { label: '¥10.000\ncash', color: '#ffe066' },
  { label: '¥1000\ncash out', color: '#43b02a' },
  { label: '¥100\nmonthly fee', color: '#b5e61d' },
  { label: '¥200\nmonthly fee', color: '#ff9900' },
  { label: '¥300\nmonthly fee', color: '#43b02a' },
  { label: '¥500\nmonthly fee', color: '#ffe066' },
  { label: '¥600\nmonthly fee', color: '#b5e61d' },
]

const router = useRouter()
const wheelAngle = ref(0)
const spinning = ref(false)
const showPopup = ref(false)
const currentPrize = ref('')
const code = localStorage.getItem('spin_code_used') || ''
const codesFull = JSON.parse(localStorage.getItem('spin_codes_full') || '[]')
const row = codesFull.find(r => r.code === code)
const outOfTurn = ref(false)
const hasSpun = ref(false)

function segmentPath(idx) {
  const n = prizes.length
  const angle = (2 * Math.PI) / n
  const r = 220
  const a0 = idx * angle - Math.PI / 2
  const a1 = (idx + 1) * angle - Math.PI / 2
  const x0 = r + r * Math.cos(a0)
  const y0 = r + r * Math.sin(a0)
  const x1 = r + r * Math.cos(a1)
  const y1 = r + r * Math.sin(a1)
  return `M${r},${r} L${x0},${y0} A${r},${r} 0 0,1 ${x1},${y1} Z`
}

function labelPos(idx) {
  const n = prizes.length
  const angle = (2 * Math.PI) / n
  const r = 220
  const a = (idx + 0.5) * angle - Math.PI / 2
  const x = r + (r - 140) * Math.cos(a)
  const y = r + (r - 140) * Math.sin(a)
  return { x, y }
}

function labelAngle(idx) {
  const n = prizes.length
  const angle = 360 / n
  return idx * angle + angle / 2 - 90
}

function onSpin() {
  if (outOfTurn.value || hasSpun.value) {
    showOutOfTurnPopup()
    return
  }
  if (spinning.value) return
  spinning.value = true
  // Play sound
  if (spinAudio.value) {
    spinAudio.value.currentTime = 0
    spinAudio.value.play()
  }
  const n = prizes.length
  const idx = Math.floor(Math.random() * n)
  const anglePer = 360 / n
  const targetAngle = 360 * 5 + (360 - idx * anglePer - anglePer / 2)
  const start = wheelAngle.value
  const diff = ((targetAngle - start) % 360 + 360) % 360 + 360 * 5
  const duration = 4000
  const startTime = performance.now()

  function animate(now) {
    const elapsed = now - startTime
    const t = Math.min(elapsed / duration, 1)
    const ease = 1 - Math.pow(1 - t, 3)
    wheelAngle.value = start + diff * ease
    if (t < 1) {
      requestAnimationFrame(animate)
    } else {
      spinning.value = false
      wheelAngle.value = start + diff
      currentPrize.value = prizes[idx].label.replace(/\n/g, ' ')
      setTimeout(() => {
        // Stop sound
        if (spinAudio.value) {
          spinAudio.value.pause()
          spinAudio.value.currentTime = 0
        }
        showPopup.value = true
        onSpinEnd(prizes[idx].label.replace(/\n/g, ' '))
      }, 5000)
    }
  }
  requestAnimationFrame(animate)

  localStorage.setItem('spin_has_spun', '1')
  hasSpun.value = true
}

// Sau khi user quay xong và nhận giải thưởng, lưu thông tin vào bảng mã
async function saveUserInfoToAdmin(prize) {
  const fb = localStorage.getItem('spin_fb') || ''
  const cid = localStorage.getItem('spin_cid') || ''
  const email = localStorage.getItem('spin_email') || ''
  const code = localStorage.getItem('spin_code_used') || ''
  await $fetch('/api/spin-codes', {
    method: 'POST',
    body: { code, fb, cid, email, prize }
  })
}

// Trong logic quay xong, sau khi hiện popup giải thưởng:
function onSpinEnd(prizeLabel) {
  saveUserInfoToAdmin(prizeLabel)
  // Xóa mã khỏi spin_codes sau khi quay xong
  const code = localStorage.getItem('spin_code_used') || ''
  let codes = JSON.parse(localStorage.getItem('spin_codes') || '[]')
  codes = codes.filter(c => c !== code)
  localStorage.setItem('spin_codes', JSON.stringify(codes))
}

function showOutOfTurnPopup() {
  // Hiện popup thông báo mã đã hết lượt quay
  alert('Mã này đã hết lượt quay!')
}

onMounted(() => {
  if (!code || !row) {
    alert('Mã không hợp lệ!')
    router.replace('/user/login')
  } else if (row.prize) {
    outOfTurn.value = true
  }
  if (localStorage.getItem('spin_has_spun') === '1') {
    hasSpun.value = true
  }
})
</script>

<style scoped>
html, body, #__nuxt, #__layout {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  box-sizing: border-box;
}
.main-bg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  min-width: 100vw;
  min-height: 100vh;
  background: #fff;
  display: flex;
  align-items: stretch;
  justify-content: center;
  overflow: hidden;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  z-index: 0;
}
.main-flex {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  z-index: 1;
}
.main-img-col {
  width: 50vw;
  height: 100vh;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.main-img {
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  object-fit: cover;
  display: block;
  margin: 0;
  padding: 0;
}
.main-wheel-col {
  flex: 1 1 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100vh;
  padding-right: 2vw;
}
.spin-center {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.simple-wheel-outer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 24px 0;
}
.wheel-stack {
  position: relative;
  width: 480px;
  height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.svg-border {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  pointer-events: none;
}
.simple-wheel {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 2;
  border-radius: 50%;
  background: #fff;
  display: block;
  box-shadow: 0 8px 32px #0003;
  outline: 8px solid #b5e61d;
  transition: transform 4s cubic-bezier(0.22, 0.61, 0.36, 1);
  pointer-events: none;
}
.wheel-pointer-svg {
  position: absolute;
  left: 50%;
  top: -36px;
  transform: translateX(-50%) rotate(180deg);
  z-index: 10;
  pointer-events: none;
}
.simple-label {
  font-size: 10px;
  font-weight: 900;
  fill: #fff;
  text-shadow: 0 2px 8px #000, 0 0 2px #000;
  text-transform: uppercase;
  paint-order: stroke fill;
  stroke: #000;
  stroke-width: 1px;
  letter-spacing: 1px;
  pointer-events: none;
  user-select: none;
  font-family: 'Arial Black', Arial, sans-serif;
  white-space: pre-line;
}
.spin-btn-main {
  background: linear-gradient(180deg, #ffe066 0%, #ff922b 100%);
  color: #fff;
  font-weight: 900;
  font-size: 38px;
  border: 4px solid #ff922b;
  border-radius: 32px;
  padding: 18px 80px;
  margin-top: 24px;
  margin-bottom: 8px;
  box-shadow: 0 4px 24px #0002;
  letter-spacing: 2px;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  text-shadow: 2px 2px 8px #0005;
  text-transform: uppercase;
}
.spin-btn-main:disabled {
  background: #ffe06699;
  color: #fff;
  cursor: not-allowed;
  box-shadow: none;
}
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.popup-content {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 32px #0004;
  padding: 36px 48px 32px 48px;
  min-width: 320px;
  text-align: center;
}
.popup-title {
  font-size: 28px;
  font-weight: 800;
  color: #1b8c2c;
  margin-bottom: 18px;
  letter-spacing: 1px;
}
.popup-prize {
  font-size: 32px;
  font-weight: 900;
  color: #ff922b;
  margin-bottom: 24px;
  text-shadow: 0 2px 8px #0001;
}
.popup-close {
  background: linear-gradient(180deg, #ffe066 0%, #ff922b 100%);
  color: #fff;
  font-weight: 900;
  font-size: 22px;
  border: none;
  border-radius: 12px;
  padding: 10px 36px;
  box-shadow: 0 2px 12px #0002;
  letter-spacing: 1px;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  text-shadow: 1px 1px 4px #0005;
}
</style>
