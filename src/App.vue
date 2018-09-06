<template>
    <div id="app">
        <div id="nav">
            <!--头部导航-->
            <div class="header">
                <div class="header-wrap">
                    <div class="header-title">
                        <a><img alt="logo" src="./assets/logo.png"></a>
                        <span class="tip" text="探险家的精神伴侣">探险家的精神伴侣</span>
                    </div>
                    <ul>
                        <router-link
                            tag="li"
                            :to="getUrl(list['大类编号'])"
                            v-for="(list,index) in headers"
                            :key="index"
                            @mouseover.native="change_subMenu(list['大类编号'])"
                            @click.native="hide_sub(list['大类编号'])"
                            :class="active==list['大类编号']?'active':''">{{list['大类名称']}}
                        </router-link>
                    </ul>
                    <span class="header-len">语言</span>
                </div>
            </div>
        </div>
        <div id="main" :style="{minHeight: height+'px',background:id==10?'#000':'#fff'}">
            <!--二级菜单-->
            <div class="sub-menu-wrap" >
                <div class="sub-menu" @click="hide_subMenu" v-if="isShow" @mouseleave="hide_subMenu">
                    <template v-for="(item,key) in menu2">
                        <ul :key="key" v-if="item.length<10">
                            <router-link
                                v-for="(list,key1) in item"
                                :key="list['类别编号']"
                                tag="li"
                                :to="getUrl2(list)"
                                :class="key1==0?'sub-menu-title':''"
                                @click.native='change_header_active(active_hover)'>
                                <a href="#">{{list['类别名称']}}</a>
                            </router-link>
                        </ul>
                        <!--特殊要求最后一列(分割添加class incise)-->
                        <ul v-else class="incise" :key="key">
                            <router-link
                                v-for="(list,key2) in item"
                                :key="list['类别编号']"
                                tag="li"
                                :to="getUrl2(list)"
                                :class="[key2<(item.length+2)/2?'left':'right',key2==0?'sub-menu-title':'']"
                                :style="{top:key2<(item.length+2)/2?24*(key2)+'px':24*(Math.ceil(key2-item.length/2)-item.length%2)+'px'}"
                                @click.native='change_header_active(active_hover)'>
                                <a href="#">{{list['类别名称']}}</a>
                            </router-link>
                        </ul>
                        <div class="line"></div>
                    </template>
                </div>
            </div>
            <!--路由-->
            <router-view/>
        </div>
        <!--底部-->
        <div class="footer">
            <div class="footer-wrap">
                <ul class="footer-link">
                    <li><a href="#">联系我们</a></li>
                    <li><a href="#">时事通讯</a></li>
                    <li><a href="#">社交网络</a></li>
                    <li><a href="#" @click="show_map()">网站地图</a></li>
                    <li><a href="#">法律声明</a></li>
                </ul>
                <div class="search">
                    <input type="text" placeholder="查找">
                    <button>GO</button>
                </div>
                <div class="footer-hint">
                    <img alt="Vue logo" src="./assets/icon_1.jpg">
                    <span>酒精对身体有害,请适度引用</span>
                    <img alt="Vue logo" src="./assets/icon_1.jpg">
                </div>
            </div>
            <div class="web-map" v-if="showMap" @click="hide_map()">
                <ul>
                    <li v-for="(item,index1) in menu" :key="index1">
                        <div>
                            <ul v-for="(lists,index2) in item" :key="index2" v-if="lists.length<12">
                                <router-link
                                    v-for="(list,index3) in lists"
                                    :key="index3"
                                    tag="li"
                                    :to="getUrl2(list)"
                                    :class="index3==0?'map-title':''">
                                    {{list['类别名称']}}
                                </router-link>
                            </ul>
                        </div>
                        <div v-for="(lists,index2) in item" :key="index2" v-if="lists.length>11">
                            <ul>
                                <router-link
                                    v-for="(list,index3) in lists"
                                    :key="index3"
                                    tag="li"
                                    :to="getUrl2(list)"
                                    :class="index3==0?'map-title':''">
                                    {{list['类别名称']}}
                                </router-link>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
		data() {
			return {
				headers: null,
				submenu: null,
				height: null,
				id: null,
				menu: null,
				menu2: null,
			}
		},
		created: function () {
			var str = this.$route.path.slice(1, 5),
				_this = this,
				val;
			if (str == 'page') {
				val = this.$route.params.id.slice(0, 2);
			} else {
				val = 30;
			}
			this.$store.commit('change', val);//切换导航状态
			this.height = document.documentElement.clientHeight - 149;//设置main的高度
			this.$store.commit('set_height', this.height);
			this.id = this.$route.params.id;
//			请求导航数据
			$.ajax({
				type: 'post',
				url: 'http://116.55.233.249/Ajax/X.ashx',
				dataType: 'json',
				data: {
					c: 1000
				},
				success: function (data) {
					if (data.Success == true) {
						var submenu = data.DSet.Table2,
							ary = [],
							obj = {},
							obj2 = {
								'10': [],
								'20': [],
								'30': [],
								'40': [],
								'50': [],
							};
						for (var i in submenu) {
							if (submenu[i]['类别编号'].length == 4) {
								obj[submenu[i]['类别编号']] = [];
							}
							ary.push(submenu[i]);
						}

						for (var i in obj) {
							for (var j in ary) {
								if (ary[j]['类别编号'].slice(0, 4) == i) {
									obj[i].push(ary[j])
								}
							}
						}
						for (var i in obj2) {
							for (j in obj) {
								if (obj[j][0]['大类编号'] == i) {
									obj2[i].push(obj[j])
								}
							}
						}
						_this.headers = data.DSet.Table1;
						_this.submenu = obj2;
					}
				},
				error: function (data) {
					console.log('获取数据失败：' + data);
				}
			});
		},
		watch: {
			$route: function () {
				this.id = this.$route.params.id;
			},
			submenu: function () {
				this.menu = this.submenu;
			},
//          鼠标滑动
			active_hover: function () {
				this.set_menu();
			},
		},
		computed: {
//			导航激活
			active: function () {
				return this.$store.state.active;
			},
//            显示子菜单
			isShow: function () {
				return this.$store.state.isShow_subMenu;
			},
//            鼠标滑动
			active_hover: function () {
				return this.$store.state.active_hover;
			},
//            网站地图显示
			showMap: function () {
				return this.$store.state.showMap;
			},
		},
		methods: {
//			导航事件
//			点击事件 激活标记，隐藏子菜单(标记index)
			hide_sub: function (val) {
				this.$store.commit('change', val);
				this.$store.commit('hide_map');
			},
//			hover事件，显示子菜单，
			change_subMenu: function (val) {
				this.$store.commit('change_hover', val);
				this.$store.commit('show_subMenu');
			},
//          hide子菜单
			hide_subMenu: function () {
				this.$store.commit('hide_subMenu');
			},
//          切换二级菜单
			change_header_active: function (val) {
				this.$store.commit('change', val);
			},
//          设置path地址
			getUrl: function (val) {
				switch (val) {
					case '30':
						return '/tea';
						break;
					default:
						return '/page/' + val;
						break;
				}
			},
//          网站地图
			show_map: function () {
				this.$store.commit('show_map');
			},
//          hide网站地图
			hide_map: function () {
				this.$store.commit('hide_map');
			},
			getUrl2: function (list) {
				switch (list['大类编号']) {
					case '30':
						return '/productList/' + list['类别编号'];
						break;
					default:
						return '/page/' + list['类别编号'];
						break;
				}
			},
//          更新子菜单
			set_menu: function () {
				for (var i in this.submenu) {
					if (i == this.active_hover) {
						this.$set(this.$data, 'menu2', this.submenu[i])
					}
				}
			}

		}
	}

