<template>
  <div
    :style="{
      width: width + 'vw',
      height: height + 'vw'
    }"
    class="default-cover-wrapper"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      class="icon"
      viewBox="0 0 496.06309 701.5748"
    >
      <path
        class="default-cover-svg-bg"
        :fill="backgroundColor"
        d="M 0.03197158,0.04303645 496.09937,0.07093645 496.09537,701.66272 0.02411158,701.64222 Z"
      />
      <path
        class="default-cover-svg-bottom"
        :fill=" bottomColor"
        d="m 0.02572158,431.69791 496.06457842,0.003 0.004,270.03125 -496.06028842,-0.0156 z"
      />
      <path
        class="default-cover-svg-logo"
        :fill="color"
        d="m 329.41557,534.3636 30.82836,-0.0695 c 2.80598,0.22448 8.26829,-0.15497 11.07426,5.41958 1.15981,2.20737 9.87705,19.19289 9.87705,19.19289 l 18.55688,-24.84227 26.63809,0 -31.72627,40.1068 14.36661,29.33184 -24.16883,-0.0748 -9.05396,-18.18275 -12.8701,18.3324 -26.63809,-0.2993 26.78775,-32.69901 -8.38053,-14.96522 -8.3057,0.22447 c -8.82948,-0.89792 -12.3463,-5.23783 -12.3463,-5.23783 0,0 -3.74131,-3.59165 -4.93853,-9.65257 z"
      />
    </svg>
    <p
      class="no-wrap text"
      :style="textStyle"
    >{{ text }}</p>
  </div>
</template>

<script>
import { primary } from '@/style/variables.less'
import { Flexbox } from 'vux'
export default {
  name: 'DefaultCover',
  components: {
    Flexbox
  },
  props: {
    width: {
      type: Number,
      default: 29.2
    },
    height: {
      type: Number,
      default: 41.297
    },
    text: {
      type: String,
      default: ''
    },
    backgroundColor: {
      type: String,
      default: '#d7cece'
    },
    bottomColor: {
      type: String,
      default: '#047e7e'
    },
    color: {
      type: String,
      default: primary
    }
  },
  computed: {
    textStyle() {
      const fontSize = 16 / 140 * this.width + 'vw'
      const paddingTop = 16 / 198 * this.height + 'vw'
      const paddingLeft = 10 / 140 * this.width + 'vw'
      const paddingRight = paddingLeft
      return {
        fontSize,
        paddingTop,
        paddingLeft,
        paddingRight,
        color: this.color
      }
    }
  }
}
</script>

<style lang="less" scoped>
.default-cover-wrapper {
  position: relative;
  /deep/ svg {
    width: 100%;
    height: 100%;
  }
  .text {
    position: absolute;
    text-align: center;
    top: 0;
    left: 0;
    width: 100%;
  }
}
</style>
