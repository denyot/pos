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

	Ext.Ajax.timeout = 120000;

	Ext.data.Connection.prototype.timeout = '300000';

	var currentId = "";

	// 定义列模型
	var cm = new Ext.grid.ColumnModel([rownum, {
				header : '详细', // 列标题
				dataIndex : 'showdetail',
				width : 35,
				renderer : iconColumnRender2
			}, {
				header : '编号', // 列标题
				dataIndex : 'outid', // 数据索引:和Store模型对应
				sortable : true,// 是否可排序
				width : 150
			}, {
				header : '货品类型', // 列标题
				dataIndex : 'goodtypeStr', // 数据索引:和Store模型对应
				sortable : true,// 是否可排序
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
				header : '发往门店出库系数',
				dataIndex : 'inwerksxs',
				sortable : true,
				hidden : true,
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
				header : '邮寄人',
				hidden : true,
				dataIndex : 'mailman',
				sortable : true,
				width : 120
			}, {
				header : '邮寄时间',
				dataIndex : 'posttime',
				hidden : true,
				sortable : true,
				width : 80
			}, {
				header : '备注',
				dataIndex : 'remark',
				sortable : true,
				width : 120
			}]);

	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
					url : 'stockSystem.ered?reqCode=getOutStockHeaderForValidate'
				}),
		// 数据读取器
		reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT', // 记录总数
					root : 'ROOT' // Json中的列表数据根节点
				}, [{
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
							name : 'mailman'
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
							name : 'goodtypeStr'
						}])
	});
	
	/**
	var sealmethodStore = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : 'stockSystem.ered?reqCode=getSealMethod'
		}),
		reader : new Ext.data.JsonReader({}, [{
			name : 'zxsfs'
		}, {
			name : 'txsfs'
		} ])
	});
	**/
	var sealmethodStore = new Ext.data.ArrayStore({
        fields: ['txsfs', 'zxsfs'],
        data :[
               ["123、一口价产品","123、一口价产品"],
               ["127、正价产品","127、正价产品"],
               ["126、按克销售","126、按克销售"],
               ["121、特价产品","121、特价产品"]
              ]
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
			}, {
				header : '批号', // 列标题
				dataIndex : 'charg',
				editor : new Ext.form.TextField(),
				width : 100
			}, {
				header : '物料号', // 列标题
				dataIndex : 'matnr',
				editor : new Ext.form.TextField(),
				width : 130
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
				header : '发出门店',
				dataIndex : 'outwerksStr',// 'ztjtf',
				sortable : true,
				width : 120
			}, {
				header : '发出店销售方式',
				dataIndex : 'sealmethod',
				sortable : true,
				width : 100
			}, {
				header : '发出门店出库系数',
				dataIndex : 'outwerksxs',// 'ztjtf',
				sortable : true,
				width : 110
			}, {
				header : '发往门店',
				dataIndex : 'inwerksStr',// 'ztjtf',
				sortable : true,
				width : 120
			}, {
				header : '发往店销售方式',
				dataIndex : 'sealmethodTo',
				sortable : true,
				editor : new Ext.form.ComboBox({
							triggerAction : 'all',
							store : sealmethodStore,
							displayField : 'txsfs',
							valueField : 'zxsfs',
							mode : 'local',
							width : '80'
						}),
				width : 100
			}, {
				header : '发往门店出库系数',
				dataIndex : 'inwerksxs',// 'ztjtf',
				sortable : true,
				width : 110
			}, {
				header : '是否需要重新打印标签',
				dataIndex : 'ifneedprintLabel',
				sortable : true,
				editor : new Ext.form.ComboBox({
							triggerAction : 'all',
							store : new Ext.data.ArrayStore({
										fields : ['value', 'text'],
										data : [['1、是', '1、是'], ['2、否', '2、否']]
									}),
							displayField : 'text',
							valueField : 'value',
							mode : 'local',
							width : '80'
						}),
				width : 123
			}, {
				header : '是否需要修改零售价',
				dataIndex : 'ifneedchangPrice',
				editor : new Ext.form.ComboBox({
							triggerAction : 'all',
							store : new Ext.data.ArrayStore({
										fields : ['value', 'text'],
										data : [['1、是', '1、是'], ['2、否', '2、否']]
									}),
							displayField : 'text',
							valueField : 'value',
							mode : 'local',
							width : '80'
						}),
				sortable : true,
				width : 120
			}, {
				header : '出库库位',
				dataIndex : 'lgortStr',// 'ztjtf',
				sortable : true,
				width : 90
			}, {
				header : '项目编号', // 列标题
				dataIndex : 'ebelp', // 数据索引:和Store模型对应
				sortable : true,// 是否可排序
				width : 70
			}, {
				header : '商品名称', // 列标题
				dataIndex : 'maktx',
				width : 130
			}, {
				header : '标签价',
				dataIndex : 'bqj',
				sortable : true,
				width : 60
			}, {
				header : '公司标准价',
				dataIndex : 'companyprice',
				sortable : true,
				width : 80
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
				header : '整单差异',
				dataIndex : 'reasonStr',
				sortable : true,
				hidden : true,
				width : 120
			}, {
				header : '整单差异说明',
				dataIndex : 'explain1',
				sortable : true,
				hidden : true,
				width : 120
			}, {
				header : '备注',
				dataIndex : 'remark',
				sortable : true,
				width : 120
			}, {
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

			}]);

	// 会员消费情况数据
	var store2 = new Ext.data.Store({
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
					url : 'stockSystem.ered?reqCode=getInStockDetailForValidate'
				}),
		// 数据读取器
		reader : new Ext.data.JsonReader({
					root : 'ROOT' // Json中的列表数据根节点
				}, [{
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
							name : 'remark'
						}, {
							name : 'zszsb'
						}, {
							name : 'goodzs'
						}])
	});

	// 翻页排序时带上查询条件
	store.on('beforeload', function() {
				this.baseParams = {
					status : '0'
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
				items : ['-', '&nbsp;&nbsp;', pagesize_combo, '-', {
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
						}]
			});

	// 表格工具栏
	var tbar = new Ext.Toolbar({
				items : [{
							text : '查询',
							iconCls : 'page_refreshIcon',
							handler : function() {
								queryCatalogItem();
							}
						}
//						, '-', {
//							text : '查询条件',
//							iconCls : 'arrow_switchIcon',
//							handler : function() {
//								firstWindow.show();
//							}
//						}
						]
			});

	// 表格下工具栏
	var bbar2 = new Ext.Toolbar({
				items : ['-', {
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
						}]
			});

	// 表格右键菜单
	var contextmenu = new Ext.menu.Menu({
				id : 'theContextMenu',
				items : [{
							text : '查看详情',
							iconCls : 'previewIcon',
							handler : function() {
								// 获取当前选择行对象
								var record = grid.getSelectionModel()
										.getSelected();
								var assistant_name = record
										.get('assistant_name');
								Ext.MessageBox.alert('提示', assistant_name);
							}
						}, {
							text : '导出列表',
							iconCls : 'page_excelIcon',
							handler : function() {
								// 获取当前选择行对象
								var record = grid.getSelectionModel()
										.getSelected();
								var assistant_name = record
										.get('assistant_name');
								Ext.MessageBox.alert('提示', assistant_name);
							}
						}]
			});

	// 表格实例
	var grid = new Ext.grid.GridPanel({
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
				height : 320,
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

	// 页面初始自动查询数据
	// store.load({params : {start : 0,limit : bbar.pageSize}});

	// 小画笔点击事件
	grid.on("cellclick", function(pGrid, rowIndex, columnIndex, e) {
				var store = pGrid.getStore();
				var record = store.getAt(rowIndex);
				var fieldName = pGrid.getColumnModel()
						.getDataIndex(columnIndex);
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
					lgortInfoCombo.clearValue();
					currentId = outid;
					//lgortInfo.reload();
					//sealmethodStore.reload();
					thirdWindow.show();
					submitForm.form.reset();
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
				items : [grid]
			});

	// 查询表格数据
	function queryCatalogItem() {
		store.load({
			params : {
				start : 0,
				limit : bbar.pageSize
			},
			//timeout : 12000000,
			callback : function(records, options, success) {
				//getTotal();
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
				+ "/resource/image/ext/edit1.png'/></a>";;
	}
	// 生成一个图标列
	function iconColumnRender2(value) {
		return "<a href='javascript:void(0);'><img src='" + webContext
				+ "/resource/image/ext/application_view_list.png'/></a>";;
	}

	//queryCatalogItem();

	// store.load();

	var lgortInfo = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : 'stockSystem.ered?reqCode=getLgort'
						}),
				reader : new Ext.data.JsonReader({}, [{
									name : 'werks'
								}, {
									name : 'lgort'
								}, {
									name : 'lgobe'
								}])
			});

	//lgortInfo.load(); // 如果mode : 'local',时候才需要手动load();

	var lgortInfoCombo = new Ext.form.ComboBox({
				hiddenName : 'position',
				id : 'position',
				fieldLabel : '请选择库位',
				emptyText : '请选择库位',
				// triggerAction : 'all',
				store : lgortInfo,
				displayField : 'lgobe',
				valueField : 'lgort',
				loadingText : '正在加载数据...',
				mode : 'local', // 数据会自动读取,如果设置为local又调用了store.load()则会读取2次；也可以将其设置为local，然后通过store.load()方法来读取
				// forceSelection : true,
				// typeAhead : true,
				// resizable : true,
				editable : false,
				anchor : '100%'
			});

	var sealMethodCombo = new Ext.form.ComboBox({
				//hiddenName : 'sealMethod',
				id : 'sealMethod',
				fieldLabel : '销售方式',
				emptyText : '请选择...',
				 triggerAction : 'all',
				store : sealmethodStore,
				displayField : 'zxsfs',
				valueField : 'zxsfs',
				loadingText : '正在加载数据...',
				mode : 'local', // 数据会自动读取,如果设置为local又调用了store.load()则会读取2次；也可以将其设置为local，然后通过store.load()方法来读取
				// forceSelection : true,
				// typeAhead : true,
				// resizable : true,
				editable : false,
				anchor : '100%'
			});
			

	// var sealMethodCombo = new Ext.form.ComboBox({
	// // id:'diffinfoid',
	// // name:'diffinfoname',
	// anchor : '90%',
	// // hideOnSelect:true,
	// maxHeight : 100,
	// // editable:false,
	// emptyText : '请选择...',
	// store : new Ext.data.ArrayStore({
	// fields : [ 'value', 'text' ],
	// data : [ [ 1, '通过' ], [ 3, '驳回' ] ]
	// }),
	// triggerAction : 'all',
	// valueField : 'value',
	// displayField : 'text',
	// mode : 'local'
	// });

	var reasonCombo = new Ext.form.ComboBox({
				hiddenName : 'reason',
				id : 'myreason',
				fieldLabel : '请选择结果',
				emptyText : '请选择...',
				triggerAction : 'all',
				store : new Ext.data.ArrayStore({
							fields : ['value', 'text'],
							data : [[1, '通过'], [3, '驳回']]
						}),
				valueField : 'value',
				displayField : 'text',
				mode : 'local', // 数据会自动读取,如果设置为local又调用了store.load()则会读取2次；也可以将其设置为local，然后通过store.load()方法来读取
				editable : false,
				anchor : '100%'
			});
			
	var printLabelCombo = new Ext.form.ComboBox({
					hiddenName : "printLabel2",
					fieldLabel : '重打标签',
					emptyText : '请选择...',
					triggerAction : 'all',
					store : new Ext.data.ArrayStore({
								fields : ['value', 'text'],
								data : [['1、是', '1、是'], ['2、否', '2、否']]
							}),
					displayField : 'text',
					valueField : 'value',
					mode : 'local',
					anchor : '90%'
				});
	var gsyqLabelCombo = new Ext.form.ComboBox({
		hiddenName : "gsyqname",
		fieldLabel : '要求',
		emptyText : '请选择...',
		triggerAction : 'all',
		store : new Ext.data.ArrayStore({
					fields : ['value', 'text'],
					data : [['0', '公司要求'], ['1', '门店要求']]
				}),
		displayField : 'text',
		valueField : 'value',
		mode : 'local',
		anchor : '90%'
	});
	var updatePriceCombo = new Ext.form.ComboBox({
					hiddenName : "updatePrice2",
					fieldLabel : '更新价格',
					emptyText : '请选择...',
					triggerAction : 'all',
					store : new Ext.data.ArrayStore({
								fields : ['value', 'text'],
								data : [['1、是', '1、是'], ['2、否', '2、否']]
							}),
					displayField : 'text',
					valueField : 'value',
					mode : 'local',
					anchor : '90%'
				})

	var submitForm = new Ext.form.FormPanel({
				id : 'secondForm',
				name : 'secondForm',
				layout : 'form',
				labelWidth : 90, // 标签宽度
				// frame : true, // 是否渲染表单面板背景色
				// defaultType : 'textfield', // 表单元素默认类型
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:5 5 5 5', // 表单元素和表单面板的边距
				items : [{
							layout : 'column',
							border : false,
							items : [{
										columnWidth : .2,
										layout : 'form',
										border : false,
										items : [reasonCombo]

									}, {
										columnWidth : .24,
										layout : 'form',
										border : false,
										items : [{
													xtype : 'textfield',
													id : 'rejreason',
													fieldLabel : '原因',
													anchor : '100%'
												}]
									}, {
										columnWidth : .3,
										layout : 'form',
										border : false,
										items : sealMethodCombo

									}, {
										columnWidth : .3,
										layout : 'form',
										border : false,
										items : printLabelCombo
									}, {
										columnWidth : .3,
										layout : 'form',
										border : false,
										items : updatePriceCombo
									
//									}, {
//										columnWidth : .2,
//										layout : 'form',
//										border : false,
//										hidden : true,
//										items : {
//													xtype : 'checkbox',
//													id : 'updateprice',
//													fieldLabel : '请勾选需要更新标签价的项目',
//													anchor : '80%'
//												}
									}, {
										columnWidth : .3,
										layout : 'form',
										border : false,
										items : gsyqLabelCombo
									
									},{
										columnWidth : .3,
										layout : 'form',
										border : false,
										items : [
											 {
												fieldLabel : '规定操作日期',
												xtype : 'datefield',
												id : 'cssjtime',
												format : 'Y-m-d'
											}
											
	
										]
									
									},
									
									
									 {
										columnWidth : .1,
										layout : 'form',
										border : false,
										items : [{
													xtype : 'button',
													name : 'submit',
													text : '提交',
													anchor : '80%',
													handler : cancleStock
												}]

									}]
						}]
			});

	// 入库操作
	var thirdWindow = new Ext.Window({
				title : '<span class="commoncss">调入清单</span>', // 窗口标题
				// layout : 'fit', // 设置窗口布局模式
				width : 950, // 窗口宽度
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
				items : [submitForm, grid2], // 嵌入的表单面板
				closeAction : 'hide'
			});

	// 获取选择行
	function getCheckboxValues() {

		var chargs = "";
		var ebeln = "";
		// var matnr = "";

		// 返回一个行集合JS数组
		var rows = grid2.getSelectionModel().getSelections();
		if (Ext.isEmpty(rows)) {
			Ext.MessageBox.alert('提示', '您没有选中任何数据!');
			return;
		}
		// alert(rows.length);

		for (var i = 0; i < rows.length; i++) {
			chargs += rows[i].get("BWTAR") + ',';
			// matnr += rows[i].get("matnr") + ',';
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

		Ext.Msg.confirm("提示", "确定删除吗？", function(btn, text) {
					if (btn == "yes") {
						Ext.Ajax.request({
									url : 'stockSystem.ered?reqCode=inStock',
									method : 'post',
									params : {
										logrt : logrt,
										chargs : chargs,
										ebeln : ebeln
									},
									timeout : 12000000,
									success : function() {
										Ext.Msg.alert("提示", "收货成功！！");
										thirdWindow.hide();
									}
								});
					}

				});

	}

	function cancleStock() {
		var status = reasonCombo.getValue();
		var rejreason = Ext.getCmp("rejreason").getValue();
		//var changPriceReason = Ext.getCmp("changPriceReason").getValue();
		// var updateprice = Ext.getCmp("updateprice").getValue();
		var updateItem = '';
		var needprintlabel = 0;
		
		var cssjvalue = Ext.getCmp("cssjtime").getValue();
		var cssj = cssjvalue?cssjvalue.format('Y-m-d'):"";
		var gsyq = gsyqLabelCombo.getValue();
		
		var sealMethod = sealMethodCombo.getValue();
		var ifneedPrintLabel = printLabelCombo.getValue();
		var ifneedUpdatePrice = updatePriceCombo.getValue();
		
//		alert(sealMethod);
//		alert(ifneedPrintLabel);
//		alert(ifneedUpdatePrice);

		if (status == null || status == '') {
			Ext.Msg.alert("提示", "请先选择审批状态!", function(e) {
					});
			return;
		}
		
		var rows = grid2.store.data.items;
		var count = 0;
		for (var i = 0; i < rows.length; i++) {

			var inwerksxs = Number(rows[i].get("inwerksxs") != null ? rows[i]
					.get("inwerksxs") : '0');
			var outwerksxs = Number(rows[i].get("outwerksxs") != null ? rows[i]
					.get("outwerksxs") : '0');

			if( rows[i].get("ifneedprintLabel")=='1、是'){// ||  (rows[i].get("ifneedchangPrice") != null &&  rows[i].get("ifneedchangPrice") != '')){ //(inwerksxs != outwerksxs) {
				needprintlabel = 1;
			}
			// alert(inwerksxs);
			// alert(outwerksxs);

			updateItem += count + ":{";
			updateItem += "'charg':'" + rows[i].get("charg") + "',";
			updateItem += "'companyprice':'" + (rows[i].get("companyprice") == null||rows[i].get("companyprice")=='' ? '0' : rows[i].get("companyprice")) + "',";
			updateItem += "'bqj':'" + ((rows[i].get("bqj")!=null&&rows[i].get("bqj")!='')? rows[i].get("bqj") : '0') + "',";
			updateItem += "'outwerkssealmethod':'" + (rows[i].get("sealmethod") == null ? '':rows[i].get("sealmethod")) + "',";
			updateItem += "'inwerkssealmethod':'" + ((rows[i].get("sealmethodTo") == null || rows[i].get("sealmethodTo") == '') ? sealMethod :  rows[i].get("sealmethodTo")) + "',";
			updateItem += "'ifneedprintLabel':'" + ((rows[i].get("ifneedprintLabel") == null || rows[i].get("ifneedprintLabel") == '') ? ifneedPrintLabel : rows[i].get("ifneedprintLabel")) + "',";
			updateItem += "'ifneedchangPrice':'" + ((rows[i].get("ifneedchangPrice") == null || rows[i].get("ifneedchangPrice") == '') ? ifneedUpdatePrice : rows[i].get("ifneedchangPrice")) + "',";
			updateItem += "'inwerksxs':'" + inwerksxs + "'}";

			updateItem += ",";
			count++;
			// updatepricecharg = updatepricecharg+rows[i].get("charg") + ",";
		}
		updateItem = "{" + updateItem.substring(0, updateItem.length - 1) + "}";
		//alert(updateItem);
		// updatepricecharg = updatepricecharg.substri;ng(0,
		// updatepricecharg.length-1)
		// if(updateprice){
		// updateprice = 1;
		// }else{
		// updateprice = 0;
		// }
		// alert(rejreason);
		
		if(ifneedPrintLabel == '1、是'){
			needprintlabel = 1;
		}
		
		Ext.Msg.confirm("提示", "确定提交吗？", function(btn, text) {
					if (btn == "yes") {
						 Ext.MessageBox.show({
				           msg: '正在保存数据，请稍后....',
				           progressText: 'Saving...',
				           width:300,
				           wait:true,
				           waitConfig: {interval:200},
				           icon:'saving_data'//, //custom class in msg-box.html
				           //animateTarget: 'mb7'
				       });
						
//						var myMask = new Ext.LoadMask(Ext.getBody(), {
//							msg : '正在提交中，请稍后...',
//							removeMask : true
//								// 完成后移除
//							});
//						myMask.show();
						Ext.Ajax.request({
									url : 'stockSystem.ered?reqCode=submitValidate',
									method : 'post',
									params : {
										outid : currentId,
										rejreason : rejreason,
										gsyq:gsyq,
										cssj:cssj,
										//changPriceReason : changPriceReason,
										needprintlabel : needprintlabel,
										updateItem : updateItem,
										status : status
									},
									timeout : 12000000,
									success : function(data) {
//										myMask.hide();
										Ext.MessageBox.hide();
										var retData = Ext
												.decode(data.responseText);
										if (retData.error != null) {
											Ext.Msg
													.alert("提示失败",
															retData.error);
										} else if (retData.success != null) {
											Ext.Msg.alert("提示成功",
													retData.success,
													function(e) {
														thirdWindow.hide();
														store.reload();
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
		var totalweight1 = 0;
		for (var i = 0; i < rows1.length; i++) {
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
		for (var i = 0; i < rows1.length; i++) {
			count = count + Number(rows1[i].get("count"));
			total = total + Number(rows1[i].get("bqj"));
			totalweight2 = totalweight2 + Number(rows1[i].get("hpzl"));
		}
		Ext.getCmp("kbetr").setText(total.toFixed(2));
		Ext.getCmp("menge").setText(count);
		Ext.getCmp("totalweight2").setText(totalweight2.toFixed(3));
	}

});