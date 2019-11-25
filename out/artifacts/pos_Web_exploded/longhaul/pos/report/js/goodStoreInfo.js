/**
 * 货品库存信息
 * @author Xiashou
 * @since 2014/06/23
 */
Ext.onReady(function() {
	
	Ext.Ajax.timeout = 90000;  //90秒
	
	// 复选框
	var sm = new Ext.grid.CheckboxSelectionModel();
	
	//商品定价组
	var kondmInfo = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : 'reportSystem.ered?reqCode=getKondmInfoByWerks'
		}),
		reader : new Ext.data.JsonReader({}, [ {
			name : 'kondm'
		}, {
			name : 'vtext'
		} ])
	});
	kondmInfo.load();
	
	var kondmCombo = new Ext.ux.form.LovCombo({
		name : 'kondm',
		triggerAction : 'all',
		mode : 'local',
		fieldLabel : '品类',
		store : kondmInfo,
		valueField : 'kondm',
		displayField : 'vtext',
		editable : false,
		width : 145
	});
	
	//款式
	var styleType = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : 'reportSystem.ered?reqCode=getGoodStyleList'
		}),
		reader : new Ext.data.JsonReader({}, [ {
			name : 'extwg'
		}, {
			name : 'ewbez'
		} ])
	});
	styleType.load();
	
	var styleTypeCombo = new Ext.ux.form.LovCombo({
		name : 'styleType',
		triggerAction : 'all',
		mode : 'local',
		fieldLabel : '款式',
		store : styleType,
		valueField : 'extwg',
		displayField : 'ewbez',
		editable : false,
		width : 145
	});
	
	//金料
	var goldType = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : 'reportSystem.ered?reqCode=getGoldList'
		}),
		reader : new Ext.data.JsonReader({}, [ {
			name : 'zjlbn'
		}, {
			name : 'zjlms'
		} ])
	});
	goldType.load();
	
	var goldTypeCombo = new Ext.ux.form.LovCombo({
		name : 'goldType',
		triggerAction : 'all',
		mode : 'local',
		fieldLabel : '金料',
		store : goldType,
		valueField : 'zjlbn',
		displayField : 'zjlms',
		editable : false,
		width : 145
	});
	
	//石料
	var stoneType = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : 'reportSystem.ered?reqCode=getStoneList'
		}),
		reader : new Ext.data.JsonReader({}, [ {
			name : 'zslbm'
		}, {
			name : 'tslbm'
		} ])
	});
	stoneType.load();
	
	var stoneTypeCombo = new Ext.ux.form.LovCombo({
		name : 'stoneType',
		triggerAction : 'all',
		mode : 'local',
		fieldLabel : '石料',
		store : stoneType,
		valueField : 'zslbm',
		displayField : 'tslbm',
		editable : false,
		width : 145
	});
	
	//颜色
	var stoneColor = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : 'reportSystem.ered?reqCode=getStoneColorList'
		}),
		reader : new Ext.data.JsonReader({}, [ {
			name : 'zslys'
		}, {
			name : 'tslys'
		} ])
	});
	stoneColor.load();
	
	var stoneColorCombo = new Ext.ux.form.LovCombo({
		name : 'stoneColor',
		triggerAction : 'all',
		mode : 'local',
		fieldLabel : '主石颜色',
		store : stoneColor,
		valueField : 'zslys',
		displayField : 'tslys',
		editable : false,
		width : 145
	});
	
	//净度
	var stoneLabor = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : 'reportSystem.ered?reqCode=getStoneLaborList'
		}),
		reader : new Ext.data.JsonReader({}, [ {
			name : 'zsljd'
		}, {
			name : 'tsljd'
		} ])
	});
	stoneLabor.load();
	
	var stoneLaborCombo = new Ext.ux.form.LovCombo({
		name : 'stoneLabor',
		triggerAction : 'all',
		mode : 'local',
		fieldLabel : '主石净度',
		store : stoneLabor,
		valueField : 'zsljd',
		displayField : 'tsljd',
		editable : false,
		width : 145
	});
	
	var qForm = new Ext.form.FormPanel({
		border : false,
		labelWidth : 60, // 标签宽度
		labelAlign : 'right', // 标签对齐方式
		bodyStyle : 'padding:5 5 0', // 表单元素和表单面板的边距
		buttonAlign : 'center',
		height : 200,
		items : [{
			layout : 'column',
			border : false,
			items : [{
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [{
									fieldLabel : '物料号',
									id : 'matnr',
									name : 'matnr',
									anchor : '100%'
								}]
					}, {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [{
									fieldLabel : '批次号',
									id : 'charg',
									name : 'charg',
									anchor : '100%'
								}]
					}]
			},{
				layout : 'column',
				border : false,
				items : [{
							columnWidth : .5,
							layout : 'form',
							labelWidth : 60, // 标签宽度
							border : false,
							items : [kondmCombo]
						}, {
							columnWidth : .5,
							layout : 'form',
							labelWidth : 60, // 标签宽度
							border : false,
							items : [styleTypeCombo]
						}]
			},{
				layout : 'column',
				border : false,
				items : [{
							columnWidth : .5,
							layout : 'form',
							labelWidth : 60, // 标签宽度
							border : false,
							items : [goldTypeCombo]
						}, {
							columnWidth : .5,
							layout : 'form',
							labelWidth : 60, // 标签宽度
							border : false,
							items : [stoneTypeCombo]
						}]
			},{
				layout : 'column',
				border : false,
				items : [{
							columnWidth : .5,
							layout : 'form',
							labelWidth : 60, // 标签宽度
							border : false,
							items : [stoneColorCombo]
						}, {
							columnWidth : .5,
							layout : 'form',
							labelWidth : 60, // 标签宽度
							border : false,
							items : [stoneLaborCombo]
						}]
			},{
				layout : 'column',
				border : false,
				items : [{
							columnWidth : .5,
							layout : 'form',
							labelWidth : 60, // 标签宽度
							border : false,
							defaultType : 'textfield',
							items : [{
								fieldLabel : '主石重从',
								id : 'zszFrom',
								name : 'zszFrom',
								emptyText :'g',
								regex: /^(([1-9]\d{0,9})|0)(\.\d{1,3})?$/,
					            regexText: "格式错误,请输入重量！",
								anchor : '100%'
							}]
						}, {
							columnWidth : .5,
							layout : 'form',
							labelWidth : 60, // 标签宽度
							border : false,
							defaultType : 'textfield',
							items : [{
								fieldLabel : '到',
								id : 'zszTo',
								name : 'zszTo',
								emptyText :'g',
								regex: /^(([1-9]\d{0,9})|0)(\.\d{1,3})?$/,
					            regexText: "格式错误,请输入重量！",
								anchor : '100%'
							}]
						}]
			},{
				layout : 'column',
				border : false,
				items : [{
							columnWidth : .5,
							layout : 'form',
							labelWidth : 60, // 标签宽度
							border : false,
							defaultType : 'textfield',
							items : [{
								fieldLabel : '尺寸从',
								id : 'ccFrom',
								name : 'ccFrom',
								emptyText :'#',
								regex: /^(([1-9]\d{0,9})|0)?$/,
					            regexText: "格式错误,请输入尺寸！",
								anchor : '100%'
							}]
						}, {
							columnWidth : .5,
							layout : 'form',
							labelWidth : 60, // 标签宽度
							border : false,
							defaultType : 'textfield',
							items : [{
								fieldLabel : '到',
								id : 'ccTo',
								name : 'ccTo',
								emptyText :'#',
								regex: /^(([1-9]\d{0,9})|0)?$/,
					            regexText: "格式错误,请输入尺寸！",
								anchor : '100%'
							}]
						}]
			}]
	});
	
	var qWindow = new Ext.Window({
			title : '<span class="commoncss">查询条件</span>', 		// 窗口标题
			layout : 'fit', 										// 设置窗口布局模式
			width : 450, 											// 窗口宽度
			height : 240, 											// 窗口高度
			closable : false, 										// 是否可关闭
			closeAction : 'hide', 									// 关闭策略
			collapsible : true, 									// 是否可收缩
			maximizable : false, 									// 设置是否可以最大化
			border : true, 											// 边框线设置
			constrain : true,
			titleCollapse : true,
			animateTarget : Ext.getBody(),
			pageY : 100, 											// 页面定位Y坐标
			pageX : document.body.clientWidth / 2 - 700 / 2, 		// 页面定位X坐标
			// 设置窗口是否可以溢出父容器
			buttonAlign : 'right',
			items : [qForm],
			buttons : [{
						text : '查询',
						iconCls : 'previewIcon',
						handler : function() {
							querySaleOrderList(qForm.getForm());
							qWindow.hide();
						}
					}, {
						text : '重置',
						iconCls : 'tbar_synchronizeIcon',
						handler : function() {
							qForm.getForm().reset();
						}
					}, {
						text : '关闭',
						iconCls : 'deleteIcon',
						handler : function() {
							qWindow.hide();
						}
					}]
		});
		qWindow.show(); // 显示窗口

		// 定义自动当前页行号
		var rownum = new Ext.grid.RowNumberer({
			header : 'NO',
			width : 28
		});

		// 定义列模型 
		var cm = new Ext.grid.ColumnModel([rownum, {
				header : '物料号',
				dataIndex : 'matnr',
				width : 130
			}, {
				header : '批次号',
				dataIndex : 'charg',
				width : 90
			}, {
				header : '名称',
				dataIndex : 'maktx',
				width : 140
			}, {
				header : '所在门店',
				dataIndex : 'werks',
				width : 160
			}, {
				header : '库位',
				dataIndex : 'lgort',
				width : 60,
				sortable : true // 是否可排序
			}, {
				header : '库存重量',
				dataIndex : 'labst',
				width : 70,
				sortable : true // 是否可排序
			}, {
				header : '参考价格',
				dataIndex : 'ckjg',
				width : 80,
				sortable : true, // 是否可排序
				renderer : function(value, cellmeta, record) {
					if(Number(record.get('bzj')) != 0){
						return Number(Number(record.get('ybzjg'))*(Number(record.get('zckxs'))).toFixed(2)/1000);
					} else {
						return Number('0').toFixed(2);
					}
				}
			}, {
				header : '金料',
				dataIndex : 'zjlbm',
				width : 70,
				renderer : function(v) {
					if(goldType.find('zjlbn',v) > 0)
						return (goldType.getAt(goldType.find('zjlbn',v)).get('zjlms')); 
					else 
						return v;
	            }
			}, {
				header : '款式',
				dataIndex : 'extwg',
				width : 50,
				renderer : function(v) {
					if(styleType.find('extwg',v) > 0)
						return (styleType.getAt(styleType.find('extwg',v)).get('ewbez')); 
					else 
						return v;
	            }
			}, {
				header : '尺寸',
				dataIndex : 'zccnn',
				width : 50
			}, {
				header : '定价组',
				dataIndex : 'kondm',
				width : 100
//				renderer : function(v) {
//					if(kondmInfo.find('kondm',v) > 0)
//						return (kondmInfo.getAt(kondmInfo.find('kondm',v)).get('vtext')); 
//					else 
//						return v;
//	            }
			}, {
				header : '石料',
				dataIndex : 'stone',
				width : 60,
				renderer : function(v) {
					if(stoneType.find('zslbm',v) > 0)
						return (stoneType.getAt(stoneType.find('zslbm',v)).get('tslbm')); 
					else 
						return v;
	            }
			}, {
				header : '证书颜色',
				dataIndex : 'ztxt3',
				width : 90,
				renderer : function(v) {
					if(stoneColor.find('zslys',v) > 0)
						return (stoneColor.getAt(stoneColor.find('zslys',v)).get('tslys')); 
					else 
						return v; 
	            }
			}, {
				header : '证书净度',
				dataIndex : 'ztxt4',
				width : 90,
				renderer : function(v) {
					if(stoneLabor.find('zsljd', v) > 0)
						return (stoneLabor.getAt(stoneLabor.find('zsljd',v)).get('tsljd')); 
					else 
						return v; 
	            }
			}, {
				header : '主石单石重',
				dataIndex : 'zcitstomwg',
				width : 90,
				sortable : true // 是否可排序
			}, {
				header : '图片',
				dataIndex : 'zmatnrt',
				width : 50,
				renderer : function(v) {
		               if(v){
		            	   return "<img src='../../../sappic/" + v + "' width='20px' height='20px' " +
		            	   		"ext:qtip=\"<img src='../../../sappic/" + v + "' width='260px' height='260px'/>\" />";
			   		   } else {
			   			   return "<img src='./images/sample1.gif' width='20px' height='20px' " +
			   			   		"ext:qtip=\"<img src='./images/sample1.gif' width='260px' height='260px'/>\" />";
			   		   }
		           }
			}]);

		/**
		 * 数据存储
		 */
		var store = new Ext.data.Store({
			// 获取数据的方式
			proxy : new Ext.data.HttpProxy({
				url : 'reportSystem.ered?reqCode=getStoreInfo'
			}),
			// 数据读取器
			reader : new Ext.data.JsonReader({
				totalProperty : 'TOTALCOUNT', // 记录总数
				root : 'ROOT' // Json中的列表数据根节点
			}, [{
						name : 'matnr'
					}, {
						name : 'charg'
					}, {
						name : 'werks'
					}, {
						name : 'lgort'
					}, {
						name : 'labst'
					}, {
						name : 'ybzjg'
					}, {
						name : 'zckxs'
					}, {
						name : 'zjlbm'
					}, {
						name : 'extwg'
					}, {
						name : 'zccnn'
					}, {
						name : 'kondm'
					}, {
						name : 'maktx'
					}, {
						name : 'stone'
					}, {
						name : 'ztxt3'
					}, {
						name : 'ztxt4'
					}, {
						name : 'zcitstomwg'
					}, {
						name : 'zmatnrt'
					}
				])
		});
		
		// 每页显示条数下拉选择框
		var pagesizeCombo = new Ext.form.ComboBox({
			name : 'pagesize',
			triggerAction : 'all',
			mode : 'local',
			store : new Ext.data.ArrayStore({
						fields : ['value', 'text'],
						data : [[10, '10条/页'], [20, '20条/页'], [50, '50条/页'], [100, '100条/页'], 
						        [250, '250条/页'], [500, '500条/页'], [1000, '1000条/页'], [100000000, '更多']]
					}),
			valueField : 'value',
			displayField : 'text',
			value : '20',
			editable : false,
			width : 85
		});

		// 翻页排序时带上查询条件
		store.on('beforeload', function() {
			this.baseParams = qForm.getForm().getValues();
			this.baseParams.kondms = kondmCombo.getValue();
			this.baseParams.styleTypes = styleTypeCombo.getValue();
			this.baseParams.goldTypes = goldTypeCombo.getValue();
			this.baseParams.stoneTypes = stoneTypeCombo.getValue();
			this.baseParams.stoneColors = stoneColorCombo.getValue();
			this.baseParams.stoneLabors = stoneLaborCombo.getValue();
		});
		
		// 改变每页显示条数reload数据
		pagesizeCombo.on("select", function(comboBox) {
			bbar.pageSize = parseInt(comboBox.getValue());
			number = parseInt(comboBox.getValue());
			querySaleOrderList(qForm.getForm());
		});
		
		var number = parseInt(pagesizeCombo.getValue());
		
		// 分页工具栏
		var bbar = new Ext.PagingToolbar({
			pageSize : number,
			store : store,
			displayInfo : true,
			displayMsg : '显示{0}条到{1}条,共{2}条',
			plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
			emptyMsg : "没有符合条件的记录",
			items : ['-', '&nbsp;&nbsp;', pagesizeCombo]
		});

		// 表格工具栏
		var tbar = new Ext.Toolbar({
			items : [{
						text : '查询',
						iconCls : 'previewIcon',
						handler : function() {
							qWindow.show();
						}
					}, {
						text : '刷新',
						iconCls : 'arrow_refreshIcon',
						handler : function() {
							store.reload();
						}
					}]
		});

		// 表格实例
		var grid = new Ext.grid.GridPanel({
			region : 'center',
			margins : '3 3 3 3',
			// collapsible : true,
			border : true,
			width : 600,
			maxSize : 1000,
			autoScroll : true,
			// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
//			title : '<span class="commoncss">销售报表(表格展示)</span>',
			//height : 500,
			frame : false,
			store : store, // 数据存储
			split : true,
			collapsible : false,
			stripeRows : true, // 斑马线
			cm : cm, // 列模型
			tbar : tbar,
			bbar : bbar,// 分页工具栏
			viewConfig : {
//				forceFit : true			// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
			},
			loadMask : {
				msg : '正在加载表格数据,请稍等...'
			}
		});

		// 布局
		var viewport = new Ext.Viewport({
			layout : 'border',
			items : [grid]
		});
		
		// 查询表格数据
		function querySaleOrderList(pForm) {
			var params = pForm.getValues();
			params.kondms = kondmCombo.getValue();
			params.styleTypes = styleTypeCombo.getValue();
			params.goldTypes = goldTypeCombo.getValue();
			params.stoneTypes = stoneTypeCombo.getValue();
			params.stoneColors = stoneColorCombo.getValue();
			params.stoneLabors = stoneLaborCombo.getValue();
			params.start = 0;
			params.limit = bbar.pageSize;
			store.load({
				params : params
			});
		}

});