/*
 * trend.js
 * - insight report trend chart comm
 *
 * 
 * 18.09
 *
 * JayKeem
 *
 * jaykeem@weni.co.kr
*/

$(document).ready(function() {

(function(global) {

	var chnl = function() {
		this.trendType   = "";
		this.chartData   = {};
		this.emoData     = {};
		this.top3Data    = {};
		this.cpnyNames   = [];
		this.isEmptyData = false;
	}

	chnl.prototype = {

		setData: function(ajaxData) {

			var d   = ajaxData.data,
					nms = ajaxData.cnames,
				  n   = {},
				  k   = {},
				  e   = {},
				  rows = [];

			if (!ajaxData.data || ajaxData.data.length == 0) {
				//alert("해당기간에 대한 데이터가 조회되지 않습니다.");
				$("#chart_trend").html("<br/>&nbsp;&nbsp;<b>해당기간에 대한 데이터가 조회되지 않습니다.</b>");
				$("#chart_network_title").html("<br/>&nbsp;&nbsp;<b>Trend Chart가 조회되지 않습니다.</b>");
				$("#chart_network_chart").html("");
				$(".doc_search_title").html("<br/>&nbsp;&nbsp;<b>Trend Chart가 조회되지 않습니다.</b>");
				
				$("body").loading("stop");
				this.isEmptyData = true;
				return this;
			}

			for (var i = 0; i < d.length; i++) {

				var curDate = moment.unix(d[i].docDate / 1000).format("YYYY-MM-DD");
				d[i].d = curDate;

				if (!n[curDate]) {
					n[curDate] = [d[i].docDate];
					k[curDate] = {};
					e[curDate] = {};
					for (var j = 0; j < nms.length; j++) {
						n[curDate] = n[curDate].concat([0, ""]);
						if (!k[curDate][nms[j]]) k[curDate][nms[j]] = [];
						if (!e[curDate][nms[j]]) e[curDate][nms[j]] = [["긍정", 0, 0], ["부정", 0, 0], ["중립", 0, 0]];
					}
				}

				var idxPos = nms.indexOf(d[i].kwdA);
				if (idxPos == -1) {
					alert("Invalid Case");
					return;
				}

				// Top1만 동시출현빈도 카운트/ 긍부정 셋업
				if (d[i].rn == 1) {
					n[curDate][idxPos * 2 + 1] = d[i].docCntBoth;

					var totCnt = parseInt(d[i].negCntBoth) + parseInt(d[i].posCntBoth) + parseInt(d[i].neuCntBoth),
							pPcnt = 0, nPcnt = 0;
					pPcnt = Math.round(d[i].posCntBoth / totCnt * 100);
					nPcnt = Math.round(d[i].negCntBoth / totCnt * 100);
					jPcnt = Math.round(d[i].neuCntBoth / totCnt * 100);

					e[curDate][d[i].kwdA][0][1] = d[i].posCntBoth
					e[curDate][d[i].kwdA][0][2] = pPcnt;
					e[curDate][d[i].kwdA][1][1] = d[i].negCntBoth;
					e[curDate][d[i].kwdA][1][2] = nPcnt;
					e[curDate][d[i].kwdA][2][1] = d[i].neuCntBoth;
					e[curDate][d[i].kwdA][2][2] = jPcnt;
				}

				//Top3는 공통으로 넣어주고
				k[curDate][d[i].kwdA].push([d[i].kwdB, d[i].docCntBoth]);
			}

			for (var el in n) rows.push(n[el]);
			
			this.top3Data  = k;
			this.chartData = rows;
			this.emoData   = e;
			this.cpnyNames = nms;

			return this;
		},

		onDrawChart: function() {


			var that     = this,
					fromDate = $(".flatpickr input[name='date_from']").val(),
					toDate   = $(".flatpickr input[name='date_to']").val();

			if (that.isEmptyData) return;

			var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard_div'));
			var fmt = "yyyy-MM-dd",
				  pd   = SDII.Globals.Vars.period;

			if (pd == "mon") {
				fmt = "yyyy-MM";
			} else if (pd == "year") {
				fmt = "yyyy";
			}

			var ctrlOpts = {
				controlType: "ChartRangeFilter",
				containerId: "ctrl_trend",
				state: {
					range: {
						start: new Date(moment(fromDate).format("YYYY/MM/DD")), //new Date(2018, 8, 1), 
						end  : new Date(moment(toDate).add(5, "days").format("YYYY/MM/DD"))// new Date(2018, 9, 30)
					}
				},
				options: {
					// Filter by the date axis.
					filterColumnIndex: 0,
					ui: {
					  chartType: "LineChart",
			    	//curveType: 'function',
			    	curveType: 'none',
					  chartOptions: {
							chartArea: {
								width: "90%", height: "40px"
							},
							colors: ["none"],
							//vAxis: {
								//viewWindow : {min: -2}
							//},
							hAxis: {
								baselineColor: "none", 
								//format: "dd.MM.yyyy" 
							},
					  },
					  	chartView: {
								columns: [0, 1]
					  	},
					   // 1 day in milliseconds = 24 * 60 * 60 * 1000 = 86,400,000
					   minRangeSize: 86400000
					}
				}
			};

			var chartOpts = {
				chartType: "LineChart",
	   		containerId: "chart_trend",
	   		options: {
			  	lineWidth: 2,
					theme: {
			    	chartArea: {margin:0, width: "90%", height: "70%"},
			    },
		      animation:{
		      	startup: true,
		        duration: 1000,
		        easing: 'inAndOut',
		      },
			    //title: 'none',
			    //titlePosition: "out",
			    titleTextStyle: {
			    	fontSize: 20,
			    	color: "rgba(255,255,0,0.5)",
			    },
					tooltip: {
						trigger: "both",
						isHtml : true
					},
			    curveType: 'function',
			    //curveType: 'none',
			    //focusTarget: 'category',
			    //pointSize: 1.5,
			    //pointShape: 'circle',
			    legend: { 
			    	position: 'top', 
			    	alignment: "end",
			    	textStyle: {
			    		fontSize: 16
			    	}
			    },
			    hAxis: {
			    	 gridlines: {
			      	color:  "none"
			      },
			    	format: fmt
			    },
			    vAxis: { 
			      //viewWindowMode:'maximized',
			      //textPosition: "none",
			      viewWindow:{
			      	//max:55,
			        min: 0
			      }
			    },

			    series: {
			      0: { color: "#83c4ff", lineDashStyle: [1, 1], pointSize: 1.5, pointShape: "cycle" },
			      1: { color: "#ff9c00", lineDashStyle: [1, 1], pointSize: 1.5, pointShape: "cycle" },
			      2: { color: "#ff6d6d", lineDashStyle: [1, 1], pointSize: 1.5, pointShape: "cycle" },
			      3: { color: "#00d995", lineDashStyle: [1, 1], pointSize: 1.5, pointShape: "cycle" },
			      4: { color: "#92d13c", lineDashStyle: [1, 1], pointSize: 1.5, pointShape: "cycle" },
			      5: { color: "#fa88c4", lineDashStyle: [1, 1], pointSize: 1.5, pointShape: "cycle" }
					},
					
			    crosshair: {
			    	color: '#bbb',
			    	opacity: 1,
		 				trigger: 'both',
		        orientation: 'both'
					}
	   		}
			};

			//var tooltipDiv = $("#chart_trend_piechart").get(0);
	    //var tooltipChart = new google.visualization.PieChart(tooltipDiv);
	    var dataRows = that.chartData,
	   			top3Rows = that.top3Data,
	   			emoRows  = that.emoData,
	   			cnames   = that.cpnyNames,
	   			tCnt     = 0;

	    console.log(dataRows); console.log(top3Rows); console.log(emoRows);

	 		$(".chart_trend_tooltip").show();
	 		tCnt = (dataRows[0].length - 1) / 2;

	    for (var i = 0; i < dataRows.length; i++) {

	    	var tDate = moment(dataRows[i][0]).format("YYYY-MM-DD");

	    	for (var j = 0; j < tCnt; j++) {

	    		var pieDataTb = new google.visualization.DataTable();
			    pieDataTb.addColumn("string", "category");
			    pieDataTb.addColumn("number",  "count");
			    pieDataTb.addColumn({
						type: "number",
		    		label: "null",
		    		role: "tooltip"
		    	});

			    pieDataTb.addRows(emoRows[tDate][cnames[j]]);
	    	
	    		var tooltipDiv   = $("#chart_trend_piechart").get(0);
		      var tooltipChart = new google.visualization.PieChart(tooltipDiv);
		      var curDate      = reqDate = moment(dataRows[i][0]).format("YYYY-MM-DD");

		      google.visualization.events.addListener(tooltipChart, 'ready', function(subIdx, curName, curDate, cNames) {

		      	var curTop3 = top3Rows[tDate][curName];

		      	$("#chart_trend_abs").html("");
				    $("#chart_trend_top3").html("");
				    $("#chart_trend_ctrl").html("");

		    		$("svg rect:first", "#chart_trend_piechart").attr("width", 248);
		    		$("svg g g text", "#chart_trend_piechart").each(function (i, v) {

					  	$(this).text(pieDataTb.getValue(i, 2) + (i == 0 ? "%(긍정)" : i == 1 ? "%(부정)" : "%(중립)"));
				    	$(this).attr("x", parseInt($(this).attr("x")) - 25);
				    	$circle = $(this).parent().next();
				    	$circle.attr("cx", parseInt($circle.attr("cx")) - 25);
				  	});
				  	
		    		$gNodes = $("svg g", "#chart_trend_piechart");
		    		$gTgt   = [7, 8, 9];
		    		for (var tIdx = 0; tIdx < $gTgt.length; tIdx++) {
		    			$ttNode = $($gNodes.get($gTgt[tIdx]));
							$ttNode.css("transform", "translate(-20px, 0px)");
		    		}
		    		/*
		    		$gNodes = $("svg g g", "#chart_trend_piechart");
		    		for (var tIdx = 0; tIdx < 6; tIdx++) {
		    			$ttNode = $($gNodes.get(tIdx));
							$ttNode.css("transform", "translate(-20px, 0px)");
		    		}
		    		*/
				   	
				    $tdv = $("<div class='chart_trend_top3_list'></div>");
				   	for (var z = 0; z < curTop3.length; z++) {

				   		$curKwd = curTop3[z][0];

				   		$ta = $(
				   			"<div class='chart_trend_top3_kwd_wrap'>" +
				   				"<div class='chart_trend_top3_kwd" + (z == 0 ? " top3_kwd_highlight" : "") + "'>" +
				   					"<a data-type='top3' onclick='onRequestKwdAssoV2(this);'>" + curTop3[z][0] + "</a>" +
			   					"</div>" +
				   				"<div class='chart_trend_top3_kwd_cnt'>" + curTop3[z][1] + "건</div><div></div>" +
				   			"</div>"
			   			);
			   			$tdv.append($ta).append("<br/>");
				    }

				    $("#chart_trend_top3")
			    		.append(
			    			"<div class='d-flex justify-content-between chart_trend_top3_title'>" +
			    				"<div><a onclick='onRequestKwdAssoV2(\"" + curTop3[0][0] + "\")'>이슈키워드</a></div>" +
			    				//+ "<div><a onclick='deselectTrendChart()'></a></div>" +
		    				"</div>" +
			    			"<div class='chart_trend_top3_title_sub'>" + curName + ", " + curDate + "</div>"
		    			).append($tdv);

			    	$("#chart_trend_abs").append(
			    		"<div class='chart_trend_top3_title'>" +
		    				"<a onclick='onReqPosNegStat(\"" + curName + "," + curTop3[0][0] + "," + curDate + "\")'>긍/부정 현황</a>" +
	  					"</div>");
				    /*
			    	if (curTop3[0][1] != 0) {
				    	$("#chart_trend_ctrl")
				    		.append("<a onclick='onRequestKwdAssoV2(\"" + curTop3[0][0] + "\");'>[Top1 연관어]</a>")
				    		.append("<a onclick='chanelAction(this);'>[긍/부정 연관어]</a>");
						}
			    	$("#chart_trend_abs")
			    		.append("<div><span class='top3_cnt'>" +  dataRows[i][1] + "건</span></div>");
			    	*/

			    	dataRows[i][(subIdx * 2) + 2] = $(".chart_trend_tooltip").html();

			    	$("#chart_trend_piechart").html("");
			    	$("#chart_trend_abs").html("");
				    $("#chart_trend_top3").html("");
				    $("#chart_trend_ctrl").html("");

	    		}.bind(this, j, cnames[j], curDate, cnames));

	    		tooltipChart.draw(pieDataTb, {
		    		colors: ["#3c81f0", "#ff5663", "#2f4554"],
		    		pieHole: 0.7,
		    		pieSliceText: "none",
		    		tooltip: {
		    			trigger: 'selection',
		    		},
		        theme: {
				    	chartArea: {margin:0, width: "100%", height: "100%"},
				    }, 
				    legend: { 
			    		position: 'end',
			    		textStyle: {fontSize: 14}
				    },
				    //is3D: true
	    		});
	    	}
	    	dataRows[i][0] = new Date(moment.unix(dataRows[i][0] / 1000));
	    	//dataRows[i][0] = dataRows[0][i] / 1000
	    }

	    $(".chart_trend_tooltip").hide();

			var data = new google.visualization.DataTable();

			data.addColumn({
		 		//role: "domain",
		 		type: "date"
		 		//lable: "Date"
		 	});

		 	for (var i = 0; i < cnames.length; i++) {
		 		data.addColumn('number', cnames[i]);
		    data.addColumn({
		    	type: "string",
		    	label: "null",
		    	role: "tooltip"
		    	,p: {html: true}
		    });
		 	}
	    data.addRows(dataRows);
	    
			var control  = new google.visualization.ControlWrapper(ctrlOpts);
			var chart    = new google.visualization.ChartWrapper(chartOpts); 

			google.visualization.events.addOneTimeListener(chart, 'ready', function(chart) {

				var tgtRow  = chart.getDataTable().getViewRows().length - 1,
						colSize = chart.getDataTable().getViewColumns().length,
						cmpArr  = [], cateCnt = 0, maxVal = 0;
				cateCnt = (colSize - 1) / 2;

				sv.curTrendChart = chart.getChart();

			 	google.visualization.events.addListener(chart, 'select', function(chart, cateCnt) {

					var opts   = chart.getOptions(),
							tTgt   = $("#dashboard_trend svg path"),
						  tgtIdx = 0,
						  slct   = chart.getChart().getSelection();

					if (!slct || slct.length == 0 || slct[0].column == null) { // || slct[0].row == null) {
						$("body").loading("stop");
						return;
					}

					tgtIdx = (slct[0].column  - 1) / 2;

					for (var i = 0; i < cateCnt; i++) {
						opts.series[i].lineWidth  = 1;
						opts.series[i].lineDashStyle = [1, 1];
						opts.series[i].pointSize  = 1.5;
						opts.series[i].pointShape ="circle";
					}

					opts.series[tgtIdx].lineWidth  = 2.5;
					opts.series[tgtIdx].lineDashStyle = 1;
					opts.series[tgtIdx].pointSize  = 3;
					opts.series[tgtIdx].pointShape = "square";

					if (slct[0].row == null && slct[0].column != null) {
						chart.setOptions(opts);
						chart.draw();
						return false;
					}
					
					var ttData  = chart.getDataTable().getValue(slct[0].row, slct[0].column + 1);
					var top1Key = "";
					if ($("a[data-type='top3']", ttData)[0]) top1Key = $("a[data-type='top3']", ttData)[0].text.split(" ")[0];
					var top3Key = [];
					var reqDate = moment(chart.getDataTable().getValue(slct[0].row, 0)).format("YYYY-MM-DD");

					//channelAction(chart.getDataTable().getColumnLabel(slct[0].column));
					chart.setOptions(opts);
					chart.draw();
					chart.getChart().setSelection([{column: slct[0].column, row: slct[0].row}]);

					if (!ttData || !top1Key || top1Key == "데이터없음") {

						alert("조회할 키워드가 없습니다.");
						//$(tTgt.get(tgtIdx)).attr("stroke-width", 2).attr("stroke-dasharray", "1,1");
						$("#chart_trend_sub").html("");
						$(".chart_trend_sub_close").click();
						return;
					}

					$(ttData).find("[data-type='top3']").each(function (idx, el) { 
							top3Key.push(el.text.split(" ")[0]);
					});

					$(".chart_network").html("<div id='chart_network_title'>연관어들에 대해 로딩중입니다.</div>");
					SDII.Globals.Func.onRequestKwdNetwork(top3Key.join(","), reqDate, chart.getDataTable().getColumnLabel(slct[0].column));
					
					if (SDII.Globals.Vars.category != 1) {
						$("body").loading("stop");
						return;
					}
					sf.channelAction(top1Key, chart.getDataTable().getColumnLabel(slct[0].column), reqDate);

				}.bind(this, chart, cateCnt));

				for (var i = 0; i < cateCnt; i++) {
					cmpArr.push(chart.getDataTable().getValue(tgtRow, (i * 2) + 1));
				}
				
				maxVal = Math.max.apply(this, cmpArr);
				tgtCol = cmpArr.indexOf(maxVal) * 2 + 1;
				
				//if (sv.category == "2") chart.getChart().setSelection([{column: tgtCol, row: tgtRow}]);
				
				var reqDate = moment(chart.getDataTable().getValue(tgtRow, 0)).format("YYYY-MM-DD");
				var ttDom    = $(chart.getDataTable().getValue(tgtRow, tgtCol + 1));
				var top3Dom  = $("[data-type='top3']", ttDom).slice(0, cateCnt);
				var newKeys  = [];
				top3Dom.each(function (idx, el) {
					newKeys.push(el.text.split(" ")[0]);
				});

				$(".chart_network").html("<div id='chart_network_title'>연관어들에 대해 로딩중입니다.</div>");
				SDII.Globals.Func.onRequestKwdNetwork(newKeys.join(","), reqDate, chart.getDataTable().getColumnLabel(tgtCol));

				/*
				var boldLine = (tgtCol - 1) / 2 + cateCnt - 1;
				$($("#dashboard_trend svg path").get(boldLine)).attr("stroke-width", 3);
				*/
				//console.log(cmpArr); console.log(tgtCol);

			}.bind(this, chart));

		 	dashboard.bind(control, chart);
		  dashboard.draw(data);
		}
	}

	global.SDII.Chart.chnlhart = global.SDII.Chart.chnlhart || chnl;

})(window);

});