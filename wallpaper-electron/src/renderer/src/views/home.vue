<template>
  <div class="box">
    <img :src="store.config.url" alt="" class="img-box" @click="getWallpaper" />
    <div class="item-box">
      <div class="button-box" @click="setWallpaper">设置壁纸</div>
      <div class="button-box" style="margin-left: 20px" @click="downloadImage">下载壁纸</div>
      <div class="button-box" style="margin-left: 20px" @click="getWallPaperList">选择壁纸</div>
    </div>
    <div class="item-box">
      <el-input v-model="store.config.saveDirectory" style="height: 38px;width: 260px;" disabled></el-input>
      <div class="button-box" @click="setImageSaveDirectory" style="margin-left: 20px">
        设置目录
      </div>
    </div>
    <el-dialog v-model="isShow" width="80%" center :show-close="false" style="max-height: 400px;overflow-y: auto;">
      <div>
      <img :src="item.url" alt="" :style="{border: actvive === item.url ?  '1px solid red': ''}" v-for="(item,index) in wallpaperList" :key="index" style="width: 175px;aspect-ratio: 16 / 9;margin-left: 10px;margin-top: 20px;cursor: pointer;box-sizing: border-box;" @click="handleWallPaper(item)">
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isShow = false">取消</el-button>
          <el-button type="primary" @click="handleConfrim"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { useConfigStore } from '@renderer/store/index'
import useWallpaper from '@renderer/composable/useWallpaper'
import http from '@renderer/utils/http/index'
import { onMounted, ref } from 'vue'
const store = useConfigStore()
const { setWallpaper, setImageSaveDirectory, downloadImage } = useWallpaper()
async function getWallpaper() {
  const res = await http.get('/wallpaper')
  store.config.url = res.data.url
}
onMounted(() => {
  if (!store.config.url) getWallpaper()
})
const isShow = ref(false)
const wallpaperList = ref([])
async function getWallPaperList() {
  isShow.value = true
  const res = await http.get('/wallpaper/all')
  wallpaperList.value = res.data.list
  actvive.value = store.config.url
}
const actvive =ref('')
function handleWallPaper (e) {
  actvive.value =  e.url
}
function handleConfrim () {
  store.config.url = actvive.value
  isShow.value = false
  setWallpaper()
}
</script>

<style lang="scss" scoped>
.item-box {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .img-box {
    aspect-ratio: 16 / 9;
    width: 100%;
    cursor: pointer;
  }
  .button-box {
    width: fit-content;
    min-width: 100px;
    padding: 8px;
    border-radius: 5px;
    border: 2.5px solid #e0e1e4;
    box-shadow: 0px 0px 20px -20px;
    cursor: pointer;
    background-color: white;
    transition: all 0.2s ease-in-out 0ms;
    user-select: none;
    font-family: 'Poppins', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      background-color: #f2f2f2;
      box-shadow: 0px 0px 20px -18px;
    }

    &:active {
      transform: scale(0.95);
    }
  }
}
</style>
