/**
 * 保存投影
 */



/**
 * 
 * 轨迹更新流程笔记：
 * glovar.actionVec是最新的向量
 * glovar.saveVec存储了历次保存轨迹时的actionVec
 * 
 * 每次点击”保存“按钮，会调用saveProjection函数
 * 如果是第一次保存轨迹，那么直接截取g1中的坐标保存。
 * 如果是第二次以及以后保存轨迹，那么需要调用requestMds算法，将结果保存在glovar.mdsData，mdsData的size与保存的轨迹数等同
 * 再mdsData更新后，随后，调用converSubspace，更新旧轨迹图的位置和新建轨迹图（mdsData主要是更新位置）。
 * 
 *  
 * 
 * 
 * 
 */

//点击保存视为一次交互结束
function saveProjection(){

    deleteTrailmapInfor();//删除先前所有的轨迹信息

    glovar.saveVec.push(glovar.actionVec);
    console.log('saveProjection-glovar:',glovar)


    let subScatterID=glovar.saveVec.length-1;
    //装入link
    if(glovar.begin_id != -1 && glovar.begin_id != parseInt(subScatterID)){
        glovar.trail_links.push([glovar.begin_id,parseInt(subScatterID)])
    }

    console.log('links:', glovar.trail_links)

    //将当前id保存
    glovar.begin_id = parseInt(subScatterID)


    if(glovar.saveVec.length==1){//第一次保存轨迹
        var offsetx=300;
        var offsety=300;
        var width = 100;
        var height = 100;
        
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
    if(glovar.saveVec.length>1){//第二次及以后保存轨迹
        requestMds(glovar.saveVec);
    }
}

//记录当前轮次的指标
function updateRecord(){
    //计算新增准确率
    let res=[];
    for(let i=0;i<=10;i++)res[i]=0;
    for(let i=0;i<glovar.checked_id.length;i++){
        let id=glovar.checked_id[i];
        let clusterId=glovar.actualCluster[id];
        res[clusterId]++;
    }
    let accNow=0;
    for(let i=0;i<=10;i++)accNow=Math.max(accNow,res[i]);accNow/=glovar.dataSize;
    let accLast=glovar.indic_record[glovar.indic_record.length-1].acc;
    let acc=accNow+accLast;
    //
    let indic_now={
        cumula_time:Date.now()-glovar.beginTime,        //累计时间
        acc:acc,                                        //准确率
    }
    glovar.indic_record.push(indic_now)


    /**
     * 
     * 更新layout的信息
     * 
     */
    //统计最小平均夹角
    glovar.layout.min_angle = 0;
    const getAngle = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => {
        const dot = x1 * x2 + y1 * y2
        const det = x1 * y2 - y1 * x2
        const angle = Math.atan2(det, dot) / Math.PI * 180
        return Math.round(angle + 360) % 360
    }

    let count = 0;

    for(let i = 0;i < glovar.trail_pos.length;i++){
        let neighbors = []
        for(let l of glovar.trail_links){
            if(l[0] == i){
                neighbors.push(glovar.trail_pos[l[1]])
            }
            if(l[1] == i){
                neighbors.push(glovar.trail_pos[l[0]])
            }
        }
        
        if(neighbors.length >= 2){
            let min_angle = 360;
            for(let j = 0;j < neighbors.length - 1;j++){
                for(let k = j+1; k < neighbors.length;k++){
                    const angle = getAngle({
                        x:neighbors[j][0] - glovar.trail_pos[i][0],
                        y:neighbors[j][1] - glovar.trail_pos[i][1]
                    },{
                        x:neighbors[k][0] - glovar.trail_pos[i][0],
                        y:neighbors[k][1] - glovar.trail_pos[i][1]
                    })
                    if(angle < min_angle){
                        min_angle = angle;
                    }
                }
            }
            glovar.layout.min_angle = glovar.layout.min_angle + min_angle;
            count = count + 1;
        }
        
    }
    if(count != 0){
        glovar.layout.min_angle = 1.0 * glovar.layout.min_angle / count;
    }  
    else{
        glovar.layout.min_angle = 360;
    }

    //统计交叉数
    glovar.layout.cross = 0;
    function judgeIntersect(x1,y1,x2,y2,x3,y3,x4,y4) {
        //快速排斥：
        //两个线段为对角线组成的矩形，如果这两个矩形没有重叠的部分，那么两条线段是不可能出现重叠的
        //这里的确如此，这一步是判定两矩形是否相交
        //1.线段ab的低点低于cd的最高点（可能重合）
        //2.cd的最左端小于ab的最右端（可能重合）
        //3.cd的最低点低于ab的最高点（加上条件1，两线段在竖直方向上重合）
        //4.ab的最左端小于cd的最右端（加上条件2，两直线在水平方向上重合）
        //综上4个条件，两条线段组成的矩形是重合的
        //特别要注意一个矩形含于另一个矩形之内的情况
        if(!(Math.min(x1,x2)<=Math.max(x3,x4) && Math.min(y3,y4)<=Math.max(y1,y2)&&Math.min(x3,x4)<=Math.max(x1,x2) && Math.min(y1,y2)<=Math.max(y3,y4)))
            return false;
        //跨立实验：
        //如果两条线段相交，那么必须跨立，就是以一条线段为标准，另一条线段的两端点一定在这条线段的两段
        //也就是说a b两点在线段cd的两端，c d两点在线段ab的两端
        var u,v,w,z
        u=(x3-x1)*(y2-y1)-(x2-x1)*(y3-y1);
        v=(x4-x1)*(y2-y1)-(x2-x1)*(y4-y1);
        w=(x1-x3)*(y4-y3)-(x4-x3)*(y1-y3);
        z=(x2-x3)*(y4-y3)-(x4-x3)*(y2-y3);
        return (u*v<0 && w*z<0);
    }
    for(let i = 0;i < glovar.trail_links.length - 1;i++){
        for(let j = i + 1; j < glovar.trail_links.length; j++){
            let pos1 = glovar.trail_pos[glovar.trail_links[i][0]]
            let pos2 = glovar.trail_pos[glovar.trail_links[i][1]]
            let pos3 = glovar.trail_pos[glovar.trail_links[j][0]]
            let pos4 = glovar.trail_pos[glovar.trail_links[j][1]]
            if(judgeIntersect(pos1[0],pos1[1],pos2[0],pos2[1],pos3[0],pos3[1],pos4[0],pos4[1])){
                glovar.layout.cross = glovar.layout.cross + 1;
            }
        }
    }

    console.log('test:',glovar.layout)

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
 * 将mds布局数据转换到子空间投影（更新和新建）
 * @param mdsdata
 */
function converSubspace(mdsdata){
    var height=880;
    var width=650;
    var padding = 200;

    //改为依据力导引布局
    let nodes = [];
    let links = [];
    for(let i = 0;i < mdsdata.length;i++){
        nodes.push({'id':i})
    }
    for(let l of glovar.trail_links){
        links.push({'source':l[0],'target':l[1]})
    }
    let layout_result = getForceDirected(nodes,links)

    let xMax = Math.max(...layout_result.nodes.map(v=>v.x))
    let xMin = Math.min(...layout_result.nodes.map(v=>v.x))
    let yMax = Math.max(...layout_result.nodes.map(v=>v.y))
    let yMin = Math.min(...layout_result.nodes.map(v=>v.y))


    var xScale = d3.scale.linear()
        .domain([xMin,xMax])
        .range([padding, width -padding]);
    var yScale = d3.scale.linear()
        .domain([yMin,yMax])
        .range([height - padding, padding]);

    // var xScale = d3.scale.linear()
    //     .domain([-0.8,0.8])
    //     .range([0, width]);
    // var yScale = d3.scale.linear()
    //     .domain([-0.8,0.8])
    //     .range([height, 0]);


    



    for(var i=0;i<mdsdata.length;i++){//前几项的旧数据
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
        }else{//最后一项数据，也是新增加的数据
            d3.select("#g1").selectAll("circle").each(function () {//从中央的投影视图取位置
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
        // var offsetx=xScale(mdsdata[i][0])-width/2;
        // var offsety=yScale(mdsdata[i][1])-height/2;
        var offsetx=xScale(layout_result.nodes[i].x) - 0.5 * width;
        var offsety=yScale(layout_result.nodes[i].y) - 0.5 * height
        paintSubscatter(points,i,offsetx,offsety,width,height);
    }

    //定义arrow
    const svg = d3.select("#projectionbody").select("svg");
    let innerArrowSize = 5;
    svg.selectAll('#trail_arrow').remove();
    svg.append('marker')
            .attr('id', `trail_arrow`)
            .attr('markerWidth', innerArrowSize)
            .attr('markerHeight', innerArrowSize)
            .attr('refX', innerArrowSize)
            .attr('refY', 0.5 * innerArrowSize)
            .attr('orient', 'auto')
            .append('path')
            .attr('fill', '#434343')
            .attr('d', `M 0,0 L ${innerArrowSize},${0.5*innerArrowSize} L 0,${innerArrowSize}`)
    //绘制初始连线
    
    svg.select('.linkPlot').remove();
    const linkPlot = svg.append('g').classed('linkPlot',true)
    linkPlot
        .selectAll('*')
        .data(glovar['trail_links'])
        .enter()
        .append('line')
        .style('stroke',"black")
        .style('stroke-width',4)
        .attr('opacity',0.7)
        .attr('marker-end','url(#trail_arrow)')
        .attr('x1',function(d){
            return glovar.trail_pos[d[0]][0]
        })
        .attr('y1',function(d){
            return glovar.trail_pos[d[0]][1]
        })
        .attr('x2',function(d){
            return glovar.trail_pos[d[1]][0]
        })
        .attr('y2',function(d){
            return glovar.trail_pos[d[1]][1]
        })
        .style('cursor','pointer')
        .on("mouseover",function(){
            console.log('hh')
            d3.select(this).style("stroke","orange");
        })
        .on("mouseout",function(){
            d3.select(this).style("stroke","black");
        })
        .on('click',function(d){
            glovar.beginVec = glovar.saveVec[d[0]];
            glovar.endVec=glovar.saveVec[d[1]];
            paintSourceThumbnail(glovar.beginVec)
            paintTargetThumbnail(glovar.endVec);
            setAnimation();        
        })

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


    //装填轨迹的中心位置(绝对)
    glovar.trail_pos[subScatterID] = ([offsetx+width/2,offsety+height/2])



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
        // .on("click",function(){
        //         clearTimeout(timer);
        //         var me = d3.select(this);
        //         timer=setTimeout(function(){
        //             d3.selectAll(".connectLine").remove();
        //             glovar.dblFlag=0;
        //             glovar.dblCoordinate=[];
        //             glovar.dblVec=[];

        //             me.attr("stroke", "yellow");
        //             var ID = me.attr("id");
        //             var cx = parseFloat(me.attr("cx"));
        //             var cy = parseFloat(me.attr("cy"));
        //             glovar.lineCoordinate.push([cx + offsetx, cy + offsety]);
        //             glovar.backtoviewVec.push(glovar.saveVec[ID]);
        //             paintDotline();
        //         },300);
        //     })
        .on("click",function(){//切换起始略缩图
            var gme = d3.select(this);
            var ID = parseInt(gme.attr("id"));
            glovar.beginVec = glovar.saveVec[ID];
            glovar.begin_id = ID
            paintSourceThumbnail(glovar.beginVec);
            d3.select("#g6").remove();//删除终止缩略图
            updateView(glovar.beginVec);
        })
        // .on("dblclick", function () {
        //     clearTimeout(timer);
        //     var gme = d3.select(this);
        //     d3.selectAll(".circleFrame").attr("stroke","#6D6D6D");
        //     d3.select("#animationCircle").remove();
        //     d3.selectAll("#linepath").remove();
        //     glovar.lineCoordinate=[];
        //     glovar.pathCoordinate=[];
        //     glovar.backtoviewVec=[];

        //     var ID = parseInt(gme.attr("id"));
        //     var gcx = parseFloat(gme.attr("cx"));
        //     var gcy = parseFloat(gme.attr("cy"));
        //     glovar.dblCoordinate.push([gcx + offsetx, gcy + offsety]);
        //     glovar.dblVec.push(glovar.saveVec[ID]);
        //     if(glovar.dblFlag==0){
        //         var gpoints = [];
        //         g.selectAll(".circle" + subScatterID)
        //             .each(function (d, i) {
        //                 var me = d3.select(this);
        //                 var cx = parseFloat(me.attr("cx"));
        //                 var cy = parseFloat(me.attr("cy"));
        //                 var opacity = me.attr("opacity");
        //                 var color = me.attr("fill");
        //                 gpoints.push([cx, cy, color, opacity]);
        //             });
        //         for (var i = 0; i < gpoints.length; i++) {
        //             glovar.pointsColor[i] = gpoints[i][2];
        //             // glovar.pointsOpacity[i] = gpoints[i][3];
        //         }

        //         // console.log('beginID:',ID)
        //         // glovar.beginVec = glovar.saveVec[ID];
        //         // paintSourceThumbnail(glovar.beginVec);
        //         // d3.select("#g6").remove();//删除终止缩略图
        //         // updateView(glovar.beginVec);

        //     }else{
        //         paintConnectline(glovar.dblFlag);
        //     }
        //     glovar.dblFlag++;
        // })
        .style('cursor','pointer')

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
    // paintAnimationCircle(glovar.lineCoordinate[0][0],glovar.lineCoordinate[0][1]);
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



/**
 * 
 * 获取力导向引布局
 * @param links
 * @param nodes
 * 
 */
function getForceDirected(nodes,links){

    __nodes = JSON.parse(JSON.stringify(nodes))
    __links = JSON.parse(JSON.stringify(links))

    // let simulation = d3.forceSimulation().nodes(__nodes);
    // let linkForce = d3.forceLink(__links).id(d=>d.id)

    // simulation.force('charge_force', d3.forceManyBody().strength(-50))
    //           .force('center_force', d3.forceCenter(0,0))//中心点为原点
    //           .force('links', linkForce)

    // simulation.stop();
    // simulation.tick(300);
    let force = d3.layout.force()
                 .nodes(__nodes)
                 .links(__links)
                 .size([600,600])
                 .gravity(.05)
                 .charge(-240)
                 .linkDistance(50)
                 .start();
    for(let i = 0;i < 3000;i++){
        force.tick();
    }

    force.stop();

    return {
        'nodes':__nodes,
        'links':__links,
    }

}


