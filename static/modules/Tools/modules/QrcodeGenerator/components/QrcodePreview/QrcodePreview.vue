<template>
  <div class="qrcode-preview-box">
    <div class="qrcode-content">
      <div class="guide-wrap" v-if="!url">
        <div class="guide-wrap-text">
          <p class="content">左侧输入内容</p>
          <p class="content">点击生成二维码</p>
        </div>
      </div>
      <div class="qrimage-wrap" v-if="url">
        <div class="thumbnail">
          <img class="qrimage" :src="url" />
        </div>
        <div class="btn-group dropdown">
          <button class="btn btn-download" @click="onDownload">下载</button>
          <button class="btn btn-more"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    url: {
      type: String
    }
  },
  methods: {
    onDownload () {
      this.$emit('download')
    }
  }
}
</script>

<style scoped lang="less">
@import './QrcodePreview';
</style>

<style lang="less">
@import './QrcodePreviewModule';
</style>
