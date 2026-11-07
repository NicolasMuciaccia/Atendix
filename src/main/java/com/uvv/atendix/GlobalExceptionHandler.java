package com.uvv.atendix;

import com.uvv.atendix.util.exception.AuthenticationFailedException;
import com.uvv.atendix.util.exception.BusinessConflictException;
import com.uvv.atendix.util.exception.BusinessException;
import com.uvv.atendix.util.exception.ForbiddenOperationException;
import com.uvv.atendix.util.exception.ResourceNotFoundException;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private static final String VALIDATION_ERROR = "Validação de campos falhou";
    private static final String VALIDATION_MESSAGE = "Um ou mais campos estão inválidos. Verifique a requisição.";
    private static final String INVALID_REQUEST = "Requisição inválida";
    private static final String UNAUTHENTICATED = "Não autenticado";
    private static final String FORBIDDEN = "Acesso negado";
    private static final String NOT_FOUND = "Recurso não encontrado";
    private static final String CONFLICT = "Conflito com o estado atual";
    private static final String CONCURRENT_UPDATE_MESSAGE =
            "O registro foi alterado por outra operação. Recarregue os dados e tente novamente.";
    private static final String BUSINESS_RULE = "Regra de negócio violada";
    private static final String INTERNAL_ERROR = "Erro interno do servidor";
    private static final String INTERNAL_MESSAGE = "Erro inesperado ao processar a requisição.";

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
            HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        Map<String, String> fields = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                fields.putIfAbsent(error.getField(), error.getDefaultMessage()));
        log.warn("{}: {}", VALIDATION_ERROR, fields.keySet());
        return ResponseEntity.status(status).headers(headers)
                .body(errorBody(status, VALIDATION_ERROR, VALIDATION_MESSAGE, fields));
    }

    // Every other Spring MVC exception (malformed JSON, missing parameter, wrong type,
    // unsupported method or media type, unknown route) goes through here.
    @Override
    protected ResponseEntity<Object> handleExceptionInternal(Exception ex, Object body,
            HttpHeaders headers, HttpStatusCode statusCode, WebRequest request) {
        boolean serverError = statusCode.is5xxServerError();
        logByStatus(statusCode, serverError ? INTERNAL_ERROR : INVALID_REQUEST, ex);
        String detail = body instanceof ProblemDetail problem ? problem.getDetail() : INVALID_REQUEST;
        return ResponseEntity.status(statusCode).headers(headers)
                .body(errorBody(statusCode,
                        serverError ? INTERNAL_ERROR : INVALID_REQUEST,
                        serverError ? INTERNAL_MESSAGE : detail,
                        null));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleConstraintViolation(ConstraintViolationException ex) {
        Map<String, String> fields = new LinkedHashMap<>();
        ex.getConstraintViolations().forEach(violation ->
                fields.putIfAbsent(violation.getPropertyPath().toString(), violation.getMessage()));
        log.warn("{}: {}", VALIDATION_ERROR, fields.keySet());
        return respond(HttpStatus.BAD_REQUEST, VALIDATION_ERROR, VALIDATION_MESSAGE, fields);
    }

    @ExceptionHandler(AuthenticationFailedException.class)
    public ResponseEntity<ApiErrorResponse> handleAuthenticationFailed(AuthenticationFailedException ex) {
        return respondWithMessage(HttpStatus.UNAUTHORIZED, UNAUTHENTICATED, ex);
    }

    @ExceptionHandler(ForbiddenOperationException.class)
    public ResponseEntity<ApiErrorResponse> handleForbidden(ForbiddenOperationException ex) {
        return respondWithMessage(HttpStatus.FORBIDDEN, FORBIDDEN, ex);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return respondWithMessage(HttpStatus.NOT_FOUND, NOT_FOUND, ex);
    }

    @ExceptionHandler(BusinessConflictException.class)
    public ResponseEntity<ApiErrorResponse> handleConflict(BusinessConflictException ex) {
        return respondWithMessage(HttpStatus.CONFLICT, CONFLICT, ex);
    }

    @ExceptionHandler(ObjectOptimisticLockingFailureException.class)
    public ResponseEntity<ApiErrorResponse> handleConcurrentUpdate(ObjectOptimisticLockingFailureException ex) {
        logByStatus(HttpStatus.CONFLICT, CONFLICT, ex);
        return respond(HttpStatus.CONFLICT, CONFLICT, CONCURRENT_UPDATE_MESSAGE, null);
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiErrorResponse> handleBusinessRule(BusinessException ex) {
        return respondWithMessage(HttpStatus.UNPROCESSABLE_CONTENT, BUSINESS_RULE, ex);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnexpected(Exception ex) {
        log.error(INTERNAL_ERROR, ex);
        return respond(HttpStatus.INTERNAL_SERVER_ERROR, INTERNAL_ERROR, INTERNAL_MESSAGE, null);
    }

    // Only exceptions created by the service itself get here: we wrote the message, so it can reach the consumer.
    private ResponseEntity<ApiErrorResponse> respondWithMessage(HttpStatus status, String error, Exception ex) {
        logByStatus(status, error, ex);
        return respond(status, error, ex.getMessage(), null);
    }

    private ResponseEntity<ApiErrorResponse> respond(HttpStatusCode status, String error, String message,
            Map<String, String> fields) {
        return ResponseEntity.status(status).body(errorBody(status, error, message, fields));
    }

    private ApiErrorResponse errorBody(HttpStatusCode status, String error, String message,
            Map<String, String> fields) {
        return new ApiErrorResponse(LocalDateTime.now(), status.value(), error, message, fields);
    }

    private void logByStatus(HttpStatusCode status, String error, Exception ex) {
        if (status.is5xxServerError()) {
            log.error(error, ex);
        } else {
            log.warn("{}: {}", error, ex.getMessage());
        }
    }
}
