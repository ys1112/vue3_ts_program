<template>
  <header :class="{ 'top-bg': isScrolled }">
    <el-text class="mx-1 sys-home" @click="toBackSys">去后台管理首页</el-text>
    <div class="container" :style="{ 'padding-top': navTop }">
      <h1 class="header-left">
        <a href="#">
          <img class="logo-icon" src="../../assets//images/alloyteam-logo.svg" alt="" srcset="">
        </a>
      </h1>
      <button class="navbar-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
        aria-controls="navbarCollapse" aria-label="Toggle navigation" aria-expanded="false">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <div class="mb-nav">
        <nav class="navbar navbar-expand-lg header-right">
          <!-- 导航栏内容 -->
          <div class="collapse navbar-collapse" id="navbarCollapse">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
              <li class="nav-item active">
                <a class="nav-link scrollto" :class="{ 'scroll-page': isScrolled }" aria-current="page" href="#">首页</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{ 'scroll-page': isScrolled }" href="#">博客</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{ 'scroll-page': isScrolled }" href="#">Github</a>
              </li>
              <li class="nav-item">
                <a class="nav-link nav-hot" :class="{ 'scroll-page': isScrolled }" href="#">
                  <SvgIcon icon-name="hot" style="margin-bottom: 4px;" size="18" color="#303133"></SvgIcon>
                  Bootstrap
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{ 'scroll-page': isScrolled }" href="#">Web前端导航</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{ 'scroll-page': isScrolled }" href="#">关于</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

    </div>
  </header>
  <div class="carousel">
    <swiper class="swiper" :style="{ 'height': swiperHeight }" :slides-per-view="1" :space-between="0"
      @swiper="onSwiper" :simulateTouch="false" @slideChange="onSlideChange" :modules="modules" :pagination="{
        clickable: true,
      }" :autoplay="{
        delay: 5000000000000000,
        disableOnInteraction: false,
      }" :navigation="false" :loop="true">
      <swiper-slide v-for="(item, index) in slides" :key="index">
        <img class="item" :src="item.image" />
        <div class="container hire-info">
          <div v-if="activeIndex == 0" class="swiper-text1">{{ item.text1 }}</div>
          <div v-if="activeIndex == 0" class="swiper-text2">{{ item.text2 }}
            <br>
            <div style="text-align: center;">2025</div>
          </div>
          <div v-if="activeIndex == 1" class="swiper-text3">{{ item.text1 }}</div>
          <div v-if="activeIndex == 1" class="swiper-text4">{{ item.text2 }}</div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
  <section class="adaptive-wrap">
    <div class="container">
      <h2>
        <span class="title-s1">OpenSource&nbsp;/&nbsp;开源项目</span><br>
        <span class="sub-title-s1">种类众多的开源项目，让你爱不释手</span>
      </h2>
    </div>
    <div class="container  text-center">
      <div class="row section">
        <div class="art1 col-lg-3 col-sm-6 col-xs-12">
          <a href="#">
            <img class="section-1-img" src="../../assets/images/omi.png" alt="">
            <h3>OMI</h3>
            <p>开放现代的Web组件化框架</p>
            <div class="light"></div>
          </a>
        </div>
        <div class="art2 col-lg-3 col-sm-6 col-xs-12">
          <a href="#">
            <img class="section-1-img" src="../../assets/images/alloyimage.png" alt="">
            <h3>AlloyImage</h3>
            <p>HTML5专业级图像处理引擎</p>
            <div class="light"></div>
          </a>
        </div>
        <div class="art3 col-lg-3 col-sm-6 col-xs-12">
          <a href="#">
            <img class="section-1-img" src="../../assets/images/alloytouch.png" alt="">
            <h3>AlloyTouch</h3>
            <p>丝般顺滑的触摸运动方案</p>
            <div class="light"></div>
          </a>
        </div>
        <div class="art4 col-lg-3 col-sm-6 col-xs-12">
          <a href="#">
            <img class="section-1-img" src="../../assets/images/sodalogo.png" alt="">
            <h3>Soda</h3>
            <p>高性能模版引擎</p>
            <div class="light"></div>
          </a>
        </div>
      </div>
    </div>
    <div class="more"><button>更多项目></button></div>
  </section>
  <section class="adaptive-wrap">
    <div class="container">
      <h2>
        <span class="title-s1">Product&nbsp;/&nbsp;作品</span><br>
        <span class="sub-title-s1">新奇好玩的作品，让你欲罢不能</span>
      </h2>
    </div>
    <div class="container  text-center">
      <div class="row">
        <div class="art1 col-lg-3 col-sm-6 col-xs-12">
          <a href="#" class="s2-content">
            <div class="s2-head">
              <img class="section-2-img" src="../../assets/images/codetank.jpg" alt="">
            </div>
            <p class="desc-s2">CodeTank</p>
            <p class="desc-s2">全世界首个Javascript程序员的在线编程对战游戏</p>
          </a>
        </div>
        <div class="art2 col-lg-3 col-sm-6 col-xs-12">
          <a href="#" class="s2-content">
            <div class="s2-head">
              <img class="section-2-img" src="../../assets/images/alloyphoto.jpg" alt="">
            </div>
            <p class="desc-s2">AlloyPhoto</p>
            <p class="desc-s2">专业在线图像处理App</p>
          </a>
        </div>
        <div class="art3 col-lg-3 col-sm-6 col-xs-12">
          <a href="#" class="s2-content">
            <div class="s2-head">
              <img class="section-2-img" src="../../assets/images/alloystick.jpg" alt="">
            </div>
            <p class="desc-s2">AlloyDesigner</p>
            <p class="desc-s2">新概念web开发工具</p>
          </a>
        </div>
        <div class="art4 col-lg-3 col-sm-6 col-xs-12">
          <a href="#" class="s2-content">
            <div class="s2-head">
              <img class="section-2-img" src="../../assets/images/alloydesigner.png" alt="">
            </div>
            <p class="desc-s2">AlloyStick</p>
            <p class="desc-s2">HTML5骨骼动画引擎</p>
          </a>
        </div>
      </div>
    </div>
    <div class="more"><button>更多作品></button></div>
  </section>
  <section class="adaptive-wrap">
    <div class="container">
      <h2>
        <span class="title-s1">Blog&nbsp;/&nbsp;博客</span><br>
        <span class="sub-title-s1">最新技术发展,业界前沿博客</span>
      </h2>
    </div>
    <div class="container  text-left">
      <div class="row">
        <div class="art1 col-lg-6 col-xs-12">
          <div class="s3-content">
            <div class="s3-header">
              <h2>最新博客</h2>
              <span>...</span>
            </div>
            <ul>
              <li>
                <a href="#">
                  <h4>Omi命令行界面omi-cli发布</h4>
                  <span>TAT.dnt</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <h4>从工程化角度讨论如何快速构建可靠React组件</h4>
                  <span>TAT.heyli</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <h4>线条之美，玩转SVG线条动画</h4>
                  <span>TAT.tennylv</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <h4>Omi应用md2site发布-markdown转网站利器</h4>
                  <span>TAT.dnt</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <h4>试试Web组件化框架Omi</h4>
                  <span>TAT.dnt</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="art2 col-lg-6 col-xs-12">
          <div class="s3-content">
            <div class="s3-header">
              <h2>博客分类</h2>
              <span>...</span>
            </div>
            <div class="row">
              <div class="blog-category col-md-6 col-xs-12">
                <a href="#">
                  <img src="../../assets/images/icon_js.png" alt="">
                  <div class="desc">
                    <p>Javascript</p>
                    <span>没看过这些，怎么敢说懂js</span>
                  </div>
                </a>
              </div>
              <div class="blog-category col-md-6 col-xs-12">
                <a href="#">
                  <img src="../../assets/images/icon_css.png" alt="">
                  <div class="desc">
                    <p>CSS</p>
                    <span>神奇的CSS在哪里？</span>
                  </div>
                </a>
              </div>
              <div class="blog-category col-md-6 col-xs-12">
                <a href="#">
                  <img src="../../assets/images/icon_nodejs.png" alt="">
                  <div class="desc">
                    <p>Node.js</p>
                    <span>亿万级数据服务的秘密</span>
                  </div>
                </a>
              </div>
              <div class="blog-category col-md-6 col-xs-12">
                <a href="#">
                  <img src="../../assets/images/icon_mobile.png" alt="">
                  <div class="desc">
                    <p>移动Web开发</p>
                    <span>PC转向移动，这是个问题</span>
                  </div>
                </a>
              </div>
              <div class="blog-category col-md-6 col-xs-12">
                <a href="#">
                  <img src="../../assets/images/icon_users.png" alt="">
                  <div class="desc">
                    <p>用户体验设计</p>
                    <span>震惊！原来应用还可以这样设计</span>
                  </div>
                </a>
              </div>
              <div class="blog-category col-md-6 col-xs-12">
                <a href="#">
                  <img src="../../assets/images/icon_performance.png" alt="">
                  <div class="desc">
                    <p>Web性能优化</p>
                    <span>丝般柔顺体验背后的真相</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="adaptive-wrap">
    <div class="container">
      <h2>
        <span class="title-s1">SuperStar&nbsp;/&nbsp;超级明星俱乐部</span><br>
        <span class="sub-title-s1">技术达人，最强大脑，前端先驱</span>
      </h2>
    </div>
    <div class="container  text-center">
      <div class="row">
        <div class="art1 col-lg-4 col-xs-12">
          <div class="section4">
            <div class="star-header">
              <img class="section-2-img" src="../../assets/images/avatar.jpg" alt="">
              <h3>JetYu 于涛</h3>
            </div>
            <p class="desc-s4">AlloyTeam 创始人</p>
          </div>
        </div>
        <div class="art2 col-lg-4 col-xs-12">
          <div class="section4">
            <div class="star-header">
              <img class="section-2-img" src="../../assets/images/avatar1.jpg" alt="">
              <h3>DntZhang 张磊</h3>
            </div>
            <p class="desc-s4">知名博主，多个开源框架作者</p>
          </div>

        </div>
        <div class="art3 col-lg-4 col-xs-12">
          <div class="section4">
            <div class="star-header">
              <img class="section-2-img" src="../../assets/images/avatar2.jpg" alt="">
              <h3>DorsyWang 王斌</h3>
            </div>
            <p class="desc-s4">数学达人，图像处理专家</p>
          </div>

        </div>
      </div>
    </div>
    <div class="more"><button>更多明星></button></div>
  </section>
  <footer>
    <div class="container">
      <div class="row">
        <div class="col-lg-5 col-sm-12 footer-info">
          <img class="logo" src="../../assets//images/alloyteam-logo.svg" alt="">
          <div class="slogan">成为地球卓越的Web团队</div>
          <div class="copyright">Copyright© 2025 <a href="#">Adaptive</a>. All Rights Reserved.<br><a
              href="#">粤ICP备15071938号-2</a>
          </div>
        </div>
        <div v-if="showLinks" class="col-lg-2 col-md-2 footer-links">
          <h4>兄弟团队</h4>
          <ol>
            <li><a href="#">腾讯CDC</a></li>
            <li><a href="#">腾讯ISUX</a></li>
            <li><a href="#">腾讯TGideas</a></li>
            <li><a href="#">腾讯FERD</a></li>
            <li><a href="#">百度FEX</a></li>
            <li><a href="#">淘宝FED</a></li>
          </ol>
        </div>
        <div v-if="showLinks" class="col-lg-2 col-md-2 footer-links">
          <h4>友情链接</h4>
          <ol>
            <li><a href="#">W3CPlus</a></li>
            <li><a href="#">W3CTech</a></li>
            <li><a href="#">Web前端开发</a></li>
            <li><a href="#">前端观察</a></li>
            <li><a href="#">腾讯大讲堂</a></li>
            <li><a href="#">牛大拿_前端设计导航</a></li>
            <li><a href="#">印记中文</a></li>
          </ol>
        </div>
        <div class="col-lg-3 col-sm-12 footer-qr">
          <div class="row">
            <div class="col-md-6 col-xs-6">
              <img src="../../assets/images/qq.gif" alt="">
              <p>QQ：1759048771</p>
            </div>
            <div class="col-md-6 col-xs-6">
              <img src="../../assets/images/weixin.gif" alt="">
              <p>微信公众号:AlloyTeam</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup name="AdaptiveHome">
