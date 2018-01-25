package org.eredlab.g4.demo.esb.hessian;

import java.util.List;
import org.eredlab.g4.ccl.datastructure.Dto;

public abstract interface HelloWorld {
	public abstract String sayHello(String paramString);

	public abstract Dto queryBalanceInfo(String paramString);

	public abstract List queryBalanceInfoLimitRownum(Integer paramInteger);
}