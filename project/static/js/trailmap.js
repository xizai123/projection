/**
 * 保存投影
 */
function saveProjection(){

    deleteTrailmapInfor();
    glovar.saveVec.push(glovar.actionVec);
    if(glovar.saveVec.length==1){
        var offsetx=300;
        var offsety=300;
        var width = 100;
        var height = 100;
        var subScatterID=glovar.saveVec.length-1;
        var points = [];
        d3.select("#g1").selectAll("circle").each(function (d, i) {
                var me = d3.select(this);
                var cx = parseFloat(me.attr("cx"));
                var cy = parseFloat(me.attr("cy"));
                var color = glovar.baseColor;
                var opacity=glovar.baseOpacity;
                points.push([cx, cy, color,opacity]);
            });
        paintSubscatter(points,subScatterID,offsetx,offsety,width,height);
    }
    if(glovar.saveVec.length>1){
        requestMds(glovar.saveVec);
    }
}

/**
 * 删除trailmap中的信息
 */
function deleteTrailmapInfor(){
    d3.select("#linePath").remove();
    d3.select("#animationCircle").remove();
    d3.selectAll(".connectLine").remove();
    d3.selectAll(".circleFrame").attr("stroke","#6D6D6D");

    glovar.lineCoordinate=[];
    glovar.pathCoordinate=[];
    glovar.backtoviewVec=[];

    glovar.dblFlag=0;
    glovar.dblCoordinate=[];
    glovar.dblVec=[];
}

/**
 * 将mds布局数据转换到子空间投影
 * @param mdsdata
 */
function converSubspace(mdsdata){
    var height=700;
    var width=700;
    var xScale = d3.scale.linear()
        .domain([-0.8,0.8])
        .range([0, width]);
    var yScale = d3.scale.linear()
        .domain([-0.8,0.8])
        .range([height, 0]);
    for(var i=0;i<mdsdata.length;i++){
        var points=[];
        if(i<mdsdata.length-1){
            d3.selectAll(".circle"+i).each(function () {
            var me = d3.select(this);
            var cx = parseFloat(me.attr("cx"));
            var cy = parseFloat(me.attr("cy"));
            var color = glovar.baseColor;
            var opacity=glovar.baseOpacity;
            points.push([cx, cy, color,opacity]);
        });
        }else{
            d3.select("#g1").selectAll("circle").each(function () {
                var me = d3.select(this);
                var cx = parseFloat(me.attr("cx"));
                var cy = parseFloat(me.attr("cy"));
                var color = glovar.baseColor;
            var opacity=glovar.baseOpacity;
                points.push([cx, cy, color,opacity]);
            });
        }
        var width=100;
        var height=100;
        var offsetx=xScale(mdsdata[i][0])-width/2;
        var offsety=yScale(mdsdata[i][1])-height/2;
        paintSubscatter(points,i,offsetx,offsety,width,height);
    }
}

/**
 * 画子空间散点图
 * @param points
 * @param subScatterID
 * @param offsetx
 * @param offsety
 * @param width
 * @param height
 */
