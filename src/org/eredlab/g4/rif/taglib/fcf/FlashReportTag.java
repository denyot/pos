package org.eredlab.g4.rif.taglib.fcf;

import java.io.IOException;
import java.io.StringWriter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.PageContext;
import javax.servlet.jsp.tagext.TagSupport;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.tplengine.DefaultTemplate;
import org.eredlab.g4.ccl.tplengine.FileTemplate;
import org.eredlab.g4.ccl.tplengine.TemplateEngine;
import org.eredlab.g4.ccl.tplengine.TemplateEngineFactory;
import org.eredlab.g4.ccl.tplengine.TemplateType;
import org.eredlab.g4.rif.taglib.util.FcfConstant;
import org.eredlab.g4.rif.taglib.util.TagHelper;

public class FlashReportTag extends TagSupport {
	private static Log log = LogFactory.getLog(FlashReportTag.class);
	private String id;
	private String type;
	private String align = "left";
	private String width = "550";
	private String height = "350";
	private String visible;
	private String dataVar;
	private String style;

	public int doStartTag() throws JspException {
		HttpServletRequest request = (HttpServletRequest) this.pageContext
				.getRequest();
		String contextPath = request.getContextPath();
		Dto dto = new BaseDto();
		dto.put("contextPath", contextPath);
		dto.put("id", this.id);
		dto.put("align", this.align);
		dto.put("width", this.width);
		dto.put("height", this.height);
		dto.put("style", this.style);
		dto.put("cls", this.visible == "true" ? "" : "x-hidden");
		dto.put("swfModelPath", contextPath + "/resource/fcf/"
				+ FcfConstant.getReportModel(this.type));
		String xmlString = (String) request.getAttribute(this.dataVar);
		dto.put("reportXMLData", xmlString);
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
		this.id = null;
		this.align = null;
		this.height = null;
		this.width = null;
		this.visible = null;
		this.type = null;
		this.style = null;
		this.dataVar = null;
		super.release();
	}

	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getAlign() {
		return this.align;
	}

	public void setAlign(String align) {
		this.align = align;
	}

	public String getWidth() {
		return this.width;
	}

	public void setWidth(String width) {
		this.width = width;
	}

	public String getHeight() {
		return this.height;
	}

	public void setHeight(String height) {
		this.height = height;
	}

	public void setVisible(String visible) {
		this.visible = visible;
	}

	public String getDataVar() {
		return this.dataVar;
	}

	public void setDataVar(String dataVar) {
		this.dataVar = dataVar;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public void setStyle(String style) {
		this.style = style;
	}
}