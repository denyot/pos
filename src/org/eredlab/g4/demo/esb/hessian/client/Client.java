package org.eredlab.g4.demo.esb.hessian.client;

import com.caucho.hessian.client.HessianProxyFactory;
import java.io.PrintStream;
import java.net.MalformedURLException;
import java.util.Date;
import java.util.List;

public class Client {
	public static void main(String[] args) {
		String url = "http://127.0.0.1/CHJ_G4/esb/hessian/helloWorldService";
		HessianProxyFactory factory = new HessianProxyFactory();
		factory.setUser("aig");
		factory.setPassword("password");
		HelloWorldClient basic = null;
		try {
			basic = (HelloWorldClient) factory.create(HelloWorldClient.class,
					url);
		} catch (MalformedURLException e) {
			e.printStackTrace();
		}
		String outString = basic.sayHello("论衡!");
		System.out.println(outString);
		System.out.println(basic.queryBalanceInfo("BJLK1000000000935"));
		System.out.println(new Date());
		List outList = basic.queryBalanceInfoLimitRownum(new Integer(23000));
		System.out.println(new Date());
		System.out.println(outList.size());
	}
}