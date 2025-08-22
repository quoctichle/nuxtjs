<template>
  <div class="login-bg">
    <div class="login-box">
      <div class="login-title">ONE SPIN, BIG WIN</div>
      <form @submit.prevent="onLogin">
        <div class="input-group">
          <input v-model="fb" id="fb" class="login-input" required placeholder="Facebook Name:" />
        </div>
        <div class="input-group">
          <input v-model="cid" id="cid" class="login-input" required placeholder="Customer ID:" />
        </div>
        <div class="input-group">
          <input v-model="email" id="email" class="login-input" required type="email" placeholder="Email:" />
        </div>
        <div class="input-group">
          <input v-model="code" id="code" class="login-input" required maxlength="8" placeholder="Spin Code:" />
        </div>
        <button class="login-btn" type="submit">CONTINUE</button>
      </form>
      <div v-if="error" class="login-error">{{ error }}</div>
      <div class="login-sub">Get your prize instantly!</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const fb = ref('')
const cid = ref('')
const email = ref('')
const code = ref('')
const error = ref('')
const router = useRouter()

async function onLogin() {
  if (!fb.value.trim() || !cid.value.trim() || !email.value.trim() || !code.value.trim()) {
    error.value = 'Vui lòng nhập đầy đủ thông tin!'
    return
  }
  const codeInput = code.value.trim().toUpperCase()
  // Kiểm tra mã trên MongoDB qua API riêng
  const res = await $fetch(`/api/spin-codes/${codeInput}`)
  const found = res.data
  if (found && !found.prize) {
    localStorage.setItem('spin_code_used', codeInput)
    localStorage.setItem('spin_fb', fb.value.trim())
    localStorage.setItem('spin_cid', cid.value.trim())
    localStorage.setItem('spin_email', email.value.trim())
    localStorage.removeItem('spin_has_spun')
    error.value = ''
    router.push('/user/spin')
  } else {
    error.value = 'Spin code không hợp lệ hoặc đã hết lượt!'
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&display=swap');
.login-bg {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #fffbe6 0%, #e6f9c7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', Arial, sans-serif;
}
.login-box {
  background: linear-gradient(120deg, #2ecc40 0%, #b5e61d 100%);
  border-radius: 48px;
  padding: 64px 64px 48px 64px;
  min-width: 640px;
  max-width: 98vw;
  box-shadow: 0 16px 64px #0003;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.login-title {
  font-size: 3.4rem;
  font-weight: 900;
  color: #17612a;
  margin-bottom: 40px;
  text-align: center;
  letter-spacing: 2px;
  text-shadow: 2px 3px 0 #fff, 0 2px 12px #0002;
  font-family: 'Montserrat', Arial, sans-serif;
}
form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: center;
}
.input-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.login-input {
  width: 520px;
  max-width: 90vw;
  font-size: 1.5rem;
  padding: 22px 28px;
  border-radius: 16px;
  border: none;
  font-weight: 700;
  color: #17612a;
  background: #fff;
  outline: none;
  box-shadow: 0 2px 16px #0001;
  margin-bottom: 0;
  transition: box-shadow 0.2s;
  text-align: left;
}
.login-input:focus {
  box-shadow: 0 4px 24px #b5e61d55;
}
.login-btn {
  font-size: 2.2rem;
  font-weight: 900;
  color: #fff;
  background: linear-gradient(180deg, #ffe066 0%, #ff922b 100%);
  border: 4px solid #ff922b;
  border-radius: 20px;
  padding: 18px 0;
  margin: 40px 0 0 0;
  cursor: pointer;
  text-shadow: 1px 2px 4px #0005;
  text-transform: uppercase;
  transition: background 0.2s, box-shadow 0.2s;
  width: 340px;
  max-width: 80vw;
  box-shadow: 0 2px 16px #0002;
  letter-spacing: 1px;
  display: block;
  align-self: center;
}
.login-btn:active {
  background: #ff922b;
}
.login-error {
  color: #d90429;
  font-weight: 700;
  margin-top: 24px;
  text-align: center;
  background: #fff3;
  border-radius: 10px;
  padding: 12px 0;
  font-size: 1.2rem;
}
.login-sub {
  font-size: 2.4rem;
  font-weight: 900;
  color: #17612a;
  margin-top: 48px;
  text-align: center;
  text-shadow: 2px 3px 0 #fff, 0 2px 12px #0002;
  font-family: 'Montserrat', Arial, sans-serif;
}
@media (max-width: 900px) {
  .login-box {
    min-width: 98vw;
    padding: 24px 2vw 24px 2vw;
  }
  .login-title {
    font-size: 2.2rem;
  }
  .login-input {
    width: 90vw;
    font-size: 1.1rem;
    padding: 14px 10px;
  }
  .login-btn {
    width: 80vw;
    font-size: 1.2rem;
    padding: 10px 0;
  }
  .login-sub {
    font-size: 1.2rem;
  }
}
</style>
