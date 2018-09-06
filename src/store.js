import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		active: 10,
		active_hover: 10,
		isShow_subMenu: false,
		showMap: false,
		height: 600,
	},
	mutations: {
		change: function (state, a) {
			state.active = a;
		},
		change_hover: function (state, a) {
			state.active_hover = a;
		},
		show_subMenu: function (state) {
			state.isShow_subMenu = true;
		},
		hide_subMenu: function (state) {
			state.isShow_subMenu = false;
		},
		show_map: function (state) {
			state.showMap = true;
		},
		hide_map: function (state) {
			state.showMap = false;
		},
		set_height: function (state, n) {
			state.height = n;
		},
	}
})
