<template>
  <div class="qrcode-tools-panel basic-tools-panel">
    <div class="two-item-preline">
      <div class="basic-property-item">
        <label class="property-item-title">前景：</label>
        <div class="property-item-content">
          <template>
            <color-picker :value="foreground" @submit="onChooseForeground"></color-picker>
          </template>
        </div>
      </div>
      <div class="basic-property-item">
        <label class="property-item-title">背景：</label>
        <div class="property-item-content">
          <template>
            <color-picker :value="background" @submit="onChooseBackground"></color-picker>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ColorPicker from '../../../../../../components/ColorPicker/ColorPicker'

export default {
  data () {
    return {}
  },
  props: {
    foreground: String,
    background: String
  },
  methods: {
    onChooseForeground (foreground) {
      this.$emit('onSetForeground', foreground)
    },
    onChooseBackground (background) {
      this.$emit('onSetBackground', background)
    }
  },
  components: { ColorPicker }
}
</script>

<style scoped lang="less">
@import './ColorToolsPanel';
</style>
