package org.cboard.dao;

import org.apache.ibatis.annotations.Param;
import org.cboard.dto.User;
import org.cboard.pojo.DashboardUser;
import org.cboard.pojo.DashboardUserRole;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by yfyuan on 2016/12/2.
 */
@Repository
public interface UserDao {
	int save(DashboardUser user);

    int deleteUserById(String userId);

    List<DashboardUser> getUserList();

    int update(DashboardUser user);

    int saveUserRole(List<DashboardUserRole> list);

    int deleteUserRole(Map<String, Object> param);

    List<DashboardUserRole> getUserRoleList();

    DashboardUser getUserByLoginName(String loginName);

    int saveNewUser(String userId, String user_name, String loginName);

    int updateUserPassword(String userId, String passowrd, String newPassword);

    int deleteUserRoleByRoleId(String roleId);

    int deleteUserRoles(Map<String, Object> param);
    
    /**
     * Author: Jeremy Kim
     * Date: 2018.08.21
     * 
     * - 기존에 만들어둔 role 기본값 생성 숨기기
     * - customUserDao에 있던 getUser userDao로 옮김
     */
    void addUserDefaultRole(@Param("param") User user);
	
    User getUser(@Param("param") User param);

    ArrayList<Long> getResTypeList(@Param("roleId") String roleId);

	void updateLoginCnt(@Param("param") User user);

	void updatePwd(@Param("param") User user);
    
	void register(@Param("param") User user);
}
