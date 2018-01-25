/**
 * 销售排行录入
 * @author Xiashou
 * @since 2013-10-15
 */
Ext.onReady(function() {
	
	// 复选框
	var sm = new Ext.grid.CheckboxSelectionModel();
	
	var brandInfo = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : 'reportSystem.ered?reqCode=getBrandRelationByWerks'
		}),
		reader : new Ext.data.JsonReader({}, [{
			name : 'brand'
		}, {
			name : 'bname'
		} ])
	});
	brandInfo.load();
	
	// 定义列模型
	var cm = new Ext.grid.ColumnModel([
	{
		header : '删除', // 列标题
		dataIndex : 'deleteRow',
		width : 40,
		renderer : iconColumnRender
	}, {
		header : '品牌', // 列标题
		dataIndex : 'brand', // 数据索引:和Store模型对应
		width : 110,
		editor : new Ext.grid.GridEditor(new Ext.form.ComboBox({
			store : brandInfo,
//			name: 'brand',
			id: 'brand',
			mode : 'local',
			triggerAction : 'all',
			valueField : 'brand',
			displayField : 'bname',
			allowBlank : false,
			forceSelection : true,
			typeAhead : true
		})),
		renderer: function(value, metadata, record){   
			var index = brandInfo.find('brand',value);   
			if(index != -1){   
				return brandInfo.getAt(index).data.bname;   
			}   
			return record.get('bname');   
		}  
	}, {
		header : '实际销售（元）',
		dataIndex : 'kbetr',
		sortable : true,
		editor : new Ext.grid.GridEditor(new Ext.form.TextField({
			id: 'kbetr',
			name: 'kbetr',
			allowBlank : false,
			enableKeyEvents : true,
			regex: /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/,
            regexText: "格式错误,请输入金额！",
			listeners : {
				specialkey : function(field, e) {
					if (e.getKey() == Ext.EventObject.ENTER) {
						var row = new MyRecord({});
						grid.stopEditing();
						store.insert(store.getCount(), row);
						grid.startEditing(store.getCount() - 1, 1);
					}
				}
			}
		})),
		width : 110
	} ]);
	
	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
		pruneModifiedRecords : true,
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
			url : 'reportSystem.ered?reqCode=getSalesRankingInfo'
		}),
		// 数据读取器
		reader : new Ext.data.JsonReader({
			root : 'ROOT'
		}, [ {
			name : 'brand'
		}, {
			name : 'kbetr'
		}])
	});
	
	// 定义一个Record
	var MyRecord = Ext.data.Record.create([{
				name : 'brand',
				type : 'string'
			}, {
				name : 'kbetr',
				type : 'string'
			}
	]);
	
	// 表格工具栏
	var tbar = new Ext.Toolbar({
		items : ['&nbsp;', 
				{
					text : '选择品牌',
					iconCls : 'pluginIcon',
					handler : function() {
						brandWindow.show();
					}
				}, '-', '年份 ', {
					xtype : 'numberfield',
					value : new Date().getFullYear(), // 标签
					id : 'year',
					name : 'year', // name:后台根据此name属性取值
					allowBlank : false, // 是否允许为空
					allowDecimals : false, // 是否允许输入小数
					allowNegative : false, // 是否允许输入负数
					maxLength : 4, // 可输入的最大文本长度,不区分中英文字符
					width : 40
				}, '月份 ', {
					xtype : 'combo',
					mode : 'local',
					id : 'month',
					name : 'month', // name:后台根据此name属性取值
					store : new Ext.data.ArrayStore({
						fields : ['value', 'text'],
						data : [['01', '1月'], ['02', '2月'], ['03', '3月'], ['04', '4月'], ['05', '5月'], ['06', '6月'],
						        ['07', '7月'], ['08', '8月'], ['09', '9月'], ['10', '10月'], ['11', '11月'], ['12', '12月']]
					}),
					triggerAction : 'all',
					valueField : 'value',
					displayField : 'text',
					value : new Date().getMonth() + 1,
					allowBlank : false,
					forceSelection : true,
					listeners: {  //为Combo添加select事件
						select: function(combo, record, index) {   // 该事件会返回选中的项对应在 store中的 record值. index参数是排列号.
							store.load({
								params : {
									year : Ext.getCmp("year").getValue(),
									month : Ext.getCmp("month").getValue()
								}
							});
						}
					},
					width : 50
				}, '-', {
					text : '添加一行',
					iconCls : 'addIcon',
					handler : function() {
						var row = new MyRecord({});
						grid.stopEditing();
						store.insert(store.getCount(), row);
						grid.startEditing(store.getCount() - 1, 1);
					}
				}, '-', {
					text : '提交',
					iconCls : 'acceptIcon',
					handler : function() {
						submitRanking();
					}
				}
			]
	});
	
	// 表格实例
	var grid = new Ext.grid.EditorGridPanel({
		height : 500,
		autoScroll : true,
		region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		store : store, // 数据存储
		stripeRows : true, // 斑马线
		cm : cm, // 列模型
		tbar : tbar, // 表格工具栏
		loadMask : {
			msg : '正在加载表格数据,请稍等...'
		}
	});
	
	// 小画笔点击事件
	grid.on("cellclick", function(pGrid, rowIndex, columnIndex, e) {
		var store = pGrid.getStore();
		var record = store.getAt(rowIndex);
		var fieldName = pGrid.getColumnModel().getDataIndex(columnIndex);
		if (fieldName == 'deleteRow' && columnIndex == 0) {
			Ext.Msg.confirm("提示", "确定删除吗？", function(e) {
				if (e == 'yes') {
					store.remove(record);
					showBbarData();
				}
			});
		}
	});
	
	// 布局模型
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [ grid ]
	});
	
	var bcm = new Ext.grid.ColumnModel([sm, {
	 		header : '编号',
	 		dataIndex : 'id',
	 		width : 80
	 	}, {
	 		header : '品牌', // 列标题
	 		dataIndex : 'brand',
	 		width : 120
	 	} 
 	]);
	
	var brandStore = new Ext.data.Store({
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
			url : 'reportSystem.ered?reqCode=getBrandList'
		}),
		// 数据读取器
		reader : new Ext.data.JsonReader({
				root : 'ROOT' // Json中的列表数据根节点
			}, [ {
					name : 'id'
				}, {
					name : 'brand'
				} ]
			)
	});
	brandStore.load();
	
	// 品牌工具栏
	var brandTbar = new Ext.Toolbar({
		items : [{
			text : '绑定',
			iconCls : 'acceptIcon',
			handler : function() {
				submitBrandWerks();
			}
		}]
	});
	
	// 品牌实例
	var brandGrid = new Ext.grid.GridPanel({
		height : 410,
		width : 250,
		frame : true,
		autoScroll : true,
		region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		store : brandStore, // 数据存储
		stripeRows : true, // 斑马线
		cm : bcm, // 列模型
		sm : sm, // 复选框
		tbar : brandTbar,
		loadMask : {
			msg : '正在加载表格数据,请稍等...'
		}
	});
	
	var brandPanel = new Ext.Panel({
		items : [ brandGrid ]
	});
	
	// 品牌关联窗口
	var brandWindow = new Ext.Window({
		title : '<span class="commoncss">绑定品牌</span>', // 窗口标题
//		layout : 'fit', // 设置窗口布局模式
		iconCls : 'window_caise_listIcon', // 按钮图标
		width : 250, // 窗口宽度
		height : 450, // 窗口高度
		closable : true, // 是否可关闭
		collapsible : true, // 是否可收缩
		maximizable : true, // 设置是否可以最大化
		border : false, // 边框线设置
		madal:true,
		autoScroll : true,
		constrain : true, // 设置窗口是否可以溢出父容器
		pageY : 20, // 页面定位Y坐标
		pageX : document.body.clientWidth / 4 - 300 / 2, // 页面定位X坐标
		items : [ brandPanel ], // 嵌入的表单面板
		closeAction : 'hide'
	});
	
	//门店已关联的品牌默认选中
	brandGrid.on("render",function(){   
		Ext.Ajax.request({
			url : 'reportSystem.ered?reqCode=getBrandRelationByWerks',
			method : 'post',
			success : function(data) {
				var myData = Ext.decode(data.responseText);
				if (myData == '') {
					Ext.Msg.alert("提示", "你店里还没有绑定任何品牌，请选择品牌！");
					return false;
				}
				for(var i = 0; i < brandStore.getCount(); i++){
					for(var j = 0; j < myData.length; j++){
						if(brandStore.getAt(i).get("id") == myData[j].brand){
							brandGrid.getSelectionModel().selectRow(i, true);
						}
					}
				}
			},
			failure : function(){
				 Ext.Msg.hide();
				 Ext.Msg.alert("提示", "出现错误！");
			}
		});
     });  
	
	var row = new MyRecord({});
	store.insert(0, row);
	grid.startEditing(0, 1);
	
	// 生成一个图标列
	function iconColumnRender(value) {
		return "<a href='javascript:void(0);'><img src='" + webContext + "/resource/image/ext/delete.png'/></a>";
	}
	
	// 查询表格数据
	store.load({
		params : {
			year : Ext.getCmp("year").getValue(),
			month : Ext.getCmp("month").getValue()
		}
	});
	
	function submitBrandWerks(){
		var m = brandGrid.getSelectionModel().getSelections(); //获取所有选中行
		if (Ext.isEmpty(m)) {
			Ext.MessageBox.alert('提示', '没有数据需要保存!');
			return;
		}
		var jsonArray = [];
		// 将record数组对象转换为简单Json数组对象
		Ext.each(m, function(item) {
			if(!Ext.isEmpty(item.data["id"])){
				jsonArray.push(item.data);
			}
		});
		if (Ext.isEmpty(jsonArray)) {
			Ext.MessageBox.alert('提示', '没有数据需要保存!');
			return;
		}
		// 提交到后台处理
		Ext.Msg.wait('正在绑定，请稍候...','提示'); 
		Ext.Ajax.request({
			url : 'reportSystem.ered?reqCode=saveBrandRelationByWerks',
			type : 'post',
			dataType : 'json',
			cache : false,
			params : {
				jsonArray : Ext.encode(jsonArray)		// 系列化为Json资料格式传入后台处理
			},
			success : function(data) { 
				Ext.Msg.hide();
				var returnData = Ext.decode(data.responseText);
				Ext.Msg.alert("提示", returnData.message, function(e) {
					brandInfo.reload();
					brandPanel.doLayout();
					brandWindow.hide();
				});
			},
			failure : function(data) {
				Ext.Msg.hide();
				var returnData = Ext.decode(data.responseText);
				Ext.Msg.alert("提示", returnData.message, function(e) {
				});
			}
		});
	}
	
	// 保存
	function submitRanking() {
		var m = store.modified.slice(0); // 获取修改过的record数组对象
		if (!validateEditGrid(m, 'brand')) {
			Ext.Msg.alert('提示', '品牌不能为空,请重新输入!', function() {
				grid.startEditing(0, 2);
			});
			return;
		}
		var jsonArray = [];
		// 将record数组对象转换为简单Json数组对象,排序确定名次
		Ext.each(m, function(item) {
			var tempR = 1;
			var tempK = parseInt(item.data["kbetr"]);
			Ext.each(m, function(i) {
				if(tempK < parseInt(i.data["kbetr"])){
					tempR++;
				}
			});
			item.data["ranking"] = tempR;
			jsonArray.push(item.data);
		});
		if (Ext.isEmpty(jsonArray)) {
			Ext.MessageBox.alert('提示', '没有数据需要保存!');
			return;
		}
		// 提交到后台处理
		Ext.Msg.wait('正在提交排行，请稍候...','提示'); 
		Ext.Ajax.request({
			url : 'reportSystem.ered?reqCode=saveSalesRanking',
			type : 'post',
			dataType : 'json',
			cache : false,
			params : {
				jsonArray : Ext.encode(jsonArray),		// 系列化为Json资料格式传入后台处理
				year : Ext.getCmp("year").getValue(),
				month : Ext.getCmp("month").getValue()
			},
			success : function(data) { 
				Ext.Msg.hide();
				var returnData = Ext.decode(data.responseText);
				Ext.Msg.alert("提示", returnData.message, function(e) {
					store.reload();
				});
			},
			failure : function(data) {
				Ext.Msg.hide();
				var returnData = Ext.decode(data.responseText);
				Ext.Msg.alert("提示", returnData.message, function(e) {
				});
			}
		});
	}
	
	// 检查新增行的可编辑单元格数据合法性
	function validateEditGrid(m, colName) {
		for (var i = 0; i < m.length; i++) {
			var record = m[i];
			var rowIndex = store.indexOfId(record.id);
			var value = record.get(colName);
			if (Ext.isEmpty(value)) {
				// Ext.Msg.alert('提示', '数据校验不合法');
				return false;
			}
			var colIndex = cm.findColumnIndex(colName);
			var editor = cm.getCellEditor(colIndex).field;
			if (!editor.validateValue(value)) {
				// Ext.Msg.alert('提示', '数据校验不合法');
				return false;
			}
		}
		return true;
	}
	
});