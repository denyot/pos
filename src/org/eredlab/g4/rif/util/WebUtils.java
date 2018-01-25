package org.eredlab.g4.rif.util;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.servlet.ServletContext;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.util.G4Utils;

public class WebUtils {
	public static SessionContainer getSessionContainer(
			HttpServletRequest request) {
		SessionContainer sessionContainer = (SessionContainer) request
				.getSession().getAttribute("SessionContainer");
		if (sessionContainer == null) {
			sessionContainer = new SessionContainer();
			HttpSession session = request.getSession(true);
			session.setAttribute("SessionContainer", sessionContainer);
		}
		return sessionContainer;
	}

	public static SessionContainer getSessionContainer(HttpSession session) {
		SessionContainer sessionContainer = (SessionContainer) session
				.getAttribute("SessionContainer");
		if (sessionContainer == null) {
			sessionContainer = new SessionContainer();
			session.setAttribute("SessionContainer", sessionContainer);
		}
		return sessionContainer;
	}

	public static Object getSessionAttribute(HttpServletRequest request,
			String sessionKey) {
		Object objSessionAttribute = null;
		HttpSession session = request.getSession(false);
		if (session != null) {
			objSessionAttribute = session.getAttribute(sessionKey);
		}
		return objSessionAttribute;
	}

	public static void setSessionAttribute(HttpServletRequest request,
			String sessionKey, Object objSessionAttribute) {
		HttpSession session = request.getSession();
		if (session != null)
			session.setAttribute(sessionKey, objSessionAttribute);
	}

	public static void removeSessionAttribute(HttpServletRequest request,
			String sessionKey) {
		HttpSession session = request.getSession();
		if (session != null)
			session.removeAttribute(sessionKey);
	}

	public static Dto getPraramsAsDto(HttpServletRequest request) {
		Dto dto = new BaseDto();
		Map map = request.getParameterMap();
		Iterator keyIterator = map.keySet().iterator();
		while (keyIterator.hasNext()) {
			String key = (String) keyIterator.next();
			String value = ((String[]) map.get(key))[0];
			value = value == null ? "" : value.trim();
			dto.put(key, value);
		}
		return dto;
	}

	public static String getCodeDesc(String pField, String pCode,
			HttpServletRequest request) {
		List codeList = (List) request.getSession().getServletContext()
				.getAttribute("EACODELIST");
		String codedesc = null;
		for (int i = 0; i < codeList.size(); i++) {
			Dto codeDto = (BaseDto) codeList.get(i);
			if ((pField.equalsIgnoreCase(codeDto.getAsString("field")))
					&& (pCode.equalsIgnoreCase(codeDto.getAsString("code"))))
				codedesc = codeDto.getAsString("codedesc");
		}
		return codedesc;
	}

	public static List getCodeListByField(String pField,
			HttpServletRequest request) {
		List codeList = (List) request.getSession().getServletContext()
				.getAttribute("EACODELIST");
		List lst = new ArrayList();
		for (int i = 0; i < codeList.size(); i++) {
			Dto codeDto = (BaseDto) codeList.get(i);
			if (codeDto.getAsString("field").equalsIgnoreCase(pField)) {
				lst.add(codeDto);
			}
		}
		return lst;
	}

	public static String getParamValue(String pParamKey,
			HttpServletRequest request) {
		String paramValue = "";
		ServletContext context = request.getSession().getServletContext();
		if (G4Utils.isEmpty(context)) {
			return "";
		}
		List paramList = (List) context.getAttribute("EAPARAMLIST");
		for (int i = 0; i < paramList.size(); i++) {
			Dto paramDto = (BaseDto) paramList.get(i);
			if (pParamKey.equals(paramDto.getAsString("paramkey"))) {
				paramValue = paramDto.getAsString("paramvalue");
			}
		}
		return paramValue;
	}

	public static List getParamList(HttpServletRequest request) {
		ServletContext context = request.getSession().getServletContext();
		if (G4Utils.isEmpty(context)) {
			return new ArrayList();
		}
		return (List) context.getAttribute("EAPARAMLIST");
	}

	public static String getCookieValue(Cookie[] cookies, String cookieName,
			String defaultValue) {
		if (cookies == null) {
			return defaultValue;
		}
		for (int i = 0; i < cookies.length; i++) {
			Cookie cookie = cookies[i];
			if (cookieName.equals(cookie.getName()))
				return cookie.getValue();
		}
		return defaultValue;
	}
}