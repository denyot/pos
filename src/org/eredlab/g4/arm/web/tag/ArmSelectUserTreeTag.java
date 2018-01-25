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
import org.eredlab.g4.arm.web.tag.vo.DeptVo;
import org.eredlab.g4.arm.web.tag.vo.UserVo;
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
import org.eredlab.g4.rif.util.WebUtils;

public class ArmSelectUserTreeTag extends TagSupport
{
  private static Log log = LogFactory.getLog(ArmSelectUserTreeTag.class);

  public int doStartTag()
    throws JspException
  {
    IDao g4Dao = (IDao)SpringBeanLoader.getSpringBean("g4Dao");
    HttpServletRequest request = (HttpServletRequest)this.pageContext.getRequest();
    String deptid = request.getParameter("deptid");
    String roletype = request.getParameter("roletype");
    Dto deptDto = new BaseDto();
    deptDto.put("deptid", deptid);
    List deptList = g4Dao.queryForList("ArmTagSupport.queryDeptsForRoleGrant", deptDto);
    List userList = new ArrayList();
    Dto userDto = new BaseDto();

    userDto.put("usertype", roletype);
    roletype.equals("1");

    for (int i = 0; i < deptList.size(); i++) {
      DeptVo deptVo = (DeptVo)deptList.get(i);
      if (deptVo.getDeptid().equals(deptid)) {
        deptVo.setIsroot("true");
      }
      userDto.put("deptid", deptVo.getDeptid());
      List tempList = g4Dao.queryForList("ArmTagSupport.queryUsersForRoleGrant", userDto);
      userList.addAll(tempList);
    }
    Dto grantDto = new BaseDto();
    grantDto.put("roleid", request.getParameter("roleid"));
    List grantList = g4Dao.queryForList("ArmTagSupport.queryGrantedUsersByRoleId", grantDto);
    for (int i = 0; i < userList.size(); i++) {
      UserVo userVo = (UserVo)userList.get(i);
      String usertypeString = WebUtils.getCodeDesc("USERTYPE", userVo.getUsertype(), request);
      String usernameString = userVo.getUsername();
      usernameString = usernameString + "[" + userVo.getAccount() + ", " + usertypeString + "]";
      userVo.setUsername(usernameString);
      if (checkGrant(grantList, userVo.getUserid())) {
        userVo.setChecked("true");
      }
    }
    Dto dto = new BaseDto();
    dto.put("deptList", deptList);
    dto.put("userList", userList);
    dto.put("deptid", deptid);
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

  private boolean checkGrant(List grantList, String pUserid)
  {
    Boolean result = new Boolean(false);
    for (int i = 0; i < grantList.size(); i++) {
      Dto dto = (BaseDto)grantList.get(i);
      if (pUserid.equals(dto.getAsString("userid"))) {
        result = new Boolean(true);
      }
    }
    return result.booleanValue();
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