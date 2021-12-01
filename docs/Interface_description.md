## 功能
1. 推荐列表
2. 添加数据
3. 编辑数据
4. 精品必看列表
5. 添加数据精品必看数据
6. 文章详情
7. 个人收藏列表
8. 用户是否对这篇文章收藏或者点赞过
9. 收藏或者取消收藏操作
10. 点赞或者取消点赞操作
11. 文件上传到阿里云oss
12. 后台管理登录
13. 后台管理注册用户接口
14. 微信小程序登录

## 关于状态码返回说明
- 201 文章已存在
- 202 文件上传失败
- 203 用户已存在
- 400 参数异常，不能为空
- 412 文章不存在
- 500 catch异常
- 600 数据库发生异常

### 一、推荐列表
**接口地址 :** `/api/recomend/lists`  

**请求方式 :** post

**必选参数 :** 无

**可选参数 :**   
`limit`: 一次请求多少条数据  
`page`: 当前页数  
`title`: 查询的标题  
`startTime`: 开始时间 如：`2021-09-12`  
`endTime`:结束时间 如：`2021-09-13`  

**调用例子 :** `/api/recomend/lists`

### 二、添加数据（需要登录）
**接口地址 :** `/api/recomend/add`  

**请求方式 :** post

**必选参数 :**   
`id`: 文章id  
`cover`: 文章封面  
`title`: 文章标题  
`description`: 文章描述  

**调用例子 :** `/api/recomend/add`

### 三、编辑数据（需要登录）
**接口地址 :** `/api/recomend/edit`  

**请求方式 :** patch

**必选参数 :**   
`id`: 文章id   

**调用例子 :** `/api/recomend/edit`

### 四、精品必看列表
**接口地址 :** `/api/recent/lists`  

**请求方式 :** post

**必选参数 :** 无

**可选参数 :**   
`limit`: 一次请求多少条数据  
`page`: 当前页数  
`title`: 查询的标题  
`startTime`: 开始时间 如：`2021-09-12`  
`endTime`:结束时间 如：`2021-09-13`  

**调用例子 :** `/api/recent/lists`

### 五、添加数据精品必看数据（需要登录）
**接口地址 :** `/api/recent/add`  

**请求方式 :** post

**必选参数 :**   
`id`: 文章id  

**调用例子 :** `/api/recent/add`

### 六、文章详情
**接口地址 :** `/api/detail/info`  

**请求方式 :** get

**必选参数 :**   
`id`: 文章id  

**调用例子 :** `/api/detail/info?id=2613805`

### 七、个人收藏列表（需要登录）
**接口地址 :** `/api/collection/clist`  

**请求方式 :** get

**必选参数 :** 无   

**调用例子 :** `/api/collection/clist`

### 八、用户是否对这篇文章收藏或者点赞过（需要登录）
**接口地址 :** `/api/collection/status`  

**请求方式 :** get

**必选参数 :**   
`id`: 文章id

**调用例子 :** `/api/collection/status?id=2613805`

### 九、收藏或者取消收藏操作（需要登录）
**接口地址 :** `/api/collection/addRemove`  

**请求方式 :** post

**必选参数 :**   
`id`: 文章id

**调用例子 :** `/api/collection/addRemove`

### 十、点赞或者取消点赞操作（需要登录）
**接口地址 :** `/api/star/addRemove`  

**请求方式 :** post

**必选参数 :**   
`id`: 文章id

**调用例子 :** `/api/star/addRemove`

### 十一、文件上传到阿里云oss
**接口地址 :** `/api/upload/oss`  

**请求方式 :** post

**必选参数 :**   
`file`: 文件

**调用例子 :** `/api/upload/oss`

### 十二、后台管理登录
**接口地址 :** `/api/user/login`  

**请求方式 :** post

**必选参数 :**   
`account`: 账号  
`password`: 密码  

**调用例子 :** `/api/user/login`

### 十三、后台管理注册用户
**接口地址 :** `/api/user/register`  

**请求方式 :** post

**必选参数 :**   
`account`: 账号  
`password`: 密码  

**调用例子 :** `/api/user/register`

### 十四、微信小程序登录
**接口地址 :** `/api/wxUser/wx/login`  

**请求方式 :** post

**必选参数 :**   
`code`: 临时登录凭证  
`userInfo`: 用户基本信息（包括nickName、avatarUrl等）

**调用例子 :** `/api/wxUser/wx/login`