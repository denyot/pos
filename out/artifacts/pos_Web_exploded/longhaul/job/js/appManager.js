
Ext.onReady(function() {
    var mode = "http";
	// 复选框
	var sm = new Ext.grid.CheckboxSelectionModel();
	
	var sm1 = new Ext.grid.CheckboxSelectionModel();

	// 定义自动当前页行号
	var rownum = new Ext.grid.RowNumberer({
		header : 'NO',
		width : 28
	});

	// 定义列模型
	var cm = new Ext.grid.ColumnModel([ rownum, sm
		, {
		header : '应用ID',
		dataIndex : 'fileid',
		sortable : true
	},
		{
		header : '应用名',
		dataIndex : 'title'
	}, {
		header : '大小(byte)',
		dataIndex : 'filesize'
	}, {
		header : '存储路径',
		dataIndex : 'path',
		width : 280
	}, {
		header : '上传日期',
		dataIndex : 'uploaddate',
		width : 130
	}, {
		header : '描述',
		dataIndex : 'remark'
	} ]);
	
	
	// 定义列模型1
	var cm1 = new Ext.grid.ColumnModel([ rownum, sm1
	, {
		header : 'ID',
		dataIndex : 'appcongid',
		sortable : true,
		width : 10
	},
		{
		header : '名称',
		dataIndex : 'appname'
	},
	{
		header : '方法',
		dataIndex : 'appmethod'
	},{
		header : '参数',
		dataIndex : 'paramvalue'
	}
	,{
		header : '类型',
		dataIndex : 'paramtype'
	},{
		header : '路径',
		dataIndex : 'path'
	}]);

	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : 'appManage.ered?reqCode=queryFileDatas'
		}),
		reader : new Ext.data.JsonReader({
			totalProperty : 'TOTALCOUNT',
			root : 'ROOT'
		}, [{
			name : 'fileid'
		},{
			name : 'title'
		}, {
			name : 'path'
		}, {
			name : 'uploaddate'
		}, {
			name : 'filesize'
		}, {
			name : 'remark'
		} ])
	});
	
	/**
	 * 数据存储
	 */
	var store1 = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : 'appManage.ered?reqCode=queryAppConfigDatas'
		}),
		reader : new Ext.data.JsonReader({
			totalProperty : 'TOTALCOUNT',
			root : 'ROOT'
		}, [{
			name : 'appcongid'
		},{
			name : 'appname'
		}, {
			name : 'appmethod'
		}, {
			name : 'paramvalue'
		}, {
			name : 'paramtype'
		}, {
			name : 'path'
		}])
	});

	
	
	// 翻页排序时带上查询条件
	store.on('beforeload', function() {
		this.baseParams = {
			title : Ext.getCmp('filetitle').getValue()
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
		number = parseInt(comboBox.getValue());
		store.reload({
			params : {
				start : 0,
				limit : bbar.pageSize
			}
		});
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

	// 表格工具栏
	var tbar = new Ext.Toolbar({
		items : [ {
			text : '上传应用',
			iconCls : 'uploadIcon',
			handler : function() {
				mode = 'http';
				firstWindow.show();
			}
		},'-', {
			text : '配置',
			iconCls : 'acceptIcon',
			handler : function() {
				ininEditCodeWindow();
									}
		},
//		'-', {
//			text : '修改',
//			iconCls : 'page_edit_1Icon',
//			handler : function() {
//				ininconfigeditCodeWindow();
//									}
//		},
		'-', {
			text : '查看',
			iconCls : 'page_edit_1Icon',
			handler : function() {
					
					store1.load({
			params : {
			start : 0,
			limit : bbar.pageSize,
			fileid: jsArray2JsString(grid.getSelectionModel().getSelections(),'fileid')
				}
			});
					ininViewWindow();
									}
		}
		,'-', {
			text : '删除应用',
			iconCls : 'deleteIcon',
			handler : function() {
				delFiles();
			}
		}, '->', {
			xtype : 'textfield',
			id : 'filetitle',
			name : 'filetitle',
			emptyText : '请输入应用名称',
			width : 150,
			enableKeyEvents : true,
			// 响应回车键
			listeners : {
				specialkey : function(field, e) {
					if (e.getKey() == Ext.EventObject.ENTER) {
						queryFiles();
					}
				}
			}
		}, {
			text : '查询',
			iconCls : 'page_findIcon',
			handler : function() {
				queryFiles();
			}
		}, {
			text : '刷新',
			iconCls : 'page_refreshIcon',
			handler : function() {
				store.reload();
			}
		} ]
	});
	
		// 表格工具栏1
	var tbar1 = new Ext.Toolbar({
		items : [ {
			text : '运行',
			iconCls : 'acceptIcon',
			handler : function() {
			 		 var rows = grid1.getSelectionModel().getSelections();
					 var appname = jsArray2JsString(rows,'appname');
					 var appmethod = jsArray2JsString(rows,'appmethod');
					 var paramvalue = jsArray2JsString(rows,'paramvalue');
					 var paramtype = jsArray2JsString(rows,'paramtype');
					 var path = jsArray2JsString(rows,'path');
				 Ext.Ajax.request({   
                        url : './appManage.ered?reqCode=startappmanger1',   
                        params : {   
                          appname : appname,
                          appmethod : appmethod,
                          paramvalue : paramvalue,
                          paramtype : paramtype,
                          path  : path
                          
                        },   
                        success : function() {   
                            Ext.MessageBox.alert('提示', '运行成功');   
                        //    store.reload();   
                        },   
                        failure : function() {   
                            Ext.MessageBox.alert('错误', '请与后台服务人员联系');   
                        },   
                        timeout : 30000,   
//                        headers : {   
//                            'my-header' : 'foo'  
//                        }   
                    });   

			}
		},'-', {
			text : '删除应用',
			iconCls : 'deleteIcon',
			handler : function() {
				delAppConfig();
			}
		}]
	});

	// 表格实例
	var grid = new Ext.grid.GridPanel({
		title : '<span class="commoncss">应用列表</span>',
		height : 500,
		frame : true,
		autoScroll : true,
		region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		store : store, // 数据存储
		stripeRows : true, // 斑马线
		cm : cm, // 列模型
		sm : sm, // 复选框
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
	
	// 表格实例1
	var grid1 = new Ext.grid.GridPanel({
		title : '<span class="commoncss">应用列表</span>',
		height : 230,
		frame : true,
		autoScroll : true,
		region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		store : store1, // 数据存储
		stripeRows : true, // 斑马线
		cm : cm1, // 列模型
		sm : sm1, // 复选框
		tbar : tbar1, // 表格工具栏
		bbar : bbar,// 分页工具栏
		viewConfig : {
		// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
		 forceFit : true
		},
		loadMask : {
			msg : '正在加载表格数据,请稍等...'
		}
	});

	grid.on("cellclick", function(pGrid, rowIndex, columnIndex, e) {
		var store = pGrid.getStore();
		var record = store.getAt(rowIndex);
		var fieldName = pGrid.getColumnModel().getDataIndex(columnIndex);
		// columnIndex为小画笔所在列的索引,缩阴从0开始
		// 这里要非常注意!!!!!
		if (fieldName == 'download' && columnIndex == 2) {
			var fileid = record.get("fileid");
			// 通过iFrame实现类ajax文件下载
			// 这个很重要
			var downloadIframe = document.createElement('iframe');
			downloadIframe.src = 'otherDemo.ered?reqCode=downloadFile&fileid=' + fileid;
			downloadIframe.style.display = "none";
			document.body.appendChild(downloadIframe);
		}
	});

	// 页面初始自动查询数据
	store.load({
		params : {
			start : 0,
			limit : bbar.pageSize
		}
	});
	
	

	// 布局模型
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [ grid ]
	});
     
	var firstForm = new Ext.form.FormPanel({
		id : 'firstForm',
		name : 'firstForm',
		fileUpload : true, // 一定要设置这个属性,否则获取不到上传对象的
		labelWidth : 60,
		defaultType : 'textfield',
		labelAlign : 'right',
		bodyStyle : 'padding:5 5 5 5',
		items : [ {
			fieldLabel : '选择应用',
			id : 'file1',
			name : 'file1', // 必须为file1/file2/file3/file4/file5.目前Web标准上传模式支持最多5个文件的批量上传
			xtype : 'fileuploadfield', // 上传字段
			allowBlank : false,
			anchor : '100%'
		}, {
			fieldLabel : '应用标题',
			id : 'title',
			name : 'title',
			disabled : true,
			fieldClass : 'x-custom-field-disabled',
			anchor : '100%'
		}, {
			fieldLabel : '应用描述',
			id : 'remark',
			name : 'remark',
			xtype : 'textarea',
			anchor : '100%'
		} ]
	});

	var firstWindow = new Ext.Window({
		title : '<span class="commoncss">上传应用</span>', // 窗口标题
		layout : 'fit', // 设置窗口布局模式
		width : 500, // 窗口宽度
		height : 200, // 窗口高度
		closable : true, // 是否可关闭
		collapsible : true, // 是否可收缩
		maximizable : true, // 设置是否可以最大化
		closeAction : 'hide',
		animCollapse : true,
		animateTarget : Ext.getBody(),
		border : false, // 边框线设置
		constrain : true, // 设置窗口是否可以溢出父容器
		// pageY : 20, // 页面定位X坐标
		pageX : document.body.clientWidth / 2 - 500 / 2, // 页面定位Y坐标
		items : [ firstForm ], // 嵌入的表单面板
		buttons : [ { // 窗口底部按钮配置
			text : '上传', // 按钮文本
			iconCls : 'uploadIcon', // 按钮图标
			handler : function() { // 按钮响应函数
			
		 firstForm.form.submit({
			url : 'appManage.ered?reqCode=doUpload',
			waitTitle : '提示',
			method : 'POST',
			waitMsg : '正在上传应用,请稍候...',
			timeout: 60000, // 60s
			success : function(form, action) {
				firstForm.form.reset();
				firstWindow.hide();
				if(mode=='http') store.reload();
				Ext.MessageBox.alert('提示', action.result.msg);

			},
			failure : function(response) {
				Ext.MessageBox.alert('提示', '文件上传失败');
			}
		});
			
		    
			 // submitTheForm();
			}
		}, { // 窗口底部按钮配置
			text : '重置', // 按钮文本
			iconCls : 'tbar_synchronizeIcon', // 按钮图标
			handler : function() { // 按钮响应函数
				firstForm.form.reset();
			}
		} ]
	});
	
	function startappmanger() {
					var rows = grid.getSelectionModel().getSelections();
					if (Ext.isEmpty(rows)) {
						Ext.Msg.alert('提示', '请先选中应用!');
						return;
					}
					var strChecked = jsArray2JsString(rows, 'trigger_name');
					var strChecked2 = jsArray2JsString(rows, 'trigger_group');
					Ext.Msg.confirm('请确认', '你真的要启动吗?', function(btn, text) {
								if (btn == 'yes') {
									Ext.Ajax.request({
												url : './appManage.ered?reqCode=startappmanger',
												success : function(response) {
													store.reload();
													var resultArray = Ext.util.JSON
															.decode(response.responseText);
													Ext.Msg.alert('提示', resultArray.msg);
												},
												failure : function(response) {
													var resultArray = Ext.util.JSON
															.decode(response.responseText);
													Ext.Msg.alert('提示', resultArray.msg);
												},
												params : {
													strChecked : strChecked,
													strChecked2:strChecked2
												}
											});
								}
							});
				}
	
	
function ininEditCodeWindow() {
		var record = grid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			Ext.Msg.alert('提示', '请先选中要配置的应用');
			return;
		}
		record = grid.getSelectionModel().getSelected();
		
		editCodeWindow.show();
		editCodeFormPanel.getForm().loadRecord(record);
	}  

function ininconfigeditCodeWindow() {
		var record = grid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			Ext.Msg.alert('提示', '请先选中要修改的应用');
			return;
		}
		record = grid.getSelectionModel().getSelected();
		
		configeditCodeWindow.show();
		configeditCodeFormPanel.getForm().loadRecord(record);
	}  
var configeditCodeWindow, configeditCodeFormPanel;

configeditCodeFormPanel = new Ext.form.FormPanel({
				collapsible : false,
						border : true,
						labelWidth : 60, // 标签宽度
						// frame : true, //是否渲染表单面板背景色
						labelAlign : 'right', // 标签对齐方式
						bodyStyle : 'padding:5 5 0', // 表单元素和表单面板的边距
						buttonAlign : 'center',
						height : 250,
				id : 'configeditCodeFormPanel',
				name : 'configeditCodeFormPanel',
				items : [
									{
									fieldLabel : '应用名',
									name : 'titles',
									xtype : 'textfield',
									maxLength : 100,
									anchor : '99%'
								},{
									fieldLabel : '方法名',
									name : 'methodname',
									xtype : 'textfield',
									maxLength : 100,
									anchor : '99%'
								},
								{
									fieldLabel : '路径',
									name : 'path',
									xtype : 'textfield',
									readOnly : true,
									anchor : '99%'
								},{layout : 'column',
									border : false,
									items : [{
												columnWidth : .33,
												layout : 'form',
												labelWidth : 60, // 标签宽度
												border : false,
												items : [{
															fieldLabel : '参数值',
															name : 'org_field_orgName_ext-gen20',
															xtype : 'textfield', // 设置为文字输入框类型
															maxLength : 25,
															anchor : '100%'
														}]
											}, {
												columnWidth : .33,
												layout : 'form',
												labelWidth : 60, // 标签宽度
												defaultType : 'textfield',
												border : false,
												items : [new Ext.form.ComboBox({
																	hiddenName : 'org_field_orgParent_ext-gen20',
																	fieldLabel : '参数类型',
																	emptyText : '请选择',
																	triggerAction : 'all',
																	store : new Ext.data.SimpleStore({
																				fields : ['name', 'code'],
																				data : [['String', 'String'], ['Integer', 'Integer'],
																					     ['Long', 'Long'], ['Float', 'Float'],
																					 ['Boolean', 'Boolean'], ['Byte', 'Byte'],
																					 ['Double', 'Double'], ['Character', 'Character']
																					]
																			}),
																	displayField : 'name',
																	valueField : 'code',
																	mode : 'local',
																	forceSelection : false, // 选中内容必须为下拉列表的子项
																	editable : false,
																	typeAhead : true,
																	resizable : true,
																	allowBlank : false,
																	anchor : '100%'
																})]
											},{
												columnWidth : .33,
												layout : 'form',
												labelWidth : 160, // 标签宽度
												border : false,
												labelAlign : 'center', 
											    items : [
											    	{ 
			                                         xtype: 'button',
                      								  text: '添加',
                       								 scope: this,
			                                      handler : function() {
											    		
            id = id + 1;
            //添加新的fieldSet
            var org_fieldSet = new Ext.Panel({            
                //column布局控件开始                
                id: 'org_fieldSet_' + id,
                layout: 'column',
                border: false,
               
                items: [//组件开始
                {   
                	
                	columnWidth : .33,
					labelWidth : 60, // 标签宽度
                    layout: 'form',
                    border: false,
                    items: [{
                        //为空
                        blankText: '参数值不能为空',
                        emptyText: '',
                        editable: false,
                        triggerAction: 'all',
                        allowBlank: false,
                        //为空                        
                        xtype: 'textfield',
                        fieldLabel: '参数值',
                        id: 'org_field_orgName_' + id,
                        name: 'org_field_orgName_' + id,
                        anchor: '100%'
                    
                    }]
                    
                } //组件结束
, //组件开始
                {
                    columnWidth : .33,
												layout : 'form',
												labelWidth : 60, // 标签宽度
												defaultType : 'textfield',
												border : false,
                    
                    
                    items: [
                    	new Ext.form.ComboBox({
																		hiddename : 'dw',
																		fieldLabel : '参数类型',
																		 blankText: '参数类型不能为空',
																		emptyText : '请选择',
																		triggerAction : 'all',
																		store : new Ext.data.SimpleStore({
																					fields : ['name', 'code'],
																					data : [['String', 'String'], ['Integer', 'Integer']]
																				}),
																		displayField : 'name',
																		valueField : 'code',
																		mode : 'local',
																		forceSelection : false, // 选中内容必须为下拉列表的子项
																		editable : false,
																		typeAhead : true,
																		resizable : true,
																		allowBlank : false,
																		id: 'org_field_orgParent_' + id,
																		anchor : '100%'
																})
                    	]
                } //组件结束
, //按钮开始
     
                {
                    columnWidth: .33,
                    layout: 'form',
                    border: false,
                    items: [{
                    
                        xtype: 'button',
                        text: '删除',
                        value: id,
                        scope: this,
                        
                        
                        handler: function(obj){
                            var del_id = obj.value;
                           
                            
                            var fieldSet_1 = Ext.getCmp('org_fieldSet_' + del_id);
                            //删除一行
                            configeditCodeFormPanel.remove(fieldSet_1, true);
                            
                        }
                    }]
                } //按钮结束
]
            
                //column布局控件结束
            });
            //添加fieldSet
            configeditCodeFormPanel.add(org_fieldSet);
            //重新剧新
            configeditCodeFormPanel.doLayout();
			}
		}],
											}]
								}]
			});


configeditCodeWindow = new Ext.Window({
				layout : 'fit',
				width : 450,
				height : 260,
				resizable : false,
				draggable : true,
				closeAction : 'hide',
				title : '<span class="commoncss">配置修改</span>',
				modal : true,
				collapsible : true,
				titleCollapse : true,
				maximizable : false,
				buttonAlign : 'right',
				border : false,
				animCollapse : true,
				animateTarget : Ext.getBody(),
				constrain : true,
				items : [configeditCodeFormPanel],
				buttons : [{
					text : '运行',
					iconCls : 'acceptIcon',
					handler : function() {
					 var rows = grid.getSelectionModel().getSelections();
					 var titles =  configeditCodeFormPanel.getForm().findField("titles").getValue(true);
					 var path = jsArray2JsString(rows,'path');
					 var methodname = configeditCodeFormPanel.getForm().findField("methodname").getValue(true);	
				//	 var pvalue = editCodeFormPanel.getForm().findField("pvalue").getValue(true);	
				//	  var ptype = editCodeFormPanel.getForm().findField("ptype").getValue(true);	
				//	 var appparm = editCodeFormPanel.getForm().findField("appparm").getValue(true);	
							configeditCodeWindow.getComponent('configeditCodeFormPanel').form.submit({
								url : './appManage.ered?reqCode=startappmanger',
								waitTitle : '提示',
								method : 'POST',
								waitMsg : '正在处理数据,请稍候...',
								success : function(form, action) {
									configeditCodeWindow.hide();
									store.reload();
								},
								failure : function(form, action) {
									var msg = action.result.msg;
									Ext.MessageBox.alert('提示', '操作失败!' + msg);
									configeditCodeWindow.getComponent('codeForm').form.reset();
								},
								params : {
										titles : titles,
										paht : path,
										methodname : methodname
									//	pvalue : pvalue,
									//	ptype : ptype
									//	appparm : appparm
										
												}
							});
						
					}
				}, {
					text : '保存',
					iconCls : 'acceptIcon',
					handler : function() {
						
					 var rows = grid.getSelectionModel().getSelections();
					 var titles =  configeditCodeFormPanel.getForm().findField("titles").getValue(true);
					 var path = jsArray2JsString(rows,'path');
					 var appid = jsArray2JsString(rows,'fileid');
					 var methodname = configeditCodeFormPanel.getForm().findField("methodname").getValue(true);	
				//	 var pvalue = editCodeFormPanel.getForm().findField("pvalue").getValue(true);	
				//	  var ptype = editCodeFormPanel.getForm().findField("ptype").getValue(true);	
				//	 var appparm = editCodeFormPanel.getForm().findField("appparm").getValue(true);	
							configeditCodeWindow.getComponent('configeditCodeFormPanel').form.submit({
								url : './appManage.ered?reqCode=savemanger',
								waitTitle : '提示',
								method : 'POST',
								waitMsg : '正在处理数据,请稍候...',
								success : function(form, action) {
									configeditCodeWindow.hide();
									store.reload();
								},
								failure : function(form, action) {
									var msg = action.result.msg;
									Ext.MessageBox.alert('提示', '操作失败!' + msg);
									configeditCodeWindow.getComponent('codeForm').form.reset();
								},
								params : {
										titles : titles,
										paht : path,
										methodname : methodname,
										appid :appid
									//	pvalue : pvalue,
									//	ptype : ptype
									//	appparm : appparm
										
												}
							});
						
					
					}
				},{
					text : '关闭',
					iconCls : 'deleteIcon',
					handler : function() {
						configeditCodeWindow.hide();
					}
				}]

			});




var editCodeWindow, editCodeFormPanel;
	editCodeFormPanel = new Ext.form.FormPanel({
		
				collapsible : false,
						border : true,
						labelWidth : 60, // 标签宽度
						// frame : true, //是否渲染表单面板背景色
						labelAlign : 'right', // 标签对齐方式
						bodyStyle : 'padding:5 5 0', // 表单元素和表单面板的边距
						buttonAlign : 'center',
						height : 250,
				id : 'editCodeFormPanel',
				name : 'editCodeFormPanel',
				items : [
									{
									fieldLabel : '应用名',
									name : 'titles',
									xtype : 'textfield',
									maxLength : 100,
									anchor : '99%'
								},{
									fieldLabel : '方法名',
									name : 'methodname',
									xtype : 'textfield',
									maxLength : 100,
									anchor : '99%'
								},
								{
									fieldLabel : '路径',
									name : 'path',
									xtype : 'textfield',
									readOnly : true,
									anchor : '99%'
								},{layout : 'column',
									border : false,
									items : [{
												columnWidth : .33,
												layout : 'form',
												labelWidth : 60, // 标签宽度
												border : false,
												items : [{
															fieldLabel : '参数值',
															name : 'org_field_orgName_ext-gen20',
															xtype : 'textfield', // 设置为文字输入框类型
															maxLength : 25,
															anchor : '100%'
														}]
											}, {
												columnWidth : .33,
												layout : 'form',
												labelWidth : 60, // 标签宽度
												defaultType : 'textfield',
												border : false,
												items : [new Ext.form.ComboBox({
																	hiddenName : 'org_field_orgParent_ext-gen20',
																	fieldLabel : '参数类型',
																	emptyText : '请选择',
																	triggerAction : 'all',
																	store : new Ext.data.SimpleStore({
																				fields : ['name', 'code'],
																					data : [['String', 'String'], ['Integer', 'Integer'],
																					     ['Long', 'Long'], ['Float', 'Float'],
																					 ['Boolean', 'Boolean'], ['Byte', 'Byte'],
																					 ['Double', 'Double'], ['Character', 'Character']
																					]
																			}),
																	displayField : 'name',
																	valueField : 'code',
																	mode : 'local',
																	forceSelection : false, // 选中内容必须为下拉列表的子项
																	editable : false,
																	typeAhead : true,
																	resizable : true,
																	allowBlank : false,
																	anchor : '100%'
																})]
											},{
												columnWidth : .33,
												layout : 'form',
												labelWidth : 160, // 标签宽度
												border : false,
												labelAlign : 'center', 
											    items : [
											    	{ 
			                                         xtype: 'button',
                      								  text: '添加',
                       								 scope: this,
			                                      handler : function() {
											    		
            id = id + 1;
            //添加新的fieldSet
            var org_fieldSet = new Ext.Panel({            
                //column布局控件开始                
                id: 'org_fieldSet_' + id,
                layout: 'column',
                border: false,
               
                items: [//组件开始
                {   
                	
                	columnWidth : .33,
					labelWidth : 60, // 标签宽度
                    layout: 'form',
                    border: false,
                    items: [{
                        //为空
                        blankText: '参数值不能为空',
                        emptyText: '',
                        editable: false,
                        triggerAction: 'all',
                        allowBlank: false,
                        //为空                        
                        xtype: 'textfield',
                        fieldLabel: '参数值',
                        id: 'org_field_orgName_' + id,
                        name: 'org_field_orgName_' + id,
                        anchor: '100%'
                    
                    }]
                    
                } //组件结束
, //组件开始
                {
                    columnWidth : .33,
												layout : 'form',
												labelWidth : 60, // 标签宽度
												defaultType : 'textfield',
												border : false,
                    
                    
                    items: [
                    	new Ext.form.ComboBox({
																		hiddename : 'dw',
																		fieldLabel : '参数类型',
																		 blankText: '参数类型不能为空',
																		emptyText : '请选择',
																		triggerAction : 'all',
																		store : new Ext.data.SimpleStore({
																					fields : ['name', 'code'],
																						data : [['String', 'String'], ['Integer', 'Integer'],
																					     ['Long', 'Long'], ['Float', 'Float'],
																					 ['Boolean', 'Boolean'], ['Byte', 'Byte'],
																					 ['Double', 'Double'], ['Character', 'Character']
																					]
																				}),
																		displayField : 'name',
																		valueField : 'code',
																		mode : 'local',
																		forceSelection : false, // 选中内容必须为下拉列表的子项
																		editable : false,
																		typeAhead : true,
																		resizable : true,
																		allowBlank : false,
																		id: 'org_field_orgParent_' + id,
																		anchor : '100%'
																})
                    	]
                } //组件结束
, //按钮开始
     
                {
                    columnWidth: .33,
                    layout: 'form',
                    border: false,
                    items: [{
                    
                        xtype: 'button',
                        text: '删除',
                        value: id,
                        scope: this,
                        
                        
                        handler: function(obj){
                            var del_id = obj.value;
                           
                            
                            var fieldSet_1 = Ext.getCmp('org_fieldSet_' + del_id);
                            //删除一行
                            editCodeFormPanel.remove(fieldSet_1, true);
                            
                        }
                    }]
                } //按钮结束
]
            
                //column布局控件结束
            });
            //添加fieldSet
            editCodeFormPanel.add(org_fieldSet);
            //重新剧新
            editCodeFormPanel.doLayout();
			}
		}],
											}]
								}]
			});
		
		editCodeWindow = new Ext.Window({
				layout : 'fit',
				width : 450,
				height : 260,
				resizable : false,
				draggable : true,
				closeAction : 'hide',
				title : '<span class="commoncss">配置</span>',
				modal : true,
				collapsible : true,
				titleCollapse : true,
				maximizable : false,
				buttonAlign : 'right',
				border : false,
				animCollapse : true,
				animateTarget : Ext.getBody(),
				constrain : true,
				items : [editCodeFormPanel],
				buttons : [{
					text : '运行',
					iconCls : 'acceptIcon',
					handler : function() {
					 var rows = grid.getSelectionModel().getSelections();
					 var titles =  editCodeFormPanel.getForm().findField("titles").getValue(true);
					 var path = jsArray2JsString(rows,'path');
					 var methodname = editCodeFormPanel.getForm().findField("methodname").getValue(true);	
				//	 var pvalue = editCodeFormPanel.getForm().findField("pvalue").getValue(true);	
				//	  var ptype = editCodeFormPanel.getForm().findField("ptype").getValue(true);	
				//	 var appparm = editCodeFormPanel.getForm().findField("appparm").getValue(true);	
							editCodeWindow.getComponent('editCodeFormPanel').form.submit({
								url : './appManage.ered?reqCode=startappmanger',
								waitTitle : '提示',
								method : 'POST',
								waitMsg : '正在处理数据,请稍候...',
								success : function(form, action) {
									editCodeWindow.hide();
									store.reload();
								},
								failure : function(form, action) {
									var msg = action.result.msg;
									Ext.MessageBox.alert('提示', '操作失败!' + msg);
									editCodeWindow.getComponent('codeForm').form.reset();
								},
								params : {
										titles : titles,
										paht : path,
										methodname : methodname
									//	pvalue : pvalue,
									//	ptype : ptype
									//	appparm : appparm
										
												}
							});
						
					}
				}, {
					text : '保存',
					iconCls : 'acceptIcon',
					handler : function() {
						
					 var rows = grid.getSelectionModel().getSelections();
					 var titles =  editCodeFormPanel.getForm().findField("titles").getValue(true);
					 var path = jsArray2JsString(rows,'path');
					 var appid = jsArray2JsString(rows,'fileid');
					 var methodname = editCodeFormPanel.getForm().findField("methodname").getValue(true);	
				//	 var pvalue = editCodeFormPanel.getForm().findField("pvalue").getValue(true);	
				//	  var ptype = editCodeFormPanel.getForm().findField("ptype").getValue(true);	
				//	 var appparm = editCodeFormPanel.getForm().findField("appparm").getValue(true);	
							editCodeWindow.getComponent('editCodeFormPanel').form.submit({
								url : './appManage.ered?reqCode=savemanger',
								waitTitle : '提示',
								method : 'POST',
								waitMsg : '正在处理数据,请稍候...',
								success : function(form, action) {
									editCodeWindow.hide();
									store.reload();
								},
								failure : function(form, action) {
									var msg = action.result.msg;
									Ext.MessageBox.alert('提示', '操作失败!' + msg);
									editCodeWindow.getComponent('codeForm').form.reset();
								},
								params : {
										titles : titles,
										paht : path,
										methodname : methodname,
										appid :appid
									//	pvalue : pvalue,
									//	ptype : ptype
									//	appparm : appparm
										
												}
							});
						
					
					}
				},{
					text : '关闭',
					iconCls : 'deleteIcon',
					handler : function() {
						editCodeWindow.hide();
					}
				}]

			});
	
		
		//  查看配置窗口
		
		function ininViewWindow() {
		var record = grid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			Ext.Msg.alert('提示', '请先选中要修改的应用');
			return;
		}
		record = grid.getSelectionModel().getSelected();
		viewport11.show();
		viewCodeWindow.show();
	}  
		viewport11 = new Ext.Viewport({
		layout : 'border',
		items : [ grid ]
	});
		
		
		
		var viewCodeWindow, viewCodeFormPanel;



