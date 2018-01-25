package cn.longhaul.pos.member.service;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;
import java.util.TimerTask;

/**
 * 会员生日任务
 */
public class MemberBirthdayTask extends TimerTask {
	private static SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	//获取userDao bean
	ApplicationContext context = new ClassPathXmlApplicationContext(
			new String[]{"config/global.config.xml"});
	UserDao userDao = (UserDao) context
			.getBean("userDao");
	@Override
	public void run() {
		try {
			List<User> memberList = userDao.getUserList();
			SendMemberBirthdayMsg sendMemberBirthdayMsg = new SendMemberBirthdayMsg();
			if (memberList != null) {
				for (User m : memberList) {
					sendMemberBirthdayMsg.sendMemberBirthdayMsg(m);
				}
			}
			System.out.println("执行当前时间" + formatter.format(Calendar.getInstance().getTime()));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}