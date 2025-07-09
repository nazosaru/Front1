<template>
  <div v-if="isVisible" class="edit-overlay">
    <div class="edit-content" @click.stop>
      <!-- Header -->
      <div class="edit-header">
        <h2>Account Settings</h2>
        <button class="close-button" @click="close">×</button>
      </div>

      <!-- Form content -->
      <div class="edit-body">
        <form class="form">
          <!-- Email -->
          <div class="form-group">
            <label for="email">Email</label>
            <input
                type="email"
                id="email"
                placeholder="Enter your new email"
                v-model="form.email"
                maxLength="150"
            />
          </div>

          <!-- New Password -->
          <div class="form-group">
            <label for="password">New Password</label>
            <input
                type="password"
                id="password"
                placeholder="Enter your new password"
                v-model="form.password"
            />
          </div>

          <!-- Confirm Password -->
          <div class="form-group">
            <label for="rePassword">Confirm Password</label>
            <input
                type="password"
                id="rePassword"
                placeholder="Confirm your new password"
                v-model="form.rePassword"
            />
          </div>

          <!-- Avatar Upload -->
          <div class="form-group">
            <label>Profile Picture</label>
            <div class="avatar-upload">
              <input
                  type="file"
                  id="avatar"
                  @change="handleFileChange"
                  accept="image/*"
              />
              <img
                  v-if="avatarPreview"
                  :src="avatarPreview"
                  alt="Avatar Preview"
                  class="avatar"
              />
            </div>
          </div>
        </form>
      </div>

      <!-- Footer buttons -->
      <div class="edit-footer">
        <button class="cancel-button" @click="close">Cancel</button>
        <button class="confirm-button" @click="submitForm">Save Changes</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { API_ENDPOINTS } from "../config/apiConfig";
import { getUsername } from "../utils/Auth";

const FRONTEND_SALT = 'RetrievalSystem@2023';
const username = getUsername();
const avatarPreview = ref(null);
const token = localStorage.getItem("jwtToken");

const props = defineProps({
  isVisible: Boolean,
});

const initialFormState = {
  username: username,
  email: "",
  password: "",
  rePassword: "",
  avatar: null,
};

const form = ref({ ...initialFormState });

async function sha256WithSalt(message) {
  const msgBuffer = new TextEncoder().encode(message + FRONTEND_SALT);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Handle file selection for avatar
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.value = e.target.result;
      localStorage.setItem(`avatar_${username}`, e.target.result);
    };
    reader.readAsDataURL(file);
    form.value.avatar = file;
  }
};

const api = {
  edit: API_ENDPOINTS.edit,
};

// Submit form data
const submitForm = async () => {
  if (form.value.password !== form.value.rePassword) {
    alert("Passwords do not match");
    return;
  }

  const formData = new FormData();
  formData.append("username", form.value.username);
  formData.append("email", form.value.email);

  if (form.value.password) {
    const encryptedPassword = await sha256WithSalt(form.value.password);
    formData.append("password", encryptedPassword);
  }

  if (form.value.avatar) {
    formData.append("avatar", form.value.avatar);
  }

  try {
    const response = await fetch(api.edit, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();
    if (result.code === 0) {
      alert("Changes saved successfully");
      emit("update:isVisible", false);
      resetForm();
    } else {
      alert(result.message || "Failed to save changes");
    }
  } catch (error) {
    alert("Request failed: " + error.message);
  }
};

const emit = defineEmits(["update:isVisible"]);

const close = () => {
  emit("update:isVisible", false);
  resetForm();
};

// Reset form to initial state
const resetForm = () => {
  form.value = { ...initialFormState };
  avatarPreview.value = null;
};
</script>

<style scoped>
.edit-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.edit-content {
  background-color: rgba(26, 28, 45, 0.8);
  border-radius: 20px;
  width: 400px;
  padding: 20px 30px;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(202, 202, 208, 0.35);
}

.edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.edit-header h2 {
  color: #ffffff;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
}

.edit-body {
  margin-bottom: 20px;
  max-height: 70vh;
  overflow-y: auto;
}

.edit-body::-webkit-scrollbar {
  display: none;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  color: #ffffff;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #333;
  border-radius: 10px;
  background-color: #2b2e3e;
  color: #ffffff;
  font-size: 16px;
}

.avatar-upload {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.edit-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-button {
  padding: 8px 16px;
  border: none;
  background-color: #444;
  color: #ffffff;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-button {
  padding: 8px 16px;
  border: none;
  background-color: #1e90ff;
  color: #ffffff;
  border-radius: 4px;
  cursor: pointer;
}
</style>