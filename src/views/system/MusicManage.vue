<template>
  <div>
    <el-row :gutter="15">
      <el-col :span="5">
        <el-container>
          <el-main>
            <el-input class="base_margin_b" v-model="musicCatalogQueryParam.keyword"
                      @input="loadMusicCatalogList(false, activeCatalog)" clearable placeholder="搜索歌单"
                      prefix-icon="el-icon-search" style="width: 100%"/>
            <el-row>
              <el-button class="base_margin_b" @click="openMusicCatalogDialog(true)" size="small">新增</el-button>
              <el-button @click="openMusicCatalogDialog(false)" size="small">编辑</el-button>
              <el-button size="small" type="danger" plain>删除</el-button>
              <el-button class="base_margin_b" @click="loadMusicCatalogList(false, activeCatalog)" size="small">刷新</el-button>
            </el-row>
            <ul class="base_list">
              <li class="base_list_item" :class="{ base_active: activeCatalog === musicCatalog.id }"
                  v-for="(musicCatalog, index) in musicCatalogList" :key="index"
                  @click="queryCatalog(musicCatalog.id)">
                <i class="base_margin_r_small"
                   :class="{ 'el-icon-folder': activeCatalog !== musicCatalog.id, 'el-icon-folder-opened' : activeCatalog === musicCatalog.id}"/>
                {{ musicCatalog.name }}
              </li>
            </ul>
          </el-main>
        </el-container>
      </el-col>
      <el-col :span="19">
