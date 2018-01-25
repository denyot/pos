package cn.longhaul.job.web;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.net.URI;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateFormatUtils;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import cn.longhaul.job.constant.FileUtil;
import cn.longhaul.job.constant.JobConstant;
import cn.longhaul.job.constant.SentEmail;
import cn.longhaul.job.quartzservice.SchedulerService;
import cn.longhaul.job.service.JobMangerService;
import cn.longhaul.sap.system.datasyn.DataSynToAIGServiceImpl;
import flex.messaging.io.ArrayList;

public class JobManger extends BaseAction {
	private JobMangerService jobMangerService = (JobMangerService) super
			.getService("jobMangerService");
	private SchedulerService schedulerService = (SchedulerService) super
			.getService("schedulerService");

	public ActionForward getTableDesc(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List temp = new ArrayList();
		List list = new ArrayList();
		HashMap tempMap2 = new HashMap();
		tempMap2.put("field", dto.get("tablename") + "(表名称)");
		tempMap2.put("type", dto.get(""));
		temp.add(tempMap2);
		try {
			list = this.jobMangerService.getTableDesc(dto);
		} catch (RuntimeException e) {
			tempMap2.put("field", dto.get("tablename") + "该表AIG系统不存在");
		}

		for (int i = 0; i < list.size(); i++) {
			HashMap tempMap = new HashMap();
			HashMap map = (HashMap) list.get(i);
			String field = (String) map.get("field");
			String type = (String) map.get("type");
			if (field == null) {
				field = (String) map.get("name");
			}
			tempMap.put("field", field);
			tempMap.put("type", type);
			temp.add(tempMap);
		}

		String jsonString = JsonHelper.encodeList2PageJson(temp, Integer
				.valueOf(temp.size()), "yyyy-MM-dd hh:mm:ss");
		System.out.println(jsonString);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward jobReportInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("reportmanager");
	}

	public ActionForward processEmail(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {
			CommonActionForm aForm = (CommonActionForm) form;
			Dto dto = aForm.getParamAsDto(request);
			String buffer = (String) dto.get("address");
			System.out.println(buffer);
			URI uri = new URI(getClass().getResource("/") + "/email2.txt");
			FileUtil.writeFromBuffer(buffer, new FileOutputStream(new File(uri)));
			SentEmail.process();
			write("yes", response);
		} catch (Exception e) {
			write("no", response);
		}
		return mapping.findForward(null);
	}

	public ActionForward emailInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		StringBuffer buffer = new StringBuffer();
		URI uri = new URI(getClass().getResource("/") + "/email2.txt");
		FileUtil.readToBuffer(buffer, new FileInputStream(new File(uri)));
		request.setAttribute("emailAddress", buffer.toString());

