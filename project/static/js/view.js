/**
 * Created by gaoler on 2018/1/20.
 */

/**
 * 视图初始化
 */
function initView() {
    var width = 920;
    var height = 880;
    var trailmapWidth=650;
    var trailmapHeight=880;
    var mainviewsvg = d3.select("#viewbody")
        .append("svg")
        .attr("height", height)
        .attr("width", width);
    var trailmapSvg=d3.select("#projectionbody")
        .append("svg")
        .attr("width",trailmapWidth)
        .attr("height",trailmapHeight);
    paintSlider();
    paintTravelButton();
    paintFrame();
    paintScatter(glovar.pcaData);
    paintCirlceRing(glovar.beginVec);
    textDetection();
    paintSourceThumbnail(glovar.beginVec);

}

/**
 *画直线
 */
function paintLine(){
    var svg=d3.select("#viewbody").select("svg");
    var width=650;
    var height=880;
    svg.append("line")
        .attr("x1",width)
        .attr("y1",0)
        .attr("x2",width)
        .attr("y2", height)
        .attr("stroke", "#6D6D6D")
        .attr("stroke-width", "1px")
        .attr("fill", "none");
        // .attr("shape-rendering", "crispEdges");
}

/**
 * 画直方图
 * @param histogramdata
 */
function paintHistogram(histogramdata) {
    var x_offsetx=100;
    var x_offsety=650+50;
    var y_offsetx=650+50;
    var y_offsety=100;

    d3.select("#g3").remove();
    d3.select("#g4").remove();
    var svg=d3.select("#viewbody").select("svg");
    var gx=svg.append("g").attr("id","g3").attr("transform", "translate(" + x_offsetx + ","+ x_offsety+ ")");
    var gy=svg.append("g").attr("id","g4").attr("transform", "translate(" + y_offsetx+ "," + y_offsety + ")");

    var numberRec = histogramdata[0].length;
    var width = 450;
    var tail = 15; //尾端长度
    var recWidth = (width - 2 * tail) / (1.4 * numberRec - 0.4); //矩形长度
    var rectHeight = 45; //矩形最大高度
    var interval = 0.4 * recWidth;  //矩形间隔

    var rectData = [];
    for (var i = 0; i < numberRec; i++) {
        var startPoint = tail;
        tail += (recWidth + interval);
        rectData.push(startPoint);
    }

    /**
     * 绘制x轴中线
     * @type {number}
     */
    var xLineY = 50 + 5;  //中线位置
    gx.append("line")
        .attr("x1", 0)
        .attr("y1", xLineY)
        .attr("x2", width)
        .attr("y2", xLineY)
        .attr("stroke", "#6D6D6D")
        .attr("stroke-width", "1px")
        .attr("fill", "none");
        // .attr("shape-rendering", "crispEdges");

    /**
     * 绘制x轴边线
     */
    gx.append("line")
        .attr("x1", 0)
        .attr("y1", xLineY - rectHeight)
        .attr("x2", 0)
        .attr("y2", xLineY + rectHeight)
        .attr("stroke", "#6D6D6D")
        .attr("stroke-width", "1px")
        .attr("fill", "none");
        // .attr("shape-rendering", "crispEdges");
    gx.append("g")
        .attr("transform", function (d, i) {
            var x = -10;
            var y = xLineY - rectHeight + 13;
            return "translate(" + x + "," + y + ")";
        })
        .append("text")
        .text(1)
        .attr("font-size", "15px");
    gx.append("g")
        .attr("transform", function (d, i) {
            var x = -18;
            var y = xLineY + rectHeight - 1;
            return "translate(" + x + "," + y + ")";
        })
        .append("text")
        .text(-1)
        .attr("font-size", "15px");
    var all_text = ["Purchasing Power Index", "Safety Index", "Health Care Index", "Cost of Living Index", "Property Price to Income Ratio", "Traffic Commute Time Index", "Pollution Index"];
    /**
     * 绘制x轴矩形
     */
    gx.selectAll(".xrect")
        .data(rectData)
        .enter()
        .append("rect")
        .attr("class", "xrect")
        .attr("x", function (d, i) {
            return d
        })
        .attr("y", function (d, i) {
            var h = histogramdata[0][i] * rectHeight;
            return h > 0 ? xLineY - h : xLineY;
        })
        .attr("width", recWidth)
        .attr("height", function (d, i) {
            var h = histogramdata[0][i] * rectHeight;
            return Math.abs(h);
        })
        .attr("fill", function (d, i) {
            var h = histogramdata[0][i];
            var color = 0;
            if (h >= 0) {
                color = "#CA312E";
            }
            else {
                color = "#4682B4"
            }
            return color;
        })
        .append("title");
        // .text(function (d, i) {
        //     // if (get_file_name() == "Quality of Life Index-clean") {
        //     //     return all_text[i];
        //     // }
        //     return "Dim" + parseInt(i + 1);
        // });
    /**
     * 绘制x轴文字
     */
    gx.selectAll(".text2")
        .data(rectData)
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
            var x = d + recWidth / 2;
            var y = xLineY + rectHeight + 5;
            return "translate(" + x + "," + y + ")";
        })
        .append("text")
        .attr("class", "text2")
        .attr("fill", "black")
        // .attr("font-weight", "bold")
        .attr("font-size", "16px")
        .style("text-anchor", "end")
        .text(function (d, i) {
            var str = "Dim" + (i + 1);
            return str;
        })
        .attr("transform", "rotate(-45)");

    /**
     * 绘制y轴边框矩形
     */
    // gy.append("rect")
    //     .attr("x", 0)
    //     .attr("y", 0)
    //     .attr("height", width)
    //     .attr("width", 150)
    //     .attr("fill", "#fff")
    //     .attr("stroke-width", 1)
    //     .attr("stroke", "#ccc");
    /**
     * 绘制y轴中线
     */
    var yLineX = 50 + 5;
    gy.append("line")
        .attr("x1", yLineX)
        .attr("y1", 0)
        .attr("x2", yLineX)
        .attr("y2", width)
        .attr("stroke", "#6D6D6D")
        .attr("stroke-width", "1px")
        .attr("fill", "none");
        // .attr("shape-rendering", "crispEdges")

    /**
     * 绘制y轴边线
     */
    gy.append("line")
        .attr("x1", yLineX - rectHeight)
        .attr("y1", 0)
        .attr("x2", yLineX + rectHeight)
        .attr("y2", 0)
        .attr("stroke", "#6D6D6D")
        .attr("stroke-width", "1px")
        .attr("fill", "none");
        // .attr("shape-rendering", "crispEdges")
    gy.append("g")
        .attr("transform", function (d, i) {
            var x = yLineX - rectHeight;
            var y = -3;
            return "translate(" + x + "," + y + ")";
        })
        .append("text")
        .text(-1)
        .attr("font-size", "15px")
    gy.append("g")
        .attr("transform", function (d, i) {
            var x = yLineX + rectHeight - 7;
            var y = -3;
            return "translate(" + x + "," + y + ")";
        })
        .append("text")
        .text(1)
        .attr("font-size", "15px")

    /**
     * 绘制y轴矩形
     */
    gy.selectAll(".yrect")
        .data(rectData)
        .enter()
        .append("rect")
        .attr("class", "yrect")
        .attr("x", function (d, i) {
            var h = histogramdata[1][i] * rectHeight;
            return h < 0 ? yLineX + h : yLineX;
        })
        .attr("y", function (d, i) {
            return d;
        })
        .attr("width", function (d, i) {
            var h = histogramdata[1][i] * rectHeight;
            return Math.abs(h);
        })
        .attr("height", recWidth)
        .attr("fill", function (d, i) {
            return histogramdata[1][i] > 0 ? "#CA312E" : "#4682B4"
        })
        .append("title");
        // .text(function (d, i) {
        //     if (get_file_name() == "Quality of Life Index-clean") {
        //         return all_text[i];
        //     }
        //     return "Dim" + parseInt(i + 1);
        // });
    /**
     * 绘制y轴文字
     */
    gy.selectAll(".text2")
        .data(rectData)
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
            var x = yLineX + rectHeight + 5;
            var y = d + recWidth / 2;
            return "translate(" + x + "," + y + ")";
        })
        .append("text")
        .attr("class", "text2")
        .attr("fill", "black")
        // .attr("font-weight", "bold")
        .attr("font-size", "16px")
        .text(function (d, i) {
            return "Dim" + parseInt(i + 1);
        })

    // gy.attr("transform", "translate(719, 140)");
    // gx.attr("transform", "translate(140, 739)");

}

