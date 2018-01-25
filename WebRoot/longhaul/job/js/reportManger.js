var reportManger = {
	record :{},
	rfcname:'',
	syncname:''
}

/**
 * RFC数据管理
 * 
 * @author XiongChun
 * @since 2010-02-13
 */
Ext
		.onReady(function() {		
			var desctableRender = function(field, metadata, record, rowIndex, colIndex, store){
				var items = store4.data.items;
				for(var i=0;i<items.length;i++){
					if(field == items[i].data.para_name){
						return '<b>SAP表中有相同的字段</b>';
					}
				}
			}		
				/**
				 * 删除
				 */
				var deljobmanger = function() {
					var rows = syncGrid.getSelectionModel().getSelections();
					if (Ext.isEmpty(rows)) {
						Ext.Msg.alert('提示', '请先选中要删除的项目!');
						return;
					}
					var strChecked = jsArray2JsString(rows, 'trigger_name');
					var strChecked2 = jsArray2JsString(rows, 'trigger_group');
					Ext.Msg.confirm('请确认', '你真的要删除吗?', function(btn, text) {
								if (btn == 'yes') {
									Ext.Ajax.request({
												url : './jobMange.ered?reqCode=jobMangerDel',
												success : function(response) {
													syncStore.reload();
													store.reload();
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
													strChecked : strChecked,
													strChecked2:strChecked2
												}
											});
								}
							});
				}		
				 /**
				  * 恢复
				  */
				var restorejobmanger = function() {
					var rows = syncGrid.getSelectionModel().getSelections();
					if (Ext.isEmpty(rows)) {
						Ext.Msg.alert('提示', '请先选中项目!');
						return;
					}
					var strChecked = jsArray2JsString(rows, 'trigger_name');
					var strChecked2 = jsArray2JsString(rows, 'trigger_group');
					Ext.Msg.confirm('请确认', '你真的要恢复吗?', function(btn, text) {
								if (btn == 'yes') {
									Ext.Ajax.request({
												url : './jobMange.ered?reqCode=jobMangerRestore',
												success : function(response) {
													syncStore.reload();
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
													strChecked : strChecked,
													strChecked2:strChecked2
												}
											});
								}
							});
				}		
			 /**
			  * 修改
			  */
			  var editjobmanger = function(){
				    var record = syncGrid.getSelectionModel().getSelected();
					if (Ext.isEmpty(record)) {
						Ext.Msg.alert('提示', '请先选中要修改的项目');
						return;
					}
					syncPanel.getForm().loadRecord(record);
					syncModifyWindow.show();
					//alert(formPanel.getForm().findField("H0"));
					//alert(Ext.getCmp("HH2"));
					//Ext.getCmp("HH2").focus();
					//extjs defer
			   }
				/**
				 * 暂停
				 */
				var  stopjobmanger = function() {
					var rows = syncGrid.getSelectionModel().getSelections();
					if (Ext.isEmpty(rows)) {
						Ext.Msg.alert('提示', '请先选中项目!');
						return;
					}
					var strChecked = jsArray2JsString(rows, 'trigger_name');
					var strChecked2 = jsArray2JsString(rows, 'trigger_group');
					Ext.Msg.confirm('请确认', '你真的要暂停吗?', function(btn, text) {
								if (btn == 'yes') {
									Ext.Ajax.request({
												url : './jobMange.ered?reqCode=jobMangerStop',
												success : function(response) {
													syncStore.reload();
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
													strChecked : strChecked,
													strChecked2:strChecked2
												}
											});
								}
							});
				}			   
//===	同步信息列表 

			//修改form
			var syncPanel;
			syncPanel = new Ext.form.FormPanel({
				id : 'syncModifyForm',
				name : 'syncModifyForm',
				width : 800,
				Height : 800,
				frame : true,
				layout : "auto", 
				delay: 3000,  
				labelAlign : "right",
				//html: "1234"
				items : [
					 {
	                    xtype: 'label',
	                    text: '名称'
	                },
	                {
	                    xtype: 'textfield',
	                    width: 350,
	                    name: 'trigger_name',
	                    readOnly: true
	                },{
	                    xtype: 'textfield',
	                    width: 100,
	                    name: 'trigger_group'
	                },{
				    xtype: 'tabpanel',
					deferredRender:false ,
				    layoutOnTabChange : true,
				    id: 'Mytable',
				    height: 300,
				    width: 600,
				    activeTab: 0,
				    items: [
				        {
				            xtype: 'panel',
				            id: 'Minute',
				            height: 300,
				            layout: 'absolute',
				            title: '分钟',
				            items: [
				                {
				                    xtype: 'radio',
				                    id: 'Cyle',
				                    name: 'Cyle',
				                    boxLabel: '循环',
				                    checked: true,
				                    x: 10,
				                    y: 0,
				                	handler:function(){
				                    	if(Ext.getCmp("Cyle").checked)
				                    	  {
				                    		Ext.getCmp('XX1').setDisabled(true);
				                    		Ext.getCmp('From').setDisabled(false);
				                    		Ext.getCmp('every').setDisabled(false);
				                    		Ext.getCmp('assign').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'displayfield',
				                    width: 100,
				                    value: '从',
				                    x: 60,
				                    y: 3
				                },
				                {
				                    xtype: 'numberfield',
				                    id: 'From',
				                    width: 40,
				                    name: 'From',
				                    maxValue : 59,
				                    maxText : '最大值59',
				                    minValue :0,
				                    minText: '最小值0',
				                    allowNegative:false,
				                    allowDecimals:false,
				                    value: 0,
				                    x: 80,
				                    y: 0
				                },
				                {
				                    xtype: 'label',
				                    height: 20,
				                    text: '分钟开始',
				                    x: 130,
				                    y: 3
				                },
				                {
				                    xtype: 'displayfield',
				                    height: 20,
				                    width: 80,
				                    value: '每',
				                    x: 200,
				                    y: 3
				                },
				                {
				                    xtype: 'numberfield',
				                    id: 'every',
				                    width: 60,
				                    name: 'every',
				                    maxValue : 59,
				                    maxText : '最大值59',
				                    minValue :0,
				                    minText: '最小值0',
				                    allowNegative:false,
				                    allowDecimals:false,
				                    value: 5,
				                    x: 230,
				                    y: 0
				                },
				                {
				                    xtype: 'label',
				                    text: '分钟执行一次',
				                    x: 300,
				                    y: 3
				                },
				                {
				                    xtype: 'radio',
				                    id: 'assign',
				                    name: 'assign',
				                    boxLabel: '定义',
				                    x: 10,
				                    y: 30,
				                	handler:function(){
				                    	if(Ext.getCmp("assign").checked)
				                    	  {
				                    		Ext.getCmp('XX1').setDisabled(false);
				                    		Ext.getCmp('From').setDisabled(true);
				                    		Ext.getCmp('every').setDisabled(true);
				                    		Ext.getCmp('Cyle').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'fieldset',
				                    disabled: true,
				                    id: 'XX1',
				                    height: 200,
				                    width: 490,
				                    layout: 'column',
				                    title: '选择',
				                    x: 10,
				                    y: 60,
				                    items: [
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'MX1',
				                            width: 460,
				                            name: 'MX1',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M0',
				                                    itemId: '',
				                                    name: 'M0',
				                                    boxLabel: '0'
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M1',
				                                    name: 'M1',
				                                    boxLabel: 1
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M2',
				                                    name: 'M2',
				                                    boxLabel: 2
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M3',
				                                    name: 'M3',
				                                    boxLabel: 3
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M4',
				                                    name: 'M4',
				                                    boxLabel: 4
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M5',
				                                    name: 'M5',
				                                    boxLabel: 5
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M6',
				                                    name: 'M6',
				                                    boxLabel: 6
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M7',
				                                    name: 'M7',
				                                    boxLabel: 7
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M8',
				                                    name: 'M8',
				                                    boxLabel: 8
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M9',
				                                    name: 'M9',
				                                    boxLabel: 9
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'MX2',
				                            width: 460,
				                            name: 'MX2',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M10',
				                                    name: 'M10',
				                                    boxLabel: 10
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M11',
				                                    name: 'M11',
				                                    boxLabel: 11
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M12',
				                                    name: 'M12',
				                                    boxLabel: 12
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M13',
				                                    name: 'M13',
				                                    boxLabel: 13
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M14',
				                                    name: 'M14',
				                                    boxLabel: 14
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M15',
				                                    name: 'M15',
				                                    boxLabel: 15
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M16',
				                                    name: 'M16',
				                                    boxLabel: 16
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M17',
				                                    name: 'M17',
				                                    boxLabel: 17
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M18',
				                                    name: 'M18',
				                                    boxLabel: 18
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M19',
				                                    name: 'M19',
				                                    boxLabel: 19
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'MX3',
				                            width: 460,
				                            name: 'MX3',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M20',
				                                    name: 'M20',
				                                    boxLabel: 20
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M21',
				                                    name: 'M21',
				                                    boxLabel: 21
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M22',
				                                    name: 'M22',
				                                    boxLabel: 22
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M23',
				                                    name: 'M23',
				                                    boxLabel: 23
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M24',
				                                    name: 'M24',
				                                    boxLabel: 24
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M25',
				                                    name: 'M25',
				                                    boxLabel: 25
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M26',
				                                    name: 'M26',
				                                    boxLabel: 26
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M27',
				                                    name: 'M27',
				                                    boxLabel: 27
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M28',
				                                    name: 'M28',
				                                    boxLabel: 28
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M29',
				                                    name: 'M29',
				                                    boxLabel: 29
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'MX4',
				                            width: 460,
				                            name: 'MX4',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M30',
				                                    name: 'M30',
				                                    boxLabel: 30
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M31',
				                                    name: 'M31',
				                                    boxLabel: 31
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M32',
				                                    name: 'M32',
				                                    boxLabel: 32
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M33',
				                                    name: 'M33',
				                                    boxLabel: 33
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M34',
				                                    name: 'M34',
				                                    boxLabel: 34
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M35',
				                                    name: 'M35',
				                                    boxLabel: 35
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 36,
				                                    name: 36,
				                                    boxLabel: 36
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M37',
				                                    name: 'M37',
				                                    boxLabel: 37
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M38',
				                                    name: 'M38',
				                                    boxLabel: 38
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M39',
				                                    name: 'M39',
				                                    boxLabel: 39
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'MX5',
				                            width: 460,
				                            name: 'MX5',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M40',
				                                    name: 'M40',
				                                    boxLabel: 40
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M41',
				                                    name: 'M41',
				                                    boxLabel: 41
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M42',
				                                    name: 'M42',
				                                    boxLabel: 42
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M43',
				                                    name: 'M43',
				                                    boxLabel: 43
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M44',
				                                    name: 'M44',
				                                    boxLabel: 44
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M45',
				                                    name: 'M45',
				                                    boxLabel: 45
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M46',
				                                    name: 'M46',
				                                    boxLabel: 46
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M47',
				                                    name: 'M47',
				                                    boxLabel: 47
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M48',
				                                    name: 'M48',
				                                    boxLabel: 48
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M49',
				                                    name: 'M49',
				                                    boxLabel: 49
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'MX6',
				                            width: 460,
				                            name: 'MX6',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M50',
				                                    name: 'M50',
				                                    boxLabel: 50
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M51',
				                                    name: 'M51',
				                                    boxLabel: 51
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M52',
				                                    name: 'M52',
				                                    boxLabel: 52
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M53',
				                                    name: 'M53',
				                                    boxLabel: 53
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M54',
				                                    name: 'M54',
				                                    boxLabel: 54
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M55',
				                                    name: 'M55',
				                                    boxLabel: 55
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M56',
				                                    name: 'M56',
				                                    boxLabel: 56
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M57',
				                                    name: 'M57',
				                                    boxLabel: 57
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M58',
				                                    name: 'M58',
				                                    boxLabel: 58
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'M59',
				                                    name: 'M59',
				                                    boxLabel: 59
				                                }
				                            ]
				                        }
				                    ]
				                }
				            ]
				        },
				        {
				            xtype: 'panel',
				            id: 'hour',
				            layout: 'absolute',
				            title: '小时',
				            items: [
				                {
				                    xtype: 'radio',
				                    id: 'PHour',
				                    name: 'PHour',
				                    value: '每小时 ',
				                    boxLabel: '每小时 ',
				                    checked: true,
				                    x: 10,
				                    y: -3,
				                    handler:function(){
				                    	if(Ext.getCmp("PHour").checked)
				                    	  {
				                    		Ext.getCmp('XX2').setDisabled(true);
				                    		Ext.getCmp('CHour').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'radio',
				                    id: 'CHour',
				                    name: 'CHour',
				                    boxLabel: '定义',
				                    x: 10,
				                    y: 20,
				                    handler:function(){
				                    	if(Ext.getCmp("CHour").checked)
				                    	  {
				                    		Ext.getCmp('XX2').setDisabled(false);
				                    		Ext.getCmp('PHour').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'fieldset',
				                    checkboxToggle:false,//关键参数，其他和以前的一样
				                    //hideMode: 'visibility',
				                    //hideParent: true,
				                    //disabled: true,
				                    //collapsed: false,
				                    id: 'XX2',
				                    height: 200,
				                    width: 490,
				                    layout: 'column',
				                    title: '选择',
				                    x: 10,
				                    y: 60,
				                    items: [
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'HH1',
				                            width: 460,
				                            name: 'HH1',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H0',
				                                    name: 'H0',
				                                    boxLabel: '0'
				                                    //checked: true
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H1',
				                                    name: 'H1',
				                                    boxLabel: 1
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H2',
				                                    name: 'H2',
				                                    boxLabel: 2
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H3',
				                                    name: 'H3',
				                                    boxLabel: 3
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H4',
				                                    name: 'H4',
				                                    boxLabel: 4
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H5',
				                                    name: 'H5',
				                                    boxLabel: 5
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H6',
				                                    name: 'H6',
				                                    boxLabel: 6
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H7',
				                                    name: 'H7',
				                                    boxLabel: 7
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H8',
				                                    name: 'H8',
				                                    boxLabel: 8
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H9',
				                                    name: 'H9',
				                                    boxLabel: 9
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H10',
				                                    name: 'H10',
				                                    boxLabel: 10
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H11',
				                                    name: 'H11',
				                                    boxLabel: 11
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'HH2',
				                            width: 460,
				                            name: 'HH2',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H12',
				                                    name: 'H12',
				                                    boxLabel: 12
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H13',
				                                    name: 'H13',
				                                    boxLabel: 13
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H14',
				                                    name: 'H14',
				                                    boxLabel: 14
				                                    //isFormField : true
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H15',
				                                    name: 'H15',
				                                    boxLabel: 15
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H16',
				                                    name: 'H16',
				                                    boxLabel: 16
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H17',
				                                    name: 'H17',
				                                    boxLabel: 17
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H18',
				                                    name: 'H18',
				                                    boxLabel: 18
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H19',
				                                    name: 'H19',
				                                    boxLabel: 19
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H20',
				                                    name: 'H20',
				                                    boxLabel: 20
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H21',
				                                    name: 'H21',
				                                    boxLabel: 21
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H22',
				                                    name: 'H22',
				                                    boxLabel: 22
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'H23',
				                                    name: 'H23',
				                                    boxLabel: 23
				                                }
				                            ]
				                        }
				                    ]
				                }
				            ]
				        },
				        {
				            xtype: 'panel',
				            id: 'day',
				            layout: 'absolute',
				            title: '天',
				            items: [
				                {
				                    xtype: 'radio',
				                    id: 'perday',
				                    name: 'perday',
				                    boxLabel: '每天',
				                    checked: true,
				                    x: 10,
				                    y: 0,
				                    handler:function(){
				                    	if(Ext.getCmp("perday").checked)
				                    	  {
				                    		Ext.getCmp('XX3').setDisabled(true);
				                    		Ext.getCmp('standday').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'radio',
				                    id: 'standday',
				                    name: 'standday',
				                    boxLabel: '定义',
				                    x: 10,
				                    y: 30,
				                    handler:function(){
				                    	if(Ext.getCmp("standday").checked)
				                    	  {
				                    		Ext.getCmp('XX3').setDisabled(false);
				                    		Ext.getCmp('perday').setValue(false);
				                    		Ext.getCmp('Useweek').setValue("");
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'fieldset',
				                    disabled: true,
				                    id: 'XX3',
				                    height: 200,
				                    width: 490,
				                    layout: 'column',
				                    title: '选择',
				                    x: 10,
				                    y: 60,
				                    items: [
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'DD1',
				                            width: 460,
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D1',
				                                    name: 'D1',
				                                    boxLabel: 1
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D2',
				                                    name: 'D2',
				                                    boxLabel: 2
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D3',
				                                    name: 'D3',
				                                    boxLabel: 3
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D4',
				                                    name: 'D4',
				                                    boxLabel: 4
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D5',
				                                    name: 'D5',
				                                    boxLabel: 5
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D6',
				                                    name: 'D6',
				                                    boxLabel: 6
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D7',
				                                    name: 'D7',
				                                    boxLabel: 7
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D8',
				                                    name: 'D8',
				                                    boxLabel: 8
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D9',
				                                    name: 'D9',
				                                    boxLabel: 9
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D10',
				                                    name: 'D10',
				                                    boxLabel: 10
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'DD2',
				                            width: 460,
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D11',
				                                    name: 'D11',
				                                    boxLabel: 11
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D12',
				                                    name: 'D12',
				                                    boxLabel: 12
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D13',
				                                    name: 'D13',
				                                    boxLabel: 13
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D14',
				                                    name: 'D14',
				                                    boxLabel: 14
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D15',
				                                    name: 'D15',
				                                    boxLabel: 15
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D16',
				                                    name: 'D16',
				                                    boxLabel: 16
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D17',
				                                    name: 'D17',
				                                    boxLabel: 17
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D18',
				                                    name: 'D18',
				                                    boxLabel: 18
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D19',
				                                    name: 'D19',
				                                    boxLabel: 19
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D20',
				                                    name: 'D20',
				                                    boxLabel: 20
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'DD3',
				                            width: 460,
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D21',
				                                    name: 'D21',
				                                    boxLabel: 21
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D22',
				                                    name: 'D22',
				                                    boxLabel: 22
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D23',
				                                    name: 'D23',
				                                    boxLabel: 23
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D24',
				                                    name: 'D24',
				                                    boxLabel: 24
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D25',
				                                    name: 'D25',
				                                    boxLabel: 25
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D26',
				                                    name: 'D26',
				                                    boxLabel: 26
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D27',
				                                    name: 'D27',
				                                    boxLabel: 27
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D28',
				                                    name: 'D28',
				                                    boxLabel: 28
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D29',
				                                    name: 'D29',
				                                    boxLabel: 29
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D30',
				                                    name: 'D30',
				                                    boxLabel: 30
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'DD4',
				                            width: 460,
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'D31',
				                                    name: 'D31',
				                                    boxLabel: 31
				                                }
				                            ]
				                        }
				                    ]
				                }
				            ]
				        },
				        {
				            xtype: 'panel',
				            id: 'month',
				            layout: 'absolute',
				            title: '月',
				            items: [
				                {
				                    xtype: 'radio',
				                    id: 'perMoth',
				                    name: 'perMoth',
				                    boxLabel: '每月',
				                    checked: true,
				                    x: 10,
				                    y: 0,
				                    handler:function(){
				                    	if(Ext.getCmp("perMoth").checked)
				                    	  {
				                    		Ext.getCmp('XX4').setDisabled(true);
				                    		Ext.getCmp('Standmonth').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'radio',
				                    id: 'Standmonth',
				                    name: 'Standmonth',
				                    boxLabel: '定义',
				                    x: 10,
				                    y: 30,
				                    handler:function(){
				                    	if(Ext.getCmp("Standmonth").checked)
				                    	  {
				                    		Ext.getCmp('XX4').setDisabled(false);
				                    		Ext.getCmp('perMoth').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'fieldset',
				                    disabled: true,
				                    id: 'XX4',
				                    height: 200,
				                    width: 490,
				                    layout: 'column',
				                    title: '选择',
				                    x: 10,
				                    y: 60,
				                    items: [
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'MonthM1',
				                            width: 460,
				                            name: 'MonthM1',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'MM1',
				                                    name: 'MM1',
				                                    boxLabel: 1
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'MM2',
				                                    name: 'MM2',
				                                    boxLabel: 2
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'MM3',
				                                    name: 'MM3',
				                                    boxLabel: 3
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'MM4',
				                                    name: 'MM4',
				                                    boxLabel: 4
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'MM5',
				                                    name: 'MM5',
				                                    boxLabel: 5
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'MM6',
				                                    name: 'MM6',
				                                    boxLabel: 6
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            id: 'MonthM2',
				                            width: 460,
				                            name: 'MonthM2',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'MM7',
				                                    name: 'MM7',
				                                    boxLabel: 7
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'MM8',
				                                    name: 'MM8',
				                                    boxLabel: 8
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'MM9',
				                                    name: 'MM9',
				                                    boxLabel: 9
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'MM10',
				                                    name: 'MM10',
				                                    boxLabel: 10
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'MM11',
				                                    name: 'MM11',
				                                    boxLabel: 11
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    id: 'MM12',
				                                    name: 'MM12',
				                                    boxLabel: 12
				                                }
				                            ]
				                        }
				                    ]
				                }
				            ]
				        },
				        {
				            xtype: 'panel',
				            id: 'week',
				            layout: 'absolute',
				            title: '周',
				            items: [
				                {
				                    xtype: 'fieldset',
				                    disabled: true,
				                    id: 'XX5',
				                    height: 200,
				                    width: 490,
				                    layout: 'vbox',
				                    title: '选择',
				                    x: 10,
				                    y: 40,
				                    items: [
				                        {
				                            xtype: 'fieldset',
				                            id: 'XXW1',
				                            width: 460,
				                            layout: 'vbox',
				                            title: '周选择',
				                            flex: 1,
				                            items: [
				                                {
				                                    xtype: 'radio',
				                                    checked: true,
				                                    id: 'perWeek',
				                                    height: 20,
				                                    name: 'perWeek',
				                                    boxLabel: '每周',
				                                    flex: 1,
				                                    handler:function(){
								                    	if(Ext.getCmp("perWeek").checked)
								                    	  {
								                    		Ext.getCmp('weekxx1').setDisabled(true);
								                    		Ext.getCmp('Standweek').setValue(false);
								                    	  }
								                    }
				                                },
				                                {
				                                    xtype: 'radio',
				                                    id: 'Standweek',
				                                    height: 20,
				                                    name: 'Standweek',
				                                    boxLabel: '定义',
				                                    flex: 1,
				                                    handler:function(){
								                    	if(Ext.getCmp("Standweek").checked)
								                    	  {
								                    		Ext.getCmp('weekxx1').setDisabled(false);
								                    		Ext.getCmp('perWeek').setValue(false);
								                    	  }
								                    }
				                                },
				                                {
				                                    xtype: 'checkboxgroup',
				                                    disabled: true,
				                                    id: 'weekxx1',
				                                    name: 'weekxx1',
				                                    flex: 1,
				                                    items: [
				                                        {
				                                            xtype: 'checkbox',
				                                            id: 'week1',
				                                            name: 'week1',
				                                            boxLabel: '星期天'
				                                        },
				                                        {
				                                            xtype: 'checkbox',
				                                            id: 'week2',
				                                            name: 'week2',
				                                            boxLabel: '星期一'
				                                        },
				                                        {
				                                            xtype: 'checkbox',
				                                            id: 'week3',
				                                            name: 'week3',
				                                            boxLabel: '星期二'
				                                        },
				                                        {
				                                            xtype: 'checkbox',
				                                            id: 'week4',
				                                            name: 'week4',
				                                            boxLabel: '星期三'
				                                        },
				                                        {
				                                            xtype: 'checkbox',
				                                            id: 'week5',
				                                            name: 'week5',
				                                            boxLabel: '星期四'
				                                        },
				                                        {
				                                            xtype: 'checkbox',
				                                            id: 'week6',
				                                            name: 'week6',
				                                            boxLabel: '星期五'
				                                        },
				                                        {
				                                            xtype: 'checkbox',
				                                            id: 'week7',
				                                            width: 460,
				                                            name: 'week7',
				                                            boxLabel: '星期六'
				                                        }
				                                    ]
				                                }
				                            ]
				                        }
				                    ]
				                },
				                {
				                    xtype: 'checkbox',
				                    id: 'Useweek',
				                    name: 'Useweek',
				                    boxLabel: '使用周',
				                    x: 10,
				                    y: 10,
				                    handler:function(){
				                    	if(Ext.getCmp("Useweek").checked)
				                    	  {
				                    		Ext.getCmp('XX5').setDisabled(false);
				                    		Ext.getCmp('XX3').setDisabled(true);
				                    		Ext.getCmp('perday').setValue(true);
				                    	  }else{
				                    		 Ext.getCmp('XX5').setDisabled(true);
				                    	  }
				                    }
				                }
				            ]
				        },{
				            xtype: 'panel',
				            id: 'yearpanel',
				            layout: 'absolute',
				            title: '年',
				            items: [
				                {
				                    xtype: 'radio',
				                    id: 'year',
				                    name: 'year',
				                    boxLabel: '年',
				                    x: 10,
				                    y: 0,
				                    handler:function(){
				                    	if(Ext.getCmp("year").checked)
				                    	  {
				                    		Ext.getCmp('yearfrom').setDisabled(false);
				                    		Ext.getCmp('yearto').setDisabled(false);
				                    		Ext.getCmp('standeryear').setValue(false);
				                    		Ext.getCmp('XX6').setDisabled(true);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'displayfield',
				                    width: 59,
				                    value: '从',
				                    x: 50,
				                    y: 0
				                },
				                {
				                    xtype: 'datefield',
				                    name: 'yearfrom',
				                    id: 'yearfrom',
				                    disabled: true,
				                    format:'Y-m-d H:i',
				                    //value:new Date(),
				                    width: 140,
				                    x: 80,
				                    y: 0
				                },
				                {
				                    xtype: 'displayfield',
				                    value: '到',
				                    x: 240,
				                    y: 0
				                },
				                {
				                    xtype: 'datefield',
				                    name: 'yearto',
				                    id: 'yearto',
				                    width: 140,
				                    disabled: true,
				                    format:'Y-m-d H:i',
				                    x: 270,
				                    y: 0
				                },
				                {
				                    xtype: 'radio',
				                    id : 'standeryear',
				                    name: 'standeryear',
				                    boxLabel: '特定年',
				                    x: 10,
				                    y: 30,
				                    handler:function(){
				                    	if(Ext.getCmp("standeryear").checked)
				                    	  {
				                    		Ext.getCmp('yearfrom').setDisabled(true);
				                    		Ext.getCmp('yearto').setDisabled(true);
				                    		Ext.getCmp('XX6').setDisabled(false);
				                    		Ext.getCmp('year').setValue(false);
				                    		//Ext.getCmp('Y1').setValue(true);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'fieldset',
				                    disabled: true,
				                    id: 'XX6',
				                    height: 169,
				                    width: 460,
				                    layout: 'column',
				                    title: '选择',
				                    x: 10,
				                    y: 70,
				                    items: [
					                        {
					                            xtype: 'checkboxgroup',
					                            id: 'yearxx1',
					                            name: 'yearxx1',
					                            flex: 1,
					                            width :460,
					                            items: [
					                                {
					                                	xtype: 'checkbox',
					                                    name: 'Y1',
					                                    id: 'Y1',
					                                    boxLabel: 2012
					                                },
					                                {
					                                    xtype: 'checkbox',
					                                    name: 'Y2',
					                                    id: 'Y2',
					                                    boxLabel: 2013
					                                },
					                                {
					                                    xtype: 'checkbox',
					                                    name: 'Y3',
					                                    id: 'Y3',
					                                    boxLabel: 2014
					                                },
					                                {
					                                    xtype: 'checkbox',
					                                    name: 'Y4',
					                                    id: 'Y4',
					                                    boxLabel: 2015
					                                },
					                                {
					                                    xtype: 'checkbox',
					                                    name: 'Y5',
					                                    id: 'Y5',
					                                    boxLabel: 1016
					                                }
					                            ]
					                        },
					                        {
					                            xtype: 'checkboxgroup',
					                            id: 'yearxx2',
					                            name: 'yearxx1',
					                            flex: 1,
					                            width :460,
					                            items: [
					                                {
					                                    xtype: 'checkbox',
					                                    boxLabel: 2017,
					                                    name: 'Y6'
					                                },
					                                {
					                                    xtype: 'checkbox',
					                                    boxLabel: 2018,
					                                    name: 'Y7'
					                                },
					                                {
					                                    xtype: 'checkbox',
					                                    boxLabel: 2019,
					                                    name: 'Y8'
					                                },
					                                {
					                                    xtype: 'checkbox',
					                                    boxLabel: 2020,
					                                    name: 'Y9',
					                                    id :'Y9'
					                                },
					                                {
					                                    xtype: 'checkbox',
					                                    boxLabel: 2021,
					                                    name: 'Y10'
					                                }
					                            ]
					                        }
					                    ]
				                }
				            ]
				        }
				    ]
				}]
			});
			
			var syncSm = new Ext.grid.CheckboxSelectionModel();

			// 定义自动当前页行号
			var syncRownum = new Ext.grid.RowNumberer({
						header : 'NO',
						width : 28
					});
			var syncRender = function(state){
				return '<b>'+state+'</b>'
			}
		// 定义列模型
			var syncCm = new Ext.grid.ColumnModel([syncRownum, syncSm, {
						header : '事件名称', // 列标题
						dataIndex : 'trigger_name', // 数据索引:和Store模型对应
						sortable : true
						// 是否可排序
				   },{
					    header : '事件组', // 列标题
						dataIndex : 'trigger_group', // 数据索引:和Store模型对应
						sortable : true
				   } ,{
					    header : '下次执行时间 ', // 列标题
						dataIndex : 'next_fire_time', // 数据索引:和Store模型对应
						sortable : true,
						width: 150
				   },{
					    header : '上次执行时间  ', // 列标题
						dataIndex : 'prev_fire_time', // 数据索引:和Store模型对应
						sortable : true,
						width: 150
				   },{
					    header : '优先级  ', // 列标题
						dataIndex : 'priority', // 数据索引:和Store模型对应
						sortable : true,
						width: 50
				   } ,{
					    header : '状态  ', // 列标题
						dataIndex : 'trigger_state', // 数据索引:和Store模型对应
						renderer: syncRender,
						sortable : true
				   },{
					    header : '类型  ', // 列标题
						dataIndex : 'trigger_type', // 数据索引:和Store模型对应
						sortable : true
				   },{
					    header : '开始时间   ', // 列标题
						dataIndex : 'start_time', // 数据索引:和Store模型对应
						sortable : true,
						width: 150
				   },{
					    header : '结束时间  ', // 列标题
						dataIndex : 'end_time', // 数据索引:和Store模型对应
						sortable : true
				   }
			       ]);
			
			/**
			 * 数据存储
			 */
			var syncStore = new Ext.data.Store({
						// 获取数据的方式
						proxy : new Ext.data.HttpProxy({
									url : './jobMange.ered?reqCode=jobMangerList'
								}),
						// 数据读取器
						reader : new Ext.data.JsonReader({
									totalProperty : 'TOTALCOUNT', // 记录总数
									root : 'ROOT' // Json中的列表数据根节点
								}, [{
											name : 'trigger_name' // Json中的属性Key值
									},{
										    name : 'trigger_group'
									},{
										    name : 'next_fire_time'
									},{
										    name : 'prev_fire_time'
									},{
										    name : 'priority'
									},{
										    name : 'trigger_state'
									},{
										    name : 'trigger_type'
									},{
										    name : 'start_time'
									},{
										    name : 'end_time'
									},{
										    name : 'cron_expression'
									}
									,{name:'Y1'},{name:'Y2'},{name:'Y3'},{name:'Y4'},{name:'Y5'},{name:'Y6'},{name:'Y7'},{name:'Y8'},{name:'Y9'},{name:'Y10'}
									,{ name:'every'},{name:'From'},{name:'assign'},{name:'Cyle'},{name:'CHour'},{name:'PHour'}
									,{name:'perday'},{name:'standday'},{name:'perMoth'},{name:'Standmonth'}
									,{name:'Standweek'},{name:'Useweek'},{name:'perWeek'},{name:'year'},{name:'yearfrom'},{name:'yearto'},{name:'standeryear'}
									,{name:'M0'},{name:'M1'},{name:'M2'},{name:'M3'},{name:'M4'},{name:'M5'},{name:'M6'},{name:'M7'},{name:'M8'},{name:'M9'},{name:'M10'},{name:'M11'},{name:'M12'},{name:'M13'},{name:'M14'},{name:'M15'},{name:'M16'},{name:'M17'},{name:'M18'},{name:'M19'},{name:'M20'},{name:'M21'},{name:'M22'},{name:'M23'},{name:'M24'},{name:'M25'},{name:'M26'},{name:'M27'},{name:'M28'},{name:'M29'},{name:'M30'},{name:'M31'},{name:'M32'},{name:'M33'},{name:'M34'},{name:'M35'},{name:'M36'},{name:'M37'},{name:'M38'},{name:'M39'},{name:'M40'},{name:'M41'},{name:'M42'},{name:'M43'},{name:'M44'},{name:'M45'},{name:'M46'},{name:'M47'},{name:'M48'},{name:'M49'},{name:'M50'},{name:'M51'},{name:'M52'},{name:'M53'},{name:'M54'},{name:'M55'},{name:'M56'},{name:'M57'},{name:'M58'},{name:'M59'}
									,{name:'H0'},{name:'H1'},{name:'H2'},{name:'H3'},{name:'H4'},{name:'H5'},{name:'H6'},{name:'H7'},{name:'H8'},{name:'H9'},{name:'H10'},{name:'H11'},{name:'H12'},{name:'H13'},{name:'H14'},{name:'H15'},{name:'H16'},{name:'H17'},{name:'H18'},{name:'H19'},{name:'H20'},{name:'H21'},{name:'H22'}
									,{name:'D1'},{name:'D2'},{name:'D3'},{name:'D4'},{name:'D5'},{name:'D6'},{name:'D7'},{name:'D8'},{name:'D9'},{name:'D10'},{name:'D11'},{name:'D12'},{name:'D13'},{name:'D14'},{name:'D15'},{name:'D16'},{name:'D17'},{name:'D18'},{name:'D19'},{name:'D20'},{name:'D21'},{name:'D22'},{name:'D23'},{name:'D24'},{name:'D25'},{name:'D26'},{name:'D27'},{name:'D28'},{name:'D29'},{name:'D30'},{name:'D31'}
									,{name:'MM1'},{name:'MM2'},{name:'MM3'},{name:'MM4'},{name:'MM5'},{name:'MM6'},{name:'MM7'},{name:'MM8'},{name:'MM9'},{name:'MM10'},{name:'MM11'},{name:'MM12'}
									,{name:'week1'},{name:'week2'},{name:'week3'},{name:'week4'},{name:'week5'},{name:'week6'},{name:'week7'}
									
									])
					});

            //修改窗口
			var syncModifyWindow;
			syncModifyWindow = new Ext.Window({
				layout : 'fit',
				width : 620,
				height : 400,
				resizable : false,
				draggable : true,
				closeAction : 'hide',
				title : '<span class="commoncss">作业修改</span>',
			        iconCls : 'page_edit_1Icon',
				modal : true,
				collapsible : true,
				titleCollapse : true,
				maximizable : false,
				buttonAlign : 'right',
				border : false,
				animCollapse : true,
				animateTarget : Ext.getBody(),
				constrain : true,
				items : [syncPanel],
				buttons : [{
					text : '修改',
					iconCls : 'acceptIcon',
					handler : function() {
						if (syncModifyWindow.getComponent('syncModifyForm').form.isValid()) {
							syncModifyWindow.getComponent('syncModifyForm').form.submit({
								url : './jobMange.ered?reqCode=jobMangerUpdate',
								waitTitle : '提示',
								method : 'POST',
								waitMsg : '正在处理数据,请稍候...',
								success : function(form, action) {
									Ext.MessageBox.alert('提示', '修改成功');
									syncModifyWindow.hide();
									syncStore.reload();
								},
								failure : function(form, action) {
									var msg = action.result.msg;
									Ext.MessageBox.alert('提示', '操作失败!' + msg);
									syncModifyWindow.getComponent('syncModifyForm').form.reset();
								}
							});
						} else {
							// 表单验证失败
						}
					}
				}, {
					text : '关闭',
					iconCls : 'deleteIcon',
					handler : function() {
						syncModifyWindow.hide();
					}
				}]
			});			

			// 翻页排序时带上查询条件
			syncStore.on('beforeload', function() {
						this.baseParams = {
								queryParam:reportManger.rfcname
						};				
					});
			// 每页显示条数下拉选择框
			var syncPagesize_combo = new Ext.form.ComboBox({
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
			var syncNumber = parseInt(syncPagesize_combo.getValue());
			// 改变每页显示条数reload数据
			syncPagesize_combo.on("select", function(comboBox) {
						reportBbar.pageSize = parseInt(comboBox.getValue());
						syncNumber = parseInt(comboBox.getValue());
						syncStore.reload({
									params : {
										queryParam:reportManger.rfcname,
										start : 0,
										limit : syncBbar.pageSize
									}
								});
					});
			// 分页工具栏
			var syncBbar = new Ext.PagingToolbar({
						pageSize : syncNumber,
						store : syncStore,
						displayInfo : true,
						displayMsg : '显示{0}条到{1}条,共{2}条',
						plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
						emptyMsg : "没有符合条件的记录",
						items : ['-', '&nbsp;&nbsp;', syncPagesize_combo]
					});		
			// 表格工具栏
			var syncTbar = new Ext.Toolbar({
						items : [{
									text : '修改',
									iconCls : 'page_edit_1Icon',
									handler : function() {
										editjobmanger();
									}
								},'-',{
									text : '暂停',
									iconCls : 'keyIcon',
									handler : function() {
										stopjobmanger();
									}
								},'-',{
									text : '恢复',
									iconCls : 'arrow_switchIcon',
									handler : function() {
										restorejobmanger();
									}
								},'-',{
									text : '删除',
									iconCls : 'page_delIcon',
									handler : function() {
										deljobmanger();
									}
								},'-',{
									text : '刷新',
									iconCls : 'page_refreshIcon',
									handler : function() {
										syncStore.reload();
									}
								},'-',{
									text : '增加',
									iconCls : 'acceptIcon',
									handler : function() {
										syncAddWindow.show();
									}
								},'-',{
									text : '历史记录',
									iconCls : 'commentsIcon',
									handler : function() {
										var record = syncGrid.getSelectionModel().getSelected();
										if (Ext.isEmpty(record)) {
												Ext.Msg.alert('提示', '请先选中要修改的项目');
												return;
										}	
										reportManger.syncname = record.data.trigger_name;									
										reportWindow.show();
										reportGrid.setTitle('<span  >'+reportManger.syncname+' 历史记录</span>');
										reportStore.load({params : {functionname:reportManger.syncname,start : 0,limit : reportBbar.pageSize}});
									}
								},'-',{
									text : '清空历史记录',
									iconCls : 'acceptIcon',
									handler : function() {
										Ext.Msg.confirm('请确认', '你真的要删除吗?', function(btn, text) {
												if (btn == 'yes') {
													var rows = syncGrid.getSelectionModel().getSelections();
													var name = reportManger.rfcname;
													if(!Ext.isEmpty(rows)){
														var strChecked = jsArray2JsString(rows, 'trigger_name');
												//		var strChecked2 = jsArray2JsString(rows, 'trigger_group');	
														var param = {
															strChecked : strChecked,
												//			strChecked2 : strChecked2,
															flag: '1'
														}												
													}else{
														var param = {
															functionname:name,
															flag:'2'
														}
													}
													
													Ext.Ajax.request({
													   url : './jobMange.ered?reqCode=jobSyncHistoryDel',
													   success: function(response,options){
													    	var resultArray = Ext.util.JSON.decode(response.responseText);
													    	if(resultArray.result == 'yes'){
													    		Ext.Msg.alert('提示', '删除历史记录成功');
													    	}else{
													    		Ext.Msg.alert('提示', '删除历史记录失败');
													    	}
												       },
													   failure: function(response,options){
													    	Ext.Msg.alert('提示', '删除历史记录失败');
												       },
													   params: param
													});
											}	
										})
									}								
								}]
					});								
				// 表格实例
				var syncGrid = new Ext.grid.GridPanel({
							// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
							title : '<span class="commoncss">同步列表</span>',
							height : 800,
							frame : true,
							autoScroll : true,
							region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
							store : syncStore, // 数据存储
							stripeRows : true, // 斑马线
							cm : syncCm, // 列模型
							sm : syncSm, // 复选框
							bbar : syncBbar,// 分页工具栏
							tbar : syncTbar, // 表格工具栏
							viewConfig : {
				// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
							// forceFit : true
							}
	                       ,
							loadMask : {
								msg : '正在加载表格数据,请稍等...'
							}
				});		
			syncGrid.on('rowdblclick', function(pGrid, rowIndex, event) {
					reportManger.syncname = this.store.getAt(rowIndex).data.trigger_name;
					reportWindow.show();
					reportGrid.setTitle('<span  >'+reportManger.syncname+' 历史记录</span>');
					reportStore.load({params : {functionname:reportManger.syncname,start : 0,limit : reportBbar.pageSize}});
			})		
			// 表格右键菜单
			var syncContextmenu = new Ext.menu.Menu({
						id : 'syncContextMenu',
						items : [{
									text : '修改',
									iconCls : 'page_edit_1Icon',
									handler : function() {
										editjobmanger();
									}
								},'-',{
									text : '暂停',
									iconCls : 'keyIcon',
									handler : function() {
										stopjobmanger();
									}
								},'-',{
									text : '恢复',
									iconCls : 'arrow_switchIcon',
									handler : function() {
										restorejobmanger();
									}
								},'-',{
									text : '删除',
									iconCls : 'page_delIcon',
									handler : function() {
										deljobmanger();
									}
								},'-',{
									text : '历史记录',
									iconCls : 'commentsIcon',
									handler : function() {
										var record = syncGrid.getSelectionModel().getSelected();
										if (Ext.isEmpty(record)) {
												Ext.Msg.alert('提示', '请先选中要修改的项目');
												return;
										}										
										reportManger.syncname = record.data.trigger_name;									
										reportWindow.show();
										reportGrid.setTitle('<span  >'+reportManger.syncname+' 历史记录</span>');
										reportStore.load({params : {functionname:reportManger.syncname,start : 0,limit : reportBbar.pageSize}});
									}
								},'-',{
									text : '清空历史记录',
									iconCls : 'acceptIcon',
									handler : function() {
										Ext.Msg.confirm('请确认', '你真的要删除吗?', function(btn, text) {
												if (btn == 'yes') {
													var record = syncGrid.getSelectionModel().getSelected();
													var param = {functionname:record.data.trigger_name,flag: '2'}
													Ext.Ajax.request({
													   url : './jobMange.ered?reqCode=jobSyncHistoryDel',
													   success: function(response,options){
													    	var resultArray = Ext.util.JSON.decode(response.responseText);
													    	if(resultArray.result == 'yes'){
													    		Ext.Msg.alert('提示', '删除历史记录成功');
													    	}else{
													    		Ext.Msg.alert('提示', '删除历史记录失败');
													    	}
												       },
													   failure: function(response,options){
													    	Ext.Msg.alert('提示', '删除历史记录失败');
												       },
													   params: param
													});
											}	
										})
									}								
								}]
			});					
			// 给表格绑定右键菜单
			syncGrid.on("rowcontextmenu", function(grid, rowIndex, e) {
						e.preventDefault(); // 拦截默认右键事件
						syncGrid.getSelectionModel().selectRow(rowIndex); // 选中当前行
						syncContextmenu.showAt(e.getXY());
					});							
			//历史列表窗口			
			var syncWindow = new Ext.Window({
				layout : 'fit',
				width : 800,
				height : 400,
				resizable : false,
				draggable : true,
				closeAction : 'hide',
				//title : '<span class="commoncss">历史详情</span>',
				// iconCls : 'page_addIcon',
				modal : true,
				collapsible : true,
				titleCollapse : true,
				maximizable : false,
				buttonAlign : 'right',
				border : false,
				animCollapse : true,
				animateTarget : Ext.getBody(),
				constrain : true,
				items : [ syncGrid ]
			});				

					
//==
			
			//===  历史同步列表
			var reportSm = new Ext.grid.CheckboxSelectionModel();

			// 定义自动当前页行号
			var reportRownum = new Ext.grid.RowNumberer({
						header : 'NO',
						width : 28
					});
			var executeState = function(state, metadata, record, rowIndex, colIndex, store){	
				if(state == 1){
					return '执行成功';
				}else{
					return '执行失败';
				}
			}
			var executeDetail = function(detail, metadata, record, rowIndex, colIndex, store){	
				var html = "<table width='100%' border='0' cellpadding='1' cellspacing='0'>";
				html+="<tr><td ><b>"+detail+"</b></td></tr>";
				html+='</table>';
				return html;
			}			// 定义列模型
			var reportCm = new Ext.grid.ColumnModel([reportRownum, {
					    header : '状态', // 列标题
						dataIndex : 'executestate', // 数据索引:和Store模型对应
						renderer : executeState ,
						width: 120
				   } ,{
					    header : '执行时间 ', // 列标题
						dataIndex : 'executetime', // 数据索引:和Store模型对应
						width: 150
				   },{
					    header : '详情', // 列标题
						dataIndex : 'detail', // 数据索引:和Store模型对应
						renderer : executeDetail ,
						width: 400
				   }
			       ]);
			/**
			 * 数据存储
			 */
			var reportStore = new Ext.data.Store({
						// 获取数据的方式
						proxy : new Ext.data.HttpProxy({
									url : './jobMange.ered?reqCode=jobReportHistoryList'
								}),
						// 数据读取器
						reader : new Ext.data.JsonReader({
									totalProperty : 'TOTALCOUNT', // 记录总数
									root : 'ROOT' // Json中的列表数据根节点
								}, [{
											name : 'functionname' // Json中的属性Key值
									},{
										    name : 'executestate'
									},{
										    name : 'executetime'
									},{
										    name : 'detail'
									}
									])
					});
			

			// 翻页排序时带上查询条件
			reportStore.on('beforeload', function() {
						this.baseParams = {
								functionname:reportManger.syncname
						};				
					});
			// 每页显示条数下拉选择框
			var reportPagesize_combo = new Ext.form.ComboBox({
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
			var reportNumber = parseInt(reportPagesize_combo.getValue());
			// 改变每页显示条数reload数据
			reportPagesize_combo.on("select", function(comboBox) {
						reportBbar.pageSize = parseInt(comboBox.getValue());
						reportNumber = parseInt(comboBox.getValue());
						reportStore.reload({
									params : {
										functionname:reportManger.syncname,
										start : 0,
										limit : reportBbar.pageSize
									}
								});
					});
			// 分页工具栏
			var reportBbar = new Ext.PagingToolbar({
						pageSize : reportNumber,
						store : reportStore,
						displayInfo : true,
						displayMsg : '显示{0}条到{1}条,共{2}条',
						plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
						emptyMsg : "没有符合条件的记录",
						items : ['-', '&nbsp;&nbsp;', reportPagesize_combo]
					});					
				// 表格实例
				var reportGrid = new Ext.grid.GridPanel({
							// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
							title : '<span class="commoncss">作业管理</span>',
							height : 800,
							frame : true,
							autoScroll : true,
							region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
							store : reportStore, // 数据存储
							stripeRows : true, // 斑马线
							cm : reportCm, // 列模型
							//sm : reportSm, // 复选框
							bbar : reportBbar,// 分页工具栏
							viewConfig : {
				// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
							// forceFit : true
							}
	                       ,
							loadMask : {
								msg : '正在加载表格数据,请稍等...'
							}
						});		
			var reportWindow = new Ext.Window({
				layout : 'fit',
				width : 800,
				height : 400,
				resizable : false,
				draggable : true,
				closeAction : 'hide',
				//title : '<span class="commoncss">历史详情</span>',
				// iconCls : 'page_addIcon',
				modal : true,
				collapsible : true,
				titleCollapse : true,
				maximizable : false,
				buttonAlign : 'right',
				border : false,
				animCollapse : true,
				animateTarget : Ext.getBody(),
				constrain : true,
				items : [ reportGrid ]
			});						
//==
			reportManger.processF = function (flag,index){
				var record = 	reportManger.record['record_'+index];
				if(flag == 1){
					reportManger.editInit(record);
				}else if(flag == 2){
						reportGrid.setTitle ('<span  >'+record.data.saprfcname+' 详细情况</span>');
						reportWindow.show();
						reportManger.rfcname = record.data.saprfcname ;
						
						reportStore.load({params : {functionname:reportManger.rfcname,start : 0,limit : reportBbar.pageSize}});
						reportStore.baseParams = {functionname:reportManger.rfcname};	
				}else if(flag == 3){
						reportManger.rfcname = record.data.saprfcname ;
						syncWindow.show();
						syncStore.load({params : {queryParam:reportManger.rfcname,start : 0,limit : syncBbar.pageSize}});
				}
							
			}			
			reportManger.editInit = function(record) {			
							var rfc_id = record.data.rfc_id;
							var parent_id =  record.data.parent_id;		
							
							Ext.getCmp('rfcForm').form.loadRecord(record);
							rfcWindow.show();
							rfcWindow
									.setTitle('<span style="font-weight:normal">修改RFC功能</span>');
							Ext.getCmp('windowmode').setValue('edit');
							Ext.getCmp('parentid_old').setValue(parent_id);
							Ext.getCmp('enabledCombo').setDisabled(true);
							Ext.getCmp('btnReset').hide();
							Ext.getCmp('btnSwitch').hide();
							Ext.getCmp('btnSyncSAP').show();
							Ext.getCmp('btnResetCache').hide();
							
			
							tabs.setActiveTab(0);
							reloadStore(rfc_id);
			}			
			var root = new Ext.tree.AsyncTreeNode({
				text : 'RFC功能树',
				expanded : true,
				id : '001'
			});
			var rfcTree = new Ext.tree.TreePanel({
				loader : new Ext.tree.TreeLoader({
					baseAttrs : {},
					dataUrl : './sapRfcDefine.ered?reqCode=rfcTreeInit'
				}),
				root : root,
				title : '',
				applyTo : 'rfcTreeDiv2',
				autoScroll : false,
				animate : false,
				useArrows : false,
				border : false
			});
			rfcTree.root.select();
			rfcTree.on('click', function(node) {
				rfc_id = node.attributes.id;
				store.load({
					params : {
						start : 0,
						limit : bbar.pageSize,
						rfc_id : rfc_id
					}
				});
			});

			var contextMenu = new Ext.menu.Menu({
				id : 'rfcTreeContextMenu',
				items : [ {
					text : '新增功能',
					iconCls : 'page_addIcon',
					handler : function() {
						addInit();
					}
				}, {
					text : '刷新节点',
					iconCls : 'page_refreshIcon',
					handler : function() {
						var selectModel = rfcTree.getSelectionModel();
						var selectNode = selectModel.getSelectedNode();
						if (selectNode.attributes.leaf) {
							selectNode.parentNode.reload();
						} else {
							selectNode.reload();
						}
					}
				} ]
			});
			rfcTree.on('contextmenu', function(node, e) {
				e.preventDefault();
				rfc_id = node.attributes.id;
				rfc_name = node.attributes.text;
				Ext.getCmp('parentrfcname').setValue(rfc_name);
				Ext.getCmp('parent_id').setValue(rfc_id);
				store.load({
					params : {
						start : 0,
						limit : bbar.pageSize,
						rfc_id : rfc_id
					},
					callback : function(r, options, success) {
						for ( var i = 0; i < r.length; i++) {
							var record = r[i];
							var rfc_id_g = record.data.rfc_id;
							if (rfc_id_g == rfc_id) {
								grid.getSelectionModel().selectRow(i);
							}
						}
					}
				});
				node.select();
				contextMenu.showAt(e.getXY());
			});
			/* 基本信息 */
			var sm = new Ext.grid.CheckboxSelectionModel();
				
			var modefyfun = function(rfc_name, metadata, record, rowIndex, colIndex, store){
							reportManger.record ['record_'+rowIndex] = record;
							//var rfc_id = record.data.rfc_id;
							//var parent_id =  record.data.parent_id;
							var html = '<a href="javascript:void(0);" onclick="reportManger.processF(1,'+rowIndex+');">修改</a>';
							html+='&nbsp;&nbsp;&nbsp;<a href="javascript:void(0);" onclick="reportManger.processF(3,'+rowIndex+');">同步列表</a>';
							return html;
			}
			var syncstateRender = function(syncstate, metadata, record, rowIndex, colIndex, store){
				if(syncstate == 2){
					return '<span style="font-weight:bold;">没同步</span>';
				}else{
					return '<span style="font-weight:bold;">已同步</span>';
				}
			}
			var cm = new Ext.grid.ColumnModel([ new Ext.grid.RowNumberer(), sm,
					//{
					//	header : '操作',
					//	dataIndex : 'rfc_name',
					//	renderer : modefyfun ,
					//	width : 120
					//}, 
					{
						header : '功能名称',
						dataIndex : 'rfc_name',
						width : 120
					},{
						header : '同步状态',
						dataIndex : 'syncstate',
						renderer : syncstateRender ,
						width : 60
					}, {
						header : 'SAP函数名',
						dataIndex : 'saprfcname',
						width : 100
					}, {
						header : '上级分类',
						dataIndex : 'parentrfcname',
						width : 130
					}, {
						header : '排序号',
						dataIndex : 'sortno',
						sortable : true,
						width : 50
					}, {
						header : '功能编号',
						dataIndex : 'rfc_id',
						hidden : false,
						width : 130,
						sortable : true
					}, {
						header : '创建日期',
						dataIndex : 'crea_date',
						hidden : false,
						width : 130,
						sortable : true
					}, {
						header : '启用状态',
						width : 50,
						dataIndex : 'enabled',
						renderer : ENABLEDRender
					}, {
						header : '编辑模式',
						dataIndex : 'editmode',
						width : 50,
						renderer : EDITMODERender
					}, {
						id : 'remark',
						header : '备注',
						dataIndex : 'remark'
					} ]);
			var cm1 = new Ext.grid.ColumnModel([ new Ext.grid.RowNumberer(), {
				header : '功能名称',
				dataIndex : 'rfc_id',
				hidden : true,
				width : 130
			}, {
				header : '参数ID',
				dataIndex : 'para_id',
				hidden :true,
				width : 100
			}, {
				header : '参数名称',
				dataIndex : 'para_name',
				width : 130
			}, {
				header : '参数类型',
				dataIndex : 'para_type',
				width : 130
			}, {
				header : '参数长度',
				dataIndex : 'para_length',
				width : 130
			},{
				header : '参数小数位',
				dataIndex : 'para_decimals',
				width : 130
			}, {
				header : '参数描述',
				dataIndex : 'para_desc',
				width : 130
			}, {
				header : '可选状态',
				dataIndex : 'para_optional',
				renderer : OPTIONRender,
				width : 130
			}, {
				header : '参数值',
				dataIndex : 'para_vale',
				editor : new Ext.grid.GridEditor(new Ext.form.TextField({})),
				width : 130
			}, {
				header : '参数表达式',
				dataIndex : 'para_valeper',
				editor : new Ext.grid.GridEditor(new Ext.form.TextField({})),
				width : 130
			}, {
				header : '参数备注',
				dataIndex : 'para_remark',
				editor : new Ext.grid.GridEditor(new Ext.form.TextField({})),
				width : 100
			}, {
				header : 'AIG名称',
				dataIndex : 'aig_name',
				editor : new Ext.grid.GridEditor(new Ext.form.TextField({})),
				width : 130
			}, {
				header : 'AIG类型',
				dataIndex : 'aig_type',
				editor : new Ext.grid.GridEditor(new Ext.form.TextField({})),
				width : 130
			}, {
				header : 'AIG长度',
				dataIndex : 'aig_length',
				editor : new Ext.grid.GridEditor(new Ext.form.TextField({})),
				width : 130
			}, {
				header : 'AIG小数位',
				dataIndex : 'aig_decimals',
				editor : new Ext.grid.GridEditor(new Ext.form.TextField({})),
				width : 130
			},{
				header : 'AIG描述',
				dataIndex : 'aig_desc',
				editor : new Ext.grid.GridEditor(new Ext.form.TextField({})),
				width : 130
			}, {
				header : '排序号',
				dataIndex : 'sortno',
				sortable : true,
				editor : new Ext.grid.GridEditor(new Ext.form.NumberField({})),
				width : 50
			}, {
				header : '创建日期',
				dataIndex : 'crea_date',
				hidden : false,
				width : 130,
				sortable : true
			}, {
				header : '启用状态',
				width : 130,
				dataIndex : 'enabled',
				renderer : ENABLEDRender
			}, {
				header : '编辑模式',
				dataIndex : 'editmode',
				width : 130,
				renderer : EDITMODERender
			}, {
				id : 'remark',
				header : '备注',
				dataIndex : 'remark'
			} ]);
			
			var cm9 = new Ext.grid.ColumnModel([ new Ext.grid.RowNumberer(), {
				header : '<b>AIG名称</b>',
				dataIndex : 'aig_name',
				editor : new Ext.grid.GridEditor(new Ext.form.TextField({
					id:'aig_tablename',
					listeners:{
			             blur:function(){
								gridDescWindow.show();
								store10.load({params : {
									tablename:Ext.getCmp('aig_tablename').getValue()
								}});
			            },scope : this
				    }				
				
				})), 
				width : 130
			}, {
				header : 'AIG主键',
				dataIndex : 'aig_primarykey',
				sortable : true,
				renderer : PRIMARYKEYRender,
				editor : new Ext.grid.GridEditor(new Ext.form.ComboBox({
					store : PRIMARYKEYStore,
					mode : 'local',
					triggerAction : 'all',
					valueField : 'value',
					displayField : 'text',
					allowBlank : false,
					forceSelection : true,
					typeAhead : true
				})),
				width : 50
		     }, {
				header : 'AIG类型',
				dataIndex : 'aig_type',
				editor : new Ext.grid.GridEditor(new Ext.form.TextField({})),
				width : 130
			}, {
				header : 'AIG长度',
				dataIndex : 'aig_length',
				editor : new Ext.grid.GridEditor(new Ext.form.TextField({})),
				width : 50
			},  {
				header : '参数值',
				dataIndex : 'para_vale',
				editor : new Ext.grid.GridEditor(new Ext.form.TextField({})),
				width : 50
			}, {
				header : '参数表达式',
				dataIndex : 'para_valeper',
				editor : new Ext.grid.GridEditor(new Ext.form.TextField({})),
				width : 100
			}, {
				header : 'AIG小数位',
				dataIndex : 'aig_decimals',
				editor : new Ext.grid.GridEditor(new Ext.form.TextField({})),
				width : 50
			}, {
				header : 'AIG描述',
				dataIndex : 'aig_desc',
				editor : new Ext.grid.GridEditor(new Ext.form.TextField({})),
				width : 130
			}, {
				header : 'AIG缓存',
				dataIndex : 'cachemode',
				sortable : true,
				renderer : CACHEMODERender,
				editor : new Ext.grid.GridEditor(new Ext.form.ComboBox({
					store : CACHEMODEStore,
					mode : 'local',
					triggerAction : 'all',
					valueField : 'value',
					displayField : 'text',
					allowBlank : false,
					forceSelection : true,
					typeAhead : true
				})),
				width : 50
			}, {
				header : '排序号',
				dataIndex : 'sortno',
				sortable : true,
				editor : new Ext.grid.GridEditor(new Ext.form.NumberField({})),
				width : 40
			}, {
				header : '创建日期',
				dataIndex : 'crea_date',
				hidden : false,
				width : 100,
				sortable : true
			}, {
				header : '启用状态',
				width : 60,
				dataIndex : 'enabled',
				renderer : ENABLEDRender,
				editor : new Ext.grid.GridEditor(new Ext.form.ComboBox({
					store : ENABLEDStore,
					mode : 'local',
					triggerAction : 'all',
					valueField : 'value',
					displayField : 'text',
					allowBlank : false,
					forceSelection : true,
					typeAhead : true
				}))
			}, {
				header : '编辑模式',
				dataIndex : 'editmode',
				width : 100,
				renderer : EDITMODERender,
				editor : new Ext.grid.GridEditor(new Ext.form.ComboBox({
					store : EDITMODEStore,
					mode : 'local',
					triggerAction : 'all',
					valueField : 'value',
					displayField : 'text',
					allowBlank : false,
					forceSelection : true,
					typeAhead : true
				}))
			}, {
				header : '参数备注',
				dataIndex : 'para_remark',
				editor : new Ext.grid.GridEditor(new Ext.form.TextField({})),
				width : 100
			}]);
			
			var cm4 = new Ext.grid.ColumnModel([ new Ext.grid.RowNumberer(), {
				header : '功能名称',
				dataIndex : 'rfc_id',
				hidden : true,
				width : 130
			}, {
				header : '参数ID',
				dataIndex : 'para_id',
				hidden : true,
				width : 100
			}, {
				header : '参数名称',
				dataIndex : 'para_name',
				width : 110
			}, {
				header : '参数类型',
				dataIndex : 'para_type',
				width : 130
			}, {
				header : '参数长度',
				dataIndex : 'para_length',
				width : 40
			},{
				header : '参数小数位',
				dataIndex : 'para_decimals',
				width : 40
			}, {
				header : '参数描述',
				dataIndex : 'para_desc',
				width : 100
			}, {
				header : '可选状态',
				dataIndex : 'para_optional',
				renderer : OPTIONRender,
				width : 40
			}, {
				id : 'remark',
				header : '备注',
				dataIndex : 'remark'
			} ]);

			/* exception */
			// var sm5 = new Ext.grid.CheckboxSelectionModel();
			var cm5 = new Ext.grid.ColumnModel([ new Ext.grid.RowNumberer(), {
				header : '功能名称',
				dataIndex : 'rfc_id',
				width : 130
			}, {
				header : '参数ID',
				dataIndex : 'para_id',
				width : 100
			}, {
				header : '参数名称',
				dataIndex : 'para_name',
				width : 130
			}, {
				header : '参数描述',
				dataIndex : 'para_desc',
				width : 130
			}, {
				header : '可选状态',
				dataIndex : 'para_optional',
				renderer : OPTIONRender,
				width : 130
			}, {
				header : '参数值',
				dataIndex : 'para_vale',
				editor : new Ext.grid.GridEditor(new Ext.form.TextField({})),
				width : 130
			}, {
				header : '参数备注',
				dataIndex : 'para_remark',
				editor : new Ext.grid.GridEditor(new Ext.form.TextField({})),
				width : 100
			}, {
				header : '排序号',
				dataIndex : 'sortno',
				hidden : false,
				sortable : true,
				editor : new Ext.grid.GridEditor(new Ext.form.NumberField({})),
				width : 50
			}, {
				header : '创建日期',
				dataIndex : 'crea_date',
				hidden : false,
				width : 130,
				sortable : true
			}, {
				header : '启用状态',
				width : 130,
				dataIndex : 'enabled',
				renderer : ENABLEDRender
			}, {
				header : '编辑模式',
				dataIndex : 'editmode',
				width : 130,
				renderer : EDITMODERender
			}, {
				id : 'remark',
				header : '备注',
				dataIndex : 'remark'
			} ]);

			var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
					url : './sapRfcDefine.ered?reqCode=queryRfcsForManage'
				}),
				reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT',
					root : 'ROOT'
				}, [ {
					name : 'syncstate'
				},{
					name : 'rfc_id'
				}, {
					name : 'rfc_name'
				}, {
					name : 'sortno'
				}, {
					name : 'saprfcname'
				}, {
					name : 'parentrfcname'
				}, {
					name : 'leaf'
				}, {
					name : 'remark'
				}, {
					name : 'parent_id'
				}, {
					name : 'crea_date'
				}, {
					name : 'enabled'
				}, {
					name : 'editmode'
				} ])
			});
			// 翻页排序时带上查询条件

			store.on('beforeload', function() {
				this.baseParams = {
					queryParam : Ext.getCmp('queryParam').getValue(),
					rfctable : 'sap_rfcclass'
				};
			});
			var store1 = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
					url : './sapRfcDefine.ered?reqCode=queryRfcsForManage'
				}),
				listeners:{
		             beforeload:function(){
		                   msgTip = Ext.MessageBox.show({
		                   title:'提示',
		                  width : 250,
		                   msg:'正在处理数据,请稍候...'
		                });
		            }
			    },
				reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT',
					root : 'ROOT'
				}, [ {
					name : 'rfc_id'
				}, {
					name : 'para_id'
				}, {
					name : 'parent_id'
				}, {
					name : 'parentparaname'
				}, {
					name : 'para_name'
				}, {
					name : 'para_type'
				}, {
					name : 'para_length'
				}, {
					name : 'para_decimals'
				},{
					name : 'para_desc'
				}, {
					name : 'para_optional'
				}, {
					name : 'para_vale'
				}, {
					name : 'para_valeper'
				}, {
					name : 'para_remark'
				}, {
					name : 'aig_name'
				}, {
					name : 'aig_type'
				}, {
					name : 'aig_length'
				},{
					name : 'aig_decimals'
				}, {
					name : 'aig_desc'
				}, {
					name : 'sortno'
				},{
					name : 'leaf'
				}, {
					name : 'remark'
				}, {
					name : 'crea_date'
				}, {
					name : 'enabled'
				}, {
					name : 'editmode'
				} ]),
				add: false
			});
			// 翻页排序时带上查询条件
			store1.on('beforeload', function() {
				this.baseParams = {
					rfc_id : Ext.getCmp('rfc_id').getValue(),
					rfctable : 'sap_rfcimport'

				};
			});
			var store2 = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
					url : './sapRfcDefine.ered?reqCode=queryRfcsForManage'
				}),
				listeners:{
		             beforeload:function(){
		                   msgTip = Ext.MessageBox.show({
		                   title:'提示',
		                  width : 250,
		                   msg:'正在处理数据,请稍候...'
		                });
		            }
			    },
				reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT',
					root : 'ROOT'
				}, [ {
					name : 'rfc_id'
				}, {
					name : 'para_id'
				}, {
					name : 'parent_id'
				}, {
					name : 'parentparaname'
				}, {
					name : 'para_name'
				}, {
					name : 'para_type'
				}, {
					name : 'para_length'
				},  {
					name : 'para_decimals'
				},{
					name : 'para_desc'
				}, {
					name : 'para_optional'
				}, {
					name : 'para_vale'
				}, {
					name : 'para_valeper'
				}, {
					name : 'para_remark'
				}, {
					name : 'aig_name'
				}, {
					name : 'aig_type'
				}, {
					name : 'aig_length'
				},{
					name : 'aig_decimals'
				}, {
					name : 'aig_desc'
				}, {
					name : 'sortno'
				}, {
					name : 'leaf'
				}, {
					name : 'remark'
				}, {
					name : 'crea_date'
				}, {
					name : 'enabled'
				}, {
					name : 'editmode'
				} ]),
			    add: false
			});
			// 翻页排序时带上查询条件
			store2.on('beforeload', function() {
				this.baseParams = {
					rfc_id : Ext.getCmp('rfc_id').getValue(),
					rfctable : 'sap_rfcexport'
				};
			});
			var store3 = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
					url : './sapRfcDefine.ered?reqCode=queryRfcsForManage'
				}),
				listeners:{
		             beforeload:function(){
		                   msgTip = Ext.MessageBox.show({
		                   title:'提示',
		                  width : 250,
		                   msg:'正在处理数据,请稍候...'
		                });
		            }
			    },
				reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT',
					root : 'ROOT'
				}, [ {
					name : 'rfc_id'
				}, {
					name : 'para_id'
				}, {
					name : 'parent_id'
				}, {
					name : 'parentparaname'
				}, {
					name : 'para_name'
				}, {
					name : 'para_type'
				}, {
					name : 'para_length'
				},  {
					name : 'para_decimals'
				},{
					name : 'para_desc'
				}, {
					name : 'para_optional'
				}, {
					name : 'para_vale'
				}, {
					name : 'para_valeper'
				}, {
					name : 'para_remark'
				}, {
					name : 'aig_name'
				}, {
					name : 'aig_type'
				}, {
					name : 'aig_length'
				},{
					name : 'aig_decimals'
				}, {
					name : 'aig_desc'
				},  {
					name : 'sortno'
				},{
					name : 'leaf'
				}, {
					name : 'remark'
				}, {
					name : 'crea_date'
				}, {
					name : 'enabled'
				}, {
					name : 'editmode'
				} ]),
			    add: false
			});
			// 翻页排序时带上查询条件
			store3.on('beforeload', function() {
				this.baseParams = {
					rfc_id : Ext.getCmp('rfc_id').getValue(),
					rfctable : 'sap_rfcchanging'
				};
			});
			var store4 = new Ext.data.Store({
				// true to clear all modified record information each
				// time the store is loaded
				pruneModifiedRecords : true,
				proxy : new Ext.data.HttpProxy({
					url : './sapRfcDefine.ered?reqCode=queryRfcsForManage'
				}),
				listeners:{
		             beforeload:function(){
		                   msgTip = Ext.MessageBox.show({
		                   title:'提示',
		                  width : 250,
		                   msg:'正在处理数据,请稍候...'
		                });
		            }
			    },
				reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT',
					root : 'ROOT'
				}, [ {
					name : 'rfc_id'
				}, {
					name : 'para_id'
				}, {
					name : 'parent_id'
				}, {
					name : 'parentparaname'
				}, {
					name : 'para_name'
				}, {
					name : 'aig_primarykey'
				},  {
					name : 'para_type'
				}, {
					name : 'para_length'
				}, {
					name : 'para_decimals'
				}, {
					name : 'para_desc'
				}, {
					name : 'para_optional'
				}, {
					name : 'para_vale'
				}, {
					name : 'para_valeper'
				}, {
					name : 'para_remark'
				}, {
					name : 'aig_name'
				}, {
					name : 'aig_type'
				}, {
					name : 'aig_length'
				},{
					name : 'aig_decimals'
				}, {
					name : 'aig_desc'
				}, {
					name : 'sortno'
				}, {
					name : 'leaf'
				}, {
					name : 'remark'
				}, {
					name : 'crea_date'
				}, {
					name : 'enabled'
				}, {
					name : 'editmode'
				}, {
					name : 'cachemode'
				} ]),
			    add: false
			});
			// 翻页排序时带上查询条件
			store4.on('beforeload', function() {
				this.baseParams = {
					rfc_id : Ext.getCmp('rfc_id').getValue(),
					rfctable : 'sap_rfctables'
				};
			});
			var store5 = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
					url : './sapRfcDefine.ered?reqCode=queryRfcsForManage'
				}),
				listeners:{
		             beforeload:function(){
		                   msgTip = Ext.MessageBox.show({
		                   title:'提示',
		                  width : 250,
		                   msg:'正在处理数据,请稍候...'
		                });
		            }
			    },
				reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT',
					root : 'ROOT'
				}, [ {
					name : 'rfc_id'
				}, {
					name : 'para_id'
				}, {
					name : 'para_name'
				}, {
					name : 'para_desc'
				}, {
					name : 'sortno'
				}, {
					name : 'para_optional'
				}, {
					name : 'para_vale'
				}, {
					name : 'para_remark'
				}, {
					name : 'remark'
				}, {
					name : 'crea_date'
				}, {
					name : 'enabled'
				}, {
					name : 'editmode'
				} ]),
			    add: false
			});
			// 翻页排序时带上查询条件
			store5.on('beforeload', function() {
				this.baseParams = {
					rfc_id : Ext.getCmp('rfc_id').getValue(),
					rfctable : 'sap_rfcexceptions'
				};
			});
			var pagesize_combo = new Ext.form.ComboBox({
				name : 'pagesize',
				hiddenName : 'pagesize',
				typeAhead : true,
				triggerAction : 'all',
				lazyRender : true,
				mode : 'local',
				store : new Ext.data.ArrayStore({
					fields : [ 'value', 'text' ],
					data : [ [ 10, '10条/页' ], [ 20, '20条/页' ], [ 50, '50条/页' ],
							[ 100, '100条/页' ], [ 250, '250条/页' ],
							[ 500, '500条/页' ] ]
				}),
				valueField : 'value',
				displayField : 'text',
				value : '50',
				editable : false,
				width : 85
			});
			var number = parseInt(pagesize_combo.getValue());
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

			var bbar = new Ext.PagingToolbar({
				pageSize : number,
				store : store,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
				emptyMsg : "没有符合条件的记录",
				items : [ '-', '&nbsp;&nbsp;', pagesize_combo ]
			});
			var paraImportRoot = new Ext.tree.AsyncTreeNode({
				text : 'RFC Import参数树',
				expanded : true,
				id : '0'
			});
			var paraExportRoot = new Ext.tree.AsyncTreeNode({
				text : 'RFC Export参数树',
				expanded : true,
				id : '0'
			});
			var paraChangingRoot = new Ext.tree.AsyncTreeNode({
				text : 'RFC Changing参数树',
				expanded : true,
				id : '0'
			});
			var paraTablesRoot = new Ext.tree.AsyncTreeNode({
				text : 'RFC Tables参数树',
				expanded : true,
				id : '0'
			});
