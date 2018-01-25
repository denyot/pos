/**
 * 加盟商退货列表
 * @author Xiashou
 * @since 2014/03/26
 */
Ext.onReady(function() {
	
	var werks = "";
	var status = 0;
	var id = "";
	var ebeln = "";
	
	// 复选框
	var sm = new Ext.grid.CheckboxSelectionModel();

	// 定义自动当前页行号
	var rownum = new Ext.grid.RowNumberer({
		header : 'NO',
		width : 28
	});

	// 定义列模型
	var cm = new Ext.grid.ColumnModel([rownum, {
			header : '详细', // 列标题
			dataIndex : 'showdetail',
			width : 35,
			renderer : iconColumnRender
		}, {
			header : '编号', // 列标题
			dataIndex : 'id', // 数据索引:和Store模型对应
			width : 150
		}, {
			header : '类型',
			dataIndex : 'typetext',
			sortable : true,
			width : 80
		}, {
			header : '退货订单', // 列标题
			dataIndex : 'ebeln', // 数据索引:和Store模型对应
			width : 120
		}, {
			header : '收货凭证',
			dataIndex : 'mblnr',
			width : 120
		}, {
			header : '状态',
			dataIndex : 'status',
			sortable : true,
			width : 120,
			renderer : function(v){
				if(v == 0){
					return "待审核";
				} else if (v == 1) {
					return "已完成";
				} else if (v == 2) {
					return "已驳回";
				} else {
					return "待发货";
				}
			}
		}, {
			header : '总数量',
			dataIndex : 'totalcount',
			sortable : true,
			width : 60
		},{
			header : '总重量',
			dataIndex : 'totallabst',
			sortable : true,
			width : 60,
			renderer : function(v){
				return Number(v).toFixed(2);
			}
		}, {
			header : '创建时间',
			dataIndex : 'createtime',
			sortable : true,
			width : 120
		}, {
			//隐藏门店列，取值用，不可删除
			header : '门店',
			dataIndex : 'werks',
			hidden : true,
			width : 120
		}
	]);

	// 数据存储
	var store = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : 'stockSystem.ered?reqCode=getJoinnerReturnList'
		}),
		reader : new Ext.data.JsonReader({
			totalProperty : 'TOTALCOUNT', // 记录总数
			root : 'ROOT' // Json中的列表数据根节点
		}, [{
			name : 'id'
		}, {
			name : 'typetext'
		}, {
			name : 'ebeln'
		}, {
			name : 'mblnr'
		}, {
			name : 'status'
		}, {
			name : 'totalcount'
		}, {
			name : 'totallabst'
		}, {
			name : 'createtime'
		}, {
			name : 'werks'
		} ])
	});
	
	// 定义列模型
	var cm2 = new Ext.grid.ColumnModel([rownum, {
			header : '项目号',
			dataIndex : 'ebelp',
			sortable : true,
			width : 50
		}, {
			header : '批次', 
			dataIndex : 'charg', 
			width : 80
		}, {
			header : '物料号',
			dataIndex : 'matnr',
			width : 160
		}, {
			header : '物料名称',
			dataIndex : 'maktx',
			width : 200
		}, {
			header : '重量',
			dataIndex : 'labst',
			sortable : true,
			width : 60,
			renderer : function(v){
				return Number(v).toFixed(2);
			}
		},{
			header : '单位',
			dataIndex : 'meins',
			sortable : true,
			width : 60
		}, {
			header : '库位',
			dataIndex : 'lgort',
			width : 120
		}
	]);

	// 数据存储
	var store2 = new Ext.data.Store({
		proxy  : new Ext.data.HttpProxy({
		  url  : 'stockSystem.ered?reqCode=getJoinnerReturnDetail'
		}),
		reader : new Ext.data.JsonReader({
			root : 'ROOT' // Json中的列表数据根节点
		}, [{
			name : 'ebelp'
		}, {
			name : 'charg'
		}, {
			name : 'matnr'
		}, {
			name : 'maktx'
		}, {
			name : 'labst'
		}, {
			name : 'meins'
		}, {
			name : 'lgort'
		} ])
	});
	
	//货品类型下拉选择框
	var typeCombo = new Ext.form.ComboBox({
		name : 'goodstype',
		triggerAction : 'all',
		mode : 'local',
		store : new Ext.data.ArrayStore({
			fields : [ 'value', 'text' ],
			data : [[ -1, '所有' ], [ 1, '镶嵌' ], [ 2, '银饰' ], [ 3, '玉石' ],
					[ 4, '18K金' ],[ 5, '铂金' ], [ 6, '黄金' ],[ 7, '钯金' ]]
		}),
		valueField : 'value',
		displayField : 'text',
		emptyText : '商品类型',
		editable : false,
		width : 100
	});
	
	// 表格工具栏
	var tbar = new Ext.Toolbar({
		items : [typeCombo, '-', {
				id : 'status',
				xtype: 'combo',
				width : 100,
				valueField : 'value',
				displayField : 'text',
				triggerAction : 'all',
				emptyText : '退货状态',
				mode : 'local',
				store : new Ext.data.ArrayStore({
					fields : ['value', 'text'],
					data : [[-1,'所有'],
							[0, '待审核'], 
							[1, '已完成'],
							[2, '已驳回'],
							[3, '待发货']]
				})
			}, '-', {
				emptyText : '开始时间',
				xtype : 'datefield',
				id : 'startdate',
				name : 'startdate',
				format : 'Y-m-d',
				width : 100
			}, '-', {
				emptyText : '结束时间',
				xtype : 'datefield',
				id : 'enddate',
				name : 'enddate',
				format : 'Y-m-d',
				width : 100
			}, '-', {
				text : '查询',
				iconCls : 'page_findIcon',
				handler : function() {
					queryJoinnerReturnList();
				}
			}]
	});
	
	// 翻页排序时带上查询条件
	store.on('beforeload', function() {
		this.baseParams = {
			status 	  : Ext.getCmp('status').getValue(),
			startdate : Ext.getCmp('startdate').getValue(),
			enddate   : Ext.getCmp('enddate').getValue(),
			type      : typeCombo.getValue()
		};
	});
	
	// 每页显示条数下拉选择框
	var pagesizeCombo = new Ext.form.ComboBox({
		name : 'pagesize',
		triggerAction : 'all',
		mode : 'local',
		store : new Ext.data.ArrayStore({
			fields : ['value', 'text'],
			data : [[10, '10条/页'], [20, '20条/页'], [50, '50条/页'], [100, '100条/页'], [250, '250条/页'], [500, '500条/页']]
		}),
		valueField : 'value',
		displayField : 'text',
		value : '20',
		editable : false,
		width : 85
	});
	
	var number = parseInt(pagesizeCombo.getValue());
	
	// 改变每页显示条数reload数据
	pagesizeCombo.on("select", function(comboBox) {
		bbar.pageSize = parseInt(comboBox.getValue());
		number = parseInt(comboBox.getValue());
		store.reload({
			params : {
				start 	  : 0,
				limit     : bbar.pageSize,
				status 	  : Ext.getCmp('status').getValue(),
				startdate : Ext.getCmp('startdate').getValue(),
				enddate   : Ext.getCmp('enddate').getValue(),
				type      : typeCombo.getValue()
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
		items : ['-', '&nbsp;&nbsp;', pagesizeCombo]
	});
	
	//表格下工具栏
	var bbar2 = new Ext.Toolbar({
		items : ['-',{
			xtype:'label',
			text:'总数量：'
		},'&nbsp;',{
			xtype:'label',
			id:'totalCount'
		} ,'&nbsp;&nbsp;' ,'-', '&nbsp;&nbsp;',{
			xtype:'label',
			text:'总重量：'
		},'&nbsp;',{
			xtype:'label',
			id:'totalLabst'
		}]
	});
	
	// 生成一个图标列
	function iconColumnRender(value) {
		return "<a href='javascript:void(0);'><img src='" + webContext + "/resource/image/ext/application_view_list.png'/></a>";;
	}
	
	// 表格实例
	var grid = new Ext.grid.EditorGridPanel({
		height : 500,
		//frame : true,
		autoScroll : true,
		region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		store : store, // 数据存储
		stripeRows : true, // 斑马线
		cm : cm, // 列模型
		tbar : tbar, // 表格工具栏
		bbar : bbar,// 下工具栏
		loadMask : {
			msg : '正在加载表格数据,请稍等...'
		}
	});
	
	var grid2 = new Ext.grid.GridPanel({
		// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
		height : 350,
//		width : 800,
		frame : true,
		autoScroll : true,
		region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		store : store2, // 数据存储
		stripeRows : true, // 斑马线
		cm : cm2, // 列模型
		bbar : bbar2,
		sm : sm, // 复选框
		loadMask : {
			msg : '正在加载表格数据,请稍等...'
		}
	});
	
	var detailForm = new Ext.form.FormPanel({
		id : 'detailForm',
		name : 'detailForm',
		labelWidth : 90, // 标签宽度
		frame : true, // 是否渲染表单面板背景色
		// defaultType : 'textfield', // 表单元素默认类型
		labelAlign : 'right', // 标签对齐方式
		bodyStyle : 'padding:5 5 5 5', // 表单元素和表单面板的边距
		items : [ {
			layout : 'column',
			border : false,
			items : [{
				columnWidth : .1,
				layout : 'form',
				border : false,
				items : [ {
					xtype : 'button',
					iconCls : 'acceptIcon',
					name : 'submitButton',
					id : 'submitButton',
					text : ' 审 批 ',
					anchor : '90%',
					handler : submitJoinnerReturnOrder
				}]
			}, {
				columnWidth : .1,
				layout : 'form',
				border : false,
				items : [ {
					xtype : 'button',
					iconCls : 'deleteIcon',
					name : 'deleteButton',
					id : 'deleteButton',
					text : ' 删 除 ',
					anchor : '90%',
					handler : deleteJoinnerReturnOrder
				} ]
			}, {
				columnWidth : .1,
				layout : 'form',
				border : false,
				items : [ {
					xtype : 'button',
					iconCls : 'exclamationIcon',
					name : 'returnButton',
					id : 'returnButton',
					text : ' 驳 回 ',
					anchor : '90%',
					handler : returnJoinnerReturnOrder
				} ]

			}, {
				columnWidth : .1,
				layout : 'form',
				border : false,
				items : [ {
					xtype : 'button',
					iconCls : 'book_previousIcon',
					name : 'sendButton',
					id : 'sendButton',
					text : ' 发 货 ',
					anchor : '90%',
					handler : sendJoinnerReturnOrder
				} ]

			} ]
		} ]
	});
	
	// 小画笔点击事件
	grid.on("cellclick", function(pGrid, rowIndex, columnIndex, e) {
		var store = pGrid.getStore();
		var record = store.getAt(rowIndex);
		var fieldName = pGrid.getColumnModel().getDataIndex(columnIndex);
		// columnIndex为小画笔所在列的索引,索引从0开始
		if (fieldName == 'showdetail' && columnIndex == 1) {
			id = record.get('id');
			ebeln = record.get('ebeln');
			status = record.get('status');
			werks = document.getElementById("werks").value;
			detailWindow.show();
			hiddenButtons();
			store2.load({
				params : {
					id : id
				},
				callback : function(records, options, success) {
					if (success == true) {
						if (records.length == 0) {
							Ext.Msg.alert('提示', '没有记录！！');
							detailWindow.hide();
						}
						Ext.getCmp('totalCount').setText(store2.getCount() + ' ');
						Ext.getCmp('totalLabst').setText(store2.sum('labst').toFixed(2) + ' ');
					} else {
						Ext.Msg.alert('提示', '抓取信息出现错误');
					}
				}
			});
		}

	});
	
	// 布局模型
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [ grid ]
	});
	
	var detailPanel = new Ext.Panel({
		layout : 'form',
		items : [ grid2, detailForm ]
	});
	
	var detailWindow = new Ext.Window({
		title : '<span class="commoncss">退货清单</span>', // 窗口标题
		//layout : 'fit', // 设置窗口布局模式
		width : 800, // 窗口宽度
		iconCls : 'window_caise_listIcon', // 按钮图标
		height : 430, // 窗口高度
		closable : true, // 是否可关闭
		collapsible : true, // 是否可收缩
		maximizable : true, // 设置是否可以最大化
		border : false, // 边框线设置
		autoScroll : true,
		constrain : true, // 设置窗口是否可以溢出父容器
		pageY : 20, // 页面定位Y坐标
		pageX : document.body.clientWidth / 4 - 300 / 2, // 页面定位X坐标
		items : [ detailPanel ], // 嵌入的表单面板
		closeAction : 'hide'
	});
	
	// 查询表格数据
	function queryJoinnerReturnList() {
		store.load({
			params : {
				start     : 0,
                limit     : bbar.pageSize,
                status 	  : Ext.getCmp('status').getValue(),
    			startdate : Ext.getCmp('startdate').getValue(),
    			enddate   : Ext.getCmp('enddate').getValue(),
    			type      : typeCombo.getValue()
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
	
	//隐藏某些按钮
	function hiddenButtons(){
		if(werks == "1000"){
			Ext.getCmp('deleteButton').setVisible(false);
			Ext.getCmp('sendButton').setVisible(false);
		} else {
			Ext.getCmp('submitButton').setVisible(false);
			Ext.getCmp('returnButton').setVisible(false);
		}
		if (status == 1){			//已完成
			Ext.getCmp('submitButton').setDisabled(true);
			Ext.getCmp('returnButton').setDisabled(true);
			Ext.getCmp('deleteButton').setDisabled(true);
			Ext.getCmp('sendButton').setDisabled(true);
		} else if(status == 2){		//已驳回
			Ext.getCmp('submitButton').setDisabled(true);
			Ext.getCmp('returnButton').setDisabled(true);
			Ext.getCmp('deleteButton').setDisabled(false);
			Ext.getCmp('sendButton').setDisabled(true);
		} else if(status == 3){		//待发货
			Ext.getCmp('submitButton').setDisabled(true);
			Ext.getCmp('returnButton').setDisabled(true);
			Ext.getCmp('deleteButton').setDisabled(false);
			Ext.getCmp('sendButton').setDisabled(false);
		} else {					//待处理
			Ext.getCmp('submitButton').setDisabled(false);
			Ext.getCmp('returnButton').setDisabled(false);
			Ext.getCmp('deleteButton').setDisabled(false);
			Ext.getCmp('sendButton').setDisabled(true);
		}
	}
	
	queryJoinnerReturnList();
	
	function submitJoinnerReturnOrder(){

		// 提交到后台处理
		Ext.Msg.wait('正在审批订单，请稍候...','提示'); 
		Ext.Ajax.request({
			url      : 'stockSystem.ered?reqCode=submitJoinnerReturnOrder',
			type     : 'post',
			dataType : 'json',
			cache    : false,
			params   : {
				id    : id
			},
			success : function(data) { 
				Ext.Msg.hide();
				var returnData = Ext.decode(data.responseText);
				Ext.Msg.alert("提示", returnData.message, function(e) {
					detailWindow.hide();
					queryJoinnerReturnList();
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
	
	function returnJoinnerReturnOrder(){

		// 提交到后台处理
		Ext.Msg.wait('正在驳回订单，请稍候...','提示'); 
		Ext.Ajax.request({
			url      : 'stockSystem.ered?reqCode=returnJoinnerReturnOrder',
			type     : 'post',
			dataType : 'json',
			cache    : false,
			params   : {
				id   : id
			},
			success : function(data) { 
				Ext.Msg.hide();
				var returnData = Ext.decode(data.responseText);
				Ext.Msg.alert("提示", returnData.message, function(e) {
					detailWindow.hide();
					queryJoinnerReturnList();
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
	
	function deleteJoinnerReturnOrder(){

		// 提交到后台处理
		Ext.Msg.wait('正在删除订单，请稍候...','提示'); 
		Ext.Ajax.request({
			url      : 'stockSystem.ered?reqCode=deleteJoinnerReturnOrder',
			type     : 'post',
			dataType : 'json',
			cache    : false,
			params   : {
				id   : id
			},
			success : function(data) { 
				Ext.Msg.hide();
				var returnData = Ext.decode(data.responseText);
				Ext.Msg.alert("提示", returnData.message, function(e) {
					detailWindow.hide();
					queryJoinnerReturnList();
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
	
	function sendJoinnerReturnOrder(){
		
		// 提交到后台处理
		Ext.Msg.wait('正在处理订单，请稍候...','提示'); 
		Ext.Ajax.request({
			url      : 'stockSystem.ered?reqCode=sendJoinnerReturnOrder',
			type     : 'post',
			dataType : 'json',
			cache    : false,
			params   : {
				id   : id,
			   ebeln : ebeln
			},
			success : function(data) { 
				Ext.Msg.hide();
				var returnData = Ext.decode(data.responseText);
				Ext.Msg.alert("提示", returnData.message, function(e) {
					detailWindow.hide();
					queryJoinnerReturnList();
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

});