import SvgIcon from "@/components/SvgIcon.vue"
import { ref, onMounted, onBeforeUnmount, watchEffect } from "vue";
import { Swiper, SwiperSlide } from 'swiper/vue';
import { useRouter } from 'vue-router'

import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';
const modules = [Navigation, Pagination, A11y, Autoplay]
import 'bootstrap/dist/css/bootstrap.min.css';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
const router = useRouter()
const activeIndex = ref()
const showLinks = ref(true)
const swiperInstance = ref<typeof Swiper | null>(null);
const swiperHeight = ref('')
interface SlideItem {
  image: string;
  text1?: string
  text2?: string
}
const slides = ref<SlideItem[]>([
  {
    image: 'http://127.0.0.1:3001/uploads/swiper3.png',
    text1: '征不平凡的你',
    text2: '前端Adaptive项目Program展示',
  },
  {
    image: 'http://127.0.0.1:3001/uploads/swiper5.png',
    text1: '按照特定屏幕宽度调整自身的样式',
    text2: 'Adaptive自适应',
  },
  { image: 'http://127.0.0.1:3001/uploads/swiper6.png' }
]);

//初始化swiper后，为swiperInstance赋值
const onSwiper = (swiper: any) => {
  activeIndex.value = swiper?.realIndex
  swiperInstance.value = swiper;
  if (swiper?.width < 768) {
    swiperHeight.value = '250px'
  } else if (swiper?.width > 992) {
    swiperHeight.value = '500px'
  } else {
    swiperHeight.value = '400px'
  }
};
const toBackSys = () => {
  router.replace('/home').then(() => {
    window.location.reload();
  });
}
//监听slide滑块更改事件回调
const onSlideChange = () => {
  activeIndex.value = swiperInstance.value?.realIndex
  console.log('slide change');
};