/**
 * 画散点图
 * @param data
 */
function paintScatter(data){

    d3.select("#g1").remove();
    var offsetx = 250;
    var offsety = 200;
    var xwidth = 400;
    var ywidth = 400;
    var cr = 3;
    var svg=d3.select("#viewbody").select("svg");
    var g1 = svg.append("g").attr("id", "g1").attr("transform", "translate(" + offsetx + "," + offsety + ")");

    var rectcanvas=g1.append("rect").attr("id","rectcanvas").attr("x",0).attr("y",0).attr("width",xwidth).attr("height",ywidth).attr("opacity",0)
        .on("mousemove",function () {       //鼠标每移动1像素触发一次该函数
            if(glovar.Is_set==false){
                return
            }else{
                d3.select(this).attr("cursor","pointer");
                var checkx=d3.event.offsetX-offsetx;
                var checky=d3.event.offsetY-offsety;
                var checkwidth=20;
                var checkheight=20;

                g1.selectAll("circle").each(function (d, i) {
                var each = d3.select(this);
                var px = parseFloat(each.attr("cx"));
                var py = parseFloat(each.attr("cy"));

                if(px>=checkx-checkwidth&&px<=checkx+checkwidth&&py>=checky-checkheight&&py<=checky+checkheight){
                    each.attr("fill",glovar.brushingColor);
                    //刷同一种颜色的点属于同一个cluster,当前系统只有11种颜色，最多区分11种聚类
                    if(glovar.brushingColor==='#6D6D6D'){
                        glovar.clusterName[i]=0
                    }else if(glovar.brushingColor==='#CA312E'){
                        glovar.clusterName[i]=1
                    }else if(glovar.brushingColor==='#BBD35E'){
                        glovar.clusterName[i]=2
                    }else if(glovar.brushingColor==='#A67C52'){
                        glovar.clusterName[i]=3
                    }else if(glovar.brushingColor==='#764698'){
                        glovar.clusterName[i]=4
                    }else if(glovar.brushingColor==='#8DD3C7'){
                        glovar.clusterName[i]=5
                    }else if(glovar.brushingColor==='#2CA02C'){
                        glovar.clusterName[i]=6
                    }else if(glovar.brushingColor==='#FFC0CB'){
                        glovar.clusterName[i]=7
                    }else if(glovar.brushingColor==='#1EB0EE'){
                        glovar.clusterName[i]=8
                    }else if(glovar.brushingColor==='#418ABD'){
                        glovar.clusterName[i]=9
                    }else if(glovar.brushingColor==='orange'){
                        glovar.clusterName[i]=10
                    }
                }
                glovar.pointsColor[i]=each.attr("fill");
                });
            }
        });

    var xmin = d3.min(data, function (d) {
        return d[0];
    });
    var xmax = d3.max(data, function (d){
        return d[0];
    });
    var ymin = d3.min(data, function (d) {
        return d[1];
    });
    var ymax = d3.max(data, function (d) {
        return d[1];
    });
    var xScale = d3.scale.linear()
        .domain([xmin, xmax])
        .range([0, xwidth]);

    var yScale = d3.scale.linear()
        .domain([ymin, ymax])
        .range([ywidth, 0]);

    var dragLine = [];
    var line = d3.svg.line()
        .x(function (d) {
            return d[0];
        })
        .y(function (d) {
            return d[1];
        });
     var circles=g1.selectAll("circle")
         .data(data)
         .enter()
         .append("circle")
         .attr("cx",function (d) {
             return xScale(d[0]);
         })
        .attr("cy",function (d) {
             return yScale(d[1]);
         })
         .attr("r",cr)
         .attr("fill",function (d,i) {
             return glovar.pointsColor[i];
         })
         .attr("opacity",1)
         .attr("p_id",function(d,i){
             return i;
         })
       .on("mouseover",function(d,i){
            d3.select(this).attr("r",6).attr("cursor","pointer");
            paintText(i);
         })
         .on("mousemove",function (d,i) {
             return
         })
        .on("mouseout",function(d,i){
            d3.select(this).attr("r",3).attr("cursor","default");
         })
         .on("click",function(d,i){
         if(glovar.Is_line){
             return
         }
         if(glovar.Is_lasso){
             return
         }
         deleteTrailmapInfor();
         // tooltip.style("opacity",0.0);
         /**
         * 没有添加颜色
         */
        g1.selectAll("circle").each(function (d, k) {
            var each = d3.select(this);
            if (k== glovar.selected[0] && each.attr("fill")==glovar.selectColor){
                    each.attr("fill", glovar.baseColor);
                    glovar.pointsColor[k]=each.attr("fill");
                }
        });
         //清空选择的点
         glovar.selected=[];
         //重新设置选的点
         glovar.selected.push(i);
         //选择的点赋予选择的颜色
         var each=d3.select(this);
         each.attr("fill",glovar.selectColor);
         //改变整幅视图的颜色布局
         glovar.pointsColor[i]=each.attr("fill");
         //重置添加颜色的状态
         // glovar.Is_set=false;
         //重置开始变量
         glovar.beginVec=glovar.actionVec;
         //交互后，数据的改变
         transferData(glovar.selected);
        });

    var drag=d3.behavior.drag();
    drag.on("dragstart",function(){
        if(glovar.Is_point){
            return
        }
        var cx = d3.event.sourceEvent.offsetX-offsetx;
        var cy = d3.event.sourceEvent.offsetY-offsety;
        dragLine=[[cx,cy]];
    });
    drag.on("drag",function(){
        if(glovar.Is_point){
            return
        }
        var cx = d3.event.sourceEvent.offsetX-offsetx;
        var cy = d3.event.sourceEvent.offsetY-offsety;
        dragLine.push([cx,cy]);
        d3.select("#dragline").remove();
        d3.select("#dragpathline").remove();
        /**
         * 如果为直线
         */
        if(glovar.Is_line){
            deleteTrailmapInfor();
            var pointTolineDist=document.getElementById("toLinedist").value;
            g1.append("line")
                .attr("x1",dragLine[0][0])
                .attr("y1",dragLine[0][1])
                .attr("x2",cx)
                .attr("y2",cy)
                .attr("id", "dragline")
                .attr("stroke", "#8da0cb")
                .attr("stroke-width", "3px")
                .attr("fill", "none");

            if(dragLine.length>1){
                var slope=(cy-dragLine[0][1])/(cx-dragLine[0][0]);
                var orthslope=(-1)/slope;
                var slopeangle=Math.atan(orthslope);
                var pathline=[];
                var path1x=dragLine[0][0]+Math.cos(slopeangle)*pointTolineDist*xwidth;
                var path1y=dragLine[0][1]+Math.sin(slopeangle)*pointTolineDist*ywidth;
                var path2x=dragLine[0][0]-Math.cos(slopeangle)*pointTolineDist*xwidth;
                var path2y=dragLine[0][1]-Math.sin(slopeangle)*pointTolineDist*ywidth;
                var path3x=cx-Math.cos(slopeangle)*pointTolineDist*xwidth;
                var path3y=cy-Math.sin(slopeangle)*pointTolineDist*ywidth;
                var path4x=cx+Math.cos(slopeangle)*pointTolineDist*xwidth;
                var path4y=cy+Math.sin(slopeangle)*pointTolineDist*ywidth;
                pathline.push([path1x,path1y]);
                pathline.push([path2x,path2y]);
                pathline.push([path3x,path3y]);
                pathline.push([path4x,path4y]);
                pathline.push([path1x,path1y]);
                 var linePath=d3.svg.line();
                g1.append("path")
                .attr("d",linePath(pathline))
                .attr("id","dragpathline")
                .attr("stroke","#9D9D9D")
                .attr("stroke-width","1px")
                .attr("fill","none");
            }

            var templine=[[dragLine[0][0]/xwidth,dragLine[0][1]/ywidth],[cx/xwidth,cy/ywidth]];

            g1.selectAll("circle").each(function (d, i) {
                    var each = d3.select(this);
                    for (var j = 0; j < glovar.selected.length; j++) {
                        if (i == glovar.selected[j] &&each.attr("fill")==glovar.selectColor) {
                            each.attr("fill", glovar.baseColor);
                        }
                    }
                    glovar.pointsColor[i]=each.attr("fill");
                });

            glovar.selected=[];
            g1.selectAll("circle").each(function (d, i){
                var each = d3.select(this);
                var px = parseFloat(each.attr("cx"))/xwidth;
                var py = parseFloat(each.attr("cy"))/ywidth;
                //点到直线的距离
                var dist=pointToline(templine,[px,py]);
                if(dist<pointTolineDist){
                    each.attr("fill",glovar.selectColor).attr("opacity",1);
                    glovar.selected.push(i);
                }else {
                    if (glovar.pointsColor[i]==glovar.baseColor) {
                            each.attr("fill",glovar.baseColor).attr("opacity",1)

                    }else{
                            each.attr("fill",glovar.pointsColor[i]).attr("opacity", 1);
                        }
                }

            });
        }
        /**
         * 如果为套索
         */
        if(glovar.Is_lasso) {
            deleteTrailmapInfor();
            g1.append("path")
                .attr("d", line(dragLine))
                .attr("id", "dragline")
                .attr("fill", "none")
                .attr("stroke", "#8da0cb")
                .attr("stroke-width", "3px");
        }
    });
    drag.on("dragend",function(){
        /**
         * 如果为点选
         */
        if(glovar.Is_point){
            return
        }

        /**
         * 如果为直线
         */
        if(glovar.Is_line){
         d3.select("#g1").selectAll("circle").each(function (d,i){
         var each=d3.select(this);
         glovar.pointsColor[i]=each.attr("fill");
        });
            // glovar.Is_set=false;
            glovar.beginVec=glovar.actionVec;
            transferData(glovar.selected);
        }

        /**
         * 如果为套索
         */
        if(glovar.Is_lasso){
            if (dragLine.length > 5) {
                g1.selectAll("circle").each(function (d, i) {
                    var each = d3.select(this);
                    for (var j = 0; j < glovar.selected.length; j++) {
                        if (i == glovar.selected[j] && each.attr("fill")==glovar.selectColor) {
                            each.attr("fill", glovar.baseColor);
                        }
                    }
                });
            glovar.selected=[];
            g1.selectAll("circle").each(function (d, i) {
                var each = d3.select(this);
                var px = parseFloat(each.attr("cx"));
                var py = parseFloat(each.attr("cy"));
                if (pointPolygon([px, py], dragLine)) {
                    glovar.selected.push(i);
                    each.attr("fill",glovar.selectColor);
                }
                glovar.pointsColor[i]=each.attr("fill");
            });
            // glovar.Is_set=false;
            glovar.beginVec=glovar.actionVec;
            transferData(glovar.selected);
        }
        }
    });
   g1.call(drag);
}