//			alert('123');
			/*
			 * var rfcParaChangingTree2 = new Ext.tree.TreePanel({ // loader :
			 * new Ext.tree.TreeLoader({ // baseAttrs : {} // dataUrl :
			 * './sapRfcDefine.ered?reqCode=paraTreeInit' // params : { // start :
			 * 0, // limit : 1000, // rfc_id : tmprfc_id, // rfctable :
			 * 'sap_rfcimport' // } // }), root : paraChangingRoot, title : '', //
			 * applyTo : 'rfcTreeDiv', autoScroll : false, animate : false,
			 * useArrows : false, border : false });
			 * rfcParaChangingTree2.root.select();
			 * rfcParaChangingTree2.on('click', function(node) { para_id =
			 * node.attributes.id; store3.filter('para_id', para_id); });
			 */
			// alert('1234');
			var rfcParaChangingTree = new Ext.ux.tree.TreeGrid({
				title : '',
				root : paraChangingRoot,
				animate : false,
				width : 195, // 必须指定,否则显示有问题
				height : 300,
				autoScroll : true,
				columns : [ {
					header : '参数ID',
					dataIndex : 'text',
					width : 175
				} ],
				useArrows : true,
				border : true
			});
			rfcParaChangingTree.on("click", function(node, e) {
				var para_id = node.id;
				store3.filter('para_id', para_id);
				// Ext.MessageBox.alert('提示', 'ID:' + node.id + " text:" +
				// node.text);
				// if (paraChangingPanel.getForm().isDirty())
				// paraChangingPanel.getForm().updateRecord(
				// store3.getAt(store3.find('para_id', Ext.getCmp(
				// 'changing_para_id').getValue())));
				// paraChangingPanel.getForm().loadRecord(
				// store3.getAt(store3.find('para_id', node.id)));
				// paraChangingPanel.getForm().clearDirty();
				// paraChangingPanel.getForm().findField(0).setValue(node.attributes["para_desc"]);
				// paraChangingPanel.getForm().findField(1).setValue(node.attributes["para_type"]);
				// paraChangingPanel.getForm().findField(2).setValue(node.attributes["aig_name"]);
				// paraPanel.getForm().findField(2).setValue(node.para_id);
			});
			/*
			 * var rfcParaTablesTree2 = new Ext.tree.TreePanel({ // loader : new
			 * Ext.tree.TreeLoader({ // baseAttrs : {} // dataUrl :
			 * './sapRfcDefine.ered?reqCode=rfcTreeInit' // }), root :
			 * paraTablesRoot, title : '', // applyTo : 'rfcTreeDiv', autoScroll :
			 * false, animate : false, useArrows : false, border : false });
			 * rfcParaTablesTree2.root.select(); rfcParaTablesTree2.on('click',
			 * function(node) { para_id = node.attributes.id;
			 * store4.filter('para_id', para_id); });
			 */
			var rfcParaTablesTree = new Ext.ux.tree.TreeGrid({
				title : '',
				root : paraTablesRoot,
				animate : false,
				width : 195, // 必须指定,否则显示有问题
				height : 300,
				columns : [ {
					header : '参数ID',
					dataIndex : 'text',
					width : 175
				} ],
				useArrows : true,
				border : true
			});
			rfcParaTablesTree.on("click", function(node, e) {
				var para_id = node.id;
				store4.filter('para_id', para_id);
				// Ext.MessageBox.alert('提示', 'ID:' + node.id + " text:" +
				// node.text);
				// if (paraTablesPanel.getForm().isDirty())
				// paraTablesPanel.getForm().updateRecord(
				// store4.getAt(store4.find('para_id', Ext.getCmp(
				// 'tables_para_id').getValue())));
				// paraTablesPanel.getForm().loadRecord(
				// store4.getAt(store4.find('para_id', node.id)));
				// paraTablesPanel.getForm().clearDirty();
				// paraTablesPanel.getForm().reset();
				// paraTablesPanel.getForm().findField(0).setValue(node.attributes["para_desc"]);
				// paraTablesPanel.getForm().findField(1).setValue(node.attributes["para_type"]);
				// paraTablesPanel.getForm().findField(2).setValue(node.attributes["aig_name"]);
				// paraPanel.getForm().findField(2).setValue(node.para_id);
			});
			/*
			 * var rfcParaImportTree2 = new Ext.tree.TreePanel({ // loader : new
			 * Ext.tree.TreeLoader({ // baseAttrs : {} // dataUrl :
			 * './sapRfcDefine.ered?reqCode=rfcTreeInit' // }), root :
			 * paraImportRoot, title : '', // applyTo : 'rfcTreeDiv', autoScroll :
			 * false, animate : false, useArrows : false, border : false });
			 * rfcParaImportTree2.root.select(); rfcParaImportTree2.on('click',
			 * function(node) { para_id = node.attributes.id;
			 * store1.filter('para_id', para_id); });
			 */
			var rfcParaImportTree = new Ext.ux.tree.TreeGrid({
				title : '',
				root : paraImportRoot,
				animate : false,
				width : 195, // 必须指定,否则显示有问题
				height : 300,
				autoScroll : false,
				columns : [ {
					header : '参数ID',
					dataIndex : 'text',
					width : 175
				} ],
				useArrows : true,
				border : true
			});
			rfcParaImportTree.on("click", function(node, e) {
				var para_id = node.id;
				store1.filter('para_id', para_id);
				// Ext.MessageBox.alert('提示', 'ID:' + node.id + " text:" +
				// node.text);
				// if (paraImportPanel.getForm().isDirty()) {
				// alert("记录被修改！" +
				// Ext.getCmp('import_para_id').getValue());
				// paraImportPanel.getForm().updateRecord(
				// store1.getAt(store1.find('para_id', Ext.getCmp(
				// 'import_para_id').getValue())));
				// }
				// paraImportPanel.getForm().reset();
				// paraImportPanel.getForm().loadRecord(
				// store1.getAt(store1.find('para_id', node.id)));
				// paraImportPanel.getForm().clearDirty();
				// paraImportPanel.getForm().reset();
				// paraImportPanel.getForm().findField(0).setValue(node.attributes["para_desc"]);
				// paraImportPanel.getForm().findField(1).setValue(node.attributes["para_type"]);
				// paraImportPanel.getForm().findField(2).setValue(node.attributes["aig_name"]);
				// paraPanel.getForm().findField(2).setValue(node.para_id);
			});
			/*
			 * var rfcParaExportTree2 = new Ext.tree.TreePanel({ // loader : new
			 * Ext.tree.TreeLoader({ // baseAttrs : {} // dataUrl :
			 * './sapRfcDefine.ered?reqCode=rfcTreeInit' // }), root :
			 * paraExportRoot, title : '', // applyTo : 'rfcTreeDiv', autoScroll :
			 * false, animate : false, useArrows : false, border : false });
			 * rfcParaExportTree2.root.select(); rfcParaExportTree2.on('click',
			 * function(node) { para_id = node.attributes.id;
			 * store2.filter('para_id', para_id); });
			 */
			var rfcParaExportTree = new Ext.ux.tree.TreeGrid({
				title : '',
				root : paraExportRoot,
				animate : false,
				autoScroll : false,
				width : 195, // 必须指定,否则显示有问题
				height : 300,
				columns : [ {
					header : '参数ID',
					dataIndex : 'text',
					width : 175
				} ],
				useArrows : true,
				border : true
			});
			rfcParaExportTree.on("click", function(node, e) {
				var para_id = node.id;
				store2.filter('para_id', para_id);
				// Ext.MessageBox.alert('提示', 'ID:' + node.id + " text:" +
				// node.text);
				// if (paraExportPanel.getForm().isDirty()) {
				// paraExportPanel.getForm().updateRecord(
				// store2.getAt(store2.find('para_id', Ext.getCmp(
				// 'export_para_id').getValue())));
				// }
				// paraExportPanel.getForm().loadRecord(
				// store2.getAt(store2.find('para_id', node.id)));
				// paraExportPanel.getForm().clearDirty();
				// paraExportPanel.getForm().reset();
				// paraExportPanel.getForm().findField(0).setValue(node.attributes["para_desc"]);
				// paraExportPanel.getForm().findField(1).setValue(node.attributes["para_type"]);
				// paraExportPanel.getForm().findField(2).setValue(node.attributes["aig_name"]);
				// paraPanel.getForm().findField(2).setValue(node.para_id);
			});
			var gridParaExceptions = new Ext.grid.EditorGridPanel({
				// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
				title : '<span class="commoncss">例外参数维护</span>',
				height : 300,
				width : 785,
				autoScroll : true,
				frame : true,
				region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
				store : store5, // 数据存储
				stripeRows : true, // 斑马线
				cm : cm5, // 列模型
				clicksToEdit : 1, // 单击、双击进入编辑状态
				viewConfig : {
				// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
				// forceFit : false
				},
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				}
			});
			
			var timerForm = new Ext.form.FormPanel({
				name : 'addcodeForm',
				id :'addcodeForm',
				//width : 620,
				Height : 400,
				frame : true,
				layout : "auto",  
				labelAlign : "right",
				items : [
					{
	                    xtype: 'textfield',
	                    width: 350,
	                    hidden: true,
	                    //value: Ext.getCmp("rfc_name").getValue(),
	                    name: 'trigger_name'
	                },{
				    xtype: 'tabpanel',
				    //id :  'Mytable',
				    height: 300,
				   // width: 600,
				    activeTab: 0,
				    items: [
				        {
				            xtype: 'panel',
				            //id :  'Minute',
				            height: 300,
				            layout: 'absolute',
				            title: '分钟',
				            items: [
				                {
				                    xtype: 'radio',
				                    //id :  'Cyle',
				                    name: 'Cyle',
				                    boxLabel: '循环',
				                    checked: true,
				                    x: 10,
				                    y: 0,
				                	handler:function(){
				                    	if(timerForm.getForm().findField("Cyle").checked)
				                    	  {
				                    		Ext.getCmp('AXX1').setDisabled(true);
				                    		timerForm.getForm().findField('From').setDisabled(false);
				                    		timerForm.getForm().findField('every').setDisabled(false);
				                    		timerForm.getForm().findField('assign').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'displayfield',
				                    width: 100,
				                    value: '从',
				                    x: 60,
				                    y: 3
				                },
				                {
				                    xtype: 'numberfield',
				                    //id :  'From',
				                    width: 40,
				                    name: 'From',
				                    maxValue : 59,
				                    maxText : '最大值59',
				                    minValue :0,
				                    minText: '最小值0',
				                    allowNegative:false,
				                    allowDecimals:false,
				                    value: 0,
				                    x: 80,
				                    y: 0
				                },
				                {
				                    xtype: 'label',
				                    height: 20,
				                    text: '分钟开始',
				                    x: 130,
				                    y: 3
				                },
				                {
				                    xtype: 'displayfield',
				                    height: 20,
				                    width: 80,
				                    value: '每',
				                    x: 200,
				                    y: 3
				                },
				                {
				                    xtype: 'numberfield',
				                    //id :  'every',
				                    width: 60,
				                    name: 'every',
				                    maxValue : 59,
				                    maxText : '最大值59',
				                    minValue :0,
				                    minText: '最小值0',
				                    allowNegative:false,
				                    allowDecimals:false,
				                    value: 5,
				                    x: 230,
				                    y: 0
				                },
				                {
				                    xtype: 'label',
				                    text: '分钟执行一次',
				                    x: 300,
				                    y: 3
				                },
				                {
				                    xtype: 'radio',
				                    //id :  'assign',
				                    name: 'assign',
				                    boxLabel: '定义',
				                    x: 10,
				                    y: 30,
				                	handler:function(){
				                    	if(timerForm.getForm().findField("assign").checked)
				                    	  {
				                    		Ext.getCmp('AXX1').setDisabled(false);
				                    		timerForm.getForm().findField('From').setDisabled(true);
				                    		timerForm.getForm().findField('every').setDisabled(true);
				                    		timerForm.getForm().findField('Cyle').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'fieldset',
				                    disabled: true,
				                    id :  'AXX1',
				                    height: 190,
				                    width: 490,
				                    layout: 'column',
				                    title: '选择',
				                    x: 10,
				                    y: 60,
				                    items: [
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'MX1',
				                            width: 460,
				                            name: 'MX1',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M0',
				                                    itemId: '',
				                                    name: 'M0',
				                                    boxLabel: '0'
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M1',
				                                    name: 'M1',
				                                    boxLabel: 1
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M2',
				                                    name: 'M2',
				                                    boxLabel: 2
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M3',
				                                    name: 'M3',
				                                    boxLabel: 3
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M4',
				                                    name: 'M4',
				                                    boxLabel: 4
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M5',
				                                    name: 'M5',
				                                    boxLabel: 5
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M6',
				                                    name: 'M6',
				                                    boxLabel: 6
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M7',
				                                    name: 'M7',
				                                    boxLabel: 7
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M8',
				                                    name: 'M8',
				                                    boxLabel: 8
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M9',
				                                    name: 'M9',
				                                    boxLabel: 9
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'MX2',
				                            width: 460,
				                            name: 'MX2',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M10',
				                                    name: 'M10',
				                                    boxLabel: 10
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M11',
				                                    name: 'M11',
				                                    boxLabel: 11
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M12',
				                                    name: 'M12',
				                                    boxLabel: 12
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M13',
				                                    name: 'M13',
				                                    boxLabel: 13
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M14',
				                                    name: 'M14',
				                                    boxLabel: 14
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M15',
				                                    name: 'M15',
				                                    boxLabel: 15
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M16',
				                                    name: 'M16',
				                                    boxLabel: 16
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M17',
				                                    name: 'M17',
				                                    boxLabel: 17
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M18',
				                                    name: 'M18',
				                                    boxLabel: 18
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M19',
				                                    name: 'M19',
				                                    boxLabel: 19
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'MX3',
				                            width: 460,
				                            name: 'MX3',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M20',
				                                    name: 'M20',
				                                    boxLabel: 20
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M21',
				                                    name: 'M21',
				                                    boxLabel: 21
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M22',
				                                    name: 'M22',
				                                    boxLabel: 22
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M23',
				                                    name: 'M23',
				                                    boxLabel: 23
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M24',
				                                    name: 'M24',
				                                    boxLabel: 24
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M25',
				                                    name: 'M25',
				                                    boxLabel: 25
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M26',
				                                    name: 'M26',
				                                    boxLabel: 26
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M27',
				                                    name: 'M27',
				                                    boxLabel: 27
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M28',
				                                    name: 'M28',
				                                    boxLabel: 28
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M29',
				                                    name: 'M29',
				                                    boxLabel: 29
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'MX4',
				                            width: 460,
				                            name: 'MX4',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M30',
				                                    name: 'M30',
				                                    boxLabel: 30
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M31',
				                                    name: 'M31',
				                                    boxLabel: 31
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M32',
				                                    name: 'M32',
				                                    boxLabel: 32
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M33',
				                                    name: 'M33',
				                                    boxLabel: 33
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M34',
				                                    name: 'M34',
				                                    boxLabel: 34
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M35',
				                                    name: 'M35',
				                                    boxLabel: 35
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  36,
				                                    name: 36,
				                                    boxLabel: 36
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M37',
				                                    name: 'M37',
				                                    boxLabel: 37
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M38',
				                                    name: 'M38',
				                                    boxLabel: 38
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M39',
				                                    name: 'M39',
				                                    boxLabel: 39
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'MX5',
				                            width: 460,
				                            name: 'MX5',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M40',
				                                    name: 'M40',
				                                    boxLabel: 40
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M41',
				                                    name: 'M41',
				                                    boxLabel: 41
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M42',
				                                    name: 'M42',
				                                    boxLabel: 42
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M43',
				                                    name: 'M43',
				                                    boxLabel: 43
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M44',
				                                    name: 'M44',
				                                    boxLabel: 44
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M45',
				                                    name: 'M45',
				                                    boxLabel: 45
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M46',
				                                    name: 'M46',
				                                    boxLabel: 46
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M47',
				                                    name: 'M47',
				                                    boxLabel: 47
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M48',
				                                    name: 'M48',
				                                    boxLabel: 48
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M49',
				                                    name: 'M49',
				                                    boxLabel: 49
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'MX6',
				                            width: 460,
				                            name: 'MX6',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M50',
				                                    name: 'M50',
				                                    boxLabel: 50
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M51',
				                                    name: 'M51',
				                                    boxLabel: 51
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M52',
				                                    name: 'M52',
				                                    boxLabel: 52
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M53',
				                                    name: 'M53',
				                                    boxLabel: 53
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M54',
				                                    name: 'M54',
				                                    boxLabel: 54
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M55',
				                                    name: 'M55',
				                                    boxLabel: 55
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M56',
				                                    name: 'M56',
				                                    boxLabel: 56
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M57',
				                                    name: 'M57',
				                                    boxLabel: 57
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M58',
				                                    name: 'M58',
				                                    boxLabel: 58
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'M59',
				                                    name: 'M59',
				                                    boxLabel: 59
				                                }
				                            ]
				                        }
				                    ]
				                }
				            ]
				        },
				        {
				            xtype: 'panel',
				            //id :  'hour',
				            layout: 'absolute',
				            title: '小时',
				            items: [
				                {
				                    xtype: 'radio',
				                    //id :  'PHour',
				                    name: 'PHour',
				                    value: '每小时 ',
				                    boxLabel: '每小时 ',
				                    checked: true,
				                    x: 10,
				                    y: 0,
				                    handler:function(){
				                    	if(timerForm.getForm().findField("PHour").checked)
				                    	  {
				                    		Ext.getCmp('AXX2').setDisabled(true);
				                    		timerForm.getForm().findField('CHour').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'radio',
				                    //id :  'CHour',
				                    name: 'CHour',
				                    boxLabel: '定义',
				                    x: 10,
				                    y: 20,
				                    handler:function(){
				                    	if(timerForm.getForm().findField("CHour").checked)
				                    	  {
				                    		Ext.getCmp('AXX2').setDisabled(false);
				                    		timerForm.getForm().findField('PHour').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'fieldset',
				                    disabled: true,
				                    id :  'AXX2',
				                    height: 190,
				                    width: 490,
				                    layout: 'column',
				                    title: '选择',
				                    x: 10,
				                    y: 60,
				                    items: [
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'HH1',
				                            width: 460,
				                            name: 'HH1',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H0',
				                                    name: 'H0',
				                                    boxLabel: 'Z0'
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H1',
				                                    name: 'H1',
				                                    boxLabel: 1
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H2',
				                                    name: 'H2',
				                                    boxLabel: 2
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H3',
				                                    name: 'H3',
				                                    boxLabel: 3
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H4',
				                                    name: 'H4',
				                                    boxLabel: 4
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H5',
				                                    name: 'H5',
				                                    boxLabel: 5
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H6',
				                                    name: 'H6',
				                                    boxLabel: 6
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H7',
				                                    name: 'H7',
				                                    boxLabel: 7
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H8',
				                                    name: 'H8',
				                                    boxLabel: 8
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H9',
				                                    name: 'H9',
				                                    boxLabel: 9
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H10',
				                                    name: 'H10',
				                                    boxLabel: 10
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H11',
				                                    name: 'H11',
				                                    boxLabel: 11
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'HH2',
				                            width: 460,
				                            name: 'HH2',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H12',
				                                    name: 'H12',
				                                    boxLabel: 12
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H13',
				                                    name: 'H13',
				                                    boxLabel: 13
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H14',
				                                    name: 'H14',
				                                    boxLabel: 14
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H15',
				                                    name: 'H15',
				                                    boxLabel: 15
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H16',
				                                    name: 'H16',
				                                    boxLabel: 16
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H17',
				                                    name: 'H17',
				                                    boxLabel: 17
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H18',
				                                    name: 'H18',
				                                    boxLabel: 18
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H19',
				                                    name: 'H19',
				                                    boxLabel: 19
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H20',
				                                    name: 'H20',
				                                    boxLabel: 20
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H21',
				                                    name: 'H21',
				                                    boxLabel: 21
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H22',
				                                    name: 'H22',
				                                    boxLabel: 22
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'H23',
				                                    name: 'H23',
				                                    boxLabel: 23
				                                }
				                            ]
				                        }
				                    ]
				                }
				            ]
				        },
				        {
				            xtype: 'panel',
				            //id :  'day',
				            layout: 'absolute',
				            title: '天',
				            items: [
				                {
				                    xtype: 'radio',
				                    //id :  'perday',
				                    name: 'perday',
				                    boxLabel: '每天',
				                    checked: true,
				                    x: 10,
				                    y: 0,
				                    handler:function(){
				                    	if(timerForm.getForm().findField("perday").checked)
				                    	  {
				                    		Ext.getCmp('AXX3').setDisabled(true);
				                    		timerForm.getForm().findField('standday').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'radio',
				                    //id :  'standday',
				                    name: 'standday',
				                    boxLabel: '定义',
				                    x: 10,
				                    y: 30,
				                    handler:function(){
				                    	if(timerForm.getForm().findField("standday").checked)
				                    	  {
				                    		Ext.getCmp('AXX3').setDisabled(false);
				                    		timerForm.getForm().findField('perday').setValue(false);
				                    		timerForm.getForm().findField('Useweek').setValue("");
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'fieldset',
				                    disabled: true,
				                    id :  'AXX3',
				                    height: 190,
				                    width: 490,
				                    layout: 'column',
				                    title: '选择',
				                    x: 10,
				                    y: 60,
				                    items: [
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'DD1',
				                            width: 460,
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D1',
				                                    name: 'D1',
				                                    boxLabel: 1
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D2',
				                                    name: 'D2',
				                                    boxLabel: 2
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D3',
				                                    name: 'D3',
				                                    boxLabel: 3
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D4',
				                                    name: 'D4',
				                                    boxLabel: 4
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D5',
				                                    name: 'D5',
				                                    boxLabel: 5
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D6',
				                                    name: 'D6',
				                                    boxLabel: 6
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D7',
				                                    name: 'D7',
				                                    boxLabel: 7
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D8',
				                                    name: 'D8',
				                                    boxLabel: 8
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D9',
				                                    name: 'D9',
				                                    boxLabel: 9
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D10',
				                                    name: 'D10',
				                                    boxLabel: 10
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'DD2',
				                            width: 460,
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D11',
				                                    name: 'D11',
				                                    boxLabel: 11
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D12',
				                                    name: 'D12',
				                                    boxLabel: 12
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D13',
				                                    name: 'D13',
				                                    boxLabel: 13
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D14',
				                                    name: 'D14',
				                                    boxLabel: 14
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D15',
				                                    name: 'D15',
				                                    boxLabel: 15
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D16',
				                                    name: 'D16',
				                                    boxLabel: 16
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D17',
				                                    name: 'D17',
				                                    boxLabel: 17
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D18',
				                                    name: 'D18',
				                                    boxLabel: 18
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D19',
				                                    name: 'D19',
				                                    boxLabel: 19
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D20',
				                                    name: 'D20',
				                                    boxLabel: 20
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'DD3',
				                            width: 460,
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D21',
				                                    name: 'D21',
				                                    boxLabel: 21
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D22',
				                                    name: 'D22',
				                                    boxLabel: 22
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D23',
				                                    name: 'D23',
				                                    boxLabel: 23
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D24',
				                                    name: 'D24',
				                                    boxLabel: 24
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D25',
				                                    name: 'D25',
				                                    boxLabel: 25
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D26',
				                                    name: 'D26',
				                                    boxLabel: 26
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D27',
				                                    name: 'D27',
				                                    boxLabel: 27
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D28',
				                                    name: 'D28',
				                                    boxLabel: 28
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D29',
				                                    name: 'D29',
				                                    boxLabel: 29
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D30',
				                                    name: 'D30',
				                                    boxLabel: 30
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'DD4',
				                            width: 460,
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'D31',
				                                    name: 'D31',
				                                    boxLabel: 31
				                                }
				                            ]
				                        }
				                    ]
				                }
				            ]
				        },
				        {
				            xtype: 'panel',
				            //id :  'month',
				            layout: 'absolute',
				            title: '月',
				            items: [
				                {
				                    xtype: 'radio',
				                    //id :  'perMoth',
				                    name: 'perMoth',
				                    boxLabel: '每月',
				                    checked: true,
				                    x: 10,
				                    y: 0,
				                    handler:function(){
				                    	if(timerForm.getForm().findField("perMoth").checked)
				                    	  {
				                    		Ext.getCmp('AXX4').setDisabled(true);
				                    		timerForm.getForm().findField('Standmonth').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'radio',
				                    //id :  'Standmonth',
				                    name: 'Standmonth',
				                    boxLabel: '定义',
				                    x: 10,
				                    y: 30,
				                    handler:function(){
				                    	if(timerForm.getForm().findField("Standmonth").checked)
				                    	  {
				                    		Ext.getCmp('AXX4').setDisabled(false);
				                    		timerForm.getForm().findField('perMoth').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'fieldset',
				                    disabled: true,
				                    id :  'AXX4',
				                    height: 190,
				                    width: 490,
				                    layout: 'column',
				                    title: '选择',
				                    x: 10,
				                    y: 60,
				                    items: [
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'MonthM1',
				                            width: 460,
				                            name: 'MonthM1',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'MM1',
				                                    name: 'MM1',
				                                    boxLabel: 1
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'MM2',
				                                    name: 'MM2',
				                                    boxLabel: 2
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'MM3',
				                                    name: 'MM3',
				                                    boxLabel: 3
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'MM4',
				                                    name: 'MM4',
				                                    boxLabel: 4
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'MM5',
				                                    name: 'MM5',
				                                    boxLabel: 5
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'MM6',
				                                    name: 'MM6',
				                                    boxLabel: 6
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            //id :  'MonthM2',
				                            width: 460,
				                            name: 'MonthM2',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'MM7',
				                                    name: 'MM7',
				                                    boxLabel: 7
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'MM8',
				                                    name: 'MM8',
				                                    boxLabel: 8
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'MM9',
				                                    name: 'MM9',
				                                    boxLabel: 9
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'MM10',
				                                    name: 'MM10',
				                                    boxLabel: 10
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'MM11',
				                                    name: 'MM11',
				                                    boxLabel: 11
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    //id :  'MM12',
				                                    name: 'MM12',
				                                    boxLabel: 12
				                                }
				                            ]
				                        }
				                    ]
				                }
				            ]
				        },
				        {
				            xtype: 'panel',
				            //id :  'week',
				            layout: 'absolute',
				            title: '周',
				            items: [
				                {
				                    xtype: 'fieldset',
				                    disabled: true,
				                    id :  'AXX5',
				                    height: 190,
				                    width: 490,
				                    layout: 'vbox',
				                    title: '选择',
				                    x: 10,
				                    y: 40,
				                    items: [
				                        {
				                            xtype: 'fieldset',
				                            //id :  'XXW1',
				                            width: 460,
				                            layout: 'vbox',
				                            title: '周选择',
				                            flex: 1,
				                            items: [
				                                {
				                                    xtype: 'radio',
				                                    checked: true,
				                                    //id :  'perWeek',
				                                    height: 20,
				                                    name: 'perWeek',
				                                    boxLabel: '每周',
				                                    flex: 1,
				                                    handler:function(){
								                    	if(timerForm.getForm().findField("perWeek").checked)
								                    	  {
								                    		Ext.getCmp('Aweekxx1').setDisabled(true);
								                    		timerForm.getForm().findField('Standweek').setValue(false);
								                    	  }
								                    }
				                                },
				                                {
				                                    xtype: 'radio',
				                                    //id :  'Standweek',
				                                    height: 20,
				                                    name: 'Standweek',
				                                    boxLabel: '定义',
				                                    flex: 1,
				                                    handler:function(){
								                    	if(timerForm.getForm().findField("Standweek").checked)
								                    	  {
								                    		Ext.getCmp('Aweekxx1').setDisabled(false);
								                    		timerForm.getForm().findField('perWeek').setValue(false);
								                    	  }
								                    }
				                                },
				                                {
				                                    xtype: 'checkboxgroup',
				                                    disabled: true,
				                                    id :  'Aweekxx1',
				                                    name: 'weekxx1',
				                                    flex: 1,
				                                    items: [
				                                        {
				                                            xtype: 'checkbox',
				                                            //id :  'week1',
				                                            name: 'week1',
				                                            boxLabel: '星期天'
				                                        },
				                                        {
				                                            xtype: 'checkbox',
				                                            //id :  'week2',
				                                            name: 'week2',
				                                            boxLabel: '星期一'
				                                        },
				                                        {
				                                            xtype: 'checkbox',
				                                            //id :  'week3',
				                                            name: 'week3',
				                                            boxLabel: '星期二'
				                                        },
				                                        {
				                                            xtype: 'checkbox',
				                                            //id :  'week4',
				                                            name: 'week4',
				                                            boxLabel: '星期三'
				                                        },
				                                        {
				                                            xtype: 'checkbox',
				                                            //id :  'week5',
				                                            name: 'week5',
				                                            boxLabel: '星期四'
				                                        },
				                                        {
				                                            xtype: 'checkbox',
				                                            //id :  'week6',
				                                            name: 'week6',
				                                            boxLabel: '星期五'
				                                        },
				                                        {
				                                            xtype: 'checkbox',
				                                            //id :  'week7',
				                                            width: 460,
				                                            name: 'week7',
				                                            boxLabel: '星期六'
				                                        }
				                                    ]
				                                }
				                            ]
				                        }
				                    ]
				                },
				                {
				                    xtype: 'checkbox',
				                    //id :  'Useweek',
				                    name: 'Useweek',
				                    boxLabel: '使用周',
				                    x: 10,
				                    y: 10,
				                    handler:function(){
				                    	if(timerForm.getForm().findField(("Useweek").checked))
				                    	  {
				                    		Ext.getCmp('AXX5').setDisabled(false);
				                    		Ext.getCmp('AXX3').setDisabled(true);
				                    		timerForm.getForm().findField('perday').setValue(true);
				                    	  }else{
				                    		Ext.getCmp('AXX5').setDisabled(true);
				                    	  }
				                    }
				                }
				            ]
				        },{

				            xtype: 'panel',
				            layout: 'absolute',
				            title: '年',
				            items: [
				                {
				                    xtype: 'radio',
				                    //id: 'year',
				                    name: 'year',
				                    boxLabel: '年',
				                    x: 10,
				                    y: -2,
				                    handler:function(){
				                    	if(timerForm.getForm().findField("year").checked)
				                    	  {
				                    		timerForm.getForm().findField('yearfrom').setDisabled(false);
				                    		timerForm.getForm().findField('yearto').setDisabled(false);
				                    		timerForm.getForm().findField('standeryear').setValue(false);
				                    		Ext.getCmp('AXX6').setDisabled(true);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'displayfield',
				                    width: 59,
				                    value: '从',
				                    x: 50,
				                    y: 0
				                },
				                {
				                    xtype: 'datefield',
				                    width: 140,
				                    name: 'yearfrom',
				                    value:new Date(),
				                    format:'Y-m-d H:i',
				                    disabled: true,
				                    //readOnly: true,
				                    x: 80,
				                    y: 0
				                },{   
				                	xtype: 'displayfield',
				                    width: 30,
				                    value: '到',
				                    x: 240,
				                    y: 0
				                },
				                {
				                	xtype: 'datefield',
				                    width: 140,
				                    name: 'yearto',
				                    value:'2099-03-29 00:00',
				                    format:'Y-m-d H:i',
				                    disabled: true,
				                    //readOnly:true,
				                    x: 270,
				                    y: 0
				                },
				                {
				                    xtype: 'radio',
				                    //id : 'standeryear',
				                    name: 'standeryear',
				                    boxLabel: '特定年',
				                    x: 10,
				                    y: 30,
				                    handler:function(){
				                    	if(timerForm.getForm().findField("standeryear").checked)
				                    	  {
				                    		timerForm.getForm().findField('yearfrom').setDisabled(true);
				                    		timerForm.getForm().findField('yearto').setDisabled(true);
				                    		Ext.getCmp('AXX6').setDisabled(false);
				                    		timerForm.getForm().findField('year').setValue(false);
				                    	  }
				                    }
				                },
				                {
				                    xtype: 'fieldset',
				                    disabled: true,
				                    id: 'AXX6',
				                    height: 169,
				                    width: 460,
				                    layout: 'column',
				                    title: '选择',
				                    x: 10,
				                    y: 70,
				                    items: [
				                        {
				                            xtype: 'checkboxgroup',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    name: 'Y1',
				                                    boxLabel: 2012
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    name: 'Y2',
				                                    boxLabel: 2013
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    name: 'Y3',
				                                    boxLabel: 2014
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    name: 'Y4',
				                                    boxLabel: 2015
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    name: 'Y5',
				                                    boxLabel: 1016
				                                }
				                            ]
				                        },
				                        {
				                            xtype: 'checkboxgroup',
				                            items: [
				                                {
				                                    xtype: 'checkbox',
				                                    boxLabel: 2017,
				                                    name: 'Y6'
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    boxLabel: 2018,
				                                    name: 'Y7'
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    boxLabel: 2019,
				                                    name: 'Y8'
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    boxLabel: 2020,
				                                    name: 'Y9'
				                                },
				                                {
				                                    xtype: 'checkbox',
				                                    boxLabel: 2021,
				                                    name: 'Y10'
				                                }
				                            ]
				                        }
				                    ]
				                }
				            ]
				        
				        }
				    ]
				}]
			});
			
			
			var gridParaImport = new Ext.grid.EditorGridPanel({
				// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
				title : '<span class="commoncss">输入参数维护</span>',
				height : 300,
				width : 590,
				autoScroll : true,
				frame : true,
				region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
				store : store1, // 数据存储
				stripeRows : true, // 斑马线
				cm : cm1, // 列模型
				clicksToEdit : 1, // 单击、双击进入编辑状态
				viewConfig : {
				// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
				// forceFit : false
				},
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				}
			});
			var gridParaExport = new Ext.grid.EditorGridPanel({
				// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
				title : '<span class="commoncss">输出参数维护</span>',
				height : 300,
				width : 590,
				autoScroll : true,
				frame : true,
				region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
				store : store2, // 数据存储
				stripeRows : true, // 斑马线
				cm : cm1, // 列模型
				clicksToEdit : 1, // 单击、双击进入编辑状态
				viewConfig : {
				// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
				// forceFit : false
				},
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				}
			});
			var gridParaChanging = new Ext.grid.EditorGridPanel({
				// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
				title : '<span class="commoncss">更改参数维护</span>',
				height : 300,
				width : 300,
				autoScroll : true,
				frame : true,
				region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
				store : store3, // 数据存储
				stripeRows : true, // 斑马线
				cm : cm1, // 列模型
				clicksToEdit : 1, // 单击、双击进入编辑状态
				viewConfig : {
				// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
				// forceFit : false
				},
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				}
			});
			var gridParaTables = new Ext.grid.EditorGridPanel({
				// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
				title : '<span class="commoncss">SAP参数 ----></span>',
				height : 300,
				//width : 280,
				autoScroll : true,
				frame : true,
				region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
				store : store4, // 数据存储
				stripeRows : true, // 斑马线
				cm : cm4, // 列模型
				clicksToEdit : 1, // 单击、双击进入编辑状态
				viewConfig : {
				// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
				// forceFit : false
				},
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				}
			});			
			var gridParaTables2 = new Ext.grid.EditorGridPanel({
				// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
				title : '<span class="commoncss">AIG参数</span>',
				height : 300,
				//width : 300,
				autoScroll : true,
				frame : true,
				region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
				store : store4, // 数据存储
				stripeRows : true, // 斑马线
				cm : cm9, // 列模型
				clicksToEdit : 1, // 单击、双击进入编辑状态
				viewConfig : {
				// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
				// forceFit : false
				},
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				},
				listeners :{
					bodyscroll: function(){
						
					}
				} 
			});
			
			
			var cm10 = new Ext.grid.ColumnModel([reportRownum, {
					    header : '字段名称', // 列标题
						dataIndex : 'field', // 数据索引:和Store模型对应
						width: 150
				   } ,{
					    header : '是否存在', // 列标题
						dataIndex : 'field', // 数据索引:和Store模型对应
						renderer : desctableRender ,
						width: 110
				   } ,{
					    header : '字段类型 ', // 列标题
						dataIndex : 'type', // 数据索引:和Store模型对应
						width: 100
				   } ]);			
			/**
			 * 数据存储
			 */
			var store10 = new Ext.data.Store({
						// 获取数据的方式
						proxy : new Ext.data.HttpProxy({
									url : './jobMange.ered?reqCode=getTableDesc'
						}),
						// 数据读取器
						reader : new Ext.data.JsonReader({
									totalProperty : 'TOTALCOUNT', // 记录总数
									root : 'ROOT' // Json中的列表数据根节点
								}, [{
											name : 'field' // Json中的属性Key值
									},{
										    name : 'type'
									}
						 ])
					});			
			var gridDescTable = new Ext.grid.EditorGridPanel({
				// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
				title : '<span class="commoncss">AIG参数</span>',
				height : 300,
				//width : 300,
				autoScroll : true,
				frame : true,
				region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
				store : store10, // 数据存储
				stripeRows : true, // 斑马线
				cm : cm10, // 列模型
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				}
			});			
			
		var	gridDescWindow = new Ext.Window({
				layout : 'fit',
				width : 460,
				height : 400,
				resizable : false,
				draggable : true,
				closeAction : 'hide',
				title : '<span class="commoncss">表结构</span>',
			    iconCls : 'page_edit_1Icon',
				modal : true,
				collapsible : true,
				titleCollapse : true,
				maximizable : false,
				buttonAlign : 'right',
				border : false,
				animCollapse : true,
				animateTarget : Ext.getBody(),
				constrain : true,
				items : [gridDescTable],
				buttons : [{
					text : '关闭',
					iconCls : 'deleteIcon',
					handler : function() {
						gridDescWindow.hide();
					}
				}]
			});				
			
			var paraChangingPanel, paraImportPanel, paraExportPanel, paraTablesPanel;
			paraImportPanel = new Ext.form.FormPanel({
				id : 'paraImportForm',
				name : 'paraImportForm',
				labelAlign : 'right',
				labelWidth : 60,
				frame : true,
				bodyStyle : 'padding:5 5 0',
				clearDirty : function() {
					this.items.each(function(item) {
						item.originalValue = item.getValue();
					});
				},
				items : [ {
					layout : 'column',
					border : false,
					items : [ {
						columnWidth : .5,
						layout : 'form',
						border : false,
						defaultType : 'textfield',
						items : [ {
							id : 'import_para_id',
							name : 'import_para_id',
							dataIndex : 'para_id',
							hidden : true,
							readOnly : true
						// 设置只读属性
						}, {
							fieldLabel : '功能名称',
							id : 'import_para_name',
							name : 'import_para_name',
							dataIndex : 'para_name',
							readOnly : true
						// 设置只读属性
						}, {
							fieldLabel : '功能描述',
							id : 'import_para_desc',
							name : 'import_para_desc',
							dataIndex : 'para_desc',
							readOnly : true
						// 设置只读属性
						}, {
							fieldLabel : '参数类型',
							id : 'import_para_type',
							name : 'import_para_type',
							dataIndex : 'para_type',
							readOnly : true
						// 设置只读属性
						}, {
							fieldLabel : '参数长度',
							id : 'import_para_length',
							name : 'import_para_length',
							dataIndex : 'para_length',
							readOnly : true
						// 设置只读属性
						}, new Ext.form.Checkbox({
							id : 'import_para_optional',
							name : 'import_para_optional',
							dataIndex : 'para_optional',
							fieldLabel : '可选',
							readOnly : true
						// 设置只读属性
						}) ]
					}, {
						columnWidth : .5,
						layout : 'form',
						labelWidth : 80, // 标签宽度
						defaultType : 'textfield',
						border : false,
						items : [ {
							fieldLabel : 'AIG名称',
							id : 'import_aig_name',
							name : 'import_aig_name',
							dataIndex : 'aig_name'

						}, {
							fieldLabel : 'AIG描述',
							id : 'import_aig_desc',
							name : 'import_aig_desc',
							dataIndex : 'aig_desc'
						}, {
							fieldLabel : 'AIG类型',
							id : 'import_aig_type',
							name : 'import_aig_type',
							dataIndex : 'aig_type'
						}, {
							fieldLabel : 'AIG长度',
							id : 'import_aig_length',
							name : 'import_aig_length',
							dataIndex : 'aig_length'
						}, {
							fieldLabel : '排序号',
							id : 'import_sortno',
							name : 'import_sortno',
							dataIndex : 'sortno'
						} ]
					} ]
				}, {

					fieldLabel : '备注',
					xtype : 'textarea',
					id : 'import_remark',
					name : 'import_remark',
					dataIndex : 'remark',
					// height : 50, // 设置多行文本框的高度
					anchor : '80%'
				}, {
					layout : 'column',
					border : false,
					items : [ {
						columnWidth : .33,
						layout : 'form',
						labelWidth : 80, // 标签宽度
						border : false,
						items : [ {

							type : new Ext.form.ComboBox({
								store : ENABLEDStore,
								mode : 'local',
								triggerAction : 'all',
								valueField : 'value',
								displayField : 'text',
								allowBlank : false,
								forceSelection : true,
								header : '启用状态',
								dataIndex : 'enable',
								renderer : ENABLEDRender,
								typeAhead : true
							})
						} ]
					}, {
						columnWidth : .33,
						layout : 'form',
						labelWidth : 80, // 标签宽度
						border : false,
						items : [ {

							type : new Ext.form.ComboBox({
								store : EDITMODEStore,
								mode : 'local',
								triggerAction : 'all',
								valueField : 'value',
								displayField : 'text',
								allowBlank : false,
								forceSelection : true,
								header : '启用状态',
								dataIndex : 'editmode',
								width : 80,
								renderer : EDITMODERender,
								typeAhead : true
							})

						} ]
					} ]
				} ]

			});
			paraExportPanel = new Ext.form.FormPanel({
				id : 'paraExportForm',
				name : 'paraExportForm',
				labelAlign : 'right',
				labelWidth : 60,
				frame : true,
				bodyStyle : 'padding:5 5 0',
				defaultType : 'textfield',
				clearDirty : function() {
					this.items.each(function(item) {
						item.originalValue = item.getValue();
					});
				},
				items : [ {
					id : 'export_para_id',
					name : 'export_para_id',
					dataIndex : 'para_id',
					hidden : true
				}, {
					fieldLabel : '功能名称',
					name : 'export_para_name',
					id : 'export_para_name',
					dataIndex : 'para_name',
					allowBlank : false,
					labelStyle : micolor,
					anchor : '99%'
				}, {
					fieldLabel : '功能名称',
					id : 'export_para_desc',
					name : 'export_para_desc',
					dataIndex : 'para_desc',
					hidden : false
				}, {
					fieldLabel : 'AIG名称',
					id : 'export_aig_name',
					name : 'export_aig_name',
					dataIndex : 'aig_name',
					hidden : false
				} ]
			});
			paraChangingPanel = new Ext.form.FormPanel({
				id : 'paraChangingForm',
				name : 'paraForm',
				labelAlign : 'right',
				labelWidth : 60,
				frame : true,
				bodyStyle : 'padding:5 5 0',
				defaultType : 'textfield',
				clearDirty : function() {
					this.items.each(function(item) {
						item.originalValue = item.getValue();
					});
				},
				items : [ {
					id : 'changing_para_id',
					name : 'changing_para_id',
					dataIndex : 'para_id',
					hidden : true
				}, {
					fieldLabel : '功能名称',
					name : 'changing_para_name',
					id : 'changing_para_name',
					dataIndex : 'para_name',
					allowBlank : false,
					labelStyle : micolor,
					anchor : '99%'
				}, {
					fieldLabel : '功能名称',
					id : 'changing_para_desc',
					name : 'changing_para_desc',
					dataIndex : 'para_desc',
					hidden : false
				}, {
					fieldLabel : 'AIG名称',
					id : 'changing_aig_name',
					name : 'changing_aig_name',
					dataIndex : 'aig_name',
					hidden : false
				} ]
			});
			paraTablesPanel = new Ext.form.FormPanel({
				id : 'paraTablesForm',
				name : 'paraTablesForm',
				labelAlign : 'right',
				labelWidth : 60,
				frame : true,
				bodyStyle : 'padding:5 5 0',
				defaultType : 'textfield',
				clearDirty : function() {
					this.items.each(function(item) {
						item.originalValue = item.getValue();
					});
				},
				items : [ {
					fieldLabel : 'para_id',
					id : 'tables_para_id',
					name : 'tables_para_id',
					dataIndex : 'para_id',
					hidden : true
				}, {
					fieldLabel : '功能名称',
					name : 'tables_para_name',
					id : 'tables_para_name',
					dataIndex : 'para_name',
					allowBlank : false,
					labelStyle : micolor,
					anchor : '99%'
				}, {
					fieldLabel : '功能名称',
					id : 'tables_para_desc',
					name : 'tables_para_desc',
					dataIndex : 'para_desc',
					hidden : false
				}, {
					fieldLabel : 'AIG名称',
					id : 'tables_aig_name',
					name : 'tables_aig_name',
					dataIndex : 'aig_name',
					hidden : false
				} ]
			});
			var grid = new Ext.grid.GridPanel({
				title : '<span class="commoncss">RFC功能列表</span>',
				iconCls : 'application_view_listIcon',
				height : 510,
				store : store,
				region : 'center',
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				},
				stripeRows : true,
				frame : true,
				cm : cm,
				sm : sm,
				tbar : [ {
					text : '新增',
					iconCls : 'page_addIcon',
					handler : function() {
						addInit();
					}
				}, '-', {
					text : '修改',
					iconCls : 'page_edit_1Icon',
					handler : function() {
						editInit();
					}
				}, '-', {
					text : '删除',
					iconCls : 'page_delIcon',
					handler : function() {
						deleteRfcItems();
					}
				}, '-', {
					text : '手动同步',
					iconCls : 'cupIcon',
					handler : function() {
							var rows = grid.getSelectionModel().getSelections();
							if (Ext.isEmpty(rows)) {
								Ext.Msg.alert('提示', '请先选中项目!');
								return;
							}
							var strChecked = jsArray2JsString(rows, 'trigger_name');
							Ext.Ajax.request({
												url : './jobMange.ered?reqCode=jobSyncByHand',
												success : function(response) {
														var resultArray = Ext.util.JSON.decode(response.responseText);
												    	if(resultArray.result == 'yes'){
													    		Ext.Msg.alert('提示', '正在同步数据');
													    	}else{
													    		Ext.Msg.alert('提示', '同步失败');
													    }													
												},
												failure : function(response) {
														Ext.Msg.alert('提示', '同步失败');
												},
												params : {
													strChecked : strChecked
												}
							});						
					}
				}, '-', {
					text : '同步操作',
					iconCls : 'commentsIcon',
					handler : function() {
						syncProcess();
					}
				}, '-', '->', new Ext.form.TextField({
					id : 'queryParam',
					name : 'queryParam',
					emptyText : '功能名称',
					enableKeyEvents : true,
					listeners : {
						specialkey : function(field, e) {
							if (e.getKey() == Ext.EventObject.ENTER) {
								queryRfcItem();
							}
						}
					},
					width : 130
				}), {
					text : '查询',
					iconCls : 'previewIcon',
					handler : function() {
						queryRfcItem();
					}
				}, '-', {
					text : '刷新',
					iconCls : 'arrow_refreshIcon',
					handler : function() {
						store.reload();
					}
				} ],
				bbar : bbar
			});
			store.reload({
				params : {
					start : 0,
					limit : bbar.pageSize
				}
			});

			grid.addListener('rowdblclick', rfcWindow);
			grid.on('sortchange', function() {
				// grid.getSelectionModel().selectFirstRow();
			});

			bbar.on("change", function() {
				// grid.getSelectionModel().selectFirstRow();
			});
			/**
			 * 新增代码对照表
			 */
			var rfcWindow;
			var formPanel;
			var leafCombo = new Ext.form.ComboBox({
				name : 'leaf',
				hiddenName : 'leaf',
				store : LEAFStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				value : '0',
				fieldLabel : '叶节点',
				emptyText : '请选择...',
				labelStyle : micolor,
				allowBlank : false,
				forceSelection : true,
				editable : false,
				disabled : false,
				typeAhead : true,
				anchor : '100%'
			});
			var enabledCombo = new Ext.form.ComboBox({
				id : 'enabledCombo',
				name : 'enabled',
				hiddenName : 'enabled',
				store : ENABLEDStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				value : '0',
				fieldLabel : '启用状态',
				emptyText : '请选择...',
				labelStyle : micolor,
				allowBlank : false,
				forceSelection : true,
				editable : false,
				disabled : false,
				typeAhead : true,
				anchor : '100%'
			});
			var editmodeCombo = new Ext.form.ComboBox({
				name : 'editmode',
				hiddenName : 'editmode',
				typeAhead : true,
				triggerAction : 'all',
				lazyRender : true,
				mode : 'local',
				store : EDITMODEStore,
				valueField : 'value',
				displayField : 'text',
				anchor : '100%',
				value : '1',
				editable : false,
				allowBlank : false,
				labelStyle : micolor,
				emptyText : '请选择...',
				fieldLabel : '编辑模式'
			});
			var addRoot = new Ext.tree.AsyncTreeNode({
				text : 'RFC功能树',
				expanded : true,
				id : '001'
			});
			var addRfcTree = new Ext.tree.TreePanel({
				loader : new Ext.tree.TreeLoader({
					baseAttrs : {},
					dataUrl : './sapRfcDefine.ered?reqCode=rfcTreeInit'
				}),
				root : addRoot,
				autoScroll : true,
				animate : false,
				useArrows : false,
				border : false
			});
			// 监听下拉树的节点单击事件
			addRfcTree.on('click', function(node) {
				comboxWithTree.setValue(node.text);
				Ext.getCmp("rfcForm").findById('parent_id').setValue(
						node.attributes.id);
				comboxWithTree.collapse();
			});

			var comboxWithTree = new Ext.form.ComboBox(
					{
						id : 'parentrfcname',
						store : new Ext.data.SimpleStore({
							fields : [],
							data : [ [] ]
						}),
						editable : false,
						value : ' ',
						emptyText : '请选择...',
						fieldLabel : '上级分类',
						anchor : '100%',
						mode : 'local',
						triggerAction : 'all',
						labelStyle : micolor,
						maxHeight : 390,
						// 下拉框的显示模板,addDeptTreeDiv作为显示下拉树的容器
						tpl : "<tpl for='.'><div style='height:390px'><div id='addRfcTreeDiv'></div></div></tpl>",
						allowBlank : false,
						onSelect : Ext.emptyFn
					});
			// 监听下拉框的下拉展开事件
			comboxWithTree.on('expand', function() {
				// 将UI树挂到treeDiv容器
				addRfcTree.render('addRfcTreeDiv');
				// addDeptTree.root.expand(); //只是第一次下拉会加载数据
				addRfcTree.root.reload(); // 每次下拉都会加载数据

			});

			formPanel = new Ext.form.FormPanel({
				id : 'rfcForm',
				name : 'rfcForm',
				labelAlign : 'right',
				labelWidth : 60,
				frame : true,
				bodyStyle : 'padding:5 5 0',
				defaultType : 'textfield',
				items : [ {
					fieldLabel : '功能名称',
					name : 'rfc_name',
					id : 'rfc_name',
					allowBlank : false,
					labelStyle : micolor,
					anchor : '99%'
				}, {
					fieldLabel : 'SAP函数名',
					id : 'saprfcname',
					name : 'saprfcname',
					allowBlank : true,
					anchor : '99%'
				}, comboxWithTree, {
					fieldLabel : '排序号',
					name : 'sortno',
					allowBlank : true,
					anchor : '99%'
				}, {
					fieldLabel : '备注',
					name : 'remark',
					allowBlank : true,
					xtype : 'textarea',
					anchor : '99%'
				}, leafCombo, enabledCombo, editmodeCombo, {
					id : 'parent_id',
					name : 'parent_id',
					hidden : true
				}, {
					id : 'windowmode',
					name : 'windowmode',
					hidden : true
				}, {
					id : 'rfc_id',
					name : 'rfc_id',
					hidden : true
				}, {
					id : 'parentid_old',
					name : 'parentid_old',
					hidden : true
				} ]
			});

			var tabs = new Ext.TabPanel({
				id : 'tabs',
				name : 'tabs',
				region : 'center',
				enableTabScroll : true,
				autoWidth : true,
				height : 350
//				autoHeight : true
			});
			// 每一个Tab都可以看作为一个Panel
			tabs.add({
				id : 'basis',
				title : '<span class="commoncss">基础信息</span>',
				items : [ formPanel ],

				// tbar:tb, //工具栏
				// items:[],
				iconCls : 'book_previousIcon', // 图标
				closable : true
			});
			tabs.add({
				id : 'import',
				title : '<span class="commoncss">输入参数</span>',
				layout : 'column',
				border : false,
				items : [ {
					columnWidth : .25,
					layout : 'form',
					border : false,
					items : [ rfcParaImportTree ]
				}, {
					columnWidth : .75,
					layout : 'form',
					labelWidth : 80, // 标签宽度
					border : false,
					// items : [ paraImportPanel ]
					items : [ gridParaImport ]
				} ]
			// html : '输入参数信息'
			});
			tabs.add({
				id : 'export',
				title : '<span class="commoncss">输出参数</span>',
				layout : 'column',
				border : false,
				items : [ {
					columnWidth : .25,
					layout : 'form',
					border : false,
					items : [ rfcParaExportTree ]
				}, {
					columnWidth : .75,
					layout : 'form',
					labelWidth : 80, // 标签宽度
					defaultType : 'textfield',
					border : false,
					// items : [ paraExportPanel ]
					items : [ gridParaExport ]
				} ]
			});
			tabs.add({
				id : 'changing',
				title : '<span class="commoncss">修改参数</span>',
				layout : 'column',
				border : false,
				items : [ {
					columnWidth : .25,
					layout : 'form',
					border : false,
					items : [ rfcParaChangingTree ]
				}, {
					columnWidth : .75,
					layout : 'form',
					labelWidth : 80, // 标签宽度
					defaultType : 'textfield',
					border : false,
					// items : [ paraChangingPanel ]
					items : [ gridParaChanging ]
				} ]
			});
			tabs.add({
				id : 'tables',
				title : '<span class="commoncss">表参数</span>',
				layout : 'column',
				border : false,
				items : [ {
					columnWidth : .20,
					layout : 'form',
					border : false,
					items : [ rfcParaTablesTree ]
				}, {
					columnWidth : .35,
					layout : 'form',
					labelWidth : 80, // 标签宽度
					defaultType : 'textfield',
					border : false,
					// items : [ paraTablesPanel ]
					items : [ gridParaTables ]
				}, {
					columnWidth : .45,
					layout : 'form',
					labelWidth : 80, // 标签宽度
					defaultType : 'textfield',
					border : false,
					// items : [ paraTablesPanel ]
					items : [ gridParaTables2 ]
				}  ]
			});
			
			
			tabs.add({
				id : 'exceptions',
				title : '<span class="commoncss">例外参数</span>',
				items : [ gridParaExceptions ]
			});
