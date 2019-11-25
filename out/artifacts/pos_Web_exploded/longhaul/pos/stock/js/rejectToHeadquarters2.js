Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
    var urlPs=Ext.urlDecode(location.search.slice(1));
 store = new Ext.data.ArrayStore({
        fields: ['gName', 'gValue'],
        data :[
               ['请选择...',""],
               ["镶嵌类","1"],
               ["银饰类","2"],
               ["玉石类","3"],
               ["18K金类","4"],
               ["铂金类","5"],
               ["黄金类","6"],
               ["钯金类","7"],
               ["赠品及包材","8"],
               ["其他","9"]
              ]
    });

    var provinceStore = new Ext.data.Store({  
        proxy: new Ext.data.HttpProxy({ url: 
        	"longhaul/pos/stock/stockSystem.ered?reqCode=getWerksByWhere&option=user&postType=1&werks=" 	
        }),  
        reader: new Ext.data.JsonReader(  
          { root: "" },  
          ["werks", "name1"]  
          )  
    });  
    
    
    
     var store_xsfs = new Ext.data.ArrayStore({
        fields: ['gnfs', 'gvfs'],
        data :[
               ["123、一口价产品","123"],
               ["127、正价产品","127"],
               ["126、按克销售","126"],
               ["121、特价产品","121"]
              ]
    });
     
    
   /*
    var combo = new Ext.form.ComboBox({
        store: store,
        displayField:'state',
        typeAhead: true,
        triggerAction: 'all',
        emptyText:'请选择...',
        selectOnFocus:true, 
    });*/
    
    var secondForm = new Ext.form.FormPanel({
		id : 'secondForm',
		name : 'secondForm',
		renderTo: 'panel-basic',
		//title:'选择',
		labelWidth : 110, // 标签宽度
		autoScroll : true,
		// frame : true, // 是否渲染表单面板背景色
		// defaultType : 'textfield', // 表单元素默认类型
		labelAlign : 'right', // 标签对齐方式
		frame:true,
		bodyStyle : 'padding:5 10 5 5', // 表单元素和表单面板的边距
		items : [{
			layout : 'column',
			
			border : false,
			items : [{
				columnWidth : .5,
				layout : 'form',
				border : false,
				items : [
						{
							fieldLabel : '批次号',
							xtype : 'textfield',
							name : 'charg',
							id:'charg',
							//allowBlank : false,
							anchor : '90%',
							 selectOnfocus: true,
							listeners: {  
			                    specialkey: function(field,e){    
			                        if (e.getKey()==Ext.EventObject.ENTER){ 
			                       		
			                           var v =  field.getValue();
			                           if(!v){
			                       			return false;
			                       		}   
			                        	
			                           //输入批次号 添加一条数据
			                           addGridBycharg(this);
			                        }  
			                    }  
			                }
						},{
							fieldLabel : '物料号',
							xtype : 'textfield',
							name : 'matnr',
							id:'matnr',
							hidden:true,
							anchor : '90%',
							listeners: {  
			                    specialkey: function(field,e){    
			                        if (e.getKey()==Ext.EventObject.ENTER){ 
			                           var v =  field.getValue();
			                           if(!v){
			                       			return false;
			                       		}   
			                           //输入物料 添加一条数据
			                           addGridByMatnr(this);
			                        }  
			                    }  
			                }
							
						},
						{
							fieldLabel : '出库日期',
							xtype : 'datefield',
							name : 'outdate',// 'stcd2',
							id : 'outdate',
							format : 'Y-m-d',
							value:new Date() ,
							
							editable:false,
							//value : '1900-01-01',
							// hidden: true,
							// hideLabel:true,
							anchor : '90%'
						}, {
								fieldLabel : '出库订单号',
								xtype : 'textfield',
								name : 'outid',
								id:'outid',
								readOnly:true,
								value:'提交后自动生成',
								anchor : '90%'
							},
							{
								fieldLabel : '备注',
								xtype : 'textfield',
								name : 'remark',
								id:'remark',
								anchor : '90%'
							}
						]
				},
				{
					columnWidth : .5,
					layout : 'form',
					border : false,
					 buttonAlign:'center',//按钮对其方式
					buttons:[
						{
							text:"提交",
						    scale: "medium" ,
						    anchor : '45%',
						    handler:function (){
						    	 Ext.Msg.confirm('温馨提示',"确定要提交吗",function (btn){
		                         	if(btn=="yes"){
		                         		var bo=passInput();//检查输入是否完全
		                         		if(!bo)return false;
		                         		saveSubmit();
		                         		
		                         	}
		                         });
						    }
							
						},
						{
							text:"修改", 
						 	scale: "medium" ,
						 	anchor : '45%',
						 	handler:function (){
						 		  searchWin();
						 	}
						},{
							text:"清空", 
						 	scale: "medium" ,
						 	anchor : '45%',
						 	handler:function (){
						 	Ext.Msg.confirm('警告提示',"确定要清空吗",function (btn){
	                         	if(btn=="yes"){
	                         		clearData();
	                         	}
	                         });
						 		
						 		
						 	}
						}
					],
					items : [//cardnature, //maritalStatus, 
					         {
								fieldLabel : '货品类型',
								xtype : 'combo',
							    store: store,
							    id:'hptype',
							    mode : 'local',
							    editable:false,
						        displayField:'state',
						        typeAhead: true,
						        triggerAction: 'all',
						        emptyText:'请输入...',
						        valueField : 'gValue',//值
						        displayField : 'gName',//显示文本
								anchor : '90%',
								listeners:{
					        	 change:function (field,newValue,oldValue){
					        	 	if(newValue == "8"){//易耗品
					        	 		//Ext.getCmp("charg").fieldLabel="物料号"
					        	 	 Ext.getCmp("charg").hide();
					        	 	   Ext.getCmp("matnr").show();
					        	 	}else{
					        	 		 Ext.getCmp("matnr").hide();
					        	 		 Ext.getCmp("charg").show();						        	 	   
					        	  }
					         	}
					        	 
					         }
							},{
								fieldLabel : '入库门店',
								xtype : 'combo',
								name : 'inwerks',// 'stcd2',
								id : 'inwerks',
								minChars:1,
								anchor : '90%',
								mode:'local ',
								store:provinceStore,
								enableKeyEvents:true, 
								typeAhead:false,
						        triggerAction:'query',
								valueField : 'werks',//值
						        displayField : 'name1',//显示文本
								listeners:{ 
									"expand":function(combo, store,index){ 
										var s=this.getStore();
										s.load();
									},
									afterRender:function (combo){
										if (urlPs.th=="th"){
											combo.getStore().loadData([{"werks":"1000","name1":"兆亮珠宝"}]);
											combo.setValue("1000");
											combo.disable();//禁用
											
										}
									} 
				         		}
							},{
								fieldLabel : '销售方式',
								xtype : 'combo',
							    store: store_xsfs,
							    id:'hpxsfs',
							    mode : 'local',
							    editable:false,
						        displayField:'state',
						        typeAhead: true,
						        triggerAction: 'all',
						        emptyText:'请输入...',
						        valueField : 'gvfs',//值
						        displayField : 'gnfs',//显示文本
								anchor : '90%'
								
							}
							
							
							
							
							
							
					]
				}
			]
		}]
	});
   
    // create the data store
    var store = new Ext.data.JsonStore({
        fields: [
           {name: 'posnr'},
           {name: 'charg'},
           {name: 'matnr'},
           {name: 'ztxt1'},
           {name: 'zxsfs'},
           {name: 'kbetr',type: 'float'},
           {name: 'labst' , type: 'float'},
           {name: 'labst2' ,type: 'float'},
           {name: 'zclzl' ,type: 'float'},
           {name: 'lgort' },
           {name: 'kondm' },
           {name: 'meins' },
           {name: 'zmatnrt' },
           {name: 'remark' }
           
        ]   
    });

   
    
    var cm = new Ext.grid.ColumnModel
    ({ columns: [
    	 {
                id       :'posnr',
                header   : '项目号', 
                width    : 50, 
                sortable : true,
                dataIndex: 'posnr',
                summaryRenderer: function (v, params, data) { return '合计'; }
            },
             {
                id       :'charg',
                header   : '批次号', 
                width    : 160, 
                dataIndex: 'charg'
            },
            {
                header   : '物料号', 
                width    : 75, 
                sortable : true, 
                renderer : 'matnr', 
                dataIndex: 'matnr'
            },
            {
                header   : '物料名称', 
                width    : 75, 
                sortable : true, 
                renderer : 'ztxt1', 
                dataIndex: 'ztxt1'
            },
            {
                header   : '调出数量', 
                width    : 75, 
                sortable : true, 
                renderer : 'labst', 
                dataIndex: 'labst',
                summaryType: 'sum',
                editor: new  Ext.form.NumberField({
	              decimalPrecision:3
           		 })
            },
            {
                header   : '总数量', 
                width    : 75, 
                sortable : true, 
                renderer : 'labst2', 
                dataIndex: 'labst2'
            },
            {
                header   : '单位', 
                width    : 40, 
                sortable : true, 
                renderer : 'meins', 
                dataIndex: 'meins'
            },
            {
                header   : '金重', 
                width    : 75, 
                sortable : true, 
                renderer : 'zclzl', 
                dataIndex: 'zclzl',
                summaryType: 'sum'
            },   
            {
                header   : '标签价', 
                width    : 75, 
                sortable : true, 
                renderer : 'kbetr', 
                dataIndex: 'kbetr',
                summaryType: 'sum'
            },
            {
                header   : '调出库位', 
                width    : 75, 
                sortable : true, 
                renderer : 'lgort', 
                dataIndex: 'lgort'
            },
            {
                header   : '定价组', 
                width    : 75, 
                sortable : true, 
                renderer : 'kondm', 
                dataIndex: 'kondm'
            }, {
                header   : '销售方式', 
                width    : 75, 
                sortable : true, 
                renderer : 'zxsfs', 
                dataIndex: 'zxsfs'
            },
            
           /* {
                header   : '图片', 
                width    : 85, 
               
                renderer : function (v){
                	return "<img src = 'sappic/"+v+"' width='80px' height='60px'>";
                }, 
                dataIndex: 'zmatnrt'
            },*/
            {
                header   : '行备注', 
                width    : 90, 
                sortable : true, 
                renderer : 'remark', 
                dataIndex: 'remark',
                editor: new Ext.form.TextField({
              	  //allowBlank: false
           		})
            },
            {
                xtype: 'actioncolumn',
                header   : '操作',
                width: 50,
                items: [{
                    icon   : 'resource/ext-3.4.0/resources/images/access/shared/delete.gif',  // Use a URL in the icon config
                    tooltip: 'Sell stock',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        var posnr = rec.get("posnr");
                         Ext.Msg.confirm('警告提示',"确定要删除项目"+posnr+"吗",function (btn){
                         	if(btn=="yes"){
                         		store.removeAt(rowIndex);
                       		    sortTableBymyData();//排序
                         	}
                         });
                        
                    }  
                }]
            }
    ]
    });
    
    cm.defaultSortable = false;
    
   // 合计
	var summary = new Ext.ux.grid.GridSummary();

    var grid = new Ext.grid.EditorGridPanel({
        store: store,
         plugins: summary,
         cm:cm,
        stripeRows: true,
       // autoExpandColumn: 'company',
        height: 510,
        region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		store : store, // 数据存储
		stripeRows : true, // 斑马线
		frame:true,
        title: '明细',
        // config options for stateful behavior
        stateful: true,
        stateId: 'grid',
        id: 'ShipmentsDetailGirdPanel',
		
        listeners:{    
		           'beforeedit':function(o){
		           		if(o.field=="remark"){
		           			return true;
		           		}    
		               //var createBarcodeType = o.record.get('createBarcodeType');    
		               var type=Ext.getCmp("hptype").getValue();             
		               if (type!="8"&&type!="9"){//赠品包材才才能更改
		               		return false; 
		               }         
		           },
		           'afteredit':function(o){
		           		if(o.field=="remark"){
		           			return ;
		           		}   
		           		var labst = o.record.get('labst');
		           		var labst2 = o.record.get('labst2');
		           		if(labst > labst2){
		           			o.record.set('labst',0);
		           			Ext.Msg.alert('提示',"最大数量为："+labst2+"件");
		           			//alert(11);
		           		}
		           }  
		 }    
    });
    grid.render('grid-example');
    summary.toggleSummary(true);
    //添加数据
    function addGridBycharg(o){
    	var cv = o.getValue();
    	var boolType = Ext.getCmp("hptype");
    	if(boolType.getValue()==""){
    		Ext.Msg.alert('提示',"请先选择货品类型");
    		
    		return false;
    	}
    	//非旧金
    	if(boolType.getValue()!="9"){
	    	var boolxsfs = Ext.getCmp("hpxsfs");
	    	if(boolxsfs.getValue()==""){
	    		Ext.Msg.alert('提示',"请先选择销售方式");
	    		
	    		return false;
	    	}
    	}
     Ext.getBody().mask("批次加载中，请稍等..."); 
    	Ext.Ajax.request({
    		   url: "longhaul/pos/stock/stockSystem.ered?reqCode=getpcxxForKc&option=user&postType=1&werks="
					+ "01DL" + "&random=" + Math.random(),
			   method: 'POST',
			   params:"charg="+cv+"&chargtype=charg",
    		   success: function (response){
    		   		var data = Ext.util.JSON.decode(response.responseText); 
    		   		if (data.length<=0){
    		   			 Ext.Msg.alert('提示',cv+"批次不存在");
    		   			 return false;
    		   		}
    		   		
    		   		for(var i=0;i<data.length;i++){
    		   			
    		   			var obj=data[i];
    		   			if(obj.lgort=="0018"){
    		   				Ext.Msg.alert('提示',obj.charg+"未收货,请收货后再调拨。");
    		   				return false;
    		   			}
    		   			obj.zclzl = obj.hpzl;
    		   			obj.labst2 = obj.labst;
    		   			if (obj.ztxt1==null||obj.ztxt1 == ""){
    		   				obj.ztxt1 = obj.maktx;
    		   			}
    		   			var rebool = bootHptype(obj);
    		   			if(!rebool){
    		   				Ext.Msg.alert('提示',"类型不一致");
    		   			    return false;
    		   			}
    		   			
						if (boolType.getValue()!="9"){
							var rexsfs = Ext.getCmp("hpxsfs").getValue();;
	    		   			if(rexsfs!=obj["zxsfs"]){
	    		   				Ext.Msg.alert('提示',"销售方式有误!"+obj["zxsfs"]);
	    		   			    return false;
	    		   			}
						
						}
    		   			
    		   			
    		   			
    		   			
    		   			var bool=false;
    		   			//判断是否已经存在
    		   			grid.getStore().each(function (gridObj){
    		   				if(obj["charg"]==gridObj.get("charg")){
    		   					bool = true;
    		   					return;
    		   				}
    		   			});
    		   			//已经存在改批次
    		   			if(bool){
    		   				Ext.Msg.alert('提示',cv+"已经存在列表中")
    		   			    return false;
    		   			}
						var p = new store.recordType(obj,obj.charg);
    		   			store.insert(store.getCount(),p)
    		   		}
    		   		sortTableBymyData();//排序
   		   		
    		   		o.setValue("");//清空
    		   		
    		   		
    		   },
    		   failure: function (){
    			   
    		   },callback :function (){
    		   		 Ext.getBody().unmask();//去除MASK  
    		   }
    		   
    		});
    }
    
    
    function addGridByMatnr(o){
    	var cv = o.getValue();
    	Ext.getBody().mask("物料加载中，请稍等"); 
    	Ext.Ajax.request({
    		   url: "longhaul/pos/stock/stockSystem.ered?reqCode=getmatnrinfo&option=user&postType=1&werks="
					+ "01DL" + "&random=" + Math.random(),
			   method: 'POST',
			   params:"charg="+cv+"&chargtype=charg",
    		   success: function (response){
    		   		var data = Ext.util.JSON.decode(response.responseText); 
    		   		if (data.length<=0){
    		   			 Ext.Msg.alert('提示',cv+"物料不存在");
    		   			 return false;
    		   		}
    		   		for(var i=0;i<data.length;i++){
    		   			var obj=data[i];
    		   			if(!obj.labst){
    		   				Ext.Msg.alert('提示',"物料请在易耗品管理进行调拨");
    		   				return false;
    		   			}
    		   			if(obj.lgort=="0018"){
    		   				Ext.Msg.alert('提示',obj.matnr+"未收货,请收货后再调拨。");
    		   				return false;
    		   			}
    		   			obj.labst2 = obj.labst;
    		   			if (obj.ztxt1==null||obj.ztxt1 == ""){
    		   				obj.ztxt1 = obj.maktx;
    		   			}
    		   			obj.labst = 1;
    		   			var bool=false;
    		   			//判断是否已经存在
    		   			grid.getStore().each(function (gridObj){
    		   				if(obj["matnr"]==gridObj.get("matnr")){
    		   					bool = true;
    		   					return;
    		   				}
    		   			});
    		   			//已经存在改批次
    		   			if(bool){
    		   				Ext.Msg.alert('提示',cv+"已经存在列表中");
    		   			    return false;
    		   			}
						var p = new store.recordType(obj,obj.matnr);
    		   			store.insert(store.getCount(),p)
    		   		}
    		   		sortTableBymyData();//排序
   		   		
    		   		o.setValue("");//清空
    		   		
    		   		
    		   }, failure: function (){
    			   
    		   },callback :function (){
    		   		 Ext.getBody().unmask();//去除MASK  
    		   }
    		   
    		});
    }
    
    
    /**
    * 排序
    */
    function sortTableBymyData(){
    	for(var i=0;i<store.getCount();i++){
    		var rec=store.getAt(i);	
    		rec.set('posnr', (i+1)*10);
			rec.commit();
    	}
    	
    	if(store.getCount()>0){//货品类型不能修改
	   		Ext.getCmp("hptype").disable();
	   		Ext.getCmp("hpxsfs").disable();
	   	}else{
	   		Ext.getCmp("hptype").enable();
	   		Ext.getCmp("hpxsfs").enable();
	   	}
    }
    //判断类型是否相同
    function bootHptype(o){
    	var tp=Ext.getCmp("hptype").getValue();
    	if(tp=="1"){
    		if ("01,02,03".indexOf(o.kondm)!=-1)return true;
	    }else if (tp=="2"){
	    		if ("04,15".indexOf(o.kondm)!=-1)return true;
	    	}
    	else if (tp=="3"){
    		if ("05,23".indexOf(o.kondm)!=-1)return true;
    	}
    	else if (tp=="4"){
    		if ("06".indexOf(o.kondm)!=-1)return true;
    	}
    	else if (tp=="5"){
    		if ("07".indexOf(o.kondm)!=-1)return true;
    	}
    	else if (tp=="6"){
    		if ("09,11,12,13,19,24,20".indexOf(o.kondm)!=-1)return true;
    	}
    	else if (tp=="7"){
    		if ("10".indexOf(o.kondm)!=-1)return true;
    	}
    	else if (tp=="8"){
    		if ("17，18".indexOf(o.kondm)!=-1)return true;
    	}
    	else if (tp=="9"){
    		if ("08，14,16,17,21".indexOf(o.kondm)!=-1)return true;
    	}
    	return false;
    }
    
    function passInput(){
    	if(store.getCount()<=0){
    		Ext.Msg.alert('提示',"没有填写任何项目");
    		return false;
		}else if (!Ext.getCmp("outdate").getValue()){
			Ext.Msg.alert('提示',"请输入出库日期");
			return false;
		}
		var inwerks = Ext.getCmp("inwerks").getValue();
		//var inwerksstore = Ext.getCmp("inwerks").getStore();
		var bool=false;
		provinceStore.each(function(record) {
		   if (inwerks ==record.get('werks')){
		   	 bool = true;
		   	return;
		   }
		});
    	Ext.Msg.alert('提示',"请选择正确的门店");
    	return bool;
    }
    //保存提交
    function saveSubmit(){
    	var head={
    		outid:Ext.getCmp("outid").getValue()=="提交后自动生成"?"":Ext.getCmp("outid").getValue(),
    		saledate:Ext.getCmp("outdate").getValue().format('Y-m-d'),
    	    salepromotioncode:"",
    	    inwerk:Ext.getCmp("inwerks").getValue(),
    	    goodtype:Ext.getCmp("hptype").getValue(),
    	    remark:Ext.getCmp("remark").getValue()?Ext.getCmp("remark").getValue():""
    	};

    	var items ={};
    	var a=0,b=0;
    	
    	for(var i=1;i<=store.getCount();i++){
    		var rec = store.getAt(i-1);
    		items[i]={
    			salesorderitem:rec.get("posnr"),
    			upsalesorderitem:"00",
    			batchnumber:rec.get("charg"),
    			materialnumber:rec.get("matnr"),
    			materialdesc:rec.get("ztxt1"),
    			salesquantity:rec.get("labst"),
    			goldweight:rec.get("zclzl")||rec.get("labst"),
    			tagprice:rec.get("kbetr"),
    			storagelocation:rec.get("lgort"),
    			remark:rec.get("remark"),
    			productpictureurl:rec.get("zmatnrt")
    		}
    		clearNull(items[i]);
    		a +=   parseFloat(rec.get("zclzl")); 
    		b +=  parseFloat(rec.get("kbetr"));
    		
    	} 
    	head["totalgoldweight"]=isNaN(a)?0:a;
    	head["totalprice"]=isNaN(b)?0:b;
    	var headStr = Ext.encode(head);
    	var itemsStr=Ext.encode(items);
    	Ext.getBody().mask("正在提交，请稍等");
    	
    	Ext.Ajax.request({
    		   url: "longhaul/pos/stock/stockSystem.ered?reqCode=submitOutStock&option=user&postType=1",
			   method: 'POST',
			   params:"orderhead="+headStr+"&orderitem="+itemsStr,
    		   success: function (response){
    		  	    var data = Ext.util.JSON.decode(response.responseText); 
    		   		if(data.success !=""){
    		   			Ext.Msg.alert('提示',data.success);
    		   			clearData();
    		   		}
    		   }, failure: function (){
    			   
    		   },callback :function (){
    		   		 Ext.getBody().unmask();//去除MASK  
    		   }
    		   
    		});
    }
    var proWin;
    //显示查询窗口
    function searchWin(){
    	if(!proWin){
    		var urlPs=Ext.urlDecode(location.search.slice(1)); 
    	var updateStore = new Ext.data.Store({  
		        proxy: new Ext.data.HttpProxy({ url: 
		        	"longhaul/pos/stock/stockSystem.ered?reqCode=getOutid&option=user&postType=1&werks=&th="+urlPs.th 
		        }),  
		        reader: new Ext.data.JsonReader(  
		          { root: "" },  
		          ["outid", "name1"]  
		          )  
		    });  
	 		//updateStore.load();
	 		var superSelect = new Ext.form.ComboBox({
	 						fieldLabel : '出库单号',
					       		name : 'comoutid',// 'stcd2',
								id : 'comoutid',
								minChars:1,
								anchor : '90%',
								mode:'local ',
								store:updateStore,
								enableKeyEvents:true, 
								typeAhead:false,
								emptyText:'请输入...',
						        triggerAction:'query',
								valueField : 'outid',//值
						        displayField : 'name1',//显示文本
							listeners:{ 
								"expand":function(combo, store,index){ 
									var s=this.getStore();
									s.load();
									
								}
							}
					    });
	 	
	 		 var form = new Ext.form.FormPanel({
		                frame: true,
		               // title: '查询',
		                style: 'margin:10px',
		                items: [superSelect]
		            });
	 	
	 		proWin = new Ext.Window({
							id:"win",
					        layout:'fit',
					        title: '请选择',
					        //iconCls:'useradd_icon',
					        width:600,
					        height:400,
					       // modal: true,
					        closeAction:'hide',
					        plain: true,
					        //buttonAlign:'center',
					        maximizable: false,
					        //resizable:true,
					        items: [form],
					        buttons: [{  
					            text: '确定',  
					            formBind: true,  
					            handler: function(){  
					              
					               getAll();	   
					            }  
					        }]  
					    });
			 }
					proWin.show();
    	
    }
    
    function getAll(){
    	var comoutid = Ext.getCmp("comoutid").getValue();
    	if(!comoutid){
    		Ext.Msg.alert('提示',"未加载任何单据");
    		return false;
    	}
   		
    	Ext.getBody().mask("正在加载，请稍等"); 
    	Ext.Ajax.request({
    		   url: "longhaul/pos/stock/stockSystem.ered?reqCode=getAll&option=user&postType=1",
			   method: 'POST',
			   params:"outid="+comoutid,
    		   success: function (response){
    		  	    var data = Ext.util.JSON.decode(response.responseText); 
    		   	if(data.length>1){
    		   		var head = data[0][0];
    		   		 for ( var p in head ){
    		   			var ss =Ext.getCmp(p);
    		   			ss.setValue(head[p])
    		   			//;
    		   		}
    		   		var item = data[1];
    		   		store.loadData(item);
    		   		sortTableBymyData();
    		   	}
    		   		
    		   	 proWin.hide();
    		   }, failure: function (){
    			   
    		   },callback :function (){
    		   		 Ext.getBody().unmask();//去除MASK  
    		   }
    		   
    		});
    }
    //去除null
    function clearNull(o){
    	for(var p in o){
    		if(!o[p]){
        		o[p]="";
        	}
    		
    	}
    	
    	return o;
    }
    
    function clearData(){
    	Ext.getCmp("charg").setValue("");
		Ext.getCmp("matnr").setValue("");
		Ext.getCmp("remark").setValue("");
		if (urlPs.th=="th"){
			Ext.getCmp("inwerks").setValue("1000");
		}else{
			Ext.getCmp("inwerks").setValue("");
		}
		var comoutid=Ext.getCmp("comoutid");
		if(comoutid){
			comoutid.setValue("");
		};
		Ext.getCmp("outid").setValue("提交后自动生成");
		store.loadData([]);
		sortTableBymyData();
    }
    
});