Ext.onReady(function() {

	// 定义自动当前页行号
	var rownum = new Ext.grid.RowNumberer({
		header : 'NO',
		width : 28
	});

	// 定义列模型 按件
	var cm = new Ext.grid.ColumnModel([ rownum, {
		header : '活动时间',
		width : 100,
		dataIndex : 'saletime'
	}, {
		header : '  销售总件数',
		dataIndex : 'totalcount',
		width : 80
	}, {
		header : '销售总金额',
		dataIndex : 'totalprice',
		width : 80,
		sortable : true,
		renderer : function(v){
			return Number(v).toFixed(2);
		}
	}, {
		header : '促销销售总件数',
		width : 100,
		dataIndex : 'count'
	}, {
		header : '促销销售总金额',
		width : 100,
		dataIndex : 'price',
		renderer : function(v){
			return Number(v).toFixed(2);
		}
	}, {
		header : '活动赠品赠送情况',
		width : 100,
		dataIndex : 'description'
	}, {
		header : '配货总件数',
		width : 100,
		dataIndex : 'explain1'
	}, {
		header : '配货总金额',
		width : 100,
		dataIndex : 'manage'
	}, {
		header : '配货总重量',
		width : 100,
		dataIndex : 'manageresult'
	} ]);


	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
			url : 'reportSystem.ered?reqCode=getSaleInfo'
		}),
		// 数据读取器
		reader : new Ext.data.JsonReader({
			totalProperty : 'TOTALCOUNT', // 记录总数
			root : 'ROOT', // Json中的列表数据根节点
			idProperty : 'rowid'
		}, [ {
			name : 'saletime'
		}, {
			name : 'totalcount'
		}, {
			name : 'totalprice'
		}, {
			name : 'count'
		}, {
			name : 'price'
		}, {
			name : 'aktnr'
		} ])
	});

	// 查询表格数据
	function queryBalanceInfo() {
		store.load({
			params : {
				vkdab : Ext.getCmp('bdate').getValue(),
				vkdbi : Ext.getCmp('edate').getValue(),
				aktnr : Ext.getCmp('selas_code').getValue()
			},
			callback : function(records, options, success) {
				
				if (success == true) {
					if (records.length == 0){
						Ext.Msg.alert('提示', '没有数据');
					}
				} else{
					Ext.Msg.alert('提示', '出现错误');
				}
			}
		});
	}


	// 促销代码下拉框
	var selas_code = new Ext.form.ComboBox({
		id : 'selas_code',
		name : 'selas_code',
		triggerAction : 'all',
		mode : 'local',
		store : store,
		valueField : 'aktnr',
		displayField : 'aktnr',
		emptyText : '促销代码',
		editable : false,
		width : 85
	});


	// 工具栏
	var tbar = new Ext.Toolbar({
		items : [ {
			emptyText : '开始时间',
			xtype : 'datefield',
			id : 'bdate',
			format : '	Y-m-d',
			width : 150
		}, '-', {
			emptyText : '结束时间',
			xtype : 'datefield',
			id : 'edate',
			format : 'Y-m-d',
			width : 150
		}, '-', selas_code, {
			text : '查询',
			iconCls : 'page_findIcon',
			handler : function() {
				if(Ext.getCmp('bdate').getValue() != '' && Ext.getCmp('edate').getValue() == ''){
					Ext.Msg.alert('提示','请选择时间范围！');
					return false;
				}else if(Ext.getCmp('edate').getValue() != '' && Ext.getCmp('bdate').getValue() == ''){
					Ext.Msg.alert('提示','请选择时间范围！');
					return false;
				}
				queryBalanceInfo();
			}
		}, '-', {
			text : '导出Excel',
			tooltip : '点击导出',
			iconCls : 'page_excelIcon',
			handler : function() {
				exportExcel('reportSystem.ered?reqCode=exportSaleInfoExcel');
			}
		} ]
	});

	// 表格实例
	var grid = new Ext.grid.GridPanel({
		id : 'mygrid',
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
		//bbar : bbar,
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
