package org.eredlab.g4.ccl.tplengine;

import java.io.StringWriter;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.ccl.datastructure.Dto;

public abstract class AbstractTemplateEngine implements TemplateEngine {
	private Log log = LogFactory.getLog(AbstractTemplateEngine.class);

	public StringWriter mergeTemplate(DefaultTemplate pTemplate, Dto dto) {
		StringWriter writer = null;
		if ((pTemplate instanceof StringTemplate))
			writer = mergeStringTemplate(pTemplate, dto);
		else if ((pTemplate instanceof FileTemplate))
			writer = mergeFileTemplate(pTemplate, dto);
		else {
			throw new IllegalArgumentException(
					"\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n不支持的模板");
		}
		return writer;
	}

	protected abstract StringWriter mergeStringTemplate(
			DefaultTemplate paramDefaultTemplate, Dto paramDto);

	protected abstract StringWriter mergeFileTemplate(
			DefaultTemplate paramDefaultTemplate, Dto paramDto);
}