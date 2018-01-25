package cn.longhaul.job;

import cn.longhaul.job.constant.SentEmail;
import cn.longhaul.job.service.JobMangerService;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.Trigger;
import org.springframework.scheduling.quartz.QuartzJobBean;

public class JobBean extends QuartzJobBean {
	private JobService jobService;
	private JobMangerService mangerService;

	public void init() {
		this.mangerService = ((JobMangerService) SpringBeanLoader
				.getSpringBean("jobMangerService"));
	}

	public void setJobService(JobService jobService) {
		this.jobService = jobService;
	}

	public void setMangerService(JobMangerService mangerService) {
		this.mangerService = mangerService;
	}

	protected void executeInternal(JobExecutionContext jobexecutioncontext)
			throws JobExecutionException {
		Trigger trigger = jobexecutioncontext.getTrigger();
		String triggerName = trigger.getName();

		Dto dto = new BaseDto();
		dto.put("functionname", triggerName);
		dto.put("detail", "执行成功");
		dto.put("executestate", Integer.valueOf(1));
		dto.put("quartzname", triggerName);
		try {
			this.jobService.testMethod(triggerName);
			dto.put("detail", "执行成功");
			dto.put("executestate", Integer.valueOf(1));
		} catch (Exception e) {
			try {
				SentEmail.send(triggerName
						+ " 事件执行处错\n错误信息:\n JobBean(class)->executeInternal \n"
						+ e.getMessage());
			} catch (Exception e1) {
				e1.printStackTrace();
			}
			dto.put("detail", e.getMessage());
			dto.put("executestate", Integer.valueOf(2));
			try {
				if (this.mangerService == null)
					init();
				this.mangerService.saveReportHistory(dto);
			} catch (Exception e1) {
				e1.printStackTrace();
			}
		} finally {
			try {
				if (this.mangerService == null)
					init();
				this.mangerService.saveReportHistory(dto);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
}