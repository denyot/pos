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

public class DivTag extends TagSupport {
	private static Log log = LogFactory.getLog(DivTag.class);
	private String key;
	private String cls;
	private String style;
	private String any;

	public int doStartTag() throws JspException {
		Dto dto = new BaseDto();
		dto.put("key", this.key);
		dto.put("any", TagHelper.checkEmpty(this.any));
		dto.put("style", TagHelper.checkEmpty(this.style));
		dto.put("cls", TagHelper.checkEmpty(this.cls));
		String tpl = "<div id=*$key* #if(${cls}!=*off*)class=*${cls}*#end #if(${style}!=*off*)style=*${style}*#end #if(${any}!=*off*)${any}#end>";
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
			this.pageContext.getOut().write("</div>");
		} catch (IOException e) {
			log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n" + e.getMessage());
			e.printStackTrace();
		}
		return 6;
	}

	public void release() {
		this.key = null;
		this.cls = null;
		this.style = null;
		this.any = null;
		super.release();
	}

	public void setCls(String cls) {
		this.cls = cls;
	}

	public void setStyle(String style) {
		this.style = style;
	}

	public void setAny(String any) {
		this.any = any;
	}

	public void setKey(String key) {
		this.key = key;
	}
}