$(function() {
//切换
 $("input[name=service_type_se]").click(function(){
    var _step = $("#step").val();
    _service_type = $(this).attr("realva");
    window.location.href=basepath
                + "longhaul/pos/aftersales/aftersales.ered?reqCode=aftersalesStart&postType=1"
                + "&service_type=" + _service_type
                + "&step=" + _step
                + "&WERKS=" + WERKS
                + "&userid=" + opterator
                + "&posurl=" + posurl
                + "&password=" + password;
  });
	var currentPage = 1;
	var totalPage = 0;
	$(document).keydown(function(e) {
				var target = e.target;
				var tag = e.target.tagName.toUpperCase();
				if (e.keyCode == 13) {
					getOrderPageCount();
				}
			});
//绑定日期
	$("#start_time").datepicker({
				changeMonth : true,
				changeYear : true
			});
	$("#end_time").datepicker({
				changeMonth : true,
				changeYear : true
			});

	getOrderPageCount();
//鼠标经过
	$("#faceliftlisttable tr").live('mouseover', function() {
				$(this).addClass("trover");
			});

	$("#faceliftlisttable tr").live('mouseout', function() {
				$(this).removeClass("trover");
			});

	// 分页查询
	function getorderbypage(page, pageSize) {
		$("#faceliftlisttable tr").each(function(index) {
					if (index != 0)
						$(this).remove();
				});
		$('#faceliftheadlist td').addClass('tdclass'); // 增加td样式
		_service_number = $("#service_number").val();//查询条件
		_service_number = _service_number == null ? "" : _service_number;
		_member_name = encodeURI($("#member_name").val(),"utf-8");
		_status = $("#status").val();
		_start_time = $.trim($('#start_time').val());
		_end_time = $.trim($('#end_time').val());
		_old_commodity_barcode = $.trim($('#old_commodity_barcode').val());
		_step = $("#step").val();
		_service_type = $("#service_type").val();
		$.getJSON(
				"longhaul/pos/aftersales/aftersales.ered?reqCode=getAftersalesList&postType=1&random="
						+ Math.random(), {
					werks : WERKS,
					service_number : _service_number,
					"service_type" : '-1',
					"member_name" : _member_name,
					"status" : _status,
					"start_time" : _start_time,
					"end_time" : _end_time,
					"old_commodity_barcode" : _old_commodity_barcode,
					"page" : page,
					"pageSize" : pageSize,
					"step" : _step
				}, function(data) {
					if (data == "") {
						jAlert('无数据存在!', '提示', function(r) {
									$("#search").val("查询");
									$("#search").attr("disabled", false);
								});
						return;
					}
					$.each(data, function(key, val) {
						stylcss = key % 2 == 0 ? "triped1" : "triped2";
						row = "<tr class=" + stylcss + ">";
						var _herf = basepath
								+ "/longhaul/pos/aftersales/aftersales.ered?reqCode=getServiceInfoById&postType=1&service_number="
								+ val.service_number + "&WERKS=" + WERKS
								+ "&userid=" + opterator
								+ "&opmode=view&posurl=" + posurl
								+ "&password=" + password;
						row = row + "<td align='center'><input name='useroption' id='useroption' type='checkbox' value='"
								+ key + "'/></td>";
								//改款单号
						var service_number = val.service_number == null? "&nbsp;": val.service_number;
						var service_number = val.typestr == null? "&nbsp;": val.service_number;
						row = row + "<td><a href='" + _herf
								+ "' target='_blank'><div id=service_number"
								+ key + "> " + service_number
								+ "</div></a></td>";
						var store_name = val.store_name == null? "&nbsp;": val.store_name;
						row = row + "<td><div id=store_name" + key + ">"+ store_name + "</div></td>";
						row = row + "<td><div id=typestr" + key + ">"+ val.typestr + "</div></td>";
						var member_cardnumber = val.member_cardnumber == null? "&nbsp;": val.member_cardnumber;
						row = row + "<td>" + member_cardnumber + "</td>";
						var member_name = val.member_name == null? "&nbsp;": val.member_name;
						row = row + "<td>" + member_name + "</td>";
						var old_commodity_barcode = val.old_commodity_barcode == null? "&nbsp;": val.old_commodity_barcode;
						row = row + "<td>" + old_commodity_barcode + "</td>";
						var trade_name = val.trade_name == null? "&nbsp;": val.trade_name;
						row = row + "<td>" + trade_name + "</td>";
						var cw_pay_status = val.cw_pay_status == null? "&nbsp;": val.cw_pay_status;
						row = row + "<td>" + cw_pay_status + "</td>";
						var cw_receive_status = val.cw_receive_status == null? "&nbsp;": val.cw_receive_status;
            row = row + "<td>" + cw_receive_status + "</td>";
						var description = val.description == null? "&nbsp;": val.description;
					  row = row + "<td><div style='display:none' id=status" + key + ">"+ val.status + "</div>" + description + "</td>";
            //if("6"==val.status && val.status!=null){
              var mailing_date = val.mailing_date == null? "&nbsp;": val.mailing_date;
              row = row + "<td>" + mailing_date + "</td>";
            //}else if ("9"==val.status && val.status!=null){
              var remark3 = val.remark3 == null? "&nbsp;": val.remark3;
              row = row + "<td>" + remark3 + "</td>";
            //}
						row = row + "</tr>"
						$(row).insertAfter($("#faceliftlisttable tr:eq(" + key
								+ ")"));
						$("#search").val("查询");
						$("#search").attr("disabled", false);
					});

				});
	}
//选择行
	$("#opcontrol").click(function() {
				if ($(this).attr("checked") == "checked") {
					$("input[name='useroption']").attr("checked", "true");
				} else {
					$("input[name='useroption']").removeAttr("checked");
				}
			})
	$("#search").click(function() {
				$("#search").val("正在查询");
				$("#search").attr("disabled", true);
				getOrderPageCount();
				$("#opcontrol").attr("checked", false);
			})

	$("#pageSize").change(function() {
				getOrderPageCount();
			})
//修改
	$("#update").click(function(event) {
		var _service_number = "";
		_service_type = $("#service_type").val();
		$("input[name='useroption']:checked").each(function() {
					var usedkey = $(this).val();
					_service_number = $("#service_number" + usedkey).text();
					_status = $("#status" + usedkey).text();
				})
		if ($("input[name='useroption']:checked").size() == 0) {
			jAlert('请选择项目!', '提示', function(r) {
					});
			return;
		}
		if ($("input[name='useroption']:checked").size() > 1) {
			jAlert('每次只可修改一条记录', '提示', function(r) {
						return;
					});

		}else if(("2"==$("#step").val())&&("7"==_status||"8"==_status||"9"==_status)){
      jAlert('门店已接收，不能修改!', '提示', function(r) {
      return;
    });
    } else {
			if (_service_number != "") {
			  var _step = $("#step").val();
			  window.open(basepath
								+ "/longhaul/pos/aftersales/aftersales.ered?reqCode=getServiceInfoById&postType=1"
								+ "&step=" + _step
								+ "&service_number=" + _service_number
								+ "&service_type=" + _service_type
								+ "&WERKS=" + WERKS
								+ "&userid=" + opterator
								+ "&posurl=" + posurl
								+ "&password=" + password + "&opmode=EDIT");
			} else {
				jAlert('请重新选择!', '提示', function(r) {
						});
				return;
			}
		}
	});
//查看
	$("#view").click(function(event) {
		var _service_number = "";
		_service_type = $("#service_type").val();
		$("input[name='useroption']:checked").each(function() {
					var usedkey = $(this).val();
					_service_number = $("#service_number" + usedkey).text();
				})
		if ($("input[name='useroption']:checked").size() == 0) {
			jAlert('请选择项目!', '提示', function(r) {
					});
			return;
		}
		if ($("input[name='useroption']:checked").size() > 1) {
			jAlert('每次只可查看一条详细记录!', '提示', function(r) {
						return;
					});
		} else {
		  window.open(basepath
                + "/longhaul/pos/aftersales/aftersales.ered?reqCode=getServiceInfoById&postType=1"
                + "&step=detail"
                + "&service_number=" + _service_number
                + "&service_type=" + _service_type
                + "&WERKS=" + WERKS
                + "&userid=" + opterator
                + "&posurl=" + posurl
                + "&password=" + password + "&opmode=EDIT");
		}
	});
//打印
	$("#print").click(function(event) {
		var _service_number = "";
		var _status = '';
		_service_type = Number($("#service_type").val());
		$("input[name='useroption']:checked").each(function() {
					var usedkey = $(this).val();
					_service_number = $("#service_number" + usedkey).text();
					_status =  $("#status" + usedkey).text();
				});
		if ($("input[name='useroption']:checked").size() > 1) {
			jAlert('每次只可打印一条记录!', '提示', function(r) {
						return;
					});
		}else if (Number(_status) < 8){
			jAlert('打印单必须是顾客取货状态，目前不能打印!', '提示', function(r) {
				return;
			});
		} else {
			if(_service_type == 1){
		  		window.showModalDialog(basepath + "longhaul/pos/aftersales/wx_print.jsp?ordernum=" + _service_number , 'printWindow', 'dialogWidth=950px;dialogHeight=500px');
		  	}else if(_service_type == 2){
		  		window.showModalDialog(basepath + "longhaul/pos/aftersales/gk_print.jsp?ordernum=" + _service_number , 'printWindow', 'dialogWidth=950px;dialogHeight=500px');
		  	}else if(_service_type == 3){
		  		window.showModalDialog(basepath + "longhaul/pos/aftersales/pd_print.jsp?ordernum=" + _service_number , 'printWindow', 'dialogWidth=950px;dialogHeight=500px');
		  	}
		}
	});
//统计总数
	function getOrderPageCount() {
		getorderbypage(0, $("#pageSize").val());
		// $('.pagination').die();
		var pageCount = 0;
		$('#faceliftheadlist td').addClass('tdclass'); // 增加td样式
		_service_number = $("#service_number").val();//查询条件
    _service_number = _service_number == null ? "" : _service_number;
    _member_name = $("#member_name").val();
    _status = $("#status").val();
    _start_time = $.trim($('#start_time').val());
    _end_time = $.trim($('#end_time').val());
    _old_commodity_barcode = $.trim($('#old_commodity_barcode').val());
		$.post(
				"longhaul/pos/aftersales/aftersales.ered?reqCode=getServicePageCount&postType=1&random="
						+ Math.random(), {
					werks : WERKS.substring(0, WERKS.length - 1),
          service_number : _service_number,
          "member_name" : _member_name,
          "status" : _status,
          "start_time" : _start_time,
          "end_time" : _end_time,
          "old_commodity_barcode" : _old_commodity_barcode,
          "pageSize" : $("#pageSize").val()
				}, function(data) {
					$('#pageOpr').die().unbind().clearQueue().jqPagination({
								// link_string : '/?page={page_number}',
								// current_page: 1, //设置当前页 默认为1
								max_page : parseInt(data), // 设置最大页 默认为1
								page_string : '当前第{current_page}页,共{max_page}页',
								paged : function(page) {
									getorderbypage(page - 1, $("#pageSize")
													.val());
								}
							});
				});
	}
	 //导出
  $("input[name=export_se]").click(function(event) {
   //勾选
    var sns = new Array();
    if ($("input[name='useroption']:checked").size() > 0) {
      var _service_number = "";
      var i = 0;
      $("input[name='useroption']:checked").each(function() {
        var usedkey = $(this).val();
        _service_number = $("#service_number" + usedkey).text();
        sns[i] = _service_number;
        i++;
      });
    }
    _oldvalue = $(this).val();
    $(this).val("正在导出");
    $("input[name=export_se]").attr("disabled", true);
    _exporttype = $(this).attr("exporttype");
    getExcelFaceliftbypage(0, $("#pageSize").val(), _exporttype, sns);
    
    $(this).val(_oldvalue);
    $("input[name=export_se]").attr("disabled", false);
  });
  function getExcelFaceliftbypage(page, pageSize, _exporttype, sns) {
    _service_type = $("#service_type").val();
    _service_number = $("#service_number").val();//查询条件
    _service_number = _service_number == null ? "" : _service_number;
    _member_name = encodeURI($("#member_name").val(),"utf-8");
    _status = $("#status").val();
    _start_time = $.trim($('#start_time').val());
    _end_time = $.trim($('#end_time').val());
    _old_commodity_barcode = $.trim($('#old_commodity_barcode').val());
    _step = "export";
    window.location.href=basepath + "longhaul/pos/aftersales/aftersales.ered?reqCode=getAftersalesList&postType=1&random="
            + Math.random()
            + "&werks=" + WERKS
            + "&service_type=" + _service_type
            + "&service_number=" + _service_number
            + "&member_name=" + _member_name
            + "&status=" + _status
            + "&start_time=" + _start_time
            + "&end_time=" + _end_time
            + "&old_commodity_barcode=" + _old_commodity_barcode
            + "&step=" + _step
            + "&exporttype=" + _exporttype
            + "&sns=" + sns
            + "&page=" + page
            + "&pageSize=" + pageSize;
  }
//删除
$("#del").click(function(event) {
    var _service_number = "";
    $("input[name='useroption']:checked").each(function() {
      var usedkey = $(this).val();
      _service_number = $.trim($("#service_number" + usedkey).text());
    })

    if ($("input[name='useroption']:checked").size() == 0) {
      jAlert('请选择项目!', '提示', function(r) {
          });
      return;
    }
    jConfirm('确认要删除记录吗?', '提示', function(r) {
      if (r == true) {
        $("#del").val("正在删除");
        $("#del").attr("disabled", true);
        $.ajaxSetup({
              error : function(x, e) {
                alert("访问服务器错误请刷新页面!\n" + x.responseText);
                $("#del").val("正在删除");
                $("#del").attr("disabled", false);
                return false;
              }
            });
        $.ajax({
              url : "longhaul/pos/aftersales/aftersales.ered?reqCode=delInfo&postType=1",
              cache : false,
              data : {
                service_number : _service_number
              },
              type : 'post',
              dataType : 'json',
              success : function(data) {
                var message = "";
                if($.trim(data.success) == 'true'){
                   jAlert("删除成功!", '提示', function(r) {
                      getorderbypage(0, $("#pageSize").val());
                    });
                }else{
                   jAlert('删除失败,请联系管理员!', '提示');
                }
                $("#del").val("删除");
                $("#del").attr("disabled", false);
                $("#opcontrol").attr("checked", false);
              }
            });
      } else {
        return false;
      }
    });
  });

});