const isScrolled = ref(false)
const navTop = ref('0px')
const handleScroll = () => {
  const scrollTop = document.documentElement.scrollTop
  isScrolled.value = scrollTop > 0
  navTop.value = scrollTop > 0 ? '0' : '12px'
  console.log(isScrolled.value);

}
const handleResize = () => {
  if (swiperInstance.value?.width < 768) {
    showLinks.value = false
    swiperHeight.value = '250px'
  } else if (swiperInstance.value?.width > 992) {
    console.log(swiperInstance.value?.width);
    showLinks.value = true
    swiperHeight.value = '500px'
  } else {
    swiperHeight.value = '400px'
    showLinks.value = false
  }
}
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleResize)
  if (window.innerWidth > 991) {
    showLinks.value = true
  } else {
    showLinks.value = false
  }

})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: all .3s ease-in;

  .container {
    width: 1170px;
    display: flex;
    padding-top: 12px;
    align-items: center;
    justify-content: space-between;
    transition: all .3s ease-in;

    .header-left {
      .logo-icon {
        width: 200px;
      }
    }

    // .header-right {}
  }
}

.top-bg {
  background-color: #25282c;
}

.adaptive-wrap {
  width: 100%;
  padding-bottom: 24px;
}

.navbar {
  padding: 0;
  height: 60px;
}

