<template>
  <component :is="currentThemeComponent" />
  <dashboard>
    <template #left-content>
      <div class="imageToText-system">
        <div class="main-content">
          <div class="up-down">
            <div v-if="!uiChange" :key="1">
              <div class="recommendations">
                <div class="headbar">
                  <div class="text">You can ask me like this</div>
                  <div class="icon" @click="changeSelection">
                    <div>Switch to another</div>
                    <i class="fa-solid fa-rotate"></i>
                  </div>
                </div>
                <div class="image-list">
                  <img
                    :src="images[0 + 2 * questionSelection]"
                    alt="Gallery Image"
                    class="image-class"
                    @click="uploadImageFromList(0 + 2 * questionSelection)"
                  />
                  <img
                    :src="images[1 + 2 * questionSelection]"
                    alt="Gallery Image"
                    class="image-class"
                    @click="uploadImageFromList(1 + 2 * questionSelection)"
                  />
                </div>
              </div>
            </div>
            <div v-if="messages.length" class="chat-history" ref="chatHistory">
              <div
                v-for="(message, index) in messages"
                :key="index"
                class="message"
              >
                <div class="message-header">
                  <span class="message-time">{{ message.time }}</span>
                </div>
                <div class="message-content">
                  <p>{{ message.text }}</p>
                  <img
                    v-if="!message.isResponse"
                    :src="message.imageUrl"
                    alt="Uploaded Image"
                    class="uploaded-image"
                  />
                  <div v-if="isLoading" class="loading-icon">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                  </div>
                </div>

                <div
                  v-if="message.isResponse && !message.fromHistory"
                  class="response"
                >
                  <button v-if="!isLoading" @click="handleRetry(index)">
                    Retry
                  </button>
                  <button v-if="!isLoading" @click="copyResponse(index)">
                    Get
                  </button>
                </div>
              </div>
            </div>

            <div class="input-area">
              <input
                type="file"
                accept="image/*"
                @change="onFileChange"
                ref="fileInput"
              />
              <input
                type="text"
                v-model="description"
                placeholder="输入图片描述(可选)"
                class="description-input"
              />
              <button @click="handleSend">➤</button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </dashboard>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import Snowfall from "../components/Snowfall.vue";
import { getUsername } from "../utils/Auth";
import dashboard from "../components/Dashboard.vue";
import { API_ENDPOINTS } from "../config/apiConfig";

import img1 from "../assets/image_example/1.jpg";
import img2 from "../assets/image_example/2.jpg";
import img3 from "../assets/image_example/3.jpg";
import img4 from "../assets/image_example/4.jpg";
import img5 from "../assets/image_example/5.jpg";
import img6 from "../assets/image_example/6.jpg";
import img7 from "../assets/image_example/7.jpg";
import img8 from "../assets/image_example/8.jpg";
import img9 from "../assets/image_example/9.jpg";
import img10 from "../assets/image_example/10.jpg";
import img11 from "../assets/image_example/11.jpg";
import img12 from "../assets/image_example/12.jpg";

// 定义一个映射，以保持图片文件数据
const imageFiles = [
  new File([img1], "1.jpg", { type: "image/jpeg" }),
  new File([img2], "2.jpg", { type: "image/jpeg" }),
  new File([img3], "3.jpg", { type: "image/jpeg" }),
  new File([img4], "4.jpg", { type: "image/jpeg" }),
  new File([img5], "5.jpg", { type: "image/jpeg" }),
  new File([img6], "6.jpg", { type: "image/jpeg" }),
  new File([img7], "7.jpg", { type: "image/jpeg" }),
  new File([img8], "8.jpg", { type: "image/jpeg" }),
  new File([img9], "9.jpg", { type: "image/jpeg" }),
  new File([img10], "10.jpg", { type: "image/jpeg" }),
  new File([img11], "11.jpg", { type: "image/jpeg" }),
  new File([img12], "12.jpg", { type: "image/jpeg" }),
];

const router = useRouter();

const history = ref([]);
const images = ref([
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  img12,
]);

const questionSelection = ref(0);
const uiChange = ref(0);
const messages = ref([]);
const userInput = ref("");
const isLoading = ref(false);
const chatHistory = ref(null);

const currentTheme = ref("Snowfall");

const currentThemeComponent = computed(() => {
      return Snowfall;
});

const changeSelection = () => {
  questionSelection.value++;
  questionSelection.value = questionSelection.value % 6;
};

const removeHistory = (index) => {
  history.value.splice(index, 1);
};

// 监听 messages 数组变化时，触发滚动到底部
watch(messages, async () => {
  await nextTick(); // 等待 DOM 更新完成
  if (chatHistory.value) {
    // 滚动到最底部
    chatHistory.value.scrollTop = chatHistory.value.scrollHeight;
  }
});

