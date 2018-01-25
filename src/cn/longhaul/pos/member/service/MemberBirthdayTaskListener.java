package cn.longhaul.pos.member.service;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

/**
 * 监听器,服务器启动时运行定时任务
 */
public class MemberBirthdayTaskListener implements ServletContextListener {

    public void contextInitialized(ServletContextEvent sce) {
        new TimerManager();
    }

    public void contextDestroyed(ServletContextEvent sce) {

    }
}