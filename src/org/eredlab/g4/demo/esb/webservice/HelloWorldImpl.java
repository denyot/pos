package org.eredlab.g4.demo.esb.webservice;

import javax.jws.WebService;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.ccl.xml.XmlHelper;

@WebService
public class HelloWorldImpl implements HelloWorld {
	public String sayHello(String text) {
		return "Hello," + text;
	}

	public String queryBalanceInfo(String jsbh) {
		IReader reader = (IReader) SpringBeanLoader.getSpringBean("g4Reader");
		Dto inDto = new BaseDto("sxh", jsbh);
		String sql = "Demo.queryBalanceInfoMysql";
		if (G4Utils.defaultJdbcTypeOracle()) {
			sql = "Demo.queryBalanceInfo";
		}
		Dto outDto = (BaseDto) reader.queryForObject(sql, inDto);
		String outXml = XmlHelper.parseDto2Xml(outDto, "root", "balanceInfo");
		return outXml;
	}
}