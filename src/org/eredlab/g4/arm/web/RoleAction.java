package org.eredlab.g4.arm.web;

import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.service.OrganizationService;
import org.eredlab.g4.arm.service.RoleService;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.util.SessionContainer;
import org.eredlab.g4.rif.util.WebUtils;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class RoleAction extends BaseAction
{
  private RoleService roleService = (RoleService)super.getService("roleService");
  private OrganizationService organizationService = (OrganizationService)super.getService("organizationService");

  public ActionForward roleInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    super.removeSessionAttribute(request, "deptid");
    Dto inDto = new BaseDto();
    String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
    inDto.put("deptid", deptid);
    Dto outDto = this.organizationService.queryDeptinfoByDeptid(inDto);
    request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
    request.setAttribute("rootDeptname", outDto.getAsString("deptname"));
    UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
    request.setAttribute("login_account", userInfoVo.getAccount());
    return mapping.findForward("manageRoleView");
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

  public ActionForward queryRolesForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto dto = aForm.getParamAsDto(request);
    String deptid = request.getParameter("deptid");
    if (G4Utils.isNotEmpty(deptid)) {
      super.setSessionAttribute(request, "deptid", deptid);
    }
    if (!G4Utils.isEmpty(request.getParameter("firstload")))
      dto.put("deptid", super.getSessionContainer(request).getUserInfo().getDeptid());
    else {
      dto.put("deptid", super.getSessionAttribute(request, "deptid"));
    }
    dto.put("roletype", "2");
    UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
    if (WebUtils.getParamValue("DEFAULT_ADMIN_ACCOUNT", request).equals(userInfoVo.getAccount())) {
      dto.remove("roletype");
    }
    if (WebUtils.getParamValue("DEFAULT_DEVELOP_ACCOUNT", request).equals(userInfoVo.getAccount())) {
      dto.remove("roletype");
    }
    List roleList = this.g4Reader.queryForPage("Role.queryRolesForManage", dto);
    Integer pageCount = (Integer)this.g4Reader.queryForObject("Role.queryRolesForManageForPageCount", dto);
    String jsonString = JsonHelper.encodeList2PageJson(roleList, pageCount, null);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward saveRoleItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto inDto = aForm.getParamAsDto(request);
    this.roleService.saveRoleItem(inDto);
    setOkTipMsg("角色新增成功", response);
    return mapping.findForward(null);
  }

  public ActionForward deleteRoleItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    String strChecked = request.getParameter("strChecked");
    Dto inDto = new BaseDto();
    inDto.put("strChecked", strChecked);
    this.roleService.deleteRoleItems(inDto);
    setOkTipMsg("角色删除成功", response);
    return mapping.findForward(null);
  }

  public ActionForward updateRoleItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm aForm = (CommonActionForm)form;
    Dto inDto = aForm.getParamAsDto(request);
    this.roleService.updateRoleItem(inDto);
    setOkTipMsg("角色修改成功", response);
    return mapping.findForward(null);
  }

  public ActionForward operatorTabInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    super.removeSessionAttribute(request, "ROLEID_ROLEACTION");
    String roleid = request.getParameter("roleid");
    super.setSessionAttribute(request, "ROLEID_ROLEACTION", roleid);
    return mapping.findForward("operatorTabView");
  }

  public ActionForward selectUserTabInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    return mapping.findForward("selectUserTabView");
  }

  public ActionForward managerTabInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    return mapping.findForward("managerTabView");
  }

  public ActionForward saveGrant(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    Dto inDto = new BaseDto();
    inDto.put("menuid", request.getParameter("menuid"));
    inDto.put("authorizelevel", request.getParameter("key"));
    inDto.put("roleid", super.getSessionAttribute(request, "ROLEID_ROLEACTION"));
    this.roleService.saveGrant(inDto);
    String msg = "";
    if (inDto.getAsString("authorizelevel").equals("1"))
      msg = "经办权限授权成功";
    if (inDto.getAsString("authorizelevel").equals("2"))
      msg = "管理权限授权成功";
    setOkTipMsg(msg, response);
    return mapping.findForward(null);
  }

  public ActionForward saveUser(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    Dto inDto = new BaseDto();
    inDto.put("userid", request.getParameter("userid"));
    inDto.put("roleid", super.getSessionAttribute(request, "ROLEID_ROLEACTION"));
    this.roleService.saveSelectUser(inDto);
    setOkTipMsg("您选择的角色人员关联数据保存成功", response);
    return mapping.findForward(null);
  }
}