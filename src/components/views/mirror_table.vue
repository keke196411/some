<template>
  <div class="m-content pg-mirror">
    <div class="u-notify">
      <span><em>镜像管理</em></span>
      <a class="btn btn-download" @click="download">
        <i class="icon icon-download"></i>下载</a>
      <a class="btn btn-import" @click="importTo">
        <i class="icon icon-import"></i>导入</a>
      <div class="u-top-search">
        <input type="text" placeholder="请输入关键字" v-model="searcher.searchingInput">
        <a class="btn btn-search" @click="getlistData(searcher.currentPage, paginatorData.pageSize, searcher.searchingInput, searcher.status)">
          <i class="icon icon-magnify"></i>
        </a>
      </div>
      <el-select v-model="searcher.status" placeholder="状态" style="width:120px;">
        <el-option v-for="(item,index) in seriesOpts" :key="index" :value="item.value" :label="item.label">
        </el-option>
      </el-select>
    </div>
    <div class="m-wrap-table mirror" ref="table">
      <el-table :data="tableData" style="width: 100%" class="m-table">
        <el-table-column label="序号" prop="sort" align="center"></el-table-column>
        <el-table-column label="编号" prop="code" align="center" class-name="wp12" show-overflow-tooltip></el-table-column>
        <el-table-column label="标签" prop="label" align="center" class-name="wp12" show-overflow-tooltip></el-table-column>
        <el-table-column label="主机名称" prop="hostName" align="center" class-name="wp12"></el-table-column>
        <el-table-column label="描述" prop="describe" align="center" class-name="wp12" show-overflow-tooltip></el-table-column>
        <el-table-column label="大小" prop="size" align="center"></el-table-column>
        <el-table-column label="状态" prop="status" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="date" align="center" class-name="wp15"></el-table-column>
        <el-table-column label="操作" class-name="op-column wp17" align="center">
          <template slot-scope="scope">
            <a class="btn btn-upload" @click="uploadTo(scope.$index, scope.row)" title="上传仓库"></a>
            <a class="btn btn-export" @click="handleExport(scope.$index, scope.row,scope.column)" title="导出"></a>
            <a class="btn btn-view" @click="interview(scope.$index, scope.row)" title="查看"></a>
            <a class="btn btn-delete" @click="handleDelete(scope.$index, scope.row)" title="删除"></a>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination :current-page.sync="searcher.currentPage" :page-size="paginatorData.pageSize"
        layout="prev, pager, next,total" :total="paginatorData.totalPage" class="m-paginator" v-if="paginatorData.totalPage>0">
      </el-pagination>
    </div>

    <el-dialog title="导入镜像" :visible.sync="dialogFormVisible" width="620" custom-class="m-dialog" top="10vh" :before-close="uploadClose">
      <div class="upload-label">文件 :</div>
      <el-upload class="uploader-dialog" drag :action="uploadTarget" multiple :accpet="uploadType" :on-error="handleUploadError"
        :on-success="handleUploadSuccess" name="file" :data="formData" :auto-upload="false" ref="uploader">
        <i class="icon icon-uploader"></i>
        <div class="uploader-notifier">
          <p>将文件拖到此处，或
            <em>点击上传</em>
          </p>
          <p>只能上传docker格式文件，且不超过1GB</p>
        </div>
      </el-upload>

      <el-form label-position="top" :rules="rules" :model="formData" ref="uploadForm">
        <el-form-item label="名称 :" prop="image">
          <el-input v-model="formData.image"></el-input>
        </el-form-item>
        <el-form-item label="描述 :" prop="desc">
          <el-input type="textarea" v-model="formData.desc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('uploader','uploadForm')">取 消</el-button>
        <el-button type="primary" @click="handleUpload('uploader', 'uploadForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import httpRequest from '@/vender/js/httpUtils'
