/**
 * 货品收货功能
 * 
 * @author FengZhou
 * @since 2012-06-15
 */
Ext.onReady(function() {
//	Ext.override(Ext.grid.CheckboxSelectionModel, {
//		handleMouseDown : function(g, rowIndex, e) {
//			if (e.button !== 0 || this.isLocked()) {
//				return;
//			}
//			var view = this.grid.getView();
//			if (e.shiftKey && !this.singleSelect && this.last !== false) {
//				var last = this.last;
//				this.selectRange(last, rowIndex, e.ctrlKey);
//				this.last = last; // reset the last
//				view.focusRow(rowIndex);
//			} else {
//				var isSelected = this.isSelected(rowIndex);
//				if (isSelected) {
//					this.deselectRow(rowIndex);
//				} else if (!isSelected || this.getCount() > 1) {
//					this.selectRow(rowIndex, true);
//					view.focusRow(rowIndex);
//				}
//			}
//		}
//	});
	
	
	Ext.data.Connection.prototype.timeout='300000';

	var lgortInfo = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : 'stockSystem.ered?reqCode=getLgort'
		}),
		reader : new Ext.data.JsonReader({}, [ {
			name : 'werks'
		}, {
			name : 'lgort'
		}, {
			name : 'lgobe'
		}, {
			name : 'lgortDetail'
		} ])
	});

	lgortInfo.on('beforeload', function() {
		this.baseParams = {
			'lgorts' : "0001,0002,0012,0013,0014,0015,0016,0017,0018"
		};
	});

	lgortInfo.load(); // 如果mode : 'local',时候才需要手动load();

	// 复选框
	var sm = new Ext.grid.CheckboxSelectionModel();

	// 定义自动当前页行号
	var rownum = new Ext.grid.RowNumberer({
		header : 'NO',
		width : 28
	});

	var diffStoreForSingleGood = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : 'stockSystem.ered?reqCode=getDiffInfoForSingleGood'
		}),
		reader : new Ext.data.JsonReader({}, [ {
			name : 'id'
		}, {
			name : 'description'
		}, {
			name : 'type'
		}, {
			name : 'diffDetail'
		} ])
	});

	var diffStoreForHead = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : 'stockSystem.ered?reqCode=getDiffInfoForHead'
		}),
		reader : new Ext.data.JsonReader({}, [ {
			name : 'id'
		}, {
			name : 'description'
		}, {
			name : 'type'
		}, {
			name : 'diffDetail'
		} ])
	});

	diffStoreForSingleGood.load();
	diffStoreForHead.load();

	// 定义列模型
	var cm = new Ext.grid.ColumnModel([ rownum, {
		header : '详细', // 列标题
		dataIndex : 'showdetail',
		width : 35,
		renderer : iconColumnRender2
	}, {
		header : '编号', // 列标题
		dataIndex : 'outid', // 数据索引:和Store模型对应
		sortable : true,// 是否可排序
		hidden : true,
		width : 150
	}, {
		header : '日期', // 列标题
		dataIndex : 'stockdate', // 数据索引:和Store模型对应
		sortable : true,// 是否可排序
		width : 120
	}, {
		header : '出库凭证', // 列标题
		dataIndex : 'i_mblnr',
		width : 100,
		editor : new Ext.form.TextField()
	}, {
		header : '凭证年度', // 列标题
		dataIndex : 'i_mjahr',
		hidden : true,
		width : 100
	}, {
		header : '数量',
		dataIndex : 'totalcount',
		sortable : true,
		width : 40
	}, {
		header : '总金额',
		dataIndex : 'total',
		sortable : true,
		width : 80,
		renderer : function(v) {
			return Number(v).toFixed(2);
		}
	}, {
		header : '总重量',
		dataIndex : 'totalweight',
		sortable : true,
		width : 50,
		renderer : function(v) {
			return Number(v).toFixed(2);
		}
	}, {
		header : '来自门店',
		dataIndex : 'outwerksstr',
		sortable : true,
		width : 130
	}, {
		header : '状态',
		dataIndex : 'statusStr',
		sortable : true,
		width : 60
	}, {
		header : '邮寄单号',
		dataIndex : 'postno',
		sortable : true,
		width : 120
	}, {
		header : '邮寄人',
		dataIndex : 'mailman',
		sortable : true,
		width : 120
	}, {
		header : '邮寄时间',
		dataIndex : 'posttime',
		sortable : true,
		width : 80
	}, {
		header : '整单差异',
		dataIndex : 'headreason',
		sortable : true,
		width : 120,
		editor : new Ext.ux.form.LovCombo({
			emptyText : '请选择...',
			store : diffStoreForHead,
			triggerAction : 'all',
			valueField : 'diffDetail',
			displayField : 'diffDetail'
		}),
		renderer : function(v) {
			if (v != null) {
				var items = v.split(',');
				var value = "";
				for ( var i = 0; i < items.length; i++) {
					if (i == items.length - 1) {
						value = value + items[i]
					} else
						value = value + items[i] + ",<br/>";
				}
				return value;
			} else {
				return '';
			}
		}
	}, {
		header : '整单差异说明',
		dataIndex : 'headexplain',
		sortable : true,
		width : 120,
		editor : new Ext.form.TextField()
	}, {
		header : '备注',
		dataIndex : 'remark',
		sortable : true,
		width : 120
	} ]);

	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
			url : 'stockSystem.ered?reqCode=getInStockHeader'
		}),
		// 数据读取器
		reader : new Ext.data.JsonReader({
			totalProperty : 'TOTALCOUNT', // 记录总数
			root : 'ROOT' // Json中的列表数据根节点
		}, [ {
			name : 'outid'
		}, {
			name : 'goodscount'
		}, {
			name : 'total'
		}, {
			name : 'weight'
		}, {
			name : 'totalcount'
		}, {
			name : 'totalweight'
		}, {
			name : 'outwerks'
		}, {
			name : 'inwerks'
		}, {
			name : 'outwerksstr'
		}, {
			name : 'inwerksstr'
		}, {
			name : 'stockdate'
		}, {
			name : 'status'
		}, {
			name : 'statusStr'
		}, {
			name : 'postno'
		}, {
			name : 'mailman'
		}, {
			name : 'i_mblnr'
		}, {
			name : 'i_mjahr'
		}, {
			name : 'posttime'
		}, {
			name : 'recievetime'
		}, {
			name : 'remark'
		} ])
	});

	// 验货差异类型
	var diffInfoForSingleGood = new Ext.ux.form.LovCombo({
		// id:'diffinfoid',
		// name:'diffinfoname',
		anchor : '90%',
		// hideOnSelect:true,
		maxHeight : 100,
		// editable:false,
		emptyText : '请选择...',
		store : diffStoreForSingleGood,
		triggerAction : 'all',
		valueField : 'diffDetail',
		displayField : 'diffDetail',
		mode : 'local'
	});
	// 验货差异类型
	var diffInfoForHead = new Ext.ux.form.LovCombo({
		id : 'diffInfoForHead',
		// name:'diffinfoname',
		anchor : '90%',
		// hideOnSelect:true,
		maxHeight : 100,
		fieldLabel : '整单差异',
		// editable:false,
		emptyText : '请选择...',
		store : diffStoreForHead,
		triggerAction : 'all',
		valueField : 'diffDetail',
		displayField : 'diffDetail',
		mode : 'local'
	});

	// 收货清单
	var cm2 = new Ext.grid.ColumnModel([ rownum,
	 //sm,
	{
		header : '编号',
		dataIndex : 'outid',
		sortable : true,
		hidden : true,
		width : 120
	}, {
		header : '批号', // 列标题
		dataIndex : 'charg',
		editor : new Ext.form.TextField(),
		width : 100
	}, {
		header : '物料号', // 列标题
		dataIndex : 'matnr',
		editor : new Ext.form.TextField(),
		width : 100
	}, {
		header : '品类', // 列标题
		dataIndex : 'matkl',
		hidden : true,
		width : 100
	}, {
		header : '数量',
		dataIndex : 'count',// 'zhlhxt',
		sortable : true,
		width : 40
	}, {
		header : '货品重量',
		dataIndex : 'hpzl',// 'zhlhxt',
		sortable : true,
		width : 80
	}, {
		header : '出库库位',
		dataIndex : 'outstockStr',// 'ztjtf',
		sortable : true,
		width : 60
	}, {
		header : '项目编号', // 列标题
		dataIndex : 'ebelp', // 数据索引:和Store模型对应
		sortable : true,// 是否可排序
		width : 60
	}, {
		header : '商品名称', // 列标题
		dataIndex : 'maktx',
		width : 110
	}, {
		header : '标签价',
		dataIndex : 'bqj',
		sortable : true,
		width : 50
	}, {
		header : '金料',
		dataIndex : 'goldTypeStr',// 'zjlzl1',
		sortable : true,
		width : 100
	}, {
		header : '金重',
		dataIndex : 'zclzl',// 'zjlzl1',
		sortable : true,
		width : 60
	}, {
		header : '石料',
		dataIndex : 'toneTypeStr',// 'zjlzl1',
		sortable : true,
		width : 60
	}, {
		header : '主石重',
		dataIndex : 'zzlnn',// 'zjlzl1',
		sortable : true,
		width : 60
	}, {
		header : '石料净度',
		dataIndex : 'toneNeatNessStr',// 'zjlzl1',
		sortable : true,
		width : 60
	}, {
		header : '颜色',
		dataIndex : 'toneColorStr',// 'ztjcd',
		sortable : true,
		width : 80
	}, {
		header : '货品证书',
		dataIndex : 'goodzs',// 'ztjcd',
		sortable : true,
		width : 80
	}, {
		header : '裸石证书',
		dataIndex : 'zszsb',// 'ztjcd',
		sortable : true,
		width : 80
	}, {
		header : '图片',
		dataIndex : 'zmatnrt',// 'ztjcd',
		width : 80,
		renderer : function(v) {
			// return "<a href='http://www.baidu.com?word="+ v +"'
			// target='_blank' >"+v+"</a>"
			return "<img src='../../../sappic/" + v + "' width='60px' height='60px' " + "onError=\"this.src='./images/sample1.gif'\"/>"
		}

	}, {
		header : '库位',
		dataIndex : 'itemLgort',
		width : 100,
		editor : new Ext.form.ComboBox({
			triggerAction : 'all',
			store : lgortInfo,
			displayField : 'lgortDetail',
			valueField : 'lgortDetail',
			mode : 'local',
			width : '80'
		})
	}, {
		header : '验货差异',
		sortable : true,
		dataIndex : 'reason',
		width : 120,
		editor : diffInfoForSingleGood,
		renderer : function(v) {
			if (v != null) {
				var items = v.split(',');
				var value = "";
				for ( var i = 0; i < items.length; i++) {
					if (i == items.length - 1) {
						value = value + items[i]
					} else
						value = value + items[i] + ",<br/>";
				}
				return value;
			} else {
				return '';
			}
		}
	}, {
		header : '说明',
		dataIndex : 'explain',
		sortable : true,
		width : 120,
		editor : new Ext.form.TextField()
	}, {
		header : '处理',
		dataIndex : 'manage',
		sortable : true,
		width : 120,
		hidden : true,
		editor : new Ext.form.TextField()
	} ]);

	var comStore1 = new Ext.data.Store({});

	var store2 = new Ext.data.Store({
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
			url : 'stockSystem.ered?reqCode=getInStockDetail',
			method : 'GET'
		}),
		// 数据读取器
		reader : new Ext.data.JsonReader({
			root : 'ROOT' // Json中的列表数据根节点
		}, [ {
			name : 'outid'
		}, {
			name : 'charg'
		}, {
			name : 'ebelp'
		}, {
			name : 'goodscount'
		}, {
			name : 'count'
		}, {
			name : 'outstock'
		}, {
			name : 'instock'// zhlhxt
		}, {
			name : 'inlgortStr'// zhlhxt
		}, {
			name : 'outstockStr'// zhlhxt
		}, {
			name : 'goldTypeStr'
		}, {
			name : 'toneTypeStr'
		}, {
			name : 'toneNeatNessStr'
		}, {
			name : 'toneColorStr'
		}, {
			name : 'zhlhxt'// zhlhxt
		}, {
			name : 'zclzl'
		}, {
			name : 'goodzs'
		}, {
			name : 'zszsb'
		}, {
			name : 'maktx'
		}, {
			name : 'matkl'
		}, {
			name : 'bqj'
		}, {
			name : 'kbetr'
		}, {
			name : 'hpzl'
		}, {
			name : 'zzlnn'
		}, {
			name : 'ztjcd'
		}, {
			name : 'matnr'
		}, {
			name : 'reason'
		}, {
			name : 'reasonStr'
		}, {
			name : 'explain1'
		}, {
			name : 'manage'
		}, {
			name : 'manageresult'
		}, {
			name : 'zmatnrt'
		}, {
			name : 'zmatnrt'
		}, {
			name : 'ifneedprintlabel'
		} ])
	});

	// 翻页排序时带上查询条件
	store.on('beforeload', function() {
		this.baseParams = {
			status : '2'
		};
	});
	// 每页显示条数下拉选择框
	var pagesize_combo = new Ext.form.ComboBox({
		name : 'pagesize',
		triggerAction : 'all',
		mode : 'local',
		store : new Ext.data.ArrayStore({
			fields : [ 'value', 'text' ],
			data : [ [ 10, '10条/页' ], [ 20, '20条/页' ], [ 50, '50条/页' ], [ 100, '100条/页' ], [ 250, '250条/页' ], [ 500, '500条/页' ] ]
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
		queryCatalogItem();
	});

	// 分页工具栏
	var bbar = new Ext.PagingToolbar({
		pageSize : number,
		store : store,
		displayInfo : true,
		displayMsg : '显示{0}条到{1}条,共{2}条',
		plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
		emptyMsg : "没有符合条件的记录",
		items : [ '-', '&nbsp;&nbsp;', pagesize_combo, '-', '&nbsp;&nbsp;', {
			xtype : 'label',
			text : '商品总数量：'
		}, '-', {
			xtype : 'label',
			id : 'count'
		}, '&nbsp;&nbsp;', {
			xtype : 'label',
			text : '商品总重量：'
		}, '-', {
			xtype : 'label',
			id : 'totalweight1'
		}, '&nbsp;&nbsp;', {
			xtype : 'label',
			text : '商品总金额：'
		}, '-', {
			xtype : 'label',
			id : 'total'
		} ]
	});

	// 表格工具栏
	var tbar = new Ext.Toolbar({
		items : [ {
			text : '刷新',
			iconCls : 'page_refreshIcon',
			handler : function() {
				store.reload();
			}
		}
//		, '-', {
//			text : '查询条件',
//			iconCls : 'arrow_switchIcon',
//			handler : function() {
//				firstWindow.show();
//			}
//		}
		, '-', {
			text : '提交整单差异',
			iconCls : 'acceptIcon',
			handler : function() {
				submitHeadReason();
			}
		} ]
	});

	// 表格下工具栏
	var bbar2 = new Ext.Toolbar({
		items : [ {
			xtype : 'label',
			text : '总数量:'
		}, '&nbsp;', {
			xtype : 'label',
			id : 'menge'
		}, '-', {
			xtype : 'label',
			text : '总重量:'
		}, '&nbsp;', {
			xtype : 'label',
			id : 'weight'
		}, '-', '&nbsp;&nbsp;', {
			xtype : 'label',
			text : '总金额:'
		}, '&nbsp;', {
			xtype : 'label',
			id : 'kbetr'
		} ]
	});

	// 表格右键菜单
	var contextmenu = new Ext.menu.Menu({
		id : 'theContextMenu',
		items : [ {
			text : '查看详情',
			iconCls : 'previewIcon',
			handler : function() {
				// 获取当前选择行对象
				var record = grid.getSelectionModel().getSelected();
				var assistant_name = record.get('assistant_name');
				Ext.MessageBox.alert('提示', assistant_name);
			}
		}, {
			text : '导出列表',
			iconCls : 'page_excelIcon',
			handler : function() {
				// 获取当前选择行对象
				var record = grid.getSelectionModel().getSelected();
				var assistant_name = record.get('assistant_name');
				Ext.MessageBox.alert('提示', assistant_name);
			}
		} ]
	});

	// 表格实例
	var grid = new Ext.grid.EditorGridPanel({
		// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
		height : 500,
		frame : true,
		autoScroll : true,
		region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		store : store, // 数据存储
		stripeRows : true, // 斑马线
		cm : cm, // 列模型
		tbar : tbar, // 表格工具栏
		bbar : bbar,// 分页工具栏
		viewConfig : {
		// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
		// forceFit : true
		},
		loadMask : {
			msg : '正在加载表格数据,请稍等...'
		}
	});

	// 表格实例
	var grid2 = new Ext.grid.EditorGridPanel({
		// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
		height : 300,
		width : 900,
		frame : true,
		autoScroll : true,
		clicksToEdit : 2,
		region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		store : store2, // 数据存储
		stripeRows : true, // 斑马线
		cm : cm2, // 列模型
		 //sm : sm, // 复选框
		bbar : bbar2,// 下工具栏
		viewConfig : {
		// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
		// forceFit : true
		},
		loadMask : {
			msg : '正在加载表格数据,请稍等...'
		}
	});

	// 是否默认选中第一行数据
	bbar.on("change", function() {
		// grid.getSelectionModel().selectFirstRow();

	});

	// 页面初始自动查询数据
	// store.load({params : {start : 0,limit : bbar.pageSize}});

	// 小画笔点击事件
	grid.on("cellclick", function(pGrid, rowIndex, columnIndex, e) {
		var store = pGrid.getStore();
		var record = store.getAt(rowIndex);
		var fieldName = pGrid.getColumnModel().getDataIndex(columnIndex);
		// columnIndex为小画笔所在列的索引,索引从0开始
		// 这里要非常注意!!!!!
		// if (fieldName == 'edit' && columnIndex == 1) {
		// // var assistant_name =
		// // record.get("assistant_name");
		// // 到此你就可以继续做其他任何事情了
		// // Ext.MessageBox.alert('提示', assistant_name);
		//
		// secondWindow.show();
		// secondForm.form.loadRecord(record);
		// }

		if (fieldName == 'showdetail' && columnIndex == 1) {
			// var assistant_name =
			// record.get("assistant_name");
			// 到此你就可以继续做其他任何事情了
			// Ext.MessageBox.alert('提示', assistant_name);
			var outid = record.get('outid');

			var i_mblnr = record.get('i_mblnr');
			var i_mjahr = record.get('i_mjahr');
			var outid = record.get('outid');
			var outwerks = record.get('outwerks');

			Ext.getCmp('i_mblnr').setValue(i_mblnr);
			Ext.getCmp('i_mjahr').setValue(i_mjahr);
			Ext.getCmp('outid').setValue(outid);
			Ext.getCmp('outwerks').setValue(outwerks);

			// alert(record.get('kunnr'));
			// lgortInfoCombo.clearValue();

			lgortInfo.reload();
			thirdWindow.show();

			Ext.getCmp("searchText").focus(true, true);
			store2.load({
				params : {
					outid : outid
				},
				callback : function(records, options, success) {
					getCount();
					if (success == true) {
						if (records.length == 0) {
							Ext.Msg.alert('提示', '没有记录！！', function(e) {
								thirdWindow.hide();
							});
						}

					} else {
						Ext.Msg.alert('提示', '抓取信息出现错误');
					}
				}
			});

		}

	});

	// // 监听单元格双击事件
	// grid.on("celldblclick", function(pGrid, rowIndex, columnIndex, e)
	// {
	// var record = pGrid.getStore().getAt(rowIndex);
	// var fieldName = pGrid.getColumnModel()
	// .getDataIndex(columnIndex);
	// var cellData = record.get(fieldName);
	// // Ext.MessageBox.alert('提示', cellData);
	// });
	//
	// // 监听行双击事件
	// grid.on('rowdblclick', function(pGrid, rowIndex, event) {
	// // 获取行数据集
	// var record = pGrid.getStore().getAt(rowIndex);
	// // 获取单元格数据集
	// var data = record.get("assistant_name");
	// Ext.MessageBox.alert('提示', "双击行的索引为:" + rowIndex);
	// });
	//
	// // 给表格绑定右键菜单
	// grid.on("rowcontextmenu", function(grid, rowIndex, e) {
	// e.preventDefault(); // 拦截默认右键事件
	// grid.getSelectionModel().selectRow(rowIndex); // 选中当前行
	// contextmenu.showAt(e.getXY());
	// });

	// 布局模型
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [ grid ]
	});

	// 查询表格数据
	function queryCatalogItem() {
		store.load({
			params : {
				start : 0,
				limit : bbar.pageSize
			},
			callback : function(records, options, success) {
				getTotal();
				if (success == true) {
					if (records.length == 0)
						Ext.Msg.alert('提示', '没有数据');
				} else
					Ext.Msg.alert('提示', '出现错误');
			}
		});
	}

	// 生成一个图标列
	function iconColumnRender(value) {
		return "<a href='javascript:void(0);'><img src='" + webContext + "/resource/image/ext/edit1.png'/></a>";
		;
	}
	// 生成一个图标列
	function iconColumnRender2(value) {
		return "<a href='javascript:void(0);'><img src='" + webContext + "/resource/image/ext/application_view_list.png'/></a>";
		;
	}

	queryCatalogItem();

	// store.load();

	// var lgortInfoCombo = new Ext.form.ComboBox({
	// hiddenName : 'position',
	// id : 'position',
	// fieldLabel : '请选择库位',
	// emptyText : '请选择...',
	// triggerAction : 'all',
	// store : lgortInfo,
	// displayField : 'lgobe',
	// valueField : 'lgort',
	// loadingText : '正在加载数据...',
	// mode : 'local', //
	// 数据会自动读取,如果设置为local又调用了store.load()则会读取2次；也可以将其设置为local，然后通过store.load()方法来读取
	// forceSelection : true,
	// typeAhead : true,
	// resizable : true,
	// editable : false,
	// // value : '530101',
	// anchor : '100%'
	//
	// // hiddenName : 'position',
	// // id : 'position',
	// // fieldLabel : '请选择库位',
	// // emptyText : '请选择库位',
	// // // triggerAction : 'all',
	// // store : lgortInfo,
	// // displayField : 'lgobe',
	// // valueField : 'lgort',
	// // loadingText : '正在加载数据...',
	// // mode : 'local', //
	// //
	// 数据会自动读取,如果设置为local又调用了store.load()则会读取2次；也可以将其设置为local，然后通过store.load()方法来读取
	// // //forceSelection : true,
	// // //typeAhead : true,
	// // //resizable : true,
	// // editable : false,
	// // anchor : '80%'
	// });

	var submitForm = new Ext.form.FormPanel({
		id : 'submitForm',
		name : 'submitForm',
		labelWidth : 90, // 标签宽度
		frame : true, // 是否渲染表单面板背景色
		// defaultType : 'textfield', // 表单元素默认类型
		labelAlign : 'right', // 标签对齐方式
		bodyStyle : 'padding:5 5 5 5', // 表单元素和表单面板的边距
		items : [ {
			layout : 'column',
			border : false,
			items : [ {
				columnWidth : .3,
				layout : 'form',
				border : false,
				anchor : '80%',
				items : [ {
					xtype : 'combo',
					hiddenName : 'position1',
					id : 'position',
					fieldLabel : '请选择库位',
					emptyText : '请选择...',
					loadingText : '正在加载数据...',
					triggerAction : 'all',
					typeAhead : true,
					store : lgortInfo,
					displayField : 'lgobe',
					valueField : 'lgort',
					lazyRender : true,
					mode : 'local',
					hidden : true,
					editable : false,
					value : '0001',
					anchor : '70%'

				} ]
			}, {
				columnWidth : .3,
				layout : 'form',
				border : false,
				hidden : true,
				items : [ diffInfoForHead ]

			}, {
				columnWidth : .1,
				layout : 'form',
				border : false,
				items : [ {
					xtype : 'button',
					name : 'submit',
					text : '入库',
					anchor : '80%',
					handler : getCheckboxValues
				} ]

			}, {
				columnWidth : .1,
				layout : 'form',
				border : false,
				hidden : true,
				items : [ {
					xtype : 'button',
					name : 'submit',
					text : '打回',
					anchor : '80%',
					handler : cancleStock
				} ]

			} ]
		} ]
	});

	var searchText = new Ext.form.TextField({
		id : 'searchText',
		name : 'searchText',
		fieldLabel : '输入批次号查找',
		listeners : {
			specialkey : function(field, e) {
				if (e.getKey() == Ext.EventObject.ENTER) {
					search();
				}
			}
		}
	});

	var searchForm = new Ext.form.FormPanel({
		id : 'searchForm',
		name : 'searchForm',
		labelWidth : 110, // 标签宽度
		frame : true, // 是否渲染表单面板背景色
		// defaultType : 'textfield', // 表单元素默认类型
		labelAlign : 'right', // 标签对齐方式
		bodyStyle : 'padding:5 5 5 5', // 表单元素和表单面板的边距
		items : [ {
			layout : 'column',
			border : false,
			items : [ {
				columnWidth : .3,
				layout : 'form',
				border : false,
				anchor : '80%',
				items : [ searchText ]
			}, {
				columnWidth : .1,
				layout : 'form',
				border : false,
				items : [ {
					xtype : 'button',
					name : 'submit',
					text : '查找',
					anchor : '80%',
					handler : search
				} ]

			}, {
				columnWidth : .3,
				layout : 'form',
				border : false,
				items : [ {
					xtype : 'textfield',
					name : 'i_mblnr',
					id : 'i_mblnr',
					fieldLabel : '物料凭证号',
					readOnly : true,
					anchor : '80%'
				}, {
					xtype : 'textfield',
					name : 'i_mjahr',
					id : 'i_mjahr',
					fieldLabel : '凭证年度',
					readOnly : true,
					anchor : '60%'
				} ]

			}, {
				columnWidth : .3,
				layout : 'form',
				border : false,
				items : [ {
					xtype : 'textfield',
					// name : 'outid',
					id : 'outid',
					fieldLabel : '出库编号',
					readOnly : true,
					anchor : '100%'
				}, {
					xtype : 'textfield',
					// name : 'outid',
					id : 'outwerks',
					fieldLabel : '出库门店',
					readOnly : true,
					hidden : true,
					anchor : '90%'
				} ]

			} ]
		} ]
	});

	function search() {
		var searchText = Ext.get("searchText").getValue();
		if(searchText == ''){
			return;
		}
		var view = grid2.getView();
		for ( var i = 0; i < store2.getCount(); i++) {
			var charg = store2.getAt(i).get('charg');
			if (charg == searchText) {
				// if (grid2.getSelectionModel().isSelected(i)) {
				// view.focusRow(i);
				// Ext.Msg.alert('提示', '该条已经被选中！！', function() {
				// Ext.getCmp("searchText").focus(true, true);
				// });
				// return;
				// }

				 //grid2.getSelectionModel().selectRow(i, true);
					view.focusRow(i);
					view.getRow(i).style.backgroundColor='lightgreen';
				Ext.Msg.alert("提示", "<b style='color:green;font-size:18px;'>该批次在列表中！</b>", function(e) {
					//Ext.getCmp("searchText").setValue('');
					Ext.getCmp("searchText").focus(true, true);
				});
				return;
			}
		}
		Ext.Msg.alert('提示', "<b style='color:red;font-size:18px;'>批次不存在列表中！</b>", function() {
			Ext.getCmp("searchText").focus(true, true);
		});

	}

	var oppanel = new Ext.Panel({
		layout : 'form',
		items : [ searchForm, grid2, submitForm ]
	// ,
	// tbar :[submitForm],
	// bbar :[submitForm]
	});

	// 入库操作
	var thirdWindow = new Ext.Window({
		id : 'opwindow',
		title : '<span class="commoncss">调入清单</span>', // 窗口标题
		// layout : 'fit', // 设置窗口布局模式
		width : 900, // 窗口宽度
		iconCls : 'window_caise_listIcon', // 按钮图标
		height : 550, // 窗口高度
		closable : true, // 是否可关闭
		collapsible : true, // 是否可收缩
		maximizable : true, // 设置是否可以最大化
		border : false, // 边框线设置
		autoScroll : true,
		constrain : true, // 设置窗口是否可以溢出父容器
		pageY : 20, // 页面定位Y坐标
		pageX : document.body.clientWidth / 4 - 300 / 2, // 页面定位X坐标
		items : [ oppanel ], // 嵌入的表单面板
		closeAction : 'hide'
	});

	// 获取选择行
	function getCheckboxValues() {

		var chargs = "";
		var ebelp = "";
		var reason = "";
		var explain = "";
		var manage = "";
		var status = 4;

		var chargheader = "{";
		var i_mblnr = Ext.getCmp('i_mblnr').getValue();
		chargheader = chargheader + "\"i_mblnr\":\"" + i_mblnr + "\",";
		var i_mjahr = Ext.getCmp('i_mjahr').getValue();
		chargheader = chargheader + "\"i_mjahr\":\"" + i_mjahr + "\",";
		var outid = Ext.getCmp('outid').getValue();
		chargheader = chargheader + "\"outid\":\"" + outid + "\",";
		var lgort = Ext.getCmp("position").getValue();
		chargheader = chargheader + "\"lgort\":\"" + lgort + "\",";
		// var reason = diffInfoForHead.getValue();
		// chargheader = chargheader + "\"reason\":\"" + reason + "\",";
		var outwerks = Ext.getCmp('outwerks').getValue();
		chargheader = chargheader + "\"outwerks\":\"" + outwerks + "\",";

		// 返回一个行集合JS数组
		var rows = grid2.store.data.items;
		if (Ext.isEmpty(rows)) {
			Ext.MessageBox.alert('提示', '您没有选中任何数据!');
			return;
		}
		// alert(rows.length);
		var chargitem = "";
		var flag = true;
		var ifneedupdateprice = false;
		
		for ( var i = 0; i < rows.length; i++) {
			chargitem = chargitem + "\"" + i + "\":";
			chargitem = chargitem + "{\"charg\":\"" + rows[i].get("charg") + "\",";
			chargitem = chargitem + "\"matnr\":\"" + rows[i].get("matnr") + "\",";
			chargitem = chargitem + "\"outid\":\"" + outid + "\",";
			chargitem = chargitem + "\"ebelp\":\"" + rows[i].get("ebelp") + "\",";
			chargitem = chargitem + "\"outstock\":\"" + rows[i].get("outstock") + "\",";
			chargitem = chargitem + "\"meins\":\"" + rows[i].get("meins") + "\",";
			chargitem = chargitem + "\"goodscount\":\"" + rows[i].get("goodscount") + "\",";
			chargitem = chargitem + "\"kbetr\":\"" + rows[i].get("bqj") + "\",";
			//alert(rows[i].get("matkl"));	
			
			
			if(rows[i].get("ifneedprintlabel") == '1、是'){
				ifneedupdateprice = true;
			}
			
			
			if (rows[i].get("reason") != null) {
				status = 6;
			}
			var reason = "";
			if (rows[i].get("reason") != null) {
				var reasons = rows[i].get("reason").split(",");
				// alert(reasons.length);
				for ( var j = 0; j < reasons.length; j++) {
					var myreason = reasons[j];
					myreason = myreason.substring(0, myreason.indexOf("、"));
					if (j == reasons.length - 1)
						reason = reason + myreason;
					else
						reason = reason + myreason + ",";
				}
			}
			// alert(reason);

			chargitem = chargitem + "\"reason\":\"" + (rows[i].get("reason") == null ? "" : reason) + "\",";
			chargitem = chargitem + "\"explain\":\"" + (rows[i].get("explain") == null ? "" : rows[i].get("explain")) + "\",";
			// chargitem = chargitem + "\"manage\":\"" + rows[i].get('manage') +
			// "\",";
			// alert(rows[i].get('itemLgort'));
			if (rows[i].get('itemLgort') == null) {
				flag = false;
				
				chargitem = chargitem + "\"lgort\":\"" + getLgoryByMaktl(rows[i].get("matkl")) + "\"}";
			} else {
				chargitem = chargitem + "\"lgort\":\"" + rows[i].get('itemLgort').substring(0, rows[i].get('itemLgort').indexOf("、")) + "\"}";
			}

			chargitem =  chargitem + ",";

			// chargs += rows[i].get("charg") + ',';
			// ebelp += rows[i].get("ebelp") + ',';
			// reason += rows[i].get('reason') + '&';
			// explain += rows[i].get('explain') + '&';
			// manage += rows[i].get('manage') + '&';
		}

		chargitem = "{" + chargitem.substring(0, chargitem.length - 1) + "}";

		chargheader = chargheader + "\"status\":\"" + status + "\"}";
		// chargheader = chargheader.substring(0, chargheader.length - 1) + "}"
		// alert(chargheader);

//		 alert(chargitem);
		if (flag == false && lgort == "") {
			Ext.Msg.alert("提示", "请选择正确的库位！！");
			return;
		}
		// chargs = chargs.substring(0, chargs.length - 1);

		Ext.Msg.confirm("提示", "确定入库吗？", function(btn, text) {
			if (btn == "yes") {
				var myMask = new Ext.LoadMask('opwindow'
				, {
					msg : '正在提交中，请稍后...',
					removeMask : true
				// 完成后移除
				});
				myMask.show();
				var myMsg = '' ;
				Ext.Ajax.request({
					url : 'stockSystem.ered?reqCode=inStockForWerks',
					method : 'post',
					params : {
						chargheader : chargheader,
						chargitem : chargitem
					},
					timeout : 12000000,
					success : function(data) {
						myMask.hide();
						var retData = Ext.decode(data.responseText);
						if (retData.success != null) {
							if(ifneedupdateprice){
								myMask.hide();
								Ext.Msg.confirm("成功", "成功，" + retData.success+"<br/><b style='color:green;font-size:16px;'>需要更换标签，新标签是否收到？</b>", function(e){
									if(e == 'yes'){
										//alert("开始更新！");
										myMask.show();
										Ext.Ajax.request({
											url : 'stockSystem.ered?reqCode=updatePriceStatus',
											method : 'post',
											params : {
												chargitem : chargitem
											},timeout : 12000000,
											success : function(data) {
												myMask.hide();
												var mydata = Ext.decode(data.responseText);
												if (mydata.success != null) {
													Ext.Msg.alert("提示成功", mydata.success, function() {
														thirdWindow.hide();
														queryCatalogItem();
													});
												} else if (mydata.error != null) {
													Ext.Msg.alert("提示失败", mydata.error, function() {
	
													});
												} else {
													Ext.Msg.alert("提示", "出现未知错误！", function() {
													});
												}
											}
										});
									
									}else{
										thirdWindow.hide();
										store.reload();
									}
								});
							}else{
								myMsg += retData.success + "<br />";
								Ext.Ajax.request({
										url : 'stockSystem.ered?reqCode=updatePriceStatus',
										method : 'post',
										params : {
											chargitem : chargitem
										},timeout : 12000000,
										success : function(data) {
											myMask.hide();
											var mydata = Ext.decode(data.responseText);
											if (mydata.success != null) {
												myMsg += mydata.success + "<br />";
												Ext.Msg.alert("提示成功", myMsg, function() {
													thirdWindow.hide();
													queryCatalogItem();
												});
											} else if (mydata.error != null) {
												myMsg += "更新价格错误："+mydata.error + "<br />";
												Ext.Msg.alert("提示失败", myMsg, function() {
												});
											} else {
												Ext.Msg.alert("提示", "出现未知错误！", function() {
												});
											}
										}
									});
							}
							//Ext.Msg.alert("成功", "成功，" + retData.success);
						} else if (retData.error != null) {
							Ext.Msg.alert("错误", "出现错误，" + retData.error);
						} else {
							Ext.Msg.alert("成功", "操作成功");
						}
					}
				});
			}
//			else{
//				
//				Ext.Ajax.request({
//					url : 'stockSystem.ered?reqCode=updatePriceStatus',
//					method : 'post',
//					params : {
//						chargitem : chargitem
//					},
//					success : function(data) {
//						var mydata = Ext.decode(data.responseText);
//						if (mydata.success != null) {
//							Ext.Msg.alert("提示成功", mydata.success, function() {
//								thirdWindow.hide();
//								queryCatalogItem();
//							});
//						} else if (mydata.error != null) {
//							Ext.Msg.alert("提示失败", mydata.error, function() {
//
//							});
//						} else {
//							Ext.Msg.alert("提示", "出现未知错误！", function() {
//							});
//						}
//					}
//				});
//				
//				
//				
//			}
		});
	}

	function cancleStock() {
		var chargs = "";
		var ebeln = "";

		// 返回一个行集合JS数组
		var rows = grid2.getSelectionModel().getSelections();
		if (Ext.isEmpty(rows)) {
			Ext.MessageBox.alert('提示', '您没有选中任何数据!');
			return;
		}
		// alert(rows.length);

		for ( var i = 0; i < rows.length; i++) {
			chargs += rows[i].get("BWTAR") + ' ,';
			ebeln = rows[i].get("EBELN");
		}

		var logrt = Ext.getCmp("position").getValue();
		if (logrt == "") {
			Ext.Msg.alert("提示", "请选择正确的库位！！");
			return;
		}
		chargs = chargs.substring(0, chargs.length - 1);
		// 将JS数组中的行级主键，生成以,分隔的字符串
		var positionIds = jsArray2JsString(rows, 'BWTAR');
		Ext.MessageBox.alert('提示', positionIds);
		// 获得选中续数据后则可以传入后台继处理

		Ext.Msg.confirm("提示", "确定打回吗？", function(btn, text) {
			// if (btn == "yes") {
			// Ext.Ajax.request({
			// url:'stockSystem.ered?reqCode=inStock',
			// method : 'post',
			// params : {
			// logrt : logrt,
			// chargs : chargs,
			// ebeln : ebeln
			// },
			// success : function(){
			// Ext.Msg.alert("提示","收货成功！！");
			// thirdWindow.hide();
			// }
			// });
			// }

		});
	}

	function submitHeadReason() {
		var rows = grid.store.data.items;
		var chargitem = "";
		var count = 0;
		for ( var i = 0; i < rows.length; i++) {
			var headreason = rows[i].get("headreason");
			var headexplain = rows[i].get("headexplain") == null ? "" : rows[i].get("headexplain");
			// alert(headreason);
			// alert(myreason);
			if (headreason != null && headreason != '') {
				var myreason = "";
				var myreasons = headreason.split(",");
				for ( var j = 0; j < myreasons.length; j++) {
					// alert(myreasons[j]);
					myreason = myreason + myreasons[j].substring(0, myreasons[j].indexOf("、"));
					if (j != myreasons.length - 1) {
						myreason = myreason + ",";
					}

				}
				chargitem = chargitem + "\"" + count + "\":";
				chargitem = chargitem + "{\"outid\":\"" + rows[i].get("outid") + "\",";
				chargitem = chargitem + "\"i_mblnr\":\"" + rows[i].get("i_mblnr") + "\",";
				chargitem = chargitem + "\"i_mjahr\":\"" + rows[i].get("i_mjahr") + "\",";
				chargitem = chargitem + "\"inwerks\":\"" + rows[i].get("inwerks") + "\",";
				chargitem = chargitem + "\"outwerks\":\"" + rows[i].get("outwerks") + "\",";
				chargitem = chargitem + "\"needvalified\":\"" + 3 + "\",";

				chargitem = chargitem + "\"headReason\":\"" + myreason + "\",";
				chargitem = chargitem + "\"headexplain\":\"" + headexplain + "\"}";
				chargitem = chargitem + ",";
				count++;
			}

		}

		if (chargitem == '') {
			Ext.Msg.alert("提示", "您还没有处理方法，没有提交数据！");
			return;
		}

		chargitem = "{" + chargitem.substring(0, chargitem.length - 1) + "}";

		// alert(chargitem);

		Ext.Msg.confirm("提示", "确定提交吗？", function(btn, text) {
			if (btn == "yes") {
				var myMask = new Ext.LoadMask(Ext.getBody(), {
					msg : '正在提交中，请稍后...',
					removeMask : true
				// 完成后移除
				});
				myMask.show();
				Ext.Ajax.request({
					url : 'stockSystem.ered?reqCode=submitInstockHeadReason',
					method : 'post',
					params : {
						chargitem : chargitem
					},timeout : 12000000,
					success : function(data) {
						myMask.hide();
						var retData = Ext.decode(data.responseText);
						if (retData.success != null) {
							Ext.Msg.alert("提示成功", retData.success, function(e) {
								queryCatalogItem();
							});

						} else {
							Ext.Msg.alert("提示错误", retData.error);
						}
					}
				});
			}

		});
	}

	function getTotal() {

		var rows1 = grid.store.data.items;
		var count = 0;
		var total = 0;
		var totalweight1 = 0;
		for ( var i = 0; i < rows1.length; i++) {
			count = count + Number(rows1[i].get("totalcount"));
			total = total + Number(rows1[i].get("total"));
			totalweight1 = totalweight1 + Number(rows1[i].get("totalweight"));
		}
		Ext.getCmp("count").setText(count);
		Ext.getCmp("total").setText(total.toFixed(2));
		Ext.getCmp("totalweight1").setText(totalweight1.toFixed(3));

	}

	function getCount() {
		var rows1 = grid2.store.data.items;
		var count = 0;
		var total = 0;
		var weight = 0;
		for ( var i = 0; i < rows1.length; i++) {
			count = count + Number(rows1[i].get("count"));
			total = total + Number(rows1[i].get("bqj"));
			weight = weight + Number(rows1[i].get("hpzl"));
		}
		Ext.getCmp("kbetr").setText(total.toFixed(2));
		Ext.getCmp("menge").setText(count);
		Ext.getCmp("weight").setText(weight.toFixed(3));

	}
	
	
	
	
	
	 function getLgoryByMaktl(maktl){
		 var lgort='0001';
		 switch(maktl){
		 case 'ZP' :
			 lgort='0014';
			 break;
		 case 'VI' :
			 lgort='0014';
			 break;
		 case 'BC' :
			 lgort='0012';
			 break;
		 case 'GF' :
			 lgort='0016';
			 break;
		 case 'DJ' :
			 lgort='0016';
			 break;
		 case 'HT' :
			 lgort='0016';
			 break;
		 case 'BG' :
			 lgort='0015';
			 break;
		 }
		 return lgort;
	 }
	
	
	
	
	

});