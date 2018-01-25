package org.eredlab.g4.ccl.exception;

public class G4Exception extends RuntimeException {
	public G4Exception() {
	}

	public G4Exception(String msg) {
		super("\n非常遗憾的通知您,程序发生了异常.\n异常信息如下:\n" + msg);
	}
}