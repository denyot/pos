Ext.onReady(function() {

	// 定义自动当前页行号
	var rownum = new Ext.grid.RowNumberer({
		header : 'NO',
		width : 28
	});

	// 定义列模型
	var cm = new Ext.grid.ColumnModel([ rownum, {
		header : '单号',
		dataIndex : 'no',
		width : 150
	}, {
		header : '批次号',
		dataIndex : 'charg',
		width : 80
	}, {
		header : '名称',
		dataIndex : 'maktx',
		width : 150
	}, {
		header : '件数',
		width : 80,
		dataIndex : 'realitycount'
	}, {
		header : '重量',
		width : 80,
		dataIndex : 'labst'
	}, {
		header : '金重',
		width : 80,
		dataIndex : 'goldweight'
	}, {
		header : '标签价',
		width : 80,
		dataIndex : 'kbetr'
	}, {
		header : '差异备注',
		width : 100,
		dataIndex : 'remark'
	} ]);
	
	
	// 定义列模型
	var cm1 = new Ext.grid.ColumnModel([ rownum, {
		header : '详情', // 列标题
		dataIndex : 'edit',
		width : 35,
		renderer : iconColumnRender
	},{
		header : '单号',
		dataIndex : 'id',
		width : 150
	}, {
		header : '盘点日期',
		dataIndex : 'starttime',
		width : 150
	} ]);

	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
			url : 'reportSystem.ered?reqCode=getTakesDiversity'
		}),
		// 数据读取器
		reader : new Ext.data.JsonReader({
			totalProperty : 'TOTALCOUNT', // 记录总数
			root : 'ROOT', // Json中的列表数据根节点
			idProperty : 'rowid'
		}, [ {
			name : 'no'
		}, {
			name : 'charg'
		}, {
			name : 'maktx'
		}, {
			name : 'realitycount'
		}, {
			name : 'labst'
		}, {
			name : 'goldweight'
		}, {
			name : 'kbetr'
		}, {
			name : 'remark'
		} ])
	});
	
	/**
	 * 数据存储
	 */
	var store1 = new Ext.data.Store({
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
			url : 'reportSystem.ered?reqCode=getByDate'
		}),
		// 数据读取器
		reader : new Ext.data.JsonReader({
			totalProperty : 'TOTALCOUNT', // 记录总数
			root : 'ROOT', // Json中的列表数据根节点
			idProperty : 'rowid'
		}, [ {
			name : 'id'
		}, {
			name : 'starttime'
		} ])
	});
	
	
	var years = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : 'reportSystem.ered?reqCode=getYears'
		}),
		reader : new Ext.data.JsonReader({
			totalProperty : 'TOTALCOUNT',
			root : 'ROOT'
		},[{
				name : 'value'
			},{
				name : 'text'
			}]
		)
	});
	
	years.load();
	var year_combo = new Ext.form.ComboBox({
		id : 'year',
		name : 'year',
		triggerAction : 'all',
		mode : 'local',
		store : years,
		valueField : 'value',
		displayField : 'text',
		emptyText : '选择年份',
		editable : false,
		width : 85
	});
	
	var month_combo = new Ext.form.ComboBox({
		id : 'month',
		name : 'month',
		triggerAction : 'all',
		mode : 'local',
		store : new Ext.data.ArrayStore({
			fields : ['value', 'text'],
			data : [['01', '1月'], ['02', '2月'],
					['03', '3月'], ['04', '4月'],
					['05', '5月'], ['06', '6月'],
					['07', '7月'], ['08', '8月'],
					['09', '9月'], ['10', '10月'],
					['11', '11月'], ['12', '12月']
			]
		}),
		valueField : 'value',
		displayField : 'text',
		emptyText : '选择月份',
		editable : false,
		width : 85
	});

	
	
	// 翻页排序时带上查询条件
	store.on('beforeload', function() {
				this.baseParams = {
						start : 0,
						limit : bbar.pageSize,
						pdno : pdno,
						pdtime : Ext.getCmp("year").getValue() + Ext.getCmp("month").getValue()
				};
			});
	// 每页显示条数下拉选择框
	var pagesize_combo = new Ext.form.ComboBox({
				name : 'pagesize',
				triggerAction : 'all',
				mode : 'local',
				store : new Ext.data.ArrayStore({
							fields : ['value', 'text'],
							data : [[10, '10条/页'], [20, '20条/页'],
									[50, '50条/页'], [100, '100条/页'],
									[250, '250条/页'], [500, '500条/页']]
						}),
				valueField : 'value',
				displayField : 'text',
				value : '20',
				editable : false,
				width : 85
			});
	var number = parseInt(pagesize_combo.getValue());
	// 改变每页显示条数reload数据
	pagesize_combo.on("select", function(comboBox) {
				bbar.pageSize = parseInt(comboBox.getValue());
				if(Ext.getCmp('pdno').getValue() == ""){
					queryBalanceInfo(pdno);
				}else{
					queryBalanceInfo(Ext.getCmp('pdno').getValue());
				}
			});

	// 分页工具栏
	var bbar = new Ext.PagingToolbar({
				pageSize : number,
				store : store,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
				emptyMsg : "没有符合条件的记录",
				items : ['-', '&nbsp;&nbsp;', pagesize_combo]
			});

	
	var pdno = "";
	

	// 工具栏
	var tbar = new Ext.Toolbar({
		items : [ {
			emptyText : '盘点单号',
			xtype : 'textfield',
			id : 'pdno',
			width : 150
		},{
			emptyText : '单号',
			xtype : 'textfield',
			id : 'pddh',
			hidden : true,
			width : 150
		}, '-',year_combo, '-',month_combo,'-', {
			text : '查询',
			iconCls : 'page_findIcon',
			handler : function() {
				if(Ext.getCmp('pdno').getValue() == ''&& Ext.getCmp('year').getValue() == '' && Ext.getCmp('month').getValue() == ''){
					Ext.Msg.alert('提示', '请输入盘点单号！');
					return false;
				}else if(Ext.getCmp('year').getValue() != '' && Ext.getCmp('month').getValue() == '' && Ext.getCmp('pdno').getValue() == ''){
					Ext.Msg.alert('提示', '请选择月份！');
					return false;
				}else if(Ext.getCmp('year').getValue() == '' && Ext.getCmp('month').getValue() != '' && Ext.getCmp('pdno').getValue() == ''){
					Ext.Msg.alert('提示', '请选择年份！');
					return false;
				}else if(Ext.getCmp('pdno').getValue() != '' && Ext.getCmp('month').getValue() != '' && Ext.getCmp('year').getValue() == ''){
					Ext.Msg.alert('提示', '请选择年份！');
					return false;
				}else if(Ext.getCmp('year').getValue() != '' && Ext.getCmp('month').getValue() == '' && Ext.getCmp('pdno').getValue() != ''){
					Ext.Msg.alert('提示', '请选择月份！');
					return false;
				}else if(Ext.getCmp('year').getValue() != '' && Ext.getCmp('month').getValue() != ''){
					queryBalanceInfo1();
				}else{
					pdno = Ext.getCmp('pdno').getValue();
					queryBalanceInfo(Ext.getCmp('pdno').getValue());
				}
				
			}
		}, '-', {
			text : '导出Excel',
			tooltip : '点击导出',
			iconCls : 'page_excelIcon',
			handler : function() {
				var pddh = Ext.getCmp('pddh').getValue();
				exportExcel('reportSystem.ered?reqCode=exportTakesDiversityExcel&pdtime='+Ext.getCmp("year").getValue() + Ext.getCmp("month").getValue() + '&pdno=' + pddh);
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
		bbar : bbar,// 分页工具栏
		viewConfig : {
			forceFit : true
		},
		loadMask : {
			msg : '正在加载表格数据,请稍等...'
		}
	});
	
	// 表格实例
	var grid1 = new Ext.grid.GridPanel({
		region : 'center',
		border : false,
		height : 300,
		autoScroll : true,
		frame : true,
		store : store1,
		stripeRows : true,
		cm : cm1, // 列模型
		// sm : sm,// 多选框
		//tbar : tbar, // 工具栏
		//bbar : bbar,// 分页工具栏
		viewConfig : {
			forceFit : true
		},
		loadMask : {
			msg : '正在加载表格数据,请稍等...'
		}
	});
	
	// 小画笔点击事件
	grid1.on("cellclick", function(pGrid, rowIndex, columnIndex, e) {
				var store = pGrid.getStore();
				var record = store.getAt(rowIndex);
				var fieldName = pGrid.getColumnModel().getDataIndex(columnIndex);
				// columnIndex为小画笔所在列的索引,从0开始
				// 这里要非常注意!!!!!
				if (fieldName == 'edit' && columnIndex == 1) {
					var pdid = record.get("id");
					thirdWindow.hide();
					pdno = pdid;
					Ext.getCmp('pddh').setValue(pdid);
					queryBalanceInfo(pdid);
				}
		});


	// 布局
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [ grid ]
	});
	
	var thirdWindow = new Ext.Window({
		title : '<span class="commoncss">选择盘点单号</span>', // 窗口标题
		// layout : 'fit', // 设置窗口布局模式
		width : 400, // 窗口宽度
		iconCls : 'window_caise_listIcon', // 按钮图标
		height : 300, // 窗口高度
		closable : true, // 是否可关闭
		collapsible : true, // 是否可收缩
		maximizable : true, // 设置是否可以最大化
		border : false, // 边框线设置
		autoScroll : true,
		constrain : true, // 设置窗口是否可以溢出父容器
		pageY : 20, // 页面定位Y坐标
		pageX : document.body.clientWidth / 4 - 300 / 2, // 页面定位X坐标
		items : [grid1], 
		closeAction : 'hide'
	});
	
	
	
	
	// 查询表格数据
	function queryBalanceInfo(pdno) {
		store.load({
			params : {
				start : 0,
				limit : bbar.pageSize,
				pdno : pdno,
				pdtime : Ext.getCmp("year").getValue() + Ext.getCmp("month").getValue()
			},
			callback : function(records,options,success) {
				if (success == true) {
					if (records.length == 0)
						Ext.Msg.alert('提示', '没有数据');
				} else
					Ext.Msg.alert('提示', '出现错误');
			}
		});
	}
	
	// 查询表格数据
	function queryBalanceInfo1() {

		store1.load({
			params : {
				pdtime : Ext.getCmp("year").getValue() + Ext.getCmp("month").getValue()
			},
			callback : function(records,options,success) {
				if (success == true) {
					if (records.length == 0){
						Ext.Msg.alert('提示', '没有数据');
					}else{
						thirdWindow.show();
					}
				}
			}
		});
	}
	//生成一个图标列
	function iconColumnRender(value) {
		return "<a href='javascript:void(0);'><img src='" + webContext + "/resource/image/ext/edit1.png'/></a>";;
	}

})
