
<template>
  <div class="admin-container">
    <h1>🎛️ Admin Dashboard</h1>
    <button class="create-btn" @click="generateCodes">Tạo 10 mã</button>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Mã</th>
            <th>Phần thưởng</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in codes" :key="item.code">
            <td>{{ item.code }}</td>
            <td>{{ item.reward || '' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const codes = ref([])

function randomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function saveCodes() {
  localStorage.setItem('admin_codes', JSON.stringify(codes.value))
}

function loadCodes() {
  const data = localStorage.getItem('admin_codes')
  codes.value = data ? JSON.parse(data) : []
}

function generateCodes() {
  // Tạo 10 mã mới, không trùng mã cũ
  const existing = new Set(codes.value.map(c => c.code))
  let newCodes = []
  while (newCodes.length < 10) {
    const code = randomCode()
    if (!existing.has(code) && !newCodes.find(c => c.code === code)) {
      newCodes.push({ code, reward: '' })
    }
  }
  codes.value = [...codes.value, ...newCodes]
  saveCodes()
}

onMounted(loadCodes)
</script>

<style scoped>
.admin-container {
  max-width: 600px;
  margin: 40px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px #0001;
  padding: 32px 24px;
  text-align: center;
}
.create-btn {
  background: #007bff;
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 18px;
  transition: background 0.2s;
}
.create-btn:hover {
  background: #0056b3;
}
.table-wrapper {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
}
th, td {
  padding: 10px 8px;
  border: 1px solid #e0e0e0;
}
th {
  background: #f5f5f5;
}
</style>
