package org.eredlab.g4.arm.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.service.MonitorService;
import org.eredlab.g4.arm.service.OrganizationService;
import org.eredlab.g4.arm.util.idgenerator.IDHelper;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.properties.PropertiesHelper;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.util.SessionContainer;
import org.eredlab.g4.rif.util.SessionListener;
import org.eredlab.g4.rif.util.WebUtils;
import org.eredlab.g4.rif.web.BaseAction;

public class LoginAction extends BaseAction
{
  private static Log log = LogFactory.getLog(LoginAction.class);

  private OrganizationService organizationService = (OrganizationService)super.getService("organizationService");

  private MonitorService monitorService = (MonitorService)super.getService("monitorService");

  public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    String bannerPath = getParamValue("LOGIN_WINDOW_BANNER", request);
    bannerPath = request.getContextPath() + bannerPath;
    request.setAttribute("bannerPath", bannerPath);
    request.setAttribute("sysTitle", getParamValue("SYS_TITLE", request));
    return mapping.findForward("loginView");
  }

  public ActionForward login(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    String account = request.getParameter("account");
    String password = request.getParameter("password");
    password = G4Utils.encryptBasedDes(password);
    log.info("帐户[" + account + "]正尝试登陆系统...");
    Dto dto = new BaseDto();
    dto.put("account", account);
    Dto outDto = this.organizationService.getUserInfo(dto);
    UserInfoVo userInfo = (UserInfoVo)outDto.get("userInfo");
    Dto jsonDto = new BaseDto();
    if (G4Utils.isEmpty(userInfo)) {
      jsonDto.put("success", new Boolean(false));
      jsonDto.put("msg", "帐号输入错误,请重新输入!");
      jsonDto.put("errorType", "1");
      log.warn("帐户[" + account + "]登陆失败.(失败原因：不存在此帐户)");
      write(jsonDto.toJson(), response);
      return mapping.findForward("");
    }
    if (!password.equals(userInfo.getPassword())) {
      jsonDto.put("success", new Boolean(false));
      jsonDto.put("msg", "密码输入错误,请重新输入!");
      jsonDto.put("errorType", "2");
      log.warn(userInfo.getUsername() + "[" + userInfo.getAccount() + "]" + "登录系统失败(失败原因：密码输入错误)");
      write(jsonDto.toJson(), response);
      return mapping.findForward("");
    }
    String multiSession = WebUtils.getParamValue("MULTI_SESSION", request);
    if ("0".equals(multiSession)) {
      Integer sessions = (Integer)this.g4Reader.queryForObject("Organization.countHttpSessions", account);
      if (sessions.intValue() > 0) {
        jsonDto.put("success", new Boolean(false));
        jsonDto.put("msg", "此用户已经登录,系统不允许建立多个会话连接!");
        jsonDto.put("errorType", "3");
        log.warn(userInfo.getUsername() + "[" + userInfo.getAccount() + "]" + 
          "登录系统失败(失败原因：此用户已经登录,系统参数配置为不允许一个用户建立多个连接)");
        write(jsonDto.toJson(), response);
        return mapping.findForward("");
      }
    }
    userInfo.setSessionID(request.getSession().getId());
    userInfo.setSessionCreatedTime(G4Utils.getCurrentTime());
    userInfo.setLoginIP(request.getRemoteAddr());
    userInfo.setExplorer(G4Utils.getClientExplorerType(request));
    if (!checkMultiUser(userInfo, request).booleanValue()) {
      jsonDto.put("success", new Boolean(false));
      jsonDto.put("msg", "不允许在同一客户端上同时以不同帐户登录系统,请先退出你已经登录的帐户后再尝试登录!");
      jsonDto.put("errorType", "1");
      log.warn("帐户[" + account + "]登陆失败.(失败原因：不允许在同一客户端上同时以不同帐户登录系统.请先退出你已经登录的帐户后再尝试登录)");
      write(jsonDto.toJson(), response);
      return mapping.findForward("");
    }
    super.getSessionContainer(request).setUserInfo(userInfo);
    log.info(userInfo.getUsername() + "[" + userInfo.getAccount() + "]" + "成功登录系统!创建了一个有效Session连接,会话ID:[" + 
      request.getSession().getId() + "]" + G4Utils.getCurrentTime());
    SessionListener.addSession(request.getSession(), userInfo);
    request.getSession().setAttribute("sessionWerk", userInfo.getCustomId());
    if (pHelper.getValue("requestMonitor", "0").equals("1")) {
      saveLoginEvent(userInfo, request);
    }
    jsonDto.put("success", new Boolean(true));
    jsonDto.put("userid", userInfo.getUserid());
    write(jsonDto.toJson(), response);
    return mapping.findForward("");
  }

  private void writeCookie2Client(UserInfoVo userInfoVo, HttpServletRequest request)
  {
  }

  private Boolean checkMultiUser(UserInfoVo userInfoVo, HttpServletRequest request)
  {
    boolean allowLogin = true;
    String cookieUserid = WebUtils.getCookieValue(request.getCookies(), "eredg4.login.userid", "");
    String sessionid = request.getSession().getId();
    HttpSession httpSession = SessionListener.getSessionByID(sessionid);
    if (G4Utils.isNotEmpty(httpSession))
    {
      if (!cookieUserid.equals(userInfoVo.getUserid())) {
        allowLogin = false;
      }
    }
    return new Boolean(allowLogin);
  }

  public ActionForward logout(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
    throws Exception
  {
    UserInfoVo userInfo = super.getSessionContainer(request).getUserInfo();
    if (G4Utils.isNotEmpty(userInfo)) {
      if (pHelper.getValue("requestMonitor", "0").equals("1")) {
        saveLogoutEvent(userInfo, request);
      }
      log.info(userInfo.getUsername() + "退出了系统!");
      super.getSessionContainer(request).setUserInfo(null);
    }
    if (G4Utils.isNotEmpty(request.getSession())) {
      request.getSession().invalidate();
    }
    init(mapping, form, request, response);
    return mapping.findForward("loginView");
  }

  private void saveLoginEvent(UserInfoVo userInfo, HttpServletRequest request)
  {
    Dto dto = new BaseDto();
    dto.put("account", userInfo.getAccount());
    dto.put("activetime", G4Utils.getCurrentTime());
    dto.put("userid", userInfo.getUserid());
    dto.put("username", userInfo.getUsername());
    dto.put("description", "登录系统");
    dto.put("requestpath", request.getRequestURI());
    dto.put("methodname", request.getParameter("reqCode"));
    dto.put("eventid", IDHelper.getEventID());
    this.monitorService.saveEvent(dto);
  }

  private void saveLogoutEvent(UserInfoVo userInfo, HttpServletRequest request)
  {
    Dto dto = new BaseDto();
    dto.put("account", userInfo.getAccount());
    dto.put("activetime", G4Utils.getCurrentTime());
    dto.put("userid", userInfo.getUserid());
    dto.put("username", userInfo.getUsername());
    dto.put("description", "退出系统");
    dto.put("requestpath", request.getRequestURI());
    dto.put("methodname", request.getParameter("reqCode"));
    dto.put("eventid", IDHelper.getEventID());
    this.monitorService.saveEvent(dto);
  }
}