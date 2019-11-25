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
			var sm = new Ext.grid.CheckboxSelectionModel();

			// 定义列模型
			var cm = new Ext.grid.ColumnModel([ rownum, sm, {
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
				sortable : true
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
					data : [ [ '1', '在职' ], [ '2', '离职' ], [ '3', '调离' ] ]
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
				}, '-', {
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
				}, '-', {
					text : '修改',
					iconCls : 'page_refreshIcon',
					handler : function() {
						getCheckboxRow();
					}
				}, '-', {
					text : '添加',
					iconCls : 'addIcon',
					handler : function() {
						firstWindow1.show();
					}
				}, '-', {
					text : '导入',
					iconCls : 'addIcon',
					handler : function() {
						importWindow.show();
					}
				} ]
			});

			// 获取选择行
			function getCheckboxRow() {
				// 返回一个行集合JS数组
				var rows = grid.getSelectionModel().getSelections();
				if (Ext.isEmpty(rows)) {
					Ext.MessageBox.alert('提示', '您没有选中任何数据!');
					return;
				} else if (rows.length > 1) {
					Ext.MessageBox.alert('提示', '不能选择多行修改!');
					return;
				}
				setSecondFormText();
				secondWindow.show();
			}

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
				sm : sm,// 多选框
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

			// ***修改
			// 修改窗工具栏
			var tbar2 = new Ext.Toolbar({
				items : [ {
					id : 'updateAssistant2',
					width : 60,
					text : '修改',
					handler : function() { // 按钮响应函数
						jsWindow.hide();
						dlWindow.hide();
						secondWindow.show();

					}
				}, '-', {
					id : 'dlAssistant2',
					width : 60,
					text : '调离',
					handler : function() { // 按钮响应函数
						jsWindow.hide();
						secondWindow.hide();
						dlWindow.show();
					}
				}, '-', {
					id : 'jsAssistant2',
					width : 60,
					text : '晋升',
					handler : function() { // 按钮响应函数
						secondWindow.hide();
						dlWindow.hide();
						jsWindow.show();
					}
				} ]
			});

			var numfield1 = new Ext.form.NumberField({
				fieldLabel : '电话号码',
				name : 'telephone',// 'telf2',
				id : 'telephone',
				// xtype : 'textfield',
				// allowBlank : false,
				anchor : '100%',
				maxLength : 11
			// 可输入的最大文本长度,不区分中英文字符
			// minLength : 11 // 可输入的最小文本长度,不区分中英文字符
			});

			var secondForm = new Ext.form.FormPanel({
				id : 'secondForm',
				name : 'secondForm',
				labelWidth : 90, // 标签宽度
				// autoScroll : true,
				// frame : true, // 是否渲染表单面板背景色
				// defaultType : 'textfield', // 表单元素默认类型
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:5 5 5 5', // 表单元素和表单面板的边距
				items : [ {
					layout : 'column',
					border : false,
					items : [ {
						columnWidth : .8,
						layout : 'form',
						border : false,
						items : [ {
							fieldLabel : '编号',
							xtype : 'textfield',
							// readOnly : true,
							name : 'id1',
							id : 'id1',
							allowBlank : false,
							hidden : true,
							anchor : '100%',
							allowBlank : false, // 是否允许为空
							minLength : 1
						// 可输入的最小文本长度,不区分中英文字符
						}, {
							fieldLabel : '营业员姓名',
							xtype : 'textfield',
							// readOnly : true,
							name : 'name1',
							id : 'name1',
							allowBlank : false,
							anchor : '100%',
							allowBlank : false, // 是否允许为空
							maxLength : 8, // 可输入的最大文本长度,不区分中英文字符
							minLength : 2
						// 可输入的最小文本长度,不区分中英文字符
						}, numfield1, {
							fieldLabel : '入职日期',
							xtype : 'datefield',
							// readOnly : true,
							value : new Date(),
							name : 'rzsj',
							id : 'rzsj1',
							format : 'Y-m-d',
							anchor : '100%',
							hidden : false
						// allowBlank : false // 是否允许为空
						}, {
							fieldLabel : '状态',

							xtype : 'combo',
							id : 'status1',
							name : 'zt',
							mode : 'local',
							store : new Ext.data.ArrayStore({
								fields : [ 'value', 'text' ],
								data : [ [ 1, '在职' ], [ 2, '离职' ] ]
							}),
							emptyText : '请选择',
							valueField : 'value', // option.value
							displayField : 'text', // option.text
							triggerAction : 'all',
							hiddenName : 'zt',
							anchor : '100%',
							allowBlank : false,
							listeners : {
								'select' : function() {
									var statu = this.value;
									if (2 == (statu)) {
										Ext.getCmp('lzsj1').show();
									}
									if (1 == (statu)) {
										Ext.getCmp('lzsj1').hide();
										// Ext.getCmp('lzsj1').setValue("");
									}
								}
							}

						}, {
							fieldLabel : '离职日期',
							xtype : 'datefield',
							// readOnly : true,
							value : new Date(),
							name : 'lzsj',
							id : 'lzsj1',
							format : 'Y-m-d',
							anchor : '100%',
							hidden : true
						// allowBlank : false // 是否允许为空
						}, {
							fieldLabel : '备注',
							xtype : 'textfield',
							// readOnly : true,
							name : 'remark',
							id : 'remark',
							anchor : '100%'
						} ]
					} ]
				} ]
			});

			var secondWindow = new Ext.Window(
					{
						title : '<span class="commoncss">修改营业员信息</span>', // 窗口标题
						layout : 'fit', // 设置窗口布局模式
						width : 350, // 窗口宽度
						height : 300, // 窗口高度
						closable : true, // 是否可关闭
						collapsible : true, // 是否可收缩
						maximizable : true, // 设置是否可以最大化
						border : false, // 边框线设置
						constrain : true, // 设置窗口是否可以溢出父容器
						pageY : 20, // 页面定位Y坐标
						pageX : document.body.clientWidth / 3 - 300 / 2, // 页面定位X坐标
						items : [ secondForm ], // 嵌入的表单面板
						closeAction : 'hide',
						tbar : tbar2,
						buttons : [
								{ // 窗口底部按钮配置
									text : '更新', // 按钮文本
									id : 'update_second',
									iconCls : 'tbar_synchronizeIcon', // 按钮图标
									handler : function() { // 按钮响应函数
										Ext.Msg
												.confirm(
														"提示",
														"确定吗？",
														function(btn, text) {
															if (btn == "yes") {
																if (Ext
																		.isEmpty(Ext
																				.getCmp(
																						"lzsj1")
																				.getValue())
																		&& Ext
																				.getCmp(
																						"status1")
																				.getValue() == 2) {
																	Ext.Msg
																			.alert(
																					"提示",
																					"离职日期不能为空！");
																	return;
																}
																secondForm.form
																		.submit({
																			url : 'assistantSystem.ered?reqCode=updateAssistantInfo',
																			waitTitle : '提示',
																			method : 'POST',
																			waitMsg : '正在处理数据,请稍候...',
																			success : function(
																					form,
																					action) {
																				Ext.Msg
																						.alert(
																								"提示",
																								action.result.msg);
																				secondForm.form
																						.reset();
																				queryBalanceInfo();
																				secondWindow
																						.hide();
																				store
																						.reload();
																			},
																			failure : function(
																					form,
																					action) {
																				Ext.Msg
																						.alert(
																								"提示",
																								action.result.msg);
																			}
																		});
															}
														});
									}
								}, { // 窗口底部按钮配置
									text : '重置', // 按钮文本
									id : 'reset_second',
									iconCls : 'tbar_synchronizeIcon', // 按钮图标
									handler : function() { // 按钮响应函数
										secondForm.form.reset();
										// alert(Ext.getCmp('location').getValue());
									}
								} ]
					});

			// ****晋升

			/**
			 * 数据存储 职位下拉框
			 */
			var cmb2store = new Ext.data.Store({
				// 获取数据的方式
				proxy : new Ext.data.HttpProxy({
					url : 'assistantSystem.ered?reqCode=getAssistantPositions'
				}),
				// 数据读取器
				reader : new Ext.data.JsonReader({
					root : 'ROOT' // Json中的列表数据根节点
				}, [ {
					name : 'id'
				}, {
					name : 'degreename'
				}, {
					name : 'remark'
				} ])
			})

			cmb2store.load();

			var jsForm = new Ext.form.FormPanel({
				id : 'jsForm',
				name : 'jsForm',
				labelWidth : 90, // 标签宽度
				// autoScroll : true,
				// frame : true, // 是否渲染表单面板背景色
				// defaultType : 'textfield', // 表单元素默认类型
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:5 5 5 5', // 表单元素和表单面板的边距
				items : [ {
					layout : 'column',
					border : false,
					items : [ {
						columnWidth : .8,
						layout : 'form',
						border : false,
						items : [ {
							fieldLabel : '编号',
							xtype : 'textfield',
							// readOnly : true,
							name : 'no',
							id : 'no',
							hidden : true,
							allowBlank : false,
							anchor : '100%',
							allowBlank : false, // 是否允许为空
							minLength : 1
						// 可输入的最小文本长度,不区分中英文字符
						}, {
							fieldLabel : '营业员姓名',
							xtype : 'textfield',
							readOnly : true,
							name : 'aname',
							id : 'aname',
							// value : aa,
							allowBlank : false,
							anchor : '100%',
							allowBlank : false, // 是否允许为空
							maxLength : 8, // 可输入的最大文本长度,不区分中英文字符
							minLength : 2
						// 可输入的最小文本长度,不区分中英文字符
						}, {
							fieldLabel : '当前职位',
							xtype : 'textfield',
							readOnly : true,
							name : 'dqzw',
							id : 'dqzw',
							// allowBlank : false,
							anchor : '100%'
						}, {
							fieldLabel : '选择职位',
							xtype : 'combo',
							name : 'zw',
							mode : 'local',
							store : cmb2store,
							emptyText : '请选择',
							valueField : 'id', // option.value
							displayField : 'degreename', // option.text
							triggerAction : 'all',
							hiddenName : 'zw',
							anchor : '100%',
							allowBlank : false
						// 是否允许为空
						}, {
							fieldLabel : '晋升日期',
							xtype : 'datefield',
							// readOnly : true,
							name : 'sj',
							id : 'sj',
							value : new Date(),
							format : 'Y-m-d',
							anchor : '100%'
						} ]
					} ]
				} ]
			});

			// 晋升窗工具栏
			var tbar3 = new Ext.Toolbar({
				items : [ {
					id : 'updateAssistant3',
					width : 60,
					text : '修改',
					handler : function() { // 按钮响应函数
						jsWindow.hide();
						dlWindow.hide();
						secondWindow.show();
					}
				}, '-', {
					id : 'dlAssistant3',
					width : 60,
					text : '调离',
					handler : function() { // 按钮响应函数
						secondWindow.hide();
						jsWindow.hide();
						dlWindow.show();
					}
				}, '-', {
					id : 'jsAssistant3',
					width : 60,
					text : '晋升',
					handler : function() { // 按钮响应函数
						secondWindow.hide();
						dlWindow.hide();
						jsWindow.show();
					}
				} ]
			});

			var jsWindow = new Ext.Window(
					{
						title : '<span class="commoncss">晋升营业员</span>',
						layout : 'fit', // 设置窗口布局模式
						width : 350,
						height : 300,
						closable : true, // 是否可关闭
						collapsible : true, // 是否可收缩
						maximizable : true, // 设置是否可以最大化
						border : false,
						constrain : true,
						pageY : 20, // 页面定位Y坐标
						pageX : document.body.clientWidth / 3 - 300 / 2, // 页面定位X坐标
						items : [ jsForm ], // 嵌入的表单面板
						closeAction : 'hide',
						tbar : tbar3,
						buttons : [
								{ // 窗口底部按钮配置
									text : '更新', // 按钮文本
									id : 'update_second2',
									iconCls : 'tbar_synchronizeIcon', // 按钮图标
									handler : function() { // 按钮响应函数
										Ext.Msg
												.confirm(
														"提示",
														"确定吗？",
														function(btn, text) {
															if (btn == "yes") {
																jsForm.form
																		.submit({
																			url : 'assistantSystem.ered?reqCode=addAssistantPromotion',
																			waitTitle : '提示',
																			method : 'POST',
																			waitMsg : '正在处理数据,请稍候...',
																			success : function(
																					form,
																					action) {
																				Ext.Msg
																						.alert(
																								"提示",
																								action.result.msg);
																				jsForm.form
																						.reset();
																				jsWindow
																						.hide();
																				queryBalanceInfo();
																				store
																						.reload();

																			},
																			failure : function(
																					form,
																					action) {
																				Ext.Msg
																						.alert(
																								"提示",
																								action.result.msg);
																			}
																		});
															}
														});
									}
								}, { // 窗口底部按钮配置
									text : '重置', // 按钮文本
									id : 'reset_second2',
									iconCls : 'tbar_synchronizeIcon', // 按钮图标
									handler : function() { // 按钮响应函数
										jsForm.form.reset();
										// alert(Ext.getCmp('location').getValue());
									}
								} ]
					});

			// ***调离
			// 调离窗工具栏

			/**
			 * 数据存储 职位下拉框
			 */
			var cmb3store = new Ext.data.Store({
				// 获取数据的方式
				proxy : new Ext.data.HttpProxy({
					url : 'assistantSystem.ered?reqCode=getWerksInfo'
				}),
				// 数据读取器
				reader : new Ext.data.JsonReader({
					root : 'ROOT' // Json中的列表数据根节点
				}, [ {
					name : 'mdid'
				}, {
					name : 'mdname'
				} ])
			})

			var tbar4 = new Ext.Toolbar({
				items : [ {
					id : 'updateAssistant4',
					width : 60,
					text : '修改',
					handler : function() { // 按钮响应函数
						jsWindow.hide();
						dlWindow.hide();
						secondWindow.show();
					}
				}, '-', {
					id : 'dlAssistant4',
					width : 60,
					text : '调离',
					handler : function() { // 按钮响应函数
						secondWindow.hide();
						jsWindow.hide();
						dlWindow.show();
					}
				}, '-', {
					id : 'jsAssistant4',
					width : 60,
					text : '晋升',
					handler : function() { // 按钮响应函数
						secondWindow.hide();
						dlWindow.hide();
						jsWindow.show();
					}
				} ]
			});

			cmb3store.load();

			var dlForm = new Ext.form.FormPanel({
				id : 'dlForm',
				name : 'dlForm',
				labelWidth : 90, // 标签宽度
				// autoScroll : true,
				// frame : true, // 是否渲染表单面板背景色
				// defaultType : 'textfield', // 表单元素默认类型
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:5 5 5 5', // 表单元素和表单面板的边距
				items : [ {
					layout : 'column',
					border : false,
					items : [ {
						columnWidth : .8,
						layout : 'form',
						border : false,
						items : [ {
							fieldLabel : '编号',
							xtype : 'textfield',
							// readOnly : true,
							name : 'dlno',
							id : 'dlno',
							allowBlank : false,
							hidden : true,
							anchor : '100%'
						}, {
							fieldLabel : '营业员姓名',
							xtype : 'textfield',
							readOnly : true,
							name : 'dlname',
							id : 'dlname',
							allowBlank : false,
							anchor : '100%'
						}, {
							firldLabel : '初始职位',
							xtype : 'textfield',
							name : 'store_inital',
							id : 'store_inital',
							hidden : true
						}, {
							fieldLabel : '选择门店',
							xtype : 'combo',
							triggerAction : 'all',
							name : 'md',
							mode : 'local',
							store : cmb3store,
							emptyText : '请选择',
							valueField : 'mdid', // option.value
							displayField : 'mdname', // option.text
							hiddenName : 'md',
							anchor : '100%',
							allowBlank : false
						// 是否允许为空
						}, {
							fieldLabel : '调离日期',
							xtype : 'datefield',
							name : 'dlsj',
							id : 'dlsj',
							value : new Date(),
							format : 'Y-m-d',
							anchor : '100%'
						} ]
					} ]
				} ]
			});

			var dlWindow = new Ext.Window(
					{
						title : '<span class="commoncss">调离营业员</span>', // 窗口标题
						layout : 'fit', // 设置窗口布局模式
						width : 350, // 窗口宽度
						height : 300, // 窗口高度
						closable : true, // 是否可关闭
						collapsible : true, // 是否可收缩
						maximizable : true, // 设置是否可以最大化
						border : false, // 边框线设置
						constrain : true, // 设置窗口是否可以溢出父容器
						pageY : 20, // 页面定位Y坐标
						pageX : document.body.clientWidth / 3 - 300 / 2, // 页面定位X坐标
						items : [ dlForm ], // 嵌入的表单面板
						closeAction : 'hide',
						tbar : tbar4,
						buttons : [
								{ // 窗口底部按钮配置
									text : '更新', // 按钮文本
									id : 'update_second3',
									iconCls : 'tbar_synchronizeIcon', // 按钮图标
									handler : function() { // 按钮响应函数
										Ext.Msg
												.confirm(
														"提示",
														"确定吗？",
														function(btn, text) {
															if (btn == "yes") {
																dlForm.form
																		.submit({
																			url : 'assistantSystem.ered?reqCode=addAssistantscheduling',
																			waitTitle : '提示',
																			method : 'POST',
																			waitMsg : '正在处理数据,请稍候...',
																			success : function(
																					form,
																					action) {
																				Ext.Msg
																						.alert(
																								"提示",
																								action.result.msg);
																				dlForm.form
																						.reset();
																				dlWindow
																						.hide();
																				queryBalanceInfo();
																				store
																						.reload();
																			},
																			failure : function(
																					form,
																					action) {
																				Ext.Msg
																						.alert(
																								"提示",
																								action.result.msg);
																			}
																		});
															}
														});
									}
								}, { // 窗口底部按钮配置
									text : '重置', // 按钮文本
									id : 'reset_second3',
									iconCls : 'tbar_synchronizeIcon', // 按钮图标
									handler : function() { // 按钮响应函数
										dlForm.form.reset();
										// alert(Ext.getCmp('location').getValue());
									}
								} ]
					});

			// 填充
			function setSecondFormText() {
				var clickone = grid.getSelectionModel().getSelected();
				Ext.getCmp("id1").setValue(clickone.get("assistantno"));
				Ext.getCmp("name1").setValue(clickone.get("assistant_name"));
				Ext.getCmp("telephone").setValue(clickone.get("telephone"));
				Ext.getCmp("lzsj1").setValue(clickone.get("lzsj"));
				Ext.getCmp("no").setValue(clickone.get("assistantno"));
				Ext.getCmp("aname").setValue(clickone.get("assistant_name"));
				Ext.getCmp("dlno").setValue(clickone.get("assistantno"));
				Ext.getCmp("dlname").setValue(clickone.get("assistant_name"));
				Ext.getCmp("remark").setValue(clickone.get("remark"));
				Ext.getCmp("dqzw").setValue(clickone.get("degreename"));
				Ext.getCmp("store_inital").setValue(
						clickone.get("store_inital"));
				Ext.getCmp("rzsj1").setValue(clickone.get("rzsj"));
			}

			// var assistantpositionStore = new Ext.data.Store({
			// proxy : new Ext.data.HttpProxy({
			// url : 'assistantSystem.ered?reqCode=getAssistantPositions'
			// }),
			// reader : new Ext.data.JsonReader({}, [ {
			// name : 'id'
			// }, {
			// name : 'degreename'
			// }, {
			// name : 'remark'
			// } ]),
			// listeners : {
			// // 设置远程数据源下拉选择框的初始值
			// // 'load' : function(obj) {
			// // areaCombo.setValue('530101');
			// //}
			// }
			// });

			var assistantpositionCombo = new Ext.form.ComboBox({
				hiddenName : 'position',
				fieldLabel : '请选择职位',
				emptyText : '请选择...',
				triggerAction : 'all',
				store : cmb2store,
				displayField : 'degreename',
				valueField : 'id',
				loadingText : '正在加载数据...',
				mode : 'local', // 数据会自动读取,如果设置为local又调用了store.load()则会读取2次；也可以将其设置为local，然后通过store.load()方法来读取
				forceSelection : true,
				typeAhead : true,
				resizable : false,
				editable : false,
				allowBlank : false,
				// value : '530101',
				anchor : '100%'
			// 设置远程数据源下拉选择框的初始值(此延时方法不好，使用上面的监听areaStore的load事件的方法)
			/*
			 * listeners : { 'render' : function(obj) { areaStore.load();
			 * window.setTimeout(function() { obj.setValue('530101'); }, 200) } }
			 */
			});

			var numfield2 = new Ext.form.NumberField({
				fieldLabel : '电话号码',
				name : 'telephone1',// 'telf2',
				// id : 'telephone',
				// xtype : 'textfield',
				// allowBlank : false,
				anchor : '100%',
				maxLength : 11
			// 可输入的最大文本长度,不区分中英文字符
			// minLength : 11 // 可输入的最小文本长度,不区分中英文字符
			});

			var firstForm1 = new Ext.form.FormPanel({
				id : 'firstForm',
				name : 'firstForm',
				labelWidth : 90, // 标签宽度
				// frame : true, //是否渲染表单面板背景色
				defaultType : 'textfield', // 表单元素默认类型
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:5 5 5 5', // 表单元素和表单面板的边距
				items : [ assistantpositionCombo, {
					fieldLabel : '姓名', // 标签
					name : 'assistant_name1', // name:后台根据此name属性取值
					allowBlank : false, // 是否允许为空
					maxLength : 8, // 可输入的最大文本长度,不区分中英文字符
					minLength : 2,// 可输入的最小文本长度,不区分中英文字符
					anchor : '100%' // 宽度百分比
				}, numfield2, {
					fieldLabel : '身份证号码',
					name : 'idno',
					maxLength : 18,
					minLength : 18,
					anchor : '100%'
				}, {
					fieldLabel : '入职日期',
					name : 'rzsj',
					xtype : 'datefield',
					height : 50, // 设置多行文本框的高度
					value : new Date(), // 设置默认初始值
					format : 'Y-m-d',
					anchor : '100%'
				}, {
					fieldLabel : '备注',
					name : 'remark1',
					xtype : 'textarea',
					height : 50, // 设置多行文本框的高度
					emptyText : '备注信息', // 设置默认初始值
					anchor : '100%'
				} ]
			});

			var firstWindow1 = new Ext.Window(
					{
						title : '<span class="commoncss">录入营业员信息</span>', // 窗口标题
						layout : 'fit', // 设置窗口布局模式
						width : 350, // 窗口宽度
						height : 240, // 窗口高度
						closable : true, // 是否可关闭
						collapsible : true, // 是否可收缩
						maximizable : true, // 设置是否可以最大化
						border : false, // 边框线设置
						constrain : true, // 设置窗口是否可以溢出父容器
						pageY : 20, // 页面定位Y坐标
						closeAction : 'hide',
						pageX : document.body.clientWidth / 4 - 200 / 2, // 页面定位X坐标
						items : [ firstForm1 ], // 嵌入的表单面板
						buttons : [
								{ // 窗口底部按钮配置
									text : '职位管理', // 按钮文本
									iconCls : 'configIcon', // 按钮图标
									handler : function() { // 按钮响应函数
										secondWindow1.show();
									}
								},
								{ // 窗口底部按钮配置
									text : '提交', // 按钮文本
									iconCls : 'tbar_synchronizeIcon', // 按钮图标
									handler : function() { // 按钮响应函数
										firstForm1.form
												.submit({
													url : 'assistantSystem.ered?reqCode=saveAssistantInfo',
													waitTitle : '提示',
													method : 'POST',
													waitMsg : '正在处理数据,请稍候...',
													success : function(form,
															action) {
														Ext.Msg.alert("提示",
																"提交成功");
														firstForm1.form.reset();
														store.reload();
														firstWindow1.hide();
													},
													failure : function(form,
															action) {
														var msg = action.result.msg;
														Ext.Msg.alert('提示',
																'操作失败!');
													}
												});
									}
								}, { // 窗口底部按钮配置
									text : '重置', // 按钮文本
									iconCls : 'tbar_synchronizeIcon', // 按钮图标
									handler : function() { // 按钮响应函数
										firstForm1.form.reset();
									}
								} ]
					});

			// 职位管理

			// 复选框
			var sm = new Ext.grid.CheckboxSelectionModel();

			// 定义自动当前页行号
			var rownum = new Ext.grid.RowNumberer({
				header : 'NO',
				width : 28
			});

			// 定义列模型
			var cm = new Ext.grid.ColumnModel([ rownum, sm, {
				header : '项目ID', // 列标题
				dataIndex : 'id', // 数据索引:和Store模型对应
				sortable : true
			// 是否可排序
			}, {
				header : '职位名称',
				dataIndex : 'degreename',
				sortable : true,
				width : 180
			// 列宽
			}, {
				header : '备注',
				dataIndex : 'remark',
				sortable : true,
				width : 200
			} ]);
			// 表格工具栏
			var tbar2 = new Ext.Toolbar({
				items : [ {
					text : '新增',
					iconCls : 'addIcon',
					handler : function() {
						thirdWindow.show();
					}
				}, {
					text : '刷新',
					iconCls : 'page_refreshIcon',
					handler : function() {
						cmb2store.reload();
					}
				}, '-', {
					text : '删除',
					iconCls : 'deleteIcon',
					handler : function() {
						getCheckboxValues1();
					}
				} ]
			});

			var grid2 = new Ext.grid.GridPanel({
				// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
				height : 500,
				frame : true,
				autoScroll : true,
				region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
				store : cmb2store, // 数据存储
				stripeRows : true, // 斑马线
				cm : cm, // 列模型
				sm : sm, // 复选框
				tbar : tbar2, // 表格工具栏
				viewConfig : {
				// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
				// forceFit : true
				},
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				}
			});

			var secondWindow1 = new Ext.Window({
				title : '<span class="commoncss">录入职位信息</span>', // 窗口标题
				layout : 'fit', // 设置窗口布局模式
				width : 550, // 窗口宽度
				height : 340, // 窗口高度
				closable : true, // 是否可关闭
				closeAction : 'hide',
				collapsible : true, // 是否可收缩
				maximizable : true, // 设置是否可以最大化
				border : false, // 边框线设置
				constrain : true, // 设置窗口是否可以溢出父容器
				pageY : 50, // 页面定位Y坐标
				pageX : document.body.clientWidth / 3 - 180 / 2, // 页面定位X坐标
				items : [ grid2 ]
			// 嵌入的表单面板
			});

			var secondForm1 = new Ext.form.FormPanel({
				id : 'secondForm1',
				name : 'secondForm1',
				labelWidth : 90, // 标签宽度
				// frame : true, //是否渲染表单面板背景色
				defaultType : 'textfield', // 表单元素默认类型
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:5 5 5 5', // 表单元素和表单面板的边距
				items : [ {
					fieldLabel : '职位名称', // 标签
					name : 'degreename', // name:后台根据此name属性取值
					allowBlank : false, // 是否允许为空
					maxLength : 8, // 可输入的最大文本长度,不区分中英文字符
					minLength : 2,// 可输入的最小文本长度,不区分中英文字符
					anchor : '100%' // 宽度百分比
				}, {
					fieldLabel : '备注',
					name : 'remark',
					xtype : 'textarea',
					height : 50, // 设置多行文本框的高度
					emptyText : '备注信息', // 设置默认初始值
					anchor : '100%'
				} ]
			});

			// 新增职位信息
			var thirdWindow = new Ext.Window({
				title : '<span class="commoncss">录入职位信息</span>', // 窗口标题
				layout : 'fit', // 设置窗口布局模式
				width : 350, // 窗口宽度
				height : 180, // 窗口高度
				closable : true, // 是否可关闭
				closeAction : 'hide',
				collapsible : true, // 是否可收缩
				maximizable : true, // 设置是否可以最大化
				border : false, // 边框线设置
				constrain : true, // 设置窗口是否可以溢出父容器
				pageY : 70, // 页面定位Y坐标
				pageX : document.body.clientWidth / 3 - 140 / 2, // 页面定位X坐标
				items : [ secondForm1 ], // 嵌入的表单面板
				buttons : [ { // 窗口底部按钮配置
					text : '提交', // 按钮文本
					iconCls : 'tbar_synchronizeIcon', // 按钮图标
					handler : function() { // 按钮响应函数
						secondForm1.form.submit({
							url : 'assistantSystem.ered?reqCode=savePosition',
							waitTitle : '提示',
							method : 'POST',
							waitMsg : '正在处理数据,请稍候...',
							success : function(form, action) {
								Ext.Msg.alert("提示", "提交成功");
								secondForm1.form.reset();
								cmb2store.reload();
								thirdWindow.hide();
							},
							failure : function(form, action) {
								var msg = action.result.msg;
								Ext.Msg.alert('提示', '操作失败!');
							}
						});
					}
				}, { // 窗口底部按钮配置
					text : '重置', // 按钮文本
					iconCls : 'tbar_synchronizeIcon', // 按钮图标
					handler : function() { // 按钮响应函数
						secondForm1.form.reset();
					}
				} ]
			});

			// 删除职位信息

			// 获取选择行
			function getCheckboxValues1() {
				// 返回一个行集合JS数组
				var rows = grid2.getSelectionModel().getSelections();
				if (Ext.isEmpty(rows)) {
					Ext.MessageBox.alert('提示', '您没有选中任何数据!');
					return;
				}
				// 将JS数组中的行级主键，生成以,分隔的字符串
				var positionIds = jsArray2JsString(rows, 'id');
				Ext.MessageBox.alert('提示', positionIds);
				// 获得选中数据后则可以传入后台继续处理

				Ext.Msg.confirm("提示", "确定删除吗？", function(btn, text) {
					if (btn == "yes") {
						Ext.Ajax.request({
							url : 'assistantSystem.ered?reqCode=delPosotion',
							params : {
								positionIds : positionIds
							},
							success : function(response) {
								Ext.Msg.alert("成功提示", "删除成功");
								cmb2store.reload();
								// thirdWindow.hide();
							},
							failure : function(response) {
								Ext.Msg.alert("失败提示", "删除失败");
							}
						});
					}

				});
			}
			
			//var downform = new Ext.form.FormPanel(){}

			// 导入
			var formpanel = new Ext.form.FormPanel({
				id : 'formpanel',
				name : 'formpanel',
				defaultType : 'textfield',
				labelAlign : 'right',
				labelWidth : 99,
				frame : true,
				fileUpload : true,
				items : [ {
					fieldLabel : '请选择导入文件',
					name : 'theFile',
					id : 'theFile',
					inputType : 'file',
					allowBlank : true,
					anchor : '99%'
				} ]
			});

			var importWindow = new Ext.Window(
					{
						layout : 'fit',
						width : 380,
						height : 100,
						resizable : false,
						draggable : true,
						closeAction : 'hide',
						title : '导入Excel',
						modal : false,
						collapsible : true,
						titleCollapse : true,
						maximizable : false,
						buttonAlign : 'right',
						border : false,
						animCollapse : true,
						animateTarget : Ext.getBody(),
						constrain : true,
						items : [ formpanel ],
						buttons : [
								{
									text : '下载模版',
									iconCls : 'acceptIcon',
									handler : function() {
										formpanel.form
										.submit({
											url : 'assistant.xls'
										});
									}
								},
								{
									text : '导入',
									iconCls : 'acceptIcon',
									handler : function() {
										var theFile = Ext.getCmp('theFile')
												.getValue();
										if (Ext.isEmpty(theFile)) {
											Ext.Msg.alert('提示',
													'请先选择您要导入的xls文件...');
											return;
										}
										if (theFile.substring(
												theFile.length - 4,
												theFile.length) != ".xls") {
											Ext.Msg.alert('提示',
													'您选择的文件格式不对,只能导入.xls文件!');
											return;
										}
										formpanel.form
												.submit({
													url : 'assistantSystem.ered?reqCode=importAssistantInfo',
													waitTitle : '提示',
													method : 'POST',
													waitMsg : '正在处理数据,请稍候...',
													success : function(form,
															action) {
														store
																.load({
																	params : {
																		start : 0,
																		limit : bbar.pageSize
																	}
																});
														importWindow.hide();
														Ext.MessageBox
																.alert(
																		'提示',
																		action.result.msg);

													},
													failure : function(form,
															action) {
														var msg = action.result.msg;
														Ext.MessageBox.alert(
																'提示',
																'参数数据保存失败:<br>'
																		+ msg);
													}
												});

									}
								}, {
									text : '关闭',
									id : 'btnReset',
									iconCls : 'deleteIcon',
									handler : function() {
										importWindow.hide();
									}
								} ]
					});

		});