<!--        <el-row class="base_margin_b">
          <el-container>
            <el-header height="80px">
              &lt;!&ndash; 搜索标题 &ndash;&gt;
              <div class="base_margin_r">
                <el-input v-model="musicQueryParam.keyword" @input="getTableData(true)" clearable placeholder="音乐标题" prefix-icon="el-icon-search"/>
              </div>
              &lt;!&ndash; 选择是否公开 &ndash;&gt;
              <div class="base_margin_r">
                <el-select v-model="musicQueryParam.isPublished" @input="getTableData(true)" clearable placeholder="是否公开">
                  <el-option label="公开" :value="true"/>
                  <el-option label="个人" :value="false"/>
                </el-select>
              </div>
              &lt;!&ndash; 时间范围 &ndash;&gt;
              <div class="base_margin_r">
                <el-date-picker type="daterange" v-model="musicQueryParam.time" @input="getTableData(true)"
                                range-separator="至"
                                start-placeholder="开始时间"
                                value-format="yyyy-MM-dd" clearable end-placeholder="结束时间" placeholder="上传时间"/>
              </div>
            </el-header>
          </el-container>
        </el-row>-->
        <el-row>
          <el-container>
            <el-header style="border-bottom: 2px solid rgb(241, 242, 243);">
              <div style="width: 50%; border-left: 3px solid #1882C4; padding-left: 1rem; color: #1882C4; font-size: 18px">
                曲目列表
              </div>
              <div style="width: 50%; display: flex; justify-content: flex-end">
                <el-button @click="openMusicDialog(true, null)" icon="el-icon-circle-plus-outline" size="medium" type="primary">新增歌曲</el-button>
                <el-button @click="copyMusicCatalogHTML" icon="el-icon-document-copy" size="medium" type="primary">复制代码</el-button>
                <el-button icon="el-icon-video-play" size="medium" type="primary">播放歌单</el-button>
                <el-button @click="getTableData(false)" size="medium" plain type="info" class="base_refresh_btn base_margin_l_small" icon="el-icon-refresh-right"/>
              </div>
            </el-header>
            <el-main>
              <el-table :data="musicTable" class="base_margin_b_large">
                <el-table-column label="序号" type="index" width="50" align="center"/>
                <el-table-column label="封面" align="center">
                  <template slot-scope="scope">
                    <el-avatar shape="square" size="medium" :src="scope.row.picViewUrl" :key="scope.row.picViewUrl"></el-avatar>
                  </template>
                </el-table-column>
                <el-table-column label="曲名" prop="title" align="center" show-overflow-tooltip/>
                <el-table-column label="歌手" prop="author" align="center" show-overflow-tooltip/>
                <el-table-column label="公开" width="120" align="center">
                  <template slot-scope="scope">
                    <el-switch v-model="scope.row.isPublished" @change="updatePublished(scope.row)"/>
                  </template>
                </el-table-column>
                <el-table-column label="创建时间" width="200" prop="createTime" align="center"/>
                <!-- 操作按钮 -->
                <el-table-column label="操作" width="240" align="center">
                  <template slot-scope="scope">
                    <el-tooltip effect="dark" content="复制歌曲HTML" placement="top">
                      <i @click="copyMusicHTML(scope.row)" class="el-icon-document-copy base_text_point"/>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="播放歌曲" placement="top">
                      <i class="el-icon-video-play base_text_point base_margin_l" />
                    </el-tooltip>
                    <el-tooltip effect="dark" content="编辑歌曲" placement="top">
                      <i @click="openMusicDialog(false, scope.row)" class="el-icon-edit-outline base_text_point base_margin_lr"/>
                    </el-tooltip>
                    <el-popconfirm confirm-button-text='好' cancel-button-text='手滑了' icon="el-icon-info" icon-color="red"
                                   title="将会物理删除歌曲、歌词和封面！" @onConfirm="removeMusic(scope.row)">
                      <i slot="reference" class="el-icon-delete base_text_point" />
                    </el-popconfirm>
                  </template>
                </el-table-column>
              </el-table>
              <!--分页-->
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                             :current-page="musicQueryParam.pageNo"
                             :page-sizes="[10, 20, 30]" :page-size="musicQueryParam.pageSize" :page-count="totalPage"
                             :total="total"
                             layout="total, sizes, prev, pager, next, jumper" background style="float: right;"
                             class="base_margin_b">
              </el-pagination>
            </el-main>
          </el-container>
        </el-row>
      </el-col>
    </el-row>
    <!-- 歌单新增/修改对话框 -->
    <el-dialog :title="musicCatalogDialogTitle" :visible.sync="musicCatalogDialog" :lock-scroll="false">
      <!-- 名称输入表单 -->
      <el-form ref="form" :model="musicCatalogSaveForm" label-width="80px">
        <el-form-item label="歌单名称" prop="name">
          <el-input v-model="musicCatalogSaveForm.name" placeholder="输入歌单名称"/>
        </el-form-item>
        <el-form-item label="歌单描述" prop="description">
          <el-input type="textarea" rows="5" v-model="musicCatalogSaveForm.description"/>
        </el-form-item>
        <el-form-item label="是否公开" prop="isPublished">
          <el-switch v-model="musicCatalogSaveForm.isPublished"/>
        </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="musicCatalogDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitMusicCatalog">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 歌曲新增/修改对话框 -->
    <el-dialog :title="musicDialogTitle" :visible.sync="musicDialog" :lock-scroll="false">
      <!-- 名称输入表单 -->
      <el-form ref="form" :model="musicSaveForm" label-width="50px">
        <el-form-item label="曲名" prop="title">
          <el-input v-model="musicSaveForm.title" placeholder="输入曲名" style="width: 60%"/>
        </el-form-item>
        <el-form-item label="歌手" prop="author">
          <el-input v-model="musicSaveForm.author" placeholder="输入歌手" style="width: 60%"/>
        </el-form-item>
        <el-form-item label="歌曲" prop="musicUrl">
          <el-input v-model="musicSaveForm.musicUrl" placeholder="输入歌曲URL或上传">
            <el-button slot="append">上传</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="封面" prop="picUrl">
          <el-input v-model="musicSaveForm.picUrl" placeholder="输入封面URL或上传">
            <el-button slot="append">上传</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="歌词" prop="lrcUrl">
          <el-input v-model="musicSaveForm.lrcUrl" placeholder="输入歌词URL或上传">
            <el-button slot="append">上传</el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="musicDialog = false">取 消</el-button>
        <el-button @click="submitMusic" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {Notification} from "element-ui";
import {getMusicCatalogList, saveMusicCatalog, updateMusicCatalog} from '@/api/MusicCatalog';
import {getMusicTable, saveMusic, updateMusic, deleteMusic} from '@/api/Music';

