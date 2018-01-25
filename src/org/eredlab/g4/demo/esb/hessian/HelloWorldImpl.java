package org.eredlab.g4.demo.esb.hessian;

import java.io.PrintStream;
import java.util.List;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.util.G4Utils;

public class HelloWorldImpl implements HelloWorld {
	public String sayHello(String text) {
		System.out.println("hello 测试" + text);
		return "Hello," + text;
	}

	public Dto queryBalanceInfo(String jsbh) {
		IReader reader = (IReader) SpringBeanLoader.getSpringBean("g4Reader");
		Dto inDto = new BaseDto("sxh", jsbh);
		String sql = "Demo.queryBalanceInfoMysql";
		if (G4Utils.defaultJdbcTypeOracle()) {
			sql = "Demo.queryBalanceInfo";
		}
		Dto outDto = (BaseDto) reader.queryForObject(sql, inDto);
		return outDto;
	}

	public List queryBalanceInfoLimitRownum(Integer rownum) {
		IReader reader = (IReader) SpringBeanLoader.getSpringBean("g4Reader");
		Dto inDto = new BaseDto("rownum", rownum);

		String sql = "Demo.queryBalanceInfoMysql";
		if (G4Utils.defaultJdbcTypeOracle()) {
			sql = "Demo.queryBalanceInfo";
		}
		List outList = reader.queryForList(sql, inDto);
		return outList;
	}
}