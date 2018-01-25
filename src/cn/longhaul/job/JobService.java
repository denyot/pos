package cn.longhaul.job;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import cn.longhaul.sap.system.datasyn.DataSynToAIGServiceImpl;

public class JobService implements Serializable {
	private static final long serialVersionUID = 122323233244334343L;
	private static final Logger logger = LoggerFactory.getLogger(JobService.class);

	public void testMethod(String triggerName) throws Exception {
		System.out.println("执行定时调度业务" + triggerName);
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String date = format.format(new Date());
		System.out.println(date + " 当前 " + triggerName + " 正在执行");

		triggerName = triggerName.indexOf('&') > 0 ? triggerName.substring(0,
				triggerName.indexOf('&')) : triggerName;

		System.out.println("开始同步SAP函数：" + triggerName);

		DataSynToAIGServiceImpl service = new DataSynToAIGServiceImpl();
		try {
			service.dataSyncToAigService(triggerName);
		} catch (Exception e) {
			throw new RuntimeException("执行失败：JobService(class)->testMethod :\n"
					+ e.getMessage());
		}
	}

	public void testMethod2() {
	}
}