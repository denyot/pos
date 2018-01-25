Ext.ns("Ext.grid.plugins");

Ext.grid.plugins.AutoResize = Ext.extend(Ext.util.Observable,{
	init:function(grid){
		grid.applyToMarkup = function(el){
			grid.render(el);
		}
		var containerId = Ext.get(grid.renderTo || grid.applyTo).id;
		if(Ext.isIE){
			Ext.get(containerId).on("resize",function(){
				grid.setWidth.defer(100,grid,[Ext.get(containerId).getWidth()]);
			});
		}else{
			window.onresize = function(){
				grid.setWidth(Ext.get(containerId).getWidth());
			}
		}
	}
});