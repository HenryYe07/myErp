const express = require('express')
const router = express.Router()

const path = require("path")
const userModel = require("../db/userModel")
const jwt = require('jsonwebtoken')
const { group } = require('console')
const getIDbyUserName = require('../modules/getUserID')

const serverKey = 'oooooiiiskskkkskks12348765'

// 引入 权限管理 api模块
const adminPermission = require("./admin/permissions")
router.use('/permission',adminPermission)

module.exports = router