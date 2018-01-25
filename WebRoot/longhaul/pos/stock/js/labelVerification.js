/**
 * 调价标签验收
 * @author XiaShou
 * @since 20131126
 */
Ext.onReady(function() {
	
	Ext.data.Connection.prototype.timeout='300000';
	Ext.override(Ext.grid.CheckboxSelectionModel, {
		handleMouseDown : function(g, rowIndex, e) {
			if (e.button !== 0 || this.isLocked()) {
				return;
			}
			var view = this.grid.getView();
			if (e.shiftKey && !this.singleSelect && this.last !== false) {
				var last = this.last;
				this.selectRange(last, rowIndex, e.ctrlKey);
				this.last = last; // reset the last
				view.focusRow(rowIndex);
			} else {
				var isSelected = this.isSelected(rowIndex);
				if (isSelected) {
					this.deselectRow(rowIndex);
				} else if (!isSelected || this.getCount() > 1) {
					this.selectRow(rowIndex, true);
					view.focusRow(rowIndex);
				}
			}
		}
	});

	var vkorg = "";
	var vbeln = "";
	var postType = "";
	var goodType = "";
	var datum = "";

	Ext.Ajax.request({
		url : 'stockSystem.ered?reqCode=getVkorg',
		dataType : 'json',
		timeout : 12000000,
		success : function(response, options) {
			var responseArray = Ext.util.JSON.decode(response.responseText);
			vkorg = responseArray.vkorg;
		}
	});

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
		// valueField:'id',
		valueField : 'diffDetail',
		// displayField:'description',
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
		valueField : 'id',
		displayField : 'description',
		mode : 'local'
	});

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
			'lgorts' : "0001,0002,0012,0014,0017"
		};
	});

	lgortInfo.load(); // 如果mode : 'local',时候才需要手动load();
	//			
	// var lgortInfoCombo2 = new Ext.form.ComboBox({
	// //hiddenName : 'position1',
	// id : 'itemLgort',
	// fieldLabel : '请选择库位',
	// emptyText : '请选择...',
	// triggerAction : 'all',
	// store : lgortInfo,
	// displayField : 'lgobe',
	// valueField : 'lgort',
	// loadingText : '正在加载数据...',
	// mode : 'local', //
	// forceSelection : true,
	// typeAhead : true,
	// resizable : true,
	// editable : false,
	// anchor : '100%'
	//
	// });

	// 定义列模型
	var cmPart1 = new Ext.grid.ColumnModel([ rownum, {
		header : '详细', // 列标题
		dataIndex : 'showdetail',
		width : 35,
		renderer : iconColumnRender2
	}, {
		header : '调价单号', // 列标题
		dataIndex : 'EBELN', // 数据索引:和Store模型对应
		sortable : true,// 是否可排序
		width : 90
	}, {
		header : '创建人',
		dataIndex : 'ERNAM',
		sortable : true,
		width : 90
	// 列宽
	}, {
		header : '邮包日期',
		dataIndex : 'EBDAT',
		sortable : true,
		width : 80
	}, {
		header : '邮包号码',
		dataIndex : 'EBNUM',
		sortable : true,
		width : 60
	// 列宽
	}, {
		header : '寄件人',
		dataIndex : 'NAAM0',
		sortable : true,
		width : 120
	}, {
		header : '出库日期',
		dataIndex : 'BUDAT',
		sortable : true,
		width : 120
	}, {
		header : '数量',
		dataIndex : 'MENGE',
		sortable : true,
		width : 120
	} ]);
	// 定义列模型
	var cmPart2 = new Ext.grid.ColumnModel([ rownum,
	// sm,
	{
		header : '操作', // 列标题
		dataIndex : 'showdetail',
		width : 35,
		renderer : iconColumnRender2
	}, {
		header : '日期',
		dataIndex : 'DATUM',
		sortable : true,
		width : 80
	}, {
		header : '调价单号',
		dataIndex : 'ZTJDH',
		sortable : true,
		width : 120
	}, {
		header : '总件数',
		dataIndex : 'LFIMG',
		sortable : true,
		width : 60
	}, {
		header : '总重量',
		dataIndex : 'totalweight',
		sortable : true,
		width : 60
	}, {
		header : '总金额',
		dataIndex : 'totalmoney',
		sortable : true,
		width : 120
	}, {
		header : '邮件编号',
		dataIndex : 'ZYBNM',
		sortable : true,
		width : 120
	}, {
		header : '邮件类型',
		dataIndex : 'goodType',
		sortable : true,
		width : 90
	}, {
		header : '邮寄方式',
		dataIndex : 'postType',
		sortable : true,
		width : 120
	}, {
		header : '寄件人名称',
		dataIndex : 'ZYJJR',
		sortable : true,
		width : 120
	} ]);

	cm = cmPart2;

	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
			url : 'stockSystem.ered?reqCode=getLabelVerificationHead'
		}),
		// 数据读取器
		reader : new Ext.data.JsonReader({
			root : 'ROOT' // Json中的列表数据根节点
		}, [ {
			name : 'ZTJDH'
		}, {
			name : 'ERNAM'
		}, {
			name : 'EBDAT'
		}, {
			name : 'EBNUM'
		}, {
			name : 'NAAM0'
		}, {
			name : 'BUDAT'
		}, {
			name : 'MENGE'
		}, {
			name : 'DATUM'
		}, {
			name : 'ZYBNM'
		}, {
			name : 'POSNR'
		}, {
			name : 'VBELN'
		}, {
			name : 'ZYJFS'
		}, {
			name : 'postType'
		}, {
			name : 'ZNUM'
		}, {
			name : 'ZYJLX'
		}, {
			name : 'goodType'
		}, {
			name : 'totalmoney'
		}, {
			name : 'totalweight'
		}, {
			name : 'ZYJJR'
		}, {
			name : 'WERKS_C'
		}, {
			name : 'mylgort'
		}, {
			name : 'WERKS_S'
		}, {
			name : 'ZYJMX'
		}, {
			name : 'totalcount'
		}, {
			name : 'LFIMG',
			type : 'int'
		} ])
	});

	store.load({
		callback : function() {
			getTotal();
		}
	});

	var countries = [ [ 'US', 'United States' ], [ 'UK', 'United Kingdom' ], [ 'DE', 'Germany' ], [ 'F', 'France' ], [ 'NL', 'Netherlands' ],
			[ 'SK', 'Slovakia' ], [ 'JP', 'Japan' ], [ 'A', 'Austria' ], [ 'CA', 'Canada' ] ];
	var combo = new Ext.form.ComboBox({
		store : new Ext.data.SimpleStore({
			fields : [ 'countryCode', 'countryName' ],
			data : countries,
			id : 0
		}),
		valueField : 'countryCode',
		displayField : 'countryName',
		lazyRender : true,
		triggerAction : 'all',
		mode : 'local'
	});

	// 收货清单
	var cm2 = new Ext.grid.ColumnModel([ rownum,
	// sm,
	{
		header : '批次',
		dataIndex : 'CHARG',
		sortable : true,
		width : 80
	}, {
		header : '物料号', // 列标题
		dataIndex : 'MATNR',
		width : 120
	}, {
		header : '名称',
		dataIndex : 'MAKTX',
		sortable : true,
		width : 200
	}, {
		header : '原标签价', // 列标题
		dataIndex : 'YLLSJ', // 数据索引:和Store模型对应
		sortable : true,// 是否可排序
		width : 60
	}, {
		header : '标签价',
		dataIndex : 'THLSJ',
		sortable : true,
		width : 90
	}, {
		header : '数量',
		dataIndex : 'count',
		sortable : true,
		width : 40
	}, {
		header : '货品重量',
		dataIndex : 'hpzl',
		sortable : true,
		width : 80
	} ]);

	var store2 = new Ext.data.Store({
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
			url : 'stockSystem.ered?reqCode=getLabelVerificationDetail'
		}),
		// 数据读取器
		reader : new Ext.data.JsonReader({
			root : 'ROOT' // Json中的列表数据根节点
		}, [ {
			name : 'MATNR'
		}, {
			name : 'EBELP'
		}, {
			name : 'EBELN'
		}, {
			name : 'MENGE'
		}, {
			name : 'ZNUM'
		}, {
			name : 'CHARG'
		}, {
			name : 'LIFNR'
		}, {
			name : 'zhlhxt'
		}, {
			name : 'goldTypeStr'
		}, {
			name : 'toneTypeStr'
		}, {
			name : 'toneNeatNessStr'
		}, {
			name : 'toneColorStr'
		}, {
			name : 'bqj',
			type : 'int'
		}, {
			name : 'count',
			type : 'int'
		}, {
			name : 'zjlzl1'
		}, {
			name : 'ztjtf'
		}, {
			name : 'ztjcd'
		}, {
			name : 'MAKTX'
		}, {
			name : 'meins'
		}, {
			name : 'kbetr'
		}, {
			name : 'zmatnrt'
		}, {
			name : 'hpzl'
		}, {
			name : 'zclzl'
		}, {
			name : 'zzlnn'
		}, {
			name : 'zszsb'
		}, {
			name : 'goodzs'
		}, {
			name : 'VKORG'
		}, {
			name : 'VTWEG'
		}, {
			name : 'DATBI'
		}, {
			name : 'DATAB'
		}, {
			name : 'KBSTAT'
		}, {
			name : 'KBETR'
		}, {
			name : 'YLLSJ',
			type : 'int'
		}, {
			name : 'THLSJ',
			type : 'int'
		} ])
	});

	var reasonCombobox = new Ext.form.ComboBox({
		typeAhead : true,
		triggerAction : 'all',
		lazyRender : true,
		mode : 'local',
		store : new Ext.data.ArrayStore({
			id : 0,
			fields : [ 'myId', 'displayText' ],
			data : [ [ 1, 'item1' ], [ 2, 'item2' ] ]
		}),
		valueField : 'myId',
		displayField : 'displayText'
	});

	// 翻页排序时带上查询条件
	store.on('beforeload', function() {
		this.baseParams = {};
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
		items : [ '-', '&nbsp;&nbsp;', pagesize_combo, '&nbsp;&nbsp;', {
			xtype : 'label',
			text : '商品总数量：'
		}, '&nbsp;&nbsp;', {
			xtype : 'label',
			id : 'count'
		}, '-', {
			xtype : 'label',
			text : '商品总重量：'
		}, '&nbsp;&nbsp;', {
			xtype : 'label',
			id : 'totalweight'
		}, '-', {
			xtype : 'label',
			text : '商品总金额：'
		}, '&nbsp;&nbsp;', {
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
		}, '-', {
			text : '查询条件',
			iconCls : 'arrow_switchIcon',
			hidden : true,
			handler : function() {
				firstWindow.show();
			}
		}]
	});

	// 表格下工具栏
	var bbar2 = new Ext.Toolbar({
		items : [ '-', {
			xtype : 'label',
			text : '原标签价金额:'
		}, '&nbsp;', {
			xtype : 'label',
			id : 'totalmoney2'
		}, '-', '&nbsp;&nbsp;', {
			xtype : 'label',
			text : '新标签价总金额:'
		}, '&nbsp;', {
			xtype : 'label',
			id : 'totalmoney3'
		}, '-', '&nbsp;&nbsp;', {
			xtype : 'label',
			text : '总重量:'
		}, '&nbsp;', {
			xtype : 'label',
			id : 'weight'
		}, '-', '&nbsp;&nbsp;', {
			xtype : 'label',
			text : '总数量:'
		}, '&nbsp;', {
			xtype : 'label',
			id : 'menge'
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
		clicksToEdit : 2,
		region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		store : store, // 数据存储
		stripeRows : true, // 斑马线
		cm : cm, // 列模型
		// sm : sm,
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
		bbar : bbar2,// 表格下工具栏
		// sm : sm, // 复选框
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
			
			var EBELN = record.get('ZTJDH');
			vbeln = EBELN;
			postType = record.get('ZYJFS');
			goodType = record.get('ZYJLX');
			lgortInfo.reload();
			thirdWindow.show();
			Ext.getCmp("searchText").focus(true, true);
			Ext.getCmp("postno").setValue(record.get('ZYBNM'));

			store2.load({
				params : {
					EBELN : EBELN
				},
				callback : function(records, options, success) {
					getCount();
					if (success == true) {
						if (records.length == 0) {
							Ext.Msg.alert('提示', '没有记录！！');
							thirdWindow.hide();
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
			params : {},
			callback : function(records, options, success) {
				// getTotal();
				if (success == true) {
					getTotal();
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
		return "<a href='javascript:void(0);'><img src='" + webContext + "/resource/image/ext/page_edit_1.png'/></a>";
		;
	}

	// queryCatalogItem();

	var lgortInfoCombo = new Ext.form.ComboBox({
		// hiddenName : 'position1',
		id : 'position',
		fieldLabel : '请选择库位',
		emptyText : '请选择...',
		triggerAction : 'all',
		store : lgortInfo,
		displayField : 'lgobe',
		valueField : 'lgort',
		hidden : true,
		loadingText : '正在加载数据...',
		mode : 'local', //
		// 数据会自动读取,如果设置为local又调用了store.load()则会读取2次；也可以将其设置为local，然后通过store.load()方法来读取
		forceSelection : true,
		typeAhead : true,
		resizable : true,
		editable : false,
		value : '0001',
		// value : '530101',
		anchor : '100%'

	// hiddenName : 'position',
	// id : 'position',
	// fieldLabel : '请选择库位',
	// emptyText : '请选择库位',
	// // triggerAction : 'all',
	// store : lgortInfo,
	// displayField : 'lgobe',
	// valueField : 'lgort',
	// loadingText : '正在加载数据...',
	// mode : 'local', //
	//
	// 数据会自动读取,如果设置为local又调用了store.load()则会读取2次；也可以将其设置为local，然后通过store.load()方法来读取
	// //forceSelection : true,
	// //typeAhead : true,
	// //resizable : true,
	// editable : false,
	// anchor : '80%'
	});

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
			// border : false,
			frame : true,
			items : [ {
				columnWidth : .2,
				layout : 'form',
				// border : false,
				anchor : '80%',
				items : [ lgortInfoCombo
				// {
				// xtype : 'combo',
				// hiddenName : 'position',
				// id : 'position',
				// fieldLabel : '请选择库位',
				// emptyText : '请选择...',
				// loadingText : '正在加载数据...',
				// triggerAction : 'all',
				// typeAhead : true,
				// store : lgortInfo,
				// displayField : 'lgobe',
				// valueField : 'lgort',
				// lazyRender : true,
				// mode : 'local',
				// editable : false,
				// // value : '530101',
				// anchor : '70%'
				//
				// }
				]
			}, {
				columnWidth : .25,
				layout : 'form',
				border : false,
				hidden : true,
				items : [ diffInfoForHead ]
			}, {
				columnWidth : .4,
				layout : 'form',
				border : false,
				hidden : true,
				items : [ {
					xtype : 'textfield',
					id : 'headexplain',
					width : 200,
					fieldLabel : '整单说明'
				} ]
			}, {
				columnWidth : .1,
				layout : 'form',
				// border : false,
				items : [ {
					xtype : 'button',
					name : 'submit',
					text : '签收',
					anchor : '80%',
					handler : getCheckboxValues
				} ]

			} ]
		} ]
	});

	var searchText = new Ext.form.TextField({
		id : 'searchText',
		name : 'searchText',
		fieldLabel : '输入或批次信息',
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
		hidden : true,
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
				}, {
					xtype : 'textfield',
					id : 'postno',
					text : '查找',
					hidden : true,
					anchor : '80%'
				} ]

			} ]
		} ]
	});

	function search() {
		var searchText = Ext.get("searchText").getValue();
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

				// grid2.getSelectionModel().selectRow(i, true);
				view.focusRow(i);
				Ext.Msg.alert("提示", "该物料存在于列表中！", function(e) {
					Ext.getCmp("searchText").setValue('');
					Ext.getCmp("searchText").focus(true, true);
				});
				return;
			}
		}
		Ext.Msg.alert('提示', '没有找到！！', function(e) {
			Ext.getCmp("searchText").focus(true, true);
		});

	}

	var oppanel = new Ext.Panel({
		items : [ searchForm, grid2, submitForm ]
	});

	// 入库操作
	var thirdWindow = new Ext.Window({
		title : '<span class="commoncss">货品清单</span>', // 窗口标题
		// layout : 'fit', // 设置窗口布局模式
		width : 900, // 窗口宽度
		iconCls : 'window_caise_listIcon', // 按钮图标
		height : 450, // 窗口高度
		closable : true, // 是否可关闭
		collapsible : true, // 是否可收缩
		maximizable : true, // 设置是否可以最大化
		border : false, // 边框线设置
		madal:true,
		autoScroll : true,
		constrain : true, // 设置窗口是否可以溢出父容器
		pageY : 20, // 页面定位Y坐标
		pageX : document.body.clientWidth / 4 - 300 / 2, // 页面定位X坐标
		items : [ oppanel ], // 嵌入的表单面板
		closeAction : 'hide'
	});
	
	
	// 获取选择行
	function getCheckboxValues() {

	//	var rows = grid2.store.data.items;

//		var chargitem = "";
//		for ( var i = 0; i < rows.length; i++) {
//			chargitem = chargitem + "\"" + i + "\":";
//			chargitem = chargitem + "{\"charg\":\"" + rows[i].get("CHARG") + "\",";
//			chargitem = chargitem + "\"ebeln\":\"" + rows[i].get("ZTJDH") + "\",";
//
//			chargitem = chargitem + "\"matnr\":\"" + rows[i].get("MATNR") + "\",";
//			chargitem = chargitem + "\"kbstat\":\"" + '01' + "\",";
//			chargitem = chargitem + "\"kbetr\":\"" + rows[i].get("THLSJ") + "\",";
//
//			chargitem = ((i == (rows.length - 1)) ? chargitem : (chargitem + ","));
//		}
//
//		chargitem = "{" + chargitem + "}";

		Ext.Msg.confirm("提示", "确定签收吗？", function(btn, text) {
			if (btn == "yes") {

				var myMask = new Ext.LoadMask(Ext.getBody(), {
					msg : '正在提交中，请稍后...',
					removeMask : true
				// 完成后移除
				});
				myMask.show();
				var myMsg ;
				Ext.Ajax.request({
					url : 'stockSystem.ered?reqCode=submitLabelVarification',
					method : 'post',
					params : {
						vbeln : vbeln//,
						//chargitem : chargitem
					},timeout : 12000000,
					success : function(data) {
						myMask.hide();
						var retData = Ext.decode(data.responseText);
						if (retData.success != null) {
							Ext.Msg.alert("提示成功", retData.success, function(e) {
								thirdWindow.hide();
								queryCatalogItem();
							});
						} else if(retData.someerror != null){
							Ext.Msg.alert("部分错误", retData.error, function(e) {
							});
						}else {
							Ext.Msg.alert("提示错误", retData.error, function(e) {
							});
						}
					}
				});
			}
			// else{
			// Ext.Ajax.request({
			// url : 'stockSystem.ered?reqCode=updatePriceStatus',
			// method : 'post',
			// params : {
			// chargitem : chargitem
			// },
			// success : function(data) {
			// var mydata = Ext.decode(data.responseText);
			// if(mydata.success != null){
			// Ext.Msg.alert("提示成功",mydata.success,function(){
			// thirdWindow.hide();
			// queryCatalogItem();
			// });
			// }else if(mydata.error != null){
			// Ext.Msg.alert("提示失败",mydata.error,function(){
			//										
			// });
			// }else{
			// Ext.Msg.alert("提示","出现未知错误！",function(){
			// });
			// }
			// }
			// });
			// }

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
			var myreason = "";
			if (headreason != null && headreason != '') {
				var myreasons = headreason.split(",");
				for ( var j = 0; j < myreasons.length; j++) {
					// alert(myreasons[j]);
					myreason = myreason + myreasons[j].substring(0, myreasons[j].indexOf("、"));
					if (j != myreasons.length - 1) {
						myreason = myreason + ",";
					}
				}

				if (headreason != null && headreason != '') {
					chargitem = chargitem + "\"" + count + "\":";
					chargitem = chargitem + "{\"VBELN\":\"" + rows[i].get("VBELN") + "\",";
					chargitem = chargitem + "\"postno\":\"" + rows[i].get("ZYBNM") + "\",";
					chargitem = chargitem + "\"EBELN\":\"" + rows[i].get("EBELN") + "\",";
					chargitem = chargitem + "\"goodType\":\"" + rows[i].get("ZYJLX") + "\",";
					chargitem = chargitem + "\"postType\":\"" + rows[i].get("ZYJFS") + "\",";
					chargitem = chargitem + "\"datum\":\"" + rows[i].get("DATUM") + "\",";
					// alert(rows[i].get("VBELN"));
					// alert(rows[i].get("DATUM"));
					// alert(rows[i].get("ZYJFS"));
					chargitem = chargitem + "\"needvalified\":\"" + 3 + "\",";

					chargitem = chargitem + "\"headReason\":\"" + myreason + "\",";
					chargitem = chargitem + "\"headexplain\":\"" + headexplain + "\"}";
					chargitem = chargitem + ",";
					count++;
				}
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
					url : 'stockSystem.ered?reqCode=submitHeadReason',
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
							// Ext.Msg.confirm("提示成功,是否更新标签价格？",retData.success,function(e){
							// if(e == 'yes'){
							// myMask.show();
							// Ext.Ajax.request({
							// url :
							// 'stockSystem.ered?reqCode=updatePriceStatusForHeadReason',
							// method : 'post',
							// params : {
							// chargitem : chargitem
							// },
							// success : function(data) {
							// myMask.hide();
							// var mydata = Ext.decode(data.responseText);
							// if(mydata.success != null){
							// Ext.Msg.alert("提示成功",mydata.success,function(){
							// queryCatalogItem();
							// });
							// }else if(mydata.error != null){
							// Ext.Msg.alert("提示失败",mydata.error,function(){
							//																	
							// });
							// }else{
							// Ext.Msg.alert("提示","出现未知错误！",function(){
							// });
							// }
							// }
							// });
							// }else{
							// queryCatalogItem();
							// }
							// });

						} else if (retData.error != null) {
							Ext.Msg.alert("提示失败", retData.error, function() {
							});
						} else {
							Ext.Msg.alert("提示", "出现未知错误！", function() {
							});
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
		var totalweight = 0;
		for ( var i = 0; i < rows1.length; i++) {
			count = count + Number(rows1[i].get("totalcount"));
			total = total + Number(rows1[i].get("totalmoney"));
			totalweight = totalweight + Number(rows1[i].get("totalweight"));
		}
		Ext.getCmp("count").setText(count.toFixed(0));
		Ext.getCmp("total").setText(total.toFixed(3));
		Ext.getCmp("totalweight").setText(totalweight.toFixed(3));
	}

	function getCount() {
		var rows1 = grid2.store.data.items;
		var count = 0;
		var total = 0;
		var total1 = 0;
		var weight = 0;
		for ( var i = 0; i < rows1.length; i++) {
			count = count + Number(rows1[i].get("count"));
			total = total + Number(rows1[i].get("YLLSJ"));
			total1 = total1 + Number(rows1[i].get("THLSJ"));
			weight = weight + Number(rows1[i].get("hpzl"));
		}
		Ext.getCmp("totalmoney2").setText(total.toFixed(0));
		Ext.getCmp("totalmoney3").setText(total1.toFixed(0));
		Ext.getCmp("menge").setText(count.toFixed(0));
		Ext.getCmp("weight").setText(weight.toFixed(3));

	}

});