/**
 * 画滑动条
 */
function paintSlider(){
    var xwidth=710;
    var offsetx =105;
    var offsety =785;

    var svg=d3.select("#viewbody").select("svg");
    var g2 = svg.append("g").attr("id", "g2").attr("transform", "translate(" + offsetx + "," + offsety + ")");
    var drag = d3.behavior.drag()
        .on("drag", dragmove);
    g2.append("rect")
        .attr("x", 0)
        .attr("y", 16)
        .attr("width",xwidth)
        .attr("height", 6)
        .attr("fill", "#ccc");
    g2.append("circle")
        .attr("cx", 10)
        .attr("cy", 19)
        .attr("id", "slider")
        .attr("r", 10)
        .attr("fill", "#6D6D6D")
        .on("mouseover",function () {
            d3.select(this).attr("cursor","pointer");
        })
        .call(drag);

    function dragmove(){
        var k=100;
        var currentx = d3.event.sourceEvent.offsetX-offsetx;
        d3.select(this).attr("cx",function () {
                    if(currentx<=10){
                        currentx=10
                    }
                    if(currentx>xwidth){
                        currentx=xwidth-10;
                    }
                    return currentx;
                })
            .attr("cursor","pointer");
        if(glovar.backtoviewVec.length>1){
            k=(100+1)*(glovar.backtoviewVec.length-1)-1;
        }
        // console.log(k);
        // console.log(glovar.backtoviewVec.length);
        var count=parseInt((currentx / xwidth)*k);
        paintScatter(generateData(glovar.newVec[count]));
        paintCirlceRing(glovar.newVec[count]);
        textDetection();
        if(glovar.backtoviewVec.length>1){
            paintAnimationCircle(glovar.pathCoordinate[count][0],glovar.pathCoordinate[count][1]);
        }
        //paintStarCoordinate(glovar.newVec[count]);
        glovar.actionVec=glovar.newVec[count];
    }
}

/**
 * 画星坐标图
 * @param vector
 */
