package com.ticketdesk.mapper;

import com.ticketdesk.dto.response.AttachmentResponse;
import com.ticketdesk.dto.response.TicketResponse;
import com.ticketdesk.dto.response.TicketStatusHistoryResponse;
import com.ticketdesk.entity.Ticket;
import com.ticketdesk.entity.TicketStatusHistory;
import com.ticketdesk.repository.CommentRepository;
import com.ticketdesk.repository.TicketStatusHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

/**
 * Manual mapper for {@link Ticket} entity.
 */
@Component
@RequiredArgsConstructor
public class TicketMapper {

    private final UserMapper                    userMapper;
    private final AttachmentMapper              attachmentMapper;
    private final CommentRepository             commentRepository;
    private final TicketStatusHistoryRepository statusHistoryRepository;

    public TicketResponse toResponse(final Ticket ticket) {
        if (ticket == null) return null;

        final AttachmentResponse attachmentResp =
                ticket.getAttachment() != null
                        ? attachmentMapper.toResponse(ticket.getAttachment())
                        : null;

        final List<TicketStatusHistory> historyEntities =
                statusHistoryRepository.findByTicketIdOrderByCreatedAtAsc(ticket.getId());

        final List<TicketStatusHistoryResponse> historyResponses = historyEntities != null
                ? historyEntities.stream().map(this::toHistoryResponse).toList()
                : Collections.emptyList();

        return TicketResponse.builder()
                .id(ticket.getId())
                .ticketNumber(ticket.getTicketNumber())
                .title(ticket.getTitle())
                .description(ticket.getDescription())
                .category(ticket.getCategory())
                .priority(ticket.getPriority())
                .status(ticket.getStatus())
                .createdBy(userMapper.toSummaryResponse(ticket.getCreatedBy()))
                .assignedTo(userMapper.toSummaryResponse(ticket.getAssignedTo()))
                .attachment(attachmentResp)
                .statusHistory(historyResponses)
                .commentCount(commentRepository.countByTicketId(ticket.getId()))
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .closedAt(ticket.getClosedAt())
                .build();
    }

    public TicketStatusHistoryResponse toHistoryResponse(final TicketStatusHistory history) {
        if (history == null) return null;
        return TicketStatusHistoryResponse.builder()
                .id(history.getId())
                .status(history.getStatus())
                .changedBy(userMapper.toSummaryResponse(history.getChangedBy()))
                .createdAt(history.getCreatedAt())
                .build();
    }
}
