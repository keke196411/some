<template>
  <div class="m-content pg-mirror" ref="container" v-loading.fullscreen.lock="inHandle">
    <div class="u-notify">
      <span><em @click="$router.push({name: 'app'})">应用管理</em> > <em>{{skipMode?'新增':'编辑'}}</em></span>
      <a class="btn-edite" @click="update" v-if="!skipMode">保存</a>
      <a class="btn-edite" @click="append" v-if="skipMode">保存</a>
    </div>
    <div class="wrapper">
      <el-form ref="form" :model="formData" label-width="80px" label-position="top" :rules="rules" class="standard-form"
      style="width:100%;padding-bottom:20px;">
        <h2 class="u-header">基本信息</h2>
        <el-col :span="8">
          <el-form-item label="中文名 :" prop="appalias">
            <el-input v-model="formData.appalias" palceholder="请输入中文名" class="defW"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="作者 :" prop="appauthor">
            <el-input v-model="formData.appauthor" palceholder="请输入名称" class="defW"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="版本号 :" prop="appversion">
            <el-input v-model="formData.appversion" palceholder="请输入版本号" class="defW"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="英文名 :" prop="appName">
            <el-input v-model="formData.appName" palceholder="请输入英文名" class="defW"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述" prop="desc">
            <el-input type="textarea" v-model="formData.desc" placeholder="请输入相关描述" style="width:6.13rem;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="margin:10px 0 0;">
          <h2 class="u-header">具体内容</h2>
        </el-col>
        <el-col :span="24" v-if="skipMode">
          <el-form-item label="添加方式 :">
            <el-select v-model="addPattern" placeholder="请选择" @change="changeUploadMode">
              <el-option v-for="item in patternOpt" :key="item.value" :value="item.value">
              </el-option>
            </el-select>
            <!-- <a class="btn btn-edite" v-show="addPattern!=='本地上传'&&addPattern!=='仓库下载'" @click="translate" style="margin-left:7px;">转成yaml格式</a> -->
          </el-form-item>
        </el-col>
        <el-col :span="24" v-show="addPattern!=='本地上传'&&addPattern!=='仓库下载'">
          <div class="u-coder">
            <p class="u-notify-sm">Web编辑器</p>
            <div>
              <ul>
                <li v-for="(v, i) in codeSort" :key="i">{{++i}}</li>
              </ul>
              <textarea v-model="formData.fileContent" class="decode" placeholder="请输入编辑内容" :rows="codeSort.length"></textarea>
            </div>
          </div>
        </el-col>
        <el-col :span="24" v-show="skipMode&&addPattern==='本地上传'">
          <p class="u-notify-sm">本地上传</p>
          <el-form-item label="选择文件">
            <i-template :message="fileEntityName" :handle="handleSelectFile">
              <el-input slot="addtion" type="file" @change="pickFile" ref="fileUpload"></el-input>
            </i-template>
          </el-form-item>
        </el-col>
        <el-col :span="16" class="env-bar" v-show="skipMode&&addPattern==='仓库下载'">
          <p class="u-notify-sm">仓库下载</p>
          <el-form-item label="仓库地址 :" prop="libPath">
            <el-input v-model="formData.libPath" palceholder="请输入仓库地址" class="defW"></el-input>
          </el-form-item>
          <el-form-item label="文件路径 :" prop="filePath">
            <el-input v-model="formData.filePath" palceholder="请输入文件路径" class="defW"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="margin:10px 0 0;" v-if="false">
          <h2 class="u-header">环境变量<a class="btn btn-addnew" @click="addEnvItem">+</a></h2>
        </el-col>
        <el-col :span="16" class="env-bar" v-for="(v, i) in formData.envs" :key="v.key" v-if="false">
          <el-form-item label="名称 :" :prop="'envs.' + i + '.nValue'" :rules="[
            {required: true, message: '请输入名称', trigger: 'blur'},
            {validator: verifier.checkEnglishNum, trigger: ['change', 'blur']}
          ]">
            <el-input v-model="v.nValue" palceholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="变量 :" :prop="'envs.' + i + '.vValue'" :rules="[
            {required: true, message: '请输入变量名称', trigger: 'blur'},
            {validator: verifier.checkEnglishNum, trigger: ['change', 'blur']}
          ]">
            <el-input v-model="v.vValue" palceholder="请输入变量"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
  </div>
</template>

