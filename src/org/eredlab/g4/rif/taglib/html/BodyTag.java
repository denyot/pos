package org.eredlab.g4.rif.taglib.html;

import java.io.IOException;
import java.io.StringWriter;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.PageContext;
import javax.servlet.jsp.tagext.TagSupport;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.tplengine.DefaultTemplate;
import org.eredlab.g4.ccl.tplengine.StringTemplate;
import org.eredlab.g4.ccl.tplengine.TemplateEngine;
import org.eredlab.g4.ccl.tplengine.TemplateEngineFactory;
import org.eredlab.g4.ccl.tplengine.TemplateType;
import org.eredlab.g4.rif.taglib.util.TagHelper;

public class BodyTag extends TagSupport {
	private static Log log = LogFactory.getLog(BodyTag.class);
	private String onload;
	private String any;
	private String cls;

	public int doStartTag() throws JspException {
		Dto dto = new BaseDto();
		dto.put("onload", TagHelper.checkEmpty(this.onload));
		dto.put("any", TagHelper.checkEmpty(this.any));
		dto.put("cls", TagHelper.checkEmpty(this.cls));
		String tpl = "<body #if(${cls}!=*off*)class=*${cls}*#end #if(${onload}!=*off*)onload=*${onload}*#end #if(${any}!=*off*)${any}#end>";
		TemplateEngine engine = TemplateEngineFactory
				.getTemplateEngine(TemplateType.VELOCITY);
		DefaultTemplate template = new StringTemplate(TagHelper
				.replaceStringTemplate(tpl));
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
			this.pageContext.getOut().write("</body>");
		} catch (IOException e) {
			log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n" + e.getMessage());
			e.printStackTrace();
		}
		return 6;
	}

	public void release() {
		this.any = null;
		this.cls = null;
		this.onload = null;
		super.release();
	}

	public void setOnload(String onload) {
		this.onload = onload;
	}

	public void setAny(String any) {
		this.any = any;
	}

	public void setCls(String cls) {
		this.cls = cls;
	}
}