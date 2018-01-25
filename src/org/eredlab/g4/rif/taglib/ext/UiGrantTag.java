package org.eredlab.g4.rif.taglib.ext;

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
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.tplengine.DefaultTemplate;
import org.eredlab.g4.ccl.tplengine.FileTemplate;
import org.eredlab.g4.ccl.tplengine.TemplateEngine;
import org.eredlab.g4.ccl.tplengine.TemplateEngineFactory;
import org.eredlab.g4.ccl.tplengine.TemplateType;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.taglib.util.TagHelper;
import org.eredlab.g4.rif.util.SessionContainer;
import org.eredlab.g4.rif.util.WebUtils;

public class UiGrantTag extends TagSupport {
	private static Log log = LogFactory.getLog(UiGrantTag.class);

	public int doStartTag() throws JspException {
		HttpServletRequest request = (HttpServletRequest) this.pageContext
				.getRequest();
		IDao g4Dao = (IDao) SpringBeanLoader.getSpringBean("g4Dao");
		Dto qDto = new BaseDto();
		UserInfoVo userInfoVo = WebUtils.getSessionContainer(request)
				.getUserInfo();
		qDto.put("userid", userInfoVo.getUserid());
		qDto.put("menuid", request.getParameter("menuid4Log"));
		List roleGrantList = g4Dao.queryForList(
				"ArmTagSupport.getUiRoleGrantInfo", qDto);
		List userGrantList = g4Dao.queryForList(
				"ArmTagSupport.getUiUserGrantInfo", qDto);
		List grantList = new ArrayList();
		if (G4Utils.isNotEmpty(roleGrantList)) {
			grantList.addAll(roleGrantList);
		}
		if (G4Utils.isNotEmpty(userGrantList)) {
			grantList.addAll(userGrantList);
		}
		Dto dto = new BaseDto();
		dto.put("grantList", grantList);
		TemplateEngine engine = TemplateEngineFactory
				.getTemplateEngine(TemplateType.VELOCITY);
		DefaultTemplate template = new FileTemplate();
		template.setTemplateResource(TagHelper.getTemplatePath(getClass()
				.getName()));
		StringWriter writer = engine.mergeTemplate(template, dto);
		try {
			this.pageContext.getOut().write(writer.toString());
		} catch (IOException e) {
			log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n" + e.getMessage());
			e.printStackTrace();
		}
		return 0;
	}

	public int doEndTag() throws JspException {
		return 6;
	}

	public void release() {
		super.release();
	}
}