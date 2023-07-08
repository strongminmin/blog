import { getThemeConfig, defineConfig } from '@sugarat/theme/node'

// 主题独有配置
// 详见文档: https://theme.sugarat.top/
const blogTheme = getThemeConfig({
  // 文章默认作者
  author: 'Ximina',
  // 友链
  // friend: [
  //   {
  //     nickname: '粥里有勺糖',
  //     des: '你的指尖用于改变世界的力量',
  //     avatar:
  //       'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTE2NzAzMA==674995167030',
  //     url: 'https://sugarat.top'
  //   },
  //   {
  //     nickname: 'Vitepress',
  //     des: 'Vite & Vue Powered Static Site Generator',
  //     avatar:
  //       'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTI2NzY1Ng==674995267656',
  //     url: 'https://vitepress.vuejs.org/'
  //   }
  // ],
  recommend: {
    showSelf: true
  },
  // 开启离线的全文搜索支持（如构建报错可注释下面的配置再次尝试）
  search: 'pagefind',
  // popover: {
  //   title: '每日一句',
  //   body: [
  //     {
  //       type: 'text',
  //       content: '所有热爱，奔赴山海。'
  //     },
    
  //   ],
  //   duration: 0
  // }
  comment: {
    repo: 'strongminmin/blog',
    repoId: 'R_kgDOJ5DDzQ',
    category: 'Announcements',
    categoryId: 'DIC_kwDOJ5DDzc4CXwNN',
    mapping: 'pathname',
    inputPosition: 'bottom',
    lang: 'zh-CN',
    loading: 'lazy',
  }
})

// Vitepress 默认配置
// 详见文档：https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: blogTheme,
  lang: 'zh-cn',
  title: 'ximina',
  description: 'ximina的博客，分享有趣生活',
  vite: {
    optimizeDeps: {
      include: ['element-plus'],
      exclude: ['@sugarat/theme']
    }
  },
  lastUpdated: true,
  themeConfig: {
    lastUpdatedText: '上次更新于',
    footer: {
      message: '所有热爱，奔赴山海',
      // copyright:
      //   'MIT Licensed | <a target="_blank" href="https://theme.sugarat.top/"> @sugarat/theme </a>'
    },
    logo: '/logo.png',
    // editLink: {
    //   pattern:
    //     'https://github.com/ATQQ/sugar-blog/tree/master/packages/blogpress/:path',
    //   text: '去 GitHub 上编辑内容'
    // },
    nav: [
      { text: '首页', link: '/' },
      // { text: '关于作者', link: 'https://sugarat.top/aboutme.html' }
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/strongminmin'
      }
    ]
  }
})
