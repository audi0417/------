// ===== 初始化設定 =====
axios.defaults.headers.common['X-CSRF-TOKEN'] = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute('content');
    
document.addEventListener("DOMContentLoaded", function() {
    initSidebar();
    initEventListeners();
    registerRoutes();
  });
  
  // ===== 側邊欄控制 =====
  function initSidebar() {
    const sidebarToggle = document.getElementById("sidebar-toggle");
    const sidebar = document.querySelector(".sidebar");
  
    // 切換側邊欄
    sidebarToggle?.addEventListener("click", () => {
      sidebar?.classList.toggle("active");
    });
  
    // 點擊外部關閉
    document.addEventListener("click", (e) => {
      if (
        sidebar &&
        !sidebar.contains(e.target) &&
        sidebarToggle &&
        !sidebarToggle.contains(e.target) &&
        window.innerWidth <= 768
      ) {
        sidebar.classList.remove("active");
      }
    });
  
    // 響應式處理
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        sidebar?.classList.remove("active");
      }
    });
  }
  
  // ===== 事件監聽初始化 =====
  function initEventListeners() {
    // 導航事件
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const page = link.getAttribute("href").substring(1);
        router.navigateTo(page);
      });
    });
  }
  
  // ===== 路由管理 =====
  class Router {
    constructor() {
      this.routes = {};
      this.currentPage = "";
      this.currentCleanup = null;
      
      window.addEventListener("hashchange", this.handleRoute.bind(this));
      window.addEventListener("load", this.handleRoute.bind(this));
    }
  
    addRoute(path, handler) {
      this.routes[path] = handler;
    }
  
    async handleRoute() {
      try {
        // 執行清理函數
        if (this.currentCleanup) {
          this.currentCleanup();
          this.currentCleanup = null;
        }
  
        // 獲取當前路徑
        const hash = window.location.hash.slice(1) || "dashboard";
        this.currentPage = hash;
        
        // 更新導航
        this.updateNavigation();
  
        const mainContent = document.querySelector(".main-content");
        
        // 檢查是否有註冊的路由處理器
        if (this.routes[hash]) {
          try {
            const cleanupFunc = await this.routes[hash]();
            if (typeof cleanupFunc === "function") {
              this.currentCleanup = cleanupFunc;
            }
          } catch (error) {
            console.error("頁面載入失敗:", error);
            mainContent.innerHTML = '<div class="error-message">頁面載入失敗</div>';
          }
        } else {
          showError(`找不到頁面: ${hash}`);
        }
  
      } catch (error) {
        console.error("路由處理失敗:", error);
        showError("頁面載入失敗");
      }
    }
  
    updateNavigation() {
      document.querySelectorAll(".nav-links a").forEach((link) => {
        const page = link.getAttribute("href").substring(1) || "dashboard";
        const listItem = link.parentElement;
  
        if (page === this.currentPage) {
          listItem.classList.add("active");
        } else {
          listItem.classList.remove("active");
        }
      });
    }
  
    navigateTo(path) {
      window.location.hash = path;
    }
  }
  
  // ===== 路由註冊 =====
  function registerRoutes() {
    // Dashboard 路由
    router.addRoute("dashboard", async () => {
      const mainContent = document.querySelector(".main-content");
      try {
        const response = await fetch("../../../../frontend/src/pages/admin/dashboard.html");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        mainContent.innerHTML = html;
      } catch (error) {
        console.error("載入儀表板失敗:", error);
        mainContent.innerHTML = '<div class="error-message">載入失敗</div>';
      }
    });
  
    // 預約管理路由
    router.addRoute("appointments", async () => {
      const mainContent = document.querySelector(".main-content");
      try {
        const response = await fetch("../../../../frontend/src/pages/admin/appointments.html");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        mainContent.innerHTML = html;
        // 返回清理函數
        return () => {
          // 在這裡執行必要的清理工作
        };
      } catch (error) {
        console.error("載入預約管理失敗:", error);
        mainContent.innerHTML = '<div class="error-message">載入失敗</div>';
      }
    });
  
    // 會員管理路由
    router.addRoute("members", async () => {
      const mainContent = document.querySelector(".main-content");
      try {
        const response = await fetch("../../../../frontend/src/pages/admin/members.html");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        mainContent.innerHTML = html;
      } catch (error) {
        console.error("載入會員管理失敗:", error);
        mainContent.innerHTML = '<div class="error-message">載入失敗</div>';
      }
    });
  
    // 服務項目路由
    router.addRoute("services", async () => {
      const mainContent = document.querySelector(".main-content");
      try {
        const response = await fetch("../../../../frontend/src/pages/admin/services.html");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        mainContent.innerHTML = html;
      } catch (error) {
        console.error("載入服務項目失敗:", error);
        mainContent.innerHTML = '<div class="error-message">載入失敗</div>';
      }
    });
  
    // 作品集路由
    router.addRoute("portfolio", async () => {
      const mainContent = document.querySelector(".main-content");
      try {
        const response = await fetch("../../../../frontend/src/pages/admin/portfolio.html");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        mainContent.innerHTML = html;
      } catch (error) {
        console.error("載入作品集失敗:", error);
        mainContent.innerHTML = '<div class="error-message">載入失敗</div>';
      }
    });
  
  
    // 系統設定路由
    router.addRoute("settings", async () => {
      const mainContent = document.querySelector(".main-content");
      try {
        const response = await fetch("../../../../frontend/src/pages/admin/settings.html");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        mainContent.innerHTML = html;
      } catch (error) {
        console.error("載入系統設定失敗:", error);
        mainContent.innerHTML = '<div class="error-message">載入失敗</div>';
      }
    });
  }
  
  // ===== 工具函數 =====
  // 日期格式化
  function formatDate(date) {
    return new Date(date).toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  
  // 金額格式化
  function formatCurrency(amount) {
    return new Intl.NumberFormat("zh-TW", {
      style: "currency",
      currency: "TWD",
    }).format(amount);
  }
  
  // ===== 通知處理 =====
  function showNotification(message, type = "info") {
    const notificationDiv = document.createElement("div");
    notificationDiv.className = `notification ${type}`;
    notificationDiv.textContent = message;
    
    document.body.appendChild(notificationDiv);
    
    setTimeout(() => {
      notificationDiv.remove();
    }, 3000);
  }
  
  // ===== 錯誤處理 =====
  function showError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "alert alert-danger";
    errorDiv.role = "alert";
    errorDiv.textContent = message;
    
    const mainContent = document.querySelector(".main-content");
    mainContent.prepend(errorDiv);
  
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }
  
  // ===== API 請求封裝 =====
  const API = {
    async get(endpoint) {
      try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
      } catch (error) {
        console.error("API 請求失敗:", error);
        throw error;
      }
    },
  
    async post(endpoint, data) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
      } catch (error) {
        console.error("API 請求失敗:", error);
        throw error;
      }
    }
  };
  
  // ===== 實例化路由 =====
  const router = new Router();
  
  // ===== 檢查初始路由 =====
  window.addEventListener("load", () => {
    if (!window.location.hash) {
      window.location.hash = "#dashboard";
    }
  });