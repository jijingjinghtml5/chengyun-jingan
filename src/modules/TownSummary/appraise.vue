<template>
  <div>
    <chart-panel txt="街镇得分" :chartData="townData" class="panel"></chart-panel>
    <chart-panel txt="部门得分" :chartData="departmentData" class="panel"></chart-panel>
    <chart-panel txt="居民区得分" :chartData="townData" class="panel"></chart-panel>
    <wrap-title txt="人员得分" :level="2" icon="icon-biaoti" class="table-container">
      <m-list style="height: 100%;"
        :headers="headers"
        :dataset="tableData"
      ></m-list>
    </wrap-title>
  </div>
</template>
<script>
import WrapTitle from "@/components/MTitle/WrapTitle";
import MList from "@/components/MList/index";
import ChartPanel from "./chart";
export default {
  name: "Appraise",
  components: { ChartPanel, WrapTitle, MList },
  data() {
    return {
      townData: [
        ["时间", "南西", "静安寺", "石门二", "芷江西", "大宁路", "共和新", "彭浦镇", "临汾", "江宁路", "宝山路", "彭浦新村", "天目西"],
        ["2020.06", Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
        ["2020.07", Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
        ["2020.08", Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
        ["2020.09", Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
        ["2020.10", Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]
      ],
      departmentData: [
        ["时间", "自治办", "管理办", "服务办", "房管办", "平安办", "市容所", "市场监督", "城管中队", "发展办", "物业"],
        ["2020.06", Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
        ["2020.07", Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
        ["2020.08", Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
        ["2020.09", Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
        ["2020.10", Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]
      ],
      headers: [
        {
          label: "姓名",
          prop: "name"
        },
        {
          label: "所属街镇",
          prop: "town"
        },
        {
          label: "所属部门",
          prop: "department"
        },
        {
          label: "得分",
          prop: "score"
        }
      ],
      tableData: [
        { id: 1, name: "张建", town: "南京西路街道", department: "市容所", score: Math.floor(Math.random() * 100) },
        { id: 2, name: "张建", town: "南京西路街道", department: "市容所", score: Math.floor(Math.random() * 100) },
        { id: 3, name: "张建", town: "南京西路街道", department: "市容所", score: Math.floor(Math.random() * 100) },
        { id: 4, name: "张建", town: "南京西路街道", department: "市容所", score: Math.floor(Math.random() * 100) },
        { id: 5, name: "张建", town: "南京西路街道", department: "市容所", score: Math.floor(Math.random() * 100) },
        { id: 6, name: "张建", town: "南京西路街道", department: "市容所", score: Math.floor(Math.random() * 100) }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.panel{
  margin-bottom:20px;
}
.table-container{
  height: 490px;
}
</style>
