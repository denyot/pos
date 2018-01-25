package cn.longhaul.ordersystem.service;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;

public class OrderConfigerServiceImpl extends BaseServiceImpl
        implements OrderConfigerService {
    public boolean saveconfiger(Dto configer)
            throws Exception {
        if (this.g4Dao.update("ordersystemaig.updateuserconfiger", configer) != 1) {
            this.g4Dao.insert("ordersystemaig.saveuserconfiger", configer);
        }
        return true;
    }
}