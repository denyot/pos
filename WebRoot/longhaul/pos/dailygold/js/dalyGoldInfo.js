/**
 * 表格综合示例
 * 
 * @author XiongChun
 * @since 2010-10-20
 */
Ext.onReady(function() {

	// 定义自动当前页行号
	var rownum = new Ext.grid.RowNumberer({
		header : 'NO',
		width : 28
	});

	// 定义列模型
	var cm = new Ext.grid.ColumnModel([ rownum, {
		header : '店铺名',
		dataIndex : 'storenumbers',
		sortable : true,
		width : 150
	// 列宽
	},  {
		header : '金价类型',
		dataIndex : 'goldtype',
		sortable : true,
		width : 150
	},{
		header : '金价',
		dataIndex : 'goldvalue',
		sortable : true,
		width : 50
	// 列宽
	}, {
		header : '金价日期',
		dataIndex : 'golddate',
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
			url : 'dailyGoldSystem.ered?reqCode=getDailyGoldInfo'
		}),
		// 数据读取器
		reader : new Ext.data.JsonReader({
			totalProperty : 'TOTALCOUNT', // 记录总数
			root : 'ROOT' // Json中的列表数据根节点
		}, [ {
			name : 'id'
		}, {
			name : 'storenumbers'
		}, {
			name : 'goldtype'
		}, {
			name : 'goldvalue'
		}, {
			name : 'golddate'
		}, {
			name : 'remark'
		} ])
	});

	// 翻页排序时带上查询条件
	store.on('beforeload', function() {
		this.baseParams = {
			goldType : Ext.getCmp('goldType').getValue()
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
	var goldTypeCombo = new Ext.form.ComboBox({
		hiddenName : 'goldtype',
		fieldLabel : '请选择类型',
		emptyText : '请选择...',
		triggerAction : 'all',
		allowBlank : false,
		typeAhead: true,
		store :  new Ext.data.ArrayStore({
	        fields: ['name', 'value'],
	        data : [
		            ['PT900','PT90'],['PT950','PT95'],['PT990','PT99'],['PT999','PT9X'],['千足金','G999'],['足金','G990']
		            ,['PD950','PD95'],['PD990','PD99']
		    ]
	    }),
		displayField : 'name',
		valueField : 'value',
		lazyRender:true,
		mode: 'local',
		editable : false,
		// value : '530101',
		anchor : '100%'
	// 设置远程数据源下拉选择框的初始值(此延时方法不好，使用上面的监听areaStore的load事件的方法)
	/*
	 * listeners : { 'render' : function(obj) { areaStore.load();
	 * window.setTimeout(function() { obj.setValue('530101'); }, 200) } }
	 */
	});
	var goldTypeCombo2 = new Ext.form.ComboBox({
		hiddenName : 'mygoldtype',
		id : 'goldType' ,
		fieldLabel : '请选择类型',
		emptyText : '请选择...',
		triggerAction : 'all',
		typeAhead: true,
		store :  new Ext.data.ArrayStore({
	        fields: ['name', 'value'],
	        data : [['所有',''],
		            ['PT900','PT90'],['PT950','PT95'],['PT990','PT99'],['千足金','G999'],['足金','G990']
		            ,['PD950','PD95'],['PD990','PD99']
		    ]
	    }),
		displayField : 'name',
		valueField : 'value',
		lazyRender:true,
		mode: 'local',
		editable : false,
		// value : '530101',
		anchor : '100%'
	// 设置远程数据源下拉选择框的初始值(此延时方法不好，使用上面的监听areaStore的load事件的方法)
	/*
	 * listeners : { 'render' : function(obj) { areaStore.load();
	 * window.setTimeout(function() { obj.setValue('530101'); }, 200) } }
	 */
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
		items : [ goldTypeCombo2,
//			{
//			xtype : 'combo',
//			id : 'goldType',
//			//name : 'goldType',
//			hiddenName : 'goldtype',
//		fieldLabel : '请选择类型',
//		emptyText : '请选择...',
//		triggerAction : 'all',
//		typeAhead: true,
//			store :  new Ext.data.ArrayStore({
//		        fields: ['name', 'value'],
//		        data : [
//			            ['PT900','PT90'],['PT950','PT95'],['PT990','PT99'],['千足金','G999']
//			            ,['PD950','PD95'],['PD990','PD99']
//			    ]
//		    }),
//		    displayField : 'name',
//			valueField : 'value',
//			emptyText : '金价类型',
//			width : 150
////			enableKeyEvents : true,
////			// 响应回车键
////			listeners : {
////				specialkey : function(field, e) {
////					if (e.getKey() == Ext.EventObject.ENTER) {
////						queryCatalogItem();
////					}
////				}
////			}
//		}, 
			{
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
			text : '输入金价信息',
			handler : function() {
				inputDailyGold();
			}
		} ]
	});

	
	

	// 表格实例
	var grid = new Ext.grid.GridPanel({
		// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
		title : '<span class="commoncss">每日金价信息</span>',
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

	// 是否默认选中第一行数据
	bbar.on("change", function() {
		// grid.getSelectionModel().selectFirstRow();

	});

	// 页面初始自动查询数据
	// store.load({params : {start : 0,limit : bbar.pageSize}});


	// 监听单元格双击事件
	grid.on("celldblclick", function(pGrid, rowIndex, columnIndex, e) {
		var record = pGrid.getStore().getAt(rowIndex);
		var fieldName = pGrid.getColumnModel().getDataIndex(columnIndex);
		var cellData = record.get(fieldName);
		// Ext.MessageBox.alert('提示', cellData);
	});

	// 监听行双击事件
	grid.on('rowdblclick', function(pGrid, rowIndex, event) {
//		// 获取行数据集
//		var record = pGrid.getStore().getAt(rowIndex);
//		// 获取单元格数据集
//		var data = record.get("assistant_name");
//		Ext.MessageBox.alert('提示', "双击行的索引为:" + rowIndex);
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
				goldType : Ext.getCmp('goldType').getValue()
			}
		});
	}

	// 获取选择行
	function inputDailyGold() {
		firstWindow.show();
	}
	
	
	



	var firstForm = new Ext.form.FormPanel({
		id : 'firstForm',
		name : 'firstForm',
		labelWidth : 90, // 标签宽度
		// frame : true, //是否渲染表单面板背景色
		defaultType : 'textfield', // 表单元素默认类型
		labelAlign : 'right', // 标签对齐方式
		bodyStyle : 'padding:5 5 5 5', // 表单元素和表单面板的边距
		items : [ goldTypeCombo, {
			fieldLabel : '日期', // 标签
			xtype : 'datefield',
			readOnly : true,
			value : new Date(),
			format : 'Y-m-d',
			name : 'golddate', // name:后台根据此name属性取值
			allowBlank : false, // 是否允许为空
			anchor : '100%' // 宽度百分比
		}, {
			fieldLabel : '价格',
			name : 'goldvalue',
			xtype :'numberfield',
			allowBlank : false,
			anchor : '100%'
		}, {
			fieldLabel : '备注',
			name : 'remark',
			xtype : 'textarea',
			height : 50, // 设置多行文本框的高度
			emptyText : '备注信息', // 设置默认初始值
			anchor : '100%'
		} ]
	});

	var firstWindow = new Ext.Window({
		title : '<span class="commoncss">录入金价信息</span>', // 窗口标题
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
		items : [ firstForm ], // 嵌入的表单面板
		buttons : [ { // 窗口底部按钮配置
			text : '提交', // 按钮文本
			iconCls : 'tbar_synchronizeIcon', // 按钮图标
			handler : function() { // 按钮响应函数
				firstForm.form.submit({
					url : 'dailyGoldSystem.ered?reqCode=saveDailyGoldInfo',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						Ext.Msg.alert("提示", "提交成功");
						firstForm.form.reset();
						firstWindow.hide();
						queryCatalogItem();
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
				firstForm.form.reset();
			}
		} ]
	});
	
	
	queryCatalogItem();

});