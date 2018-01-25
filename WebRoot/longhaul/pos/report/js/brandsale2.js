

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
				x : 310,
				y : 13,
				width : 260,
				hidden : true,
				// height : 100,
				items : [new Ext.form.Label({
					columnWidth : .4,
					border : false,
					html : '<b><span style="color:red">*</span>选择月份:</b>'
				}), new Ext.form.DateField({
					columnWidth : .6,
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
				x : 310,
				y : 13,
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
				y : 38,
				border : false,
				html : '<b><span style="color:red">*</span>品牌类型:</b>'
			});

			this.addButton = new Ext.Button({
				text : '增 加',
				iconCls : 'addIcon',
				x : 140,
				y : 38,
				handler : this._onAdd,
				scope : this
			});

			this.btnSearch = new Ext.Button({
				text : '确定',
				iconCls : 'acceptIcon',
				x : 500,
				y : 340,
				handler : this._onSearch,
				scope : this
			});

			this.items = [label2, this.datetype, this.datetype2, label4,
					this.addButton, this.datepanel, this.datepanel2,
					this.btnSearch];
			basePanel.superclass.initComponent.call(this);
		},
		_onAdd : function() {
			ycor += 28;
			var _textfield = new Ext.form.TextField({
				x : 140,
				y : ycor,
				allowBlank : false,
				id : 'newbrand_' + newcount,
				// value : obj[i].brandname,
				emptyText : '请输入品牌名称',
				disable : true,
				width : 100
			});
			rolePanelObj.add(_textfield);
			var _textfield2 = new Ext.form.TextField({
				x : 280,
				y : ycor,
				id : 'newsale_' + newcount++,
				allowBlank : false,
				emptyText : '请输入销售金额',
				width : 100
			});
			var count = newcount - 1;
			var removeButton = new Ext.Button({
				text : '删除',
				iconCls : 'deleteIcon',
				x : 400,
				y : ycor,
				handler : function() {
					rolePanelObj.remove(_textfield);
					rolePanelObj.remove(_textfield2);
					rolePanelObj.remove(removeButton);
					ycor -= 28;
					delnewid.push(count);
					rolePanelObj.doLayout();
				},
				scope : this
			});
			rolePanelObj.add(_textfield2);
			rolePanelObj.add(removeButton);
			rolePanelObj.doLayout();
		},

		_onSearch : function() {
			if (!this._validate())
				return;
			var oldbrandsales = '', newbrandsales = '';
			for (var i = 0; i < oldcount; i++) {
				oldbrandsales += Ext.getCmp('oldbrand_' + i).tableid + ','
						+ Ext.getCmp('oldbrand_' + i).getValue() + ','
						+ Ext.getCmp('oldsale_' + i).getValue();
				if (i < oldcount - 1)
					oldbrandsales += '@';
			}

			tttt : for (var j = 0; j < newcount; j++) {
				for (var k = 0; k < delnewid.length; k++) {
					if (j == delnewid[k])
						continue tttt;
				}
				newbrandsales += Ext.getCmp('newbrand_' + j).getValue() + ','
						+ Ext.getCmp('newsale_' + j).getValue();
				if (j < newcount - 1)
					newbrandsales += '@';
			}
			var datatype = '', year = '', mouth = '', week = '', extend = '';
			if (datetypeflag == 1) {
				week = weektypebox.getValue();
				datatype = 'w';
				year = Ext.getCmp('weekid').getValue().format('Y');
				mouth = Ext.getCmp('weekid').getValue().format('m');// (Ext.getCmp('weekid').getValue().format('Y-m')).split('-')[1];

			}
			if (datetypeflag == 2) {
				datatype = 'm';
				year = Ext.getCmp('mouthid').getValue().format('Y');
				mouth = Ext.getCmp('mouthid').getValue().format('m');
			}
			mouth = parseInt(mouth, 10);
			Ext.Ajax.request({
				url : './brand.ered?reqCode=saveBrandSale2',
				success : function(response) {

					var resultArray = Ext.util.JSON
							.decode(response.responseText);
					Ext.Msg.alert('提示', resultArray.msg, function() {
						location.reload();
					});

				},
				failure : function(response) {
					var resultArray = Ext.util.JSON
							.decode(response.responseText);
					Ext.Msg.alert('提示', resultArray.msg);
				},
				params : {
					datetype : datatype,
					year : year,
					mouth : mouth,
					week : week,
					extend : extend,
					newbrandsales : newbrandsales,
					oldbrandsales : oldbrandsales
				}
			});
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
			for (var i = 0; i < oldcount; i++) { // Ext.getCmp('oldbrand_' +
				// i).tableid;
				if (!Ext.getCmp('oldsale_' + i).getValue()
						|| !Ext.getCmp('oldbrand_' + i).getValue()) {
					Ext.MessageBox.alert('提示', '请填写必填项目');
					return false;
				}

			}
			dddd : for (var j = 0; j < newcount; j++) {
				for (var k = 0; k < delnewid.length; k++) {
					if (j == delnewid[k])
						continue dddd;
				}
				if (!Ext.getCmp('newsale_' + j).getValue()
						|| !Ext.getCmp('newbrand_' + j).getValue()) {
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
	var ycor = 42, oldcount = 0, newcount = 0, delnewid = [];
	Ext.Ajax.request({
		url : './brand.ered?reqCode=brandList',
		success : function(response) {
			var resultArray = Ext.util.JSON.decode(response.responseText);
			var obj = resultArray.ROOT;
			for (var i = 0; i < obj.length; i++) {
				ycor += 28;
				if (obj[i]) {
					var _textfield = new Ext.form.TextField({
						x : 140,
						y : ycor,
						id : 'oldbrand_' + oldcount,
						tableid : obj[i].id,
						allowBlank : false,
						value : obj[i].brandname,
						disable : true,
						width : 100
					});
					rolePanelObj.add(_textfield);
					var _textfield2 = new Ext.form.TextField({
						x : 280,
						y : ycor,
						id : 'oldsale_' + oldcount++,
						allowBlank : false,
						emptyText : '请输入销售金额',
						width : 100
					});
					rolePanelObj.add(_textfield2);

				}
			}
			rolePanelObj.doLayout();
		}
	});

})