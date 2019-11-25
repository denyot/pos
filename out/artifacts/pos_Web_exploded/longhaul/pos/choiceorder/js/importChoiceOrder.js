/**
 * Excel导入
 * 
 * @author XiongChun
 * @since 2010-08-20
 */
Ext
		.onReady(function() {
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

			var window = new Ext.Window(
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
													url : 'choiceOrderSystem.ered?reqCode=importChoiceOrderExcel',
													waitTitle : '提示',
													method : 'POST',
													waitMsg : '正在处理数据,请稍候...',
													success : function(form) {

														Ext.Msg.alert('提示',
																"导入成功！");
														// window.hide();
													},
													failure : function(form,
															action) {
														Ext.MessageBox.alert(
																'提示',
																'参数数据保存失败！');

														var cm = new Ext.grid.ColumnModel(
																[
																		{
																			header : '物料号',
																			dataIndex : 'matnr',
																			editor : new Ext.grid.GridEditor(
																					new Ext.form.TextField(
																							{})),
																			width : 120
																		},
																		{
																			header : '错误行数',
																			width : 100,
																			dataIndex : 'rownum',
																			hidden : false
																		},
																		{
																			header : '错误原因',
																			width : 180,
																			dataIndex : 'err',
																			hidden : false
																		} ]);

														var obj = eval('('
																+ action.result.msg
																+ ')');

														if (obj != null) {
															var store = new Ext.data.Store(
																	{
																		proxy : new Ext.data.MemoryProxy(
																				obj),
																		reader : new Ext.data.JsonReader(
																				{
																					root : 'ROOT'
																				},
																				[
																						{
																							name : 'matnr'
																						},
																						{
																							name : 'err'
																						},
																						{
																							name : 'rownum'
																						} ])
																	});

															store.load();

															var grid = new Ext.grid.EditorGridPanel(
																	{
																		// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
																		height : 300,
																		frame : true,
																		autoScroll : true,
																		region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
																		store : store, // 数据存储
																		stripeRows : true, // 斑马线
																		cm : cm, // 列模型
																		clicksToEdit : 1,
																		viewConfig : {
																		// 不产横向生滚动条,
																		// 各列自动扩展自动压缩,
																		// 适用于列数比较少的情况
																		// forceFit
																		// :
																		// true
																		}
																	});

															var oppanel = new Ext.Panel(
																	{
																		layout : 'fit',
																		items : [ grid ]
																	});

															var errorWindow = new Ext.Window(
																	{
																		title : '<span class="commoncss">错误清单</span>', // 窗口标题
																		// layout
																		// :
																		// 'fit',
																		// //
																		// 设置窗口布局模式
																		width : 400, // 窗口宽度
																		iconCls : 'window_caise_listIcon', // 按钮图标
																		height : 300, // 窗口高度
																		closable : true, // 是否可关闭
																		collapsible : true, // 是否可收缩
																		maximizable : true, // 设置是否可以最大化
																		border : false, // 边框线设置
																		autoScroll : true,
																		constrain : true, // 设置窗口是否可以溢出父容器
																		pageY : 20, // 页面定位Y坐标
																		pageX : document.body.clientWidth / 2 - 400 / 2, // 页面定位X坐标
																		items : [ oppanel ], // 嵌入的表单面板
																		closeAction : 'hide'
																	});
															errorWindow.show();
														}
													}
												});

									}
								},{
									text : '下载模版',
									id : 'download',
									iconCls : 'deleteIcon',
									handler : function() {
										document.location.href = 'temp.xls';
									}
								}, {
									text : '关闭',
									id : 'btnReset',
									iconCls : 'deleteIcon',
									handler : function() {
										window.hide();
									}
								} ]
					});

			window.show();

		});