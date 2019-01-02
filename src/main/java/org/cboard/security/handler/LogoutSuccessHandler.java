package org.cboard.security.handler;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;


public class LogoutSuccessHandler extends SimpleUrlLogoutSuccessHandler{

	private static final Logger logger = LoggerFactory.getLogger(LogoutSuccessHandler.class);
	
	@Override
	public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
			throws IOException, ServletException {

		// TODO Auto-generated method stub
		logger.info("onLogoutSuccess: {}", request);
		super.onLogoutSuccess(request, response, authentication);
	}
}
