package cn.longhaul.pos;

import java.util.Iterator;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class Redirect extends BaseAction {
	public ActionForward redirect(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String url = dto.getAsString("url")
//				+ "&~control=2.102"
				+ "&account="
				+ super.getSessionContainer(request).getUserInfo().getAccount()
				+ "&werks="
				+ super.getSessionContainer(request).getUserInfo()
						.getCustomId();
		Iterator it = dto.keySet().iterator();
		for (String key = null; it.hasNext(); key = (String) it.next()) {
			if (G4Utils.isNotEmpty(key) && !key.equals("url")) {
				url = url + "&" + key + "=" + dto.getAsString(key);
			}
		}
		System.out.println(url);
		response.sendRedirect(url);
		
		return mapping.findForward(null);
	}
}