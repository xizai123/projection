/**
 * Created by gaoler on 2018/1/20.
 */
//传到后台计算PCA的函数
function requestPca()
{
    var formData=new FormData();
    formData.append("id","requestPca");
    formData.append("csrfmiddlewaretoken", token);
    formData.append("Data",glovar.normData);
    formData.append("n",glovar.dataSize);
    formData.append("m",glovar.dataDimension);

   $.ajaxSetup({
        data: {csrfmiddlewaretoken: '{{ csrf_token }}' },
    });

   $.ajax(
        {
            url:"/",
            type:"POST",
            data:formData,
            processData: false,
            contentType: false,
            success:function(data){
                jsonData = $.parseJSON(data);
                dataPca(jsonData);
            },
            error:function(data){
                console.log("request failed");
            }
        });
}

//接收PCA的函数
function dataPca(data)
{
    for(var i=0;i<data.res.length;i++){
        var tem=[];
        for(var j=0;j<data.res[0].length;j++){
            tem.push(data.res[i][j])
        }
        glovar.pcaData.push(tem);
    }
    var tembegin=[];
    for(var i=0;i<data.vec.length;i++){
        var tem=[];
        for(var j=0;j<data.vec[0].length;j++){
            tem.push(data.vec[i][j]);
        }
        tembegin.push(tem);
    }
    glovar.beginVec=transformArray(tembegin);
    glovar.actionVec=transformArray(tembegin);
    // console.log(glovar.actionVec);
    initView();
}

//传到后台计算COV的函数
function requestCov(selectData,remainData){
    var selectLen=selectData.length;
    var remainLen=remainData.length;
    var formData=new FormData();
    formData.append("id","requestCov");
    formData.append("csrfmiddlewaretoken", token);
    formData.append("data",glovar.originData);
    formData.append("selectdata",selectData);
    formData.append("remaindata",remainData);
    formData.append("sn",selectLen);
    formData.append("rn",remainLen);
    formData.append("m",glovar.dataDimension);
    formData.append("n",glovar.dataSize);

   $.ajaxSetup({
        data: {csrfmiddlewaretoken: '{{ csrf_token }}' },
    });
   $.ajax(
        {
            url:"/",
            type:"POST",
            data:formData,
            processData: false,
            contentType: false,
            success:function(data){
                jsonData = $.parseJSON(data);
                dataCov(jsonData);
            },
            error:function(data){
            }
        });
}

//接收COV函数
function dataCov(data){

        glovar.covData=[];
        for(var i=0;i<data.res.length;i++){
        var tem=[];
        for(var j=0;j<data.res[0].length;j++){
            tem.push(data.res[i][j]);
        }
        glovar.covData.push(tem);
    }
    var temend=[];
    for(var i=0;i<data.vec.length;i++){
        var tem=[];
        for(var j=0;j<data.vec[0].length;j++){
            tem.push(data.vec[i][j]);
        }
        temend.push(tem);
    }
    glovar.endVec=transformArray(temend);
    setAnimation();
}
function requestMds(){
    var savesize=glovar.saveVec.length;
    var saveVectorsize=glovar.saveVec[0].length;
    var saveVectordimen=glovar.saveVec[0][0].length;
    var formData=new FormData();
    formData.append("id","requestMds");
    formData.append("csrfmiddlewaretoken", token);
    formData.append("Data",glovar.saveVec);
    formData.append("n",savesize);
    formData.append("m",saveVectorsize);
    formData.append("s",saveVectordimen);

   $.ajaxSetup({
        data: {csrfmiddlewaretoken: '{{ csrf_token }}' },
    });
   $.ajax(
        {
            url:"/",
            type:"POST",
            data:formData,
            processData: false,
            contentType: false,
            success:function(data){
                jsonData = $.parseJSON(data);
                dataMds(jsonData);
            },
            error:function(data){
            }
        });
}
function dataMds(data){
    glovar.mdsData=data.mds;
    converSubspace(glovar.mdsData);
}

function requestDsimilarity(){
    // console.log(glovar.normData);
    // console.log(glovar.saveVec);
    // console.log(glovar.jsonVector);
    // console.log(glovar.saveVec);
    var totalVec=[];
    for(var i=0;i<glovar.jsonVector.length;i++){
        totalVec.push(transformArray(glovar.jsonVector[i]));
    }
    // console.log(totalVec);
    var totalsize=glovar.jsonVector.length;
    var savesize=glovar.saveVec.length;
    var saveVectorsize=glovar.saveVec[0].length;
    var saveVectordimen=glovar.saveVec[0][0].length;
    var formData=new FormData();
    formData.append("id","requestDsimilarity");
    formData.append("csrfmiddlewaretoken", token);
    formData.append("Data",glovar.normData);
    formData.append("n",glovar.dataSize);
    formData.append("m",glovar.dataDimension);
    formData.append("vectorData",totalVec);
    formData.append("selectData",glovar.saveVec);
    formData.append("vn",totalsize);
    formData.append("sn",savesize);
    formData.append("sm",saveVectorsize);
    formData.append("smm",saveVectordimen);

   $.ajaxSetup({
        data: {csrfmiddlewaretoken: '{{ csrf_token }}' },
    });
   $.ajax(
        {
            url:"/",
            type:"POST",
            data:formData,
            processData: false,
            contentType: false,
            success:function(data){
                jsonData = $.parseJSON(data);
                dataDsimilarity(jsonData);
            },
            error:function(data){
            }
        });
}

function dataDsimilarity(data){
    glovar.beginVec=glovar.actionVec;
    glovar.endVec=data.vec;
    paintSourceThumbnail(glovar.beginVec);
    paintTargetThumbnail(glovar.endVec);
    setAnimation();
}


