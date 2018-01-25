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
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.tplengine.DefaultTemplate;
import org.eredlab.g4.ccl.tplengine.FileTemplate;
import org.eredlab.g4.ccl.tplengine.TemplateEngine;
import org.eredlab.g4.ccl.tplengine.TemplateEngineFactory;
import org.eredlab.g4.ccl.tplengine.TemplateType;
import org.eredlab.g4.rif.taglib.util.TagHelper;
import org.eredlab.g4.rif.util.WebUtils;

public class CodeStoreTag extends TagSupport {
	private static Log log = LogFactory.getLog(CodeStoreTag.class);
	private String fields;
	private String showCode = "false";

	public int doStartTag() throws JspException {
		HttpServletRequest request = (HttpServletRequest) this.pageContext
				.getRequest();
		StringBuffer sb = new StringBuffer();
		sb.append("<script type=\"text/javascript\">\n");
		Dto dto = new BaseDto();
		dto.put("showCode", this.showCode.toLowerCase());
		String[] arrayFields = this.fields.split(",");
		TemplateEngine engine = TemplateEngineFactory
				.getTemplateEngine(TemplateType.VELOCITY);
		DefaultTemplate template = new FileTemplate();
		template.setTemplateResource(TagHelper.getTemplatePath(getClass()
				.getName()));
		for (int i = 0; i < arrayFields.length; i++) {
			if (arrayFields[i].indexOf(":") != -1) {
				String field = arrayFields[i].substring(0, arrayFields[i]
						.indexOf(":"));
				dto.put("field", field);
				List codeList = WebUtils.getCodeListByField(field, request);
				String filter = arrayFields[i].substring(arrayFields[i]
						.indexOf(":") + 1);
				String[] filters = filter.split("!");
				List okList = new ArrayList();

				for (int j = 0; j < codeList.size(); j++) {
					Dto codeDto = (BaseDto) codeList.get(j);
					boolean flag = true;
					for (int k = 0; k < filters.length; k++) {
						if (codeDto.getAsString("code").equalsIgnoreCase(
								filters[k])) {
							flag = false;
						}
					}
					if (flag) {
						okList.add(codeDto);
					}
				}
				dto.put("codeList", okList);
			} else {
				List codeList = WebUtils.getCodeListByField(arrayFields[i],
						request);
				dto.put("field", arrayFields[i]);
				dto.put("codeList", codeList);
			}
			StringWriter writer = engine.mergeTemplate(template, dto);
			sb.append(writer.toString());
		}
		sb.append("\n</script>");
		try {
			this.pageContext.getOut().write(sb.toString());
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
		this.fields = null;
		this.showCode = null;
		super.release();
	}

	public void setFields(String fields) {
		this.fields = fields;
	}

	public void setShowCode(String showCode) {
		this.showCode = showCode;
	}
}