package ch.cevi.db.adapter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Caps the request body (NFR-022). Spring Boot applies no default limit to JSON bodies, so without
 * this a handful of large requests could tie up the 20 available worker threads and the heap.
 */
@Component
class RequestSizeLimitFilter extends OncePerRequestFilter {
    static final int MAX_BODY_BYTES = 16 * 1024;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        long contentLength = request.getContentLengthLong();

        if (contentLength > MAX_BODY_BYTES) {
            response.sendError(HttpServletResponse.SC_REQUEST_ENTITY_TOO_LARGE,
                    "Request body must not exceed " + MAX_BODY_BYTES + " bytes");
            return;
        }
        // A body of unknown length (chunked) cannot be checked upfront. The API needs no streaming
        // uploads, so requiring a declared length is the simpler and tighter option.
        if (contentLength < 0 && hasBody(request)) {
            response.sendError(HttpServletResponse.SC_LENGTH_REQUIRED, "Content-Length is required");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private static boolean hasBody(HttpServletRequest request) {
        return request.getHeader("Transfer-Encoding") != null;
    }
}
