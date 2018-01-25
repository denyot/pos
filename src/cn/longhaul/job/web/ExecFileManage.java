package cn.longhaul.job.web;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.rif.web.BaseAction;

public class ExecFileManage extends BaseAction {
	public ActionForward execFileMangerInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("execfile");
	}

	public ActionForward execmanger(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		System.out.println("files-------" + request.getParameter("files"));
		System.out.println("files1-------" + request.getParameter("files1"));

		StringBuffer cmd = new StringBuffer();
		cmd.append("cmd.exe /c ");
		if (request.getParameter("files") != null) {
			cmd.append(request.getParameter("files"));
		}
		if (request.getParameter("files1") != null) {
			cmd.append(request.getParameter("files1"));
		}
		try {
			Runtime run = Runtime.getRuntime();
			Process p = run.exec(cmd.toString().trim());
			BufferedInputStream in = new BufferedInputStream(p.getInputStream());
			BufferedInputStream err = new BufferedInputStream(p
					.getErrorStream());
			BufferedReader inBr = new BufferedReader(new InputStreamReader(in));
			BufferedReader errBr = new BufferedReader(
					new InputStreamReader(err));
			String lineStr;
			while ((lineStr = errBr.readLine()) != null) {
				// String lineStr;
				System.out.println(lineStr);
			}
			while ((lineStr = inBr.readLine()) != null)
				System.out.println(lineStr);
			try {
				if (p.waitFor() != 0)
					if (p.exitValue() == 1) {
						System.err.println("命令执行失败!");
						setErrTipMsg("失败", response);
					} else {
						setOkTipMsg("成功", response);
					}
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return mapping.findForward(null);
	}
}