/**
 * Created by gaoler on 2018/1/20.
 */
var glovar=null;

function init(){
    delAll();
    glovar=globalVariable();
    var  dataName = document.getElementById("selectData").value;
    glovar.dataName=dataName;
    if(dataName=="./static/data/Iris.csv"){
        var dataLabelName="./static/data/Iris-norm_label.csv";
        var dataDimenName="./static/data/Iris-norm_dimen.csv";
        var jsonPath="./static/data/jsondata/iris_5000_1.json";
        var partPath="./static/data/jsondata/iris_5000_2.json";
    }
    if(dataName=="./static/data/Quality of Life Index.csv"){
        var dataLabelName="./static/data/Quality of Life Index-norm_label.csv";
        var dataDimenName="./static/data/Quality of Life Index-norm_dimen.csv";
        var jsonPath="./static/data/jsondata/Quality_life_5000_1.json";
        var partPath="./static/data/jsondata/Quality_life_5000_2.json";
    }
    if(dataName=="./static/data/Syn data.csv"){
        var dataLabelName="./static/data/Syn data-norm_label.csv";
        var dataDimenName="./static/data/Syn data-norm_dimen.csv";
        var jsonPath="./static/data/jsondata/Syn_data_5000_1.json";
        var partPath="./static/data/jsondata/Syn_data_5000_2.json";
    }
    if(dataName=="./static/data/Auto mpg.csv"){
        var dataLabelName="./static/data/Auto mpg-norm_label.csv";
        var dataDimenName="./static/data/Auto mpg-norm_dimen.csv";
        var jsonPath="./static/data/jsondata/Auto_mpg_5000_1.json";
        var partPath="./static/data/jsondata/Auto_mpg_5000_2.json";
    }
    if(dataName=="./static/data/Segmentation.csv"){
        var dataLabelName="./static/data/Segmentation_label.csv";
        var dataDimenName="./static/data/Segmentation_dimen.csv";
        var jsonPath="./static/data/jsondata/Segmentation_2500_1.json";
        var partPath="./static/data/jsondata/Segmentation_2500_2.json";
    }
    if(dataName=="./static/data/Boston house.csv"){
        var dataLabelName="./static/data/Boston house-norm_label.csv";
        var dataDimenName="./static/data/Boston house-norm_dimen.csv";
        var jsonPath="./static/data/jsondata/Boston_house_5000_1.json";
        var partPath="./static/data/jsondata/Boston_house_5000_2.json";
    }
    if(dataName=="./static/data/Cars.csv"){
        var dataLabelName="./static/data/Cars_label.csv";
        var dataDimenName="./static/data/Cars_dimen.csv";
        var jsonPath="./static/data/jsondata/Cars_5000_1.json";
        var partPath="./static/data/jsondata/Cars_5000_2.json";
    }
    loadData(dataLabelName,dataDimenName,dataName,jsonPath,partPath);
}

function loadData(dataLabelName,dataDimenName,dataName,jsonPath,partPath) {
        d3.csv(dataLabelName,function (error, data) {
            if (error) {
                console.log(error);
            }
            for (var i=0;i<data.length;i++){
                glovar.dataLabelName.push(data[i].label);
            }
            // console.log(glovar.dataLabelName)
        });
        d3.csv(dataDimenName,function (error, data) {
            if (error) {
                console.log(error);
            }
            for (var i=0;i<data.length;i++) {
                glovar.dataDimenName.push(data[i].dimen);
            }
            // console.log(glovar.dataDimenName);
        });
        d3.csv(dataName, function (error, data) {
            if (error) {
                console.log(error);
            }
            for (var i = 0; i < data.length; i++) {
                var tem = [];
                for (var j in data[i]) {
                    tem.push(Number(data[i][j]));
                }
                glovar.originData.push(tem);
            }
            // console.log(glovar.originData)

            glovar.normData=normlize(glovar.originData);
            /**
             * 加载系统界面
             */
            loadVis();
            /**
             * 导入json数据
             * @type {null}
             */
            loadJsondata(jsonPath, partPath);
        });
}

function loadJsondata(jsonPath,partPath){
        d3.json(jsonPath,function (error,data) {
            if(error){
                console.error(error);
            }
            var data1=data;
            loadPartdata(data1,partPath);
        });
}

function loadPartdata(data1,partPath){
    d3.json(partPath,function (error,data) {
            if(error){
                console.error(error);
            }
            var data2=data;
            for (var i = 0; i < data1.length; i++) {
            glovar.jsonQuality.push(data1[i].pointsQuality);
            glovar.jsonVector.push(data1[i].vector);
            }
            for (var i = 0; i < data2.length; i++) {
            glovar.jsonQuality.push(data2[i].pointsQuality);
            glovar.jsonVector.push(data2[i].vector);
            }

            //对各点所属集群初始化（全部置为-1）
            for(let i=0;i<glovar.dataSize;i++){
                glovar.clusterName.push(-1)
            }
            //随机生成每个点的真实标签
            for(let i=0;i<glovar.dataSize;i++){
                let random_number = Math.floor(Math.random()*Math.floor(5));
                glovar.actualCluster[i]=random_number;
            }

            requestPca();
        });

}

function loadVis() {
    glovar.dataSize=glovar.normData.length;
    glovar.dataDimension=glovar.normData[0].length;
    document.getElementById("DataSize").value = glovar.dataSize;
    document.getElementById("Dimension").value = glovar.dataDimension;

    //对数据点的颜色进行初始化
    for(var i=0;i<glovar.dataSize;i++){
        glovar.pointsColor.push(glovar.baseColor);
    }
    //对数据点的透明度初始化
    // for(var i=0;i<glovar.dataSize;i++){
    //     glovar.pointsOpacity.push(glovar.baseOpacity);
    // }
}

function delAll(){
    d3.select("#viewbody").select("svg").remove();
    d3.select("#projectionbody").select("svg").remove();
    document.getElementById('ColorButton').style.backgroundColor="#418ABD";
    glovar=null;
}

function normlize(data){
    var n=data.length;
    var m=data[0].length;
    var temnormdata=[];
    for(var i=0;i<m;i++){
        var tem=[];
        for(var j=0;j<n;j++){
            tem.push(data[j][i]);
        }
        var temmin=d3.min(tem,function(d){
            return d;
        });
        var temmax=d3.max(tem,function(d){
            return d;
        });
        var temnorm=[];
        for(var j=0;j<n;j++){
            temnorm.push((data[j][i]-temmin)/(temmax-temmin));
        }
        temnormdata.push(temnorm);
    }
    var resultdata=[];
    for(var i=0;i<temnormdata[0].length;i++){
        var temp=[];
        for (var j=0;j<temnormdata.length;j++){
            temp.push(temnormdata[j][i])
        }
        resultdata.push(temp);
    }
    return resultdata;
}