.navbar-nav {
  padding: 0;
  height: 60px;
  line-height: 60px;
}

.nav-link {
  padding: 0;
  color: #fff;
}

.navbar-toggle {
  transition: all linear .2s;
  margin-right: 0;
  margin-top: 0;
  background: none;
  position: absolute;
  right: 10px;
  top: 10px;
}

.icon-bar {
  background-color: #fff;
  height: 3px;
  margin-bottom: 4px;
}

.icon-bar {
  display: block;
  width: 22px;
  border-radius: 1px;
}

.navbar-toggle {
  float: right;
  padding: 9px 10px;
  margin-bottom: 8px;
  border: 1px solid transparent;
  border-radius: 4px;
}

@media (min-width: 992px) {
  .navbar-toggle {
    display: none;
  }
}

.swiper-text1 {
  position: absolute;
  bottom: 64px;
  left: 108px;
  font-size: 50px;
  color: #fff;
  animation: fade-left-in .6s ease-in;
}

.swiper-text2 {
  position: absolute;
  bottom: 200px;
  right: 120px;
  color: #fff;
  font-size: 40px;
  letter-spacing: 3px;
  line-height: 60px;
  animation: fade-right-in .6s ease-in;
}

.swiper-text3 {
  width: 100%;
  position: absolute;
  bottom: 30%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  font-size: 34px;
  color: #fff;
  animation: fade-bottom-in .6s ease-in;
}

