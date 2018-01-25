/**
 * 调拨差异统计
 * @author Xiashou
 * @since 2013-11-16
 */
Ext.onReady(function() {
	
	// 定义自动当前页行号
	var rownum = new Ext.grid.RowNumberer({
		header : 'NO',
		width : 28
	});
	
	// 定义列模型
	var cm = new Ext.grid.ColumnModel([ rownum, 
	{
		header : '省份',
		dataIndex : 'bezei',
		width : 60
	}, {
		header : '调出门店',
		dataIndex : 'werks',
		width : 50
	}, {
		header : '门店名称',
		dataIndex : 'name1',
		width : 120
	}, {
		header : '发货单号',
		dataIndex : 'vbeln',
		width : 90
	}, {
		header : '产品类型',
		dataIndex : 'tyjlx',
		width : 60
	}, {
		header : '批次',
		dataIndex : 'charg',
		width : 90
	}, {
		header : '字印不符',
		dataIndex : 'dzy',
		width : 50
	}, {
		header : '品名不符',
		dataIndex : 'dpm',
		width : 50
	}, {
		header : '条码不符',
		dataIndex : 'dtm',
		width : 50
	}, {
		header : '重量不符',
		dataIndex : 'dzl',
		width : 50
	}, {
		header : '鉴定卡不符',
		dataIndex : 'djd',
		width : 50
	}, {
		header : '价格不符',
		dataIndex : 'djg',
		width : 50
	}, {
		header : '标签不符',
		dataIndex : 'dbq',
		width : 50
	}, {
		header : '外观变色变形',
		dataIndex : 'dwg',
		width : 50
	}, {
		header : '与款式需求表不符',
		dataIndex : 'dks',
		width : 50
	}, {
		header : '图片不符',
		dataIndex : 'dtp',
		width : 50
	}, {
		header : '石料不符',
		dataIndex : 'dsl',
		width : 50
	}, {
		header : '数量不符',
		dataIndex : 'zsl',
		width : 50
	}, {
		header : '金额不符',
		dataIndex : 'zje',
		width : 50
	} ]);
	
	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
		pruneModifiedRecords : true,
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
			url : 'reportSystem.ered?reqCode=getTransferDiffCount'
		}),
		// 数据读取器
		reader : new Ext.data.JsonReader({
			root : 'ROOT'
		}, [ {
			name : 'bezei'
		}, {
			name : 'werks'
		}, {
			name : 'name1'
		}, {
			name : 'vbeln'
		}, {
			name : 'tyjlx'
		}, {
			name : 'charg'
		}, {
			name : 'dzy'
		}, {
			name : 'dpm'
		}, {
			name : 'dtm'
		}, {
			name : 'dzl'
		}, {
			name : 'djd'
		}, {
			name : 'djg'
		}, {
			name : 'dbq'
		}, {
			name : 'dwg'
		}, {
			name : 'dks'
		}, {
			name : 'dtp'
		}, {
			name : 'dsl'
		}, {
			name : 'zsl'
		}, {
			name : 'zje'
		}])
	});
	
//	// 翻页排序时带上查询条件
//	store.on('beforeload', function() {
//		this.baseParams = qForm.getForm().getValues();
//	});
	
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
		items : ['&nbsp;', 
		         '日期从 ',{
					xtype : 'datefield', // 设置为数字输入框类型
					id : 'dateFrom',
					name : 'dateFrom',
					format: 'Y-m-d', //日期格式化
					anchor : '100%'
				}, '日期到 ', {
					xtype : 'datefield', // 设置为数字输入框类型
					id : 'dateTo',
					name : 'dateTo',
					format: 'Y-m-d', //日期格式化
					anchor : '100%'
				}, '-', {
					text : '查询',
					iconCls : 'previewIcon',
					handler : function() {
						searchReceiveDiffCount();
					}
				}, '-', {
					text : '导出Excel',
					tooltip : '点击导出',
					iconCls : 'page_excelIcon',
					handler : function() {
						exportExcel('reportSystem.ered?reqCode=exportTransferDiffCountExcel&start=0&limit=' + bbar.pageSize 
								+ '&dateForm=' + Ext.getCmp("dateFrom").getValue() + '&dateTo=' + Ext.getCmp("dateTo").getValue());
					}
				} 
			]
	});
	
	// 表格实例
	var grid = new Ext.grid.EditorGridPanel({
		height : 500,
		autoScroll : true,
		region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		store : store, // 数据存储
		stripeRows : true, // 斑马线
		cm : cm, // 列模型
		tbar : tbar, // 表格工具栏
		bbar : bbar,// 分页工具栏
		loadMask : {
			msg : '正在加载表格数据,请稍等...'
		}
	});
	
	// 布局模型
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [ grid ]
	});
	
	// 保存
	function searchReceiveDiffCount() {
		// 查询表格数据
		store.load({
			params : {
				start : 0,
				limit : bbar.pageSize,
				dateFrom : Ext.getCmp("dateFrom").getValue(),
				dateTo : Ext.getCmp("dateTo").getValue()
			}
		});
	}
	
});