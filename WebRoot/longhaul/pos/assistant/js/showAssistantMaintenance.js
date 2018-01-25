/**
 * 综合实例：查询1
 * 
 * @author XiongChun
 * @since 2010-11-20
 */
Ext
		.onReady(function() {

			// 定义自动当前页行号
			var rownum = new Ext.grid.RowNumberer({
				header : 'NO',
				width : 28
			});

			// 复选框
			//var sm = new Ext.grid.CheckboxSelectionModel();

			// 定义列模型
			var cm = new Ext.grid.ColumnModel([ rownum, {
				header : '编号',
				width : 60,
				dataIndex : 'assistantno',
				hidden : true
			}, {
				header : '姓名',
				dataIndex : 'assistant_name',
				width : 100,
				sortable : true
			}, {
				header : '门店',
				dataIndex : 'storename',
				width : 120,
				sortable : true,
				hidden : true
			}, {
				header : '电话',
				width : 150,
				dataIndex : 'telephone'
			}, {
				header : '身份证号码',
				width : 180,
				dataIndex : 'idno'
			}, {
				header : '原始门店',
				width : 150,
				dataIndex : 'store_inital',
				hidden : true
			}, {
				header : '入职时间',
				width : 150,
				dataIndex : 'rzsj'
			}, {
				header : '职位',
				width : 100,
				dataIndex : 'degreename'
			}, {
				header : '晋升时间',
				width : 150,
				dataIndex : 'jssj'
			}, {
				header : '晋升职位',
				width : 100,
				dataIndex : 'zwname'
			}, {
				header : '离职时间',
				width : 150,
				dataIndex : 'lzsj'
			}, {
				header : '状态',
				width : 100,
				dataIndex : 'status'
			}, {
				header : '备注',
				width : 150,
				dataIndex : 'remark'
			} ]);

			/**
			 * 数据存储
			 */
			var store = new Ext.data.Store({
				// 获取数据的方式
				proxy : new Ext.data.HttpProxy({
					url : 'assistantSystem.ered?reqCode=getAssistant'
				}),
				// 数据读取器
				reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT', // 记录总数
					root : 'ROOT' // Json中的列表数据根节点
				}, [ {
					name : 'assistantno'
				}, {
					name : 'assistant_name' // Json中的属性Key值
				}, {
					name : 'storename' 
				}, {
					name : 'store_inital' 
				}, {
					name : 'telephone'
				}, {
					name : 'idno'
				}, {
					name : 'rzsj'
				}, {
					name : 'degreename'
				}, {
					name : 'status'
				}, {
					name : 'jssj'
				}, {
					name : 'zwname'
				}, {
					name : 'lzsj'
				}, {
					name : 'remark'
				} ])
			});

			var goodTypeStore = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
					url : 'assistantSystem.ered?reqCode=getAssistentStatus'
				}),
				reader : new Ext.data.JsonReader({
					root : 'ROOT' // Json中的列表数据根节点
				}, [ {
					name : 'id'
				}, {
					name : 'value'
				} ])

			});

			goodTypeStore.load();

			// 翻页排序时带上查询条件
			store.on('beforeload', function() {
				this.baseParams = {
					status : 0
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
							[ 100, '100条/页' ], [ 250, '250条/页' ],
							[ 500, '500条/页' ] ]
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
				queryBalanceInfo();
			});

			// 分页工具栏
			var bbar = new Ext.PagingToolbar({
				pageSize : number,
				store : store,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
				emptyMsg : "没有符合条件的记录",
				items : [ '-', '&nbsp;&nbsp;', pagesize_combo ]
			});

			// 下拉框 状态
			var status_combo = new Ext.form.ComboBox({
				id : "tstatuscombo",
				triggerAction : 'all',
				mode : 'local',
				store : new Ext.data.ArrayStore({
					fields : [ 'value', 'text' ],
					data : [ [ '1', '在职' ], [ '2', '离职' ] ,['3','调离']]
				}),
				valueField : 'value',
				displayField : 'text',
				emptyText : '状态',
				editable : false,
				hidden : false,
				anchor : '70%',
				width : 80
			});

			// 工具栏
			var tbar = new Ext.Toolbar({
				items : [ {
					emptyText : '姓名',
					xtype : 'textfield',
					id : 'tassistant_name',
					width : 60
				},'-',{
					emptyText : '门店',
					xtype : 'textfield',
					id : 'storename',
					width : 80
				}, '-', {
					emptyText : '晋升职位',
					xtype : 'textfield',
					id : 'tjszw',
					width : 80
				}, '-', {
					emptyText : '入职开始时间',
					xtype : 'datefield',
					format : 'Y-m-d',
					id : 'trzsj',
					width : 120
				}, '-', {
					emptyText : '入职结束时间',
					xtype : 'datefield',
					format : 'Y-m-d',
					id : 'tinjsj',
					width : 120
				}, '-', {
					emptyText : '离职开始时间',
					xtype : 'datefield',
					format : 'Y-m-d',
					id : 'tlzsj',
					width : 120
				}, '-', {
					emptyText : '离职结束时间',
					xtype : 'datefield',
					format : 'Y-m-d',
					id : 'toutsj',
					width : 120
				}, '-', status_combo, {
					text : '查询',
					iconCls : 'page_findIcon',
					handler : function() {

						queryBalanceInfo();
					}
				}
//				, '-', {
//					text : '修改',
//					iconCls : 'page_refreshIcon',
//					handler : function() {
//						getCheckboxRow();
//					}
//				}, '-', {
//					text : '添加',
//					iconCls : 'addIcon',
//					handler : function() {
//						firstWindow1.show();
//					}
//				}, '-', {
//					text : '导入',
//					iconCls : 'addIcon',
//					handler : function() {
//						importWindow.show();
//					}
//				}
				]
			});
