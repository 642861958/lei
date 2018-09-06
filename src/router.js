import Vue from 'vue'
import Router from 'vue-router'
import Tea from './views/Tea.vue'
import ProductList from './views/ProductList.vue'
import Detail from './views/Detail.vue'
import Page from './views/Page.vue'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			redirect:'/page/10'
		},
		{
			path: '/page/:id',
			name: 'page',
			component: Page
		},
		{
			path: '/tea',
			name: 'tea',
			component: Tea
		},
		{
			path: '/productList/:cid',
			name: 'productList',
			component: ProductList
		},
		{
			path: '/detail/:pid',
			name: 'detail',
			component: Detail
		},
		{
			path:'*',
			redirect:'/page/10'
		}

	]
})
