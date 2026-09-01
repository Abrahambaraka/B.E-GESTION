import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserStaff, Equipment, EventItem, Assignment, EventEquipment, Role, CheckInStatus } from '../types/event';
import { INITIAL_STAFF, INITIAL_EQUIPMENT, INITIAL_EVENTS } from '../data/initialData';

interface EventContextType {
  staffList: UserStaff[];
  equipmentList: Equipment[];
  events: EventItem[];
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  selectedEventId: string | null;
  setSelectedEventId: (id: string | null) => void;
  
  // Staff operations
  addStaff: (staff: Omit<UserStaff, 'id' | 'createdAt'>) => void;
  updateStaff: (id: string, updates: Partial<UserStaff>) => void;
  deleteStaff: (id: string) => void;
  
  // Equipment operations
  addEquipment: (equipment: Omit<Equipment, 'id'>) => void;
  updateEquipment: (id: string, updates: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  
  // Event operations
  addEvent: (event: Omit<EventItem, 'id' | 'createdAt' | 'assignments' | 'bookedItems'>) => void;
  updateEvent: (id: string, updates: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  
  // Assignment & Check-in operations
  assignStaffToEvent: (eventId: string, userId: string, roleOnDay: string, briefingNotes?: string, assignedUniformId?: string) => void;
  removeStaffAssignment: (eventId: string, assignmentId: string) => void;
  updateCheckIn: (eventId: string, assignmentId: string, status: CheckInStatus, checkInTime?: string, signature?: string) => void;
  
  // Equipment Booking operations
  bookEquipmentForEvent: (eventId: string, equipmentId: string, quantity: number) => { success: boolean; message?: string };
  removeEquipmentBooking: (eventId: string, bookingId: string) => void;
  updateBookingStatus: (eventId: string, bookingId: string, status: 'RESERVED' | 'DISPATCHED' | 'RETURNED' | 'CHECKED') => void;

  // Reset to seed demo data
  resetDemoData: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STAFF: 'blessing_event_staff_v1',
  EQUIPMENT: 'blessing_event_equipment_v1',
  EVENTS: 'blessing_event_events_v1',
  ROLE: 'blessing_event_role_v1',
};

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [staffList, setStaffList] = useState<UserStaff[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
      return saved ? JSON.parse(saved) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  const [equipmentList, setEquipmentList] = useState<Equipment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EQUIPMENT);
      return saved ? JSON.parse(saved) : INITIAL_EQUIPMENT;
    } catch {
      return INITIAL_EQUIPMENT;
    }
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [currentRole, setCurrentRole] = useState<Role>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
      return (saved as Role) || 'ADMIN';
    } catch {
      return 'ADMIN';
    }
  });

  const [selectedEventId, setSelectedEventId] = useState<string | null>('evt-101');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staffList));
    } catch (e) {
      console.error(e);
    }
  }, [staffList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(equipmentList));
    } catch (e) {
      console.error(e);
    }
  }, [equipmentList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    } catch (e) {
      console.error(e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
    } catch (e) {
      console.error(e);
    }
  }, [currentRole]);

  // Recalculate available quantities on equipment when bookings change
  const recalculateAvailableStock = (currentEquip: Equipment[], currentEvents: EventItem[]): Equipment[] => {
    return currentEquip.map((eq) => {
      // Calculate total booked in active or planned events
      const totalBooked = currentEvents
        .filter((ev) => ev.status !== 'COMPLETED' && ev.status !== 'CANCELLED')
        .reduce((sum, ev) => {
          const booked = ev.bookedItems.find((b) => b.equipmentId === eq.id && b.status !== 'RETURNED');
          return sum + (booked ? booked.quantity : 0);
        }, 0);
      
      const available = Math.max(0, eq.totalQty - totalBooked);
      return { ...eq, availableQty: available };
    });
  };

  const addStaff = (newStaffData: Omit<UserStaff, 'id' | 'createdAt'>) => {
    const newStaff: UserStaff = {
      ...newStaffData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setStaffList((prev) => [newStaff, ...prev]);
  };

  const updateStaff = (id: string, updates: Partial<UserStaff>) => {
    setStaffList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteStaff = (id: string) => {
    setStaffList((prev) => prev.filter((item) => item.id !== id));
    // Also remove from any event assignments
    setEvents((prev) =>
      prev.map((ev) => ({
        ...ev,
        assignments: ev.assignments.filter((asg) => asg.userId !== id),
      }))
    );
  };

  const addEquipment = (equipData: Omit<Equipment, 'id'>) => {
    const newEquip: Equipment = {
      ...equipData,
      id: `eq-${Date.now()}`,
    };
    setEquipmentList((prev) => [newEquip, ...prev]);
  };

  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    setEquipmentList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteEquipment = (id: string) => {
    setEquipmentList((prev) => prev.filter((item) => item.id !== id));
    setEvents((prev) =>
      prev.map((ev) => ({
        ...ev,
        bookedItems: ev.bookedItems.filter((b) => b.equipmentId !== id),
      }))
    );
  };

  const addEvent = (eventData: Omit<EventItem, 'id' | 'createdAt' | 'assignments' | 'bookedItems'>) => {
    const newEvt: EventItem = {
      ...eventData,
      id: `evt-${Date.now()}`,
      assignments: [],
      bookedItems: [],
      createdAt: new Date().toISOString(),
    };
    setEvents((prev) => [newEvt, ...prev]);
    setSelectedEventId(newEvt.id);
  };

  const updateEvent = (id: string, updates: Partial<EventItem>) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, ...updates } : ev))
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
    if (selectedEventId === id) {
      setSelectedEventId(null);
    }
  };

  const assignStaffToEvent = (
    eventId: string,
    userId: string,
    roleOnDay: string,
    briefingNotes?: string,
    assignedUniformId?: string
  ) => {
    const targetEvent = events.find((e) => e.id === eventId);
    if (!targetEvent) return;

    // Check if staff is already assigned
    const alreadyAssigned = targetEvent.assignments.some((a) => a.userId === userId);
    if (alreadyAssigned) return;

    const newAssignment: Assignment = {
      id: `asg-${Date.now()}`,
      userId,
      eventId,
      roleOnDay,
      briefingNotes,
      assignedUniformId,
      uniformStatus: assignedUniformId ? 'ASSIGNED' : 'PENDING',
      checkInStatus: 'PENDING',
      shiftStart: targetEvent.startTime,
      shiftEnd: targetEvent.endTime,
    };

    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === eventId
          ? { ...ev, assignments: [...ev.assignments, newAssignment] }
          : ev
      )
    );

    // Update staff status to ASSIGNED
    updateStaff(userId, { status: 'ASSIGNED' });
  };

  const removeStaffAssignment = (eventId: string, assignmentId: string) => {
    const event = events.find((e) => e.id === eventId);
    const assignment = event?.assignments.find((a) => a.id === assignmentId);

    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === eventId
          ? {
              ...ev,
              assignments: ev.assignments.filter((a) => a.id !== assignmentId),
            }
          : ev
      )
    );

    if (assignment) {
      // Check if staff has other assignments
      const hasOther = events.some(
        (ev) =>
          ev.id !== eventId &&
          ev.assignments.some((a) => a.userId === assignment.userId)
      );
      if (!hasOther) {
        updateStaff(assignment.userId, { status: 'AVAILABLE' });
      }
    }
  };

  const updateCheckIn = (
    eventId: string,
    assignmentId: string,
    status: CheckInStatus,
    checkInTime?: string,
    signature?: string
  ) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        return {
          ...ev,
          assignments: ev.assignments.map((asg) => {
            if (asg.id !== assignmentId) return asg;
            const now = new Date();
            const timeStr = checkInTime || `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            return {
              ...asg,
              checkInStatus: status,
              checkInTime: status === 'PENDING' ? undefined : (asg.checkInTime || timeStr),
              signature: signature !== undefined ? signature : asg.signature,
            };
          }),
        };
      })
    );
  };

  const bookEquipmentForEvent = (
    eventId: string,
    equipmentId: string,
    quantity: number
  ): { success: boolean; message?: string } => {
    const equip = equipmentList.find((e) => e.id === equipmentId);
    if (!equip) return { success: false, message: 'Matériel introuvable' };

    const targetEvent = events.find((e) => e.id === eventId);
    if (!targetEvent) return { success: false, message: 'Événement introuvable' };

    const existingBooking = targetEvent.bookedItems.find(
      (b) => b.equipmentId === equipmentId
    );

    const deltaNeeded = existingBooking ? quantity - existingBooking.quantity : quantity;

    if (equip.availableQty < deltaNeeded) {
      return {
        success: false,
        message: `Stock insuffisant : Seulement ${equip.availableQty} ${equip.unit} disponible(s) pour ${equip.name}`,
      };
    }

    setEvents((prev) => {
      const updatedEvents = prev.map((ev) => {
        if (ev.id !== eventId) return ev;

        let updatedBookings: EventEquipment[];
        if (existingBooking) {
          updatedBookings = ev.bookedItems.map((b) =>
            b.equipmentId === equipmentId ? { ...b, quantity } : b
          );
        } else {
          updatedBookings = [
            ...ev.bookedItems,
            {
              id: `be-${Date.now()}`,
              eventId,
              equipmentId,
              quantity,
              status: 'RESERVED',
            },
          ];
        }
        return { ...ev, bookedItems: updatedBookings };
      });

      // Update equipment availability
      setEquipmentList((prevEquip) => recalculateAvailableStock(prevEquip, updatedEvents));
      return updatedEvents;
    });

    return { success: true };
  };

  const removeEquipmentBooking = (eventId: string, bookingId: string) => {
    setEvents((prev) => {
      const updated = prev.map((ev) =>
        ev.id === eventId
          ? {
              ...ev,
              bookedItems: ev.bookedItems.filter((b) => b.id !== bookingId),
            }
          : ev
      );
      setEquipmentList((prevEquip) => recalculateAvailableStock(prevEquip, updated));
      return updated;
    });
  };

  const updateBookingStatus = (
    eventId: string,
    bookingId: string,
    status: 'RESERVED' | 'DISPATCHED' | 'RETURNED' | 'CHECKED'
  ) => {
    setEvents((prev) => {
      const updated = prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        return {
          ...ev,
          bookedItems: ev.bookedItems.map((b) =>
            b.id === bookingId ? { ...b, status } : b
          ),
        };
      });
      setEquipmentList((prevEquip) => recalculateAvailableStock(prevEquip, updated));
      return updated;
    });
  };

  const resetDemoData = () => {
    setStaffList(INITIAL_STAFF);
    setEquipmentList(INITIAL_EQUIPMENT);
    setEvents(INITIAL_EVENTS);
    setCurrentRole('ADMIN');
    setSelectedEventId('evt-101');
    localStorage.removeItem(STORAGE_KEYS.STAFF);
    localStorage.removeItem(STORAGE_KEYS.EQUIPMENT);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
  };

  return (
    <EventContext.Provider
      value={{
        staffList,
        equipmentList,
        events,
        currentRole,
        setCurrentRole,
        selectedEventId,
        setSelectedEventId,
        addStaff,
        updateStaff,
        deleteStaff,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        addEvent,
        updateEvent,
        deleteEvent,
        assignStaffToEvent,
        removeStaffAssignment,
        updateCheckIn,
        bookEquipmentForEvent,
        removeEquipmentBooking,
        updateBookingStatus,
        resetDemoData,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};
