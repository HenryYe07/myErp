<template>
  <div class="sending_titile">发送邮件</div>
  <div class="outer">

    <div class="sendingBox">
      <div class="tip">标题：</div>
      <el-input placeholder="请输入邮件的标题" v-model="title"></el-input>

      <div class="chooseRcvs">
        <div class="left">
          <div class="tip">请选择主要收件人：</div>
          <choose-user v-model="main_rcv" class="main-rcv"></choose-user>
        </div>
        <div class="right">
          <div class="tip">请选择抄送收件人：</div>
          <choose-user v-model="copy_rcv" class="copy-rcv"></choose-user>
        </div>
      </div>
      <div class="edit">

      <!-- 工具栏 -->
      <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
        class="input-toolbar"

      />

      <!-- 编辑区域 -->
      <Editor
        v-model="mailContent"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
        class="input-sq"
      />
      </div>
    </div>

    <div class="endbar">
      <div class="left">
        <el-select v-model="type" placeholder="Select" style="width: 240px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="right">
        <el-button  class="send" plain type="success"  @click="sendMail">发送</el-button>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts" name="sendMail">
import { ref, shallowRef, onBeforeUnmount } from 'vue'
import chooseUser from "../../components/chooseUser.vue"

import { Editor, Toolbar } from '@wangeditor-next/editor-for-vue'
import '@wangeditor-next/editor/dist/css/style.css'

const title = ref('')  // 邮件的标题
const main_rcv = ref([])  // 主要接受人
const copy_rcv = ref([])  // 抄送接受人
const mailContent = ref('') // 邮件的正式内容
const type = ref('') // 邮件的类型

const editorRef = shallowRef()

const toolbarConfig = {}

const editorConfig = {
  placeholder: '请输入邮件内容...'
}

const mode = 'default'

const handleCreated = (editor: any) => {
  editorRef.value = editor
  editor.selectAll()

  editor.addMark('color', '#ffffff')

  editor.collapse()
}

onBeforeUnmount(() => {
  const editor = editorRef.value

  if (editor == null) {
    return
  }

  editor.destroy()
})

// notice discuss asking uncertain
const options = [
  {
    value: 'notice',
    label: '通知',
  },
  {
    value: 'discuss',
    label: '讨论',
  },
  {
    value: 'asking',
    label: '询问',
  },
  {
    value: 'uncertain',
    label: '待定',
  }
]


function default_page(){
  title.value = ''
  main_rcv.value = []
  copy_rcv.value = []
  mailContent.value = ''
  type.value = 'uncertain'

}

import {onMounted} from "vue";
import {postJSON} from "../../modules/fetch"
onMounted(() => {
  default_page()
})

function sendMail(){

    const sendingObj = {
      title:title.value,
      quoteMailID:"",
      content:mailContent.value,
      type:type.value,
      mainRcvID:main_rcv.value.map((item)=>{return item._id}),
      copyRcvID:copy_rcv.value.map((item)=>{return item._id}),
      attachmentList:[]
    }


    postJSON("/api/mail",sendingObj)

}
</script>

<style scoped>
    .outer {
        padding: 0px 100px;
        height: calc(100vh - 70px);
        overflow: scroll;
    }
    .sending_titile {
      text-align: center;
      font-size: 18px;
    }
    .input-sq :deep(.w-e-text-container) {
      height: 400px;
      background-color: rgb(0 0 0 / 0.35);
      padding: 20px;

    }


    .main-rcv{
      height: auto;


    }
    .copy-rcv{
      height: auto;

    }

    .chooseRcvs{
      display: block;
      height: auto;
    }

    .input-sq :deep([data-slate-editor="true"]) {
      color: white;
    }

    .input-toolbar :deep(.w-e-toolbar) {
      background-color: #252525 !important;
      border-color: #3a3a3a !important;
    }

    .input-toolbar :deep(.w-e-bar-item button) {
      color: #eeeeee !important;
      background-color: transparent !important;
    }

    .input-toolbar :deep(.w-e-bar-item button:hover) {
      background-color: #3a3a3a !important;
    }

    .input-toolbar :deep(.w-e-bar-item.active button) {
      background-color: #444444 !important;
      color: #ffffff !important;
    }

    .endbar .left{
      float: left;
    }
    .endbar .right{
      float: right;
    }

    .endbar{
      margin-top: 30px;
    }

    .endbar .right>*{
      width: 300px;
      margin-bottom: 400px;
    }
</style>