function paintStarCoordinate(vector) {

    console.log('paintStarCoordinate-vector:',vector)

    d3.select("#g3").remove();
    d3.select(".tooltip2").remove();
    var tooltip=d3.select("body").append("div").attr("class","tooltip2").style("opacity",0);
    var svg= d3.select("#viewbody").select("svg");

    var offsetx=140/2;
    var offsety=130/2;
    var g3=svg.append("g").attr("id","g3").attr("transform","translate("+offsetx+","+offsety+")");

    var xwidth=750;
    var ywidth=750;
    var cr=8;

    var xScale=d3.scale.linear()//定义X轴比例尺
        .domain([-1,1])
        .range([0,xwidth]);
    var yScale=d3.scale.linear()//定义Y轴比例尺
        .domain([-1,1])
        .range([ywidth,0]);

    var arcpath=d3.svg.arc()//创建弧生成器
        .startAngle(0)
        .endAngle(Math.PI*2)
        .innerRadius(function (d) {
            return d;
        })
        .outerRadius(function (d) {
            return d;
        });


    var anchor=[];
    anchor.push([0,0]);
    for(var i=0;i<vector[0].length;i++){
        anchor.push([vector[0][i],vector[1][i]]);
    }
    var line=[];
    for(var i=0;i<vector[0].length;i++){
        line.push([vector[0][i],vector[1][i]])
    }
    var arc=[];
    for(var i=0;i<vector[0].length;i++){
        arc.push(Math.sqrt((xScale(vector[0][i])-xScale(0))*(xScale(vector[0][i])-xScale(0))
            +(yScale(vector[1][i])-yScale(0))*(yScale(vector[1][i])-yScale(0))));
    }

    g3.selectAll("path")
        .data(arc)
        .enter()
        .append("path")
        .attr("id",function (d,i) {
            return "arc"+i;
        })
        .attr("d",function(d,i){
            return arcpath(d);
        })
        .attr("transform","translate("+xScale(0)+","+yScale(0)+")")
        .attr("stroke","#6d6d6d")
        .attr("sroke-width","1px");

    g3.selectAll("line")
        .data(line)
        .enter()
        .append("line")
        .attr("x1",xScale(0))
        .attr("y1",yScale(0))
        .attr("x2",function(d,i){
            return xScale(d[0]);
        })
        .attr("y2",function(d,i){
            return yScale(d[1]);
        })
        .attr("stroke","#E63380")
        .attr("stroke-width","3px")
        .attr("fill","none")
        .attr("id",function (d,i) {
            return "linepath"+i;
        });

    g3.selectAll("circle")
        .data(anchor)
        .enter()
        .append("circle")
        .attr("cx",function(d,i){
            return xScale(d[0])
        })
        .attr("cy",function(d,i){
          return yScale(d[1]);
        })
        .attr("fill",function(d,i){
            if(i==0){
                return "#E63380";
            }else{
                return "#7DFFA1";
            }
        })
        .attr("r",cr)
        .attr("id",function (d,i) {
            return "anchor"+i;
        })
        .on("mouseover",function(d,i){
            d3.select(this).attr("r",10).attr("cursor","pointer");
            // if( i>0){
            //     tooltip.html(glovar.dataDimenName[i-1])
				// 	.style("left", (d3.event.pageX) + "px")
				// 	.style("top", (d3.event.pageY + 20) + "px")
				// 	.style("opacity",1.0);
            // }
        })
         .on("mousemove",function (d,i) {
             // if(i>0){
             //     tooltip.style("left", (d3.event.pageX) + "px")
				// 		.style("top", (d3.event.pageY + 20) + "px");
             // }else{
             //     return
             // }
             return
         })
        .on("mouseout",function(d,i){
            d3.select(this).attr("r",8).attr("cursor","default");
            // if(i>0){
            //     tooltip.style("opacity",0.0);
            // }
        });

    g3.selectAll("text")
        .data(anchor)
        .enter()
        .append("text")
        .attr("fill","black")
        .attr("font-weight","bold")
        .attr("x", function (d,i) {
            if(i>0){
                return xScale(d[0]);
            }else{
                return
            }
        })
        .attr("y",function (d,i) {
            if(i>0){
                return yScale(d[1]);
            }else{
                return
            }
        })
        .attr("dy",".3em")
        .attr("dx",".3em")
        .attr("font-size","14px")
        .text(function (d,i) {
            if(i>0){
                return glovar.dataDimenName[i-1];
            }else{
                 return
            }
        });
}

/**
 * 画文字
 * @param flag
 */
function paintText(flag) {
    d3.select("#g4").remove();
    var svg=d3.select("#viewbody").select("svg");
    if(glovar.dataName=="./static/data/Quality of Life Index.csv"||glovar.dataName=="./static/data/Segmentation.csv" ){
        var offsetx=725;
        var offsety=20;
        var width_step=155;
        var height_step=20;
    }else{
        var offsetx=800;
        var offsety=20;
        var width_step=80;
        var height_step=20;
    }
    var g3=svg.append("g").attr("id","g4").attr("transform","translate("+offsetx+","+offsety+")");

    var labelName=glovar.dataLabelName[flag];
    var nonormdata=glovar.originData[flag];
    var clusterName=glovar.clusterName[flag];

    g3.append("text")
        .attr("class","datalabel")
        .attr("fill","black")
        .attr("font-weight","bold")
        .attr("x",0)
        .attr("y",0)
        .attr("font-size","11px")
        .text(labelName);

    g3.append('text')
        .attr('x',width_step)
        .attr('y',0)
        .attr('font-weight','bold')
        .attr('font-size','14px')
        .text(clusterName)

    g3.selectAll(".datadimen")
        .data(glovar.dataDimenName)
        .enter()
        .append("text")
        .attr("class","datadimen")
        .attr("fill","black")
        .attr("x",0)
        .attr("y",function(d,i){
            return height_step*(i+1);
        })
        .attr("font-size","11px")
        .text(function (d,i) {
            return d;
        });

    g3.selectAll(".datavalue")
        .data(nonormdata)
        .enter()
        .append("text")
        .attr("class","datavalue")
        .attr("fill","black")
        .attr("x",width_step)
        .attr("y",function(d,i){
            return height_step*(i+1);
        })
        .attr("font-size","11px")
        .text(function (d,i) {
            return d.toFixed(2);
        });
}

/**
 * 画圆环图
 */
