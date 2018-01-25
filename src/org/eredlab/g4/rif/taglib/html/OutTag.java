package org.eredlab.g4.rif.taglib.html;

import java.io.IOException;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.PageContext;
import javax.servlet.jsp.tagext.TagSupport;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.util.WebUtils;

public class OutTag extends TagSupport {
	private static Log log = LogFactory.getLog(OutTag.class);
	private String scope;
	private String key;

	public int doStartTag() throws JspException {
		this.scope = (G4Utils.isEmpty(this.scope) ? "request" : this.scope);
		HttpServletRequest request = (HttpServletRequest) this.pageContext
				.getRequest();
		String valueString = "";
		if (this.scope.equalsIgnoreCase("request"))
			valueString = (String) request.getAttribute(this.key);
		else if (this.scope.equalsIgnoreCase("session"))
			valueString = (String) WebUtils.getSessionAttribute(request,
					this.key);
		else if (this.scope.equalsIgnoreCase("application"))
			valueString = (String) request.getSession().getServletContext()
					.getAttribute(this.key);
		try {
			this.pageContext.getOut().write(valueString);
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
		this.scope = null;
		this.key = null;
		super.release();
	}

	public void setScope(String scope) {
		this.scope = scope;
	}

	public void setKey(String key) {
		this.key = key;
	}
}