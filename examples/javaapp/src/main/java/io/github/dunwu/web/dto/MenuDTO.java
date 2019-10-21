package io.github.dunwu.web.dto;

import org.apache.commons.lang3.builder.CompareToBuilder;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.util.Arrays;
import java.util.Set;
import java.util.TreeSet;

public class MenuDTO implements Cloneable, Comparable<MenuDTO> {

	private final Set<MenuDTO> children = new TreeSet<MenuDTO>();

	private String key;

	private String title;

	private String icon;

	private String type;

	private String url;

	public MenuDTO() {
	}

	public MenuDTO(String key, String title, String icon, String type, String url) {
		this.key = key;
		this.title = title;
		this.icon = icon;
		this.type = type;
		this.url = url;
	}

	public MenuDTO clone() throws CloneNotSupportedException {
		super.clone();
		MenuDTO menuDTO = new MenuDTO();
		menuDTO.setType(type);
		menuDTO.setKey(key);
		menuDTO.setTitle(title);
		menuDTO.setIcon(icon);
		menuDTO.setUrl(url);
		menuDTO.setUrl(url);
		return menuDTO;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Set<MenuDTO> getChildren() {
		return children;
	}

	public void addChild(MenuDTO child) {
		this.children.add(child);
	}

	public void addChildren(Set<MenuDTO> children) {
		this.children.addAll(children);
	}

	public void addChildren(MenuDTO[] children) {
		this.children.addAll(Arrays.asList(children));
	}

	@Override
	public boolean equals(Object obj) {
		boolean equals = false;
		if (obj instanceof MenuDTO) {
			MenuDTO menuDTO = (MenuDTO) obj;
			equals = (new EqualsBuilder().append(url, menuDTO.getUrl())).isEquals();
		}
		return equals;
	}

	@Override
	public int hashCode() {
		return new HashCodeBuilder(17, 37).append(url).toHashCode();
	}

	@Override
	public int compareTo(MenuDTO otherMenuDTO) {
		return new CompareToBuilder().append(key, otherMenuDTO.getKey())
									 .append(url, otherMenuDTO.getUrl())
									 .toComparison();
	}

}
