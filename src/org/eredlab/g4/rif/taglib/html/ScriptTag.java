package org.eredlab.g4.rif.taglib.html;

import java.io.IOException;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.PageContext;
import javax.servlet.jsp.tagext.TagSupport;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class ScriptTag extends TagSupport {
	private static Log log = LogFactory.getLog(DivTag.class);

	public int doStartTag() throws JspException {
		String begin = "<script type=\"text/javascript\">";
		try {
			this.pageContext.getOut().write(begin);
		} catch (IOException e) {
			log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n" + e.getMessage());
			e.printStackTrace();
		}
		return 1;
	}

	public int doEndTag() throws JspException {
		try {
			this.pageContext.getOut().write("</script>");
		} catch (IOException e) {
			log.error("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n" + e.getMessage());
			e.printStackTrace();
		}
		return 6;
	}

	public void release() {
		super.release();
	}
}