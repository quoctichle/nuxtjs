<template>
  <div class="admin-bg">
    <div class="admin-box">
      <div class="admin-title">Tạo mã quay thưởng</div>
      <form @submit.prevent="generateCodes">
        <label>Số lượng mã:</label>
        <select v-model.number="count" class="admin-select">
          <option :value="10">10</option>
          <option :value="100">100</option>
          <option :value="1000">1000</option>
        </select>
        <button class="admin-btn" type="submit">Tạo mã</button>
      </form>
      <div v-if="allCodes.length" class="admin-table-wrap">
        <div class="admin-codes-title">Bảng quản lý mã quay thưởng</div>
        <table class="admin-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên Facebook</th>
              <th>ID Khách hàng</th>
              <th>Email</th>
              <th>Giải thưởng</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in allCodes" :key="row.code">
              <td>{{ row.code }}</td>
              <td>{{ row.fb || '' }}</td>
              <td>{{ row.cid || '' }}</td>
              <td>{{ row.email || '' }}</td>
              <td>{{ row.prize || '' }}</td>
            </tr>
          </tbody>
        </table>
        <button class="export-btn" @click="exportExcel">Xuất dữ liệu ra Excel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
let XLSX
const count = ref(10)
const allCodes = ref([])

function randomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

async function generateCodes() {
  const codes = Array.from({ length: count.value }, () => randomCode())
  for (const code of codes) {
    await $fetch('/api/spin-codes', {
      method: 'POST',
      body: { code }
    })
  }
  await fetchCodes()
}

async function fetchCodes() {
  const res = await $fetch('/api/spin-codes')
  allCodes.value = res.data || []
}

onMounted(() => {
  fetchCodes()
})

async function exportExcel() {
  if (!XLSX) {
    XLSX = await import('xlsx')
  }
  const ws = XLSX.utils.json_to_sheet(allCodes.value.map(row => ({
    'Mã': row.code,
    'Tên Facebook': row.fb,
    'ID Khách hàng': row.cid,
    'Email': row.email,
    'Giải thưởng': row.prize
  })))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'MaQuayThuong')
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([wbout], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'ma_quay_thuong.xlsx'
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 100)
}
</script>

<style scoped>
.admin-bg {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #fffbe6 0%, #e6f9c7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.admin-box {
  background: #fff;
  border-radius: 24px;
  padding: 36px 32px 32px 32px;
  min-width: 340px;
  max-width: 98vw;
  box-shadow: 0 8px 32px #0002;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.admin-title {
  font-size: 2rem;
  font-weight: 900;
  color: #17612a;
  margin-bottom: 24px;
  text-align: center;
}
.admin-select {
  width: 160px;
  font-size: 1.1rem;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #b5e61d;
  margin: 12px 0 18px 0;
  font-weight: 700;
  color: #17612a;
  background: #fff;
  outline: none;
}
.admin-btn {
  font-size: 1.1rem;
  font-weight: 900;
  color: #fff;
  background: linear-gradient(180deg, #ffe066 0%, #ff922b 100%);
  border: 2px solid #ff922b;
  border-radius: 12px;
  padding: 10px 32px;
  margin-bottom: 12px;
  cursor: pointer;
  text-shadow: 1px 1px 4px #0005;
  text-transform: uppercase;
  transition: background 0.2s, box-shadow 0.2s;
}
.admin-table-wrap {
  margin-top: 32px;
  width: 100%;
  overflow-x: auto;
}
.admin-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  box-shadow: 0 2px 8px #0001;
}
.admin-table th, .admin-table td {
  border: 1px solid #b5e61d55;
  padding: 8px 12px;
  text-align: center;
  font-size: 1rem;
}
.admin-table th {
  background: #e6f9c7;
  font-weight: 900;
  color: #17612a;
}
.export-btn {
  margin-top: 24px;
  font-size: 1.1rem;
  font-weight: 900;
  color: #fff;
  background: linear-gradient(180deg, #ffe066 0%, #ff922b 100%);
  border: 2px solid #ff922b;
  border-radius: 12px;
  padding: 12px 36px;
  cursor: pointer;
  text-shadow: 1px 1px 4px #0005;
  text-transform: uppercase;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px #0002;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.export-btn:active {
  background: #ff922b;
}
</style>