function paintSubscatter(points,subScatterID,offsetx,offsety,width,height){
    d3.select("#sg"+subScatterID).remove();
    var svg=d3.select("#projectionbody").select("svg");
    var g=svg.append("g")
        .attr("id","sg"+subScatterID)
        .attr("transform","translate("+offsetx+','+offsety+")");

    var max_x = d3.max(points, function (d) {
        return d[0];
    });
    var max_y = d3.max(points, function (d) {
        return d[1];
    });
    var min_x = d3.min(points, function (d) {
        return d[0];
    });
    var min_y = d3.min(points, function (d) {
        return d[1];
    });
    var xScale = d3.scale.linear()//定义X轴比例尺
        .domain([min_x, max_x])
        .range([0,width]);

    var yScale = d3.scale.linear()//定义Y轴比例尺
        .domain([min_y, max_y])
        .range([0,height]);
    var timer=null;
    var cr=Math.sqrt(2)*(width/2);
    g.append("circle")
        .attr("cx",width/2)
        .attr("cy",height/2)
        .attr("r",cr)
        .attr("class","circleFrame")
        .attr("id",subScatterID)
        .attr("stroke","#6D6D6D")
        .attr("stroke-width","1px")
        .attr("fill","none")
        .style("pointer-events","all")
        .on("click",function(){
                clearTimeout(timer);
                var me = d3.select(this);
                timer=setTimeout(function(){
                d3.selectAll(".connectLine").remove();
                glovar.dblFlag=0;
                glovar.dblCoordinate=[];
                glovar.dblVec=[];

                me.attr("stroke", "yellow");
                var ID = me.attr("id");
                var cx = parseFloat(me.attr("cx"));
                var cy = parseFloat(me.attr("cy"));
                glovar.lineCoordinate.push([cx + offsetx, cy + offsety]);
                glovar.backtoviewVec.push(glovar.saveVec[ID]);
                paintDotline();
                },300);
            })
        .on("dblclick", function () {

            clearTimeout(timer);
            var gme = d3.select(this);
            d3.selectAll(".circleFrame").attr("stroke","#6D6D6D");
            d3.select("#animationCircle").remove();
            d3.selectAll("#linepath").remove();
            glovar.lineCoordinate=[];
            glovar.pathCoordinate=[];
            glovar.backtoviewVec=[];

            var ID = parseInt(gme.attr("id"));
            var gcx = parseFloat(gme.attr("cx"));
            var gcy = parseFloat(gme.attr("cy"));
            glovar.dblCoordinate.push([gcx + offsetx, gcy + offsety]);
            glovar.dblVec.push(glovar.saveVec[ID]);
            if(glovar.dblFlag==0){
                var gpoints = [];
                g.selectAll(".circle" + subScatterID)
                    .each(function (d, i) {
                        var me = d3.select(this);
                        var cx = parseFloat(me.attr("cx"));
                        var cy = parseFloat(me.attr("cy"));
                        var opacity = me.attr("opacity");
                        var color = me.attr("fill");
                        gpoints.push([cx, cy, color, opacity]);
                    });
                for (var i = 0; i < gpoints.length; i++) {
                    glovar.pointsColor[i] = gpoints[i][2];
                    // glovar.pointsOpacity[i] = gpoints[i][3];
                }
                glovar.beginVec = glovar.saveVec[ID];
                paintSourceThumbnail(glovar.beginVec);
                d3.select("#g6").remove();//删除终止缩略图
                updateView(glovar.beginVec);
            }else{
                paintConnectline(glovar.dblFlag);
            }
            glovar.dblFlag++;
        });

    g.selectAll(".circle"+subScatterID)
        .data(points)
        .enter()
        .append("circle")
        .attr("class","circle"+subScatterID)
        .attr("cx", function (d, i) {
            return xScale(d[0]);
        })
        .attr("cy", function (d, i) {
            return yScale(d[1]);
        })
        .attr("fill", function (d, i) {
            return d[2];
        })
        .attr("opacity",function(d,i){
            return d[3];
        })
        .attr("r", 2);
}

/**
 * 缩放拖动条
 */
function zoomSilder(){
    var btn = document.getElementById('move');
    var bar = document.getElementById('bl');
    var f = this, g = document, b = window, m = Math;
        btn.onmousedown = function (e) {
            var x = (e || b.event).clientX;
            var l = btn.offsetLeft;
            var max = bar.offsetWidth - this.offsetWidth;
            document.onmousemove = function (e) {
                var thisX = (e || b.event).clientX;
                var to = m.min(max, m.max(-2, l + (thisX - x)));
                var btn_length=250;
                var bar_length=20;
                var total_length=btn_length-bar_length;
                var telecoff=((total_length-to)/total_length)*0.6+0.4;
                zoomSubscatter(telecoff);
                btn.style.left = to + 'px';
                //此句代码可以除去选中效果
                b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
            };
            //注意此处是document 才能有好的拖动效果
            document.onmouseup = function(){document.onmousemove=null;};
        }
}

/**
 * 子空间缩放函数
 * @param telecoff
 */
function zoomSubscatter(telecoff){
    d3.select("#linePath").remove();
    d3.select("#animationCircle").remove();
    glovar.lineCoordinate=[];
    glovar.backtoviewVec=[];

    var height=700;
    var width=700;
    var xScale = d3.scale.linear()
        .domain([-0.5,0.5])
        .range([0, width]);
    var yScale = d3.scale.linear()
        .domain([-0.5,0.5])
        .range([height, 0]);
    if(glovar.saveVec.length==1){
        var subScatterID=0;
        var points=[];
        d3.selectAll(".circle"+subScatterID).each(function (d, i) {
            var me = d3.select(this);
            var cx = parseFloat(me.attr("cx"));
            var cy = parseFloat(me.attr("cy"));
            var color = me.attr("fill");
            var opacity=me.attr("opacity");
            points.push([cx, cy, color,opacity]);
        });
        var width=100*telecoff;
        var height=100*telecoff;
        var offsetx=300+100*(1-telecoff)/2;
        var offsety=300+100*(1-telecoff)/2;
        paintSubscatter(points,subScatterID,offsetx,offsety,width,height);
    }
    if(glovar.saveVec.length>1){
        for(var i=0;i<glovar.mdsData.length;i++){
        var subScatterID=i;
        var points=[];
        d3.selectAll(".circle"+subScatterID).each(function (d, i) {
            var me = d3.select(this);
            var cx = parseFloat(me.attr("cx"));
            var cy = parseFloat(me.attr("cy"));
            var color = me.attr("fill");
            var opacity=me.attr("opacity");
            points.push([cx, cy, color,opacity]);
        });
        var width=100*telecoff;
        var height=100*telecoff;
        var offsetx=xScale(glovar.mdsData[i][0])-width/2;
        var offsety=yScale(glovar.mdsData[i][1])-height/2;
        paintSubscatter(points,subScatterID,offsetx,offsety,width,height);
        }
    }
}

