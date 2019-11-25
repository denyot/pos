/**
 * 货品收货功能
 * 
 * @author FengZhou
 * @since 2012-06-15
 */
Ext.onReady(function() {
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
	
	

	var diffStore = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
					url : 'stockSystem.ered?reqCode=getDiffInfo'
				}),
		reader : new Ext.data.JsonReader({}, [{
							name : 'id'
						}, {
							name : 'description'
						}, {
							name : 'type'
						}])
		});


		
		diffStore.load();	
	
	// 验货差异类型
	var diffInfo = new Ext.ux.form.LovCombo({
		anchor : '90%',
		maxHeight:200,
		emptyText : '请选择...',
			store:diffStore,
		triggerAction:'all',
		valueField:'id',
		displayField:'description',
		mode:'local'	
	});

	
	
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

	lgortInfo.load(); // 如果mode : 'local',时候才需要手动load();
	
	

	// 复选框
	var sm = new Ext.grid.CheckboxSelectionModel();

	// 定义自动当前页行号
	var rownum = new Ext.grid.RowNumberer({
				header : 'NO',
				width : 28
			});

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
				header : '数量',
				dataIndex : 'goodscount',
				sortable : true,
				width : 40
				// 列宽
		}, {
				header : '凭证编号', // 列标题
				dataIndex : 'i_mblnr',
				width : 100
			}, {
				header : '凭证年度', // 列标题
				dataIndex : 'i_mjahr',
				width : 100
			}	, {
				header : '来自门店',
				dataIndex : 'outwerks',
				sortable : true,
				width : 130
			}, {
				header : '出库日期',
				dataIndex : 'stockdate',
				sortable : true,
				width : 100
				// 列宽
		}	, {
				header : '状态',
				dataIndex : 'status',
				sortable : true,
				width : 40
			}, {
				header : '邮寄单号',
				dataIndex : 'postno',
				sortable : true,
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
			}]);

	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
				// 获取数据的方式
				proxy : new Ext.data.HttpProxy({
							url : 'stockSystem.ered?reqCode=getInStockHeaderForYHP'
						}),
				// 数据读取器
				reader : new Ext.data.JsonReader({
							root : 'ROOT' // Json中的列表数据根节点
						}, [{
									name : 'outid'
								}, {
									name : 'goodscount',
									type : 'int'
								}, {
									name : 'outwerks'
								}, {
									name : 'inwerks'
								}, {
									name : 'stockdate'
								}, {
									name : 'status'
								}, {
									name : 'postno'
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
								}])
			});

	// 收货清单
	var cm2 = new Ext.grid.ColumnModel([rownum, sm, {
				header : '编号',
				dataIndex : 'outid',
				sortable : true,
				hidden : true,
				width : 120
			}, {
				header : '物料号', // 列标题
				dataIndex : 'matnr',
				width : 100
			}, {
				header : '数量',
				dataIndex : 'goodscount',// 'zhlhxt',
				sortable : true,
				width : 40
			}, {
				header : '出库库位',
				dataIndex : 'outstock',// 'ztjtf',
				sortable : true,
				width : 60
			}, {
				header : '项目编号', // 列标题
				dataIndex : 'ebelp', // 数据索引:和Store模型对应
				sortable : true,// 是否可排序
				width : 60
			}, {
				header : '商品名称', // 列标题
				dataIndex : 'zhlhxt',
				width : 110
			}, {
				header : '标签价',
				dataIndex : 'ztjtf',
				sortable : true,
				hidden : true,
				width : 50
			}, {
				header : '金重',
				dataIndex : 'zjlzl1',// 'zjlzl1',
				sortable : true,
				hidden : true,
				width : 40
			}, {
				header : '工费',
				dataIndex : 'ztjcd',// 'ztjcd',
				sortable : true,
				hidden : true,
				width : 40
			}, {
				header : '图片',
				dataIndex : 'zmatnrt',// 'ztjcd',
				width : 80,
				renderer : function(v) {
					// return "<a href='http://www.baidu.com?word="+ v +"'
					// target='_blank' >"+v+"</a>"
					return "<img src='../../../sappic/" + v + "' width='60px' height='60px' "
							+ "onError=\"this.src='./images/sample1.gif'\"/>"
				}

			}, {
				header : '库位',
				dataIndex : 'itemLgort',
				width : 100,
				editor : new Ext.form.ComboBox({
					triggerAction : 'all',
					store : lgortInfo,
					displayField : 'lgobe',
					valueField : 'lgort',
					mode : 'local', 
					width : '80'
				})
			}, {
				header : '原因',
				sortable : true,
				dataIndex : 'reason',
				width : 240,
				editor: diffInfo
			}, {
				header : '说明',
				dataIndex : 'explain',
				sortable : true,
				width : 120,
				editor : new Ext.form.TextArea()
			}, {
				header : '处理',
				dataIndex : 'manage',
				sortable : true,
				width : 120,
				editor : new Ext.form.TextArea()
			}]);
			
			var	comStore1 = new Ext.data.Store({});
			
			
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

			lgortInfo.load(); // 如果mode : 'local',时候才需要手动load();
			

	var store2 = new Ext.data.Store({
				// 获取数据的方式
				proxy : new Ext.data.HttpProxy({
							url : 'stockSystem.ered?reqCode=getInStockDetailForYHP',
							method : 'GET'
						}),
				// 数据读取器
				reader : new Ext.data.JsonReader({
							root : 'ROOT' // Json中的列表数据根节点
						}, [{
									name : 'outid'
								}, {
									name : 'matnr'
								}, {
									name : 'ebelp'
								}, {
									name : 'goodscount',
									type : 'int'
								}, {
									name : 'outstock'
								}, {
									name : 'instock'// zhlhxt
								}, {
									name : 'zjlzl1'
								}, {
									name : 'zhlhxt'
								}, {
									name : 'ztjtf'
								}, {
									name : 'ztjcd'
								}, {
									name : 'zmatnrt'
								}])
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
				}]
			});

	// 表格工具栏
	var tbar = new Ext.Toolbar({
				items : [{
							text : '刷新',
							iconCls : 'page_refreshIcon',
							handler : function() {
								store.reload();
							}
						}, '-', {
							text : '查询条件',
							iconCls : 'arrow_switchIcon',
							handler : function() {
								firstWindow.show();
							}
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
		} ]
	});

	// 表格实例
	var grid2 = new Ext.grid.EditorGridPanel({
				// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
				height : 300,
				frame : true,
				autoScroll : true,
				clicksToEdit:1,
				region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
				store : store2, // 数据存储
				stripeRows : true, // 斑马线
				cm : cm2, // 列模型
				sm : sm, // 复选框
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
					
					var i_mblnr = record.get('i_mblnr');
					var i_mjahr = record.get('i_mjahr');
					var outid = record.get('outid');
					
					Ext.getCmp('i_mblnr').setValue(i_mblnr);
					Ext.getCmp('i_mjahr').setValue(i_mjahr);
					Ext.getCmp('outid').setValue(outid);
					
					
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
		                limit : bbar.pageSize,
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
		return "<a href='javascript:void(0);'><img src='" + webContext
				+ "/resource/image/ext/edit1.png'/></a>";;
	}
	// 生成一个图标列
	function iconColumnRender2(value) {
		return "<a href='javascript:void(0);'><img src='" + webContext
				+ "/resource/image/ext/application_view_list.png'/></a>";;
	}

	// queryCatalogItem();

	store.load({
			callback : function(){
				getTotal();
			}
	});

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
				items : [{
							layout : 'column',
							border : false,
							items : [{
										columnWidth : .3,
										layout : 'form',
										border : false,
										anchor : '80%',
										items : [{
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
													editable : false,
													// value : '530101',
													anchor : '70%'

												}]
									}, {
										columnWidth : .1,
										layout : 'form',
										border : false,
										items : [{
													xtype : 'button',
													name : 'submit',
													text : '入库',
													anchor : '80%',
													handler : getCheckboxValues
												}]

									}, {
										columnWidth : .1,
										layout : 'form',
										border : false,
										items : [{
													xtype : 'button',
													name : 'submit',
													text : '打回',
													anchor : '80%',
													handler : cancleStock
												}]

									}]
						}]
			});

	lgortInfo.load(); // 如果mode : 'local',时候才需要手动load();

	var searchText = new Ext.form.TextField({
				id : 'searchText',
				name : 'searchText',
				fieldLabel : '输入或条码信息',
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
				items : [{
							layout : 'column',
							border : false,
							items : [{
										columnWidth : .3,
										layout : 'form',
										border : false,
										anchor : '80%',
										items : [searchText]
									}, {
										columnWidth : .1,
										layout : 'form',
										border : false,
										items : [{
													xtype : 'button',
													name : 'submit',
													text : '查找',
													anchor : '80%',
													handler : search
												}]

									}, {
										columnWidth : .3,
										layout : 'form',
										border : false,
										items : [{
													xtype : 'textfield',
													name : 'i_mblnr',
													id : 'i_mblnr',
													fieldLabel : '物料凭证号',
													readOnly:true,
													anchor : '80%'
												}]

									}, {
										columnWidth : .3,
										layout : 'form',
										border : false,
										items : [{
													xtype : 'textfield',
													name : 'i_mjahr',
													id : 'i_mjahr',
													fieldLabel : '凭证年度',
													readOnly:true,
													anchor : '60%'
												}]

									}, {
										columnWidth : .3,
										layout : 'form',
										border : false,
										items : [{
													xtype : 'textfield',
													// name : 'outid',
													id : 'outid',
													fieldLabel : '出库编号',
													readOnly:true,
													anchor : '90%'
												}]

									}]
						}]
			});

	function search() {
		var searchText = Ext.get("searchText").getValue();
		var view = grid2.getView();
		for (var i = 0; i < store2.getCount(); i++) {
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
		items : [searchForm,grid2,submitForm]
			// ,
			// tbar :[submitForm],
			// bbar :[submitForm]
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
				items : [oppanel], // 嵌入的表单面板
				closeAction : 'hide'
			});

	// 获取选择行
	function getCheckboxValues() {

		var chargs = "";
		var ebelp = "";
		var reason = "";
		var explain = "";
		var manage = "";
		var i_mblnr = Ext.getCmp('i_mblnr').getValue();
		var i_mjahr = Ext.getCmp('i_mjahr').getValue();
		var outid = Ext.getCmp('outid').getValue();
		
		// 返回一个行集合JS数组
		var rows = grid2.getSelectionModel().getSelections();
		if (Ext.isEmpty(rows)) {
			Ext.MessageBox.alert('提示', '您没有选中任何数据!');
			return;
		}
		// alert(rows.length);

		for (var i = 0; i < rows.length; i++) {
			chargs += rows[i].get("charg") + ',';
			ebelp += rows[i].get("ebelp") + ',';
			reason += rows[i].get('reason') + ',';
			explain += rows[i].get('explain') + ',';
			manage += rows[i].get('manage') + ',';
		}
		
		var lgort = Ext.getCmp("position").getValue();
		alert(lgort);
		if (lgort == "") {
			Ext.Msg.alert("提示", "请选择正确的库位！！");
			return;
		}
		chargs = chargs.substring(0, chargs.length - 1);
		// 将JS数组中的行级主键，生成以,分隔的字符串
		var positionIds = jsArray2JsString(rows, 'BWTAR');
		Ext.MessageBox.alert('提示', positionIds);
		// 获得选中续数据后则可以传入后台继处理

		Ext.Msg.confirm("提示", "确定入库吗？", function(btn, text) {
					if (btn == "yes") {
						  var myMask = new Ext.LoadMask(Ext.getBody(), {
					          msg: '正在提交中，请稍后...',
					          removeMask: true //完成后移除
					      });
					      myMask.show();
						Ext.Ajax.request({
									url : 'stockSystem.ered?reqCode=inStockForWerks',
									method : 'post',
									params : {
										lgort : lgort,
										chargs : chargs,
										ebelp : ebelp,
										i_mblnr : i_mblnr,
										i_mjahr : i_mjahr,
										outid : outid,
										reason : reason,
										explain : explain,
										manage : manage
									},
									success : function() {
										myMask.hide();
										Ext.Msg.alert("提示", "收货成功！！");
										store.reload();
										thirdWindow.hide();
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

		for (var i = 0; i < rows.length; i++) {
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
	
	function getTotal() {

		var rows1 = grid.store.data.items;
		var count = 0;
		for ( var i = 0; i < rows1.length; i++) {
			count = count + Number(rows1[i].get("goodscount"));
		}
		Ext.getCmp("count").setText(count);

	}

	function getCount() {
		var rows1 = grid2.store.data.items;
		var count = 0;
		var total = 0;
		for ( var i = 0; i < rows1.length; i++) {
			count = count + Number(rows1[i].get("goodscount"));
		}
		Ext.getCmp("menge").setText(count);

	}


});