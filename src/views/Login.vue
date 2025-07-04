<template>
  <div class="body">
    <div class="background-image"></div>
    <BackgroundAnimation />
    <div class="login-panel">
      <el-form class="login-register" :model="formData" :rules="rules" ref="formDataRef" @submit.prevent>
        <div class="login-title">
          <img src="@/assets/favicon.svg" alt="My Icon" class="login-icon" />
          LoveIT -- Retrieval System
        </div>

        <!-- 登录 -->
        <div v-if="opType == 1">
          <el-form-item prop="username" class="form-item">
            <el-input size="large" clearable placeholder="Please enter your username" v-model="formData.username"
              maxlength="20">
              <template #prefix>
                <span class="iconfont icon-account"></span>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password" class="form-item">
            <el-input type="password" size="large" placeholder="Please enter your password" v-model="formData.password"
              show-password>
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <div class="rememberme-panel">
              <el-checkbox v-model="formData.rememberMe">Remember me</el-checkbox>
            </div>
            <div class="no-account">
              <a href="javascript:void(0)" class="a-link" @click="showPanel(2)">Forgot your password?</a>
              <a href="javascript:void(0)" class="a-link" @click="showPanel(0)">No account?</a>
            </div>
          </el-form-item>
        </div>

        <!-- 注册 -->
        <div v-if="opType == 0">
          <el-form-item prop="username" class="form-item">
            <el-input size="large" clearable placeholder="Please enter your username" v-model="formData.username" />
          </el-form-item>

          <el-form-item prop="email" class="form-item">
            <el-input size="large" clearable placeholder="Please enter your email" v-model="formData.email" />
          </el-form-item>

          <el-form-item prop="registerPassword" class="form-item">
            <el-input type="password" size="large" placeholder="Please enter your password"
              v-model="formData.registerPassword" show-password />
          </el-form-item>

          <el-form-item prop="reRegisterPassword" class="form-item">
            <el-input type="password" size="large" placeholder="Please re-enter your password"
              v-model="formData.reRegisterPassword" show-password />
          </el-form-item>
        </div>

        <!-- 重置密码第一步：用户名+邮箱 -->
        <div v-if="opType == 2 && !codeSent">
          <el-form-item prop="username" class="form-item">
            <el-input size="large" clearable placeholder="Please enter your username" v-model="formData.username" />
          </el-form-item>

          <el-form-item prop="email" class="form-item">
            <el-input size="large" clearable placeholder="Please enter your email" v-model="formData.email" />
          </el-form-item>

          <el-form-item>
            <el-button size="large" type="primary" class="op-btn" @click="handleSendCode" :disabled="sending">
              {{ sending ? countDown + 's' : 'Send Code' }}
            </el-button>
          </el-form-item>
        </div>

        <!-- 重置密码第二步：验证码 + 新密码 -->
        <div v-if="opType == 2 && codeSent">
          <el-form-item prop="verifyCode" class="form-item">
            <el-input v-model="formData.verifyCode" placeholder="Please enter the verification code" />
          </el-form-item>

          <el-form-item prop="registerPassword" class="form-item">
            <el-input type="password" placeholder="Please enter your new password" v-model="formData.registerPassword"
              show-password />
          </el-form-item>

          <el-form-item prop="reRegisterPassword" class="form-item">
            <el-input type="password" placeholder="Please confirm your new password"
              v-model="formData.reRegisterPassword" show-password />
          </el-form-item>
        </div>

        <!-- 提交按钮，仅在需要时显示 -->
        <el-form-item v-if="(opType == 0) || (opType == 1) || (opType == 2 && codeSent)">
          <el-button type="primary" class="op-btn" @click="doSubmit" size="large">
            <span v-if="opType == 0">Register</span>
            <span v-if="opType == 1">Login</span>
            <span v-if="opType == 2 && codeSent">Reset the password</span>
          </el-button>
        </el-form-item>

        <el-form-item v-if="opType == 0">
          <a href="javascript:void(0)" class="a-link" @click="showPanel(1)">Already have an account?</a>
        </el-form-item>

        <el-form-item v-if="opType == 2">
          <a href="javascript:void(0)" class="a-link" @click="showPanel(1)">Go to login?</a>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import BackgroundAnimation from "../components/BackgroundAnimation.vue";
import { useUserStore } from "../stores/userStore";
import { saveUsername } from "../utils/Auth";
import { API_ENDPOINTS } from "../config/apiConfig";

// 前端固定盐值
const FRONTEND_SALT = 'RetrievalSystem@2023';

