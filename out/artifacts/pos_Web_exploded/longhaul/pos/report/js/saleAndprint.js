/**
 * 销售打印表
 * @author zhuwh
 * @since 2015-9-8
 * */
Ext.onReady(function() {
	
	var ifEnough_combo = new Ext.form.ComboBox({
		name : 'ifEnough',
		triggerAction : 'all',
		mode : 'local',
		fieldLabel : '打印情况',
		emptyText : '打印情况',
		store : new Ext.data.ArrayStore({
			fields : [ 'value', 'text' ],
			data : [ [ '', '所有' ], [ '0', '未打印' ], [ '1', '已打印' ] ]
		}),
		valueField : 'value',
		displayField : 'text',
		value : '',
		editable : false,
		anchor : '100%'
	});
	
	
	var werksInfo = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : 'reportSystem.ered?reqCode=getSaleAndprintAllWerks'
		}),
		reader : new Ext.data.JsonReader({root : 'ROOT'}, [ {
			name : 'werks'
		}, {
			name : 'name1'
		} ])
	});
	werksInfo.load();
	
	var werks_combo = new Ext.ux.form.LovCombo({
		name : 'werkss',
		triggerAction : 'all',
		mode : 'local',
		fieldLabel : '门店',
		emptyText : '门店',
		store : werksInfo,
		valueField : 'werks',
		displayField : 'name1',
		editable : false,
		anchor : '100%'
	});
	
	
	
	
	var qForm = new Ext.form.FormPanel({
		border : false,
		labelWidth : 60, // 标签宽度
		labelAlign : 'right', // 标签对齐方式
		bodyStyle : 'padding:5 5 0', // 表单元素和表单面板的边距
		buttonAlign : 'center',
		height : 200,
		items : [{
			layout : 'column',
			border : false,
			items : [{
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [{
									fieldLabel : '日期从',
									id : 'dateFrom',
									name : 'dateFrom',
									xtype : 'datefield', // 设置为数字输入框类型
									format: 'Y-m-d', //日期格式化
									//allowBlank: false,
									anchor : '100%'
								},ifEnough_combo]
					}, {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [{
									fieldLabel : '日期到',
									id : 'dateTo',
									name : 'dateTo',
									xtype : 'datefield', // 设置为数字输入框类型
									format:'Y-m-d', //日期格式化
									//allowBlank: false,
									anchor : '100%'
								},
								werks_combo
								]
					}]
				}
				]
	});
	
	
	var qWindow = new Ext.Window({
			title : '<span class="commoncss">查询条件</span>', 		// 窗口标题
			layout : 'fit', 										// 设置窗口布局模式
			width : 400, 											// 窗口宽度
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
			pageX : document.body.clientWidth / 2 - 400 / 2, 		// 页面定位X坐标
			// 设置窗口是否可以溢出父容器
			buttonAlign : 'right',
			items : [qForm],
			buttons : [{
						text : '查询',
						iconCls : 'previewIcon',
						handler : function() {
							if(Ext.get('dateFrom').getValue() == ''){
								Ext.MessageBox.alert('提示', '请输入开始日期！');
								return;
							}else if(Ext.get('dateTo').getValue() == ''){
								Ext.MessageBox.alert('提示', '请输入结束日期！');
								return;
							}
							queryBalanceInfo(qForm.getForm());

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
		qWindow.show(); // 显示窗口

		// 定义自动当前页行号
		var rownum = new Ext.grid.RowNumberer({
			header : 'NO',
			width : 28
		});

		// 定义列模型 
		var cm = new Ext.grid.ColumnModel([rownum,
			{
				header : '修改', // 列标题
				dataIndex : 'editinfo',
				width : 35,
				renderer : iconColumnRender
			},{
				header : '门店',
				dataIndex : 'storeid',
				width : 120
			}, {
				header : '销售单号',
				dataIndex : 'salesorderid',
				width : 130,
				sortable : true	// 是否可排序
			}, {
				header : 'SAP单号',
				dataIndex : 'sapsalesorderid',
				width : 100,
				sortable : true // 是否可排序
			}, {
				header : '销售日期',
				dataIndex : 'saledate',
				width : 100,
				sortable : true // 是否可排序
			},{
				header : '录单日期',
				dataIndex : 'insertdatetime',
				width : 100
			},{
				header : '滞后天数',
				dataIndex : 'zhdate',
				width : 100
			},
			{
				header : '打印次数',
				dataIndex : 'cnt',
				width : 90,
				sortable : true // 是否可排序
			}, {
				header : '打印时间',
				dataIndex : 'date',
				width : 140,
				renderer:function(value){   
				       if(value instanceof Date){   
				           return new Date(value).format("Y-m-d");   
				       }else{   
				           return value;   
				       }  
				}
			},{
				header : '原因',
				dataIndex : 'remark',
				width : 90,
				sortable : true // 是否可排序
			}
			]);

		/**
		 * 数据存储
		 */
		var store = new Ext.data.Store({
			// 获取数据的方式
			proxy : new Ext.data.HttpProxy({
				url : 'reportSystem.ered?reqCode=getSaleAndprintAll'
			}),
			// 数据读取器
			reader : new Ext.data.JsonReader({
				totalProperty : 'TOTALCOUNT', // 记录总数
				root : 'ROOT' // Json中的列表数据根节点
			}, [{
						name : 'storeid'
					}, {
						name : 'salesorderid'
					}, {
						name : 'sapsalesorderid'
					}, {
						name : 'cnt'
					}, {
						name : 'date'
					},{
						name:'saledate'
					},{
						name:'remark'
					},{
						name:'insertdatetime'
					},{
						name:'zhdate'
					}
				])
		});

		// 翻页排序时带上查询条件
		store.on('beforeload', function() {
			//this.baseParams =;
			
		});
		
		// 每页显示条数下拉选择框
		var pagesizeCombo = new Ext.form.ComboBox({
			name : 'pagesize',
			triggerAction : 'all',
			mode : 'local',
			store : new Ext.data.ArrayStore({
						fields : ['value', 'text'],
						data : [[10000, '10000条以上/页']]
					}),
			valueField : 'value',
			displayField : 'text',
			value : '10000',
			editable : false,
			width : 85
		});

		// 改变每页显示条数reload数据
		pagesizeCombo.on("select", function(comboBox) {
			bbar.pageSize = parseInt(comboBox.getValue());
			number = parseInt(comboBox.getValue());
			store.reload({
						params : {
							start : 0,
							limit : bbar.pageSize
						}
					});
		});
		
		var number = parseInt(pagesizeCombo.getValue());
		
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

		// 表格工具栏
		var tbar = new Ext.Toolbar({
			items : [{
						text : '查询',
						iconCls : 'previewIcon',
						handler : function() {
							qWindow.show();
						}
					},{
						text : '刷新',
						iconCls : 'arrow_refreshIcon',
						handler : function() {
							store.reload();
//							updateChart(qForm.getForm());
						}
					},{
						text : '导出',
						iconCls : 'page_excelIcon',
						handler : function() {
							exportExcel('reportSystem.ered?reqCode=exportPrintDetail'+
							'&dateFrom='+Ext.getCmp("dateFrom").getValue().format('Y-m-d')+
							'&dateTo='+Ext.getCmp("dateTo").getValue().format('Y-m-d')+
							'&ifEnough='+ifEnough_combo.getValue()+
							'&werkss='+werks_combo.getValue()
							);
						}
					},
					
					]
		});

		// 表格实例
		var grid = new Ext.grid.GridPanel({
			region : 'center',
			margins : '3 3 3 3',
			// collapsible : true,
			border : true,
			width : 600,
			maxSize : 1000,
			autoScroll : true,
			// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
//			title : '<span class="commoncss">销售报表(表格展示)</span>',
			//height : 500,
			frame : false,
			store : store, // 数据存储
			split : true,
			collapsible : false,
			stripeRows : true, // 斑马线
			cm : cm, // 列模型
			tbar : tbar,
			bbar : bbar,// 分页工具栏
			viewConfig : {
//				forceFit : true			// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
			},
			loadMask : {
				msg : '正在加载表格数据,请稍等...'
			}
		});

		// 布局
		var viewport = new Ext.Viewport({
			layout : 'border',
			items : [grid]
		});
		// 生成一个图标列
	function iconColumnRender(value) {
		return "<a href='javascript:void(0);'><img src='" + webContext
				+ "/resource/image/ext/edit1.png'/></a>";;
	}
		// 查询表格数据
		function queryBalanceInfo(pForm) {
			//var params = pForm.getValues();
			//params.start = 0;
			//params.limit = bbar.pageSize;
			store.load({
						params :  {
							'dateFrom':Ext.getCmp("dateFrom").getValue().format('Y-m-d'),
							'dateTo':Ext.getCmp("dateTo").getValue().format('Y-m-d'),
							'ifEnough':ifEnough_combo.getValue(),
							'werkss':werks_combo.getValue()

				
			}
					});
		}
	
	// 小画笔点击事件
	grid.on("cellclick", function(pGrid, rowIndex, columnIndex, e) {
		var store = pGrid.getStore();
		var record = store.getAt(rowIndex);
		var fieldName = pGrid.getColumnModel().getDataIndex(columnIndex);
		if (fieldName == 'editinfo' ) {
			var editsale=eForm.getForm().findField("editsale");
			var editsaleRemark=eForm.getForm().findField("editsaleRemark");
			var editsaleSap=eForm.getForm().findField("editsaleSap");
			editsale.setValue(record.get("salesorderid"));
			editsaleSap.setValue(record.get("sapsalesorderid"));
			editsaleRemark.setValue(record.get("remark"));
			editWindow.show();
			

		}

	});
	
	var eForm = new Ext.form.FormPanel({
		border : false,
		labelWidth : 60, // 标签宽度
		labelAlign : 'right', // 标签对齐方式
		bodyStyle : 'padding:5 5 0', // 表单元素和表单面板的边距
		buttonAlign : 'center',
		height : 200,
		items : [{
			layout : 'column',
			border : false,
			items : [{
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [{
									fieldLabel : '销售单号',
									id : 'editsale',
									name : 'editsale',
									xtype : 'textfield', // 设置为数字输入框类型
									readOnly :true,
									anchor : '100%'
								}]
					},{
						columnWidth : .5,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [{
									fieldLabel : 'SAP单号',
									readOnly :true,
									id : 'editsaleSap',
									name : 'editsaleSap',
									anchor : '100%'
								}
								]
					},{
						columnWidth : .99,
						layout : 'form',
						labelWidth : 60, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [{
									fieldLabel : '原因',
									id : 'editsaleRemark',
									name : 'editsaleRemark',
									xtype : 'textarea',
									maxLength : 255,
									emptyText:'请输入...',
									anchor : '100%'
								}
								]
					}]
				}
				]
	});
	
		
	var editWindow = new Ext.Window({
			title : '<span class="commoncss">修改</span>', 		// 窗口标题
			layout : 'fit', 										// 设置窗口布局模式
			width : 500, 											// 窗口宽度
			height : 200, 											// 窗口高度
			closable : true, 										// 是否可关闭
			closeAction : 'hide', 									// 关闭策略
			collapsible : true, 									// 是否可收缩
			maximizable : false, 									// 设置是否可以最大化
			border : true, 											// 边框线设置
			constrain : true,
			titleCollapse : true,
			animateTarget : Ext.getBody(),
			pageY : 100, 											// 页面定位Y坐标
			pageX : document.body.clientWidth / 2 - 400 / 2, 		// 页面定位X坐标
			// 设置窗口是否可以溢出父容器
			buttonAlign : 'right',
			items : [eForm],
			buttons : [{
						text : '提交',
						iconCls : 'acceptIcon',
						handler : function() {
							Ext.Msg.confirm("提示", "确定要提交吗？", function(btn, text) {
			                    if (btn == "yes") {
			                        eForm.form.submit({
			                            url : 'reportSystem.ered?reqCode=editSaleAndprint',
			                            waitTitle : '提示',
			                            method : 'POST',
			                            waitMsg : '正在处理数据,请稍候...',
			                            success : function(form, action) {
			                               		 Ext.Msg.alert("提示", action.result.message);
			                               		 queryBalanceInfo(qForm.getForm());
			                                	editWindow.hide();
			                                
			                            },
			                            failure : function(form, action) {
			                                Ext.Msg.alert("提示", "修改不成功");
			                            }
			                        });
			                    }
			                });
						
						}
					}
					]
		});
	
	
	
});