function paintCirlceRing(vector) {
    d3.select("#g3").remove();
    var offsetx = 150;
    var offsety = 100;
    var xwidth = 600;
    var ywidth = 600;

    var svg = d3.select("#viewbody").select("svg");
    var g3 = svg.append("g").attr("id", "g3").attr("transform", "translate(" + offsetx + "," + offsety + ")");

    var xScale = d3.scale.linear()//定义X轴比例尺
        .domain([-1, 1])
        .range([0, xwidth]);
    var yScale = d3.scale.linear()//定义Y轴比例尺
        .domain([-1, 1])
        .range([ywidth, 0]);


    var arc = [];
    for (var i = 0; i < vector[0].length; i++) {

        arc.push(Math.sqrt((xScale(vector[0][i]) - xScale(0)) * (xScale(vector[0][i]) - xScale(0))
            + (yScale(vector[1][i]) - yScale(0)) * (yScale(vector[1][i]) - yScale(0))));
    }
    var opacityarr = [];
    for (var i = 0; i < arc.length; i++) {
        opacityarr.push(arc[i] / (xwidth / 2));
    }
    var fontsizearr=[];
    for(var i=0;i<arc.length;i++){
        fontsizearr.push(10+6*arc[i]/(xwidth/2));
    }

    var angle = [];
    for (var i = 0; i < arc.length; i++) {
        var temangle = Math.acos((xScale(vector[0][i]) - xScale(0)) / (arc[i]));
        //当位于第三、四象限
        if ((yScale(vector[1][i]) - yScale(0)) > 0) {
            angle.push(Math.PI * 2 - temangle);
        } else {
            angle.push(temangle);
        }
    }
    glovar.angle = angle;

    var pathangle = [];
    for (var i = 0; i < angle.length; i++) {
        if (angle[i] >= 0 && angle[i] < Math.PI * 0.5) {
            pathangle.push(Math.PI * 0.5 - angle[i]);
        }
        if (angle[i] >= Math.PI * 0.5 && angle[i] < Math.PI) {
            pathangle.push(Math.PI * 2 - (angle[i] - Math.PI * 0.5));
        }
        if (angle[i] >= Math.PI && angle[i] < Math.PI * 1.5) {
            pathangle.push(Math.PI * 1.5 - (angle[i] - Math.PI));
        }
        if (angle[i] >= Math.PI * 1.5 && angle[i] < Math.PI * 2) {
            pathangle.push(Math.PI * 2 - angle[i] + Math.PI * 0.5);
        }
    }

    var arcpath = d3.svg.arc()//创建弧生成器
        .startAngle(0)
        .endAngle(Math.PI * 2)
        .innerRadius(function (d) {
            return d;
        })
        .outerRadius(function (d) {
            return d;
        });

    var dimenpath = d3.svg.arc()//创建弧生成器
        .startAngle(function (d) {
            return d - Math.PI / 200;
        })
        .endAngle(function (d) {
            return d + Math.PI / 200;
        })
        .innerRadius(xwidth/2)
        .outerRadius(xwidth/2+20);

    g3.append("path")
        .attr("id", "arcpath1")
        .attr("d", arcpath(xwidth/2))
        .attr("transform", "translate(" + xScale(0) + "," + yScale(0) + ")")
        .attr("transform", "translate(" + xScale(0) + "," + yScale(0) + ")")
        .attr("stroke", "#6d6d6d")
        .attr("sroke-width", "1px");


    var drag = d3.behavior.drag()
        .on("dragstart", function () {
            d3.select(this).attr("cursor", "pointer");
        })
        .on("drag", dragmove)
        .on("dragend", function (d, i) {
            d3.select(this).attr("cursor", "default");
            d3.select("#temdimenpath" + i).remove();
            // d3.select("#alterdimenpath" + i).remove();
            d3.select(this).attr("d", dimenpath(pathangle[i])).attr("opacity", opacityarr[i]);
            d3.select("#text" + i).attr("opacity", opacityarr[i]);
            glovar.actionVec=glovar.weightVec;
            paintScatter(generateData(glovar.actionVec));
            paintCirlceRing(glovar.actionVec);
            textDetection();
        });

    var anchor = [];
    for (var i = 0; i < vector[0].length; i++) {
        anchor.push([((xwidth/2+20) * Math.cos(angle[i]) + xScale(0)), (yScale(0) - (ywidth/2+20)* Math.sin(angle[i]))]);
    }
    g3.selectAll("text")
        .data(anchor)
        .enter()
        .append("text")
        .attr("id", function (d, i) {
            return "text" + i;
        })
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .attr("opacity", function (d, i) {
            return opacityarr[i];
        })
        .attr("x", function (d, i) {
            return d[0];
        })
        .attr("y", function (d, i) {
            return d[1];
        })
        .style("text-anchor", function (d, i) {
            if ((angle[i] >Math.PI*0.4 && angle[i] <Math.PI * 0.5) || (angle[i] > Math.PI * 1.5 && angle[i] <Math.PI * 1.7)) {
                return "start";
            }
            if((angle[i] >=0 && angle[i] <= Math.PI * 0.4) || (angle[i] >= Math.PI * 0.7 && angle[i] <= Math.PI * 1.3)||(angle[i] >= Math.PI * 1.7 && angle[i] <= Math.PI * 2)){
                return "middle";
            }
            if((angle[i] >=0.5 && angle[i] <Math.PI * 0.7) || (angle[i] > Math.PI * 1.3 && angle[i] <= Math.PI * 1.5)){
                return "end";
            }
        })
        .attr("dy", function (d, i) {
            if (angle[i] >= 0 && angle[i] <= Math.PI) {
                return "-.0em";
            } else {
                return ".0em";
            }
        })
        .attr("dx", function (d, i) {
            if ((angle[i] >= 0 && angle[i] <= Math.PI * 0.5) || (angle[i] >= Math.PI * 1.5 && angle[i] <= Math.PI * 2)) {
                return ".0em";
            } else {
                return "-.0em";
            }
        })
        .attr("font-size",function (d,i) {
            return fontsizearr[i];
        })
        .text(function (d, i) {
            return glovar.dataDimenName[i];
        });

    g3.selectAll(".dimenpath")
        .data(pathangle)
        .enter()
        .append("path")
        .attr("class", "dimenpath")
        .attr("id", function (d, i) {
            return "dimenpath" + i;
        })
        .attr("d", function (d, i) {
            return dimenpath(d);
        })
        .attr("transform", "translate(" + xScale(0) + "," + yScale(0) + ")")
        .attr("stroke", "none")
        .attr("fill", "#6d6d6d")
        .attr("sroke-width", "1px")
        .attr("opacity", function (d, i) {
            return opacityarr[i];
        })
        .call(drag);

    function dragmove(d, i) {
        d3.select("#temdimenpath" + i).remove();
        // d3.select("#alterdimenpath"+i).remove();
        g3.append("path")
            .attr("id", "temdimenpath" + i)
            .attr("d", dimenpath(pathangle[i]))
            .attr("transform", "translate(" + xScale(0) + "," + yScale(0) + ")")
            .attr("stroke", "#6d6d6d")
            .attr("sroke-width", "2px")
            .attr("stroke-dasharray", 2)
            .attr("fill", "none");

        // g3.append("path")
        //     .attr("id","alterdimenpath"+i)
        //     .attr("d", dimenpath(pathangle[i]))
        //     .attr("transform", "translate(" + xScale(0) + "," + yScale(0) + ")")
        //     .attr("stroke", "none")
        //     .attr("fill", "#6d6d6d");

        var currentx = d3.event.sourceEvent.offsetX - offsetx;
        var currenty = d3.event.sourceEvent.offsetY - offsety;
        var currentangle = angle[i];
        var dist = Math.sqrt((currentx - xScale(0)) * (currentx - xScale(0)) + (currenty - yScale(0)) * (currenty - yScale(0)));
        var temangle = Math.acos((currentx - xScale(0)) / dist);
        var dragangle = 0;
        if ((currenty - yScale(0)) > 0) {
            dragangle = Math.PI * 2 - temangle;
        } else {
            dragangle = temangle;
        }
        var offsetangle = Math.abs(currentangle - dragangle);
        var offsetdist = dist * Math.cos(offsetangle);
        // if( offsetdist>(xwidth/2)){
        //     offsetdist=xwidth/2;
        // }

        var temopacity = offsetdist / (xwidth / 2);
        var temfontsize=10+6*offsetdist/(xwidth/2);
        // var temradius=xwidth/2+20*offsetdist/(xwidth/2);

        var newdimenpath = d3.svg.arc()//创建弧生成器
            .startAngle(function (d) {
                return d - Math.PI / 200;
            })
            .endAngle(function (d) {
                return d + Math.PI / 200;
            })
            .innerRadius(offsetdist)
            .outerRadius(offsetdist +20);

         // var alterdimenpath = d3.svg.arc()//创建弧生成器
         //    .startAngle(function (d) {
         //        return d - Math.PI / 200;
         //    })
         //    .endAngle(function (d) {
         //        return d + Math.PI / 200;
         //    })
         //    .innerRadius(xwidth/2)
         //    .outerRadius(temradius);

        d3.select(this).attr("d", newdimenpath(pathangle[i])).attr("opacity", temopacity);
        d3.select("#text" + i).attr("opacity", temopacity).attr("font-size",temfontsize);
        // d3.select("#alterdimenpath" + i).attr("d", alterdimenpath(pathangle[i])).attr("opacity",temopacity);
        var vectorx = offsetdist * Math.cos(currentangle);
        var vectory = offsetdist * Math.sin(currentangle);

        var temvector = [];
        for (var j = 0; j < glovar.actionVec[0].length; j++) {
            if(j==i){
                temvector.push([vectorx/(xwidth/2),vectory/(ywidth/2)]);
            }else{
                temvector.push([glovar.actionVec[0][j],glovar.actionVec[1][j]]);
            }
        }
        var temweightVec=transformArray(temvector);
        glovar.weightVec=caculateOrth(temweightVec[0],temweightVec[1]);
        paintScatter(generateData(transformArray(temvector)));
    }
}