.swiper-text4 {
  width: 100%;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 60px;
  text-align: center;
  letter-spacing: 3px;
  line-height: 60px;
  animation: fade-top-in .6s ease-in;
}

.hire-info {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  height: 100%;
}

@media (max-width: 992px) {
  .swiper-text1 {
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
  }

  .swiper-text2 {
    width: 100%;
    right: 50%;
    transform: translateX(50%);
    text-align: center;
  }

  .swiper-text3 {
    bottom: 32%;
  }

  .swiper-text4 {
    top: 30%;
  }

  @keyframes fade-top-in {
    0% {
      top: 0;
      opacity: 0;
    }

    to {
      top: 30%;
      opacity: 1;
    }
  }

  @keyframes fade-bottom-in {
    0% {
      bottom: 0;
      opacity: 0;
    }

    to {
      bottom: 32%;
      opacity: 1;
    }
  }

  .navbar-collapse {
    position: fixed !important; // 改为fixed定位
    top: 60px !important; // 根据header高度调整
    left: 50% !important;
    transform: translateX(-50%); // 水平居中
    width: 100vw !important; // 占据整个视口宽度
    background: #26282c !important;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    height: 295px;
    padding: 16px 0;
    overflow-y: auto;

    .navbar-nav {
      width: 100%;
      flex-direction: column;

      .nav-item {
        height: 40px;
        text-align: center;

        .nav-link {
          font-size: 18px;
          display: inline-block;
          width: auto;

        }
      }

      .active {
        border: none;
      }
    }
  }

  .active {
    border-bottom: none;

    a {
      color: #f2b535 !important;
    }
  }

  .scroll-page:hover {
    background-color: transparent;
  }
}

@media (max-width: 767px) {
  .swiper-text1 {
    display: none;
  }

  .swiper-text2 {
    width: 100%;
    left: 50%;
    bottom: 50%;
    font-size: 32px;
    transform: translate(-50%, 50%);
    text-align: center;
    line-height: 40px;
  }

  .swiper-text3 {
    width: 100%;
    font-size: 20px;
  }

  .swiper-text4 {
    width: 100%;
    font-size: 32px;
  }
}

.scroll-page:hover {
  background-color: rgba(0, 0, 0, .1);
}

.nav-link:hover {
  color: #f2b535;
}

