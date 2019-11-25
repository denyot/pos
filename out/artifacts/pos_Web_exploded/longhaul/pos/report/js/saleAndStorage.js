/**
 * 进销存汇总表
 * @author Xiashou
 * @since 2014/05/04
 */
Ext.onReady(function() {
	
	var qForm = new Ext.form.FormPanel({
		border : false,
		labelWidth : 60, // 标签宽度
		labelAlign : 'right', // 标签对齐方式
		bodyStyle : 'padding:5 5 0', // 表单元素和表单面板的边距
		buttonAlign : 'center',
		height : 90,
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
									fieldLabel : '日期从',
									id : 'dateFrom',
									name : 'dateFrom',
									xtype : 'datefield', // 设置为数字输入框类型
									format: 'Y-m-d', //日期格式化
									//allowBlank: false,
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
									//allowBlank: false,
									anchor : '100%'
								}]
					}]
				}
				]
	});
	
	var qWindow = new Ext.Window({
			title : '<span class="commoncss">查询条件</span>', 		// 窗口标题
			layout : 'fit', 										// 设置窗口布局模式
			width : 400, 											// 窗口宽度
			height : 100, 											// 窗口高度
			closable : false, 										// 是否可关闭
			closeAction : 'hide', 									// 关闭策略
			collapsible : true, 									// 是否可收缩
			maximizable : false, 									// 设置是否可以最大化
			border : true, 											// 边框线设置
			constrain : true,
			titleCollapse : true,
			animateTarget : Ext.getBody(),
			pageY : 100, 											// 页面定位Y坐标
			pageX : document.body.clientWidth / 2 - 400 / 2, 		// 页面定位X坐标
			// 设置窗口是否可以溢出父容器
			buttonAlign : 'right',
			items : [qForm],
			buttons : [{
						text : '查询',
						iconCls : 'previewIcon',
						handler : function() {
							if(Ext.get('dateFrom').getValue() == ''){
								Ext.MessageBox.alert('提示', '请输入开始日期！');
								return;
							}else if(Ext.get('dateTo').getValue() == ''){
								Ext.MessageBox.alert('提示', '请输入结束日期！');
								return;
							}
							queryBalanceInfo(qForm.getForm());
//							updateChart(qForm.getForm());
							//qWindow.collapse();
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
//				header : '商品定价组',
//				dataIndex : 'kondm',
//				width : 30
//			}, {
				header : '商品定价组',
				dataIndex : 'kondmtext',
				width : 120
			}, {
				header : '收货件数',
				dataIndex : 'slabst',
				width : 60,
				sortable : true	// 是否可排序
			}, {
				header : '收货总重',
				dataIndex : 'sweight',
				width : 90,
				sortable : true // 是否可排序
			}, {
				header : '收货金额',
				dataIndex : 'skbetr',
				width : 90,
				sortable : true // 是否可排序
			}, {
				header : '调出件数',
				dataIndex : 'clabst',
				width : 60,
				sortable : true // 是否可排序
			}, {
				header : '调出总重',
				dataIndex : 'cweight',
				width : 90,
				sortable : true // 是否可排序
			}, {
				header : '调出金额',
				dataIndex : 'ckbetr',
				width : 90,
				sortable : true // 是否可排序
			}, {
				header : '调入件数',
				dataIndex : 'rlabst',
				width : 60,
				sortable : true // 是否可排序
			}, {
				header : '调入总重',
				dataIndex : 'rweight',
				width : 90,
				sortable : true // 是否可排序
			}, {
				header : '调入金额',
				dataIndex : 'rkbetr',
				width : 90,
				sortable : true // 是否可排序
			}, {
				header : '销售件数',
				dataIndex : 'xlabst',
				width : 60,
				sortable : true // 是否可排序
			}, {
				header : '销售总重',
				dataIndex : 'xweight',
				width : 90,
				sortable : true // 是否可排序
			}, {
				header : '销售金额',
				dataIndex : 'xkbetr',
				width : 90,
				sortable : true // 是否可排序
			}, {
				header : '结存件数',
				dataIndex : 'jlabst',
				width : 60,
				sortable : true // 是否可排序
			}, {
				header : '结存总重',
				dataIndex : 'jweight',
				width : 90,
				sortable : true // 是否可排序
			}, {
				header : '结存金额',
				dataIndex : 'jkbetr',
				width : 90,
				sortable : true // 是否可排序
		}]);

		/**
		 * 数据存储
		 */
		var store = new Ext.data.Store({
			// 获取数据的方式
			proxy : new Ext.data.HttpProxy({
				url : 'reportSystem.ered?reqCode=getSaleAndStorageGroupKondm'
			}),
			// 数据读取器
			reader : new Ext.data.JsonReader({
				totalProperty : 'TOTALCOUNT', // 记录总数
				root : 'ROOT' // Json中的列表数据根节点
			}, [{
						name : 'kondm'
					}, {
						name : 'kondmtext'
					}, {
						name : 'slabst'
					}, {
						name : 'sweight'
					}, {
						name : 'skbetr'
					}, {
						name : 'clabst'
					}, {
						name : 'cweight'
					}, {
						name : 'ckbetr'
					}, {
						name : 'rlabst'
					}, {
						name : 'rweight'
					}, {
						name : 'rkbetr'
					}, {
						name : 'xlabst'
					}, {
						name : 'xweight'
					}, {
						name : 'xkbetr'
					}, {
						name : 'jlabst'
					}, {
						name : 'jweight'
					}, {
						name : 'jkbetr'
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
						data : [[10, '10条/页'], [20, '20条/页'], [50, '50条/页'], [100, '100条/页'], [250, '250条/页'], [500, '500条/页']]
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
			store.reload({
						params : {
							start : 0,
							limit : bbar.pageSize
						}
					});
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
//							updateChart(qForm.getForm());
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
		function queryBalanceInfo(pForm) {
			var params = pForm.getValues();
			params.start = 0;
			params.limit = bbar.pageSize;
			store.load({
						params : params
					});
		}

});