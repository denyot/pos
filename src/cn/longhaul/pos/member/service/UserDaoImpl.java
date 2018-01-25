package cn.longhaul.pos.member.service;

import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import java.util.List;

public class UserDaoImpl extends SqlMapClientDaoSupport implements UserDao{
    /**
     * 查询所有过生日的会员信息
     * @return 简单会员对象(称呼和电话号码)集合
     */
    public List<User> getUserList() {
        return (List<User>)getSqlMapClientTemplate().queryForList("getUserList");
    }

}