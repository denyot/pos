

Ext.onReady(function() {

	var datetypeflag = -1;

	Ext.Ajax.timeout = 120000;// 延长gridpanel等待时间

	// 复选框
	var sm = new Ext.grid.CheckboxSelectionModel();

	// 定义自动当前页行号
	var rownum = new Ext.grid.RowNumberer({
		header : 'NO',
		width : 28
	});
	// 定义列模型
	var cm = new Ext.grid.ColumnModel([rownum, {
		header : 'ID', // 列标题
		dataIndex : 'id', // 数据索引:和Store模型对应
		sortable : true,
		hidden : true

			// 是否可排序
			}, {
				header : '品牌名称', // 列标题
				dataIndex : 'brandname', // 数据索引:和Store模型对应
				width : 200,
				sortable : true

			}, {
				header : '实际销售', // 列标题
				dataIndex : 'brandsale', // 数据索引:和Store模型对应
				width : 200,
				sortable : true
			}, {
				header : '上次排名', // 列标题
				dataIndex : 'sort', // 数据索引:和Store模型对应
				width : 100,
				sortable : true
			}, {
				header : '对比上次', // 列标题
				dataIndex : 'compare', // 数据索引:和Store模型对应
				width : 100,
				sortable : true,
				renderer : function(compare, metadata, record, rowIndex,
						colIndex, store) {
					if (compare > 0)
						return '<span style="color:red;">↑ '
								+ parseInt(compare) + '</span>';

					if (compare < 0)
						return '<span style="color:green;">↓ '
								+ parseInt(compare) * (-1) + '</span>';
					return '-'
				}
			}]);
	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
			url : './brand.ered?reqCode=queryBrandSale'
		}),
		// 数据读取器
		reader : new Ext.data.JsonReader({
			totalProperty : 'TOTALCOUNT', // 记录总数
			root : 'ROOT' // Json中的列表数据根节点
		}, [{
			name : 'brandname'
		}, {
			name : 'brandsale'
		}, {
			name : 'sort'
		}, {
			name : 'compare'
		}])
	});

	// 翻页排序时带上查询条件
	store.on('beforeload', function() {
		this.baseParams = queryparams;
			// this.baseParams = {
			// // queryParam : Ext.getCmp('queryParam').getValue()
			// };
		});
	// 每页显示条数下拉选择框
	var pagesize_combo = new Ext.form.ComboBox({
		name : 'pagesize',
		triggerAction : 'all',
		mode : 'local',
		store : new Ext.data.ArrayStore({
			fields : ['value', 'text'],
			data : [[10, '10条/页'], [20, '20条/页'], [50, '50条/页'],
					[100, '100条/页'], [250, '250条/页'], [500, '500条/页']]
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
		items : ['-', '&nbsp;&nbsp;', pagesize_combo]
	});

	// 表格工具栏
	var tbar = new Ext.Toolbar({
		items : [{
			text : '设置查询条件',
			iconCls : 'page_delIcon',
			handler : function() {
				firstWindow.show();
			}
		}, {
			text : '刷新',
			iconCls : 'page_refreshIcon',
			handler : function() {
				store.reload();
			}
		}]
	});

	// 表格实例
	var grid = new Ext.grid.GridPanel({
		// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
		title : '<span class="commoncss">服务器管理</span>',
		height : 800,
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
		listeners : {
			specialkey : function(field, e) {
				if (e.getKey() == Ext.EventObject.ENTER) {
					// queryCatalogItem();
				}
			}
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
	// store.load({
	// params : {
	// start : 0,
	// limit : bbar.pageSize
	// }
	// });

	// 布局模型
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [grid]
	});
	// ===================================================================================

	var typeStore = new Ext.data.SimpleStore({
		fields : ['type', 'typeCode'],
		data : daterecord
	});

	var systemTypeStore = new Ext.data.Store({
		// 获取数据的方式
		proxy : new Ext.data.HttpProxy({
			url : './brand.ered?reqCode=brandList'
		}),
		// 数据读取器
		reader : new Ext.data.JsonReader({
			totalProperty : 'TOTALCOUNT', // 记录总数
			root : 'ROOT' // Json中的列表数据根节点
		}, [{
			name : 'id' // Json中的属性Key值
		}, {
			name : 'brandname'
		}])

	});
	var systemTypeCombo = new Ext.form.ComboBox({
		id : 'systemBox',
		name : 'systemBox',
		fieldLabel : '<span style="color:red"> </span>品牌名称',
		emptyText : '请选择...',
		triggerAction : 'all',
		store : systemTypeStore,
		displayField : 'brandname',
		valueField : 'id',
		loadingText : '正在加载数据...',
		mode : 'local', // 数据会自动读取,如果设置为local又调用了store.load()则会读取2次；也可以将其设置为local，然后通过store.load()方法来读取
		forceSelection : true,
		typeAhead : true,
		resizable : true,
		value : '',
		x : 140,
		y : 20,
		width : 155,
		listeners : {
			'blur' : function(f) {
				// if (!roleProcessFlag)
				// Ext.getCmp('roleid').setValue('');
			}
		}
			// anchor : '100%'
	});

	systemTypeStore.on('load', function(value) { // 数据加载完成后设置下拉框值
				if (value) {
					// systemTypeCombo.setValue(value);
				}
			});
	systemTypeStore.load();

	var weektypebox = new Ext.form.ComboBox({
		columnWidth : .4,
		id : 'qstate',
		store : typeStore,
		displayField : 'typeCode',
		valueField : 'type',
		typeAhead : true,
		mode : 'local',
		triggerAction : 'all',
		emptyText : '选择周',
		selectOnFocus : true,
		xtype : 'combo',
		editable : false,
		width : 140
	});

	var basePanel = Ext.extend(Ext.form.FormPanel, {
		bodyStyle : 'background-color:#fff',
		// 每页记录数
		region : 'center',
		layout : 'absolute',
		id : 'basePanel',

		// 初始化组件
		initComponent : function() {
			var obj = this;

			var label2 = new Ext.form.Label({
				x : 7,
				y : 13,
				border : false,
				html : '<b><span style="color:red">*</span>日期类型:</b>'
			});

			this.datetype = new Ext.form.Radio({
				id : 'datetype1',
				name : 'datetype',
				x : 140,
				y : 13,
				labelSeparator : '',
				boxLabel : '周',
				value : '1',
				autoWidth : true,
				listeners : {
					'check' : function(v) {
						if (v.getValue()) {
							// var _panel = this.ownerCt.ownerCt;
							rolePanelObj.datepanel2.show();
							rolePanelObj.datepanel.hide();
							rolePanelObj.datepanel3.hide();
							datetypeflag = 1;
						}
					},
					'scope' : this
				}
			});
			this.datetype2 = new Ext.form.Radio({
				id : 'datetype2',
				name : 'datetype',
				x : 190,
				y : 13,
				labelSeparator : '',
				boxLabel : '月',
				value : '2',
				autoWidth : true,
				listeners : {
					'check' : function(v) {
						if (v.getValue()) {
							// var _panel = this.ownerCt.ownerCt;
							rolePanelObj.datepanel.show();
							rolePanelObj.datepanel2.hide();
							rolePanelObj.datepanel3.hide();
							datetypeflag = 2;
						}
					},
					'scope' : this
				}
			});

			this.datetype3 = new Ext.form.Radio({
				id : 'datetype3',
				name : 'datetype',
				x : 260,
				y : 13,
				labelSeparator : '',
				boxLabel : '年',
				value : '3',
				autoWidth : true,
				listeners : {
					'check' : function(v) {
						if (v.getValue()) {
							// var _panel = this.ownerCt.ownerCt;
							rolePanelObj.datepanel.hide();
							rolePanelObj.datepanel2.hide();
							rolePanelObj.datepanel3.show();
							datetypeflag = 3;
						}
					},
					'scope' : this
				}
			}),

			this.datepanel = new Ext.Panel({
				layout : 'column',
				id : 'secondForm',
				name : 'secondForm',
				labelWidth : 80,
				defaultType : 'textfield',
				labelAlign : 'right',
				bodyStyle : 'border:0',
				x : 7,
				y : 43,
				width : 300,
				hidden : true,
				// height : 100,
				items : [new Ext.form.Label({
					columnWidth : .7,
					border : false,
					html : '<b><span style="color:red">*</span>选择月份:</b>'
				}), new Ext.form.DateField({
					id : 'mouthid',
					width : 110,
					plugins : 'monthPickerPlugin',
					emptyText : '选择月份',
					format : 'Y-m'
				})

				]

			})
			this.datepanel3 = new Ext.Panel({
				layout : 'column',
				id : 'secondForm3',
				name : 'secondForm3',
				labelWidth : 80,
				defaultType : 'textfield',
				labelAlign : 'right',
				bodyStyle : 'border:0',
				x : 7,
				y : 43,
				width : 300,
				hidden : true,
				// height : 100,
				items : [new Ext.form.Label({
					columnWidth : .7,
					border : false,
					html : '<b><span style="color:red">*</span>选择年份:</b>'
				}), new Ext.form.DateField({
					id : 'yearid',
					width : 110,
					plugins : 'monthPickerPlugin',
					emptyText : '选择年份',
					format : 'Y'
				})

				]

			})
			this.datepanel2 = new Ext.Panel({
				layout : 'column',
				id : 'secondForm2',
				name : 'secondForm2',
				labelWidth : 80,
				defaultType : 'textfield',
				labelAlign : 'right',
				bodyStyle : 'border:0',
				x : 7,
				y : 43,
				width : 300,
				hidden : true,
				// height : 100,
				items : [new Ext.form.Label({
					columnWidth : .3,
					border : false,
					html : '<b><span style="color:red">*</span>选择周:</b>'
				}), new Ext.form.DateField({
					columnWidth : .3,
					id : 'weekid',
					width : 110,
					plugins : 'monthPickerPlugin',
					emptyText : '选择月份',
					format : 'Y-m',
					listeners : {
						'select' : function(v) {
							var y = v.getValue().format('Y');
							var m = v.getValue().format('m');
							setDay(y, m, solarDays(y, m));
							weektypebox.clearValue();
							weektypebox.store.loadData(daterecord);
						}
					}
				}), weektypebox

				]

			});
			var label4 = new Ext.form.Label({
				x : 7,
				y : 83,
				border : false,
				html : '<b>选择区域:</b>'
			});

			this.treecombox = new comboxWithTree({
				x : 140,
				y : 83
			});
			this.treecombox.on('expand', function() {
				tree.render('tree1');
			});

			this.treecombox.render(document.body);

			this.btnSearch = new Ext.Button({
				text : '确  定',
				iconCls : 'acceptIcon',
				x : 260,
				y : 220,
				handler : this._onSearch,
				scope : this
			});

			this.items = [label2, this.datetype, this.datetype2,
					this.datepanel, this.datepanel2, this.datetype3, label4,
					this.treecombox, this.datepanel3, this.btnSearch];
			basePanel.superclass.initComponent.call(this);
		},
		_onSearch : function() {
			if (!this._validate())
				return;
			var datatype = '', year = '', mouth = '', week = '', extend = '',tilte = '' ;
			if (datetypeflag == 1) {
				week = weektypebox.getValue();
				datatype = 'w';
				year = Ext.getCmp('weekid').getValue().format('Y');
				mouth = Ext.getCmp('weekid').getValue().format('m');

				if (week == 1) {
					if (mouth == 1) {
						// 周跨年
						var we = getDayUtil((year - 1), 12, solarDays(
								(year - 1), 12));
						extend = (year - 1) + '-12-' + we;
					} else {
						// 周跨月
						var we = getDayUtil(year, mouth - 1, solarDays(year,
								mouth - 1));
						extend = year + '-' + (mouth - 1) + '-' + we;
					}
				} else {
					extend = year + '-' + parseInt(mouth) + '-' + (week - 1);
				}
				tilte = '第 '+week+' 周('+daterecord[week-1][1]+')销售额';
			}
			if (datetypeflag == 2) {
				datatype = 'm';
				year = Ext.getCmp('mouthid').getValue().format('Y');
				mouth = Ext.getCmp('mouthid').getValue().format('m');
				if (mouth <= 1) {
					extend = (year - 1) + '-12';
				} else {
					extend = year + '-' + (mouth - 1);
				}
				tilte = year+' 年 '+mouth+' 月销售额';
			}
			if (datetypeflag == 3) {
				datatype = 'y';
				year = Ext.getCmp('yearid').getValue().format('Y');
				extend = year - 1;
				tilte = year+' 年销售额';
			}
			mouth = parseInt(mouth);
			queryparams = {
				deptid : deptid,
				datatype : datatype,
				year : year,
				mouth : mouth,
				extend : extend,
				week : week
			}
			store.load({
				params : queryparams
			});
			
			firstWindow.hide();
			grid.setTitle("<span style='color:red'><b>"+tilte+"</b></span>");
			// Ext.Ajax.request({
			// url : './brand.ered?reqCode=queryBrandSale',
			// success : function(response) {
			// var resultArray = Ext.util.JSON
			// .decode(response.responseText);
			// Ext.Msg.alert('提示', resultArray.msg);
			// },
			// failure : function(response) {
			// var resultArray = Ext.util.JSON
			// .decode(response.responseText);
			// Ext.Msg.alert('提示', resultArray.msg);
			// },
			// params : {
			// deptid : deptid,
			// datatype : datatype,
			// year : year,
			// mouth : mouth,
			// week : week
			// }
			// });
		},
		_validate : function() {
			if (datetypeflag == -1) {
				Ext.MessageBox.alert('提示', '请选择日期类型填写');
				return false;
			}
			if (datetypeflag == 1) {
				var ym = Ext.getCmp('weekid').getValue();
				var w = weektypebox.getValue();
				if (!ym || !w) {
					Ext.MessageBox.alert('提示', '请填写必填项目');
					return false;
				}
			}
			if (datetypeflag == 2) {
				var ym = Ext.getCmp('mouthid').getValue();
				if (!ym) {
					Ext.MessageBox.alert('提示', '请填写必填项目');
					return false;
				}
			}
			if (datetypeflag == 3) {
				var y = Ext.getCmp('yearid').getValue();
				if (!y) {
					Ext.MessageBox.alert('提示', '请填写必填项目');
					return false;
				}
			}
			return true;
		}

	})
	var deptid = '';
	firstForm = new basePanel();
	rolePanelObj = firstForm;
	tree.on('click', function(node) {
		if (node.leaf) {
			firstForm.treecombox.setValue(node.text);
			firstForm.treecombox.collapse();
			deptid = node.id;
		}

	});

	var firstWindow = new Ext.Window({
		title : '<span class="commoncss">查询销售额</span>', // 窗口标题
		layout : 'fit', // 设置窗口布局模式
		width : 360, // 窗口宽度
		height : 310, // 窗口高度
		closable : true, // 是否可关闭
		collapsible : true, // 是否可收缩
		maximizable : true, // 设置是否可以最大化
		closeAction : 'hide',
		animCollapse : true,
		animateTarget : Ext.getBody(),
		border : false, // 边框线设置
		constrain : true, // 设置窗口是否可以溢出父容器
		pageY : 10, // 页面定位X坐标
		pageX : document.body.clientWidth / 2 - 500 / 2, // 页面定位Y坐标
		items : [firstForm], // 嵌入的表单面板
		buttons : []
	});

	firstWindow.show();
})