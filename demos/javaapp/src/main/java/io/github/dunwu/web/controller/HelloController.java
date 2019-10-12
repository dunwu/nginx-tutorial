package io.github.dunwu.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

/**
 * spring mvc 的第一个程序
 *
 * @author Zhang Peng
 * @since 2016.07.29
 */
@Controller
@RequestMapping(value = "/hello")
public class HelloController {

	/**
	 * <p>
	 * 在本例中，Spring将会将数据传给 hello.jsp
	 * <p>
	 * 访问形式：http://localhost:8080/hello?name=张三
	 */
	@RequestMapping(value = "/name", method = RequestMethod.GET)
	public ModelAndView hello(@RequestParam("name") String name) {
		ModelAndView mav = new ModelAndView();
		mav.addObject("message", "你好，" + name);
		mav.setViewName("hello");
		return mav;
	}

}