viewCodeWindow = new Ext.Window({
				layout : 'fit',
				width : 450,
				height : 300,
				resizable : false,
				draggable : true,
				closeAction : 'hide',
				title : '<span class="commoncss">查看</span>',
				modal : true,
				collapsible : true,
				titleCollapse : true,
				maximizable : false,
				buttonAlign : 'right',
				border : false,
				animCollapse : true,
				animateTarget : Ext.getBody(),
				maximizable: true, 
				constrain : true,
				items : [grid1],
				buttons : [{
					text : '关闭',
					iconCls : 'deleteIcon',
					handler : function() {
						viewCodeWindow.hide();
					}
				}]

			});
	    
	 function submitConfigForm(){
		 alert(131);
		 var requesturl = 'appManage.ered?reqCode=queryAppConfigDatas&fileid=1';
	 }
	  
		
	/**
	 * 表单提交(表单自带Ajax提交)
	 */
	function submitTheForm() {
		if (!firstForm.form.isValid()) {
			return;
		var requesturl = 'appManage.ered?reqCode=doUpload';
		
		firstForm.form.submit({
			url : requesturl,
			waitTitle : '提示',
			method : 'POST',
			waitMsg : '正在上传应用,请稍候...',
			timeout: 60000, // 60s
			success : function(form, action) {
				firstForm.form.reset();
				firstWindow.hide();
				if(mode=='http') store.reload();
				Ext.MessageBox.alert('提示', action.result.msg);

			},
			failure : function(response) {
				Ext.MessageBox.alert('提示', '应用上传失败');
			}
		});
	}
}
	// 查询表格数据
	function queryFiles() {
		store.load({
			params : {
				start : 0,
				limit : bbar.pageSize,
				title : Ext.getCmp('filetitle').getValue()
			}
		});
	}

	// 获取选择行
	function getCheckboxValues() {
		// 返回一个行集合JS数组
		var rows = grid.getSelectionModel().getSelections();
		if (Ext.isEmpty(rows)) {
			Ext.MessageBox.alert('提示', '您没有选中任何数据!');
			return;
		}
		// 将JS数组中的行级主键，生成以,分隔的字符串
		var strChecked = jsArray2JsString(rows, 'fileid');
		Ext.MessageBox.alert('提示', strChecked);
		// 获得选中数据后则可以传入后台继续处理
	}

	// 生成一个下载图标列
	function downloadColumnRender(value) {
		return "<a href='javascript:void(0);'><img src='" + webContext
				+ "/resource/image/ext/download.png'/></a>";
		;
	}

	/**
	 * 删除应用
	 */
	function delFiles() {
		if (runMode == '0') {
			Ext.Msg.alert('提示', '系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
			return;
		}
		var rows = grid.getSelectionModel().getSelections();
		if (Ext.isEmpty(rows)) {
			Ext.Msg.alert('提示', '请先选中要删除的应用!');
			return;
		}
		var strChecked = jsArray2JsString(rows, 'fileid');
		Ext.Msg.confirm('请确认', '你真的要删除选中的应用吗?', function(btn, text) {
			if (btn == 'yes') {
				showWaitMsg();
				Ext.Ajax.request({
					url : 'appManage.ered?reqCode=delFiles',
					success : function(response) {
						var resultArray = Ext.util.JSON
								.decode(response.responseText);
						Ext.Msg.alert('提示', resultArray.msg);
						store.reload();
					},
					failure : function(response) {
						Ext.Msg.alert('提示', "应用删除失败");
					},
					params : {
						strChecked : strChecked
					}
				});
			}
		});
	}
	
		/**
	 * 删除配置应用文件
	 */
	function delAppConfig() {
		if (runMode == '0') {
			Ext.Msg.alert('提示', '系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
			return;
		}
		var rows = grid1.getSelectionModel().getSelections();
		if (Ext.isEmpty(rows)) {
			Ext.Msg.alert('提示', '请先选中要删除的数据!');
			return;
		}
		var strChecked = jsArray2JsString(rows, 'appcongid');
		var path = jsArray2JsString(rows, 'path');
		Ext.Msg.confirm('请确认', '你真的要删除选中的数据吗?', function(btn, text) {
			if (btn == 'yes') {
				showWaitMsg();
				Ext.Ajax.request({
					url : 'appManage.ered?reqCode=delAppConfig',
					success : function(response) {
						var resultArray = Ext.util.JSON
								.decode(response.responseText);
						Ext.Msg.alert('提示', resultArray.msg);
						store1.reload();
					},
					failure : function(response) {
						Ext.Msg.alert('提示', "数据删除失败");
					},
					params : {
						strChecked : strChecked ,
						path :path
					}
				});
			}
		});
	}

});