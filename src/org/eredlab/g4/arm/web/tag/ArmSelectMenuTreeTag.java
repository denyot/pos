package org.eredlab.g4.arm.web.tag;

import java.io.IOException;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.PageContext;
import javax.servlet.jsp.tagext.TagSupport;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.arm.web.tag.vo.MenuVo;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.tplengine.DefaultTemplate;
import org.eredlab.g4.ccl.tplengine.FileTemplate;
import org.eredlab.g4.ccl.tplengine.TemplateEngine;
import org.eredlab.g4.ccl.tplengine.TemplateEngineFactory;
import org.eredlab.g4.ccl.tplengine.TemplateType;
import org.eredlab.g4.rif.taglib.util.TagHelper;
import org.eredlab.g4.rif.util.SessionContainer;
import org.eredlab.g4.rif.util.WebUtils;

public class ArmSelectMenuTreeTag extends TagSupport
{
  private static Log log = LogFactory.getLog(ArmSelectMenuTreeTag.class);

  public int doStartTag()
    throws JspException
  {
    IDao g4Dao = (IDao)SpringBeanLoader.getSpringBean("g4Dao");
    HttpServletRequest request = (HttpServletRequest)this.pageContext.getRequest();
    Dto grantDto = new BaseDto();
    grantDto.put("userid", request.getParameter("userid"));
    grantDto.put("authorizelevel", "1");
    List grantedList = g4Dao.queryForList("ArmTagSupport.queryGrantedMenusByUserId", grantDto);
    List menuList = new ArrayList();
    String account = WebUtils.getSessionContainer(request).getUserInfo().getAccount();
    String developerAccount = WebUtils.getParamValue("DEFAULT_DEVELOP_ACCOUNT", request);
    String superAccount = WebUtils.getParamValue("DEFAULT_ADMIN_ACCOUNT", request);
    Dto qDto = new BaseDto();
    String userid = WebUtils.getSessionContainer(request).getUserInfo().getUserid();
    qDto.put("userid", userid);
    String userType = request.getParameter("usertype");
    if (userType.equals("2")) {
      qDto.put("menutype", "1");
    }
    if ((account.equalsIgnoreCase(developerAccount)) || (account.equalsIgnoreCase(superAccount)))
      menuList = g4Dao.queryForList("ArmTagSupport.queryMenusForUserGrant", qDto);
    else {
      menuList = g4Dao.queryForList("ArmTagSupport.queryMenusForGrant", qDto);
    }
    for (int i = 0; i < menuList.size(); i++) {
      MenuVo menuVo = (MenuVo)menuList.get(i);
      if (checkGeant(grantedList, menuVo.getMenuid()).booleanValue())
        menuVo.setChecked("true");
      else {
        menuVo.setChecked("false");
      }
      if (menuVo.getParentid().equals("0")) {
        menuVo.setIsRoot("true");
      }
      if (menuVo.getMenuid().length() < 6) {
        menuVo.setExpanded("true");
      }
    }
    Dto dto = new BaseDto();
    dto.put("menuList", menuList);
    TemplateEngine engine = TemplateEngineFactory.getTemplateEngine(TemplateType.VELOCITY);
    DefaultTemplate template = new FileTemplate();
    template.setTemplateResource(TagHelper.getTemplatePath(getClass().getName()));
    StringWriter writer = engine.mergeTemplate(template, dto);
    try {
      this.pageContext.getOut().write(writer.toString());
    } catch (IOException e) {
      log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n" + e.getMessage());
      e.printStackTrace();
    }
    return 0;
  }

  private Boolean checkGeant(List grantList, String pMenuid)
  {
    Boolean result = new Boolean(false);
    for (int i = 0; i < grantList.size(); i++) {
      Dto dto = (BaseDto)grantList.get(i);
      if (pMenuid.equals(dto.getAsString("menuid"))) {
        result = new Boolean(true);
      }
    }
    return result;
  }

  public int doEndTag()
    throws JspException
  {
    return 6;
  }

  public void release()
  {
    super.release();
  }
}