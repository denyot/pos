package org.eredlab.g4.ccl.tplengine.velocity;

public class InitVelocityEngineException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	public InitVelocityEngineException() {
		super("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n初始化eRedG4平台缺省模板引擎失败.\n");
	}

	public InitVelocityEngineException(String msg) {
		super("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n初始化eRedG4平台缺省模板引擎失败\n" + msg);
	}
}