.nav-item {
  font-weight: 400;
  font-size: 16px;
  margin-right: 20px;
}

.active {
  border-bottom: 4px solid #f2b535;

  a {
    color: #f2b535;
  }
}

.nav-hot {
  color: hsla(0, 0%, 100%, .65);
  font-weight: 400;
  cursor: pointer;
}

// hot动画
@media (-webkit-min-device-pixel-ratio: 0) and (min-resolution: 0.001dpcm) {
  .nav-hot {
    background-image: -webkit-linear-gradient(left, #cddc39, #ff9800 25%, #cddc39 50%, #ff9800 75%, #cddc39) !important;
    -webkit-text-fill-color: transparent !important;
    background-clip: text !important;
    background-size: 200% 100% !important;
    animation: masked-animation 2s infinite linear !important;
  }

  .nav-hot:hover {
    animation: masked-animation 1s infinite linear !important
  }
}

@keyframes masked-animation {
  0% {
    background-position: 0 0
  }

  to {
    background-position: -100% 0
  }
}

@keyframes fade-left-in {
  0% {
    left: -200px;
    opacity: 0;
  }

  to {
    left: 108px;
    opacity: 1;
  }
}

@keyframes fade-right-in {
  0% {
    right: -200px;
    opacity: 0;
  }

  to {
    right: 120px;
    opacity: 1;
  }
}

@keyframes fade-top-in {
  0% {
    top: 0;
    opacity: 0;
  }

  to {
    top: 40%;
    opacity: 1;
  }
}

@keyframes fade-bottom-in {
  0% {
    bottom: 0;
    opacity: 0;
  }

  to {
    bottom: 30%;
    opacity: 1;
  }
}

.swiper {
  width: 100%;
  height: 500px;
}

.swiper-slide {
  position: relative;
  width: 100% !important;
  height: 100% !important;
}

/* 图片尺寸控制 */
.swiper-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:deep(.swiper-pagination-bullet) {
  height: 4px;
  width: 50px;
  border-radius: 2px;
  background-color: rgba(255, 255, 255);
  transition: transform .2s linear;

  &:hover {
    transform: scale(1.12);
  }
}

:deep(.swiper-pagination-bullet-active) {
  background-color: #fff;
}

section {
  margin-top: 40px;
}

h2 {
  text-align: center;
  margin: 0;
  padding: 16px 0;
}

.title-s1 {
  font-size: 30px;
  color: #494D55;
}

.sub-title-s1 {
  font-size: 16px;
  color: #919191;
}

.art1,
.art2,
.art3,
.art4 {
  padding: 0 15px;

  a {
    height: 200px;
    display: block;
    position: relative;
    height: 95%;
    transition: all .3s ease-in-out;
    overflow: hidden;
    border-radius: 6px;
    padding: 20px 10px;
    text-decoration: none;
    color: #fff;
    border: 1px solid #e4ecf3;

    .section-1-img {
      height: 60px;
    }

    h3 {
      margin-top: 20px;
      margin-bottom: 10px;
    }

    p {
      margin: 0 0 10px;
    }

    .s2-head {
      height: auto;
      overflow: hidden;
    }

    .section-2-img {
      transition: all .3s ease-in-out;
      width: 100%;
    }

    .desc-s2 {
      color: #313131;
      font-size: 14px;
      margin: 10px;
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 26px 40px -24px rgba(0, 36, 100, .5);
    }

    &:hover .light {
      transition: all 0.3s ease;
      left: 100%;
    }
  }

  .s2-content {
    padding: 0 0 20px 0;

    &:hover .section-2-img {
      transform: scale(1.2);
    }
  }

  .s3-content {
    color: #313131;
    border: 1px solid #e4ecf3;
    margin-bottom: 16px;

    .s3-header {
      padding: 0 16px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h2 {
        font-size: 16px;
      }

      span {
        font-size: 20px;
        color: #337ab7;
        cursor: pointer;

        &:hover {
          color: #f2b535;
        }
      }
    }

    li {
      margin-bottom: 28px;
    }

    a {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: none;
      padding: 0 44px 0 24px;
      color: #313131;

      h4 {
        font-size: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &:hover {
          transform: none;
          box-shadow: none;
          color: #f2b535;
        }
      }

      span {
        font-size: 14px;
      }

      &:hover {
        transform: none;
        box-shadow: none;
      }
    }

    .blog-category {
      height: 70px;
      margin-bottom: 22px;

      a {
        justify-content: flex-start;
        padding: 0 0 0 16px;

        img {
          width: 60px;
          height: 60px;
        }

        .desc {
          width: 100%;
          padding-left: 16px;

          p {
            margin: 0;
            font-size: 16px;
            color: #333;

            &:hover {
              color: #f2b535;
            }
          }

          span {
            display: block;
            width: 80%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #c1c1c1;
          }
        }
      }


    }
  }

  .section4 {
    border: 1px solid #e4ecf3;
    transition: all .3s ease-in-out;
    padding: 20px;
    margin-bottom: 16px;

    .star-header {
      img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 1px solid #c1c1c186;
      }

      h3 {
        font-size: 18px;
        padding: 20px 0;
      }

    }

    .desc-s4 {
      color: #919191;
      line-height: 60px;
      height: 60px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0;
    }

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 26px 40px -24px rgba(0, 36, 100, .5);
    }
  }

}

