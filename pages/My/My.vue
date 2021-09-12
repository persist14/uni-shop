<template>
	<view class="my-container" >
    <!-- 根据有无token显示对应的组件 -->
		<my-login v-if="!token" ></my-login>
    <my-userInfo v-else></my-userInfo>
	</view>
</template>

<script>
  import badgeMix from '../../mixin/tabBar-badge.js'
  import { mapState } from 'vuex'
	export default {
    mixins: [badgeMix],
		data() {
			return {
				
			}
		},
    computed: {
      ...mapState('m_user', ['token'])
    },
		methods: {
			
		}
	}
</script>

<style lang="scss" >
page, .my-container {
  height: 100%;
}
</style>
