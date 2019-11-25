/**
 * 直营店货品调出退货管理
 * @author Xiashou
 * @since 2014/05/22
 */
Ext.onReady(function() {
	
	Ext.QuickTips.init();
	
	var outid = "";
	
	//货品类型下拉框
	var typeCombo = new Ext.form.ComboBox({
		id : 'goodtype',
		name : 'goodtype',
		width : 145,
		mode : 'local',
		value : '-1',
		triggerAction : 'all',
		emptyText : '请选择货品类型',
		fieldLabel: '货品类型',
		store : new Ext.data.ArrayStore({
			fields : [ 'value', 'text' ],
			data : [[-1, '所有'], [ 1, '镶嵌类' ], [ 2, '银饰类' ], [ 3, '玉石类' ], [ 4, '18K金类' ], 
			        [ 5, '铂金类' ], [ 6, '黄金类' ], [ 7, '钯金类' ], [ 8, '赠品及包材' ], [ 9, '原材料' ]]
		}),
		valueField : 'value',
		displayField : 'text',
		editable : false
	});
	
	//单据状态下拉框
	var statusCombo = new Ext.form.ComboBox({
		id : 'status',
		name : 'status',
		width : 145,
		mode : 'local',
		triggerAction : 'all',
		emptyText : '订单状态',
		fieldLabel: '订单状态',
		value : '-1',
		store : new Ext.data.ArrayStore({
			fields : [ 'value', 'text' ],
			data : [[-1, '所有'],
			        [0, '待审核'],  
			        [1, '待发货'], 
			        [2, '已发货'], 
			        [3, '驳回'], 
			        [4, '已收货'], 
			        [5, '待整单差异处理'],
					[6, '待单行差异处理'], 
					[7, '整单差异处理反馈'], 
					[8, '单行差异处理反馈'], 
					[9, '整单差异处理反馈完成'],
					[10, '单行差异处理反馈完成'], 
					[11, '门店退货待审批'], 
					[12, '门店退货待发货'], 
					[13, '门店退货审批驳回'], 
					[14, '门店退货完成']]
		}),
		valueField : 'value',
		displayField : 'text',
		editable : false
	});
	
	var qForm = new Ext.form.FormPanel({
		border : false,
		labelWidth : 60, // 标签宽度
		labelAlign : 'right', // 标签对齐方式
		bodyStyle : 'padding:5 5 0', // 表单元素和表单面板的边距
		buttonAlign : 'center',
		height : 180,
		items : [{
			layout : 'column',
			border : false,
			items : [{
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [typeCombo,{
									fieldLabel : '出库日从',
									id : 'dateFrom',
									name : 'dateFrom',
									xtype : 'datefield', // 设置为数字输入框类型
									format: 'Y-m-d', //日期格式化
									//allowBlank: false,
									anchor : '100%'
								}, {
									id : 'outWerks',
									name : 'outWerks',
									width : 145,
									fieldLabel: '调出门店',
									xtype : 'textfield'
								}, {
									id : 'outId',
									name : 'outId',
									width : 145,
									fieldLabel: '调拨单号',
									xtype : 'textfield'
								}]
					}, {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [statusCombo,{
									fieldLabel : '出库日到',
									id : 'dateTo',
									name : 'dateTo',
									xtype : 'datefield', // 设置为数字输入框类型
									format:'Y-m-d', //日期格式化
									//allowBlank: false,
									anchor : '100%'
								}, {
									id : 'inWerks',
									name : 'inWerks',
									width : 145,
									fieldLabel: '调入门店',
									xtype : 'textfield'
								}, {
									id : 'mblnr',
									name : 'mblnr',
									width : 145,
									fieldLabel: '凭证号',
									xtype : 'textfield'
								}]
					}]
			}]
	});
	
	var qWindow = new Ext.Window({
		title : '<span class="commoncss">查询条件</span>', 		// 窗口标题
		layout : 'fit', 										// 设置窗口布局模式
		width : 450, 											// 窗口宽度
		height : 190, 											// 窗口高度
		closable : false, 										// 是否可关闭
		closeAction : 'hide', 									// 关闭策略
		collapsible : true, 									// 是否可收缩
		maximizable : false, 									// 设置是否可以最大化
		border : true, 											// 边框线设置
		constrain : true,
		titleCollapse : true,
		animateTarget : Ext.getBody(),
		pageY : 100, 											// 页面定位Y坐标
		pageX : document.body.clientWidth / 2 - 700 / 2, 		// 页面定位X坐标
		// 设置窗口是否可以溢出父容器
		buttonAlign : 'right',
		items : [qForm],
		buttons : [{
					text : '查询',
					iconCls : 'previewIcon',
					handler : function() {
						queryStockTransferList();
						qWindow.hide();
					}
				}, {
					text : '重置',
					iconCls : 'tbar_synchronizeIcon',
					handler : function() {
						qForm.getForm().reset();
					}
				}, {
					text : '关闭',
					iconCls : 'deleteIcon',
					handler : function() {
						qWindow.hide();
					}
				}]
	});
	
	qWindow.show();
	
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
			dataIndex : 'outid', // 数据索引:和Store模型对应
			width : 150
		}, {
			header : '类型',
			dataIndex : 'goodtype',
			sortable : true,
			width : 80,
			renderer : function(v){
				if(v == 1){
					return "镶嵌类";
				} else if (v == 2) {
					return "银饰类";
				} else if (v == 3) {
					return "银饰类";
				} else if (v == 4) {
					return "18K金类";
				} else if (v == 5) {
					return "铂金类";
				} else if (v == 6) {
					return "黄金类";
				} else if (v == 7) {
					return "钯金类";
				} else if (v == 8) {
					return "赠品及包材";
				} else if (v == 9) {
					return "原材料";
				}
			}
		}, {
			header : '凭证编号',
			dataIndex : 'i_mblnr',
			width : 90
		}, {
			header : '总数量',
			dataIndex : 'goodscount',
			sortable : true,
			width : 60
		},{
			header : '总重量',
			dataIndex : 'goodsweight',
			sortable : true,
			width : 60,
			renderer : function(v){
				return Number(v).toFixed(2);
			}
		},{
			header : '总金额',
			dataIndex : 'goodsprice',
			sortable : true,
			width : 80,
			renderer : function(v){
				return Number(v).toFixed(2);
			}
		}, {
			header : '状态',
			dataIndex : 'status',
			sortable : true,
			width : 120,
			renderer : function(v){
				if(v == 0){
					return "待审核";
				} else if (v == 1) {
					return "待发货";
				} else if (v == 2) {
					return "已发货";
				} else if (v == 3) {
					return "已驳回";
				} else if (v == 4) {
					return "已收货";
				} else if (v == 5) {
					return "待整单差异处理";
				} else if (v == 6) {
					return "待单行差异处理";
				} else if (v == 7) {
					return "整单差异处理反馈";
				} else if (v == 8) {
					return "单行差异处理反馈";
				} else if (v == 9) {
					return "整单差异处理反馈完成";
				} else if (v == 10) {
					return "单行差异处理反馈完成";
				} else if (v == 11) {
					return "门店退货待审批";
				} else if (v == 12) {
					return "门店退货待发货";
				} else if (v == 13) {
					return "门店退货审批驳回";
				} else if (v == 14) {
					return "门店退货完成";
				}
			}
		}, {
			header : '发出门店',
			dataIndex : 'outwerksstr',
			sortable : true,
			width : 130
		}, {
			header : '发往门店',
			dataIndex : 'inwerksstr',
			sortable : true,
			width : 130
		}, {
			header : '出库时间',
			dataIndex : 'stockdate',
			sortable : true,
			width : 80
		}, {
			header : '驳回原因',
			dataIndex : 'rejreason',
			sortable : true,
			width : 80
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
			header : '整单差异原因',
			dataIndex : 'reasonstr',
			sortable : true,
			width : 120
		}, {
			header : '整单差异说明',
			dataIndex : 'headexplain',
			sortable : true,
			width : 120,
			renderer : function(v, metadata, record, rowIndex, columnIndex, store){
				metadata.attr = ' ext:qtip="' + v + '"';    
				return v;
			}
		}, {
			header : '整单处理方案',
			dataIndex : 'headmanage',
			sortable : true,
			width : 120,
			renderer : function(v, metadata, record, rowIndex, columnIndex, store){
				metadata.attr = ' ext:qtip="' + v + '"';    
				return v;
			}
		}, {
			header : '整单处理结果',
			dataIndex : 'headmanageresult',
			sortable : true,
			width : 120,
			renderer : function(v, metadata, record, rowIndex, columnIndex, store){
				metadata.attr = ' ext:qtip="' + v + '"';    
				return v;
			}
		}
	]);
	
	// 数据存储
	var store = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : 'stockSystem.ered?reqCode=getStockTransferList'
		}),
		reader : new Ext.data.JsonReader({
			totalProperty : 'TOTALCOUNT', // 记录总数
			root : 'ROOT' // Json中的列表数据根节点
		}, [{
			name : 'outid'
		}, {
			name : 'goodtype'
		}, {
			name : 'i_mblnr'
		}, {
			name : 'status'
		}, {
			name : 'goodscount'
		}, {
			name : 'goodsweight'
		}, {
			name : 'goodsprice'
		}, {
			name : 'stockdate'
		}, {
			name : 'outwerksstr'
		}, {
			name : 'inwerksstr'
		}, {
			name : 'rejreason'
		}, {
			name : 'postno'
		}, {
			name : 'mailman'
		}, {
			name : 'posttime'
		}, {
			name : 'reasonstr'
		}, {
			name : 'headexplain'
		}, {
			name : 'headmanage'
		}, {
			name : 'headmanageresult'
		} ])
	});
	
	// 定义列模型
	var cm2 = new Ext.grid.ColumnModel([rownum, {
			header : '删除', // 列标题
			dataIndex : 'deleteRow',
			width : 35,
			hidden : true,
			renderer : iconColumnRender2
		}, {
			header : '批次', 
			dataIndex : 'charg', 
			width : 80
		}, {
			header : '物料号',
			dataIndex : 'matnr',
			width : 140
		}, {
			header : '数量',
			dataIndex : 'goodscount',
			width : 50
		}, {
			header : '重量',
			dataIndex : 'goldweight',
			sortable : true,
			width : 60,
			renderer : function(v){
				return Number(v).toFixed(2);
			}
		}, {
			header : '金额',
			dataIndex : 'tagprice',
			sortable : true,
			width : 80,
			renderer : function(v){
				return Number(v).toFixed(2);
			}
		}, {
			header : '物料名称',
			dataIndex : 'maktx',
			width : 130
		}, {
			header : '库位',
			dataIndex : 'lgort',
			width : 90
		}, {
			header : '货品证书',
			dataIndex : 'goodzs',
			sortable : true,
			width : 80
		}, {
			header : '裸石证书',
			dataIndex : 'zszsb',
			sortable : true,
			width :80
		}, {
			header : '石料净度',
			dataIndex : 'labor',
			sortable : true,
			width : 60
		}, {
			header : '颜色',
			dataIndex : 'zslys',
			sortable : true,
			width : 80
		}, {
			header : '差异原因',
			dataIndex : 'reasonStr',
			sortable : true,
			width : 90
		}, {
			header : '差异说明',
			dataIndex : 'explain1',
			sortable : true,
			width : 90,
			renderer : function(v, metadata, record, rowIndex, columnIndex, store){
				metadata.attr = ' ext:qtip="' + v + '"';    
				return v;
			}
		}, {
			header : '处理方法',
			dataIndex : 'manage',
			sortable : true,
			width : 90,
			renderer : function(v, metadata, record, rowIndex, columnIndex, store){
				metadata.attr = ' ext:qtip="' + v + '"';    
				return v;
			}
		}, {
			header : '处理结果',
			dataIndex : 'manageresult',
			sortable : true,
			width : 90,
			renderer : function(v, metadata, record, rowIndex, columnIndex, store){
				metadata.attr = ' ext:qtip="' + v + '"';    
				return v;
			}
		}, {
			header : '图片',
			dataIndex : 'zmatnrt',
			width : 80,
            renderer : function(v) {
               if(v){
	   				return "<img src='../../../sappic/" + v + "' width='30px' height='30px' " +
	   					"ext:qtip=\"<img src='../../../sappic/" + v + "' width='260px' height='260px'/>\" />";
	   			} else {
	   				return "<img src='./images/sample1.gif' width='30px' height='30px' " +
	   					"ext:qtip=\"<img src='./images/sample1.gif' width='260px' height='260px'/>\" />";
	   			}
           }
        }
	]);
	
	// 数据存储
	var store2 = new Ext.data.Store({
		proxy  : new Ext.data.HttpProxy({
		  url  : 'stockSystem.ered?reqCode=getStockTransferOrderDetail'
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
			name : 'goodscount',
			type : 'float'
		}, {
			name : 'goldweight',
			type : 'float'
		}, {
			name : 'tagprice',
			type : 'float'
		}, {
			name : 'lgort'
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
		}, {
			name : 'labor'
		}, {
			name : 'zslys'
		} ])
	});
	
	//查询门店
	var inWerksStore = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'stockSystem.ered?reqCode=getWerksByKeywords'
        }),
        reader: new Ext.data.JsonReader({
            root: 'ROOT',
            id: 'werks'
        }, [
			{name: 'werks', mapping: 'werks'},
			{name: 'name1', mapping: 'name1'}
        ])
    });
	
	// 翻页排序时带上查询条件
	inWerksStore.on('beforeload', function() {
		this.baseParams = {
			keyWords : Ext.getCmp('inWerks').getValue()
		};
	});
	
	//查询门店
	var outWerksStore = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'stockSystem.ered?reqCode=getWerksByKeywords'
        }),
        reader: new Ext.data.JsonReader({
            root: 'ROOT',
            id: 'werks'
        }, [
			{name: 'werks', mapping: 'werks'},
			{name: 'name1', mapping: 'name1'}
        ])
    });
	
	// 翻页排序时带上查询条件
	outWerksStore.on('beforeload', function() {
		this.baseParams = {
			keyWords : Ext.getCmp('outWerks').getValue()
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
				start     : 0,
                limit     : bbar.pageSize,
                status 	  : Ext.getCmp('status').getValue(),
    			dateFrom  : Ext.getCmp('dateFrom').getValue(),
    			dateTo    : Ext.getCmp('dateTo').getValue(),
    			goodtype  : typeCombo.getValue(),
    			outid     : Ext.getCmp('outId').getValue(),
    			mblnr     : Ext.getCmp('mblnr').getValue(),
    			inwerks   : Ext.getCmp('inWerks').getValue(),
    			outwerks  : Ext.getCmp('outWerks').getValue()
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
			id:'totalWeight'
		} ,'&nbsp;&nbsp;' ,'-', '&nbsp;&nbsp;',{
			xtype:'label',
			text:'总金额：'
		},'&nbsp;',{
			xtype:'label',
			id:'totalPrice'
		}]
	});
	
	// 表格工具栏
	var tbar = new Ext.Toolbar({
		items : [{
					text : '查询',
					iconCls : 'previewIcon',
					handler : function() {
						qWindow.show();
					}
				}, {
					text : '刷新',
					iconCls : 'arrow_refreshIcon',
					handler : function() {
						store.reload();
					}
				},'-', {
					text : '导出整单',
					iconCls : 'page_excelIcon',
					handler : function() {
						exportExcel('stockSystem.ered?reqCode=exportOutStockHeader&exp=1');
					}
				}, {
					text : '导出明细',
					iconCls : 'page_excelIcon',
					handler : function() {
						exportExcel('stockSystem.ered?reqCode=exportOutStockHeader&exp=1');
					}
				}]
	});
	
	// 表格实例
	var grid = new Ext.grid.EditorGridPanel({
		// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
		height : 500,
//		frame : true,
		autoScroll : true,
		region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		store : store, // 数据存储
		stripeRows : true, // 斑马线
		cm : cm, // 列模型
		tbar : tbar, // 表格工具栏
		bbar : bbar,// 下工具栏
		viewConfig : {
			// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
			// forceFit : true
		},
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
//		sm : sm, // 复选框
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
		items : [{
			layout : 'column',
			border : false,
			items : [{
				columnWidth : .1,
				layout : 'form',
				border : false,
				items : [{
					xtype : 'button',
					iconCls : 'deleteIcon',
					name : 'deleteButton',
					id : 'deleteButton',
					text : ' 删 除 ',
					anchor : '90%',
					handler : deleteStockTransferOrder
				}]
			}]
		}]
	});
	
	// 小画笔点击事件
	grid.on("cellclick", function(pGrid, rowIndex, columnIndex, e) {
		var store = pGrid.getStore();
		var record = store.getAt(rowIndex);
		var fieldName = pGrid.getColumnModel().getDataIndex(columnIndex);
		if (fieldName == 'showdetail' && columnIndex == 1) {
			outid = record.get('outid');
			status = record.get('status');
			detailWindow.show();
			store2.load({
				params : {
					outid : outid
				},
				callback : function(records, options, success) {
					if (success == true) {
						if (records.length == 0) {
							Ext.Msg.alert('提示', '没有记录！！');
							detailWindow.hide();
						}
						if (status == 0 || status == 11){
							grid2.getColumnModel().setHidden(1,false);	
							Ext.getCmp('deleteButton').setDisabled(false);
						} else {
							grid2.getColumnModel().setHidden(1,true);	
							Ext.getCmp('deleteButton').setDisabled(true);
						}
						showBbarData();
					} else {
						Ext.Msg.alert('提示', '抓取信息出现错误');
					}
				}
			});
		}
	});
	
	// 小画笔点击事件
	grid2.on("cellclick", function(pGrid, rowIndex, columnIndex, e) {
		var store2 = pGrid.getStore();
		var record = store2.getAt(rowIndex);
		var fieldName = pGrid.getColumnModel().getDataIndex(columnIndex);
		if (fieldName == 'deleteRow' && columnIndex == 1) {
			Ext.Msg.confirm("提示", "确定删除该行吗？", function(e) {
				if (e == 'yes') {
					// 提交到后台处理
					Ext.Ajax.request({
						url      : 'stockSystem.ered?reqCode=deleteStockTransferOrderItem',
						type     : 'post',
						dataType : 'json',
						cache    : false,
						params   : {
							outid  : outid,
							ebelp  : record.get('ebelp')
						},
						success : function(data) { 
							Ext.Msg.hide();
							store2.remove(record);
							var returnData = Ext.decode(data.responseText);
							Ext.Msg.alert("提示", returnData.message, function(e) {
								store2.reload();
							});
						},
						failure : function(data) {
							Ext.Msg.hide();
							var returnData = Ext.decode(data.responseText);
							Ext.Msg.alert("提示", returnData.message, function(e) {
							});
						}
					});
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
	
	var detailPanel = new Ext.Panel({
		layout : 'form',
		items : [ grid2, detailForm ]
	});
	
	var detailWindow = new Ext.Window({
		title : '<span class="commoncss">单据明细</span>', // 窗口标题
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
	
	// 生成一个图标列
	function iconColumnRender(value) {
		return "<a href='javascript:void(0);'><img src='" + webContext + "/resource/image/ext/application_view_list.png'/></a>";
	}
	
	// 生成一个图标列
	function iconColumnRender2(value) {
		return "<a href='javascript:void(0);'><img src='" + webContext + "/resource/image/ext/delete.png'/></a>";
	}
	
	// Custom rendering Template
    var resultTpl = new Ext.XTemplate(
        '<tpl for="."><div class="search-item">',
            '&nbsp;<span>{name1}</span>',
            '</br>&nbsp;{werks}',
        '</div></tpl>'
    );
	
	//查询门店下拉框    ** 由于有applyTo参数，所以必须在页面布局grid之后加载  **
	var searchCombo = new Ext.form.ComboBox({
		id : 'searchCombo',
		name : 'searchCombo',
        store: inWerksStore,
        typeAhead: false,
        loadingText: '查找中...',
        width: 145,
        minChars: 2,
        hideTrigger:true,
        tpl: resultTpl,
        applyTo: 'inWerks',
        itemSelector: 'div.search-item',
        onSelect: function(record){ 
			Ext.getCmp('inWerks').setValue(record.data.werks);
        }
    });
	
	//查询门店下拉框    ** 由于有applyTo参数，所以必须在页面布局grid之后加载  **
	var searchCombo1 = new Ext.form.ComboBox({
		id : 'searchCombo1',
		name : 'searchCombo1',
        store: outWerksStore,
        typeAhead: false,
        loadingText: '查找中...',
        width: 145,
        minChars: 2,
        hideTrigger:true,
        tpl: resultTpl,
        applyTo: 'outWerks',
        itemSelector: 'div.search-item',
        onSelect: function(record){ 
			Ext.getCmp('outWerks').setValue(record.data.werks);
        }
    });
	
	// 初始化控件
	function init() {
		if(werks == '1000'){
			Ext.getCmp('outWerks').setDisabled(false);
		} else {
			grid.getColumnModel().setHidden(9,true);
			Ext.getCmp('outWerks').setValue(werks);
			Ext.getCmp('outWerks').setDisabled(true);
		}
	}
	
	init();
	
	// 查询表格数据
	function queryStockTransferList() {
		store.load({
			params : {
				start     : 0,
                limit     : bbar.pageSize,
                status 	  : Ext.getCmp('status').getValue(),
    			dateFrom  : Ext.getCmp('dateFrom').getValue(),
    			dateTo    : Ext.getCmp('dateTo').getValue(),
    			goodtype  : typeCombo.getValue(),
    			outid     : Ext.getCmp('outId').getValue(),
    			mblnr     : Ext.getCmp('mblnr').getValue(),
    			inwerks   : Ext.getCmp('inWerks').getValue(),
    			outwerks  : Ext.getCmp('outWerks').getValue()
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
	
	function deleteStockTransferOrder(){
		// 提交到后台处理
		Ext.Ajax.request({
			url      : 'stockSystem.ered?reqCode=deleteStockTransferOrder',
			type     : 'post',
			dataType : 'json',
			cache    : false,
			params   : {
				outid   : outid
			},
			success : function(data) {
				Ext.Msg.hide();
				var returnData = Ext.decode(data.responseText);
				Ext.Msg.alert("提示", returnData.message, function(e) {
					detailWindow.hide();
					queryStockTransferList();
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
	
	function showBbarData(){
		Ext.getCmp('totalCount').setText(store2.getCount() + ' ');
		Ext.getCmp('totalWeight').setText(store2.sum('goldweight').toFixed(2) + ' ');
		Ext.getCmp('totalPrice').setText(store2.sum('tagprice').toFixed(2) + ' ');
	}
	
	// 保存
	function submitRows() {
		if (inwerk == null || Ext.isEmpty(inwerk)){
			Ext.MessageBox.alert('提示', '请选择调入门店!');
			return;
		}
		var m = store.modified.slice(0); // 获取修改过的record数组对象
		if (Ext.isEmpty(m)) {
			Ext.MessageBox.alert('提示', '没有数据需要保存!');
			return;
		}
		var jsonItem = [];
		// 将record数组对象转换为简单Json数组对象
		Ext.each(m, function(item) {
			if(!Ext.isEmpty(item.data["matnr"])){
				jsonItem.push(item.data);
			}
		});
		if (Ext.isEmpty(jsonItem)) {
			Ext.MessageBox.alert('提示', '没有数据需要保存!');
			return;
		}
		Ext.Msg.confirm("提示", "确定提交调拨单吗?", function(e) {
			if (e == 'yes') {
				// 提交到后台处理
				Ext.Msg.wait('正在创建订单，请稍候...','提示'); 
				Ext.Ajax.request({
					url      : 'stockSystem.ered?reqCode=submitStockTransferOut',
					type     : 'post',
					dataType : 'json',
					cache    : false,
					params   : {
						type : Ext.getCmp('type').getValue(),
						inwerk : inwerk,
						jsonItem : Ext.encode(jsonItem)		// 系列化为Json资料格式传入后台处理
					},
					success : function(data) { 
						Ext.Msg.hide();
						var returnData = Ext.decode(data.responseText);
						Ext.Msg.alert("提示", returnData.message, function(e) {
							store.removeAll();
							Ext.getCmp('totalCount').setText('总数量： ');
							Ext.getCmp('totalWeight').setText('总重量： ');
							Ext.getCmp('totalPrice').setText('总金额：');
							Ext.getCmp('type').setDisabled(false);
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
	}
});