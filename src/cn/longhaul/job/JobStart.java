package cn.longhaul.job;

import org.quartz.Scheduler;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class JobStart {
	public static void main(String[] args) {
		ApplicationContext context = new ClassPathXmlApplicationContext(
				"cn/longhaul/job/globaltest.xml");
		Scheduler job = (Scheduler) context.getBean("quartzScheduler");
		try {
			job.start();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	public static void jobstart() {
		ApplicationContext context = new ClassPathXmlApplicationContext(
				"cn/longhaul/job/globaltest.xml");
		Scheduler job = (Scheduler) context.getBean("quartzScheduler");
		try {
			job.start();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}
}