package cn.longhaul.sap.web;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import cn.longhaul.sap.service.SapRfcDefineService;

public class SapRfcDefineAction extends BaseAction
{
  private SapRfcDefineService sapRfcDefineService = (SapRfcDefineService)super
    .getService("sapRfcDefineService");

  public ActionForward rfcDefineInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    return mapping.findForward("manageRfcDefineView");
  }

  public ActionForward rfcTreeInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    Dto dto = new BaseDto();
    String nodeid = request.getParameter("node");
    dto.put("parent_id", nodeid);
    Dto outDto = this.sapRfcDefineService.queryRfcItems(dto);
    write(outDto.getAsString("jsonString"), response);
    return mapping.findForward(null);
  }

  public ActionForward queryRfcItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto inDto = aForm.getParamAsDto(request);
    inDto.put("leaf", "1");
    List rfcList = this.g4Reader.queryForPage("SapRfcDefine.getRfcListForPage", 
      inDto);
    Integer totalCount = (Integer)this.g4Reader.queryForObject(
      "SapRfcDefine.getRfcListForPageCount", inDto);
    String jsonStrList = JsonHelper.encodeList2PageJson(rfcList, 
      totalCount, "yyyy-MM-dd");
    write(jsonStrList, response);
    return mapping.findForward(null);
  }

  public ActionForward syncRfcItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto inDto = aForm.getParamAsDto(request);
    Dto outDto = this.sapRfcDefineService.syncRfcItems(inDto);
    String jsonString = JsonHelper.encodeObject2Json(outDto);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward saveRfcItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto inDto = aForm.getParamAsDto(request);
    Dto outDto = this.sapRfcDefineService.saveRfcItem(inDto);

    String jsonString = JsonHelper.encodeObject2Json(outDto);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward saveRfcItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    String rfctable = request.getParameter("rfctable");

    List items = aForm.getGridDirtyData(request);
    Dto inDto = new BaseDto("rfctable", rfctable);
    inDto.put("rfcname", request.getParameter("rfcname"));

    Dto outDto = new BaseDto();
    if (rfctable.equals("sap_rfctables")) {
      List itemE = aForm.getGridDirtyData(request, "changedata");
      outDto = this.sapRfcDefineService.saveRfcItems(inDto, items, itemE);
    } else {
      outDto = this.sapRfcDefineService.saveRfcItems(inDto, items);
    }

    String jsonString = JsonHelper.encodeObject2Json(outDto);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward deleteRfcItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    String strChecked = request.getParameter("strChecked");
    Dto inDto = new BaseDto();
    inDto.put("strChecked", strChecked);
    this.sapRfcDefineService.deleteRfcItem(inDto);
    setOkTipMsg("RFC数据数据删除成功", response);
    return mapping.findForward(null);
  }

  public ActionForward updateRfcItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto inDto = aForm.getParamAsDto(request);
    this.sapRfcDefineService.updateRfcItem(inDto);
    setOkTipMsg("RFC数据数据修改成功", response);
    return mapping.findForward(null);
  }

  public ActionForward queryRfcsForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String rfc_id = request.getParameter("rfc_id");
    String rfctable = request.getParameter("rfctable");
    if (G4Utils.isEmpty(rfctable)) {
      rfctable = "sap_rfcclass";
    }

    dto.put("rfctable", rfctable);
    if (G4Utils.isNotEmpty(rfc_id)) {
      dto.put("rfc_id", rfc_id);
    }

    if (rfctable.equals("sap_rfcclass")) {
      dto.put("leaf", "1");
      List menuList = this.g4Reader.queryForPage(
        "SapRfcDefine.queryRfcsForManage", dto);
      Integer pageCount = (Integer)this.g4Reader.queryForObject(
        "SapRfcDefine.queryRfcsForManageForPageCount", dto);
      String jsonString = encodeList2PageJson(menuList, pageCount, 
        "yyyy-MM-dd");
      write(jsonString, response);
    }
    else if (rfctable.equals("sap_rfcexceptions")) {
      List menuList = this.g4Reader.queryForPage(
        "SapRfcDefine.queryRfcsForMapE", dto);
      Integer pageCount = (Integer)this.g4Reader.queryForObject(
        "SapRfcDefine.queryRfcsForManageForPageCount", dto);
      String jsonString = encodeList2PageJson(menuList, pageCount, 
        "yyyy-MM-dd");
      write(jsonString, response);
    }
    else if (rfctable.equals("sap_rfctables")) {
      List menuList = this.g4Reader.queryForPage(
        "SapRfcDefine.queryRfcsForMapT", dto);
      Integer pageCount = (Integer)this.g4Reader.queryForObject(
        "SapRfcDefine.queryRfcsForManageForPageCount", dto);
      String jsonString = encodeList2PageJson(menuList, 
        pageCount, "yyyy-MM-dd");
      write(jsonString, response);
    } else {
      List menuList = this.g4Reader.queryForPage(
        "SapRfcDefine.queryRfcsForMap", dto);
      Integer pageCount = (Integer)this.g4Reader.queryForObject(
        "SapRfcDefine.queryRfcsForManageForPageCount", dto);
      String jsonString = encodeList2PageJson(menuList, 
        pageCount, "yyyy-MM-dd");
      write(jsonString, response);
    }

    return mapping.findForward(null);
  }

  public ActionForward paraTreeInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    Dto dto = new BaseDto();
    String nodeid = request.getParameter("node");
    String rfctable = request.getParameter("rfctable");
    String rfc_id = request.getParameter("rfc_id");
    dto.put("rfctable", rfctable);
    dto.put("parent_id", nodeid);
    dto.put("rfc_id", rfc_id);

    List rfcParaList = this.g4Reader.queryForList(
      "SapRfcDefine.queryRfcParaByDto4TreeGrid", dto);
    Dto rfcParaDto = new BaseDto();
    for (int i = 0; i < rfcParaList.size(); i++) {
      rfcParaDto = (BaseDto)rfcParaList.get(i);
      if (rfcParaDto.getAsString("leaf").equals("1"))
        rfcParaDto.put("leaf", new Boolean(true));
      else
        rfcParaDto.put("leaf", new Boolean(false));
    }
    String jsonString = JsonHelper.encodeObject2Json(rfcParaList, 
      "yyyy-MM-dd");
    super.write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward paraTreeInit2(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    Dto dto = new BaseDto();
    String nodeid = request.getParameter("node");
    dto.put("parentid", nodeid);
    List deptList = this.g4Reader.queryForList(
      "Demo.queryDeptItemsByDto4TreeGridDemo", dto);
    Dto deptDto = new BaseDto();
    for (int i = 0; i < deptList.size(); i++) {
      deptDto = (BaseDto)deptList.get(i);
      if (deptDto.getAsString("leaf").equals("1"))
        deptDto.put("leaf", new Boolean(true));
      else
        deptDto.put("leaf", new Boolean(false));
      if (deptDto.getAsString("id").length() == 6)
        deptDto.put("expanded", new Boolean(true));
    }
    String jsonString = JsonHelper.encodeObject2Json(deptList);
    super.write(jsonString, response);
    return mapping.findForward(null);
  }
}