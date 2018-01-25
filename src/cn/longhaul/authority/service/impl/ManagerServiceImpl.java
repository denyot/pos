package cn.longhaul.authority.service.impl;

import cn.longhaul.authority.service.ManagerService;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;

import java.sql.SQLException;
import java.util.List;

public class ManagerServiceImpl extends BaseServiceImpl
        implements ManagerService {
    public void delTcode(Dto dto)
            throws SQLException {
    }


    public List getTcode(Dto dto)
            throws SQLException {
        List list = this.g4Dao.queryForPage("manager.gettcodelist", dto);
        return list;
    }

    public void saveTcode(Dto dto)
            throws SQLException {
    }

    public void updateTcode(Dto dto)
            throws SQLException {
    }

    public int getTcodeCount(Dto dto)
            throws SQLException {
        Integer countInteger = (Integer) this.g4Dao.queryForObject("manager.gettcodeCount", dto);
        return countInteger.intValue();
    }
}