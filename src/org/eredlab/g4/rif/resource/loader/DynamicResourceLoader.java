package org.eredlab.g4.rif.resource.loader;

import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.rif.resource.HttpHolder;
import org.eredlab.g4.rif.resource.LoadResoruceException;
import org.eredlab.g4.rif.resource.Resource;
import org.eredlab.g4.rif.resource.support.DefaultResource;

public class DynamicResourceLoader extends AbstractResourceLoader {
	private final Log logger = LogFactory.getLog(getClass());

	public long getLastModified(String uri) {
		return 0L;
	}

	public Resource load(String uri) throws LoadResoruceException {
		HttpServletRequest request = HttpHolder.getRequest();
		HttpServletResponse response = HttpHolder.getResponse();
		FilterChain filterChain = HttpHolder.getFilterChain();

		BufferResponseWrapper wrapper = new BufferResponseWrapper(response);
		try {
			filterChain.doFilter(request, wrapper);
		} catch (Exception e) {
			throw new LoadResoruceException(e);
		}

		try {
			wrapper.flush();
		} catch (IOException e) {
			throw new LoadResoruceException(e);
		}
		byte[] datas = wrapper.getDatas();
		DefaultResource result = new DefaultResource(uri, datas);
		result.setLastModified(getLastModified(uri));
		return result;
	}
}