// 存储上传的文件
const selectedFile = ref(null);
const lastSelectedFile = ref(null);
const description = ref("");
const lastDescription = ref("");

// 处理文件改变事件
const onFileChange = (event) => {
  const files = event.target.files;
  if (files && files[0]) {
    const file = files[0];
    if (file.type.startsWith("image/")) {
      selectedFile.value = file; // 确保是图片文件
    } else {
      alert("Please choose an image file！");
      selectedFile.value = null;
    }
  }
};

const token = localStorage.getItem("jwtToken");

const api = {
  image: API_ENDPOINTS.image,
  fetchHistory: API_ENDPOINTS.list,
};

let url = api.image;

const uploadImageFromList = async (index) => {
  try {
    // 获取选中的图片并转化为 blob 对象
    const response = await fetch(images.value[index]);
    const blob = await response.blob();

    // 创建新的 File 对象
    selectedFile.value = new File([blob], `image_${index}.jpg`, {
      type: blob.type,
    });

    if (!selectedFile.value) {
      alert("Please choose an image file！");
      return;
    }

    // 获取当前时间
    const currentTime = new Date().toLocaleTimeString();

    // 创建图片 URL
    const imageUrl = URL.createObjectURL(selectedFile.value);

    // 清空消息并设置加载状态
    uiChange.value = 1;
    messages.value = [];
    isLoading.value = true;

    // 将上传的图片加入消息
    messages.value.push({
      text: "The user has uploaded an image.",
      time: currentTime,
      isResponse: false,
      imageUrl,
      loading: true,
    });

    const formData = new FormData();
    formData.append("username", getUsername());
    formData.append("image_file", selectedFile.value);
    if (description.value) {
      formData.append("description", description.value);
    }
    if (description.value) {
      formData.append("description", description.value);
    }

    const token = localStorage.getItem("jwtToken");

    // 检查是否存在 token
    if (!token) {
      handleError("Request failed. Please try again later.");
      isLoading.value = false;
      return;
    }

    const responseAPI = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    // 检查请求是否成功
    if (!responseAPI.ok) {
      handleError(`Request failed, status code：${responseAPI.status}`);
      isLoading.value = false;
      return;
    }

    const result = await responseAPI.json();
    const responseTime = new Date().toLocaleTimeString();

    // 直接使用caption字段内容
    messages.value.push({
      text: result.caption || "This is the response provided by the system",
      time: responseTime,
      isResponse: true,
    });

    // 添加历史记录项
    history.value.push({
      id: result.search_history_id,
      text: `Uploaded on ${currentTime}`,
      imageUrl,
    });
  } catch (error) {
    handleError("Request failed, please try again later");
    console.error("Submission failed", error);
  } finally {
    isLoading.value = false;
  }
};

const handleSend = async () => {
  if (!selectedFile.value) {
    alert("请选择图片文件！");
    return;
  }

  // 保存当前状态用于重试
  lastSelectedFile.value = selectedFile.value;
  lastDescription.value = description.value;

  await sendImage(selectedFile.value, description.value);
};

const handleRetry = async (index) => {
  if (!lastSelectedFile.value) {
    alert("没有可重试的记录！");
    return;
  }

  await sendImage(lastSelectedFile.value, lastDescription.value);
};

const sendImage = async (fileToSend, descToSend) => {
  if (!fileToSend) {
    alert("图片文件无效！");
    return;
  }

  const currentTime = new Date().toLocaleTimeString();
  uiChange.value = 1;
  messages.value = [];

  const imageUrl = URL.createObjectURL(fileToSend);
  isLoading.value = true;
  
  messages.value.push({
    text: descToSend || "用户上传了图片",
    time: currentTime,
    isResponse: false,
    imageUrl,
    loading: true,
  });

  const formData = new FormData();
  formData.append("username", getUsername());
  formData.append("image_file", fileToSend);
  
  if (descToSend) {
    formData.append("description", descToSend);
  }

  try {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      handleError("Request failed. Please try again later.");
      isLoading.value = false;
      return;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      if(response.status === 401) {
        handleError("Session expired, please login again");
        localStorage.removeItem("jwtToken");
        router.push("/login");
      } else {
        handleError(`Request failed, status code：${response.status}`);
      }
      isLoading.value = false;
      return;
    }

    const result = await response.json();
    console.log(result);

    const responseTime = new Date().toLocaleTimeString();
    
    // 直接使用caption字段内容
    messages.value.push({
      text: result.caption || "This is the response provided by the system",
      time: responseTime,
      isResponse: true,
      loading: false,
    });

    if (messages.value[0]) {
      messages.value[0].loading = false;
    }

    // 添加历史记录项，包括获取到的 ID 和文本
    history.value.push({
      id: result.search_history_id,
      text: `Uploaded on ${currentTime}`,
      imageUrl,
    });
  } catch (error) {
    handleError("Request failed, please try again later");
    console.error("Submission failed", error);
  } finally {
    isLoading.value = false;
  }
};

