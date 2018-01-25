package cn.longhaul.pos.order.web;

import cn.longhaul.pos.common.Common;
import cn.longhaul.pos.order.service.OrderConfigerService;
import cn.longhaul.pos.order.service.OrderService;
import cn.longhaul.sap.system.aig.AigRepository;
import cn.longhaul.sap.system.aig.AigTransferInfo;
import cn.longhaul.sap.system.aig.AigTransferParameter;
import cn.longhaul.sap.system.aig.AigTransferStructure;
import cn.longhaul.sap.system.aig.AigTransferTable;
import cn.longhaul.sap.system.esb.hesssion.HessianContext;
import cn.longhaul.sap.system.esb.hesssion.SapTransferImpl;
import java.io.OutputStream;
import java.io.PrintStream;
import java.math.BigDecimal;
import java.net.URLDecoder;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.CellRangeAddress;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.util.SessionContainer;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class OrderSystemAction extends BaseAction
{
  private OrderService orderservice = (OrderService)getService("orderService2");
  private OrderConfigerService orderconfiger = (OrderConfigerService)super.getService("orderConfigerService2");
  private static Log log = LogFactory.getLog(OrderSystemAction.class);

  public ActionForward orderSystemStart(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = dto.getAsString("WERKS");
    if (super.getSessionContainer(request).getUserInfo() != null) {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
      dto.put("userid", werks);
    } else {
      return mapping.findForward("authorization");
    }
    String userid = dto.getAsString("userid");
    String salesorderid = dto.getAsString("salesorderid");
    String opmode = dto.getAsString("opmode");
    String password = dto.getAsString("password");
    String ordertype = dto.getAsString("ordertype");
    request.setAttribute("WERKS", werks);
    request.setAttribute("userid", userid);
    request.setAttribute("salesorderid", salesorderid);
    request.setAttribute("opmode", opmode);
    request.setAttribute("ordertype", ordertype);
    String posurl = dto.getAsString("posurl");
    posurl = (posurl == null) || (posurl.equals("")) ? "" : posurl.substring(posurl.indexOf("://") + 3, posurl.length());
    posurl = (posurl == null) || (posurl.equals("")) ? "" : posurl.substring(0, posurl.indexOf("/"));
    request.setAttribute("posurl", posurl);
    String sessionuser = (String)session.getAttribute("userid");
    Dto configerDto = (Dto)this.g4Reader.queryForObject("posordersystemaig.getuserconfiger", dto);
    if (configerDto != null) {
      request.setAttribute("autocompletesecond", configerDto.getAsString("autocompletesecond"));
      request.setAttribute("autocompletewords", configerDto.getAsString("autocompletewords"));
    }

    if (sessionuser != null) {
      return mapping.findForward("orderSystem");
    }

    session.setAttribute("userid", dto.get("userid"));
    return mapping.findForward("orderSystem");
  }
  /**
   * 新订单的录入
   * @param mapping
   * @param form
   * @param request
   * @param response
   * @return
   * @throws Exception
   */
  public ActionForward orderSystemStartNew(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
	    CommonActionForm aForm = (CommonActionForm)form;
	    HttpSession session = request.getSession();
	    Dto dto = aForm.getParamAsDto(request);
	    String werks = dto.getAsString("WERKS");
	    if (super.getSessionContainer(request).getUserInfo() != null) {
	      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
	      dto.put("userid", werks);
	    } else {
	      return mapping.findForward("authorization");
	    }
	    String userid = dto.getAsString("userid");
	    String salesorderid = dto.getAsString("salesorderid");
	    String opmode = dto.getAsString("opmode");
	    String password = dto.getAsString("password");
	    String ordertype = dto.getAsString("ordertype");
	    request.setAttribute("WERKS", werks);
	    request.setAttribute("userid", userid);
	    request.setAttribute("salesorderid", salesorderid);
	    request.setAttribute("opmode", opmode);
	    request.setAttribute("ordertype", ordertype);
	    String posurl = dto.getAsString("posurl");
	    posurl = (posurl == null) || (posurl.equals("")) ? "" : posurl.substring(posurl.indexOf("://") + 3, posurl.length());
	    posurl = (posurl == null) || (posurl.equals("")) ? "" : posurl.substring(0, posurl.indexOf("/"));
	    request.setAttribute("posurl", posurl);
	    String sessionuser = (String)session.getAttribute("userid");
	    Dto configerDto = (Dto)this.g4Reader.queryForObject("posordersystemaig.getuserconfiger", dto);
	    if (configerDto != null) {
	      request.setAttribute("autocompletesecond", configerDto.getAsString("autocompletesecond"));
	      request.setAttribute("autocompletewords", configerDto.getAsString("autocompletewords"));
	    }

	    if (sessionuser != null) {
	      return mapping.findForward("orderSystem"+ordertype);
	    }

	    session.setAttribute("userid", dto.get("userid"));
	    return mapping.findForward("orderSystem"+ordertype);
	  }
  
  
  
  public ActionForward orderSystemSearch(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = dto.getAsString("WERKS");
    if (super.getSessionContainer(request).getUserInfo() != null)
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    else
      return mapping.findForward("authorization");
    String userid = dto.getAsString("userid");
    String salesorderid = dto.getAsString("salesorderid");
    String opmode = dto.getAsString("opmode");

    String password = dto.getAsString("password");
    request.setAttribute("WERKS", werks);
    request.setAttribute("userid", userid);
    request.setAttribute("salesorderid", salesorderid);
    request.setAttribute("opmode", opmode);
    String posurl = dto.getAsString("posurl");
    System.out.println("posurl:" + posurl);
    String sessionuser = (String)session.getAttribute("userid");
    Dto configerDto = (Dto)this.g4Reader.queryForObject("posordersystemaig.getuserconfiger", dto);
    if (configerDto != null) {
      request.setAttribute("autocompletesecond", configerDto.getAsString("autocompletesecond"));
      request.setAttribute("autocompletewords", configerDto.getAsString("autocompletewords"));
    }
    if (sessionuser != null) {
      return mapping.findForward("orderSearch");
    }

    session.setAttribute("userid", dto.get("userid"));
    return mapping.findForward("orderSearch");
  }

  public ActionForward setUserConfiger(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    this.orderconfiger.saveconfiger(dto);
    write("OK", response);
    return mapping.findForward(null);
  }

  public ActionForward getOrderPageCount(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    try {
      String storeId = super.getSessionContainer(request).getUserInfo().getCustomId();
      dto.put("werks", storeId);
    } catch (Exception e) {
      log.debug(e.getMessage());
    }

    dto.put("salesorderid", dto.get("salesorderid"));
    dto.put("saledatefrom", dto.get("saledatefrom"));
    dto.put("saledateto", dto.get("saledateto"));
    dto.put("sapsalesorderid", dto.get("sapsalesorderid"));
    dto.put("kunnr", dto.get("kunnr"));
    dto.put("vipid", dto.get("vipid"));
    dto.put("ordertype", dto.get("ordertype"));
    dto.put("orderflag", dto.get("orderflag"));
    dto.put("deliveryordernumber", dto.get("deliveryordernumber"));

    String batchno = dto.getAsString("batchno");
    if ("".equals(batchno))
      dto.remove("batchno");
    else {
      dto.put("batchno", '%' + batchno + '%');
    }
    if ((G4Utils.isNotEmpty(dto.get("ordertype"))) && (!"所有订单类型".equals(dto.getAsString("ordertype").trim()))) {
      String[] array = dto.getAsString("ordertype").split(",");
      List orderlist = new ArrayList();
      for (int i = 0; i < array.length; i++) {
        orderlist.add(getOrderTypeCode(array[i].trim()));
      }
      dto.put("ordertype", orderlist);
    } else {
      dto.put("ordertype", "");
    }

    Integer pageSize = dto.getAsInteger("pageSize");

    Integer pageCount = (Integer)this.g4Dao.queryForObject("posordersystem.getorderheadbyuserForPageCount", dto);
    pageCount = Integer.valueOf(pageCount.intValue() % pageSize.intValue() == 0 ? pageCount.intValue() / pageSize.intValue() : pageCount.intValue() / pageSize.intValue() + 1);

    write(pageCount.toString(), response);
    return mapping.findForward(null);
  }

  public ActionForward getOrderDetailForPageCount(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    try {
      String storeId = super.getSessionContainer(request).getUserInfo().getCustomId();
      dto.put("werks", storeId);
    } catch (Exception e) {
      log.debug(e.getMessage());
    }

    dto.put("salesorderid", dto.get("salesorderid"));
    dto.put("saledatefrom", dto.get("saledatefrom"));
    dto.put("saledateto", dto.get("saledateto"));
    dto.put("sapsalesorderid", dto.get("sapsalesorderid"));
    dto.put("kunnr", dto.get("kunnr"));
    dto.put("vipid", dto.get("vipid"));
    dto.put("ordertype", dto.get("ordertype"));
    dto.put("orderflag", dto.get("orderflag"));
    dto.put("deliveryordernumber", dto.get("deliveryordernumber"));

    String batchno = dto.getAsString("batchno");
    if ("".equals(batchno))
      dto.remove("batchno");
    else {
      dto.put("batchno", '%' + batchno + '%');
    }
    if ((G4Utils.isNotEmpty(dto.get("ordertype"))) && (!"所有订单类型".equals(dto.getAsString("ordertype").trim()))) {
      String[] array = dto.getAsString("ordertype").split(",");
      List orderlist = new ArrayList();
      for (int i = 0; i < array.length; i++) {
        orderlist.add(getOrderTypeCode(array[i].trim()));
      }
      dto.put("ordertype", orderlist);
    } else {
      dto.put("ordertype", "");
    }

    Integer pageSize = dto.getAsInteger("pageSize");

    Integer pageCount = (Integer)this.g4Dao.queryForObject("posordersystem.getOrderDetailForPageCount", dto);
    pageCount = Integer.valueOf(pageCount.intValue() % pageSize.intValue() == 0 ? pageCount.intValue() / pageSize.intValue() : pageCount.intValue() / pageSize.intValue() + 1);

    write(pageCount.toString(), response);
    return mapping.findForward(null);
  }

  public ActionForward getOldOrderDetailForPageCount(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    try {
      String storeId = super.getSessionContainer(request).getUserInfo().getCustomId();
      dto.put("werks", storeId);
    } catch (Exception e) {
      log.debug(e.getMessage());
    }

    String batchno = dto.getAsString("batchno");
    if ("".equals(batchno))
      dto.remove("batchno");
    else {
      dto.put("batchno", '%' + batchno + '%');
    }
    Integer pageSize = dto.getAsInteger("pageSize");

    Integer pageCount = (Integer)this.g4Dao.queryForObject("posordersystem.getOldOrderDetailForPageCount", dto);
    pageCount = Integer.valueOf(pageCount.intValue() % pageSize.intValue() == 0 ? pageCount.intValue() / pageSize.intValue() : pageCount.intValue() / pageSize.intValue() + 1);
    write(pageCount.toString(), response);
    return mapping.findForward(null);
  }

  private String getOrderTypeCode(String ordertype) {
    Map typemap = new HashMap();
    typemap.put("销售退货(ZYR1)", "ZYR1");
    typemap.put("退还订金（自收银）(ZYR2)", "ZYR2");
    typemap.put("退还订金（商场收银）(ZYR3)", "ZYR3");
    typemap.put("普通销售(ZYS1)", "ZYS1");
    typemap.put("换货销售(ZYS2)", "ZYS2");
    typemap.put("收取订金（自收银）(ZYS3)", "ZYS3");
    typemap.put("礼品管理(ZYS4)", "ZYS4");
    typemap.put("现金销售(ZYS7)", "ZYS7");
    typemap.put("收取订金（商场收银）(ZYS8)", "ZYS8");
    typemap.put("加盟商退货(ZRE3)", "ZRE3");
    return (String)typemap.get(ordertype);
  }

  private String getOrderTypeText(String ordercode) {
    Map typemap = new HashMap();
    typemap.put("ZYR1", "销售退货(ZYR1)");
    typemap.put("ZYR2", "退还订金（自收银）(ZYR2)");
    typemap.put("ZYR3", "退还订金（商场收银）(ZYR3)");
    typemap.put("ZYS1", "普通销售(ZYS1)");
    typemap.put("ZYS2", "换货销售(ZYS2)");
    typemap.put("ZYS3", "收取订金（自收银）(ZYS3)");
    typemap.put("ZYS4", "礼品管理(ZYS4)");
    typemap.put("ZYS5", "结算订单(ZYS5)");
    typemap.put("ZYS6", "积分兑换(ZYS6)");
    typemap.put("ZYS7", "现金销售(ZYS7)");
    typemap.put("ZYS8", "收取订金（商场收银）(ZYS8)");
    typemap.put("ZRE3", "加盟商退货(ZRE3)");
    return (String)typemap.get(ordercode);
  }

  @SuppressWarnings("unchecked")
public ActionForward orderSystem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    try {
      String storeId = super.getSessionContainer(request).getUserInfo().getCustomId();
      dto.put("werks", storeId);
    } catch (Exception e) {
      log.debug(e.getMessage());
    }
    dto.put("salesorderid", dto.get("salesorderid"));
    dto.put("saledatefrom", dto.get("saledatefrom"));
    dto.put("saledateto", dto.get("saledateto"));
    dto.put("sapsalesorderid", dto.get("sapsalesorderid"));
    dto.put("kunnr", dto.get("kunnr"));
    dto.put("vipid", dto.get("vipid"));
    dto.put("ordertype", dto.get("ordertype"));
    dto.put("orderflag", dto.get("orderflag"));
    dto.put("deliveryordernumber", dto.get("deliveryordernumber"));

    String batchno = dto.getAsString("batchno");

    dto.put("batchno", '%' + batchno + '%');

    if ((G4Utils.isNotEmpty(dto.get("ordertype"))) && (!"所有订单类型".equals(dto.getAsString("ordertype").trim()))) {
      String[] array = dto.getAsString("ordertype").split(",");
      List orderlist = new ArrayList();
      for (int i = 0; i < array.length; i++) {
        orderlist.add(getOrderTypeCode(array[i].trim()));
      }
      dto.put("ordertype", orderlist);
    } else {
      dto.put("ordertype", "");
    }

    Integer pageSize = Integer.valueOf(dto.getAsInteger("pageSize") != null ? dto.getAsInteger("pageSize").intValue() : 20);

    Integer page = Integer.valueOf(dto.getAsInteger("page") != null ? dto.getAsInteger("page").intValue() : 0);
    dto.put("limit", pageSize);

    dto.put("start", Integer.valueOf(page.intValue() * pageSize.intValue()));

    List list = this.g4Dao.queryForPage("posordersystem.getorderheadbyuser", dto);

    List ordertype = this.g4Dao.queryForList("posordersystem.ordertypeall");
    Dto orderFlag = new BaseDto();
    orderFlag.put("NO", "新订单");
    orderFlag.put("PO", "订单打印");
    orderFlag.put("UO", "订单上传");
    orderFlag.put("SO", "订单过账");
    orderFlag.put("CO", "订单冲销");
    orderFlag.put("DO", "已收定金");
    orderFlag.put("RO", "已退定金");
    orderFlag.put("NS", "新结算单");
    orderFlag.put("US", "结算单上传");
    Dto ordertypeDto = new BaseDto();
    for (int j = 0; j < ordertype.size(); j++) {
      Dto mapdto = (Dto)ordertype.get(j);
      ordertypeDto.put(mapdto.get("auart"), mapdto.get("bezei"));
    }
    for (int i = 0; i < list.size(); i++) {
      Dto dataDto = (Dto)list.get(i);
//      String[] salesIds = dataDto.getAsString("salesclerk").split(",");
//      dataDto.put("salesIds", salesIds);
//
//      List names = this.g4Dao.queryForList("posordersystem.getassistantnames", dataDto);
//
//      String nameString = "";
//
//      for (int j = 0; j < names.size(); j++) {
//        nameString = nameString + (String)names.get(j);
//        nameString = nameString + ", ";
//      }
//
//      dataDto.put("salesclerk", nameString);
      dataDto.put("ordertypetext", ordertypeDto.get(dataDto.get("ordertype")));
      dataDto.put("orderflagtext", orderFlag.get(dataDto.get("orderflag")));
    }
    String jsonString = JsonHelper.encodeObject2Json(list, "yyyy-MM-dd hh:mm:ss");

    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getOrderDetail(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    try {
      String storeId = super.getSessionContainer(request).getUserInfo().getCustomId();
      dto.put("werks", storeId);
    } catch (Exception e) {
      log.debug(e.getMessage());
    }
    dto.put("salesorderid", dto.get("salesorderid"));
    dto.put("saledatefrom", dto.get("saledatefrom"));
    dto.put("saledateto", dto.get("saledateto"));
    dto.put("sapsalesorderid", dto.get("sapsalesorderid"));
    dto.put("kunnr", dto.get("kunnr"));
    dto.put("vipid", dto.get("vipid"));
    dto.put("ordertype", dto.get("ordertype"));
    dto.put("orderflag", dto.get("orderflag"));
    dto.put("deliveryordernumber", dto.get("deliveryordernumber"));

    String batchno = dto.getAsString("batchno");

    dto.put("batchno", '%' + batchno + '%');

    if ((G4Utils.isNotEmpty(dto.get("ordertype"))) && (!"所有订单类型".equals(dto.getAsString("ordertype")))) {
      String[] array = dto.getAsString("ordertype").split(",");
      List orderlist = new ArrayList();
      for (int i = 0; i < array.length; i++) {
        orderlist.add(getOrderTypeCode(array[i].trim()));
      }
      dto.put("ordertype", orderlist);
    } else {
      dto.put("ordertype", "");
    }

    Integer pageSize = Integer.valueOf(dto.getAsInteger("pageSize") != null ? dto.getAsInteger("pageSize").intValue() : 20);

    Integer page = Integer.valueOf(dto.getAsInteger("page") != null ? dto.getAsInteger("page").intValue() : 0);
    dto.put("limit", pageSize);

    dto.put("start", Integer.valueOf(page.intValue() * pageSize.intValue()));

    List list = this.g4Dao.queryForPage("posordersystem.getOrderDetail", dto);

    List ordertype = this.g4Dao.queryForList("posordersystem.ordertypeall");
    Dto orderFlag = new BaseDto();
    orderFlag.put("NO", "新订单");
    orderFlag.put("PO", "订单打印");
    orderFlag.put("UO", "订单上传");
    orderFlag.put("SO", "订单过账");
    orderFlag.put("CO", "订单冲销");
    orderFlag.put("DO", "已收定金");
    orderFlag.put("RO", "已退定金");
    orderFlag.put("NS", "新结算单");
    orderFlag.put("US", "结算单上传");
    Dto ordertypeDto = new BaseDto();
    for (int j = 0; j < ordertype.size(); j++) {
      Dto mapdto = (Dto)ordertype.get(j);
      ordertypeDto.put(mapdto.get("auart"), mapdto.get("bezei"));
    }
    for (int i = 0; i < list.size(); i++) {
      Dto dataDto = (Dto)list.get(i);
      String[] salesIds = dataDto.getAsString("salesclerk").split(",");
      dataDto.put("salesIds", salesIds);

      List names = this.g4Dao.queryForList("posordersystem.getassistantnames", dataDto);

      String nameString = "";

      for (int j = 0; j < names.size(); j++) {
        nameString = nameString + (String)names.get(j);
        nameString = nameString + ", ";
      }

      dataDto.put("salesclerk", nameString);
      dataDto.put("ordertypetext", ordertypeDto.get(dataDto.get("ordertype")));
      dataDto.put("orderflagtext", orderFlag.get(dataDto.get("orderflag")));
    }
    String jsonString = JsonHelper.encodeObject2Json(list, "yyyy-MM-dd hh:mm:ss");

    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getOldOrderDetail(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    try {
      String storeId = super.getSessionContainer(request).getUserInfo().getCustomId();
      dto.put("werks", storeId);
    } catch (Exception e) {
      log.debug(e.getMessage());
    }

    String batchno = dto.getAsString("batchno");
    dto.put("batchno", '%' + batchno + '%');

    Integer pageSize = Integer.valueOf(dto.getAsInteger("pageSize") != null ? dto.getAsInteger("pageSize").intValue() : 20);

    Integer page = Integer.valueOf(dto.getAsInteger("page") != null ? dto.getAsInteger("page").intValue() : 0);
    dto.put("limit", pageSize);

    dto.put("start", Integer.valueOf(page.intValue() * pageSize.intValue()));

    List list = this.g4Dao.queryForPage("posordersystem.getOldOrderDetail", dto);

    String jsonString = JsonHelper.encodeObject2Json(list, "yyyy-MM-dd hh:mm:ss");
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward orderSystemForJF(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    try {
      String storeId = super.getSessionContainer(request).getUserInfo().getCustomId();
      dto.put("werks", storeId);
    } catch (Exception e) {
      log.debug(e.getMessage());
      return mapping.findForward(null);
    }
    
	if ((G4Utils.isNotEmpty(dto.get("ordertype")))) {
		List orderlist = new ArrayList();
		orderlist.add(dto.getAsString("ordertype"));
		dto.put("ordertype", orderlist);
	} else {
		dto.put("ordertype", "");
	}

    Integer vkorg = (Integer)this.g4Dao.queryForObject("posordersystem.vkorgType", dto);
    dto.put("salesorderid", dto.get("salesorderid"));
    dto.put("saledatefrom", dto.get("saledatefrom"));
    dto.put("saledateto", dto.get("saledateto"));
    dto.put("sapsalesorderid", dto.get("sapsalesorderid"));
    dto.put("kunnr", dto.get("kunnr"));
    dto.put("vipid", dto.get("vipid"));
    dto.put("ordertype", dto.get("ordertype"));
    dto.put("orderflag", dto.get("orderflag"));
    dto.put("deliveryordernumber", dto.get("deliveryordernumber"));

    String batchno = dto.getAsString("batchno");

    dto.put("batchno", '%' + batchno + '%');

    Integer pageSize = Integer.valueOf(dto.getAsInteger("pageSize") != null ? dto.getAsInteger("pageSize").intValue() : 20);

    Integer page = Integer.valueOf(dto.getAsInteger("page") != null ? dto.getAsInteger("page").intValue() : 0);
    dto.put("limit", pageSize);

    dto.put("start", Integer.valueOf(page.intValue() * pageSize.intValue()));

    List list = this.g4Dao.queryForPage("posordersystem.getorderheadbyuser", dto);

    List ordertype = this.g4Dao.queryForList("posordersystem.ordertypeall");
    Dto orderFlag = new BaseDto();
    orderFlag.put("NO", "新订单");
    orderFlag.put("PO", "订单打印");
    orderFlag.put("UO", "订单上传");
    orderFlag.put("SO", "订单过账");
    orderFlag.put("CO", "订单冲销");
    orderFlag.put("DO", "已收定金");
    orderFlag.put("RO", "已退定金");
    orderFlag.put("NS", "新结算单");
    orderFlag.put("US", "结算单上传");
    Dto ordertypeDto = new BaseDto();
    for (int j = 0; j < ordertype.size(); j++) {
      Dto mapdto = (Dto)ordertype.get(j);
      ordertypeDto.put(mapdto.get("auart"), mapdto.get("bezei"));
    }
    for (int i = 0; i < list.size(); i++) {
      Dto dataDto = (Dto)list.get(i);
      dataDto.put("ordertypetext", ordertypeDto.get(dataDto.get("ordertype")));
      dataDto.put("orderflagtext", orderFlag.get(dataDto.get("orderflag")));
    }
    String jsonString = JsonHelper.encodeObject2Json(list, "yyyy-MM-dd hh:mm:ss");

    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getOrderTypeList(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    dto.put("werks", werks);
    String orderTypeSql = "";
    Integer vkorg = (Integer)this.g4Dao.queryForObject("posordersystem.vkorgType", dto);
    switch (vkorg.intValue()) {
    case 9000:
      orderTypeSql = "posordersystem.ordertype9000";
      break;
    case 1000:
      orderTypeSql = "posordersystem.ordertype1000";
      break;
    case 1100:
      orderTypeSql = "posordersystem.ordertype1100";
      break;
    case 1200:
      orderTypeSql = "posordersystem.ordertype1200";
    }

    List list = this.g4Dao.queryForList(orderTypeSql, dto);
    String jsonString = JsonHelper.encodeObject2Json(list);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getOrderType(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    List list = this.g4Dao.queryForList("posordersystem.ordertype", dto);
    String jsonString = JsonHelper.encodeObject2Json(list);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getOrderReason(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String auart = "";
    String orderType = dto.getAsString("auart");
    if (("ZJM2".equals(orderType)) || ("ZYS2".equals(orderType)))
      auart = "H";
    else if (("ZJR1".equals(orderType)) || ("ZYR1".equals(orderType)))
      auart = "R";
    else {
      auart = "Y";
    }

    dto.put("auart", auart);
    List list = this.g4Dao.queryForList("posordersystem.orderreson", dto);
    String jsonString = JsonHelper.encodeObject2Json(list);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getVipRecord(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    dto.put("rownum", Integer.valueOf(15));
    dto.put("kunnr", dto.get("kunnr"));
    dto.put("vipid", dto.get("vipid"));
    if (dto.get("vipid") != null) {
      dto.put("tel", dto.get("vipid"));
    }
    String option = dto.getAsString("option");
    List list = new ArrayList();
    if (option.equals("user")) {
      list = this.g4Dao.queryForList("posordersystem.viprecordbyuser", dto);

      for (int i = 0; i < list.size(); i++)
      {
        String birthday1 = ((Dto)list.get(i)).getAsString("gbdat");
        String birthday2 = ((Dto)list.get(i)).getAsString("telf2");
        String today = dto.getAsString("saledate");
        if(today.equals("")){
        	today = G4Utils.getCurrentTime("yyyy-MM-dd");
        }
        
        dto.put("saledate", today);
        try
        {
        // ZWH 20150108
          String birthday1Month = birthday1.indexOf("-") != -1 ? birthday1.substring(5, 7) : birthday1.substring(4, 6);
          String birthday2Month = birthday2.indexOf("-") != -1 ? birthday2.substring(5, 7) : birthday1.substring(4, 6);
          //String birthday1Day = birthday1.indexOf("-") != -1 ? birthday1.substring(8, 10) : birthday1.substring(6, 8);
          //String birthday2Day = birthday2.indexOf("-") != -1 ? birthday2.substring(8, 10) : birthday1.substring(6, 8);
          String todayMonth = today.substring(5, 7);
         // String todayDay = today.substring(8, 10);
          List  listCount = this.g4Dao.queryForList("posordersystem.getStreejf", dto);
          if (listCount.size()>0){
        	 Integer count = ((Dto)listCount.get(0)).getAsInteger("huitou");//次数
        	 if (count!=null&&count>0){
        		 if (todayMonth.equals(birthday1Month))
        	            ((Dto)list.get(i)).put("doubleInteval", "1");
        		 else if (todayMonth.equals(birthday2Month))
        	            ((Dto)list.get(i)).put("doubleInteval", "2");
        	 }
          }
          
          
          /*
          if (todayMonth.equals(birthday1Month))
            ((Dto)list.get(i)).put("doubleInteval", "1");
          else if (todayMonth.equals(birthday2Month))
            ((Dto)list.get(i)).put("doubleInteval", "2");
          else
            ((Dto)list.get(i)).put("doubleInteval", "0");*/
        }
        catch (Exception e) {
          ((Dto)list.get(i)).put("doubleInteval", "0");
          log.debug(e.getMessage());
          e.printStackTrace();
        }

        if (G4Utils.isEmpty(((Dto)list.get(i)).get("sj")))
          ((Dto)list.get(i)).put("sj", ((Dto)list.get(i)).get("telf"));
      }
    }
    else {
      list = this.g4Dao.queryForList("posordersystem.viprecord", dto);
      for (int i = 0; i < list.size(); i++) {
        if (G4Utils.isEmpty(((Dto)list.get(i)).get("sj"))) {
          ((Dto)list.get(i)).put("sj", ((Dto)list.get(i)).get("telf"));
        }
      }
    }

    String jsonString = JsonHelper.encodeObject2Json(list);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getpcxx(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String chargtype = dto.get("chargtype").toString();
    String werks = null;
    try {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
      dto.put("werks", werks);
    } catch (Exception e) {
      log.debug(e.getMessage());
      return mapping.findForward(null);
    }
    dto.put("charg", dto.get("charg"));
    dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
    List list = null;
    String userinput = (String)dto.get("userinput");
    String charg = (String)dto.get("charg");
    charg = charg == null ? "" : charg.trim();
    String option = dto.getAsString("option");
    if (option.equals("user")) {
      if (chargtype.equals("charg")) {
        list = this.g4Dao.queryForList("posordersystem.getpcxxbyuser", dto);
        for (int i = 0; i < list.size(); i++) {
          Dto tempdto = (Dto)list.get(i);
          tempdto.put("werks", dto.get("werks"));
          tempdto.put("vipi d", dto.get("vipid"));
          tempdto.put("charg", tempdto.get("cpbm"));
          // 20150924
        //  String orderid = (String)this.g4Dao.queryForObject("posordersystem.getchargisusedorderid", tempdto);
        //  orderid = orderid == null ? "" : orderid;
        //  tempdto.put("usedorderid", orderid);
          String ordertype = dto.getAsString("ordertype");
          if ((ordertype.equals("ZYR1")) || (ordertype.equals("ZJR1")) || (ordertype.equals("ZYS2")&&!dto.getAsString("swap").equals("ZOUT")) || (ordertype.equals("ZJM2")))
          {
        	 //2015.12.11
            Integer allLabst = (Integer)this.g4Dao.queryForObject("posordersystem.getAllLabst", tempdto);
        	if(allLabst!=null&&allLabst>0){
        		 tempdto.put("totalLabst", 0);
        	}
        	
            String[] orderType = { "ZYS1", "ZJM1", "ZYS2", "ZJM2", "ZYS7", "ZJM7" };
            tempdto.put("ordertype", orderType);
            Dto oldMessage = (Dto)this.g4Dao.queryForObject("posordersystem.getchargbaklastprice", tempdto);

            if (G4Utils.isEmpty(oldMessage)) {
              oldMessage = getHistorySellInfoFromSAP(dto);
            }

            if (G4Utils.isEmpty(oldMessage)) {
              oldMessage = (Dto)this.g4Dao.queryForObject("posordersystem.getchargbaklastpriceforsap", tempdto);
            }

            if (oldMessage != null){
              if (Double.parseDouble(G4Utils.isNotEmpty(oldMessage.get("totalamount")) ? oldMessage.getAsString("totalamount") : "0") >= 0.0D) {
                tempdto.put("sxj", oldMessage.get("totalamount"));
                tempdto.put("oldsapsaleorderid", oldMessage.get("sapsalesorderid"));
                tempdto.put("oldsalesorderid", oldMessage.get("salesorderid"));
                tempdto.put("oldunionpay", oldMessage.get("unionpay"));
                tempdto.put("oldvipcard", oldMessage.get("vipcard"));
                tempdto.put("oldshoppingcard", oldMessage.get("shoppingcard"));
                tempdto.put("olddiscount1", oldMessage.get("discount1"));
                tempdto.put("olddiscount2", oldMessage.get("discount2"));
                tempdto.put("olddiscount3", oldMessage.get("discount3"));
                tempdto.put("olddiscount4", oldMessage.get("discount4"));
                tempdto.put("olddiscount5", oldMessage.get("discount5"));
                tempdto.put("oldmarketprivilege", oldMessage.get("marketprivilege"));
                tempdto.put("oldselfticketprice", oldMessage.get("selfticketprice"));
                tempdto.put("oldvipintegral", oldMessage.get("vipintegral"));
                tempdto.put("oldselfprivilege", oldMessage.get("selfprivilege"));
                tempdto.put("oldmarketticketprice", oldMessage.get("marketticketprice"));
                tempdto.put("oldcurrentintegral", oldMessage.get("currentintegral"));
                tempdto.put("oldsalepromotion", oldMessage.get("salepromotion"));
                tempdto.put("oldsalesquantity", oldMessage.get("salesquantity"));
                tempdto.put("oldgoldWeight", oldMessage.get("goldweight"));
                
              }
            }else{
            	 tempdto.put("totalLabst", 1);
            }
            	  
          }
        }
      }
      else if (chargtype.equals("gift")) {
        dto.put("matnr", dto.get("charg"));
        Integer giftReferencePrice = Integer.valueOf(dto.getAsInteger("giftReferencePrice") == null ? 0 : dto.getAsInteger("giftReferencePrice").intValue());
        List priceBetween = new ArrayList();
        if (giftReferencePrice.intValue() > 0)
          priceBetween.add("0-3998");
//        if (giftReferencePrice.intValue() > 2000)
//          priceBetween.add("2000-2999");
//        if (giftReferencePrice.intValue() > 2999)
//          priceBetween.add("3000-4999");
//        if (giftReferencePrice.intValue() > 4999)
//          priceBetween.add("5000-8000");
//        if (giftReferencePrice.intValue() > 8000)
//          priceBetween.add("8000-19999");
        if (giftReferencePrice.intValue() > 3998) {
          priceBetween.add("3999-");
        }
        dto.put("priceBetween", priceBetween);
        dto.put("matnr", dto.get("charg"));
        list = this.g4Dao.queryForList("posordersystem.getgiftbyuser", dto);
      } else if ("bc".equals(chargtype)) {
        dto.put("matnr", dto.get("charg"));
        list = this.g4Dao.queryForList("posordersystem.getbcbyuser", dto);
      } else if ("rejpackageandgift".equals(chargtype)) {
        list = this.g4Dao.queryForList("posordersystem.getMatnrInfobyuser", dto);
      }
    }
    else if ((userinput != null) && (userinput.equals("1"))) {
      if (chargtype.equals("charg"))
        list = this.g4Dao.queryForList("posordersystem.getpcxxbyuser", dto);
      else if (chargtype.equals("gift")) {
        list = this.g4Dao.queryForList("posordersystem.getgiftbyuser", dto);
      }
    }
    else if (chargtype.equals("charg")) {
    	Double stock = (Double)this.g4Dao.queryForObject("posordersystem.getStock_46", dto);
    	if (stock == null){
    		stock = (Double)this.g4Dao.queryForObject("posordersystem.getStock_48", dto);
    	}
    	if(stock != null){
    		list = this.g4Dao.queryForList("posordersystem.getpcxx", dto);
    	}
    } else if (chargtype.equals("gift")) {
      Integer giftReferencePrice = Integer.valueOf(dto.getAsInteger("giftReferencePrice") == null ? 0 : dto.getAsInteger("giftReferencePrice").intValue());
      List priceBetween = new ArrayList();
     
      if (giftReferencePrice.intValue() > 0)
        priceBetween.add("0-3998");
   
      if (giftReferencePrice.intValue() > 3998) {
        priceBetween.add("3999-");
      }
      dto.put("priceBetween", priceBetween);
      dto.put("matnr", dto.get("charg"));
      list = this.g4Dao.queryForList("posordersystem.getgift", dto);
    } else if (chargtype.equals("goldbar")) {
      list = this.g4Dao.queryForList("posordersystem.getGoldBar", dto);
    } else if ("rejpackageandgift".equals(chargtype)) {
      list = this.g4Dao.queryForList("posordersystem.getMatnrInfo", dto);
    }

    String jsonString = JsonHelper.encodeObject2Json(list);

    //jsonString = Common.getNewString(werks, jsonString);

     write(jsonString, response);

    return mapping.findForward(null);
  }

  private Dto getHistorySellInfoFromSAP(Dto param) {
    Dto dto = new BaseDto();
    String charg = param.getAsString("charg");
    String kunnr = param.getAsString("kunnr");
    String vipid = param.getAsString("vipid");
    try {
      AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();

      rfctransferinfo.getImportPara().setParameter("I_CHARG", charg);
      rfctransferinfo.getImportPara().setParameter("I_KUNNR", kunnr);

      SapTransferImpl transfer = new SapTransferImpl();
      AigTransferInfo out = transfer.transferInfoAig("Z_RFC_STORE_50", rfctransferinfo);

      ArrayList list = out.getAigTable("IT_LIST");
      if (list.size() > 0) {
        Map map = (Map)list.get(0);

        dto.put("sapsalesorderid", map.get("VBELN"));
        dto.put("salesorderid", map.get("VBELN"));
        dto.put("totalamount", map.get("ZPR0"));
        dto.put("sxj", map.get("ZPR0"));
        dto.put("unionpay", map.get("ZGF3"));
        dto.put("vipcard", vipid);
        dto.put("shoppingcard", map.get("ZGF4"));
        dto.put("discount1", Double.valueOf(100.0D + Double.parseDouble(G4Utils.isNotEmpty(map.get("ZZK1")) ? map.get("ZZK1").toString() : "0")));
        dto.put("discount2", Double.valueOf(100.0D + Double.parseDouble(G4Utils.isNotEmpty(map.get("ZZK2")) ? map.get("ZZK2").toString() : "0")));
        dto.put("discount3", Double.valueOf(100.0D + Double.parseDouble(G4Utils.isNotEmpty(map.get("ZZK3")) ? map.get("ZZK3").toString() : "0")));
        dto.put("discount4", Double.valueOf(100.0D + Double.parseDouble(G4Utils.isNotEmpty(map.get("ZZKG")) ? map.get("ZZKG").toString() : "0")));
        dto.put("discount5", Double.valueOf(100.0D + Double.parseDouble(G4Utils.isNotEmpty(map.get("ZZKJ")) ? map.get("ZZKJ").toString() : "0")));
        dto.put("marketprivilege", map.get("ZSQ1"));
        dto.put("selfticketprice", map.get("ZFQ2"));
        dto.put("vipintegral", map.get("ZJF3"));
        dto.put("selfprivilege", map.get("ZFQ1"));
        dto.put("marketticketprice", map.get("ZSQ2"));
        dto.put("currentintegral", map.get("ZJF4"));
        dto.put("salepromotion", map.get("WAKTION"));
        dto.put("salesquantity", Integer.valueOf(1));
        dto.put("goldweight", map.get("KWMENG"));
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    return dto;
  }

  public ActionForward getMatnrInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    List data = this.g4Dao.queryForList("posordersystem.getMatnrInfo", dto);
    String retStr = JsonHelper.encodeObject2Json(data);
    write(retStr, response);
    return mapping.findForward(null);
  }

  public ActionForward getPackageInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
	  CommonActionForm aForm = (CommonActionForm)form;
	  Dto dto = aForm.getParamAsDto(request);
	    String werks = null;
	    try {
	      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
	      dto.put("werks", werks);
	    } catch (Exception e) {
	      log.debug(e.getMessage());
	      return mapping.findForward(null);
	    }  
    List data = this.g4Dao.queryForList("posordersystem.getPackageInfo", dto);
    String retStr = JsonHelper.encodeObject2Json(data);
    write(retStr, response);
    return mapping.findForward(null);
  }

  public ActionForward getMatnrInfobyuser(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    List data = this.g4Dao.queryForList("posordersystem.getMatnrInfobyuser", dto);
    if ((data != null) && (data.size() > 0)) {
      Double kbetr = Double.valueOf(Double.parseDouble(((Dto)data.get(0)).get("kbetr") != null ? ((Dto)data.get(0)).getAsString("kbetr") : "0"));
      Double verpr = Double.valueOf(Double.parseDouble(((Dto)data.get(0)).get("verpr") != null ? ((Dto)data.get(0)).getAsString("verpr") : "0"));
      Double realPrice = Double.valueOf(kbetr.doubleValue() / 1000.0D * verpr.doubleValue());
      ((Dto)data.get(0)).put("realprice", realPrice);
      ((Dto)data.get(0)).put("ztjtj", verpr);
    }
    String retStr = JsonHelper.encodeObject2Json(data);
    write(retStr, response);
    return mapping.findForward(null);
  }

  public ActionForward getKunnrJF(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
    AigTransferParameter rfcimport = rfctransferinfo.getTransParameter();
    rfcimport.setParameter("I_KUNNR", dto.get("kunnr"));
    SapTransferImpl transfer = new SapTransferImpl();
    rfctransferinfo.setImportPara(rfcimport);

    HessianContext.setRequest(request);
    AigTransferInfo out = transfer.transferInfoAig("Z_RFC_STORE2_11", rfctransferinfo);
    write(out.getParameters("U_KBETR").toString(), response);
    return mapping.findForward(null);
  }

  public ActionForward getchargbaklastprice(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    Double price = (Double)this.g4Dao.queryForObject("posordersystem.getchargbaklastprice", dto);
    price = Double.valueOf(price == null ? 0.0D : price.doubleValue());
    write(price.toString(), response);
    return mapping.findForward(null);
  }

  public ActionForward getsWerksSaleFlag(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String werkssaleflag = (String)this.g4Dao.queryForObject("posordersystem.getswerkssaleflag", dto);
    werkssaleflag = werkssaleflag == null ? "" : werkssaleflag;
    write(werkssaleflag, response);
    return mapping.findForward(null);
  }

  public ActionForward getGiftJF(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    write(this.g4Dao.queryForObject("posordersystem.getgiftjf", dto).toString(), response);
    return mapping.findForward(null);
  }

  public ActionForward getGoldPrices(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String werks = null;
    try {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    } catch (Exception e) {
      return mapping.findForward(null);
    }

    dto.put("werks", werks);
    dto.put("date", G4Utils.getCurrentTime("yyyy-MM-dd"));
    List list = new ArrayList();
    if ("1000".equals(werks))
      try {
        list = this.g4Dao.queryForList("posordersystem.getgoldprices1000", dto);
        Double qzbl = (Double)this.g4Dao.queryForObject("posordersystem.getGoldqzbl", dto);
        Double drjj = Double.valueOf(qzbl.doubleValue() * Double.parseDouble(((Dto)list.get(0)).getAsString("drjj")));
        ((Dto)list.get(0)).put("drjj", drjj);
      } catch (Exception e) {
        e.printStackTrace();
      }
    else
      list = this.g4Dao.queryForList("posordersystem.getgoldprices", dto);
    String jsonString = JsonHelper.encodeObject2Json(list);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getsaleman(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String werks = null;
    try {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    } catch (Exception e) {
      werks = "01SZ";
    }

    dto.put("werks", werks);
    List list = this.g4Dao.queryForList("posordersystem.getsaleman", dto);
    String jsonString = JsonHelper.encodeObject2Json(list);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getChargIsusedOrder(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String orderid = (String)this.g4Dao.queryForObject("posordersystem.getchargisusedorderid", dto);
    orderid = orderid == null ? "" : orderid;
    write(orderid, response);
    return mapping.findForward(null);
  }
  public ActionForward saveOrderZys1(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
	    HessianContext.setRequest(request);
	    CommonActionForm aForm = (CommonActionForm)form;
	    Dto returnMessag = new BaseDto();
	    Dto dto = aForm.getParamAsDto(request);
	    Dto orderHead = JsonHelper.parseSingleJson2Dto(dto.get("orderhead").toString()); 
	    List orderitemal = JsonHelper.parseJson2List(dto.get("orderitem").toString());
	    String storeId = null;
	    try {
	        storeId = super.getSessionContainer(request).getUserInfo().getCustomId();
	      } catch (Exception e1) {
	        log.debug(e1.getMessage());
	        returnMessag.put("loginerror", "登录已经超时，请重新登录！");
	        String retStr = JsonHelper.encodeObject2Json(returnMessag);
	        write(retStr, response);
	        return mapping.findForward(null);
	     }
	      orderHead.put("storeid", storeId);
	     
	      String currentDate = G4Utils.getCurrentTime("yyyyMMdd");
	      String ordertime = orderHead.getAsString("saledate").replace("-", "");
	      //String useroption = dto.getAsString("useroption");
	      String operatedatetime = G4Utils.getCurrentTime("yyyy-MM-dd HH:mm:ss");
	      String operatdate = operatedatetime.substring(0, 10).replace("-", "");
	      String operattime = operatedatetime.substring(10, operatedatetime.length()).replace("-", "");
	      orderHead.put("operatedatetime", operatedatetime);
	      orderHead.put("insertdatetime", G4Utils.getCurrentTime("yyyy-MM-dd"));
	      String maxorderid = (String)this.g4Dao.queryForObject("posordersystem.getmaxorder", orderHead);
	      String salesorderid = orderHead.getAsString("storeid") + currentDate;
	      if ((maxorderid == null) || ("".equals(maxorderid))) {
	        salesorderid = salesorderid + "001";
	      } else {
	        String maxid = maxorderid.substring(maxorderid.length() - 3, maxorderid.length());
	        Integer maxNumber = Integer.valueOf(Integer.parseInt(maxid));
	        maxNumber = Integer.valueOf(maxNumber.intValue() + 1);
	        String pattern = "000";
	        DecimalFormat df = new DecimalFormat(pattern);
	        maxid = df.format(maxNumber);
	        salesorderid = salesorderid + maxid;
	      }
	      
	      
	      orderHead.put("deliverydate", currentDate);
	      orderHead.put("deliverydate", currentDate);
	      orderHead.put("cardexpired", "9999-12-31");
	      orderHead.put("salesorderid", salesorderid);
	     
	     // orderHead.put("ordertype", "ZYS1");
	      Dto d = this.orderservice.saveOderZys1(orderHead, orderitemal);
	      if(d.containsKey("success")){
	    	Dto d2=  this.orderservice.createSapZys1(orderHead, orderitemal);
	    	if(d2.containsKey("success")){
	    		orderHead.put("sapsalesorderid", d2.get("U_VBELN"));
	            orderHead.put("orderflag", "UO");
	    		Boolean bool=this.orderservice.updateOrderByvbeln2(orderHead, orderitemal);
	    		if(!bool){
	    			returnMessag.put("error", "上传单据出现问题");
	    		}else{
	    			returnMessag.put("success", d2.get("U_VBELN"));
	    		}
	    	}else{
		    	  returnMessag.put("errorSap", d2.get("error"));
		    	  //删除对应的pos订单
		    	  this.orderservice.delOrderForNewOrder(orderHead);
		     }
	      }
	      
	  String  jsonString = JsonHelper.encodeObject2Json(returnMessag);
      write(jsonString, response);
	      
	  return mapping.findForward(null);
  }
  
  
  public ActionForward saveOrder(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    HessianContext.setRequest(request);

    CommonActionForm aForm = (CommonActionForm)form;
    Dto returnMessag = new BaseDto();
    String jsonString = "";
    try {
      Dto dto = aForm.getParamAsDto(request);
      log.debug("提交订单台头:" + dto.get("orderhead").toString());
      log.debug("项目:" + dto.get("orderitem").toString());

      Dto orderHead = JsonHelper.parseSingleJson2Dto(dto.get("orderhead").toString());
        System.out.println(orderHead.getAsInteger("currentIntegral"));
      String storeId = null;
      try {
        storeId = super.getSessionContainer(request).getUserInfo().getCustomId();
      } catch (Exception e1) {
        log.debug(e1.getMessage());
        returnMessag.put("loginerror", "登录已经超时，请重新登录！");
        String retStr = JsonHelper.encodeObject2Json(returnMessag);
        write(retStr, response);
        return mapping.findForward(null);
      }
      orderHead.put("storeid", storeId);

      List orderitemal = JsonHelper.parseJson2List(dto.get("orderitem").toString());
      //去除重复行
      for ( int i = 0 ; i < orderitemal.size() - 1 ; i ++ ) {
    	  Dto di = (Dto) orderitemal.get(i);
    	  di.put("storeid", storeId);
 	     for ( int j = orderitemal.size() - 1 ; j > i; j -- ) {
 	    	 Dto dj = (Dto) orderitemal.get(j);
 	       if (di.getAsString("batchnumber").equals(dj.getAsString("batchnumber"))
 	    		   && di.getAsString("materialnumber ").equals(dj.getAsString("materialnumber"))
 	       ) {
 	    	  orderitemal.remove(j);
 	       }
 	      }
 	    }
      
     // for (int i = 0; i < orderitemal.size(); i++) {
    //	  ((Dto)orderitemal.get(i)).put("storeid", storeId);
     // }
      String currentDate = G4Utils.getCurrentTime("yyyyMMdd");
      String ordertime = orderHead.getAsString("saledate").replace("-", "");
      
      /**
       * 日期判断
       */
     int val = vSaledate(ordertime,super.getSessionContainer(request).getUserInfo().getCustomId());
    
     if (val<0){//小于0 日期错误
    	 
    	 returnMessag.put("message","销售日期已关账："+ordertime );
    	 jsonString = JsonHelper.encodeObject2Json(returnMessag);
    	 write(jsonString, response);
    	 return null;
     }
      
      String useroption = dto.getAsString("useroption");
      String operatedatetime = G4Utils.getCurrentTime("yyyy-MM-dd HH:mm:ss");
      String operatdate = operatedatetime.substring(0, 10).replace("-", "");
      String operattime = operatedatetime.substring(10, operatedatetime.length()).replace("-", "");
      orderHead.put("operatedatetime", operatedatetime);
      orderHead.put("insertdatetime", G4Utils.getCurrentTime("yyyy-MM-dd"));

      String maxorderid = (String)this.g4Dao.queryForObject("posordersystem.getmaxorder", orderHead);
      String salesorderid = orderHead.getAsString("storeid") + currentDate;
      if ((maxorderid == null) || ("".equals(maxorderid))) {
        salesorderid = salesorderid + "001";
      } else {
        String maxid = maxorderid.substring(maxorderid.length() - 3, maxorderid.length());
        Integer maxNumber = Integer.valueOf(Integer.parseInt(maxid));
        maxNumber = Integer.valueOf(maxNumber.intValue() + 1);
        String pattern = "000";
        DecimalFormat df = new DecimalFormat(pattern);
        maxid = df.format(maxNumber);
        salesorderid = salesorderid + maxid;
      }

      orderHead.put("insertdatetime", operatedatetime);
      returnMessag.put("operatedatetime", operatedatetime);

      if (G4Utils.isEmpty(orderHead.getAsString("salesorderid"))) {
        orderHead.put("salesorderid", salesorderid);
        this.orderservice.saveOrder(orderHead, orderitemal);
      }
      else {
        this.orderservice.updateOrderForSap(orderHead, orderitemal);
      }

      AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();

      AigTransferTable rfctablevbak = rfctransferinfo.getTable("IT_VBAK");
      rfctablevbak.setValue("AUART", orderHead.get("ordertype") != null ? orderHead.get("ordertype") : "");
      rfctablevbak.setValue("KUNNR", orderHead.get("storeid") != null ? orderHead.get("storeid") : "");
      rfctablevbak.setValue("KUNNR1", orderHead.get("customerid") != null ? orderHead.get("customerid") : "");
      rfctablevbak.setValue("WERKS", orderHead.get("storeid") != null ? orderHead.get("storeid") : "");

      rfctablevbak.setValue("AUGRU", orderHead.get("orderreason") != null ? orderHead.get("orderreason") : "");
      rfctablevbak.setValue("AUDAT", orderHead.get("saledate") != null ? orderHead.get("saledate") : "");
      rfctablevbak.setValue("KTEXT", orderHead.get("remarks") != null ? orderHead.get("remarks") : "");
      rfctablevbak.setValue("BNAME", orderHead.get("salesclerk") != null ? orderHead.get("salesclerk") : "");
      rfctablevbak.setValue("TELF1", orderHead.get("storereceipt") != null ? orderHead.get("storereceipt") : "");

      if ("ZOR6".equals(orderHead.get("ordertype"))) {
        rfctablevbak.setValue("VTWEG", "20");
      } else {
        rfctablevbak.setValue("VTWEG", "10");
        rfctablevbak.setValue("ZXL", orderHead.get("unionpay") != null ? orderHead.get("unionpay") : "");
        rfctablevbak.setValue("ZGWK", orderHead.get("shoppingcard") != null ? orderHead.get("shoppingcard") : "");
      }

      rfctablevbak.setValue("VSNMR_V", orderHead.getAsString("referrer") != null ? orderHead.get("referrer") : "");

      rfctablevbak.appendRow();
      rfctransferinfo.appendTable(rfctablevbak);

      AigTransferTable rfctablevbap = rfctransferinfo.getTable("IT_VBAP");
      for (int i = 0; i < orderitemal.size(); i++) {
        Dto orderitem = (Dto)orderitemal.get(i);
        orderitem.put("werks", storeId);
        orderitem.put("orderdate", orderHead.get("saledate"));
        Double point = Double.valueOf(0.0D);
        Double price = Double.valueOf(0.0D);

        if (!"".equals(orderitem.get("salepromotion")) && orderitem.get("salepromotion") != ""){
          rfctablevbap.setValue("KNUMA_PI", orderitem.get("salepromotion"));
	      price = (Double)this.g4Dao.queryForObject("posordersystem.getZ087Price", orderitem);
	      if (price != null) {
	          point = Double.valueOf(price.doubleValue() / 10.0D);
	          BigDecimal dec = new BigDecimal(point.doubleValue()).setScale(2, 4);
	          rfctablevbap.setValue("Z087", Double.valueOf(dec.doubleValue()));
	      } else {
	          price = (Double)this.g4Dao.queryForObject("posordersystem.getZ082Price", orderitem);
	          point = Double.valueOf(price == null ? 0.0D : price.doubleValue() / 10.0D);
	          BigDecimal dec = new BigDecimal(point.doubleValue()).setScale(2, 4);
	          rfctablevbap.setValue("Z082", Double.valueOf(dec.doubleValue()));
	      }
        } else {
        	price = (Double)this.g4Dao.queryForObject("posordersystem.getZ082Price", orderitem);
	        point = Double.valueOf(price == null ? 0.0D : price.doubleValue() / 10.0D);
	        BigDecimal dec = new BigDecimal(point.doubleValue()).setScale(2, 4);
	        rfctablevbap.setValue("Z082", Double.valueOf(dec.doubleValue()));
        }
        rfctablevbap.setValue("POSNR", orderitem.get("salesorderitem"));
        rfctablevbap.setValue("PSTYV", orderitem.get("orderitemtype"));
        rfctablevbap.setValue("WERKS", "ZOR6".equals(orderHead.get("ordertype")) ? Integer.valueOf(1000) : storeId);
        rfctablevbap.setValue("VSTEL", "ZOR6".equals(orderHead.get("ordertype")) ? Integer.valueOf(1000) : orderitem.get("ordertype"));
        rfctablevbap.setValue("MATNR", orderitem.get("materialnumber"));
      
        rfctablevbap.setValue("CHARG", orderitem.get("batchnumber"));
        System.out.println(orderitem.getAsString("salesquantity"));
        Double count = Double.valueOf(Double.parseDouble(orderitem.getAsString("salesquantity")));
        Dto store = (Dto)this.g4Dao.queryForObject("posordersystem.getMeinsByMatnr", orderitem);
        String meins = store == null ? "" : store.getAsString("meins");
        if ("ZIN1".equals(orderitem.get("orderitemtype"))) {
          meins = "G";
        }
        if ("G".equals(meins)) {
          try {
            if (Math.abs(count.doubleValue()) == 0.5D)
              count = Double.valueOf(Double.parseDouble(orderitem.getAsString("goldweight")));
            else
              count = Double.valueOf(Double.parseDouble(orderitem.getAsString("goldweight")) * count.doubleValue());
          }
          catch (Exception e) {
            e.printStackTrace();
          }
        }
        orderitem.put("meins", meins);
        count = Double.valueOf(Math.abs(count.doubleValue()));
        rfctablevbap.setValue("KWMENG", count);
        rfctablevbap.setValue("ZMGOLD", orderitem.get("mGoldWeight"));
        
        if (("ZJM6".equals(orderHead.get("ordertype"))) || ("ZYS6".equals(orderHead.get("ordertype"))))
          rfctablevbap.setValue("LGORT", "0014");
        else {
          rfctablevbap.setValue("LGORT", orderitem.get("storagelocation"));
        }
        if ((!"ZJM6".equals(orderHead.get("ordertype"))) && (!"ZYS6".equals(orderHead.get("ordertype"))))
        {
          rfctablevbap.setValue("ZSSJ", (orderitem.get("netprice") != null) && (!"".equals(orderitem.get("netprice"))) ? Double.valueOf(Math.abs(Double.parseDouble(orderitem.getAsString("netprice")))) : null);
        }

        if (!"ZOR6".equals(orderHead.get("ordertype"))) {
          if ((!"ZJM6".equals(orderHead.get("ordertype"))) && (!"ZYS6".equals(orderHead.get("ordertype")))){
            rfctablevbap.setValue("ZLSJ", orderitem.get("tagprice"));
          }
          rfctablevbap.setValue("ZXSJJ", orderitem.get("goldprice"));
          rfctablevbap.setValue("ZGP3", orderitem.get("settlegoldvalue"));
          rfctablevbap.setValue("ZCGGK", ("N/A".equals(orderitem.get("discount1"))) || ("".equals(orderitem.get("discount1"))) ? null : Integer.valueOf(orderitem.getAsInteger("discount1").intValue() - 100));
          rfctablevbap.setValue("ZCXGK", ("N/A".equals(orderitem.get("discount2"))) || ("".equals(orderitem.get("discount2"))) ? null : Integer.valueOf(orderitem.getAsInteger("discount2").intValue() - 100));
          rfctablevbap.setValue("ZHYK", ("N/A".equals(orderitem.get("discount3"))) || ("".equals(orderitem.get("discount3"))) ? null : Integer.valueOf(orderitem.getAsInteger("discount3").intValue() - 100));
          rfctablevbap.setValue("ZSHYK", ("N/A".equals(orderitem.get("discount4"))) || ("".equals(orderitem.get("discount4"))) ? null : Integer.valueOf(orderitem.getAsInteger("discount4").intValue() - 100));
          rfctablevbap.setValue("ZZKJ", ("N/A".equals(orderitem.get("discount5"))) || ("".equals(orderitem.get("discount5"))) ? null : Integer.valueOf(orderitem.getAsInteger("discount5").intValue() - 100));
          rfctablevbap.setValue("ZJFDX", orderitem.get("vipintegral"));
          //zwh 
        System.out.println(orderitem.get("vipintegral"));
          rfctablevbap.setValue("ZGF", orderitem.get("goodsprocessingfee"));//工费

          rfctablevbap.setValue("ZSQ2", orderitem.get("marketticketprice"));
          rfctablevbap.setValue("PLTYP", orderitem.get("giftMethod"));//价格清单类型
          rfctablevbap.setValue("ZFQ2", orderitem.get("selfticketprice"));
          if("ZYS6".equals(orderHead.get("ordertype"))){
        	 Integer a = orderitem.getAsInteger("uniteprice");
        	 if(a==1){
	        	 Integer b = orderitem.getAsInteger("tagprice");
	        	 Integer zjf4= a - b ;
	        	 rfctablevbap.setValue("ZJF4",zjf4 / 10.0!=0?zjf4 / 10.0:a/10.0);
        	 }
          }else{
        	  rfctablevbap.setValue("ZJF4", Double.valueOf(Double.parseDouble(orderitem.getAsString("currentIntegral")) / 10.0D));
        	 
          }   
         
          rfctablevbap.setValue("ZSQ", orderitem.get("marketprivilege"));//商场优惠卷
          rfctablevbap.setValue("ZFQ", orderitem.get("selfprivilege"));//自发优惠卷
          rfctablevbap.setValue("ZQTFY", orderitem.get("depreciationPrice"));//其他费用
          System.out.println(orderitem.get("goodsprocessingfee"));
          try {
            Integer discount1 = ("N/A".equals(orderitem.get("discount1"))) || ("".equals(orderitem.get("discount1"))) ? null : orderitem.getAsInteger("discount1");
            Integer discount2 = ("N/A".equals(orderitem.get("discount2"))) || ("".equals(orderitem.get("discount2"))) ? null : orderitem.getAsInteger("discount2");
            Integer discount3 = ("N/A".equals(orderitem.get("discount3"))) || ("".equals(orderitem.get("discount3"))) ? null : orderitem.getAsInteger("discount3");
            Integer discount4 = ("N/A".equals(orderitem.get("discount4"))) || ("".equals(orderitem.get("discount4"))) ? null : orderitem.getAsInteger("discount4");
            Integer discount5 = ("N/A".equals(orderitem.get("discount5"))) || ("".equals(orderitem.get("discount5"))) ? null : orderitem.getAsInteger("discount5");
          } catch (Exception e) {
            Integer discount5;
            e.printStackTrace();
          }
        }
        
        rfctablevbap.appendRow();
      }
      rfctransferinfo.appendTable(rfctablevbap);
      SapTransferImpl transfer = new SapTransferImpl();
      AigTransferInfo out = transfer.transferInfoAig("Z_RFC_STORE_19", rfctransferinfo);
      System.out.println("返回结构" + out.getAigStructure("U_RETURN"));
      System.out.println("凭证号:" + out.getParameters("U_VBELN"));

      if ((out.getParameters("U_VBELN") == null) || (out.getParameters("U_VBELN") == "")) {
        returnMessag.put("message", out.getAigStructure("U_RETURN").get("MESSAGE"));
        returnMessag.put("operatedatetime", operatedatetime);
        this.orderservice.delOrderForNewOrder(orderHead);
      } else {
        returnMessag.put("salesorderid", salesorderid);

        returnMessag.put("message", out.getAigStructure("U_RETURN").get("MESSAGE"));
        returnMessag.put("sapsalesorderid", out.getParameters("U_VBELN"));
        orderHead.put("sapsalesorderid", out.getParameters("U_VBELN"));
        orderHead.put("orderflag", "UO");
        System.out.println("更新时间:" + operatedatetime);
        operatedatetime = G4Utils.getCurrentTime("yyyy-MM-dd HH:mm:ss");
        returnMessag.put("operatedatetime", operatedatetime);
        orderHead.put("operatedatetime", operatedatetime);
        this.orderservice.updateOrderByvbeln(orderHead, orderitemal);

        if (G4Utils.isNotEmpty(orderHead.getAsString("regname"))) {
          try {
            Dto memberDto = new BaseDto();

            memberDto.put("kunnr", orderHead.get("customerid"));
            memberDto.put("name1", orderHead.get("regname"));

            memberDto.put("sort1", orderHead.get("regtel"));
            memberDto.put("tel_number", orderHead.get("saledate"));
            memberDto.put("parvo", Integer.valueOf(1));

            AigTransferInfo rfctransferinfo1 = AigRepository.getTransferInfo();
            AigTransferTable empTable = rfctransferinfo1.getTable("IT_ITAB");
            empTable.setValue("KUNNR", orderHead.get("customerid"));
            empTable.setValue("NAME1", orderHead.get("regname"));
            empTable.setValue("SORT2", orderHead.get("vipcard"));
            empTable.setValue("SORT1", orderHead.get("regtel"));
            empTable.setValue("TEL_NUMBER", orderHead.get("saledate"));
            empTable.setValue("PARVO", Integer.valueOf(1));
            empTable.appendRow();
            rfctransferinfo1.appendTable(empTable);

            SapTransferImpl transfer1 = new SapTransferImpl();
            HessianContext.setRequest(request);
            AigTransferInfo outinfo1 = transfer1.transferInfoAig("Z_RFC_STORE_18", rfctransferinfo1);
            returnMessag.put("empid", orderHead.get("vipcard"));
            if ("S".equals(outinfo1.getAigStructure("U_RETURN").get("TYPE"))) {
              returnMessag.put("empmessage", outinfo1.getAigStructure("U_RETURN").get("MESSAGE"));
              System.out.println(outinfo1.getAigStructure("U_RETURN").get("MESSAGE"));
              this.g4Dao.update("membersystem.updateMember", memberDto);
            } else {
              returnMessag.put("emperror", outinfo1.getAigStructure("U_RETURN").get("MESSAGE"));
            }
          } catch (Exception e) {
            log.error(e.getMessage());
            e.printStackTrace();
          }
        }
      }
    }
    catch (Exception ex)
    {
      ex.printStackTrace();
      returnMessag.put("error", ex.toString());
    }
    jsonString = JsonHelper.encodeObject2Json(returnMessag);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  private int vSaledate(String ordertime, String customId) throws Exception {
	  AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
      rfctransferinfo.getImportPara().setParameter("WERKS", customId);

   
      SapTransferImpl transfer = new SapTransferImpl();
      AigTransferInfo out = transfer.transferInfoAig("ZIND_ZXCW_1509001", rfctransferinfo);

     Map map= out.getExportPara().getParameters();
     
     String zdate = (String) map.get("ZDATE");
     zdate = zdate.replaceAll("-", "");
     return ordertime.compareTo(zdate);
    
}

public ActionForward printOrder(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto returnMessag = new BaseDto();
    String jsonString = "";
    try {
      Dto dto = aForm.getParamAsDto(request);
      log.debug("提交订单台头:" + dto.get("orderhead").toString());
      log.debug("项目:" + dto.get("orderitem").toString());
      Dto orderHead = JsonHelper.parseSingleJson2Dto(dto.get("orderhead").toString());
      List orderitemal = JsonHelper.parseJson2List(dto.get("orderitem").toString());
      String currentDate = G4Utils.getCurrentTime("yyyyMMdd");
      boolean updateAig = false;
      if ((orderHead.get("salesorderid") == null) || (orderHead.get("salesorderid").toString().trim().equals("")))
        updateAig = false;
      else {
        updateAig = true;
      }
      String operatedatetime = G4Utils.getCurrentTime("yyyy-MM-dd HH:mm:ss");
      orderHead.put("operatedatetime", operatedatetime);
      orderHead.put("saledate", operatedatetime);
      if (updateAig) {
        this.orderservice.upadteOrder(orderHead, orderitemal);
        returnMessag.put("salesorderid", orderHead.get("salesorderid"));
      } else {
        orderHead.put("insertdatetime", G4Utils.getCurrentTime("yyyy-MM-dd"));

        String maxorderid = (String)this.g4Dao.queryForObject("posordersystem.getmaxorder", orderHead);
        String salesorderid = orderHead.getAsString("storeid") + currentDate;
        if (maxorderid == null) {
          salesorderid = salesorderid + "001";
        } else {
          String maxid = maxorderid.substring(maxorderid.length() - 3, maxorderid.length());
          Integer maxNumber = Integer.valueOf(Integer.parseInt(maxid));
          maxNumber = Integer.valueOf(maxNumber.intValue() + 1);
          String pattern = "000";
          DecimalFormat df = new DecimalFormat(pattern);
          maxid = df.format(maxNumber);
          salesorderid = salesorderid + maxid;
        }
        orderHead.put("insertdatetime", operatedatetime);
        System.out.println("插入时间:" + operatedatetime);
        returnMessag.put("operatedatetime", operatedatetime);
        orderHead.put("salesorderid", salesorderid);
        this.orderservice.saveOrder(orderHead, orderitemal);
        returnMessag.put("salesorderid", salesorderid);
      }
    } catch (Exception ex) {
      ex.printStackTrace();
      returnMessag.put("error", ex.toString());
    }
    jsonString = JsonHelper.encodeObject2Json(returnMessag);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getOrderItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String werks = null;
    try {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    } catch (Exception e) {
      return mapping.findForward(null);
    }
    List list = this.g4Dao.queryForList("posordersystem.getorderitem", dto);
    String jsonString = JsonHelper.encodeObject2Json(list);
    System.out.println(jsonString);
    jsonString = Common.getNewString(werks, jsonString);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getOrderhead(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    List list = this.g4Dao.queryForList("posordersystem.getorderhead", dto);
    String jsonString = JsonHelper.encodeObject2Json(list, "yyyy-MM-dd");
    System.out.println(jsonString);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward del(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    HessianContext.setRequest(request);
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);

    String msg = (String)dto.get("orderhead");
    List orderIds = new ArrayList();
    System.out.println(msg);
    System.out.println(orderIds);

    List listIds = JsonHelper.parseJson2List('{' + msg + '}');
    for (int i = 0; i < listIds.size(); i++) {
      orderIds.add((String)((BaseDto)listIds.get(i)).get("salesorderid"));
      System.out.println(((BaseDto)listIds.get(i)).get("salesorderid"));
    }
    dto.put("orderIds", orderIds);
    System.out.println(dto.get("orderIds"));
    List list = this.g4Dao.queryForList("posordersystem.getorderheads", dto);

    Dto returnList = new BaseDto();
    try {
      for (int i = 0; i < list.size(); i++)
      {
        Dto delorder = (Dto)list.get(i);
        System.out.println(delorder);

        String sapsalesorderid = delorder.getAsString("sapsalesorderid");
        System.out.println(sapsalesorderid);

        if (G4Utils.isNotEmpty(sapsalesorderid)) {
          this.orderservice.delOrder(delorder, returnList);
        } else {
          this.orderservice.delOrderForNewOrder(delorder);
          returnList.put("success", "新订单删除成功！");
        }

      }

    }
    catch (Exception e)
    {
      returnList.put("error", e.getMessage());
      log.debug("======删除出现错误" + e.getMessage());
      e.printStackTrace();
    }
    String jsonString = JsonHelper.encodeObject2Json(returnList);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward posting(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    HessianContext.setRequest(request);
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    List deliveryHead = JsonHelper.parseJson2List(dto.get("orderhead").toString());
    List returnList = new ArrayList();
    for (int i = 0; i < deliveryHead.size(); i++) {
      Dto returnMessag = new BaseDto();
      String message = "";
      Dto deliveryOrder = (Dto)deliveryHead.get(i);
      String operatedatetime = deliveryOrder.getAsString("operatedatetime").trim();
      String operatdate = operatedatetime.substring(0, 10).replace("-", "");
      String operattime = operatedatetime.substring(10, operatedatetime.length()).replace(":", "").trim();
      String saporderid = deliveryOrder.get("sapsalesorderid").toString();
      String postingtime = deliveryOrder.get("postingtime").toString().replace("-", "");
      if (!saporderid.equals("")) {
        AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
        AigTransferParameter rfcimport = rfctransferinfo.getTransParameter();
        AigTransferStructure importstructure = rfcimport.getTransStructure("I_ZTSTORE2_15");
        importstructure.setValue("POSID", deliveryOrder.get("salesorderid"));
        importstructure.setValue("ERDAT", operatdate);
        importstructure.setValue("ERZET", operattime.trim());
        rfcimport.appendStructure(importstructure);
        rfcimport.setParameter("I_VBELN", deliveryOrder.get("sapsalesorderid").toString());
        rfcimport.setParameter("I_DATBI", postingtime);
        rfctransferinfo.setImportPara(rfcimport);
        SapTransferImpl transfer = new SapTransferImpl();
        AigTransferInfo out = transfer.transferInfoAig("Z_RFC_STORE2_15", rfctransferinfo);
        ArrayList itreturn = out.getAigTable("IT_RETURN");
        boolean sucess = false;
        for (int j = 0; j < itreturn.size(); j++) {
          HashMap returnmap = (HashMap)itreturn.get(j);
          String updateflag = returnmap.get("TYPE").toString();
          System.out.println("返回:" + returnmap);
          if (updateflag.equals("S")) {
            sucess = true;
            message = message + "POS凭证:" + deliveryOrder.getAsString("salesorderid") + "成功  " + returnmap.get("MESSAGE") + "<br>";
          } else if (updateflag.equals("E")) {
            message = message + "<font color='red'>POS凭证:" + deliveryOrder.getAsString("salesorderid") + "失败  " + returnmap.get("MESSAGE") + "</font><br>";
          }
          returnMessag.put("message", message);
        }
        if (sucess) {
          String deliveryordernumber = out.getParameters("U_VBELN").toString();
          String materialdocumber = out.getParameters("U_MBLNR").toString();
          deliveryOrder.put("deliveryordernumber", deliveryordernumber);
          deliveryOrder.put("orderflag", "SO");
          deliveryOrder.put("materialdocumber", materialdocumber);
          operatedatetime = G4Utils.getCurrentTime("yyyy-MM-dd HH:mm:ss");
          returnMessag.put("operatedatetime", operatedatetime);
          deliveryOrder.put("operatedatetime", operatedatetime);
          this.orderservice.updateOrderByDelivery(deliveryOrder);
        }
      } else {
        message = message + "POS凭证:" + deliveryOrder.getAsString("salesorderid") + "没有产生销售凭证,不能过帐!";
        returnMessag.put("message", message);
      }
      returnList.add(returnMessag);
    }
    String jsonString = JsonHelper.encodeObject2Json(returnList);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward writeoff(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    HessianContext.setRequest(request);
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    List deliveryHead = JsonHelper.parseJson2List(dto.get("orderhead").toString());
    List returnList = new ArrayList();
    for (int i = 0; i < deliveryHead.size(); i++) {
      Dto returnMessag = new BaseDto();
      String message = "";
      Dto deliveryOrder = (Dto)deliveryHead.get(i);
      String operatedatetime = deliveryOrder.getAsString("operatedatetime").trim();
      String operatdate = operatedatetime.substring(0, 10).replace("-", "");
      String operattime = operatedatetime.substring(10, operatedatetime.length()).replace("-", "");
      String postingtime = deliveryOrder.get("postingtime").toString().replace("-", "").trim();
      String saporderid = deliveryOrder.get("sapsalesorderid").toString();
      if (!saporderid.equals("")) {
        AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
        AigTransferParameter rfcimport = rfctransferinfo.getTransParameter();
        AigTransferStructure importstructure = rfcimport.getTransStructure("I_ZTSTORE2_16");
        importstructure.setValue("POSID", deliveryOrder.get("salesorderid"));
        importstructure.setValue("ERDAT", operatdate);
        importstructure.setValue("ERZET", operattime.trim());
        rfcimport.appendStructure(importstructure);
        rfcimport.setParameter("I_VBELN", deliveryOrder.get("deliveryordernumber").toString());
        rfcimport.setParameter("I_BUDAT", postingtime);
        rfctransferinfo.setImportPara(rfcimport);
        SapTransferImpl transfer = new SapTransferImpl();
        AigTransferInfo out = transfer.transferInfoAig("Z_RFC_STORE2_16", rfctransferinfo);
        ArrayList itreturn = out.getAigTable("IT_RETURN");
        boolean sucess = false;
        for (int j = 0; j < itreturn.size(); j++) {
          HashMap returnmap = (HashMap)itreturn.get(j);
          String updateflag = returnmap.get("TYPE").toString();
          System.out.println("返回:" + returnmap);
          if (updateflag.equals("S")) {
            sucess = true;
            message = message + "POS凭证:" + deliveryOrder.getAsString("salesorderid") + "成功  " + returnmap.get("MESSAGE") + "<br>";
          } else if (updateflag.equals("E")) {
            message = message + "POS凭证:" + deliveryOrder.getAsString("salesorderid") + "失败  " + returnmap.get("MESSAGE") + "<br>";
          }
          returnMessag.put("message", message);
        }
        if (sucess) {
          deliveryOrder.put("deliveryordernumber", "");
          deliveryOrder.put("orderflag", "UO");
          deliveryOrder.put("materialdocumber", "");
          operatedatetime = G4Utils.getCurrentTime("yyyy-MM-dd HH:mm:ss");
          returnMessag.put("operatedatetime", operatedatetime);
          deliveryOrder.put("operatedatetime", operatedatetime);
          this.orderservice.updateOrderByDelivery(deliveryOrder);
        }
      }
      else {
        message = message + "POS凭证:" + deliveryOrder.getAsString("salesorderid") + "没有产生销售凭证,不能冲销!";
        returnMessag.put("message", message);
      }
      returnList.add(returnMessag);
    }
    String jsonString = JsonHelper.encodeObject2Json(returnList);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward registerUser(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    HessianContext.setRequest(request);
    CommonActionForm aForm = (CommonActionForm)form;

    Dto dto = aForm.getParamAsDto(request);
    String werks = null;
    try {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    } catch (Exception e) {
      werks = "01SZ";
    }
    dto.put("werks", werks);
    log.info("开始从pos端取得一个可使用的会员编号");
    
    //检查手机号
    Integer count =  (Integer) this.g4Dao.queryForObject("posordersystem.getMemberByPhone", dto);
    if(count>0){
    	String retStr = "{msg:'手机号已注册。'}";
    		write(retStr, response);
    	    return mapping.findForward(null);
    }
    
    Dto memberInfo = (Dto)this.g4Dao.queryForObject("posordersystem.getMemberInfo", dto);
    memberInfo.put("name1", dto.getAsString("regname"));
    memberInfo.put("sort1", dto.getAsString("regPhone"));

    log.info("成功取到一个会员编号" + memberInfo);

    String retStr = JsonHelper.encodeObject2Json(memberInfo);
    System.out.println(retStr);
    write(retStr, response);
    return mapping.findForward(null);
  }

  public ActionForward validateRegistPhone(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    HessianContext.setRequest(request);
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    Dto memberInfo = (Dto)this.g4Dao.queryForObject("posordersystem.validateRegistPhone", dto);
    String retStr = JsonHelper.encodeObject2Json(memberInfo);
    System.out.println(retStr);
    write(retStr, response);
    return mapping.findForward(null);
  }

  public ActionForward getDiscount(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String charg = dto.getAsString("charg");
    String werks = null;
    try {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    }
    catch (Exception e) {
      log.debug("没有登录过，不能做操作错误：" + e.getMessage());
      return mapping.findForward(null);
    }

    dto.put("werks", werks);
    dto.put("currDate", G4Utils.getCurrentTime("yyyy-MM-dd"));

//    System.out.println(charg);

    Integer discount1 = Integer.valueOf(100);
    Integer discount2 = Integer.valueOf(100);

    Integer discount1Dto = (Integer)this.g4Dao.queryForObject("posordersystem.getDiscount1ByCharg", dto);
    Integer discount2Dto = (Integer)this.g4Dao.queryForObject("posordersystem.getDiscount2ByCharg", dto);

    discount1 = Integer.valueOf(G4Utils.isNotEmpty(discount1Dto) ? 100 + discount1Dto.intValue() / 10 : discount1.intValue());
    discount2 = Integer.valueOf(G4Utils.isNotEmpty(discount2Dto) ? 100 + discount2Dto.intValue() / 10 : discount2.intValue());

    String discount3 = (String)this.g4Dao.queryForObject("posordersystem.getKunnrDiscount", dto);
    Dto retDto = new BaseDto();
    retDto.put("discount1", discount1);
    retDto.put("discount2", discount2);
    retDto.put("discount3", Integer.valueOf(100));
    if (discount3 != null) {
      try {
        retDto.put("discount3", Double.valueOf(100.0D + Double.parseDouble(discount3) / 10.0D));
      } catch (Exception e) {
        e.printStackTrace();
        log.debug(e.getMessage());
      }

    }

    String jsonString = JsonHelper.encodeObject2Json(retDto);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getCustommadeList(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String charg = dto.getAsString("charg");
    String werks = null;
    try {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    } catch (Exception e) {
      werks = "SZ01";
    }
    dto.put("werks", werks);
    List list = this.g4Dao.queryForList("posordersystem.getCustommadeList", dto);
    String jsonString = JsonHelper.encodeObject2Json(list);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getGroupGoodsItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String charg = dto.getAsString("charg");
    String werks = null;
    try {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    } catch (Exception e) {
      werks = "SZ01";
    }
    dto.put("werks", werks);
    List list = this.g4Dao.queryForList("posordersystem.getGroupGoodsItem", dto);
    String jsonString = JsonHelper.encodeObject2Json(list);
    write(jsonString, response);
    return mapping.findForward(null);
  }
  
  public ActionForward getGroupGoodsItem2(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String charg = dto.getAsString("charg");
    String werks = null;
    String jsonString="";
    try {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    } catch (Exception e) {
      werks = "SZ01";
    }
    dto.put("werks", werks);
    String kosrt = (String) this.g4Dao.queryForObject("posordersystem.getGroupGoods", dto);
    if(kosrt!=null&&!kosrt.equals("")){
    	dto.put("kosrt", kosrt);
    	List list = this.g4Dao.queryForList("posordersystem.getGroupGoodsItem", dto);
   	 	jsonString = JsonHelper.encodeObject2Json(list);
    }else{
    	jsonString="{error:'没有找到改批次的组合销售。'}";
    }   
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getCustommadeInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String charg = dto.getAsString("charg");
    String werks = null;
    try {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    } catch (Exception e) {
      werks = "SZ01";
    }
    dto.put("werks", werks);
    List list = this.g4Dao.queryForList("posordersystem.getCustommadeInfo", dto);
    String jsonString = JsonHelper.encodeObject2Json(list);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getCustommadeItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String charg = dto.getAsString("charg");
    String werks = null;
    try {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    } catch (Exception e) {
      werks = "SZ01";
    }
    dto.put("werks", werks);
    List list = this.g4Dao.queryForList("posordersystem.getCustommadeItem", dto);
    String jsonString = JsonHelper.encodeObject2Json(list);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getCurrentIntegral(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String charg = dto.getAsString("charg");
    String werks = null;
    try {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    } catch (Exception e) {
      werks = "SZ01";
    }
    dto.put("werks", werks);
    String kunnr = dto.getAsString("kunnr");

    String currentIntegral = (String)this.g4Dao.queryForObject("posordersystem.getCurrentIntegral", dto);

    write(currentIntegral == null ? "0" : currentIntegral, response);
    return mapping.findForward(null);
  }

  public ActionForward getThankIntegral(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String charg = dto.getAsString("charg");
    String werks = null;
    try {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    }
    catch (Exception e) {
      return mapping.findForward(null);
    }
    dto.put("werks", werks);
    String currentIntegral = (String)this.g4Dao.queryForObject("posordersystem.getThankIntegral", dto);
    currentIntegral = currentIntegral == null ? "10" : currentIntegral;
    write(currentIntegral, response);
    return mapping.findForward(null);
  }

  public ActionForward getMatnrGift(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String charg = dto.getAsString("charg");
    String werks = null;
    try {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    } catch (Exception e) {
      werks = "SZ01";
    }
    dto.put("werks", werks);

    System.out.println(dto.getAsString("matnr"));
    List list = this.g4Dao.queryForList("posordersystem.getMatnrGift", dto);
    String retStr = JsonHelper.encodeObject2Json(list);
    write(retStr, response);
    return mapping.findForward(null);
  }
  /**
   * 促销代码
   * @param mapping
   * @param form
   * @param request
   * @param response
   * @return
   * @throws Exception
   */
  public ActionForward getSalepromotion(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String charg = dto.getAsString("charg");
    String werks = null;
    try {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    } catch (Exception e) {
      log.error(e.getMessage());
    }
    dto.put("werks", werks);
//    System.out.println("11111");
//    System.out.println(dto.getAsString("matnr"));
//    dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
    List list = new ArrayList();
    List liCharg = this.g4Dao.queryForList("posordersystem.getSalepromotion", dto);
    if ((liCharg != null) && (liCharg.size() > 0)) {
    	list.addAll(liCharg);
    }
    List liKondm = this.g4Dao.queryForList("posordersystem.getSalepromotionForKondm", dto);
    if ((liKondm != null) && (liKondm.size() > 0)) {
    	list.addAll(liKondm);
    }
    
    String retStr = JsonHelper.encodeObject2Json(list);
    write(retStr, response);
    return mapping.findForward(null);
  }

  public ActionForward getFrontMoneyList(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String charg = dto.getAsString("charg");
    String werks = null;
    try {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    } catch (Exception e) {
      log.error(e.getMessage());
    }
    dto.put("werks", werks);

    System.out.println(dto.getAsString("matnr"));
    dto.put("currentDate", G4Utils.getCurrentTime("yyyy-MM-dd"));
    List list = this.g4Dao.queryForList("posordersystem.getFrontMoneyList", dto);
    String retStr = JsonHelper.encodeObject2Json(list);
    write(retStr, response);
    return mapping.findForward(null);
  }

  public ActionForward getFrontMoneyInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String charg = dto.getAsString("charg");
    String werks = null;
    try {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    } catch (Exception e) {
      werks = "SZ01";
    }
    dto.put("werks", werks);
    List list = this.g4Dao.queryForList("posordersystem.getFrontMoneyInfo", dto);
    String jsonString = JsonHelper.encodeObject2Json(list);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getIntegralMatnrInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String charg = dto.getAsString("charg");
    String werks = null;
    try {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    } catch (Exception e) {
      werks = "SZ01";
    }
    dto.put("werks", werks);
    List list = null;
    if (("ZYS4".equals(dto.getAsString("ordertype"))) || ("ZJM4".equals(dto.getAsString("ordertype"))))
      list = this.g4Dao.queryForList("posordersystem.getAllGiftInfo", dto);
    else {
      list = this.g4Dao.queryForList("posordersystem.getIntegralMatnrInfo", dto);
    }
    String jsonString = JsonHelper.encodeObject2Json(list);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getFrontMoneyItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    //String charg = dto.getAsString("charg");
    //String orderid = dto.getAsString("");
    String werks = null;
    try {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    } catch (Exception e) {
      werks = "SZ01";
    }
    dto.put("werks", werks);
    List list = this.g4Dao.queryForList("posordersystem.getFrontMoneyItem", dto);
    String jsonString = JsonHelper.encodeObject2Json(list);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getIntegralMatnrItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String charg = dto.getAsString("charg");
    String werks = null;
    try {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    } catch (Exception e) {
      werks = "SZ01";
    }
    dto.put("werks", werks);
    List list = this.g4Dao.queryForList("posordersystem.getIntegralMatnrItem", dto);
    String jsonString = JsonHelper.encodeObject2Json(list);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  private boolean saveRegisterInfo(Dto orderHead, HttpServletRequest request)
  {
    boolean flag = false;
    try {
      Dto memberDto = new BaseDto();

      memberDto.put("kunnr", orderHead.get("customerid"));
      memberDto.put("name1", orderHead.get("regname"));

      memberDto.put("sort1", orderHead.get("regtel"));
      memberDto.put("tel_number", orderHead.get("saledate"));

      this.g4Dao.update("membersystem.updateMember", memberDto);

      AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
      AigTransferTable empTable = rfctransferinfo.getTable("IT_ITAB");
      empTable.setValue("KUNNR", orderHead.get("customerid"));
      empTable.setValue("NAME1", orderHead.get("regname"));
      empTable.setValue("SORT2", orderHead.get("vipid"));
      empTable.setValue("SORT1", orderHead.get("regtel"));
      empTable.setValue("TEL_NUMBER", orderHead.get("saledate"));
      empTable.appendRow();
      rfctransferinfo.appendTable(empTable);

      SapTransferImpl transfer = new SapTransferImpl();
      HessianContext.setRequest(request);
      AigTransferInfo outinfo = transfer.transferInfoAig("Z_RFC_STORE_18", rfctransferinfo);

      if ("S".equals(outinfo.getAigStructure("U_RETURN").get("TYPE")))
        flag = true;
      else
        flag = false;
    }
    catch (Exception e) {
      log.error(e.getMessage());
      e.printStackTrace();
      flag = false;
    }
    return flag;
  }

  public ActionForward getSapStockByCharg(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String charg = dto.getAsString("charg");
    String werks = null;
    try {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    } catch (Exception e) {
      log.error(e.getMessage());
      return mapping.findForward(null);
    }
    dto.put("werks", werks);

    AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
    rfctransferinfo.getImportPara().setParameter("I_WERKS", werks);
    rfctransferinfo.getImportPara().setParameter("I_CHARG", dto.get("charg"));
    SapTransferImpl transfer = new SapTransferImpl();
    HessianContext.setRequest(request);
    AigTransferInfo outinfo = transfer.transferInfoAig("Z_RFC_STORE_20", rfctransferinfo);

    ArrayList list = outinfo.getAigTable("IT_STOCK");
    String con = "";
    if (list != null) {
      for (int i = 0; i < list.size(); i++) {
        if (dto.getAsString("charg").equals(((HashMap)list.get(i)).get("CHARG")))
          con = (String)((HashMap)list.get(i)).get("LABST");
      }
    }
    else {
      con = null;
    }
    if (con == null) {
      con = "0";
    }

    write(con, response);
    return mapping.findForward(null);
  }

  public ActionForward getLgort(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = dto.getAsString("WERKS");
    if (super.getSessionContainer(request).getUserInfo() != null)
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
    else
      return mapping.findForward("authorization");
    List lgortInfo = this.g4Reader.queryForList("posordersystem.getLgortInfo", werks);
    String retStr = JsonHelper.encodeObject2Json(lgortInfo);
    write(retStr, response);
    return mapping.findForward(null);
  }

  public ActionForward getIfNeedNE(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = dto.getAsString("WERKS");
    if (super.getSessionContainer(request).getUserInfo() != null) {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
      dto.put("werks", werks);
    } else {
      return mapping.findForward("authorization");
    }Dto lgortInfo = (Dto)this.g4Reader.queryForObject("posordersystem.getIfNeedNE", dto);
    String retStr = JsonHelper.encodeObject2Json(lgortInfo);
    write(retStr, response);
    return mapping.findForward(null);
  }

  public ActionForward getGiftPrice(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = dto.getAsString("WERKS");
    if (super.getSessionContainer(request).getUserInfo() != null) {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
      dto.put("werks", werks);
    } else {
      return mapping.findForward("authorization");
    }Double giftPrice = (Double)this.g4Reader.queryForObject("posordersystem.getGiftPrice", dto);
    dto.put("giftPrice", giftPrice);
    String retStr = JsonHelper.encodeObject2Json(dto);
    write(retStr, response);
    return mapping.findForward(null);
  }
  
  public ActionForward getAccountFlag(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
   // String flag = (String)this.g4Dao.queryForObject("posordersystem.getAccountFlag", dto);
   // write(flag, response);
    
    // 修改
    AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
    rfctransferinfo.getImportPara().setParameter("WERKS", super.getSessionContainer(request).getUserInfo().getCustomId());

 
    SapTransferImpl transfer = new SapTransferImpl();
    AigTransferInfo out = transfer.transferInfoAig("ZIND_ZXCW_1509001", rfctransferinfo);

   Map map= out.getExportPara().getParameters();
System.out.println(map.get("ZDATE"));
    write("{zdate:"+map.get("ZDATE")+"}", response);
    
    
    return mapping.findForward(null);
  }

  public ActionForward getOldGoldType(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = dto.getAsString("WERKS");
    if (super.getSessionContainer(request).getUserInfo() != null) {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
      dto.put("werks", werks);
    } else {
      return mapping.findForward("authorization");
    }List giftPrice = this.g4Reader.queryForList("posordersystem.getOldGoldType");
    String retStr = JsonHelper.encodeObject2Json(giftPrice);
    write(retStr, response);
    return mapping.findForward(null);
  }

  public ActionForward getZjbgf(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = dto.getAsString("WERKS");
    if (super.getSessionContainer(request).getUserInfo() != null) {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
      dto.put("werks", werks);
    } else {
      return mapping.findForward("authorization");
    }

    Integer goldProcessValue = Integer.valueOf(0);
    try
    {
      Dto goldprocessDto = (Dto)this.g4Reader.queryForObject("posordersystem.getPersonProcessPrice", dto);
      if (G4Utils.isNotEmpty(goldprocessDto))
        if (goldprocessDto.getAsInteger("zgdo").intValue() == 0)
          goldProcessValue = Integer.valueOf(goldprocessDto.getAsInteger("zgfbs").intValue() * goldprocessDto.getAsInteger("jbfy").intValue());
        else
          goldProcessValue = goldprocessDto.getAsInteger("zgdo");
    }
    catch (Exception e)
    {
      log.error("获取工费出现错误：" + e.getMessage());
      e.printStackTrace();
    }

    write(goldProcessValue != null ? goldProcessValue.toString() : "0", response);
    return mapping.findForward(null);
  }

  public ActionForward getOrderInfoForPrint(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = dto.getAsString("WERKS");
    if (super.getSessionContainer(request).getUserInfo() != null) {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
      dto.put("werks", werks);
    } else {
      return mapping.findForward("authorization");
    }
    Dto orderHead = (Dto)this.g4Dao.queryForObject("posordersystem.getorderhead", dto);
    List orderItems = this.g4Dao.queryForList("posordersystem.getorderitem", dto);

    request.setAttribute("orderHead", orderHead);
    request.setAttribute("orderItems", orderItems);

    return mapping.findForward("printOrder");
  }

  public ActionForward updateOrderPrice(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    Dto retDto = new BaseDto();
    String werks = null;
    if (super.getSessionContainer(request).getUserInfo() != null) {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
      dto.put("werks", werks);
    } else {
      return mapping.findForward("authorization");
    }

    Double cash = Double.valueOf(Double.parseDouble(dto.getAsString("cash")));
    Double shoppingcard = Double.valueOf(Double.parseDouble(dto.getAsString("shoppingcard")));
    Double unionpay = Double.valueOf(Double.parseDouble(dto.getAsString("unionpay")));
    String shopnumber = dto.getAsString("shopnumber");
    String salesorderid = dto.getAsString("salesorderid");
    String sapsalesorderid = dto.getAsString("sapsalesorderid");
    String remark = dto.getAsString("remark");
    String ordertime = dto.getAsString("ordertime");
    try
    {
      AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
      rfctransferinfo.getImportPara().setParameter("I_VBELN", sapsalesorderid);

      AigTransferTable rfctablevbak = rfctransferinfo.getTable("IT_ZXSDH");

      rfctablevbak.setValue("ZGF4", shoppingcard);
      rfctablevbak.setValue("ZGF3", unionpay);
      rfctablevbak.setValue("KTEXT", remark);
      rfctablevbak.setValue("TELF1", shopnumber);
      rfctablevbak.setValue("AUDAT", ordertime);

      rfctablevbak.appendRow();
      rfctransferinfo.appendTable(rfctablevbak);

      SapTransferImpl transfer = new SapTransferImpl();
      AigTransferInfo out = transfer.transferInfoAig("Z_RFC_STORE_53", rfctransferinfo);

      Dto retParamDto = new BaseDto();

      retParamDto.putAll(out.getAigStructure("U_RETURN"));
      if ("S".equals(retParamDto.getAsString("TYPE"))) {
        int i = this.g4Dao.update("posordersystem.updateorderprice", dto);
        retDto.put("success", retParamDto.getAsString("MESSAGE"));
      } else {
        retDto.put("error", retParamDto.getAsString("MESSAGE"));
      }
    } catch (Exception e) {
      log.debug("更新销单价格信息时出现错误，错误信息：" + e.getMessage());
      retDto.put("error", e.getMessage());
      e.printStackTrace();
    }

    String retStr = JsonHelper.encodeObject2Json(retDto);

    write(retStr, response);

    return null;
  }

  public ActionForward getIfHaveGiveGift(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    Dto retDto = new BaseDto();

    Integer flag = Integer.valueOf(0);
    boolean flag1 = false;
    boolean flag2 = false;

    List matnrs = this.g4Dao.queryForList("posordersystem.getIfHaveGiveGift", dto);

    if (G4Utils.isNotEmpty(matnrs)) {
      for (int i = 0; i < matnrs.size(); i++) {
        String matnr = (String)matnrs.get(i);
        if (matnr.startsWith("VSR"))
          flag1 = true;
        else if (matnr.startsWith("VJH")) {
          flag2 = true;
        }
        if ((flag1) && (flag2))
        {
          break;
        }
      }
    }
    if ((flag1) && (flag2))
      flag = Integer.valueOf(3);
    else if (flag1)
      flag = Integer.valueOf(1);
    else if (flag2)
      flag = Integer.valueOf(2);
    else {
      flag = Integer.valueOf(0);
    }

    retDto.put("flag", flag);

    String retStr = JsonHelper.encodeObject2Json(retDto);

    write(retStr, response);

    return null;
  }

  public ActionForward exportOrder(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = null;
    if (super.getSessionContainer(request).getUserInfo() != null) {
      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
      dto.put("werks", werks);
    } else {
      return mapping.findForward("authorization");
    }
    Dto retDto = new BaseDto();
    HSSFWorkbook workbook = new HSSFWorkbook();
    HSSFSheet sheet = workbook.createSheet();
    DecimalFormat df = new DecimalFormat("#.00");

    HSSFFont columnHeadFont = workbook.createFont();
    columnHeadFont.setFontName("宋体");
    columnHeadFont.setFontHeightInPoints((short)10);
    columnHeadFont.setBoldweight((short)700);
    HSSFCellStyle columnHeadStyle = workbook.createCellStyle();
    columnHeadStyle.setFont(columnHeadFont);
    columnHeadStyle.setAlignment((short)2);
    columnHeadStyle.setVerticalAlignment((short)1);
    columnHeadStyle.setBorderBottom((short)1);

    String batchno = dto.getAsString("batchno");
    dto.put("batchno", '%' + batchno + '%');

    if (G4Utils.isNotEmpty(dto.get("ordertype"))) {
      String str = dto.getAsString("ordertype");
      str = URLDecoder.decode(str, "utf-8");

      String[] array = str.split(",");
      List orderlist = new ArrayList();
      for (int i = 0; i < array.length; i++) {
        orderlist.add(getOrderTypeCode(array[i].trim()));
      }
      dto.put("ordertype", orderlist);
    }

    Dto orderFlag = new BaseDto();
    orderFlag.put("NO", "新订单");
    orderFlag.put("PO", "订单打印");
    orderFlag.put("UO", "订单上传");
    orderFlag.put("SO", "订单过账");
    orderFlag.put("CO", "订单冲销");
    orderFlag.put("DO", "已收定金");
    orderFlag.put("RO", "已退定金");
    orderFlag.put("NS", "新结算单");
    orderFlag.put("US", "结算单上传");
    if ("info".equals(dto.getAsString("type"))) {
      sheet.setColumnWidth(0, 4500);
      sheet.setColumnWidth(1, 2500);
      sheet.setColumnWidth(2, 5000);
      sheet.setColumnWidth(3, 4500);
      sheet.setColumnWidth(4, 4000);
      sheet.setColumnWidth(5, 2500);
      sheet.setColumnWidth(6, 2500);
      sheet.setColumnWidth(7, 4000);
      Double totalprice = Double.valueOf(0.0D);
      try {
        HSSFRow row1 = sheet.createRow(0);
        row1.setHeight((short)500);
        HSSFCell cell1 = row1.createCell(0);
        cell1.setCellStyle(columnHeadStyle);
        cell1.setCellValue(new HSSFRichTextString("订单信息"));
        CellRangeAddress range = new CellRangeAddress(0, 0, 0, 7);
        sheet.addMergedRegion(range);
        HSSFRow row2 = sheet.createRow(1);
        row2.setHeight((short)500);
        HSSFCell cell21 = row2.createCell(0);
        HSSFCell cell22 = row2.createCell(1);
        HSSFCell cell23 = row2.createCell(2);
        HSSFCell cell24 = row2.createCell(3);
        HSSFCell cell25 = row2.createCell(4);
        HSSFCell cell26 = row2.createCell(5);
        HSSFCell cell27 = row2.createCell(6);
        HSSFCell cell28 = row2.createCell(7);

        cell21.setCellStyle(columnHeadStyle);
        cell22.setCellStyle(columnHeadStyle);
        cell23.setCellStyle(columnHeadStyle);
        cell24.setCellStyle(columnHeadStyle);
        cell25.setCellStyle(columnHeadStyle);
        cell26.setCellStyle(columnHeadStyle);
        cell27.setCellStyle(columnHeadStyle);
        cell28.setCellStyle(columnHeadStyle);

        cell21.setCellValue(new HSSFRichTextString("销售订单"));
        cell22.setCellValue(new HSSFRichTextString("SAP单号"));
        cell23.setCellValue(new HSSFRichTextString("类型"));
        cell24.setCellValue(new HSSFRichTextString("订单时间"));
        cell25.setCellValue(new HSSFRichTextString("客户ID"));
        cell26.setCellValue(new HSSFRichTextString("状态"));
        cell27.setCellValue(new HSSFRichTextString("实销价格"));
        cell28.setCellValue(new HSSFRichTextString("营业员"));

        List list = this.g4Dao.queryForList("posordersystem.getorderheadbyuser", dto);

        for (int i = 0; i < list.size(); i++) {
          Dto dataDto = (Dto)list.get(i);
          dataDto.put("orderflag", orderFlag.get(dataDto.getAsString("orderflag")));
          dataDto.put("ordertype", getOrderTypeText(dataDto.getAsString("ordertype")));
          HSSFRow row = sheet.createRow(i + 2);
          row.setHeight((short)400);
          HSSFCell c1 = row.createCell(0);

          c1.setCellValue(new HSSFRichTextString(dataDto.getAsString("salesorderid")));
          HSSFCell c2 = row.createCell(1);
          c2.setCellValue(new HSSFRichTextString(dataDto.getAsString("sapsalesorderid")));
          HSSFCell c3 = row.createCell(2);
          c3.setCellValue(new HSSFRichTextString(dataDto.getAsString("ordertype")));
          HSSFCell c4 = row.createCell(3);
          c4.setCellValue(new HSSFRichTextString(dataDto.getAsString("saledate").substring(0, 10)));
          HSSFCell c5 = row.createCell(4);
          c5.setCellValue(new HSSFRichTextString(dataDto.getAsString("vipcard")));
          HSSFCell c6 = row.createCell(5);
          c6.setCellValue(new HSSFRichTextString(dataDto.getAsString("orderflag")));
          HSSFCell c7 = row.createCell(6);
          if (G4Utils.isNotEmpty(dataDto.get("totalmoney"))) {
            totalprice = Double.valueOf(totalprice.doubleValue() + Double.parseDouble(dataDto.getAsString("totalmoney")));
          }
          c7.setCellValue(new HSSFRichTextString(dataDto.getAsString("totalmoney")));
          HSSFCell c8 = row.createCell(7);
          c8.setCellValue(new HSSFRichTextString(dataDto.getAsString("salesclerk")));
        }

        HSSFRow totalrow = sheet.createRow(list.size() + 2);
        HSSFCell totalcell1 = totalrow.createCell(0);
        HSSFCell totalcell2 = totalrow.createCell(1);
        HSSFCell totalcell3 = totalrow.createCell(2);
        HSSFCell totalcell4 = totalrow.createCell(3);
        HSSFCell totalcell5 = totalrow.createCell(4);
        HSSFCell totalcell6 = totalrow.createCell(5);
        totalcell6.setCellValue(new HSSFRichTextString("总金额："));
        HSSFCell totalcell7 = totalrow.createCell(6);
        totalcell7.setCellValue(new HSSFRichTextString(df.format(totalprice)));

        String filename = "orderInfo.xls";
        response.setContentType("application/vnd.ms-excel");
        response.setHeader("Content-disposition", "attachment;filename=" + filename);
        OutputStream ouputStream = response.getOutputStream();
        workbook.write(ouputStream);
        ouputStream.flush();
        ouputStream.close();
      }
      catch (Exception e) {
        e.printStackTrace();
      }
    }
    else if ("detail".equals(dto.getAsString("type")))
    {
      sheet.setColumnWidth(0, 4000);
      sheet.setColumnWidth(1, 5000);
      sheet.setColumnWidth(2, 3000);
      sheet.setColumnWidth(3, 3000);
      sheet.setColumnWidth(4, 3000);
      sheet.setColumnWidth(5, 2500);
      sheet.setColumnWidth(6, 2500);
      sheet.setColumnWidth(7, 2500);
      sheet.setColumnWidth(8, 4000);
      sheet.setColumnWidth(9, 4000);
      sheet.setColumnWidth(10, 5000);
      sheet.setColumnWidth(11, 2000);
      sheet.setColumnWidth(12, 2000);
      sheet.setColumnWidth(13, 2500);
      sheet.setColumnWidth(14, 2500);
      sheet.setColumnWidth(15, 2500);
      sheet.setColumnWidth(16, 2500);
      sheet.setColumnWidth(17, 2500);
      sheet.setColumnWidth(18, 2500);
      sheet.setColumnWidth(19, 2500);
      sheet.setColumnWidth(20, 2500);
      sheet.setColumnWidth(21, 5000);

      double totalmoney = 0.0D;
      double totalprice = 0.0D;
      try {
        HSSFRow row1 = sheet.createRow(0);
        row1.setHeight((short)500);
        HSSFCell cell1 = row1.createCell(0);
        cell1.setCellStyle(columnHeadStyle);
        cell1.setCellValue(new HSSFRichTextString("订单详细信息"));
        CellRangeAddress range = new CellRangeAddress(0, 0, 0, 21);
        sheet.addMergedRegion(range);
        HSSFRow row2 = sheet.createRow(1);
        row2.setHeight((short)500);
        HSSFCell cell21 = row2.createCell(0);
        HSSFCell cell22 = row2.createCell(1);
        HSSFCell cell23 = row2.createCell(2);
        HSSFCell cell24 = row2.createCell(3);
        HSSFCell cell25 = row2.createCell(4);
        HSSFCell cell26 = row2.createCell(5);
        HSSFCell cell27 = row2.createCell(6);
        HSSFCell cell28 = row2.createCell(7);
        HSSFCell cell29 = row2.createCell(8);
        HSSFCell cell30 = row2.createCell(9);
        HSSFCell cell31 = row2.createCell(10);
        HSSFCell cell32 = row2.createCell(11);
        HSSFCell cell33 = row2.createCell(12);
        HSSFCell cell34 = row2.createCell(13);
        HSSFCell cell35 = row2.createCell(14);
        HSSFCell cell36 = row2.createCell(15);
        HSSFCell cell37 = row2.createCell(16);
        HSSFCell cell38 = row2.createCell(17);
        HSSFCell cell39 = row2.createCell(18);
        HSSFCell cell40 = row2.createCell(19);
        HSSFCell cell41 = row2.createCell(20);
        HSSFCell cell42 = row2.createCell(21);

        cell21.setCellStyle(columnHeadStyle);
        cell22.setCellStyle(columnHeadStyle);
        cell23.setCellStyle(columnHeadStyle);
        cell24.setCellStyle(columnHeadStyle);
        cell25.setCellStyle(columnHeadStyle);
        cell26.setCellStyle(columnHeadStyle);
        cell27.setCellStyle(columnHeadStyle);
        cell28.setCellStyle(columnHeadStyle);
        cell29.setCellStyle(columnHeadStyle);
        cell30.setCellStyle(columnHeadStyle);
        cell31.setCellStyle(columnHeadStyle);
        cell32.setCellStyle(columnHeadStyle);
        cell33.setCellStyle(columnHeadStyle);
        cell34.setCellStyle(columnHeadStyle);
        cell35.setCellStyle(columnHeadStyle);
        cell36.setCellStyle(columnHeadStyle);
        cell37.setCellStyle(columnHeadStyle);
        cell38.setCellStyle(columnHeadStyle);
        cell39.setCellStyle(columnHeadStyle);
        cell40.setCellStyle(columnHeadStyle);
        cell41.setCellStyle(columnHeadStyle);
        cell42.setCellStyle(columnHeadStyle);

        cell21.setCellValue(new HSSFRichTextString("销售单号"));
        cell22.setCellValue(new HSSFRichTextString("类型"));
        cell23.setCellValue(new HSSFRichTextString("订单时间"));
        cell24.setCellValue(new HSSFRichTextString("客户ID"));
        cell25.setCellValue(new HSSFRichTextString("状态"));
        cell26.setCellValue(new HSSFRichTextString("实销价格"));
        cell27.setCellValue(new HSSFRichTextString("标签价"));
        cell28.setCellValue(new HSSFRichTextString("金价"));
        cell29.setCellValue(new HSSFRichTextString("批次"));
        cell30.setCellValue(new HSSFRichTextString("物料号"));
        cell31.setCellValue(new HSSFRichTextString("物料名称"));
        cell32.setCellValue(new HSSFRichTextString("数量"));
        cell33.setCellValue(new HSSFRichTextString("实销折扣"));
        cell34.setCellValue(new HSSFRichTextString("金料"));
        cell35.setCellValue(new HSSFRichTextString("金重"));
        cell36.setCellValue(new HSSFRichTextString("工费"));
        cell37.setCellValue(new HSSFRichTextString("本次积分"));
        cell38.setCellValue(new HSSFRichTextString("石料"));
        cell39.setCellValue(new HSSFRichTextString("石重"));
        cell40.setCellValue(new HSSFRichTextString("石料净度"));
        cell41.setCellValue(new HSSFRichTextString("石料颜色"));
        cell42.setCellValue(new HSSFRichTextString("营业员"));

        List list = this.g4Dao.queryForList("posordersystem.getOrderDetail", dto);

        for (int i = 0; i < list.size(); i++) {
          Dto dataDto = (Dto)list.get(i);
          dataDto.put("orderflag", orderFlag.get(dataDto.getAsString("orderflag")));
          dataDto.put("ordertype", getOrderTypeText(dataDto.getAsString("ordertype")));
          HSSFRow row = sheet.createRow(i + 2);
          row.setHeight((short)400);
          HSSFCell c1 = row.createCell(0);

          c1.setCellValue(new HSSFRichTextString(dataDto.getAsString("sapsalesorderid")));
          HSSFCell c2 = row.createCell(1);
          c2.setCellValue(new HSSFRichTextString(dataDto.getAsString("ordertype")));
          HSSFCell c3 = row.createCell(2);
          c3.setCellValue(new HSSFRichTextString(dataDto.getAsString("saledate").substring(0, 10)));
          HSSFCell c4 = row.createCell(3);
          c4.setCellValue(new HSSFRichTextString(dataDto.getAsString("vipcard")));
          HSSFCell c5 = row.createCell(4);
          c5.setCellValue(new HSSFRichTextString(dataDto.getAsString("orderflag")));
          HSSFCell c6 = row.createCell(5);
          if (G4Utils.isNotEmpty(dataDto.get("totalamount"))) {
            totalmoney += Double.parseDouble(dataDto.getAsString("totalamount"));
          }
          c6.setCellValue(new HSSFRichTextString(dataDto.getAsString("totalamount")));
          HSSFCell c7 = row.createCell(6);
          if (G4Utils.isNotEmpty(dataDto.getAsString("tagprice"))) {
            totalprice += Double.parseDouble(dataDto.getAsString("tagprice"));
          }
          c7.setCellValue(new HSSFRichTextString(dataDto.getAsString("tagprice")));
          HSSFCell c8 = row.createCell(7);
          c8.setCellValue(new HSSFRichTextString(dataDto.getAsString("goldprice")));
          HSSFCell c9 = row.createCell(8);
          c9.setCellValue(new HSSFRichTextString(dataDto.getAsString("batchnumber")));
          HSSFCell c10 = row.createCell(9);
          c10.setCellValue(new HSSFRichTextString(dataDto.getAsString("materialnumber")));
          HSSFCell c11 = row.createCell(10);
          c11.setCellValue(new HSSFRichTextString(dataDto.getAsString("materialdesc")));
          HSSFCell c12 = row.createCell(11);
          c12.setCellValue(new HSSFRichTextString(dataDto.getAsString("salesquantity")));
          HSSFCell c13 = row.createCell(12);
          int money = 0;
          if ((G4Utils.isNotEmpty(dataDto.get("tagprice"))) && (G4Utils.isNotEmpty(dataDto.get("totalamount"))) && (!"0".equals(dataDto.getAsString("totalamount"))) && (!"0".equals(dataDto.getAsString("tagprice"))) && (!"0.00".equals(dataDto.getAsString("totalamount"))) && (!"0.00".equals(dataDto.getAsString("tagprice")))) {
            money = (int)(Double.parseDouble(dataDto.getAsString("totalamount")) / Double.parseDouble(dataDto.getAsString("tagprice")) * 100.0D);
            c13.setCellValue(new HSSFRichTextString());
          }
          HSSFCell c14 = row.createCell(13);
          c14.setCellValue(new HSSFRichTextString(dataDto.getAsString("zjlbm")));
          HSSFCell c15 = row.createCell(14);
          c15.setCellValue(new HSSFRichTextString(dataDto.getAsString("goldweight")));
          HSSFCell c16 = row.createCell(15);
          c16.setCellValue(new HSSFRichTextString(dataDto.getAsString("goodsprocessingfee")));
          HSSFCell c17 = row.createCell(16);
          c17.setCellValue(new HSSFRichTextString(dataDto.getAsString("currentintegral")));
          HSSFCell c18 = row.createCell(17);
          c18.setCellValue(new HSSFRichTextString(dataDto.getAsString("zslbm")));
          HSSFCell c19 = row.createCell(18);
          c19.setCellValue(new HSSFRichTextString(dataDto.getAsString("zzlnn")));
          HSSFCell c20 = row.createCell(19);
          c20.setCellValue(new HSSFRichTextString(dataDto.getAsString("labor")));
          HSSFCell c21 = row.createCell(20);
          c21.setCellValue(new HSSFRichTextString(dataDto.getAsString("zslys")));
          HSSFCell c22 = row.createCell(21);
          c22.setCellValue(new HSSFRichTextString(dataDto.getAsString("salesclerk")));
        }
        HSSFRow totalrow = sheet.createRow(list.size() + 2);
        HSSFCell totalcell1 = totalrow.createCell(0);
        HSSFCell totalcell2 = totalrow.createCell(1);
        HSSFCell totalcell3 = totalrow.createCell(2);
        HSSFCell totalcell4 = totalrow.createCell(3);
        HSSFCell totalcell5 = totalrow.createCell(4);
        totalcell5.setCellValue(new HSSFRichTextString("总金额："));
        HSSFCell totalcell6 = totalrow.createCell(5);
        totalcell6.setCellValue(new HSSFRichTextString(df.format(totalmoney)));
        HSSFCell totalcell7 = totalrow.createCell(6);
        totalcell7.setCellValue(new HSSFRichTextString(df.format(totalprice)));

        String filename = "orderDetailInfo.xls";
        response.setContentType("application/vnd.ms-excel");
        response.setHeader("Content-disposition", "attachment;filename=" + filename);
        OutputStream ouputStream = response.getOutputStream();
        workbook.write(ouputStream);
        ouputStream.flush();
        ouputStream.close();
      }
      catch (Exception e) {
        e.printStackTrace();
      }

    }

    return mapping.findForward(null);
  }
  
  public ActionForward saveJoinnerReturnGoods(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm)form;
	    Dto returnMessag = new BaseDto();
	    String jsonString = "";
	    try {
	        Dto dto = aForm.getParamAsDto(request);
	        String storeId = super.getSessionContainer(request).getUserInfo().getCustomId();
	        String currentDate = G4Utils.getCurrentTime("yyyyMMdd");
	        //mysql订单表头数据
	        Dto orderHead = new BaseDto();
	        orderHead.put("storeid", storeId);
	        orderHead.put("insertdatetime", G4Utils.getCurrentTime("yyyy-MM-dd"));
	        orderHead.put("operatedatetime", G4Utils.getCurrentTime("yyyy-MM-dd HH:mm:ss"));
	        orderHead.put("ordertype", "ZRE3");
	        orderHead.put("saledate", G4Utils.getCurrentTime("yyyy-MM-dd"));
	        orderHead.put("customerid", storeId + "-01");
	        orderHead.put("vipcard", "NG0001");
	        orderHead.put("salesclerk", storeId);
	        
	        orderHead.put("salesorderid", (String)this.g4Dao.queryForObject("posordersystem.getsaleorderid", orderHead));
	        //接口订单表头数据
	        AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
	        AigTransferTable rfctablevbak = rfctransferinfo.getTable("IT_VBAK");
	        rfctablevbak.setValue("AUART", "ZRE3");
	        rfctablevbak.setValue("KUNNR", storeId);
	        rfctablevbak.setValue("KUNNR1", storeId);
	        rfctablevbak.setValue("WERKS", storeId);
	        rfctablevbak.setValue("AUDAT", currentDate);
	        rfctablevbak.appendRow();
	        rfctransferinfo.appendTable(rfctablevbak);
	        AigTransferTable rfctablevbap = rfctransferinfo.getTable("IT_VBAP");
	        JSONArray jsonArray = JSONArray.fromObject(dto.get("jsonArray").toString());
	        
	        List orderItem = new ArrayList();
	        
	        for (int i = 0; i < jsonArray.size(); i++) {
	        	//接口订单行项目数据
	        	JSONObject orderitem = (JSONObject) jsonArray.get(i);
	            rfctablevbap.setValue("POSNR", (i*10 + 10));
	            rfctablevbap.setValue("PSTYV", "ZREN");
	            rfctablevbap.setValue("WERKS", "1000");
	            rfctablevbap.setValue("LGORT", orderitem.get("lgort").toString().substring(orderitem.get("lgort").toString().indexOf("-") + 1));
	            rfctablevbap.setValue("CHARG", orderitem.get("charg"));
	            rfctablevbap.setValue("MATNR", orderitem.get("matnr"));
	            if ("G".equals(orderitem.get("meins"))) {
	            	rfctablevbap.setValue("KWMENG", orderitem.get("labst"));
	            } else {    
	            	rfctablevbap.setValue("KWMENG", "1");
	            }
	            rfctablevbap.appendRow();
	            
	            //mysql订单行项目数据
	            Dto orderItemDto = new BaseDto();
//	            orderItemDto.put("SALESORDERID", orderHead.get("salesorderid"));
	            orderItemDto.put("salesorderitem", (i*10 + 10));
	            orderItemDto.put("orderitemtype", "ZREN");
	            orderItemDto.put("storeid", "1000");
	            orderItemDto.put("materialnumber", orderitem.get("matnr") == null ? "" : orderitem.get("matnr"));
	            orderItemDto.put("batchnumber", orderitem.get("charg"));
	            orderItemDto.put("salesquantity", "1");
	            orderItemDto.put("storagelocation", orderitem.get("lgort").toString().substring(orderitem.get("lgort").toString().indexOf("-") + 1));
	            orderItemDto.put("tagprice", "null".equals(orderitem.get("kbetr").toString()) ? "" : orderitem.get("kbetr").toString());
	            orderItemDto.put("materialdesc", orderitem.get("maktx") == null ? "" : orderitem.get("maktx"));
	            orderItemDto.put("goldweight", orderitem.get("labst") == null ? "" : orderitem.get("labst"));
	            orderItem.add(orderItemDto);
	        }
	        rfctransferinfo.appendTable(rfctablevbap);
	        SapTransferImpl transfer = new SapTransferImpl();
	        AigTransferInfo out = transfer.transferInfoAig("Z_RFC_STORE_19", rfctransferinfo);
	        System.out.println("返回结构" + out.getAigStructure("U_RETURN"));
//	        System.out.println("凭证号:" + out.getParameters("U_VBELN"));
	        if ((out.getParameters("U_VBELN") != null) && (out.getParameters("U_VBELN") != "")) {
	            returnMessag.put("saporderid", out.getParameters("U_VBELN"));
	            orderHead.put("sapsalesorderid", out.getParameters("U_VBELN"));
	            orderHead.put("orderflag", "UO");
	            this.orderservice.saveOrder(orderHead, orderItem);
	        }
	        returnMessag.put("message", out.getAigStructure("U_RETURN").get("MESSAGE"));
	    }catch (Exception ex) {
          ex.printStackTrace();
          returnMessag.put("message", ex.toString());
      }
      jsonString = JsonHelper.encodeObject2Json(returnMessag);
      write(jsonString, response);
      return mapping.findForward(null);
  }
  
  
  public ActionForward print_order(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
	    CommonActionForm aForm = (CommonActionForm)form;
	    HttpSession session = request.getSession();
	    Dto dto = aForm.getParamAsDto(request);
	    String werks = "";
	    if (super.getSessionContainer(request).getUserInfo() != null) {
	      werks = super.getSessionContainer(request).getUserInfo().getCustomId();
	      dto.put("werks", werks);
	    } 
	    Dto orderSelect = (Dto)this.g4Dao.queryForObject("posordersystem.selectPrint", dto);
	    if(orderSelect==null){
	    	this.g4Dao.insert("posordersystem.createPrint", dto);
	    	
	    }else{
	    	this.g4Dao.update("posordersystem.updatePrint", orderSelect);
	    }
	    return mapping.findForward(null);
	  
  }
}