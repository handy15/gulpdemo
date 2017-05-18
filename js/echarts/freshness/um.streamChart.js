!function(){function t(t,a){d3.select(this).style("fill",d3.rgb(d3.select(this).style("fill")).brighter(.5)),O.attr("opacity",.9),z.mouseOver.call(this,t,a)}function a(t,a){try{var e=d3.mouse(this),d=l.invert(e[0]),r=h(d),n=P.indexOf(r);d0=r,d1=P[n+1],x0=l(h.parse(d0)),x1=l(h.parse(d1)),isLeft=(x1+x0)/2-e[0]>0,realIndex=isLeft?n:n+1,posX=isLeft?x0:x1;var i={dataPoints:N,date:isLeft?d0:d1,dateData:P,sum:S[realIndex].sum,dateIndex:P.indexOf(isLeft?d0:d1)};O.attr("transform","translate("+posX+", 0)"),z.mouseMove.call(this,t,a,i)}catch(o){}}function e(t,a){d3.selectAll(".layer").style("fill",function(t){return p(t.key)}),O.attr("opacity",0),z.mouseOut.call(this,t,a)}function d(){var t=b.extent()[1]-b.extent()[0];l.domain(b.empty()?u.domain():b.extent()),A.selectAll(".layer").attr("d",function(t){return v(t.values)}),A.select(".select-layer").attr("d",function(t){return v(t)}),t>=864e5&&t<=1728e6?m.ticks(d3.time.day):m.ticks(z.ticks||d3.time.weeks,1),A.select(".x.axis").call(m).call(n)}function r(){d3.event.target.empty()&&b.extent(u.domain())}function n(t){d3.selectAll(".grid-line").remove(),t.selectAll("g.tick").append("line").classed("grid-line",!0).attr("stroke","#D1D1D1").attr("x1",0).attr("y1",0).attr("x2",0).attr("y1",-o)}streamChart={};var i,o,s,l,c,u,f,p,m,y,x,h,g,v,k,b,D,w,A,L,C,O,z,F,B=streamChart,I={top:20,right:30,bottom:130,left:70},_={top:500,right:30,bottom:20,left:70},J={},N=[],P=[],S=[];B.init=function(t){N=[],P=[],S=[],z=t||{},D=d3.select(z.chart||"#chart"),i=z.width-I.left-I.right,o=z.height-I.top-I.bottom,s=z.height-_.top-_.bottom,l=d3.time.scale().range([0,i]),c=d3.scale.linear().range([o,0]),u=d3.time.scale().range([0,i]),f=d3.scale.linear().range([s,0]),m=d3.svg.axis().scale(l).orient("bottom").ticks(z.ticks||d3.time.weeks,1).tickFormat(d3.time.format("%m-%d")),y=d3.svg.axis().scale(c).orient("left"),x=d3.svg.axis().scale(u).orient("bottom").ticks(7).tickFormat(d3.time.format("%m月-%d日")),p=d3.scale.ordinal(),h=d3.time.format("%Y-%m-%d"),F=d3.layout.stack().values(function(t){return t.values}).x(function(t){return t.date}).y(function(t){return t.value}),g=d3.nest().key(function(t){return t.key}).sortKeys(function(t,a){return t=+t.slice(1,3),a=+a.slice(1,3),a<t?-1:a>t?1:0}),v=d3.svg.area().interpolate("linear").x(function(t){return l(t.date)}).y0(function(t){return c(t.y0)}).y1(function(t){return c(t.y0+t.y)}),k=d3.svg.area().interpolate("monotone").x(function(t){return u(t.date)}).y0(s).y1(function(t){return f(t.sum)}),b=d3.svg.brush().x(u).on("brush",d).on("brushend",r),B.setColor(z.colors),w=D.append("svg").attr("width",i+I.left+I.right).attr("height",o+I.top+I.bottom),w.append("defs").append("clipPath").attr("id","clip").append("rect").attr("width",i).attr("height",o),A=w.append("g").attr("transform","translate("+I.left+","+I.top+")"),L=w.append("g").attr("transform","translate("+I.left+","+I.top+")"),C=w.append("g").attr("class","context").attr("transform","translate("+_.left+","+_.top+")"),B.loadData()},B.loadData=function(){if(J[z.url])B.reshapeData(JSON.parse(J[z.url]));else{var t=[{date:"2017-02-04",data:["139","51","25","12","23","11","8","12","10","8","8","10","2","5","8","17","6","9","4","4","4","5","5","7","7","7","4","14","7","5","10","1007"]},{date:"2017-02-05",data:["143","48","32","20","8","19","15","7","13","9","12","15","9","2","7","9","18","8","4","6","5","5","3","4","7","6","6","3","12","7","7","976"]},{date:"2017-02-06",data:["136","41","27","26","20","6","14","13","9","13","6","8","11","9","3","3","11","11","3","5","6","5","4","2","4","7","9","7","5","14","7","979"]},{date:"2017-02-07",data:["125","37","23","18","25","15","7","11","12","9","10","10","7","12","12","2","5","8","13","7","5","3","4","6","4","2","7","7","6","5","10","1009"]},{date:"2017-02-08",data:["121","38","26","17","20","21","15","3","17","14","6","10","10","9","7","8","1","6","9","11","5","5","4","5","2","3","4","6","6","6","4","1025"]},{date:"2017-02-09",data:["131","27","30","18","14","15","16","14","12","10","12","8","6","6","5","8","6","2","5","5","14","5","5","3","5","6","4","3","8","7","6","1016"]},{date:"2017-02-10",data:["128","34","26","16","13","12","11","15","14","6","13","5","12","9","4","7","10","7","2","6","7","12","5","5","3","6","4","3","2","6","7","1016"]},{date:"2017-02-11",data:["118","28","27","16","17","16","13","10","14","12","5","13","8","8","5","6","8","11","6","2","3","5","14","4","2","3","5","6","4","1","6","986"]},{date:"2017-02-12",data:["113","34","19","17","14","14","12","11","12","15","7","6","14","8","9","7","3","6","8","6","1","3","4","10","5","2","4","6","6","4","1","994"]},{date:"2017-02-13",data:["111","31","25","18","19","11","14","11","11","9","15","8","6","10","9","7","7","5","4","6","4","3","5","4","9","6","1","3","4","6","4","984"]},{date:"2017-02-14",data:["89","31","22","16","7","14","12","11","8","10","8","12","8","3","12","8","6","5","5","5","8","4","2","5","6","11","5","1","3","3","3","977"]},{date:"2017-02-15",data:["92","24","16","17","15","6","13","9","12","8","7","6","13","6","4","11","9","7","6","3","5","8","4","1","4","5","11","4","4","1","4","1011"]},{date:"2017-02-16",data:["99","26","21","18","12","13","7","6","10","11","9","9","6","10","8","3","10","7","9","5","4","4","6","4","2","4","4","11","5","3","3","1001"]},{date:"2017-02-17",data:["121","31","17","14","12","11","6","7","11","10","11","10","10","7","12","8","4","11","7","9","4","3","6","6","7","2","2","5","15","4","2","989"]},{date:"2017-02-18",data:["125","35","23","16","17","15","10","12","6","11","8","10","7","8","6","10","7","3","10","7","3","6","4","4","4","5","3","4","6","8","3","994"]},{date:"2017-02-19",data:["129","39","27","13","9","15","16","9","13","5","9","8","8","10","9","7","8","6","4","10","9","5","6","3","6","6","7","1","3","8","8","1007"]},{date:"2017-02-20",data:["89","42","19","14","10","8","13","13","8","3","6","7","10","6","5","9","4","10","8","4","7","9","5","8","3","4","4","4","3","2","5","1011"]},{date:"2017-02-21",data:["102","28","33","15","17","13","8","11","8","7","4","6","5","5","7","3","9","4","7","7","2","8","8","6","4","4","4","6","2","1","2","1010"]},{date:"2017-02-22",data:["125","33","17","23","11","12","9","12","12","11","5","4","5","7","7","6","9","7","6","7","7","4","7","9","7","5","3","6","4","4","1","968"]},{date:"2017-02-23",data:["106","34","28","11","17","8","14","9","12","12","9","6","1","5","6","7","6","6","6","7","6","4","3","9","5","2","4","2","6","5","1","1005"]},{date:"2017-02-24",data:["100","25","28","20","11","17","10","13","13","10","9","11","6","6","4","6","6","7","4","7","6","7","9","4","5","8","7","5","1","7","7","973"]},{date:"2017-02-25",data:["143","26","19","22","15","15","20","11","13","9","12","12","11","5","10","2","13","8","6","7","6","4","5","4","4","10","5","6","4","3","6","940"]},{date:"2017-02-26",data:["144","44","26","6","22","12","11","10","8","10","10","10","7","10","6","5","4","8","6","7","7","7","2","6","5","4","6","7","6","5","0","979"]},{date:"2017-02-27",data:["88","23","26","17","7","20","12","9","13","8","8","8","12","10","7","5","3","5","6","5","5","5","6","4","5","5","5","5","4","4","6","978"]},{date:"2017-02-28",data:["88","26","19","20","13","11","19","10","8","10","10","11","8","9","11","12","3","3","4","5","7","5","6","5","4","6","9","4","4","5","6","975"]},{date:"2017-03-01",data:["106","25","14","19","12","15","8","17","10","9","9","7","9","10","11","10","10","5","2","3","6","4","6","7","7","4","8","8","3","7","4","964"]},{date:"2017-03-02",data:["103","31","15","15","17","14","14","4","16","6","7","11","5","4","5","9","7","9","2","2","4","6","7","3","6","6","2","5","5","2","4","973"]},{date:"2017-03-03",data:["102","31","18","9","9","12","12","12","5","13","10","6","10","7","7","9","8","10","6","4","0","3","5","8","5","6","9","2","6","7","3","1003"]},{date:"2017-03-04",data:["147","32","20","17","7","9","20","15","9","5","15","7","8","12","8","6","7","7","7","6","5","8","4","8","7","5","8","5","5","6","6","983"]},{date:"2017-03-05",data:["142","51","16","16","11","9","10","10","13","10","5","16","10","6","12","8","11","6","9","10","8","8","3","4","7","7","4","9","5","5","5","995"]},{date:"2017-03-06",data:["110","38","20","14","13","9","8","13","7","11","11","4","12","7","5","12","6","10","8","8","8","7","5","1","4","4","4","4","7","7","3","987"]},{date:"2017-03-07",data:["93","31","28","13","9","10","8","5","7","6","9","11","3","13","6","8","9","6","7","6","5","11","6","5","0","4","8","7","6","5","7","974"]},{date:"2017-03-08",data:["90","37","17","18","8","11","13","7","5","6","7","10","9","5","10","7","6","8","6","10","9","10","9","4","5","5","2","3","6","5","3","972"]},{date:"2017-03-09",data:["104","29","25","18","18","9","9","12","9","7","10","8","10","9","5","12","8","6","9","7","8","4","6","8","6","3","2","4","3","7","3","994"]},{date:"2017-03-10",data:["99","31","26","20","10","17","11","8","10","10","5","4","4","11","11","4","11","9","4","10","6","7","7","8","10","6","5","1","3","5","6","970"]},{date:"2017-03-11",data:["130","29","26","21","14","13","17","9","10","9","6","5","6","10","12","6","6","9","12","4","7","8","8","8","6","11","8","4","2","4","4","984"]},{date:"2017-03-12",data:["142","30","14","15","16","13","8","20","12","11","10","8","8","6","5","12","9","3","10","12","7","7","9","13","7","5","12","6","5","3","2","1003"]},{date:"2017-03-13",data:["118","46","20","8","18","16","16","7","12","8","6","8","6","5","6","3","9","9","6","10","4","3","6","7","6","7","7","10","10","4","0","989"]},{date:"2017-03-14",data:["115","38","33","16","9","15","7","15","5","11","7","6","10","8","3","5","6","8","8","6","10","5","5","4","4","5","6","7","9","7","3","1001"]},{date:"2017-03-15",data:["90","26","20","27","6","10","15","12","13","12","10","10","5","8","6","5","5","3","10","9","3","10","3","5","6","5","5","6","7","10","7","975"]},{date:"2017-03-16",data:["89","26","25","19","27","11","11","14","10","13","7","9","10","4","9","6","5","3","6","7","6","5","10","5","3","6","4","9","6","7","9","970"]},{date:"2017-03-17",data:["109","22","17","18","14","25","7","10","12","9","12","4","14","7","4","9","5","7","8","4","6","8","3","9","9","5","5","6","8","4","6","984"]},{date:"2017-03-18",data:["136","31","20","10","16","12","20","15","5","13","9","11","5","11","8","3","10","6","4","4","5","9","6","3","7","7","8","7","8","9","6","985"]},{date:"2017-03-19",data:["113","31","21","16","13","11","9","16","11","8","11","6","8","3","11","7","3","8","6","4","8","2","8","7","3","13","6","5","8","4","8","986"]},{date:"2017-03-20",data:["96","33","21","20","14","10","8","12","19","8","4","16","5","6","6","8","6","3","10","7","5","3","4","6","9","1","8","8","4","6","4","1006"]},{date:"2017-03-21",data:["102","28","20","16","13","11","8","8","13","16","7","5","14","8","8","3","9","6","7","9","6","6","3","5","6","5","3","10","9","5","6","1006"]},{date:"2017-03-22",data:["106","36","29","16","13","13","9","8","11","13","16","6","6","11","6","5","6","8","5","5","6","4","5","4","3","7","6","2","6","7","6","1004"]},{date:"2017-03-23",data:["104","26","24","22","12","11","10","10","5","4","10","15","5","7","13","7","5","3","7","5","6","9","6","3","3","6","6","6","1","10","9","994"]},{date:"2017-03-24",data:["110","30","12","19","15","13","9","10","10","8","8","3","19","11","3","12","8","7","6","7","8","6","5","4","3","2","2","7","6","4","7","1021"]},{date:"2017-03-25",data:["136","34","23","18","11","12","16","10","10","11","7","6","10","12","6","3","13","6","6","4","10","6","4","5","5","5","4","4","6","7","1","996"]},{date:"2017-03-26",data:["109","35","26","18","17","19","14","14","9","7","7","9","4","9","11","7","2","15","7","5","6","7","5","4","6","4","3","4","4","8","6","1005"]},{date:"2017-03-27",data:["99","20","20","16","16","8","13","13","7","7","5","7","4","6","10","13","7","7","9","5","5","5","6","7","2","5","6","4","3","4","6","962"]},{date:"2017-03-28",data:["80","33","17","12","18","14","9","16","14","8","7","3","9","6","5","9","10","6","2","10","5","3","5","6","3","5","5","6","3","4","4","974"]},{date:"2017-03-29",data:["98","21","25","13","16","15","15","9","10","12","5","8","4","9","6","6","9","11","4","4","9","8","3","6","7","5","4","7","5","3","4","972"]},{date:"2017-03-30",data:["98","35","10","24","14","13","15","14","7","10","11","5","4","5","5","6","6","11","12","7","4","11","6","6","5","7","4","2","6","7","3","974"]},{date:"2017-03-31",data:["95","28","22","11","18","13","11","16","12","10","10","14","3","5","5","6","7","5","7","10","5","3","10","4","5","6","8","4","6","5","6","991"]},{date:"2017-04-01",data:["109","29","17","18","12","20","15","13","12","12","7","10","9","5","9","4","9","4","5","6","9","3","2","8","7","4","2","8","6","1","7","983"]},{date:"2017-04-02",data:["100","33","21","13","18","10","17","13","13","12","11","4","9","13","8","6","4","7","5","8","7","9","8","3","8","4","4","4","8","5","3","997"]},{date:"2017-04-03",data:["139","23","22","14","8","17","8","16","11","11","16","10","4","5","11","3","6","3","8","5","4","10","9","5","5","5","7","4","4","6","5","967"]},{date:"2017-04-04",data:["101","37","19","21","18","8","10","7","10","11","9","11","7","3","7","13","7","7","8","6","6","4","5","7","6","3","9","4","5","5","4","988"]},{date:"2017-04-05",data:["90","23","27","13","11","13","15","13","8","11","6","7","9","10","3","5","9","4","3","4","7","5","4","7","7","3","5","11","3","3","5","992"]},{date:"2017-04-06",data:["90","30","16","24","11","10","8","9","12","7","15","6","8","11","9","6","2","7","5","4","4","7","5","7","7","6","3","2","7","6","2","995"]},{date:"2017-04-07",data:["93","22","29","14","19","10","12","6","8","12","6","13","10","6","10","10","3","8","7","5","7","5","6","7","3","7","10","6","3","7","6","1008"]},{date:"2017-04-08",data:["138","28","16","21","14","21","13","11","8","4","10","6","10","9","11","8","10","3","4","8","4","3","7","7","5","4","5","7","6","8","5","955"]},{date:"2017-04-09",data:["127","40","18","12","14","12","18","13","13","7","8","9","6","13","11","6","10","8","3","5","6","5","3","6","5","4","4","4","8","5","4","983"]},{date:"2017-04-10",data:["94","28","21","14","15","11","8","14","8","7","4","5","5","5","9","7","6","6","7","2","5","8","3","4","3","7","4","6","5","6","5","974"]},{date:"2017-04-11",data:["69","28","19","18","11","11","11","7","14","5","9","4","4","10","5","9","9","5","9","10","1","8","6","6","5","4","5","6","3","8","5","998"]},{date:"2017-04-12",data:["73","22","22","18","10","8","8","11","6","15","8","7","5","6","9","7","8","6","5","8","11","1","4","6","4","2","3","6","4","2","6","947"]},{date:"2017-04-13",data:["75","14","14","20","20","10","10","4","10","6","12","6","7","5","5","10","5","6","5","3","5","7","2","8","5","3","3","5","6","4","4","965"]},{date:"2017-04-14",data:["103","23","14","13","18","17","11","4","6","8","7","11","4","6","3","4","8","5","7","5","6","8","8","3","5","4","4","4","4","6","4","988"]},{date:"2017-04-15",data:["123","36","18","10","9","16","15","17","9","6","11","4","12","11","6","4","4","6","6","7","9","7","8","9","2","4","8","5","3","4","7","980"]},{date:"2017-04-16",data:["121","41","17","16","13","11","12","16","14","10","7","7","5","16","10","6","2","4","6","5","8","6","6","7","8","4","5","5","3","3","5","994"]},{date:"2017-04-17",data:["91","28","17","11","12","6","8","13","15","10","6","7","8","7","12","8","5","7","4","5","5","9","8","3","8","10","1","5","9","3","3","993"]},{date:"2017-04-18",data:["100","24","18","12","16","9","6","5","11","8","8","8","5","6","4","11","9","5","5","4","6","6","5","8","6","7","6","2","5","6","2","936"]},{date:"2017-04-19",data:["82","24","22","19","10","14","9","7","5","13","13","8","7","9","8","4","7","9","4","5","3","5","4","5","6","7","7","10","3","5","5","985"]},{date:"2017-04-20",data:["86","19","22","21","16","8","12","8","5","3","10","17","8","9","6","5","2","7","10","3","7","4","7","7","6","6","8","5","10","1","6","992"]},{date:"2017-04-21",data:["89","29","16","22","16","19","12","12","4","7","8","12","12","5","6","5","6","2","7","9","5","6","4","7","5","5","5","7","7","7","1","977"]},{date:"2017-04-22",data:["117","29","15","11","19","15","11","11","10","6","8","7","14","14","1","9","4","7","3","7","7","5","5","3","4","5","8","9","9","7","5","985"]},{date:"2017-04-23",data:["90","34","19","11","12","17","9","15","15","15","2","7","6","12","11","5","6","2","4","3","7","5","6","2","3","1","6","6","8","8","8","933"]},{date:"2017-04-24",data:["74","25","20","12","11","8","14","10","9","8","9","3","7","4","12","9","4","9","4","8","1","8","5","3","6","4","7","3","7","7","3","954"]},{date:"2017-04-25",data:["85","22","14","18","12","11","12","19","10","6","6","6","4","5","6","10","12","4","3","4","6","3","4","5","3","5","4","3","6","6","6","979"]},{date:"2017-04-26",data:["90","21","11","15","11","15","11","7","14","7","6","6","9","3","5","2","7","13","3","9","3","5","4","5","7","6","5","5","5","5","6","962"]},{date:"2017-04-27",data:["89","12","15","10","13","13","10","8","9","12","7","8","8","5","5","5","5","9","6","4","6","4","5","3","5","8","7","3","3","6","7","992"]},{date:"2017-04-28",data:["79","22","14","12","10","15","14","11","7","12","13","9","5","4","10","6","5","3","10","11","5","6","3","5","1","7","5","5","4","3","6","956"]},{date:"2017-04-29",data:["105","19","18","6","13","12","13","13","9","8","7","11","7","9","6","9","4","3","4","11","9","4","7","2","4","3","7","8","5","5","2","949"]},{date:"2017-04-30",data:["83","33","20","10","3","10","6","11","11","8","7","9","11","10","6","6","9","3","6","2","12","11","5","6","3","4","2","4","5","6","7","951"]},{date:"2017-05-01",data:["86","17","24","12","13","5","8","12","8","9","12","4","10","9","7","6","7","7","3","5","4","9","9","6","5","1","5","4","5","10","7","955"]},{date:"2017-05-02",data:["78","25","6","15","10","11","2","10","4","9","11","8","6","7","12","9","7","6","4","3","5","1","10","9","4","4","2","6","2","5","5","964"]},{date:"2017-05-03",data:["77","22","18","4","15","8","7","2","7","7","3","5","7","6","9","12","8","3","5","10","2","4","5","8","7","3","6","1","6","3","5","978"]},{date:"2017-05-04",data:["70","23","12","17","3","14","5","8","4","7","5","7","8","9","7","8","12","8","2","5","8","3","5","2","8","8","3","6","4","5","1","962"]}];J[z.url]=JSON.stringify(t),B.reshapeData(t)}},B.reshapeData=function(t){return z.loaded(),0===t.length||"failed"===t.result?(z.failed(),!1):(t.forEach(function(t){var a=h.parse(t.date),e=0;delete t.date;for(var d=0;d<t.data.length;d++)e+=+t.data[d],N.push({key:"d"+d,value:+t.data[d],date:a});P.push(h(a)),S.push({date:a,sum:e})}),B.drawAxis(),B.draw(),void B.drawContext())},B.drawAxis=function(){A.append("g").attr("class","x axis").attr("transform","translate(0,"+o+")").call(m),A.append("g").attr("class","y axis").call(y)},B.draw=function(t){"undefined"!=typeof t&&$.extend(z,t),F.offset(z.offset||"zero");var a=F(g.entries(N)),e=d3.max(N,function(t){return t.y0+t.y})+("zero"===z.offset||"undefined"==typeof z.offset?I.top:0);c.domain([0,e]),f.domain(c.domain()),u.domain(d3.extent(N,function(t){return t.date})),l.domain(b.empty()?u.domain():b.extent()),B._layersDataBinding(a),O=L.append("line").attr("x1",0).attr("y1",0).attr("x2",0).attr("y2",o).attr("stroke","#fff").attr("class","verticalLine"),"expand"==z.offset?y.tickFormat(d3.format("%")):y.tickFormat(d3.format("d")),A.select(".x.axis").transition().duration(500).call(m),A.select(".x.axis").call(n),A.select(".y.axis").transition().duration(500).call(y)},B.zoomLayers=function(t,a){var e=F(g.entries(N).slice(a,t));F.offset(z.offset||"zero");var d=d3.max(e[e.length-1].values,function(t){return t.y0+t.y})+("zero"===z.offset||"undefined"==typeof z.offset?I.top:0);c.domain([0,d]),B._layersDataBinding(e),A.select(".y.axis").transition().duration(300).call(y)},B._layersDataBinding=function(d){var r=A.selectAll(".layer").data(d,function(t){return t.key});r.enter().append("path").attr("class","layer").attr("stroke",function(t){return p(t.key)}).style("fill",function(t){return p(t.key)}).attr("fill-opacity",.8).style("clip-path","url(#clip)").attr("d",function(t){return v(t.values)}).on("mouseover",t).on("mousemove",a).on("mouseout",e),r.transition("update").duration(200).attr("d",function(t){return v(t.values)}).attr("stroke",function(t){return p(t.key)}).style("fill",function(t){return p(t.key)}),r.exit().transition("exit").duration(200).attr("opacity",0).remove()},B.drawContext=function(){C.append("path").datum(S).attr("class","area").attr("d",k),C.append("g").attr("class","x axis").attr("transform","translate(0,"+s+")").call(x),C.append("g").attr("class","x brush").call(b).selectAll("rect").attr("y",-6).attr("height",s+7),b.extent(u.domain())},B.setColor=function(t){p.range(t)},B.getDateRange=function(){return b.extent()}}();