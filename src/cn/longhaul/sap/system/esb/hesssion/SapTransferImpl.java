package cn.longhaul.sap.system.esb.hesssion;

import cn.longhaul.exception.LonghaulException;
import cn.longhaul.sap.system.aig.AigTransferInfo;
import cn.longhaul.sap.system.connection.ConnectionBase;
import cn.longhaul.sap.system.connection.SapConnection;
import cn.longhaul.sap.system.info.TransferInfo;
import com.sap.conn.jco.JCoFunction;
import java.util.Date;
import javax.servlet.ServletRequest;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.arm.service.RFCMonitorService;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.util.G4Utils;

public class SapTransferImpl implements SapTransfer {
	private Log log = LogFactory.getLog(SapTransferImpl.class);
	private RFCMonitorService rfcService = (RFCMonitorService) SpringBeanLoader
			.getSpringBean("rfcMonitorService");

	public AigTransferInfo transferInfoAig(String functionName,
			AigTransferInfo transferInfo) throws Exception {
		Date startTime = new Date();
		StringBuffer exceptionStr = new StringBuffer();
		this.log.info("开始调用函数" + functionName + "，开始时间："
				+ G4Utils.getCurrentTime());

		AigTransferInfo outTransferInfo = new TransferInfo();

		ServletRequest request = HessianContext.getRequest();

		Integer id = null;
		try {
			id = Integer.valueOf(this.rfcService.saveStartParam(functionName,
					transferInfo, startTime, request));
		} catch (Exception e1) {
			e1.printStackTrace();
		}
		SapConnection connect;
		Date endTime;
		double lastTime;
		try {
			connect = new SapConnection();
			ConnectionBase ConnectionBase = new ConnectionBase();
			JCoFunction function = connect.getFunction(functionName);
			if (transferInfo != null)
				ConnectionBase.setFunctionParas(transferInfo, function);
			connect.execute(function);
			outTransferInfo = ConnectionBase.functionExectue(function,
					transferInfo);
		} catch (LonghaulException e) {
			outTransferInfo = null;
			e.printStackTrace();
			exceptionStr.append(e.toString());
			throw new Exception(e.toString());
		} catch (Exception e) {
			outTransferInfo = null;
			e.printStackTrace();
			exceptionStr.append(e.toString());
			throw new Exception(e.toString());
		} finally {
			endTime = new Date();
			this.log.info("调用函数" + functionName + "结束，结束时间："
					+ G4Utils.getCurrentTime());

			lastTime = (endTime.getTime() - startTime.getTime()) / 1000.0D;

			this.log.info("调用函数" + functionName + "持续时间：" + lastTime);
			try {
				this.rfcService.saveEndParam(id.intValue(), outTransferInfo,
						startTime, endTime, exceptionStr.toString());
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		return outTransferInfo;
	}
}