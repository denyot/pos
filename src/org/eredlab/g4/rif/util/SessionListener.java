package org.eredlab.g4.rif.util;

import java.util.Collection;
import java.util.Hashtable;
import java.util.Iterator;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.arm.service.MonitorService;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.util.G4Utils;

public class SessionListener implements HttpSessionListener {
	private static Log log = LogFactory.getLog(SessionListener.class);

	static Hashtable ht = new Hashtable();

	public void sessionCreated(HttpSessionEvent event) {
	}

	public void sessionDestroyed(HttpSessionEvent event) {
		HttpSession session = event.getSession();
		SessionContainer sessionContainer = (SessionContainer) session
				.getAttribute("SessionContainer");
		if (sessionContainer != null) {
			sessionContainer.setUserInfo(null);
			sessionContainer.cleanUp();
			MonitorService monitorService = (MonitorService) SpringBeanLoader
					.getSpringBean("monitorService");
			Dto dto = new BaseDto();
			dto.put("sessionid", session.getId());
			monitorService.deleteHttpSession(dto);
			ht.remove(session.getId());
			log.info("销毁了一个Session连接:" + session.getId() + " "
					+ G4Utils.getCurrentTime());
		}
	}

	public static void addSession(HttpSession session, UserInfoVo userInfo) {
		ht.put(session.getId(), session);
		IReader g4Reader = (IReader) SpringBeanLoader.getSpringBean("g4Reader");
		MonitorService monitorService = (MonitorService) SpringBeanLoader
				.getSpringBean("monitorService");
		UserInfoVo usInfo = (UserInfoVo) g4Reader.queryForObject(
				"Monitor.queryHttpSessionsByID", session.getId());
		if (G4Utils.isEmpty(usInfo))
			monitorService.saveHttpSession(userInfo);
	}

	public static Iterator getSessions() {
		return ht.values().iterator();
	}

	public static HttpSession getSessionByID(String sessionId) {
		return (HttpSession) ht.get(sessionId);
	}
}