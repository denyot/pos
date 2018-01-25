package org.eredlab.g4.arm.web;

import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.service.OrganizationService;
import org.eredlab.g4.arm.service.PartService;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.util.SessionContainer;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class UserPartAction extends BaseAction
{
  private PartService partService = (PartService)getService("partService");

  private OrganizationService organizationService = (OrganizationService)getService("organizationService");

  public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    super.removeSessionAttribute(request, "deptid");
    Dto inDto = new BaseDto();
    String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
    inDto.put("deptid", deptid);
    Dto outDto = this.organizationService.queryDeptinfoByDeptid(inDto);
    request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
    request.setAttribute("rootDeptname", outDto.getAsString("deptname"));
    Dto dto = (Dto)this.g4Reader.queryForObject("Resource.queryEamenuByMenuID", "01");
    request.setAttribute("rootMenuName", dto.getAsString("menuname"));
    return mapping.findForward("initView");
  }

  public ActionForward departmentTreeInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    Dto dto = new BaseDto();
    String nodeid = request.getParameter("node");
    dto.put("parentid", nodeid);
    Dto outDto = this.organizationService.queryDeptItems(dto);
    write(outDto.getAsString("jsonString"), response);
    return mapping.findForward(null);
  }

  public ActionForward queryParts(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm cForm = (CommonActionForm)form;
    Dto dto = cForm.getParamAsDto(request);
    List list = this.g4Reader.queryForPage("Part.queryParts", dto);
    Integer countInteger = (Integer)this.g4Reader.queryForObject("Part.queryPartsForPageCount", dto);
    for (int i = 0; i < list.size(); i++) {
      Dto partDto = (BaseDto)list.get(i);
      dto.put("partid", partDto.getAsString("partid"));
      Dto outDto = (BaseDto)this.g4Reader.queryForObject("Part.queryPart4UserGrant", dto);
      if (G4Utils.isEmpty(outDto))
        partDto.put("partauthtype", "0");
      else {
        partDto.putAll(outDto);
      }
    }
    String jsonString = encodeList2PageJson(list, countInteger, null);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward savePartUserGrantDatas(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    List list = aForm.getGridDirtyData(request);
    Dto inDto = new BaseDto();
    inDto.setDefaultAList(list);
    this.partService.savePartUserGrantDatas(inDto);
    setOkTipMsg("授权数据保存成功", response);
    return mapping.findForward(null);
  }
}