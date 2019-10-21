package io.github.dunwu.web.dto;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class BaseResponseDTO<T> {

	private final List<String> messages = new ArrayList<>();

	private Integer code = DEFAULT_RESPONSE_RESULT.SUCCESS.value();

	private T data;

	public BaseResponseDTO() {
	}

	public BaseResponseDTO(T dto) {
		this.data = dto;
	}

	public Integer getCode() {
		return code;
	}

	public void setCode(Integer code) {
		this.code = code;
	}

	public void addError(String error) {
		this.messages.add(error);
	}

	public void addErrors(String[] errors) {
		this.addErrors(Arrays.asList(errors));
	}

	public void addErrors(List<String> errorList) {
		this.messages.addAll(errorList);
	}

	public void removeError(String error) {
		this.messages.remove(error);
	}

	public List<String> getMessages() {
		return messages;
	}

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}

	public enum DEFAULT_RESPONSE_RESULT {

		SUCCESS(0, "[]"), // 成功
		AUTHEN_FAIL(-1, "认证失败"), // 认证失败
		AUTHOR_FAIL(-2, "权限不足"), // 授权不足
		PARAM_CHECK_FAIL(-3, ""), // 参数校验失败,错误信息交由业务逻辑处理
		RESOURCE_NOT_EXIST(-4, "请求资源不存在"), // 请求资源不存在
		SYSTEM_ERROR(-5, "系统错误"),
		DATA_MALFORMAT(-6, "请求参数数据格式不正确"),
		REQMETHOD_ERROR(-7, "请求方法不正确"),
		TYPE_MISMATCH(-8, "请求参数类型不匹配"),
		MISS_REQUEST_PARAM(-9, "请求参数缺失");

		private final Integer value;

		private final String desc;

		DEFAULT_RESPONSE_RESULT(int value, String desc) {
			this.value = value;
			this.desc = desc;
		}

		public int value() {
			return value;
		}

		public String desc() {
			return desc;
		}

	}

}
