/**
 * RFC数据管理
 * 
 * @author XiongChun
 * @since 2010-02-13
 */
Ext.onReady(function() {
			var sm = new Ext.grid.CheckboxSelectionModel();
			var cm = new Ext.grid.ColumnModel([ new Ext.grid.RowNumberer(), sm,
					{
						header : '系统ID',
						dataIndex : 'sysid',
						sortable : true,
						width : 50
					}, {
						header : '客户端',
						dataIndex : 'client',
						width : 50
					}, {
						header : '应用服务器',
						dataIndex : 'host',
						width : 100
					}, {
						header : '系统编号',
						dataIndex : 'sysno',
						width : 50
					}, {
						header : '语言',
						dataIndex : 'lang',
						width : 50,
						renderer : LANGRender
					}, {
						header : '用户',
						width : 50,
						dataIndex : 'user'
					}, {
						header : '缓冲池连接数',
						width : 50,
						dataIndex : 'pool_capacity'
					}, {
						header : '峰值数量',
						width : 50,
						dataIndex : 'peak_limit'
					}, {
						header : 'SAP 路由',
						width : 150,
						dataIndex : 'saprouter'
					}, {
						header : '启用状态',
						width : 50,
						dataIndex : 'enabled',
						renderer : ENABLEDRender
					}, {
						header : '编辑模式',
						dataIndex : 'editmode',
						width : 50,
						renderer : EDITMODERender
					}, {
						header : '数据源ID',
						dataIndex : 'pk',
						hidden : false,
						width : 80,
						sortable : true
					} ]);

			var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
					url : './sapRfcParam.ered?reqCode=queryRfcItems'
				}),
				reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT',
					root : 'ROOT'
				}, [ {
					name : 'pk'
				}, {
					name : 'sysid'
				}, {
					name : 'client'
				}, {
					name : 'host'
				}, {
					name : 'sysno'
				}, {
					name : 'lang'
				}, {
					name : 'user'
				}, {
					name : 'pass'
				}, {
					name : 'mhost'
				}, {
					name : 'sapgroup'
				}, {
					name : 'pool_capacity'
				}, {
					name : 'peak_limit'
				}, {
					name : 'saprouter'
				}, {
					name : 'enabled'
				}, {
					name : 'editmode'
				} ])
			});

			// 翻页排序时带上查询条件
			store.on('beforeload', function() {
				this.baseParams = {
					queryParam : Ext.getCmp('queryParam').getValue()
				};
			});

			var pagesize_combo = new Ext.form.ComboBox({
				name : 'pagesize',
				hiddenName : 'pagesize',
				typeAhead : true,
				triggerAction : 'all',
				lazyRender : true,
				mode : 'local',
				store : new Ext.data.ArrayStore({
					fields : [ 'value', 'text' ],
					data : [ [ 10, '10条/页' ], [ 20, '20条/页' ], [ 50, '50条/页' ],
							[ 100, '100条/页' ], [ 250, '250条/页' ],
							[ 500, '500条/页' ] ]
				}),
				valueField : 'value',
				displayField : 'text',
				value : '50',
				editable : false,
				width : 85
			});
			var number = parseInt(pagesize_combo.getValue());
			pagesize_combo.on("select", function(comboBox) {
				bbar.pageSize = parseInt(comboBox.getValue());
				number = parseInt(comboBox.getValue());
				store.reload({
					params : {
						start : 0,
						limit : bbar.pageSize
					}
				});
			});

			var bbar = new Ext.PagingToolbar({
				pageSize : number,
				store : store,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
				emptyMsg : "没有符合条件的记录",
				items : [ '-', '&nbsp;&nbsp;', pagesize_combo ]
			})

			var grid = new Ext.grid.GridPanel({
				title : '<span class="commoncss">RFC数据列表</span>',
				iconCls : 'application_view_listIcon',
				height : 510,
				store : store,
				region : 'center',
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				},
				stripeRows : true,
				frame : true,
				cm : cm,
				sm : sm,
				tbar : [ {
					text : '新增',
					iconCls : 'page_addIcon',
					handler : function() {
						rfcWindow.show();
					}
				}, '-', {
					text : '修改',
					iconCls : 'page_edit_1Icon',
					handler : function() {
						ininEditRfcWindow();
					}
				}, '-', {
					text : '删除',
					iconCls : 'page_delIcon',
					handler : function() {
						deleteRfcItems();
					}
				}, '-', {
					text : '内存同步',
					iconCls : 'arrow_refreshIcon',
					handler : function() {
						synMemory('要对RFC数据进行内存同步操作吗?', '1');
					}
				}, '-', '提示:维护RFC后必须执行内存同步', '->', new Ext.form.TextField({
					id : 'queryParam',
					name : 'queryParam',
					emptyText : '系统ID|数据源ID',
					enableKeyEvents : true,
					listeners : {
						specialkey : function(field, e) {
							if (e.getKey() == Ext.EventObject.ENTER) {
								queryRfcItem();
							}
						}
					},
					width : 130
				}), {
					text : '查询',
					iconCls : 'previewIcon',
					handler : function() {
						queryRfcItem();
					}
				}, '-', {
					text : '刷新',
					iconCls : 'arrow_refreshIcon',
					handler : function() {
						store.reload();
					}
				} ],
				bbar : bbar
			});
			store.load({
				params : {
					start : 0,
					limit : bbar.pageSize
				}
			});

		grid.addListener('rowdblclick', ininEditRfcWindow);
			grid.on('sortchange', function() {
				// grid.getSelectionModel().selectFirstRow();
			});

			bbar.on("change", function() {
				// grid.getSelectionModel().selectFirstRow();
			});
			/**
			 * 新增代码对照表
			 */
			var rfcWindow;
			var formPanel;
			var langCombo = new Ext.form.ComboBox({
				name : 'lang',
				hiddenName : 'lang',
				store : LANGStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				value : 'ZH',
				fieldLabel : '语言',
				emptyText : '请选择...',
				labelStyle : micolor,
				allowBlank : false,
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : '100%'
			});
			var enabledCombo = new Ext.form.ComboBox({
				name : 'enabled',
				hiddenName : 'enabled',
				store : ENABLEDStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				value : '1',
				fieldLabel : '启用状态',
				emptyText : '请选择...',
				labelStyle : micolor,
				allowBlank : false,
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : '100%'
			});

			var editmodeCombo = new Ext.form.ComboBox({
				name : 'editmode',
				hiddenName : 'editmode',
				typeAhead : true,
				triggerAction : 'all',
				lazyRender : true,
				mode : 'local',
				store : EDITMODEStore,
				valueField : 'value',
				displayField : 'text',
				anchor : '100%',
				value : '1',
				editable : false,
				labelStyle : micolor,
				emptyText : '请选择...',
				fieldLabel : '编辑模式'
			});

			formPanel = new Ext.form.FormPanel({
				id : 'rfcForm',
				name : 'rfcForm',
				labelAlign : 'right',
				labelWidth : 60,
				frame : false,
				bodyStyle : 'padding:5 5 0',
				items : [{
				  layout : 'column',
				  border : false,
				  items : [{
						columnWidth : .5,
						layout : 'form',
						labelWidth : 80, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [{
									fieldLabel : '数据源ID',
									name : 'pk',
									anchor : '100%',
									labelStyle : micolor,
									allowBlank : false
								}, {
									fieldLabel : '用户',
									name : 'user',
									anchor : '100%',
									labelStyle : micolor,
									allowBlank : false
								}, {
									fieldLabel : '密码',
									name : 'pass',
									inputType:'password',
									anchor : '100%',
									labelStyle : micolor,
									allowBlank : false
								}, langCombo ,{
									fieldLabel : '缓冲池连接数',
									name : 'pool_capacity',
									xtype : 'numberfield', // 设置为数字输入框类型
									allowDecimals : false, // 是否允许输入小数
									allowNegative : false, // 是否允许输入负数
									maxValue : 50, // 允许输入的最大值
									minValue : 1, // 允许输入的最小值	
									value : 3,
									anchor : '100%',
									labelStyle : micolor,
									allowBlank : true
								}, {
									fieldLabel : '峰值数量',
									name : 'peak_limit',
									xtype : 'numberfield', // 设置为数字输入框类型
									allowDecimals : false, // 是否允许输入小数
									allowNegative : false, // 是否允许输入负数
									maxValue : 50, // 允许输入的最大值
									minValue : 1, // 允许输入的最小值	
									value : 10,
									anchor : '100%',
									labelStyle : micolor,
									allowBlank : true
								} ] 
				  },{
						columnWidth : .5,
						layout : 'form',
						labelWidth : 80, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ {
									fieldLabel : '系统ID',
									name : 'sysid',
									anchor : '100%',
									labelStyle : micolor,
									allowBlank : false
								}, {
									fieldLabel : '客户端',
									name : 'client',
									maxLength : 3, // 可输入的最大文本长度,不区分中英文字符
									minLength : 3,// 可输入的最小文本长度,不区分中英文字符									
									anchor : '100%',
									labelStyle : micolor,
									allowBlank : false
								}, {
									fieldLabel : '系统编号',
									name : 'sysno',
									value : '00',
									maxLength : 2, // 可输入的最大文本长度,不区分中英文字符
									minLength : 2,// 可输入的最小文本长度,不区分中英文字符										
									anchor : '100%',
									labelStyle : micolor,
									allowBlank : false
								},{
									fieldLabel : '应用服务器',
									name : 'host',
									anchor : '100%',
									labelStyle : micolor,
									allowBlank : true
								}, {
									fieldLabel : '消息服务器',
									name : 'mhost',
									anchor : '100%',
									labelStyle : micolor,
									allowBlank : true
								}, {
									fieldLabel : '登录组',
									name : 'sapgroup',
									anchor : '100%',
									labelStyle : micolor,
									allowBlank : true
								}
							]
				}]
			},{
				  layout : 'column',
				  border : false,
				  items : [{
					  columnWidth : .8,
						layout : 'form',
						labelWidth : 80, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [{
								fieldLabel : 'SAP 路由',
								name : 'saprouter',
								anchor : '100%',
								labelStyle : micolor,
								allowBlank : true
						}]
				  	}]
			 },{
				  layout : 'column',
				  border : false,
				  items : [{				 
				  	columnWidth : .5,
					layout : 'form',
					labelWidth : 80, // 标签宽度
					defaultType : 'textfield',
					border : false,
					items : [
						 enabledCombo
					]
				  },{
					  	columnWidth : .5,
						layout : 'form',
						labelWidth : 80, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [
							 editmodeCombo
						]
					  }]
			}]
			});

			rfcWindow = new Ext.Window(
					{
						layout : 'fit',
						width : 500,
						height : 280,
						resizable : false,
						draggable : true,
						closeAction : 'hide',
						title : '<span class="commoncss">新增Rfc数据</span>',
						// iconCls : 'page_addIcon',
						modal : true,
						collapsible : true,
						titleCollapse : true,
						maximizable : false,
						buttonAlign : 'right',
						border : false,
						animCollapse : true,
						animateTarget : Ext.getBody(),
						constrain : true,
						items : [ formPanel ],
						buttons : [
								{
									text : '保存',
									iconCls : 'acceptIcon',
									handler : function() {
										if (runMode == '0') {
											Ext.Msg
													.alert('提示',
															'系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
											return;
										}
										if (rfcWindow.getComponent('rfcForm').form
												.isValid()) {
											rfcWindow.getComponent('rfcForm').form
													.submit({
														url : './sapRfcParam.ered?reqCode=saveRfcItem',
														waitTitle : '提示',
														method : 'POST',
														waitMsg : '正在处理数据,请稍候...',
														success : function(
																form, action) {
															store.reload();
															Ext.Msg
																	.confirm(
																			'请确认',
																			'代码对照新增成功,您要继续添加代码对照吗?',
																			function(
																					btn,
																					text) {
																				if (btn == 'yes') {
																					rfcWindow
																							.getComponent('rfcForm').form
																							.reset();
																				} else {
																					rfcWindow
																							.hide();
																					synMemory('要立即进行内存同步吗？');
																				}
																			});
														},
														failure : function(
																form, action) {
															var msg = action.result.msg;
															Ext.MessageBox
																	.alert(
																			'提示',
																			'代码对照表保存失败:<br>'
																					+ msg);
															rfcWindow
																	.getComponent('rfcForm').form
																	.reset();
														}
													});
										} else {
											// 表单验证失败
										}
									}
								}, {
									text : '关闭',
									iconCls : 'deleteIcon',
									handler : function() {
										rfcWindow.hide();
									}
								} ]
					});

	
//			*****************修改代码对照***********************

			var langCombo_E = new Ext.form.ComboBox({
				name : 'lang',
				hiddenName : 'lang',
				store : LANGStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				value : 'ZH',
				fieldLabel : '语言',
				emptyText : '请选择...',
				labelStyle : micolor,
				allowBlank : false,
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : '100%'
			});
			var enabledCombo_E = new Ext.form.ComboBox({
				name : 'enabled',
				hiddenName : 'enabled',
				store : ENABLEDStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				value : '1',
				fieldLabel : '启用状态',
				emptyText : '请选择...',
				labelStyle : micolor,
				allowBlank : false,
				forceSelection : true,
				editable : false,
				typeAhead : true,
				anchor : '100%'
			});

			var editmodeCombo_E = new Ext.form.ComboBox({
				name : 'editmode',
				hiddenName : 'editmode',
				typeAhead : true,
				triggerAction : 'all',
				lazyRender : true,
				disabled : true,
				fieldClass : 'x-custom-field-disabled',
				mode : 'local',
				labelStyle : micolor,
				store : EDITMODEStore,
				valueField : 'value',
				displayField : 'text',
				anchor : '100%',
				value : '1',
				editable : false,
				emptyText : '请选择...',
				fieldLabel : '编辑模式'
			});
			var editRfcWindow, editRfcFormPanel;
			editRfcFormPanel = new Ext.form.FormPanel({
				labelAlign : 'right',
				labelWidth : 60,
				frame : false,
				bodyStyle : 'padding:5 5 0',
				id : 'editRfcFormPanel',
				name : 'editRfcFormPanel',
				items : [{
				  layout : 'column',
				  border : false,
				  items : [{
						columnWidth : .5,
						layout : 'form',
						labelWidth : 80, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [{
									fieldLabel : '数据源ID',
									name : 'pk',
									anchor : '100%',
									labelStyle : micolor,
									allowBlank : false
								}, {
									fieldLabel : '用户',
									name : 'user',
									anchor : '100%',
									labelStyle : micolor,
									allowBlank : false
								}, {
									fieldLabel : '密码',
									name : 'pass',
									inputType:'password',
									anchor : '100%',
									labelStyle : micolor,
									allowBlank : false
								}, langCombo_E,{
									fieldLabel : '缓冲池连接数',
									name : 'pool_capacity',
									xtype : 'numberfield', // 设置为数字输入框类型
									allowDecimals : false, // 是否允许输入小数
									allowNegative : false, // 是否允许输入负数
									maxValue : 50, // 允许输入的最大值
									minValue : 1, // 允许输入的最小值	
									value : 3,
									anchor : '100%',
									labelStyle : micolor,
									allowBlank : true
								}, {
									fieldLabel : '峰值数量',
									name : 'peak_limit',
									xtype : 'numberfield', // 设置为数字输入框类型
									allowDecimals : false, // 是否允许输入小数
									allowNegative : false, // 是否允许输入负数
									maxValue : 50, // 允许输入的最大值
									minValue : 1, // 允许输入的最小值	
									value : 10,
									anchor : '100%',
									labelStyle : micolor,
									allowBlank : true
								} ] 
				  },{
					columnWidth : .5,
						layout : 'form',
						labelWidth : 80, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [{
									fieldLabel : '系统ID',
									name : 'sysid',
									anchor : '100%',
									labelStyle : micolor,
									allowBlank : false
								}, {
									fieldLabel : '客户端',
									name : 'client',
									maxLength : 3, // 可输入的最大文本长度,不区分中英文字符
									minLength : 3,// 可输入的最小文本长度,不区分中英文字符									
									anchor : '100%',
									labelStyle : micolor,
									allowBlank : false
								}, {
									fieldLabel : '系统编号',
									name : 'sysno',
									value : '00',
									maxLength : 2, // 可输入的最大文本长度,不区分中英文字符
									minLength : 2,// 可输入的最小文本长度,不区分中英文字符										
									anchor : '100%',
									labelStyle : micolor,
									allowBlank : false
								},{
									fieldLabel : '应用服务器',
									name : 'host',
									anchor : '100%',
									labelStyle : micolor,
									allowBlank : true
								}, {
									fieldLabel : '消息服务器',
									name : 'mhost',
									anchor : '100%',
									labelStyle : micolor,
									allowBlank : true
								}, {
									fieldLabel : '登录组',
									name : 'sapgroup',
									anchor : '100%',
									labelStyle : micolor,
									allowBlank : true
								}]
				}]
			},{
				  layout : 'column',
				  border : false,
				  items : [{
					  columnWidth : .8,
						layout : 'form',
						labelWidth : 80, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [{
								fieldLabel : 'SAP 路由',
								name : 'saprouter',
								anchor : '100%',
								labelStyle : micolor,
								allowBlank : true
						}]
				  	}]
			 },{
				  layout : 'column',
				  border : false,
				  items : [{				 
				  	columnWidth : .5,
					layout : 'form',
					labelWidth : 80, // 标签宽度
					defaultType : 'textfield',
					border : false,
					items : [
						 enabledCombo_E
					]},{
					  	columnWidth : .5,
						layout : 'form',
						labelWidth : 80, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [
							 editmodeCombo_E
						]
					  }]
			}]
			});
			editRfcWindow = new Ext.Window(
					{
						layout : 'fit',
						width : 500,
						height : 280,
						resizable : false,
						draggable : true,
						closeAction : 'hide',
						title : '<span class="commoncss">修改Rfc数据</span>',
						modal : true,
						collapsible : true,
						titleCollapse : true,
						maximizable : false,
						buttonAlign : 'right',
						border : false,
						animCollapse : true,
						animateTarget : Ext.getBody(),
						constrain : true,
						items : [ editRfcFormPanel ],
						buttons : [
								{
									text : '保存',
									iconCls : 'acceptIcon',
									handler : function() {
										if (runMode == '0') {
											Ext.Msg
													.alert('提示',
															'系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
											return;
										}
										updateRfcItem();
									}
								}, {
									text : '关闭',
									iconCls : 'deleteIcon',
									handler : function() {
										editRfcWindow.hide();
									}
								} ]

					}); 
			/**
			 * 布局
			 */
			var viewport = new Ext.Viewport({
				layout : 'border',
				items : [ grid ]
			});

			/**
			 * 初始化代码修改出口
			 */
			function ininEditRfcWindow() {
				var record = grid.getSelectionModel().getSelected();
				if (Ext.isEmpty(record)) {
					Ext.Msg.alert('提示', '请先选中要修改的项目');
					return;
				}
				record = grid.getSelectionModel().getSelected();
				if (record.get('editmode') == '0') {
					Ext.Msg.alert('提示', '您选中的记录为系统内置的代码对照,不允许修改');
					return;
				}
				editRfcWindow.show();
				editRfcFormPanel.getForm().loadRecord(record);
			}

			/**
			 * 修改RFC数据
			 */
			function updateRfcItem() {
				if (!editRfcFormPanel.form.isValid()) {
					return;
				}
				editRfcFormPanel.form.submit({
					url : './sapRfcParam.ered?reqCode=updateRfcItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						editRfcWindow.hide();
						store.reload();
						synMemory('RFC数据修改成功,要立即进行内存同步吗？');
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', '代码对照表保存失败:<br>' + msg);
					}
				});
			}

			/**
			 * 内存同步
			 */
			function synMemory(msg, flag) {
				Ext.Msg.confirm('请确认', msg, function(btn, text) {
					if (btn == 'yes') {
						showWaitMsg();
						Ext.Ajax.request({
							url : 'sapRfcParam.ered?reqCode=synMemory',
							success : function(response) {
								if (flag == '1') {
									store.reload();
								}
								var resultArray = Ext.util.JSON
										.decode(response.responseText);
								Ext.Msg.alert('提示', resultArray.msg);
							},
							failure : function(response) {
								Ext.Msg.alert('提示', '内存同步失败');
							}
						});
					}
				});
			}

			/**
			 * 删除代码对照
			 */
			function deleteRfcItems() {
				if (runMode == '0') {
					Ext.Msg.alert('提示', '系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
					return;
				}
				var rows = grid.getSelectionModel().getSelections();
				var fields = '';
				for ( var i = 0; i < rows.length; i++) {
					if (rows[i].get('editmode') == '0') {
						fields = fields + rows[i].get('pk') + '->'
								+ rows[i].get('sysid') + '<br>';
					}
				}
				if (fields != '') {
					Ext.Msg.alert('提示', '<b>您选中的项目中包含如下系统内置的只读项目</b><br>'
							+ fields + '<font color=red>只读项目不能删除!</font>');
					return;
				}
				if (Ext.isEmpty(rows)) {
					Ext.Msg.alert('提示', '请先选中要删除的项目!');
					return;
				}
				var strChecked = jsArray2JsString(rows, 'pk');
				Ext.Msg.confirm('请确认', '你真的要删除RFC数据吗?', function(btn, text) {
					if (btn == 'yes') {
						showWaitMsg();
						Ext.Ajax.request({
							url : './sapRfcParam.ered?reqCode=deleteRfcItem',
							success : function(response) {
								store.reload();
								synMemory('RFC数据删除成功,要立即进行内存同步吗？');
							},
							failure : function(response) {
								var resultArray = Ext.util.JSON
										.decode(response.responseText);
								Ext.Msg.alert('提示', resultArray.msg);
							},
							params : {
								strChecked : strChecked
							}
						});
					}
				});
			}

			/**
			 * 根据条件查询RFC数据
			 */
			function queryRfcItem() {
				store.load({
					params : {
						start : 0,
						limit : bbar.pageSize,
						queryParam : Ext.getCmp('queryParam').getValue()
					}
				});
			}

			/**
			 * 刷新RFC数据
			 */
			function refreshRfcTable() {
				store.load({
					params : {
						start : 0,
						limit : bbar.pageSize
					}
				});
			}
		});