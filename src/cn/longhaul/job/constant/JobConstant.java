package cn.longhaul.job.constant;

import java.util.HashMap;
import java.util.Map;

public class JobConstant {
	public static final String TRIGGERNAME = "triggerName";
	public static final String TRIGGERGROUP = "triggerGroup";
	public static final String STARTTIME = "startTime";
	public static final String ENDTIME = "endTime";
	public static final String REPEATCOUNT = "repeatCount";
	public static final String REPEATINTERVEL = "repeatInterval";
	public static final Map<String, String> status = new HashMap();

	static {
		status.put("ACQUIRED", "运行中");
		status.put("PAUSED", "暂停中");
		status.put("WAITING", "等待中");
		status.put("ERROR", "错误");
	}
}