</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #main {
        position: relative;
    }

    .header {
        width: 100%;
        border-top: 4px solid #e4bc00;
        background: #000;
    }

    .header-wrap {
        width: 1158px;
        height: 43px;
        line-height: 43px;
        margin: 0 auto;
        color: #fff;
        position: relative;
    }

    .header-wrap .header-title {
        float: left;
    }

    .header-title a {
        margin-right: 16px;
    }

    .header-title img {
        margin-top: 13px;
    }

    .header-title .tip {
        position: relative;
        color: #000;
        display: inline-block;
        height: 22px;
        vertical-align: middle;
        line-height: 22px;
    }

    .header-title .tip:before {
        content: attr(text);
        position: absolute;
        z-index: 10;
        color: #fff;
        -webkit-mask: linear-gradient(to bottom, #fff, transparent);
    }

    .header-wrap .header-len {
        float: right;
        color: #ccc;
    }

    .header ul {
        float: left;
        margin-left: 100px;
        position: relative;
    }

    .header ul li {
        float: left;
        margin: 0 12px;
        height: 43px;
        font-size: 16px;
        color: #ccc;
        box-sizing: border-box;
        border-bottom: 4px solid transparent;
    }

    .header ul li:hover {
        cursor: pointer;
        border-bottom-color: #e4bc00;
    }

    .header ul li.active {
        border-bottom-color: #e4bc00;
    }

    /*二级导航*/
    .sub-menu-wrap {
        width: 1157px;
        margin: 0 auto;
        position: relative;
        z-index: 2;
    }

    .sub-menu {
        width: 100%;
        min-height: 323px;
        background: rgba(0, 0, 0, 0.8);
        position: absolute;
        top: 0;
        display: flex;
        flex-direction: row;
        justify-content: center;

    }

    .sub-menu li.sub-menu-title {
        width: 100% !important;
    }

    .sub-menu li.sub-menu-title a {
        font-size: 14px;
    }

    .sub-menu div.line {
        height: 145px;
        margin-top: 16px;
        width: 1px;
        background: #999
    }

    .sub-menu div.line:last-child {
        display: none;
    }

    .sub-menu ul {
        margin-top: 14px;
    }

    .sub-menu ul li {
        width: 100%;
        height: 24px;
        line-height: 24px;
        text-align: left;
        box-sizing: border-box;
    }

    .sub-menu li a {
        display: block;
        padding: 0 22px;
        font-size: 12px;
        color: #ccc;
    }

    .sub-menu li a:hover {
        color: #e4bc00;
    }

    .sub-menu ul.incise {
        position: relative;
        width: 232px;
    }

    .sub-menu ul.incise li {
        position: absolute;
        width: 50%;
    }

    .sub-menu ul.incise li.left {
        left: 0
    }

    .sub-menu ul.incise li.right {
        right: 16px;
    }

    /*底部*/
    .footer {
        width: 100%;
        background: #000;

    }

    .footer-wrap {
        width: 1158px;
        height: 102px;
        margin: 0 auto;
        color: #fff;
        position: relative;
    }

    ul.footer-link {
        float: left;
        overflow: hidden;
        margin: 10px 0 20px;
    }

    ul.footer-link li {
        list-style: none;
        float: left;
        height: 16px;
        padding: 0 14px;
        font-size: 12px;
        border-right: 1px solid #ccc;
        box-sizing: border-box;
    }

    ul.footer-link li a {
        color: #ccc;
    }

    ul.footer-link li:hover {
        cursor: pointer;
    }

    ul.footer-link li.active {
        border-bottom-color: #e4bc00;
    }

    .footer .search {
        float: right;
        width: 160px;
        height: 28px;
        margin: 10px;

    }

    .footer .search input {
        padding: 0;
        width: 132px;
        height: 28px;
        border: none;
        outline: none;
        background: #111;
        color: #b8b8b8;
        text-indent: 6px;
    }

    .footer .search button {
        padding: 0;
        width: 26px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        background: #282828;
        color: #b8b8b8;
        border: none;
        outline: none;
        box-sizing: border-box;
        cursor: pointer;
    }

    .footer-hint {
        clear: both;
        margin-left: 60px;
        height: 30px;
        line-height: 30px;
        text-align: left;
        font-size: 14px;
        color: #ccc;
    }

    .footer-hint img {
        width: 30px;
        height: 30px;
        margin: 0 14px;
    }

    .footer .web-map {
        position: absolute;
        width: 100%;
        top: 47px;
        height: 775px;
        background: rgba(0, 0, 0, 0.8);
        z-index: 99;
    }

    .footer .web-map > ul {
        display: inline-block;
        margin-top: 35px;
    }

    .footer .web-map > ul > li {
        float: left;
        color: #fff;
        line-height: 26px;
    }

    .footer .web-map li > div {
        float: left;
    }

    .footer .web-map li li {
        float: none;
        font-size: 14px;
        text-align: left;
        padding-right: 40px;
        cursor: pointer;
    }

    .footer .map-title {
        font-size: 16px !important;
        color: #e4bc00;
    }
</style>