// SHA-256加密函数
async function sha256WithSalt(message) {
  const msgBuffer = new TextEncoder().encode(message + FRONTEND_SALT);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const data = ref("");
const api = {
  register: API_ENDPOINTS.register,
  login: API_ENDPOINTS.login,
  sendCode: API_ENDPOINTS.sendCode,
  resetConfirm: API_ENDPOINTS.resetConfirm,
};

//0:注册 1:登录 2:重置密码
const opType = ref();
const showPanel = (type) => {
  opType.value = type;
  resetForm();
};

onMounted(() => {
  showPanel(1);
});

//登录，注册 弹出配置   reactive响应式对象
const dialogConfig = reactive({
  show: false,
  title: "title",
});

/* 检查密码的再次输入 */
const checkRePassword = (rule, value, callback) => {
  if (value !== formData.value.registerPassword) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};

const formData = ref({
  username: "",
  password: "",
  rememberMe: false,
});
const formDataRef = ref();

/* 检查各种输入的规则 */
const rules = {
  email: [
    { required: true, message: "Please enter your email" },
    { validator: proxy.Verify.email, message: "Please enter a valid email" },
  ],
  password: [{ required: true, message: "Please enter your password" }],
  username: [{ required: true, message: "Please enter your username" }],
  registerPassword: [
    { required: true, message: "Please enter your password" },
    {
      validator: proxy.Verify.password,
      message:
        "Password can only be numbers, letters, special characters, 8-18 characters",
    },
    { required: true, message: "Please re-enter your password" },
    {
      validator: checkRePassword,
      message: "The two passwords do not match",
    },
  ],
};

/* 重置表单 */
const resetForm = () => {
  dialogConfig.show = true;
  if (opType.value == 0) {
    dialogConfig.title = "Register";
  } else if (opType.value == 1) {
    dialogConfig.title = "Login";
  } else if (opType.value == 2) {
    dialogConfig.title = "Reset the password";
  }
  nextTick(() => {
    formDataRef.value.resetFields();
    formData.value = {};

    if (opType.value == 1) {
      const cookieLoginInfo = proxy.VueCookies.get("loginInfo");
      if (cookieLoginInfo) {
        formData.value = cookieLoginInfo;
      }
    }
  });
};

const userStore = useUserStore();

// 发射用户名的函数
const emitUsername = () => {
  if (formData.value.username) {
    userStore.setUsername(formData.value.username);
  } else {
    console.error("Username is empty, unable to submit!");
  }
};

//登录、注册、重置密码  提交表单
const doSubmit = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) return;

    let params = {};
    Object.assign(params, formData.value);
    if (opType.value === 0 || opType.value === 1) {
      handleRegisterOrLogin(params);
    } else if (opType.value === 2) {
      handleResetPassword(params);
    }
  });
};

// 开发模式配置
const isDevMode = import.meta.env.MODE === 'development';
const DEV_CREDENTIALS = {
  username: 'devuser',
  password: 'devpass123'
};

const DEV_ADMIN_CREDENTIALS = {
  username: 'admin', 
  password: 'admin123'
};


const handleRegisterOrLogin = async (params) => {
  // 开发模式下管理员快捷登录
  if (isDevMode &&
    params.username === DEV_ADMIN_CREDENTIALS.username &&
    params.password === DEV_ADMIN_CREDENTIALS.password) {
    localStorage.setItem('isAdmin', 'true');
    saveUsername(params.username);
    router.push('/userManagement');
    return;
  }
  try {
    // 加密密码
    if (params.password) {
      params.password = await sha256WithSalt(params.password);
    }
    if (params.registerPassword) {
      params.registerPassword = await sha256WithSalt(params.registerPassword);
    }

    // 开发模式本地验证
    if (isDevMode && opType.value === 1) {
      if (params.username === DEV_CREDENTIALS.username &&
        params.password === await sha256WithSalt(DEV_CREDENTIALS.password)) {
        localStorage.setItem("jwtToken", "dev_token");
        userStore.setUsername(params.username);
        saveUsername(params.username);
        router.push('/framework');
        return;
      }
    }
  } catch (error) {
    console.error('Password encryption failed:', error);
    proxy.$message.error('Password encryption failed');
    return;
  }

  let url = null;

  if (opType.value === 0) {
    params.password = params.registerPassword;
    delete params.registerPassword;
    delete params.reRegisterPassword;
    url = api.register;
  }

  if (opType.value === 1) {
    url = api.login;
    let cookieLoginInfo = proxy.VueCookies.get("loginInfo");
  }

  // 使用 URLSearchParams 来格式化参数，确保后端可以用 request.form 接收
  const urlEncodedParams = new URLSearchParams(params);

  try {
    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlEncodedParams.toString(),
    });

    const response = await result.json();
    data.value = response;

    // 处理成功操作
    handleSuccessResponse(response, params);
  } catch (error) {
    console.error("Request failed", error);
    if (isDevMode) {
      alert("后端连接失败，开发模式可使用默认凭证: devuser/devpass123");
    } else {
      alert("Request failed. Please check your network or try again later");
    }
  }

  // 处理记住登录信息
  if (opType.value === 1) {
    handleRememberLogin(params);
  }
};

