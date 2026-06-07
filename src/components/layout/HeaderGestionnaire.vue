<template>
  <header class="header">
    <div class="header-left">
      <!-- Le titre de la page est géré par la vue elle-même -->
    </div>
    <div class="header-right">
      <!-- Notification -->
      <button class="notif-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <span class="notif-badge">2</span>
      </button>

      <!-- User Profile -->
      <div class="user-profile">
        <div class="avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <span class="user-name">Awa Sarr</span>
      </div>
    </div>
  </header>
</template>

<script setup>
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: transparent;
  width: 100%;
  box-sizing: border-box; /* Évite que le header dépasse l'écran */
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-left: auto;
}

.notif-btn {
  background: transparent;
  border: none;
  position: relative;
  cursor: pointer;
  padding: 4px;
}

.notif-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 1px 4px;
  border-radius: 10px;
  border: 2px solid #f8fafc;
  transform: translate(25%, -25%);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-name {
  font-size: 13.5px;
  font-weight: 500;
  color: #334155;
}
</style>
