package org.eredlab.g4.ccl.tplengine;

import java.io.StringWriter;
import org.eredlab.g4.ccl.datastructure.Dto;

public abstract interface TemplateEngine {
	public abstract StringWriter mergeTemplate(
			DefaultTemplate paramDefaultTemplate, Dto paramDto);
}