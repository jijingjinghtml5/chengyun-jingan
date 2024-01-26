<template>
    <div class="panel">
        <div class="title-wrap">
            <p class="title">
                舆情热点数
            </p>
            <img src="@/assets/images/close.png" @click="$emit('close')">
        </div>
        <div class="chart-title">
            <p>趋势统计</p>
            <div class="tabs">
                <p v-for="item in tabs" @click="handleClickTab(item.value)" :class="{ active: currentTab === item.value }"
                    :key="item.value">{{ item.name }}</p>
            </div>
        </div>
        <div class="chart-wrap">
            <LineChart :chartData="chartData"></LineChart>
        </div>
        <p class="chart-title">
            详情列表
        </p>
        <div class="article-content" v-if="showDetail">
            <img src="@/assets/images/close.png" class="closeImg" @click="showDetail = false">
            <div class="article-content-head">
                {{ content.title || content.topic }}
            </div>
            <div class="article-content-message">
                <p>来源：{{ content.display_name }}</p>
                <p>时间：{{ content.pub_time }}</p>
            </div>
            <div class="article-content-body">{{ content.text }}</div>
            <div class="article-content-foot">
                <div><img src="@/assets/images/like.png"> {{ content.like_count || 0 }}</div>
                <div><img src="@/assets/images/read.png"> {{ content.read_count || 0 }}</div>
                <div><img src="@/assets/images/share.png"> {{ content.forward_count || 0 }}</div>
                <div><img src="@/assets/images/comment.png"> {{ content.comment_count || 0 }}</div>
            </div>
        </div>
        <div class="detail-list" v-else>
            <div class="detail-list-item" v-for="item in list" @click="watchArticle(item)" :key="item.id">
                <p class="title">{{ item.title || item.topic }}</p>
                <p class="content">{{ item.text }}</p>
            </div>
            <div v-if="canLoad" @click="getMore" class="detail-list-item">
                <p class="title">加载更多</p>
            </div>
            <div v-else class="detail-list-item">
                <p class="title">暂无更多数据</p>
            </div>
        </div>
    </div>
</template>
<script>
import request from '@/http/request'
import LineChart from './components/Line/index'
export default {
    name: "YuqingPopup",
    components: {
        LineChart
    },
    data() {
        return {
            content: '',
            showDetail: false,
            offset: 0,
            canLoad: true,
            list: [],
            chartData: [],
            tabs: [
                { name: '日', value: 1 },
                { name: '周', value: 7 },
                { name: '月', value: 30 }
            ],
            currentTab: 1,
        };
    },
    mounted() {
        this.getData()
    },
    methods: {
        getMore() {
            this.offset += 20
            this.getList(this.list)
        },
        getList(oldList) {
            request({
                url: 'http://10.210.232.237/internal-api/gateway/opinion/opinion-warning',
                params: {
                    limit: 20,
                    offset: this.offset,
                    type: this.currentTab === 1 ? 'day' : this.currentTab === 7 ? 'week' : 'month'
                }
            }).then(res => {
                if (!res || !res.listData.length) {
                    this.canLoad = false
                }
                this.list = oldList ? oldList.concat(res.listData) : res.listData
            })
        },
        handleClickTab(value) {
            this.showDetail = false
            this.currentTab = value
            this.canLoad = true
            this.offset = 0
            this.getData()
        },
        async getData() {
            let resList = await request({
                url: 'http://10.210.232.237/internal-api/gateway/opinion/opinion-warning',
                params: {
                    limit: 20,
                    offset: this.offset,
                    type: this.currentTab === 1 ? 'day' : this.currentTab === 7 ? 'week' : 'month'
                }
            })
            this.list = resList.listData || []
            this.chartData = [
                ['日期', '数量'],
                ...resList.countData.map(item => {
                    return [item.date, item.count]
                })
            ]
        },
        watchArticle(article) {
            request({
                url: 'http://10.210.232.237/internal-api/gateway/opinion/opinion-warning-note',
                params: {
                    id: article.id
                }
            }).then(res => {
                this.content = (res && res[0]) || {}
                this.showDetail = true
            })
        }
    }
};
</script>
<style lang="scss" scoped>
.article-content {
    width: 100%;
    height: 100%;
    padding: 0.2rem;
    font-size: 0.28rem;
    background: url('~@/assets/images/content.png') center center no-repeat;
    background-size: 100% 100%;
    position: relative;

    .closeImg {
        position: absolute;
        top: 0.3rem;
        right: 0.3rem;
        width: 0.48rem;
        cursor: pointer;
    }

    &-head {
        font-size: 0.32rem;
        text-align: center;
        color: #99C5FF;
        font-weight: bold;
        padding: 0.2rem 0;
    }

    &-message {
        font-size: 0.24rem;
        color: #E5E5E5;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.3rem 0;
    }

    &-title {
        margin: 0.2rem 0;
        color: #e1e1e1;
        font-size: 0.32rem;
        font-weight: 600;
    }

    &-body {
        line-height: 0.5rem;
        max-height: 10.3rem;
        overflow-y: scroll;
    }

    &-foot {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #99C5FF;
        margin-top: 0.2rem;

        div {
            margin-right: 10px;
            padding-right: 10px;

            img {
                width: 0.24rem;
            }
        }
    }
}

.panel {
    position: absolute;
    top: 300px;
    left: 10px;
    z-index: 9999;
    width: 10rem;
    height: 15.6rem;
    padding: 0.15rem;
    background-color: rgba(#0f2e60, 0.6);
    font-size: 16*2px;
    color: #fff;

    .title-wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.2rem 0;

        .title {
            color: rgba(146, 185, 247, 1);
            font-size: 0.44rem;
        }

        img {
            width: 0.48rem;
            cursor: pointer;
        }
    }

    .chart-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.1rem;
        font-size: 0.32rem;

        .tabs {
            display: flex;
            align-items: center;

            p {
                border: 1px solid rgba(146, 185, 247, 1);
                padding: 0.05rem;
                cursor: pointer;

                &+p {
                    margin-left: 0.2rem;
                }

                &.active {
                    color: rgba(146, 185, 247, 1);
                }
            }
        }
    }

    .chart-wrap {
        width: 100%;
        height: 4rem;
    }

    .detail-list {
        height: 9.1rem;
        overflow: auto;

        &-item {
            background: url('~@/assets/images/article.png') center center no-repeat;
            background-size: 100% 100%;
            padding: 0.2rem;
            font-size: 0.28rem;

            &+.detail-list-item {
                margin-top: 0.2rem;
            }

            .title {
                color: rgba(146, 185, 247, 1);
                padding: 0.1rem 0;
                font-size: 0.32rem;
                text-align: center;
            }

            .content {
                overflow: hidden;
                -webkit-line-clamp: 2;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                line-height: 0.4rem;
            }
        }
    }
}
</style>
  