//获取历史记录
const fetchHistory = async (id) => {
  const formData = new FormData();
  formData.append("search_history_id", id);

  try {
    const response = await fetch(api.fetchHistory, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();
    messages.value = [];

    if (result.code === 0) {
      const imageUrl = URL.createObjectURL(selectedFile.value);

      messages.value.push({
        imageUrl,
        time: result.data.date,
        isResponse: false,
        fromHistory: true,
      });

      // 检查 search_text 是否为字符串
      const searchText = result.data.search_text;

      // 使用正则表达式提取所有 'Content' 部分的内容
      const contentMatches = searchText.match(/Content:\s*([^,]+)/g);

      // 提取并格式化内容为字符串，中间用换行符隔开
      const responseText = contentMatches
        ? contentMatches
            .map((match) => match.replace("Content: ", "").trim())
            .join("\n")
        : "This is the response provided by the system.";

      messages.value.push({
        time: result.data.date,
        isResponse: true,
        text: responseText,
        fromHistory: true,
      });
    } else {
      handleError(
        "Failed to retrieve history records" +
          (result.message || "Unknown error")
      );
    }
  } catch (error) {
    handleError("Request failed, please try again later");
    console.error("Failed to retrieve history records", error);
  }
};

// 错误处理函数
const handleError = (errorMessage) => {
  const errorTime = new Date().toLocaleTimeString();
  messages.value.push({
    text: errorMessage,
    time: errorTime,
    isResponse: true,
  });
};

// 重新回答功能
const retryResponse = async (index) => {
  try {
    await sendImage(true, index);
  } catch (error) {
    messages.value[index].text = "Request failed, please try again later.";
  }
};

// 复制功能
const copyResponse = (index) => {
  const textToCopy = messages.value[index].text;
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      alert("The response has been copied to the clipboard.");
    })
    .catch(() => {
      alert("Copy failed, please try again.");
    });
};

onMounted(() => {
  const username = getUsername();

  if (!username) {
    router.push("/");
  } else {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      currentTheme.value = savedTheme;
    }
  }
});
</script>

<style scoped>
.imageToText-system {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 5px;
  overflow: hidden;
}

.main-content {
  display: flex;
  flex-direction: row;
  padding: 0px;
  flex: 1;
  overflow-y: auto;
}

.up-down {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 4;
  margin: 10px;
}

.recommendations {
  position: absolute;
  top: 0;
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.headbar {
  margin: 20px 10px;
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
  min-height: 60px;
  align-items: center;
}

.text {
  position: absolute;
  left: 50%;
  transform: translateX(-50%); /* Center the element horizontally */
  font-size: 22px;
  font-weight: bold;
  color: #4e4e4e;
}

.icon {
  display: flex;
  position: absolute;
  right: 27px;
  gap: 5px;
  flex-direction: row;
  align-items: center;
  font-size: 16px;
  color: #ffffffd0;
}

.image-list {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 100%;
  width: 80%;
}

.image-class {
  height: 224px;
  width: 224px;
  border-radius: 15px;
}

.chat-history {
  position: absolute;
  top: 0;
  width: 100%;
  height: 85%;
  flex: 1;
  overflow-y: auto;
}

.message {
  background: rgba(173, 216, 230, 0.5);
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
}

.message-header {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.message-time {
  color: #ccc;
  font-size: 12px;
}

.message-content {
  color: #fff;
  white-space: pre-wrap;
  font-family: "Consolas", monospace;
  gap: 0px;
  line-height: 1.8;
}

.message-content p {
  margin: 5px 0px;
}

.uploaded-image {
  height: 150px;
  width: 150px;
}

.response {
  margin-top: 10px;
  display: flex;
  gap: 5px;
  height: 30px;
}

.response button {
  background-color: #2e3140;
  color: #ccc;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  width: 75px;
  margin-right: 5px;
}

.input-area {
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  background: transparent;
  width: 100%;
  height: 10%;
}

.input-area input[type="file"] {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
  background-color: rgba(101,101,127, 0.15);
  color: #000000;
  height: 50px;
  font-family: "Consolas", monospace;
  font-size: 15px;
}

.description-input {
  flex: 20;
  padding: 10px;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
  background-color: rgba(101,101,127, 0.15);
  color: #000000;
  height: 50px;
  font-family: "Consolas", monospace;
  font-size: 15px;
}

.input-area button {
  flex: 1;
  padding: 10px;
  background-color: rgba(101,101,127, 0.7);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  height: 50px;
}

</style>
