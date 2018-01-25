package cn.longhaul.job.quartzservice;

import java.text.ParseException;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.apache.commons.lang.time.DateUtils;
import org.quartz.CronExpression;
import org.quartz.CronTrigger;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SimpleTrigger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SchedulerServiceImpl implements SchedulerService {
	private Scheduler scheduler;
	private JobDetail jobDetail;
	private static final Logger logger = LoggerFactory
			.getLogger(SchedulerServiceImpl.class);

	public void setJobDetail(JobDetail jobDetail) {
		this.jobDetail = jobDetail;
	}

	public void setScheduler(Scheduler scheduler) {
		this.scheduler = scheduler;
	}

	public void schedule(String cronExpression) {
		schedule("", cronExpression);
	}

	public void schedule(String name, String cronExpression) {
		schedule(name, cronExpression, "DEFAULT");
	}

	public void schedule(String name, String cronExpression, String group) {
		try {
			schedule(name, new CronExpression(cronExpression), group);
		} catch (ParseException e) {
			throw new RuntimeException(e);
		}
	}

	public void schedule(CronExpression cronExpression) {
		schedule(null, cronExpression);
	}

	public void schedule(String name, CronExpression cronExpression) {
		schedule(name, cronExpression, "DEFAULT");
	}

	public void schedule(String name, CronExpression cronExpression, String group) {
		if ((name == null) || (name.trim().equals(""))) {
			name = UUID.randomUUID().toString();
		} else {
			name = name + "&" + UUID.randomUUID().toString();
		}
		try {
			this.scheduler.addJob(this.jobDetail, true);
			CronTrigger cronTrigger = new CronTrigger(name, group, this.jobDetail.getName(), "DEFAULT");
			cronTrigger.setCronExpression(cronExpression);
			this.scheduler.scheduleJob(cronTrigger);
			this.scheduler.rescheduleJob(cronTrigger.getName(), cronTrigger.getGroup(), cronTrigger);
		} catch (SchedulerException e) {
			throw new RuntimeException(e);
		}
	}

	public void schedule(Date startTime) {
		schedule(startTime, "DEFAULT");
	}

	public void schedule(Date startTime, String group) {
		schedule(startTime, null, group);
	}

	public void schedule(String name, Date startTime) {
		schedule(name, startTime, "DEFAULT");
	}

	public void schedule(String name, Date startTime, String group) {
		schedule(name, startTime, null, group);
	}

	public void schedule(Date startTime, Date endTime) {
		schedule(startTime, endTime, "DEFAULT");
	}

	public void schedule(Date startTime, Date endTime, String group) {
		schedule(startTime, endTime, 0, group);
	}

	public void schedule(String name, Date startTime, Date endTime) {
		schedule(name, startTime, endTime, "DEFAULT");
	}

	public void schedule(String name, Date startTime, Date endTime, String group) {
		schedule(name, startTime, endTime, 0, group);
	}

	public void schedule(Date startTime, Date endTime, int repeatCount) {
		schedule(startTime, endTime, 0, "DEFAULT");
	}

	public void schedule(Date startTime, Date endTime, int repeatCount,
			String group) {
		schedule(null, startTime, endTime, 0, group);
	}

	public void schedule(String name, Date startTime, Date endTime,
			int repeatCount) {
		schedule(name, startTime, endTime, 0, "DEFAULT");
	}

	public void schedule(String name, Date startTime, Date endTime,
			int repeatCount, String group) {
		schedule(name, startTime, endTime, 0, 1L, group);
	}

	public void schedule(Date startTime, Date endTime, int repeatCount,
			long repeatInterval) {
		schedule(startTime, endTime, repeatCount, repeatInterval, "DEFAULT");
	}

	public void schedule(Date startTime, Date endTime, int repeatCount,
			long repeatInterval, String group) {
		schedule(null, startTime, endTime, repeatCount, repeatInterval, group);
	}

	public void schedule(String name, Date startTime, Date endTime,
			int repeatCount, long repeatInterval) {
		schedule(name, startTime, endTime, repeatCount, repeatInterval,
				"DEFAULT");
	}

	public void schedule(String name, Date startTime, Date endTime,
			int repeatCount, long repeatInterval, String group) {
		if ((name == null) || (name.trim().equals(""))) {
			name = UUID.randomUUID().toString();
		} else {
			name = name + "&" + UUID.randomUUID().toString();
		}
		try {
			this.scheduler.addJob(this.jobDetail, true);

			SimpleTrigger SimpleTrigger = new SimpleTrigger(name, group,
					this.jobDetail.getName(), "DEFAULT", startTime, endTime,
					repeatCount, repeatInterval);
			this.scheduler.scheduleJob(SimpleTrigger);
			this.scheduler.rescheduleJob(SimpleTrigger.getName(), SimpleTrigger
					.getGroup(), SimpleTrigger);
		} catch (SchedulerException e) {
			throw new RuntimeException(e);
		}
	}

	public void schedule(Map<String, String> map) {
		String temp = null;

		SimpleTrigger SimpleTrigger = new SimpleTrigger();

		SimpleTrigger.setJobName(this.jobDetail.getName());
		SimpleTrigger.setJobGroup("DEFAULT");
		SimpleTrigger.setRepeatInterval(1000L);

		temp = (String) map.get("triggerName");
		if (StringUtils.isEmpty(StringUtils.trim(temp))) {
			temp = UUID.randomUUID().toString();
		} else {
			temp = temp + "&" + UUID.randomUUID().toString();
		}
		SimpleTrigger.setName(temp);

		temp = (String) map.get("triggerGroup");
		if (StringUtils.isEmpty(temp)) {
			temp = "DEFAULT";
		}
		SimpleTrigger.setGroup(temp);

		temp = (String) map.get("startTime");
		if (StringUtils.isNotEmpty(temp)) {
			SimpleTrigger.setStartTime(parseDate(temp));
		}

		temp = (String) map.get("endTime");
		if (StringUtils.isNotEmpty(temp)) {
			SimpleTrigger.setEndTime(parseDate(temp));
		}

		temp = (String) map.get("repeatCount");
		if ((StringUtils.isNotEmpty(temp)) && (NumberUtils.toInt(temp) > 0)) {
			SimpleTrigger.setRepeatCount(NumberUtils.toInt(temp));
		}

		temp = (String) map.get("repeatInterval");
		if ((StringUtils.isNotEmpty(temp)) && (NumberUtils.toLong(temp) > 0L)) {
			SimpleTrigger.setRepeatInterval(NumberUtils.toLong(temp) * 1000L);
		}
		try {
			this.scheduler.addJob(this.jobDetail, true);

			this.scheduler.scheduleJob(SimpleTrigger);
			this.scheduler.rescheduleJob(SimpleTrigger.getName(), SimpleTrigger
					.getGroup(), SimpleTrigger);
		} catch (SchedulerException e) {
			throw new RuntimeException(e);
		}
	}

	public void pauseTrigger(String triggerName, String group) {
		try {
			this.scheduler.pauseTrigger(triggerName, group);
		} catch (SchedulerException e) {
			throw new RuntimeException(e);
		}
	}

	public void resumeTrigger(String triggerName, String group) {
		try {
			this.scheduler.resumeTrigger(triggerName, group);
		} catch (SchedulerException e) {
			throw new RuntimeException(e);
		}
	}

	public boolean removeTrigdger(String triggerName, String group) {
		try {
			this.scheduler.pauseTrigger(triggerName, group);
			return this.scheduler.unscheduleJob(triggerName, group);
		} catch (SchedulerException e) {
			throw new RuntimeException(e);
		}
	}

	public Date parseDate(String time) {
		try {
			return DateUtils.parseDate(time,
					new String[] { "yyyy-MM-dd HH:mm" });
		} catch (ParseException e) {
			logger.error("日期格式错误{}，正确格式为：yyyy-MM-dd HH:mm", time);
			throw new RuntimeException(e);
		}
	}

	public List<Map<String, Object>> getQrtzTriggers() {
		return null;
	}

	public void schedule(String name, String cronExpression, Date startTime,
			Date endTime, String group) {
		if ((name == null) || (name.trim().equals(""))) {
			name = UUID.randomUUID().toString();
		} else
			name = name + "&" + UUID.randomUUID().toString();
		try {
			this.scheduler.addJob(this.jobDetail, true);
			CronTrigger cronTrigger = new CronTrigger(name, group,
					this.jobDetail.getName(), "DEFAULT", startTime, endTime,
					cronExpression);
			this.scheduler.scheduleJob(cronTrigger);
			this.scheduler.rescheduleJob(cronTrigger.getName(), cronTrigger
					.getGroup(), cronTrigger);
		} catch (SchedulerException e) {
			e.printStackTrace();
		} catch (ParseException e) {
			e.printStackTrace();
		}
	}
}