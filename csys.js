rule = {
    name: '臭蛋蛋影视',
    host: 'https://cddys1.me',
    class_name: '电影&电视剧&综艺&动漫&纪录片',
    class_url: '1&2&3&4&3',
    homeVod: 'div.module-item;div.module-item-pic a&&title;div.module-item-pic a&&href;img&&data-src;div.module-item-text&&Text',
    url: '/vodshow/fyclass--------fypage---.html',
    categoryVod: 'div.module-item;div.module-item-pic a&&title;div.module-item-pic a&&href;img&&data-src;div.module-item-text&&Text',
    detailVod: {
      content: 'div.vod_content span&&Text',
      director: 'div.video-info-items:has(span:contains(导演)) a&&Text',
      actor: 'div.video-info-items:has(span:contains(主演)) a&&Text',
      playFrom: 'div.module-tab-item.tab-item&&Text',
      playUrl: 'div.module-blocklist div.scroll-content;a;&&Text;&&href',
    },
    lazy: `
      let url = HOST + input;
      request(url);|||
      let url = HOST + html.split('player_if" src="')[1].split('"')[0];
      request(url);|||
      playUrl = html.split('},"url":"')[1].split('"')[0];
    `,
    searchUrl: '/vsearch/--.html?wd=**',
    searchVod: 'div.module-item-pic;a&&title;a&&href;img&&data-src;',
  }