/**
 * 画动画中的连线
 */
function paintDotline(){
    var svg=d3.select("#projectionbody").select("svg");
    d3.select("#linePath").remove();

    var linepath=d3.svg.line();
    if(glovar.lineCoordinate.length==1){
        return
    }else {
        svg.append("path")
            .attr("id","linePath")
            .attr("d",linepath(glovar.lineCoordinate))
            .attr("stroke", "#6D6D6D")
            .attr("stroke-width", "1px")
            .attr("stroke-dasharray",3)
            .attr("fill", "none");
        }
    }

/**画连接的线
 *
 */
function paintConnectline(i){
    var svg=d3.select("#projectionbody").select("svg");
    svg.append("line")
        .attr("id","connectPath"+i)
        .attr("class","connectLine")
        .attr("x1",glovar.dblCoordinate[0][0])
        .attr("y1",glovar.dblCoordinate[0][1])
        .attr("x2",glovar.dblCoordinate[i][0])
        .attr("y2",glovar.dblCoordinate[i][1])
        .attr("stroke", "#9D9D9D")
        .attr("stroke-width", "4px")
        .attr("stroke-dasharray",2)
        .attr("fill", "none")
        .on("mouseover",function(){
            d3.select(this).attr("cursor","pointer").attr("stroke","yellow");
        })
        .on("mouseout",function(){
            d3.select(this).attr("cursor","default").attr("stroke","#9D9D9D");
        })
        .on("click",function(){
            var me=d3.select(this);
            var ID=me.attr("id");
            me.attr("stroke","yellow");
            for(var j=0;j<glovar.dblVec.length;j++){
                if(ID==("connectPath"+j)){
                    glovar.endVec=glovar.dblVec[j];
                }
            }
            paintTargetThumbnail(glovar.endVec);
            setAnimation();
        });
}

/**
 * 子空间动画函数
 */
function setSubAnimation(){
    getSubvector();
    paintAnimationCircle(glovar.lineCoordinate[0][0],glovar.lineCoordinate[0][1]);
    paintSourceThumbnail(glovar.beginVec);
    paintTargetThumbnail(glovar.endVec);

    //对数据点的透明度进行初始化
    // glovar.pointsOpacity=[];
    // for(var i=0;i<glovar.dataSize;i++){
    //     glovar.pointsOpacity.push(glovar.baseOpacity);
    // }
    //对数据点的颜色进行初始化
    glovar.pointsColor=[];
    for(var i=0;i<glovar.dataSize;i++){
        glovar.pointsColor.push(glovar.baseColor);
    }
    var k=100;
    var pathCoordinate=[];
    glovar.pathCoordinate=[];
    for(var i=0;i<(glovar.lineCoordinate.length-1);i++){
        var disx=(glovar.lineCoordinate[i+1][0]-glovar.lineCoordinate[i][0]);
        var disy=(glovar.lineCoordinate[i+1][1]-glovar.lineCoordinate[i][1]);
        var coff=disy/disx;
        for(var j=0;j<=k;j++){
            var cx=glovar.lineCoordinate[i][0]+disx*(j/k);
            var cy=glovar.lineCoordinate[i][1]+disx*coff*(j/k);
            pathCoordinate.push([cx,cy]);
            glovar.pathCoordinate.push([cx,cy]);
        }
    }

    var count=0;
    var delaytime=20*(glovar.lineCoordinate.length-1);
    var flag=(k+1)*(glovar.lineCoordinate.length-1)-1;
    var timeid = setInterval(repaintSubspace,delaytime);

    function repaintSubspace() {

        paintAnimationCircle(pathCoordinate[count][0],pathCoordinate[count][1]);
        paintScatter(generateData(glovar.newVec[count]));
        paintCirlceRing(glovar.newVec[count]);
        updateSlider(count/flag);
        if(count>=flag){
            clearInterval(timeid);
            textDetection();
        }
        count++;
    }
}

/**
 * 获得子空间向量
 */
function getSubvector(){
    var k=100;
    glovar.newVec=[];
    for(var i=0;i<(glovar.backtoviewVec.length-1);i++){
        glovar.beginVec=glovar.backtoviewVec[i];
        glovar.endVec=glovar.backtoviewVec[i+1];
        var tdVec=glovar.beginVec;
        for(var j=0;j<=k;j++){
         var temvec = getMiddlevec(j, k, tdVec, glovar.endVec);
         glovar.newVec.push(temvec);
        }
    }
    glovar.beginVec=glovar.backtoviewVec[0];
    glovar.endVec=glovar.backtoviewVec[glovar.backtoviewVec.length-1];
}

/**
 * 画动画中的点
 * @param cx
 * @param cy
 */
function paintAnimationCircle(cx,cy){
    d3.select("#animationCircle").remove();
    var svg=d3.select("#projectionbody").select("svg");
    var cr=8;
    svg.append("circle")
        .attr("id","animationCircle")
        .attr("cx",cx)
        .attr("cy",cy)
        .attr("r",cr)
        .attr("fill","yellow");
}


