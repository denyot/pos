package cn.longhaul.ordersystem.web;

import cn.longhaul.ordersystem.service.OrderConfigerService;
import cn.longhaul.ordersystem.service.OrderService;
import cn.longhaul.sap.system.aig.AigRepository;
import cn.longhaul.sap.system.aig.AigTransferInfo;
import cn.longhaul.sap.system.aig.AigTransferParameter;
import cn.longhaul.sap.system.aig.AigTransferStructure;
import cn.longhaul.sap.system.aig.AigTransferTable;
import cn.longhaul.sap.system.esb.hesssion.HessianContext;
import cn.longhaul.sap.system.esb.hesssion.SapTransferImpl;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.bmf.base.IDaoImpl;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class OrderSystemAction extends BaseAction
{
  private IDaoImpl orderDao = (IDaoImpl)super.getService("g4DaoOrder");
  private OrderService orderservice = (OrderService)getService("orderService");
  private OrderConfigerService orderconfiger = (OrderConfigerService)super.getService("orderConfigerService");
  private static Log log = LogFactory.getLog(OrderSystemAction.class);

  public ActionForward orderSystemStart(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = dto.getAsString("WERKS");
    String userid = dto.getAsString("userid");
    String salesorderid = dto.getAsString("salesorderid");
    String opmode = dto.getAsString("opmode");
    String password = dto.getAsString("password");
    String ordertype = dto.getAsString("ordertype");
    String vkorg = (String)this.orderDao.queryForObject("ordersystem.getVkorg", dto);
    vkorg = (vkorg == null) || ("".equals(vkorg)) ? "1300" : vkorg;
    request.setAttribute("WERKS", werks);
    request.setAttribute("userid", userid);
    request.setAttribute("salesorderid", salesorderid);
    request.setAttribute("opmode", opmode);
    request.setAttribute("ordertype", ordertype);
    request.getSession().setAttribute("vkorg", vkorg);
    String posurl = dto.getAsString("posurl");
    posurl = (posurl == null) || (posurl.equals("")) ? "" : posurl.substring(posurl.indexOf("://") + 3, posurl.length());
    posurl = (posurl == null) || (posurl.equals("")) ? "" : posurl.substring(0, posurl.indexOf("/"));
    request.setAttribute("posurl", posurl);
    String sessionuser = (String)session.getAttribute("userid");
    Dto configerDto = (Dto)this.g4Reader.queryForObject("ordersystemaig.getuserconfiger", dto);
    if (configerDto != null) {
      request.setAttribute("autocompletesecond", configerDto.getAsString("autocompletesecond"));
      request.setAttribute("autocompletewords", configerDto.getAsString("autocompletewords"));
    }

    if (sessionuser != null) {
      return mapping.findForward("orderSystem");
    }
    String pospassword = (String)this.orderDao.queryForObject("ordersystem.getpospassword", dto);
    if ((pospassword != null) && (pospassword.equals(password))) {
      session.setAttribute("userid", dto.get("userid"));
      return mapping.findForward("orderSystem");
    }
    return mapping.findForward("authorization");
  }

  public ActionForward orderSystemSearch(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    HttpSession session = request.getSession();
    Dto dto = aForm.getParamAsDto(request);
    String werks = dto.getAsString("WERKS");
    String userid = dto.getAsString("userid");
    String salesorderid = dto.getAsString("salesorderid");
    String opmode = dto.getAsString("opmode");
    String password = dto.getAsString("password");
    request.setAttribute("WERKS", werks);
    request.setAttribute("userid", userid);
    request.setAttribute("salesorderid", salesorderid);
    request.setAttribute("opmode", opmode);
    String posurl = dto.getAsString("posurl");

    String sessionuser = (String)session.getAttribute("userid");
    Dto configerDto = (Dto)this.g4Reader.queryForObject("ordersystemaig.getuserconfiger", dto);
    if (configerDto != null) {
      request.setAttribute("autocompletesecond", configerDto.getAsString("autocompletesecond"));
      request.setAttribute("autocompletewords", configerDto.getAsString("autocompletewords"));
    }
    if (sessionuser != null) {
      return mapping.findForward("orderSearch");
    }
    String pospassword = (String)this.orderDao.queryForObject("ordersystem.getpospassword", dto);
    if ((pospassword != null) && (pospassword.equals(password))) {
      session.setAttribute("userid", dto.get("userid"));
      return mapping.findForward("orderSearch");
    }
    return mapping.findForward("authorization");
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
    Integer pageSize = dto.getAsInteger("pageSize");

    Integer pageCount = (Integer)this.orderDao.queryForObject("ordersystem.getorderheadbyuserForPageCount", dto);
    pageCount = Integer.valueOf(pageCount.intValue() % pageSize.intValue() == 0 ? pageCount.intValue() / pageSize.intValue() : pageCount.intValue() / pageSize.intValue() + 1);

    write(pageCount.toString(), response);
    return mapping.findForward(null);
  }

  public ActionForward orderSystem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
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

    List list = this.orderDao.queryForPage("ordersystem.getorderheadbyuser", dto);

    List ordertype = this.orderDao.queryForList("ordersystem.ordertypeall");
    Dto orderFlag = new BaseDto();
    orderFlag.put("NO", "新订单");
    orderFlag.put("PO", "订单打印");
    orderFlag.put("UO", "订单上传");
    orderFlag.put("SO", "订单过账");
    orderFlag.put("CO", "订单冲销");
    orderFlag.put("NS", "新结算单");
    orderFlag.put("US", "结算单上传");
    Dto ordertypeDto = new BaseDto();
    for (int j = 0; j < ordertype.size(); j++) {
      Dto mapdto = (Dto)ordertype.get(j);
      ordertypeDto.put(mapdto.get("pzdm"), mapdto.get("pzmc"));
    }
    for (int i = 0; i < list.size(); i++) {
      Dto dataDto = (Dto)list.get(i);
      dataDto.put("ordertypetext", ordertypeDto.get(dataDto.get("ordertype")));
      dataDto.put("orderflagtext", orderFlag.get(dataDto.get("orderflag")));
    }
    String jsonString = JsonHelper.encodeObject2Json(list, "yyyy-MM-dd");

    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getOrderType(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    List list = this.orderDao.queryForList("ordersystem.ordertype", dto);
    String jsonString = JsonHelper.encodeObject2Json(list);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getOrderReason(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    List list = this.orderDao.queryForList("ordersystem.orderreson", dto);
    String jsonString = JsonHelper.encodeObject2Json(list);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getVipRecord(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
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
    if (option.equals("user"))
      list = this.orderDao.queryForList("ordersystem.viprecordbyuser", dto);
    else {
      list = this.orderDao.queryForList("ordersystem.viprecord", dto);
    }
    String jsonString = JsonHelper.encodeObject2Json(list);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getVipRecordForNewUser(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    dto.put("rownum", Integer.valueOf(15));
    dto.put("kunnr", dto.get("kunnr"));
    dto.put("vipid", dto.get("vipid"));
    if (dto.get("vipid") != null) {
      dto.put("tel", dto.get("vipid"));
    }
    List list = new ArrayList();
    list = this.orderDao.queryForList("ordersystem.viprecordbyuserfornewuser", dto);
    String jsonString = JsonHelper.encodeObject2Json(list);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getpcxx(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String chargtype = dto.get("chargtype").toString();
    String vkorg = (String)request.getSession().getAttribute("vkorg");
    String compImage = "";
    if (("1300".equals(vkorg)) || ("9100".equals(vkorg)))
      compImage = "CHJ";
    else {
      compImage = "VENTI";
    }
    dto.put("charg", dto.get("charg"));
    List list = null;
    String userinput = (String)dto.get("userinput");
    String charg = (String)dto.get("charg");
    charg = charg == null ? "" : charg.trim();
    String option = dto.getAsString("option");
    if (option.equals("user")) {
      if (chargtype.equals("charg")) {
        list = this.orderDao.queryForList("ordersystem.getpcxxbyuser", dto);

        for (int i = 0; i < list.size(); i++) {
          Dto tempdto = (Dto)list.get(i);
          tempdto.put("charg", tempdto.get("cpbm"));
          tempdto.put("compImage", compImage);
          String orderid = (String)this.orderDao.queryForObject("ordersystem.getchargisusedorderid", tempdto);
          orderid = orderid == null ? "" : orderid;
          tempdto.put("usedorderid", orderid);
          String ordertype = dto.getAsString("ordertype");
          if ((ordertype.equals("ZRE1")) || (ordertype.equals("ZOR4"))) {
            tempdto.put("ordertype", "ZOR1");
            Double price = (Double)this.orderDao.queryForObject("ordersystem.getchargbaklastprice", tempdto);
            if (price != null)
              tempdto.put("sxj", price);
          }
        }
      }
      else if (chargtype.equals("gift")) {
        list = this.orderDao.queryForList("ordersystem.getgiftbyuser", dto);
        for (int i = 0; i < list.size(); i++) {
          Dto tempdto = (Dto)list.get(i);
          tempdto.put("matnr", tempdto.get("cpbm"));
          String ordertype = dto.getAsString("ordertype");
          if (ordertype.equals("ZRE2")) {
            tempdto.put("ordertype", "ZOR8");
            Double price = (Double)this.orderDao.queryForObject("ordersystem.getchargbaklastprice", tempdto);
            if (price != null) {
              tempdto.put("sxj", price);
            }
          }
        }
      }
    }
    else if ((userinput != null) && (userinput.equals("1"))) {
      if (chargtype.equals("charg"))
        list = this.orderDao.queryForList("ordersystem.getpcxxbyuser", dto);
      else if (chargtype.equals("gift")) {
        list = this.orderDao.queryForList("ordersystem.getgiftbyuser", dto);
      }
    }
    else if (chargtype.equals("charg"))
      list = this.orderDao.queryForList("ordersystem.getpcxx", dto);
    else if (chargtype.equals("gift")) {
      list = this.orderDao.queryForList("ordersystem.getgift", dto);
    }

    String jsonString = JsonHelper.encodeObject2Json(list);
    write(jsonString, response);
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
    Double price = (Double)this.orderDao.queryForObject("ordersystem.getchargbaklastprice", dto);
    price = Double.valueOf(price == null ? 0.0D : price.doubleValue());
    write(price.toString(), response);
    return mapping.findForward(null);
  }

  public ActionForward getsWerksSaleFlag(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String werkssaleflag = (String)this.orderDao.queryForObject("ordersystem.getswerkssaleflag", dto);
    werkssaleflag = werkssaleflag == null ? "" : werkssaleflag;
    write(werkssaleflag, response);
    return mapping.findForward(null);
  }

  public ActionForward getGiftJF(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    write(this.orderDao.queryForObject("ordersystem.getgiftjf", dto).toString(), response);
    return mapping.findForward(null);
  }

  public ActionForward getGoldPrices(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    List list = this.orderDao.queryForList("ordersystem.getgoldprices", dto);
    String jsonString = JsonHelper.encodeObject2Json(list);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getsaleman(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    List list = this.orderDao.queryForList("ordersystem.getsaleman", dto);
    String jsonString = JsonHelper.encodeObject2Json(list);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getChargIsusedOrder(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String orderid = (String)this.orderDao.queryForObject("ordersystem.getchargisusedorderid", dto);
    orderid = orderid == null ? "" : orderid;
    write(orderid, response);
    return mapping.findForward(null);
  }

  public ActionForward saveOrder(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
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

      List orderitemal = JsonHelper.parseJson2List(dto.get("orderitem").toString());
      String currentDate = G4Utils.getCurrentTime("yyyyMMdd");
      String ordertime = orderHead.getAsString("saledate").replace("-", "");
      String useroption = dto.getAsString("useroption");
      boolean updateSap = false;
      if ((orderHead.get("sapsalesorderid") == null) || (orderHead.get("sapsalesorderid").equals("")))
        updateSap = false;
      else {
        updateSap = true;
      }
      boolean updateAig = false;
      if ((orderHead.get("salesorderid") == null) || (orderHead.get("salesorderid").toString().trim().equals("")))
        updateAig = false;
      else {
        updateAig = true;
      }
      if (!updateSap) {
        String operatedatetime = G4Utils.getCurrentTime("yyyy-MM-dd HH:mm:ss");
        String operatdate = operatedatetime.substring(0, 10).replace("-", "");
        String operattime = operatedatetime.substring(10, operatedatetime.length()).replace("-", "");
        orderHead.put("operatedatetime", operatedatetime);
        orderHead.put("insertdatetime", G4Utils.getCurrentTime("yyyy-MM-dd"));

        String maxorderid = (String)this.orderDao.queryForObject("ordersystem.getmaxorder", orderHead);
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
        if (useroption.equals("print")) {
          if (updateAig) {
            this.orderservice.upadteOrder(orderHead, orderitemal);
            returnMessag.put("salesorderid", orderHead.get("salesorderid"));
          } else {
            orderHead.put("insertdatetime", operatedatetime);

            returnMessag.put("operatedatetime", operatedatetime);

            orderHead.put("salesorderid", salesorderid);
            this.orderservice.saveOrder(orderHead, orderitemal);
            returnMessag.put("salesorderid", salesorderid);
          }
          if (orderHead.get("regname") != null) {
            orderHead.put("joinDate", orderHead.get("saledate").toString().replace('-', '.'));
            int i = this.orderDao.update("ordersystem.updateHYXM", orderHead);
            if (i > 0)
              returnMessag.put("message2", "会员信息存入pos成功,未提交到SAP!");
          }
        }
        else {
          if (updateAig) {
            this.orderservice.upadteOrder(orderHead, orderitemal);
            returnMessag.put("salesorderid", orderHead.get("salesorderid"));
          }
          else {
            orderHead.put("insertdatetime", operatedatetime);

            returnMessag.put("operatedatetime", operatedatetime);

            orderHead.put("salesorderid", salesorderid);
            this.orderservice.saveOrder(orderHead, orderitemal);
            returnMessag.put("salesorderid", salesorderid);
          }
          AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();

          AigTransferParameter rfcimport = rfctransferinfo.getTransParameter();
          AigTransferStructure importstructure = rfcimport.getTransStructure("I_ZTSTORE2_12");
          importstructure.setValue("POSID", orderHead.get("salesorderid"));
          importstructure.setValue("ERDAT", operatdate);
          importstructure.setValue("ERZET", operattime);
          rfcimport.appendStructure(importstructure);

          rfctransferinfo.setImportPara(rfcimport);

          AigTransferTable rfctablevbak = rfctransferinfo.getTable("IT_VBAK");
          rfctablevbak.setValue("AUART", orderHead.get("ordertype"));
          rfctablevbak.setValue("AUDAT", ordertime);
          rfctablevbak.setValue("ERNAM", orderHead.get("operator"));
          rfctablevbak.setValue("KUNNR", orderHead.get("customerid"));
          rfctablevbak.setValue("T_0001", orderHead.get("remarks"));
          rfctablevbak.setValue("AUGRU", orderHead.get("orderreason"));
          rfctablevbak.setValue("WERKS", orderHead.get("storeid"));
          rfctablevbak.setValue("VSNMR_V", orderHead.get("cashcoupon"));
          rfctablevbak.appendRow();
          rfctransferinfo.appendTable(rfctablevbak);

          AigTransferTable rfctablevbap = rfctransferinfo.getTable("IT_VBAP");
          for (int i = 0; i < orderitemal.size(); i++) {
            Dto orderitem = (Dto)orderitemal.get(i);
            rfctablevbap.setValue("POSNR", orderitem.get("salesorderitem"));
            rfctablevbap.setValue("UEPOS", orderitem.get("upsalesorderitem"));
            rfctablevbap.setValue("PSTYV", orderitem.get("orderitemtype"));
            rfctablevbap.setValue("WERKS", orderitem.get("storeid"));
            rfctablevbap.setValue("MATNR", orderitem.get("materialnumber"));
            rfctablevbap.setValue("CHARG", orderitem.get("batchnumber"));
            rfctablevbap.setValue("ZMENG", orderitem.get("salesquantity"));
            rfctablevbap.setValue("LGORT", orderitem.get("storagelocation"));
            rfctablevbap.setValue("NETPR", orderitem.get("netprice"));
            rfctablevbap.setValue("ZHJZ", orderitem.get("goodsprocessingfee"));
            rfctablevbap.setValue("ZHJJ", orderitem.get("goldprice"));
            rfctablevbap.setValue("KDMAT", orderHead.get("salesclerk") + "/" + orderHead.get("storereceipt"));
            rfctablevbap.appendRow();
          }
          rfctransferinfo.appendTable(rfctablevbap);
          SapTransferImpl transfer = new SapTransferImpl();
          AigTransferInfo out = transfer.transferInfoAig("Z_RFC_STORE2_12", rfctransferinfo);

          if ((out.getParameters("U_VBELN") == null) || (out.getParameters("U_VBELN") == "")) {
            returnMessag.put("message", out.getAigStructure("U_RETURN").get("MESSAGE"));
            returnMessag.put("operatedatetime", operatedatetime);
          } else {
            returnMessag.put("message", out.getAigStructure("U_RETURN").get("MESSAGE"));
            returnMessag.put("sapsalesorderid", out.getParameters("U_VBELN"));
            orderHead.put("sapsalesorderid", out.getParameters("U_VBELN"));
            orderHead.put("orderflag", "UO");
            log.debug("更新时间:" + operatedatetime);
            operatedatetime = G4Utils.getCurrentTime("yyyy-MM-dd HH:mm:ss");
            returnMessag.put("operatedatetime", operatedatetime);
            orderHead.put("operatedatetime", operatedatetime);
            this.orderservice.updateOrderByvbeln(orderHead);

            if (orderHead.get("regname") != null) {
              try {
                orderHead.put("joinDate", orderHead.get("saledate").toString().replace('-', '.'));
                this.orderDao.update("ordersystem.updateNewEmp", orderHead);

                Map str44 = new HashMap();
                str44.put("ERDAT", G4Utils.getCurrentTime("yyyyMMdd"));
                str44.put("ERZET", G4Utils.getCurrentTime("HHmmss"));
                int next = new Random().nextInt(50000);
                str44.put("POSID", orderHead.get("customerid").toString() + next);
                str44.put("KUNNR", orderHead.get("customerid"));

                Map strxx = new HashMap();
                strxx.put("KUNNR", orderHead.get("customerid"));
                strxx.put("STCD1", ordertime);
                strxx.put("NAME1", orderHead.get("regname"));

                AigTransferInfo rfctransferinfo1 = AigRepository.getTransferInfo();
                AigTransferStructure structure44 = rfctransferinfo1.getImportPara().getTransStructure("I_ZTSTORE2_44");
                AigTransferStructure structurexx = rfctransferinfo1.getImportPara().getTransStructure("I_HYXX");
                structure44.getStructureMap().putAll(str44);
                structurexx.getStructureMap().putAll(strxx);

                rfctransferinfo1.getImportPara().appendStructure(structure44);
                rfctransferinfo1.getImportPara().appendStructure(structurexx);
                SapTransferImpl transfer1 = new SapTransferImpl();
                HessianContext.setRequest(request);
                AigTransferInfo outinfo = transfer1.transferInfoAig("Z_RFC_STORE2_44", rfctransferinfo1);

                if ("S".equals(outinfo.getAigStructure("U_RETURN").get("TYPE")))
                  returnMessag.put("message2", outinfo.getAigStructure("U_RETURN").get("MESSAGE"));
                else
                  returnMessag.put("message2", outinfo.getAigStructure("U_RETURN").get("MESSAGE"));
              }
              catch (Exception e) {
                log.error(e.getMessage());
                e.printStackTrace();
              }
            }

          }

        }

      }
      else
      {
        String operatedatetime = G4Utils.getCurrentTime("yyyy-MM-dd HH:mm:ss");
        String operatdate = operatedatetime.substring(0, 10).replace("-", "");
        String operattime = operatedatetime.substring(10, operatedatetime.length()).replace("-", "");
        returnMessag.put("salesorderid", orderHead.get("salesorderid"));
        AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();

        AigTransferParameter rfcimport = rfctransferinfo.getTransParameter();
        AigTransferStructure importstructure = rfcimport.getTransStructure("I_ZTSTORE2_13");
        importstructure.setValue("POSID", orderHead.get("salesorderid"));
        operatedatetime = orderHead.getAsString("operatedatetime");
        importstructure.setValue("ERDAT", operatdate);
        importstructure.setValue("ERZET", operattime.trim());
        importstructure.setValue("VBELN", orderHead.get("sapsalesorderid"));

        rfcimport.appendStructure(importstructure);

        rfctransferinfo.setImportPara(rfcimport);

        AigTransferTable rfctablevbak = rfctransferinfo.getTable("IT_VBAK");
        rfctablevbak.setValue("AUART", orderHead.get("ordertype"));
        rfctablevbak.setValue("AUDAT", ordertime);
        rfctablevbak.setValue("ERNAM", orderHead.get("operator"));
        rfctablevbak.setValue("KUNNR", orderHead.get("customerid"));
        rfctablevbak.setValue("T_0001", orderHead.get("remarks"));
        rfctablevbak.setValue("VSNMR_V", orderHead.get("cashcoupon"));
        rfctablevbak.setValue("AUGRU", orderHead.get("orderreason"));
        rfctablevbak.setValue("WERKS", orderHead.get("storeid"));

        rfctablevbak.appendRow();
        rfctransferinfo.appendTable(rfctablevbak);

        AigTransferTable rfctablevbap = rfctransferinfo.getTable("IT_VBAP");
        String delrecords = orderHead.getAsString("delrecords");
        Dto delorderitem = new BaseDto();
        delorderitem.put("salesorderid", orderHead.get("salesorderid"));
        String[] delsalesorderitem = delrecords.split(";");
        List delist = new ArrayList();
        for (int i = 0; i < delsalesorderitem.length; i++) {
          Dto delOrderitem = new BaseDto();
          delOrderitem.put("salesorderitem", delsalesorderitem[i]);
          delist.add(delsalesorderitem[i]);
        }
        delorderitem.put("delist", delist);

        List listoldorderitem = this.orderDao.queryForList("ordersystem.getorderitem", orderHead);
        for (int i = 0; i < listoldorderitem.size(); i++) {
          Dto orderdelitem = (Dto)listoldorderitem.get(i);
          String oldsalesorderitem = orderdelitem.getAsString("salesorderitem");
          String oldupsalesorderitem = orderdelitem.getAsString("upsalesorderitem");
          String flag = "D";
          for (int j = 0; j < orderitemal.size(); j++) {
            Dto orderitem = (Dto)orderitemal.get(j);
            String salesorderitem = orderitem.get("salesorderitem").toString();
            String upsalesorderitem = orderitem.get("upsalesorderitem").toString();
            if ((salesorderitem.equals(oldsalesorderitem)) && (upsalesorderitem.equals(oldupsalesorderitem))) {
              flag = "U";
            }
          }
          if (flag.equals("D")) {
            rfctablevbap.setValue("POSNR", orderdelitem.get("salesorderitem"));
            rfctablevbap.setValue("UEPOS", orderdelitem.get("upsalesorderitem"));
            rfctablevbap.setValue("PSTYV", orderdelitem.get("orderitemtype"));
            rfctablevbap.setValue("WERKS", orderdelitem.get("storeid"));
            rfctablevbap.setValue("MATNR", orderdelitem.get("materialnumber"));
            rfctablevbap.setValue("CHARG", orderdelitem.get("batchnumber"));
            rfctablevbap.setValue("ZMENG", orderdelitem.get("salesquantity"));
            rfctablevbap.setValue("LGORT", orderdelitem.get("storagelocation"));
            rfctablevbap.setValue("NETPR", orderdelitem.get("netprice"));
            rfctablevbap.setValue("ZHJZ", orderdelitem.get("goodsprocessingfee"));
            rfctablevbap.setValue("ZHJJ", orderdelitem.get("goldprice"));
            rfctablevbap.setValue("UPDATE", "D");
            rfctablevbap.appendRow();
          }
        }
        for (int i = 0; i < orderitemal.size(); i++) {
          Dto orderitem = (Dto)orderitemal.get(i);
          rfctablevbap.setValue("POSNR", orderitem.get("salesorderitem"));
          rfctablevbap.setValue("UEPOS", orderitem.get("upsalesorderitem"));
          rfctablevbap.setValue("PSTYV", orderitem.get("orderitemtype"));
          rfctablevbap.setValue("WERKS", orderitem.get("storeid"));
          rfctablevbap.setValue("MATNR", orderitem.get("materialnumber"));
          rfctablevbap.setValue("CHARG", orderitem.get("batchnumber"));
          rfctablevbap.setValue("ZMENG", orderitem.get("salesquantity"));
          rfctablevbap.setValue("LGORT", orderitem.get("storagelocation"));
          rfctablevbap.setValue("NETPR", orderitem.get("netprice"));
          rfctablevbap.setValue("ZHJZ", orderitem.get("goodsprocessingfee"));
          rfctablevbap.setValue("ZHJJ", orderitem.get("goldprice"));
          rfctablevbap.setValue("KDMAT", orderHead.get("salesclerk") + "/" + orderHead.get("storereceipt"));
          String salesorderitem = orderitem.get("salesorderitem").toString();
          String upsalesorderitem = orderitem.get("upsalesorderitem").toString();
          String flag = "";
          for (int j = 0; j < listoldorderitem.size(); j++) {
            Dto oldlitem = (Dto)listoldorderitem.get(j);
            String oldsalesorderitem = oldlitem.getAsString("salesorderitem");
            String oldupsalesorderitem = oldlitem.getAsString("upsalesorderitem");
            if ((salesorderitem.equals(oldsalesorderitem)) && (upsalesorderitem.equals(oldupsalesorderitem))) {
              flag = "U";
              break;
            }
          }
          if (flag.equals("U"))
            rfctablevbap.setValue("UPDATE", "U");
          else {
            rfctablevbap.setValue("UPDATE", "I");
          }

          rfctablevbap.appendRow();
        }

        if (useroption.equals("print")) {
          this.orderservice.updateOrderForSap(orderHead, orderitemal);

          if (orderHead.get("regname") != null) {
            orderHead.put("joinDate", orderHead.get("saledate").toString().replace('-', '.'));
            int i = this.orderDao.update("ordersystem.updateHYXM", orderHead);
            if (i > 0)
              returnMessag.put("message2", "会员信息存入pos成功,未提交到SAP!");
          }
        }
        else
        {
          rfctransferinfo.appendTable(rfctablevbap);
          SapTransferImpl transfer = new SapTransferImpl();
          AigTransferInfo out = transfer.transferInfoAig("Z_RFC_STORE2_13", rfctransferinfo);
          log.debug("返回结构" + out.getAigStructure("U_RETURN"));

          String updateflag = out.getAigStructure("U_RETURN").get("TYPE").toString();
          if ("S".equals(updateflag)) {
            returnMessag.put("message", out.getAigStructure("U_RETURN").get("MESSAGE"));
            returnMessag.put("sapsalesorderid", orderHead.get("sapsalesorderid"));
            orderHead.put("sapsalesorderid", orderHead.get("sapsalesorderid"));
            orderHead.put("orderflag", "UO");
            operatedatetime = G4Utils.getCurrentTime("yyyy-MM-dd HH:mm:ss");
            returnMessag.put("operatedatetime", operatedatetime);
            orderHead.put("operatedatetime", operatedatetime);
            this.orderservice.updateOrderForSap(orderHead, orderitemal);

            if (orderHead.get("regname") != null) {
              try {
                orderHead.put("joinDate", orderHead.get("saledate").toString().replace('-', '.'));
                this.orderDao.update("ordersystem.updateNewEmp", orderHead);

                Map str44 = new HashMap();
                str44.put("ERDAT", G4Utils.getCurrentTime("yyyyMMdd"));
                str44.put("ERZET", G4Utils.getCurrentTime("HHmmss"));
                int next = new Random().nextInt(50000);
                str44.put("POSID", orderHead.get("customerid").toString() + next);
                str44.put("KUNNR", orderHead.get("customerid"));

                Map strxx = new HashMap();
                strxx.put("KUNNR", orderHead.get("customerid"));
                strxx.put("STCD1", ordertime);
                strxx.put("NAME1", orderHead.get("regname"));

                AigTransferInfo rfctransferinfo1 = AigRepository.getTransferInfo();
                AigTransferStructure structure44 = rfctransferinfo1.getImportPara().getTransStructure("I_ZTSTORE2_44");
                AigTransferStructure structurexx = rfctransferinfo1.getImportPara().getTransStructure("I_HYXX");
                structure44.getStructureMap().putAll(str44);
                structurexx.getStructureMap().putAll(strxx);

                rfctransferinfo1.getImportPara().appendStructure(structure44);
                rfctransferinfo1.getImportPara().appendStructure(structurexx);
                SapTransferImpl transfer1 = new SapTransferImpl();
                HessianContext.setRequest(request);
                AigTransferInfo outinfo = transfer1.transferInfoAig("Z_RFC_STORE2_44", rfctransferinfo1);

                if ("S".equals(outinfo.getAigStructure("U_RETURN").get("TYPE")))
                  returnMessag.put("message2", outinfo.getAigStructure("U_RETURN").get("MESSAGE"));
                else
                  returnMessag.put("message2", outinfo.getAigStructure("U_RETURN").get("MESSAGE"));
              }
              catch (Exception e) {
                log.error(e.getMessage());
                e.printStackTrace();
              }
            }
          }
          else
          {
            returnMessag.put("message", out.getAigStructure("U_RETURN").get("MESSAGE"));
          }
        }
      }
    }
    catch (Exception ex) {
      ex.printStackTrace();
      returnMessag.put("error", ex.toString());
    }
    jsonString = JsonHelper.encodeObject2Json(returnMessag);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward printOrder(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
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
      if (updateAig) {
        this.orderservice.upadteOrder(orderHead, orderitemal);
        returnMessag.put("salesorderid", orderHead.get("salesorderid"));
      } else {
        orderHead.put("insertdatetime", G4Utils.getCurrentTime("yyyy-MM-dd"));

        String maxorderid = (String)this.orderDao.queryForObject("ordersystem.getmaxorder", orderHead);
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
        log.debug("插入时间:" + operatedatetime);
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
    List list = this.orderDao.queryForList("ordersystem.getorderitem", dto);
    String jsonString = JsonHelper.encodeObject2Json(list);
    log.debug(jsonString);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward getOrderhead(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    List list = this.orderDao.queryForList("ordersystem.getorderhead", dto);
    String jsonString = JsonHelper.encodeObject2Json(list, "yyyy-MM-dd");
    log.debug(jsonString);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward del(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    HessianContext.setRequest(request);
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);

    String msg = (String)dto.get("orderhead");
    List orderIds = new ArrayList();

    List listIds = JsonHelper.parseJson2List('{' + msg + '}');
    for (int i = 0; i < listIds.size(); i++) {
      orderIds.add((String)((BaseDto)listIds.get(i)).get("salesorderid"));
    }

    dto.put("orderIds", orderIds);

    List list = this.orderDao.queryForList("ordersystem.getorderheads", dto);

    List returnList = new ArrayList();
    for (int i = 0; i < list.size(); i++) {
      Dto returnMessag = new BaseDto();
      String message = "";
      Dto delorder = (Dto)list.get(i);
      String operatedatetime = delorder.getAsString("operatedatetime");
      String deliveryordernumber = delorder.getAsString("deliveryordernumber");

      if ((deliveryordernumber != null) || (deliveryordernumber == "")) {
        String saporderid = delorder.get("sapsalesorderid") != null ? delorder.get("sapsalesorderid").toString() : "";
        if (!saporderid.equals(""))
        {
          String operatdate = operatedatetime.substring(0, 10).replace("-", "");
          String operattime = operatedatetime.substring(10, operatedatetime.length()).replace("-", "");
          AigTransferInfo rfctransferinfo = AigRepository.getTransferInfo();
          AigTransferParameter rfcimport = rfctransferinfo.getTransParameter();
          AigTransferStructure importstructure = rfcimport.getTransStructure("I_ZTSTORE2_14");
          importstructure.setValue("POSID", delorder.get("salesorderid"));

          importstructure.setValue("ERDAT", operatdate);
          importstructure.setValue("ERZET", operattime.trim());
          importstructure.setValue("FLAG", "D");
          rfcimport.appendStructure(importstructure);
          rfcimport.setParameter("I_VBELN", delorder.get("sapsalesorderid").toString());
          rfctransferinfo.setImportPara(rfcimport);
          SapTransferImpl transfer = new SapTransferImpl();
          AigTransferInfo out = transfer.transferInfoAig("Z_RFC_STORE2_14", rfctransferinfo);
          String updateflag = out.getAigStructure("U_RETURN").get("TYPE").toString();
          if (updateflag.equals("S"))
          {
            this.orderservice.delOrder(delorder);
            returnMessag.put("operatedatetime", operatedatetime);
            message = message + "POS凭证:" + delorder.getAsString("salesorderid") + "删除成功  " + out.getAigStructure("U_RETURN").get("MESSAGE");
          } else {
            message = message + "<font color='red'>POS凭证:" + delorder.getAsString("salesorderid") + "删除失败  " + out.getAigStructure("U_RETURN").get("MESSAGE") + "</font>";
          }
          returnMessag.put("message", message);
        }
        else {
          this.orderservice.delOrder(delorder);
          message = message + "POS凭证:" + delorder.getAsString("salesorderid") + "删除成功";
          returnMessag.put("message", message);
        }
      } else {
        returnMessag.put("message", delorder.get("salesorderid") + "已过帐,不能删除,请冲销后删除!");
      }
      returnList.add(returnMessag);
    }
    String jsonString = JsonHelper.encodeObject2Json(returnList);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward posting(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
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
      String operattime = operatedatetime.substring(10, operatedatetime.length()).replace("-", "").trim();
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
          log.debug("返回:" + returnmap);
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

  public ActionForward writeoff(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
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
          log.debug("返回:" + returnmap);
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

    log.info("开始从pos端取得一个可使用的会员编号");

    String hybh = (String)this.orderDao.queryForObject("ordersystem.getHYBH", dto);

    log.info("成功取到一个会员编号" + hybh);

    write(hybh, response);
    return mapping.findForward(null);
  }
}