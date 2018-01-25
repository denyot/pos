Ext.onReady(function(){
	Ext.data.Connection.prototype.timeout='300000';
var searchButton = new Ext.Button( { 
renderTo : 'businessUserQuery', 
text : "<span style='font-size:12px'>查询</span>", 
iconCls : 'addx', 
autoHeight : true, 
width : 60, 

bodyStyle : 'padding: 5px', 
handler : function() { 
//标志位，查找到第一个，就退出遍历 
    var flag = 0; 
    var searchTxt = search.getValue(); 
    for(var i = 0; i < store.getCount();i++) 
    { 
    //用输入内容searchTxt创建正则表达式对象，忽略大小写。 
            var re = new RegExp(searchTxt,"ig"); 
            var num = String(store.getAt(i).get("number")); 
            //在字符串num中查找匹配。  
            var r = num.match(re); 
    if(r != null) 
    { 
                               //找到匹配项就把这一行选中 
    userGrid.getSelectionModel().selectRow(i); 
    break; 
    } 
    } 
} 
}); 

var search = new Ext.form.TextField( { 
renderTo : 'businessUserSearch', 
Height : 40, 
width : 120, 
bodyStyle : 'padding: 5px;', 
handler : function() { 

} 
}); 

var userData = new Array(); 
    var store = new Ext.data.ArrayStore({ 
        fields: [ 
            { 
                name: 'number' 
            } 
        ] 
    }); 
    store.loadData(userData); 

    var cm = new Ext.grid.ColumnModel({ 
        columns:[ 
           // userGrid_sm, 
            { 
                id:"number", 
                header:"用户号码", 
                width: 200, 
                align:'center', 
                dataIndex:"number", 
                editor: new Ext.form.NumberField({ 
                allowBlank: false, 
                minLength:1, 
                maxLength:15 
            }) 
            }]}); 

    var userGrid = new Ext.grid.EditorGridPanel({ 
       // sm:userGrid_sm, 
        cm:cm, 
        height:380, 
        width: 1081, 
        frame: true, 
        store:store 
    }); 
userGrid.render('businessEditorGrid');



	
});