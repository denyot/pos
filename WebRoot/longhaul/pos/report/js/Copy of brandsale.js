

Ext.onReady(function() {

	var datetypeflag = -1;

	Ext.Ajax.timeout = 120000;// 延长gridpanel等待时间

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
			var label1 = new Ext.form.Label({
				x : 7,
				y : 23,
				border : false,
				html : '<b><span style="color:red">*</span>品牌名称:</b>'
			});
			this.brandtype = systemTypeCombo;

			var label2 = new Ext.form.Label({
				x : 7,
				y : 73,
				border : false,
				html : '<b><span style="color:red">*</span>日期类型:</b>'
			});

			this.datetype = new Ext.form.Radio({
				id : 'datetype1',
				name : 'datetype',
				x : 140,
				y : 73,
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
							datetypeflag = 1;
						}
					},
					'scope' : this
				}
			});
			this.datetype2 = new Ext.form.Radio({
				id : 'datetype2',
				name : 'datetype',
				x : 230,
				y : 73,
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
							datetypeflag = 2;
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
				y : 113,
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

			this.datepanel2 = new Ext.Panel({
				layout : 'column',
				id : 'secondForm2',
				name : 'secondForm2',
				labelWidth : 80,
				defaultType : 'textfield',
				labelAlign : 'right',
				bodyStyle : 'border:0',
				x : 7,
				y : 113,
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
				y : 153,
				border : false,
				html : '<b><span style="color:red">*</span>销售额:</b>'
			});

			this.salecount = new Ext.form.TextField({
				x : 140,
				y : 153,
				name : 'salecount',
				allowBlank : false,
				width : 150
			});

			var label5 = new Ext.form.Label({
				x : 7,
				y : 203,
				border : false,
				html : '<b>备注:</b>'
			});
			this.comment = new Ext.form.TextArea({
				x : 140,
				y : 203,
				name : 'comment',
				rownum : 10,
				allowBlank : false,
				width : 150
			});
			this.btnSearch = new Ext.Button({
				text : '确  定',
				iconCls : 'acceptIcon',
				x : 300,
				y : 320,
				handler : this._onSearch,
				scope : this
			});

			this.items = [label1, this.brandtype, label2, this.datetype,
					this.datetype2, this.datepanel, this.datepanel2, label4,
					label5, this.comment, this.salecount, this.btnSearch];
			basePanel.superclass.initComponent.call(this);
		},
		_onSearch : function() {
			if (!this._validate())
				return;
			var brandtype = this.brandtype.getValue();
			var salecount = this.salecount.getValue();
			var comment = this.comment.getValue();
			var datatype = '', year = '', mouth = '', week = '';
			if (datetypeflag == 1) {
				week = weektypebox.getValue();
				datatype = 'w';
				year = Ext.getCmp('weekid').getValue().format('Y');
				mouth = Ext.getCmp('weekid').getValue().format('m');
			}
			if (datetypeflag == 2) {
				datatype = 'm';
				year = Ext.getCmp('mouthid').getValue().format('Y');
				mouth = Ext.getCmp('mouthid').getValue().format('m');
			}
			Ext.Ajax.request({
				url : './brand.ered?reqCode=saveBrandSale',
				success : function(response) {
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
					brandtype : brandtype,
					salecount : salecount,
					datatype : datatype,
					year : year,
					mouth : mouth,
					week : week,
					comment : comment
				}
			});
		},
		_validate : function() {
			if (datetypeflag == -1) {
				Ext.MessageBox.alert('提示', '请选择日期类型填写');
				return false;
			}
			var brandtype = this.brandtype.getValue();
			var salecount = this.salecount.getValue();
			if (!brandtype || !salecount) {
				Ext.MessageBox.alert('提示', '请填写必填项目');
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
			return true;
		}

	})

	var rolePanelObj = new basePanel();
	// 布局模型
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [rolePanelObj]
	});

		// Ext.Ajax.request({
		// url : './userRoleMenu.ered?reqCode=PwdPloyList',
		// success : function(response) {
		//
		// var resultArray = Ext.util.JSON.decode(response.responseText);
		// var obj = resultArray.ROOT[0];
		// if (obj) {
		// if (obj.timemin) {
		// rolePanelObj.timemin.setValue(obj.timemin);
		// }
		// if (obj.timemax) {
		// rolePanelObj.timemax.setValue(obj.timemax);
		// }
		// if (obj.lengmin) {
		// rolePanelObj.lengmin.setValue(obj.lengmin);
		// }
		// if (obj.lengmax) {
		// rolePanelObj.lengmax.setValue(obj.lengmax);
		// }
		// if (obj.haschar) {
		// rolePanelObj.haschar.setValue(obj.haschar);
		// }
		// if (obj.nochar) {
		// rolePanelObj.nochar.setValue(obj.nochar);
		// }
		// if (obj.upperfalg == 2) {
		// rolePanelObj.upperRadio.setValue(true)
		// }
		// if (obj.lowerflag == 2) {
		// rolePanelObj.lowerRadio.setValue(true)
		// }
		// if (obj.charfalg == 2) {
		// rolePanelObj.charRadio.setValue(true)
		// }
		// if (obj.numberfalg == 2) {
		// rolePanelObj.numberRadio.setValue(true)
		// }
		// }
		// }
		// });
		// Ext.log('This is a ExtJs debugger');

	})