// 处理成功响应
const handleSuccessResponse = (response, params) => {
  if (response.code === 0) {
    if (opType.value === 0) {
      console.log("✅ 注册成功，用户名：", params.username);
      alert("Register successfully");
      opType.value = 1;
      resetForm();
    } else {
      console.log("✅ 登录成功，用户名：", params.username);
      // 存储 JWT 令牌
      localStorage.setItem("jwtToken", response.access_token);
      alert("Operation successful");
      if (response.data.permission_level === 1) {
        router.push("/framework");
      } else if (response.data.permission_level === 0) {
        router.push("/userManagement");
      }

      emitUsername();
      saveUsername(params.username);
    }
  } else {
    console.log("登录失败，原因：", response.message);
    alert("Operation failed: " + response.message);
  }
};

// 处理记住登录信息
const handleRememberLogin = (params) => {
  if (params.rememberMe) {
    const loginInfo = {
      username: params.username,
      password: params.password,
      rememberMe: params.rememberMe,
    };
    proxy.VueCookies.set("loginInfo", loginInfo, "7d");
  } else {
    proxy.VueCookies.remove("loginInfo");
  }
};

// 重置密码流程相关状态
const codeSent = ref(false);     // 是否已发送验证码
const sending = ref(false);      // 是否正在倒计时
const countDown = ref(60);       // 剩余秒数
let timer = null;

// 发送验证码按钮点击处理
const handleSendCode = async () => {
  const { username, email } = formData.value;

  if (!username || !email) {
    alert("Please enter both username and email");
    return;
  }

  // 构造请求体
  const formData2 = new FormData();
  formData2.append("username", username);
  formData2.append("email", email);

  try {
    const response = await fetch(api.sendCode, {
      method: "POST",
      body: formData2,
    });
    const result = await response.json();

    if (result.code === 0) {
      alert("Verification code sent! Please check your email.");
      codeSent.value = true;
      startCountdown(); // 启动倒计时
    } else {
      alert("Failed: " + result.message);
    }
  } catch (error) {
    console.error("Error sending code:", error);
    alert("Network error");
  }
};

// 启动倒计时（防止重复发送验证码）
const startCountdown = () => {
  sending.value = true;
  countDown.value = 60;

  timer = setInterval(() => {
    countDown.value--;
    if (countDown.value <= 0) {
      clearInterval(timer);
      sending.value = false;
    }
  }, 1000);
};

// 处理重置密码
const handleResetPassword = async (params) => {
  const url = api.resetConfirm;
  const formData2 = new FormData();

  try {
    // 加密密码
    const encryptedPassword = await sha256WithSalt(params.registerPassword);
    const encryptedConfirmPassword = await sha256WithSalt(params.reRegisterPassword);

    formData2.append("username", params.username);
    formData2.append("code", params.verifyCode);
    formData2.append("new_password", encryptedPassword);
    formData2.append("confirm_password", encryptedConfirmPassword);

    const response = await fetch(url, {
      method: "POST",
      body: formData2,
    });

    const result = await response.json();
    if (result.code === 0) {
      alert("Password reset successfully!");
      opType.value = 1;
      resetForm();
    } else {
      alert("Failed: " + result.message);
    }
  } catch (error) {
    console.error("Password encryption or request failed", error);
    proxy.$message.error('Password reset failed');
  }
};


</script>

<style lang="scss" scoped>
.body {
  margin: 0;
  font-family: "Montserrat", sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-panel {
  width: 400px;
  margin: calc((100vh - 500px) / 2) auto;
}

.login-register {
  padding: 25px;
  background-color: rgba(26, 28, 45, 0.35);
  border: 1px solid rgba(202, 202, 208, 0.35);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
}

.form-item {
  border: 1px solid #333;
  border-radius: 10px;
  background-color: #2b2e3e;
  color: #191919;
}

.login-title {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 40px;
  color: #000000;
}

.login-icon {
  width: 48px; // 放大图标
  height: 48px;
  margin-right: 12px; // 图标与文字之间的距离
  transform: translateX(-8px); // 向左偏移图标
}

.rememberme-panel {
  width: 100%;
}

.no-account {
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.op-btn {
  width: 100%;
}

.button-panel {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: fit-content;
  padding: 20px;
}

.reco-panel,
.help-panel {
  display: flex;
  align-items: center;
}

.button-panel-2 {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: fit-content;
  padding: 20px;
}

.admin-panel,
.fast-panel {
  display: flex;
  align-items: center;
}

.check-code-panel {
  width: 100%;
  display: flex;
}

.check-code {
  margin-left: 5px;
  cursor: pointer;
}

.login-btn-qq {
  margin-top: 20px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 背景图片样式 */
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/background2.svg'); /* 替换为您的图片路径 */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1; /* 确保在内容下方 */
  opacity: 0.7; /* 适当透明度，确保文字可读 */
}

img {
  cursor: pointer;
  margin-left: 10px;
  width: 20px;
}
</style>
