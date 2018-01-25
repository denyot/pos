Ext.onReady(function() {

	// 定义自动当前页行号
	var rownum = new Ext.grid.RowNumberer({
		header : 'NO',
		width : 28
	});

	// 定义列模型
	var cm = new Ext.grid.ColumnModel([ rownum, {
		header : '日期',
		width : 120,
		dataIndex : 'servicetime'
	}, {
		header : '单据类型',
		dataIndex : 'servicetype',
		width : 80
	}, {
		header : '单号',
		dataIndex : 'serviceno',
		width : 150,
		sortable : true
	}, {
		header : '调出门店',
		width : 80,
		dataIndex : 'dcmd'
	}, {
		header : '商品总重',
		width : 80,
		dataIndex : 'goodsweight'
	}, {
		header : '商品价格',
		width : 80,
		dataIndex : 'goodsprice'
	}, {
		header : '仓位',
		width : 80,
		dataIndex : 'cw'
	}, {
		header : '价格状态',
		width : 100,
		dataIndex : 'pricestatus'
	} ]);

	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
			url : 'reportSystem.ered?reqCode=getGoodsInfoByMatnr'
		}),
		// 数据读取器
		reader : new Ext.data.JsonReader({
			totalProperty : 'TOTALCOUNT', // 记录总数
			root : 'ROOT' // Json中的列表数据根节点
		}, [ {
			name : 'servicetime'
		}, {
			name : 'servicetype'
		}, {
			name : 'serviceno'
		}, {
			name : 'dcmd'
		}, {
			name : 'goodsweight'
		}, {
			name : 'goodsprice'
		}, {
			name : 'cw'
		}, {
			name : 'pricestatus'
		} ])
	});

	// 查询表格数据
	function queryBalanceInfo() {

		store.load({
			params : {
				start : 0,
				//limit : bbar.pageSize,
				charg : Ext.getCmp("charg").getValue()
			},
			callback : function(records,options, success) {
				if (success == true) {
					if (records.length == 0)
						Ext.Msg.alert('提示', '没有数据');
				} else
					Ext.Msg.alert('提示', '出现错误');
			}
		});
	}
	

	// 工具栏
	var tbar = new Ext.Toolbar({
		items : [ {
			emptyText : '批次号',
			xtype : 'textfield',
			id : 'charg',
			width : 150
		}, '-', {
			text : '查询',
			iconCls : 'page_findIcon',
			handler : function() {
				queryBalanceInfo();
			}
		}, '-', {
			text : '导出Excel',
			tooltip : '点击导出',
			iconCls : 'page_excelIcon',
			handler : function() {
				exportExcel('reportSystem.ered?reqCode=exportExcel');
			}
		} ]
	});

	// 表格实例
	var grid = new Ext.grid.GridPanel({
		region : 'center',
		border : false,
		height : 500,
		autoScroll : true,
		frame : true,
		store : store,
		stripeRows : true,
		cm : cm, // 列模型
		// sm : sm,// 多选框
		tbar : tbar, // 工具栏
		// bbar : bbar,// 分页工具栏
		viewConfig : {
			forceFit : true
		},
		loadMask : {
			msg : '正在加载表格数据,请稍等...'
		}
	});

	// 布局
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [ grid ]
	});

})