ol,
ul,
li {
  list-style: none;
  padding: 0;
  margin: 0;
}

.section .art1 {
  a {
    background-color: #70c3ff;
  }
}

.section .art2 {
  a {
    background-color: #fd6a7f;
  }
}

.section .art3 {
  a {
    background-color: #7f8ea0;
  }
}

.section .art4 {
  a {
    background-color: #89d04f;
  }
}

.light {
  position: absolute;
  left: -100%;
  top: 0;
  width: 100%;
  height: 100%;
  transform: skew(-25deg);
  /* -webkit-不加实现不了 */
  background-image: -webkit-linear-gradient(0deg,
      hsla(0, 0%, 100%, 0),
      hsla(0, 0%, 100%, 0.5),
      hsla(0, 0%, 100%, 0));
}

.more {
  text-align: center;
  margin-top: 20px;

  button {
    background-color: #e1e1e1;
    border: none;
    color: #616161;
    font-weight: 400;
    font-size: 14px;
    padding: 10px 16px;
    border-radius: 6px;
    border: 1px solid #cccccc;
  }
}

footer {
  padding: 40px 0;
  background-color: #26282c;
  color: hsla(0, 0%, 100%, .4);

  .logo {
    width: 200px;
    height: 39px;
  }

  .slogan {
    font-size: 16px;
    margin-top: 8px;
  }

  .copyright {
    margin-top: 30px;
    font-size: 14px;
    line-height: 32px;
    margin-bottom: 24px;

    a {
      text-decoration: none;
      color: hsla(0, 0%, 100%, .4);

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .footer-links {
    h4 {
      font-size: 16px;
      color: hsla(0, 0%, 100%, 0.774);
    }

    a {
      display: block;
      margin-bottom: 4px;

      font-size: 14px;
      color: hsla(0, 0%, 100%, .4);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
        color: #f2b535;
      }
    }
  }

  .footer-qr {
    img {
      width: 120px;
      height: 120px;
      transition: all .3s ease-in-out;

      &:hover {
        transform: scale(2);
      }
    }

    p {
      font-size: 12px;
      margin: 10px 0;
    }
  }
}

@media (max-width: 992px) {

  .footer-info,
  .copyright,
  .footer-qr {
    text-align: center;
  }
}

.sys-home {
  cursor: pointer;
  color: #fff;
  position: fixed;
  left: 24px;
  top: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 4px 8px;
  &:hover {
    color: #f2b535;
  }
}
</style>