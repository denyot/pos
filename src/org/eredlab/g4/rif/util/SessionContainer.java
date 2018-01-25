package org.eredlab.g4.rif.util;

import java.io.Serializable;
import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionBindingListener;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.rif.report.jasper.ReportData;

public class SessionContainer implements HttpSessionBindingListener,
		Serializable {
	private static final long serialVersionUID = 1L;
	private UserInfoVo userInfo;
	private Dto reportDto;

	public SessionContainer() {
		this.reportDto = new BaseDto();
	}

	public void setReportData(ReportData pReportData) {
		this.reportDto.put("default", pReportData);
	}

	public ReportData getReportData() {
		return (ReportData) this.reportDto.get("default");
	}

	public void setReportData(String pFlag, ReportData pReportData) {
		this.reportDto.put(pFlag, pReportData);
	}

	public ReportData getReportData(String pFlag) {
		return (ReportData) this.reportDto.get(pFlag);
	}

	public void cleanUp() {
		this.reportDto.clear();
	}

	public void valueBound(HttpSessionBindingEvent event) {
	}

	public void valueUnbound(HttpSessionBindingEvent event) {
	}

	public UserInfoVo getUserInfo() {
		return this.userInfo;
	}

	public void setUserInfo(UserInfoVo userInfo) {
		this.userInfo = userInfo;
	}
}