/**
 * 文字重叠检测
 */
function textDetection(){
    var xwidth=600;
    var ywidth=600;
    var xScale=d3.scale.linear()//定义X轴比例尺
        .domain([-1,1])
        .range([0,xwidth]);
    var yScale=d3.scale.linear()//定义Y轴比例尺
        .domain([-1,1])
        .range([ywidth,0]);
    var g3=d3.select("#g3");
    var threshold=Math.PI/60;
    var offset=Math.PI/60;
    // var sortangle=glovar.angle.sort(sortNumber);
    // var arrindex=[];
    // for(var i=0;i<sortangle.length;i++){
    //     arrindex.push(glovar.angle.indexOf(sortangle[i]));
    // }
    // while(existoverlap())
    //     {
    //         var flag=[];
    //         for(var i=0;i<sortangle.length;i++){
    //             flag.push(0);
    //         }
    //         for(var i=0;i<sortangle.length;i++){
    //             if((sortangle[i+1]-sortangle[i])>=0&&(sortangle[i+1]-sortangle[i])<=threshold){
    //                 flag[i]=1;
    //                 flag[i+1]=1;
    //             }else{
    //                 break;
    //             }
    //         }
    //         var countflag=0;
    //         var centerangle=0;
    //         for(var i=0;i<flag.length;i++){
    //             if(flag[i]==1){
    //                 countflag=countflag+1;
    //                 centerangle=centerangle+sortangle[i];
    //             }
    //         }
    //         centerangle=centerangle/countflag;
    //         var offsetangle=[];
    //         for(var i=0;i<countflag;i++){
    //             if(countflag%2==0) {
    //                 if (i <= coutflag / 2) {
    //                     offsetangle = centerangle - offset * (countflag / 2 - i)
    //                 } else {
    //                     offsetangle = centerangle + offset * (i - countflag / 2 + 1)
    //                 }
    //             }
    //             if(countflag%2==1){
    //                     if(i<=(countflag/2-0.5)){
    //                         offsetangle=centerangle-offset*(countflag/2-0.5-i);
    //                     }else{
    //                         offsetangle=centerangle+offset*(i-(countflag/2-0.5));
    //                     }
    //                 }
    //             }
    //          for(var i=0;i<flag.length;i++){
    //             if(flag[i]==1){
    //                 for(var j=0;j<coutflag;j++){
    //                     sortangle[i+j]=offsetangle[j]
    //                 }
    //                 break;
    //             }
    //          }
    //     }
    //
    // for(var i=0;i<glovar.angle.length;i++){
    //     glovar.angle[i]=sortangle[arrindex[i]];
    // }
    // function sortNumber(a, b) {
    //     return a - b;
    // }
    // function existoverlap() {
    //     var overlap=0;
    //     for (var i = 0; i < sortangle.length; i++) {
    //         if ((sortangle[i + 1] - sortangle[i]) >= 0 && (sortangle[i + 1] - sortangle[i]) <= threshold){
    //             overlap=1;
    //         }
    //     }
    //     return overlap;
    // }
    for(var i=0;i<glovar.angle.length;i++){
        for(var j=0;j<glovar.angle.length;j++){
              if((glovar.angle[j]-glovar.angle[i])>0&&(glovar.angle[j]-glovar.angle[i])<=threshold){
                glovar.angle[i]=glovar.angle[i]-offset;
                glovar.angle[j]=glovar.angle[j]+offset;
            }
            if((glovar.angle[j]-glovar.angle[i])<0&&(glovar.angle[j]-glovar.angle[i])>=(-1)*threshold){
                glovar.angle[i]=glovar.angle[i]+offset;
                glovar.angle[j]=glovar.angle[j]-offset;
            }
        }
    }
    var anchor=[];
    for(var i=0;i<glovar.angle.length;i++){
        anchor.push([((xwidth/2+20)*Math.cos(glovar.angle[i])+xScale(0)),(yScale(0)-(ywidth/2+20)*Math.sin(glovar.angle[i]))]);
    }
    g3.selectAll("text").each(function (d,i){
    var each=d3.select(this);
    each.attr("x",anchor[i][0]);
    each.attr("y",anchor[i][1]);
    /**
         * 径向布局
         */
    // each.attr("transform",function (d) {
    //         if((glovar.angle[i]>=0&&glovar.angle[i]<=Math.PI*0.5)||(glovar.angle[i]>=Math.PI*1.5&&glovar.angle[i]<=Math.PI*2)){
    //             return "rotate("+(-glovar.angle[i]*360/(2*Math.PI))+","+anchor[i][0]+" "+anchor[i][1]+")";
    //         }else{
    //             return "rotate("+(180-glovar.angle[i]*360/(2*Math.PI))+","+anchor[i][0]+" "+anchor[i][1]+")";
    //         }
    //     })
    });

}

/**
 * 点到画线之间的距离
 */
function pointToline(line, point) {
    var ret = -1;
    var A = line[1][1] - line[0][1]; //y2 - y1
    var B = line[1][0] - line[0][0]; //x2 - x1
    if(B != 0)
    {
        var C = B*line[0][1] - A*line[0][0]; // By1-Ax1
        //直线方程 Ax-By+C=0
        ret = A*point[0] + -1*B*point[1]+C;
        ret /= Math.sqrt(A*A + B*B);
        ret = Math.abs(ret)
    }
    else
    {
        ret = Math.abs(point[0] - line[1][0]);
    }
    return ret;
}

/**
 * 得到特征向量
 */
