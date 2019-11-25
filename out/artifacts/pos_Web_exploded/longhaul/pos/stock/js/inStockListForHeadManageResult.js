/**
 * 货品收货功能
 * 
 * @author FengZhou
 * @since 2012-06-15
 */
Ext
		.onReady(function() {
			
			
			Ext.data.Connection.prototype.timeout='300000';
			
			// 复选框
			var sm = new Ext.grid.CheckboxSelectionModel();

			// 定义自动当前页行号
			var rownum = new Ext.grid.RowNumberer({
				header : 'NO',
				width : 28
			});

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
				width : 150
			}, {
				header : '出库凭证号', // 列标题
				dataIndex : 'i_mblnr', // 数据索引:和Store模型对应
				sortable : true,// 是否可排序
				width : 120
			}, {
				header : '入库凭证号', // 列标题
				dataIndex : 'mblnr', // 数据索引:和Store模型对应
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
				width : 80,
				renderer : function(v) {
					return Number(v).toFixed(2);
				}
			}, {
				header : '总重量',
				dataIndex : 'totalweight',
				sortable : true,
				width : 60,
				renderer : function(v) {
					return Number(v).toFixed(2);
				}
			}, {
				header : '发往门店',
				dataIndex : 'inwerksstr',
				sortable : true,
				width : 130
			}, {
				header : '出库日期',
				dataIndex : 'stockdate',
				sortable : true,
				width : 100
			}, {
				header : '状态',
				dataIndex : 'statusStr',
				sortable : true,
				width : 120
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
				dataIndex : 'reasonStr',
				sortable : true,
				width : 100
			}, {
				header : '整单差异说明',
				dataIndex : 'headexplain',
				sortable : true,
				width : 100,
				renderer : function(v, metadata, record, rowIndex, columnIndex, store) {
					metadata.attr = ' ext:qtip="' + v + '"';
					return v;
				}
			}, {
				header : '整单差异处理',
				dataIndex : 'headmanage',
				sortable : true,
				width : 120,
				renderer : function(v, metadata, record, rowIndex, columnIndex, store) {
					metadata.attr = ' ext:qtip="' + v + '"';
					return v;
				}
			}, {
				header : '整单差异处理反馈',
				dataIndex : 'headmanageresult',
				sortable : true,
				width : 120,
				renderer : function(v, metadata, record, rowIndex, columnIndex, store) {
					metadata.attr = ' ext:qtip="' + v + '"';
					return v;
				},
				editor : new Ext.form.ComboBox({

					triggerAction : 'all',
					mode : 'local',
					store : new Ext.data.ArrayStore({
						fields : [ 'value', 'text' ],
						data : [ [ '1.调入正常仓位', '1.调入正常仓位' ], [ '2.做退货', '2.做退货' ] ]
					}),
					valueField : 'value',
					displayField : 'text',
					editable : false,
					width : 85

				})
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
					name : 'outwerksStr'
				}, {
					name : 'inwerks'
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
					name : 'posttime'
				}, {
					name : 'recievetime'
				}, {
					name : 'headreason'
				}, {
					name : 'reasonStr'
				}, {
					name : 'headexplain'
				}, {
					name : 'headmanage'
				}, {
					name : 'i_mblnr'
				}, {
					name : 'mblnr'
				}, {
					name : 'headmanageresult'
				}, {
					name : 'remark'
				}, {
					name : 'rejreason'
				} ])
			});

			// 收货清单
			var cm2 = new Ext.grid.ColumnModel([ rownum,
			// sm,
			{
				header : '编号',
				dataIndex : 'outid',
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
				dataIndex : 'count',// 'zhlhxt',
				sortable : true,
				width : 40
			}, {
				header : '货品重量',
				dataIndex : 'hpzl',
				sortable : true,
				width : 80
			}, {
				header : '标签价',
				dataIndex : 'bqj',
				sortable : true,
				width : 60
			}, {
				header : '出库库位',
				dataIndex : 'outstock',// 'ztjtf',
				sortable : true,
				width : 60
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
					// return "<a
					// href='http://www.baidu.com?word="+ v +"'
					// target='_blank' >"+v+"</a>"
					return "<img src='../../../sappic/" + v + "' width='60px' height='60px' " + "onError=\"this.src='./images/sample1.gif'\"/>"
				}

			} ]);

			// 会员消费情况数据
			var store2 = new Ext.data.Store({
				// 获取数据的方式
				proxy : new Ext.data.HttpProxy({
					url : 'stockSystem.ered?reqCode=getInStockDetail'
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
					name : 'hpzl'
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
					name : 'zszsb'
				}, {
					name : 'goodzs'
				} ])
			});

			// 翻页排序时带上查询条件
			store.on('beforeload', function() {
				this.baseParams = {
					status : '7'
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
					handler : function() {
						firstWindow.show();
					}
				}, '-', {
					text : '提交整单差异处理',
					iconCls : 'acceptIcon',
					handler : function() {
						submitHeadManage();
					}
				} ]
			});

			// Ext.getCmp('status').on("select", function() {
			// queryCatalogItem();
			// });
			//	

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
			var grid2 = new Ext.grid.GridPanel({
				// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
				height : 330,
				width : 900,
				frame : true,
				autoScroll : true,
				region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
				store : store2, // 数据存储
				stripeRows : true, // 斑马线
				cm : cm2, // 列模型
				// sm : sm, // 复选框
				bbar : bbar2,
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
			var thisoutid;
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
					thisoutid = outid;

					var status = record.get('status');

					// alert(status);
					// alert(thisoutid);
					if (status == '3') {
						Ext.getCmp('editThis').show();
					} else {
						Ext.getCmp('editThis').hide();
					}
					lgortInfoCombo.clearValue();
					lgortInfo.reload();
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

			lgortInfo.load(); // 如果mode : 'local',时候才需要手动load();

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

			var submitForm = new Ext.form.FormPanel({
				id : 'secondForm',
				name : 'secondForm',
				labelWidth : 90, // 标签宽度
				// frame : true, // 是否渲染表单面板背景色
				// defaultType : 'textfield', // 表单元素默认类型
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:5 5 5 5', // 表单元素和表单面板的边距
				items : [ {
					layout : 'column',
					border : false,
					items : [ {
						columnWidth : .4,
						layout : 'form',
						hidden : true,
						border : false,
						items : [ {
							xtype : 'textfield',
							name : 'submit',
							fieldLabel : '原因',
							anchor : '80%',
							handler : getCheckboxValues
						} ]
					}, {
						columnWidth : .1,
						layout : 'form',
						hidden : true,
						border : false,
						items : [ {
							xtype : 'button',
							name : 'submit',
							text : '入库',
							anchor : '80%',
							hidden : true,
							handler : getCheckboxValues
						} ]

					}, {
						columnWidth : .1,
						layout : 'form',
						hidden : true,
						border : false,
						items : [ {
							xtype : 'button',
							name : 'submit',
							text : '取消',
							anchor : '80%',
							handler : cancleStock
						} ]

					}, {
						columnWidth : .1,
						layout : 'form',
						border : false,
						items : [ {
							xtype : 'button',
							id : 'editThis',
							text : '修改',
							hidden : true,
							anchor : '80%',
							handler : editthis
						} ]

					} ]
				} ]
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
				items : [ submitForm, grid2 ], // 嵌入的表单面板
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

				for ( var i = 0; i < rows.length; i++) {
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
						var myMask = new Ext.LoadMask(Ext.getBody(), {
							msg : '正在提交中，请稍后...',
							removeMask : true
						// 完成后移除
						});
						myMask.show();
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
								myMask.hide();
								Ext.Msg.alert("提示", "收货成功！！");
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
			function editthis() {
				// window.location.href='outStock.jsp?outid='+thisoutid+'&opmode=edit';
				var src = 'outStock.jsp?outid=' + thisoutid + '&opmode=edit';
				// var myhtml = '<iframe src='+src+' width="100%" height="100%"
				// marginwidth="0" framespacing="0" marginheight="0"
				// frameborder="0" ></iframe>'
				exitWindow.show();
				document.getElementById("editFrame").src = src;
				thirdWindow.hide();
			}

			var panel = new Ext.Panel(
					{
						html : '<iframe src="" id="editFrame" width="100%" height="100%" marginwidth="0" framespacing="0" marginheight="0" frameborder="0" ></iframe>'
					});

			var exitWindow = new Ext.Window({
				title : '<span class="commoncss">修改出库单</span>', // 窗口标题
				layout : 'fit', // 设置窗口布局模式
				width : 1030, // 窗口宽度
				iconCls : 'window_caise_listIcon', // 按钮图标
				height : 350, // 窗口高度
				closable : true, // 是否可关闭
				collapsible : true, // 是否可收缩
				maximizable : true, // 设置是否可以最大化
				border : false, // 边框线设置
				autoScroll : true,
				constrain : true, // 设置窗口是否可以溢出父容器
				// pageY : 20, // 页面定位Y坐标
				// pageX : document.body.clientWidth / 4 - 300 / 2, // 页面定位X坐标
				items : [ panel ],
				closeAction : 'hide'
			});

			exitWindow.on('hide', function(e) {
				queryCatalogItem();
			});

			function submitHeadManage() {
				var rows = grid.store.data.items;
				var chargitem = "";
				var count = 0;
				for ( var i = 0; i < rows.length; i++) {
					var headmanageresult = rows[i].get("headmanageresult");
					// var myreason = "";
					// var myreasons = headreason.split(",");
					// for ( var j = 0; j < myreasons.length; j++) {
					// // alert(myreasons[j]);
					// myreason = myreason + myreasons[j].substring(0,
					// myreasons[j].indexOf("、"));
					// if (j != myreasons.length - 1) {
					// myreason = myreason + ",";
					// }
					//
					// }
					// alert(headmanageresult);
					if (headmanageresult != null && headmanageresult != '') {
						chargitem = chargitem + "\"" + count + "\":";
						chargitem = chargitem + "{\"outid\":\"" + rows[i].get("outid") + "\",";
						chargitem = chargitem + "\"status\":\"" + 9 + "\",";

						chargitem = chargitem + "\"headmanageresult\":\"" + headmanageresult + "\"}";
						chargitem = ((i == (rows.length - 1)) ? chargitem : (chargitem + ","));
						count++;
					}

				}

				if (chargitem == '') {
					Ext.Msg.alert("提示", "您还没有处理方法，没有提交数据！");
					return;
				}

				chargitem = "{" + chargitem + "}";

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
							url : 'stockSystem.ered?reqCode=submitInStockHeadManageResult',
							method : 'post',
							params : {
								chargitem : chargitem
							},
							timeout : 12000000,
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