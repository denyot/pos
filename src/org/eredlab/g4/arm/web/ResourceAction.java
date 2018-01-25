package org.eredlab.g4.arm.web;

import java.util.List;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.action.ActionServlet;
import org.eredlab.g4.arm.service.ResourceService;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class ResourceAction extends BaseAction
{
  private ResourceService resourceService = (ResourceService)super.getService("resourceService");

  public ActionForward menuResourceInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    super.removeSessionAttribute(request, "menuid");
    Dto dto = (Dto)this.g4Reader.queryForObject("Resource.queryEamenuByMenuID", "01");
    request.setAttribute("rootMenuName", dto.getAsString("menuname"));
    return mapping.findForward("manageMenuResourceView");
  }

  public ActionForward queryMenuItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    Dto dto = new BaseDto();
    String nodeid = request.getParameter("node");
    dto.put("parentid", nodeid);
    List menuList = this.g4Reader.queryForList("Resource.queryMenuItemsByDto", dto);
    Dto menuDto = new BaseDto();
    for (int i = 0; i < menuList.size(); i++) {
      menuDto = (BaseDto)menuList.get(i);
      if (menuDto.getAsString("leaf").equals("1"))
        menuDto.put("leaf", new Boolean(true));
      else
        menuDto.put("leaf", new Boolean(false));
      if (menuDto.getAsString("id").length() == 4)
      {
        menuDto.put("expanded", new Boolean(true));
      }
    }
    write(JsonHelper.encodeObject2Json(menuList), response);
    return mapping.findForward(null);
  }

  public ActionForward queryMenuItemsForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String menuid = request.getParameter("menuid");
    if (G4Utils.isNotEmpty(menuid)) {
      super.setSessionAttribute(request, "menuid", menuid);
    }
    dto.put("menuid", super.getSessionAttribute(request, "menuid"));
    List menuList = this.g4Reader.queryForPage("Resource.queryMenuItemsForManage", dto);
    Integer pageCount = (Integer)this.g4Reader.queryForObject("Resource.queryMenuItemsForManageForPageCount", dto);
    String jsonString = JsonHelper.encodeList2PageJson(menuList, pageCount, null);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward saveMenuItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto inDto = aForm.getParamAsDto(request);
    this.resourceService.saveMenuItem(inDto);
    setOkTipMsg("菜单数据新增成功", response);
    return mapping.findForward(null);
  }

  public ActionForward updateMenuItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto inDto = aForm.getParamAsDto(request);
    this.resourceService.updateMenuItem(inDto);
    setOkTipMsg("菜单数据修改成功", response);
    return mapping.findForward(null);
  }

  public ActionForward deleteMenuItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    String strChecked = request.getParameter("strChecked");
    String type = request.getParameter("type");
    String menuid = request.getParameter("menuid");
    Dto inDto = new BaseDto();
    inDto.put("strChecked", strChecked);
    inDto.put("type", type);
    inDto.put("menuid", menuid);
    this.resourceService.deleteMenuItems(inDto);
    setOkTipMsg("菜单数据删除成功", response);
    return mapping.findForward(null);
  }

  public ActionForward codeTableInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    return mapping.findForward("codeTableView");
  }

  public ActionForward queryCodeItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto inDto = aForm.getParamAsDto(request);
    List codeList = this.g4Reader.queryForPage("Resource.getCodeListForPage", inDto);
    Integer totalCount = (Integer)this.g4Reader.queryForObject("Resource.getCodeListForPageCount", inDto);
    String jsonStrList = JsonHelper.encodeList2PageJson(codeList, totalCount, null);
    write(jsonStrList, response);
    return mapping.findForward(null);
  }

  public ActionForward saveCodeItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto inDto = aForm.getParamAsDto(request);
    Dto outDto = this.resourceService.saveCodeItem(inDto);
    String jsonString = JsonHelper.encodeObject2Json(outDto);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward deleteCodeItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    String strChecked = request.getParameter("strChecked");
    Dto inDto = new BaseDto();
    inDto.put("strChecked", strChecked);
    this.resourceService.deleteCodeItem(inDto);
    setOkTipMsg("字典数据删除成功", response);
    return mapping.findForward(null);
  }

  public ActionForward updateCodeItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto inDto = aForm.getParamAsDto(request);
    this.resourceService.updateCodeItem(inDto);
    setOkTipMsg("字典数据修改成功", response);
    return mapping.findForward(null);
  }

  public ActionForward synMemory(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    List codeList = this.g4Reader.queryForList("Resource.getCodeViewList");
    getServlet().getServletContext().removeAttribute("EACODELIST");
    getServlet().getServletContext().setAttribute("EACODELIST", codeList);
    setOkTipMsg("内存同步成功", response);
    return mapping.findForward(null);
  }

  public ActionForward iconInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    return mapping.findForward("manageIconView");
  }

  public ActionForward queryIconItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto inDto = aForm.getParamAsDto(request);
    List iconList = null;
    if (G4Utils.defaultJdbcTypeOracle())
      iconList = this.g4Reader.queryForPage("Resource.queryIconsForManage", inDto);
    else if (G4Utils.defaultJdbcTypeMysql()) {
      iconList = this.g4Reader.queryForPage("Resource.queryIconsForManageMysql", inDto);
    }
    Integer pageCount = (Integer)this.g4Reader.queryForObject("Resource.queryIconsForManageForPageCount", inDto);
    String jsonString = JsonHelper.encodeList2PageJson(iconList, pageCount, null);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward colorPaletteInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    return mapping.findForward("colorPaletteView");
  }
}