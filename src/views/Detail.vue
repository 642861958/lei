<template>
    <div class="detail" v-if="data" :key="num">
        <div class="left">
            <div class="top">
                <div class="banner-1">
                    <i class="icon icon-up" @click="changeImg1(-1,arr.length)"></i>
                    <div>
                        <ul :style="{top:num1<-3?'-80px':0}">
                            <li v-for="(list,key) in arr" :class="key==-num1?'active':''" :key="key" @click="num1=-key">
                                <div>
                                    <img width="70" height="70" :src="list['商品图']" alt="">
                                </div>
                            </li>
                        </ul>
                    </div>
                    <i class="icon icon-down" @click="changeImg1(1,arr.length)"></i>
                </div>
                <div class="banner-2">
                    <div class="scale">
                        <a v-if="arr.length" :href="arr[-num1]['商品图']" target="_blank"></a>
                    </div>
                    <div class="banner-2-wrap">
                        <i class="icon icon-left" @click="changeImg1(-1,arr.length)"></i>
                        <div class="img">
                            <ul :style="{width:620*arr.length+'px',left:num1*620+'px'}">
                                <li v-for="(list,key) in arr" :key="key"><img height="350" :src="list['商品图']" alt="">
                                </li>
                            </ul>
                        </div>
                        <i class="icon icon-right" @click="changeImg1(1,arr.length)"></i>
                    </div>
                </div>
                <div class="possible">
                    <p>你可能喜欢</p>
                    <div>
                        <i class="icon icon-left" @click="changeImg2(-1,8)"></i>
                        <div class="possible-wrap">
                            <ul :style="{left:num2*192+'px',width:192*8+'px'}">
                                <router-link
                                    v-for="(item,key) in data.DSet.Table3"
                                    tag="li"
                                    :to="'/detail/'+item['商品编号']"
                                    :style="{left:key*192+'px'}"
                                    :key="key"
                                >
                                    <a href="">
                                        <img :src="item['缩略图']" alt="">
                                        <p>{{item['商品名称']}}</p>
                                    </a>
                                </router-link>
                            </ul>
                        </div>
                        <i class="icon icon-right" @click="changeImg2(1,data.DSet.Table3.length)"></i>
                    </div>
                </div>
            </div>
            <div class="detail-info" v-if="data" v-html="data.Data['商品详情']">

            </div>
        </div>
        <!--右侧详情-->
        <ul class="right">
            <li class="title">{{data.Data['商品名称']}}</li>
            <li class="tip">规格：{{data.Data['规格']}}</li>
            <li>
                <div class="choose-year" @click="year_option=!year_option">
                    请选择一个年份
                    <i class="icon icon-down"></i>
                    <ul class="year-option" v-if="year_option">
                        <router-link
                            tag="li"
                            v-for="(item,index) in data.DSet.Table2"
                            :key="index"
                            :to="'/detail/' + item['商品编号']"
                        >
                            {{item['年份']}}年
                        </router-link>
                    </ul>
                </div>
                <div class="price">￥{{data.Data['零售价']}}</div>
                <div class="buy">立即购买</div>
                <div class="share">
                    <span><i class="icon-share">&nbsp;</i>分享</span>
                    <span><i class="icon-heart">&nbsp;</i>添加至愿望清单</span>
                </div>
            </li>
            <li class="findshop">
                寻找一家专卖店
            </li>
            <ul class="info">
                <li class="product-detail" @click="product_detail=!product_detail"><i></i> 详细特征
                    <div :style="{height:product_detail?'120px':0}">
                        {{data.Data['详细特征']}}
                    </div>
                </li>
                <li @click="show_modal(1)"><i></i> 产品的存放</li>
                <li @click="show_modal(2)"><i></i> 配送服务</li>
                <li @click="show_modal(3)"><i></i> 专卖店取货</li>
                <li @click="show_modal(4)"><i></i> 支付方式</li>
                <li @click="show_modal(5)"><i></i> 退换货服务</li>
                <li @click="show_modal(6)"><i></i> 顾客服务</li>
            </ul>
        </ul>
        <!--弹出框-->
        <div class="modal" v-if="modal">
            <div class="modal-1" @click="modal=false"></div>
            <div class="modal-2">
                <div class="card">
                    <button @click="modal=false">X</button>
                    <div class="container">
                        <h1>{{title}}</h1>
                        <div class="line"></div>
                        <div class="content" v-html="modalContent">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
		data: function () {
			return {
				data: null,
				arr: null,
				num: 0,
				num1: 0,//商品轮播图
				num2: 0,//可能喜欢轮播图
				year_option: false,
				product_detail: false,
				modal: false,
				title: '',//弹窗标题
				modalContent: '',//弹窗内容
			}
		},
		methods: {
//	        控制商品轮播图(前后,图片个数)
			changeImg1: function (num, len) {
				if (num == -1) {
					if (this.num1 != 0) {
						this.num1++;
					}
				} else if (num == 1) {
					if (this.num1 > -(len - 1)) {
						this.num1--;
					}
				}
			},
//        	控制可能喜欢轮播图(前后,图片个数)
			changeImg2: function (num, len) {
				if (num == -1) {
					if (this.num2 != 0) {
						this.num2++;
					}
				} else if (num == 1) {
					if (this.num2 > -(len - 4)) {
						this.num2--;
					}
				}
			},
//			获取数据
			getData: function (c, year) {
				var _this = this;
				var da = {
					c: c || 1002,
					pid: this.$route.params.pid
				}
				if (year) {
					da.year = year;
				}
				$.ajax({
					type: 'post',
					url: 'http://116.55.233.249/Ajax/X.ashx',
					dataType: 'json',
					data: da,
					success: function (data) {
						if (data.Success == true) {
							var arr1 = [],
								n = 0,
								timer;
							for (let i in data.DSet.Table1) {
//								判断图片高度(若图片高度小于10，就不加载图片)
								let img = new Image();
								img.src = data.DSet.Table1[i]['商品图'];
								img.onload = function () {
									if (img.height > 10) {
										arr1.push(data.DSet.Table1[i])
									}
									n++;
								}
							}
							timer = setInterval(function () {
								if (n > 4) {
									data.DSet.Table1 = arr1;
									_this.$set(_this.$data, 'data', data);
									_this.arr = _this.data.DSet.Table1;
									_this.num++;
									clearInterval(timer);
								}
							}, 10)
						}
					},
					error: function (data) {
						console.log('获取商品详情失败：'+data)
					}
				})
			},
//          显示弹出窗
			show_modal: function (n) {
				switch (n) {
					case 1:
						this.title = '产品的存放';
						this.modalContent = this.data.Data['产品的存放'];
						break;
					case 2:
						this.title = '配送服务';
						this.modalContent = this.data.Data['配送服务'];
						break;
					case 3:
						this.title = '专卖店取货';
						this.modalContent = this.data.Data['专卖店取货'];
						break;
					case 4:
						this.title = '支付方式';
						this.modalContent = this.data.Data['支付方式'];
						break;
					case 5:
						this.title = '退换货服务';
						this.modalContent = '一旦付款确认并且您的订单已被接受，除非您选择到提供“线上购买，专卖店取货”服务的专卖店取货，否则您订购的产品将由我们的合作快递服务公司递送到您下单时提供给我们的地址。如果因为您向我们提供的地址不正确或不完整导致我们无法及时递送您的订单，我们不承担因此产生的任何责任。请注意，我们的递送仅限于中国大陆（不包括香港特别行政区、澳门特别行政区和台湾地区）。产品可以递送的地区还取决于我们合作的快递服务公司是否有能力送达。<br><br>如果所提供的地址无人能够接收递送产品，您需联系我们的顾客服务中心，以便安排其他递送日期递送产品。如果自我们通知您产品已发运之日（含该日）起三十（30）天内无法联系到您，订单将取消，未递送的产品的购买金额将自动按照您购买产品的付款方式原路径退回。<br><br>在接收产品时，您可能会被要求出示通知您产品已发货的短信或电子邮件。<br><br>在订单产品作为礼品的情况下，您可以安排产品递送到您选择的第三方，但前提是递送地址满足上文中规定的要求。<br><br>只有当我们收到产品付款，且您的订单已被我们接受时，我们才会发货。在您的订单被接受后，我们将尽快递送产品。我们指定的任何交货日期或时间只是我们的最佳估计，我们不因任何合理的或不可避免的递送延迟而对您遭受的任何损失或损害承担责任。<br><br>请注意，所有包含将递送给您的产品的包裹将在发运前由我们称重。<br><br>一旦我们将产品递送到您提供给我们的地址时，或者如您选择“线上购买，专卖店取货”服务，专卖店将产品交付给取货人时，产品的所有权和产品损坏的风险将转移给您。<br><br>若签收时发现包裹破损，您有权拒收产品并请联系顾客服务中心。在产品损坏的情况下，请联系顾客服务中心。对于“线上购买，专卖店取货”的产品，请在提取产品时检查是否有任何损坏，如有损坏，请立即告知专卖店员工。<br><br>有关条款详情请参阅《路易威登中国网络销售条款》\n'
						break;
					case 6:
						this.title = '顾客服务';
						this.modalContent = this.data.Data['顾客服务'];
						break;

				}
				this.modal = true;
			}
		},
		watch: {
//			路由参数变化，初始化数据
			$route: function (to, from) {
				this.num1 = 0;
				this.num2 = 0;
				this.getData();
			}
		},
		created: function () {
			this.getData();
		}

	}
