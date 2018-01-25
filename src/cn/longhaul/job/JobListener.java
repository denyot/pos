package cn.longhaul.job;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;

public class JobListener implements ServletContextListener {
	public void contextDestroyed(ServletContextEvent arg0) {
		Scheduler job = (Scheduler) SpringBeanLoader.getSpringBean("quartzScheduler");
		try {
			if (job.isStarted()) {
				job.shutdown();
				Thread.sleep(1000L);
			}
		} catch (SchedulerException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}

	public void contextInitialized(ServletContextEvent arg0) {
	}
}