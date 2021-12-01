### 目录结构
- api ---------------接口api  
- config ------------配置文件  
- core -------------核心文件  
  - http-exceptions.js ------------- http请求异常处理
  - request.js  ------------- 封装get和post 请求
- db ---------------数据库配置文件  
- middleware --------中间件  
  - exception.js -------- 异常处理中间件
  - token-validate.js ------- token验证中间件
- model --------------数据库模型  
- mode_modules      
- router --------------路由  
- uploads -----------上传保存文件位置  
- utils ----------------工具类  
- .gitignore            
- app.js ------------启动文件  
- package-lock.json    
- package.json  
- README.md  

### install  
npm install  

### start  
node app.js     或者  npm run dev

<!-- 
待解决问题：
  视图层混合数据操作（分离）
  路由分模块
 -->
