/**
 * 货品收货功能
 * 
 * @author FengZhou
 * @since 2012-06-15
 */
Ext.onReady(function() {

	Ext.data.Connection.prototype.timeout='300000';
	// 复选框
	var sm = new Ext.grid.CheckboxSelectionModel();

	var postTypeStore = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : 'stockSystem.ered?reqCode=getPostType'
		}),
		reader : new Ext.data.JsonReader({}, [ {
			name : 'zyjfs'
		}, {
			name : 'tyjfs'
		} ])
	});
	var kondmInfo = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : 'stockSystem.ered?reqCode=getKondmInfo'
		}),
		reader : new Ext.data.JsonReader({}, [ {
			name : 'kondm'
		}, {
			name : 'vtext'
		} ])
	});
	//kondmInfo.load();
	var goodTypeStore = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : 'stockSystem.ered?reqCode=getGoodType'
		}),
		reader : new Ext.data.JsonReader({}, [ {
			name : 'zyjlx'
		}, {
			name : 'tyjlx'
		} ])
	});

	// postTypeStore.load();
	// goodTypeStore.load();

	// 定义自动当前页行号
	var rownum = new Ext.grid.RowNumberer({
		header : 'NO',
		width : 28
	});

	// 定义列模型
	var cm = new Ext.grid.ColumnModel([ rownum, sm, {
		header : '详细', // 列标题
		dataIndex : 'showdetail',
		width : 35,
		hidden : true,
		renderer : iconColumnRender2
	}, {
		header : '物料号', // 列标题
		dataIndex : 'matnr', // 数据索引:和Store模型对应
		sortable : true,// 是否可排序
		width : 140,
		editor : new Ext.form.TextField()
	}, {
		header : '商品名称',
		dataIndex : 'maktx',
		sortable : true,
		width : 200,
		editor : new Ext.form.TextField()
	}, {
		header : '赠送价格段',
		dataIndex : 'tbtxt',
		sortable : true,
		hidden : true,
		width : 200
	}, {
		header : '库存数量',
		dataIndex : 'labst',
		sortable : true,
		width : 90,
		renderer : function(v) {
			if((v+'').indexOf(".5") != -1)
				return  Number(v).toFixed(1);
			else
				return  Number(v).toFixed(0);
		}
	} ]);

	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
			url : 'stockSystem.ered?reqCode=nopricestockinfo'
		}),
		// 数据读取器
		reader : new Ext.data.JsonReader({
			totalProperty : 'TOTALCOUNT', // 记录总数
			root : 'ROOT' // Json中的列表数据根节点
		}, [ {
			name : 'werks'
		}, {
			name : 'lgort'
		}, {
			name : 'lgortStr'
		}, {
			name : 'matnr'
		}, {
			name : 'charg'
		}, {
			name : 'labst'
			//,type : 'int'
		}, {
			name : 'meins'
		}, {
			name : 'hpzl'
		}, {
			name : 'zclzl'
		}, {
			name : 'zjlbm'
		}, {
			name : 'goldTypeStr'
		}, {
			name : 'zjsyl'
		}, {
			name : 'zjjfs'
		}, {
			name : 'zxsfs'
		}, {
			name : 'lifnr'
		}, {
			name : 'hpzl'
		}, {
			name : 'maktx'
		}, {
			name : 'matkl'
		}, {
			name : 'zjlbm'
		}, {
			name : 'zslbm'
		}, {
			name : 'toneTypeStr'
		}, {
			name : 'zslys'
		}, {
			name : 'toneColorStr'
		}, {
			name : 'zslxz'
		}, {
			name : 'zslgg'
		}, {
			name : 'tbtxt'
		}, {
			name : 'toneNeatNessStr'
		}, {
			name : 'zgy'
		}, {
			name : 'zmatnrt'
		}, {
			name : 'kondm'
		}, {
			name : 'bismt'
		}, {
			name : 'zhpccq'
		}, {
			name : 'zhpccz'
		}, {
			name : 'zzszq'
		}, {
			name : 'zzszz'
		}, {
			name : 'zzlnn'
		}, {
			name : 'zpsbs'
		}, {
			name : 'zjz'
		}, {
			name : 'zfssl'
		}, {
			name : 'zfszl'
		}, {
			name : 'kbetr'
		}, {
			name : 'kbstat'
		} ])
	});

	// 收货清单
	var cm2 = new Ext.grid.ColumnModel([ rownum, {
		header : '编号',
		dataIndex : 'id',
		sortable : true,
		hidden : true,
		width : 120
	}, {
		header : '批号', // 列标题
		dataIndex : 'charg',
		width : 100
	}, {
		header : '物料号', // 列标题
		dataIndex : 'matnr',
		width : 140
	}, {
		header : '数量',
		dataIndex : 'menge',// 'zhlhxt',
		sortable : true,
		width : 60
	}, {
		header : '项目编号', // 列标题
		dataIndex : 'ebelp', // 数据索引:和Store模型对应
		sortable : true,// 是否可排序
		hidden : true,
		width : 60
	}, {
		header : '商品名称', // 列标题
		dataIndex : 'maktx',
		width : 110
	}, {
		header : '选款单号', // 列标题
		dataIndex : 'choiceorderid',
		width : 110
	}, {
		header : '标签价',
		dataIndex : 'kbetr',
		sortable : true,
		width : 100
	}, {
		header : '金料',
		dataIndex : 'goldTypeStr',// 'zjlzl1',
		sortable : true,
		width : 110
	}, {
		header : '金重',
		dataIndex : 'zclzl',// 'zjlzl1',
		sortable : true,
		width : 60
	}, {
		header : '石料编码',
		dataIndex : 'toneTypeStr',// 'zjlzl1',
		sortable : true,
		width : 70
	}, {
		header : '石重',
		dataIndex : 'zzlnn',// 'zjlzl1',
		sortable : true,
		width : 40
	}, {
		header : '净度',
		dataIndex : 'toneNeatNessStr',// 'ztjcd',
		sortable : true,
		width : 100
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
		header : '差异原因',
		dataIndex : 'reasonStr',// 'ztjcd',
		sortable : true,
		width : 240
	}, {
		header : '说明',
		dataIndex : 'myexplain',// 'ztjcd',
		sortable : true,
		width : 140
	}, {
		header : '处理',
		dataIndex : 'manage',// 'ztjcd',
		sortable : true,
		width : 140
	}, {
		header : '库位',
		dataIndex : 'lgortStr',// 'ztjcd',
		sortable : true,
		width : 140
	}, {
		header : '图片',
		dataIndex : 'zmatnrt',// 'ztjcd',
		width : 80,
		renderer : function(v) {
			// return "<a href='http://www.baidu.com?word="+ v +"'
			// target='_blank' >"+v+"</a>"
			return "<img src='../../../sappic/" + v + "' width='60px' height='60px' " + "onError=\"this.src='./images/sample1.gif'\"/>"
		}

	} ]);

	var store2 = new Ext.data.Store({
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
			url : 'stockSystem.ered?reqCode=getReceiveStoreDetail'
		}),
		// 数据读取器
		reader : new Ext.data.JsonReader({
			idProperty : 'callTime',
			root : 'ROOT' // Json中的列表数据根节点
		}, [ {
			name : 'id'
		}, {
			name : 'charg'
		}, {
			name : 'ebelp'
		}, {
			name : 'menge',
			type : 'int'
		}, {
			name : 'maktx'
		}, {
			name : 'matnr'
		}, {
			name : 'goodscount'
		}, {
			name : 'outstock'
		}, {
			name : 'zclzl'
		}, {
			name : 'zzlnn'
		}, {
			name : 'zslys'
		}, {
			name : 'goodzs'
		}, {
			name : 'zszsb'
		}, {
			name : 'instock'// zhlhxt
		}, {
			name : 'zjlzl1'
		}, {
			name : 'zhlhxt'
		}, {
			name : 'ztjtf'
		}, {
			name : 'labor'
		}, {
			name : 'goldTypeStr'
		}, {
			name : 'toneTypeStr'
		}, {
			name : 'toneNeatNessStr'
		}, {
			name : 'toneColorStr'
		}, {
			name : 'choiceorderid'
		}, {
			name : 'reason'
		}, {
			name : 'reasonStr'
		}, {
			name : 'explain'
		}, {
			name : 'manage'
		}, {
			name : 'ztjcd'
		}, {
			name : 'kbetr'
		}, {
			name : 'zmatnrt'
		}, {
			name : 'lgortStr'
		}, {
			name : 'zslbm'
		}, {
			name : 'zjlbm'
		}, {
			name : 'lgort'
		} ])
	});

	// 翻页排序时带上查询条件
	store.on('beforeload', function() {
		this.baseParams = {
//			ifEnough : ifEnough_combo.getValue(),
			kondm : kondm_combo.getValue(),
//			charg : Ext.getCmp("charg").getValue(),
			matnr : Ext.getCmp("matnr").getValue()
//			lgort : lgort_combo.getValue()
		// goodtype : goodtype_combo.getValue(),
		// posttype : posttype_combo.getValue()
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

	// 是否零库存
	var ifEnough_combo = new Ext.form.ComboBox({
		name : 'ifEnough',
		triggerAction : 'all',
		mode : 'local',
		fieldLabel : '库存情况',
		emptyText : '库存情况',
		store : new Ext.data.ArrayStore({
			fields : [ 'value', 'text' ],
			data : [ [ '', '所有' ], [ '0', '无库存' ], [ '1', '有库存' ] ]
		}),
		valueField : 'value',
		displayField : 'text',
		value : '1',
		editable : false,
		width : 85
	});

	var kondm_combo = new Ext.form.ComboBox({
		name : 'kondm',
		triggerAction : 'all',
		mode : 'local',
		fieldLabel : '品类',
		emptyText : '品类',
		store : new Ext.data.ArrayStore({
			fields : [ 'value', 'text' ],
			data : [ [ '', '所有' ], [ 'ZP', '赠品' ], [ 'BC', '包材' ] ]
		}),
		valueField : 'value',
		displayField : 'text',
		editable : false,
		width : 250
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
		} ])
	});

	//lgortInfo.load(); // 如果mode : 'local',时候才需要手动load();

	var lgort_combo = new Ext.ux.form.LovCombo({
		triggerAction : 'all',
		store : lgortInfo,
		emptyText : '库位',
		displayField : 'lgobe',
		valueField : 'lgort',
		mode : 'local',
		width : 90
	})

	var goodtype_combo = new Ext.form.ComboBox({
		id : "goodtype",
		// name : 'type',
		triggerAction : 'all',
		mode : 'local',
		store : goodTypeStore,
		valueField : 'zyjlx',
		displayField : 'tyjlx',
		emptyText : '商品类型',
		hidden : true,
		editable : false,
		anchor : '70%'
	});

	var posttype_combo = new Ext.form.ComboBox({
		id : 'posttype',
		triggerAction : 'all',
		mode : 'local',
		store : postTypeStore,
		valueField : 'zyjfs',
		displayField : 'tyjfs',
		emptyText : '邮寄方式',
		editable : false,
		hidden : true,
		anchor : '70%'
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
				items : ['-', '&nbsp;&nbsp;', pagesize_combo, '-',
							'&nbsp;&nbsp;', {
					xtype : 'label',
					text : '商品总数量：'
				}, '-', {
					xtype : 'label',
					id : 'count'
				},'-',{
					xtype : 'label',
					text : '商品总重量：'
				}, '-', {
					xtype : 'label',
					id : 'totalweight'
				}, '-', {
					xtype : 'label',
					text : '商品总金额：'
				}, '-', {
					xtype : 'label',
					id : 'total'
				}]
			});

	// 表格工具栏
	var tbar = new Ext.Toolbar({
		items : [kondm_combo, '-', {
			xtype : 'textfield',
			emptyText : '物料号',
			id : "matnr"
		},'-', {
			text : '查询',
			iconCls : 'page_refreshIcon',
			handler : function() {
				queryCatalogItem();
			}
		} ]
	});
	
	//表格下工具栏
	var bbar2 = new Ext.Toolbar({
		items : ['-',{
			xtype:'label',
			text:'总金额:'
		},'&nbsp;',{
			xtype:'label',
			id:'kbetr'
		},'-','&nbsp;&nbsp;',{
			xtype:'label',
			text:'总数量:'
		},'&nbsp;',{
			xtype:'label',
			id:'menge'
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
		sm : sm,
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
	var grid2 = new Ext.grid.GridPanel({
		// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
		height : 300,
		width : 900,
		frame : true,
		// autoHeight : true,
		autoScroll : true,
		region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		store : store2, // 数据存储
		stripeRows : true, // 斑马线
		cm : cm2, // 列模型
		// sm : sm, // 复选框
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

		if (fieldName == 'showdetail' && columnIndex == 1) {
			var meterialdocument = Ext.getCmp('meterialdocument');
			meterialdocument.setValue
			var id = record.get('id');
			var chargs = record.get("charg");
			var matnr = record.get("matnr");
			var vbeln = record.get('vbeln');
			var menge = record.get('menge');
			var reason = record.get('reason');
			var explain = record.get('myexplain');
			var manage = record.get('manage');
			var lgort = record.get('lgort');
			var annualvouchers = record.get('annualvouchers');
			var meterialdocument = record.get('meterialdocument');
			Ext.getCmp('meterialdocument').setValue(meterialdocument);
			Ext.getCmp('annualvouchers').setValue(annualvouchers);
			Ext.getCmp('vbeln').setValue(vbeln);
			thirdWindow.show();
			store2.load({
				params : {
					id : id,
					meterialdocument : meterialdocument
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
		if (fieldName == 'showpic' && columnIndex == 17) {

			var picurl = record.get('zmatnrt');
			picWindow.show();
			picWindow.width = 'auto';
			picWindow.height = 'auto';
			document.getElementById("goodimage").src = "../../../sappic/" + picurl;
			// picpanel.html = "<img id='goodimage'
			// src='../../../../../sappic/"+picurl+"'" +
			// "onError=\"this.src='./images/sample1.gif'\"/>";
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
	// 生成一个图标列
	function iconColumnRender3(value) {
		return "<a href='javascript:void(0);'><img src='" + webContext + "/resource/image/ext/window_caise_list.png'/></a>";
		;
	}

	queryCatalogItem();

	// store.load();

	// var lgortInfo = new Ext.data.Store({
	// proxy : new Ext.data.HttpProxy({
	// url : 'stockSystem.ered?reqCode=getLgort'
	// }),
	// reader : new Ext.data.JsonReader({}, [{
	// name : 'werks'
	// }, {
	// name : 'lgort'
	// }, {
	// name : 'lgobe'
	// }])
	// });

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
				items : [ {
					xtype : 'button',
					name : 'submit',
					text : '凭证冲销',
					anchor : '90%',
					handler : getCheckboxValues
				} ]

			} ]
		} ]
	});

	// lgortInfo.load(); // 如果mode : 'local',时候才需要手动load();

	var searchText = new Ext.form.TextField({
		id : 'meterialdocument',
		name : 'meterialdocument',
		fieldLabel : '凭证编号',
		readOnly : true,
		listeners : {
			specialkey : function(field, e) {
				if (e.getKey() == Ext.EventObject.ENTER) {
					// search();
				}
			}
		}
	});

	var yearText = new Ext.form.TextField({
		id : 'annualvouchers',
		name : 'annualvouchers',
		fieldLabel : '凭证编号',
		readOnly : true,
		listeners : {
			specialkey : function(field, e) {
				if (e.getKey() == Ext.EventObject.ENTER) {
					// search();
				}
			}
		}
	});

	var vbeln = new Ext.form.TextField({
		id : 'vbeln',
		name : 'vbeln',
		fieldLabel : '凭证编号',
		readOnly : true,
		listeners : {
			specialkey : function(field, e) {
				if (e.getKey() == Ext.EventObject.ENTER) {
					// search();
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
				columnWidth : .4,
				layout : 'form',
				border : false,
				anchor : '80%',
				items : [ searchText ]
			}, {
				columnWidth : .4,
				layout : 'form',
				border : false,
				anchor : '80%',
				items : yearText
			}, {
				columnWidth : .4,
				layout : 'form',
				border : false,
				anchor : '80%',
				hidden : true,
				items : vbeln
			} ]
		} ]
	});

	function search() {
		var searchText = Ext.get("searchText").getValue();
		var view = grid2.getView();
		for ( var i = 0; i < store2.getCount(); i++) {
			var charg = store2.getAt(i).get('charg');
			if (charg == searchText) {
				if (grid2.getSelectionModel().isSelected(i)) {
					view.focusRow(i);
					Ext.Msg.alert('提示', '该条已经被选中！！', function() {
						Ext.getCmp("searchText").focus(true, true);
					});
					return;
				}

				grid2.getSelectionModel().selectRow(i, true);
				view.focusRow(i);

				Ext.getCmp("searchText").setValue('');
				Ext.getCmp("searchText").focus(true, true);
				return;
			}
		}
		Ext.Msg.alert('提示', '没有找到！！', function() {
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

	var picpanel = new Ext.Panel({
		layout : 'fit',
		html : "<img id='goodimage' src=''" + "onError=\"this.src='./images/sample1.gif'\"/>"
	});

	// 入库操作
	var thirdWindow = new Ext.Window({
		title : '<span class="commoncss">调入清单</span>', // 窗口标题
		// layout : 'fit', // 设置窗口布局模式
		width : 900, // 窗口宽度
		iconCls : 'window_caise_listIcon', // 按钮图标
		height : 450, // 窗口高度
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

	var picWindow = new Ext.Window({
		title : '<span class="commoncss">调入清单</span>', // 窗口标题
		// layout : 'fit', // 设置窗口布局模式
		// width : 900, // 窗口宽度
		iconCls : 'window_caise_listIcon', // 按钮图标
		// height : 400, // 窗口高度
		closable : true, // 是否可关闭
		collapsible : true, // 是否可收缩
		// maximizable : true, // 设置是否可以最大化
		resizable : false,
		border : false, // 边框线设置
		autoScroll : true,
		constrain : false, // 设置窗口是否可以溢出父容器
		pageY : 20, // 页面定位Y坐标
		pageX : document.body.clientWidth / 4 - 300 / 2, // 页面定位X坐标
		items : [ picpanel ], // 嵌入的表单面板
		closeAction : 'hide'
	});

	// 获取选择行
	function getCheckboxValues() {

		var chargs = "";
		var ebeln = "";

		// 返回一个行集合JS数组
		var rows = grid2.getSelectionModel().getSelections();
		// if (Ext.isEmpty(rows)) {
		// Ext.MessageBox.alert('提示', '您没有选中任何数据!');
		// return;
		// }
		// alert(rows.length);

		for ( var i = 0; i < rows.length; i++) {
			chargs += rows[i].get("BWTAR") + ' ,';
			ebeln = rows[i].get("EBELN");
		}

		var annualvouchers = Ext.getCmp('annualvouchers').getValue();
		var meterialdocument = Ext.getCmp('meterialdocument').getValue();
		var vbeln = Ext.getCmp('vbeln').getValue();
		alert(vbeln);

		chargs = chargs.substring(0, chargs.length - 1);
		// 将JS数组中的行级主键，生成以,分隔的字符串
		var positionIds = jsArray2JsString(rows, 'BWTAR');
		Ext.MessageBox.alert('提示', positionIds);
		// 获得选中续数据后则可以传入后台继处理

		Ext.Msg.confirm("提示", "确定冲销吗？", function(btn, text) {
			if (btn == "yes") {
				Ext.Ajax.request({
					url : 'stockSystem.ered?reqCode=rejReceive',
					method : 'post',
					params : {
						annualvouchers : annualvouchers,
						meterialdocument : meterialdocument,
						vbeln : vbeln

					},timeout : 12000000,
					success : function(data) {
						Ext.Msg.alert("提示", data.responseText);
						thirdWindow.hide();
						queryCatalogItem();
					}
				});
			}

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

	function unfreezePrice() {
		var rows = grid.getSelectionModel().getSelections();
		if (Ext.isEmpty(rows)) {
			Ext.MessageBox.alert('提示', '您没有选中任何数据!');
			return;
		}

		Ext.Msg.confirm("提示", "确定标签已经到达，更新价格状态吗？", function(e) {
			if (e == 'yes') {
				var info = "";
				var con = 0;
				for ( var i = 0; i < rows.length; i++) {
					if (rows[i].get("kbstat") == '冻结') {
						info = info + "\"" + con + "\":";
						info = info + "{\"charg\":\"" + rows[i].get("charg") + "\",";
						info = info + "\"matnr\":\"" + rows[i].get("matnr") + "\"}";
						info = (i == rows.length - 1 ? info : info + ",");
						con++;
					}
				}
				info = "{" + info + "}";
				//alert(info);

				if (info == '') {
					Ext.Msg.alert("提示", "您选中的条目中没有需要更新标签价格的，请重新选择！");
					return;
				}
				Ext.Ajax.request({
					url : 'stockSystem.ered?reqCode=unfreezePrice',
					params : {
						info : info
					},timeout : 12000000,
					success : function(data) {
						var retData = Ext.decode(data.responseText);
						if (retData.success != null) {
							Ext.Msg.alert("提示成功", retData.success, function(e) {
								queryCatalogItem();
							});
						} else if (retData.error != null) {
							Ext.Msg.alert("提示失败", retData.error, function(e) {
							});
						} else {
							Ext.Msg.alert("提示失败", "出现未知错误，请联系管理员！", function(e) {
							});
						}
					}
				});

			}
		});
	}
	
	function getTotal(){
		var rows1 = grid.store.data.items;
		var count = 0;
		var total = 0;
		var totalweight = 0;
		for ( var i = 0; i < rows1.length; i++) {
			count = count + Number(rows1[i].get("labst"));
			total = total + Number(rows1[i].get("kbetr"))*Number(rows1[i].get("labst"));
			totalweight = totalweight + Number(rows1[i].get("hpzl"))*Number(rows1[i].get("labst"));
		}
		Ext.getCmp("count").setText(count);
		Ext.getCmp("total").setText(total);
		Ext.getCmp("totalweight").setText(totalweight.toFixed(3));
	}
	
		function getCount(){
		var rows1 = grid2.store.data.items;
		var count = 0;
		var total = 0;
		for ( var i = 0; i < rows1.length; i++) {
			count = count + Number(rows1[i].get("menge"));
			total = total + Number(rows1[i].get("kbetr"));
		}
		Ext.getCmp("kbetr").setText(total);
		Ext.getCmp("menge").setText(count);
		
	
	}
		
		queryCatalogItem();
		
});