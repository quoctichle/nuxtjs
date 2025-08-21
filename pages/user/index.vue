<template>
  <div class="user-container">
    <div class="user-card">
      <h1>🎡 Vòng quay may mắn</h1>
      <input v-model="inputCode" placeholder="Nhập mã admin cung cấp" class="input-code" />
      <button class="spin-btn" @click="onSpin" :disabled="spun || !inputCode">Quay thưởng</button>
      <div v-if="errorMsg" class="error">{{ errorMsg }}</div>
      <div v-if="reward" class="reward">Bạn nhận được: <b>{{ reward }}</b></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const inputCode = ref('')
const reward = ref('')
const errorMsg = ref('')
const spun = ref(false)

function onSpin() {
  errorMsg.value = ''
  reward.value = ''
  spun.value = false
  // Lấy danh sách mã từ localStorage
  const codes = JSON.parse(localStorage.getItem('admin_codes') || '[]')
  const idx = codes.findIndex(c => c.code === inputCode.value)
  if (idx === -1) {
    errorMsg.value = 'Mã không hợp lệ hoặc không tồn tại.'
    return
  }
  if (codes[idx].reward) {
    errorMsg.value = 'Mã này đã được sử dụng.'
    return
  }
  // Quay thưởng
  const prize = spinReward()
  reward.value = prize
  spun.value = true
  codes[idx].reward = prize
  localStorage.setItem('admin_codes', JSON.stringify(codes))
}

function spinReward() {
  // Tỷ lệ: iPhone 16 Pro Max 1%, iPhone 5 50%, iPhone 6 40%, iPhone X 9%
  const rand = Math.random() * 100
  if (rand < 1) return 'iPhone 16 Pro Max'
  if (rand < 51) return 'iPhone 5'
  if (rand < 91) return 'iPhone 6'
  return 'iPhone X'
}
</script>

<style scoped>
.user-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%);
}
.user-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px #0002;
  padding: 36px 32px 32px 32px;
  min-width: 320px;
  text-align: center;
}
.input-code {
  padding: 10px 12px;
  border: 1px solid #bdbdbd;
  border-radius: 6px;
  margin-bottom: 16px;
  width: 80%;
  font-size: 16px;
}
.spin-btn {
  background: #22c55e;
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 18px;
  transition: background 0.2s;
}
.spin-btn:disabled {
  background: #a7f3d0;
  cursor: not-allowed;
}
.error {
  color: #e11d48;
  margin-top: 8px;
}
.reward {
  color: #0ea5e9;
  font-size: 20px;
  margin-top: 16px;
}
</style>
