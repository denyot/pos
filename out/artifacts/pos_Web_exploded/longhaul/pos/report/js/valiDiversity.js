Ext.onReady(function() {

	// 定义自动当前页行号
	var rownum = new Ext.grid.RowNumberer({
		header : 'NO',
		width : 28
	});

	// 定义列模型 按件
	var cm = new Ext.grid.ColumnModel([ rownum, {
		header : '批次号',
		width : 120,
		dataIndex : 'charg'
	}, {
		header : '件数',
		dataIndex : 'goodscount',
		width : 80
	}, {
		header : '单号',
		dataIndex : 'outid',
		width : 150,
		sortable : true
	}, {
		header : '收货日期',
		width : 80,
		dataIndex : 'recievetime'
	}, {
		header : '总件数',
		width : 80,
		dataIndex : 'hgoodscount'
	}, {
		header : '差异原因',
		width : 80,
		dataIndex : 'description'
	}, {
		header : '差异说明',
		width : 80,
		dataIndex : 'explain1'
	}, {
		header : '处理方案',
		width : 100,
		dataIndex : 'manage'
	}, {
		header : '终端反馈',
		width : 100,
		dataIndex : 'manageresult'
	}, {
		header : '合计',
		width : 100,
		hidden : 'true',
		dataIndex : 'count'
	}, {
		header : '总件数',
		width : 100,
		hidden : 'true',
		dataIndex : 'totalcount'
	}, {
		header : '差异率',
		width : 100,
		hidden : 'true',
		dataIndex : 'diversityrate'
	} ]);

	// 按单
	var cm2 = new Ext.grid.ColumnModel([ rownum, {
		header : '单号',
		width : 120,
		dataIndex : 'id'
	}, {
		header : '数量',
		dataIndex : 'menge',
		width : 80
	}, {
		header : '总金额',
		dataIndex : 'totalprice',
		width : 150,
		sortable : true
	}, {
		header : '收货日期',
		width : 80,
		dataIndex : 'recievedate'
	}, {
		header : '差异原因',
		width : 80,
		dataIndex : 'description'
	}, {
		header : '差异说明',
		width : 80,
		dataIndex : 'myexplain'
	}, {
		header : '处理方案',
		width : 80,
		dataIndex : 'manage'
	}, {
		header : '终端反馈',
		width : 100,
		dataIndex : 'manageresult'
	}, {
		header : '合计',
		width : 100,
		hidden : 'true',
		dataIndex : 'count'
	}, {
		header : '总件数',
		width : 100,
		hidden : 'true',
		dataIndex : 'totalcount'
	}, {
		header : '差异率',
		width : 100,
		hidden : 'true',
		dataIndex : 'diversityrate'
	} ]);

	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
			url : 'reportSystem.ered?reqCode=getValiDiversity'
		}),
		// 数据读取器
		reader : new Ext.data.JsonReader({
			totalProperty : 'TOTALCOUNT', // 记录总数
			root : 'ROOT', // Json中的列表数据根节点
			idProperty : 'rowid'
		}, [ {
			name : 'id'
		}, {
			name : 'menge',
			type : 'int'
		}, {
			name : 'totalprice'
		}, {
			name : 'recievedate'
		}, {
			name : 'description'
		}, {
			name : 'myexplain'
		}, {
			name : 'manage'
		}, {
			name : 'manageresult'
		}, {
			name : 'count'
		}, {
			name : 'totalcount'
		}, {
			name : 'diversityrate'
		}, {
			name : 'charg'
		}, {
			name : 'goodscount',
			type : 'int'
		}, {
			name : 'outid'
		}, {
			name : 'recievetime'
		}, {
			name : 'hgoodscount'
		} ])
	});

	var totalStore = new Ext.data.JsonStore({
		url : 'reportSystem.ered?reqCode=getCount',
		fields : [{count : 'count'},{totalcount : 'totalcount'},{diversityrate : 'diversityrate'}]
	});

	// 查询表格数据
	function queryBalanceInfo() {
		store.load({
			params : {
				diversitytype : Ext.getCmp('diversitytype').getValue(),
				bdate : Ext.getCmp('bdate').getValue(),
				edate : Ext.getCmp('edate').getValue(),
				recievetype : Ext.getCmp('recievetype').getValue()
			},
			callback : function(records, options, success) {
				
				if (success == true) {
					if (records.length == 0){
						Ext.Msg.alert('提示', '没有数据');
						Ext.getCmp('total').setText('0');
						Ext.getCmp('totalnumber').setText('0');
						Ext.getCmp('diversityrate').setText('0');
					}
				} else
					Ext.Msg.alert('提示', '出现错误');
				
				getCount();
			}
		});
	}


	// 收货类型下拉框
	var type_combo = new Ext.form.ComboBox({
		id : 'recievetype',
		name : 'recievetype',
		triggerAction : 'all',
		mode : 'local',
		store : new Ext.data.ArrayStore({
			fields : [ 'value', 'text' ],
			data : [ [ 'A', '货品' ], [ 'G', '赠品' ], [ 'H', '包材' ] ]
		}),
		valueField : 'value',
		displayField : 'text',
		emptyText : '收货类型',
		editable : false,
		width : 85
	});

	// 差异类型下拉框
	var diversity_combo = new Ext.form.ComboBox({
		id : 'diversitytype',
		name : 'diversitytype',
		triggerAction : 'all',
		mode : 'local',
		store : new Ext.data.ArrayStore({
			fields : [ 'value', 'text' ],
			data : [ [ 1, '按件' ], [ 2, '按单' ] ]
		}),
		valueField : 'value',
		displayField : 'text',
		emptyText : '差异类型',
		editable : false,
		width : 85,
		listeners : {
			select : function() {
				var diversitytext = this.getValue();
				if (diversitytext == 1) {
					Ext.getCmp("mygrid").reconfigure(store, cm);
				} else if (diversitytext == 2) {
					Ext.getCmp("mygrid").reconfigure(store, cm2);
				}
			}
		}
	});

	// 工具栏
	var tbar = new Ext.Toolbar({
		items : [ {
			emptyText : '开始时间',
			xtype : 'datefield',
			id : 'bdate',
			format : 'y-m-d',
			width : 150
		}, '-', {
			emptyText : '结束时间',
			xtype : 'datefield',
			id : 'edate',
			format : 'y-m-d',
			width : 150
		}, '-', type_combo, '-', diversity_combo, '-', {
			text : '查询',
			iconCls : 'page_findIcon',
			handler : function() {
				if(Ext.getCmp('diversitytype').getValue() == ''){
					Ext.Msg.alert('提示','请选择差异类型！');
					return false;
				}
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
				exportExcel('reportSystem.ered?reqCode=exportValiDiversityExcel&cylx='+ Ext.getCmp('diversitytype').getValue());
			}
		} ]
	});

	// 底部工具栏
	var bbar = new Ext.Toolbar({
		store : totalStore,
		items : [ {
			xtype : 'label',
			text : '合计：'
		}, {
			xtype : 'label',
			id : 'total',
			text : '0'
		}, '-', '&nbsp;&nbsp;', {
			xtype : 'label',
			text : '收货总件数：'
		}, {
			xtype : 'label',
			id : 'totalnumber',
			text : '0'
		}, '-', '&nbsp;&nbsp;', {
			xtype : 'label',
			text : '差异率：'
		}, {
			xtype : 'label',
			id : 'diversityrate',
			text : '0'
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
		bbar : bbar,
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

	function getCount() {
		var rows = grid.store.data.items;
		Ext.getCmp('total').setText(Number(rows[0].get('count')));
		Ext.getCmp('totalnumber').setText(Number(rows[0].get('totalcount')));
		Ext.getCmp('diversityrate').setText(rows[0].get('diversityrate'));
	}
	
})