<script>
import httpRequest from '@/vender/js/httpUtils'
import yaml from 'js-yaml'
const localStorage = window.localStorage
export default {
  components: {
    'i-template': {
      props: ['message', 'handle'],
      template: `<div class="u-file-upload">
      <a class="btn btn-uploadFile" @click="handle">+</a>
      <slot name="addtion"></slot>
      <p>{{message}}</p>
      </div>`
    }
  },
  data () {
    return {
      skipMode: undefined,
      patternOpt: [{
        value: '手动编辑'
      }, {
        value: '本地上传'
      }, {
        value: '仓库下载'
      }],
      addPattern: '手动编辑',
      formData: {
        fileContent: ''
      },
      appVersion: '',
      inHandle: false
    }
  },
  watch: {

  },
  methods: {
    translate () {
      let vue = this
      try {
        let doc = yaml.load(vue.formData.fileContent)
        vue.formData.fileContent = doc
      } catch (e) {
        vue.$message.error(e)
      }
    },
    addEnvItem () {
      this.formData.envs.push({
        nValue: '',
        vValue: '',
        key: Date.now()
      })
      this.$nextTick(function () {
        this.$refs['container'].scrollTop = this.$refs['container'].scrollHeight - this.$refs['container'].clientHeight
      })
    },
    pickFile () {
      let vue = this
      try {
        let inputer = vue.$refs['fileUpload'].$el.children[0].files[0]
        if (inputer.size > 65 * 1024) {
          throw new Error('上传文件不能超过65KB!')
        } else Reflect.set(vue.formData, 'fileEntity', inputer)
      } catch (error) {
        vue.$message.error(error.message)
      }
    },
    handleSelectFile () {
      this.$refs['fileUpload'].$el.children[0].click()
    },
    changeUploadMode (v) {
      switch (v) {
        case '手动编辑':
          this.formData.fileEntity = null
          this.formData.libPath = ''
          this.formData.filePath = ''
          break
        case '本地上传':
          this.formData.fileContent = ''
          this.formData.libPath = ''
          this.formData.filePath = ''
          break
        case '仓库下载':
          this.formData.fileContent = ''
          this.formData.fileEntity = null
      }
      this.$nextTick(function () {
        this.$refs['container'].scrollTop = this.$refs['container'].scrollHeight - this.$refs['container'].clientHeight
      })
    },
    getAppInfo () {
      if (this.skipMode !== 0) {
        // 新增
        return {
          appalias: '',
          appName: '',
          appauthor: '',
          appversion: '',
          apptime: '',
          desc: '',
          addPattern: '手动编辑',
          fileContent: '',
          fileEntity: null,
          libPath: '',
          filePath: ''
        }
      } else {
        // 编辑
        let transfer = this.$store.state.appInfo
        if (transfer.name) {
          let appInfo = {
            appid: transfer.id,
            appalias: transfer.appAlias,
            appName: transfer.name,
            appauthor: transfer.author,
            appversion: transfer.version,
            apptime: transfer.issued,
            desc: transfer.desc,
            fileContent: transfer.file
          }
          localStorage.setItem('appInfo', JSON.stringify(appInfo))
          this.appVersion = transfer.version
          localStorage.setItem('version', transfer.version)
          return appInfo
        } else {
          this.appVersion = localStorage.getItem('version')
          return JSON.parse(localStorage.getItem('appInfo'))
        }
      }
    },
    // 保存
    update () {
      let vue = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let param = {...this.formData, apptime: new Date(this.formData.apptime).getTime()}
          this.inHandle = true
          httpRequest.putRequest(`${this.constants.BaseUrl}/app/apps/update/baseInfo`, param, (res) => {
            vue.$message({
              message: '提交成功!',
              type: 'success',
              duration: 2000
            })
            this.inHandle = false
            let t = setTimeout(() => {
              vue.$router.push({name: 'app'})
              clearTimeout(t)
            }, 2200)
          }, (e) => {
            this.$message.error(e.response ? e.response.data.message : e.message)
            this.inHandle = false
          })
        } else {
          console.log('submit error !')
          return false
        }
      })
    },
    // 新增
    append () {
      let vue = this
      let transfer = new FormData()
      transfer.append('appVersion', this.formData.appversion)
      transfer.append('appalias', this.formData.appalias)
      transfer.append('auth', this.formData.appauthor)
      transfer.append('desc', this.formData.desc)
      this.formData.fileEntity && transfer.append('file', this.formData.fileEntity)
      transfer.append('filecontent', this.formData.fileContent)
      transfer.append('filename', this.formData.filePath)
      transfer.append('url', this.formData.libPath)
      transfer.append('stackname', this.formData.appName)
      this.inHandle = true
      httpRequest.uploadFileRequest(`${this.constants.BaseUrl}/app/apps/add`, transfer, (res) => {
        vue.$message({
          message: '上传成功!',
          type: 'success',
          duration: 2000
        })
        this.inHandle = false
        let t = setTimeout(() => {
          vue.$router.push({name: 'app'})
          clearTimeout(t)
        }, 2500)
      }, (e) => {
        this.$message.error(e.response ? e.response.data.message : e.message)
        this.inHandle = false
      })
    },
    versionFormatter (rule, value, callback) {
      let t = value.split('.')
      let from = this.appVersion.split('.')
      let f1 = true
      let f2
      for (let i = 0; i < t.length; i++) {
        if (from[i]) {
          if (t[i] < from[i]) {
            f1 = false
            break
          } else if (t[i] === from[i]) {
            continue
          } else break
        }
      }
      t = parseInt(value.replace(/\./g, '').replace(/0+$/, ''))
      from = parseInt(this.appVersion.replace(/\./g, ''))
      if (t !== from) f2 = true
      if (!f1 || !f2) {
        callback(new Error('请输入向上迭代的版本号'))
      } else callback()
    }
  },
  computed: {
    codeSort () {
      return 1
      // return this.formData.fileContent.split(/\n/)
    },
    fileEntityName () {
      return this.formData.fileEntity && this.formData.fileEntity.name
    },
    rules () {
      const verifier = this.verifier
      return this.skipMode ? {
        appalias: [
          { required: true, message: '请输入中文名称', trigger: 'blur' },
          {validator: verifier.checkChinese, trigger: ['blur', 'change']},
          {validator: verifier.checkAllNull, trigger: ['blur']}
        ],
        appName: [
          { required: true, message: '请输入英文名称', trigger: 'blur' },
          {validator: verifier.checkEnglishNum, trigger: ['blur', 'change']},
          {validator: verifier.checkAllNull, trigger: ['blur']}
        ],
        appauthor: [
          { required: true, message: '请输入作者', trigger: 'blur' },
          {validator: verifier.checkAllNull, trigger: ['blur']}
        ],
        appversion: [
          { required: true, message: '请输入版本号', trigger: 'blur' },
          {validator: verifier.checkAllNull, trigger: ['blur']},
          {validator: verifier.checkVersion, trigger: ['blur', 'change']}
        ],
        desc: [
          { required: true, message: '请输入描述', trigger: 'blur' },
          {validator: verifier.checkAllNull, trigger: ['blur']}
        ],
        libPath: [
          { required: true, message: '请输入仓库地址', trigger: 'blur' },
          {validator: verifier.checkAllNull, trigger: ['blur']},
          {validator: verifier.checkUrl, trigger: ['blur', 'change']}
        ],
        filePath: [
          { required: true, message: '请输入文件路径', trigger: 'blur' },
          {validator: verifier.checkAllNull, trigger: ['blur']}
        ]
      } : {
        appalias: [
          { required: true, message: '请输入中文名称', trigger: 'blur' },
          {validator: verifier.checkChinese, trigger: ['blur', 'change']},
          {validator: verifier.checkAllNull, trigger: ['blur']}
        ],
        appName: [
          { required: true, message: '请输入英文名称', trigger: 'blur' },
          {validator: verifier.checkEnglishNum, trigger: ['blur', 'change']},
          {validator: verifier.checkAllNull, trigger: ['blur']}
        ],
        appauthor: [
          { required: true, message: '请输入作者', trigger: 'blur' },
          {validator: verifier.checkAllNull, trigger: ['blur']}
        ],
        appversion: [
          { required: true, message: '请输入版本号', trigger: 'blur' },
          {validator: verifier.checkAllNull, trigger: ['blur']},
          {validator: verifier.checkVersion, trigger: ['blur', 'change']},
          {validator: this.versionFormatter, trigger: ['blur', 'change']}
        ],
        desc: [
          { required: true, message: '请输入描述', trigger: 'blur' },
          {validator: verifier.checkAllNull, trigger: ['blur']}
        ]
      }
    }
  },
  created () {
    this.skipMode = Number(this.$route.query.mode) // 0为编辑1为新增
    this.formData = this.getAppInfo()
  }
}
</script>

<style lang="less">

</style>
