/**
 * 销售明细表
 * @author Xiashou
 * @since 2014/05/31
 */
Ext.onReady(function() {
	
	// 复选框
	var sm = new Ext.grid.CheckboxSelectionModel();
	
	var kondmInfo = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : '../stock/stockSystem.ered?reqCode=getKondmInfo'
		}),
		reader : new Ext.data.JsonReader({}, [ {
			name : 'kondm'
		}, {
			name : 'vtext'
		} ])
	});
	kondmInfo.load();
	
	var orderType = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : '../order/orderSystem.ered?reqCode=getOrderTypeList'
		}),
		reader : new Ext.data.JsonReader({}, [ {
			name : 'pzdm'
		}, {
			name : 'pzmc'
		} ])
	});
	orderType.load();
	
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
	
	var orderTypeCombo = new Ext.ux.form.LovCombo({
		name : 'orderType',
		triggerAction : 'all',
		mode : 'local',
		fieldLabel : '订单类型',
		store : orderType,
		valueField : 'pzdm',
		displayField : 'pzmc',
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
									fieldLabel : '销售单号',
									id : 'vbeln',
									name : 'vbeln',
									anchor : '100%'
								}]
					}, {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [{
									fieldLabel : '会员卡号',
									id : 'kunnr',
									name : 'kunnr',
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
							defaultType : 'textfield',
							border : false,
							items : [{
										fieldLabel : '日期从',
										id : 'dateFrom',
										name : 'dateFrom',
										xtype : 'datefield', // 设置为数字输入框类型
										format: 'Y-m-d', //日期格式化
										anchor : '100%'
									}]
						}, {
							columnWidth : .5,
							layout : 'form',
							labelWidth : 60, // 标签宽度
							defaultType : 'textfield',
							border : false,
							items : [{
										fieldLabel : '日期到',
										id : 'dateTo',
										name : 'dateTo',
										xtype : 'datefield', // 设置为数字输入框类型
										format:'Y-m-d', //日期格式化
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
							items : [orderTypeCombo]
						}, {
							columnWidth : .5,
							layout : 'form',
							labelWidth : 60, // 标签宽度
							border : false,
							items : [kondmCombo]
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
								fieldLabel : '批次号',
								id : 'charg',
								name : 'charg',
								anchor : '100%'
							}]
						}, {
							columnWidth : .5,
							layout : 'form',
							labelWidth : 60, // 标签宽度
							border : false,
							defaultType : 'textfield',
							items : [{
								fieldLabel : '营业员',
								id : 'sales',
								name : 'sales',
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
								fieldLabel : '促销代码',
								id : 'aktnr',
								name : 'aktnr',
								anchor : '100%'
							}]
						},{
							columnWidth : .5,
							layout : 'form',
							labelWidth : 60, // 标签宽度
							border : false,
							items : [ new Ext.form.Checkbox({
								name : 'hidebc',
								checked : true,
								boxLabel : '隐藏包材赠品'
							})]
						}]
			}]
	});
	
	var qWindow = new Ext.Window({
			title : '<span class="commoncss">查询条件</span>', 		// 窗口标题
			layout : 'fit', 										// 设置窗口布局模式
			width : 450, 											// 窗口宽度
			height : 220, 											// 窗口高度
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
		
		// 定义一个行级展开器(需要在CM和grid配置中加入)
		var expander = new Ext.grid.RowExpander({
			tpl : new Ext.Template('<p style=margin-left:70px;><span>现金:</span><span style=color:Teal;>{cash}</span>',
					'&nbsp;&nbsp;<span>银联:</span><span style=color:Teal;>{unionpay}</span>',
					'&nbsp;&nbsp;<span>购物卡:</span><span style=color:Teal;>{shoppingcard}</span><br/><br/>',
					'<span>本次积分:</span><span style=color:Teal;>{currentintegral}</span>',
					'&nbsp;&nbsp;<span>小票:</span><span style=color:Teal;>{storereceipt}</span></p>'),
			// 设置行双击是否展开
			expandOnDblClick : true
		});

		// 定义自动当前页行号
		var rownum = new Ext.grid.RowNumberer({
			header : 'NO',
			width : 28
		});

		// 定义列模型 
		var cm = new Ext.grid.ColumnModel([rownum, expander, {
				header : '单号',
				dataIndex : 'vbeln',
				width : 90
			}, {
				header : '类型',
				dataIndex : 'ordertype',
				width : 60,
				sortable : true	// 是否可排序
			}, {
				header : '销售日期',
				dataIndex : 'saledate',
				width : 80,
				sortable : true // 是否可排序
			}, {
				header : '会员号',
				dataIndex : 'vipcard',
				width : 60,
				sortable : true // 是否可排序
			}, {
				header : '物料号',
				dataIndex : 'matnr',
				width : 130,
				sortable : true // 是否可排序
			}, {
				header : '批次号',
				dataIndex : 'charg',
				width : 90,
				sortable : true // 是否可排序
			}, {
				header : '名称',
				dataIndex : 'maktx',
				width : 140,
				sortable : true // 是否可排序
			}, {
				header : '数量',
				dataIndex : 'kwmeng',
				width : 50,
				sortable : true // 是否可排序
			}, {
				header : '重量',
				dataIndex : 'goldweight',
				width : 60,
				sortable : true // 是否可排序
			}, {
				header : '零售价',
				dataIndex : 'tagprice',
				width : 90,
				sortable : true // 是否可排序
			}, {
				header : '实收价',
				dataIndex : 'netprice',
				width : 90,
				sortable : true // 是否可排序
			}, {
				header : '促销代码',
				dataIndex : 'salepromotion',
				width : 90,
				sortable : true // 是否可排序
			}, {
				header : '备注',
				dataIndex : 'remarks',
				width : 90,
				sortable : true // 是否可排序
			}
			
			, {
				header : '赠链',
				dataIndex : 'giftmethod',
				width : 60,
				renderer : function(v) {
		               if(v == '01'){
			   				return "赠链";
			   			} else if (v == '02'){
			   				return "赠货品";
			   			}
		           }
			}, {
				header : '图片',
				dataIndex : 'imgurl',
				width : 50,
				renderer : function(v) {
		               if(v == 'zjzb.gif'){
		            	   return "<img src='./images/sample1.gif' width='20px' height='20px' " +
		            	   		"ext:qtip=\"<img src='./images/sample1.gif' width='260px' height='260px'/>\" />";
			   		   } else {
			   			   return "<img src='../../../sappic/" + v + "' width='20px' height='20px' " +
			   			   		"ext:qtip=\"<img src='../../../sappic/" + v + "' width='260px' height='260px'/>\" />";
			   		   }
		           }
			}, {
				header : '营业员',
				dataIndex : 'salesclerk',
				width : 180,
				renderer : function(v, metadata, record, rowIndex, columnIndex, store){
					metadata.attr = ' ext:qtip="' + v + '"';    
					return v;
				}
			}]);

		/**
		 * 数据存储
		 */
		var store = new Ext.data.Store({
			// 获取数据的方式
			proxy : new Ext.data.HttpProxy({
				url : 'reportSystem.ered?reqCode=getSaleOrderList'
			}),
			// 数据读取器
			reader : new Ext.data.JsonReader({
				totalProperty : 'TOTALCOUNT', // 记录总数
				root : 'ROOT' // Json中的列表数据根节点
			}, [{
						name : 'vbeln'
					}, {
						name : 'ordertype'
					}, {
						name : 'saledate'
					}, {
						name : 'vipcard'
					}, {
						name : 'matnr'
					}, {
						name : 'charg'
					}, {
						name : 'maktx'
					}, {
						name : 'kwmeng',
						type : 'float'
					}, {
						name : 'goldweight',
						type : 'float'
					}, {
						name : 'tagprice',
						type : 'float'
					}, {
						name : 'netprice',
						type : 'float'
					}, {
						name : 'salepromotion'
					}, {
						name : 'giftmethod'
					}, {
						name : 'imgurl'
					}, {
						name : 'salesclerk'
					}, {
						name : 'remarks'
					}, {
						name : 'cash'
					}, {
						name : 'unionpay'
					}, {
						name : 'shoppingcard'
					}, {
						name : 'storereceipt'
					}, {
						name : 'currentintegral'
					}
				])
		});

		// 翻页排序时带上查询条件
		store.on('beforeload', function() {
			this.baseParams = qForm.getForm().getValues();
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
			items : ['-', '&nbsp;&nbsp;', pagesizeCombo, '-', {
				text : '合计',
				iconCls : 'addIcon',
				handler : function() {
					summary.toggleSummary();
				}
			}]
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
		
		// 合计
		var summary = new Ext.ux.grid.GridSummary();

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
			plugins : [summary, expander], // 合计
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
			params.ordertype = orderTypeCombo.getValue();
			params.start = 0;
			params.limit = bbar.pageSize;
			store.load({
				params : params,
				callback :fnSumInfo
			});
		}
		
		function fnSumInfo() {
			var obj = new Object();
			obj.kwmeng = store.sum('kwmeng').toFixed(2);
			obj.goldweight = store.sum('goldweight').toFixed(2);
			obj.tagprice = store.sum('tagprice').toFixed(2);
			obj.netprice = store.sum('netprice').toFixed(2);
			summary.toggleSummary(true);
			summary.setSumValue(obj);
		}

});