//
//			// 获取选择行
//			function getCheckboxRow() {
//				// 返回一个行集合JS数组
//				var rows = grid.getSelectionModel().getSelections();
//				if (Ext.isEmpty(rows)) {
//					Ext.MessageBox.alert('提示', '您没有选中任何数据!');
//					return;
//				} else if (rows.length > 1) {
//					Ext.MessageBox.alert('提示', '不能选择多行修改!');
//					return;
//				}
//				setSecondFormText();
//				secondWindow.show();
//			}

			// 表格实例
			var grid = new Ext.grid.GridPanel({
				region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
				// collapsible : true,
				border : false,
				// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
				height : 500,
				autoScroll : true,
				frame : true,
				store : store, // 数据存储
				stripeRows : true, // 斑马线
				cm : cm, // 列模型
				//sm : sm,// 多选框
				tbar : tbar, // 工具栏
				bbar : bbar,// 分页工具栏
				viewConfig : {
					// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
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

			// 查询表格数据
			function queryBalanceInfo() {

				store.load({
					params : {
						start : 0,
						limit : bbar.pageSize,
						assistant_name : Ext.getCmp("tassistant_name")
								.getValue(),
						jszw : Ext.getCmp("tjszw").getValue(),
						rzsj : Ext.getCmp("trzsj").getValue(),
						injsj : Ext.getCmp("tinjsj").getValue(),
						lzsj : Ext.getCmp("tlzsj").getValue(),
						outjsj : Ext.getCmp("toutsj").getValue(),
						storename : Ext.getCmp("storename").getValue(),
						statuscombo : Ext.getCmp("tstatuscombo").getValue()
					},
					callback : function(records, options, success) {
						if (success == true) {
							if (records.length == 0)
								Ext.Msg.alert('提示', '没有数据');
						} else
							Ext.Msg.alert('提示', '出现错误');
					}
				});
			}

			queryBalanceInfo();



		});