<script setup>
import {
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  Menu,
  Histogram,
  CaretBottom,
  HelpFilled,
  Avatar,
  PictureFilled
} from '@element-plus/icons-vue'
import { useUserInfoStore } from '@/stores/userinfo'
import { useUserStore } from '@/stores/user'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import userDefaultAvter from '@/assets/images/default.png'

const userInfoStore = useUserInfoStore()
const UserStore = useUserStore()
const defaultUserAester = ref(userDefaultAvter)
const router = useRouter()
const isCollapse = ref(false)

// 判断管理员等级
const isAdminStart = () => {
  return userInfoStore.user.grade === 0 ? true : false
}

// 跳转路由
const routerCommand = (key) => {
  console.log(key)
  if (key === 'logout') {
    ElMessageBox.confirm('你确定要退出吗?', '温馨提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        UserStore.removeToken()
        UserStore.removeDataToken()
        userInfoStore.setUserInfo({})
        router.push(`/login`)
        ElMessage({
          type: 'success',
          message: '退出成功'
        })
      })
      .catch(() => {})
  } else {
    router.push(`/user/${key}`)
  }
}

// 关闭则边栏
const closeBar = () => {
  isCollapse.value = !isCollapse.value
  console.log(isCollapse.value)
}

onMounted(() => {
  userInfoStore.getUserInfo()
})
</script>
<template>
  <el-container class="common-layout">
    <el-menu
      active-text-color="#ffd04b"
      background-color="#171717"
      :default-active="$route.path"
      text-color="#fff"
      :collapse="isCollapse"
      :collapse-transition="true"
      :router="true"
    >
      <el-row>
        <el-col :span="24">
          <h1 :class="!isCollapse ? 'max_title' : 'min_title'">生鲜配送</h1>
        </el-col>
      </el-row>
      <!-- 生鲜分类 -->
      <el-menu-item index="/article/content">
        <el-icon><Menu /></el-icon>
        <span>生鲜分类管理</span>
      </el-menu-item>
      <!-- 生鲜商品 -->
      <el-menu-item index="/goods/content">
        <el-icon><HelpFilled /></el-icon>
        <span>生鲜商品管理</span>
      </el-menu-item>
      <!-- 轮播图管理 -->
      <el-menu-item index="/home">
        <el-icon><PictureFilled /></el-icon>
        <span>轮播图管理</span>
      </el-menu-item>
      <!-- 生鲜商品详情轮播图管理 -->
      <el-menu-item index="/goods/detail">
        <el-icon><PictureFilled /></el-icon>
        <span>生鲜商品详情轮播图管理</span>
      </el-menu-item>
      <!-- 生鲜数据分析 -->
      <el-menu-item index="/data">
        <el-icon><Histogram /></el-icon>
        <span>生鲜数据分析</span>
      </el-menu-item>
      <!-- 消费者管理 -->
      <el-menu-item v-if="isAdminStart()" index="/consumer">
        <el-icon><User /></el-icon>
        <span>消费者管理</span>
      </el-menu-item>
      <!-- 成员管理 -->
      <el-menu-item v-if="isAdminStart()" index="/member">
        <el-icon><Avatar /></el-icon>
        <span>成员管理</span>
      </el-menu-item>
      <!-- 个人中心 -->
      <el-sub-menu index="/user">
        <template #title>
          <el-icon><UserFilled /></el-icon>
          <span>个人中心</span>
        </template>
        <el-menu-item index="/user/mssage">
          <el-icon><User /></el-icon>
          <span>基本资料</span>
        </el-menu-item>
        <el-menu-item index="/user/pic">
          <el-icon><Crop /></el-icon>
          <span>更换头像</span>
        </el-menu-item>
        <el-menu-item index="/user/password">
          <el-icon><EditPen /></el-icon>
          <span>重置密码</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
    <el-container class="container">
      <el-header>
        <el-row justify="space-between" class="header_menu">
          <el-col :span="12"
            >{{ isAdminStart() ? '超级' : '普通' }}管理员<strong
              >『{{ userInfoStore.user.full_name || userInfoStore.user.name }}』</strong
            >您好</el-col
          >
          <el-col :span="2" offset="10">
            <el-dropdown @command="routerCommand">
              <span class="el-dropdown-link">
                <el-avatar :src="userInfoStore.user.user_pic || defaultUserAester" />
                <el-icon class="el-icon--right">
                  <CaretBottom />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="mssage" :icon="User"
                    >基本资料</el-dropdown-item
                  >
                  <el-dropdown-item command="pic" :icon="Crop">更换头像</el-dropdown-item>
                  <el-dropdown-item command="password" :icon="EditPen"
                    >重置密码</el-dropdown-item
                  >
                  <el-dropdown-item command="logout" :icon="SwitchButton"
                    >退出登录</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-header>
      <div :class="!isCollapse ? 'closeBar' : 'openBar'" @click="closeBar">
        <el-tooltip
          :content="!isCollapse ? '关闭侧边栏' : '打开侧边栏'"
          placement="right"
        >
          <div class="closeBar_box">
            <div class="closeBar_box1"></div>
            <div class="closeBar_box2"></div>
          </div>
        </el-tooltip>
      </div>
      <el-main class="main_body">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<style scoped lang="less">
.common-layout {
  height: 100vh;
}
.header_menu {
  display: flex;
  height: 100%;
  align-items: center;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
}
.el-dropdown-link:active,
.el-dropdown-link:focus {
  outline: none;
}
.main_body {
  background-color: #e0e0e0;
}
.container {
  position: relative;
}
.openBar,
.closeBar {
  display: flex;
  position: absolute;
  top: 50%;
  justify-content: center;
  align-items: center;
  transform: translateY(-50%) rotate(0deg) translateZ(0px);
  height: 72px;
  z-index: 40;
  cursor: pointer;
  .closeBar_box {
    padding: 0 7px;
    .closeBar_box1,
    .closeBar_box2 {
      width: 4px;
      height: 12px;
      background-color: #9b9b9b;
      border-radius: 9999px;
      transition: all 0.2s;
    }
  }
}

.openBar {
  .closeBar_box {
    .closeBar_box1 {
      transform: translateY(0.15rem) rotate(-15deg) translateZ(0);
    }
    .closeBar_box2 {
      transform: translateY(-0.15rem) rotate(15deg) translateZ(0);
    }
  }
  &:hover {
    .closeBar_box1,
    .closeBar_box2 {
      background-color: #fff;
    }
  }
}
.closeBar {
  .closeBar_box {
    .closeBar_box1 {
      transform: translateY(0.15rem) rotate(0deg) translateZ(0);
    }
    .closeBar_box2 {
      transform: translateY(-0.15rem) rotate(0deg) translateZ(0);
    }
  }
  &:hover {
    .closeBar_box1,
    .closeBar_box2 {
      background-color: #fff;
    }
    .closeBar_box1 {
      transform: translateY(0.15rem) rotate(15deg) translateZ(0);
    }
    .closeBar_box2 {
      transform: translateY(-0.15rem) rotate(-15deg) translateZ(0);
    }
  }
}
h1 {
  font-size: 30px;
  font-weight: 400;
  text-align: center;
  color: #ffffff;
}
.max_title {
  padding: 30px 0;
}
.min_title {
  padding: 30px 10px 20px 10px;
}
.el-menu {
  border-right: none;
  transition: all 0.3s;
  .el-menu-item {
    &:not(.el-menu--collapse) {
      width: 260px;
    }

    &:hover {
      background-color: #2f2f2f;
    }
    &.is-active {
      background-color: #2f2f2f;
    }
  }
}
</style>
