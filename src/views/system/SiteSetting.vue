<template>
  <div style="height: 85vh">
    <el-form label-position="left" label-width="80px" style="height: 100%">
      <el-container>
        <!-- 头部菜单 -->
        <el-header>
          <el-menu mode="horizontal" default-active="1">
            <el-menu-item index="1" @click="componentName='CommonSetting'">通用</el-menu-item>
            <el-menu-item index="2" @click="componentName='FooterSetting'">页脚</el-menu-item>
            <el-menu-item index="3" @click="componentName='CardSetting'">资料卡</el-menu-item>
          </el-menu>
          <div>
            <el-button @click="save" icon="el-icon-circle-check" size="medium" type="primary">保存</el-button>
          </div>
        </el-header>
        <!-- 主内容区：动态组件 -->
        <el-main>
          <transition name="fade-transform" mode="out-in">
            <component ref="item" :is="componentName"></component>
          </transition>
        </el-main>
      </el-container>
    </el-form>
  </div>
</template>

<script>
import CardSetting from "@/components/siteSetting/CardSetting";
import CommonSetting from "@/components/siteSetting/CommonSetting";
import FooterSetting from "@/components/siteSetting/FooterSetting";

export default {
  name: "SiteSetting",

  data() {
    return {
      componentName: CommonSetting
    }
  },

  methods: {
    save() {
      this.$refs.item.updateSetting();
    }
  },

  components: {
    CardSetting,
    FooterSetting,
    CommonSetting
  }
}
</script>

<style scoped>
.el-container {
  height: 100%;
  background-color: #FFFFFF;
}

.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid rgb(241, 242, 243);
}

.el-menu {
  height: 100%;
  border-bottom: unset;
}

.el-menu-item {
  font-size: 16px;
}

.el-menu--horizontal>.el-menu-item:hover {
  background-color: unset;
}
</style>
