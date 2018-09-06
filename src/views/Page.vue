<template>
    <div class="home main-container" :style="{minHeight:height+'px'}">
        <img :src="imgUrl" alt="">
        <div class="mv-wrap" v-if="id=='10'">
            <div class="mv">
                <div class="mv-content">
                    <p>精彩视频</p>
                    <p>Vedio</p>
                    <div class="detail">
                        U radu se iznose osnovneku teoriju. Ukteoriju. Uk teoriju. Uk azuje se na problemati...
                    </div>
                    <a href="#">
                        <span>ALL PRODUCTS -></span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
		data: function () {
			return {
				height: '',
				imgUrl: '',
				id: '',
			}
		},
		watch: {
			$route: function () {
				this.get_img_url();
			}
		},
		created: function () {
			this.get_img_url();
			this.height = document.documentElement.clientHeight - 149;
			if (!this.id) {
				this.$router.push('/page/10');
			}

		},
		methods: {
			get_img_url: function () {
				var _this = this;
				this.id = this.$route.params.id;
				$.ajax({
					type: 'post',
					url: 'http://116.55.233.249/Ajax/X.ashx',
					dataType: 'json',
					data: {
						c: 1000
					},
					success: function (res) {
						if (res.Success == true) {
							var submenu = res.DSet.Table2,
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
										obj[i].push(ary[j]);
									}
								}
							}
							for (var i in obj2) {
								for (j in obj) {
									if (obj[j][0]['大类编号'] == i) {
										obj2[i].push(obj[j]);
									}
								}
							}
							var data = {
								headers: res.DSet.Table1,
								submenu: obj2
							}
							if (_this.id < 1000) {
								for (var i in data.headers) {
									if (data.headers[i]['大类编号'] == _this.$route.params.id) {
										_this.imgUrl = data.headers[i]['背景图'];
									}
								}
							} else {
								for (var i in data.submenu) {
									for (var j in data.submenu[i]) {
										for (var k in data.submenu[i][j]) {
											if (data.submenu[i][j][k]['类别编号'] == _this.$route.params.id) {
												_this.imgUrl = data.submenu[i][j][k]['背景图'];
											}
										}

									}

								}
							}
						}
					},
					error: function (err) {
						console.log('获取数据失败：' + err);
					}
				});
			}
		},

	}
</script>
<style>
    .home {
        width: 1158px;
        margin: 0 auto;
        text-align: center;
        position: relative;
    }

    .home > img {
        display: inline-block;
        width: 1158px;

    }

    .mv-wrap {
        width: 100%;
        height: 290px;
        position: absolute;
        top: 460px;
        overflow: hidden;
    }

    .mv {
        width: 240px;
        height: 290px;
        background: #000;
        margin: 0 auto;
        overflow: hidden;
        border-radius: 8px;
        color: #fff;
    }

    .mv .mv-content {
        width: 150px;
        margin: 30px auto 0;
    }

    .mv-content p {
        font-size: 20px;
        font-weight: 400;
        text-align: left;
    }

    .mv-content .detail {
        text-align: left;
        font-size: 12px;
        margin: 18px 0 30px;
    }

    .mv-content a {
        color: #fff;
        display: block;
        width: 100%;
        height: 50px;
        line-height: 50px;
        border: 1px solid #ccc;
    }

    .mv-content a span {
        font-size: 16px;
        display: inline-block;
        -webkit-transform: scale(0.6);
        font-weight: 500;
    }
</style>


