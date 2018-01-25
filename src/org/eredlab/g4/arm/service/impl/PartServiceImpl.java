package org.eredlab.g4.arm.service.impl;

import java.util.List;
import org.eredlab.g4.arm.service.PartService;
import org.eredlab.g4.arm.util.idgenerator.IDHelper;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.util.G4Constants;
import org.eredlab.g4.ccl.util.G4Utils;

public class PartServiceImpl extends BaseServiceImpl implements PartService {
	public Dto saveDirtyDatas(Dto pDto) {
		Dto outDto = new BaseDto();
		List list = pDto.getDefaultAList();
		if (!checkUniqueIndex(list)) {
			outDto.setSuccess(G4Constants.FALSE);
			return outDto;
		}
		for (int i = 0; i < list.size(); i++) {
			Dto dto = (BaseDto) list.get(i);
			if (dto.getAsString("remark").equals("null")) {
				dto.put("remark", "");
			}
			if (dto.getAsString("dirtytype").equalsIgnoreCase("1")) {
				dto.put("partid", IDHelper.getPartID());
				this.g4Dao.insert("Part.savePartItem", dto);
			} else {
				this.g4Dao.update("Part.updatePartItem", dto);
			}
		}
		outDto.setSuccess(G4Constants.TRUE);
		return outDto;
	}

	private boolean checkUniqueIndex(List pList) {
		return true;
	}

	public Dto deleteItem(Dto pDto) {
		this.g4Dao.delete("Part.deletePartItem", pDto);
		this.g4Dao.delete("Part.deletePartUserGrantItem", pDto);
		this.g4Dao.delete("Part.deletePartRoleGrantItem", pDto);
		return null;
	}

	public Dto savePartUserGrantDatas(Dto pDto) {
		List list = pDto.getDefaultAList();
		for (int i = 0; i < list.size(); i++) {
			Dto lDto = (BaseDto) list.get(i);
			if (G4Utils.isEmpty(lDto.getAsString("authorizeid"))) {
				if (!lDto.getAsString("partauthtype").equals("0")) {
					lDto.put("authorizeid", IDHelper
							.getAuthorizeid4Earoleauthorize());
					this.g4Dao.insert("Part.insertEausermenupartItem", lDto);
				}
			} else if (lDto.getAsString("partauthtype").equals("0"))
				this.g4Dao.delete("Part.deleteEausermenupartItem", lDto);
			else {
				this.g4Dao.update("Part.updateEausermenupartItem", lDto);
			}
		}

		return null;
	}

	public Dto savePartRoleGrantDatas(Dto pDto) {
		List list = pDto.getDefaultAList();
		for (int i = 0; i < list.size(); i++) {
			Dto lDto = (BaseDto) list.get(i);
			if (G4Utils.isEmpty(lDto.getAsString("authorizeid"))) {
				if (!lDto.getAsString("partauthtype").equals("0")) {
					lDto.put("authorizeid", IDHelper
							.getAuthorizeid4Earoleauthorize());
					this.g4Dao.insert("Part.insertEarolemenupartItem", lDto);
				}
			} else if (lDto.getAsString("partauthtype").equals("0"))
				this.g4Dao.delete("Part.deleteEarolemenupartItem", lDto);
			else {
				this.g4Dao.update("Part.updateEarolemenupartItem", lDto);
			}
		}

		return null;
	}
}