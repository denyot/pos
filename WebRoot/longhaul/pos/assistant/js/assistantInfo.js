/**
 * 表格综合示例
 * 
 * @author XiongChun
 * @since 2010-10-20
 */
Ext.onReady(function() {
	// 复选框
	var sm = new Ext.grid.CheckboxSelectionModel();

	// 定义自动当前页行号
	var rownum = new Ext.grid.RowNumberer({
		header : 'NO',
		width : 28
	});
	
	var assistantpositionStore = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : 'assistantSystem.ered?reqCode=getAssistantPositions'
		}),
		reader : new Ext.data.JsonReader({}, [ {
			name : 'id'
		}, {
			name : 'degreename'
		}, {
			name : 'remark'
		} ]),
		listeners : {
			// 设置远程数据源下拉选择框的初始值
		//	'load' : function(obj) {
				// areaCombo.setValue('530101');
			//}
		}
	});
	
	

	assistantpositionStore.load(); // 如果mode : 'local',时候才需要手动load();

	var assistantpositionCombo = new Ext.form.ComboBox({
		hiddenName : 'position',
		fieldLabel : '请选择职位',
		emptyText : '请选择...',
		triggerAction : 'all',
		store : assistantpositionStore,
		displayField : 'degreename',
		valueField : 'id',
		loadingText : '正在加载数据...',
		mode : 'local', // 数据会自动读取,如果设置为local又调用了store.load()则会读取2次；也可以将其设置为local，然后通过store.load()方法来读取
		forceSelection : true,
		typeAhead : true,
		resizable : true,
		editable : false,
		// value : '530101',
		anchor : '100%'
	// 设置远程数据源下拉选择框的初始值(此延时方法不好，使用上面的监听areaStore的load事件的方法)
	/*
	 * listeners : { 'render' : function(obj) { areaStore.load();
	 * window.setTimeout(function() { obj.setValue('530101'); }, 200) } }
	 */
	});
	
	

	// 定义列模型
	var cm = new Ext.grid.ColumnModel([ rownum, sm, {
		header : '操作', // 列标题
		dataIndex : 'edit',
		width : 35,
		renderer : iconColumnRender
	}, {
		header : '编号', // 列标题
		dataIndex : 'assistantno', // 数据索引:和Store模型对应
		sortable : true,// 是否可排序
		hidden : true,
		width : 50
	}, {
		header : '店铺名', // 列标题
		dataIndex : 'store_number', // 数据索引:和Store模型对应
		sortable : true,// 是否可排序
		width : 100
	}, {
		header : '服务员名',
		dataIndex : 'assistant_name',
		sortable : true,
		width : 150
	// 列宽
	},  {
		header : '电话',
		dataIndex : 'telephone',
		sortable : true,
		width : 150
	},{
		header : '服务员职位',
		dataIndex : 'position',
		hidden : true, // 隐藏列
		sortable : true,
		width : 50
	// 列宽
	}, {
		header : '职位名',
		dataIndex : 'position_name',
		sortable : true,
		width : 150
	}, {
		header : '备注',
		dataIndex : 'remark'
	} ]);

	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
			url : 'assistantSystem.ered?reqCode=getAsistantInfo'
		}),
		// 数据读取器
		reader : new Ext.data.JsonReader({
			totalProperty : 'TOTALCOUNT', // 记录总数
			root : 'ROOT' // Json中的列表数据根节点
		}, [{
			name : 'assistantno'
		}, {
			name : 'store_number'
		}, {
			name : 'assistant_name'
		}, {
			name : 'telephone'
		}, {
			name : 'position'
		}, {
			name : 'position_name'
		}, {
			name : 'remark'
		} ])
	});

	// 翻页排序时带上查询条件
	store.on('beforeload', function() {
		this.baseParams = {
			assistant_name : Ext.getCmp('assistant_name').getValue()
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
			xtype : 'textfield',
			id : 'assistant_name',
			name : 'assistant_name',
			emptyText : '营业员姓名',
			width : 150,
			enableKeyEvents : true,
			// 响应回车键
			listeners : {
				specialkey : function(field, e) {
					if (e.getKey() == Ext.EventObject.ENTER) {
						queryCatalogItem();
					}
				}
			}
		}, {
			text : '查询',
			iconCls : 'page_findIcon',
			handler : function() {
				queryCatalogItem();
			}
		}, {
			text : '刷新',
			iconCls : 'page_refreshIcon',
			handler : function() {
				store.reload();
			}
		}, '-', {
			text : '删除',
			iconCls : 'deleteIcon',
			handler : function() {
				getCheckboxValues();
			}
		}, '-', {
			text : '添加',
			iconCls : 'addIcon',
			handler : function() {
				firstWindow1.show();
			}
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
	var grid = new Ext.grid.GridPanel({
		// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
		title : '<span class="commoncss">营业员信息</span>',
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

	// 是否默认选中第一行数据
	bbar.on("change", function() {
		// grid.getSelectionModel().selectFirstRow();

	});

	// 页面初始自动查询数据
	// store.load({params : {start : 0,limit : bbar.pageSize}});
	
	var record ;
	
	// 小画笔点击事件
	grid.on("cellclick", function(pGrid, rowIndex, columnIndex, e) {
		var store = pGrid.getStore();
		record = store.getAt(rowIndex);
		var fieldName = pGrid.getColumnModel().getDataIndex(columnIndex);
		// columnIndex为小画笔所在列的索引,缩阴从0开始
		// 这里要非常注意!!!!!
		if (fieldName == 'edit' && columnIndex == 2) {
			//var assistant_name = record.get("assistant_name");
			// 到此你就可以继续做其他任何事情了
			//Ext.MessageBox.alert('提示', assistant_name);
			
			firstWindow.show();
			firstForm.form.loadRecord(record);
			
			
		}
	});

	// 监听单元格双击事件
	grid.on("celldblclick", function(pGrid, rowIndex, columnIndex, e) {
		var record = pGrid.getStore().getAt(rowIndex);
		var fieldName = pGrid.getColumnModel().getDataIndex(columnIndex);
		var cellData = record.get(fieldName);
		// Ext.MessageBox.alert('提示', cellData);
	});

	// 监听行双击事件
	grid.on('rowdblclick', function(pGrid, rowIndex, event) {
		// 获取行数据集
		var record = pGrid.getStore().getAt(rowIndex);
		// 获取单元格数据集
		var data = record.get("assistant_name");
		//Ext.MessageBox.alert('提示', "双击行的索引为:" + rowIndex);
	});

	// 给表格绑定右键菜单
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
		e.preventDefault(); // 拦截默认右键事件
		grid.getSelectionModel().selectRow(rowIndex); // 选中当前行
		contextmenu.showAt(e.getXY());
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
				assistant_name : Ext.getCmp('assistant_name').getValue()
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
		var store_numbers = jsArray2JsString(rows, 'store_numbers');
		var assistantnos = jsArray2JsString(rows, 'assistantno');
		// Ext.MessageBox.alert('提示', store_numbers +":"+ assistant_name);
		// 获得选中数据后则可以传入后台继续处理
		Ext.Msg.confirm("提示", "确定删除吗？", function(btn, text) {
			if (btn == "yes") {
				Ext.Ajax.request({
					url : 'assistantSystem.ered?reqCode=delAssistantInfo',
					params : {
						assistantnos : assistantnos
					},
					success : function(response) {
						Ext.Msg.alert("成功提示", "删除成功");
						queryCatalogItem();
					},
					failure : function(response) {
						Ext.Msg.alert("失败提示", "删除失败");
						queryCatalogItem();
					}
				});
			}

		});

	}

	// 生成一个图标列
	function iconColumnRender(value) {
		return "<a href='javascript:void(0);'><img src='" + webContext + "/resource/image/ext/edit1.png'/></a>";
		;
	}

	queryCatalogItem();
	
	
	
	var firstForm = new Ext.form.FormPanel({
		id : 'firstForm',
		name : 'firstForm',
		labelWidth : 90, // 标签宽度
		// frame : true, //是否渲染表单面板背景色
		defaultType : 'textfield', // 表单元素默认类型
		labelAlign : 'right', // 标签对齐方式
		bodyStyle : 'padding:5 5 5 5', // 表单元素和表单面板的边距
		items : [ assistantpositionCombo, {
			fieldLabel : '姓名', // 标签
			name : 'assistant_name', // name:后台根据此name属性取值
			allowBlank : false, // 是否允许为空
			maxLength : 8, // 可输入的最大文本长度,不区分中英文字符
			minLength : 2,// 可输入的最小文本长度,不区分中英文字符
			anchor : '100%' // 宽度百分比
		}, {
			fieldLabel : '电话',
			name : 'telephone',
			maxLength : 20,
			minLength : 7,
			anchor : '100%'
		}, {
			fieldLabel : '备注',
			name : 'remark',
			xtype : 'textarea',
			height : 50, // 设置多行文本框的高度
			emptyText : '备注信息', // 设置默认初始值
			anchor : '100%'
		}, {
			fieldLabel : '编号',
			name : 'assistantno',
			hidden : true,
			height : 50, // 设置多行文本框的高度
			anchor : '100%'
		} ]
	});

	var firstWindow = new Ext.Window({
		title : '<span class="commoncss">更新营业员信息</span>', // 窗口标题
		layout : 'fit', // 设置窗口布局模式
		width : 350, // 窗口宽度
		height : 240, // 窗口高度
		closable : true, // 是否可关闭
		collapsible : true, // 是否可收缩
		maximizable : true, // 设置是否可以最大化
		border : false, // 边框线设置
		constrain : true, // 设置窗口是否可以溢出父容器
		pageY : 20, // 页面定位Y坐标
		pageX : document.body.clientWidth / 4 - 200 / 2, // 页面定位X坐标
		items : [ firstForm ], // 嵌入的表单面板
		closeAction : 'hide',
		buttons : [ { // 窗口底部按钮配置
			text : '更新', // 按钮文本
			iconCls : 'tbar_synchronizeIcon', // 按钮图标
			handler : function() { // 按钮响应函数
				
				Ext.Msg.confirm("提示", "确定更新吗？", function(btn, text) {
					
					if(btn == "yes"){
						var oldname  = record.get("assistant_name");
						
						firstForm.form.submit({
							url : 'assistantSystem.ered?reqCode=updateAssistantInfo',
							waitTitle : '提示',
							method : 'POST',
							params :{oldname : oldname},
							waitMsg : '正在处理数据,请稍候...',
							success : function(form, action) {
								Ext.Msg.alert("提示", "提交成功");
								firstWindow.hide();
								queryCatalogItem();
							},
							failure : function(form, action) {
								var msg = action.result.msg;
								Ext.Msg.alert('提示', '操作失败!');
							}
						});
					}
				});
			}
		}, { // 窗口底部按钮配置
			text : '重置', // 按钮文本
			iconCls : 'tbar_synchronizeIcon', // 按钮图标
			handler : function() { // 按钮响应函数
				firstForm.form.reset();
			}
		} ]
	});
	

	// 复选框
	var sm = new Ext.grid.CheckboxSelectionModel();

	// 定义自动当前页行号
	var rownum = new Ext.grid.RowNumberer({
				header : 'NO',
				width : 28
			});

	// 定义列模型
	var cm = new Ext.grid.ColumnModel([rownum, sm, {
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
	}]);
	// 表格工具栏
	var tbar2 = new Ext.Toolbar({
				items : [{
							text : '新增',
							iconCls : 'addIcon',
							handler : function() {
								thirdWindow.show();
							}
						}, {
							text : '刷新',
							iconCls : 'page_refreshIcon',
							handler : function() {
								assistantpositionStore.reload();
							}
						}, '-', {
							text : '删除',
							iconCls : 'deleteIcon',
							handler : function() {
								getCheckboxValues1();
							}
						}]
			});
	var grid2 = new Ext.grid.GridPanel({
				// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
				height : 500,
				frame : true,
				autoScroll : true,
				region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
				store : assistantpositionStore, // 数据存储
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

	var assistantpositionCombo = new Ext.form.ComboBox({
		hiddenName : 'position',
		fieldLabel : '请选择职位',
		emptyText : '请选择...',
		triggerAction : 'all',
		store : assistantpositionStore,
		displayField : 'degreename',
		valueField : 'id',
		loadingText : '正在加载数据...',
		mode : 'local', // 数据会自动读取,如果设置为local又调用了store.load()则会读取2次；也可以将其设置为local，然后通过store.load()方法来读取
		forceSelection : true,
		typeAhead : true,
		resizable : true,
		editable : false,
		// value : '530101',
		anchor : '100%'
			// 设置远程数据源下拉选择框的初始值(此延时方法不好，使用上面的监听areaStore的load事件的方法)
			/*
			 * listeners : { 'render' : function(obj) { areaStore.load();
			 * window.setTimeout(function() { obj.setValue('530101'); }, 200) } }
			 */
		});

	var firstForm1 = new Ext.form.FormPanel({
				id : 'firstForm',
				name : 'firstForm',
				labelWidth : 90, // 标签宽度
				// frame : true, //是否渲染表单面板背景色
				defaultType : 'textfield', // 表单元素默认类型
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:5 5 5 5', // 表单元素和表单面板的边距
				items : [assistantpositionCombo, {
							fieldLabel : '姓名', // 标签
							name : 'assistant_name1', // name:后台根据此name属性取值
							allowBlank : false, // 是否允许为空
							maxLength : 8, // 可输入的最大文本长度,不区分中英文字符
							minLength : 2,// 可输入的最小文本长度,不区分中英文字符
							anchor : '100%',// 宽度百分比
							minLength ：2
						}, {
							fieldLabel : '电话',
							name : 'telephone1',
							maxLength : 20,
							minLength : 7,
							anchor : '100%'
						}, {
							fieldLabel : '备注',
							name : 'remark1',
							xtype : 'textarea',
							height : 50, // 设置多行文本框的高度
							emptyText : '备注信息', // 设置默认初始值
							anchor : '100%'
						}]
			});

	var firstWindow1 = new Ext.Window({
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
		items : [firstForm1], // 嵌入的表单面板
		buttons : [{ // 窗口底部按钮配置
			text : '职位管理', // 按钮文本
			iconCls : 'configIcon', // 按钮图标
			handler : function() { // 按钮响应函数
				secondWindow.show();
			}
		}, {	// 窗口底部按钮配置
					text : '提交', // 按钮文本
					iconCls : 'tbar_synchronizeIcon', // 按钮图标
					handler : function() { // 按钮响应函数
						firstForm1.form.submit({
							url : 'assistantSystem.ered?reqCode=saveAssistantInfo',
							waitTitle : '提示',
							method : 'POST',
							waitMsg : '正在处理数据,请稍候...',
							success : function(form, action) {
								Ext.Msg.alert("提示", "提交成功");
								firstForm1.form.reset();
								store.reload();
								firstWindow1.hide();
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
						firstForm1.form.reset();
					}
				}]
	});

	var secondForm = new Ext.form.FormPanel({
				id : 'secondForm',
				name : 'secondForm',
				labelWidth : 90, // 标签宽度
				// frame : true, //是否渲染表单面板背景色
				defaultType : 'textfield', // 表单元素默认类型
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:5 5 5 5', // 表单元素和表单面板的边距
				items : [{
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
						}]
			});

	var secondWindow = new Ext.Window({
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
		items : [grid2] // 嵌入的表单面板
	});
	
	
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
		items : [secondForm], // 嵌入的表单面板
		buttons : [{ // 窗口底部按钮配置
			text : '提交', // 按钮文本
			iconCls : 'tbar_synchronizeIcon', // 按钮图标
			handler : function() { // 按钮响应函数
				secondForm.form.submit({
							url : 'assistantSystem.ered?reqCode=savePosition',
							waitTitle : '提示',
							method : 'POST',
							waitMsg : '正在处理数据,请稍候...',
							success : function(form, action) {
								Ext.Msg.alert("提示", "提交成功");
								secondForm.form.reset();
								assistantpositionStore.reload();
								thirdWindow.hide();
							},
							failure : function(form, action) {
								var msg = action.result.msg;
								Ext.Msg.alert('提示', '操作失败!');
							}
						});
			}
		}, {	// 窗口底部按钮配置
					text : '重置', // 按钮文本
					iconCls : 'tbar_synchronizeIcon', // 按钮图标
					handler : function() { // 按钮响应函数
						secondForm.form.reset();
					}
				}]
	});

	
	

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
						assistantpositionStore.reload();
						//thirdWindow.hide();
					},
					failure : function(response) {
						Ext.Msg.alert("失败提示", "删除失败");
					}
				});
			}

		});
		
	}


	
	

});