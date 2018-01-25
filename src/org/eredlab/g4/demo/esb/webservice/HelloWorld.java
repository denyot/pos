package org.eredlab.g4.demo.esb.webservice;

import javax.jws.WebService;

@WebService
public abstract interface HelloWorld {
	public abstract String sayHello(String paramString);

	public abstract String queryBalanceInfo(String paramString);
}