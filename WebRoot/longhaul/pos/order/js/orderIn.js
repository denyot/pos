/**
 * 直营店货品销售退货
 * @author bc_zhu
 * @since 2015/3/17
 */
Ext.onReady(function() {
	
	Ext.QuickTips.init();
	var chargDetailWindow;
	var chargDetailForm;
	var myVipCard;
	var groupWindow;
	var mybool;
	//销售原因
	var store_yy = new Ext.data.Store({   
        proxy: new Ext.data.HttpProxy({ url: "orderSystem.ered?reqCode=getOrderReason&auart=ZYR1"}) ,
        reader: new Ext.data.JsonReader(  
          { root: "" },  
          ["augru", "bezei"]  
         )     
    });   
	
	//营业员
	var store_zz = new Ext.data.Store({   
        proxy: new Ext.data.HttpProxy({ url: "orderSystem.ered?reqCode=getsaleman&postType=1&random="
						+ Math.random() }) ,
        reader: new Ext.data.JsonReader(  
          { root: "" },  
          ["assistant_name", "assistant_name"]  
         )     
    });   
	
	//促销代码
	var store_cx = new Ext.data.Store({   
        proxy: new Ext.data.HttpProxy({ url: "orderSystem.ered?reqCode=getSalepromotion&postType=1"
						 }) ,
        reader: new Ext.data.JsonReader(  
          { root: "" },  
          ["aktnr", "aktkt"]  
         )     
    });  
	
	var store_bc = new Ext.data.ArrayStore({
			        fields: ['gName', 'gValue']
				     });
	
	var store_lp = new Ext.data.ArrayStore({
			        fields: ['gName', 'gValue']
				     });
    store_cx.on('beforeload', function() {
        this.baseParams = {
			charg : Ext.getCmp('detailCharg').getValue(),
			matnr : Ext.getCmp('detailmatnr').getValue(),
			orderdate : Ext.getCmp('saledate').getValue()
        };
    });
	store_cx.on('load',function (){
		if(this.getCount()){
    		var cx = Ext.getCmp("detailcx");
    		var o = this.getAt(0);
    		var kb = (o.json.kbetr + 1000) / 10 ;
    		cx.setValue(o.data.aktnr);
    		cx.show();
    		Ext.getCmp("detailKv").setValue(kb);
    		setKbetr();
    		return;
		}
		Ext.getCmp("detailKl").setValue("01");
		Ext.MessageBox.alert("提示","没有对应的促销代码");
    });
     
     var myMask = new Ext.LoadMask(Ext.getBody(), {    
	            msg: '正在操作，请稍后....',    
	              removeMask: true //完成后移除    
	      });  
     
     
	var myForm = new Ext.form.FormPanel({
		collapsible : false,
		border : true,
		labelWidth : 60, // 标签宽度
		// frame : true, //是否渲染表单面板背景色
		labelAlign : 'right', // 标签对齐方式
		bodyStyle : 'padding:5 5 0', // 表单元素和表单面板的边距
		buttonAlign : 'center',
		renderTo:Ext.getBody(),

		items : [{
					layout : 'column',
					border : false,
					items : [{
								columnWidth : .33,
								layout : 'form',
								labelWidth : 65, // 标签宽度
								defaultType : 'textfield',
								border : false,
								items : [{
											fieldLabel : '销售日期',
											labelStyle : 'color:blue;',
											name : 'saledate',
											id : 'saledate',
											value:'2014-02-03',
											//disabled : true,
											xtype : 'datefield',
											fieldClass : 'x-custom-field-disabled',
											allowBlank : false,
											format : 'Y-m-d', // 日期格式化
											//value : new Date(),
											anchor : '100%',
											listeners: {  
							                    select: function(field,e){    
							                        return false;
							                    }  
							                }
										}, {
											fieldLabel : '退货原因',
											labelStyle : 'color:blue;',
											xtype : 'combo',
											name : 'orderreason',
											id:'orderreason',
											emptyText: "--请选择--", 
											mode : 'remote',   
               							    triggerAction: "all",
											store :store_yy,
											valueField : 'augru',
											displayField : 'bezei',
											editable: false,
											allowBlank : false,
											maxLength : 20,
											anchor : '100%'
										}, {
											fieldLabel : '营业员',
											xtype:'lovcombo',											
											allowBlank : false,
											id:'assistant_name',
											name:'assistant_name', 
											valueField : 'assistant_name',
											displayField : 'assistant_name',
											editable: false,
											labelStyle : 'color:blue;',
											emptyText: "--请选择--", 
											allowBlank : false,
											mode : 'remote',   
               							    triggerAction: "all",
											store :store_zz,
											anchor : '100%'
										}]
							}, {
								columnWidth : .33,
								layout : 'form',
								labelWidth : 60, // 标签宽度
								defaultType : 'textfield',
								border : false,
								items : [{
											fieldLabel : '会员卡号', // 标签
											name : 'vipcard', // 
											id:'vipcard',
											emptyText:'可输入会员卡号,手机号,姓名',
											maxLength : 20, // 
											allowBlank : false,
											labelStyle : 'color:blue;',
											anchor : '100%',// 宽度百分比
											listeners: {  
							                    specialkey: function(field,e){    
							                        if (e.getKey()==Ext.EventObject.ENTER){ 
							                           getVipCard(this);
							                        }  
							                    }  
							                }
										}, {
											fieldLabel : '会员姓名',
											name : 'vipname',
											id:'vipname',
											allowBlank : false,
											disabled : true,
											maxLength : 25,
											anchor : '100%'
										},{
											fieldLabel : '电话号码',
											name : 'telphone',
											id:'telphone',
											disabled : true,
											maxLength : 25,
											anchor : '100%'
										}
										
										]
							}, {
								columnWidth : .33,
								layout : 'form',
								labelWidth : 60, // 标签宽度
								defaultType : 'textfield',
								border : false,
								items : [
										{
											fieldLabel : '积分',
											name : 'jf',
											id:'jf',
											disabled : true,
											maxLength : 25,
											anchor : '100%'
										},{
											fieldLabel : '商场小票',
											name : 'scxp',
											id:'scxp',
											allowBlank : false,
											labelStyle : 'color:blue;',
											maxLength : 25,
											anchor : '100%'
										},{
											fieldLabel : '消费积分',
											name : 'xfjf',
											disabled : true,
											id:'xfjf',
											maxLength : 25,
											anchor : '100%'
										}
									
								]
							}]
				},{
					layout : 'column',
					border : false,
					items : [{
								columnWidth : .33,
								layout : 'form',
								labelWidth : 65, 
								defaultType : 'textfield',
								anchor : '100%',
								border : false,
								items : [{
											fieldLabel : '现  金',
											name : 'jexj',
											id   : 'jexj',
											disabled : true,
											labelStyle : 'color:blue;',
											anchor : '100%'
											
										}]
							},{
								columnWidth : .33,
								layout : 'form',
								labelWidth : 60, 
								defaultType : 'textfield',
								
								border : false,
								items : [{
											fieldLabel : '购物卡',
											name : 'jegwk',
											id   : 'jegwk',
											labelStyle : 'color:blue;',
											anchor : '100%',
											enableKeyEvents:true,
											regex:/^-(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1,2})?))$/,
											listeners: {  
							                    keyup:sumje
							                }
										}]
							},{
								columnWidth : .33,
								layout : 'form',
								labelWidth : 60, 
								defaultType : 'textfield',
								border : false,
								items : [{
											fieldLabel : '银联',
											name : 'jeyl',
											id   : 'jeyl',
											enableKeyEvents:true,
											labelStyle : 'color:blue;',
											anchor : '100%',
											regex:/^-(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1,2})?))$/,
											listeners: {  
							                    keyup:sumje
							                }
										}]
							}]
				},{
					layout : 'column',
					border : false,
					items : [ {
								columnWidth : .66,
								layout : 'form',
								labelWidth : 65, // 标签宽度
								defaultType : 'textfield',
								border : false,
								items : [{
											fieldLabel : '备注',
											//xtype : 'textarea',
											name : 'remarks',
											id:'remarks',
											emptyText : '备注信息.',
											anchor : '100%'
										}]
							},{
								columnWidth : .33,
								layout : 'form',
								labelWidth : 60, 
								defaultType : 'textfield',
								border : false,
								items : [{
											fieldLabel : '合计',
											name : 'jesum',
											id:'jesum',
											labelStyle : 'color:blue;',
											disabled : true,
											anchor : '100%',
											listeners: {
												
											}
										}]
							}]
				}
				
				]
	});//myForm 结束
	//var cl = new Ext.grid.RowNumberer();
	
	var objGoupCx = new Ext.form.ComboBox({
            hideLabel: true,
            lazyRender: true, 
            store: store_cx,
            displayField: "aktkt",
            valueField: "aktnr",
            mode: "local",
            anchor : '90%',
			width:'300',
            triggerAction: "all"
            
   });
     
  
	
	var cm = new Ext.grid.ColumnModel([
	
		{
                xtype: 'actioncolumn',
                header   : '操作',
                width: 50,
                items: [{
                	 icon   : '../../../resource/ext-3.4.0/resources/images/access/shared/delete.gif',  // Use a URL in the icon config
                    tooltip: '删除',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                       // var posnr = rec.get("posnr");
                         Ext.Msg.confirm('警告提示',"确定要删除项目吗",function (btn){
                         	if(btn=="yes"){
                         		store.removeAt(rowIndex);
                       		     sumje();
                         	}
                         });
                     }
                }]
        }, 
       
        {
			header : '批次', 
			dataIndex : 'charg',
			width : 90
			
		}, {
			header : '物料号', 
			dataIndex : 'matnr', 
			width : 140
		}, {
			header : '商品名称',
			dataIndex : 'maktx',
			width : 170
		}, {
			header : '数量',
			dataIndex : 'labst',
			width : 70
			
		}, {
			header : '重量',
			dataIndex : 'hpzl',
			width : 70
			
		}, {
			header : '单位',
			dataIndex : 'meins',
			width : 50
		}, {
			header : '标签价',
			dataIndex : 'kbetr',
			width : 90
		}, {
			header : '实销价',
			dataIndex : 'kbetr_s',
			width : 90
		},{
			header : '常规折扣',
			dataIndex : 'zzzk1',
			width : 90
		},
		{
			header : '促销折扣',
			dataIndex : 'zzzk2',
			width : 90
		},
		{
			header : '特殊折扣',
			dataIndex : 'zzkj',
			width : 90
		},{
			header : 'VIP折扣',
			dataIndex : 'zzzk3',
			width : 90
		},{
			header : '商场会员折扣',
			dataIndex : 'zzzkg',
			width : 90
		},{
			header : '实销折扣',
			dataIndex : 'zsxkg',
			width : 90
		},{
			header : '商场优惠券',
			dataIndex : 'zzsq1',
			width : 90
		},{
			header : '自发优惠券',
			dataIndex : 'zzfq1',
			width : 90
		},{
			header : '商场现金券',
			dataIndex : 'zzsq2',
			width : 90
		},{
			header : '自发现金券',
			dataIndex : 'zzfq2',
			width : 90
		},{
			header : 'VIP抵现优惠',
			dataIndex : 'zzjf3',
			width : 90
		},{
			header : '促销代码',
			dataIndex : 'zcxdm',
			editor:objGoupCx,
			width : 90
		},{
			header : '积分',
			dataIndex : 'jf',
			width : 90
		},{
			header : '库位',
			dataIndex : 'lgort',
			width : 80
		},{
			header : '销售单号',
			dataIndex : 'sortid',
			width : 100
		}
	]); 
	
	
	var tbar = new Ext.Toolbar({
		items : [
				'&nbsp;&nbsp;&nbsp;&nbsp;',
				{
					text:'批次号:'
				},
				{
					
					xtype : 'textfield',
					labelStyle : 'color:blue;',
					name : 'searchCharg',
					id : 'searchCharg',
					maxLength : 10,
					minLength:10,
					//value:'2000228606',
					anchor : '100%',
					listeners: {  
	                    specialkey: function(field,e){    
	                        if (e.getKey()==Ext.EventObject.ENTER){ 
	                        	//if(!chargDetailWindow){
	                        	//   createDetail();
	                           //}
	                          if( this.isValid ())  getReceiveStoreDetail();
	                          	
	                           
	                        }  
	                    }  
	                }
				},
				'-',
				'&nbsp;',
				{
					text:'包材:'
				},
				{
					xtype : 'combo',
					name : 'searchBc',// 'stcd2',
					id : 'searchBc',
					anchor : '90%',
					width:'300',
					editable : false,	
					mode:'local',
					store:store_bc,
					enableKeyEvents:true, 
					typeAhead:false,
					triggerAction: "all",
					valueField : 'gValue',//值
			        displayField : 'gName',//显示文本
					listeners:{ 
						afterRender:getBc,
						select:addBc
	         		}						
				},	
				'-',
				'&nbsp;',
				{
					text:'礼品:'
				},
				{
					xtype : 'combo',
					name : 'searchLp',// 'stcd2',
					id : 'searchLp',
					anchor : '90%',
					width:'300',
					editable : false,	
					mode:'local',
					store:store_lp,
					enableKeyEvents:true, 
					typeAhead:false,
					triggerAction: "all",
					valueField : 'gValue',//值
			        displayField : 'gName',//显示文本
					listeners:{ 
						focus:getLp,
						select:addLp
	         		}						
				}
				,
				'-',
				'&nbsp;',	
				{
					text : '提 交',
					iconCls : 'acceptIcon',
					handler : function() {
						submitOrder();
					}
				},
				'-',
				'&nbsp;&nbsp;',
				{
					text : '新会员',
					iconCls : 'addIcon',
					handler : function() {
						vipCardWindow.show(); // 显示窗口
					}
				}
				
			]
	});
	/*
	var bbar = new Ext.Toolbar({
		items : [ '&nbsp;&nbsp;&nbsp;&nbsp;',{
			xtype : 'label',
			id : 'totalCount',
			text : '总数量：'
		}, '-', '&nbsp;&nbsp;' , {
			xtype : 'label',
			id : 'totalWeight',
			text : '总重量：'
		}, '-', '&nbsp;&nbsp;' ,{
			xtype : 'label',
			id : 'totalPrice',
			text : '总金额：'
		}]
	});*/
	
	var store = new Ext.data.Store({
		// 数据读取器
		reader : new Ext.data.JsonReader({
		}, [ {
			name : 'charg'
		}, {
			name : 'matnr'
		}, {
			name : 'maktx'
		}, {
			name : 'labst'
		}, {
			name : 'hpzl'
		}, {
			name : 'meins'
		}, {
			name : 'kbetr'
		}, {
			name : 'kbetr_s',type: 'float'
		},{
			name : 'pstyv'
		}, {
			name : 'zzzk1',type: 'float'
		}, {
			name : 'zzzk2',type: 'float'
		}, {
			name : 'zzzkj',type: 'float'
		}, {
			name : 'zzzk3',type: 'float'
		}, {
			name : 'zzzkg',type: 'float'
		}, {
			name : 'zsxkg',type: 'float'
		}, {
			name : 'zzsq1',type: 'float'
		},  {
			name : 'zzfq1',type: 'float'
		},  {
			name : 'zzsq2',type: 'float'
		},  {
			name : 'zzfq2',type: 'float'
		},  {
			name : 'zzjf3',type: 'float'
		}, {
			name : 'zcxdm'
		}, {
			name : 'lgort'
		}, {
			name : 'zsfs'
		}, {
			name : 'jf'
		}, {
			name : 'gongf'
		}, {
			name : 'mrjj'
		}, {
			name : 'picurl'
		},{
			name : 'salegroup'//组合销售标识
		}     ])
	});
	
	function enableobj(){
		if (this.getCount()){
     		Ext.getCmp("saledate").disable();
     		Ext.getCmp("vipcard").disable();
     	}
     	else{
     	    Ext.getCmp("saledate").enable();
     	    Ext.getCmp("vipcard").enable();
		}
	}

	store.on('add',enableobj);
    store.on('remove',enableobj); 
    store.on('clear',enableobj); 
    
	//创建grid
	var grid = new Ext.grid.EditorGridPanel({
		height : Ext.getBody().getHeight() - myForm.getHeight(),
//		frame : true,
		autoScroll : true,
		renderTo:Ext.getBody(),
		//region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		store : store, // 数据存储
		stripeRows : true, // 斑马线
		cm : cm, // 列模型
		tbar : tbar, // 表格工具栏
		//bbar : bbar,// 下工具栏
		viewConfig : {
			// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
			// forceFit : true
		},
		loadMask : {
			msg : '正在加载表格数据,请稍等...'
		},listeners:{    
	           'beforeedit':function(o){
	           		if(o.field=="zcxdm"){
	           			var record = store.getAt(o.row)	;
	           			if(record.get("salegroup")){
	           				Ext.getCmp('detailCharg').setValue(record.get("charg"));
			 		   		Ext.getCmp('detailmatnr').setValue(record.get("matnr"));
		           	   		store_cx.load();
		           	   		return;
	           			}
	           		    return false;
		           	}  
	           },
	           'afteredit':function (o){
	           		if(o.field=="zcxdm"){
	           			
	           		   var index = store_cx.find("aktnr",o.value);
	           		  	if(index){
	           		  		o.record.set("zcxdm","");
	           		  		Ext.Msg.alert("提示","促销代码选择错误，请重新选择");
	           		  	}
		           	}  
	           	}
		 }
	});
	
	//会员添加Form
	var vipCardForm = new Ext.form.FormPanel({
						labelWidth : 80, // 标签宽度
						// frame : true, //是否渲染表单面板背景色
						defaultType : 'textfield', // 表单元素默认类型
						labelAlign : 'right', // 标签对齐方式
						bodyStyle : 'padding:5 5 5 5', // 表单元素和表单面板的边距
						layout : 'form',
						items : [{
									fieldLabel : '顾客姓名', 
									name : 'regname', // 
									id:'regname',
									allowBlank : false, 
									maxLength : 8, // 
									minLength : 2,// 
									anchor : '100%' 
								}, {
									fieldLabel : '手机号', // 标签
									name : 'regPhone',
									id : 'regPhone',
									emptyText : '请输入手机号码',
									maxLength : 18, 
									allowBlank : true,
									 regex: /^1[3|5|7|8|][0-9]{9}$/,
									anchor : '100%'// 宽度百分比
								}]
					});
	
	//
	
	  
		var vipCardWindow = new Ext.Window({
						title : '新增会员', // 窗口标题
						layout : 'fit', // 设置窗口布局模式
						width : 300, // 窗口宽度
						height : 150, // 窗口高度
						closable : true, // 是否可关闭
						closeAction:'hide',
						collapsible : false, // 是否可收缩
						maximizable : false, // 设置是否可以最大化
						border : false, // 边框线设置
						constrain : true, // 设置窗口是否可以溢出父容器
						animateTarget : Ext.getBody(),
						pageY : 150, // 页面定位Y坐标
						pageX : document.body.clientWidth / 2 - 300 / 2, // 页面定位X坐标
						items : [vipCardForm], // 嵌入的表单面板
						buttons : [{ // 窗口底部按钮配置
							text : '保存', // 按钮文本
							iconCls : 'addIcon', // 
							handler : function() { // 
								createVipCard();
							}
						}]
					});
			
	
	//添加会员
	function createVipCard(){
		
		var bool = vipCardForm.getForm().isValid();
		if(!bool){
			Ext.MessageBox.alert('温馨提示', '您输入的信息不完整,请填写完整。');
			return;
		}
		
		Ext.Msg.confirm('确定要添加该会员吗？', '', function(btn, text){
		    if (btn == 'yes'){
		    var regname=Ext.getCmp("regname").getValue();
			var regPhone=Ext.getCmp("regPhone").getValue();
		    	Ext.Ajax.request({
			url    : 'orderSystem.ered?reqCode=registerUser&postType=1&werks=',
			method : 'post',
			//async  : false, 	
			params : {
					regname : regname,
					regPhone :regPhone,
					cardType:10
			},
			timeout : 120000,
			success : function(data) {
				var obj = eval("("+data.responseText+")");
				if(obj.msg){
					Ext.MessageBox.alert('提示',obj.msg);
					return;
				}
				 
				 	 obj.parvo = '1';
				 	Ext.Ajax.request({
						url    : '../member/memberSystem.ered?reqCode=updateMember&addnew=y',
						method : 'post',
						//async  : false, 	
						params : obj,
						success : function(d) {
							var o = eval("("+d.responseText+")");
							if(o.success){
								vipCardForm.getForm().reset();
		        			    vipCardWindow.hide();
								Ext.Msg.alert("添加成功");
							}else{
								Ext.Msg.alert("添加失败");
							}
							 					
						}
			
				 	});
				
				},
				failure : function(){
					 
				}
			});
		       
		    }
		});
	}
	
	createDetail();
	//创建明细数据
	function createDetail(){
	
		 chargDetailForm = new Ext.form.FormPanel({
						collapsible : false,
		border : true,
		id:'chargForm',
		labelWidth : 60, // 标签宽度
		// frame : true, //是否渲染表单面板背景色
		labelAlign : 'right', // 标签对齐方式
		bodyStyle : 'padding:5 5 0', // 表单元素和表单面板的边距
		buttonAlign : 'center',
		items : [{
					layout : 'column',
					border : false,
					items : [{
								columnWidth : .5,
								layout : 'form',
								labelWidth : 65, // 标签宽度
								defaultType : 'textfield',
								border : false,
								items : [{
											fieldLabel : '批次号',
											labelStyle : 'color:blue;',
											name : 'detailCharg',
											id : 'detailCharg',
											disabled : true,
											fieldClass : 'x-custom-field-disabled',
											anchor : '100%'
										},{
											fieldLabel : '数量',
											labelStyle : 'color:blue;',
											name : 'detaillabst',
											id : 'detaillabst',
											fieldClass : 'x-custom-field-disabled',
											anchor : '100%',
											listeners: {  
							                    change:function (){
							                    	var maxLabst = Ext.getCmp("detailMlabst").getValue();
							                    	if(this.getValue()>maxLabst){
							                    		this.setValue(maxLabst);
							                    		Ext.Msg.alert("警告","重量不允许超过"+maxLabst);
							                    		return;
							                    	}
							                    }
							                }
										},{
											fieldLabel : 'max数量',
											hidden:true,
											name : 'detailMlabst',
											id : 'detailMlabst',
											fieldClass : 'x-custom-field-disabled',
											anchor : '100%'
										},{
											fieldLabel : '促销',
											xtype:'combo',											
											allowBlank : false,
											id:'detailKl',
											name:'detailKl', 
											valueField : 'detailKv',
											displayField : 'detailKl',
											editable: false,
											labelStyle : 'color:blue;',
											emptyText: "--请选择--", 
											allowBlank : false,
											mode : 'local',   
               							    triggerAction: "all",
               							    store:new Ext.data.SimpleStore({
												    fields : ['detailKl', 'detailKv'],
												    data : [['非扣点变动销售', '01'], ['扣点变动销售', '02']]
												}),
											listeners: {  
							                    select:function (){
							                    	detailKlChange(this);
							                    }
							                },
											anchor : '100%'
										},{
											fieldLabel : '特殊打折',
											labelStyle : 'color:blue;',
											xtype : 'combo',
											name : 'detailTs',
											id:'detailTs',
											mode : 'local',   
               							    triggerAction: "all",
											valueField : 'detailTv',
											displayField : 'detailTl',
											allowBlank : false,
											maxLength : 20,
											anchor : '100%',
											store:new Ext.data.SimpleStore({
												    fields : ['detailTl', 'detailTv'],
												    data : [['VIP折扣', 'zzzk3'], ['商场会员折扣', 'zzzkg'], ['特殊折扣', 'zzzkj'], ['特价不打折', '']]
												}),
											listeners: {  
							                    select:function (){
							                    	detailTsChange(this);
							                    }
							                }
										},{
											fieldLabel : '促销代码',
											labelStyle : 'color:blue;',
											xtype : 'combo',
											name : 'detailcx',
											id:'detailcx',
											//hidden: true,
											hiddenName:'detailcx', 
											mode : 'local',   
               							    triggerAction: "all",
											store :store_cx,
											valueField : 'aktnr',
											displayField : 'aktkt',
											editable: false,
											maxLength : 20,
											anchor : '100%'
											
										},{
											fieldLabel : '标签价',
											labelStyle : 'color:blue;',
											name : 'detailKbetrb',
											id : 'detailKbetrb',
											disabled : true,
											fieldClass : 'x-custom-field-disabled',
											anchor : '100%'
										},{
											fieldLabel : '应收',
											labelStyle : 'color:blue;',
											name : 'detailKbetry',
											id : 'detailKbetry',
											disabled : true,
											fieldClass : 'x-custom-field-disabled',
											anchor : '100%'
										},{
											fieldLabel : '自发优惠卷',
											labelStyle : 'color:blue;',
											name : 'detailzfyhj',
											id : 'detailzfyhj',
											value:'0',
											fieldClass : 'x-custom-field-disabled',
											anchor : '100%',
											listeners: {  
							                    change:function (){
							                    	setKbetr();
							                    }
							                }
										},{
											fieldLabel : '商场优惠卷',
											labelStyle : 'color:blue;',
											name : 'detailscyhj',
											id : 'detailscyhj',
											value:'0',
											fieldClass : 'x-custom-field-disabled',
											anchor : '100%',
											listeners: {  
							                    change:function (){
							                    	setKbetr();
							                    }
							                }
										},{
											fieldLabel : '名称描述',
											labelStyle : 'color:blue;',
											name : 'detailmaktx',
											id : 'detailmaktx',
											disabled : true,
											fieldClass : 'x-custom-field-disabled',
											anchor : '100%'
										},{
											fieldLabel : '工费',
											labelStyle : 'color:blue;',
											name : 'detailgongf',
											id : 'detailgongf',
											disabled : true,
											anchor : '100%'
										},{
											fieldLabel : '单位',
											labelStyle : 'color:blue;',
											name : 'detailmeins',
											id : 'detailmeins',
											disabled : true,
											anchor : '100%'
										}
										
										]
							},{
								columnWidth : .5,
								layout : 'form',
								labelWidth : 65, // 标签宽度
								defaultType : 'textfield',
								border : false,
								items : [{
											fieldLabel : '物料号',
											labelStyle : 'color:blue;',
											name : 'detailmatnr',
											id : 'detailmatnr',
											disabled : true,
											
											fieldClass : 'x-custom-field-disabled',
											anchor : '100%'
										},{
											fieldLabel : '重量',
											labelStyle : 'color:blue;',
											name : 'detailhpzl',
											id : 'detailhpzl',
											fieldClass : 'x-custom-field-disabled',
											anchor : '100%',
											listeners: {  
							                    change:function (){
							                    	var maxHpzl = Ext.getCmp("detailMhpzl").getValue();
							                    	if(this.getValue()>maxHpzl){
							                    		this.setValue(maxHpzl);
							                    		Ext.Msg.alert("警告","重量不允许超过"+maxHpzl);
							                    		return;
							                    	}
							                    	setKbetr();
							                    }
							                }
										},{
											fieldLabel : '重量',
											labelStyle : 'color:blue;',
											hidden:true,
											name : 'detailMhpzl',
											id : 'detailMhpzl',
											fieldClass : 'x-custom-field-disabled',
											anchor : '100%'
										},{
											fieldLabel : '常规折扣',
											labelStyle : 'color:blue;',
											name : 'detailKv',
											id : 'detailKv',
											value:'100',	
											disabled : true,				
											fieldClass : 'x-custom-field-disabled',
											anchor : '100%',listeners: {  
							                    change:function (){
							                    	setKbetr();
							                    }
							                }
										},{
											fieldLabel : '折扣',
											labelStyle : 'color:blue;',
											name : 'detailtsKv',
											id : 'detailtsKv',
											value:'100',
											regex:/^(-)?(([1-9]{1}\d*)|([0]{1}))$/,					
											fieldClass : 'x-custom-field-disabled',
											anchor : '100%',
											listeners: {  
							                    change:function (){
							                    	setKbetr();
							                    }
							                }
										},
										{
											fieldLabel : 'VIP抵现',
											labelStyle : 'color:blue;',
											name : 'detailVipDx',
											id : 'detailVipDx',
											value:'0',
											fieldClass : 'x-custom-field-disabled',
											anchor : '100%',
											listeners: {  
							                    change:function (){
							                    	setKbetr();
							                    }
							                }
										},{
											fieldLabel : '单件实收',
											labelStyle : 'color:blue;',
											name : 'detailKbetrs',
											id : 'detailKbetrs',
											fieldClass : 'x-custom-field-disabled',
											allowBlank : false,
											regex:/^(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1,2})?))$/,
											anchor : '100%',
											listeners: {  
							                    specialKey : function(field, e) {  
							                        if (e.getKey() == Ext.EventObject.ENTER) {
							                           addItem(field);
							                        }  
							                    }  
							                }
										},{
											fieldLabel : '自发现金卷',
											labelStyle : 'color:blue;',
											name : 'detailzfxjj',
											id : 'detailzfxjj',
											fieldClass : 'x-custom-field-disabled',
											allowBlank : false,
											value:'0',
											anchor : '100%',
											listeners: {  
							                    change:function (){
							                    	setKbetr();
							                    }
							                }
										},{
											fieldLabel : '商场现金卷',
											labelStyle : 'color:blue;',
											name : 'detailscxjj',
											id : 'detailscxjj',
											fieldClass : 'x-custom-field-disabled',
											allowBlank : false,
											value:'0',
											anchor : '100%',
											listeners: {  
							                    change:function (){
							                    	setKbetr();
							                    }
							                }
										},{
											fieldLabel : '赠送方式',
											xtype:'combo',											
											allowBlank : false,
											id:'detailzsfs',
											name:'detailzsfs', 
											valueField : 'detailzsfst',
											displayField : 'detailzsfs',
											editable: false,
											labelStyle : 'color:blue;',
											emptyText: "--请选择--", 
											allowBlank : false,
											mode : 'local',   
               							    triggerAction: "all",
											//store :store_zz,
											anchor : '100%',
											store:new Ext.data.SimpleStore({
												    fields : ['detailzsfs', 'detailzsfst'],
												    data : [['无', ''], ['赠链', '01'], ['赠货品', '02']]
												}),
											listeners: {  
							                    select:changedetailzsfs
							                }
										},{
											fieldLabel : '每日金价',
											labelStyle : 'color:blue;',
											name : 'detailmrjj',
											id : 'detailmrjj',
											value:0,
											regex:/^(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1,2})?))$/,
											fieldClass : 'x-custom-field-disabled',
											anchor : '100%'
										},{
											fieldLabel : '出库库位',
											labelStyle : 'color:blue;',
											name : 'detaillgort',
											id : 'detaillgort',
											disabled : true,
											fieldClass : 'x-custom-field-disabled',
											allowBlank : false,
											anchor : '100%'
										},{
											fieldLabel : 'picurl',
											labelStyle : 'color:blue;',
											name : 'detailpicurl',
											id : 'detailpicurl',
											disabled : true,
											hidden:true,
											anchor : '100%'
										}
									]}
							,{
								columnWidth : .99,
								layout : 'form',
								labelWidth : 65, // 标签宽度
								defaultType : 'textfield',
								border : false,
								items : [
									{      
							                    xtype : 'box',  
							                    id : 'browseImage',  
							                    fieldLabel : "预览图片",
							                    value:'https://www.baidu.com/img/baidu_jgylogo3.gif',  
							                    autoEl : {  
							                        width : 160,  
							                        height : 80,  
							                        tag : 'img',  
							                        //src : 'https://www.baidu.com/img/baidu_jgylogo3.gif',  
							                        style : 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale);',  
							                        complete : 'off',  
							                        id : 'imageBrowse'  
							                    }  
							  
							                }
								]
								
								}
							]			
						}]
		
					});
					
					
		 chargDetailWindow = new Ext.Window({
						title : '批次明细', // 窗口标题
						layout : 'fit', // 设置窗口布局模式
						width : 650, // 窗口宽度
						height : 400, // 窗口高度
						closable : true, // 是否可关闭
						closeAction:'hide',
						collapsible : false, // 是否可收缩
						maximizable : false, // 设置是否可以最大化
						border : false, // 边框线设置
						constrain : true, // 设置窗口是否可以溢出父容器
						animateTarget : Ext.getBody(),
						pageY : 150, // 页面定位Y坐标
						modal: true,
						pageX : document.body.clientWidth / 2 - 650 / 2, // 页面定位X坐标
						items : [chargDetailForm], // 嵌入的表单面板
						buttons : [{ // 窗口底部按钮配置
							text : '添加', // 按钮文本
							iconCls : 'addIcon', // 
							handler : addItem
						}]
					});	
	}
	//获取会员信息
	function getVipCard(o){
		Ext.Ajax.request({
						url    : "orderSystem.ered?reqCode=getVipRecord&option=user&postType=1&werks="
								+  "&random=" + Math.random() + "",
						method : 'post', 	
						params : {vipid:o.getValue(),saledate:Ext.getCmp("saledate").getValue()},
						success : function(respose) {
							var vipCard=Ext.decode(respose.responseText);
							if(!vipCard.length){
								myVipCard=null;
								Ext.Msg.alert("卡号错误！");
								return;
							}
								if(vipCard[0].doubleInteval=="1"){
									Ext.Msg.alert("提示","该会员是本月生日,将会获得三倍的积分");
								}else if (vipCard[0].doubleInteval=="2"){
									Ext.Msg.alert("提示","该会员是本月结婚纪念日,将会获得三倍的积分");
								}
								
								Ext.getCmp("vipcard").setValue(vipCard[0].hykh);
								Ext.getCmp("vipname").setValue(vipCard[0].hyxm);
								Ext.getCmp("jf").setValue(vipCard[0].zjf);
								Ext.getCmp("telphone").setValue(vipCard[0].sj);
							    myVipCard = vipCard[0];
						}
			
				 });
		
	}
	
	function createSaleGourp(){
		//组合Form
		 goupForm = new Ext.form.FormPanel({
							labelWidth : 80, // 标签宽度
							// frame : true, //是否渲染表单面板背景色
							defaultType : 'textfield', // 表单元素默认类型
							labelAlign : 'right', // 标签对齐方式
							bodyStyle : 'padding:5 5 5 5', // 表单元素和表单面板的边距
							layout : 'form',
							items : [{
										fieldLabel : '组合销售批次', 
										name : 'groupcharg', // 
										id:'groupcharg',
										anchor : '100%' ,
										listeners: {  
							                    specialKey : function(field, e) {  
							                        if (e.getKey() == Ext.EventObject.ENTER) {
							                           addGropItem(field);
							                        }  
							                    }  
							                }
									}]
						});
		
			groupWindow = new Ext.Window({
							title : '组合销售', // 窗口标题
							layout : 'fit', // 设置窗口布局模式
							width : 400, // 窗口宽度
							height : 100, // 窗口高度
							closable : true, // 是否可关闭
							closeAction:'hide',
							collapsible : false, // 是否可收缩
							maximizable : false, // 设置是否可以最大化
							border : false, // 边框线设置
							constrain : true, // 设置窗口是否可以溢出父容器
							animateTarget : Ext.getBody(),
							pageY : 150, // 页面定位Y坐标
							pageX : document.body.clientWidth / 2 - 300 / 2, // 页面定位X坐标
							items : [goupForm], // 嵌入的表单面板
							buttons : []
						});
		
	}
	
	
	
	//获取批次信息
	function getReceiveStoreDetail(){
		Ext.Ajax.request({
					url    : "orderSystem.ered?reqCode=getpcxx",
					method : 'post', 
					async  : true, 	
					params : {charg : Ext.getCmp("searchCharg").getValue(),
							option:'user',
							ordertype:'ZYR1',
							chargtype:'charg',
							postType:1
						},
					success : function(respose) {
						var data = Ext.decode(respose.responseText);
						var charginfo = data[0];
						if(!validateCharg(charginfo)){
							return false;
						}
						//chargDetailWindow.show();
						var b =  chargDetailForm.getForm().reset();//清空
						//Ext.getCmp("detailgongf").hide(); 
						//Ext.getCmp("detailmrjj").hide();
						Ext.getCmp("detailcx").hide();
						var obj={
							charg:charginfo.charg,
							matnr:charginfo.bkbh,
							maktx:charginfo.plmc,
							labst:charginfo.oldsalesquantity,
							hpzl:charginfo.oldgoldWeight,
							meins:charginfo.meins,
							kbetr:-charginfo.sxj,
							kbetr_s:-charginfo.sxj,
							zzzk1:0,
							zzzk2:0,
							zzkj:0,
							zzzk2:0,
							zzzk3:0,
							zzzkg:0,
							zsxkg:100,
							zzsq1:charginfo.oldmarketprivilege,
							zzfq1:charginfo.oldselfprivilege,
							zzsq2:charginfo.oldmarketticketprice,
							zzfq2:charginfo.oldselfticketprice,
							zzjf3:charginfo.oldvipintegral,
							jf:-charginfo.oldcurrentintegral,
							lgort:'0002',
							sortid:charginfo.oldsapsaleorderid||charginfo.oldsalesorderid,
							pstyv:'ZREN'
							
							
						};	
						
						var p = new store.recordType(obj,obj.charg);
       						 store.insert(store.getCount(),p);
       						 
       						 sumje();		
		//zcxdm	促销代码
		//zp 图片地址	
					}
						
		})
	}
	
	//获取常规折扣
	function getzzk1(o){
		Ext.Ajax.request({
					url    : "orderSystem.ered?reqCode=getDiscount&option=user&postType=1",
					method : 'post', 
					async  : false,  	
					params : {charg : o.charg,matnr:o.matnr,saledate:Ext.getCmp("saledate").getValue()},
					timeout : 120000,
					success : function(respose) {
						 var obj = Ext.decode(respose.responseText);
						 Ext.getCmp("detailKv").setValue(obj.discount1);
						 Ext.getCmp("detailcx").hide();
					}
		});
	} 
	//促销代码改变事件
	function detailKlChange(o){
		if(o.getValue()=="01"){
			var zzk1 = getzzk1(
							{charg:Ext.getCmp("detailCharg").getValue(),
							matnr:Ext.getCmp("detailmatnr").getValue(),
							saledate:Ext.getCmp("saledate").getValue()}
						);
			setKbetr();//实收
		}else if (o.getValue()=="02"){
			
			//显示促销代码
			store_cx.load();
			setKbetr();//实收
		}
		
	}
	
	//
	function detailTsChange(o){
		var tskv= Ext.getCmp("detailtsKv");
		if(o.getValue()==""){
			tskv.setValue(100);
			tskv.disable();
		}else{
			tskv.enable();
		}
		setKbetr();//实收
	}	
	//检查批次
	function validateCharg(charginfo){
		if(!charginfo){
			Ext.Msg.alert("提示","批次不存在");
			return false;
		}else if (store.getById(charginfo.charg)){
			Ext.Msg.alert("提示","该批次已存在项目中");
			return false;
		}else if (!myVipCard){
			Ext.Msg.alert("提示","请先输入会员卡号");
			return false;
		}
		
		return true;	
	}
	
	//工费
	function setGongFei(o){
		Ext.Ajax.request({
					url    : "orderSystem.ered?reqCode=getZjbgf&postType=1",
					method : 'post', 
					async  : false,  	
					params : {charg : o.charg,kondm:o.kondm},
					timeout : 120000,
					success : function(respose) {
						 var gf = Ext.decode(respose.responseText);
						 Ext.getCmp("detailgongf").setValue(gf).show();
					}
		});
	}
	//每日金价
	function setMeiZttj(o){
		Ext.Ajax.request({
					url    : "orderSystem.ered?reqCode=getGoldPrices&postType=1",
					method : 'post', 
					async  : false,  	
					params : {chargtype : o.zjlbm,random : Math.random()},
					timeout : 120000,
					success : function(respose) {
						 var jj = Ext.decode(respose.responseText);
						
						 if(!jj.length){
						  Ext.getCmp("detailmrjj").setValue("请维护金价,否则无法添加").show();
						 	return;
						 }
						 Ext.getCmp("detailmrjj").setValue(jj[0]["drjj"]).show();
						
					}
		});
	}
	
	//设置图片路径
	function setPicUrl(o){
			var url = "../../../sappic/"+o.zmatnrt;
			var brow = Ext.getCmp("browseImage").getEl().dom;
			brow.src = url;
			brow.onerror=function (){
				this.src ="../../../longhaul/pos/order/images/zjzb.gif";
			};	
	}
	//设置实收
	function setKbetr(){
		var form=chargDetailForm.getForm();
		var detailKl = form.findField("detailKl").getValue();//促销
		var detailKbetrb = form.findField("detailKbetrb").getValue();//标签价
		var detailhpzl = form.findField("detailhpzl").getValue();//重量
		var detailzfyhj = form.findField("detailzfyhj").getValue();//自发优惠卷
		var detailscyhj = form.findField("detailscyhj").getValue();//商场优惠卷
		var detailgongf = form.findField("detailgongf").getValue();//工费
		var detailKv = form.findField("detailKv").getValue();//常规折扣
		var detailtsKv = form.findField("detailtsKv").getValue();//折扣
		var detailVipDx = form.findField("detailVipDx").getValue();//VIP抵现
		var detailzfxjj = form.findField("detailzfxjj").getValue();//自发现金卷
		var detailscxjj = form.findField("detailscxjj").getValue();// 商场现金卷
		var detailmrjj = form.findField("detailmrjj").getValue();//每日金价 
		var detailmeins = form.findField("detailmeins").getValue();//单位
		var detailKbetrs = form.findField("detailKbetrs");//实收
		var detailKbetry = form.findField("detailKbetry");//应收
		var kbetr=0,yh=0;
   		//黄铂金按G销售
   		if(!detailKbetrb&&detailmeins=="G"){
   			 kbetr = (parseFloat(detailgongf) + parseFloat(detailmrjj) ) * parseFloat(detailhpzl);   			
   		}else{
   			 kbetr = detailKbetrb * detailKv * detailtsKv / 10000;
   		}
 		kbetr = kbetr - parseFloat(detailzfyhj) - parseFloat(detailscyhj) - parseFloat(detailVipDx) - parseFloat(detailzfxjj) - parseFloat(detailscxjj);
 		
 		detailKbetrs.setValue(kbetr.toFixed(2));
   	    detailKbetry.setValue(kbetr.toFixed(2));
 		
	}
	//修改赠送方式方式
	function changedetailzsfs(){
		var v = this.getValue();
		if(!v)return;
		var form=chargDetailForm.getForm();
		var matnr = form.findField("detailmatnr").getValue();
		if(v=="08"){
			if( matnr.substring(1,3)!="NE"){
				this.setValue("");
				Ext.Msg.alert("提示","你输入的批次，不是赠链");
				return;
			}
			var bool=false;
			for(var i =0;i<store.getCount();i++){
				 var record = store.getAt(i) ;
				 if(record.get("maktx").indexOf("赠链")){
				 	bool = true;
				 	break;
				 }
			}
			if(!bool){
				this.setValue("");
				Ext.Msg.alert("提示","该订单中,不能赠送赠链");
				return;
			}
		}
		var detailKbetrs = form.findField("detailKbetrs");//实收
			detailKbetrs.setValue(0);//赠送货品实收为零
	}
	
	var myButon;
	//添加行项目
	function addItem(thisp){
		myButon = thisp||this;
		myButon.setDisabled(true);
		setTimeout(function (){
			myButon.setDisabled(false);
		},3000);//怕终端电脑反应慢，重复提交
		
		var bl=chargDetailForm.getForm().isValid( );
		if(!bl){
			Ext.Msg.alert("提示","数据输入有误");
			return;
		}
		
		var form=chargDetailForm.getForm();
		var obj ={
			charg:form.findField("detailCharg").getValue(),
			matnr:form.findField("detailmatnr").getValue(),
			maktx:form.findField("detailmaktx").getValue(),
			kbetr:form.findField("detailKbetrb").getValue(),
			labst:form.findField("detaillabst").getValue(),
			hpzl:form.findField("detailhpzl").getValue(),
			kbetr_s:form.findField("detailKbetrs").getValue(),
			pstyv:'ZREN',
			zzsq1:form.findField("detailscyhj").getValue(),//商场优惠券
			zzfq1:form.findField("detailzfyhj").getValue(),//自发优惠券
			zzsq2:form.findField("detailscxjj").getValue(),//商场现金券
			zzfq2:form.findField("detailzfxjj").getValue(),//自发现金券
			zzjf3:form.findField("detailVipDx").getValue(),//VIP抵现优惠
			
			lgort:form.findField("detaillgort").getValue(),
			meins:form.findField("detailmeins").getValue()
		}
		//常规折扣
		if(form.findField("detailKl").getValue()=="01"){
			obj["zzzk1"] =  form.findField("detailKv").getValue();
		}else{
			//促销折扣
			obj["zzzk2"] =  form.findField("detailKv").getValue();
			obj["zcxdm"]=form.findField("detailcx").getValue();//促销代码
		}
		//特殊的一些折扣
		var ts = form.findField("detailTs").getValue();
		obj[ts] = form.findField("detailtsKv").getValue();
		//实销售折扣
		if(obj.kbetr)
			obj["zsxkg"]= 	(parseFloat(obj.kbetr_s) / parseFloat(obj.kbetr) * 100).toFixed(0)	;
		//赠送方式
		obj["zsfs"] = form.findField("detailzsfs").getValue();
		//本次销售积分
		var jfgz = getCurrentIntegral();
		if(!jfgz){
			Ext.Msg.alert("提示","积分规则没有维护,请先联系VIP部");
			return;
		}
		var double = myVipCard.doubleInteval?3:1;
		obj["jf"] = (Number(obj.kbetr_s) / jfgz).toFixed(0) * double;
		//工费
		obj["gongf"] = form.findField("detailgongf").getValue();
		//每日金价
		obj["mrjj"] = form.findField("detailmrjj").getValue();
		//项目类别
		obj["pstyv"] = 'ZTAN';
		
		// 图片地址
		obj["picurl"]=form.findField("detailpicurl").getValue();
				
		var p = new store.recordType(obj,obj.charg);
        store.insert(store.getCount(),p)
        
        //金额块
        sumje();
       
        //礼品的选择范围
        store_lp.loadData([]);
        
        //隐藏
        chargDetailWindow.hide();
        Ext.getCmp("searchCharg").setValue("");
        
	}
	//汇总金额
	function sumje(){	
		var jesum = Ext.getCmp("jesum");//合计金额增加
	    var jexj = Ext.getCmp("jexj");//现金
	    var jeyl = Ext.getCmp("jeyl");//银联
	    var jegwk = Ext.getCmp("jegwk")//购物卡
	    var xfjf = Ext.getCmp("xfjf");
        var a=0,b=0,c=0,d=0,f=0;
        for(var i=0;i<store.getCount();i++){
            var record = store.getAt(i);
        	a += parseFloat(record.get("kbetr_s"));
        	f += Number(record.get("jf"));
        } 
		//现金
		b = (a -  (parseFloat(jeyl.getValue())||0) - (parseFloat(jegwk.getValue())||0)).toFixed(2);
		if(b>0){//金额输错
			if(this.id=="jeyl"){
				jeyl.setValue(0);
			}else if (this.id=="jegwk"){
				jegwk.setValue(0);
			}
			Ext.Msg.alert("提示","你输入的金额太大，请重新输入");
			b = (a -  (parseFloat(jeyl.getValue())||0) - (parseFloat(jegwk.getValue())||0)).toFixed(2);
		} 
		xfjf.setValue(f.toFixed(0));
        jesum.setValue(a.toFixed(2));
        jexj.setValue(b);
	}
	
	//获取包材
	function getBc(){
		Ext.Ajax.request({
					url    : "orderSystem.ered?reqCode=getPackageInfo&postType=1",
					method : 'post', 
					async  : false,  	
					timeout : 120000,
					success : function(respose) {
						var data = Ext.decode(respose.responseText);
						var arrs= [];
						for(var i=0;i<data.length;i++){
						    var vi = data[i];
							var arr=new Array();
							arr.push(vi.matnr+"--"+vi.maktx);
							arr.push(vi.matnr);
							arrs.push(arr)
						}
						store_bc.loadData(arrs);
					}
		});
		
	}
	
	//添加包材
	function addBc(){
		var obj ={
					matnr:this.getValue(),
					//maktx:this.getName(),
					labst:1,
					hpzl:0,
					kbetr:0,
					kbetr_s:0,
					meins:'PC',
					lgort:'0014',
					zsfs:'',
					zzzk1:0,
					zzzk2:0,
					zzzk3:0,
					zzzkg:0,
					zsxkg:0,
					zzsq1:0,
					zzfq1:0,
					zzsq2:0,
					zzfq2:0,
					zzjf3:0,
					jf:0,
					gongf:0,
					mrjj:0
				};
			var index =	store_bc.find('gValue', obj.matnr)
			var text = store_bc.getAt(index).get("gName");
			obj["maktx"] = text.replace(obj.matnr+"--","");
		this.setValue("");
		var p = new store.recordType(obj);
        store.insert(store.getCount(),p);
		
	}
	
	//获取礼品
	function getLp(){
	
		if(store_lp.getCount())return ;
		Ext.Ajax.request({
					url    : "orderSystem.ered?reqCode=&postType=1",
					method : 'post', 
					async  : false, 
					params:{chargtype:'gift',giftReferencePrice:Ext.getCmp("jesum").getValue()}, 	
					timeout : 120000,
					success : function(respose) {
						var data = Ext.decode(respose.responseText);
						var arrs= [];
						for(var i=0;i<data.length;i++){
						    var vi = data[i];
							var arr=new Array();
							arr.push(vi.cpbm+"--"+vi.plmc);
							arr.push(vi.cpbm);
							arrs.push(arr);
						}
						store_lp.loadData(arrs);
					}
		});
		
	}
	
	
	//添加礼品
	function addLp(){
		var obj ={
					matnr:this.getValue(),
					//maktx:this.getName(),
					labst:1,
					hpzl:0,
					kbetr:0,
					kbetr_s:0,
					meins:'PC',
					lgort:'0012',
					zsfs:'',
					zzzk1:0,
					zzzk2:0,
					zzzk3:0,
					zzzkg:0,
					zsxkg:0,
					zzsq1:0,
					zzfq1:0,
					zzsq2:0,
					zzfq2:0,
					zzjf3:0,
					jf:0,
					gongf:0,
					mrjj:0	
				};
			var index =	store_lp.find('gValue', obj.matnr)
			var text = store_lp.getAt(index).get("gName");
			obj["maktx"] = text.replace(obj.matnr+"--","");
		this.setValue("");
		var p = new store.recordType(obj);
        store.insert(store.getCount(),p);
		
	}
	//获取积分规则
	function getCurrentIntegral(){
		var jf=0;
		Ext.Ajax.request({
					url    : "orderSystem.ered?reqCode=getCurrentIntegral",
					method : 'post', 
					async  : false, 
					params:{
							matnr:Ext.getCmp("detailmatnr").getValue(),
							kunnr:myVipCard.hybh,
							orderdate:Ext.getCmp("saledate").getValue()
					}, 	
					timeout : 120000,
					success : function(respose) {
						 jf= Ext.decode(respose.responseText);
					}
		});
		return jf;
	}
	
	
	function addGropItem(f){
		myMask.show();
		if(!myVipCard){
			Ext.Msg.alert("提示","请先录入会员号");
			return;
		}
		Ext.Ajax.request({
					url    : "orderSystem.ered?reqCode=getGroupGoodsItem2",
					method : 'post', 
					//async  : false, 
					params:{
							charg:f.getValue()
					}, 	
					timeout : 120000,
					success : function(respose) {
						//
						var data= Ext.decode(respose.responseText);
						if(data.error){
							Ext.Msg.alert("提示",data.error);
						}else if (data.length){
							store.removeAll();
							for(var i=0;i<data.length;i++){
								var record = data[i];
								var obj={
									matnr:record["bkbh"],
									charg:record["cpbm"],
									kbetr_s:record["bqj"],
									kbetr:record["bqj"],
									hpzl:record["jlzl"],
									labst:record["labst"],
									lgort:record["lgort"],
									maktx:record["plmc"],
									picurl:record["zp"],
									meins:record["meins"],
									salegroup:'X',
									zsfs:'',
									zzzk1:0,
									zzzk2:0,
									zzzk3:0,
									zzzkg:0,
									zsxkg:0,
									zzsq1:0,
									zzfq1:0,
									zzsq2:0,
									zzfq2:0,
									zzjf3:0,
									jf:0,
									gongf:0,
									mrjj:0	
								}
								if(parseFloat(obj.labst)<=0||parseFloat(obj.hpzl)<=0){
									Ext.Msg.alert("提示",obj.charg+",已不在库存");
									store.removeAll();
									myMask.hide();
									return;
								}
								Ext.getCmp("detailmatnr").setValue(obj.matnr);
								var jfgz = getCurrentIntegral();
									if(!jfgz){
										Ext.Msg.alert("提示","积分规则没有维护,请先联系VIP部");
										store.removeAll();
										myMask.hide();
										return;
									}
								var double = myVipCard.doubleInteval?3:1;
								obj["jf"] = (Number(obj.kbetr_s) / jfgz).toFixed(0) * double;
								var p = new store.recordType(obj);
        						store.insert(store.getCount(),p);
							}
							f.setValue("");
							myMask.hide();
							groupWindow.hide();
							return;
						}else{
							Ext.Msg.alert("提示","抓取数据出错");
						}
						
					},failure :function() {    
						       myMask.hide(); 
					}   
		});
		
	}
	
	//订单上传
	function submitOrder(){
		if (!myForm.getForm().isValid()){
			Ext.Msg.alert("提示","数据填写不完整");
			return;
		}

		var orderhead={
			customerid:myVipCard.hybh,
			orderreason:Ext.getCmp("orderreason").getValue(),
			saledate:Ext.getCmp("saledate").getValue(),
			remarks:Ext.getCmp("remarks").getValue(),
			salesclerk:Ext.getCmp("assistant_name").getValue(),
			storereceipt:Ext.getCmp("scxp").getValue(),
			unionpay:Ext.getCmp("jeyl").getValue()||0,
			shoppingcard:Ext.getCmp("jegwk").getValue()||0,
			amountcollected:Ext.getCmp("jesum").getValue()||0,
			totalmoney:Ext.getCmp("jesum").getValue()||0,
			cash:Ext.getCmp("jexj").getValue()||0,
			integral:Ext.getCmp("xfjf").getValue()||0,
			vipcard:myVipCard.hykh,
			vipname:myVipCard.hyxm,
			ordertype:'ZYR1'
		}
		
		orderhead.currentIntegral=orderhead.integral;
		var orderitem={};
		for(var i=0;i<store.getCount();i++){
			var record = store.getAt(i);

			 orderitem[i]={
				salepromotion:record.get("zcxdm"),
				salesorderitem:(i+1)*10,
				orderitemtype:record.get("pstyv"),//项目类别
				materialnumber:record.get("matnr"),
				batchnumber:record.get("charg"),
				salesquantity:record.get("labst"),
				goldweight:record.get("hpzl"),
				meins:record.get("meins"),
				storagelocation:record.get("lgort"),
				netprice:record.get("kbetr_s"),
				tagprice:record.get("kbetr"),
				settlegoldvalue:record.get("mrjj"),
				goldprice:record.get("mrjj"),
				discount1:record.get("zzzk1")?parseFloat(record.get("zzzk1")):0,
				discount2:record.get("zzzk2")?parseFloat(record.get("zzzk2")):0,
				discount3:record.get("zzzk3")?parseFloat(record.get("zzzk3")):0,
				discount4:record.get("zzzkg")?parseFloat(record.get("zzzkg")):0,
				discount5:record.get("zzzkj")?parseFloat(record.get("zzzkj")):0,
				vipintegral:record.get("zzjf3"),
				currentIntegral:(record.get("jf")||0)/10,
				goodsprocessingfee:record.get("gongf"),
				marketticketprice:record.get("zzsq2"),
				giftMethod:"",
				selfticketprice:"-"+record.get("zzfq2"),
				marketprivilege:record.get("zzsq1"),
				selfprivilege:"-"+record.get("zzfq1"),
				materialdesc:record.get("maktx"),
				productpictureurl:record.get("picurl")
					
			};
			
		}
		Ext.MessageBox.confirm('提示', "确定要提交吗?",function (b){
			if(b!="yes")return;
		
		
		    
	        myMask.show();
	       Ext.Ajax.request({
						url    : "orderSystem.ered?reqCode=saveOrderZys1",
						method : 'post', 
						async  : false, 
						params:{
								orderhead:Ext.encode(orderhead),
								orderitem:Ext.encode(orderitem)
						}, 	
						timeout : 120000,
						success : function(respose) {
							var data = Ext.decode(respose.responseText);
							if(data.success){
								Ext.Msg.alert("提示",data.success);
								Ext.MessageBox.confirm('提示', "已成功生成订单:"+ data.success + 
								",需要打印吗?", function (b){
									if(b=="yes"){
									window.showModalDialog("dm_dyxp.jsp?ywxh="+ data.success ,
														'printWindow',
													'dialogWidth=650px;dialogHeight=700px');
									}
									
								}); 
								store.removeAll();//清空store
								myForm.getForm().reset( ) ;//form清空
							}else if (data.errorSap){
								Ext.Msg.alert("提示",data.errorSap);
							}else if (data.error){
								Ext.Msg.alert("提示",data,error);
							}
							myMask.hide(); 
						},failure : function(f, o) {    
						       myMask.hide(); 
						}    
			});
     
		});
	}	
});