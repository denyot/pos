package org.eredlab.g4.rif.taglib.html;

import java.io.IOException;
import java.io.StringWriter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.PageContext;
import javax.servlet.jsp.tagext.TagSupport;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.arm.service.ArmTagSupportService;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.properties.PropertiesFactory;
import org.eredlab.g4.ccl.properties.PropertiesHelper;
import org.eredlab.g4.ccl.tplengine.DefaultTemplate;
import org.eredlab.g4.ccl.tplengine.FileTemplate;
import org.eredlab.g4.ccl.tplengine.TemplateEngine;
import org.eredlab.g4.ccl.tplengine.TemplateEngineFactory;
import org.eredlab.g4.ccl.tplengine.TemplateType;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.taglib.util.TagHelper;
import org.eredlab.g4.rif.util.SessionContainer;
import org.eredlab.g4.rif.util.WebUtils;

public class HtmlTag extends TagSupport {
	private ArmTagSupportService armTagSupportService = (ArmTagSupportService) SpringBeanLoader
			.getSpringBean("armTagSupportService");

	private static Log log = LogFactory.getLog(HtmlTag.class);
	private String extDisabled;
	private String title;
	private String jqueryEnabled;
	private String showLoading;
	private String uxEnabled = "true";
	private String fcfEnabled = "false";
	private String doctypeEnable;
	private String exportParams = "false";
	private String exportUserinfo = "false";
	private String isSubPage = "true";
	private String urlSecurity2 = "true";

	public int doStartTag() throws JspException {
		HttpServletRequest request = (HttpServletRequest) this.pageContext
				.getRequest();
		UserInfoVo userInfo = WebUtils.getSessionContainer(request)
				.getUserInfo();
		String contextPath = request.getContextPath();
		request.setAttribute("webContext", contextPath);
		Dto dto = new BaseDto();
		PropertiesHelper pHelper = PropertiesFactory.getPropertiesHelper("g4");
		String micolor = pHelper.getValue("micolor", "blue");
		dto.put("micolor", micolor);
		String urlSecurity = pHelper.getValue("urlSecurity", "1");
		dto.put("urlSecurity", urlSecurity);
		dto.put("urlSecurity2", this.urlSecurity2);
		dto.put("userInfo", userInfo);
		dto.put("ajaxErrCode", Integer.valueOf(999));
		dto.put("requestURL", request.getRequestURL());
		dto.put("contextPath", contextPath);
		dto.put("doctypeEnable", this.doctypeEnable);
		dto.put("extDisabled", G4Utils.isEmpty(this.extDisabled) ? "false"
				: this.extDisabled);
		dto.put("title", G4Utils.isEmpty(this.title) ? "eRedG4" : this.title);
		dto.put("jqueryEnabled", G4Utils.isEmpty(this.jqueryEnabled) ? "false"
				: this.jqueryEnabled);
		dto.put("showLoading", G4Utils.isEmpty(this.showLoading) ? "true"
				: this.showLoading);
		dto.put("uxEnabled", this.uxEnabled);
		dto.put("fcfEnabled", this.fcfEnabled);
		dto.put("exportParams", this.exportParams);
		dto.put("exportUserinfo", this.exportUserinfo);
		dto.put("isSubPage", this.isSubPage);
		dto
				.put("pageLoadMsg", WebUtils.getParamValue("PAGE_LOAD_MSG",
						request));
		String titleIcon = WebUtils.getParamValue("TITLE_ICON", request);
		dto.put("titleIcon", G4Utils.isEmpty(titleIcon) ? "eredg4.ico"
				: titleIcon);
		if (this.exportParams.equals("true")) {
			dto.put("paramList", WebUtils.getParamList(request));
		}

		PropertiesHelper p = PropertiesFactory.getPropertiesHelper("g4");
		dto.put("extMode", p.getValue("extMode", "debug"));
		dto.put("runMode", p.getValue("runMode", "1"));
		Dto themeDto = new BaseDto();
		Dto resultDto = new BaseDto();
		if (G4Utils.isNotEmpty(userInfo)) {
			themeDto.put("userid", userInfo.getUserid());
			resultDto = this.armTagSupportService.getEauserSubInfo(themeDto);
		}
		String theme = null;
		if (G4Utils.isNotEmpty(resultDto))
			theme = resultDto.getAsString("theme");
		String defaultTheme = WebUtils.getParamValue("SYS_DEFAULT_THEME",
				request);
		theme = G4Utils.isEmpty(theme) ? defaultTheme : theme;
		dto.put("theme", theme);
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
		return 1;
	}

	public int doEndTag() throws JspException {
		try {
			this.pageContext.getOut().write("</html>");
		} catch (IOException e) {
			log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n" + e.getMessage());
			e.printStackTrace();
		}
		return 6;
	}

	public void release() {
		this.extDisabled = null;
		this.title = null;
		this.jqueryEnabled = null;
		this.uxEnabled = null;
		this.fcfEnabled = null;
		this.doctypeEnable = null;
		this.exportParams = null;
		this.exportUserinfo = null;
		this.isSubPage = null;
		this.urlSecurity2 = null;
		super.release();
	}

	public void setExtDisabled(String extDisabled) {
		this.extDisabled = extDisabled;
	}

	public void setJqueryEnabled(String jqueryEnabled) {
		this.jqueryEnabled = jqueryEnabled;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public void setShowLoading(String showLoading) {
		this.showLoading = showLoading;
	}

	public void setUxEnabled(String uxEnabled) {
		this.uxEnabled = uxEnabled;
	}

	public String getFcfEnabled() {
		return this.fcfEnabled;
	}

	public void setFcfEnabled(String fcfEnabled) {
		this.fcfEnabled = fcfEnabled;
	}

	public void setDoctypeEnable(String doctypeEnable) {
		this.doctypeEnable = doctypeEnable;
	}

	public void setExportParams(String exportParams) {
		this.exportParams = exportParams;
	}

	public void setExportUserinfo(String exportUserinfo) {
		this.exportUserinfo = exportUserinfo;
	}

	public void setIsSubPage(String isSubPage) {
		this.isSubPage = isSubPage;
	}

	public void setUrlSecurity2(String urlSecurity2) {
		this.urlSecurity2 = urlSecurity2;
	}
}