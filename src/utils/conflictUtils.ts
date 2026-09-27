import { EventItem } from '../types/event';

export interface ScheduleConflict {
  hasConflict: boolean;
  conflictingEventTitle?: string;
  conflictingEventDate?: string;
  conflictingEventTime?: string;
  conflictingRole?: string;
}

/**
 * Checks whether a given staff member is already assigned to another event on the specified date.
 */
export function checkStaffConflict(
  staffId: string,
  eventDate: string,
  events: EventItem[],
  currentEventId?: string
): ScheduleConflict {
  if (!staffId || !eventDate) return { hasConflict: false };

  for (const ev of events) {
    if (currentEventId && ev.id === currentEventId) continue;
    if (ev.status === 'CANCELLED') continue;

    // Check date match (single day or multi-day span)
    const isSameDate = ev.startDate === eventDate || 
      (ev.startDate && ev.endDate && eventDate >= ev.startDate && eventDate <= ev.endDate);

    if (isSameDate) {
      // Check assignments
      const foundInAssignments = ev.assignments?.find(a => a.userId === staffId);
      if (foundInAssignments) {
        return {
          hasConflict: true,
          conflictingEventTitle: ev.title,
          conflictingEventDate: ev.startDate,
          conflictingEventTime: `${ev.startTime} - ${ev.endTime}`,
          conflictingRole: foundInAssignments.roleOnDay || 'Collaborateur'
        };
      }

      // Check hostesses
      const foundInHostesses = ev.hostesses?.find(h => h.staffId === staffId);
      if (foundInHostesses) {
        return {
          hasConflict: true,
          conflictingEventTitle: ev.title,
          conflictingEventDate: ev.startDate,
          conflictingEventTime: `${ev.startTime} - ${ev.endTime}`,
          conflictingRole: foundInHostesses.assignedPost || 'Hôtesse'
        };
      }

      // Check caterer servers
      const foundInServers = ev.catererServers?.find(s => s.staffId === staffId);
      if (foundInServers) {
        return {
          hasConflict: true,
          conflictingEventTitle: ev.title,
          conflictingEventDate: ev.startDate,
          conflictingEventTime: `${ev.startTime} - ${ev.endTime}`,
          conflictingRole: foundInServers.role || 'Service traiteur'
        };
      }
    }
  }

  return { hasConflict: false };
}

export interface OverlapReport {
  date: string;
  events: EventItem[];
  staffConflicts: {
    staffId: string;
    staffName: string;
    eventTitles: string[];
  }[];
}

/**
 * Scans all active events to detect date overlaps and shared staff scheduling conflicts.
 */
export function detectAllOverlapsAndConflicts(events: EventItem[]): OverlapReport[] {
  const activeEvents = events.filter(e => e.status !== 'CANCELLED');
  const dateMap = new Map<string, EventItem[]>();

  // Map each event to its active dates
  for (const ev of activeEvents) {
    const start = ev.startDate;
    const end = ev.endDate || ev.startDate;
    
    // Add start date
    if (start) {
      if (!dateMap.has(start)) dateMap.set(start, []);
      if (!dateMap.get(start)!.some(e => e.id === ev.id)) {
        dateMap.get(start)!.push(ev);
      }
    }
    // If multi-day, also map end date
    if (end && end !== start) {
      if (!dateMap.has(end)) dateMap.set(end, []);
      if (!dateMap.get(end)!.some(e => e.id === ev.id)) {
        dateMap.get(end)!.push(ev);
      }
    }
  }

  const reports: OverlapReport[] = [];

  for (const [date, evts] of dateMap.entries()) {
    if (evts.length > 1) {
      // Multiple events on the same date: check if any staff member is assigned to more than one
      const staffMap = new Map<string, { staffName: string; eventTitles: string[] }>();

      for (const ev of evts) {
        // Collect from assignments
        ev.assignments?.forEach(a => {
          if (a.userId) {
            if (!staffMap.has(a.userId)) {
              staffMap.set(a.userId, { staffName: a.userId, eventTitles: [] });
            }
            staffMap.get(a.userId)!.eventTitles.push(ev.title);
          }
        });

        // Collect from hostesses
        ev.hostesses?.forEach(h => {
          if (h.staffId) {
            if (!staffMap.has(h.staffId)) {
              staffMap.set(h.staffId, { staffName: h.fullName, eventTitles: [] });
            }
            if (!staffMap.get(h.staffId)!.eventTitles.includes(ev.title)) {
              staffMap.get(h.staffId)!.eventTitles.push(ev.title);
            }
          }
        });

        // Collect from catererServers
        ev.catererServers?.forEach(s => {
          if (s.staffId) {
            if (!staffMap.has(s.staffId)) {
              staffMap.set(s.staffId, { staffName: s.fullName, eventTitles: [] });
            }
            if (!staffMap.get(s.staffId)!.eventTitles.includes(ev.title)) {
              staffMap.get(s.staffId)!.eventTitles.push(ev.title);
            }
          }
        });
      }

      const staffConflicts = Array.from(staffMap.entries())
        .filter(([_, data]) => data.eventTitles.length > 1)
        .map(([staffId, data]) => ({
          staffId,
          staffName: data.staffName,
          eventTitles: data.eventTitles
        }));

      reports.push({
        date,
        events: evts,
        staffConflicts
      });
    }
  }

  return reports.sort((a, b) => a.date.localeCompare(b.date));
}
