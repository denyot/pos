/**
 * 直营店货品调出退货审批
 * @author Xiashou
 * @since 2014/05/22
 */
Ext.onReady(function() {
	
	Ext.QuickTips.init();
	
	var outid = "";
	
	var sealmethodStore = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : 'stockSystem.ered?reqCode=getSealMethod'
		}),
		reader : new Ext.data.JsonReader({}, [{
			name : 'zxsfs'
		}, {
			name : 'txsfs'
		} ])
	});
	
	//货品类型下拉框
	var typeCombo = new Ext.ux.form.LovCombo({
		id : 'type',
		name : 'type',
		triggerAction : 'all',
		mode : 'local',
		fieldLabel : '货品类型',
		store : new Ext.data.ArrayStore({
			fields : [ 'value', 'text' ],
			data : [[ 1, '镶嵌类' ], [ 2, '银饰类' ], [ 3, '玉石类' ], [ 4, '18K金类' ], 
			        [ 5, '铂金类' ], [ 6, '黄金类' ], [ 7, '钯金类' ], [ 8, '赠品及包材' ], [ 9, '原材料' ]]
		}),
		valueField : 'value',
		displayField : 'text',
		editable : false,
		width : 145
	});
	
	//单据状态下拉框
	var statusCombo = new Ext.ux.form.LovCombo({
		id : 'status',
		name : 'status',
		triggerAction : 'all',
		mode : 'local',
		fieldLabel : '订单状态',
		store : new Ext.data.ArrayStore({
			fields : [ 'value', 'text' ],
			data : [[-1, '待审核'], [1, '待发货'], [2, '已发货'], [3, '驳回'], [4, '已收货'], 
			        [11, '门店退货待审批'], [12, '门店退货待发货'], [13, '门店退货审批驳回'], [14, '门店退货完成']]
		}),
		valueField : 'value',
		displayField : 'text',
		editable : false,
		width : 145
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
									id : 'outwerks',
									name : 'outwerks',
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
									id : 'inwerks',
									name : 'inwerks',
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
		width : 460, 											// 窗口宽度
		height : 200, 											// 窗口高度
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
						queryStockTransferList(qForm.getForm());
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
		width : 26
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
					return "玉石类";
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
			width : 50
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
		},{
			header : '总标准价',
			dataIndex : 'bzj',
			sortable : true,
			width : 80
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
			header : '邮寄日期',
			dataIndex : 'posttime',
			sortable : true,
			width : 80
		}, {
			header : '备注',
			dataIndex : 'remark',
			sortable : true,
			width : 120,
			renderer : function(v, metadata, record, rowIndex, columnIndex, store){
				metadata.attr = ' ext:qtip="' + v + '"';    
				return v;
			}
		},{
			header : '导出', // 列标题
			dataIndex : 'download',
			width : 35,
			renderer : iconColumnRender2
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
			name : 'goodscount'
		}, {
			name : 'goodsweight'
		}, {
			name : 'goodsprice'
		}, {
			name : 'stockdate'		
		}, {
			name : 'status'
		}, {
			name : 'posttime'
		}, {
			name : 'outwerksstr'
		}, {
			name : 'inwerksstr'
		}, {
			name : 'outwerks'
		}, {
			name : 'inwerks'
		}, {
			name : 'remark'
		}, {
			name : 'rejreason'
		}, {
			name : 'bzj'
		}  ])
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
			width : 140,
			editor : new Ext.grid.GridEditor(new Ext.form.TextField({
				id: 'matnr',
				name: 'matnr'
			}))
		}, {
			header : '物料名称',
			dataIndex : 'maktx',
			width : 130
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
			header : '发出门店',
			dataIndex : 'outwerks',
			width : 60
		}, {
			header : '出库系数',
			dataIndex : 'outckxs',
			width : 60
		}, {
			header : '当前系数',
			dataIndex : 'outdqxs',
			width : 60,
			renderer : function(value, cellmeta, record) {
				if(Number(record.get('bzj')) != 0){
					return Number(Number(record.get('bqj'))/Number(record.get('bzj'))).toFixed(2);
				} else {
					return Number('0').toFixed(2);
				}
			}
		}, {
			header : '销售方式',
			dataIndex : 'outwerkssealmethod',
			sortable : true,
			width : 90,
			editor : new Ext.form.ComboBox({
				triggerAction : 'all',
				store : sealmethodStore,
				displayField : 'txsfs',
				valueField : 'zxsfs',
				mode : 'local',
				width : '80'	
			})
		}, {
			header : '发往门店',
			dataIndex : 'inwerks',
			width : 60
		}, {
			header : '出库系数',
			dataIndex : 'inckxs',
			width : 60
		}, {
			header : '销售方式',
			dataIndex : 'inwerkssealmethod',
			sortable : true,
			width : 90,
			editor : new Ext.form.ComboBox({
				triggerAction : 'all',
				store : sealmethodStore,
				displayField : 'txsfs',
				valueField : 'zxsfs',
				mode : 'local',
				width : '80'	
			})
		}, {
			header : '标签价',
			dataIndex : 'bqj',
			sortable : true,
			width : 90,
			renderer : function(v){
				return Number(v).toFixed(2);
			}
		}, {
			header : '标准价',
			dataIndex : 'bzj',
			sortable : true,
			width : 90,
			renderer : function(v){
				return Number(v).toFixed(2);
			}
		}, {
			header : '重新打标签',
			dataIndex : 'ifneedprintlabel',
			width : 80,
			editor : new Ext.form.ComboBox({
				triggerAction : 'all',
				store : new Ext.data.ArrayStore({
					fields : ['value', 'text'],
					data : [['1、是', '1、是'], ['2、否', '2、否']]
				}),
				displayField : 'text',
				valueField : 'value',
				mode : 'local',
				width : '80'
			})
		}, {
			header : '修改零售价',
			dataIndex : 'ifneedchangprice',
			width : 80,
			editor : new Ext.form.ComboBox({
				triggerAction : 'all',
				store : new Ext.data.ArrayStore({
					fields : ['value', 'text'],
					data : [['1、是', '1、是'], ['2、否', '2、否']]
				}),
				displayField : 'text',
				valueField : 'value',
				mode : 'local',
				width : '80'
			})
		}, {
			header : '库位',
			dataIndex : 'lgort',
			width : 90
		}, {
			header : '金重',
			dataIndex : 'zclzl',// 'zjlzl1',
			sortable : true,
			width : 60
		}, {
			header : '主石重',
			dataIndex : 'zzlnn',// 'zjlzl1',
			sortable : true,
			width : 60
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
		  url  : 'stockSystem.ered?reqCode=getStockTransferExamineDetail'
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
			name : 'bqj',
			type : 'float'
		}, {
			name : 'bzj',
			type : 'float'
		}, {
			name : 'lgort'
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
		}, {
			name : 'outwerks'
		}, {
			name : 'outckxs'
		}, {
			name : 'outwerkssealmethod'
		}, {
			name : 'inwerks'
		}, {
			name : 'inckxs'
		}, {
			name : 'inwerkssealmethod'
		}, {
			name : 'ifneedprintlabel'
		}, {
			name : 'ifneedchangprice'
		}, {
			name : 'zclzl'
		}, {
			name : 'zzlnn'
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
			keyWords : Ext.getCmp('inwerks').getValue()
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
			keyWords : Ext.getCmp('outwerks').getValue()
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
		var params = qForm.getForm().getValues();
		bbar.pageSize = parseInt(comboBox.getValue());
		number = parseInt(comboBox.getValue());
		params.goodtype = typeCombo.getValue();
		params.status = statusCombo.getValue();
		params.start = 0;
		params.limit = bbar.pageSize;
		store.reload({
			params : params
		});
	});
	
	// 翻页排序时带上查询条件
	store.on('beforeload', function() {
		this.baseParams = {
			start     : 0,
            limit     : parseInt(pagesizeCombo.getValue()),
            status 	  : statusCombo.getValue(),
            goodtype  : typeCombo.getValue(),
  			dateFrom  : Ext.getCmp('dateFrom').getValue(),
  			dateTo    : Ext.getCmp('dateTo').getValue(),
  			outid     : Ext.getCmp('outId').getValue(),
  			mblnr     : Ext.getCmp('mblnr').getValue(),
  			inwerks   : Ext.getCmp('inwerks').getValue(),
  			outwerks  : Ext.getCmp('outwerks').getValue()
		};
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
			text:'总标签价：'
		},'&nbsp;',{
			xtype:'label',
			id:'totalbqPrice'
		} ,'&nbsp;&nbsp;' ,'-', '&nbsp;&nbsp;',{
			xtype:'label',
			text:'总标准价：'
		},'&nbsp;',{
			xtype:'label',
			id:'totalbzPrice'
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
//				},'-', {
//					text : '导出本页',
//					iconCls : 'page_excelIcon',
//					handler : function() {
////						exportExcel('stockSystem.ered?reqCode=exportOutStockHeader&exp=1');
//					}
//				},'-', {
//					text : '导出全部',
//					iconCls : 'page_excelIcon',
//					handler : function() {
////						exportExcel('stockSystem.ered?reqCode=exportOutStockHeader&exp=1');
//					}
				}]
	});
	
	// 表格实例
	var grid = new Ext.grid.EditorGridPanel({
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
//			 forceFit : true
		},
		loadMask : {
			msg : '正在加载表格数据,请稍等...'
		}
	});
	
	var grid2 = new Ext.grid.EditorGridPanel({
		height : 345,
		width : 800,
//		frame : true,
		autoScroll : true,
		region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		store : store2, // 数据存储
		stripeRows : true, // 斑马线
		cm : cm2, // 列模型
		bbar : bbar2,
//		sm : sm, // 复选框
		viewConfig : {
			// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
//			 forceFit : true
		},
		loadMask : {
			msg : '正在加载表格数据,请稍等...'
		}
	});
	
	var sealMethodCombo = new Ext.form.ComboBox({
		id : 'sealMethod',
		fieldLabel : '销售方式',
		emptyText : '请选择...',
		triggerAction : 'all',
		store : sealmethodStore,
		displayField : 'zxsfs',
		valueField : 'zxsfs',
		loadingText : '正在加载数据...',
		mode : 'local', // 数据会自动读取,如果设置为local又调用了store.load()则会读取2次；也可以将其设置为local，然后通过store.load()方法来读取
		editable : false,
		anchor : '100%'
	});
	
	var resultCombo = new Ext.form.ComboBox({
		hiddenName : 'reason',
		id : 'myreason',
		fieldLabel : '请选择结果',
		emptyText : '请选择...',
		triggerAction : 'all',
		store : new Ext.data.ArrayStore({
					fields : ['value', 'text'],
					data : [[1, '通过'], [3, '驳回']]
				}),
		valueField : 'value',
		displayField : 'text',
		mode : 'local', // 数据会自动读取,如果设置为local又调用了store.load()则会读取2次；也可以将其设置为local，然后通过store.load()方法来读取
		editable : false,
		anchor : '100%'
	});
	
	var printLabelCombo = new Ext.form.ComboBox({
		hiddenName : 'printLabel2',
		fieldLabel : '重打标签',
		emptyText : '请选择...',
		triggerAction : 'all',
		store : new Ext.data.ArrayStore({
					fields : ['value', 'text'],
					data : [['1、是', '1、是'], ['2、否', '2、否']]
				}),
		displayField : 'text',
		valueField : 'value',
		mode : 'local',
		anchor : '100%'
	})
	
	var updatePriceCombo = new Ext.form.ComboBox({
		hiddenName : 'updatePrice2',
		fieldLabel : '更新价格',
		emptyText : '请选择...',
		triggerAction : 'all',
		store : new Ext.data.ArrayStore({
					fields : ['value', 'text'],
					data : [['1、是', '1、是'], ['2、否', '2、否']]
				}),
		displayField : 'text',
		valueField : 'value',
		mode : 'local',
		anchor : '100%'
	})
	
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
				columnWidth : .3,
				layout : 'form',
				border : false,
				items : [resultCombo]
			},{
				columnWidth : .3,
				layout : 'form',
				border : false,
				items : [{
					xtype : 'textfield',
					id : 'rejreason',
					fieldLabel : '原因',
					anchor : '100%'
				}]
			},{
				columnWidth : .25,
				layout : 'form',
				border : false,
				bodyStyle : 'padding:0 0 0 40', // 表单元素和表单面板的边距
				items : [{
					xtype : 'button',
					iconCls : 'acceptIcon',
					name : 'acceptButton',
					id : 'acceptButton',
					text : ' 确 定 ',
					anchor : '70%',
					handler : acceptStockTransferOrder
				}]
			}]
		},{
			layout : 'column',
			border : false,
			items : [{
				columnWidth : .3,
				layout : 'form',
				border : false,
				items : [sealMethodCombo]
			},{
				columnWidth : .3,
				layout : 'form',
				border : false,
				items : [printLabelCombo]
			},{
				columnWidth : .3,
				layout : 'form',
				border : false,
				items : [updatePriceCombo]
			}]
		}]
	});
	
	// 小画笔点击事件
	grid.on("cellclick", function(pGrid, rowIndex, columnIndex, e) {
		var store = pGrid.getStore();
		var record = store.getAt(rowIndex);
		var fieldName = pGrid.getColumnModel().getDataIndex(columnIndex);
		outid = record.get('outid');
		status = record.get('status');
		outwerks = record.get('outwerks');
		inwerks = record.get('inwerks');
		if (fieldName == 'showdetail' && columnIndex == 1) {
			sealmethodStore.load();
			detailWindow.show();
			store2.load({
				params : {
					outid : outid,
					outwerks : outwerks,
					inwerks : inwerks
				},
				callback : function(records, options, success) {
					if (success == true) {
						if (records.length == 0) {
							Ext.Msg.alert('提示', '没有记录！！');
							detailWindow.hide();
						}
						sealMethodCombo.setValue("");
						printLabelCombo.setValue("");
						updatePriceCombo.setValue("");
						if (status == 0 || status == 11){
							Ext.getCmp('acceptButton').setDisabled(false);
							resultCombo.setValue('');
							resultCombo.setDisabled(false);
							Ext.getCmp('rejreason').setValue('');
							Ext.getCmp('rejreason').setDisabled(false);
							sealMethodCombo.setDisabled(false);
							printLabelCombo.setDisabled(false);
							updatePriceCombo.setDisabled(false);
						} else if(status == 3 || status == 13){
							Ext.getCmp('acceptButton').setDisabled(true);
							resultCombo.setValue(3);
							resultCombo.setDisabled(true);
							Ext.getCmp('rejreason').setValue(record.get('rejreason'));
							Ext.getCmp('rejreason').setDisabled(true);
							sealMethodCombo.setDisabled(true);
							printLabelCombo.setDisabled(true);
							updatePriceCombo.setDisabled(true);
						} else {
							Ext.getCmp('acceptButton').setDisabled(true);
							resultCombo.setValue(1);
							resultCombo.setDisabled(true);
							Ext.getCmp('rejreason').setValue(record.get('rejreason'));
							Ext.getCmp('rejreason').setDisabled(true);
							sealMethodCombo.setValue(records[0].get('inwerkssealmethod'));
							sealMethodCombo.setDisabled(true);
							printLabelCombo.setValue(records[0].get('ifneedprintlabel'));
							printLabelCombo.setDisabled(true);
							updatePriceCombo.setValue(records[0].get('ifneedchangprice'));
							updatePriceCombo.setDisabled(true);
						}
						showBbarData();
					} else {
						Ext.Msg.alert('提示', '抓取信息出现错误');
					}
				}
			});
		} else if (fieldName == 'download' && columnIndex == 14){
			exportExcel('stockSystem.ered?reqCode=exportStockTransferDetail&outid=' + outid + '&outwerks=' + outwerks + '&inwerks=' + inwerks);
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
		items : [ detailForm, grid2 ]
	});
	
	var detailWindow = new Ext.Window({
		title : '<span class="commoncss">单据明细</span>', // 窗口标题
		//layout : 'fit', // 设置窗口布局模式
		width : 815, // 窗口宽度
		iconCls : 'window_caise_listIcon', // 按钮图标
		height : 460, // 窗口高度
		closable : true, // 是否可关闭
		collapsible : true, // 是否可收缩
		maximizable : false, // 设置是否可以最大化
		border : false, // 边框线设置
		autoScroll : true,
		constrain : true, // 设置窗口是否可以溢出父容器
		pageY : 50, // 页面定位Y坐标
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
		return "<a href='javascript:void(0);'><img src='" + webContext + "/resource/image/ext/page_excel.png'/></a>";
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
        applyTo: 'inwerks',
        itemSelector: 'div.search-item',
        onSelect: function(record){ 
			Ext.getCmp('inwerks').setValue(record.data.werks);
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
        applyTo: 'outwerks',
        itemSelector: 'div.search-item',
        onSelect: function(record){ 
			Ext.getCmp('outwerks').setValue(record.data.werks);
        }
    });
	
	// 初始化控件
	function init() {
		if(werks == '1000'){
			Ext.getCmp('outwerks').setDisabled(false);
		} else {
			grid.getColumnModel().setHidden(9,true);
			Ext.getCmp('outwerks').setValue(werks);
			Ext.getCmp('outwerks').setDisabled(true);
		}
	}
	
	init();
	
	// 查询表格数据
	function queryStockTransferList(pForm) {
		var params = pForm.getValues();
		params.goodtype = typeCombo.getValue();
		params.status = statusCombo.getValue();
		params.start = 0;
		params.limit = bbar.pageSize;
		store.load({
			params : params,
			callback : function(records, options, success) {
				if (success == true) {
					if (records.length == 0)
						Ext.Msg.alert('提示', '没有数据');
				} else
					Ext.Msg.alert('提示', '出现错误');
			}
		});
	}
	
	function acceptStockTransferOrder(){
		
		var jsonItem = [];
		// 将record数组对象转换为简单Json数组对象
		store2.each(function(record) {
			if(!Ext.isEmpty(record.get('matnr'))){
				jsonItem.push(record.data);
			}
		});
		if (Ext.isEmpty(jsonItem)) {
			Ext.MessageBox.alert('提示', '没有数据需要保存!');
			return;
		}
		Ext.Msg.confirm("提示", "确定审批调货单吗?", function(e) {
			if (e == 'yes'){
				// 提交到后台处理
				Ext.Msg.wait('正在审批订单，请稍候...','提示'); 
				Ext.Ajax.request({
					url      : 'stockSystem.ered?reqCode=examineStockTransferOrder',
					type     : 'post',
					dataType : 'json',
					cache    : false,
					params   : {
						outid : outid,
						status : status,
						inwerks : inwerks,
						jsonItem : Ext.encode(jsonItem)		// 系列化为Json资料格式传入后台处理
					},
					success : function(data) { 
						Ext.Msg.hide();
						var returnData = Ext.decode(data.responseText);
						Ext.Msg.alert("提示", returnData.message, function(e) {
							detailWindow.hide();
							queryStockTransferList(qForm.getForm());
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
		// 提交到后台处理
//		Ext.Ajax.request({
//			url      : 'stockSystem.ered?reqCode=deleteStockTransferOrder',
//			type     : 'post',
//			dataType : 'json',
//			cache    : false,
//			params   : {
//				outid   : outid
//			},
//			success : function(data) {
//				Ext.Msg.hide();
//				var returnData = Ext.decode(data.responseText);
//				Ext.Msg.alert("提示", returnData.message, function(e) {
//					detailWindow.hide();
//					queryStockTransferList();
//				});
//			},
//			failure : function(data) {
//				Ext.Msg.hide();
//				var returnData = Ext.decode(data.responseText);
//				Ext.Msg.alert("提示", returnData.message, function(e) {
//				});
//			}
//		});
	}
	
	function showBbarData(){
		Ext.getCmp('totalCount').setText(store2.getCount() + ' ');
		Ext.getCmp('totalWeight').setText(store2.sum('goldweight').toFixed(2) + ' ');
		Ext.getCmp('totalbqPrice').setText(store2.sum('bqj').toFixed(2) + ' ');
		Ext.getCmp('totalbzPrice').setText(store2.sum('bzj').toFixed(2) + ' ');
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
							Ext.getCmp('totalbqPrice').setText('总标签价：');
							Ext.getCmp('totalbzPrice').setText('总标准价：');
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