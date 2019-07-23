## jandan cli

> 本项目基于煎蛋网公开/非公开接口, 如有侵权，可联系本人下架；

### 安装
> 需要 NodeJS 10.0+ 环境 [NodeJS 安装](https://nodejs.org/en/download/current/)

`npm i -g jandan-cli`


### 使用

> 命令中所有`{}`包围的参数, 表示可选参数, `<>`包围的必选;

**查看帮助**

`jandan -h`

**0. 植入 cookie**

`jandan cookie`

> 获取 cookie 请在登录后打开浏览器控制台，在 `network` 中找地址包含 `jandan.net` 的链接，拷贝`Request Header`里的 cookie 值（实际上只需要`_gid`和`_ga`部分, 当然你全部复制也行）



**1. 获取首页新闻列表, `page`换成数字可翻页**

`jandan index {page}`

**2. 查看指定`id`的新闻, 如果带上`-s`, 则不展示评论列表**

`jandan article <id> {-s}`

**3. 获取指定板块的列表, `category`暂且可选`ooxx(无聊图)/pic(随手拍)`**

`jandan posts <category> {page}`

**4. 获取热榜板块列表, `category`暂且可选`recent(最近)/week(周榜)/picture(无聊图)/comment(优评)/joke(搞笑?)`**

`jandan hot <category>`

**5. 获取指定post详情, `category`支持`命令3/4`里的`category`合集, `comment_ID`可在`命令3/4`的输出里获得**

`jandan post <category> <comment_ID>`

**6. 提交新闻评论，发布`无聊图(pic)`、`问答(qa)`、`树洞(treehole)`、`随手拍(ooxx)`、`动物园(zoo)`、`周边(zhoubian)`、`鱼塘(pond)`等**

`jandan comment -h`  # 查看帮助

`jandan comment {category} -e {email} -a {nickname} -c <content> -p {comment_post_ID}`

> 如果是提交新闻评论, 那么`category`参数可忽略, `comment_post_ID`即`命令1`的输出里第一列`id`
> 如果不是提交新闻评论, 那么`category`必填, `-p`参数和后面的值`comment_post_ID`忽略;

**7. 吐槽功能**

`jandan tucao -h`  # 查看帮助

`jandan tucao -e {email} -a {nickname} -c <content> -m <comment_ID>`

> 其中`-m`参数后面的值`comment_ID`, 可以从`命令3/4`输出里获取到

**8. 缓存管理**

`jandan cache`  # 缓存概述

`jandan cache -a`  # 缓存详情

`jandan cache -d`  # 清空缓存

**9. 自毁功能**

`jandan remove`
