package org.eredlab.g4.arm.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.service.OrganizationService;
import org.eredlab.g4.arm.service.UserService;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.util.G4Constants;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.util.SessionContainer;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class IndexAction extends BaseAction
{
  private OrganizationService organizationService = (OrganizationService)SpringBeanLoader.getSpringBean("organizationService");

  public ActionForward indexInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    request.setAttribute("sysTitle", getParamValue("SYS_TITLE", request));
    request.setAttribute("westTitle", getParamValue("WEST_NAVIGATE_TITLE", request));
    return mapping.findForward("indexView");
  }

  public ActionForward preferencesInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    return mapping.findForward("welcomeView");
  }

  public ActionForward saveUserTheme(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    Dto dto = new BaseDto();
    String theme = request.getParameter("theme");
    dto.put("userid", super.getSessionContainer(request).getUserInfo().getUserid());
    dto.put("theme", theme);
    Dto outDto = this.organizationService.saveUserTheme(dto);
    String jsonString = JsonHelper.encodeObject2Json(outDto);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward loadUserInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
    Dto inDto = new BaseDto();
    G4Utils.copyPropFromBean2Dto(userInfoVo, inDto);
    Dto outDto = (BaseDto)this.g4Reader.queryForObject("User.getUserInfoByKey", inDto);
    outDto.remove("password");
    String jsonString = JsonHelper.encodeDto2FormLoadJson(outDto, null);
    write(jsonString, response);
    return mapping.findForward(null);
  }

  public ActionForward updateUserInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm cForm = (CommonActionForm)form;
    UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
    UserService service = (UserService)getService("userService");
    Dto indDto = cForm.getParamAsDto(request);
    Dto outDto = new BaseDto(G4Constants.TRUE);
    outDto.put("flag", "1");
    String password = G4Utils.encryptBasedDes(indDto.getAsString("password2"));
    if (password.equals(userInfoVo.getPassword())) {
      service.updateUserItem4IndexPage(indDto);
      outDto.put("flag", "1");
    } else {
      outDto.setSuccess(G4Constants.FALSE);
      outDto.put("flag", "0");
    }
    write(outDto.toJson(), response);
    return mapping.findForward(null);
  }

  public ActionForward unlockSystem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    CommonActionForm cForm = (CommonActionForm)form;
    UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
    Dto indDto = cForm.getParamAsDto(request);
    String password = G4Utils.encryptBasedDes(indDto.getAsString("password"));
    Dto outDto = new BaseDto(G4Constants.TRUE);
    if (password.equals(userInfoVo.getPassword()))
      outDto.put("flag", "1");
    else {
      outDto.put("flag", "0");
    }
    write(outDto.toJson(), response);
    return mapping.findForward(null);
  }
 
}