</script>
<style scoped>
    .modal {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        display: table;
        height: 100%;
        width: 100%;
        z-index: 99999;
    }

    .modal-1 {
        background-color: #000;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: -100px;
        -ms-filter: progid:DXImageTransform.Microsoft.Alpha(opacity=70);
        filter: alpha(opacity=70);
        -moz-opacity: .7;
        -khtml-opacity: .7;
        opacity: .7;
        z-index: -1;
    }

    .modal .modal-2 {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
    }

    .modal .card {
        width: 60%;
        position: relative;
        background: #fff;
        margin: 0 auto;
        overflow-y: auto;
        padding: 20px;
        display: inline-block;
        max-height: 75vh;
    }

    .card button {
        float: right;
        width: 30px;
        height: 30px;
        cursor: pointer;
        border: 0;
        margin: 0;
        background: transparent;
        font-family: inherit;
        font-size: inherit;
    }

    .card button:focus {
        outline: none;
    }

    .card .container {
        padding: 20px;
        clear: both;
    }

    .card .container .line {
        width: 100%;
        border-bottom: #a5a5aa 1px solid;
        margin-bottom: 25px;
    }

    .card .container h1 {
        color: #5e5e60;
        text-transform: uppercase;
        font-size: 1.125em;
        padding: 0;
        list-style: none;
        vertical-align: baseline;
        text-align: left;

    }

    .card .content {
        max-height: calc(100vh - 250px);
        overflow-y: auto;
        overflow-x: hidden;
        font-size: .75em;
        color: #5e5e60;
        text-align: left;
    }

    .detail {
        width: 1158px;
        margin: 0 auto;
        position: relative;
        overflow: hidden;
    }

    .detail .left {
        float: left;
        width: 840px;
        margin-bottom: 35px;

    }

    .left .top {
        height: 770px;
        border-right: 1px solid #ccc;
    }

    .banner-1 {
        width: 79px;
        float: left;
        height: 460px;
        margin-top: 30px;
    }

    .banner-1 .icon {
        display: block;
        height: 30px;
        background-size: 35px 16px;
        background-repeat: no-repeat;
        background-position: center center;
        cursor: pointer;
    }

    .banner-1 .icon.icon-up {
        background-image: url(/img/up.png);
    }

    .banner-1 .icon.icon-down {
        background-image: url(/img/down.png);
    }

    .banner-1 ul, .banner-2 ul {
        transition: all 1s;
    }

    .banner-1 > div {
        height: 320px;
        overflow: hidden;
    }

    .banner-1 > div > ul {
        position: relative;
    }

    .banner-1 li {
        height: 80px;
        overflow: hidden;
        cursor: pointer;
    }

    .banner-1 li div {
        height: 70px;
        width: 70px;
        margin: 4px auto;
        border: 1px solid #ccc;

    }

    .banner-1 li.active div {
        border-color: #533f34;
    }

    .banner-2 {
        width: 760px;
        float: left;
        height: 490px;
        box-sizing: border-box;
    }

    .banner-2 .scale {
        margin-top: 30px;
        height: 28px;
        text-align: right;
    }

    .banner-2 .scale a {
        padding: 10px;
        margin-right: 70px;
        background-size: 24px 24px;
        background-repeat: no-repeat;
        background-position: center;
        cursor: pointer;
        background-image: url(/img/scale.png);
    }

    .banner-2-wrap {
        height: 350px;
        margin: 10px 20px;
    }

    .banner-2-wrap i {
        opacity: 0;
    }

    .banner-2-wrap:hover i {
        opacity: 1;
    }

    .banner-2-wrap .img {
        width: 620px;
        height: 350px;
        overflow: hidden;
    }

    .img ul {
        overflow: hidden;
        height: 350px;
        position: relative;
    }

    .img ul li {
        float: left;
        width: 620px;
    }

    .img ul li img {
        max-width: 600px;
    }

    .banner-2 .icon {
        float: left;
        width: 50px;
        height: 100%;
        background-size: 18px 34px;
        background-repeat: no-repeat;
        background-position: center center;
        cursor: pointer;
    }

    .banner-2-wrap > i, .banner-2-wrap > div {
        float: left;
    }

    .possible > p {
        font-size: 16px;
        text-align: left;
        line-height: 30px;
        color: #333;
        border-bottom: 1px solid #ccc;
    }

    .possible ul {
        position: relative;
        height: 234px;
        overflow: hidden;
        transition: all .2s;
    }

    .possible ul li {
        position: absolute;
        left: 0;
        top: 10px;
        width: 192px;
        height: 184px;
        margin: 10px 0 40px;
    }

    .possible ul li a {
        display: block;
        width: 162px;
        margin: 0 15px;
        color: #666;
    }

    .possible li p {
        margin-top: 2px;
        font-size: 12px;
        line-height: 20px;
        background: #ccc;
    }

    .possible li img {
        width: 160px;
        height: 160px;
        border: 1px solid #cccccc;
    }

    .possible-wrap {
        float: left;
        max-width: 772px;
        height: 230px;
        overflow: hidden;
    }

    .possible i.icon {
        float: left;
        width: 30px;
        height: 234px;
        background-size: 10px 20px;
        background-repeat: no-repeat;
        background-position: center 100px;
        cursor: pointer;
    }

    .icon-right {
        background-image: url(/img/right.png);

    }

    .icon-left {
        background-image: url(/img/left.png);

    }

    .detail .right {
        float: left;
        width: 318px;
        margin-top: 30px;
    }

    .right li {
        margin-left: 25px;
        text-align: left;
        border-bottom: 1px solid #ccc;
        box-sizing: border-box;

    }

    .right .title {
        font-size: 22px;
        line-height: 48px;
    }

    .right .tip {
        font-size: 16px;
        line-height: 48px;
    }

    .right .choose-year {
        font-size: 14px;
        margin-top: 18px;
        text-indent: 6px;
        line-height: 26px;
        background: #d8b200;
        cursor: pointer;
        position: relative;
    }

    .right .choose-year .icon.icon-down {
        position: absolute;
        right: 10px;
        top: 4px;
        padding: 10px;
        background-image: url(/img/down.png);
        background-repeat: no-repeat;
        background-position: center;
        background-size: 20px 12px;
    }

    .choose-year .year-option {
        position: absolute;
        width: 100%;
        top: 26px;
    }

    .choose-year .year-option li {
        background: #fff;
        padding: 0;
        margin: 0;
        text-align: center;
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
        box-sizing: border-box;
    }

    .right .price {
        line-height: 66px;
        text-align: center;
        font-size: 16px;
    }

    .right .buy {
        font-size: 20px;
        text-indent: 12px;
        background: #d8b200;
        line-height: 50px;
        cursor: pointer;
    }

    .right .share {
        line-height: 84px;
        font-size: 14px;
        text-align: center;

    }

    .right .share span {
        margin-right: 16px;
        cursor: pointer;
    }

    .right .share .icon-share {
        padding: 10px;
        background: url(/img/share.png);
        background-repeat: no-repeat;
        background-size: 16px 16px;
        background-position: center;
    }

    .right .share .icon-heart {
        padding: 10px;
        background: url(/img/heart.png);
        background-repeat: no-repeat;
        background-size: 12px 12px;
        background-position: center;
    }

    .right .findshop {
        line-height: 80px;
        font-size: 12px;
        cursor: pointer;
    }

    .right .info li {
        line-height: 40px;
        font-size: 14px;
        cursor: pointer;
    }

    .right .info i {
        padding: 10px;
        background-image: url(/img/right.png);
        background-repeat: no-repeat;
        background-size: 4px 8px;
        background-position: center;
    }

    .info .product-detail > div {
        line-height: 30px;
        overflow: hidden;
        transition: all 0.5s;
    }
</style>
