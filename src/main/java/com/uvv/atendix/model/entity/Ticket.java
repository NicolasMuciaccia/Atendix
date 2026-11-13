package com.uvv.atendix.model.entity;

import com.uvv.atendix.model.dto.TicketDetails;
import com.uvv.atendix.model.enums.TicketStatus;
import com.uvv.atendix.util.exception.BusinessConflictException;
import com.uvv.atendix.util.exception.BusinessException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "tickets")
public class Ticket extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "requester_id", nullable = false, updatable = false)
    private User requester;

    // Sector and asset tag come from the item, so the three can never disagree
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Column(name = "request_date", nullable = false)
    private LocalDate requestDate;

    @Column(name = "problem_description", length = ColumnLengths.PROBLEM_DESCRIPTION, nullable = false)
    private String problemDescription;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = ColumnLengths.ENUM, nullable = false)
    private TicketStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "started_by_id")
    private User startedBy;

    @Column(name = "started_at")
    private Instant startedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "finished_by_id")
    private User finishedBy;

    @Column(name = "finished_at")
    private Instant finishedAt;

    protected Ticket() {
        // required by JPA; callers use the open(...) factory
    }

    public static Ticket open(User requester, Item item, TicketDetails details) {
        if (requester == null) {
            throw new BusinessException("O solicitante do chamado é obrigatório");
        }
        if (item == null) {
            throw new BusinessException("O item do chamado é obrigatório");
        }
        if (details == null) {
            throw new BusinessException("Os dados do chamado são obrigatórios");
        }

        Ticket ticket = new Ticket();
        ticket.requester = requester;
        ticket.item = item;
        ticket.requestDate = details.requestDate();
        ticket.problemDescription = details.problemDescription();
        ticket.status = TicketStatus.OPEN;
        return ticket;
    }

    public void startHandling(User handler, Instant at) {
        moveTo(TicketStatus.IN_PROGRESS, handler, at);
        startedBy = handler;
        startedAt = at;
    }

    public void finish(User handler, Instant at) {
        moveTo(TicketStatus.FINISHED, handler, at);
        finishedBy = handler;
        finishedAt = at;
    }

    private void moveTo(TicketStatus target, User handler, Instant at) {
        if (handler == null || at == null) {
            throw new BusinessException("O responsável e o momento da tratativa são obrigatórios");
        }
        if (!status.canTransitionTo(target)) {
            throw new BusinessConflictException("Não é possível alterar o chamado " + getId() + " de " + status
                    + " para " + target + ". O atendimento precisa ser iniciado antes de ser finalizado.");
        }
        status = target;
    }

    public void ensureCancelable() {
        if (!isCancelable()) {
            throw new BusinessConflictException("O chamado " + getId()
                    + " não pode ser cancelado porque já possui tratativa iniciada (status " + status + ")");
        }
    }

    public boolean isCancelable() {
        return status == TicketStatus.OPEN;
    }

    public boolean isRequestedBy(UUID userId) {
        return requester.getId().equals(userId);
    }

    public User getRequester() {
        return requester;
    }

    public Item getItem() {
        return item;
    }

    public LocalDate getRequestDate() {
        return requestDate;
    }

    public String getProblemDescription() {
        return problemDescription;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public User getStartedBy() {
        return startedBy;
    }

    public Instant getStartedAt() {
        return startedAt;
    }

    public User getFinishedBy() {
        return finishedBy;
    }

    public Instant getFinishedAt() {
        return finishedAt;
    }
}