/**			
			tabs.add({//添加定时功能
				id : 'time',
				title : '<span class="commoncss">定时同步功能</span>',
				layout : 'column',
				border : false,
				items : [ timerForm ]
			});
**/			
			
			
			tabs.activate(0);

			rfcWindow = new Ext.Window({
				layout : 'fit',
				width : 800,
				height : 400,
				resizable : false,
				draggable : true,
				closeAction : 'hide',
				title : '<span class="commoncss">新增Rfc数据</span>',
				// iconCls : 'page_addIcon',
				modal : true,
				collapsible : true,
				titleCollapse : true,
				maximizable : false,
				buttonAlign : 'right',
				border : false,
				animCollapse : true,
				animateTarget : Ext.getBody(),
				constrain : true,
				items : [ tabs ],
				buttons : [ {

					text : '切换',
					iconCls : 'acceptIcon',
					id : 'btnSwitch',
					handler : function() {
						var activeTab = tabs.getActiveTab();
						var index = tabs.items.indexOf(activeTab);
						switch (index) {
						case 0:
							tabs.setActiveTab(1);
							break
						case 1:
							tabs.setActiveTab(2);
							break
						case 2:
							tabs.setActiveTab(3);
							break
						case 3:
							tabs.setActiveTab(4);
							break
						case 4:
							tabs.setActiveTab(5);
							break
						case 5:
							tabs.setActiveTab(0);
							break
						default:
							tabs.setActiveTab(0);
						}

					}
				}, {

					text : '同步SAP',
					iconCls : 'arrow_refreshIcon',
					id : 'btnSyncSAP',
					handler : function() {
						syncRfcItems();
					}
				}, 
				{
					text : '重置缓存',
					iconCls : 'arrow_refreshIcon',
					id : 'btnResetCache',
					handler : function() {
						modifyAigCache();
					}
				},
				{
					text : '保存参数',
					iconCls : 'acceptIcon',
					handler : function() {
						saveRfcAllItems();
					}
				}, 
			/**	
				{
					text : '保存同步信息',
					iconCls : 'acceptIcon',
					handler : function() {
						saveSynchronismInfo();
					}
				},
				**/{
					text : '重置',
					id : 'btnReset',
					iconCls : 'tbar_synchronizeIcon',
					handler : function() {
						clearForm(Ext.getCmp('rfcForm').form);
					}
				}, {
					text : '关闭',
					iconCls : 'deleteIcon',
					handler : function() {
						rfcWindow.hide();
					}
				} ]
			});

			/**
			 * 布局
			 */
			var viewport = new Ext.Viewport({
				// layout : 'border',
				// items : [ grid ]
				// });
				layout : 'border',
				items : [ {
					title : '<span class="commoncss">SAP函数</span>',
					iconCls : 'app_boxesIcon',
					tools : [ {
						id : 'refresh',
						handler : function() {
							rfcTree.root.reload()
						}
					} ],
					collapsible : true,
					width : 210,
					minSize : 160,
					maxSize : 280,
					split : true,
					region : 'west',
					autoScroll : true,
					// collapseMode:'mini',
					items : [ rfcTree ]
				}, {
					region : 'center',
					layout : 'fit',
					border : false,
					items : [ grid ]
				} ]
			});
			/**
			 * 新增功能初始化
			 */
			function addInit() {
				Ext.getCmp('btnReset').hide();
				Ext.getCmp('btnSwitch').hide();
				Ext.getCmp('btnSyncSAP').hide();
				Ext.getCmp('btnResetCache').hide();
				Ext.getCmp('enabledCombo').setDisabled(false);
				// clearForm(addDeptFormPanel.getForm());
				var flag = Ext.getCmp('windowmode').getValue();
				if (typeof (flag) != 'undefined') {
					Ext.getCmp('rfcForm').form.getEl().dom.reset();
				} else {
					clearForm(Ext.getCmp('rfcForm').form);
				}
				var selectModel = rfcTree.getSelectionModel();
				var selectNode = selectModel.getSelectedNode();
				Ext.getCmp('parentrfcname')
						.setValue(selectNode.attributes.text);
				Ext.getCmp('parent_id').setValue(selectNode.attributes.id);

				
				rfcWindow.show();
				tabs.setActiveTab(0);
				tabs.hideTabStripItem(1);
				tabs.hideTabStripItem(2);
				tabs.hideTabStripItem(3);
				tabs.hideTabStripItem(4);
				tabs.hideTabStripItem(5);
				tabs.hideTabStripItem(6);
				rfcWindow.setTitle('<span class="commoncss">新增RFC功能</span>');
				Ext.getCmp('windowmode').setValue('add');
				comboxWithTree.setDisabled(false);

			}
			/**
			 * 刷新指定节点
			 */
			function refreshNode(nodeid) {
				var node = rfcTree.getNodeById(nodeid);
				/* 异步加载树在没有展开节点之前是获取不到对应节点对象的 */
				if (Ext.isEmpty(node)) {
					rfcTree.root.reload();
					return;
				}
				if (node.attributes.leaf) {
					node.parentNode.reload();
				} else {
					node.reload();
				}
			}
			/**
			 * 刷新store1-store5
			 */	
			function reloadStore(tmprfc_id) {	
//				store1.removeAll();
				store1
						.load({
							params : {
								start : 0,
								limit : 1000,
								rfctable : 'sap_rfcimport',
								rfc_id : tmprfc_id
							},
							callback : function() {

								if (store1.getCount() > 0) {
									rfcParaImportTree.getLoader().baseParams.rfc_id = tmprfc_id;
									rfcParaImportTree.getLoader().baseParams.rfctable = 'sap_rfcimport';
									rfcParaImportTree.getLoader().dataUrl = './sapRfcDefine.ered?reqCode=paraTreeInit';
									rfcParaImportTree.getLoader().load(
											rfcParaImportTree.getRootNode(),
											function() {
											});
									tabs.unhideTabStripItem(1);
								} else {
									tabs.hideTabStripItem(1);

								}
								msgTip.hide();    // 加载完成，关闭提示框
							}
						});

//				store2.removeAll();
				store2
						.load({
							params : {
								start : 0,
								limit : 1000,
								rfctable : 'sap_rfcexport',
								rfc_id : tmprfc_id
							},
							callback : function() {
								if (store2.getTotalCount() > 0) {
									rfcParaExportTree.getLoader().baseParams.rfc_id = tmprfc_id;
									rfcParaExportTree.getLoader().baseParams.rfctable = 'sap_rfcexport';
									rfcParaExportTree.getLoader().dataUrl = './sapRfcDefine.ered?reqCode=paraTreeInit';
									rfcParaExportTree.getLoader().load(
											rfcParaExportTree.getRootNode(),
											function() {
											});
									tabs.unhideTabStripItem(2);
									tabs.unhideTabStripItem(6);
								} else {
									tabs.hideTabStripItem(2);

								}
								msgTip.hide();    // 加载完成，关闭提示框

							}
						});
//				store3.removeAll();
				store3
						.load({
							params : {
								start : 0,
								limit : 1000,
								rfctable : 'sap_rfcchanging',
								rfc_id : tmprfc_id
							},
							callback : function() {
								if (store3.getTotalCount() > 0) {
									rfcParaChangingTree.getLoader().baseParams.rfc_id = tmprfc_id;
									rfcParaChangingTree.getLoader().baseParams.rfctable = 'sap_rfcchanging';
									rfcParaChangingTree.getLoader().dataUrl = './sapRfcDefine.ered?reqCode=paraTreeInit';
									rfcParaChangingTree.getLoader().load(
											rfcParaChangingTree.getRootNode(),
											function() {
											});
									tabs.unhideTabStripItem(3);
								} else {
									tabs.hideTabStripItem(3);

								}
								msgTip.hide();    // 加载完成，关闭提示框

							}
						});
//				store4.removeAll();
				store4
						.load({
							params : {
								start : 0,
								limit : 1000,
								rfctable : 'sap_rfctables',
								rfc_id : tmprfc_id
							},
							callback : function() {
								if (store4.getTotalCount() > 0) {
									rfcParaTablesTree.getLoader().baseParams.rfc_id = tmprfc_id;
									rfcParaTablesTree.getLoader().baseParams.rfctable = 'sap_rfctables';
									rfcParaTablesTree.getLoader().dataUrl = './sapRfcDefine.ered?reqCode=paraTreeInit';
									rfcParaTablesTree.getLoader().load(
											rfcParaTablesTree.getRootNode(),
											function() {
											});
									tabs.unhideTabStripItem(4);
									Ext.getCmp('btnResetCache').show();
//									Ext.getCmp('btnSyncAig').show();
								} else {
									tabs.hideTabStripItem(4);
									Ext.getCmp('btnResetCache').hide();
//									Ext.getCmp('btnSyncAig').hide();
								}
								msgTip.hide();    // 加载完成，关闭提示框

							}
						});
//				store5.removeAll();
				store5.load({
					params : {
						start : 0,
						limit : 1000,
						rfctable : 'sap_rfcexceptions',
						rfc_id : tmprfc_id
					},
					callback : function() {
						if (store5.getTotalCount() > 0) {
							tabs.unhideTabStripItem(5);
						} else
							tabs.hideTabStripItem(5);
						msgTip.hide();    // 加载完成，关闭提示框

					}
				});
				
			}
			/**
			 * 初始化代码修改出口
			 */
			function editInit() {
				var record = grid.getSelectionModel().getSelected();
				if (Ext.isEmpty(record)) {
					Ext.Msg.alert('提示', '请先选中要修改的项目');
					return;
				}				
				var rfcname = record.get('saprfcname');
				if (Ext.isEmpty(record)) {
					Ext.MessageBox.alert('提示', '请先选择要修改的RFC功能!');
					return;
				}
				record = grid.getSelectionModel().getSelected();
				if (record.get('leaf') == '0') {
					comboxWithTree.setDisabled(true);
				} else {
					comboxWithTree.setDisabled(false);
				}
				if (record.get('rfc_id') == '001') {
					var a = Ext.getCmp('parentrfcname');
					a.emptyText = '已经是顶级分类';
				} else {
				}
				Ext.getCmp('rfcForm').form.loadRecord(record);
				rfcWindow.show();
				var tmprfc_id = record.get('rfc_id');
				rfcWindow
						.setTitle('<span style="font-weight:normal">修改RFC功能</span>');
				Ext.getCmp('windowmode').setValue('edit');
				Ext.getCmp('parentid_old').setValue(record.get('parent_id'));
				Ext.getCmp('enabledCombo').setDisabled(true);
				Ext.getCmp('btnReset').hide();
				Ext.getCmp('btnSwitch').hide();
				Ext.getCmp('btnSyncSAP').show();
				Ext.getCmp('btnResetCache').hide();
				

				tabs.setActiveTab(0);
				reloadStore(tmprfc_id);
			}

			/**
			 * 同步SAP RFC数据
			 */
			function syncRfcItems() {
				if (!Ext.getCmp('rfcForm').form.isValid()) {
					return;
				}
				var rfc_id = Ext.getCmp('rfc_id').getValue();
				var saprfcname = Ext.getCmp('saprfcname').getValue();
				Ext.getCmp('rfcForm').form.submit({
					url : './sapRfcDefine.ered?reqCode=syncRfcItems',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						// rfcWindow.hide();
						reloadStore(rfc_id);

						// form.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', 'SAP RFC数据同步失败:<br>' + msg);
					},
					params : {
						rfc_id : rfc_id,
						saprfcname : saprfcname
					}
				});
			}

			/**
			 * 修改RFC数据
			 */
			function updateRfcItem() {
				if (!Ext.getCmp('rfcForm').form.isValid()) {
					return;
				}
				var parent_id = Ext.getCmp('parent_id').getValue();
				var parentid_old = Ext.getCmp('parentid_old').getValue();
				Ext.getCmp('rfcForm').form.submit({
					url : './sapRfcDefine.ered?reqCode=updateRfcItem',
					waitTitle : '提示',
					method : 'POST',
					waitMsg : '正在处理数据,请稍候...',
					success : function(form, action) {
						rfcWindow.hide();
						store.reload();
						refreshNode(parent_id);
						if (parent_id != parentid_old) {
							refreshNode(parentid_old);
						}
						form.reset();
						Ext.MessageBox.alert('提示', action.result.msg);
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', 'RFC功能表保存失败:<br>' + msg);
					},
					params : {
						rfctable : 'sap_rfcclass'
					}
				});
			}

			/**
			 * 删除代码对照
			 */
			function deleteRfcItems() {
				if (runMode == '0') {
					Ext.Msg.alert('提示', '系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
					return;
				}
				var rows = grid.getSelectionModel().getSelections();
				var fields = '';
				for ( var i = 0; i < rows.length; i++) {
					if (rows[i].get('editmode') == '0') {
						fields = fields + rows[i].get('rfc_id') + '->'
								+ rows[i].get('rfc_name') + '<br>';
					}
				}
				if (fields != '') {
					Ext.Msg.alert('提示', '<b>您选中的项目中包含如下系统内置的只读项目</b><br>'
							+ fields + '<font color=red>只读项目不能删除!</font>');
					return;
				}
				if (Ext.isEmpty(rows)) {
					Ext.Msg.alert('提示', '请先选中要删除的项目!');
					return;
				}
				var strChecked = jsArray2JsString(rows, 'rfc_id');
				Ext.Msg
						.confirm(
								'请确认',
								'<span style="color:red"><b>提示:</b>删除RFC数据将同时删除对应RFC映射信息,请慎重.</span><br>继续删除吗?',
								function(btn, text) {
									if (btn == 'yes') {
										showWaitMsg();
										Ext.Ajax
												.request({
													url : './sapRfcDefine.ered?reqCode=deleteRfcItem',
													success : function(response) {
														store.reload();
														rfcTree.root.reload();
														var resultArray = Ext.util.JSON
																.decode(response.responseText);
														Ext.Msg
																.alert(
																		'提示',
																		resultArray.msg);
													},
													failure : function(response) {
														var resultArray = Ext.util.JSON
																.decode(response.responseText);
														Ext.Msg
																.alert(
																		'提示',
																		resultArray.msg);
													},
													params : {
														strChecked : strChecked
													}
												});
									}
								});
			}

			/**
			 * 根据条件查询RFC数据
			 */
			function queryRfcItem() {
				store.load({
					params : {
						start : 0,
						limit : bbar.pageSize,
						leaf : '1',
						queryParam : Ext.getCmp('queryParam').getValue()
					}
				});
			}

			/**
			 * 刷新RFC数据
			 */
			function refreshRfcTable() {
				store.load({
					params : {
						start : 0,
						limit : bbar.pageSize
					}
				});
			}
			/**
			 * 保存RFCItems数据
			 */
			function saveRfcItems(rfctable) {
				var m;
				if (rfctable == 'sap_rfcclass')
					m = store.modified.slice(0); // 获取修改过的record数组对象
				if (rfctable == 'sap_rfcimport')
					m = store1.modified.slice(0); // 获取修改过的record数组对象
				if (rfctable == 'sap_rfcexport')
					m = store2.modified.slice(0); // 获取修改过的record数组对象
				if (rfctable == 'sap_rfcchanging')
					m = store3.modified.slice(0); // 获取修改过的record数组对象
				if (rfctable == 'sap_rfctables')
					m = store4.modified.slice(0); // 获取修改过的record数组对象
				if (rfctable == 'sap_rfcexceptions')
					m = store5.modified.slice(0); // 获取修改过的record数组对象
				if (Ext.isEmpty(m)) {
//					Ext.MessageBox.alert('提示', '没有数据需要保存!');
					return;
				}
				var jsonArray = [];
				var changeArray = [];
				// 将record数组对象转换为简单Json数组对象
				Ext.each(m, function(item) {
					jsonArray.push(item.data);
					changeArray.push(item.modified);
				});
				// 提交到后台处理
				Ext.Ajax.request({
					url : './sapRfcDefine.ered?reqCode=saveRfcItems',
					success : function(response) { // 回调函数有1个参数
						var resultArray = Ext.util.JSON
								.decode(response.responseText);
						Ext.Msg.alert('提示', resultArray.msg);
					},
					failure : function(response) {
						Ext.MessageBox.alert('提示', '数据保存失败');
					},
					params : {
						rfctable : rfctable,
						// 系列化为Json资料格式传入后台处理
						dirtydata : Ext.encode(jsonArray),
						// 修改的字段
						changedata : Ext.encode(changeArray),
						
						rfcname : Ext.getCmp("saprfcname").getValue()
					}
				});

			}
			/**
			 * 保存RFC class数据
			 */
			function saveRfcTable(rfctable) {
				if (Ext.getCmp('rfcForm').form.isValid()) {
					var mode = Ext.getCmp('windowmode').getValue();
					var saveReqCode = 'saveRfcItem';
					if (mode != 'add')
						saveReqCode = 'updateRfcItem';
					var parent_id = Ext.getCmp('parent_id').getValue();
					var parentid_old = Ext.getCmp('parentid_old').getValue();
					Ext.getCmp('rfcForm').form
							.submit({
								url : './sapRfcDefine.ered?reqCode='
										+ saveReqCode,
								waitTitle : '提示',
								method : 'POST',
								waitMsg : '正在处理数据,请稍候...',
								success : function(form, action) {
									store.reload();
									refreshNode(parent_id);
									if (parent_id != parentid_old) {
										refreshNode(parentid_old);
									}
									Ext.MessageBox.alert('提示',
											action.result.msg);
									rfcWindow.hide();
								},
								failure : function(form, action) {
									var msg = action.result.msg;
									Ext.MessageBox.alert('提示',
											'RFC功能表保存失败:<br>' + msg);
								},
								params : {
									rfctable : rfctable
								}
							});
				} else {
					// 表单验证失败
				}
			}
			/**
			 * 保存RFC数据
			 */
			function saveRfcAllItems() {

				if (runMode == '0') {
					Ext.Msg.alert('提示', '系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
					return;
				}
				var activeTab = tabs.getActiveTab();
				var index = tabs.items.indexOf(activeTab);
				if (index == 0) {
					saveRfcTable('sap_rfcclass');
				} else {
					if (paraImportPanel.getForm().isDirty()) {
						// alert("记录被修改！" +
						// Ext.getCmp('import_para_id').getValue());
						paraImportPanel.getForm().updateRecord(
								store1.getAt(store1.find('para_id', Ext.getCmp(
										'import_para_id').getValue())));
					}
					;
					if (paraExportPanel.getForm().isDirty()) {
						// alert("记录被修改！" +
						// Ext.getCmp('import_para_id').getValue());
						paraExportPanel.getForm().updateRecord(
								store2.getAt(store2.find('para_id', Ext.getCmp(
										'export_para_id').getValue())));
					}
					;
					if (paraChangingPanel.getForm().isDirty()) {
						// alert("记录被修改！" +
						// Ext.getCmp('import_para_id').getValue());
						paraChangingPanel.getForm().updateRecord(
								store3.getAt(store3.find('para_id', Ext.getCmp(
										'changing_para_id').getValue())));
					}
					;
					if (paraTablesPanel.getForm().isDirty()) {
						// alert("记录被修改！" +
						// Ext.getCmp('import_para_id').getValue());
						paraTablesPanel.getForm().updateRecord(
								store4.getAt(store4.find('para_id', Ext.getCmp(
										'tables_para_id').getValue())));
					}
					;

					saveRfcItems('sap_rfcimport');
					saveRfcItems('sap_rfcexport');
					saveRfcItems('sap_rfcchanging');
					saveRfcItems('sap_rfctables');
					saveRfcItems('sap_rfcexceptions');
				}

			}
			/**
			 * 生成AIG缓存中间表
			 */
			function modifyAigCache(){
				tabs.setActiveTab(4);
				Ext.each(store4.data.items, function(item) {
                   item.set('cachemode','1')
				});

//				alert('1');
			};
/*			function syncAigTables() {
				saveRfcItems('sap_rfctables');
//				if (store4.find('cachemode', '1') < 1) {
//					Ext.MessageBox.alert('提示', '没有找到需要缓存的参数表');
//				} else {
					var rfc_id = Ext.getCmp('rfc_id').getValue();
					Ext.getCmp('rfcForm').form.submit({
						url : './sapRfcDefine.ered?reqCode=syncAigTables',
						waitTitle : '提示',
						method : 'POST',
						waitMsg : '正在处理数据,请稍候...',
						success : function(form, action) {

							Ext.MessageBox.alert('提示', action.result.msg);
						},
						failure : function(form, action) {
							var msg = action.result.msg;
							Ext.MessageBox.alert('提示', 'SAP RFC数据同步失败:<br>'
									+ msg);
						},
						params : {
							rfc_id : rfc_id
						}
					});
//				}
			} */

			
			
			
			function saveSynchronismInfo(){
				var _trigger_name = Ext.getCmp("saprfcname").getValue();
				Ext.getCmp('addcodeForm').form.submit({
								url : './jobMange.ered?reqCode=jobMangerSave&trigger_name=' + _trigger_name,
								waitTitle : '提示',
								method : 'POST',
								waitMsg : '正在处理数据,请稍候...',
								success : function(form, action) {
									Ext.Msg.alert("提示",action.result.msg);
								},
								failure : function(form, action) {
									var msg = action.result.msg;
									Ext.MessageBox.alert('提示', '操作失败!' + msg);
									Ext.getComponent('addcodeForm').form.reset();
								}
				});
				
				
			}
					
            //增加定时任务窗口
			var syncAddWindow;
			syncAddWindow = new Ext.Window({
				layout : 'fit',
				width : 620,
				height : 400,
				resizable : false,
				draggable : true,
				closeAction : 'hide',
				title : '<span class="commoncss">增加作业</span>',
			        iconCls : 'page_edit_1Icon',
				modal : true,
				collapsible : true,
				titleCollapse : true,
				maximizable : false,
				buttonAlign : 'right',
				border : false,
				animCollapse : true,
				animateTarget : Ext.getBody(),
				constrain : true,
				items : [timerForm],
				buttons : [{
					text : '增加',
					iconCls : 'acceptIcon',
					handler : function() {
						if (syncAddWindow.getComponent('addcodeForm').form.isValid()) {
							var _trigger_name = reportManger.rfcname;
							Ext.getCmp('addcodeForm').form.submit({
											url : './jobMange.ered?reqCode=jobMangerSave&trigger_name=' + _trigger_name,
											waitTitle : '提示',
											method : 'POST',
											waitMsg : '正在处理数据,请稍候...',
											success : function(form, action) {
												syncStore.reload();
												store.reload();
												syncAddWindow.hide();
												Ext.Msg.alert("提示",action.result.msg);
											},
											failure : function(form, action) {
												var msg = action.result.msg;
												Ext.MessageBox.alert('提示', '操作失败!' + msg);
												Ext.getComponent('addcodeForm').form.reset();
											}
							});
						} else {
							// 表单验证失败
						}
					}
				}, {
					text : '关闭',
					iconCls : 'deleteIcon',
					handler : function() {
						syncAddWindow.hide();
					}
				}]
			});
							
			var syncProcess = function(){
					var record = grid.getSelectionModel().getSelected();
					if (Ext.isEmpty(record)) {
						Ext.Msg.alert('提示', '请先选中要修改的项目');
						return;
					}
					reportManger.rfcname = record.data.saprfcname ;
					syncWindow.show();
					syncStore.load({params : {queryParam:reportManger.rfcname,start : 0,limit : syncBbar.pageSize}});					
			}
			
		});