function getVector(){
    var k=100;
    glovar.newVec=[];
    var tdVec=glovar.beginVec;
    for(var i=0;i<=k;i++){
         var temvec = getMiddlevec(i, k, tdVec, glovar.endVec);
        glovar.newVec.push(temvec);
    }
    //tdVec=temvec;
    // console.log(glovar.newVec);
}

/**
 * 设置动画函数
 */
function setAnimation(){
    getVector();
    var k=100;
    var count=0;
    var delaytime=20;
    var timeid = setInterval(repaintScatter,delaytime);
    function repaintScatter() {
        paintScatter(generateData(glovar.newVec[count]));
        paintCirlceRing(glovar.newVec[count]);
        updateSlider(count/k);
        if(count>=k){
            clearInterval(timeid);
            textDetection();
        }
        count++;
    }
    glovar.actionVec=glovar.newVec[k];
}

/**
 * 更新滑动条
 * @param position
 */
function updateSlider(position){
    var xwidth=710-10;
    var currentx=xwidth*position;
    d3.select("#slider").attr("cx",currentx);
}

/**
 * 线性插值得到中间特征向量
 * @param t
 * @param k
 * @param begin
 * @param end
 * @returns {Array}
 */
function getMiddlevec(t, k,td, end) {
    var a = [];
    var b = [];
    for (var i = 0; i < td.length; i++) {
        var tem = [];
        for (var j = 0; j < td[0].length; j++) {
            tem.push(td[i][j] * (1 - t / k) + end[i][j] * (t / k));
        }
        if (i == 0) {
            a = tem;
        } else {
            b = tem;
        }
    }
    var middlePlot=caculateOrth(a,b);
    // var middlePlot=[];
    // middlePlot.push(a);
    // middlePlot.push(b);
    var sum=0;
    for(var i=0;i<middlePlot[0].length;i++){
        sum=sum+middlePlot[0][i]*middlePlot[1][i];
    }
    // console.log(sum);
    return middlePlot;
}

/**
 *施密特正交化
 * @param a
 * @param b
 * @returns {Array}
 */
function caculateOrth(a,b){
    var vk=[];
    var moda=0;
    for(var i=0;i<a.length;i++){
        moda+=a[i]*a[i];
    }
    var lena=Math.sqrt(moda);
    for(var i=0;i<a.length;i++){
        vk.push(a[i]/lena);
    }
    var wk=[];
    var dot=0;
    for(var i=0;i<b.length;i++){
        dot+=b[i]*vk[i];
    }
    var temwk=[];
    for(var i=0;i<b.length;i++){
        temwk.push(b[i]-dot*vk[i]);
    }
    var modtem=0;
    for(var i=0;i<temwk.length;i++){
        modtem+=temwk[i]*temwk[i];
    }
    var lentem=Math.sqrt(modtem);
    for(var i=0;i<temwk.length;i++){
        wk.push(temwk[i]/lentem);
    }
    var orth=[];
    orth.push(vk);
    orth.push(wk);
    return orth;
}

/**
 * 传输数据
 * @param selected
 */
function transferData(selected) {
    var voteSum=[];
    for(var i=0;i<glovar.jsonQuality.length;i++){
        var temSum=0;
        for(var j=0;j<selected.length;j++){
            if(glovar.Is_point==true) {
                temSum = temSum + glovar.jsonQuality[i][selected[j]][0];
            }
            if(glovar.Is_lasso==true) {
                temSum = temSum + glovar.jsonQuality[i][selected[j]][1];
            }
            if(glovar.Is_line==true) {
                temSum = temSum + glovar.jsonQuality[i][selected[j]][2];
            }
        }
        voteSum.push(temSum);
    }
    var maxVote=Math.max.apply(null,voteSum);
    var maxFlag=voteSum.indexOf(maxVote);
    glovar.endVec=transformArray(glovar.jsonVector[maxFlag]);
    paintSourceThumbnail(glovar.beginVec);
    paintTargetThumbnail(glovar.endVec);
    setAnimation();
}

/**
 * 投影生成新的数据
 * @param point
 * @param vs
 * @returns {boolean}
 */
function generateData(arr){
    var newdata=[];
    for(var i=0;i<glovar.normData.length;i++){
        var tem=[];
        var sumx=0;
        var sumy=0;
        for(var j=0;j<glovar.normData[0].length;j++){
            sumx=sumx+glovar.normData[i][j]*arr[0][j];
            sumy=sumy+glovar.normData[i][j]*arr[1][j];
        }
        tem.push(sumx);
        tem.push(sumy);
        newdata.push(tem);
    }
    return newdata;
}

/**
 * 判断点是否在多边形中
 * @param point
 * @param vs
 * @returns {boolean}
 */
