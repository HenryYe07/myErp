# ERP

## 实际功能
## 注意，这其实只是计划，实际上目前完成的只有登陆和审批
### 审批（含报销）approval

- 数据库

	- id

	- 发起人

	- 标题

	- 内容

	- 附件

	- 时间线

		- 步骤

			- 提交 submit

			- 接受 accept

			- 拒绝 reject

			- 撤回 recall

		- 操作人编号

		- 结果

		- 说明

		- 时间

- 评论

### 待办 todo

### 信息管理 management

- 财务管理 finance

- 仓库管理 stocks

- 产品管理 products

### 站内信 message

### 大屏展示 display

### 浏览产品与下订单 order

### 系统管理员 admin

- 用户管理

- 权限管理

## 登陆和用户权限管理account

### 登陆

- 账号操作

	- 登陆

	- 注册

	- 修改信息

- 操作鉴权

	- 有没有 token

### 用户管理

- 主要分组

	- 内部员工 inner

	- 外部客户/供应商 outer

	- 所有注册用户 anyUsers

### 注册/入职

## 路由

### index.js

- api

	- account.js  /api/account

		- /login

		- /register

		- /change-info

		- /logout

	- admin.js  /api/admin

		- permissions.js

			- /setUserPermissionGroup

			- /newPermissionGroup

			- /allPermissionGroups

			- /setGroupPermission

	- approval.js /api/approval

		- /newApproval
权限：approval.create

		- GET /myApproval
权限：approval.create

		- GET /throughApproval
权限：approval.process

		- /recallMyApproval
权限：approval.recall.own

		- /processApproval
权限：approval.process
还要判断 在不在该用户的环节

	- attachment.js /api/attachment

		- POST /
权限：attach.upload

		- 所有上传的静态资源 GET /

		- DELETE /<filename>

			- 用户可以删除自己的
权限：attach.delete.own

			- 管理员可以删除任何的
权限：attach.delete.any

## 数据库model

### permissionGroupModel

- groupName

- permissionList

### userModel

- username

- password

- permissionGroup

- memID 可以理解为工号

- realName

- email

- tokenVersion

- token

### approvalModel

- title

- content

- attachmentPath[ ]

- timeline[ ]

	- nodeUserID
(传输进来的是memID，要转换一下)

	- status

		- created

		- waiting

		- accepted

		- rejected

		- recalled

	- operateTime

- status

	- ongoing

	- finished

	- rejected

	- recalled

### approvalCommentModel

- _id

- forApprovalID

- content

- userID

- time

### attatchmentModel

- fileName

- uploaderID

- time

- originalFilename

## 常用模块

### getUserID
从 memID 或者 username 获取 id

## 中间件

### auth

- 确认 token 有效

- 提供 request.userID

### permission

- 确认有这个具体权限

