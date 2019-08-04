## jandan cli

> 本项目基于煎蛋网公开/非公开接口, 如有侵权，可联系本人下架(绝不下架:D).


## 更新记录

0.1.4

- 紧急修复吐槽bug.

0.1.3

- 支持用户信息缓存, 只需第一次tucao或comment时, 设置下-a/-e参数
- 新增举报功能, 可以举报comment(文章评论/各个板块发post)/tucao(评论)


0.1.2

- 调整了部分命令的参数
- 新增了点赞/点踩/收藏功能
- 修复已知bug

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


**2. 查看指定`id`的新闻**

`jandan article <id> {-s} {-f}`

> `-s` 不展示评论列表, `-f` 收藏


**3. 获取指定板块的列表**

`jandan posts <category> {page} {-t} {-d}`

> 当带上`-t`时, 获取的是热榜板块列表, `category`可选`recent(最近)/week(周榜)/picture(无聊图)/comment(优评)/joke(搞笑?)/ooxx(随手拍)`, 热榜不支持`page`参数

> 当忽略`-t`时, `category`可选`duan(段子?)/pic(无聊图)/ooxx(随手拍)`, `page`参数可分页

> `-d`参数用于下载图片, 默认不下载图片


**4. 获取指定post详情, `comment_ID`可在`命令3`的输出里获得**

`jandan post <comment_ID> {category} {-t} {-o} {-x} {-f}`

> 当`category`不空时, 可搭配`-t`参数, 基于缓存查询, 更快速并且返回字段更详尽

> 当`category`忽略时, `-t`无效, 基于页面解析, 信息不全

> `-o`是点赞, `-x`是点踩, `-f`是收藏

> 注意: 新闻评论也是基于这个命令查看详情/点赞/点踩/收藏等


**5. 提交新闻评论，发布`无聊图(pic)`、`问答(qa)`、`树洞(treehole)`、`随手拍(ooxx)`、`动物园(zoo)`、`周边(zhoubian)`、`鱼塘(pond)`等**

`jandan comment -h`  # 查看帮助

`jandan comment {category} -e {email} -a {nickname} -c <content> -p {comment_post_ID}`

> 如果是提交新闻评论, 那么`category`参数可忽略, `comment_post_ID`即`命令1`的输出里第一列`id`

> 如果不是提交新闻评论, 那么`category`必填, `-p`参数和后面的值`comment_post_ID`忽略;


**6. 吐槽功能**

`jandan tucao -h`  # 查看帮助

`jandan tucao -e {email} -a {nickname} -c <content> -m <comment_ID>`

> 其中`-m`参数后面的值`comment_ID`, 可以从`命令3/4/9`输出里获取到

> 对文章里别人的评论进行吐槽这个基于这个命令


**7. 缓存管理**

`jandan cache`  # 缓存概述

`jandan cache -a`  # 缓存详情

`jandan cache -d`  # 清空缓存

`jandan cache -f`  # 查看收藏列表

`jandan cache -r`  # 清空收藏列表

`jandan cache -r -k <id>`  # 移除指定收藏, 其中`id`可通过收藏列表获得


**8. 自毁功能**

`jandan remove`


**9. 查看新开板块如 鱼塘(pond)/周边(zhoubian)/问答(qa)/树洞(treehole)/动物园(zoo)/应用(app)等列表**

`jandan test <category> {page} {-d}`

> 这个命令的分页, 和`命令3`不一样在与, 如果指定了`page`参数, 那就是查看页面上的指定页; 比如你传了1, 则查看的是最早的第1页, 而非最新的第1页;


**10. 点赞/点踩别人的吐槽/评论**

`jandan vote <id> {-o} {-x}`

> 从`命令4`的输出里获取`tucao_id`作为`id`参数

> `-o`为点赞, `-x`为点踩

**11. 举报别人的吐槽/post**

`jandan report -r <reason> -c <comment_id> {-t} 1`

> 注意, 如果你要举报的是吐槽, 带上`-t`参数， 其值可设为任意非1的数字;
> 如果要举报的是别人发的无聊图/树洞/文章评论等, 忽略`-t`参数即可.


in the end, don't worry, be happy!
