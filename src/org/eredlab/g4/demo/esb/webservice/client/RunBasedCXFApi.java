package org.eredlab.g4.demo.esb.webservice.client;

import java.io.PrintStream;
import org.apache.cxf.jaxws.JaxWsProxyFactoryBean;
import org.eredlab.g4.demo.esb.webservice.HelloWorld;

public class RunBasedCXFApi {
	public static void main(String[] args) {
		queryBalanceInfo();
	}

	private static void sayHello() {
		JaxWsProxyFactoryBean j = new JaxWsProxyFactoryBean();
		j.setAddress("http://127.0.0.1:8080/CHJ_G4/esb/webservice/HelloWorld");
		j.setServiceClass(HelloWorld.class);
		HelloWorld hw = (HelloWorld) j.create();
		System.out.println(hw.sayHello("ppp"));
	}

	private static void queryBalanceInfo() {
		JaxWsProxyFactoryBean j = new JaxWsProxyFactoryBean();
		j.setAddress("http://127.0.0.1:8080/CHJ_G4/esb/webservice/HelloWorld");
		j.setServiceClass(HelloWorld.class);
		HelloWorld client = (HelloWorld) j.create();
		String outXmlString = client.queryBalanceInfo("BJLK1000000000935");
		System.out.println(outXmlString);
	}
}