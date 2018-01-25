package org.eredlab.g4.rif.resource.impl;

import java.util.HashMap;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.rif.resource.ResourceException;
import org.eredlab.g4.rif.resource.ResourceHandler;
import org.eredlab.g4.rif.resource.handler.CSSMinResourceHandler;
import org.eredlab.g4.rif.resource.handler.GZipResourceHandler;
import org.eredlab.g4.rif.resource.handler.JSMinResourceHandler;
import org.eredlab.g4.rif.resource.handler.NoneResourceHandler;
import org.eredlab.g4.rif.resource.support.HandlerMapping;

public class DefaultHandlerMapping implements HandlerMapping {
	private final Log logger = LogFactory.getLog(getClass());
	private static final GZipResourceHandler gzip = new GZipResourceHandler();
	private static final NoneResourceHandler none = new NoneResourceHandler();
	private static final CSSMinResourceHandler cssMin = new CSSMinResourceHandler();
	private static final JSMinResourceHandler jsMin = new JSMinResourceHandler();
	private static Map handlers = new HashMap();

	static {
		handlers.put("gzip", gzip);
		handlers.put("none", none);
		handlers.put("cssmin", cssMin);
		handlers.put("jsmin", jsMin);
	}

	public void put(String pHandlerName, ResourceHandler pHandler) {
		handlers.put(pHandlerName, pHandler);
	}

	public ResourceHandler mapping(String pName) throws ResourceException {
		if (pName == null) {
			throw new NullPointerException("资源Handler名称不能为空null");
		}
		String handlerName = pName.toLowerCase();
		if (!handlers.containsKey(handlerName)) {
			return null;
		}
		ResourceHandler result = (ResourceHandler) handlers.get(handlerName);
		return result;
	}
}