//@name:[解] 腾云驾雾[官]
//@version:1.3
//@webSite:https://v.qq.com
//@remark:v1.3修复环境变量读取，去除写入操作
//@type:100
//@instance:tencentVideo
//@order: A
//@env:采集解析地址##内置两个，失效不要反馈。格式：名称1@地址1;名称2@地址2

// ignore
import {
    FilterLabel,
    FilterTitle,
    VideoClass,
    VideoSubclass,
    VideoDetail,
    RepVideoClassList,
    RepVideoSubclassList,
    RepVideoList,
    RepVideoDetail,
    RepVideoPlayUrl,
    UZArgs,
    UZSubclassVideoListArgs,
} from '../../core/uzVideo.js'

import {
    UZUtils,
    req,
    getEnv,
    setEnv,
} from '../../core/uzUtils.js'

import { cheerio } from '../../core/uz3lib.js'
// ignore

class TencentClass extends WebApiBase {
    constructor() {
        super()
        this.webSite = 'https://v.qq.com'
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Referer': 'https://v.qq.com/',
        }
        this.jiexiMap = {}
        
        // 定义筛选配置
        this.filtersConfig = {
            "choice": [{"key":"sort","name":"排序","value":[{"n":"最热","v":"75"},{"n":"最新","v":"83"},{"n":"好评","v":"81"}]},{"key":"iyear","name":"年代","value":[{"n":"全部","v":"-1"},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"}]}],
            "tv": [{"key":"sort","name":"排序","value":[{"n":"最热","v":"75"},{"n":"最新","v":"79"},{"n":"好评","v":"16"}]},{"key":"feature","name":"类型","value":[{"n":"全部","v":"-1"},{"n":"爱情","v":"1"},{"n":"古装","v":"2"},{"n":"悬疑","v":"3"},{"n":"都市","v":"4"},{"n":"家庭","v":"5"},{"n":"喜剧","v":"6"},{"n":"传奇","v":"7"},{"n":"武侠","v":"8"},{"n":"军旅","v":"9"},{"n":"权谋","v":"10"},{"n":"革命","v":"11"},{"n":"现实","v":"13"},{"n":"青春","v":"14"},{"n":"猎奇","v":"15"},{"n":"科幻","v":"16"},{"n":"竞技","v":"17"},{"n":"玄幻","v":"18"}]},{"key":"iyear","name":"年代","value":[{"n":"全部","v":"-1"},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"}]}],
            "movie": [{"key":"sort","name":"排序","value":[{"n":"最热","v":"75"},{"n":"最新","v":"83"},{"n":"好评","v":"81"}]},{"key":"type","name":"类型","value":[{"n":"全部","v":"-1"},{"n":"犯罪","v":"4"},{"n":"励志","v":"2"},{"n":"喜剧","v":"100004"},{"n":"热血","v":"100061"},{"n":"悬疑","v":"100009"},{"n":"爱情","v":"100005"},{"n":"科幻","v":"100012"},{"n":"恐怖","v":"100010"},{"n":"动画","v":"100015"},{"n":"战争","v":"100006"},{"n":"家庭","v":"100017"},{"n":"剧情","v":"100022"},{"n":"奇幻","v":"100016"},{"n":"武侠","v":"100011"},{"n":"历史","v":"100021"},{"n":"老片","v":"100013"},{"n":"西部","v":"3"},{"n":"记录片","v":"100020"}]},{"key":"year","name":"年代","value":[{"n":"全部","v":"-1"},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"}]}],
            "variety": [{"key":"sort","name":"排序","value":[{"n":"最热","v":"75"},{"n":"最新","v":"23"}]},{"key":"iyear","name":"年代","value":[{"n":"全部","v":"-1"},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"}]}],
            "cartoon": [{"key":"sort","name":"排序","value":[{"n":"最热","v":"75"},{"n":"最新","v":"83"},{"n":"好评","v":"81"}]},{"key":"area","name":"地区","value":[{"n":"全部","v":"-1"},{"n":"内地","v":"1"},{"n":"日本","v":"2"},{"n":"欧美","v":"3"},{"n":"其他","v":"4"}]},{"key":"type","name":"类型","value":[{"n":"全部","v":"-1"},{"n":"玄幻","v":"9"},{"n":"科幻","v":"4"},{"n":"武侠","v":"13"},{"n":"冒险","v":"3"},{"n":"战斗","v":"5"},{"n":"搞笑","v":"1"},{"n":"恋爱","v":"7"},{"n":"魔幻","v":"6"},{"n":"竞技","v":"20"},{"n":"悬疑","v":"17"},{"n":"日常","v":"15"},{"n":"校园","v":"16"},{"n":"真人","v":"18"},{"n":"推理","v":"14"},{"n":"历史","v":"19"},{"n":"经典","v":"3"},{"n":"其他","v":"12"}]},{"key":"iyear","name":"年代","value":[{"n":"全部","v":"-1"},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"}]}],
            "child": [{"key":"sort","name":"排序","value":[{"n":"最热","v":"75"},{"n":"最新","v":"76"},{"n":"好评","v":"20"}]},{"key":"sex","name":"性别","value":[{"n":"全部","v":"-1"},{"n":"女孩","v":"1"},{"n":"男孩","v":"2"}]},{"key":"area","name":"地区","value":[{"n":"全部","v":"-1"},{"n":"内地","v":"3"},{"n":"日本","v":"2"},{"n":"其他","v":"1"}]},{"key":"iyear","name":"年龄段","value":[{"n":"全部","v":"-1"},{"n":"0-3岁","v":"1"},{"n":"4-6岁","v":"2"},{"n":"7-9岁","v":"3"},{"n":"10岁以上","v":"4"},{"n":"全年龄段","v":"7"}]}],
            "doco": [{"key":"sort","name":"排序","value":[{"n":"最热","v":"75"},{"n":"最新","v":"74"}]},{"key":"itrailer","name":"出品方","value":[{"n":"全部","v":"-1"},{"n":"BBC","v":"1"},{"n":"国家地理","v":"4"},{"n":"HBO","v":"3175"},{"n":"NHK","v":"2"},{"n":"历史频道","v":"7"},{"n":"ITV","v":"3530"},{"n":"探索频道","v":"3174"},{"n":"ZDF","v":"3176"},{"n":"腾讯自制","v":"15"},{"n":"合作机构","v":"6"},{"n":"其他","v":"5"}]},{"key":"type","name":"类型","value":[{"n":"全部","v":"-1"},{"n":"自然","v":"4"},{"n":"美食","v":"10"},{"n":"社会","v":"3"},{"n":"人文","v":"6"},{"n":"历史","v":"1"},{"n":"军事","v":"2"},{"n":"科技","v":"8"},{"n":"财经","v":"14"},{"n":"探险","v":"15"},{"n":"罪案","v":"7"},{"n":"竞技","v":"12"},{"n":"旅游","v":"11"}]}]
        }
    }

    /**
     * 获取分类列表
     */
    async getClassList(args) {
        let backData = new RepVideoClassList()
        try {
            const classNames = '精选&电影&电视剧&综艺&动漫&少儿&纪录片'.split('&')
            const classUrls = 'choice&movie&tv&variety&cartoon&child&doco'.split('&')
            let list = []
            for (let i = 0; i < classNames.length; i++) {
                let videoClass = new VideoClass()
                videoClass.type_id = classUrls[i]
                videoClass.type_name = classNames[i]
                videoClass.hasSubclass = true // 开启筛选
                list.push(videoClass)
            }
            backData.data = list
        } catch (error) {
            backData.error = error.message
        }
        return JSON.stringify(backData)
    }

    /**
     * 获取二级分类筛选规则
     */
    async getSubclassList(args) {
        let backData = new RepVideoSubclassList()
        backData.data = new VideoSubclass()
        try {
            const typeId = args.url
            if (this.filtersConfig[typeId]) {
                const filters = this.filtersConfig[typeId]
                filters.forEach(filterGroup => {
                    let filterTitle = new FilterTitle()
                    filterTitle.name = filterGroup.name
                    filterTitle.list = []
                    filterGroup.value.forEach(val => {
                        let label = new FilterLabel()
                        label.name = val.n
                        label.id = val.v
                        filterTitle.list.push(label)
                    })
                    backData.data.filter.push(filterTitle)
                })
            }
        } catch (error) {
            backData.error = error.message
        }
        return JSON.stringify(backData)
    }

    /**
     * 获取分类视频列表 (带筛选)
     */
    async getSubclassVideoList(args) {
        return this.getVideoList(args)
    }

    /**
     * 获取视频列表核心逻辑
     */
    async getVideoList(args) {
        let backData = new RepVideoList()
        try {
            // 构造 URL 参数
            let channel = args.mainClassId || args.url
            let offset = (args.page - 1) * 21
            
            // 默认参数
            let params = {
                sort: '75', // 最热
                iarea: '-1',
                _all: '1',
                append: '1',
                channel: channel,
                listpage: '1',
                offset: offset,
                pagesize: '21'
            }
            
            // 应用筛选
            if (args.filter && args.filter.length > 0) {
                const config = this.filtersConfig[channel]
                if (config) {
                    args.filter.forEach((f, index) => {
                        if (config[index]) {
                           let key = config[index].key
                           let val = f.id
                           // 特殊处理：原代码中有 type 和 itype 之分
                           if (key === 'type') params['itype'] = val
                           else if (key === 'year') params['year'] = val
                           else if (key === 'iyear') params['iyear'] = val
                           else if (key === 'sort') params['sort'] = val
                           else if (key === 'area') params['iarea'] = val
                           else if (key === 'feature') params['ifeature'] = val
                           else if (key === 'itrailer') params['itrailer'] = val
                           else if (key === 'sex') params['gender'] = val
                           else params[key] = val
                        }
                    })
                }
            }

            // 构造查询字符串
            let query = Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
            let url = `https://v.qq.com/x/bu/pagesheet/list?${query}`
            
            const pro = await req(url, { headers: this.headers })
            const $ = cheerio.load(pro.data)
            let videos = []
            
            $('.list_item').each((i, el) => {
                let item = $(el)
                let img = item.find('img')
                let link = item.find('a')
                
                let vod = new VideoDetail()
                vod.vod_name = img.attr('alt')
                vod.vod_pic = img.attr('src')
                vod.vod_id = link.attr('data-float') // 这里取到的通常是 cid
                if (!vod.vod_id) {
                    let href = link.attr('href')
                    if (href) vod.vod_id = href // 兜底
                }
                vod.vod_remarks = item.find('.figure_caption').text() // 通常右下角有更新状态
                
                videos.push(vod)
            })
            
            backData.data = videos

        } catch (error) {
            backData.error = '获取列表失败：' + error.message
        }
        return JSON.stringify(backData)
    }

    /**
     * 获取视频详情 (含多线路解析逻辑)
     */
    async getVideoDetail(args) {
        let backData = new RepVideoDetail()
        try {
            let cid = args.url
            if (cid.includes('v.qq.com')) {
                let match = cid.match(/\/([a-zA-Z0-9]+)\.html/)
                if (match) cid = match[1]
                if (cid.length < 5 && cid.includes('/')) {
                     cid = args.url.split('/').pop().replace('.html', '')
                }
            }
            
            let detailUrl = `https://v.qq.com/detail/m/${cid}.html`
            
            let htmlReq = await req(detailUrl, { headers: this.headers })
            let html = htmlReq.data
            let $ = cheerio.load(html)
            
            let vod = new VideoDetail()
            vod.vod_id = args.url
            vod.vod_name = $('title').text().split('_')[0]
            vod.vod_pic = $('meta[itemprop="image"]').attr('content')
            vod.vod_content = $('meta[name="description"]').attr('content')
            
            let videoIds = []
            let scriptContent = html
            
            if (!cid && html.match(/"cid":"(.*?)"/)) {
                cid = html.match(/"cid":"(.*?)"/)[1]
            }

            let videoIdsMatch = scriptContent.match(/"video_ids":\[(.*?)\]/)
            if (videoIdsMatch) {
                let idsStr = videoIdsMatch[1]
                videoIds = idsStr.replace(/"/g, '').split(',')
            }
            
            let episodeList = []
            
            if (videoIds.length > 0) {
                for (let i = 0; i < videoIds.length; i += 30) {
                    let chunk = videoIds.slice(i, i + 30)
                    let idlist = chunk.join(',')
                    let apiUrl = `https://union.video.qq.com/fcgi-bin/data?otype=json&tid=1804&appid=20001238&appkey=6c03bbe9658448a4&union_platform=1&idlist=${idlist}`
                    
                    let res = await req(apiUrl, { headers: this.headers })
                    let jsonStr = res.data.replace('QZOutputJson=', '').replace(/;$/, '')
                    try {
                        let json = JSON.parse(jsonStr)
                        if (json.results) {
                            json.results.forEach(item => {
                                let f = item.fields
                                let epTitle = f.title || f.episode_number || (i + 1)
                                let epUrl = `https://v.qq.com/x/cover/${cid}/${f.vid}.html`
                                let isTrailer = f.title.includes('预告') || f.title.includes('花絮')
                                if (!isTrailer) {
                                     episodeList.push(`${epTitle}$${epUrl}`)
                                }
                            })
                        }
                    } catch (e) {
                        UZUtils.debugLog('JSON Parse Error: ' + e.message)
                    }
                }
            } else {
                episodeList.push(`正片$${detailUrl}`)
            }
            
            let singlePlayUrl = episodeList.join('#')

            // --- 接入金蝉解析逻辑 ---
            
            // 调试日志：检查 uzTag
            UZUtils.debugLog(`[腾云驾雾] 当前uzTag: ${this.uzTag}`)
            
            // 读取环境变量
            let allUrls = await getEnv(this.uzTag, '采集解析地址')
            
            // 调试日志：检查是否读取到变量
            if (allUrls) {
                UZUtils.debugLog(`[腾云驾雾] 成功读取到解析地址，长度: ${allUrls.length}`)
            } else {
                UZUtils.debugLog(`[腾云驾雾] 未读取到解析地址，使用默认值`)
            }

            if (!allUrls || allUrls.length < 1) {
                // 如果为空，使用默认，但不再尝试写入，避免报错
                allUrls = '钓鱼@http://8.129.30.117:8117/diaoyu.php?url=;JSON@https://json.key521.cn/api/?key=df27d9ca9ec97e22c47f8565a50aa6f9&url='
            }
            
            const jxLinks = allUrls.split(';')
            let allFrom = ""
            let fromNames = ""
            
            for (let i = 0; i < jxLinks.length; i++) {
                if (!jxLinks[i].includes('@')) continue
                const fromName = jxLinks[i].split('@')[0]
                const fromUrl = jxLinks[i].split('@')[1]
                
                fromNames += fromName + "$$$"
                allFrom += singlePlayUrl + "$$$"
                
                this.jiexiMap[fromName] = fromUrl
            }
            
            if (allFrom.endsWith('$$$')) allFrom = allFrom.slice(0, -3)
            if (fromNames.endsWith('$$$')) fromNames = fromNames.slice(0, -3)
            
            vod.vod_play_from = fromNames
            vod.vod_play_url = allFrom
            
            backData.data = vod

        } catch (error) {
            backData.error = '获取详情失败：' + error.message
        }
        return JSON.stringify(backData)
    }

    /**
     * 获取视频播放地址 (调用解析)
     */
    async getVideoPlayUrl(args) {
        let backData = new RepVideoPlayUrl()
        try {
            const api = this.jiexiMap[args.flag]
            if (!api) {
                throw new Error('未找到对应的解析接口')
            }
            
            let reqUrl = api + args.url
            let response = await req(reqUrl)
            
            try {
                let json = JSON.parse(response.data)
                if (json.url) {
                    backData.data = json.url
                } else {
                    if (json.data && json.data.url) backData.data = json.data.url
                    else backData.data = reqUrl
                }
            } catch (e) {
                let str = response.data
                if (str.includes('http') && str.includes('.m3u8')) {
                   let match = str.match(/(http.*?\.m3u8)/)
                   if (match) backData.data = match[1]
                   else backData.data = reqUrl
                } else {
                    backData.data = reqUrl
                }
            }

        } catch (error) {
            backData.error = error.message
        }
        return JSON.stringify(backData)
    }

    /**
     * 搜索视频
     */
    async searchVideo(args) {
        let backData = new RepVideoList()
        try {
            let url = 'https://pbaccess.video.qq.com/trpc.videosearch.mobile_search.MultiTerminalSearch/MbSearch?vplatform=2'
            let body = {
                version: "25042201",
                clientType: 1,
                filterValue: "",
                uuid: "B1E50847-D25F-4C4B-BBA0-36F0093487F6",
                retry: 0,
                query: args.searchWord,
                pagenum: args.page - 1, 
                isPrefetch: true,
                pagesize: 30,
                queryFrom: 0,
                searchDatakey: "",
                transInfo: "",
                isneedQc: true,
                preQid: "",
                adClientInfo: "",
                extraInfo: {
                    isNewMarkLabel: "1",
                    multi_terminal_pc: "1",
                    themeType: "1",
                    sugRelatedIds: "{}",
                    appVersion: ""
                }
            }
            
            let res = await req(url, {
                method: 'POST',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.139 Safari/537.36',
                    'Content-Type': 'application/json',
                    'Origin': 'https://v.qq.com',
                    'Referer': 'https://v.qq.com/'
                },
                data: JSON.stringify(body)
            })
            
            let json = JSON.parse(res.data)
            let videos = []
            let seenIds = new Set()
            
            const nonMainContentKeywords = [
                '：', '#', '特辑', '“', '剪辑', '片花', '独家', '专访', '纯享',
                '制作', '幕后', '宣传', 'MV', '主题曲', '插曲', '彩蛋',
                '精彩', '集锦', '盘点', '回顾', '解说', '评测', '反应', 'reaction'
            ]

            const isMainContent = (title) => {
                if (!title) return false
                if (title.includes('<em>') || title.includes('</em>')) return false
                return !nonMainContentKeywords.some(keyword => title.includes(keyword))
            }
            
            const processItemList = (list) => {
                if (!list) return
                list.forEach(it => {
                    if (it.doc && it.doc.id && it.videoInfo && isMainContent(it.videoInfo.title)) {
                        const itemId = it.doc.id
                        if (!seenIds.has(itemId)) {
                            seenIds.add(itemId)
                            let vod = new VideoDetail()
                            vod.vod_name = it.videoInfo.title
                            vod.vod_pic = it.videoInfo.imgUrl
                            vod.vod_id = itemId
                            vod.vod_remarks = it.videoInfo.secondLine
                            videos.push(vod)
                        }
                    }
                })
            }
            
            if (json.data && json.data.normalList) {
                processItemList(json.data.normalList.itemList)
            }
            if (json.data && json.data.areaBoxList) {
                json.data.areaBoxList.forEach(box => {
                    processItemList(box.itemList)
                })
            }
            
            backData.data = videos

        } catch (error) {
            backData.error = '搜索失败：' + error.message
        }
        return JSON.stringify(backData)
    }
}
let tencentVideo = new TencentClass()