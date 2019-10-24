package io.github.dunwu.web.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.dunwu.web.dto.BaseResponseDTO;
import io.github.dunwu.web.dto.MenuDTO;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

/**
 * 配合前端请求的 API 接口
 *
 * @author zhangpeng0913
 * @since 2017/8/23.
 */
@Controller
public class ApiController {

	private static Set<MenuDTO> getAll() {
		MenuDTO item0 = new MenuDTO("0", "首页", "home", "Item", "/pages/home");

		MenuDTO subMenu1 = new MenuDTO("1", "业务", "bars", "SubMenu", null);
		MenuDTO item11 = new MenuDTO("11", "Mailbox", "mail", "Item", "/pages/mailbox");
		MenuDTO item12 = new MenuDTO("12", "用户列表", "user", "Item", "/pages/user");
		subMenu1.addChild(item11);
		subMenu1.addChild(item12);

		MenuDTO subMenu2 = new MenuDTO("2", "Others", "coffee", "SubMenu", null);
		MenuDTO itemGroup1 = new MenuDTO("21", "Group1", "windows-o", "ItemGroup", null);
		MenuDTO item22 = new MenuDTO("22", "Group1-1", null, "Item", null);
		MenuDTO divider = new MenuDTO("23", "Divider1", null, "Divider", null);
		MenuDTO itemGroup2 = new MenuDTO("24", "Group2", "apple-o", "ItemGroup", null);
		MenuDTO item25 = new MenuDTO("25", "Group2-1", null, "Item", null);
		itemGroup1.addChild(item22);
		itemGroup2.addChild(item25);
		subMenu2.addChild(itemGroup1);
		subMenu2.addChild(divider);
		subMenu2.addChild(itemGroup2);

		Set<MenuDTO> menus = new TreeSet<MenuDTO>();
		menus.add(item0);
		menus.add(subMenu1);
		menus.add(subMenu2);

		return menus;
	}

	@ResponseBody
	@RequestMapping(value = "/menu", method = RequestMethod.GET)
	public BaseResponseDTO getAll(HttpServletRequest request) throws JsonProcessingException {
		String data = request.getParameter("data");
		BaseResponseDTO baseResponseDTO = new BaseResponseDTO();
		baseResponseDTO.setData(getAll());
		ObjectMapper om = new ObjectMapper();
		System.out.println("ResponseDTO: " + om.writeValueAsString(baseResponseDTO));
		return baseResponseDTO;
	}

	@ResponseBody
	@RequestMapping(value = "/login")
	public BaseResponseDTO login(@RequestBody Map<String, String> map) throws IOException {
		String username = map.get("username");
		String password = map.get("password");
		BaseResponseDTO<Map<String, String>> baseResponseDTO = new BaseResponseDTO();
		if (StringUtils.equals(username, "admin") && StringUtils.equals(password, "123456")) {
			Map<String, String> result = new HashMap<String, String>();
			result.put("name", "admin");
			result.put("role", "ADMIN");
			result.put("uid", "1");
			baseResponseDTO.setData(result);
			System.out.println(baseResponseDTO.toString());
			return baseResponseDTO;
		} else {
			baseResponseDTO.setCode(BaseResponseDTO.DEFAULT_RESPONSE_RESULT.SYSTEM_ERROR.value());
			baseResponseDTO.getMessages().add(BaseResponseDTO.DEFAULT_RESPONSE_RESULT.SYSTEM_ERROR.desc());
			return baseResponseDTO;
		}
	}

	@ResponseBody
	@RequestMapping(value = "/logout", method = RequestMethod.GET)
	public BaseResponseDTO logout(HttpServletRequest request) {
		BaseResponseDTO baseResponseDTO = new BaseResponseDTO();
		return baseResponseDTO;
	}

	@ResponseBody
	@RequestMapping(value = "/my", method = RequestMethod.GET)
	public BaseResponseDTO my(HttpServletRequest request) {
		Map<String, String> map = new HashMap<String, String>();
		map.put("name", "admin");
		map.put("role", "ADMIN");
		map.put("uid", "1");
		BaseResponseDTO baseResponseDTO = new BaseResponseDTO();
		baseResponseDTO.setData(map);
		return baseResponseDTO;
	}

}
