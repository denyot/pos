package org.eredlab.g4.demo.web;

import java.io.PrintStream;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.demo.service.DemoService;

public class DoTransactionClient {
	public static void main(String[] args) {
		DemoService demoService = (DemoService) SpringBeanLoader
				.getSpringBean("demoService");
		Dto outDto = demoService.doTransactionTest();
		System.out.println("返回值:\n" + outDto);
	}
}