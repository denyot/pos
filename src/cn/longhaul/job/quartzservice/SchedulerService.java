package cn.longhaul.job.quartzservice;

import java.util.Date;
import java.util.List;
import java.util.Map;
import org.quartz.CronExpression;

public abstract interface SchedulerService {
	public abstract void schedule(String paramString);

	public abstract void schedule(String paramString1, String paramString2);

	public abstract void schedule(String paramString1, String paramString2,
			String paramString3);

	public abstract void schedule(CronExpression paramCronExpression);

	public abstract void schedule(String paramString,
			CronExpression paramCronExpression);

	public abstract void schedule(String paramString1,
			CronExpression paramCronExpression, String paramString2);

	public abstract void schedule(Date paramDate);

	public abstract void schedule(Date paramDate, String paramString);

	public abstract void schedule(String paramString, Date paramDate);

	public abstract void schedule(String paramString1, Date paramDate,
			String paramString2);

	public abstract void schedule(Date paramDate1, Date paramDate2);

	public abstract void schedule(Date paramDate1, Date paramDate2,
			String paramString);

	public abstract void schedule(String paramString, Date paramDate1,
			Date paramDate2);

	public abstract void schedule(String paramString1, Date paramDate1,
			Date paramDate2, String paramString2);

	public abstract void schedule(Date paramDate1, Date paramDate2, int paramInt);

	public abstract void schedule(Date paramDate1, Date paramDate2,
			int paramInt, String paramString);

	public abstract void schedule(String paramString, Date paramDate1,
			Date paramDate2, int paramInt);

	public abstract void schedule(String paramString1, Date paramDate1,
			Date paramDate2, int paramInt, String paramString2);

	public abstract void schedule(Date paramDate1, Date paramDate2,
			int paramInt, long paramLong);

	public abstract void schedule(Date paramDate1, Date paramDate2,
			int paramInt, long paramLong, String paramString);

	public abstract void schedule(String paramString, Date paramDate1,
			Date paramDate2, int paramInt, long paramLong);

	public abstract void schedule(String paramString1, Date paramDate1,
			Date paramDate2, int paramInt, long paramLong, String paramString2);

	public abstract void schedule(Map<String, String> paramMap);

	public abstract List<Map<String, Object>> getQrtzTriggers();

	public abstract void pauseTrigger(String paramString1, String paramString2);

	public abstract void resumeTrigger(String paramString1, String paramString2);

	public abstract boolean removeTrigdger(String paramString1,
			String paramString2);

	public abstract void schedule(String paramString1, String paramString2,
			Date paramDate1, Date paramDate2, String paramString3);

	public abstract Date parseDate(String paramString);
}