import utils from '@/vender/js/utils'
export default {
  data () {
    return {
      seriesOpts: [{
        label: '在用',
        value: true
      }, {
        label: '未启用',
        value: false
      }, {
        label: '全部状态',
        value: ''
      }],
      tableData: [],
      paginatorData: {
        totalPage: 0,
        pageSize: this.constants.PAGE_SETTING.pageSize
      },
      searcher: {
        status: '',
        searchingInput: '',
        currentPage: undefined
      },

      dialogFormVisible: false,
      uploadTarget: `${this.constants.BaseUrl}/image/images/import`,
      uploadType: '.tar,.zip',
      formData: {
        desc: '',
        image: ''
      },
      rules: {
        image: [
          {
            required: true,
            message: '请输入文件名称',
            trigger: 'blur'
          },
          {
            min: 1,
            message: '不能为空',
            trigger: 'blur'
          }
        ],
        desc: [{
          required: true,
          message: '请输入文件描述',
          trigger: 'blur'
        }]
      }
    }
  },
  watch: {
    searcher: {
      handler (v) {
        this.getlistData(v.currentPage, this.paginatorData.pageSize, v.searchingInput, v.status)
      },
      deep: true
    }
  },
  methods: {
    importTo () {
      this.dialogFormVisible = true
    },
    uploadTo (index, row) {
      this.$router.push({name: 'mirror_upload', query: {hostId: row.id, img: row.label}})
    },
    interview (index, row) {
      let hostId = this.tableData[index].id
      let imgName = row.label
      this.$router.push({name: 'mirror_interview', query: {hostId: hostId, name: imgName}})
    },
    download () {
      this.$router.push({name: 'mirror_download'})
    },
    handleExport (i, r) {
      let label = encodeURIComponent(r.label)
      window.open(`${this.constants.BaseUrl}/image/images/export?hostId=${r.id}&image=${label}`)
    },
    handleDelete (index, row, column) {
      this.$confirm('此操作将永久删除该镜像, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let label = encodeURIComponent(row.label)
        httpRequest.getRequest(`${this.constants.BaseUrl}/image/images/remove?hostId=${row.id}&imageName=${label}`, null, (res) => {
          this.getlistData(this.searcher.currentPage, this.paginatorData.pageSize)
          this.$message({
            type: 'success',
            message: `镜像'${res.data[0].imageId}'删除成功！`
          })
        })
      })
    },
    handleUploadError (error) {
      this.$message({
        message: `<strong>上传失败！</strong>
        <span class="uploader-failer">错误信息:${JSON.parse(error.message).message}</span>
        `,
        duration: 8000,
        type: 'error',
        dangerouslyUseHTMLString: true
      })
    },
    uploadClose (done) {
      let vue = this
      this.$confirm('离开将丢失未上传内容, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        vue.$refs['uploader'].clearFiles()
        vue.$refs['uploadForm'].clearValidate()
        vue.$refs['uploadForm'].resetFields()
      }).then(() => { done() })
    },
    handleUploadSuccess (response) {
      debugger
      this.$message({
        message: '上传成功！',
        type: 'success',
        duration: 2000
      })
      let t = setTimeout(() => {
        this.dialogFormVisible = false
        clearTimeout(t)
      }, 2200)
    },
    handleUpload (upload, form) {
      this.$refs[form].validate((valid, object) => {
        if (valid) {
          this.$refs[upload].submit()
        } else {
          console.log(object)
          return false
        }
      })
    },
    resetForm (upload, form) {
      this.$confirm('离开将丢失未上传内容, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        this.$refs[upload].clearFiles()
        this.$refs[form].clearValidate()
        this.$refs[form].resetFields()
      }).then(() => { this.dialogFormVisible = false })
    },
    getlistData (pageNum, pageSize, txt = '', st = '') {
      httpRequest.getRequest(`${this.constants.BaseUrl}/image/images/${pageNum}/${pageSize}?textFilter=${txt}&status=${st}`, null, (res) => {
        this.tableData = []
        let list = res.data.list
        if (!list) return
        this.paginatorData.totalPage = res.data.totalRecord
        list.forEach((item, index) => {
          this.tableData.push({
            hostName: item.host.hostname || '-',
            id: item.hostid,
            sort: ++index + this.paginatorData.pageSize * (this.searcher.currentPage - 1),
            code: item.imageid,
            label: item.imagename ? item.imagename : '-',
            describe: item.imageredes,
            size: item.imagesize + 'MB',
            status: item.used ? '在用' : '未启用',
            date: utils.formatDateFromLong(item.imagetime, 'yyyy-MM-dd hh:mm:ss')
          })
        })
      })
    }
  },
  created () {

  },
  mounted () {
    new Promise((resolve) => {
      resolve(this.paginatorData.pageSize = Math.floor((this.$refs['table'].clientHeight - 20 - 70 - 30) / 35))
    }).then(() => {
      this.searcher.currentPage = this.constants.PAGE_SETTING.pageNum
    })
  }
}

</script>

<style lang="less">
  .m-wrap-table.mirror{
    tr {
      th,
      td {
        width: (100%-80%)/3;
      }
    }
  }

</style>
