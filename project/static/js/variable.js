/**
 * Created by gaoler on 2018/1/20.
 */
//全局变量
var globalVariable = function () {
    var ret = {};
    ret.jsonQuality=[];             //json数据中点的度量
    ret.jsonVector=[];              //json数据中的投影向量
    ret.dataLabelName=[];          //各个数据的名字
    ret.dataDimenName=[];          //数据维度的名字
    ret.dataName=null;
    ret.normData=[];                //归一化的数据
    ret.originData = [];            //原始数据集
    ret.dataSize=0;                 //原始数据大小
    ret.dataDimension=0;            //原始数据维度
    ret.pcaData=[];                  //pca数据
    ret.selected=[];                 //选中的数据
    ret.beginVec=[];                 //初始特征向量
    ret.endVec=[];                   //最终特征向量
    ret.newVec=[];                   //存储特征向量
    ret.actionVec=[];                //动画和拖拽交互完后的特征向量
    ret.saveVec=[];                  //保存的投影向量
    ret.clearStarCoordinate=0;      //是否展示星坐标图
    ret.angle=[];                     //维度的度数

    ret.labelSize=5;                    //真正有几类标签(集群）(暂时设定为5类）
    ret.actualCluster=[];               //每个点真实所属的集群名(暂时为随机生成）
    ret.clusterName=[];                //预测每个点所属集群的名字  初始全是-1
    ret.beginTime=0;                  //起始时间（从点击聚类模式开始计算,时间指标单位为秒）
    ret.painted_id=[];                  //当前轮次被着色的点
    //最多分为11类
    for(let i=0;i<11;i++){
        ret.painted_id[i]={
            predictedLabel:-1,
            setofId:[],
        }
    }
    ret.indic_record=[];              //记录所有轮次的指标

    ret.colorIndex=0;                //给数据点添加颜色的索引值
    ret.Is_set=false;                //是否给数据点赋了颜色
    ret.setColor = ["#4682B4", "#CA312E", "#BBD35E", "#A67C52", "#764698", "#8dd3c7", "#2CA02C", "#FEC852", "#3E54A0", "#1EB0EE"];  //给数据点添加颜色

    ret.baseColor="#418ABD";        //数据点的初始颜色
    ret.selectColor="#FFA500";      //数据点的选中颜色
    ret.pointsColor=[];              //所有数据的颜色
    ret.pointsOpacity=[];            //所有数据的透明度
    ret.baseOpacity=1;               //数据点的初始透明度
    ret.selectOpacity=1;             //数据点的初始透明度
    ret.brushingColor=null;          //刷取的初始颜色

    ret.paintFlag=0;
    ret.Is_point=true;                //是否选择点选
    ret.Is_line=false;               //是否选择直线
    ret.Is_lasso=false;              //是否选择曲线
    ret.weightVec=[];                //改变维度权重后的向量

    ret.lineCoordinate=[];          //画直线的坐标
    ret.pathCoordinate=[];          //画路径的坐标
    ret.mdsData=[];                  //mds数据
    ret.backtoviewVec=[];           //在trailmap点击回看时的向量

    ret.dblFlag=0;
    ret.dblCoordinate=[];
    ret.dblVec=[];

    /**
     * 
     * 测试模式
     * 
     */
    ret.layout = {
        'min_angle':0,
        'cross':0,
    }
    /**
     * 
     * 2023.08.08邓志伟新增
     * 
     */
    ret.trail_links = [];//默认连接线
    ret.trail_pos = [];//连接线的端点位置
    ret.begin_id = -1;//当前略缩图的id



    return ret;
}