export default {
  name: "MusicManage",
  data() {
    return {
      musicCatalogQueryParam: {
        keyword: null
      },
      musicCatalogSaveForm: {
        id: null,
        name: null,
        description: null,
        isPublished: true
      },
      musicQueryParam: {
        catalogId: null,
        isPublished: null,
        time: null,
        keyword: null,
        pageNo: 1,
        pageSize: 10
      },
      musicSaveForm: {
        id: null,
        title: null,
        author: null,
        musicUrl: null,
        lrcUrl: null,
        picUrl: null,
        isPublished: true,
        catalogId: null
      },
      musicCatalogDialog: false,
      musicCatalogDialogTitle: null,
      musicDialog: false,
      musicDialogTitle: null,
      musicCatalogList: [],
      musicTable: [],
      totalPage: 0,
      total: 0,
      activeCatalog: null
    }
  },
  created() {
    this.loadMusicCatalogList(true, null)
  },
  watch: {
    //监听歌单新增/编辑对话框关闭
    musicCatalogDialog: function (value) {
      if (!value) {
        this.musicCatalogDialogTitle = null;
        this.musicCatalogSaveForm.id = null;
        this.musicCatalogSaveForm.name = null;
        this.musicCatalogSaveForm.description = null;
        this.musicCatalogSaveForm.isPublished = true;
      }
    },
    //监听歌曲新增/编辑对话框关闭
    musicDialog: function (value) {
      if (!value) {
        this.musicCatalogDialogTitle = null
        this.musicSaveForm.id = null
        this.musicSaveForm.title = null
        this.musicSaveForm.author = null
        this.musicSaveForm.musicUrl = null
        this.musicSaveForm.picUrl = null
        this.musicSaveForm.lrcUrl = null
        this.musicSaveForm.catalogId = null
        this.musicSaveForm.isPublished = true
      }
    }
  },
  methods: {
    //查询歌单下的歌曲列表
    queryCatalog(id) {
      this.activeCatalog = id
      this.getTableData(true)
    },
    //加载歌单列表
    loadMusicCatalogList(loadMusicTable, catalogId) {
      getMusicCatalogList(this.musicCatalogQueryParam).then(res => {
        if (res.success) {
          this.musicCatalogList = res.data
          if (catalogId !== null) {
            this.activeCatalog = catalogId
          } else if (this.musicCatalogList.length !== 0) {
            this.activeCatalog = this.musicCatalogList[0].id
          } else {
            this.activeCatalog = null
          }
          if (loadMusicTable) {
            this.getTableData(false)
          }
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    //获取音乐列表
    getTableData(clearPageNo) {
      //重置到第一页
      if (clearPageNo != null && clearPageNo) {
        this.musicQueryParam.pageNo = 1;
      }
      //处理时间筛选，将对象转为数组
      let time = null;
      time = this.musicQueryParam.time;
      if (time != null) {
        let arr = time.toString().split(",");
        this.musicQueryParam.startTime = arr[0] + " 00:00:00";
        this.musicQueryParam.endTime = arr[1] + " 23:59:59";
      } else {
        this.musicQueryParam.startTime = null;
        this.musicQueryParam.endTime = null;
      }
      //添加歌单ID
      this.musicQueryParam.catalogId = this.activeCatalog;
      getMusicTable(this.musicQueryParam).then(res => {
        if (res.success) {
          this.musicTable = res.data;
          this.totalPage = res.totalPage;
          this.total = res.total;
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    //打开歌单新增/修改对话框
    openMusicCatalogDialog(isInsert) {
      if (isInsert != null && isInsert) {
        //新增
        this.musicCatalogDialog = true
        this.musicCatalogDialogTitle = '增加歌单'
      } else {
        //更新
        if (this.activeCatalog === null) {
          this.$message.error("请选择一个歌单")
        } else {
          this.musicCatalogDialog = true
          this.musicCatalogList.forEach(item => {
            if (item.id === this.activeCatalog) {
              this.musicCatalogDialogTitle = item.name
              this.musicCatalogSaveForm.id = item.id
              this.musicCatalogSaveForm.name = item.name
              this.musicCatalogSaveForm.description = item.description
              this.musicCatalogSaveForm.isPublished = item.isPublished
            }
          })
          //如果遍历没结果，那么ID为空，这时为新增歌单
          if (this.musicCatalogSaveForm.id === null) {
            this.musicCatalogDialogTitle = '增加歌单'
          }
        }
      }
    },
    //打开歌曲新增/修改对话框
    openMusicDialog(isInsert, row) {
      this.musicSaveForm.catalogId = this.activeCatalog
      if (isInsert != null && isInsert) {
        //新增
        this.musicDialog = true
        this.musicDialogTitle = '增加歌曲'
      } else {
        //更新
        this.musicDialog = true
        this.musicCatalogDialogTitle = row.title
        this.musicSaveForm.id = row.id
        this.musicSaveForm.title = row.title
        this.musicSaveForm.author = row.author
        this.musicSaveForm.musicUrl = row.musicUrl
        this.musicSaveForm.picUrl = row.picUrl
        this.musicSaveForm.lrcUrl = row.lrcUrl
      }
    },
    //保存歌单
    submitMusicCatalog() {
      if (this.musicCatalogSaveForm.id === null) {
        //ID为空则新增
        saveMusicCatalog(this.musicCatalogSaveForm).then(res => {
          if (res.success) {
            this.musicCatalogDialog = false
            this.loadMusicCatalogList(false, this.activeCatalog)
            Notification({
              title: '保存成功',
              type: 'success',
              duration: 1500
            })
          } else {
            Notification({
              title: '保存失败',
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else {
        //ID不为空则更新
        updateMusicCatalog(this.musicCatalogSaveForm).then(res => {
          if (res.success) {
            this.musicCatalogDialog = false
            this.loadMusicCatalogList(false, this.activeCatalog)
            Notification({
              title: '保存成功',
              type: 'success',
              duration: 1500
            })
          } else {
            Notification({
              title: '保存失败',
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    //保存歌曲
    submitMusic() {
      if (this.musicSaveForm.id === null) {
        saveMusic(this.musicSaveForm).then(res => {
          if (res.success) {
            this.musicDialog = false
            this.getTableData(true)
            Notification({
              title: '保存成功',
              type: 'success',
              duration: 1500
            })
          } else {
            Notification({
              title: '保存失败',
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else {
        updateMusic(this.musicSaveForm).then(res => {
          if (res.success) {
            this.musicDialog = false
            this.getTableData(true)
            Notification({
              title: '保存成功',
              type: 'success',
              duration: 1500
            })
          } else {
            Notification({
              title: '保存失败',
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    //更新是否公开
    updatePublished(row) {
      let form = {}
      form.id = row.id
      form.isPublished = row.isPublished
      updateMusic(form).then(res => {
        if (res.success) {
          Notification({
            title: '保存成功',
            type: 'success',
            duration: 1500
          })
        } else {
          Notification({
            title: '保存失败',
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    //复制歌单HTML
    copyMusicCatalogHTML() {
      let api = window.env.API_BASE_URL + '/music/api?id=:id&type=:type'
      let server = 'local'
      let id = this.activeCatalog
      let type = 'playlist'
      let theme = '#66ccff'
      let code = '<meting-js api=\"' + api + '\" ' + 'server=\"' + server + '\" ' + 'id=\"' + id + '\" ' + 'type=\"' + type + '\" ' + 'theme=\"' + theme + '\"' + '>' + '</meting-js>'
      navigator.clipboard.writeText(code);
      this.$message.success("复制成功！")
    },
    //复制歌曲HTML
    copyMusicHTML(row) {
      let api = window.env.API_BASE_URL + '/music/api?id=:id&type=:type'
      let server = 'local'
      let id = row.id
      let type = 'song'
      let theme = '#66ccff'
      let code = '<meting-js api=\"' + api + '\" ' + 'server=\"' + server + '\" ' + 'id=\"' + id + '\" ' + 'type=\"' + type + '\" ' + 'theme=\"' + theme + '\"' + '>' + '</meting-js>'
      navigator.clipboard.writeText(code);
      this.$message.success("复制成功！")
    },
    //删除歌曲
    removeMusic(row) {
      deleteMusic(row).then(res => {
        if (res.success) {
          this.getTableData(true)
          Notification({
            title: '保存成功',
            type: 'success',
            duration: 1500
          })
        } else {
          Notification({
            title: '保存失败',
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    //分页监听，新pageNo
    handleSizeChange(newSize) {
      this.musicQueryParam.pageSize = newSize
      this.getTableData()
    },
    //分页监听，新pageSize
    handleCurrentChange(newPage) {
      this.musicQueryParam.pageNo = newPage
      this.getTableData()
    }
  }
}
</script>

<style scoped>
.el-container {
  background-color: #FFFFFF;
}

.el-header {
  display: flex;
  align-items: center;
  border-bottom: 2px solid rgb(241, 242, 243);
}

.base_list {
  list-style: none;
  margin: auto;
  padding: unset;
}

.base_list_item {
  cursor: pointer;
  padding: 0.5em;
  color: rgba(0, 0, 0, .4);
  border-radius: .5em;
  transition: .1s color ease, .1s padding-left ease, .1s background-color ease;
}

.base_list_item:hover {
  background: rgba(0, 0, 0, .03);
  color: rgba(0, 0, 0, .8);
}

.base_active {
  background: rgba(0, 0, 0, .05);
  color: rgba(0, 0, 0, .9);
}

.el-icon-edit-outline, .el-icon-video-play, .el-icon-document-copy {
  font-size: 1.2rem;
  font-weight: 100;
  color: #606266;
  transition: color .15s linear;
}

.el-icon-edit-outline:hover, .el-icon-video-play:hover, .el-icon-document-copy:hover {
  color: #66ccff;
}

.el-icon-delete {
  font-size: 1.2rem;
  font-weight: 100;
  color: #F56C6C;
}

/*.el-button + .el-button {*/
/*  margin-left: 0;*/
/*  margin-right: 1em;*/
/*}*/
</style>