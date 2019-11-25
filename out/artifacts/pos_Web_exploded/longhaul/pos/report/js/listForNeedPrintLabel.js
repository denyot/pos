/**
 * 货品收货功能
 * 
 * @author FengZhou
 * @since 2012-06-15
 */
Ext.onReady(function() {

	// 复选框
	var sm = new Ext.grid.CheckboxSelectionModel();

	// 定义自动当前页行号
	var rownum = new Ext.grid.RowNumberer({
		header : 'NO',
		width : 28
	});


	var currentId = "";

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
		width : 120
	}, {
		header : '调拨物料凭证', // 列标题
		dataIndex : 'i_mblnr', // 数据索引:和Store模型对应
		sortable : true,// 是否可排序
		editor : new Ext.form.TextField(),
		width : 120
	}, {
		header : '调价原因', // 列标题
		dataIndex : 'changpricereason', // 数据索引:和Store模型对应
		sortable : true,// 是否可排序
		hidden : true,
		width : 120
	}, {
		header : '数量',
		dataIndex : 'totalcount',
		sortable : true,
		width : 40
	}, {
		header : '总金额',
		dataIndex : 'total',
		sortable : true,
		width : 70
	}, {
		header : '总重量',
		dataIndex : 'totalweight',
		sortable : true,
		width : 70,
		renderer : function(v) {
			return Number(v).toFixed(2);
		}
	}, {
		header : '发出门店',
		dataIndex : 'outwerksStr',
		sortable : true,
		width : 130
	}, {
		header : '发出门店出库系数',
		dataIndex : 'outwerksxs',
		hidden : true,
		sortable : true,
		width : 130
	}, {
		header : '发往门店',
		dataIndex : 'inwerksStr',
		sortable : true,
		width : 130
	}, {
		header : '出库日期',
		dataIndex : 'stockdate',
		sortable : true,
		width : 100
	// 列宽
	}, {
		header : '状态',
		dataIndex : 'statusStr',
		sortable : true,
		width : 80
	}, {
		header : '邮寄单号',
		dataIndex : 'postno',
		sortable : true,
		hidden : true,
		width : 120
	}, {
		header : '邮寄时间',
		dataIndex : 'posttime',
		sortable : true,
		width : 80
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
			url : 'reportSystem.ered?reqCode=getOutStockHeaderForNeedPrintLabel'
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
			name : 'outwerks'
		}, {
			name : 'totalcount'
		}, {
			name : 'totalweight'
		}, {
			name : 'inwerks'
		}, {
			name : 'outwerksStr'
		}, {
			name : 'inwerksStr'
		}, {
			name : 'outwerksxs'
		}, {
			name : 'inwerksxs'
		}, {
			name : 'stockdate'
		}, {
			name : 'status'
		}, {
			name : 'statusStr'
		}, {
			name : 'postno'
		}, {
			name : 'i_mblnr'
		}, {
			name : 'total'
		}, {
			name : 'weight'
		}, {
			name : 'posttime'
		}, {
			name : 'recievetime'
		}, {
			name : 'remark'
		}, {
			name : 'changpricereason'
		} ])
	});

	// 收货清单
	var cm2 = new Ext.grid.ColumnModel([

			rownum,// sm,
			{
				header : '编号',
				dataIndex : 'outid',
				sortable : true,
				hidden : true,
				width : 120
			},
			{
				header : '批号', // 列标题
				dataIndex : 'charg',
				editor : new Ext.form.TextField(),
				width : 100
			},
			{
				header : '物料号', // 列标题
				dataIndex : 'matnr',
				editor : new Ext.form.TextField(),
				width : 130
			},
			{
				header : '商品名称', // 列标题
				dataIndex : 'maktx',
				width : 130
			},
			{
				header : '数量',
				dataIndex : 'count',// 'zhlhxt',
				sortable : true,
				width : 40
			},
			{
				header : '重量',
				dataIndex : 'hpzl',// 'zhlhxt',
				sortable : true,
				width : 40
			},
			{
				header : '发出门店',
				dataIndex : 'outwerksStr',// 'ztjtf',
				sortable : true,
				width : 120
			},
			{
				header : '发出门店销售方式',
				dataIndex : 'outwerkssealmethod',
				sortable : true,
				width : 120
			},
			{
				header : '发出门店出库系数',
				dataIndex : 'outwerksxs',// 'ztjtf',
				sortable : true,
				width : 110
			},
			{
				header : '发往门店',
				dataIndex : 'inwerksStr',// 'ztjtf',
				sortable : true,
				width : 120
			},
			{
				header : '发往门店销售方式',
				dataIndex : 'inwerkssealmethod',
				sortable : true,
				width : 110
			},
			{
				header : '发往门店出库系数',
				dataIndex : 'inwerksxs',// 'ztjtf',
				sortable : true,
				width : 110
			},
			{
				header : '是否重新打标',
				dataIndex : 'ifneedprintlabel',// 'ztjtf',
				sortable : true,
				width : 110
			},
			{
				header : '是否更新价格',
				dataIndex : 'ifneedchangprice',// 'ztjtf',
				sortable : true,
				width : 110
			},
			{
				header : '出库库位',
				dataIndex : 'lgortStr',// 'ztjtf',
				sortable : true,
				width : 90
			},
			{
				header : '项目编号', // 列标题
				dataIndex : 'ebelp', // 数据索引:和Store模型对应
				sortable : true,// 是否可排序
				width : 70
			},
			{
				header : '出库门店标签价',
				dataIndex : 'bqj',
				sortable : true,
				width : 110
			},
			{
				header : '入库门店标签价',
				dataIndex : 'inwerksbqj',
				sortable : true,
				width : 110
			},
			{
				header : '公司标准价',
				dataIndex : 'companyprice',
				sortable : true,
				width : 80
			},
			{
				header : '金料',
				dataIndex : 'goldTypeStr',// 'zjlzl1',
				sortable : true,
				width : 100
			},
			{
				header : '金重',
				dataIndex : 'zclzl',// 'zjlzl1',
				sortable : true,
				width : 60
			},
			{
				header : '石料',
				dataIndex : 'toneTypeStr',// 'zjlzl1',
				sortable : true,
				width : 60
			},
			{
				header : '主石重',
				dataIndex : 'zzlnn',// 'zjlzl1',
				sortable : true,
				width : 60
			},
			{
				header : '石料净度',
				dataIndex : 'toneNeatNessStr',// 'zjlzl1',
				sortable : true,
				width : 60
			},
			{
				header : '颜色',
				dataIndex : 'toneColorStr',// 'ztjcd',
				sortable : true,
				width : 80
			},
			{
				header : '裸石证书',
				dataIndex : 'zszsb',// 'ztjcd',
				sortable : true,
				width : 80
			},
			{
				header : '整单差异',
				dataIndex : 'reasonStr',
				sortable : true,
				hidden : true,
				width : 120
			},
			{
				header : '整单差异说明',
				dataIndex : 'explain1',
				sortable : true,
				hidden : true,
				width : 120
			},
			{
				header : '图片',
				dataIndex : 'zmatnrt',// 'ztjcd',
				width : 80,
				renderer : function(v) {
					// return "<a href='http://www.baidu.com?word="+ v +"'
					// target='_blank' >"+v+"</a>"
					return "<img src='../../../sappic/" + v
							+ "' width='60px' height='60px' "
							+ "onError=\"this.src='./images/sample1.gif'\"/>"
				}

			} ]);

	// 会员消费情况数据
	var store2 = new Ext.data.Store({
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
			url : 'reportSystem.ered?reqCode=getInStockDetailForValidate'
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
			name : 'hpzl'
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
			name : 'lgortStr'// zhlhxt
		}, {
			name : 'zclzl'
		}, {
			name : 'maktx'
		}, {
			name : 'bqj'
		}, {
			name : 'kbetr'
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
			name : 'outwerks'
		}, {
			name : 'sealmethod'
		}, {
			name : 'companyprice'
		}, {
			name : 'inwerks'
		}, {
			name : 'outwerksStr'
		}, {
			name : 'inwerksStr'
		}, {
			name : 'outwerksxs'
		}, {
			name : 'inwerksxs'
		}, {
			name : 'outwerkssealmethod'
		}, {
			name : 'inwerkssealmethod'
		}, {
			name : 'ifneedprintlabel'
		}, {
			name : 'ifneedchangprice'
		}, {
			name : 'inwerksbqj'
		} ])
	});

	// 翻页排序时带上查询条件
	store.on('beforeload', function() {
		this.baseParams = {
			outtimeb : Ext.getCmp('outtimeb').getValue(),
			outtimee : Ext.getCmp('outtimee').getValue(),
			inwerks : Ext.getCmp('inwerks').getValue(),
			outwerks : Ext.getCmp('outwerks').getValue()
		};
	});
	// 每页显示条数下拉选择框
	var pagesize_combo = new Ext.form.ComboBox({
		name : 'pagesize',
		triggerAction : 'all',
		mode : 'local',
		store : new Ext.data.ArrayStore({
			fields : [ 'value', 'text' ],
			data : [ [ 10, '10条/页' ], [ 20, '20条/页' ], [ 50, '50条/页' ],
					[ 100, '100条/页' ], [ 250, '250条/页' ], [ 500, '500条/页' ] ]
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
		items : [ '-', '&nbsp;&nbsp;', pagesize_combo, '-', {
			xtype : 'label',
			text : '商品总数量：'
		}, '-', {
			xtype : 'label',
			id : 'count'
		}, '&nbsp;&nbsp;', {
			xtype : 'label',
			text : '商品总金额：'
		}, '-', {
			xtype : 'label',
			id : 'total'
		}, '&nbsp;&nbsp;', {
			xtype : 'label',
			text : '商品总重量：'
		}, '-', {
			xtype : 'label',
			id : 'totalweight1'
		} ]
	});
	
	var werksstore = new Ext.data.Store({
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
			url : 'reportSystem.ered?reqCode=getWerksInfo'
		}),
		// 数据读取器
		reader : new Ext.data.JsonReader({
			totalProperty : 'TOTALCOUNT', // 记录总数
			root : 'ROOT' // Json中的列表数据根节点
		}, [ {
			name : 'mdid'
		}, {
			name : 'mdname'
		} ])
	})
	
	
	werksstore.load({params:{
		vkorg:1000
		}});

	// 表格工具栏
	var tbar = new Ext.Toolbar({
		items : [ {
			emptyText : '出库日期开始',
			xtype : 'datefield',
			id : 'outtimeb',
			format : 'Y-m-d',
			width : 150
		}, '-',{
			emptyText : '出库日期结束',
			xtype : 'datefield',
			id : 'outtimee',
			format : 'Y-m-d',
			width : 150
		}, '-', {
			emptyText : '发出门店',
			xtype : 'combo',
			store : werksstore,
			triggerAction : 'all',
			mode : 'local',
			valueField : 'mdid', // option.value
			displayField : 'mdname', // option.text
			id : 'outwerks',
			width : 150
		}, '-', {
			emptyText : '发往门店',
			xtype : 'combo',
			store : werksstore,
			triggerAction : 'all',
			mode : 'local',
			valueField : 'mdid', // option.value
			displayField : 'mdname', // option.text
			id : 'inwerks',
			width : 150
		}, '-', {
			text : '查询',
			iconCls : 'page_findIcon',
			handler : function() {
				queryCatalogItem();
			}
		}, '-', {
			text : '刷新',
			iconCls : 'page_refreshIcon',
			handler : function() {
				queryCatalogItem();
			}
		} ]
	});

	// 表格下工具栏
	var bbar2 = new Ext.Toolbar({
		items : [ '-', {
			xtype : 'label',
			text : '总金额:'
		}, '&nbsp;', {
			xtype : 'label',
			id : 'kbetr'
		}, '-', '&nbsp;&nbsp;', {
			xtype : 'label',
			text : '总数量:'
		}, '&nbsp;', {
			xtype : 'label',
			id : 'menge'
		}, '-', '&nbsp;&nbsp;', {
			xtype : 'label',
			text : '总重量:'
		}, '&nbsp;', {
			xtype : 'label',
			id : 'totalweight2'
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
		height : 330,
		width : 940,
		frame : true,
		autoScroll : true,
		region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		store : store2, // 数据存储
		stripeRows : true, // 斑马线
		bbar : bbar2,// 下工具栏
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
			// alert(record.get('kunnr'));
			thirdWindow.show();
			store2.load({
				params : {
					outid : outid
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
				limit : bbar.pageSize,
				outtimeb : Ext.getCmp('outtimeb').getValue(),
				outtimee : Ext.getCmp('outtimee').getValue(),
				inwerks : Ext.getCmp('inwerks').getValue(),
				outwerks : Ext.getCmp('outwerks').getValue()
			},
			timeout : 12000000,
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
		return "<a href='javascript:void(0);'><img src='" + webContext
				+ "/resource/image/ext/edit1.png'/></a>";
		;
	}
	// 生成一个图标列
	function iconColumnRender2(value) {
		return "<a href='javascript:void(0);'><img src='" + webContext
				+ "/resource/image/ext/application_view_list.png'/></a>";
		;
	}

	//queryCatalogItem();

	





	// 入库操作
	var thirdWindow = new Ext.Window({
		title : '<span class="commoncss">调拨清单</span>', // 窗口标题
		// layout : 'fit', // 设置窗口布局模式
		width : 960, // 窗口宽度
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
		items : [ grid2 ], // 嵌入的表单面板
		closeAction : 'hide'
	});



	
	function getTotal() {

		var rows1 = grid.store.data.items;
		var count = 0;
		var total = 0;
		var totalweight1 = 0;
		for ( var i = 0; i < rows1.length; i++) {
			count = count + Number(rows1[i].get("goodscount"));
			total = total + Number(rows1[i].get("total"));
			totalweight1 = totalweight1 + Number(rows1[i].get("weight"));
		}
		Ext.getCmp("count").setText(count);
		Ext.getCmp("total").setText(total.toFixed(2));
		Ext.getCmp("totalweight1").setText(totalweight1.toFixed(3));

	}

	function getCount() {
		var rows1 = grid2.store.data.items;
		var count = 0;
		var total = 0;
		var totalweight2 = 0;
		for ( var i = 0; i < rows1.length; i++) {
			count = count + Number(rows1[i].get("count"));
			total = total + Number(rows1[i].get("bqj"));
			totalweight2 = totalweight2 + Number(rows1[i].get("hpzl"));
		}
		Ext.getCmp("kbetr").setText(total.toFixed(2));
		Ext.getCmp("menge").setText(count);
		Ext.getCmp("totalweight2").setText(totalweight2.toFixed(3));
	}

});