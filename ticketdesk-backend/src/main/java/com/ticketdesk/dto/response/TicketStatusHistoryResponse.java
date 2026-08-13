package com.ticketdesk.dto.response;

import com.ticketdesk.enums.TicketStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketStatusHistoryResponse {

    private Long id;
    private TicketStatus status;
    private UserSummaryResponse changedBy;
    private LocalDateTime createdAt;
}
