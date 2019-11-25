/**
 * 货品收货功能
 * 
 * @author FengZhou
 * @since 2012-06-15
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
			
	Ext.Ajax.request({
		url : 'stockSystem.ered?reqCode=getVkorg',
		dataType :'json',
		success : function(response, options){
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

	// 定义列模型
	var cmPart1 = new Ext.grid.ColumnModel([rownum, {
				header : '详细', // 列标题
				dataIndex : 'showdetail',
				width : 35,
				renderer : iconColumnRender2
			}, {
				header : '采购凭证号', // 列标题
				dataIndex : 'EBELN', // 数据索引:和Store模型对应
				sortable : true,// 是否可排序
				width : 90
			}, {
				header : '创建人',
				dataIndex : 'ERNAM',
				sortable : true,
				width : 90
				// 列宽
		}	, {
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
		}	, {
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
			}]);
	// 定义列模型
	var cmPart2 = new Ext.grid.ColumnModel([rownum, {
				header : '详细', // 列标题
				dataIndex : 'showdetail',
				width : 35,
				renderer : iconColumnRender2
			},{
				header : '日期',
				dataIndex : 'DATUM',
				sortable : true,
				width : 120
			}, {
				header : '邮件编号',
				dataIndex : 'ZYBNM',
				sortable : true,
				width : 120
			}, {
				header : '销售和分销凭证的项目号',
				dataIndex : 'POSNR',
				sortable : true,
				width : 120
			}, {
				header : '销售和分销凭证号',
				dataIndex : 'VBELN',
				sortable : true,
				width : 120
			}, {
				header : '邮寄方式',
				dataIndex : 'ZYJFS',
				sortable : true,
				width : 120
			}, {
				header : '邮件类型',
				dataIndex : 'ZYJLX',
				sortable : true,
				width : 120
			}, {
				header : '寄件人名称',
				dataIndex : 'NAAM0',
				sortable : true,
				width : 120
			}, {
				header : '地点',
				dataIndex : 'WERKS_C',
				sortable : true,
				width : 120
			}, {
				header : '地点',
				dataIndex : 'WERKS_S',
				sortable : true,
				width : 120
			}, {
				header : '邮寄明细',
				dataIndex : 'ZYJMX',
				sortable : true,
				width : 120
			}]);
			
		cm = cmPart2;

	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
				// 获取数据的方式
				proxy : new Ext.data.HttpProxy({
							url : 'stockSystem.ered?reqCode=getReceiveGoodsHeadForYHP'
						}),
				// 数据读取器
				reader : new Ext.data.JsonReader({
							root : 'ROOT' // Json中的列表数据根节点
						}, [{
									name : 'EBELN'
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
									name : 'ZYJLX'
								}, {
									name : 'NAAM0'
								}, {
									name : 'WERKS_C'
								}, {
									name : 'WERKS_S'
								}, {
									name : 'ZYJMX'
								}])
			});
			
			
			
	store.load();

	var countries = [['US', 'United States'], ['UK', 'United Kingdom'],
			['DE', 'Germany'], ['F', 'France'], ['NL', 'Netherlands'],
			['SK', 'Slovakia'], ['JP', 'Japan'], ['A', 'Austria'],
			['CA', 'Canada']];
	var combo = new Ext.form.ComboBox({
				store : new Ext.data.SimpleStore({
							fields : ['countryCode', 'countryName'],
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
	var cm2 = new Ext.grid.ColumnModel([rownum, sm, {
				header : '批次',
				dataIndex : 'CHARG',
				sortable : true,
				width : 80
			}, {
				header : '物料号', // 列标题
				dataIndex : 'MATNR',
				width : 90
			}, {
				header : '名称',
				dataIndex : 'zhlhxt',
				sortable : true,
				width : 90
			}, {
				header : '标签价',
				dataIndex : 'ztjtf',
				sortable : true,
				width : 50
			}, {
				header : '项目编号', // 列标题
				dataIndex : 'EBELP', // 数据索引:和Store模型对应
				sortable : true,// 是否可排序
				width : 60
			}, {
				header : '采购凭证号', // 列标题
				dataIndex : 'VBELN',
				width : 100
			}, {
				header : '数量',
				dataIndex : 'MENGE',
				sortable : true,
				width : 40
			}, {
				header : '金重',
				dataIndex : 'zjlzl1',
				sortable : true,
				width : 40
			}, {
				header : '工费',
				dataIndex : 'ztjcd',
				sortable : true,
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
				header : '原因',
				sortable : true,
				width : 110,
				renderer : function(v) {
					return "<select><option>请选择...</option><option>损坏</option><option>丢失</option><option>镶嵌错误</option></select>"
				}
			}, {
				header : '说明',
				sortable : true,
				width : 100,
				renderer : function(v) {
					return "<textarea rows='3' cols='10' ></textarea>"
				}
			}, {
				header : '处理',
				sortable : true,
				width : 100,
				renderer : function(v) {
					// return "<a href='http://www.baidu.com?word="+ v +"'
					// target='_blank' >"+v+"</a>"
					return "<textarea rows='3' cols='10' ></textarea>"
				}
			}]);

	var store2 = new Ext.data.Store({
				// 获取数据的方式
				proxy : new Ext.data.HttpProxy({
							url : 'stockSystem.ered?reqCode=getReceiveGoodDetail'
						}),
				// 数据读取器
				reader : new Ext.data.JsonReader({
							root : 'ROOT' // Json中的列表数据根节点
						}, [{
									name : 'MATNR'
								}, {
									name : 'EBELP'
								}, {
									name : 'EBELN'
								}, {
									name : 'VBELN'
								}, {
									name : 'MENGE'
								}, {
									name : 'CHARG'
								}, {
									name :  'zhlhxt'
								}, {
									name :  'zjlzl1'
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
				items : ['-', '&nbsp;&nbsp;', pagesize_combo]
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
	var grid2 = new Ext.grid.GridPanel({
				// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
				height : 300,
				width : 900,
				frame : true,
				autoScroll : true,
				region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
				store : store2, // 数据存储
				stripeRows : true, // 斑马线
				cm : cm2, // 列模型
				sm : sm, // 复选框
				bbar:bbar2,
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
					var VBELN = record.get('VBELN');
					// alert(record.get('kunnr'));
					// lgortInfoCombo.clearValue();

					lgortInfo.reload();
					thirdWindow.show();
					Ext.getCmp("searchText").focus(true, true);
					store2.load({
								params : {
									VBELN : VBELN
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

	// queryCatalogItem();


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
							// border : false,
							frame : true,
							items : [{
										columnWidth : .3,
										layout : 'form',
										// border : false,
										anchor : '80%',
										items : [{
													xtype : 'combo',
													hiddenName : 'position',
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
										// border : false,
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

									}]
						}]
			});

	function search() {
		var searchText = Ext.get("searchText").getValue();
		if (searchText == '') {
			Ext.Msg.alert("提示","请输入信息！");
			return;
		}

		var view = grid2.getView();
		for (var i = 0; i < store2.getCount(); i++) {
			var charg = store2.getAt(i).get('CHARG');
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
				items : [searchForm, grid2, submitForm]
			});

	// 入库操作
	var thirdWindow = new Ext.Window({
				title : '<span class="commoncss">调入清单</span>', // 窗口标题
				// layout : 'fit', // 设置窗口布局模式
				width : 1100, // 窗口宽度
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
		var ebeln = "";
		var matnr = "";
		var menge = "";
		var lgort = false;
		// var vbeln = "";
		var ebelp = "";
		var reason = "";
		var myexplain = "";
		var manage = "";
		var choiceorderid = "";
		var needvalified = "";
		
		var chargheader = "";
		
		
		
		// 返回一个行集合JS数组
		var rows = grid2.getSelectionModel().getSelections();
		if (Ext.isEmpty(rows)) {
			Ext.MessageBox.alert('提示', '您没有选中任何数据!');
			return;
		}
		// alert(rows.length);
		var lgortAll = Ext.getCmp("position").getValue();
		
		
		var chargitem = "";
		for (var i = 0; i < rows.length; i++) {
			
			chargitem = chargitem + "\"" + i + "\"";
			chargitem = chargitem + "{\"charg\":\"" + $.trim(rows[i].get("CHARG")) + "\",";
			chargitem = chargitem + "\"ebeln\":\"" + $.trim(rows[i].get("EBELN")) + "\",";
			
			chargitem = chargitem + "\"matnr\":\"" + $.trim(rows[i].get("MATNR")) + "\",";
			chargitem = chargitem + "\"menge\":\"" + $.trim(rows[i].get("MENGE")) + "\",";
			
			alert(lgortAll);
			
			chargitem = chargitem + "\"lgort\":\"" + $.trim(rows[i].get("itemLgort") == null ? lgortAll : rows[i].get("itemLgort")) + "\",";
			
			chargitem = chargitem + "\"ebelp\":\"" + $.trim(rows[i].get("EBELP")) + "\",";
			chargitem = chargitem + "\"choiceorderid\":\"" + $.trim(rows[i].get("ZNUM")) + "\",";
			chargitem = chargitem + "\"reason\":\"" + $.trim(rows[i].get("reason")) + "\",";
			chargitem = chargitem + "\"myexplain\":\"" + $.trim(rows[i].get("myexplain")) + "\",";
			chargitem = chargitem + "\"manage\":\"" + $.trim(rows[i].get('manage')) + "\"}";
			
			chargitem = i == rows.length - 1 ? chargitem : chargitem + ",";
			
			
			
			
//			chargs += rows[i].get("CHARG") + ',';
//			ebeln = rows[i].get("EBELN");
//			matnr += rows[i].get("MATNR") + ",";
//			menge += rows[i].get("MENGE") + ",";
//			//alert(rows[i].get("itemLgort"));
//			//alert(rows[i].get("itemLgort") == null);
//			lgort += rows[i].get("itemLgort") == null ? lgortAll + ',' : rows[i].get("itemLgort") + ',';
//			ebelp += rows[i].get("EBELP") + ",";
//			
			
//			if(rows[i].get('reason') != null ){
//				needvalified = 1;
//			}
			
//			reason += (rows[i].get('reason') != null ? rows[i].get('reason') : "") + '&';
//			myexplain += (rows[i].get('myexplain') != null ? rows[i].get('myexplain')  : "") + '&';
//			manage += (rows[i].get('manage') != null ?rows[i].get('manage') :"" ) + '&';
//			choiceorderid = rows[i].get('ZNUM');
			//alert(choiceorderid);
		}
		if (lgortAll == "") {
			Ext.Msg.alert('提示', "请选择正确的库位！！");
			return;
		}
//		chargs = chargs.substring(0, chargs.length - 1);
//		matnr = matnr.substring(0, matnr.length - 1);
//		menge = menge.substring(0, menge.length - 1);
//		lgort = lgort.substring(0, lgort.length - 1);
//		// vbeln = vbeln.substring(0, vbeln.length - 1);
//		ebelp = ebelp.substring(0, ebelp.length - 1);
//		//ebeln = ebeln.substring(0, ebeln.length - 1);
//		reason = reason.substring(0, reason.length - 1);
//		myexplain = myexplain.substring(0, myexplain.length - 1);
//		manage = manage.substring(0, manage.length - 1);
//		
//		alert(reason);
//		alert(myexplain);
//		alert(manage);

		// 将JS数组中的行级主键，生成以,分隔的字符串
//		var positionIds = jsArray2JsString(rows, 'BWTAR');
//		Ext.MessageBox.alert('提示', positionIds);
		// 获得选中续数据后则可以传入后台继处理

		Ext.Msg.confirm("提示", "确定入库吗？", function(btn, text) {
					if (btn == "yes") {
						Ext.Ajax.request({
									url : 'stockSystem.ered?reqCode=inStock',
									method : 'post',
									params : {
//										lgort : lgort,
//										chargs : chargs,
//										ebeln : ebeln,
//										matnr : matnr,
//										menge : menge,
//										ebelp : ebelp,
//										vbeln : vbeln,
//										reason : reason,
//										myexplain : myexplain,
//										manage : manage,
//										needvalified : needvalified,
//										choiceorderid : choiceorderid,
										chargitem : chargitem
									},timeout : 12000000,
									success : function(data) {
										alert(data.responseText);
										// var json =
										// Ext.util.JSON.decode(data.responseText);
										// if(json.success == true)
										// Ext.Msg.alert("提示",json.msg);
										// else
										// Ext.Msg.alert("提示",json.msg);

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
	
function getTotal(){
	
		
		var rows1 = grid.store.data.items;
		var count = 0;
		var total = 0;
		for ( var i = 0; i < rows1.length; i++) {
			count = count + Number(rows1[i].get("labst"));
			total = total + Number(rows1[i].get("kbetr"));
		}
		Ext.getCmp("count").setText(parseInt(count));
		Ext.getCmp("total").setText(total);
		
	
	}
	
		function getCount(){
		var rows1 = grid2.store.data.items;
		var count = 0;
		var total = 0;
		for ( var i = 0; i < rows1.length; i++) {
			count = count + Number(rows1[i].get("MENGE"));
			total = total + Number(rows1[i].get("ztjtf"));
		}
		Ext.getCmp("kbetr").setText(total);
		Ext.getCmp("menge").setText(count);
		
	
	}

});