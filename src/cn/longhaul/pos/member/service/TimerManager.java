package cn.longhaul.pos.member.service;

import java.util.Calendar;
import java.util.Date;
import java.util.Timer;

/**
 * 定时管理
 */
public class TimerManager {
    //周期(一天)
    private static final long PERIOD_DAY = 24 * 60 * 60 * 1000;

    public TimerManager() {
        Calendar calendar = Calendar.getInstance();
        /**
         * 定制执行时间,时分秒
         */
        calendar.set(Calendar.HOUR_OF_DAY, 16);
        calendar.set(Calendar.MINUTE, 10);
        calendar.set(Calendar.SECOND, 30);
        Date date = calendar.getTime(); //第一次执行定时任务的时间
        System.out.println(date);
        System.out.println("启动服务器时间是否晚于任务执行时间：" + date.before(new Date()));
        //如果第一次执行定时任务的时间小于当前的时间
        //此时要在第一次执行定时任务的时间加一天，以便此任务在下个时间点执行。如果不加一天，任务会立即执行。循环执行的周期则以当前时间为准
        if (date.before(new Date())) {
            date = this.addDay(date, 1);
            System.out.println(date);
        }
        Timer timer = new Timer();
        MemberBirthdayTask task = new MemberBirthdayTask();
        //安排指定的任务在指定的时间开始以指定周期执行(单位ms)。
        timer.schedule(task, date, PERIOD_DAY);
    }

    // 增加或减少天数
    public Date addDay(Date date, int num) {
        Calendar startDT = Calendar.getInstance();
        startDT.setTime(date);
        startDT.add(Calendar.DAY_OF_MONTH, num);
        return startDT.getTime();
    }
}