function pointPolygon(point,vs) {
    var xi, xj, i, intersect,
        x = point[0],
        y = point[1],
        inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        xi = vs[i][0],
            yi = vs[i][1],
            xj = vs[j][0],
            yj = vs[j][1],
            intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

/**
 * 更新视图
 */
function updateView(vector){
    d3.select("#slider").attr("cx",10);
    var updatePoints=generateData(vector);
    paintScatter(updatePoints);
    if(glovar.clearStarCoordinate%2==0){
        // paintStarCoordinate(vector);
        paintCirlceRing(vector);
    }
}

/**
 * 判断操作方式
 */
 function operationCheck(value){
     if(value==-1){
        glovar.Is_point=true;
        glovar.Is_lasso=false;
        glovar.Is_line=false;
        document.getElementById("toLinedist").value=null;
     }
     if(value==0){
        glovar.Is_point=false;
        glovar.Is_lasso=true;
        glovar.Is_line=false;
        document.getElementById("toLinedist").value=null;
        glovar.beginTime=Date.now()/1000;     //点击聚类后开始计时
     }
     if(value==1){
        glovar.Is_point=false;
        glovar.Is_lasso=false;
        glovar.Is_line=true;
        document.getElementById("toLinedist").value=0.05;
     }
 }

/**
 * 判断点的度量
 */
function qualityCheck(value){
    if(value==-1){
        glovar.Is_outlying=true;
        glovar.Is_cluster=false;
        glovar.Is_trend=false;
    }
    if(value==0){
        glovar.Is_outlying=false;
        glovar.Is_cluster=true;
        glovar.Is_trend=false;
    }
    if(value==1){
        glovar.Is_outlying=false;
        glovar.Is_cluster=false;
        glovar.Is_trend=true;
    }
    }

/**
 * 添加颜色
 */
 function setColor(){
     var color=glovar.setColor[glovar.colorIndex % glovar.setColor.length];
     glovar.colorIndex++;
     d3.select("#g1").selectAll("circle").each(function (d,i) {
         var each=d3.select(this);
         for(var j=0;j<glovar.selected.length;j++){
             if(i==glovar.selected[j]){
                    each.attr("fill",color);
                }
         }
         glovar.pointsColor[i]=each.attr("fill");
     });
     glovar.Is_set=true;
}

/**
 * 删除颜色
 */
function deleteColor(){
    glovar.colorIndex--;
    d3.select("#g1").selectAll("circle").each(function (d,i) {
         var each=d3.select(this);
         each.attr("fill",glovar.baseColor);
         glovar.pointsColor[i]=each.attr("fill");
     });
}

/**
 * 是否展示星坐标图
 */
function clearStarCoordinate(){
    glovar.clearStarCoordinate+=1;
    if(glovar.clearStarCoordinate%2==1){
        d3.select("#g3").remove();
    }
    if(glovar.clearStarCoordinate%2==0){
        paintStarCoordinate(glovar.actionVec);
    }

}

/**
 * 数组转置函数
 * @param arr
 * @returns {Array}
 */
function transformArray(arr){
    var newarr = [];
    for (var i = 0; i < arr[0].length; i++) {
        var temarr = [];
        for (var j = 0; j < arr.length; j++) {
            temarr.push(arr[j][i]);
        }
        newarr.push(temarr);
    }
    return newarr;
}

/**
 * 画缩略框
 */
function paintFrame(){
    var xwidth=50;
    var ywidth=50;
    var offsetx1=30;
    var offsety1=775;
    var offsetx2=840;
    var offsety2=775;
    var cr=xwidth-1;
    var svg=d3.select("#viewbody").select("svg");
    var g1=svg.append("g").attr("id","g8").attr("transform","translate("+offsetx1+","+offsety1+")");
    var g2=svg.append("g").attr("id","g9").attr("transform","translate("+offsetx2+","+offsety2+")");
    g1.append("circle")
        .attr("cx",xwidth/2)
        .attr("cy",ywidth/2)
        .attr("r",cr)
        .attr("stroke","#6D6D6D")
        .attr("stroke-width","1px")
        .attr("fill","none")
        .style("pointer-events","all");
    g2.append("circle")
        .attr("cx",xwidth/2)
        .attr("cy",ywidth/2)
        .attr("r",cr)
        .attr("stroke","#6D6D6D")
        .attr("stroke-width","1px")
        .attr("fill","none")
        .style("pointer-events","all");
}

/**
 * 画起始缩略图
 * @param vector
 */
function paintSourceThumbnail(vector){
    d3.select("#g5").remove();
    var xwidth=50;
    var ywidth=50;
    var offsetx=30;
    var offsety=775;
    var cr=xwidth-1;
    var data=generateData(vector);
    var svg=d3.select("#viewbody").select("svg");
    var g=svg.append("g").attr("id","g5").attr("transform","translate("+offsetx+","+offsety+")");
    var xmin = d3.min(data, function (d) {
        return d[0];
    });
    var xmax = d3.max(data, function (d){
        return d[0];
    });
    var ymin = d3.min(data, function (d) {
        return d[1];
    });
    var ymax = d3.max(data, function (d) {
        return d[1];
    });
    var xScale = d3.scale.linear()
        .domain([xmin, xmax])
        .range([0, xwidth]);

    var yScale = d3.scale.linear()
        .domain([ymin, ymax])
        .range([ywidth, 0]);

    g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d, i) {
            return xScale(d[0]);
        })
        .attr("cy", function (d, i) {
            return yScale(d[1]);
        })
        .attr("fill",glovar.baseColor)
        .attr("opacity",1)
        .attr("r", 1);
}

/**
 *画终止缩略图
 * @param
 */
function paintTargetThumbnail(vector){
    d3.select("#g6").remove();
    var xwidth=50;
    var ywidth=50;
    var offsetx=840;
    var offsety=775;
    var cr=xwidth-1;
    var data=generateData(vector);
    var svg=d3.select("#viewbody").select("svg");
    var g=svg.append("g").attr("id","g6").attr("transform","translate("+offsetx+","+offsety+")");
    var xmin = d3.min(data, function (d) {
        return d[0];
    });
    var xmax = d3.max(data, function (d){
        return d[0];
    });
    var ymin = d3.min(data, function (d) {
        return d[1];
    });
    var ymax = d3.max(data, function (d) {
        return d[1];
    });
    var xScale = d3.scale.linear()
        .domain([xmin, xmax])
        .range([0, xwidth]);

    var yScale = d3.scale.linear()
        .domain([ymin, ymax])
        .range([ywidth, 0]);

    g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d, i) {
            return xScale(d[0]);
        })
        .attr("cy", function (d, i) {
            return yScale(d[1]);
        })
        .attr("fill",glovar.baseColor)
        .attr("opacity",1)
        .attr("r", 1);
}

/**
 * 刷取颜色
 * @param flag
 */
function brushColor(flag) {
    switch(flag){
        case 1:
            glovar.brushingColor="#6D6D6D";
            break;
        case 2:
            glovar.brushingColor="#CA312E";
            break;
        case 3:
            glovar.brushingColor= "#BBD35E";
            break;
        case 4:
             glovar.brushingColor="#A67C52";
             break;
        case 5:
             glovar.brushingColor="#764698";
             break;
        case 6:
             glovar.brushingColor="#8DD3C7";
             break;
        case 7:
             glovar.brushingColor="#2CA02C";
             break;
        case 8:
             glovar.brushingColor="#FFC0CB";
             break;
        case 9:
             glovar.brushingColor="#1EB0EE";
             break;
        case 10:
             glovar.brushingColor="#418ABD";
             break;
        case 11:
             glovar.brushingColor="orange";
             break;
        default:
            break;
    }
    document.getElementById('ColorButton').style.backgroundColor=glovar.brushingColor;
}

/**
 * 清除刷取颜色功能
 */
function stopBrush(){
    d3.select("#rectcanvas").attr("cursor","default");
    if(glovar.paintFlag%2==0){
        document.getElementById('PaintButton').style.backgroundColor="#9D9D9D";
        glovar.Is_set=true;
    }
    if(glovar.paintFlag%2==1){
        document.getElementById('PaintButton').style.backgroundColor="#DDDDDD";
         glovar.Is_set=false;
    }
    glovar.paintFlag++;
}

/**
 * 删除颜色
 */
function deleteColor(){
    var g1=d3.select("#g1");
    g1.selectAll("circle").each(function (d, i) {
        var each = d3.select(this);
        each.attr("fill",glovar.baseColor);
        glovar.pointsColor[i]=glovar.baseColor;
    });
}

/**
 * 画travel按钮
 */
function paintTravelButton(){
    var width=80;
    var height=30;
    var offsetx=420;
    var offsety=820;
    var svg=d3.select("#viewbody").select("svg");
    var g=svg.append("g").attr("id","g7").attr("transform","translate("+offsetx+","+offsety+")");
    // var rect=g.append("rect")
    //     .attr("x",0)
    //     .attr("y",0)
    //     .attr("width",width)
    //     .attr("height",height)
    //     .attr("rx","5px")
    //     .attr("fill","#DDDDDD");
    // var text=g.append("text")
    //     .attr("x",width/2)
    //     .attr("y",height/2+5)
    //     .attr("fill","#475763")
    //     .attr("font-size","15px")
    //     .attr("font-weight","bold")
    //     .attr("text-anchor","middle")
    //     .text("过渡")
    //     .on("mouseover",function () {
    //         d3.select(this).attr("fill","white");
    //         d3.select(this).attr("cursor","pointer");
    //     })
    //     .on("mouseout",function(){
    //         d3.select(this).attr("fill","#475763");
    //         d3.select(this).attr("cursor","default");
    //     })
    //     .on("click",function () {
    //         setSubAnimation();
    //     });
}



