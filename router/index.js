const express = require(`express`);
const router = express.Router();

// 引入登录模块
const recomend = require('../api/recomend');
const upload = require('../api/upload');
const detail = require('../api/detail');
const user = require('../api/user');
const wxUser = require('../api/wx_user');
const collection = require('../api/collection');
const star = require('../api/star');
const recent = require('../api/recent');
const accessToken = require('../api/access_token');

router.use((req, res, next) => {
    next();
})

// 登录模块
router.use("/recomend",recomend);
router.use("/upload",upload);
router.use("/detail",detail);
router.use("/user",user);
router.use("/wxUser",wxUser);
router.use("/collection",collection);
router.use("/star",star);
router.use("/recent",recent);
router.use("/access/token",accessToken);


module.exports = router;