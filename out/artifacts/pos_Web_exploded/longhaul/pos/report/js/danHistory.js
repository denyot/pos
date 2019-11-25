Ext.onReady(function() {

	// 定义自动当前页行号
	var rownum = new Ext.grid.RowNumberer({
		header : 'NO',
		width : 28
	});

	// 定义列模型
	var cm = new Ext.grid.ColumnModel([ rownum, {
		header : '函数名称',
		width : 60,
		dataIndex : 'funcname'
	}, {
		header : '开始时间',
		dataIndex : 'starttime',
		width : 60,
		sortable : true
	}, {
		header : '结束时间',
		width : 60,
		dataIndex : 'endtime'
	}, {
		header : '参数',
		width : 180,
		dataIndex : 'inparam'
	}]);

	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
			url : 'reportSystem.ered?reqCode=getDanHistory'
		}),
		// 数据读取器
		reader : new Ext.data.JsonReader({
			totalProperty : 'TOTALCOUNT', // 记录总数
			root : 'ROOT' // Json中的列表数据根节点
		}, [ {
			name : 'funcname'
		}, {
			name : 'starttime'
		}, {
			name : 'endtime'
		}, {
			name : 'inparam'
		} ])
	});

	// 查询表格数据
	function queryBalanceInfo() {

		store.load({
			params : {
				start : 0,
				//limit : bbar.pageSize,
				danhao : Ext.getCmp("danhao").getValue()||123
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
			emptyText : '单号',
			xtype : 'textfield',
			id : 'danhao',
			width : 150
		}, '-', {
			text : '查询',
			iconCls : 'page_findIcon',
			handler : function() {
				queryBalanceInfo();
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