		return mapping.findForward("emailmanager");
	}

	public ActionForward jobSyncByHand(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {
			DataSynToAIGServiceImpl service = new DataSynToAIGServiceImpl();
			String strChecked = request.getParameter("strChecked");
			String[] arrChecked = strChecked.split(",");
			for (int i = 0; i < arrChecked.length; i++) {
				service.dataSyncToAigService(arrChecked[i]);
			}
			write("{result:'yes'}", response);
		} catch (Exception e) {
			write("{result:'no'}", response);
			throw new RuntimeException(e);
		}
		return mapping.findForward(null);
	}

	public ActionForward jobSyncHistoryDel(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		Dto vDto = new BaseDto();
		try {
			if ((dto.get("flag") != null) && (dto.get("flag").equals("2"))) {
				this.jobMangerService.delSyncHistory(dto);
			} else {
				String strChecked = request.getParameter("strChecked");
				String[] arrChecked = strChecked.split(",");
				for (int i = 0; i < arrChecked.length; i++) {
					vDto.put("functionname", arrChecked[i]);
					this.jobMangerService.delSyncHistory(vDto);
				}
			}
			write("{result:'yes'}", response);
		} catch (Exception e) {
			write("{result:'no'}", response);
			throw new RuntimeException(e);
		}
		return mapping.findForward(null);
	}

	public ActionForward jobReportHistoryList(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List list = this.g4Reader.queryForPage("job.getreport_history", dto);
		Integer countInteger = (Integer) this.g4Reader.queryForObject(
				"job.getreport_historyCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(list, countInteger,
				"yyyy-MM-dd hh:mm:ss");
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward jobMangerInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("jobmanager");
	}

	public ActionForward jobMangerList(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);

		List list = this.g4Reader.queryForPage("job.getqrtz_triggers", dto);
		String temp = null;
		long val = 0L;
		for (int i = 0; i < list.size(); i++) {
			Dto map = new BaseDto();
			map = (Dto) list.get(i);
			temp = MapUtils.getString(map, "trigger_name");
			if (StringUtils.indexOf(temp, "&") != -1)
				map.put("display_name", StringUtils.substringBefore(temp, "&"));
			else {
				map.put("display_name", temp);
			}
			val = MapUtils.getLongValue(map, "next_fire_time");
			if (val > 0L) {
				map.put("next_fire_time", DateFormatUtils.format(val,
						"yyyy-MM-dd HH:mm:ss"));
			}

			val = MapUtils.getLongValue(map, "prev_fire_time");
			if (val > 0L) {
				map.put("prev_fire_time", DateFormatUtils.format(val,
						"yyyy-MM-dd HH:mm:ss"));
			}
			String startteim = "0";
			val = MapUtils.getLongValue(map, "start_time");
			if (val > 0L) {
				map.put("start_time", DateFormatUtils.format(val,
						"yyyy-MM-dd HH:mm:ss"));
				startteim = DateFormatUtils.format(val, "yyyy-MM-dd HH:mm");
			}
			String endtime = "0";
			val = MapUtils.getLongValue(map, "end_time");
			if (val > 0L) {
				map.put("end_time", DateFormatUtils.format(val,
						"yyyy-MM-dd HH:mm:ss"));
				endtime = DateFormatUtils.format(val, "yyyy-MM-dd HH:mm");
			}
			map.put("trigger_state", JobConstant.status.get(MapUtils.getString(
					map, "trigger_state")));

			map.put("yearfrom", startteim.equals("0") ? "2012-01-01 00:00"
					: startteim);
			map.put("yearto", endtime.equals("0") ? "2099-03-29 00" : endtime);
			map.put("year", Boolean.valueOf(true));

			String cron_expression = MapUtils.getString(map, "cron_expression");
			String[] cronsplit = cron_expression.split(" ");

			for (int j = 0; j < cronsplit.length; j++) {
				switch (j) {
				case 0:
					break;
				case 1:
					String minute = cronsplit[1];
					if (minute.indexOf("/") > -1) {
						map.put("From", minute.split("/")[0]);
						map.put("every", minute.split("/")[1]);
						map.put("Cyle", Boolean.valueOf(true));
						map.put("assign", Boolean.valueOf(false));
					} else {
						for (int k = 0; k < minute.split(",").length; k++) {
							map.put("M" + minute.split(",")[k], "on");
						}
						map.put("assign", Boolean.valueOf(true));
						map.put("Cyle", Boolean.valueOf(false));
					}
					break;
				case 2:
					String hour = cronsplit[2];
					if (hour.indexOf("*") > -1) {
						map.put("PHour", Boolean.valueOf(true));
						map.put("CHour", Boolean.valueOf(false));
					} else {
						for (int k = 0; k < hour.split(",").length; k++) {
							map.put("H" + hour.split(",")[k], "on");
						}
						map.put("CHour", Boolean.valueOf(true));
					}
					break;
				case 3:
					String day = cronsplit[3];
					if ((day.indexOf("*") > -1) || (day.indexOf("?") > -1)) {
						map.put("standday", Boolean.valueOf(false));
						map.put("perday", Boolean.valueOf(true));
					} else {
						for (int k = 0; k < day.split(",").length; k++) {
							map.put("D" + day.split(",")[k], "on");
						}
						map.put("standday", Boolean.valueOf(true));
					}
					break;
				case 4:
					String month = cronsplit[4];
					if (month.indexOf("*") > -1) {
						map.put("Standmonth", Boolean.valueOf(false));
						map.put("perMoth", Boolean.valueOf(true));
					} else {
						for (int k = 0; k < month.split(",").length; k++) {
							map.put("MM" + month.split(",")[k], "on");
						}
						map.put("Standmonth", Boolean.valueOf(true));
					}
					break;
				case 5:
					String week = cronsplit[5];
					if ((week.indexOf("*") > -1) || (week.indexOf("?") > -1)) {
						map.put("Standweek", Boolean.valueOf(false));
						map.put("Useweek", Boolean.valueOf(false));
					} else {
						for (int k = 0; k < week.split(",").length; k++) {
							map.put("week" + week.split(",")[k], "on");
						}
						map.put("Standweek", Boolean.valueOf(true));
						map.put("Useweek", Boolean.valueOf(true));
					}
					break;
				case 6:
					String year = cronsplit[6];
					String nowDateStr = G4Utils.getCurDate();
					int nowN = Integer.parseInt(nowDateStr.substring(0,
							nowDateStr.indexOf("-")));
					for (int k = 0; k < 10; k++) {
						int myYear = nowN + k;
						for (int u = 0; u < year.split(",").length; u++) {
							int useYearint = Integer
									.parseInt(year.split(",")[u]);
							if (myYear == useYearint) {
								map.put("Y" + (k + 1), "on");
							}

						}

					}

					map.put("standeryear", Boolean.valueOf(true));
				}

			}

			list.set(i, map);
		}

		Integer countInteger = (Integer) this.g4Reader.queryForObject(
				"job.countCatalogsForGridDemo", dto);
		String jsonString = JsonHelper.encodeList2PageJson(list, countInteger,
				"yyyy-MM-dd");
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward jobMangerSave(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		System.out.println("作业保存!!!");
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		System.out.println(dto.toJson());
		StringBuilder jobString = new StringBuilder();
		jobString.append("0 ");
		String assign = (String) dto.get("assign");
		int useComma = 0;
		if (assign != null) {
			for (int i = 0; i < 60; i++)
				if (dto.get("M" + i) != null) {
					jobString.append("," + i);
					useComma++;
				}
		} else {
			jobString.append(dto.get("From") + "/" + dto.get("every"));
		}
		jobString.append(" ");
		String chour = (String) dto.get("CHour");
		if (chour != null) {
			useComma = 0;
			for (int i = 0; i < 24; i++)
				if (dto.get("H" + i) != null) {
					jobString.append("," + i);
					useComma++;
				}
		} else {
			jobString.append("*");
		}
		jobString.append(" ");
		String standday = (String) dto.get("standday");
		if (standday != null) {
			useComma = 1;
			for (int i = 1; i < 33; i++)
				if (dto.get("D" + i) != null) {
					jobString.append("," + i);
					useComma++;
				}
		} else {
			jobString.append("?");
		}
		jobString.append(" ");
		String standmonth = (String) dto.get("Standmonth");
		if (standmonth != null) {
			useComma = 1;
			for (int i = 1; i < 13; i++)
				if (dto.get("MM" + i) != null) {
					jobString.append("," + i);
					useComma++;
				}
		} else {
			jobString.append("*");
		}
		jobString.append(" ");

		String standweek = (String) dto.get("Standweek");
		String useweek = (String) dto.get("Useweek");
		if (useweek != null) {
			useComma = 1;
			if (standweek != null) {
				for (int i = 1; i < 8; i++) {
					if (dto.get("week" + i) != null) {
						jobString.append("," + i);
						useComma++;
					}
				}
			}
		} else if (standday != null) {
			jobString.append("?");
		} else {
			jobString.append("*");
		}

		jobString.append(" ");

		Date startTime = new Date();
		Date endTime = new Date();

		String year = (String) dto.get("year");
		if (year != null) {
			String yearfrom = (String) dto.get("yearfrom");
			String yearto = (String) dto.get("yearto");
			startTime = this.schedulerService.parseDate(yearfrom);
			endTime = this.schedulerService.parseDate(yearto);
		} else {
			startTime = this.schedulerService.parseDate("2012-01-01 00:00");
			endTime = this.schedulerService.parseDate("2999-01-01 00:00");
		}
		String standeryear = (String) dto.get("standeryear");
		if (standeryear != null) {
			useComma = 1;
			String nowDateStr = G4Utils.getCurDate();
			int nowN = Integer.parseInt(nowDateStr.substring(0, nowDateStr
					.indexOf("-")));
			for (int i = 1; i < 11; i++) {
				if (dto.get("Y" + i) != null) {
					jobString.append("," + (nowN + (i - 1)));
					useComma++;
				}
			}
		}
		System.out.println("jobStirng:" + jobString.toString());
		this.schedulerService.schedule(dto.get("trigger_name").toString(),
				jobString.toString(), startTime, endTime, "DEFAULT");
		setOkTipMsg("保存成功", response);

		Dto vDto = new BaseDto();
		vDto.put("saprfcname", dto.get("trigger_name"));
		vDto.put("syncstate", "1");
		this.jobMangerService.updateSyncState(vDto);
		return mapping.findForward(null);
	}

	public ActionForward jobMangerUpdate(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		System.out.println(dto.toJson());
		StringBuilder jobString = new StringBuilder();
		jobString.append("0 ");
		String assign = (String) dto.get("assign");
		int useComma = 0;
		if (assign != null) {
			for (int i = 0; i < 60; i++)
				if (dto.get("M" + i) != null) {
					jobString.append("," + i);
					useComma++;
				}
		} else {
			jobString.append(dto.get("From") + "/" + dto.get("every"));
		}
		jobString.append(" ");
		String chour = (String) dto.get("CHour");
		if (chour != null) {
			useComma = 0;
			for (int i = 0; i < 24; i++)
				if (dto.get("H" + i) != null) {
					jobString.append("," + i);
					useComma++;
				}
		} else {
			jobString.append("*");
		}
		jobString.append(" ");
		String standday = (String) dto.get("standday");
		if (standday != null) {
			useComma = 1;
			for (int i = 1; i < 33; i++)
				if (dto.get("D" + i) != null) {
					jobString.append("," + i);
					useComma++;
				}
		} else {
			jobString.append("?");
		}
		jobString.append(" ");
		String standmonth = (String) dto.get("Standmonth");
		if (standmonth != null) {
			useComma = 1;
			for (int i = 1; i < 13; i++)
				if (dto.get("MM" + i) != null) {
					jobString.append("," + i);
					useComma++;
				}
		} else {
			jobString.append("*");
		}
		jobString.append(" ");

		String standweek = (String) dto.get("Standweek");
		String useweek = (String) dto.get("Useweek");
		if (useweek != null) {
			useComma = 1;
			if (standweek != null) {
				for (int i = 1; i < 8; i++) {
					if (dto.get("week" + i) != null) {
						jobString.append("," + i);
						useComma++;
					}
				}
			}
		} else if (standday != null) {
			jobString.append("?");
		} else {
			jobString.append("*");
		}

		jobString.append(" ");

		Date startTime = new Date();
		Date endTime = new Date();

		String year = (String) dto.get("year");
		if (year != null) {
			String yearfrom = (String) dto.get("yearfrom");
			String yearto = (String) dto.get("yearto");
			startTime = this.schedulerService.parseDate(yearfrom);
			endTime = this.schedulerService.parseDate(yearto);
		} else {
			startTime = this.schedulerService.parseDate("2012-01-01 00:00");
			endTime = this.schedulerService.parseDate("2999-01-01 00:00");
		}
		String standeryear = (String) dto.get("standeryear");
		if (standeryear != null) {
			useComma = 1;
			String nowDateStr = G4Utils.getCurDate();
			int nowN = Integer.parseInt(nowDateStr.substring(0, nowDateStr
					.indexOf("-")));
			for (int i = 1; i < 11; i++) {
				if (dto.get("Y" + i) != null) {
					jobString.append("," + (nowN + useComma));
					useComma++;
				}
			}
		}
		String trigger_name = dto.get("trigger_name").toString();
		String trigger_group = dto.get("trigger_group").toString();
		this.schedulerService.removeTrigdger(trigger_name, trigger_group);
		trigger_name = trigger_name.indexOf("&") > -1 ? trigger_name.substring(
				0, trigger_name.indexOf("&")) : trigger_name;
		this.schedulerService.schedule(trigger_name, jobString.toString(),
				startTime, endTime, "DEFAULT");

		setOkTipMsg("修改成功", response);
		return mapping.findForward(null);
	}

	public ActionForward jobMangerDel(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		String strChecked = request.getParameter("strChecked");
		String strChecked2 = request.getParameter("strChecked2");
		String[] arrChecked = strChecked.split(",");
		String[] arrChecked2 = strChecked2.split(",");
		Dto vDto = new BaseDto();
		vDto.put("syncstate", Integer.valueOf(2));
		for (int i = 0; i < arrChecked.length; i++) {
			String triggerName = arrChecked[i];
			this.schedulerService.removeTrigdger(arrChecked[i], arrChecked2[i]);
			vDto.put("functionname", triggerName);
			this.jobMangerService.delSyncHistory(vDto);
			triggerName = triggerName.indexOf('&') > 0 ? triggerName.substring(
					0, triggerName.indexOf('&')) : triggerName;
			vDto.put("quartzname", triggerName);
			this.jobMangerService.delSyncState(vDto);
		}
		setOkTipMsg("删除成功", response);
		return mapping.findForward(null);
	}

	public ActionForward jobMangerStop(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		String strChecked = request.getParameter("strChecked");
		String strChecked2 = request.getParameter("strChecked2");
		String[] arrChecked = strChecked.split(",");
		String[] arrChecked2 = strChecked2.split(",");
		for (int i = 0; i < arrChecked.length; i++) {
			this.schedulerService.pauseTrigger(arrChecked[i], arrChecked2[i]);
		}
		setOkTipMsg("暂停成功", response);
		return mapping.findForward(null);
	}

	public ActionForward jobMangerRestore(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String strChecked = request.getParameter("strChecked");
		String strChecked2 = request.getParameter("strChecked2");
		String[] arrChecked = strChecked.split(",");
		String[] arrChecked2 = strChecked2.split(",");
		for (int i = 0; i < arrChecked.length; i++) {
			this.schedulerService.resumeTrigger(arrChecked[i], arrChecked2[i]);
		}
		setOkTipMsg("恢复成功", response);
		return mapping.findForward(null);
	}
}